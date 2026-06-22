import importlib.util
import pathlib


MODULE_PATH = pathlib.Path(__file__).with_name("build_openapi_from_blobs.py")
SPEC = importlib.util.spec_from_file_location("build_openapi_from_blobs", MODULE_PATH)
builder = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(builder)


def raw_entry(operation, api):
    return {
        "operation": operation,
        "source_url": f"https://example.invalid/{operation}",
        "docusaurus": {"module": 1, "chunk_id": 2, "api_blob_sha256": "abc"},
        "api": api,
    }


def test_build_product_spec_moves_docusaurus_extras_to_extensions():
    spec, issues = builder.build_product_spec(
        "zdx",
        {
            "zdx/example/get": raw_entry(
                "zdx/example/get",
                {
                    "operationId": "ExampleGet",
                    "description": "Gets an example.",
                    "method": "get",
                    "path": "/v1/examples/{id}",
                    "parameters": [{"name": "id", "in": "path", "required": True, "schema": {"type": "string"}}],
                    "responses": {"200": {"description": "ok"}},
                    "jsonRequestBodyExample": {"id": "1"},
                    "postman": {"name": "Get example"},
                    "info": {"title": "Ignored operation-local info"},
                },
            )
        },
        "test",
    )

    assert issues == []
    operation = spec["paths"]["/v1/examples/{id}"]["get"]
    assert operation["operationId"] == "ExampleGet"
    assert operation["x-zscaler-operation-key"] == "zdx/example/get"
    assert operation["x-zscaler-docusaurus-extras"] == {
        "jsonRequestBodyExample": {"id": "1"},
        "postman": {"name": "Get example"},
    }
    assert "method" not in operation
    assert "path" not in operation
    assert "info" not in operation


def test_validate_spec_reports_path_template_issues_and_duplicates():
    spec, build_issues = builder.build_product_spec(
        "aiguard",
        {
            "aiguard/example/disable": raw_entry(
                "aiguard/example/disable",
                {
                    "operationId": "Duplicated",
                    "method": "post",
                    "path": "/v1/examples/{id}{disable}",
                    "parameters": [{"name": "id", "in": "path", "required": True, "schema": {"type": "string"}}],
                    "responses": {"200": {"description": "ok"}},
                },
            ),
            "aiguard/example/get": raw_entry(
                "aiguard/example/get",
                {
                    "operationId": "Duplicated",
                    "method": "get",
                    "path": "/v1/examples/{id}",
                    "parameters": [
                        {"name": "id", "in": "path", "required": True, "schema": {"type": "string"}},
                        {"name": "extra", "in": "path", "required": True, "schema": {"type": "string"}},
                    ],
                    "responses": {"200": {"description": "ok"}},
                },
            ),
        },
        "test",
    )

    issues = builder.validate_spec("aiguard", spec, build_issues)
    issue_types = {issue["issue"] for issue in issues}

    assert "adjacent_path_templates" in issue_types
    assert "missing_path_parameter" in issue_types
    assert "path_parameter_not_in_template" in issue_types
    assert "duplicate_operation_id" in issue_types


def test_default_response_as_success_is_marked_and_validated():
    spec, build_issues = builder.build_product_spec(
        "zcloudconnector",
        {
            "zcloudconnector/example/create": raw_entry(
                "zcloudconnector/example/create",
                {
                    "operationId": "CreateThing",
                    "method": "post",
                    "path": "/things",
                    "responses": {
                        "default": {
                            "description": "Default Response",
                            "content": {"application/json": {"schema": {"title": "Thing", "type": "object"}}},
                        }
                    },
                },
            ),
        },
        "test",
    )

    operation = spec["paths"]["/things"]["post"]
    assert operation["x-zscaler-default-as-success"] is True
    issues = builder.validate_spec("zcloudconnector", spec, build_issues)
    assert [issue["issue"] for issue in issues] == ["default_response_as_success"]


def test_default_response_error_shape_is_flagged():
    spec, build_issues = builder.build_product_spec(
        "zcloudconnector",
        {
            "zcloudconnector/example/create": raw_entry(
                "zcloudconnector/example/create",
                {
                    "operationId": "CreateThing",
                    "method": "post",
                    "path": "/things",
                    "responses": {
                        "default": {
                            "description": "Default Response",
                            "content": {"application/json": {"schema": {"title": "ApiError", "type": "object"}}},
                        }
                    },
                },
            ),
        },
        "test",
    )

    issues = builder.validate_spec("zcloudconnector", spec, build_issues)
    issue_types = [issue["issue"] for issue in issues]
    assert "default_response_as_success" in issue_types
    assert "default_response_error_shape" in issue_types


def test_validate_spec_reports_product_path_prefix_anomalies():
    spec, build_issues = builder.build_product_spec(
        "zdx",
        {
            "zdx/snapshot/create": raw_entry(
                "zdx/snapshot/create",
                {
                    "operationId": "CreateSnapshot",
                    "method": "post",
                    "path": "/snapshot/alert",
                    "responses": {"200": {"description": "ok"}},
                },
            ),
        },
        "test",
    )

    issues = builder.validate_spec("zdx", spec, build_issues)
    assert issues == [
        {
            "product": "zdx",
            "path": "/snapshot/alert",
            "expected_prefix": "/v1",
            "issue": "path_prefix_anomaly",
        }
    ]


def test_normalize_openapi_node_preserves_blob_recursion_as_extensions():
    unresolved_refs = set()
    normalized = builder.normalize_openapi_node(
        {
            "minimum": "1",
            "default": "20",
            "enum": ["A", "B", "A"],
            "required": ["name", "name"],
            "linked": {"$ref": "#/components/schemas/Missing"},
            "anyOf": ["circular(Thing)", {"type": "string"}],
            "discriminator": {
                "propertyName": "kind",
                "mapping": {"A": {"allOf": ["circular(AThing)"], "type": "object"}},
            },
        },
        unresolved_refs,
    )

    assert normalized["anyOf"][0] == {
        "description": "Circular inline schema reference elided: Thing.",
        "x-zscaler-circular-ref": "Thing",
    }
    assert "mapping" not in normalized["discriminator"]
    assert normalized["discriminator"]["propertyName"] == "kind"
    assert normalized["discriminator"]["x-zscaler-inline-mapping"]["A"]["allOf"][0]["x-zscaler-circular-ref"] == "AThing"
    assert normalized["minimum"] == 1
    assert normalized["x-zscaler-original-minimum"] == "1"
    assert normalized["default"] == "20"
    assert normalized["enum"] == ["A", "B"]
    assert normalized["x-zscaler-enum-duplicates"] == ["A"]
    assert normalized["required"] == ["name"]
    assert normalized["x-zscaler-required-duplicates"] == ["name"]
    assert normalized["linked"] == {"$ref": "#/components/schemas/Missing"}
    assert unresolved_refs == {"#/components/schemas/Missing"}

    integer_schema = builder.normalize_openapi_node({"type": "integer", "default": "20"})
    assert integer_schema["default"] == 20
    assert integer_schema["x-zscaler-original-default"] == "20"


def test_build_product_spec_preserves_unresolved_refs_as_stub_components():
    spec, issues = builder.build_product_spec(
        "ztw",
        {
            "ztw/example/get": raw_entry(
                "ztw/example/get",
                {
                    "operationId": "GetExample",
                    "method": "get",
                    "path": "/examples",
                    "responses": {
                        "200": {
                            "description": "ok",
                            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/Missing"}}},
                        }
                    },
                },
            )
        },
        "test",
    )

    assert issues == []
    assert spec["paths"]["/examples"]["get"]["responses"]["200"]["content"]["application/json"]["schema"] == {
        "$ref": "#/components/schemas/Missing"
    }
    assert spec["components"]["schemas"]["Missing"]["x-zscaler-unresolved-ref"] == "#/components/schemas/Missing"


def test_clean_operation_deduplicates_parameters_with_provenance():
    operation = builder.clean_operation(
        {
            "operationId": "GetThing",
            "parameters": [
                {"name": "id", "in": "path", "required": True, "schema": {"type": "string"}},
                {"name": "id", "in": "path", "required": True, "schema": {"type": "string"}, "description": "fallback"},
            ],
            "method": "get",
            "path": "/things/{id}",
            "responses": {"200": {"description": "ok"}},
        },
        "thing/get",
        "https://example.invalid/thing/get",
        {},
    )

    assert len(operation["parameters"]) == 1
    assert operation["x-zscaler-duplicate-parameters"][0]["description"] == "fallback"


def test_product_info_and_servers_are_stable():
    raw_ops = {
        "p/one": raw_entry(
            "p/one",
            {
                "operationId": "One",
                "method": "get",
                "path": "/one",
                "responses": {"200": {"description": "ok"}},
                "info": {"title": "Product API", "description": "Product docs", "version": "9"},
                "servers": [{"url": "https://b.example"}, {"url": "https://a.example"}],
            },
        )
    }

    spec, _ = builder.build_product_spec("p", raw_ops, "")

    assert spec["info"] == {"title": "Product API", "version": "9", "description": "Product docs"}
    assert spec["servers"] == [{"url": "https://a.example"}, {"url": "https://b.example"}]
