"""Regression tests for the pure agent-pattern support boundary."""

from __future__ import annotations

import ast
import inspect
import unittest
from pathlib import Path

import agent_patterns as ap


class AgentPatternsBoundaryTests(unittest.TestCase):
    def test_imports_stay_on_reviewed_pure_stdlib_allowlist(self) -> None:
        tree = ast.parse(Path(ap.__file__).read_text(encoding="utf-8"))
        imported_roots: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported_roots.update(alias.name.split(".", 1)[0] for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported_roots.add(node.module.split(".", 1)[0])

        allowed = {"__future__", "dataclasses", "json", "re", "typing"}
        self.assertFalse(imported_roots - allowed, imported_roots - allowed)

    def test_public_api_contains_only_pure_reasoning_helpers(self) -> None:
        self.assertEqual(
            set(ap.__all__),
            {
                "GOV_CLOUDS",
                "COMMERCIAL_CLOUDS",
                "CloudClass",
                "AuthFramework",
                "ErrorAction",
                "ErrorInterpretation",
                "detect_cloud",
                "is_gov_cloud",
                "detect_auth_framework",
                "interpret_error",
            },
        )

    def test_credentialed_and_sdk_reflection_helpers_are_absent(self) -> None:
        for name in (
            "smoke_test_creds",
            "enumerate_endpoints",
            "diagnose_tenant",
            "SmokeResult",
            "TenantDiagnosis",
            "SMOKE_CALLS",
        ):
            self.assertFalse(hasattr(ap, name), name)

        module_functions = {
            name
            for name, value in inspect.getmembers(ap, inspect.isfunction)
            if value.__module__ == ap.__name__
        }
        self.assertEqual(
            module_functions,
            {
                "detect_cloud",
                "is_gov_cloud",
                "detect_auth_framework",
                "interpret_error",
            },
        )

    def test_classification_helpers_do_not_mutate_inputs(self) -> None:
        env = {
            "ZSCALER_CLOUD": "zscalergov",
            "ZSCALER_CLIENT_ID": "client",
            "ZSCALER_CLIENT_SECRET": "secret",
            "ZSCALER_VANITY_DOMAIN": "tenant",
        }
        original = dict(env)
        self.assertEqual(ap.detect_cloud(env=env)[0], "gov")
        self.assertEqual(ap.detect_auth_framework(env), "oneapi")
        self.assertEqual(env, original)

    def test_all_documented_government_cloud_values_are_classified(self) -> None:
        for cloud in ("gov", "govus", "zscalergov", "zscalerten", "GOV", "GOVUS"):
            with self.subTest(cloud=cloud):
                env = {"ZSCALER_CLOUD": cloud}
                self.assertEqual(ap.detect_cloud(env=env)[0], "gov")
                self.assertTrue(ap.is_gov_cloud(env=env))

    def test_error_interpretation_is_deterministic(self) -> None:
        first = ap.interpret_error(409, {"code": "EDIT_LOCK_NOT_AVAILABLE"})
        second = ap.interpret_error(409, {"code": "EDIT_LOCK_NOT_AVAILABLE"})
        self.assertEqual(first, second)
        self.assertEqual(first.action, "retry")


if __name__ == "__main__":
    unittest.main()
