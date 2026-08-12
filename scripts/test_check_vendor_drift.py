"""Regression tests for source coverage matching in check-vendor-drift.py."""

import importlib.util
from pathlib import Path


SCRIPT = Path(__file__).with_name("check-vendor-drift.py")
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
