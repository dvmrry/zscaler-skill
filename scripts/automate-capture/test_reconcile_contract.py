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
\tMeta    map[string]interface{} `json:"meta,omitempty"`
\tIgnored string   `json:"-"`
}

type Other struct {
\tShouldNotAppear string `json:"shouldNotAppear,omitempty"`
}
"""


@case
def test_go_struct_boundary_and_categories():
    f = extract_go_struct_fields(GO_FIXTURE, "Thing")
    assert set(f) == {"id", "count", "enabled", "tags", "sub", "meta"}, set(f)
    assert "shouldNotAppear" not in f, "fields from a sibling struct must not leak"
    assert f["id"]["category"] == "string"
    assert f["count"]["category"] == "number"
    assert f["enabled"]["category"] == "boolean"
    assert f["tags"]["category"] == "array"
    assert f["sub"]["category"] == "object"
    assert f["meta"]["category"] == "object"


@case
def test_go_struct_missing_returns_empty():
    assert extract_go_struct_fields(GO_FIXTURE, "Nonexistent") == {}


# TF schema exercising: nested Elem (must not leak), commented-out attributes (must
# be ignored), a helper-valued key (present but flags unknown), and an acronym key.
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
\t\t\t"legacy_mode": {
\t\t\t\tType:     schema.TypeString,
\t\t\t\tOptional: true,
\t\t\t\t// Computed: true,
\t\t\t\t// ValidateFunc: validation.StringInSlice([]string{"X", "Y"}, false),
\t\t\t},
\t\t\t"port_range": resourceNetworkPortsSchema(),
\t\t\t"extranet_dto": {
\t\t\t\tType:     schema.TypeList,
\t\t\t\tOptional: true,
\t\t\t},
\t\t\t"block": {
\t\t\t\tType:     schema.TypeList,
\t\t\t\tOptional: true,
\t\t\t\tElem: &schema.Resource{
\t\t\t\t\tSchema: map[string]*schema.Schema{
\t\t\t\t\t\t"leaked": {
\t\t\t\t\t\t\tType:     schema.TypeString,
\t\t\t\t\t\t\tRequired: true,
\t\t\t\t\t\t\tValidateFunc: validation.StringInSlice([]string{"nested"}, false),
\t\t\t\t\t\t},
\t\t\t\t\t},
\t\t\t\t},
\t\t\t},
\t\t},
\t}
}
"""


TF_HELPER_BEFORE_RESOURCE_FIXTURE = """
func getPolicyRuleResourceSchema() *schema.Resource {
\treturn &schema.Resource{
\t\tSchema: map[string]*schema.Schema{
\t\t\t"helper_only": {
\t\t\t\tType:     schema.TypeString,
\t\t\t\tRequired: true,
\t\t\t},
\t\t},
\t}
}

func resourceThing() *schema.Resource {
\treturn &schema.Resource{
\t\tSchema: map[string]*schema.Schema{
\t\t\t"name": {
\t\t\t\tType:     schema.TypeString,
\t\t\t\tRequired: true,
\t\t\t},
\t\t\t"policy_rule_resource": getPolicyRuleResourceSchema(),
\t\t},
\t}
}
"""


@case
def test_tf_schema_top_level_and_enum():
    f = extract_tf_schema_fields(TF_FIXTURE)
    assert set(f) == {"name", "mode", "computedId", "legacyMode", "portRange",
                      "extranetDto", "block"}, set(f)
    assert "leaked" not in f, "nested Elem schema keys must not be captured"
    assert f["name"]["required"] is True
    assert f["mode"]["enum"] == ["A", "B", "C"]
    assert f["computedId"]["computed"] is True and f["computedId"]["required"] is False
    assert f["block"]["enum"] is None, "nested schema enums must not attach to parent fields"


@case
def test_tf_commented_attributes_ignored():
    # commented-out Computed / StringInSlice must NOT be read as live schema
    f = extract_tf_schema_fields(TF_FIXTURE)
    assert f["legacyMode"]["computed"] is False, f["legacyMode"]
    assert f["legacyMode"]["enum"] is None, f["legacyMode"]


@case
def test_tf_helper_valued_key_present_flags_unknown():
    # "port_range": resourceNetworkPortsSchema() is present, with unreadable flags
    f = extract_tf_schema_fields(TF_FIXTURE)
    assert "portRange" in f, "helper-valued keys must count as present"
    assert f["portRange"]["inline"] is False
    assert f["portRange"]["required"] is None and f["portRange"]["enum"] is None


@case
def test_tf_schema_anchors_to_resource_function_not_helper_schema():
    f = extract_tf_schema_fields(TF_HELPER_BEFORE_RESOURCE_FIXTURE)
    assert set(f) == {"name", "policyRuleResource"}, set(f)
    assert "helperOnly" not in f, "helper schemas before the resource must not be scanned"
    assert f["name"]["required"] is True
    assert f["policyRuleResource"]["inline"] is False


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
    assert contract_category("SanitizedString50 (string)") == "string"
    assert contract_category("SanitizedString50 (string)[]") == "array"
    assert contract_category("SimStatusEnum (string)") == "string"
    assert contract_category("byte") == "number"
    assert contract_category("SomeObject[]") == "array"
    assert contract_category("boolean") == "boolean"
    assert contract_category(None) is None


@case
def test_integration_stable_invariants():
    # Real reconciliation if vendor submodules + contract are present; else skip.
    go = os.path.join(ROOT, "vendor/zscaler-sdk-go/zscaler/zpa/services/"
                            "appconnectorgroup/zpa_app_connector_group.go")
    tf = os.path.join(ROOT, "vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go")
    contract = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json")
    if not (os.path.exists(go) and os.path.exists(tf) and os.path.exists(contract)):
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
    # --- the three review false-positives must stay fixed ---
    # P1#1: version_profile_id's StringInSlice is commented out in TF -> no enum.
    assert not any(e["field"] == "versionProfileId" for e in acg["enum"]["one_sided"]), \
        acg["enum"]["one_sided"]
    # P1#2: tcp/udp port ranges are helper-valued TF keys -> matched, not unmatched.
    aseg = next(r for r in report["resources"] if r["resource"] == "application_segment")
    unmatched = set(aseg["presence"]["contract_unmatched_in_tf"])
    assert "tcpPortRange" not in unmatched and "udpPortRange" not in unmatched, unmatched
    # P2#3: extranetDTO matches extranet_dto by case-fold -> not "unmatched".
    assert "extranetDTO" not in set(sg["presence"]["contract_unmatched_in_tf"]), \
        sg["presence"]["contract_unmatched_in_tf"]


@case
def test_integration_zia_starter_registry():
    # Real reconciliation if vendor submodules + contract are present; else skip.
    go = os.path.join(ROOT, "vendor/zscaler-sdk-go/zscaler/zia/services/"
                            "cloudnss/nss_servers/nss_servers.go")
    tf = os.path.join(ROOT, "vendor/terraform-provider-zia/zia/resource_zia_nss_server.go")
    contract = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json")
    if not (os.path.exists(go) and os.path.exists(tf) and os.path.exists(contract)):
        print("    (skipped: ZIA vendor sources not present)")
        return
    import json
    os.environ["REPO_ROOT"] = ROOT
    report = build_report(json.load(open(contract, encoding="utf-8")), "zia")
    assert len(report["resources"]) == 13, len(report["resources"])
    nss = next(r for r in report["resources"] if r["resource"] == "nss_server")
    conflict_fields = {d["field"] for d in nss["enum"]["value_conflict"]}
    assert conflict_fields == {"status", "type"}, nss["enum"]["value_conflict"]
    location = next(r for r in report["resources"] if r["resource"] == "location")
    assert any(d["field"] == "profile" for d in location["enum"]["value_conflict"]), \
        location["enum"]["value_conflict"]


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
