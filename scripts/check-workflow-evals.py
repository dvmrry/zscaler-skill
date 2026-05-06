#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""check-workflow-evals.py — static workflow-discipline check.

For each agent prompt under agents/{role}/prompt.md that declares an
eval-shape: in its frontmatter, validate the prompt's body content (and
its runtime adapters) against the schema in
references/_meta/evals/workflow-evals.json.

Schema fields:
  - must_contain_in_prompt — phrases that MUST appear in the prompt body
  - must_not_contain_in_prompt — phrases that MUST NOT appear in the prompt body
    (anti-patterns; their presence indicates the prompt instructs the wrong shape)
  - must_reference_paths — paths that MUST be referenced from the prompt or
    any of its runtime adapters (catches drift where a dependency is
    declared but not actually mentioned anywhere)

This is a STATIC check on file content. It does not run agents or evaluate
runtime output. The contract is: if the prompt source contains the discipline
markers, an agent following the source is structurally inclined toward the
desired first-turn shape.

Exit codes:
  0 — all eval shapes pass
  1 — one or more shapes fail
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
AGENTS = REPO_ROOT / "agents"
EVALS_FILE = REPO_ROOT / "references" / "_meta" / "evals" / "workflow-evals.json"
ADAPTER_KIND_TO_DIR = {
    "windsurf": REPO_ROOT / ".windsurf" / "workflows",
    "claude": REPO_ROOT / ".claude" / "commands",
}
DEFAULT_ADAPTER_KINDS = ["windsurf", "claude"]

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)


@dataclass
class Finding:
    severity: str
    file: Path
    shape: str
    message: str


def parse_frontmatter(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8", errors="replace")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return None


def body_after_frontmatter(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    m = FRONTMATTER_RE.match(text)
    return text[m.end():] if m else text


def load_schemas() -> dict:
    if not EVALS_FILE.exists():
        print(f"error: {EVALS_FILE.relative_to(REPO_ROOT)} not found", file=sys.stderr)
        sys.exit(1)
    return json.loads(EVALS_FILE.read_text(encoding="utf-8")).get("schemas", {})


def check_prompt(prompt: Path, schemas: dict) -> list[Finding]:
    findings: list[Finding] = []
    fm = parse_frontmatter(prompt)
    if not fm:
        return findings
    shape_name = fm.get("eval-shape")
    if not shape_name:
        return findings

    if shape_name not in schemas:
        findings.append(
            Finding(
                "error",
                prompt,
                shape_name,
                f"eval-shape: {shape_name!r} is not defined in workflow-evals.json",
            )
        )
        return findings

    schema = schemas[shape_name]
    body = body_after_frontmatter(prompt)

    # Determine role + which adapter runtimes this prompt expects.
    # Prefer frontmatter `role:`; fall back to parent dir name for the
    # legacy agents/{role}/prompt.md case.
    role = fm.get("role", prompt.parent.name)
    adapter_kinds = fm.get("adapters", DEFAULT_ADAPTER_KINDS)
    if not isinstance(adapter_kinds, list):
        findings.append(
            Finding(
                "error",
                prompt,
                shape_name,
                f"adapters: must be a list, got {type(adapter_kinds).__name__}",
            )
        )
        return findings

    adapter_contents: list[str] = []
    for kind in adapter_kinds:
        if kind not in ADAPTER_KIND_TO_DIR:
            findings.append(
                Finding(
                    "error",
                    prompt,
                    shape_name,
                    f"unknown adapter kind: {kind!r} (expected one of {sorted(ADAPTER_KIND_TO_DIR)})",
                )
            )
            continue
        adapter = ADAPTER_KIND_TO_DIR[kind] / f"z-{role}.md"
        if adapter.exists():
            adapter_contents.append(adapter.read_text(encoding="utf-8", errors="replace"))
    combined = body + "\n" + "\n".join(adapter_contents)

    for phrase in schema.get("must_contain_in_prompt", []):
        if phrase not in body:
            findings.append(
                Finding(
                    "error",
                    prompt,
                    shape_name,
                    f"prompt body missing required phrase: {phrase!r}",
                )
            )

    for phrase in schema.get("must_not_contain_in_prompt", []):
        if phrase in body:
            findings.append(
                Finding(
                    "error",
                    prompt,
                    shape_name,
                    f"prompt body contains anti-pattern phrase: {phrase!r}",
                )
            )

    for ref_path in schema.get("must_reference_paths", []):
        if ref_path not in combined:
            findings.append(
                Finding(
                    "error",
                    prompt,
                    shape_name,
                    f"required path {ref_path!r} not referenced in prompt or any adapter",
                )
            )

    return findings


def main() -> int:
    schemas = load_schemas()
    findings: list[Finding] = []

    prompts: list[Path] = []
    if AGENTS.exists():
        prompts.extend(AGENTS.rglob("prompt.md"))
    zscaler_md = REPO_ROOT / "zscaler.md"
    if zscaler_md.exists():
        prompts.append(zscaler_md)

    if not prompts:
        print("no eval-shape-bearing prompts found — nothing to check")
        return 0

    for prompt in sorted(prompts):
        findings.extend(check_prompt(prompt, schemas))

    if not findings:
        print("✓ All workflow eval shapes pass.")
        return 0

    errors = [f for f in findings if f.severity == "error"]
    print(f"✗ {len(errors)} workflow-eval finding(s):")
    for f in findings:
        rel = f.file.relative_to(REPO_ROOT)
        print(f"  [{f.severity.upper()}] {rel} ({f.shape}): {f.message}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
