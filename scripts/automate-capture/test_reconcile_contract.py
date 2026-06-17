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
    ansible_category, build_report, contract_category, extract_ansible_argument_spec_fields,
    extract_ansible_sdk_calls, extract_go_struct_fields, extract_python_model_fields,
    extract_python_service_fields, extract_python_service_methods, extract_tf_schema_fields,
    go_category, snake_to_camel,
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

TF_FRAMEWORK_FIXTURE = """
func nestedHelper() schema.SingleNestedBlock {
    return schema.SingleNestedBlock{
        Attributes: map[string]schema.Attribute{
            "nested_leak": schema.StringAttribute{
                Required: true,
                Validators: []validator.String{
                    stringvalidator.OneOf("nested"),
                },
            },
        },
    }
}

func (r *ThingResource) Schema(ctx context.Context, req resource.SchemaRequest, resp *resource.SchemaResponse) {
    resp.Schema = schema.Schema{
        Attributes: map[string]schema.Attribute{
            "id": schema.StringAttribute{
                Computed: true,
            },
            "name": schema.StringAttribute{
                Required: true,
            },
            "mode": schema.StringAttribute{
                Optional: true,
                Validators: []validator.String{
                    stringvalidator.OneOf("A", "B"),
                },
            },
            "helper_list": stringListOC("helper"),
            "settings": schema.SingleNestedAttribute{
                Optional: true,
                Computed: true,
                Attributes: map[string]schema.Attribute{
                    "child_must_not_leak": schema.BoolAttribute{
                        Required: true,
                    },
                },
            },
        },
        Blocks: map[string]schema.Block{
            "block_must_not_leak": nestedHelper(),
        },
    }
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
def test_tf_plugin_framework_top_level_attributes_only():
    f = extract_tf_schema_fields(TF_FRAMEWORK_FIXTURE)
    assert set(f) == {"id", "name", "mode", "helperList", "settings"}, set(f)
    assert "nestedLeak" not in f and "childMustNotLeak" not in f, \
        "nested Plugin Framework attributes must not be captured"
    assert "blockMustNotLeak" not in f, "nested Plugin Framework blocks must not be captured"
    assert f["id"]["computed"] is True and f["id"]["required"] is False
    assert f["name"]["required"] is True
    assert f["mode"]["enum"] == ["A", "B"]
    assert f["helperList"]["inline"] is False and f["helperList"]["required"] is None
    assert f["settings"]["inline"] is True and f["settings"]["computed"] is True


ANSIBLE_FIXTURE = '''
MODE_CHOICES = ["A", "B"]

def main():
    port_spec = dict(
        leaked=dict(type="str", required=True, choices=["nested"]),
    )
    argument_spec = {}
    argument_spec.update(
        dict(
            name=dict(type="str", required=True),
            mode=dict(type="str", choices=MODE_CHOICES),
            count=dict(type="int", required=False),
            enabled=dict(type="bool"),
            tags=dict(type="list", elements="str"),
            port_ranges=dict(type="list", elements="dict", options=port_spec, required=False),
            state=dict(type="str", choices=["present", "absent"], default="present"),
        )
    )
    client.foo.create(name="x")
'''


@case
def test_ansible_argument_spec_top_level_enum_required_and_nested_options():
    f = extract_ansible_argument_spec_fields(ANSIBLE_FIXTURE)
    assert set(f) == {"name", "mode", "count", "enabled", "tags", "portRanges"}, set(f)
    assert "leaked" not in f, "nested options= fields must not be captured"
    assert "state" not in f, "module lifecycle state is not an API field"
    assert f["name"]["required"] is True
    assert f["mode"]["enum"] == ["A", "B"]
    assert f["count"]["category"] == "number"
    assert f["enabled"]["category"] == "boolean"
    assert f["tags"]["category"] == "array"
    assert f["portRanges"]["category"] == "array"


@case
def test_ansible_sdk_calls_extracted():
    assert extract_ansible_sdk_calls(ANSIBLE_FIXTURE) == ["client.foo.create"]


PYTHON_MODEL_FIXTURE = '''
class Thing:
    def __init__(self, config=None):
        if config:
            self.id = config["id"] if "id" in config else None
            self.enabled = config["enabled"] if "enabled" in config else False
            self.tags = ZscalerCollection.form_list(config["tags"] if "tags" in config else [], str)
            self.port_ranges = []
            if "portRanges" in config:
                for port_range in config["portRanges"]:
                    self.port_ranges.append({"from": port_range.get("from"), "to": port_range.get("to")})

    def request_format(self):
        current_obj_format = {
            "id": self.id,
            "enabled": self.enabled,
            "tags": self.tags,
            "portRanges": [{"from": pr["from"], "to": pr["to"]} for pr in self.port_ranges],
        }
        return current_obj_format

class Other:
    def __init__(self, config=None):
        if config:
            self.should_not_leak = config["shouldNotLeak"] if "shouldNotLeak" in config else None

    def request_format(self):
        return {"alsoShouldNotLeak": self.should_not_leak}
'''


PYTHON_SERVICE_FIXTURE = '''
class ThingAPI:
    def get_thing(self):
        request, error = self._request_executor.create_request("GET", "/thing")
        result = {"id": 1, "display_name": "x"}
        return result

    def update_thing(self, **kwargs):
        payload = {
            "displayName": kwargs.get("display_name"),
            "enabled": kwargs.get("enabled"),
            "portRanges": [{"from": item["from"], "to": item["to"]} for item in kwargs.get("port_ranges", [])],
        }
        request, error = self._request_executor.create_request("PUT", "/thing", payload)
        return request

    def sibling_thing(self):
        payload = {"siblingOnly": True}
        request, error = self._request_executor.create_request("PUT", "/sibling", payload)
        return request
'''


@case
def test_python_model_fields_target_class_and_top_level_request_format():
    f = extract_python_model_fields(PYTHON_MODEL_FIXTURE, "Thing")
    assert set(f) == {"id", "enabled", "tags", "portRanges"}, set(f)
    assert "from" not in f and "to" not in f, "nested list-comprehension dict keys must not leak"
    assert "shouldNotLeak" not in f and "alsoShouldNotLeak" not in f, "sibling classes must not leak"
    assert f["tags"]["category"] == "array"


@case
def test_python_service_fields_method_scoped_and_snake_to_camel():
    methods = extract_python_service_methods(PYTHON_SERVICE_FIXTURE)
    assert methods == ["get_thing", "sibling_thing", "update_thing"], methods
    f = extract_python_service_fields(PYTHON_SERVICE_FIXTURE, ["get_thing", "update_thing"])
    assert set(f) == {"id", "displayName", "enabled", "portRanges"}, set(f)
    assert "from" not in f and "to" not in f, "nested payload dict keys must not leak"
    assert "siblingOnly" not in f, "sibling service methods must not leak"


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
    assert ansible_category("str") == "string"
    assert ansible_category("int") == "number"
    assert ansible_category("bool") == "boolean"
    assert ansible_category("list") == "array"
    assert ansible_category("dict") == "object"
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
    assert report["totals"]["ansible_resources"] == 13, report["totals"]
    assert report["totals"]["ansible_no_surface"] == 3, report["totals"]
    assert report["totals"]["python_resources"] == 16, report["totals"]
    assert report["totals"]["python_no_surface"] == 0, report["totals"]
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
    ansible_conflicts = {d["field"] for d in aseg["ansible"]["enum"]["value_conflict"]}
    assert ansible_conflicts == {"tcpProtocols", "udpProtocols"}, \
        aseg["ansible"]["enum"]["value_conflict"]
    assert "tcpProtocols" in set(aseg["python"]["presence"]["contract_unmatched_in_python"]), \
        aseg["python"]["presence"]["contract_unmatched_in_python"]
    assert "to" not in set(aseg["python"]["presence"]["python_only_vs_contract"]), \
        aseg["python"]["presence"]["python_only_vs_contract"]
    # P2#3: extranetDTO matches extranet_dto by case-fold -> not "unmatched".
    assert "extranetDTO" not in set(sg["presence"]["contract_unmatched_in_tf"]), \
        sg["presence"]["contract_unmatched_in_tf"]


@case
def test_integration_zia_registry():
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
    assert len(report["resources"]) == 54, len(report["resources"])
    assert "api-authentication" in report["contract_only_groups"], report["contract_only_groups"]
    assert report["totals"]["ansible_resources"] == 52, report["totals"]
    assert report["totals"]["ansible_no_surface"] == 2, report["totals"]
    assert report["totals"]["python_resources"] == 54, report["totals"]
    assert report["totals"]["python_no_surface"] == 0, report["totals"]
    for name in (
        "advanced_settings", "advanced_threat_settings", "atp_malicious_urls",
        "atp_malware_inspection", "atp_malware_policy", "atp_malware_protocols",
        "atp_malware_settings", "atp_security_exceptions", "auth_settings_urls",
        "browser_control_policy", "end_user_notification", "ftp_control_policy",
        "mobile_malware_protection_policy", "security_policy_settings",
        "url_filtering_and_cloud_app_settings",
    ):
        resource = next(r for r in report["resources"] if r["resource"] == name)
        assert resource["required_drift"] == [], (name, resource["required_drift"])
        assert resource["ansible"]["required_drift"] == [], (name, resource["ansible"]["required_drift"])
    security_settings = next(r for r in report["resources"] if r["resource"] == "security_policy_settings")
    assert security_settings["counts"]["contract"] == 2, security_settings["counts"]
    assert security_settings["counts"]["tf"] == 2, security_settings["counts"]
    assert security_settings["python"]["counts"]["python"] == 2, security_settings["python"]
    malware_policy = next(r for r in report["resources"] if r["resource"] == "atp_malware_policy")
    assert malware_policy["python"]["presence"]["contract_unmatched_in_python"] == [], \
        malware_policy["python"]
    nss = next(r for r in report["resources"] if r["resource"] == "nss_server")
    assert nss["python"]["presence"] == {
        "contract_unmatched_in_python": [],
        "python_only_vs_contract": [],
    }, nss["python"]["presence"]
    admin_role = next(r for r in report["resources"] if r["resource"] == "admin_role")
    assert any(d["field"] == "roleType" for d in admin_role["enum"]["value_conflict"]), \
        admin_role["enum"]["value_conflict"]
    forwarding_rule = next(r for r in report["resources"] if r["resource"] == "forwarding_rule")
    assert any(d["field"] == "forwardMethod" for d in forwarding_rule["enum"]["value_conflict"]), \
        forwarding_rule["enum"]["value_conflict"]
    url_rule = next(r for r in report["resources"] if r["resource"] == "url_filtering_rule")
    assert any(d["field"] == "action" for d in url_rule["enum"]["value_conflict"]), \
        url_rule["enum"]["value_conflict"]
    conflict_fields = {d["field"] for d in nss["enum"]["value_conflict"]}
    assert conflict_fields == {"status", "type"}, nss["enum"]["value_conflict"]
    location = next(r for r in report["resources"] if r["resource"] == "location")
    assert any(d["field"] == "profile" for d in location["enum"]["value_conflict"]), \
        location["enum"]["value_conflict"]
    dlp_dictionary = next(r for r in report["resources"] if r["resource"] == "dlp_dictionary")
    dlp_conflicts = {d["field"] for d in dlp_dictionary["enum"]["value_conflict"]}
    assert dlp_conflicts == {"customPhraseMatchType", "dictionaryType"}, \
        dlp_dictionary["enum"]["value_conflict"]
    vpn = next(r for r in report["resources"] if r["resource"] == "vpn_credential")
    assert any(d["field"] == "type" for d in vpn["enum"]["value_conflict"]), \
        vpn["enum"]["value_conflict"]
    assert any(d["field"] == "type" for d in vpn["ansible"]["enum"]["value_conflict"]), \
        vpn["ansible"]["enum"]["value_conflict"]
    casb_dlp = next(r for r in report["resources"] if r["resource"] == "casb_dlp_rule")
    casb_conflicts = {d["field"] for d in casb_dlp["enum"]["value_conflict"]}
    assert casb_conflicts == {"contentLocation", "type"}, casb_dlp["enum"]["value_conflict"]
    expected_required = {
        "bandwidth_control_rule": {"name", "order"},
        "casb_dlp_rule": {"name"},
        "casb_malware_rule": {"name"},
        "cloud_app_control_rule": {"order"},
        "firewall_dns_rule": {"action", "rank"},
        "firewall_filtering_rule": {"order"},
        "firewall_ips_rule": {"action", "rank"},
        "nat_control_rule": {"order", "rank"},
    }
    for name, fields in expected_required.items():
        resource = next(r for r in report["resources"] if r["resource"] == name)
        actual = {d["field"] for d in resource["required_drift"]}
        assert actual == fields, (name, resource["required_drift"])


@case
def test_integration_zcc_ztw_registries():
    zcc_tf = os.path.join(ROOT, "vendor/terraform-provider-zcc/internal/framework/resources/"
                                "forwarding_profile.go")
    ztw_tf = os.path.join(ROOT, "vendor/terraform-provider-ztc/ztc/resource_ztc_dns_gateway.go")
    zcc_contract = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler/zcc-api-reference.json")
    ztw_contract = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler/"
                                      "zcloudconnector-api-reference.json")
    if not (os.path.exists(zcc_tf) and os.path.exists(ztw_tf)
            and os.path.exists(zcc_contract) and os.path.exists(ztw_contract)):
        print("    (skipped: ZCC/ZTW vendor sources not present)")
        return
    import json
    os.environ["REPO_ROOT"] = ROOT

    zcc = build_report(json.load(open(zcc_contract, encoding="utf-8")), "zcc")
    assert len(zcc["resources"]) == 4, len(zcc["resources"])
    assert zcc["totals"]["python_resources"] == 4, zcc["totals"]
    assert zcc["totals"]["ansible_no_surface"] == 4, zcc["totals"]
    assert any("zcc_trusted_network" in note for note in zcc["scope_notes"]), zcc["scope_notes"]
    device_cleanup = next(r for r in zcc["resources"] if r["resource"] == "device_cleanup")
    assert device_cleanup["counts"]["contract"] == 10, device_cleanup["counts"]
    assert "object" not in device_cleanup["presence"]["contract_only_vs_go"], device_cleanup["presence"]
    forwarding_profile = next(r for r in zcc["resources"] if r["resource"] == "forwarding_profile")
    assert {d["field"] for d in forwarding_profile["required_drift"]} == {"name"}, \
        forwarding_profile["required_drift"]

    ztw = build_report(json.load(open(ztw_contract, encoding="utf-8")), "zcloudconnector")
    assert ztw["display"] == "ZTW", ztw
    assert len(ztw["resources"]) == 16, len(ztw["resources"])
    assert "public" in ztw["contract_only_groups"], ztw["contract_only_groups"]
    assert "location_management" not in {r["resource"] for r in ztw["resources"]}
    assert ztw["totals"]["ansible_resources"] == 0 and ztw["totals"]["ansible_no_surface"] == 16, \
        ztw["totals"]
    assert ztw["totals"]["python_resources"] == 12 and ztw["totals"]["python_no_surface"] == 4, \
        ztw["totals"]
    dns_gateway = next(r for r in ztw["resources"] if r["resource"] == "dns_gateway")
    assert {d["field"] for d in dns_gateway["enum"]["value_conflict"]} == {
        "dnsGatewayType", "ecDnsGatewayOptionsPrimary", "ecDnsGatewayOptionsSecondary", "failureBehavior"
    }, dns_gateway["enum"]["value_conflict"]
    provisioning_url = next(r for r in ztw["resources"] if r["resource"] == "provisioning_url")
    assert any(d["field"] == "provUrlType" for d in provisioning_url["enum"]["value_conflict"]), \
        provisioning_url["enum"]["value_conflict"]
    forwarding_rule = next(r for r in ztw["resources"] if r["resource"] == "traffic_forwarding_rule")
    assert any(d["field"] == "forwardMethod" for d in forwarding_rule["enum"]["value_conflict"]), \
        forwarding_rule["enum"]["value_conflict"]
    dns_rule = next(r for r in ztw["resources"] if r["resource"] == "traffic_forwarding_dns_rule")
    assert any(d["field"] == "action" for d in dns_rule["enum"]["value_conflict"]), \
        dns_rule["enum"]["value_conflict"]


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
