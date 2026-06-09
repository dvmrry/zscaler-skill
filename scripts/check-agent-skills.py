#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""Validate portable Agent Skills and runtime-adapter contracts.

This is a deterministic local check for the open-standard layer. It does not
assert that a specific runtime UI will expose a slash command. It verifies that
repo-local Agent Skills are shaped so a fresh agent/runtime can discover the
skill, load the canonical workflow, and avoid copied adapter logic.

Run:
    ./scripts/check-agent-skills.py
    ./scripts/check-agent-skills.py --strict-adapters
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
SKILLS_ROOT = REPO_ROOT / ".agents" / "skills"
AGENTS_ROOT = REPO_ROOT / "agents"

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?", re.DOTALL)
BACKTICK_PATH_RE = re.compile(r"`([^`]+)`")

ROUTING_DOCS = [
    REPO_ROOT / "AGENTS.md",
    REPO_ROOT / "SKILL.md",
    REPO_ROOT / "README.md",
    AGENTS_ROOT / "README.md",
]

RUNTIME_ADAPTER_DIRS = [
    REPO_ROOT / ".claude" / "commands",
    REPO_ROOT / ".devin" / "workflows",
]

RUNTIME_SKILL_ROOTS = [
    REPO_ROOT / ".devin" / "skills",
    REPO_ROOT / ".claude" / "skills",
]

RUNTIME_SKILL_PREFIXES = {
    REPO_ROOT / ".devin" / "skills": "devin-",
    REPO_ROOT / ".claude" / "skills": "claude-",
}


@dataclass
class Finding:
    severity: str
    path: Path
    message: str


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(REPO_ROOT))
    except ValueError:
        return str(path)


def parse_frontmatter(path: Path) -> tuple[dict[str, Any], str] | None:
    text = path.read_text(encoding="utf-8")
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None
    data = yaml.safe_load(match.group(1)) or {}
    if not isinstance(data, dict):
        return None
    return data, text[match.end() :]


def skill_files() -> list[Path]:
    if not SKILLS_ROOT.exists():
        return []
    return sorted(SKILLS_ROOT.glob("*/SKILL.md"))


def runtime_skill_files() -> list[Path]:
    files: list[Path] = []
    for root in RUNTIME_SKILL_ROOTS:
        if root.exists():
            files.extend(sorted(root.glob("*/SKILL.md")))
    return files


def resolve_skill_path(skill_file: Path, target: str) -> Path:
    return (skill_file.parent / target).resolve()


def check_skill(skill_file: Path, findings: list[Finding], allow_smoke_tests: bool) -> str | None:
    parsed = parse_frontmatter(skill_file)
    if parsed is None:
        findings.append(Finding("error", skill_file, "missing or invalid YAML frontmatter"))
        return None

    frontmatter, body = parsed
    name = frontmatter.get("name")
    description = frontmatter.get("description")
    metadata = frontmatter.get("metadata") or {}
    is_smoke_test = isinstance(metadata, dict) and metadata.get("smoke-test") is True

    if not isinstance(name, str) or not name.strip():
        findings.append(Finding("error", skill_file, "frontmatter must include non-empty name"))
        return None
    if not isinstance(description, str) or len(description.strip()) < 40:
        findings.append(Finding("error", skill_file, "frontmatter description is missing or too thin"))

    if skill_file.parent.name != name:
        findings.append(
            Finding(
                "warning",
                skill_file,
                f"skill directory name '{skill_file.parent.name}' does not match frontmatter name '{name}'",
            )
        )

    agent_targets: list[Path] = []
    for target in BACKTICK_PATH_RE.findall(body):
        if not target.startswith("../"):
            continue
        resolved = resolve_skill_path(skill_file, target)
        if not resolved.exists():
            findings.append(Finding("error", skill_file, f"referenced path does not exist: {target}"))
            continue
        try:
            resolved.relative_to(AGENTS_ROOT)
        except ValueError:
            findings.append(Finding("warning", skill_file, f"referenced path is outside agents/: {target}"))
        else:
            agent_targets.append(resolved)

    workflow_targets = [path for path in agent_targets if path.name == "workflow.md"]
    prompt_targets = [path for path in agent_targets if path.name == "prompt.md"]
    if not workflow_targets and not prompt_targets and not is_smoke_test:
        findings.append(
            Finding(
                "error",
                skill_file,
                "skill does not reference a canonical agents/**/workflow.md or prompt.md",
            )
        )

    if name == "zscaler-investigator":
        expected_workflow = AGENTS_ROOT / "investigator" / "workflow.md"
        if expected_workflow not in agent_targets:
            findings.append(
                Finding(
                    "error",
                    skill_file,
                    "zscaler-investigator must reference agents/investigator/workflow.md",
                )
            )

    if is_smoke_test and "agent-skill-smoke-test: loaded" not in body:
        findings.append(Finding("error", skill_file, "smoke-test skill must define its expected marker output"))
    if is_smoke_test and not allow_smoke_tests:
        findings.append(Finding("warning", skill_file, "smoke-test skill is committed; remove it before release"))

    if not is_smoke_test and ("source of truth" not in body.lower() or "runtime" not in body.lower()):
        findings.append(Finding("warning", skill_file, "skill should state canonical-vs-runtime policy"))

    return name


def check_routing_docs(skill_names: list[str], findings: list[Finding]) -> None:
    doc_texts: dict[Path, str] = {}
    for path in ROUTING_DOCS:
        if path.exists():
            doc_texts[path] = path.read_text(encoding="utf-8")
        else:
            findings.append(Finding("warning", path, "routing doc does not exist"))

    combined = "\n".join(doc_texts.values())
    for skill_name in skill_names:
        if skill_name.endswith("smoke-test"):
            continue
        if skill_name not in combined:
            findings.append(Finding("error", REPO_ROOT, f"skill '{skill_name}' is not mentioned in routing docs"))

    if ".agents/skills/" not in combined:
        findings.append(Finding("error", REPO_ROOT, "routing docs do not describe .agents/skills/"))
    if "canonical workflow" not in combined.lower():
        findings.append(Finding("warning", REPO_ROOT, "routing docs do not clearly name canonical workflow logic"))


def check_runtime_adapters(findings: list[Finding], strict: bool) -> None:
    for adapter_dir in RUNTIME_ADAPTER_DIRS:
        if not adapter_dir.exists():
            continue
        for adapter in sorted(adapter_dir.glob("*.md")):
            text = adapter.read_text(encoding="utf-8")
            canonical_refs = sorted(set(re.findall(r"agents/[A-Za-z0-9_./-]+\.md", text)))
            if adapter.stem.startswith("z-") and not canonical_refs:
                findings.append(Finding("warning", adapter, "runtime adapter does not reference agents/**"))

            line_count = len(text.splitlines())
            if line_count > 180:
                severity = "error" if strict else "warning"
                findings.append(
                    Finding(
                        severity,
                        adapter,
                        (
                            f"runtime adapter is large ({line_count} lines); "
                            "confirm it is a deliberate harness or lift the "
                            "procedure into agents/**"
                        ),
                    )
                )

            stale_patterns = {
                "_data/incidents": re.compile(r"_data/incidents"),
                "_data/snapshots": re.compile(r"_data/snapshots"),
                "bare snapshot/": re.compile(r"(?<!_data/)snapshot/"),
                "bare iac/": re.compile(r"(?<!_data/)iac/"),
            }
            for label, pattern in stale_patterns.items():
                if pattern.search(text):
                    severity = "error" if strict else "warning"
                    findings.append(Finding(severity, adapter, f"possible stale adapter path: {label}"))


def check_runtime_skill_collisions(skill_names: list[str], findings: list[Finding], strict: bool) -> None:
    canonical_names = set(skill_names)
    for skill_file in runtime_skill_files():
        parsed = parse_frontmatter(skill_file)
        if parsed is None:
            findings.append(Finding("warning", skill_file, "runtime skill has missing or invalid YAML frontmatter"))
            continue
        frontmatter, _ = parsed
        name = frontmatter.get("name")
        if not isinstance(name, str) or not name.strip():
            findings.append(Finding("warning", skill_file, "runtime skill frontmatter must include non-empty name"))
            continue
        for root, prefix in RUNTIME_SKILL_PREFIXES.items():
            try:
                skill_file.relative_to(root)
            except ValueError:
                continue
            if not name.startswith(prefix):
                severity = "error" if strict else "warning"
                findings.append(
                    Finding(
                        severity,
                        skill_file,
                        f"runtime skill should use '{prefix}' prefix to avoid portable-skill ambiguity",
                    )
                )
            break
        if name in canonical_names:
            severity = "warning"
            metadata = frontmatter.get("metadata") or {}
            if isinstance(metadata, dict) and metadata.get("precedence-probe"):
                message = f"runtime skill intentionally collides with portable skill '{name}' for precedence testing"
            else:
                severity = "error" if strict else "warning"
                message = f"runtime skill name collides with portable skill '{name}'"
            findings.append(Finding(severity, skill_file, message))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--strict-adapters",
        action="store_true",
        help="treat large/stale runtime adapter findings as errors",
    )
    parser.add_argument(
        "--allow-smoke-tests",
        action="store_true",
        help="suppress warnings for intentionally committed smoke-test skills",
    )
    args = parser.parse_args()

    findings: list[Finding] = []
    skills = skill_files()
    if not skills:
        findings.append(Finding("error", SKILLS_ROOT, "no portable Agent Skills found"))

    skill_names: list[str] = []
    for skill_file in skills:
        name = check_skill(skill_file, findings, args.allow_smoke_tests)
        if name:
            skill_names.append(name)

    check_routing_docs(skill_names, findings)
    check_runtime_adapters(findings, args.strict_adapters)
    check_runtime_skill_collisions(skill_names, findings, args.strict_adapters)

    errors = [finding for finding in findings if finding.severity == "error"]
    warnings = [finding for finding in findings if finding.severity == "warning"]

    print("Agent skill contract report")
    print("=" * 36)
    print(f"Skills found: {len(skills)}")
    for skill_file in skills:
        print(f"- {rel(skill_file)}")
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")

    if findings:
        print()
        for finding in findings:
            print(f"[{finding.severity.upper()}] {rel(finding.path)}: {finding.message}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
