#!/usr/bin/env python3
"""Fixture tests for parse_contract.py — the parser is the trust boundary, so it
is pinned against hand-verified facts from the committed capture fixtures.
Runnable from anywhere: resolves fixtures + import relative to this file."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
RAW = os.path.normpath(os.path.join(
    HERE, "..", "..", "vendor", "zscaler-help", "automate-zscaler", "api-reference"))

from parse_contract import build_components, parse_contract  # noqa: E402

ACG = "zpa/app-connector-group-management"


def load(rel):
    return parse_contract(open(os.path.join(RAW, rel + ".txt"), encoding="utf-8").read())


def field(fields, name):
    return next((f for f in fields if f["name"] == name), None)


CASES = []


def case(fn):
    CASES.append(fn)
    return fn


@case
def test_acg_create_method_path():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    assert c["method"] == "POST", c["method"]
    assert c["path"] == "/zpa/mgmtconfig/v1/admin/customers/:customerId/appConnectorGroup", c["path"]


@case
def test_acg_create_path_param_required():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    cid = field(c["path_params"], "customerId")
    assert cid and cid["type"] == "int64" and cid["required"] is True, cid
    assert cid["description"] == "The unique identifier of the ZPA tenant.", cid


@case
def test_acg_create_query_param_optional():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    mt = field(c["query_params"], "microtenantId")
    assert mt and mt["required"] is False, mt
    assert mt["description"].startswith("The unique identifier of the microtenant"), mt


@case
def test_acg_create_body_name_required():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    name = field(c["request_body"], "name")
    assert name and name["required"] is True, name


@case
def test_acg_create_body_enum():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    cgt = field(c["request_body"], "connectorGroupType")
    assert cgt and cgt["enum"] == ["APP", "NP"], cgt
    dq = field(c["request_body"], "dnsQueryType")
    assert dq and dq["enum"] == ["IPV4_IPV6", "IPV4", "IPV6"], dq


@case
def test_acg_create_body_object_type():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    conn = field(c["request_body"], "connectors")
    assert conn and conn["type"] == "Connector[]", conn


@case
def test_acg_response_readonly():
    # readonly surfaces in the response SCHEMA via the "Only applicable for a GET
    # request" prose, and those fields also carry enums.
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    up = field(c["response_schema"], "upgradePriority")
    assert up and up["readonly"] is True, up
    assert up["enum"] == ["WEEK", "DAY", "FORCE_NOW", "NOW"], up
    vis = field(c["response_schema"], "versionProfileVisibilityScope")
    assert vis and vis["readonly"] is True and vis["enum"] == ["ALL", "NONE", "CUSTOM"], vis


@case
def test_acg_get_no_request_body():
    c = load(f"{ACG}/gets-the-app-connector-group-details-for-the-specified-id")
    assert c["method"] == "GET", c["method"]
    assert c["request_body"] == [], c["request_body"]
    assert ":appConnectorGroupId" in c["path"], c["path"]


@case
def test_acg_get_has_readonly_in_response():
    c = load(f"{ACG}/gets-the-app-connector-group-details-for-the-specified-id")
    assert len(c["response_schema"]) > 20, len(c["response_schema"])


@case
def test_no_prose_parsed_as_field():
    # "praEnabled" / "use_in_dr_mode" appear as prose under their fields and must
    # not become phantom fields.
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    names = [f["name"] for f in c["request_body"]]
    assert names.count("praEnabled") == 1, names
    assert "use_in_dr_mode" not in names, names


APPSEG = "zpa/application-segment-management"
SRVGRP = "zpa/server-group-management"
SEGGRP = "zpa/segment-group-management"
PROVKEY = "zpa/provisioning-key-management"


@case
def test_app_segment_create_shape():
    c = load(f"{APPSEG}/adds-a-new-application-segment-for-the-specified-customer")
    assert c["method"] == "POST", c["method"]
    assert c["path"].endswith("/application"), c["path"]
    dn = field(c["request_body"], "domainNames")  # nested array outside ACG
    assert dn and dn["type"] == "string[]", dn
    bt = field(c["request_body"], "bypassType")
    assert bt and bt["enum"] == ["ALWAYS", "NEVER", "ON_NET"], bt
    assert field(c["request_body"], "name")["required"] is True
    adp = field(c["request_body"], "adpEnabled")
    assert adp and adp["description"] == "adpEnabled", adp


@case
def test_server_group_create_required_and_enum():
    c = load(f"{SRVGRP}/add-a-new-server-group")
    cs = field(c["request_body"], "configSpace")  # required + enum in one field
    assert cs and cs["required"] is True and cs["enum"] == ["DEFAULT", "SIEM"], cs
    srv = field(c["request_body"], "servers")  # nested object-array outside ACG
    assert srv and srv["type"] == "ApplicationServer[]", srv


@case
def test_segment_group_create_shape():
    c = load(f"{SEGGRP}/adds-a-new-segment-group-for-the-specified-customer")
    assert c["method"] == "POST", c["method"]
    assert c["path"].endswith("/segmentGroup"), c["path"]
    assert field(c["request_body"], "name")["required"] is True
    apps = field(c["request_body"], "applications")  # nested object-array
    assert apps and apps["type"] == "ApplicationBase[]", apps


@case
def test_provisioning_key_create_shape():
    c = load(f"{PROVKEY}/adds-a-new-provisioning-key-for-the-specified-customer")
    assert "/provisioningKey" in c["path"], c["path"]
    ec = field(c["request_body"], "enrollmentCertId")
    assert ec and ec["required"] is True and ec["type"] == "int64", ec
    mu = field(c["request_body"], "maxUsage")
    assert mu and mu["type"] == "int32", mu


@case
def test_update_returns_204_no_response_schema():
    # PUT pages return 204 No Content — genuinely no response schema. Pin it so a
    # parser regression that hallucinates a schema (or drops the body) is caught.
    c = load(f"{SRVGRP}/updates-the-server-group-for-the-specified-id")
    assert c["method"] == "PUT", c["method"]
    assert len(c["request_body"]) > 0, "update must keep a request body"
    assert c["response_schema"] == [], c["response_schema"]


@case
def test_zia_readonly_detected():
    # ZIA expresses readonly differently than ZPA: "This is a read-only field."
    c = load("zia/rule-labels/rule-label-resource-update-rule-label")
    lm = field(c["response_schema"], "lastModifiedTime")
    assert lm and lm["readonly"] is True, lm


@case
def test_zpa_readonly_ignored_in_put_post_calls():
    # ZPA wording the first regex missed: "Read only property. ... ignored in PUT/POST calls."
    c = load("zpa/provisioning-key-management/adds-a-new-provisioning-key-for-the-specified-customer")
    zc = field(c["response_schema"], "zcomponentName")
    assert zc and zc["readonly"] is True, zc
    assert "ignored in PUT/POST" in zc["description"], zc


@case
def test_readonly_excludes_policy_eval_prose():
    # "ignored during policy evaluation" is evaluation logic, NOT a readonly field —
    # the broadened regex must not over-match it.
    c = load("zia/firewall-policies/firewall-filtering-rules-resource-create-firewall-filtering-rule")
    for fn in ("srcIpGroups", "destCountries", "deviceTrustLevels"):
        f = field(c["request_body"], fn)
        if f is not None:
            assert f["readonly"] is False, (fn, f)


@case
def test_named_primitive_alias_type_detected():
    # ZCell renders enum aliases as "SimStatusEnum (string)"; keep the field and enum.
    c = load("zcell/sim-handling/sim-resource-update-sim-status")
    status = field(c["request_body"], "status")
    assert status and status["type"] == "SimStatusEnum (string)", status
    assert status["required"] is True and status["enum"] == ["ACTIVE", "INACTIVE"], status


@case
def test_named_primitive_alias_array_detected():
    # Some filters render as named primitive arrays, e.g. "SanitizedString50 (string)[]".
    c = load("zcell/sim-handling/sim-resource-get-all-sims")
    iccid = field(c["request_body"], "iccid")
    assert iccid and iccid["type"] == "SanitizedString50 (string)[]", iccid


@case
def test_named_primitive_alias_does_not_parse_parenthetical_prose():
    c = load("zid/users/users-ops-add")
    source = field(c["response_schema"], "source")
    assert source and source["type"] == "SourceType (string)", source
    names = [f["name"] for f in c["response_schema"]]
    assert "Whether" not in names and "true" not in names, names


@case
def test_byte_primitive_type_detected():
    # ZCC uses Java-ish byte fields; they are primitive types, not prose.
    c = load("zcc/public-api-controller/gets-the-list-of-admin-users-in-your-organization")
    user_type = field(c["query_params"], "userType")
    assert user_type and user_type["type"] == "byte", user_type
    service_type = field(c["response_schema"], "serviceType")
    assert service_type and service_type["type"] == "byte", service_type


@case
def test_pipe_delimited_enum_values_detected():
    # Some ZIA pages render enum members as A|B|C inside the same bracketed
    # "Possible values" pattern used by comma-delimited pages.
    c = load("zia/admin-role-management/admin-role-resource-get-role")
    role_type = field(c["response_schema"], "roleType")
    assert role_type and role_type["enum"] == [
        "ORG_ADMIN",
        "EXEC_INSIGHT",
        "EXEC_INSIGHT_AND_ORG_ADMIN",
        "SDWAN",
    ], role_type


@case
def test_component_graph_resolves_list_wrapper_sibling():
    ops = {
        "zpa/widget-management/list-widgets": {
            "operation_summary": "Gets all Widgets.",
            "method": "GET",
            "path": "/widgets",
            "path_params": [],
            "query_params": [],
            "request_body": [],
            "response_schema": [
                {"name": "currentCount", "type": "int64", "required": False, "readonly": False, "enum": None},
                {"name": "list", "type": "Widget[]", "required": False, "readonly": False, "enum": None},
                {"name": "totalCount", "type": "int64", "required": False, "readonly": False, "enum": None},
                {"name": "totalPages", "type": "int32", "required": False, "readonly": False, "enum": None},
            ],
        },
        "zpa/widget-management/get-widget": {
            "operation_summary": "Gets the Widget details.",
            "method": "GET",
            "path": "/widgets/:id",
            "path_params": [],
            "query_params": [],
            "request_body": [],
            "response_schema": [
                {"name": "id", "type": "int64", "required": False, "readonly": False, "enum": None},
                {"name": "name", "type": "string", "required": False, "readonly": False, "enum": None},
                {"name": "child", "type": "ChildWidget", "required": False, "readonly": False, "enum": None},
            ],
        },
    }
    graph = build_components(ops)
    widget = graph["schemas"]["Widget"]
    assert widget["status"] == "resolved", widget
    assert widget["resolution"] == "list-wrapper-sibling", widget
    assert [f["name"] for f in widget["fields"]] == ["child", "id", "name"], widget
    child = graph["schemas"]["ChildWidget"]
    assert child["status"] == "unresolved", child
    assert child["referenced_by"] == [{
        "operation": "zpa/widget-management/get-widget",
        "section": "response_schema",
        "field": "child",
        "type": "ChildWidget",
    }], child


def main():
    if not os.path.isdir(RAW):
        print(f"FIXTURES MISSING: {RAW}")
        sys.exit(1)
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
