#!/usr/bin/env python3
"""Fixture tests for parse_contract.py — the parser is the trust boundary, so it
is pinned against hand-verified facts from the committed ZPA capture fixtures.
Runnable from anywhere: resolves fixtures + import relative to this file."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
RAW = os.path.normpath(os.path.join(
    HERE, "..", "..", "vendor", "zscaler-help", "automate-zscaler", "api-reference"))

from parse_contract import parse_contract  # noqa: E402

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


@case
def test_acg_create_query_param_optional():
    c = load(f"{ACG}/adds-a-new-app-connector-group-for-the-specified-customer")
    mt = field(c["query_params"], "microtenantId")
    assert mt and mt["required"] is False, mt


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
