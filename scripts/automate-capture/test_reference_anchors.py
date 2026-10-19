import dataclasses
import pathlib
import re

import pytest


ROOT = pathlib.Path(__file__).resolve().parents[2]
HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)


@dataclasses.dataclass(frozen=True)
class AnchorCase:
    reference_path: str
    context: str
    citation: str
    target_path: str
    start: int
    end: int
    needles: tuple[str, ...]


# references/zia/dlp.md and content-inspection-extras.md were converted to the knowledge graph; their
# API facts are now cited by keyed pointer (zia.dlp.rule-wire-shape, zia.file-type-control.api-shape) and
# checked by `node scripts/kb.mjs validate`. references/zpa/api-divergences.md and references/zcc/api-divergences.md went the same way (zpa.api.*, zcc.api.*), and so did the shared and
# Cloud & Branch Connector docs (shared.oneapi.*, shared.secret-surfaces.*, cloud-connector.*).
CASES = [
    AnchorCase(
        "references/_meta/clarifications.md",
        "A live ZIA `web_dlp_rules` GET returns",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:116456-116468",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        116456,
        116468,
        ("web-dlp-rule-resource-add-rule", '"method": "POST"', '"path": "/webDlpRules"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "A live ZIA `web_dlp_rules` GET returns",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:125032-125069",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        125032,
        125069,
        ('"name": "notificationTemplate"', '"type": "object"', '"name": "notificationTemplate.id"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-21 snapshot check**",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:147831-147872",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        147831,
        147872,
        ('"name": "notificationTemplate"', '"name": "notificationTemplate.id"', '"response_status": "200"'),
    ),
    AnchorCase(
        "references/_meta/clarifications.md",
        "**2026-06-21 snapshot check**",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:182270-182307",
        "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        182270,
        182307,
        ('"name": "notificationTemplate"', '"name": "notificationTemplate.id"'),
    ),
]


def uncommented(text: str) -> str:
    return HTML_COMMENT_RE.sub("", text)


def context_block(text: str, context: str) -> str:
    active = uncommented(text)
    assert active.count(context) == 1, f"expected one active context: {context!r}"
    context_line = next(line for line in active.splitlines() if context in line)
    if context_line.lstrip().startswith("|"):
        return context_line
    for block in re.split(r"\n\s*\n", active):
        if context in block:
            return block
    raise AssertionError(f"context not found in an active paragraph: {context!r}")


def assert_citation_in_context(text: str, context: str, citation: str) -> None:
    block = context_block(text, context)
    assert f"`{citation}`" in block, (
        f"citation {citation!r} is absent from the paragraph containing {context!r}"
    )


@pytest.mark.parametrize("case", CASES, ids=lambda case: case.context[:48])
def test_regenerated_artifact_citation_content(case: AnchorCase):
    assert case.citation.startswith(f"{case.target_path}:")
    reference = (ROOT / case.reference_path).read_text(encoding="utf-8")
    assert_citation_in_context(reference, case.context, case.citation)

    lines = (ROOT / case.target_path).read_text(encoding="utf-8").splitlines()
    assert 1 <= case.start <= case.end <= len(lines)
    excerpt = "\n".join(lines[case.start - 1 : case.end])
    for needle in case.needles:
        assert needle in excerpt


def test_each_tested_citation_occurrence_has_its_own_context_case():
    grouped: dict[tuple[str, str], list[AnchorCase]] = {}
    for case in CASES:
        grouped.setdefault((case.reference_path, case.citation), []).append(case)

    for (reference_path, citation), cases in grouped.items():
        active = uncommented((ROOT / reference_path).read_text(encoding="utf-8"))
        assert active.count(f"`{citation}`") == len(cases)
        assert len({case.context for case in cases}) == len(cases)


def test_comment_only_citation_does_not_satisfy_context_check():
    text = "Claim paragraph.\n\n<!-- Claim paragraph. `vendor/example.json:10` -->"
    with pytest.raises(AssertionError):
        assert_citation_in_context(text, "Claim paragraph.", "vendor/example.json:10")


def test_shorthand_after_wrong_path_does_not_satisfy_fully_qualified_citation():
    text = "Claim paragraph (`vendor/wrong.json:10`, `:20`)."
    with pytest.raises(AssertionError):
        assert_citation_in_context(text, "Claim paragraph", "vendor/intended.json:20")


def test_each_of_two_occurrences_is_bound_to_its_intended_context():
    citation = "vendor/example.json:10"
    text = (
        f"First claim (`{citation}`).\n\n"
        f"Second claim (`{citation}`)."
    )
    assert_citation_in_context(text, "First claim", citation)
    assert_citation_in_context(text, "Second claim", citation)

    missing_second = text.replace(f"Second claim (`{citation}`).", "Second claim.")
    assert_citation_in_context(missing_second, "First claim", citation)
    with pytest.raises(AssertionError):
        assert_citation_in_context(missing_second, "Second claim", citation)


def test_same_count_table_row_move_does_not_satisfy_second_context():
    citation = "vendor/example.json:10"
    baseline = (
        "| Claim | Evidence |\n"
        "|---|---|\n"
        f"| First claim | `{citation}` |\n"
        f"| Second claim | `{citation}` |"
    )
    assert_citation_in_context(baseline, "First claim", citation)
    assert_citation_in_context(baseline, "Second claim", citation)

    moved = baseline.replace(
        f"| First claim | `{citation}` |",
        f"| First claim | `{citation}`; `{citation}` |",
    ).replace(f"| Second claim | `{citation}` |", "| Second claim | none |")
    assert moved.count(f"`{citation}`") == baseline.count(f"`{citation}`")
    assert_citation_in_context(moved, "First claim", citation)
    with pytest.raises(AssertionError):
        assert_citation_in_context(moved, "Second claim", citation)
