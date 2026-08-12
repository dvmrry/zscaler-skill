#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""Validate reference source pins and exact changed capture paths without fetching."""

from __future__ import annotations

import argparse
import configparser
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

import yaml
from yaml.nodes import MappingNode, ScalarNode, SequenceNode

SHA_VALUE_RE = re.compile(r"^([0-9a-f]{40})(?:\s+\([^()\r\n]+\))?$", re.IGNORECASE)
SAFE_SEGMENT_RE = re.compile(r"^[A-Za-z0-9._-]+$")
DESCRIPTIVE_SOURCE_SUFFIX_RE = re.compile(r"\s+\([^/\r\n]+\)$")
# These two committed capture trees are provenance roots but not submodules.
# Keep the contract explicit so an arbitrary vendor file cannot become a valid
# pin target merely because it exists in a checkout.
TRACKED_PROVENANCE_ROOTS = frozenset(
    {
        "vendor/zscaler-api-specs",
        "vendor/zscaler-help",
    }
)


@dataclass(frozen=True)
class Pin:
    file: str
    line: int
    vendor_path: str
    sha: str


@dataclass(frozen=True)
class SourcePath:
    file: str
    line: int
    vendor_path: str
    provenance_root: str


@dataclass
class ValidationResult:
    errors: list[str]
    entry_count: int
    object_check_count: int
    initialized_submodules: list[str]
    skipped_submodules: list[str]


@dataclass
class SourcePathValidationResult:
    errors: list[str]
    changed_file_count: int
    checked_path_count: int
    excluded_entry_count: int


@dataclass(frozen=True)
class ReferenceSnapshot:
    label: str
    text: str


def safe_vendor_path(value: str) -> bool:
    if "\\" in value or "//" in value:
        return False
    parts = value.split("/")
    return (
        len(parts) >= 2
        and parts[0] == "vendor"
        and all(part not in {"", ".", ".."} and SAFE_SEGMENT_RE.fullmatch(part) for part in parts[1:])
    )


def safe_exact_source_path(value: str, provenance_root: str) -> bool:
    if not value.startswith(f"{provenance_root}/") or value.endswith("/"):
        return False
    if "\\" in value or "//" in value or any(character in value for character in "\r\n\0"):
        return False
    if any(character in value for character in "*?["):
        return False
    if DESCRIPTIVE_SOURCE_SUFFIX_RE.search(value):
        return False
    return all(part not in {"", ".", ".."} for part in value.split("/"))


def frontmatter_node_from_text(
    text: str,
    relative_file: str,
    errors: list[str],
) -> MappingNode | None:
    lines = text.splitlines()
    if not lines or lines[0] != "---":
        return None
    try:
        closing_index = lines.index("---", 1)
    except ValueError:
        errors.append(f"{relative_file}:1: frontmatter has no closing delimiter")
        return None

    content = "\n".join(lines[1:closing_index])
    try:
        node = yaml.compose(content, Loader=yaml.SafeLoader)
    except yaml.YAMLError as error:
        mark = getattr(error, "problem_mark", None)
        line = mark.line + 2 if mark else 1
        problem = getattr(error, "problem", None) or str(error).splitlines()[0]
        errors.append(f"{relative_file}:{line}: invalid YAML frontmatter: {problem}")
        return None
    if node is None:
        return None
    if not isinstance(node, MappingNode):
        errors.append(f"{relative_file}:2: frontmatter must be a mapping")
        return None
    return node


def frontmatter_node(file: Path, relative_file: str, errors: list[str]) -> MappingNode | None:
    return frontmatter_node_from_text(file.read_text(encoding="utf-8"), relative_file, errors)


def extract_pins_from_text(
    text: str,
    relative_file: str,
    errors: list[str],
) -> tuple[list[Pin], int]:
    root_node = frontmatter_node_from_text(text, relative_file, errors)
    if root_node is None:
        return [], 0

    pins: list[Pin] = []
    entry_count = 0
    verified_fields: list[tuple[ScalarNode, object]] = []
    for key_node, value_node in root_node.value:
        if isinstance(key_node, ScalarNode) and key_node.value == "verified-against":
            verified_fields.append((key_node, value_node))

    if len(verified_fields) > 1:
        first_line = verified_fields[0][0].start_mark.line + 2
        for key_node, _ in verified_fields[1:]:
            line = key_node.start_mark.line + 2
            errors.append(
                f"{relative_file}:{line}: duplicate top-level verified-against field "
                f"(first declared at line {first_line})"
            )

    for key_node, value_node in verified_fields:
        field_line = key_node.start_mark.line + 2
        if not isinstance(value_node, MappingNode):
            errors.append(f"{relative_file}:{field_line}: verified-against must be a mapping")
            continue

        seen_paths: dict[str, int] = {}
        for path_node, sha_node in value_node.value:
            entry_count += 1
            line = path_node.start_mark.line + 2
            if isinstance(path_node, ScalarNode):
                first_line = seen_paths.get(path_node.value)
                if first_line is not None:
                    errors.append(
                        f"{relative_file}:{line}: duplicate verified-against key {path_node.value!r} "
                        f"(first declared at line {first_line})"
                    )
                else:
                    seen_paths[path_node.value] = line
            valid_path = isinstance(path_node, ScalarNode) and safe_vendor_path(path_node.value)
            if not valid_path:
                rendered_path = path_node.value if isinstance(path_node, ScalarNode) else "<non-scalar key>"
                errors.append(
                    f"{relative_file}:{line}: verified-against key {rendered_path!r} must be a safe repository-relative vendor path"
                )
            vendor_path = path_node.value if isinstance(path_node, ScalarNode) else "<invalid path>"
            valid_sha = False
            if not isinstance(sha_node, ScalarNode):
                errors.append(
                    f"{relative_file}:{line}: verified-against {vendor_path} must contain a scalar 40-hex commit SHA"
                )
            else:
                match = SHA_VALUE_RE.fullmatch(sha_node.value)
                if not match:
                    errors.append(
                        f"{relative_file}:{line}: verified-against {vendor_path} must contain a 40-hex commit SHA with only an optional parenthetical label"
                    )
                else:
                    valid_sha = True
            if valid_path and valid_sha:
                pins.append(Pin(relative_file, line, vendor_path, match.group(1).lower()))
    return pins, entry_count


def extract_pins(file: Path, root: Path, errors: list[str]) -> tuple[list[Pin], int]:
    relative_file = file.relative_to(root).as_posix()
    return extract_pins_from_text(file.read_text(encoding="utf-8"), relative_file, errors)


def extract_exact_tracked_sources(
    text: str,
    relative_file: str,
    errors: list[str],
) -> tuple[list[SourcePath], int]:
    root_node = frontmatter_node_from_text(text, relative_file, errors)
    if root_node is None:
        return [], 0

    source_fields: list[tuple[ScalarNode, object]] = []
    for key_node, value_node in root_node.value:
        if isinstance(key_node, ScalarNode) and key_node.value == "sources":
            source_fields.append((key_node, value_node))

    if len(source_fields) > 1:
        first_line = source_fields[0][0].start_mark.line + 2
        for key_node, _ in source_fields[1:]:
            line = key_node.start_mark.line + 2
            errors.append(
                f"{relative_file}:{line}: duplicate top-level sources field "
                f"(first declared at line {first_line})"
            )

    sources: list[SourcePath] = []
    excluded_entry_count = 0
    for key_node, value_node in source_fields:
        field_line = key_node.start_mark.line + 2
        if not isinstance(value_node, SequenceNode):
            errors.append(f"{relative_file}:{field_line}: sources must be a sequence")
            continue
        for source_node in value_node.value:
            if not isinstance(source_node, ScalarNode):
                continue
            value = source_node.value
            provenance_root = next(
                (
                    root
                    for root in sorted(TRACKED_PROVENANCE_ROOTS)
                    if value == root or value.startswith(f"{root}/")
                ),
                None,
            )
            if provenance_root is None:
                continue

            # Only exact repository paths have an unambiguous git-tree
            # predicate. Root sentinels, directory conventions, globs, and
            # descriptive source strings remain outside this check.
            if (
                value == provenance_root
                or not safe_exact_source_path(value, provenance_root)
            ):
                excluded_entry_count += 1
                continue
            sources.append(
                SourcePath(
                    relative_file,
                    source_node.start_mark.line + 2,
                    value,
                    provenance_root,
                )
            )
    return sources, excluded_entry_count


def vendor_submodule_paths(
    root: Path,
    errors: list[str],
    head: str | None = None,
) -> set[str]:
    if head is None:
        gitmodules = root / ".gitmodules"
        if not gitmodules.exists():
            return set()
        content = gitmodules.read_text(encoding="utf-8")
    else:
        result = git(root, "show", f"{head}:.gitmodules")
        if result.returncode != 0:
            return set()
        content = result.stdout
    parser = configparser.ConfigParser(interpolation=None)
    try:
        parser.read_string(content)
    except configparser.Error as error:
        errors.append(f".gitmodules: invalid configuration: {error}")
        return set()
    return {
        parser.get(section, "path")
        for section in parser.sections()
        if section.startswith('submodule "') and parser.has_option(section, "path")
    }


def git(root: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )


def git_paths(root: Path, *args: str) -> tuple[list[str], str | None]:
    result = subprocess.run(
        ["git", *args],
        cwd=root,
        check=False,
        capture_output=True,
    )
    if result.returncode != 0:
        detail = os.fsdecode(result.stderr or result.stdout or b"git path enumeration failed").strip()
        return [], detail
    return [os.fsdecode(value) for value in result.stdout.split(b"\0") if value], None


def diagnostic_path(value: str) -> str:
    return value.replace("\\", "\\\\").replace("\r", "\\r").replace("\n", "\\n")


def changed_reference_files(
    root: Path,
    base: str,
    head: str | None,
    errors: list[str],
) -> list[str]:
    for label, ref in (("base", base), ("head", head)):
        if ref is None:
            continue
        if ref.startswith("-"):
            errors.append(f"--{label} must not begin with '-'")
            return []
        result = git(root, "rev-parse", "--verify", f"{ref}^{{commit}}")
        if result.returncode != 0:
            detail = (result.stderr or result.stdout or "commit did not resolve").strip()
            errors.append(f"--{label} {ref!r} does not resolve to a commit: {detail}")
            return []

    if head is not None:
        diff_commands = [["diff", "--name-only", "--diff-filter=ACMR", "-z", base, head, "--", "references"]]
    else:
        # A staged defect can be canceled by an unstaged correction. Inspect
        # both snapshots instead of letting the worktree hide what a commit
        # would record.
        diff_commands = [
            ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z", base, "--", "references"],
            ["diff", "--name-only", "--diff-filter=ACMR", "-z", base, "--", "references"],
        ]

    files: list[str] = []
    for diff_args in diff_commands:
        paths, detail = git_paths(root, *diff_args)
        if detail is not None:
            errors.append(f"could not enumerate changed references: {detail}")
            return []
        files.extend(paths)

    if head is None:
        untracked, detail = git_paths(
            root,
            "ls-files",
            "--others",
            "--exclude-standard",
            "-z",
            "--",
            "references",
        )
        if detail is not None:
            errors.append(f"could not enumerate untracked references: {detail}")
            return []
        files.extend(untracked)

    return sorted(
        {
            file
            for file in files
            if file.startswith("references/") and file.endswith(".md")
        }
    )


def show_reference(root: Path, object_name: str, relative_file: str) -> str | None:
    result = git(root, "show", f"{object_name}:{relative_file}")
    return result.stdout if result.returncode == 0 else None


def reference_snapshots(
    root: Path,
    base: str,
    head: str | None,
    relative_file: str,
) -> list[ReferenceSnapshot]:
    if head is not None:
        text = show_reference(root, head, relative_file)
        return [ReferenceSnapshot(head, text)] if text is not None else []

    snapshots: list[ReferenceSnapshot] = []
    base_text = show_reference(root, base, relative_file)
    index_text = show_reference(root, "", relative_file)
    if index_text is not None and index_text != base_text:
        snapshots.append(ReferenceSnapshot("index", index_text))
    file = root / relative_file
    if file.is_file():
        worktree_text = file.read_text(encoding="utf-8")
        if worktree_text != base_text and index_text != worktree_text:
            snapshots.append(ReferenceSnapshot("worktree", worktree_text))
    return snapshots


def git_object_type(root: Path, object_name: str) -> str | None:
    result = git(root, "cat-file", "-t", object_name)
    return result.stdout.strip() if result.returncode == 0 else None


def source_location(source: SourcePath, snapshot: ReferenceSnapshot) -> str:
    label = f" [{snapshot.label}]" if snapshot.label in {"index", "worktree"} else ""
    return f"{source.file}:{source.line}{label}"


def pin_location(pin: Pin, snapshot: ReferenceSnapshot) -> str:
    label = f" [{snapshot.label}]" if snapshot.label in {"index", "worktree"} else ""
    return f"{pin.file}:{pin.line}{label}"


def validate_snapshot_source_paths(
    root: Path,
    snapshot: ReferenceSnapshot,
    relative_file: str,
    errors: list[str],
    commit_results: dict[str, bool],
    path_results: dict[tuple[str, str], str | None],
) -> tuple[int, int]:
    parse_errors: list[str] = []
    pins, _ = extract_pins_from_text(snapshot.text, relative_file, parse_errors)
    sources, excluded = extract_exact_tracked_sources(snapshot.text, relative_file, parse_errors)
    errors.extend(parse_errors)
    pins_by_root: dict[str, Pin] = {}
    for pin in pins:
        if pin.vendor_path in TRACKED_PROVENANCE_ROOTS:
            pins_by_root.setdefault(pin.vendor_path, pin)

    checked = 0
    for source in sources:
        checked += 1
        pin = pins_by_root.get(source.provenance_root)
        if pin is None:
            errors.append(
                f"{source_location(source, snapshot)}: exact source path {source.vendor_path} "
                f"requires a verified-against pin for {source.provenance_root}"
            )
            continue
        if pin.sha not in commit_results:
            commit_results[pin.sha] = git_object_type(root, f"{pin.sha}^{{commit}}") == "commit"
        if not commit_results[pin.sha]:
            errors.append(
                f"{pin_location(pin, snapshot)}: recorded pin {pin.sha} for {pin.vendor_path} "
                "does not resolve to a commit in the repository object database"
            )
            continue

        key = (pin.sha, source.vendor_path)
        if key not in path_results:
            path_results[key] = git_object_type(root, f"{pin.sha}:{source.vendor_path}")
        object_type = path_results[key]
        if object_type is None:
            errors.append(
                f"{source_location(source, snapshot)}: source path {source.vendor_path} "
                f"under {source.provenance_root} does not exist at recorded pin {pin.sha} "
                f"(pin declared at line {pin.line})"
            )
        elif object_type != "blob":
            errors.append(
                f"{source_location(source, snapshot)}: exact source path {source.vendor_path} "
                f"is a {object_type}, not a file, at recorded pin {pin.sha} "
                f"(pin declared at line {pin.line})"
            )
    return checked, excluded


def validate_changed_source_paths(
    root: Path,
    base: str,
    head: str | None,
) -> SourcePathValidationResult:
    root = root.resolve()
    errors: list[str] = []
    files = changed_reference_files(root, base, head, errors)
    checked_path_count = 0
    excluded_entry_count = 0
    commit_results: dict[str, bool] = {}
    path_results: dict[tuple[str, str], str | None] = {}

    for relative_file in files:
        snapshots = reference_snapshots(root, base, head, relative_file)
        if not snapshots:
            errors.append(f"{diagnostic_path(relative_file)}: could not read changed reference document")
            continue
        for snapshot in snapshots:
            checked, excluded = validate_snapshot_source_paths(
                root,
                snapshot,
                diagnostic_path(relative_file),
                errors,
                commit_results,
                path_results,
            )
            checked_path_count += checked
            excluded_entry_count += excluded

    return SourcePathValidationResult(
        errors=errors,
        changed_file_count=len(files),
        checked_path_count=checked_path_count,
        excluded_entry_count=excluded_entry_count,
    )


def reference_pin_entries(
    root: Path,
    errors: list[str],
    head: str | None = None,
) -> tuple[list[Pin], int]:
    pins: list[Pin] = []
    entry_count = 0
    if head is None:
        references = root / "references"
        files = sorted(references.rglob("*.md")) if references.exists() else []
        for file in files:
            file_pins, file_entry_count = extract_pins(file, root, errors)
            pins.extend(file_pins)
            entry_count += file_entry_count
        return pins, entry_count

    tree_files, detail = git_paths(
        root,
        "ls-tree",
        "-r",
        "--name-only",
        "-z",
        head,
        "--",
        "references",
    )
    if detail is not None:
        errors.append(f"could not enumerate references at {head}: {detail}")
        return pins, entry_count
    for relative_file in sorted(
        file
        for file in tree_files
        if file.startswith("references/") and file.endswith(".md")
    ):
        text = show_reference(root, head, relative_file)
        if text is None:
            errors.append(
                f"{diagnostic_path(relative_file)}: could not read reference document at {head}"
            )
            continue
        file_pins, file_entry_count = extract_pins_from_text(
            text,
            diagnostic_path(relative_file),
            errors,
        )
        pins.extend(file_pins)
        entry_count += file_entry_count
    return pins, entry_count


def validate(root: Path, head: str | None = None) -> ValidationResult:
    root = root.resolve()
    errors: list[str] = []
    submodule_paths = vendor_submodule_paths(root, errors, head)
    pins, entry_count = reference_pin_entries(root, errors, head)

    safe_pins: list[Pin] = []
    referenced_submodules: set[str] = set()
    for pin in pins:
        if head is None:
            candidate = root / pin.vendor_path
            try:
                candidate.resolve().relative_to(root)
            except ValueError:
                errors.append(
                    f"{pin.file}:{pin.line}: verified-against path {pin.vendor_path} resolves outside the repository"
                )
                continue
        if pin.vendor_path in submodule_paths:
            referenced_submodules.add(pin.vendor_path)
        elif pin.vendor_path in TRACKED_PROVENANCE_ROOTS:
            root_exists = (
                (root / pin.vendor_path).is_dir()
                if head is None
                else git_object_type(root, f"{head}:{pin.vendor_path}") == "tree"
            )
            if not root_exists:
                errors.append(
                    f"{pin.file}:{pin.line}: recognized verified-against root {pin.vendor_path} does not exist as a directory"
                )
                continue
        else:
            containing_root = next(
                (
                    provenance_root
                    for provenance_root in sorted(submodule_paths | TRACKED_PROVENANCE_ROOTS)
                    if pin.vendor_path.startswith(f"{provenance_root}/")
                ),
                None,
            )
            if containing_root:
                errors.append(
                    f"{pin.file}:{pin.line}: verified-against path {pin.vendor_path} must equal the provenance root {containing_root}; descendants and files are not allowed"
                )
            else:
                errors.append(
                    f"{pin.file}:{pin.line}: verified-against path {pin.vendor_path} is not a recognized provenance root"
                )
            continue
        safe_pins.append(pin)

    initialized_submodules = {
        vendor_path
        for vendor_path in referenced_submodules
        if (root / vendor_path / ".git").exists()
    }
    skipped_submodules = referenced_submodules - initialized_submodules

    resolution_results: dict[tuple[str, str], bool] = {}
    for pin in safe_pins:
        if pin.vendor_path not in initialized_submodules:
            continue
        key = (pin.vendor_path, pin.sha)
        if key not in resolution_results:
            result = git(root, "-C", pin.vendor_path, "cat-file", "-e", f"{pin.sha}^{{commit}}")
            resolution_results[key] = result.returncode == 0

    shallow_results: dict[str, bool] = {}
    for pin in safe_pins:
        key = (pin.vendor_path, pin.sha)
        if pin.vendor_path not in initialized_submodules or resolution_results.get(key, True):
            continue
        if pin.vendor_path not in shallow_results:
            result = git(root, "-C", pin.vendor_path, "rev-parse", "--is-shallow-repository")
            shallow_results[pin.vendor_path] = result.returncode == 0 and result.stdout.strip() == "true"
        shallow_note = (
            "; the checkout is shallow and no network fetch was attempted"
            if shallow_results[pin.vendor_path]
            else ""
        )
        errors.append(
            f"{pin.file}:{pin.line}: {pin.sha} does not resolve to a commit in initialized {pin.vendor_path}{shallow_note}"
        )

    return ValidationResult(
        errors=errors,
        entry_count=entry_count,
        object_check_count=len(resolution_results),
        initialized_submodules=sorted(initialized_submodules),
        skipped_submodules=sorted(skipped_submodules),
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument(
        "--base",
        help="also validate exact tracked source paths in references changed since this commit",
    )
    parser.add_argument(
        "--head",
        help="committed range head; omit to include the index, working tree, and untracked references",
    )
    args = parser.parse_args()
    if args.head is not None and args.base is None:
        parser.error("--head requires --base")
    for label, value in (("--base", args.base), ("--head", args.head)):
        if value is not None and value.startswith("-"):
            parser.error(f"{label} must not begin with '-'")

    result = validate(args.root, args.head)
    source_result = (
        validate_changed_source_paths(args.root, args.base, args.head)
        if args.base is not None
        else None
    )
    errors = list(dict.fromkeys(result.errors + (source_result.errors if source_result else [])))
    if errors:
        print("Verified-against provenance check failed:")
        for error in errors:
            print(f"- {error}")
        if source_result is not None:
            print(
                "Changed reference source paths: "
                f"{source_result.changed_file_count} document(s), "
                f"{source_result.checked_path_count} exact path(s) checked, "
                f"{source_result.excluded_entry_count} non-exact tracked source entry/entries excluded"
            )
        return 1

    skipped = (
        f"; skipped {len(result.skipped_submodules)} uninitialized submodule(s)"
        if result.skipped_submodules
        else ""
    )
    detail = (
        "; changed reference source paths: "
        f"{source_result.changed_file_count} document(s), "
        f"{source_result.checked_path_count} exact path(s) checked, "
        f"{source_result.excluded_entry_count} non-exact tracked source entry/entries excluded"
        if source_result is not None
        else ""
    )
    print(
        f"Verified-against provenance OK: {result.entry_count} entries, "
        f"{result.object_check_count} unique commit object(s) checked{skipped}{detail}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
