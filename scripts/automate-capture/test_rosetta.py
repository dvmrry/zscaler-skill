#!/usr/bin/env python3
"""Tests for rosetta.py.

These pin the synthesis trust boundary with inline divergence-report fixtures.
They do not depend on the full captured snapshot or vendor submodules.
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from rosetta import THIN_PRODUCTS, build_issue_routing, build_rosetta  # noqa: E402

CASES = []


def case(fn):
    CASES.append(fn)
    return fn


FIXTURE_REPORTS = {
    "zia": {
        "product": "zia",
        "contract_json": "vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json",
        "resources": [
            {
                "resource": "thing",
                "method": "POST",
                "path": "/zia/api/v1/things",
                "counts": {"contract": 5, "go": 5, "tf": 4},
                "presence": {
                    "contract_only_vs_go": ["docOnly"],
                    "go_only_vs_contract": ["clientExtra"],
                    "contract_unmatched_in_tf": ["docOnly"],
                },
                "type_drift": [{"field": "id", "contract": "int64", "go": "string"}],
                "required_drift": [{
                    "field": "name",
                    "contract_required": False,
                    "tf_required": True,
                    "direction": "tf_stricter",
                }],
                "readonly": [{"field": "id", "tf_computed": True, "agree": True}],
                "enum": {
                    "match": [],
                    "value_conflict": [{
                        "field": "mode",
                        "contract": ["A", "B"],
                        "tf": ["A"],
                    }],
                    "one_sided": [
                        {"field": "country", "contract": ["US"], "tf": None},
                        {"field": "scope", "contract": None, "tf": ["X", "Y"]},
                    ],
                },
                "python": {
                    "surface": "present",
                    "repo": "zscaler-sdk-python",
                    "paths": ["vendor/zscaler-sdk-python/zscaler/zia/things.py"],
                    "methods": ["add_thing"],
                    "counts": {"python": 5},
                    "presence": {
                        "contract_unmatched_in_python": ["docOnly"],
                        "python_only_vs_contract": ["clientExtra"],
                    },
                },
                "ansible": {
                    "surface": "present",
                    "repo": "ziacloud-ansible",
                    "path": "vendor/ziacloud-ansible/plugins/modules/zia_thing.py",
                    "sdk_calls": ["client.things.add_thing"],
                    "counts": {"ansible": 4},
                    "presence": {
                        "contract_unmatched_in_ansible": ["docOnly"],
                        "ansible_only_vs_contract": ["ansibleExtra"],
                    },
                    "required_drift": [{
                        "field": "mode",
                        "contract_required": False,
                        "ansible_required": True,
                        "direction": "ansible_stricter",
                        "repo": "ziacloud-ansible",
                        "path": "vendor/ziacloud-ansible/plugins/modules/zia_thing.py",
                    }],
                    "enum": {
                        "match": [],
                        "value_conflict": [{
                            "field": "requestMethods",
                            "contract": ["GET", "POST"],
                            "ansible": ["GET", "POST", "PROPFIND"],
                            "repo": "ziacloud-ansible",
                            "path": "vendor/ziacloud-ansible/plugins/modules/zia_thing.py",
                        }],
                        "one_sided": [{
                            "field": "scope",
                            "contract": None,
                            "ansible": ["X", "Y", "Z"],
                            "repo": "ziacloud-ansible",
                            "path": "vendor/ziacloud-ansible/plugins/modules/zia_thing.py",
                        }],
                    },
                },
                "mcp": {
                    "surface": "present",
                    "field_surface": "present",
                    "repo": "zscaler-mcp-server",
                    "paths": ["vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/things.py"],
                    "tools": ["zia_create_thing"],
                    "sdk_calls": ["client.zia.things.add_thing"],
                    "counts": {"mcp_tools": 1, "mcp_fields": 4},
                    "presence": {
                        "contract_unmatched_in_mcp": ["docOnly"],
                        "mcp_only_vs_contract": [],
                    },
                },
            }
        ],
        "totals": {},
    }
}

FIXTURE_CONTRACT_FIELDS = {
    ("zia", "thing"): {
        "id": {"name": "id", "type": "int64", "required": False, "readonly": True, "enum": None},
        "name": {"name": "name", "type": "string", "required": False, "readonly": False, "enum": None},
        "mode": {"name": "mode", "type": "string", "required": False, "readonly": False, "enum": ["A", "B"]},
        "country": {"name": "country", "type": "string", "required": False, "readonly": False, "enum": ["US"]},
        "docOnly": {"name": "docOnly", "type": "string", "required": False, "readonly": False, "enum": None},
        "requestMethods": {
            "name": "requestMethods",
            "type": "string[]",
            "required": False,
            "readonly": False,
            "enum": ["GET", "POST"],
        },
    }
}


def row_by_field(rows, field):
    for row in rows:
        if row["field"] == field:
            return row
    raise AssertionError(f"missing row for {field}")


@case
def test_contract_only_registry_includes_ai_security():
    assert THIN_PRODUCTS["ai-security"] == "AI Security"


@case
def test_bucket_inversion_to_cells():
    rosetta = build_rosetta(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS)
    rows = rosetta["rows"]

    doc_only = row_by_field(rows, "docOnly")
    assert doc_only["columns"]["contract"] == "✓"
    assert doc_only["columns"]["go"] == "—"
    assert doc_only["columns"]["tf"] == "—"
    assert doc_only["columns"]["python"] == "—"
    assert doc_only["columns"]["ansible"] == "—"
    assert doc_only["columns"]["mcp"] == "—"

    client_extra = row_by_field(rows, "clientExtra")
    assert client_extra["columns"]["contract"] == "—"
    assert client_extra["columns"]["go"] == "✓"
    assert client_extra["columns"]["python"] == "✓"

    name = row_by_field(rows, "name")
    assert name["columns"]["tf"] == "✓ req"

    mode = row_by_field(rows, "mode")
    assert mode["columns"]["tf"] == "✓ enum≠"
    assert mode["columns"]["ansible"] == "✓ req"

    request_methods = row_by_field(rows, "requestMethods")
    assert request_methods["columns"]["ansible"] == "✓ enum≠"

    readonly_id = row_by_field(rows, "id")
    assert readonly_id["columns"]["contract"] == "✓ ro"
    assert readonly_id["columns"]["go"] == "✓ type"
    assert readonly_id["columns"]["tf"] == "✓ ro"


@case
def test_routing_rules_and_evidence():
    worklist = build_issue_routing(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS)
    rows = worklist["rows"]

    client_extra = [
        r for r in rows
        if r["field"] == "clientExtra" and r["divergence_type"] == "surface_only_vs_contract"
    ]
    assert len(client_extra) == 1
    assert client_extra[0]["target_repo"] == "automate.zscaler.com docs"
    assert client_extra[0]["confidence"] == "HIGH", client_extra[0]
    assert client_extra[0]["evidence"]["surfaces"] == ["go", "python"]

    tf_required = [
        r for r in rows
        if r["field"] == "name" and r["divergence_type"] == "required_drift"
    ][0]
    assert tf_required["target_repo"] == "zscaler/terraform-provider-zia"
    assert tf_required["confidence"] == "MEDIUM"

    tf_enum_subset = [
        r for r in rows
        if r["field"] == "mode" and r["divergence_type"] == "tf_enum_value_conflict"
    ][0]
    assert tf_enum_subset["target_repo"] == "zscaler/terraform-provider-zia"
    assert tf_enum_subset["confidence"] == "HIGH"

    ansible_enum_superset = [
        r for r in rows
        if r["field"] == "requestMethods" and r["divergence_type"] == "ansible_enum_value_conflict"
    ][0]
    assert ansible_enum_superset["target_repo"] == "automate.zscaler.com docs"
    assert ansible_enum_superset["source_repo"] == "zscaler/ziacloud-ansible"
    assert ansible_enum_superset["evidence"]["ansible_values"] == ["GET", "POST", "PROPFIND"]

    mcp_gap = [
        r for r in rows
        if r["field"] == "docOnly" and r["divergence_type"] == "contract_unmatched_in_mcp"
    ][0]
    assert mcp_gap["target_repo"] == "zscaler/zscaler-mcp-server"
    assert mcp_gap["confidence"] == "LOW"

    type_drift = [r for r in rows if r["field"] == "id" and r["divergence_type"] == "type_drift"][0]
    assert type_drift["target_repo"] == "zscaler/zscaler-sdk-go"
    assert type_drift["confidence"] == "LOW"

    # one-sided enum, contract constrains but client does not -> client repo, LOW
    country = [r for r in rows if r["field"] == "country" and r["divergence_type"] == "enum_one_sided"]
    assert len(country) == 1, country
    assert country[0]["direction"] == "client_missing_enum_validation"
    assert country[0]["target_repo"] == "zscaler/terraform-provider-zia"
    assert country[0]["confidence"] == "LOW"
    assert country[0]["evidence"]["contract_values"] == ["US"]

    # one-sided enum, client constrains but contract does not, on 2 surfaces -> docs, HIGH (corroborated)
    scope = [r for r in rows if r["field"] == "scope" and r["divergence_type"] == "enum_one_sided"]
    assert len(scope) == 1, "corroborating surfaces must collapse into one docs ticket"
    assert scope[0]["direction"] == "client_enum_not_documented"
    assert scope[0]["target_repo"] == "automate.zscaler.com docs"
    assert scope[0]["confidence"] == "HIGH"
    assert scope[0]["source_surface"] == "ansible,tf"
    assert scope[0]["evidence"]["tf_values"] == ["X", "Y"]
    assert scope[0]["evidence"]["ansible_values"] == ["X", "Y", "Z"]


def main():
    failures = []
    for fn in CASES:
        try:
            fn()
            print(f"ok {fn.__name__}")
        except Exception as exc:  # noqa: BLE001
            failures.append((fn.__name__, exc))
            print(f"FAIL {fn.__name__}: {exc}", file=sys.stderr)
    if failures:
        raise SystemExit(1)
    print(f"{len(CASES)}/{len(CASES)} rosetta tests passed")


if __name__ == "__main__":
    main()
