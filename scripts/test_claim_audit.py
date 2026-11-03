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


def test_a_verdict_is_about_the_statement_and_the_evidence():
    claim = {"statement": "Rules stop at the first match.", "evidence": [{"source": "s", "path": "p", "quotes": ["stops"]}]}
    same = dict(claim, tier="A", conditions="ignored")
    assert claim_audit.fingerprint(claim) == claim_audit.fingerprint(same)
    assert claim_audit.fingerprint(claim) != claim_audit.fingerprint(dict(claim, statement="Rules stop at the last match."))
    assert claim_audit.fingerprint(claim) != claim_audit.fingerprint(dict(claim, evidence=[]))


def test_a_quote_in_code_carries_its_enclosing_function(monkeypatch):
    monkeypatch.setattr(claim_audit, "source_text", lambda *a: "package x\n\nfunc Activate() {\n\treturn post(\"/status/activate\")\n}\n")
    assert claim_audit.context("sdk-go", "a.go", "HEAD", 'return post("/status/activate")') == ["func Activate() {"]


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
