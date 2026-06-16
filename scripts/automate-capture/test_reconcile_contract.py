#!/usr/bin/env python3
"""Tests for reconcile_contract.py.

The extractors are the trust boundary of the reconciler, so they're pinned with
inline source fixtures (deterministic, no submodule dependency). A final
integration smoke test runs the real reconciliation if the vendor submodules are
present, asserting only stable invariants (skipped otherwise)."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))

from reconcile_contract import (  # noqa: E402
    build_report, contract_category, extract_go_struct_fields,
    extract_tf_schema_fields, go_category, snake_to_camel,
)

CASES = []


def case(fn):
    CASES.append(fn)
    return fn


# Two structs so the brace-bounded extraction is tested: only Thing's fields, and
# `json:"-"` excluded, and Other's field must NOT bleed in.
GO_FIXTURE = """
package x

type Thing struct {
\tID      string   `json:"id,omitempty"`
\tCount   int64    `json:"count,omitempty"`
\tEnabled bool     `json:"enabled"`
\tTags    []string `json:"tags,omitempty"`
\tSub     SubType  `json:"sub,omitempty"`
\tIgnored string   `json:"-"`
}

type Other struct {
\tShouldNotAppear string `json:"shouldNotAppear,omitempty"`
}
"""


@case
def test_go_struct_boundary_and_categories():
    f = extract_go_struct_fields(GO_FIXTURE, "Thing")
    assert set(f) == {"id", "count", "enabled", "tags", "sub"}, set(f)
    assert "shouldNotAppear" not in f, "fields from a sibling struct must not leak"
    assert f["id"]["category"] == "string"
    assert f["count"]["category"] == "number"
    assert f["enabled"]["category"] == "boolean"
    assert f["tags"]["category"] == "array"
    assert f["sub"]["category"] == "object"


@case
def test_go_struct_missing_returns_empty():
    assert extract_go_struct_fields(GO_FIXTURE, "Nonexistent") == {}


# TF schema with a nested Elem block whose key must NOT be captured at top level.
TF_FIXTURE = """
func resourceThing() *schema.Resource {
\treturn &schema.Resource{
\t\tSchema: map[string]*schema.Schema{
\t\t\t"name": {
\t\t\t\tType:     schema.TypeString,
\t\t\t\tRequired: true,
\t\t\t},
\t\t\t"mode": {
\t\t\t\tType:     schema.TypeString,
\t\t\t\tOptional: true,
\t\t\t\tValidateFunc: validation.StringInSlice([]string{
\t\t\t\t\t"A", "B", "C",
\t\t\t\t}, false),
\t\t\t},
\t\t\t"computed_id": {
\t\t\t\tType:     schema.TypeString,
\t\t\t\tComputed: true,
\t\t\t},
\t\t\t"block": {
\t\t\t\tType:     schema.TypeList,
\t\t\t\tOptional: true,
\t\t\t\tElem: &schema.Resource{
\t\t\t\t\tSchema: map[string]*schema.Schema{
\t\t\t\t\t\t"leaked": {
\t\t\t\t\t\t\tType:     schema.TypeString,
\t\t\t\t\t\t\tRequired: true,
\t\t\t\t\t\t},
\t\t\t\t\t},
\t\t\t\t},
\t\t\t},
\t\t},
\t}
}
"""


@case
def test_tf_schema_top_level_and_enum():
    f = extract_tf_schema_fields(TF_FIXTURE)
    assert set(f) == {"name", "mode", "computedId", "block"}, set(f)
    assert "leaked" not in f, "nested Elem schema keys must not be captured"
    assert f["name"]["required"] is True
    assert f["mode"]["enum"] == ["A", "B", "C"]
    assert f["computedId"]["computed"] is True and f["computedId"]["required"] is False


@case
def test_snake_to_camel():
    assert snake_to_camel("version_profile_id") == "versionProfileId"
    assert snake_to_camel("name") == "name"
    assert snake_to_camel("dns_query_type") == "dnsQueryType"


@case
def test_categories():
    assert go_category("string") == "string"
    assert go_category("int64") == "number"
    assert go_category("[]string") == "array"
    assert go_category("*SubType") == "object"
    assert contract_category("int64") == "number"
    assert contract_category("string[]") == "array"
    assert contract_category("boolean") == "boolean"
    assert contract_category(None) is None


@case
def test_integration_stable_invariants():
    # Real reconciliation if vendor submodules + contract are present; else skip.
    go = os.path.join(ROOT, "vendor/zscaler-sdk-go/zscaler/zpa/services/"
                            "appconnectorgroup/zpa_app_connector_group.go")
    contract = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json")
    if not (os.path.exists(go) and os.path.exists(contract)):
        print("    (skipped: vendor sources not present)")
        return
    import json
    os.environ["REPO_ROOT"] = ROOT
    report = build_report(json.load(open(contract, encoding="utf-8")))
    acg = next(r for r in report["resources"] if r["resource"] == "app_connector_group")
    # Numeric-as-string is foundational ZPA behavior — `id` must show type drift.
    drift = {d["field"] for d in acg["type_drift"]}
    assert "id" in drift, drift
    # dnsQueryType enum aligns exactly between contract and TF.
    assert "dnsQueryType" in acg["enum"]["match"], acg["enum"]
    # configSpace is the known contract-stricter required case (server_group).
    sg = next(r for r in report["resources"] if r["resource"] == "server_group")
    cs = [d for d in sg["required_drift"] if d["field"] == "configSpace"]
    assert cs and cs[0]["direction"] == "contract_stricter", sg["required_drift"]


def main():
    failed = 0
    for fn in CASES:
        try:
            fn()
            print(f"PASS {fn.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"FAIL {fn.__name__}: {e}")
        except Exception as e:
            failed += 1
            print(f"ERROR {fn.__name__}: {type(e).__name__}: {e}")
    print(f"\n{len(CASES) - failed}/{len(CASES)} passed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
