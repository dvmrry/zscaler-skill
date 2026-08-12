#!/usr/bin/env python3
"""Tests for rosetta.py.

These pin the synthesis trust boundary with inline divergence-report fixtures.
They do not depend on the full captured snapshot or vendor submodules.
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from rosetta import (  # noqa: E402
    THIN_PRODUCTS,
    build_contract_change_radar,
    build_issue_routing,
    build_rosetta,
    render_issue_markdown,
    render_rosetta_markdown,
)

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
                "counts": {"contract": 5, "go": 5, "tf": 6},
                "presence": {
                    "contract_only_vs_go": ["docOnly"],
                    "go_only_vs_contract": ["clientExtra"],
                    "contract_unmatched_in_tf": ["docOnly"],
                    "tf_corroborates_surface_only": ["clientExtra", "terraformComputedOnly"],
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
        "client_surfaces_without_contract": [
            {
                "name": "new_family",
                "api_paths": ["/zia/api/v1/newFamily"],
                "surfaces": {
                    "go": ["vendor/zscaler-sdk-go/zscaler/zia/services/new_family/new_family.go"],
                    "tf": ["vendor/terraform-provider-zia/zia/resource_zia_new_family.go"],
                },
            }
        ],
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
    assert THIN_PRODUCTS["event-monitoring"] == "Event Monitoring"


@case
def test_unmapped_client_family_is_visible_and_routed():
    rosetta = build_rosetta(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS)
    unmapped = rosetta["boundaries"]["client_surfaces_without_contract"]
    assert unmapped == [{
        "product": "zia",
        "name": "new_family",
        "api_paths": ["/zia/api/v1/newFamily"],
        "surfaces": {
            "go": ["vendor/zscaler-sdk-go/zscaler/zia/services/new_family/new_family.go"],
            "tf": ["vendor/terraform-provider-zia/zia/resource_zia_new_family.go"],
        },
    }]
    markdown = render_rosetta_markdown(rosetta)
    assert "`zia.new_family`" in markdown
    assert "`/zia/api/v1/newFamily`" in markdown

    worklist = build_issue_routing(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS)
    row = next(r for r in worklist["rows"] if r["resource"] == "new_family")
    assert row["divergence_type"] == "client_surface_without_contract_mapping"
    assert row["target_repo"] == "automate.zscaler.com docs"
    assert row["direction"] == "contract_or_capture_gap"
    assert row["confidence"] == "HIGH"
    assert row["evidence"]["api_paths"] == ["/zia/api/v1/newFamily"]


@case
def test_contract_change_radar_is_carried_into_rosetta_markdown():
    snapshot = {
        "captured_at": "2026-07-20T00:00:00+00:00",
        "comparison": {
            "products": {
                "aiguard": {
                    "live_ops": 47,
                    "existing_ops": 45,
                    "matched_ops": 45,
                    "added_operations": 2,
                    "removed_operations": 0,
                    "route_changed_operations": 1,
                    "route_key_changed_operations": 0,
                    "schema_changed_operations": 1,
                    "schema_annotation_changed_operations": 1,
                    "product_metadata_changed": 1,
                    "product_metadata_changes": {
                        "title": {
                            "added": ["Digital Experience API"],
                            "removed": ["Zscaler Digital Experience API"],
                            "retained": [],
                            "previous_counts": {"Zscaler Digital Experience API": 1},
                            "current_counts": {"Digital Experience API": 1},
                        }
                    },
                    "request_body_fields_added": 0,
                    "request_body_fields_removed": 0,
                    "request_body_fields_changed": 0,
                    "response_schema_fields_added": 2,
                    "response_schema_fields_removed": 1,
                    "response_schema_fields_changed": 1,
                }
            },
            "operation_deltas": [
                {
                    "product": "aiguard",
                    "kind": "added",
                    "change_types": ["added"],
                    "new_method": "GET",
                    "new_path": "/v1/llm-provider-types",
                    "new_operation": "provider-types",
                    "sections": {},
                },
                {
                    "product": "aiguard",
                    "kind": "matched",
                    "change_types": ["schema"],
                    "new_method": "POST",
                    "new_path": "/v1/policies/{id}/enable",
                    "new_operation": "enable-policy",
                    "sections": {
                        "response_schema": {
                            "added": ["updatedCount"],
                            "removed": [],
                            "changed": [{"field": "id", "changes": {"type": {"old": "int64", "new": "string"}}}],
                        }
                    },
                    "schema_annotations": {
                        "discriminator_changes": [{
                            "kind": "changed",
                            "path": "request_body",
                            "property_name": "type",
                            "mapping_keys_added": ["WEB"],
                            "mapping_keys_removed": [],
                        }],
                        "title_changes": [],
                    },
                },
            ],
        },
    }

    radar = build_contract_change_radar(snapshot)
    rosetta = build_rosetta(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS, radar)
    markdown = render_rosetta_markdown(rosetta)

    assert radar["products"][0]["added_operations"] == 2
    schema_change = radar["products"][0]["operations"][1]
    assert schema_change["sections"]["response_schema"]["changed"] == ["id"]
    assert schema_change["schema_annotations"]["discriminator_changes"][0]["mapping_keys_added"] == ["WEB"]
    assert radar["products"][0]["schema_annotation_changed_operations"] == 1
    assert radar["products"][0]["product_metadata_changes"]["title"]["added"] == ["Digital Experience API"]
    assert "## Contract change radar" in markdown
    assert "`GET /v1/llm-provider-types`" in markdown
    assert "`response_schema` +1 −0 Δ1" in markdown
    assert "Product metadata `title`: `Zscaler Digital Experience API` → `Digital Experience API`" in markdown
    assert "discriminator mappings +WEB across 1 schema location(s)" in markdown
    assert "does not by itself establish a feature launch" in markdown


@case
def test_contract_change_radar_marks_and_suppresses_full_product_publication_absence():
    snapshot = {
        "captured_at": "2026-08-12T00:00:00+00:00",
        "publication_absences": [
            {
                "product": "aiguard",
                "status": "absent-from-current-public-route-table",
                "retention": "preserve-last-known-contract",
                "do_not_infer": "No retirement inference.",
                "retained_snapshot_operations": 47,
                "retained_snapshot_paths": 29,
            }
        ],
        "comparison": {
            "products": {
                "aiguard": {
                    "live_ops": 0,
                    "existing_ops": 47,
                    "matched_ops": 0,
                    "added_operations": 0,
                    "removed_operations": 47,
                }
            },
            "operation_deltas": [
                {
                    "product": "aiguard",
                    "kind": "removed",
                    "change_types": ["removed"],
                    "old_method": "GET",
                    "old_path": "/v1/policies",
                    "old_operation": "aiguard/policies/list",
                    "sections": {},
                }
            ],
        },
    }

    radar = build_contract_change_radar(snapshot)
    rosetta = build_rosetta(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS, radar)
    markdown = render_rosetta_markdown(rosetta)

    assert radar["publication_absences"][0]["product"] == "aiguard"
    assert radar["products"][0]["operations"] == []
    assert radar["products"][0]["removed_operations"] == 0
    assert radar["products"][0]["publication_status"] == "absent-from-current-public-route-table"
    assert radar["products"][0]["retention"] == "preserve-last-known-contract"
    assert "### Retained publication absences" in markdown
    assert "`aiguard`: 47 last-known operations retained" in markdown
    assert "does not establish endpoint retirement" in markdown
    assert "Publication-absent rows report zero true removals" in markdown
    assert "| `aiguard` | `absent-from-current-public-route-table` | 0/47 | 0 | 0 |" in markdown
    assert "Removed from capture" not in markdown
    assert "`aiguard` (AI Guard): 47 retained last-known operations" in markdown
    assert "`absent-from-current-public-route-table`" in markdown

    worklist = build_issue_routing(FIXTURE_REPORTS, FIXTURE_CONTRACT_FIELDS, radar)
    issue_markdown = render_issue_markdown(worklist)
    assert worklist["publication_absences"][0]["product"] == "aiguard"
    ai_guard_boundary = next(
        item for item in worklist["boundaries"]["contract_only_products"]
        if item["product"] == "aiguard"
    )
    assert ai_guard_boundary["publication_status"] == "absent-from-current-public-route-table"
    assert ai_guard_boundary["retention"] == "preserve-last-known-contract"
    assert not [
        row for row in worklist["rows"]
        if row["product"] == "aiguard" and "remov" in row["divergence_type"]
    ]
    assert "## Retained publication absences" in issue_markdown
    assert "No operation-removal tickets are emitted" in issue_markdown
    assert "`aiguard`: 47 operations retained" in issue_markdown


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

    assert row_by_field(rows, "clientExtra")["columns"]["tf"] == "✓"
    assert not any(row["field"] == "terraformComputedOnly" for row in rows), \
        "Terraform-only state fields must not originate Rosetta rows"

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
def test_web_eun_casing_split_keeps_terraform_on_hcl_logical_row():
    reports = {
        "zia": {
            "product": "zia",
            "resources": [{
                "resource": "firewall_dns_rule",
                "method": "POST",
                "path": "/zia/api/v1/firewallDnsRules",
                "presence": {
                    "contract_only_vs_go": [],
                    "go_only_vs_contract": ["isWebEUNEnabled"],
                    "contract_unmatched_in_tf": [],
                    "tf_corroborates_surface_only": ["isWebEunEnabled"],
                },
                "type_drift": [],
                "required_drift": [],
                "readonly": [],
                "enum": {"match": [], "value_conflict": [], "one_sided": []},
                "python": {
                    "surface": "present",
                    "presence": {
                        "contract_unmatched_in_python": [],
                        "python_only_vs_contract": ["isWebEunEnabled"],
                    },
                },
                "ansible": {
                    "surface": "present",
                    "presence": {
                        "contract_unmatched_in_ansible": [],
                        "ansible_only_vs_contract": ["isWebEunEnabled"],
                    },
                },
                "mcp": {"surface": "none"},
            }],
        },
    }
    rows = build_rosetta(reports, {("zia", "firewall_dns_rule"): {}})["rows"]

    go_wire = row_by_field(rows, "isWebEUNEnabled")
    assert go_wire["columns"]["contract"] == "—"
    assert go_wire["columns"]["go"] == "✓"
    assert go_wire["columns"]["tf"] == "—"

    hcl_logical = row_by_field(rows, "isWebEunEnabled")
    assert hcl_logical["columns"]["contract"] == "—"
    assert hcl_logical["columns"]["go"] == "—"
    assert hcl_logical["columns"]["tf"] == "✓"
    assert hcl_logical["columns"]["python"] == "✓"
    assert hcl_logical["columns"]["ansible"] == "✓"


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
    assert client_extra[0]["source_surface"] == "go,python,tf"
    assert client_extra[0]["evidence"]["surfaces"] == ["go", "python", "tf"]

    tf_only = [
        r for r in rows
        if r["field"] == "terraformComputedOnly"
    ]
    assert tf_only == [], "Terraform-only fields must not create issue-routing tickets"

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
