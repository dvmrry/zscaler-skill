#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Report paragraph-level citation density for reference and agent docs.

This is advisory by default. It does not attempt to prove that every claim is
correctly cited; it finds long Markdown files where many body paragraphs have no
local citation marker. Use the ranked output to choose human audit targets.

Examples:
  ./scripts/check-citation-density.py
  ./scripts/check-citation-density.py --threshold 0.80 --top 25
  ./scripts/check-citation-density.py references agents
  ./scripts/check-citation-density.py --audit-sources
  ./scripts/check-citation-density.py --audit-sources --strict-sources
  ./scripts/check-citation-density.py --strict
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DIRS = ("references",)

FRONTMATTER_RE = re.compile(r"\A---\n.*?\n---\n?", re.DOTALL)
FRONTMATTER_CAPTURE_RE = re.compile(r"\A---\n(.*?)\n---\n?", re.DOTALL)
FENCE_RE = re.compile(r"^\s*(```|~~~)")
HEADING_RE = re.compile(r"^\s{0,3}(#{1,6})\s+")
TABLE_RE = re.compile(r"^\s*\|")
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`]*`")
SOURCE_SCOPE_RE = re.compile(
    r"(?i)(?:\b(?:source|sources|file)\b\s*:|\*\*(?:source|sources|file)\*\*)"
)
SOURCE_LINE_RE = re.compile(r"^\s*Source:\s*(.*)$", re.IGNORECASE)
BARE_MD_RE = re.compile(r"(?<![/A-Za-z0-9_.-])([A-Za-z0-9_.-]+\.md)(?![/A-Za-z0-9_.-])")
INTERNAL_SOURCE_RE = re.compile(r"\b(?:references|agents)/[A-Za-z0-9_./# -]+")
VAGUE_SOURCE_RE = re.compile(
    r"(?i)\b(?:listed in frontmatter|sources? listed in frontmatter|sections above|same section|summary index|synthesis index)\b"
)

# Broad but intentionally transparent. This is a triage signal, not a verifier.
CITATION_PATTERNS_RAW = [
    re.compile(r"https?://"),
]
CITATION_PATTERNS_NO_CODE = [
    re.compile(r"\b(?:vendor|scripts)/[A-Za-z0-9_./-]+"),
    re.compile(r"\b(?:vendor|scripts)/[A-Za-z0-9_./-]+\.(?:md|py|go|sh|json|yaml|yml):\d+\b"),
    re.compile(r"\b(?:Tier|tier)\s+[A-D]\b"),
    re.compile(r"\b(?:clarification|Clarification)\s+[a-z]+-\d+\b"),
    re.compile(r"\b[a-z]+-\d+\b"),  # clarification IDs such as zia-15
]


@dataclass
class FileScore:
    path: str
    paragraphs: int
    cited: int
    direct_cited: int
    inherited_cited: int
    uncited: int
    density: float
    chars: int
    sample_uncited: list[str]


@dataclass
class SourceIssue:
    path: str
    line: int
    kind: str
    text: str


def strip_frontmatter(text: str) -> str:
    return FRONTMATTER_RE.sub("", text, count=1)


def strip_code_fences(text: str) -> str:
    lines: list[str] = []
    in_fence = False
    for line in text.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            lines.append("")
            continue
        lines.append("" if in_fence else line)
    return "\n".join(lines)


def normalize_for_citation_scan(text: str) -> str:
    text = HTML_COMMENT_RE.sub("", text)
    # Keep markdown links intact, but remove inline code so path examples do not
    # make otherwise-uncited prose look cited.
    return INLINE_CODE_RE.sub("", text)


def is_structural_paragraph(paragraph: str) -> bool:
    lines = [line.strip() for line in paragraph.splitlines() if line.strip()]
    if not lines:
        return True
    if all(HEADING_RE.match(line) for line in lines):
        return True
    if all(TABLE_RE.match(line) for line in lines):
        return True
    if all(line in {"---", "***", "___"} for line in lines):
        return True
    return False


@dataclass(frozen=True)
class Block:
    kind: str
    text: str
    level: int = 0


def frontmatter_source_basenames(text: str) -> set[str]:
    match = FRONTMATTER_CAPTURE_RE.match(text)
    if not match:
        return set()
    names: set[str] = set()
    for source in re.findall(r"(?:vendor|scripts)/[A-Za-z0-9_./-]+", match.group(1)):
        names.add(Path(source.strip("\"'")).name)
    return names


def audit_source_lines(path: Path) -> list[SourceIssue]:
    text = path.read_text(encoding="utf-8", errors="replace")
    source_basenames = frontmatter_source_basenames(text)
    rel = str(path.relative_to(REPO_ROOT))
    issues: list[SourceIssue] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        match = SOURCE_LINE_RE.match(line)
        if not match:
            continue
        source_text = match.group(1)
        if INTERNAL_SOURCE_RE.search(source_text):
            issues.append(SourceIssue(rel, line_number, "internal-reference-source", line.strip()))
        if VAGUE_SOURCE_RE.search(source_text):
            issues.append(SourceIssue(rel, line_number, "vague-source-scope", line.strip()))
        for md_name in BARE_MD_RE.findall(source_text):
            if md_name not in source_basenames:
                issues.append(SourceIssue(rel, line_number, "unresolved-bare-md-source", line.strip()))
                break
    return issues


def references_frontmatter_source(paragraph: str, source_basenames: set[str]) -> bool:
    if not source_basenames:
        return False
    return any(re.search(rf"(?<![A-Za-z0-9_.-]){re.escape(name)}(?![A-Za-z0-9_.-])", paragraph) for name in source_basenames)


def iter_body_blocks(text: str, source_basenames: set[str]) -> list[Block]:
    text = strip_frontmatter(text)
    text = strip_code_fences(text)
    paragraphs = re.split(r"\n\s*\n", text)
    out: list[Block] = []
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        lines = [line.strip() for line in paragraph.splitlines() if line.strip()]
        heading_matches = [HEADING_RE.match(line) for line in lines]
        if lines and all(heading_matches):
            level = min(len(match.group(1)) for match in heading_matches if match)
            out.append(Block("heading", paragraph, level))
            continue
        if is_structural_paragraph(paragraph):
            if has_source_scope_marker(paragraph, source_basenames):
                out.append(Block("source", paragraph))
            continue
        out.append(Block("paragraph", paragraph))
    return out


def has_citation(paragraph: str, source_basenames: set[str]) -> bool:
    if any(pattern.search(paragraph) for pattern in CITATION_PATTERNS_RAW):
        return True
    if has_source_scope_marker(paragraph, source_basenames):
        return True
    scanned = normalize_for_citation_scan(paragraph)
    return any(pattern.search(scanned) for pattern in CITATION_PATTERNS_NO_CODE)


def has_source_scope_marker(paragraph: str, source_basenames: set[str]) -> bool:
    scanned = normalize_for_citation_scan(paragraph)
    if not SOURCE_SCOPE_RE.search(scanned):
        return False
    if references_frontmatter_source(paragraph, source_basenames):
        return True
    return any(pattern.search(paragraph) for pattern in CITATION_PATTERNS_RAW) or any(
        pattern.search(paragraph) or pattern.search(scanned)
        for pattern in CITATION_PATTERNS_NO_CODE
    )


def should_skip(path: Path) -> bool:
    rel = path.relative_to(REPO_ROOT)
    parts = rel.parts
    if path.name in {"README.md", "template.md"}:
        return True
    if rel == Path("references/_meta/clarifications.md"):
        return True
    if path.name.endswith(("-schemas.md", "-postman-schemas.md")):
        return True
    if len(parts) >= 3 and parts[:2] == ("references", "_meta") and parts[2] == "primer":
        return True
    if len(parts) >= 3 and parts[:2] == ("references", "_meta") and parts[2] == "archive":
        return True
    if len(parts) >= 2 and parts[0] == "agents" and path.name == "template.md":
        return True
    return False


def score_file(path: Path) -> FileScore | None:
    text = path.read_text(encoding="utf-8", errors="replace")
    source_basenames = frontmatter_source_basenames(text)
    blocks = iter_body_blocks(text, source_basenames)
    paragraphs = [block.text for block in blocks if block.kind == "paragraph"]
    if not paragraphs:
        return None
    direct_cited = 0
    inherited_cited = 0
    uncited_paragraphs: list[str] = []
    inherited_source_by_level: dict[int, bool] = {}

    section: list[Block] = []
    current_heading_level = 0

    def score_section(section_blocks: list[Block], heading_level: int) -> bool:
        nonlocal direct_cited, inherited_cited
        section_has_source = any(
            block.kind == "source" or has_source_scope_marker(block.text, source_basenames)
            for block in section_blocks
        )
        inherited_source = any(
            active for level, active in inherited_source_by_level.items() if level < heading_level
        )
        for block in section_blocks:
            if block.kind != "paragraph":
                continue
            if has_citation(block.text, source_basenames):
                direct_cited += 1
            elif section_has_source or inherited_source:
                inherited_cited += 1
            else:
                uncited_paragraphs.append(block.text)
        return section_has_source

    for block in blocks:
        if block.kind == "heading":
            section_has_source = score_section(section, current_heading_level)
            if current_heading_level:
                inherited_source_by_level[current_heading_level] = section_has_source
            inherited_source_by_level = {
                level: active
                for level, active in inherited_source_by_level.items()
                if level < block.level
            }
            current_heading_level = block.level
            section = []
            continue
        section.append(block)
    section_has_source = score_section(section, current_heading_level)
    if current_heading_level:
        inherited_source_by_level[current_heading_level] = section_has_source

    cited = direct_cited + inherited_cited
    samples = []
    for paragraph in uncited_paragraphs[:3]:
        one_line = re.sub(r"\s+", " ", paragraph).strip()
        samples.append(one_line[:160] + ("..." if len(one_line) > 160 else ""))
    rel = path.relative_to(REPO_ROOT)
    return FileScore(
        path=str(rel),
        paragraphs=len(paragraphs),
        cited=cited,
        direct_cited=direct_cited,
        inherited_cited=inherited_cited,
        uncited=len(paragraphs) - cited,
        density=cited / len(paragraphs),
        chars=len(text),
        sample_uncited=samples,
    )


def collect_scores(paths: list[Path]) -> list[FileScore]:
    scores: list[FileScore] = []
    for root in paths:
        if not root.exists():
            continue
        if root.is_file():
            if root.suffix == ".md" and not should_skip(root):
                score = score_file(root)
                if score is not None:
                    scores.append(score)
            continue
        for path in sorted(root.rglob("*.md")):
            if should_skip(path):
                continue
            score = score_file(path)
            if score is not None:
                scores.append(score)
    return scores


def collect_source_issues(paths: list[Path]) -> list[SourceIssue]:
    issues: list[SourceIssue] = []
    for root in paths:
        if not root.exists():
            continue
        if root.is_file():
            if root.suffix == ".md" and not should_skip(root):
                issues.extend(audit_source_lines(root))
            continue
        for path in sorted(root.rglob("*.md")):
            if should_skip(path):
                continue
            issues.extend(audit_source_lines(path))
    return issues


def render_text(
    scores: list[FileScore],
    threshold: float,
    top: int,
    min_paragraphs: int,
) -> str:
    eligible = [score for score in scores if score.paragraphs >= min_paragraphs]
    below = [score for score in eligible if score.density < threshold]
    ranked = sorted(below, key=lambda s: (-s.uncited, s.density, s.path))[:top]
    lines = [
        "Citation density report",
        "=" * 40,
        f"Files scanned: {len(scores)}",
        f"Files eligible: {len(eligible)} (min paragraphs: {min_paragraphs})",
        f"Threshold: {threshold:.0%}",
        f"Files below threshold: {len(below)}",
        "",
    ]
    if not ranked:
        lines.append("No files below threshold.")
        return "\n".join(lines)

    for score in ranked:
        lines.append(
            f"{score.density:.0%} cited ({score.cited}/{score.paragraphs}), "
            f"{score.uncited} uncited paragraphs, {score.chars} chars - {score.path}"
        )
        if score.inherited_cited:
            lines.append(
                f"  source-scope: {score.inherited_cited} inherited, "
                f"{score.direct_cited} direct"
            )
        for sample in score.sample_uncited:
            lines.append(f"  sample: {sample}")
        lines.append("")
    return "\n".join(lines).rstrip()


def render_source_audit(issues: list[SourceIssue], top: int) -> str:
    by_kind: dict[str, int] = {}
    for issue in issues:
        by_kind[issue.kind] = by_kind.get(issue.kind, 0) + 1
    lines = [
        "Source-line audit",
        "=" * 40,
        f"Issues found: {len(issues)}",
    ]
    for kind, count in sorted(by_kind.items()):
        lines.append(f"{kind}: {count}")
    lines.append("")
    for issue in issues[:top]:
        lines.append(f"{issue.path}:{issue.line}: {issue.kind}: {issue.text}")
    if len(issues) > top:
        lines.append(f"... {len(issues) - top} more")
    return "\n".join(lines).rstrip()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "paths",
        nargs="*",
        default=[str(REPO_ROOT / name) for name in DEFAULT_DIRS],
        help="Files or directories to scan (default: references agents)",
    )
    parser.add_argument("--threshold", type=float, default=0.80)
    parser.add_argument("--top", type=int, default=20)
    parser.add_argument(
        "--min-paragraphs",
        type=int,
        default=8,
        help="Ignore very small files by default (default: 8)",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON")
    parser.add_argument(
        "--audit-sources",
        action="store_true",
        help="Report Source: lines that use internal references, vague frontmatter scopes, or unresolved bare .md filenames",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 when any scanned file is below threshold",
    )
    parser.add_argument(
        "--strict-sources",
        action="store_true",
        help="Exit 1 when --audit-sources finds Source: lines that cite internal refs, vague scopes, or unresolved bare .md names",
    )
    args = parser.parse_args()

    roots = [Path(path).resolve() for path in args.paths]
    expanded: list[Path] = []
    for root in roots:
        if root.is_file():
            expanded.append(root)
        else:
            expanded.append(root)

    scores = collect_scores(expanded)
    source_issues = collect_source_issues(expanded) if args.audit_sources else []
    eligible = [score for score in scores if score.paragraphs >= args.min_paragraphs]
    below = [score for score in eligible if score.density < args.threshold]

    if args.json:
        payload = {
            "threshold": args.threshold,
            "min_paragraphs": args.min_paragraphs,
            "files_scanned": len(scores),
            "files_eligible": len(eligible),
            "files_below_threshold": len(below),
            "scores": [asdict(score) for score in sorted(scores, key=lambda s: s.path)],
            "source_issues": [asdict(issue) for issue in source_issues],
        }
        print(json.dumps(payload, indent=2))
    else:
        print(render_text(scores, args.threshold, args.top, args.min_paragraphs))
        if args.audit_sources:
            print()
            print(render_source_audit(source_issues, args.top))

    if args.strict and (below or source_issues):
        return 1
    if args.strict_sources and source_issues:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
