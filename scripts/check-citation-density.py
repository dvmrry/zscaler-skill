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
  ./scripts/check-citation-density.py --audit-source-quality
  ./scripts/check-citation-density.py --audit-source-quality --include-semantic
  ./scripts/check-citation-density.py --citation-inventory
  ./scripts/check-citation-density.py --compare-citation-inventory references/_meta/citation-inventory.json --strict-inventory
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
ALTERNATE_SOURCE_LINE_RE = re.compile(r"^\s*(?:Source\s+\([^)]*\)|Sources|Vendor source):\s*(.*)$", re.IGNORECASE)
BRACKET_SOURCE_RE = re.compile(r"\[Source:\s*([^\]]+)\]", re.IGNORECASE)
INLINE_SOURCE_RE = re.compile(r"\bSource:\s*(.+)", re.IGNORECASE)
SOURCE_PATH_RE = re.compile(r"\b(?:vendor|scripts)/[A-Za-z0-9_./-]+")
QUOTED_SOURCE_PATH_RE = re.compile(r"`(?:vendor|scripts)/[^`]+`")
UNQUOTED_SOURCE_PATH_RE = re.compile(r"(?<!`)\b(?:vendor|scripts)/[A-Za-z0-9_./-]+")
SOURCE_PERIOD_INSIDE_BACKTICK_RE = re.compile(r"`(?:vendor|scripts)/[^`]+\.`")
COMMA_SOURCE_SEPARATOR_RE = re.compile(r"`\s*,\s*`")
BARE_MD_RE = re.compile(r"(?<![/A-Za-z0-9_.-])([A-Za-z0-9_.-]+\.md)(?![/A-Za-z0-9_.-])")
BARE_SOURCE_FILE_RE = re.compile(
    r"(?<![/A-Za-z0-9_.-])([A-Za-z0-9_.-]+\.(?:md|py|go|sh|json|ya?ml))(?![/A-Za-z0-9_.-])"
)
INTERNAL_SOURCE_RE = re.compile(r"\b(?:references|agents)/[A-Za-z0-9_./# -]+")
VAGUE_SOURCE_RE = re.compile(
    r"(?i)\b(?:listed in frontmatter|sources? listed in frontmatter|sections above|same section|this section|linked in (?:the )?table|topical references|listed vendor sources|summary index|synthesis index)\b"
)
INFERENCE_SOURCE_RE = re.compile(r"(?i)\b(?:inferred|by analogy|reconstruct(?:ed|ion)|extrapolat(?:ed|ion))\b")
MCP_SOURCE_RE = re.compile(r"\bvendor/zscaler-mcp-server/[A-Za-z0-9_./-]+")
TEST_SOURCE_RE = re.compile(r"\b(?:vendor|scripts)/[A-Za-z0-9_./-]*(?:/tests?/|_test\.go|test_[A-Za-z0-9_.-]+)")
FRONTMATTER_PROXY_RE = re.compile(
    r"(?i)\b(?:sources? listed in frontmatter|listed in frontmatter|sources? listed above|frontmatter sources?)\b"
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
    confidence: str
    source_tier: str
    content_type: str
    audit_class: str
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
    severity: str = "quality"


@dataclass
class CitationInventory:
    path: str
    audit_class: str
    paragraphs: int
    cited: int
    density: float
    block_sources: int
    inline_sources: int
    alternate_sources: int
    total_sources: int
    source_path_mentions: int
    quality_issues: int
    advisory_issues: int


@dataclass
class InventoryRegression:
    path: str
    kind: str
    baseline: str
    current: str


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


def frontmatter_field(text: str, field: str) -> str:
    match = FRONTMATTER_CAPTURE_RE.match(text)
    if not match:
        return ""
    field_match = re.search(
        rf"(?m)^\s*{re.escape(field)}\s*:\s*['\"]?([^'\"\n]+)['\"]?\s*$",
        match.group(1),
    )
    if not field_match:
        return ""
    return field_match.group(1).strip()


def audit_class_for_path(path: Path, text: str) -> str:
    """Classify docs so density reports do not create fake remediation work."""
    rel = path.relative_to(REPO_ROOT)
    parts = rel.parts
    content_type = frontmatter_field(text, "content-type").lower()
    name = path.name
    if name.endswith(("-schema.md", "-schemas.md", "-postman-schemas.md")):
        return "schema"
    if name.endswith("-template.md") or name == "template.md":
        return "template"
    if len(parts) >= 2 and parts[0] == "references" and parts[1] == "_meta":
        return "meta"
    if content_type in {"schema", "template", "meta", "process"}:
        return content_type
    if content_type in {"sdk", "api-inventory", "inventory"}:
        return "inventory"
    return "reference"


def should_warn_directory_sources(path: Path, text: str) -> bool:
    """Directory sources are expected in inventory docs that cover many SDK surfaces."""
    audit_class = audit_class_for_path(path, text)
    if audit_class in {"schema", "inventory"}:
        return False
    topic = frontmatter_field(text, "topic").strip('"').lower()
    return not topic.endswith("-api")


def is_attention_candidate(score: FileScore, threshold: float, large_paragraphs: int) -> bool:
    if score.audit_class not in {"reference", "reasoning"}:
        return False
    return (
        score.paragraphs >= large_paragraphs
        and score.density < threshold
        and score.confidence.lower() in {"medium", "low", "unknown"}
    )


def iter_scannable_lines(text: str) -> list[tuple[int, str]]:
    lines = text.splitlines()
    out: list[tuple[int, str]] = []
    in_fence = False
    in_frontmatter = bool(lines and lines[0].strip() == "---")
    for line_number, line in enumerate(lines, start=1):
        if in_frontmatter:
            if line_number > 1 and line.strip() == "---":
                in_frontmatter = False
            continue
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        out.append((line_number, line))
    return out


def normalize_source_text(text: str) -> str:
    text = text.strip()
    text = text.removesuffix(".")
    text = text.replace("`", "")
    text = re.sub(r"\s+", " ", text)
    return text.lower()


def source_payloads(line: str) -> list[tuple[str, str]]:
    payloads: list[tuple[str, str]] = []
    match = SOURCE_LINE_RE.match(line)
    if match:
        payloads.append(("block-source", match.group(1)))
        return payloads
    match = ALTERNATE_SOURCE_LINE_RE.match(line)
    if match:
        payloads.append(("alternate-source-label", match.group(1)))
    for match in BRACKET_SOURCE_RE.finditer(line):
        payloads.append(("inline-source", match.group(1)))
    if "Source:" in line and not payloads:
        match = INLINE_SOURCE_RE.search(line)
        if match:
            payloads.append(("inline-source", match.group(1)))
    return payloads


STYLE_SOURCE_KINDS = {
    "after-content-source",
    "alternate-source-label",
    "directory-source",
    "duplicate-source-line",
    "inline-source",
    "mixed-source-style",
}

SEMANTIC_SOURCE_KINDS = {
    "frontmatter-proxy-source",
    "source-mcp",
    "source-test",
}

ADVISORY_SOURCE_KINDS = STYLE_SOURCE_KINDS | SEMANTIC_SOURCE_KINDS


def issue(rel: str, line: int, kind: str, text: str) -> SourceIssue:
    severity = "advisory" if kind in ADVISORY_SOURCE_KINDS else "quality"
    return SourceIssue(rel, line, kind, text, severity)


def audit_source_quality(
    path: Path,
    include_style: bool = False,
    include_semantic: bool = False,
) -> list[SourceIssue]:
    text = path.read_text(encoding="utf-8", errors="replace")
    rel = str(path.relative_to(REPO_ROOT))
    audit_class = audit_class_for_path(path, text)
    warn_directory_sources = should_warn_directory_sources(path, text)
    issues: list[SourceIssue] = []
    lines = iter_scannable_lines(text)
    line_lookup = {line_number: line for line_number, line in lines}
    source_styles: set[str] = set()
    previous_source_payload = ""

    def next_nonblank_line(after: int) -> str:
        for line_number, candidate in lines:
            if line_number <= after:
                continue
            if candidate.strip():
                return candidate
        return ""

    def previous_nonblank_line(before: int) -> str:
        for line_number in range(before - 1, 0, -1):
            candidate = line_lookup.get(line_number, "")
            if candidate.strip():
                return candidate
        return ""

    for line_number, line in lines:
        if HEADING_RE.match(line):
            previous_source_payload = ""
            continue
        payloads = source_payloads(line)
        if not payloads:
            if include_semantic:
                if TEST_SOURCE_RE.search(line):
                    issues.append(issue(rel, line_number, "source-test", line.strip()))
                if FRONTMATTER_PROXY_RE.search(line):
                    issues.append(issue(rel, line_number, "frontmatter-proxy-source", line.strip()))
            if line.strip():
                previous_source_payload = ""
            continue

        for style, source_text in payloads:
            source_styles.add(style)
            if style != "block-source":
                issues.append(issue(rel, line_number, style, line.strip()))

            normalized = normalize_source_text(source_text)
            if normalized == previous_source_payload:
                issues.append(issue(rel, line_number, "duplicate-source-line", line.strip()))
            previous_source_payload = normalized

            if style == "block-source":
                stripped_source = source_text.strip()
                if not stripped_source.endswith("."):
                    issues.append(issue(rel, line_number, "missing-source-period", line.strip()))
                if stripped_source.endswith(".."):
                    issues.append(issue(rel, line_number, "duplicate-source-period", line.strip()))
                if SOURCE_PERIOD_INSIDE_BACKTICK_RE.search(source_text):
                    issues.append(issue(rel, line_number, "source-period-inside-backtick", line.strip()))
                if UNQUOTED_SOURCE_PATH_RE.search(source_text):
                    issues.append(issue(rel, line_number, "unquoted-source-path", line.strip()))
                if COMMA_SOURCE_SEPARATOR_RE.search(source_text):
                    issues.append(issue(rel, line_number, "comma-source-separator", line.strip()))
                if re.search(r"\bclarification\b", source_text, re.IGNORECASE):
                    issues.append(issue(rel, line_number, "clarification-source", line.strip()))
                if not QUOTED_SOURCE_PATH_RE.search(source_text) and not re.search(r"https?://", source_text):
                    issues.append(issue(rel, line_number, "prose-only-source", line.strip()))

                prev_line = previous_nonblank_line(line_number)
                next_line = next_nonblank_line(line_number)
                if prev_line and not HEADING_RE.match(prev_line) and not SOURCE_LINE_RE.match(prev_line) and HEADING_RE.match(next_line):
                    issues.append(issue(rel, line_number, "after-content-source", line.strip()))

            if INTERNAL_SOURCE_RE.search(source_text):
                issues.append(issue(rel, line_number, "internal-source", line.strip()))
            if VAGUE_SOURCE_RE.search(source_text):
                issues.append(issue(rel, line_number, "vague-source", line.strip()))
            if INFERENCE_SOURCE_RE.search(source_text):
                issues.append(issue(rel, line_number, "unsupported-inference", line.strip()))
            if "CLAUDE.md" in source_text:
                issues.append(issue(rel, line_number, "claude-md-source", line.strip()))
            if re.search(r"https?://", source_text):
                issues.append(issue(rel, line_number, "live-url-source", line.strip()))
            if include_semantic and MCP_SOURCE_RE.search(source_text):
                issues.append(issue(rel, line_number, "source-mcp", line.strip()))
            if include_semantic and FRONTMATTER_PROXY_RE.search(source_text):
                issues.append(issue(rel, line_number, "frontmatter-proxy-source", line.strip()))

            for source_path in SOURCE_PATH_RE.findall(source_text):
                if source_path.endswith("/") and warn_directory_sources:
                    issues.append(issue(rel, line_number, "directory-source", line.strip()))
                if "/test" in source_path or source_path.endswith("_test.go") or "/tests/" in source_path:
                    issues.append(issue(rel, line_number, "source-test", line.strip()))

            for filename in BARE_SOURCE_FILE_RE.findall(source_text):
                if not filename.startswith(("vendor/", "scripts/")) and not re.search(
                    rf"(?:vendor|scripts)/[A-Za-z0-9_./-]*{re.escape(filename)}", source_text
                ):
                    issues.append(issue(rel, line_number, "bare-filename-source", line.strip()))
                    break

    if len(source_styles) > 1:
        styles = ", ".join(sorted(source_styles))
        issues.insert(0, issue(rel, 1, "mixed-source-style", f"Source styles in file: {styles}"))
    visible_kinds = set()
    if include_style:
        visible_kinds.update(STYLE_SOURCE_KINDS)
    if include_semantic:
        visible_kinds.update(SEMANTIC_SOURCE_KINDS)
    return [
        source_issue
        for source_issue in issues
        if source_issue.severity == "quality" or source_issue.kind in visible_kinds
    ]


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
        confidence=frontmatter_field(text, "confidence") or "unknown",
        source_tier=frontmatter_field(text, "source-tier") or "unknown",
        content_type=frontmatter_field(text, "content-type") or "unknown",
        audit_class=audit_class_for_path(path, text),
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


def collect_source_quality_issues(
    paths: list[Path],
    include_style: bool = False,
    include_semantic: bool = False,
) -> list[SourceIssue]:
    issues: list[SourceIssue] = []
    for root in paths:
        if not root.exists():
            continue
        if root.is_file():
            if root.suffix == ".md" and not should_skip(root):
                issues.extend(
                    audit_source_quality(
                        root,
                        include_style=include_style,
                        include_semantic=include_semantic,
                    )
                )
            continue
        for path in sorted(root.rglob("*.md")):
            if should_skip(path):
                continue
            issues.extend(
                audit_source_quality(
                    path,
                    include_style=include_style,
                    include_semantic=include_semantic,
                )
            )
    return issues


def inventory_file(path: Path) -> CitationInventory | None:
    score = score_file(path)
    if score is None:
        return None

    text = path.read_text(encoding="utf-8", errors="replace")
    block_sources = 0
    inline_sources = 0
    alternate_sources = 0
    source_path_mentions = 0

    for _, line in iter_scannable_lines(text):
        payloads = source_payloads(line)
        for style, _ in payloads:
            if style == "block-source":
                block_sources += 1
            elif style == "alternate-source-label":
                alternate_sources += 1
            else:
                inline_sources += 1
        source_path_mentions += len(SOURCE_PATH_RE.findall(line))

    issues = audit_source_quality(path, include_style=True)
    quality_issues = sum(1 for source_issue in issues if source_issue.severity == "quality")
    advisory_issues = len(issues) - quality_issues

    return CitationInventory(
        path=score.path,
        audit_class=score.audit_class,
        paragraphs=score.paragraphs,
        cited=score.cited,
        density=round(score.density, 4),
        block_sources=block_sources,
        inline_sources=inline_sources,
        alternate_sources=alternate_sources,
        total_sources=block_sources + inline_sources + alternate_sources,
        source_path_mentions=source_path_mentions,
        quality_issues=quality_issues,
        advisory_issues=advisory_issues,
    )


def collect_citation_inventory(paths: list[Path]) -> list[CitationInventory]:
    inventory: list[CitationInventory] = []
    for root in paths:
        if not root.exists():
            continue
        if root.is_file():
            if root.suffix == ".md" and not should_skip(root):
                item = inventory_file(root)
                if item is not None:
                    inventory.append(item)
            continue
        for path in sorted(root.rglob("*.md")):
            if should_skip(path):
                continue
            item = inventory_file(path)
            if item is not None:
                inventory.append(item)
    return inventory


def inventory_payload(inventory: list[CitationInventory]) -> dict[str, object]:
    items = [asdict(item) for item in sorted(inventory, key=lambda entry: entry.path)]
    return {
        "schema": 1,
        "description": "Citation visibility baseline generated by scripts/check-citation-density.py --citation-inventory.",
        "files": items,
    }


def compare_citation_inventory(
    baseline_path: Path,
    current_inventory: list[CitationInventory],
    max_density_drop: float,
) -> list[InventoryRegression]:
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    baseline_items = {
        item["path"]: item
        for item in baseline.get("files", [])
        if isinstance(item, dict) and "path" in item
    }
    current_items = {item.path: asdict(item) for item in current_inventory}
    regressions: list[InventoryRegression] = []

    def add(path: str, kind: str, baseline_value: object, current_value: object) -> None:
        regressions.append(InventoryRegression(path, kind, str(baseline_value), str(current_value)))

    for path, before in sorted(baseline_items.items()):
        after = current_items.get(path)
        if after is None:
            add(path, "file-missing", "present", "missing")
            continue

        for field in ("block_sources", "total_sources", "source_path_mentions", "cited"):
            if int(after.get(field, 0)) < int(before.get(field, 0)):
                add(path, f"{field}-drop", before.get(field, 0), after.get(field, 0))

        before_density = float(before.get("density", 0.0))
        after_density = float(after.get("density", 0.0))
        if before_density - after_density > max_density_drop:
            add(path, "density-drop", f"{before_density:.4f}", f"{after_density:.4f}")

        for field in ("quality_issues", "advisory_issues"):
            if int(after.get(field, 0)) > int(before.get(field, 0)):
                add(path, f"{field}-increase", before.get(field, 0), after.get(field, 0))

    return regressions


def render_inventory_regressions(regressions: list[InventoryRegression], top: int) -> str:
    lines = [
        "Citation inventory regression report",
        "=" * 40,
        f"Regressions found: {len(regressions)}",
        "",
    ]
    for regression in regressions[:top]:
        lines.append(
            f"{regression.path}: {regression.kind}: "
            f"{regression.baseline} -> {regression.current}"
        )
    if len(regressions) > top:
        lines.append(f"... {len(regressions) - top} more")
    return "\n".join(lines).rstrip()


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


def render_attention_report(
    scores: list[FileScore],
    threshold: float,
    top: int,
    min_paragraphs: int,
    large_paragraphs: int,
) -> str:
    eligible = [score for score in scores if is_attention_candidate(score, threshold, large_paragraphs)]
    ranked = sorted(
        eligible,
        key=lambda s: (
            {"low": 0, "unknown": 1, "medium": 2}.get(s.confidence.lower(), 3),
            -s.uncited,
            s.density,
            s.path,
        ),
    )[:top]
    lines = [
        "Attention report",
        "=" * 40,
        f"Criterion: paragraphs >= {large_paragraphs}, density < {threshold:.0%}, confidence in medium/low/unknown",
        f"General eligibility floor: {min_paragraphs} paragraphs",
        f"Files matching attention criteria: {len(eligible)}",
        "",
    ]
    if not ranked:
        lines.append("No files match attention criteria.")
        return "\n".join(lines)
    for score in ranked:
        lines.append(
            f"{score.density:.0%} cited ({score.cited}/{score.paragraphs}), "
            f"{score.uncited} uncited, confidence={score.confidence}, "
            f"source-tier={score.source_tier}, audit-class={score.audit_class} - {score.path}"
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


def render_source_quality_audit(issues: list[SourceIssue], top: int) -> str:
    by_kind: dict[str, int] = {}
    by_severity: dict[str, int] = {}
    for issue in issues:
        by_kind[issue.kind] = by_kind.get(issue.kind, 0) + 1
        by_severity[issue.severity] = by_severity.get(issue.severity, 0) + 1
    lines = [
        "Source-quality audit",
        "=" * 40,
        f"Issues found: {len(issues)}",
    ]
    for severity, count in sorted(by_severity.items()):
        lines.append(f"{severity}: {count}")
    for kind, count in sorted(by_kind.items()):
        lines.append(f"{kind}: {count}")
    lines.append("")
    for issue in issues[:top]:
        lines.append(f"{issue.path}:{issue.line}: {issue.severity}:{issue.kind}: {issue.text}")
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
        "--citation-inventory",
        action="store_true",
        help="Emit a stable per-file citation visibility inventory as JSON",
    )
    parser.add_argument(
        "--write-citation-inventory",
        type=Path,
        help="Write the citation visibility inventory JSON to this path",
    )
    parser.add_argument(
        "--compare-citation-inventory",
        type=Path,
        help="Compare current citation inventory against a checked-in baseline JSON",
    )
    parser.add_argument(
        "--strict-inventory",
        action="store_true",
        help="Exit 1 when --compare-citation-inventory finds citation visibility regressions",
    )
    parser.add_argument(
        "--max-density-drop",
        type=float,
        default=0.05,
        help="Allowed cited-paragraph density drop before inventory comparison flags a regression (default: 0.05)",
    )
    parser.add_argument(
        "--audit-sources",
        action="store_true",
        help="Alias for --audit-source-quality without source-style advisories",
    )
    parser.add_argument(
        "--audit-source-quality",
        action="store_true",
        help="Report weak or hard-to-audit source evidence. Citation placement, duplicate, and broad-scope advisories are excluded unless --include-source-style is set.",
    )
    parser.add_argument(
        "--include-source-style",
        action="store_true",
        help="Include citation advisories such as inline, after-content, duplicate, mixed source placement, and broad directory sources.",
    )
    parser.add_argument(
        "--include-semantic",
        action="store_true",
        help="Include advisory semantic/evidence-tier heuristics such as MCP-derived or test-file evidence.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit 1 when any scanned file is below threshold",
    )
    parser.add_argument(
        "--strict-sources",
        action="store_true",
        help="Exit 1 when source audits find any returned quality, style, or semantic issues",
    )
    parser.add_argument(
        "--attention",
        action="store_true",
        help="Show the high-signal audit queue: large low-density docs with medium/low/unknown confidence",
    )
    parser.add_argument(
        "--large-paragraphs",
        type=int,
        default=36,
        help="Paragraph floor for --attention large-doc queue (default: 36)",
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
    citation_inventory = collect_citation_inventory(expanded) if (
        args.citation_inventory or args.write_citation_inventory or args.compare_citation_inventory
    ) else []
    source_quality_issues = (
        collect_source_quality_issues(
            expanded,
            include_style=args.include_source_style,
            include_semantic=args.include_semantic,
        )
        if args.audit_sources or args.audit_source_quality
        else []
    )
    eligible = [score for score in scores if score.paragraphs >= args.min_paragraphs]
    below = [score for score in eligible if score.density < args.threshold]
    inventory_regressions = (
        compare_citation_inventory(args.compare_citation_inventory, citation_inventory, args.max_density_drop)
        if args.compare_citation_inventory
        else []
    )
    if args.write_citation_inventory:
        payload_text = json.dumps(inventory_payload(citation_inventory), indent=2, sort_keys=True) + "\n"
        args.write_citation_inventory.write_text(payload_text, encoding="utf-8")

    if args.citation_inventory and not args.json:
        print(json.dumps(inventory_payload(citation_inventory), indent=2, sort_keys=True))
    elif args.compare_citation_inventory and not (
        args.audit_sources or args.audit_source_quality or args.attention
    ):
        print(render_inventory_regressions(inventory_regressions, args.top))
    elif args.write_citation_inventory and not (
        args.audit_sources or args.audit_source_quality or args.attention
    ):
        print(f"Wrote citation inventory: {args.write_citation_inventory}")
    elif args.json:
        attention_scores = [
            score for score in scores if is_attention_candidate(score, args.threshold, args.large_paragraphs)
        ]
        payload = {
            "threshold": args.threshold,
            "min_paragraphs": args.min_paragraphs,
            "large_paragraphs": args.large_paragraphs,
            "files_scanned": len(scores),
            "files_eligible": len(eligible),
            "files_below_threshold": len(below),
            "scores": [asdict(score) for score in sorted(scores, key=lambda s: s.path)],
            "attention_scores": [
                asdict(score)
                for score in sorted(
                    attention_scores,
                    key=lambda s: (
                        {"low": 0, "unknown": 1, "medium": 2}.get(s.confidence.lower(), 3),
                        -s.uncited,
                        s.density,
                        s.path,
                    ),
                )
            ],
            "source_issues": [asdict(issue) for issue in source_quality_issues] if args.audit_sources else [],
            "source_quality_issues": [asdict(issue) for issue in source_quality_issues],
            "citation_inventory": [asdict(item) for item in citation_inventory],
            "citation_inventory_regressions": [asdict(regression) for regression in inventory_regressions],
        }
        print(json.dumps(payload, indent=2))
    else:
        if args.attention:
            print(
                render_attention_report(
                    scores,
                    args.threshold,
                    args.top,
                    args.min_paragraphs,
                    args.large_paragraphs,
                )
            )
        else:
            print(render_text(scores, args.threshold, args.top, args.min_paragraphs))
        if args.audit_sources or args.audit_source_quality:
            print()
            print(render_source_quality_audit(source_quality_issues, args.top))
        if args.compare_citation_inventory:
            print()
            print(render_inventory_regressions(inventory_regressions, args.top))

    if args.strict and (below or source_quality_issues):
        return 1
    if args.strict_sources and source_quality_issues:
        return 1
    if args.strict_inventory and inventory_regressions:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
