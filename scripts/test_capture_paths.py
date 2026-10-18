"""Help captures moved from Markdown to JSON: path changes are references, and old pins still hold."""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
from kb_prose import links_blanked  # noqa: E402

SPEC = importlib.util.spec_from_file_location("check_verified_against", SCRIPTS / "check-verified-against.py")
assert SPEC is not None and SPEC.loader is not None
CVA = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = CVA  # its dataclasses resolve their module by name
SPEC.loader.exec_module(CVA)


def test_renaming_a_help_capture_to_json_is_a_reference_only_edit():
    before = "Per `vendor/zscaler-help/about-url-filtering.md`, rules stop at the first match."
    after = "Per `vendor/zscaler-help/about-url-filtering.json`, rules stop at the first match."
    assert links_blanked(before) == links_blanked(after)
    # A wording change still counts.
    assert links_blanked(before) != links_blanked(after.replace("first", "last"))


def test_a_json_capture_is_checked_against_the_markdown_it_replaced():
    assert CVA.migrated_help_capture("vendor/zscaler-help/about-x.json") == "vendor/zscaler-help/about-x.md"
    assert CVA.migrated_help_capture("vendor/zscaler-help/nss-web-logs.csv") is None
    assert CVA.migrated_help_capture("vendor/zscaler-api-specs/zia.json") is None


def test_a_pin_before_a_capture_replaced_a_retired_file_names_that_file(tmp_path):
    meta = tmp_path / "references" / "_meta"
    meta.mkdir(parents=True)
    (meta / "static-captures.json").write_text(
        '{"schema_version": 1, "files": {}, "retired": {"Old_Article.txt": '
        '{"replaced_by": "old-article.json", "reason": "PDF export", "on": "2026-10-18"}}}'
    )
    found = CVA.predecessors("vendor/zscaler-help/old-article.json", tmp_path)
    assert found == ["vendor/zscaler-help/old-article.md", "vendor/zscaler-help/Old_Article.txt"]
