"""Focused tests for clarification-ledger status-summary invariants."""

import importlib.util
import sys
from pathlib import Path


SCRIPT = Path(__file__).with_name("check-hygiene.py")
SPEC = importlib.util.spec_from_file_location("check_hygiene", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
check_hygiene = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = check_hygiene
SPEC.loader.exec_module(check_hygiene)


def ledger(summary_counts: str, partial_id: str = "zia-02") -> str:
    return f"""## Status summary

{summary_counts}

### Resolved

`zia-01`, `zpa-01`

### Partially resolved

`{partial_id}`

### Open

`zia-03`–`zia-05`

### Refresh history

Historical prose can mention `zia-01` without changing exact membership.

## Entries

### zia-01 — Resolved entry

**Status**: resolved (2026-01-01)

### zia-02 — Partial entry

**Resolves with**: lab test. **Status**: partially resolved — still bounded.

### zia-03 — Open entry

**Status**: open

### zia-04 — Investigating entry

**Status**: investigating — owner assigned

### zia-05 — Open-candidate entry

**Status**: open candidate

### zpa-01 — Clarified entry

**Status**: clarified by current documentation
"""


def test_valid_summary_matches_detail_statuses_and_expands_ranges() -> None:
    content = ledger(
        "2 entries are resolved or clarified, 1 are partially resolved, and 3 are open."
    )

    assert check_hygiene.clarification_summary_issues(content) == []


def test_range_expansion_crosses_digit_width_without_extra_zero_padding() -> None:
    ids, issues = check_hygiene.expand_clarification_summary_ids(
        "`zcc-98`–`zcc-101`"
    )

    assert issues == []
    assert ids == {"zcc-98", "zcc-99", "zcc-100", "zcc-101"}


def test_range_expansion_rejects_overlapping_membership() -> None:
    _ids, issues = check_hygiene.expand_clarification_summary_ids(
        "`zia-01`–`zia-03`, `zia-02`–`zia-04`"
    )

    assert "duplicate summary ID zia-02" in issues
    assert "duplicate summary ID zia-03" in issues


def test_summary_rejects_wrong_bucket_membership() -> None:
    content = ledger(
        "2 entries are resolved or clarified, 1 are partially resolved, and 3 are open.",
        partial_id="zia-04",
    )

    issues = check_hygiene.clarification_summary_issues(content)

    assert any("partial summary is missing: zia-02" in issue for issue in issues)
    assert any("partial summary has non-partial IDs: zia-04" in issue for issue in issues)
    assert any(
        "zia-04 appears in multiple summary buckets: open, partial" in issue
        for issue in issues
    )


def test_summary_rejects_wrong_recorded_count() -> None:
    content = ledger(
        "1 entries are resolved or clarified, 1 are partially resolved, and 3 are open."
    )

    issues = check_hygiene.clarification_summary_issues(content)

    assert any(
        "status-summary resolved count is 1; detailed entries total 2" in issue
        for issue in issues
    )


def test_detail_rejects_status_outside_summary_taxonomy() -> None:
    content = ledger(
        "2 entries are resolved or clarified, 1 are partially resolved, and 3 are open."
    ).replace("**Status**: open candidate", "**Status**: wontfix")

    issues = check_hygiene.clarification_summary_issues(content)

    assert any("zia-05 has unclassified Status value 'wontfix'" in issue for issue in issues)
