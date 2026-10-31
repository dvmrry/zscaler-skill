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
