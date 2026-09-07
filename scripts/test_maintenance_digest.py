"""Focused tests for maintenance-digest output-path reporting."""

import argparse
import importlib.util
import sys
from pathlib import Path


SCRIPT = Path(__file__).with_name("maintenance-digest.py")
SPEC = importlib.util.spec_from_file_location("maintenance_digest", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
maintenance_digest = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = maintenance_digest
SPEC.loader.exec_module(maintenance_digest)


def test_display_path_is_relative_inside_repo() -> None:
    path = maintenance_digest.REPO_ROOT / "_data" / "schemas" / "maintenance-digest.md"

    assert maintenance_digest.display_path(path) == "_data/schemas/maintenance-digest.md"


def test_display_path_accepts_output_outside_repo(tmp_path: Path) -> None:
    path = tmp_path / "maintenance-digest.md"

    assert maintenance_digest.display_path(path) == str(path)


def test_render_preserves_indeterminate_vendor_comparisons(monkeypatch) -> None:
    args = argparse.Namespace(stale_days=60, scrape_days=90)
    vendor = {
        "drifted_high_priority": [],
        "drifted_low_priority": [],
        "unverified": [],
        "indeterminate": [{
            "ref": "references/shared/example.md",
            "submodule": "vendor/example",
            "captured_sha": "a" * 40,
            "current_sha": "b" * 40,
            "reason": "missing commit object",
        }],
    }

    def fake_json(command):
        return vendor if "check-vendor-drift.py" in command[0] else {"stale": []}

    monkeypatch.setattr(maintenance_digest, "stale_refs", lambda days: ([], 0))
    monkeypatch.setattr(maintenance_digest, "scaffold_inventory", lambda: ([], []))
    monkeypatch.setattr(maintenance_digest, "json_from_command", fake_json)
    monkeypatch.setattr(maintenance_digest, "hygiene_eval_warning", lambda: "")

    body = maintenance_digest.render(args)

    assert "**1 indeterminate/unavailable comparisons**" in body
    assert "No indeterminate vendor comparisons." not in body
    assert "Indeterminate vendor comparisons are not unchanged" in body
    assert "missing commit object" in body
    assert "a" * 7 + ".." + "b" * 7 in body


def test_render_does_not_turn_unreadable_vendor_output_into_zero(monkeypatch) -> None:
    args = argparse.Namespace(stale_days=60, scrape_days=90)

    def fake_json(command):
        return {"_error": "check-vendor-drift failed"} if "check-vendor-drift.py" in command[0] else {"stale": []}

    monkeypatch.setattr(maintenance_digest, "stale_refs", lambda days: ([], 0))
    monkeypatch.setattr(maintenance_digest, "scaffold_inventory", lambda: ([], []))
    monkeypatch.setattr(maintenance_digest, "json_from_command", fake_json)
    monkeypatch.setattr(maintenance_digest, "hygiene_eval_warning", lambda: "")

    body = maintenance_digest.render(args)

    assert "**unknown indeterminate/unavailable comparisons**" in body
    assert "failed or produced unreadable output" in body
