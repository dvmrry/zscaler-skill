"""Focused tests for maintenance-digest output-path reporting."""

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
