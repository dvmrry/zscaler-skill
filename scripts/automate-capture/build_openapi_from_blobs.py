#!/usr/bin/env python3
"""Build inline OpenAPI artifacts from decoded automate.zscaler.com blobs.

This is a proof-stage converter for the Docusaurus blob snapshot produced by
extract_docusaurus_blobs.py. It intentionally keeps schemas inline and preserves
operation provenance with x-zscaler-* extensions; component extraction and deeper
codegen cleanup are later steps.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
from collections import Counter, defaultdict
from copy import deepcopy


DEFAULT_RAW_BLOBS = pathlib.Path("/tmp/zscaler-automate-blob-proof/raw-blobs")
DEFAULT_OUT = pathlib.Path("/tmp/zscaler-automate-blob-proof/openapi")
HTTP_METHODS = {"get", "put", "post", "delete", "patch", "head", "options", "trace"}
OPERATION_KEYS = {
    "tags",
    "summary",
    "description",
    "externalDocs",
    "operationId",
    "parameters",
    "requestBody",
    "responses",
    "callbacks",
    "deprecated",
    "security",
    "servers",
}
SECURITY_SCHEMES = {
    "BearerAuth": {"type": "http", "scheme": "bearer"},
    "Bearer": {"type": "http", "scheme": "bearer"},
    "bearerAuth": {"type": "http", "scheme": "bearer"},
}
CIRCULAR_RE = re.compile(r"^circular\(([^)]+)\)$")
ERROR_SCHEMA_RE = re.compile(r"error|problem|exception|fault", re.I)
DOMINANT_PATH_PREFIXES = {
    "aiguard": "/v1",
    "zdx": "/v1",
}
NUMERIC_SCHEMA_KEYS = {
    "exclusiveMaximum",
    "exclusiveMinimum",
    "maximum",
    "minimum",
    "multipleOf",
}
INTEGER_SCHEMA_KEYS = {
    "maxItems",
    "maxLength",
    "maxProperties",
    "minItems",
    "minLength",
    "minProperties",
}


def load_raw_product(path: pathlib.Path) -> tuple[str, dict[str, dict[str, object]]]:
    product = path.name.removesuffix("-raw-api.json")
    return product, json.loads(path.read_text(encoding="utf-8"))


def sorted_json(data: object) -> str:
    return json.dumps(data, indent=2, sort_keys=True) + "\n"


def path_params(path: str) -> list[str]:
    return re.findall(r"\{([^}/]+)\}", path or "")


def operation_path_param_names(operation: dict[str, object]) -> set[str]:
    out = set()
    for param in operation.get("parameters") or []:
        if isinstance(param, dict) and param.get("in") == "path" and param.get("name"):
            out.add(str(param["name"]))
    return out


def normalize_openapi_node(node: object, unresolved_refs: set[str] | None = None) -> object:
    """Convert blob schema extensions into OpenAPI-compatible inline shapes."""
    if isinstance(node, str):
        match = CIRCULAR_RE.match(node)
        if match:
            return {
                "description": f"Circular inline schema reference elided: {match.group(1)}.",
                "x-zscaler-circular-ref": match.group(1),
            }
        return node
    if isinstance(node, list):
        return [normalize_openapi_node(item, unresolved_refs) for item in node]
    if not isinstance(node, dict):
        return node

    if "$ref" in node and isinstance(node.get("$ref"), str):
        if unresolved_refs is not None:
            unresolved_refs.add(str(node["$ref"]))
        return {"$ref": node["$ref"]}

    normalized: dict[str, object] = {}
    schema_type = node.get("type")
    for key, value in node.items():
        if key == "discriminator" and isinstance(value, dict):
            discriminator = {k: normalize_openapi_node(v, unresolved_refs) for k, v in value.items() if k != "mapping"}
            mapping = value.get("mapping")
            if isinstance(mapping, dict):
                discriminator["x-zscaler-inline-mapping"] = normalize_openapi_node(mapping, unresolved_refs)
            normalized[key] = discriminator
        elif key == "enum" and isinstance(value, list):
            enum_values = []
            duplicates = []
            seen = set()
            for item in value:
                marker = json.dumps(item, sort_keys=True)
                if marker in seen:
                    duplicates.append(item)
                else:
                    enum_values.append(normalize_openapi_node(item, unresolved_refs))
                    seen.add(marker)
            normalized[key] = enum_values
            if duplicates:
                normalized["x-zscaler-enum-duplicates"] = duplicates
        elif key == "required" and isinstance(value, list):
            required_values = []
            duplicates = []
            seen = set()
            for item in value:
                marker = json.dumps(item, sort_keys=True)
                if marker in seen:
                    duplicates.append(item)
                else:
                    required_values.append(item)
                    seen.add(marker)
            normalized[key] = required_values
            if duplicates:
                normalized["x-zscaler-required-duplicates"] = duplicates
        elif key in NUMERIC_SCHEMA_KEYS and isinstance(value, str) and re.fullmatch(r"-?\d+(?:\.\d+)?", value):
            normalized[key] = float(value) if "." in value else int(value)
            normalized[f"x-zscaler-original-{key}"] = value
        elif key in INTEGER_SCHEMA_KEYS and isinstance(value, str) and re.fullmatch(r"-?\d+", value):
            normalized[key] = int(value)
            normalized[f"x-zscaler-original-{key}"] = value
        elif key in {"default", "example"} and isinstance(value, str):
            if schema_type == "integer" and re.fullmatch(r"-?\d+", value):
                normalized[key] = int(value)
                normalized[f"x-zscaler-original-{key}"] = value
            elif schema_type == "number" and re.fullmatch(r"-?\d+(?:\.\d+)?", value):
                normalized[key] = float(value)
                normalized[f"x-zscaler-original-{key}"] = value
            elif schema_type == "boolean" and value.lower() in {"true", "false"}:
                normalized[key] = value.lower() == "true"
                normalized[f"x-zscaler-original-{key}"] = value
            else:
                normalized[key] = normalize_openapi_node(value, unresolved_refs)
        else:
            normalized[key] = normalize_openapi_node(value, unresolved_refs)
    return normalized


def dedupe_parameters(operation: dict[str, object]) -> dict[str, object]:
    parameters = operation.get("parameters")
    if not isinstance(parameters, list):
        return operation
    kept = []
    duplicates = []
    seen = set()
    for parameter in parameters:
        if not isinstance(parameter, dict):
            kept.append(parameter)
            continue
        key = (parameter.get("in"), parameter.get("name"))
        if key[0] and key[1]:
            if key in seen:
                duplicates.append(parameter)
                continue
            seen.add(key)
        kept.append(parameter)
    operation["parameters"] = kept
    if duplicates:
        operation["x-zscaler-duplicate-parameters"] = duplicates
    return operation


def clean_operation(
    raw_operation: dict[str, object],
    operation_key: str,
    source_url: str,
    provenance: dict[str, object],
    unresolved_refs: set[str] | None = None,
) -> dict[str, object]:
    operation: dict[str, object] = {}
    extras: dict[str, object] = {}
    for key, value in raw_operation.items():
        if key in {"method", "path", "info"}:
            continue
        if key in OPERATION_KEYS or key.startswith("x-"):
            operation[key] = deepcopy(value)
        elif key == "jsonRequestBodyExample":
            extras[key] = deepcopy(value)
        elif key == "postman":
            extras[key] = deepcopy(value)
        elif key == "extensions" and isinstance(value, dict):
            for ext_key, ext_value in value.items():
                if str(ext_key).startswith("x-"):
                    operation[str(ext_key)] = deepcopy(ext_value)
                else:
                    extras.setdefault("extensions", {})[str(ext_key)] = deepcopy(ext_value)
        else:
            extras[key] = deepcopy(value)

    operation["x-zscaler-operation-key"] = operation_key
    operation["x-zscaler-source-url"] = source_url
    operation["x-zscaler-docusaurus"] = deepcopy(provenance)
    if default_response_as_success(raw_operation):
        operation["x-zscaler-default-as-success"] = True
    if extras:
        operation["x-zscaler-docusaurus-extras"] = extras
    normalized = normalize_openapi_node(operation, unresolved_refs)
    return dedupe_parameters(normalized)  # type: ignore[arg-type, return-value]


def response_content_schema(response: dict[str, object] | None) -> dict[str, object] | None:
    if not isinstance(response, dict):
        return None
    content = response.get("content")
    if not isinstance(content, dict):
        return None
    for media in ("application/json", "*/*"):
        entry = content.get(media)
        if isinstance(entry, dict) and isinstance(entry.get("schema"), dict):
            return entry["schema"]
    for entry in content.values():
        if isinstance(entry, dict) and isinstance(entry.get("schema"), dict):
            return entry["schema"]
    return None


def default_response_as_success(operation: dict[str, object]) -> bool:
    responses = operation.get("responses")
    if not isinstance(responses, dict):
        return False
    if any(str(code).startswith("2") and isinstance(response, dict) for code, response in responses.items()):
        return False
    return response_content_schema(responses.get("default") if isinstance(responses.get("default"), dict) else None) is not None


def schema_looks_like_error(schema: object) -> bool:
    if isinstance(schema, str):
        return bool(ERROR_SCHEMA_RE.search(schema))
    if isinstance(schema, list):
        return any(schema_looks_like_error(item) for item in schema)
    if not isinstance(schema, dict):
        return False
    for key in ("title", "description", "$ref", "x-zscaler-unresolved-ref"):
        value = schema.get(key)
        if isinstance(value, str) and ERROR_SCHEMA_RE.search(value):
            return True
    for key in ("items", "properties", "allOf", "oneOf", "anyOf"):
        if schema_looks_like_error(schema.get(key)):
            return True
    return False


def stub_schema_name(ref: str) -> str | None:
    prefix = "#/components/schemas/"
    if not ref.startswith(prefix):
        return None
    name = ref.removeprefix(prefix)
    return name or None


def add_unresolved_ref_stubs(spec: dict[str, object], refs: set[str]) -> None:
    if not refs:
        return
    components = spec.setdefault("components", {})
    if not isinstance(components, dict):
        return
    schemas = components.setdefault("schemas", {})
    if not isinstance(schemas, dict):
        return
    for ref in sorted(refs):
        name = stub_schema_name(ref)
        if not name:
            continue
        schemas.setdefault(
            name,
            {
                "type": "object",
                "description": f"Unresolved source component reference preserved from the Docusaurus blob: {ref}.",
                "x-zscaler-unresolved-ref": ref,
            },
        )


def product_info(product: str, raw_ops: dict[str, dict[str, object]], version: str) -> dict[str, str]:
    titles = Counter()
    descriptions = Counter()
    versions = Counter()
    for entry in raw_ops.values():
        api = entry.get("api") if isinstance(entry.get("api"), dict) else {}
        info = api.get("info") if isinstance(api.get("info"), dict) else {}
        if info.get("title"):
            titles[str(info["title"])] += 1
        if info.get("description"):
            descriptions[str(info["description"])] += 1
        if info.get("version"):
            versions[str(info["version"])] += 1
    title = titles.most_common(1)[0][0] if titles else f"Zscaler Automate {product.upper()} API"
    description = descriptions.most_common(1)[0][0] if descriptions else "Reconstructed from automate.zscaler.com Docusaurus operation blobs."
    return {
        "title": title,
        "version": version if version else (versions.most_common(1)[0][0] if versions else "0.0.0"),
        "description": description,
    }


def product_servers(raw_ops: dict[str, dict[str, object]]) -> list[dict[str, object]]:
    by_url: dict[str, dict[str, object]] = {}
    for entry in raw_ops.values():
        api = entry.get("api") if isinstance(entry.get("api"), dict) else {}
        for server in api.get("servers") or []:
            if isinstance(server, dict) and server.get("url"):
                by_url.setdefault(str(server["url"]), deepcopy(server))
    return [by_url[url] for url in sorted(by_url)]


def build_product_spec(product: str, raw_ops: dict[str, dict[str, object]], version: str) -> tuple[dict[str, object], list[dict[str, object]]]:
    spec: dict[str, object] = {
        "openapi": "3.0.3",
        "info": product_info(product, raw_ops, version),
        "servers": product_servers(raw_ops),
        "paths": {},
        "components": {"securitySchemes": deepcopy(SECURITY_SCHEMES)},
        "x-zscaler-source": {
            "kind": "automate-docusaurus-blobs",
            "product": product,
            "operation_count": len(raw_ops),
        },
    }
    build_issues: list[dict[str, object]] = []
    paths: dict[str, dict[str, object]] = spec["paths"]  # type: ignore[assignment]
    unresolved_refs: set[str] = set()

    for operation_key, entry in sorted(raw_ops.items()):
        api = entry.get("api") if isinstance(entry.get("api"), dict) else {}
        method = str(api.get("method") or "").lower()
        path = str(api.get("path") or "")
        if not method or not path:
            build_issues.append({"product": product, "operation": operation_key, "issue": "missing_method_or_path"})
            continue
        if method not in HTTP_METHODS:
            build_issues.append({"product": product, "operation": operation_key, "issue": "unsupported_http_method", "method": method})
            continue
        path_item = paths.setdefault(path, {})
        if method in path_item:
            build_issues.append({"product": product, "operation": operation_key, "issue": "duplicate_method_path", "method": method, "path": path})
            continue
        path_item[method] = clean_operation(
            api,
            operation_key,
            str(entry.get("source_url") or ""),
            entry.get("docusaurus") if isinstance(entry.get("docusaurus"), dict) else {},
            unresolved_refs,
        )

    add_unresolved_ref_stubs(spec, unresolved_refs)
    return spec, build_issues


def validate_spec(product: str, spec: dict[str, object], build_issues: list[dict[str, object]]) -> list[dict[str, object]]:
    issues = list(build_issues)
    operation_ids: defaultdict[str, list[str]] = defaultdict(list)
    paths = spec.get("paths") if isinstance(spec.get("paths"), dict) else {}
    security_schemes = (
        spec.get("components", {}).get("securitySchemes", {})
        if isinstance(spec.get("components"), dict)
        else {}
    )
    for path, path_item in paths.items():
        if not isinstance(path_item, dict):
            issues.append({"product": product, "path": path, "issue": "invalid_path_item"})
            continue
        if re.search(r"\}\{", str(path)):
            issues.append({"product": product, "path": path, "issue": "adjacent_path_templates"})
        expected_prefix = DOMINANT_PATH_PREFIXES.get(product)
        if expected_prefix and not str(path).startswith(expected_prefix):
            issues.append(
                {
                    "product": product,
                    "path": path,
                    "expected_prefix": expected_prefix,
                    "issue": "path_prefix_anomaly",
                }
            )
        expected_params = set(path_params(str(path)))
        for method, operation in path_item.items():
            if method not in HTTP_METHODS or not isinstance(operation, dict):
                continue
            op_key = str(operation.get("x-zscaler-operation-key") or "")
            if operation.get("x-zscaler-default-as-success"):
                default_schema = response_content_schema(
                    operation.get("responses", {}).get("default")
                    if isinstance(operation.get("responses"), dict)
                    else None
                )
                issues.append(
                    {
                        "product": product,
                        "operation": op_key,
                        "path": path,
                        "method": method,
                        "issue": "default_response_as_success",
                    }
                )
                if schema_looks_like_error(default_schema):
                    issues.append(
                        {
                            "product": product,
                            "operation": op_key,
                            "path": path,
                            "method": method,
                            "issue": "default_response_error_shape",
                        }
                    )
            if operation.get("operationId"):
                operation_ids[str(operation["operationId"])].append(op_key)
            actual_params = operation_path_param_names(operation)
            for name in sorted(expected_params - actual_params):
                issues.append(
                    {
                        "product": product,
                        "operation": op_key,
                        "path": path,
                        "method": method,
                        "issue": "missing_path_parameter",
                        "parameter": name,
                    }
                )
            for name in sorted(actual_params - expected_params):
                issues.append(
                    {
                        "product": product,
                        "operation": op_key,
                        "path": path,
                        "method": method,
                        "issue": "path_parameter_not_in_template",
                        "parameter": name,
                    }
                )
            for requirement in operation.get("security") or []:
                if not isinstance(requirement, dict):
                    continue
                for scheme in requirement:
                    if scheme not in security_schemes:
                        issues.append(
                            {
                                "product": product,
                                "operation": op_key,
                                "path": path,
                                "method": method,
                                "issue": "undefined_security_scheme",
                                "security_scheme": scheme,
                            }
                        )
    for operation_id, operations in sorted(operation_ids.items()):
        if len(operations) > 1:
            issues.append(
                {
                    "product": product,
                    "operation_id": operation_id,
                    "operations": sorted(operations),
                    "issue": "duplicate_operation_id",
                }
            )
    return issues


def write_validation_report(report: dict[str, object], out_dir: pathlib.Path) -> None:
    (out_dir / "openapi-validation-report.json").write_text(sorted_json(report), encoding="utf-8")
    lines = [
        "# OpenAPI Proof Validation Report",
        "",
        "This report is structural validation for the inline proof artifact. It is not a full OpenAPI parser result.",
        "",
        "## Summary",
        "",
        "| product | operations | paths | issues |",
        "|---|---:|---:|---:|",
    ]
    for product, stats in sorted(report["products"].items()):  # type: ignore[index]
        lines.append(f"| `{product}` | {stats['operations']} | {stats['paths']} | {stats['issues']} |")
    lines.extend(["", "## Issue Counts", ""])
    issue_counts = report.get("issue_counts", {})
    if issue_counts:
        for issue, count in sorted(issue_counts.items()):
            lines.append(f"- `{issue}`: {count}")
    else:
        lines.append("- none")
    lines.extend(["", "## Issues", ""])
    for issue in report.get("issues", []):
        lines.append(f"- `{issue.get('product')}` `{issue.get('issue')}` {json.dumps(issue, sort_keys=True)}")
    (out_dir / "openapi-validation-report.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw-dir", type=pathlib.Path, default=DEFAULT_RAW_BLOBS)
    parser.add_argument("--out-dir", type=pathlib.Path, default=DEFAULT_OUT)
    parser.add_argument("--version", default="docusaurus-blob-proof")
    args = parser.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    issues: list[dict[str, object]] = []
    product_stats: dict[str, dict[str, int]] = {}
    for raw_file in sorted(args.raw_dir.glob("*-raw-api.json")):
        product, raw_ops = load_raw_product(raw_file)
        spec, build_issues = build_product_spec(product, raw_ops, args.version)
        product_issues = validate_spec(product, spec, build_issues)
        issues.extend(product_issues)
        paths = spec.get("paths") if isinstance(spec.get("paths"), dict) else {}
        product_stats[product] = {
            "operations": len(raw_ops),
            "paths": len(paths),
            "issues": len(product_issues),
        }
        (args.out_dir / f"{product}.openapi.json").write_text(sorted_json(spec), encoding="utf-8")

    report = {
        "source": "automate-docusaurus-blobs",
        "products": product_stats,
        "issue_counts": dict(Counter(str(issue.get("issue")) for issue in issues)),
        "issues": issues,
    }
    write_validation_report(report, args.out_dir)
    print(f"products: {len(product_stats)}")
    print(f"operations: {sum(stats['operations'] for stats in product_stats.values())}")
    print(f"issues: {len(issues)}")
    print(f"wrote: {args.out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
