"""Regression tests for source coverage matching in check-vendor-drift.py."""

import importlib.util
import json
from pathlib import Path
import subprocess
import sys

import pytest


SCRIPT = Path(__file__).with_name("check-vendor-drift.py")
REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("check_vendor_drift", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def test_exact_source_matches_only_the_named_file():
    assert MODULE.source_matches_changed_path(
        "zscaler/zia/services/pacfiles/pacfiles.go",
        "zscaler/zia/services/pacfiles/pacfiles.go",
    )
    assert not MODULE.source_matches_changed_path(
        "zscaler/zia/services/pacfiles/pacfiles.go",
        "zscaler/zia/services/cloudappcontrol/cloudappcontrol.go",
    )


def test_recursive_wildcard_matches_nested_service_file():
    assert MODULE.source_matches_changed_path(
        "zscaler/zia/services/**",
        "zscaler/zia/services/pacfiles/pacfiles.go",
    )
    assert MODULE.source_matches_changed_path(
        "zscaler/zia/services/**/*.go",
        "zscaler/zia/services/deep/package/resource.go",
    )


def test_single_component_wildcard_does_not_cross_directories():
    assert MODULE.source_matches_changed_path(
        "zscaler/zia/services/*.go",
        "zscaler/zia/services/resource.go",
    )
    assert not MODULE.source_matches_changed_path(
        "zscaler/zia/services/*.go",
        "zscaler/zia/services/pacfiles/pacfiles.go",
    )


def test_directory_source_matches_descendants_but_not_siblings():
    assert MODULE.source_matches_changed_path(
        "zscaler/zia/services/",
        "zscaler/zia/services/pacfiles/pacfiles.go",
    )
    assert not MODULE.source_matches_changed_path(
        "zscaler/zia/services/",
        "zscaler/zpa/services/applicationsegment/application_segment.go",
    )


def test_empty_relative_source_matches_whole_submodule_root():
    # ``vendor/zscaler-sdk-go/`` is stripped to this root sentinel before the
    # helper receives it. It must cover both root-level and nested changes.
    assert MODULE.source_matches_changed_path("", "CHANGELOG.md")
    assert MODULE.source_matches_changed_path(
        "", "zscaler/zia/services/pacfiles/pacfiles.go"
    )


def test_zia_cac_release_gate_records_source_fix_without_race_claim():
    reference = (REPO_ROOT / "references/zia/api-divergences.md").read_text()
    maintenance = (REPO_ROOT / "scripts/README.md").read_text()

    assert "copies `doneCh` while `rules.Lock()` is held" in reference
    assert "ordinary unit coverage is not race-detector proof" in reference
    assert "refresh makes no race-test claim" in reference
    assert "copying `doneCh` while `rules.Lock()` is held" in maintenance
    assert "No repeated race-detector run is recorded" in maintenance
    assert "`zia-72`" in maintenance


def test_pinned_zia_provider_captures_reorder_done_before_unlock():
    source = (
        REPO_ROOT / "vendor/terraform-provider-zia/zia/common.go"
    ).read_text()
    function_start = source.index("func reorderWithBeforeReorder(")
    function_end = source.index("\n}\n\n// waitForReorder", function_start)
    function = source[function_start:function_end]

    unlock = function.index("rules.Unlock()")
    map_read = function.index("doneCh := rules.reorderDone[resourceType]")
    assert map_read < unlock


def git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def init_repo(repo: Path) -> str:
    repo.mkdir(parents=True)
    subprocess.run(["git", "init", "-q", str(repo)], check=True)
    git(repo, "config", "user.email", "test@example.invalid")
    git(repo, "config", "user.name", "Drift Test")
    (repo / "source.go").write_text("package source\n")
    git(repo, "add", "source.go")
    return git(repo, "commit", "-qm", "initial") or git(repo, "rev-parse", "HEAD")


def test_changed_files_fails_on_an_actual_uninitialized_git_diff(tmp_path, monkeypatch):
    module = tmp_path / "vendor" / "example"
    module.mkdir(parents=True)
    monkeypatch.setattr(MODULE, "REPO_ROOT", tmp_path)

    with pytest.raises(MODULE.VendorDiffError) as caught:
        MODULE.changed_files("vendor/example", "a" * 40, "b" * 40)

    error = caught.value
    assert error.submodule_path == "vendor/example"
    assert error.old_sha == "a" * 40
    assert error.new_sha == "b" * 40
    assert "not initialized" in error.reason
    assert "git diff failed (exit " in error.reason


def test_changed_files_fails_on_an_initialized_missing_object(tmp_path, monkeypatch):
    module = tmp_path / "vendor" / "example"
    current = init_repo(module)
    monkeypatch.setattr(MODULE, "REPO_ROOT", tmp_path)

    with pytest.raises(MODULE.VendorDiffError) as caught:
        MODULE.changed_files("vendor/example", "deadbeef" * 5, current)

    error = caught.value
    assert error.submodule_path == "vendor/example"
    assert error.old_sha == "deadbeef" * 5
    assert error.new_sha == current
    assert "git diff failed" in error.reason
    assert "not initialized" not in error.reason
    assert "Invalid revision range" in error.reason


def run_main_json(
    monkeypatch,
    capsys,
    current_sha: str,
    captured_sha: str,
    changed=None,
    initialized: bool = True,
    marker: str = " ",
):
    status = MODULE.SubmoduleStatus(
        path="vendor/example",
        sha=current_sha,
        initialized=initialized,
        marker=marker,
    )
    monkeypatch.setattr(
        MODULE,
        "get_current_submodule_status",
        lambda: MODULE.SubmoduleStatusResult({status.path: status}),
    )
    if changed is not None:
        monkeypatch.setattr(MODULE, "changed_files", lambda *args: changed)
    monkeypatch.setattr(
        sys,
        "argv",
        ["check-vendor-drift.py", "--json"],
    )
    assert MODULE.main() in {0, 1}
    return json.loads(capsys.readouterr().out)


def test_main_reports_valid_unchanged_and_changed_comparisons(tmp_path, monkeypatch, capsys):
    monkeypatch.setattr(MODULE, "REPO_ROOT", tmp_path)
    refs = tmp_path / "references"
    refs.mkdir()
    (refs / "unchanged.md").write_text(
        "---\nsources:\n  - vendor/example/source.go\n"
        "verified-against:\n  vendor/example: same\n---\n"
    )
    same = run_main_json(monkeypatch, capsys, "same", "same", changed=set())
    assert same["current_count"] == 1
    assert same["drifted_high_priority"] == []
    assert same["drifted_low_priority"] == []
    assert same["indeterminate"] == []

    (refs / "unchanged.md").write_text(
        "---\nsources:\n  - vendor/example/source.go\n"
        "verified-against:\n  vendor/example: old\n---\n"
    )
    changed = run_main_json(monkeypatch, capsys, "new", "old", changed={"source.go"})
    assert changed["current_count"] == 0
    assert len(changed["drifted_high_priority"]) == 1
    assert changed["drifted_low_priority"] == []
    assert changed["indeterminate"] == []


def test_main_propagates_failed_comparison_as_indeterminate(tmp_path, monkeypatch, capsys):
    monkeypatch.setattr(MODULE, "REPO_ROOT", tmp_path)
    refs = tmp_path / "references"
    refs.mkdir()
    (refs / "broken.md").write_text(
        "---\nsources:\n  - vendor/example/source.go\n"
        "verified-against:\n  vendor/example: old\n---\n"
    )
    status = MODULE.SubmoduleStatus(
        path="vendor/example",
        sha="new",
        initialized=True,
        marker=" ",
    )
    monkeypatch.setattr(
        MODULE,
        "get_current_submodule_status",
        lambda: MODULE.SubmoduleStatusResult({status.path: status}),
    )
    monkeypatch.setattr(
        MODULE,
        "changed_files",
        lambda *args: (_ for _ in ()).throw(
            MODULE.VendorDiffError("vendor/example", "old", "new", "missing source object")
        ),
    )
    monkeypatch.setattr(sys, "argv", ["check-vendor-drift.py", "--json"])

    assert MODULE.main() == 1
    report = json.loads(capsys.readouterr().out)
    assert report["current_count"] == 0
    assert report["drifted_low_priority"] == []
    assert report["indeterminate_count"] == 1
    assert report["indeterminate"] == [{
        "ref": "references/broken.md",
        "submodule": "vendor/example",
        "captured_sha": "old",
        "current_sha": "new",
        "reason": "missing source object",
    }]


def test_main_does_not_count_equal_pins_in_an_uninitialized_submodule(
    tmp_path, monkeypatch, capsys
):
    monkeypatch.setattr(MODULE, "REPO_ROOT", tmp_path)
    refs = tmp_path / "references"
    refs.mkdir()
    (refs / "uninitialized.md").write_text(
        "---\nsources:\n  - vendor/example/source.go\n"
        "verified-against:\n  vendor/example: same\n---\n"
    )

    report = run_main_json(
        monkeypatch,
        capsys,
        "same",
        "same",
        initialized=False,
        marker="-",
    )

    assert report["current_count"] == 0
    assert report["indeterminate_count"] == 1
    assert report["drifted_low_priority"] == []
    assert "not initialized" in report["indeterminate"][0]["reason"]


def test_main_accepts_the_provenance_contracts_annotated_sha(tmp_path, monkeypatch, capsys):
    monkeypatch.setattr(MODULE, "REPO_ROOT", tmp_path)
    refs = tmp_path / "references"
    refs.mkdir()
    sha = "4b7101202cde25e1e60552f1cb215d2c70cdc3bd"
    recorded = f"{sha} (new ZPA service surface section)"
    (refs / "annotated.md").write_text(
        "---\nsources:\n  - vendor/example/source.go\n"
        f"verified-against:\n  vendor/example: {recorded}\n---\n"
    )
    report = run_main_json(monkeypatch, capsys, sha, recorded)
    assert report["current_count"] == 1
    assert report["indeterminate_count"] == 0
    assert report["drifted_low_priority"] == []
