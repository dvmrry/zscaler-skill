import errno
import base64
import importlib.util
import io
import json
import pathlib
import zlib

import pytest


MODULE_PATH = pathlib.Path(__file__).with_name("extract_docusaurus_blobs.py")
SPEC = importlib.util.spec_from_file_location("extract_docusaurus_blobs", MODULE_PATH)
extract = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(extract)


OLD_RUNTIME_SHAPE = (
    'r.u=e=>"assets/js/"+({88e3:"6e4ad5f2",123:"plain"}[e]||e)'
    '+"."+{88e3:"b9fddd12",123:"abcdef01"}[e]+".js"'
)
CURRENT_RUNTIME_SHAPE = (
    'r.u=d=>"assets/js/"+({88e3:"6e4ad5f2",123:"plain"}[d]||d)'
    '+"."+{88e3:"b9fddd12",123:"abcdef01"}[d]+".js"'
)
OLD_ROUTE_SHAPE = (
    '"38c":[()=>Promise.all([o.e(71869),o.e(73154),o.e(33254),o.e(88e3)])'
    '.then(o.bind(o,2899)),"@site/docs/api-reference-and-guides/api-reference/'
    'zdx/device-management/config-device-resource-list-config-devices.api.mdx",2899],'
)
CURRENT_ROUTE_SHAPE = (
    'e194b4b:[()=>Promise.all([t.e(371869),t.e(973154),t.e(733254),t.e(354152)])'
    '.then(t.bind(t,472903)),"@site/docs/api-reference-and-guides/api-reference/'
    'ai-security/airedteaming/aiapp/ai-app-resource-create-ai-app.api.mdx",472903],'
)
ARBITRARY_RUNTIME_SHAPE = (
    'r.u=$rt=>"assets/js/"+({88e3:"6e4ad5f2",123:"plain"}[$rt]||$rt)'
    '+"."+{88e3:"b9fddd12",123:"abcdef01"}[$rt]+".js"'
)
ARBITRARY_ROUTE_SHAPE = (
    'routeKey:[()=>Promise.all([multiChar9.e(88e3),multiChar9.e(123)])'
    '.then(multiChar9.bind(multiChar9,2899)),"@site/docs/api-reference-and-guides/api-reference/'
    'zdx/device-management/config-device-resource-list-config-devices.api.mdx",2899],'
)


def test_fetch_bytes_retries_raw_connection_reset_then_succeeds(monkeypatch):
    attempts = [ConnectionResetError("peer reset"), io.BytesIO(b"payload")]
    sleeps = []

    def fake_urlopen(_request, timeout):
        assert timeout == 60
        result = attempts.pop(0)
        if isinstance(result, BaseException):
            raise result
        return result

    monkeypatch.setattr(extract, "open_same_origin", fake_urlopen)
    monkeypatch.setattr(extract.time, "sleep", sleeps.append)

    assert extract.fetch_bytes("https://automate.zscaler.com/data", retries=1) == b"payload"
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

    monkeypatch.setattr(extract, "open_same_origin", fake_urlopen)
    monkeypatch.setattr(extract.time, "sleep", sleeps.append)

    with pytest.raises(ConnectionResetError, match="peer reset"):
        extract.fetch_bytes("https://automate.zscaler.com/data", retries=2)

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

    monkeypatch.setattr(extract, "open_same_origin", fake_urlopen)
    monkeypatch.setattr(extract.time, "sleep", sleeps.append)

    with pytest.raises(OSError, match="invalid argument"):
        extract.fetch_bytes("https://automate.zscaler.com/data")

    assert attempts == 1
    assert sleeps == []


def test_site_scripts_accepts_only_same_origin_https_assets():
    index_html = (
        '<script src="/assets/js/runtime~main.123.js"></script>'
        '<script src="https://automate.zscaler.com/assets/js/main.456.js"></script>'
    )

    assert extract.site_scripts(index_html) == [
        "https://automate.zscaler.com/assets/js/runtime~main.123.js",
        "https://automate.zscaler.com/assets/js/main.456.js",
    ]


@pytest.mark.parametrize(
    "script_url",
    [
        "https://attacker.invalid/assets/js/main.js",
        "http://automate.zscaler.com/assets/js/main.js",
        "https://automate.zscaler.com@attacker.invalid/assets/js/main.js",
    ],
)
def test_site_scripts_rejects_off_origin_or_non_https_assets(script_url):
    with pytest.raises(RuntimeError, match="refusing script URL"):
        extract.site_scripts(f'<script src="{script_url}"></script>')


@pytest.mark.parametrize(
    "redirect_url",
    [
        "https://attacker.invalid/assets/js/main.js",
        "http://automate.zscaler.com/assets/js/main.js",
    ],
)
def test_fetch_bytes_rejects_off_origin_or_non_https_redirect(monkeypatch, redirect_url):
    response = io.BytesIO(b"malicious payload")
    response.geturl = lambda: redirect_url
    monkeypatch.setattr(extract, "open_same_origin", lambda _request, timeout: response)

    with pytest.raises(RuntimeError, match="refusing redirect destination URL"):
        extract.fetch_bytes("https://automate.zscaler.com/assets/js/main.js")


def test_redirect_handler_rejects_before_following_off_origin_url():
    request = extract.urllib.request.Request(
        "https://automate.zscaler.com/assets/js/main.js"
    )
    handler = extract.SameOriginRedirectHandler()

    with pytest.raises(RuntimeError, match="refusing redirect destination URL"):
        handler.redirect_request(
            request,
            None,
            302,
            "Found",
            {},
            "https://attacker.invalid/stolen.js",
        )


def test_prepare_generated_output_dirs_rejects_stale_absent_product(tmp_path):
    stale_dir = tmp_path / "raw-blobs"
    stale_dir.mkdir()
    stale_file = stale_dir / "aiguard-raw-api.json"
    stale_file.write_text('{"stale": true}\n', encoding="utf-8")

    with pytest.raises(RuntimeError, match="use a fresh --out-dir") as exc_info:
        extract.prepare_generated_output_dirs(tmp_path)

    assert "aiguard-raw-api.json" in str(exc_info.value)
    assert stale_file.exists()
    assert not (tmp_path / "reconstructed" / "aiguard-api-reference.json").exists()


@pytest.mark.parametrize(
    "runtime_js",
    [OLD_RUNTIME_SHAPE, CURRENT_RUNTIME_SHAPE, ARBITRARY_RUNTIME_SHAPE],
)
def test_chunk_maps_accept_old_and_current_minifier_symbols(runtime_js):
    prefix_map, hash_map = extract.chunk_maps(runtime_js)

    assert prefix_map[88000] == "6e4ad5f2"
    assert hash_map[88000] == "b9fddd12"
    assert prefix_map[123] == "plain"


@pytest.mark.parametrize(
    ("main_js", "operation", "last_chunk"),
    [
        (
            OLD_ROUTE_SHAPE,
            "zdx/device-management/config-device-resource-list-config-devices",
            88000,
        ),
        (
            CURRENT_ROUTE_SHAPE,
            "ai-security/airedteaming/aiapp/ai-app-resource-create-ai-app",
            354152,
        ),
        (
            ARBITRARY_ROUTE_SHAPE,
            "zdx/device-management/config-device-resource-list-config-devices",
            123,
        ),
    ],
)
def test_api_routes_accept_old_and_current_minifier_symbols(main_js, operation, last_chunk):
    route = extract.api_routes(main_js)[0]

    assert route["operation"] == operation
    assert route["chunks"][-1] == last_chunk


def test_api_routes_isolate_nearest_current_shape_route_entry_chunks():
    main_js = (
        'prior:[()=>t.e(999).then(t.bind(t,777)),"@site/docs/not-an-api-page.mdx",777],'
        'target:[()=>Promise.all([t.e(1),t.e(2)]).then(t.bind(t,333)),'
        '"@site/docs/api-reference-and-guides/api-reference/'
        'ai-security/airedteaming/probes/probe-resource-list-probes.api.mdx",333],'
    )

    route = extract.api_routes(main_js)[0]

    assert route["operation"] == "ai-security/airedteaming/probes/probe-resource-list-probes"
    assert route["chunks"] == [1, 2]


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
    assert completeness["api_mdx_unique_operations"] == 2
    assert completeness["matched_routes"] == 1
    assert completeness["matched_route_entries"] == 1
    assert completeness["missing_routes"] == ["zia/group/missed"]
    assert completeness["extra_routes"] == []
    assert completeness["duplicate_api_mdx_operations"] == []
    assert completeness["duplicate_routes"] == []


def test_route_completeness_reports_duplicate_api_mdx_routes():
    route = (
        '"{key}":[()=>o.e({chunk}).then(o.bind(o,{module})),'
        '"@site/docs/api-reference-and-guides/api-reference/zia/group/duplicate.api.mdx",'
        '{module}],'
    )
    main_js = route.format(key="first", chunk=123, module=456) + route.format(
        key="second", chunk=789, module=1011
    )
    routes = extract.api_routes(main_js)

    completeness = extract.verify_route_completeness(main_js, routes)

    assert completeness["api_mdx_operations"] == 2
    assert completeness["api_mdx_unique_operations"] == 1
    assert completeness["matched_routes"] == 1
    assert completeness["matched_route_entries"] == 2
    assert completeness["duplicate_api_mdx_operations"] == ["zia/group/duplicate"]
    assert completeness["duplicate_routes"] == ["zia/group/duplicate"]
    with pytest.raises(RuntimeError, match="1 duplicate candidates, 1 duplicate routes"):
        extract.require_complete_routes(completeness)


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


def test_operation_blob_rejects_sole_blob_when_requested_module_is_absent():
    wrong_api = {
        "operationId": "Unrelated Operation",
        "method": "delete",
        "path": "/unrelated",
    }
    blob = base64.b64encode(zlib.compress(json.dumps(wrong_api).encode("utf-8"))).decode("ascii")
    chunks = {999: f'111:(e,t,o)=>{{const frontMatter={{api:"{blob}"}}}}'}
    route = {
        "module": 333,
        "module_token": "333",
        "chunks": [999],
    }

    api, error, provenance = extract.operation_blob(
        route,
        chunks.get,
        {999: "https://example.invalid/999.js"},
    )

    assert api is None
    assert error == "no api blob found for module 333"
    assert provenance is None


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


def test_publication_absences_retain_last_known_contract_without_retirement_inference():
    existing = {
        "aiguard": {
            "one": {"method": "GET", "path": "/v1/policies"},
            "two": {"method": "POST", "path": "/v1/policies"},
        }
    }

    assert extract.publication_absences(set(), existing) == [
        {
            "product": "aiguard",
            "status": "absent-from-current-public-route-table",
            "live_operations": 0,
            "retained_snapshot_operations": 2,
            "retained_snapshot_paths": 1,
            "retention": "preserve-last-known-contract",
            "do_not_infer": (
                "Public route-table absence does not establish endpoint retirement "
                "or backend unavailability."
            ),
        }
    ]

    assert extract.publication_absences({"aiguard"}, existing) == []


def retained_fixture(tmp_path):
    contract = {
        "aiguard/one": {"method": "GET", "path": "/v1/policies"},
        "aiguard/two": {"method": "POST", "path": "/v1/policies"},
    }
    openapi = {
        "openapi": "3.0.3",
        "paths": {
            "/v1/policies": {
                "get": {"operationId": "one"},
                "post": {"operationId": "two"},
            }
        },
    }
    (tmp_path / "openapi").mkdir()
    (tmp_path / "aiguard-api-reference.json").write_text(json.dumps(contract), encoding="utf-8")
    (tmp_path / "openapi/aiguard.openapi.json").write_text(json.dumps(openapi), encoding="utf-8")
    return contract


def test_retained_publication_absence_preflight_rejects_wrong_count(tmp_path):
    contract = retained_fixture(tmp_path)
    absences = extract.publication_absences(set(), {"aiguard": contract}, tmp_path)
    absences[0]["retained_snapshot_operations"] = 3

    with pytest.raises(RuntimeError, match="does not match absence count"):
        extract.validate_retained_publication_absences(absences, tmp_path)


def test_retained_publication_absence_preflight_rejects_tampered_artifact(tmp_path):
    contract = retained_fixture(tmp_path)
    absences = extract.publication_absences(set(), {"aiguard": contract}, tmp_path)
    path = tmp_path / "aiguard-api-reference.json"
    path.write_text(path.read_text(encoding="utf-8") + "\n", encoding="utf-8")

    with pytest.raises(RuntimeError, match="SHA-256 does not match selected baseline"):
        extract.validate_retained_publication_absences(absences, tmp_path)


def test_removed_operation_rendering_excludes_full_product_publication_absence():
    deltas = [
        {"product": "aiguard", "kind": "removed", "old_operation": "aiguard/policies/list"},
        {"product": "zia", "kind": "removed", "old_operation": "zia/example/get"},
    ]
    absences = [{"product": "aiguard"}]

    assert extract.visible_removed_operations(deltas, absences) == [deltas[1]]


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


def test_operation_delta_surfaces_discriminator_mapping_metadata_drift():
    existing = {
        "op": {
            "method": "POST",
            "path": "/v1/monitors",
            "request_body": [{"name": "type", "type": "string"}],
            "response_schema": [],
            "_schema_comparison": {
                "discriminators": [{
                    "path": "request_body",
                    "property_name": "type",
                    "mapping_keys": ["HIFI_MTR", "TRACERT", "TRACERT_V2"],
                }],
                "titles": [],
            },
        }
    }
    rebuilt = {
        "op": {
            "method": "POST",
            "path": "/v1/monitors",
            "request_body": [{"name": "type", "type": "string"}],
            "response_schema": [],
            "_schema_comparison": {
                "discriminators": [{
                    "path": "request_body",
                    "property_name": "type",
                    "mapping_keys": ["HIFI_MTR", "TRACERT", "TRACERT_V2", "WEB"],
                }],
                "titles": [],
            },
        }
    }

    delta = extract.operation_delta("zdx", "route-key", "op", "op", existing, rebuilt)
    comparison = extract.compare_products({"zdx": rebuilt}, {"zdx": existing})

    assert delta["change_types"] == ["schema"]
    assert delta["sections"] == {}
    assert delta["schema_annotations"]["discriminator_changes"] == [{
        "kind": "changed",
        "path": "request_body",
        "property_name": "type",
        "mapping_keys_added": ["WEB"],
        "mapping_keys_removed": [],
    }]
    assert comparison["products"]["zdx"]["schema_changed_operations"] == 1
    assert comparison["products"]["zdx"]["schema_annotation_changed_operations"] == 1


def test_compare_products_surfaces_product_title_as_publication_metadata():
    existing = {
        "op": {
            "method": "GET",
            "path": "/v1/monitors",
            "_product_comparison": {
                "title": "Zscaler Digital Experience API",
                "version": "0.0.0",
            },
        }
    }
    rebuilt = {
        "op": {
            "method": "GET",
            "path": "/v1/monitors",
            "_product_comparison": {
                "title": "Digital Experience API",
                "version": "0.0.0",
            },
        }
    }

    comparison = extract.compare_products({"zdx": rebuilt}, {"zdx": existing})
    stats = comparison["products"]["zdx"]

    assert stats["product_metadata_changed"] == 1
    assert stats["product_metadata_changes"] == {
        "title": {
            "added": ["Digital Experience API"],
            "removed": ["Zscaler Digital Experience API"],
            "retained": [],
            "previous_counts": {"Zscaler Digital Experience API": 1},
            "current_counts": {"Digital Experience API": 1},
        }
    }


def test_compare_products_preserves_mixed_family_titles_instead_of_claiming_replacement():
    existing = {
        "asset": {
            "method": "GET",
            "path": "/assets",
            "_product_comparison": {"title": "AI Infrastructure"},
        }
    }
    rebuilt = {
        "asset": {
            "method": "GET",
            "path": "/assets",
            "_product_comparison": {"title": "AI Infrastructure"},
        },
        "red-team-one": {
            "method": "POST",
            "path": "/airt/tests",
            "_product_comparison": {"title": "AI Red Teaming"},
        },
        "red-team-two": {
            "method": "GET",
            "path": "/airt/tests/{id}",
            "_product_comparison": {"title": "AI Red Teaming"},
        },
    }

    comparison = extract.compare_products(
        {"ai-security": rebuilt},
        {"ai-security": existing},
    )
    title = comparison["products"]["ai-security"]["product_metadata_changes"]["title"]

    assert title == {
        "added": ["AI Red Teaming"],
        "removed": [],
        "retained": ["AI Infrastructure"],
        "previous_counts": {"AI Infrastructure": 1},
        "current_counts": {"AI Infrastructure": 1, "AI Red Teaming": 2},
    }
    rendered = extract.product_metadata_markdown("title", title)
    assert "added `AI Red Teaming`" in rendered
    assert "retained `AI Infrastructure`" in rendered
    assert "removed" not in rendered


def test_schema_metadata_normalizes_raw_and_generated_discriminator_mapping_shapes():
    raw = {
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": {
                        "discriminator": {
                            "propertyName": "type",
                            "mapping": {"WEB": {"type": "object", "title": "WebMonitor"}},
                        }
                    }
                }
            }
        }
    }
    generated = {
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": {
                        "discriminator": {
                            "propertyName": "type",
                            "x-zscaler-inline-mapping": {
                                "WEB": {"type": "object", "title": "WebMonitor"}
                            },
                        }
                    }
                }
            }
        }
    }

    assert extract.schema_comparison_metadata(raw) == extract.schema_comparison_metadata(generated)


def test_public_normalized_operations_strips_ephemeral_comparison_metadata():
    public = extract.public_normalized_operations({
        "op": {
            "method": "GET",
            "path": "/v1/monitors",
            "_schema_comparison": {"discriminators": []},
            "_product_comparison": {"title": "Digital Experience API"},
        }
    })

    assert public == {"op": {"method": "GET", "path": "/v1/monitors"}}


def test_load_existing_preserves_operation_local_mixed_family_titles(tmp_path):
    (tmp_path / "openapi").mkdir()
    operations = {
        "asset": {"method": "GET", "path": "/assets"},
        "red-team": {"method": "POST", "path": "/airt/tests"},
    }
    spec = {
        "openapi": "3.0.3",
        "info": {"title": "AI Security APIs", "version": "snapshot"},
        "paths": {
            "/assets": {
                "get": {
                    "x-zscaler-operation-key": "asset",
                    "x-zscaler-source-info": {"title": "AI Infrastructure"},
                }
            },
            "/airt/tests": {
                "post": {
                    "x-zscaler-operation-key": "red-team",
                    "x-zscaler-source-info": {"title": "AI Red Teaming"},
                }
            },
        },
    }
    (tmp_path / "ai-security-api-reference.json").write_text(
        json.dumps(operations),
        encoding="utf-8",
    )
    (tmp_path / "openapi/ai-security.openapi.json").write_text(
        json.dumps(spec),
        encoding="utf-8",
    )

    loaded = extract.load_existing(tmp_path)["ai-security"]

    assert loaded["asset"]["_product_comparison"] == {"title": "AI Infrastructure"}
    assert loaded["red-team"]["_product_comparison"] == {"title": "AI Red Teaming"}
