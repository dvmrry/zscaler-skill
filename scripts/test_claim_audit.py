"""Tests for the claim audit (scripts/claim_audit.py): verdict rule, fingerprints, quote context."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import claim_audit  # noqa: E402

v = lambda verdict, confidence="high": {"verdict": verdict, "confidence": confidence, "uncovered": []}  # noqa: E731


def test_a_confident_flag_from_either_model_is_overreach_and_an_unsure_one_is_borderline():
    assert claim_audit.combine(v("overreach"), None) == "overreach"
    assert claim_audit.combine(v("covered"), v("overreach")) == "overreach"
    assert claim_audit.combine(v("covered"), v("overreach", "low")) == "borderline"
    assert claim_audit.combine(v("overreach", "low"), v("covered")) == "borderline"
    assert claim_audit.combine(v("covered"), v("covered")) == "covered"


def test_a_verdict_is_about_the_statement_the_evidence_and_the_conditions():
    claim = {"statement": "Rules stop at the first match.", "evidence": [{"source": "s", "path": "p", "quotes": ["stops"]}]}
    assert claim_audit.fingerprint(claim) == claim_audit.fingerprint(dict(claim, tier="A"))
    assert claim_audit.fingerprint(claim) != claim_audit.fingerprint(dict(claim, statement="Rules stop at the last match."))
    assert claim_audit.fingerprint(claim) != claim_audit.fingerprint(dict(claim, evidence=[]))
    # Conditions record the search behind an absence, so a change to them asks for a new verdict.
    searched = dict(claim, conditions="grep -n last p returns nothing")
    assert claim_audit.fingerprint(searched) != claim_audit.fingerprint(claim)
    assert claim_audit.fingerprint(searched) != claim_audit.fingerprint(dict(searched, conditions="grep -n final p returns nothing"))


def test_a_quote_in_code_carries_its_enclosing_function(monkeypatch):
    monkeypatch.setattr(claim_audit, "source_text", lambda *a: "package x\n\nfunc Activate() {\n\treturn post(\"/status/activate\")\n}\n")
    assert claim_audit.context("sdk-go", "a.go", "HEAD", 'return post("/status/activate")') == ["func Activate() {"]


def test_a_quote_in_a_table_cell_carries_its_row_and_the_header_row(monkeypatch):
    page = ("# Admin roles\n\n## Permissions\n\n| Module | Full | View Only |\n| --- | --- | --- |\n"
            "| Users | Assign and remove users | See users |\n| Roles | Assign roles | See roles |\n"
            "|  | Restricted: assign roles in own tenants | |\n")
    monkeypatch.setattr(claim_audit, "source_text", lambda *a: page)
    assert claim_audit.context("zscaler-help", "p.json", "HEAD", "Assign roles") == [
        "# Admin roles", "## Permissions", "| Module | Full | View Only |", "| Roles | Assign roles | See roles |"]
    # A row under a spanned label carries the row that holds the label.
    assert claim_audit.context("zscaler-help", "p.json", "HEAD", "assign roles in own tenants") == [
        "# Admin roles", "## Permissions", "| Module | Full | View Only |", "| Roles | Assign roles | See roles |",
        "|  | Restricted: assign roles in own tenants | |"]
    # A quote from the header row itself carries only the headings.
    assert claim_audit.context("zscaler-help", "p.json", "HEAD", "View Only") == ["# Admin roles", "## Permissions"]


def test_review_marks_the_unstated_parts_and_counts_claims_changed_since_their_audit(monkeypatch):
    kept = {"statement": "Rules stop at the first match, always.", "tier": "A", "evidence": [{"source": "zscaler-help", "path": "p.json", "quotes": ["stops at the first match"]}]}
    edited = {"statement": "Rules run in order.", "tier": "A", "evidence": [{"source": "zscaler-help", "path": "p.json", "quotes": ["in order"]}]}
    monkeypatch.setattr(claim_audit, "subjects", lambda ref=None: iter([{"id": "zia.rules", "claims": {"first": kept, "order": edited}}]))
    monkeypatch.setattr(claim_audit, "record", lambda: {"claims": {
        "zia.rules:first": {"sha": claim_audit.fingerprint(kept), "verdict": "borderline", "uncovered": ["always"]},
        "zia.rules:order": {"sha": "old", "verdict": "borderline"}}})
    md = claim_audit.review(None, ("borderline",))
    assert "### `zia.rules:first` (borderline)" in md and "> Rules stop at the first match, **always**." in md
    assert "`references/zia/zia.rules.json`" in md and '"stops at the first match"' in md
    assert "zia.rules:order" not in md and "1 claim(s) changed since their audit" in md


def test_checklists_link_each_claim_to_its_line_and_split_a_product_that_outgrows_an_issue(monkeypatch, tmp_path):
    subject = tmp_path / "references/zia/zia.rules.json"
    subject.parent.mkdir(parents=True)
    subject.write_text('{\n  "id": "zia.rules",\n  "claims": {\n    "first": {\n      "statement": "x"\n    }\n  }\n}\n')
    claim = {"statement": "Rules stop at the first match, always."}
    flagged = [("zia.rules:first", claim, {"verdict": "borderline", "uncovered": ["always"]}, "references/zia/zia.rules.json")] * 3
    monkeypatch.setattr(claim_audit, "ROOT", tmp_path)
    monkeypatch.setattr(claim_audit, "flagged_claims", lambda base, verdicts: (flagged, 0))
    # With no room to spare, each issue still takes one claim.
    monkeypatch.setattr(claim_audit, "ISSUE_ROOM", 1)
    claim_audit.checklists(("borderline",), tmp_path / "out", sha="abc12345def", repo="https://github.com/o/r")
    files = sorted((tmp_path / "out").iterdir())
    assert [f.name for f in files] == ["zia-1.md", "zia-2.md", "zia-3.md"]
    assert all(f.read_text().count("- [ ] ") == 1 for f in files)
    text = files[0].read_text()
    assert "- [ ] [`zia.rules:first`](https://github.com/o/r/blob/abc12345def/references/zia/zia.rules.json#L4) Rules stop at the first match, **always**." in text
