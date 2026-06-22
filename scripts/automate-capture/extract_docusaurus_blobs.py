#!/usr/bin/env python3
"""Extract compiled Docusaurus OpenAPI operation blobs from automate.zscaler.com.

This is an exploratory proof tool, deliberately separate from the production
rendered-text capture pipeline. The deployed Docusaurus site does not serve the
aggregate openapispecs/*.json inputs, but each generated operation chunk carries a
compressed frontMatter.api object. This script rebuilds per-product operation JSON
from those blobs and compares it with the committed rendered-text scrape.

Default output is outside the repo:
  /tmp/zscaler-automate-blob-proof/
"""

from __future__ import annotations

import argparse
import base64
import concurrent.futures
import csv
import datetime as dt
import hashlib
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import zlib
from collections import Counter, defaultdict


BASE_URL = "https://automate.zscaler.com/"
DEFAULT_EXISTING = pathlib.Path("vendor/zscaler-api-specs/automate-zscaler")
DEFAULT_OUT = pathlib.Path("/tmp/zscaler-automate-blob-proof")
USER_AGENT = "Mozilla/5.0"
RETRY_STATUSES = {429, 500, 502, 503, 504}

SCRIPT_RE = re.compile(r'<script[^>]+src="([^"]+\.js)"')
API_MDX_RE = re.compile(
    r'"@site/docs/api-reference-and-guides/api-reference/'
    r'(?P<product>[^/]+)/(?P<rest>[^"]+)\.api\.mdx",'
    r'(?P<module>\d+(?:e\d+)?)\]'
)
ROUTE_RE = re.compile(
    r'(?P<entry>(?:"[^"]+"|[A-Za-z0-9_$]+):\[\(\)=>.*?),'
    r'"@site/docs/api-reference-and-guides/api-reference/'
    r'(?P<product>[^/]+)/(?P<rest>[^"]+)\.api\.mdx",'
    r'(?P<module>\d+(?:e\d+)?)\]',
    re.DOTALL,
)
API_BLOB_RE = re.compile(r'api:"([A-Za-z0-9+/=]+)"')
PRODUCT_PATH_PREFIXES = {
    "aiguard": ["/v1"],
    "bi": ["/bi"],
    "easm": ["/easm/easm-ui/v1"],
    "zia": ["/zia/api/v1"],
    "zpa": ["/zpa"],
    "zcloudconnector": ["/ztw/api/v1"],
    "zcc": ["/zcc"],
    "zcell": ["/zcell/config"],
    "zdx": ["/zdx"],
    "zid": ["/ziam/admin/api/v1"],
}


def webpack_int(raw: str) -> int:
    return int(float(raw))


def fetch_bytes(url: str, retries: int = 3) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_error = None
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                return response.read()
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code not in RETRY_STATUSES or attempt == retries:
                raise
        except urllib.error.URLError as exc:
            last_error = exc
            if attempt == retries:
                raise
        time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"fetch failed for {url}: {last_error}")


def fetch_text(url: str) -> str:
    return fetch_bytes(url).decode("utf-8", "replace")


def site_scripts(index_html: str) -> list[str]:
    return [urllib.parse.urljoin(BASE_URL, m.group(1)) for m in SCRIPT_RE.finditer(index_html)]


def chunk_maps(runtime_js: str) -> tuple[dict[int, str], dict[int, str]]:
    m = re.search(
        r'r\.u=e=>"assets/js/"\+\((\{.*?\})\[e\]\|\|e\)\+"\."\+(\{.*?\})\[e\]\+".js"',
        runtime_js,
        re.DOTALL,
    )
    if not m:
        raise RuntimeError("could not parse webpack chunk filename maps")

    def parse_obj(raw: str) -> dict[int, str]:
        return {webpack_int(k): v for k, v in re.findall(r'(\d+(?:e\d+)?):"([^"]+)"', raw)}

    return parse_obj(m.group(1)), parse_obj(m.group(2))


def chunk_url(chunk_id: int, prefix_map: dict[int, str], hash_map: dict[int, str]) -> str:
    prefix = prefix_map.get(chunk_id, str(chunk_id))
    suffix = hash_map.get(chunk_id)
    if not suffix:
        raise RuntimeError(f"missing lazy-chunk hash for {chunk_id}")
    return urllib.parse.urljoin(BASE_URL, f"assets/js/{prefix}.{suffix}.js")


def api_routes(main_js: str) -> list[dict[str, object]]:
    routes = []
    for m in ROUTE_RE.finditer(main_js):
        entry = m.group("entry")
        chunks = [webpack_int(x) for x in re.findall(r"o\.e\((\d+(?:e\d+)?)\)", entry)]
        product = m.group("product")
        rest = m.group("rest")
        group, _, slug = rest.partition("/")
        module_token = m.group("module")
        op = f"{product}/{rest}"
        routes.append(
            {
                "operation": op,
                "product": product,
                "group": group,
                "slug": slug,
                "module": webpack_int(module_token),
                "module_token": module_token,
                "chunks": chunks,
                "source_url": urllib.parse.urljoin(
                    BASE_URL,
                    f"docs/api-reference-and-guides/api-reference/{op}",
                ),
            }
        )
    return sorted(routes, key=lambda r: str(r["operation"]))


def api_mdx_operations(main_js: str) -> list[str]:
    return sorted({f"{m.group('product')}/{m.group('rest')}" for m in API_MDX_RE.finditer(main_js)})


def verify_route_completeness(main_js: str, routes: list[dict[str, object]]) -> dict[str, object]:
    """Hard guard against silent route under-counting when Docusaurus/webpack
    changes shape. This is independent from ROUTE_RE's leading entry matcher: it
    scans every API MDX tail and compares that operation set to api_routes()."""
    candidates = set(api_mdx_operations(main_js))
    matched = {str(route["operation"]) for route in routes}
    missing = sorted(candidates - matched)
    extra = sorted(matched - candidates)
    return {
        "api_mdx_operations": len(candidates),
        "matched_routes": len(matched),
        "missing_routes": missing,
        "extra_routes": extra,
    }


def module_slice(js: str, module_id: int | str) -> str | None:
    marker = re.search(rf"(?:^|[{{,]){re.escape(str(module_id))}:", js)
    if not marker:
        return None
    start = marker.end()
    i = start
    paren = brace = bracket = 0
    quote: str | None = None
    escaped = False
    while i < len(js):
        ch = js[i]
        if quote:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch in ("'", '"', "`"):
            quote = ch
            i += 1
            continue
        if ch == "(":
            paren += 1
        elif ch == ")":
            paren -= 1
        elif ch == "{":
            brace += 1
        elif ch == "}":
            brace -= 1
        elif ch == "[":
            bracket += 1
        elif ch == "]":
            bracket -= 1
        elif ch == "," and paren == 0 and brace == 0 and bracket == 0:
            if re.match(r"\d+(?:e\d+)?:", js[i + 1 : i + 24]):
                return js[start:i]
        i += 1
    return js[start:]


def decode_api_blob(blob: str) -> dict[str, object]:
    raw = base64.b64decode(blob)
    return json.loads(zlib.decompress(raw).decode("utf-8"))


def operation_blob(
    route: dict[str, object],
    get_chunk: object,
    chunk_urls: dict[int, str],
) -> tuple[dict[str, object] | None, str | None, dict[str, object] | None]:
    module_id = int(route["module"])
    module_token = str(route.get("module_token") or module_id)
    route_chunks = [int(x) for x in route["chunks"]]

    # The MDX module is normally in the final lazy chunk. Search in reverse so a
    # full sweep fetches roughly one chunk per operation, not every prefetch chunk
    # named by the route entry.
    lazy_chunks = [chunk_id for chunk_id in reversed(route_chunks) if chunk_id in chunk_urls]
    for chunk_id in lazy_chunks:
        js = get_chunk(chunk_id)
        if not js:
            continue
        sliced = module_slice(js, module_token) or module_slice(js, module_id)
        if not sliced:
            continue
        blobs = API_BLOB_RE.findall(sliced)
        if len(blobs) == 1:
            return decode_api_blob(blobs[0]), None, {
                "module": module_id,
                "chunk_id": chunk_id,
                "chunk_url": chunk_urls[chunk_id],
                "api_blob_sha256": hashlib.sha256(blobs[0].encode("ascii")).hexdigest(),
            }
        if len(blobs) > 1:
            return None, f"ambiguous module api blobs: {len(blobs)}", None

    blobs = []
    blob_sources = []
    for chunk_id in lazy_chunks:
        js = get_chunk(chunk_id)
        if js:
            for blob in API_BLOB_RE.findall(js):
                blobs.append(blob)
                blob_sources.append(chunk_id)
    if len(blobs) == 1:
        chunk_id = blob_sources[0]
        return decode_api_blob(blobs[0]), None, {
            "module": module_id,
            "chunk_id": chunk_id,
            "chunk_url": chunk_urls[chunk_id],
            "api_blob_sha256": hashlib.sha256(blobs[0].encode("ascii")).hexdigest(),
            "module_match": False,
        }
    if not blobs:
        return None, "no api blob found", None
    return None, f"ambiguous route api blobs: {len(blobs)}", None


def normalize_enum(value: object) -> list[str] | None:
    if not isinstance(value, list):
        return None
    out: list[str] = []
    for item in value:
        text = str(item)
        if "|" in text and "," not in text:
            out.extend(part.strip() for part in text.split("|") if part.strip())
        else:
            out.append(text)
    return out


def schema_enum(schema: dict[str, object] | None) -> list[str] | None:
    if not isinstance(schema, dict):
        return None
    direct = normalize_enum(schema.get("enum"))
    if direct:
        return direct
    for key in ("allOf", "oneOf", "anyOf"):
        values = schema.get(key)
        if not isinstance(values, list):
            continue
        out: list[str] = []
        for sub in values:
            nested = schema_enum(sub if isinstance(sub, dict) else None)
            if nested:
                out.extend(nested)
        if out:
            return list(dict.fromkeys(out))
    items = schema.get("items")
    return schema_enum(items if isinstance(items, dict) else None)


def schema_type(schema: dict[str, object]) -> str | None:
    if not schema:
        return None
    typ = schema.get("type")
    fmt = schema.get("format")
    if typ == "integer" and fmt in {"int32", "int64"}:
        return str(fmt)
    if typ == "number" and fmt:
        return str(fmt)
    if typ:
        return str(typ)
    if normalize_enum(schema.get("enum")):
        return "string"
    for key in ("allOf", "oneOf", "anyOf"):
        values = schema.get(key)
        if isinstance(values, list):
            types = {sub_type for sub in values if isinstance(sub, dict) and (sub_type := schema_type(sub))}
            if len(types) == 1:
                return next(iter(types))
            if types:
                return "object" if "object" in types else sorted(types)[0]
    if "properties" in schema:
        return str(schema.get("title") or "object")
    if "items" in schema:
        return "array"
    if "$ref" in schema:
        return str(schema["$ref"]).split("/")[-1]
    return None


def top_name(path: str) -> str | None:
    name = path
    while name.startswith("[]."):
        name = name[3:]
    if name == "[]":
        return None
    name = name.replace("[]", "")
    name = name.split(".", 1)[0]
    return name or None


def content_schema(container: dict[str, object] | None) -> dict[str, object] | None:
    if not container:
        return None
    content = container.get("content")
    if not isinstance(content, dict):
        return None
    for preferred in ("application/json", "*/*"):
        entry = content.get(preferred)
        if isinstance(entry, dict) and isinstance(entry.get("schema"), dict):
            return entry["schema"]
    for entry in content.values():
        if isinstance(entry, dict) and isinstance(entry.get("schema"), dict):
            return entry["schema"]
    return None


def root_schema_summary(schema: dict[str, object] | None) -> dict[str, object] | None:
    if not isinstance(schema, dict):
        return None
    typ = schema_type(schema)
    enum = schema_enum(schema)
    if not typ and not enum:
        return None
    return {
        "type": typ,
        "enum": enum,
        "title": schema.get("title"),
        "description": schema.get("description"),
    }


def flatten_schema(
    schema: dict[str, object] | None,
    prefix: str = "",
    required_names: set[str] | None = None,
    seen: set[int] | None = None,
    parent_readonly: bool = False,
) -> list[dict[str, object]]:
    if not isinstance(schema, dict):
        return []
    if seen is None:
        seen = set()
    obj_id = id(schema)
    if obj_id in seen:
        return []
    seen.add(obj_id)

    fields: list[dict[str, object]] = []
    schema_readonly = parent_readonly or bool(schema.get("readOnly", False))
    # Composition in the compiled docs is already local to the containing field;
    # flatten branches at the same prefix so `auditor.allOf[0].id` becomes the
    # usable field path `auditor.id`.
    for key in ("allOf", "oneOf", "anyOf"):
        values = schema.get(key)
        if isinstance(values, list):
            for sub in values:
                fields.extend(flatten_schema(sub, prefix, set(), seen, schema_readonly))

    required = set(schema.get("required") or [])
    if required_names:
        required |= required_names

    props = schema.get("properties")
    if isinstance(props, dict):
        for name, prop in props.items():
            if not isinstance(prop, dict):
                continue
            path = f"{prefix}.{name}" if prefix else name
            item_schema = prop.get("items") if isinstance(prop.get("items"), dict) else {}
            field_readonly = schema_readonly or bool(prop.get("readOnly", False))
            fields.append(
                {
                    "name": path,
                    "top_name": top_name(path),
                    "type": schema_type(prop),
                    "required": name in required,
                    "readonly": field_readonly,
                    "enum": schema_enum(prop) or schema_enum(item_schema),
                    "description": prop.get("description"),
                    "title": prop.get("title"),
                }
            )
            fields.extend(flatten_schema(prop, path, set(prop.get("required") or []), seen, field_readonly))
            items = prop.get("items")
            if isinstance(items, dict):
                fields.extend(flatten_schema(items, path + "[]", set(items.get("required") or []), seen, field_readonly))

    items = schema.get("items")
    if isinstance(items, dict):
        fields.extend(flatten_schema(items, prefix + "[]" if prefix else "[]", set(items.get("required") or []), seen, schema_readonly))

    # De-duplicate by path while preserving stricter constraints observed later
    # in composed schemas.
    deduped = {}
    for field in fields:
        existing = deduped.get(field["name"])
        if existing is None:
            deduped[field["name"]] = field
            continue
        existing["required"] = bool(existing.get("required")) or bool(field.get("required"))
        existing["readonly"] = bool(existing.get("readonly")) or bool(field.get("readonly"))
        if not existing.get("enum") and field.get("enum"):
            existing["enum"] = field.get("enum")
        elif existing.get("enum") and field.get("enum") and existing.get("enum") != field.get("enum"):
            merged = sorted({str(value) for value in existing["enum"]} | {str(value) for value in field["enum"]})
            existing["enum"] = merged
    return [deduped[name] for name in sorted(deduped)]


def selected_success_responses(api: dict[str, object]) -> list[tuple[str, dict[str, object]]]:
    responses = api.get("responses")
    if not isinstance(responses, dict):
        return []
    success_items = [
        (code, response) for code, response in sorted(responses.items())
        if str(code).startswith("2") and isinstance(response, dict)
    ]
    # ZTW/ZCloudConnector currently emits many operation chunks with only a
    # `default` response, while the rendered docs showed the same schema as the
    # page response contract. Use default only when no explicit 2xx response
    # exists; never merge it into an operation that already has success schemas.
    if not success_items and isinstance(responses.get("default"), dict):
        success_items = [("default", responses["default"])]
    return [(str(code), response) for code, response in success_items]


def success_response_fields(api: dict[str, object]) -> list[dict[str, object]]:
    fields = {}
    for status, response in selected_success_responses(api):
        if not isinstance(response, dict):
            continue
        for field in flatten_schema(content_schema(response)):
            enriched = {**field, "response_status": str(status)}
            fields.setdefault(enriched["name"], enriched)
    return [fields[name] for name in sorted(fields)]


def response_root_summaries(api: dict[str, object]) -> list[dict[str, object]]:
    summaries = []
    for status, response in selected_success_responses(api):
        if not isinstance(response, dict):
            continue
        summary = root_schema_summary(content_schema(response))
        if summary:
            summaries.append({"status": str(status), **summary})
    return summaries


def response_sources(api: dict[str, object]) -> list[str]:
    return [str(status) for status, _ in selected_success_responses(api)]


def parameter_fields(api: dict[str, object], location: str) -> list[dict[str, object]]:
    params = api.get("parameters")
    if not isinstance(params, list):
        return []
    out = []
    for param in params:
        if not isinstance(param, dict) or param.get("in") != location:
            continue
        schema = param.get("schema") if isinstance(param.get("schema"), dict) else {}
        item_schema = schema.get("items") if isinstance(schema.get("items"), dict) else {}
        out.append(
            {
                "name": param.get("name"),
                "type": schema_type(schema),
                "required": bool(param.get("required", False)),
                "readonly": False,
                "enum": schema_enum(schema) or schema_enum(item_schema),
                "description": param.get("description"),
            }
        )
    return sorted(out, key=lambda f: str(f.get("name")))


def normalize_operation(
    route: dict[str, object],
    api: dict[str, object],
    provenance: dict[str, object],
) -> dict[str, object]:
    request_schema = content_schema(api.get("requestBody") if isinstance(api.get("requestBody"), dict) else None)
    method = str(api.get("method") or "").upper() or None
    return {
        "operation": route["operation"],
        "source_url": route["source_url"],
        "operation_id": api.get("operationId"),
        "operation_summary": api.get("description"),
        "docusaurus": provenance,
        "method": method,
        "path": api.get("path"),
        "tags": api.get("tags") if isinstance(api.get("tags"), list) else [],
        "path_params": parameter_fields(api, "path"),
        "query_params": parameter_fields(api, "query"),
        "request_body": flatten_schema(request_schema),
        "response_schema": success_response_fields(api),
        "request_root": root_schema_summary(request_schema),
        "response_roots": response_root_summaries(api),
        "response_sources": response_sources(api),
        "response_statuses": sorted(str(k) for k in (api.get("responses") or {}).keys()),
        "has_json_request_example": api.get("jsonRequestBodyExample") is not None,
    }


def load_existing(path: pathlib.Path) -> dict[str, dict[str, dict[str, object]]]:
    products = {}
    for file in sorted(path.glob("*-api-reference.json")):
        product = file.name.removesuffix("-api-reference.json")
        products[product] = json.loads(file.read_text(encoding="utf-8"))
    return products


def field_names(fields: list[dict[str, object]], top_level: bool = False) -> set[str]:
    names = set()
    for field in fields or []:
        name = str(field.get("name") or "")
        if not name:
            continue
        if top_level:
            name = top_name(name)
        if name:
            names.add(name)
    return names


def normalized_path(product: str, path: str | None, loose_params: bool = False) -> str:
    if not path:
        return ""
    normalized = re.sub(r":([A-Za-z0-9_]+)", r"{\1}", path)
    for prefix in PRODUCT_PATH_PREFIXES.get(product, []):
        if normalized == prefix or normalized.startswith(prefix + "/"):
            normalized = normalized[len(prefix):] or "/"
            break
    if loose_params:
        normalized = re.sub(r"\{[^/]+\}", "{}", normalized)
    return normalized


def op_signature(product: str, operation: dict[str, object], loose_params: bool = False) -> tuple[str, str]:
    return (
        str(operation.get("method") or "").upper(),
        normalized_path(product, operation.get("path"), loose_params=loose_params),
    )


def compare_products(
    rebuilt: dict[str, dict[str, dict[str, object]]],
    existing: dict[str, dict[str, dict[str, object]]],
) -> dict[str, object]:
    products = {}
    totals = Counter()
    examples = []
    for product in sorted(set(rebuilt) | set(existing)):
        live = rebuilt.get(product, {})
        old = existing.get(product, {})
        common = sorted(set(live) & set(old))
        live_only = sorted(set(live) - set(old))
        old_only = sorted(set(old) - set(live))
        live_sig = {op_signature(product, operation) for operation in live.values()}
        old_sig = {op_signature(product, operation) for operation in old.values()}
        live_loose_sig = {op_signature(product, operation, loose_params=True) for operation in live.values()}
        old_loose_sig = {op_signature(product, operation, loose_params=True) for operation in old.values()}
        summary = Counter(
            {
                "live_ops": len(live),
                "existing_ops": len(old),
                "route_key_common_ops": len(common),
                "path_signature_common_ops": len(live_sig & old_sig),
                "loose_path_signature_common_ops": len(live_loose_sig & old_loose_sig),
                "live_only_ops": len(live_only),
                "existing_only_ops": len(old_only),
                "live_only_path_signatures": len(live_sig - old_sig),
                "existing_only_path_signatures": len(old_sig - live_sig),
                "live_only_loose_path_signatures": len(live_loose_sig - old_loose_sig),
                "existing_only_loose_path_signatures": len(old_loose_sig - live_loose_sig),
            }
        )
        for op in common:
            new = live[op]
            previous = old[op]
            for section in ("path_params", "query_params", "request_body", "response_schema"):
                old_names = field_names(previous.get(section) or [], top_level=True)
                new_top = field_names(new.get(section) or [], top_level=True)
                new_flat = field_names(new.get(section) or [], top_level=False)
                nested = {n for n in new_flat if "." in n or "[]" in n}
                summary[f"existing_{section}_top_fields"] += len(old_names)
                summary[f"blob_{section}_top_fields"] += len(new_top)
                summary[f"blob_{section}_flat_fields"] += len(new_flat)
                summary[f"blob_{section}_nested_fields"] += len(nested)
                summary[f"blob_{section}_new_top_vs_existing"] += len(new_top - old_names)
                summary[f"blob_{section}_missing_top_vs_existing"] += len(old_names - new_top)
                if nested and len(examples) < 30:
                    old_ref_fields = [
                        {
                            "name": f.get("name"),
                            "type": f.get("type"),
                        }
                        for f in previous.get(section) or []
                        if isinstance(f.get("type"), str) and re.search(r"[A-Z][A-Za-z0-9_]*(?:\[\])?$", f["type"])
                    ]
                    examples.append(
                        {
                            "product": product,
                            "operation": op,
                            "section": section,
                            "nested_field_count": len(nested),
                            "sample_nested_fields": sorted(nested)[:20],
                            "rendered_text_object_refs": old_ref_fields[:20],
                        }
                    )
        products[product] = {
            **dict(summary),
            "live_only_sample": live_only[:20],
            "existing_only_sample": old_only[:20],
            "live_only_loose_path_sample": sorted(live_loose_sig - old_loose_sig)[:20],
            "existing_only_loose_path_sample": sorted(old_loose_sig - live_loose_sig)[:20],
        }
        totals.update(summary)
    return {
        "totals": dict(totals),
        "products": products,
        "nested_examples": examples,
    }


def csv_cell(value: object) -> object:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (dict, list)):
        return json.dumps(value, sort_keys=True)
    return value


def write_table(rows: list[dict[str, object]], path_prefix: pathlib.Path, fieldnames: list[str]) -> None:
    path_prefix.with_suffix(".json").write_text(json.dumps(rows, indent=2) + "\n", encoding="utf-8")
    with path_prefix.with_suffix(".csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({name: csv_cell(row.get(name)) for name in fieldnames})


def operation_rows(rebuilt: dict[str, dict[str, dict[str, object]]]) -> list[dict[str, object]]:
    rows = []
    for product, ops in sorted(rebuilt.items()):
        for operation, op in sorted(ops.items()):
            parts = operation.split("/", 2)
            doc = op.get("docusaurus") if isinstance(op.get("docusaurus"), dict) else {}
            rows.append(
                {
                    "product": product,
                    "group": parts[1] if len(parts) > 1 else "",
                    "slug": parts[2] if len(parts) > 2 else "",
                    "operation": operation,
                    "method": op.get("method"),
                    "path": op.get("path"),
                    "operation_id": op.get("operation_id"),
                    "summary": op.get("operation_summary"),
                    "tags": op.get("tags"),
                    "source_url": op.get("source_url"),
                    "response_statuses": op.get("response_statuses"),
                    "response_sources": op.get("response_sources"),
                    "request_root": op.get("request_root"),
                    "response_roots": op.get("response_roots"),
                    "has_json_request_example": op.get("has_json_request_example"),
                    "docusaurus_module": doc.get("module"),
                    "docusaurus_chunk_id": doc.get("chunk_id"),
                    "docusaurus_chunk_url": doc.get("chunk_url"),
                    "api_blob_sha256": doc.get("api_blob_sha256"),
                    "module_match": doc.get("module_match", True),
                }
            )
    return rows


def root_field_row(
    product: str,
    op: dict[str, object],
    section: str,
    root: dict[str, object],
    response_status: str | None = None,
) -> dict[str, object]:
    doc = op.get("docusaurus") if isinstance(op.get("docusaurus"), dict) else {}
    return {
        "product": product,
        "operation": op.get("operation"),
        "method": op.get("method"),
        "path": op.get("path"),
        "source_url": op.get("source_url"),
        "section": section,
        "field_path": "$",
        "top_field": "$",
        "type": root.get("type"),
        "required": False,
        "readonly": False,
        "readonly_in_request_schema": False,
        "enum": root.get("enum"),
        "description": root.get("description"),
        "title": root.get("title"),
        "response_status": response_status,
        "is_root_schema": True,
        "api_blob_sha256": doc.get("api_blob_sha256"),
    }


def field_rows(rebuilt: dict[str, dict[str, dict[str, object]]]) -> list[dict[str, object]]:
    rows = []
    for product, ops in sorted(rebuilt.items()):
        for _, op in sorted(ops.items()):
            doc = op.get("docusaurus") if isinstance(op.get("docusaurus"), dict) else {}
            for section in ("path_params", "query_params", "request_body", "response_schema"):
                fields = op.get(section) if isinstance(op.get(section), list) else []
                for field in fields:
                    rows.append(
                        {
                            "product": product,
                            "operation": op.get("operation"),
                            "method": op.get("method"),
                            "path": op.get("path"),
                            "source_url": op.get("source_url"),
                            "section": section,
                            "field_path": field.get("name"),
                            "top_field": field.get("top_name") or top_name(str(field.get("name") or "")),
                            "type": field.get("type"),
                            "required": bool(field.get("required", False)),
                            "readonly": bool(field.get("readonly", False)),
                            "readonly_in_request_schema": section == "request_body" and bool(field.get("readonly", False)),
                            "enum": field.get("enum"),
                            "description": field.get("description"),
                            "title": field.get("title"),
                            "response_status": field.get("response_status") if section == "response_schema" else None,
                            "is_root_schema": False,
                            "api_blob_sha256": doc.get("api_blob_sha256"),
                        }
                    )
                if section == "request_body" and not fields and isinstance(op.get("request_root"), dict):
                    rows.append(root_field_row(product, op, section, op["request_root"]))
            response_counts = Counter(
                str(field.get("response_status"))
                for field in op.get("response_schema") or []
                if isinstance(field, dict) and field.get("response_status")
            )
            for root in op.get("response_roots") or []:
                if not isinstance(root, dict):
                    continue
                status = str(root.get("status") or "")
                if status and not response_counts.get(status):
                    rows.append(root_field_row(product, op, "response_schema", root, response_status=status))
    return rows


def pair_delta_rows(
    rebuilt: dict[str, dict[str, dict[str, object]]],
    existing: dict[str, dict[str, dict[str, object]]],
) -> list[dict[str, object]]:
    rows = []
    for product in sorted(set(rebuilt) | set(existing)):
        live = rebuilt.get(product, {})
        old = existing.get(product, {})
        used_live: set[str] = set()
        used_old: set[str] = set()

        def add_row(
            strategy: str,
            old_key: str | None,
            live_key: str | None,
            *,
            product: str = product,
            old: dict[str, dict[str, object]] = old,
            live: dict[str, dict[str, object]] = live,
        ) -> None:
            previous = old.get(old_key or "", {})
            current = live.get(live_key or "", {})
            rows.append(
                {
                    "product": product,
                    "match_strategy": strategy,
                    "old_operation": old_key,
                    "new_operation": live_key,
                    "old_method": previous.get("method"),
                    "new_method": current.get("method"),
                    "old_path": previous.get("path"),
                    "new_path": current.get("path"),
                    "old_normalized_path": normalized_path(product, previous.get("path")),
                    "new_normalized_path": normalized_path(product, current.get("path")),
                    "old_source_url": previous.get("source_url"),
                    "new_source_url": current.get("source_url"),
                }
            )

        for key in sorted(set(live) & set(old)):
            add_row("route-key", key, key)
            used_old.add(key)
            used_live.add(key)

        def add_signature_matches(
            strategy: str,
            loose_params: bool = False,
            *,
            product: str = product,
            old: dict[str, dict[str, object]] = old,
            live: dict[str, dict[str, object]] = live,
            used_old: set[str] = used_old,
            used_live: set[str] = used_live,
        ) -> None:
            live_by_sig: dict[tuple[str, str], list[str]] = defaultdict(list)
            old_by_sig: dict[tuple[str, str], list[str]] = defaultdict(list)
            for key, op in live.items():
                if key not in used_live:
                    live_by_sig[op_signature(product, op, loose_params=loose_params)].append(key)
            for key, op in old.items():
                if key not in used_old:
                    old_by_sig[op_signature(product, op, loose_params=loose_params)].append(key)
            for signature in sorted(set(live_by_sig) & set(old_by_sig)):
                for old_key, live_key in zip(sorted(old_by_sig[signature]), sorted(live_by_sig[signature]), strict=False):
                    if old_key in used_old or live_key in used_live:
                        continue
                    add_row(strategy, old_key, live_key)
                    used_old.add(old_key)
                    used_live.add(live_key)

        add_signature_matches("method-path")
        add_signature_matches("loose-method-path", loose_params=True)

        for key in sorted(set(old) - used_old):
            add_row("old-only", key, None)
        for key in sorted(set(live) - used_live):
            add_row("new-only", None, key)
    return rows


OPERATION_FIELDNAMES = [
    "product",
    "group",
    "slug",
    "operation",
    "method",
    "path",
    "operation_id",
    "summary",
    "tags",
    "source_url",
    "response_statuses",
    "response_sources",
    "request_root",
    "response_roots",
    "has_json_request_example",
    "docusaurus_module",
    "docusaurus_chunk_id",
    "docusaurus_chunk_url",
    "api_blob_sha256",
    "module_match",
]

FIELD_FIELDNAMES = [
    "product",
    "operation",
    "method",
    "path",
    "source_url",
    "section",
    "field_path",
    "top_field",
    "type",
    "required",
    "readonly",
    "readonly_in_request_schema",
    "enum",
    "description",
    "title",
    "response_status",
    "is_root_schema",
    "api_blob_sha256",
]

DELTA_FIELDNAMES = [
    "product",
    "match_strategy",
    "old_operation",
    "new_operation",
    "old_method",
    "new_method",
    "old_path",
    "new_path",
    "old_normalized_path",
    "new_normalized_path",
    "old_source_url",
    "new_source_url",
]


def write_markdown(report: dict[str, object], path: pathlib.Path) -> None:
    compare = report["comparison"]
    products = compare["products"]
    lines = [
        "# Automate Docusaurus Blob Proof",
        "",
        f"Captured at: `{report['captured_at']}`",
        f"Main JS: `{report['main_js']}`",
        f"Runtime JS: `{report['runtime_js']}`",
        "",
        "## Summary",
        "",
        f"- Routes discovered: **{report['routes_discovered']}**",
        f"- API MDX route candidates matched: "
        f"**{report.get('route_completeness', {}).get('matched_routes', 0)} / "
        f"{report.get('route_completeness', {}).get('api_mdx_operations', 0)}**",
        f"- API blobs decoded: **{report['decoded_ops']}**",
        f"- Decode failures: **{len(report['decode_failures'])}**",
        f"- Existing rendered-text ops: **{compare['totals'].get('existing_ops', 0)}**",
        f"- Live-only route keys: **{compare['totals'].get('live_only_ops', 0)}**",
        f"- Existing-only route keys: **{compare['totals'].get('existing_only_ops', 0)}**",
        f"- Live-only loose method/path signatures: "
        f"**{compare['totals'].get('live_only_loose_path_signatures', 0)}**",
        f"- Existing-only loose method/path signatures: "
        f"**{compare['totals'].get('existing_only_loose_path_signatures', 0)}**",
        "",
        "## Product Counts",
        "",
        "| product | live blobs | existing scrape | route-key common ops | loose path common sigs | live-only route keys | existing-only route keys | request nested | response nested |",
        "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
    ]
    for product, stats in products.items():
        lines.append(
            f"| `{product}` | {stats.get('live_ops', 0)} | {stats.get('existing_ops', 0)} | "
            f"{stats.get('route_key_common_ops', 0)} | "
            f"{stats.get('loose_path_signature_common_ops', 0)} | "
            f"{stats.get('live_only_ops', 0)} | "
            f"{stats.get('existing_only_ops', 0)} | "
            f"{stats.get('blob_request_body_nested_fields', 0)} | "
            f"{stats.get('blob_response_schema_nested_fields', 0)} |"
        )
    lines.extend(["", "## Field Totals", ""])
    for section in ("path_params", "query_params", "request_body", "response_schema"):
        lines.append(f"### `{section}`")
        lines.append("")
        lines.append(
            f"- Existing top-level fields across common ops: "
            f"{compare['totals'].get(f'existing_{section}_top_fields', 0)}"
        )
        lines.append(
            f"- Blob top-level fields across common ops: "
            f"{compare['totals'].get(f'blob_{section}_top_fields', 0)}"
        )
        lines.append(
            f"- Blob flattened fields across common ops: "
            f"{compare['totals'].get(f'blob_{section}_flat_fields', 0)}"
        )
        lines.append(
            f"- Blob nested fields across common ops: "
            f"{compare['totals'].get(f'blob_{section}_nested_fields', 0)}"
        )
        lines.append(
            f"- Blob top-level fields new vs rendered text: "
            f"{compare['totals'].get(f'blob_{section}_new_top_vs_existing', 0)}"
        )
        lines.append(
            f"- Rendered-text top-level fields missing from blob: "
            f"{compare['totals'].get(f'blob_{section}_missing_top_vs_existing', 0)}"
        )
        lines.append("")
    lines.extend(["## Live-Only Samples", ""])
    for product, stats in products.items():
        sample = stats.get("live_only_sample") or []
        if sample:
            lines.append(f"### `{product}`")
            lines.extend([f"- `{op}`" for op in sample])
            lines.append("")
    lines.extend(["## Loose Method/Path-Only Samples", ""])
    for product, stats in products.items():
        live_sample = stats.get("live_only_loose_path_sample") or []
        existing_sample = stats.get("existing_only_loose_path_sample") or []
        if live_sample or existing_sample:
            lines.append(f"### `{product}`")
            if live_sample:
                lines.append("- Live-only loose signatures:")
                lines.extend([f"  - `{method} {path}`" for method, path in live_sample[:10]])
            if existing_sample:
                lines.append("- Existing-only loose signatures:")
                lines.extend([f"  - `{method} {path}`" for method, path in existing_sample[:10]])
            lines.append("")
    lines.extend(["## Nested Schema Examples", ""])
    for ex in compare["nested_examples"][:15]:
        lines.append(f"### `{ex['operation']}` / `{ex['section']}`")
        if ex["rendered_text_object_refs"]:
            refs = ", ".join(f"`{r['name']}: {r['type']}`" for r in ex["rendered_text_object_refs"][:8])
            lines.append(f"- Rendered-text object refs: {refs}")
        lines.append(f"- Blob nested fields ({ex['nested_field_count']}):")
        lines.extend(f"  - `{field}`" for field in ex["sample_nested_fields"][:12])
        lines.append("")
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out-dir", type=pathlib.Path, default=DEFAULT_OUT)
    parser.add_argument("--existing-dir", type=pathlib.Path, default=DEFAULT_EXISTING)
    parser.add_argument("--workers", type=int, default=16)
    args = parser.parse_args()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    reconstructed_dir = args.out_dir / "reconstructed"
    raw_blob_dir = args.out_dir / "raw-blobs"
    sheets_dir = args.out_dir / "sheets"
    reconstructed_dir.mkdir(parents=True, exist_ok=True)
    raw_blob_dir.mkdir(parents=True, exist_ok=True)
    sheets_dir.mkdir(parents=True, exist_ok=True)

    index = fetch_text(BASE_URL)
    scripts = site_scripts(index)
    runtime_url = next((u for u in scripts if "/runtime~main." in u), None)
    main_url = next((u for u in scripts if "/main." in u), None)
    if not runtime_url or not main_url:
        raise RuntimeError(f"could not find runtime/main scripts in {scripts}")
    runtime_js = fetch_text(runtime_url)
    main_js = fetch_text(main_url)
    prefix_map, hash_map = chunk_maps(runtime_js)
    routes = api_routes(main_js)
    if not routes:
        raise RuntimeError("no API routes found")
    route_completeness = verify_route_completeness(main_js, routes)
    if route_completeness["missing_routes"] or route_completeness["extra_routes"]:
        raise RuntimeError(
            "API route discovery mismatch: "
            f"{len(route_completeness['missing_routes'])} missing, "
            f"{len(route_completeness['extra_routes'])} extra"
        )

    chunk_ids = sorted({cid for route in routes for cid in route["chunks"]})
    # Some shared chunks are already installed by the runtime and have no lazy
    # filename entry (for example 71869 on the current site). Operation API blobs
    # live in lazy MDX chunks, so skip installed chunks that r.u cannot name.
    urls = {cid: chunk_url(cid, prefix_map, hash_map) for cid in chunk_ids if cid in hash_map}
    primary_chunk_ids = sorted({
        next((cid for cid in reversed(route["chunks"]) if cid in urls), None)
        for route in routes
    } - {None})

    print(f"routes: {len(routes)}")
    print(f"primary chunks: {len(primary_chunk_ids)}")
    chunks: dict[int, str] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        future_to_id = {pool.submit(fetch_bytes, urls[cid]): cid for cid in primary_chunk_ids}
        for i, future in enumerate(concurrent.futures.as_completed(future_to_id), 1):
            cid = future_to_id[future]
            chunks[cid] = future.result().decode("utf-8", "replace")
            if i % 100 == 0 or i == len(future_to_id):
                print(f"fetched chunks: {i}/{len(future_to_id)}")

    def get_chunk(chunk_id: int) -> str | None:
        if chunk_id not in urls:
            return None
        if chunk_id not in chunks:
            chunks[chunk_id] = fetch_text(urls[chunk_id])
        return chunks[chunk_id]

    rebuilt: dict[str, dict[str, dict[str, object]]] = defaultdict(dict)
    raw_blobs: dict[str, dict[str, dict[str, object]]] = defaultdict(dict)
    failures = []
    for route in routes:
        api, error, provenance = operation_blob(route, get_chunk, urls)
        if error or api is None:
            failures.append({"operation": route["operation"], "error": error})
            continue
        normalized = normalize_operation(route, api, provenance or {})
        rebuilt[str(route["product"])][str(route["operation"])] = normalized
        raw_blobs[str(route["product"])][str(route["operation"])] = {
            "operation": route["operation"],
            "source_url": route["source_url"],
            "docusaurus": provenance or {},
            "api": api,
        }

    for product, ops in sorted(rebuilt.items()):
        (reconstructed_dir / f"{product}-api-reference.json").write_text(
            json.dumps(dict(sorted(ops.items())), indent=2) + "\n",
            encoding="utf-8",
        )
    for product, ops in sorted(raw_blobs.items()):
        (raw_blob_dir / f"{product}-raw-api.json").write_text(
            json.dumps(dict(sorted(ops.items())), indent=2) + "\n",
            encoding="utf-8",
        )

    existing = load_existing(args.existing_dir)
    comparison = compare_products(rebuilt, existing)
    report = {
        "captured_at": dt.datetime.now(dt.UTC).isoformat(),
        "base_url": BASE_URL,
        "main_js": main_url,
        "runtime_js": runtime_url,
        "routes_discovered": len(routes),
        "route_completeness": route_completeness,
        "decoded_ops": sum(len(ops) for ops in rebuilt.values()),
        "decode_failures": failures,
        "comparison": comparison,
    }
    (args.out_dir / "compare-summary.json").write_text(
        json.dumps(report, indent=2) + "\n",
        encoding="utf-8",
    )
    write_markdown(report, args.out_dir / "compare-summary.md")
    write_table(operation_rows(rebuilt), sheets_dir / "automate-operations", OPERATION_FIELDNAMES)
    write_table(field_rows(rebuilt), sheets_dir / "automate-fields", FIELD_FIELDNAMES)
    write_table(pair_delta_rows(rebuilt, existing), sheets_dir / "automate-deltas", DELTA_FIELDNAMES)
    print(f"decoded: {report['decoded_ops']}/{len(routes)}")
    print(f"failures: {len(failures)}")
    print(f"wrote: {args.out_dir}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
