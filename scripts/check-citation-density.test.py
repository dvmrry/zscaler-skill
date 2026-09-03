#!/usr/bin/env -S uv run --quiet --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Regression tests for scripts/check-citation-density.py source-path linting.

Focus: the ``unquoted-source-path`` source-quality rule must only flag ``vendor/``
or ``scripts/`` paths that appear genuinely outside backticks. A correctly
backticked vendor path that happens to contain a nested ``/scripts/`` segment
(e.g. ``vendor/.../github-actions/scripts/scan_policy.py``) must not be flagged.

This guards the single-character negative-lookbehind bug: the old pattern only
inspected the one character before ``vendor``/``scripts``, so the ``/`` before a
nested ``scripts/`` segment defeated the ``(?<!`)`` lookbehind and a fully
backticked path was wrongly reported as unquoted.

The internal-source rule must likewise recognize only root-relative
``references/`` and ``agents/`` paths. A vendor directory whose name ends in
``-agents`` is not an internal workflow source.

Run directly: ``./scripts/check-citation-density.test.py``
"""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "check-citation-density.py"
_spec = importlib.util.spec_from_file_location("check_citation_density", SCRIPT)
ccd = importlib.util.module_from_spec(_spec)
# Register before exec: the module uses `from __future__ import annotations`
# with @dataclass, and dataclasses resolves string annotations via
# sys.modules[cls.__module__] during class creation.
sys.modules[_spec.name] = ccd
_spec.loader.exec_module(ccd)


class UnquotedSourcePathTest(unittest.TestCase):
    def setUp(self) -> None:
        self._orig_root = ccd.REPO_ROOT
        self._tmp = tempfile.TemporaryDirectory()
        # audit_source_quality derives the relative path against REPO_ROOT, so
        # the fixture file must live under it.
        ccd.REPO_ROOT = Path(self._tmp.name)

    def tearDown(self) -> None:
        ccd.REPO_ROOT = self._orig_root
        self._tmp.cleanup()

    def _unquoted_findings(self, source_line: str) -> list[str]:
        path = Path(self._tmp.name) / "doc.md"
        path.write_text(f"# Doc\n\n{source_line}\n", encoding="utf-8")
        return [
            issue.text
            for issue in ccd.audit_source_quality(path, include_style=True)
            if issue.kind == "unquoted-source-path"
        ]

    def _internal_findings(self, source_line: str) -> list[str]:
        path = Path(self._tmp.name) / "doc.md"
        path.write_text(f"# Doc\n\n{source_line}\n", encoding="utf-8")
        return [
            issue.text
            for issue in ccd.audit_source_quality(path)
            if issue.kind == "internal-source"
        ]

    def test_backticked_path_with_nested_scripts_segment_not_flagged(self) -> None:
        findings = self._unquoted_findings(
            "Source: `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py`."
        )
        self.assertEqual(findings, [])

    def test_two_real_ai_guard_paths_not_flagged(self) -> None:
        findings = self._unquoted_findings(
            "Source: `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py`; "
            "`vendor/zguard-ai-integrations/github-actions/.github/workflows/model-security-scan.yml`."
        )
        self.assertEqual(findings, [])

    def test_genuinely_unquoted_path_still_flagged(self) -> None:
        findings = self._unquoted_findings(
            "Source: vendor/zscaler-sdk-python/zscaler/oneapi_client.py."
        )
        self.assertTrue(findings)

    def test_unquoted_path_alongside_backticked_path_flagged(self) -> None:
        findings = self._unquoted_findings(
            "Source: `vendor/a/b.md` and scripts/loose_helper.py."
        )
        self.assertTrue(findings)

    def test_vendor_directory_ending_in_agents_not_internal(self) -> None:
        findings = self._internal_findings(
            "Source: `vendor/zguard-ai-integrations/AWS/strands-agents/README.md`."
        )
        self.assertEqual(findings, [])

    def test_root_agents_path_still_internal(self) -> None:
        findings = self._internal_findings("Source: `agents/researcher/workflow.md`.")
        self.assertTrue(findings)

    def test_root_references_path_still_internal(self) -> None:
        findings = self._internal_findings("Source: `references/zpa/api.md`.")
        self.assertTrue(findings)

    def test_dot_slash_root_agents_path_still_internal(self) -> None:
        findings = self._internal_findings("Source: `./agents/researcher/workflow.md`.")
        self.assertTrue(findings)

    def test_dot_slash_root_references_path_still_internal(self) -> None:
        findings = self._internal_findings("Source: `./references/zpa/api.md`.")
        self.assertTrue(findings)

    def test_parent_relative_agents_path_not_treated_as_repository_root(self) -> None:
        findings = self._internal_findings("Source: `../agents/researcher/workflow.md`.")
        self.assertEqual(findings, [])

    def test_nested_agents_directory_not_treated_as_repository_root(self) -> None:
        findings = self._internal_findings("Source: `vendor/example/agents/workflow.md`.")
        self.assertEqual(findings, [])

    def test_unicode_letter_prefix_not_treated_as_repository_root(self) -> None:
        findings = self._internal_findings("Source: `éagents/researcher/workflow.md`.")
        self.assertEqual(findings, [])

    def test_unicode_dash_prefix_not_treated_as_repository_root(self) -> None:
        findings = self._internal_findings("Source: `strands‑agents/README.md`.")
        self.assertEqual(findings, [])


if __name__ == "__main__":
    unittest.main()
