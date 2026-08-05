import errno
import importlib.util
import io
import pathlib

import pytest


MODULE_PATH = pathlib.Path(__file__).with_name("extract_docusaurus_blobs.py")
SPEC = importlib.util.spec_from_file_location("extract_docusaurus_blobs", MODULE_PATH)
extract = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(extract)


def test_fetch_bytes_retries_raw_connection_reset_then_succeeds(monkeypatch):
    attempts = [ConnectionResetError("peer reset"), io.BytesIO(b"payload")]
    sleeps = []

    def fake_urlopen(_request, timeout):
        assert timeout == 60
        result = attempts.pop(0)
        if isinstance(result, BaseException):
            raise result
        return result

    monkeypatch.setattr(extract.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(extract.time, "sleep", sleeps.append)

    assert extract.fetch_bytes("https://example.invalid/data", retries=1) == b"payload"
    assert attempts == []
    assert sleeps == [1.5]


def test_fetch_bytes_raises_raw_connection_reset_after_retries(monkeypatch):
    attempts = 0
    sleeps = []

    def fake_urlopen(_request, timeout):
        nonlocal attempts
        assert timeout == 60
        attempts += 1
        raise ConnectionResetError("peer reset")

    monkeypatch.setattr(extract.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(extract.time, "sleep", sleeps.append)

    with pytest.raises(ConnectionResetError, match="peer reset"):
        extract.fetch_bytes("https://example.invalid/data", retries=2)

    assert attempts == 3
    assert sleeps == [1.5, 3.0]


def test_fetch_bytes_does_not_retry_permanent_os_error(monkeypatch):
    attempts = 0
    sleeps = []

    def fake_urlopen(_request, timeout):
        nonlocal attempts
        assert timeout == 60
        attempts += 1
        raise OSError(errno.EINVAL, "invalid argument")

    monkeypatch.setattr(extract.urllib.request, "urlopen", fake_urlopen)
    monkeypatch.setattr(extract.time, "sleep", sleeps.append)

    with pytest.raises(OSError, match="invalid argument"):
        extract.fetch_bytes("https://example.invalid/data")

    assert attempts == 1
    assert sleeps == []


def test_chunk_maps_accept_exponent_chunk_ids():
    runtime_js = (
        'r.u=e=>"assets/js/"+({88e3:"6e4ad5f2",123:"plain"}[e]||e)'
        '+"."+{88e3:"b9fddd12",123:"abcdef01"}[e]+".js"'
    )

    prefix_map, hash_map = extract.chunk_maps(runtime_js)

    assert prefix_map[88000] == "6e4ad5f2"
    assert hash_map[88000] == "b9fddd12"
    assert prefix_map[123] == "plain"


def test_api_routes_accept_exponent_chunk_ids():
    main_js = (
        '"38c":[()=>Promise.all([o.e(71869),o.e(73154),o.e(33254),o.e(88e3)])'
        '.then(o.bind(o,2899)),"@site/docs/api-reference-and-guides/api-reference/'
        'zdx/device-management/config-device-resource-list-config-devices.api.mdx",2899],'
    )

    route = extract.api_routes(main_js)[0]

    assert route["operation"] == "zdx/device-management/config-device-resource-list-config-devices"
    assert route["chunks"][-1] == 88000


def test_api_routes_accept_exponent_module_ids():
    main_js = (
        '"23f7bd53":[()=>Promise.all([o.e(71869),o.e(73154),o.e(33254),o.e(47789)])'
        '.then(o.bind(o,38e3)),"@site/docs/api-reference-and-guides/api-reference/'
        'zcloudconnector/policy-resources/ip-group-z-resource-add-ip-group.api.mdx",38e3],'
    )

    route = extract.api_routes(main_js)[0]

    assert route["operation"] == "zcloudconnector/policy-resources/ip-group-z-resource-add-ip-group"
    assert route["module"] == 38000
    assert route["module_token"] == "38e3"
    assert route["chunks"][-1] == 47789


def test_api_routes_accept_product_root_api_pages():
    main_js = (
        '"root":[()=>o.e(123).then(o.bind(o,456)),'
        '"@site/docs/api-reference-and-guides/api-reference/zdx/root-operation.api.mdx",456],'
    )

    route = extract.api_routes(main_js)[0]

    assert route["operation"] == "zdx/root-operation"
    assert route["group"] == "root-operation"
    assert route["slug"] == ""


def test_route_completeness_reports_unmatched_api_mdx_candidates():
    main_js = (
        '"ok":[()=>o.e(123).then(o.bind(o,456)),'
        '"@site/docs/api-reference-and-guides/api-reference/zia/group/ok.api.mdx",456],'
        '"@site/docs/api-reference-and-guides/api-reference/zia/group/missed.api.mdx",789]'
    )
    routes = extract.api_routes(main_js)

    completeness = extract.verify_route_completeness(main_js, routes)

    assert completeness["api_mdx_operations"] == 2
    assert completeness["matched_routes"] == 1
    assert completeness["missing_routes"] == ["zia/group/missed"]
    assert completeness["extra_routes"] == []


def test_module_slice_accepts_raw_exponent_module_key():
    js = '1:{ignore:1},38e3:function(e,t,o){const frontMatter={api:"abc"}},2:{ignore:2}'

    sliced = extract.module_slice(js, "38e3")

    assert sliced is not None
    assert 'api:"abc"' in sliced
    assert extract.module_slice(js, 38000) is None


def test_module_slice_accepts_first_key_in_module_object():
    js = '"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[58120],{7223:(e,t,o)=>{const x={api:"abc"}}}]);'

    sliced = extract.module_slice(js, 7223)

    assert sliced is not None
    assert 'api:"abc"' in sliced


def test_module_slice_stops_before_exponent_sibling_key():
    js = '38e3:function(e,t,o){const a={api:"first"}},88e3:function(e,t,o){const b={api:"second"}}'

    sliced = extract.module_slice(js, "38e3")

    assert sliced is not None
    assert 'api:"first"' in sliced
    assert 'api:"second"' not in sliced


def test_schema_enum_reads_composed_item_and_pipe_enums():
    assert extract.schema_enum({"allOf": [{"type": "string", "enum": ["a", "b"]}]}) == ["a", "b"]
    assert extract.schema_enum({"type": "array", "items": {"type": "string", "enum": ["x", "y"]}}) == ["x", "y"]
    assert extract.schema_enum({"type": "string", "enum": ["A|B|C"]}) == ["A", "B", "C"]


def test_default_response_is_used_only_without_2xx_response():
    default_only = {
        "responses": {
            "default": {"content": {"application/json": {"schema": {"type": "string"}}}},
        }
    }
    explicit_success = {
        "responses": {
            "200": {"content": {"application/json": {"schema": {"type": "integer", "format": "int64"}}}},
            "default": {"content": {"application/json": {"schema": {"type": "string"}}}},
        }
    }

    assert extract.response_root_summaries(default_only) == [
        {"status": "default", "type": "string", "enum": None, "title": None, "description": None}
    ]
    assert extract.response_root_summaries(explicit_success) == [
        {"status": "200", "type": "int64", "enum": None, "title": None, "description": None}
    ]


def test_field_rows_preserve_root_primitive_responses():
    route = {
        "operation": "zcloudconnector/health/check",
        "source_url": "https://example.invalid/docs/zcloudconnector/health/check",
    }
    api = {
        "operationId": "Health Check",
        "method": "get",
        "path": "/ztw/api/v1/health",
        "responses": {
            "200": {"content": {"application/json": {"schema": {"type": "string"}}}},
        },
    }
    op = extract.normalize_operation(route, api, {"api_blob_sha256": "abc"})

    assert op["response_schema"] == []
    assert op["response_roots"] == [
        {"status": "200", "type": "string", "enum": None, "title": None, "description": None}
    ]

    rows = extract.field_rows({"zcloudconnector": {op["operation"]: op}})
    assert [row for row in rows if row["is_root_schema"]] == [
        {
            "product": "zcloudconnector",
            "operation": "zcloudconnector/health/check",
            "method": "GET",
            "path": "/ztw/api/v1/health",
            "source_url": "https://example.invalid/docs/zcloudconnector/health/check",
            "section": "response_schema",
            "field_path": "$",
            "top_field": "$",
            "type": "string",
            "required": False,
            "readonly": False,
            "readonly_in_request_schema": False,
            "enum": None,
            "description": None,
            "title": None,
            "response_status": "200",
            "is_root_schema": True,
            "api_blob_sha256": "abc",
        }
    ]


def test_flatten_schema_inherits_parent_readonly_and_merges_composed_constraints():
    fields = {
        field["name"]: field
        for field in extract.flatten_schema(
            {
                "properties": {
                    "serverManaged": {
                        "readOnly": True,
                        "properties": {
                            "id": {"type": "integer", "format": "int64"},
                            "name": {"type": "string"},
                        },
                    },
                    "merged": {
                        "allOf": [
                            {"properties": {"state": {"type": "string"}}},
                            {"required": ["state"], "properties": {"state": {"readOnly": True, "type": "string", "enum": ["ON"]}}},
                        ]
                    },
                }
            }
        )
    }

    assert fields["serverManaged"]["readonly"] is True
    assert fields["serverManaged.id"]["readonly"] is True
    assert fields["serverManaged.name"]["readonly"] is True
    assert fields["merged.state"]["required"] is True
    assert fields["merged.state"]["readonly"] is True
    assert fields["merged.state"]["enum"] == ["ON"]


def test_compare_products_surfaces_true_additions_route_corrections_and_body_drift():
    existing = {
        "aiguard": {
            "same-route": {
                "method": "POST",
                "path": "/v1/policies/{id}{enable}",
                "request_body": [],
                "response_schema": [{"name": "id", "type": "int64", "required": True}],
            },
            "old-key": {
                "method": "GET",
                "path": "/v1/providers",
                "request_body": [],
                "response_schema": [],
            },
        }
    }
    rebuilt = {
        "aiguard": {
            "same-route": {
                "method": "POST",
                "path": "/v1/policies/{id}/enable",
                "request_body": [],
                "response_schema": [
                    {"name": "id", "type": "string", "required": True},
                    {"name": "updatedCount", "type": "int32", "required": True},
                ],
            },
            "new-key": {
                "method": "GET",
                "path": "/v1/providers",
                "request_body": [],
                "response_schema": [],
            },
            "provider-types": {
                "method": "GET",
                "path": "/v1/provider-types",
                "request_body": [],
                "response_schema": [{"name": "items", "type": "array", "required": True}],
            },
        }
    }

    comparison = extract.compare_products(rebuilt, existing)
    stats = comparison["products"]["aiguard"]

    assert stats["matched_ops"] == 2
    assert stats["added_operations"] == 1
    assert stats["removed_operations"] == 0
    assert stats["route_changed_operations"] == 1
    assert stats["route_key_changed_operations"] == 1
    assert stats["schema_changed_operations"] == 1
    assert stats["response_schema_fields_added"] == 1
    assert stats["response_schema_fields_changed"] == 1

    additions = [item for item in comparison["operation_deltas"] if item["kind"] == "added"]
    assert [(item["new_method"], item["new_path"]) for item in additions] == [
        ("GET", "/v1/provider-types")
    ]
    assert extract.change_radar_console_lines(comparison) == [
        "aiguard: ops +1 -0; routes Δ1; route-keys Δ1; schemas Δ1; "
        "request fields +0 -0 Δ0; response fields +1 -0 Δ1"
    ]
    renamed = [
        item for item in comparison["operation_deltas"]
        if item.get("old_operation") == "old-key"
    ][0]
    assert renamed["change_types"] == ["route-key"]


def test_schema_section_delta_reports_constraint_changes():
    delta = extract.schema_section_delta(
        [{"name": "mode", "type": "string", "required": False, "enum": ["A"]}],
        [{"name": "mode", "type": "string", "required": True, "enum": ["A", "B"]}],
    )

    assert delta["added"] == []
    assert delta["removed"] == []
    assert delta["changed"] == [{
        "field": "mode",
        "changes": {
            "required": {"old": False, "new": True},
            "enum": {"old": ["A"], "new": ["A", "B"]},
        },
    }]


def test_operation_delta_ignores_schema_class_name_churn():
    existing = {
        "op": {
            "method": "POST",
            "path": "/v1/items",
            "request_body": [{"name": "name", "type": "string"}],
            "response_schema": [{"name": "id", "type": "string"}],
            "request_root": {"type": "object", "title": "PublicItem"},
            "response_roots": [{"status": "201", "type": "object", "title": "PublicItem"}],
        }
    }
    rebuilt = {
        "op": {
            "method": "POST",
            "path": "/v1/items",
            "request_body": [{"name": "name", "type": "string"}],
            "response_schema": [{"name": "id", "type": "string"}],
            "request_root": {"type": "object", "title": "Item"},
            "response_roots": [{"status": "201", "type": "object", "title": "Item"}],
        }
    }

    delta = extract.operation_delta("aiguard", "route-key", "op", "op", existing, rebuilt)

    assert delta["change_types"] == []
    assert delta["sections"] == {}
