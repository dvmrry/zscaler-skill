"""Regression tests for source coverage matching in check-vendor-drift.py."""

import importlib.util
from pathlib import Path


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
