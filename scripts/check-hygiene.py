#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6"]
# ///
"""check-hygiene.py — bundled doc-hygiene checks for the skill.

Runs four checks in a single pass:

  1. Frontmatter validation
       Required fields, allowed enum values for confidence / source-tier /
       content-type / author-status, ISO date format on last-verified,
       sources non-empty when confidence is high and author-status is
       draft/reviewed.

  2. Anchor resolution
       Markdown links of the form `[text](path#anchor)` (or same-file
       `[text](#anchor)`) are checked against the target file's headings.
       Catches cross-link rot from rename / heading edits. Path resolution
       is best-effort; check-citations.sh covers raw path failures.

  3. Resolved-clarification propagation
       Resolved clarifications (per `_clarifications.md` § Status summary
       § Resolved) are flagged if they still appear in any topical doc's
       `## Open questions` section. Surfaces incomplete propagation of
       resolutions back to source docs.

  4. Eval-doc cross-reference
       `evals/evals.json` `must_cite_files` paths are verified to exist.
       Catches evals that reference renamed / deleted reference docs.

Exit code: 0 if no errors (warnings still pass); 1 if any errors.

Run:
    ./scripts/check-hygiene.py                    # console output, exit code drives CI
    ./scripts/check-hygiene.py --digest           # also writes _data/logs/hygiene-digest.md
    ./scripts/check-hygiene.py --strict           # warnings become errors

Designed for both PR-time CI (fail builds with errors) and weekly
scheduled digests (sticky-issue update via GH Actions, mirroring the
issue-watch.py pattern).
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
REFS = REPO_ROOT / "references"
EVALS = REPO_ROOT / "evals" / "evals.json"
CLARIFICATIONS = REFS / "_meta" / "clarifications.md"
TEMPLATE = REFS / "_meta" / "template.md"
DIGEST_DEFAULT = REPO_ROOT / "_data" / "logs" / "hygiene-digest.md"

REQUIRED_FRONTMATTER = [
    "product",
    "topic",
    "title",
    "content-type",
    "last-verified",
    "confidence",
    "sources",
    "author-status",
]
ALLOWED_CONFIDENCE = {"high", "medium", "low"}
# "prompt" is the slash-command playbook content type (e.g. references/shared/audit-prompt.md)
ALLOWED_CONTENT_TYPE = {"reasoning", "reference", "primer", "prompt"}
ALLOWED_AUTHOR_STATUS = {"stub", "draft", "reviewed"}
# "practice" = derived from internal experience / methodology rather than external docs/code.
# "vendor" = extracted from vendor SDK/Postman source (used by *-postman-schemas.md).
ALLOWED_SOURCE_TIER = {"doc", "code", "mixed", "practice", "vendor"}

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
CLARIFICATION_ID_RE = re.compile(r"\b([a-z]+)-(\d+)\b")
HEADING_RE = re.compile(r"^(#+)\s+(.+)$")


@dataclass
class Finding:
    severity: str  # "error" or "warning"
    file: Path
    check: str  # "frontmatter" / "anchor" / "clarification" / "eval"
    message: str


# ----- helpers -----


def gfm_anchor(heading_text: str) -> str:
    """Convert a heading's visible text to its GitHub-flavored-markdown anchor.

    Rules: lowercase; strip backticks and emoji-style code; remove punctuation
    except hyphens/underscores; collapse whitespace runs to single hyphen;
    collapse hyphen runs; trim leading/trailing hyphens.
    """
    s = heading_text.strip().lower()
    # Strip inline-code backticks first (don't preserve as content)
    s = s.replace("`", "")
    # Replace any non-word/space/hyphen with empty (handles punctuation)
    s = re.sub(r"[^\w\s\-]", "", s)
    # Whitespace -> hyphen
    s = re.sub(r"\s+", "-", s)
    # Collapse hyphen runs
    s = re.sub(r"-+", "-", s)
    return s.strip("-")


def extract_frontmatter(content: str) -> tuple[dict | None, int]:
    """Return (parsed_yaml or None, end_offset_into_content)."""
    m = FRONTMATTER_RE.match(content)
    if not m:
        return None, 0
    try:
        data = yaml.safe_load(m.group(1))
        return data if isinstance(data, dict) else None, m.end()
    except yaml.YAMLError:
        return None, m.end()


def extract_headings(content: str) -> list[str]:
    """Return heading texts (anywhere outside code fences)."""
    in_code = False
    out = []
    for line in content.splitlines():
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = HEADING_RE.match(line)
        if m:
            out.append(m.group(2).strip())
    return out


def get_doc_anchors(path: Path) -> set[str]:
    if not path.exists():
        return set()
    content = path.read_text(encoding="utf-8", errors="replace")
    return {gfm_anchor(h) for h in extract_headings(content)}


# ----- check 1: frontmatter -----


def check_frontmatter(path: Path) -> list[Finding]:
    findings: list[Finding] = []
    # Skip the template — its values are pipe-separated placeholders, not real config
    if path == TEMPLATE:
        return findings
    content = path.read_text(encoding="utf-8", errors="replace")
    fm, _ = extract_frontmatter(content)
    if fm is None:
        # File has no frontmatter — only a problem for reference docs (not e.g. README inside a folder)
        # Skill convention: every references/**/*.md should have it. Flag missing.
        findings.append(
            Finding("warning", path, "frontmatter", "no parseable frontmatter")
        )
        return findings

    for field in REQUIRED_FRONTMATTER:
        if field not in fm:
            findings.append(
                Finding("error", path, "frontmatter", f"missing required field: {field}")
            )

    if (c := fm.get("confidence")) and c not in ALLOWED_CONFIDENCE:
        findings.append(
            Finding(
                "error",
                path,
                "frontmatter",
                f"invalid confidence: {c!r} (allowed: {sorted(ALLOWED_CONFIDENCE)})",
            )
        )
    if (ct := fm.get("content-type")) and ct not in ALLOWED_CONTENT_TYPE:
        findings.append(
            Finding(
                "error",
                path,
                "frontmatter",
                f"invalid content-type: {ct!r} (allowed: {sorted(ALLOWED_CONTENT_TYPE)})",
            )
        )
    if (as_ := fm.get("author-status")) and as_ not in ALLOWED_AUTHOR_STATUS:
        findings.append(
            Finding(
                "error",
                path,
                "frontmatter",
                f"invalid author-status: {as_!r} (allowed: {sorted(ALLOWED_AUTHOR_STATUS)})",
            )
        )
    if "source-tier" in fm and (st := fm["source-tier"]) and st not in ALLOWED_SOURCE_TIER:
        findings.append(
            Finding(
                "error",
                path,
                "frontmatter",
                f"invalid source-tier: {st!r} (allowed: {sorted(ALLOWED_SOURCE_TIER)})",
            )
        )

    lv = fm.get("last-verified", "")
    if lv and not re.match(r"^\d{4}-\d{2}-\d{2}$", str(lv)):
        findings.append(
            Finding(
                "error",
                path,
                "frontmatter",
                f"last-verified not ISO YYYY-MM-DD: {lv!r}",
            )
        )

    # The high-confidence-with-empty-sources warning skips aggregator-style
    # docs: index.md hubs (sources are the docs they link to, not external
    # citations); _-prefixed meta-docs (_clarifications.md, _portfolio-map.md,
    # _verification-protocol.md, _layering-model.md); and content inside
    # _-prefixed directories (e.g., _primer/ educational material — the
    # docs are inherently illustrative, not source-derived).
    is_aggregator = (
        path.name == "index.md"
        or path.name.startswith("_")
        or path.parent.name.startswith("_")
    )
    if (
        not is_aggregator
        and fm.get("confidence") == "high"
        and fm.get("author-status") in {"draft", "reviewed"}
        and not fm.get("sources")
    ):
        findings.append(
            Finding(
                "warning",
                path,
                "frontmatter",
                "confidence: high with empty sources (high confidence requires citations)",
            )
        )

    return findings


# ----- check 2: anchor resolution -----


def check_anchors(path: Path) -> list[Finding]:
    findings: list[Finding] = []
    content = path.read_text(encoding="utf-8", errors="replace")
    # Strip code fences (links inside example blocks aren't real)
    body = re.sub(r"```.*?```", "", content, flags=re.DOTALL)

    for m in LINK_RE.finditer(body):
        target = m.group(2).strip()
        if target.startswith(("http://", "https://", "mailto:")):
            continue
        if "#" not in target:
            continue
        path_part, _, anchor = target.partition("#")
        if not anchor:
            continue
        anchor = anchor.strip()

        if path_part:
            target_path = (path.parent / path_part).resolve()
        else:
            target_path = path  # same-file anchor

        if not target_path.exists():
            # check-citations.sh handles raw path failures; we focus on anchor
            continue

        anchors = get_doc_anchors(target_path)
        if anchor not in anchors:
            link_text = m.group(1)[:50]
            rel_target = target_path.relative_to(REPO_ROOT) if target_path.is_relative_to(REPO_ROOT) else target_path
            findings.append(
                Finding(
                    "error",
                    path,
                    "anchor",
                    f"broken anchor: [{link_text}](...#{anchor}) → no heading in {rel_target}",
                )
            )

    return findings


# ----- check 3: resolved-clarification propagation -----


def parse_resolved_clarifications() -> set[str]:
    if not CLARIFICATIONS.exists():
        return set()
    content = CLARIFICATIONS.read_text(encoding="utf-8", errors="replace")
    # Find the "### Resolved" subsection inside "## Status summary".
    # Stop at the next "###" or "## " heading.
    m = re.search(
        r"^### Resolved\s*\n(.*?)(?=^###\s|^##\s)",
        content,
        re.MULTILINE | re.DOTALL,
    )
    if not m:
        return set()
    return {f"{p}-{n}" for p, n in CLARIFICATION_ID_RE.findall(m.group(1))}


def check_clarification_propagation(path: Path, resolved_ids: set[str]) -> list[Finding]:
    findings: list[Finding] = []
    if not resolved_ids:
        return findings
    if path.name == "clarifications.md" and path.parent.name == "_meta":
        return findings
    content = path.read_text(encoding="utf-8", errors="replace")
    # Find "## Open questions" section in the body
    m = re.search(
        r"^## Open questions\s*\n(.*?)(?=^##\s|\Z)",
        content,
        re.MULTILINE | re.DOTALL,
    )
    if not m:
        return findings
    section = m.group(1)

    # Structural split: many docs separate the Open questions section into a
    # "still-open" portion and a "Resolved while writing this doc:" portion.
    # Only check the still-open portion for propagation gaps. Splitting on the
    # first "Resolved [...]:" line-or-paragraph-start handles both formats:
    #   - Subsection header: "\nResolved while writing this doc:\n- ..."
    #   - Inline paragraph:  "\nResolved while writing or after capture: ...; <ID> ..."
    parts = re.split(
        r"\n\s*Resolved\b[^\n]*?:",
        section,
        maxsplit=1,
        flags=re.IGNORECASE,
    )
    still_open = parts[0]

    found_ids = {f"{p}-{n}" for p, n in CLARIFICATION_ID_RE.findall(still_open)}
    propagation_gaps = found_ids & resolved_ids

    for cid in sorted(propagation_gaps):
        # Per-line check: if the bullet/line containing this ID has its own
        # inline (resolved) / (partially resolved) / answer annotation, treat
        # as already-noted. Common pattern: "- Foo — [`zpa-07`](...) (resolved 2026-04-24)".
        idx = still_open.find(cid)
        line_start = still_open.rfind("\n", 0, idx) + 1
        line_end = still_open.find("\n", idx)
        if line_end == -1:
            line_end = len(still_open)
        line = still_open[line_start:line_end].lower()
        if "resolved" in line or "answer" in line:
            continue
        findings.append(
            Finding(
                "warning",
                path,
                "clarification",
                f"clarification {cid} marked resolved in _clarifications.md but still in this doc's Open questions",
            )
        )

    return findings


# ----- check 4: eval-doc cross-reference -----


def check_evals() -> list[Finding]:
    findings: list[Finding] = []
    if not EVALS.exists():
        findings.append(
            Finding("error", EVALS, "eval", "evals/evals.json not found")
        )
        return findings
    try:
        with EVALS.open(encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        findings.append(
            Finding("error", EVALS, "eval", f"evals.json malformed: {e}")
        )
        return findings

    for entry in data.get("evals", []):
        eid = entry.get("id", "?")
        for cite in entry.get("must_cite_files", []) or []:
            cite_path = REPO_ROOT / cite
            if not cite_path.exists():
                findings.append(
                    Finding(
                        "error",
                        EVALS,
                        "eval",
                        f"eval id={eid} cites missing file: {cite}",
                    )
                )

    return findings


# ----- runner / rendering -----


SKIP_DIR_NAMES = {"archive"}  # under _meta/ post-2026-04-30 reorg


def run_all_checks() -> list[Finding]:
    findings: list[Finding] = []
    md_files = sorted(
        p for p in REFS.rglob("*.md")
        if not any(part in SKIP_DIR_NAMES for part in p.relative_to(REFS).parts)
    )

    for path in md_files:
        findings.extend(check_frontmatter(path))
        findings.extend(check_anchors(path))

    resolved = parse_resolved_clarifications()
    for path in md_files:
        findings.extend(check_clarification_propagation(path, resolved))

    findings.extend(check_evals())

    return findings


def relpath(p: Path) -> str:
    try:
        return str(p.relative_to(REPO_ROOT))
    except ValueError:
        return str(p)


def render_text(findings: list[Finding]) -> str:
    if not findings:
        return "✓ All hygiene checks pass."

    errors = [f for f in findings if f.severity == "error"]
    warnings = [f for f in findings if f.severity == "warning"]
    lines = [f"{len(errors)} error(s), {len(warnings)} warning(s)", ""]

    by_check: dict[str, list[Finding]] = {}
    for f in findings:
        by_check.setdefault(f.check, []).append(f)

    for check in sorted(by_check):
        fs = by_check[check]
        lines.append(f"## {check} ({len(fs)})")
        for f in fs:
            sym = "ERROR" if f.severity == "error" else "WARN"
            lines.append(f"  [{sym}] {relpath(f.file)}: {f.message}")
        lines.append("")

    return "\n".join(lines)


def render_digest(findings: list[Finding], current_run_at: str) -> str:
    """Markdown digest format suitable for sticky-issue body."""
    lines = [
        f"<!-- last_check: {current_run_at} -->",
        "",
        "# Doc hygiene digest",
        "",
        f"Generated by `scripts/check-hygiene.py` at {current_run_at}.",
        "",
    ]

    if not findings:
        lines.append("✅ All hygiene checks pass.")
        return "\n".join(lines)

    errors = [f for f in findings if f.severity == "error"]
    warnings = [f for f in findings if f.severity == "warning"]
    lines.append(f"- **Errors:** {len(errors)}")
    lines.append(f"- **Warnings:** {len(warnings)}")
    lines.append("")
    lines.append(
        "Triage workflow: errors block CI; warnings are advisory. Click through each "
        "to fix or dismiss. Patterns of repeat warnings (same file, same check) "
        "may signal a broader cleanup opportunity."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    by_check: dict[str, list[Finding]] = {}
    for f in findings:
        by_check.setdefault(f.check, []).append(f)

    for check in sorted(by_check):
        fs = by_check[check]
        lines.append(f"## {check} ({len(fs)})")
        lines.append("")
        for f in fs:
            sym = "❌" if f.severity == "error" else "⚠️"
            lines.append(f"- {sym} `{relpath(f.file)}` — {f.message}")
        lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Bundled doc-hygiene checks.")
    parser.add_argument(
        "--digest",
        action="store_true",
        help=f"Also write a markdown digest to {relpath(DIGEST_DEFAULT)}.",
    )
    parser.add_argument(
        "--digest-path",
        type=Path,
        default=DIGEST_DEFAULT,
        help="Override digest output path (implies --digest).",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as errors (exit 1 if any warning).",
    )
    args = parser.parse_args()

    findings = run_all_checks()
    print(render_text(findings))

    write_digest = args.digest or (args.digest_path != DIGEST_DEFAULT)
    if write_digest:
        current_run_at = datetime.now(timezone.utc).isoformat()
        args.digest_path.parent.mkdir(parents=True, exist_ok=True)
        args.digest_path.write_text(render_digest(findings, current_run_at))
        print(f"\nDigest written to {relpath(args.digest_path)}", file=sys.stderr)

    has_errors = any(f.severity == "error" for f in findings)
    has_warnings = any(f.severity == "warning" for f in findings)

    if has_errors or (args.strict and has_warnings):
        sys.exit(1)


if __name__ == "__main__":
    main()
