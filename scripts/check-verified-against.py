#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""Validate reference `verified-against` source pins without fetching objects."""

from __future__ import annotations

import argparse
import configparser
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

import yaml
from yaml.nodes import MappingNode, ScalarNode

SHA_VALUE_RE = re.compile(r"^([0-9a-f]{40})(?:\s+\([^()\r\n]+\))?$", re.IGNORECASE)
SAFE_SEGMENT_RE = re.compile(r"^[A-Za-z0-9._-]+$")
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


@dataclass
class ValidationResult:
    errors: list[str]
    entry_count: int
    object_check_count: int
    initialized_submodules: list[str]
    skipped_submodules: list[str]


def safe_vendor_path(value: str) -> bool:
    if "\\" in value or "//" in value:
        return False
    parts = value.split("/")
    return (
        len(parts) >= 2
        and parts[0] == "vendor"
        and all(part not in {"", ".", ".."} and SAFE_SEGMENT_RE.fullmatch(part) for part in parts[1:])
    )


def frontmatter_node(file: Path, relative_file: str, errors: list[str]) -> MappingNode | None:
    lines = file.read_text(encoding="utf-8").splitlines()
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


def extract_pins(file: Path, root: Path, errors: list[str]) -> tuple[list[Pin], int]:
    relative_file = file.relative_to(root).as_posix()
    root_node = frontmatter_node(file, relative_file, errors)
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


def vendor_submodule_paths(root: Path, errors: list[str]) -> set[str]:
    gitmodules = root / ".gitmodules"
    if not gitmodules.exists():
        return set()
    parser = configparser.ConfigParser(interpolation=None)
    try:
        parser.read(gitmodules, encoding="utf-8")
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


def validate(root: Path) -> ValidationResult:
    root = root.resolve()
    errors: list[str] = []
    submodule_paths = vendor_submodule_paths(root, errors)
    pins: list[Pin] = []
    entry_count = 0
    references = root / "references"
    if references.exists():
        for file in sorted(references.rglob("*.md")):
            file_pins, file_entry_count = extract_pins(file, root, errors)
            pins.extend(file_pins)
            entry_count += file_entry_count

    safe_pins: list[Pin] = []
    referenced_submodules: set[str] = set()
    for pin in pins:
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
            if not candidate.is_dir():
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
    args = parser.parse_args()
    result = validate(args.root)
    if result.errors:
        print("Verified-against provenance check failed:")
        for error in result.errors:
            print(f"- {error}")
        return 1

    skipped = (
        f"; skipped {len(result.skipped_submodules)} uninitialized submodule(s)"
        if result.skipped_submodules
        else ""
    )
    print(
        f"Verified-against provenance OK: {result.entry_count} entries, "
        f"{result.object_check_count} unique commit object(s) checked{skipped}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
