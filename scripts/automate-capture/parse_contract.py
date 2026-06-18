#!/usr/bin/env python3
"""parse_contract.py — rendered automate.zscaler.com op-page text -> normalized contract.

Deterministic, no network, no LLM. Reads the raw <article> text that capture.cjs
dumped and emits, per operation, {operation, source_url, raw_sha256, method, path,
path_params, query_params, request_body, response_schema} where each field is
{name, type, required, readonly, enum, description?}. It also emits a conservative
per-product <product>-components.json graph for nested object refs found in those
field types. The parser is the trust boundary between the rendered page and every
downstream consumer, so it is pinned by test_parse_contract.py against committed
fixtures.

Grammar (observed, ZPA OneAPI reference):
  <breadcrumb/title>
  <METHOD>            POST|PUT|GET|DELETE|PATCH on its own line
  https://api.zsapi.net/...   path on its own line
  PATH PARAMETERS    field blocks
  QUERY PARAMETERS   field blocks
  BODY[REQUIRED]     request-body field blocks (absent for GET/DELETE)
  Responses          ... status codes ...
  SCHEMA             response-body field blocks
  CURL JAVA ...      language tabs (end marker)

A field block is:  name \n type [\n REQUIRED] [\n "Possible values: [..]"] [\n prose]
  - required: literal "REQUIRED" line under the field
  - readonly: prose "Only applicable for a GET request. Ignored in PUT/POST/DELETE"
  - enum:     "Possible values: [A, B, C]"

Field-vs-prose discriminator: a field is a `name` line whose NEXT line is a type
token, where types are a closed primitive set, PascalCase object refs, or named
primitive aliases like `SourceType (string)`. That cleanly separates camelCase
field names (e.g. praEnabled) from types (string).
"""
import copy
import json
import os
import re
import sys

PRIMITIVES = {
    "string", "boolean", "number", "integer", "int32", "int64",
    "object", "float", "double", "long", "byte", "date", "date-time",
}

# Lines that are structural, never a field name.
SECTION_MARKERS = {
    "Request", "PATH PARAMETERS", "QUERY PARAMETERS", "APPLICATION/JSON",
    "Responses", "Schema", "Example (auto)", "SCHEMA", "HEADER PARAMETERS",
}
LANG_TABS = {
    "CURL", "JAVA", "PYTHON", "GO", "JAVASCRIPT", "CSHARP", "POWERSHELL",
    "NODEJS", "RUBY", "PHP", "DART", "C", "OBJECTIVE-C", "OCAML", "R",
    "SWIFT", "KOTLIN", "RUST",
}
_ENUM_RE = re.compile(r"Possible values:\s*\[(.*)\]")
# Readonly is expressed in prose, and the wording varies by product:
#   ZPA: "Only applicable for a GET request. Ignored in PUT/POST/DELETE requests."
#        "Read only. Ignored in PUT/POST calls."
#   ZIA: "This is a read-only field." / "this attribute is a read-only field" /
#        "This field is read-only." / "... is read-only" / "Read Only. ..."
# Deliberately NOT matched — these are not readonly fields: "ignored during policy
# evaluation" (evaluation logic), "ignored by PUT requests, but required for POST"
# (settable on create), "non-editable ... cannot be modified" (conditional state).
_READONLY_RE = re.compile(
    r"Only applicable for a GET request"
    r"|Ignored in PUT/POST"
    r"|read-only field"
    r"|is read-only"
    r"|\bRead only\.",
    re.IGNORECASE,
)


def _is_type(s):
    """A type token: primitive, PascalCase object ref, or named primitive alias."""
    if not s:
        return False
    base = s[:-2] if s.endswith("[]") else s
    if base in PRIMITIVES:
        return True
    if re.match(
        r"^[A-Z][A-Za-z0-9_]* "
        r"\((string|boolean|number|integer|int32|int64|object|float|double|long|byte|date|date-time)\)$",
        base,
    ):
        return True
    return bool(re.match(r"^[A-Z][A-Za-z0-9_]*$", base))


def _is_name(s):
    """A field name: single identifier token, not a structural keyword."""
    if not s or s in SECTION_MARKERS or s in LANG_TABS or s == "REQUIRED":
        return False
    return bool(re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", s))


def _parse_enum(raw):
    """Parse bracketed enum values from Automate pages.

    Most pages render values as comma-separated lists. A few ZIA pages render the
    same list shape as `A|B|C`; split those only when no commas are present so we
    do not reinterpret comma-delimited pages that happen to include a pipe.
    """
    sep = "|" if "|" in raw and "," not in raw else ","
    return [x.strip() for x in raw.split(sep) if x.strip()]


def _description(lines):
    clean = [re.sub(r"\s+", " ", line.strip()) for line in lines if line.strip()]
    return " ".join(clean) if clean else None


def _parse_fields(lines):
    """Parse a slice of lines into field dicts using the name/type discriminator."""
    fields = []
    i, n = 0, len(lines)
    while i < n:
        name = lines[i].strip()
        if not (_is_name(name) and i + 1 < n and _is_type(lines[i + 1].strip())):
            i += 1
            continue
        typ = lines[i + 1].strip()
        i += 2
        required = readonly = False
        enum = None
        description_lines = []
        # Consume annotation lines until the next field starts or the slice ends.
        while i < n:
            ln = lines[i].strip()
            nxt = lines[i + 1].strip() if i + 1 < n else ""
            if _is_name(ln) and _is_type(nxt):
                break  # next field
            if ln == "REQUIRED":
                required = True
            elif _READONLY_RE.search(ln):
                readonly = True
                if ln:
                    description_lines.append(ln)
            else:
                m = _ENUM_RE.search(ln)
                if m:
                    enum = _parse_enum(m.group(1))
                elif ln:
                    description_lines.append(ln)
            i += 1
        field = {
            "name": name, "type": typ,
            "required": required, "readonly": readonly, "enum": enum,
        }
        desc = _description(description_lines)
        if desc:
            field["description"] = desc
        fields.append(field)
    return fields


def _find(lines, pred, start=0):
    for i in range(start, len(lines)):
        if pred(lines[i].strip()):
            return i
    return -1


def parse_contract(text):
    lines = text.split("\n")
    stripped = [l.strip() for l in lines]

    method = None
    for s in stripped:
        if s in ("GET", "POST", "PUT", "DELETE", "PATCH"):
            method = s
            break

    path = None
    for s in stripped:
        m = re.match(r"^https?://[^/]+(/\S+)", s)
        if m:
            path = m.group(1)
            break

    # Operation summary is repeated on line 1 (line 0 is the concatenated breadcrumb).
    operation = stripped[1] if len(stripped) > 1 else None

    i_path = _find(stripped, lambda s: s == "PATH PARAMETERS")
    i_query = _find(stripped, lambda s: s == "QUERY PARAMETERS")
    i_body = _find(stripped, lambda s: s.startswith("BODY"))
    i_resp = _find(stripped, lambda s: s == "Responses")
    i_schema = _find(stripped, lambda s: s == "SCHEMA", max(i_resp, 0))
    i_end = _find(stripped, lambda s: s in LANG_TABS, max(i_schema, 0))
    if i_end == -1:
        i_end = len(stripped)

    def slice_after(start, *ends):
        if start == -1:
            return []
        ends = [e for e in ends if e != -1 and e > start]
        stop = min(ends) if ends else len(stripped)
        return stripped[start + 1:stop]

    return {
        "operation_summary": operation,
        "method": method,
        "path": path,
        "path_params": _parse_fields(slice_after(i_path, i_query, i_body, i_resp)),
        "query_params": _parse_fields(slice_after(i_query, i_body, i_resp)),
        "request_body": _parse_fields(slice_after(i_body, i_resp)) if i_body != -1 else [],
        "response_schema": _parse_fields(stripped[i_schema + 1:i_end]) if i_schema != -1 else [],
    }


def _load_provenance(raw_dir):
    p = os.path.join(raw_dir, "provenance.json")
    if not os.path.exists(p):
        return {}
    return {r["operation"]: r for r in json.load(open(p, encoding="utf-8")) if "operation" in r}


def parse_tree(raw_dir):
    """Walk raw_dir for *.txt, parse each, merge provenance, key by operation path."""
    prov = _load_provenance(raw_dir)
    contracts = {}
    for root, _, files in os.walk(raw_dir):
        for fn in sorted(files):
            if not fn.endswith(".txt"):
                continue
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, raw_dir)[:-4]  # strip .txt
            text = open(full, encoding="utf-8").read()
            c = parse_contract(text)
            pr = prov.get(rel, {})
            contracts[rel] = {
                "operation": rel,
                "source_url": pr.get("source_url"),
                "raw_sha256": pr.get("sha256"),
                **c,
            }
    return dict(sorted(contracts.items()))


def _ref_type(typ):
    """Return a nested object type reference, excluding primitives/aliases."""
    if not typ:
        return None
    base = typ[:-2] if typ.endswith("[]") else typ
    if base in PRIMITIVES or base == "REQUIRED" or "(" in base:
        return None
    if re.fullmatch(r"[A-Z][A-Za-z0-9_]*", base):
        return base
    return None


def _group_name(operation_key):
    parts = operation_key.split("/")
    return parts[1] if len(parts) > 2 else ""


def _is_page_wrapper(fields):
    names = {f.get("name") for f in fields}
    return names == {"currentCount", "list", "totalCount", "totalPages"}


def _wrapper_list_ref(fields):
    if not _is_page_wrapper(fields):
        return None
    for field in fields:
        if field.get("name") == "list":
            return _ref_type(field.get("type"))
    return None


def _same_collection_path(collection_path, candidate_path):
    if not collection_path or not candidate_path:
        return False
    return candidate_path == collection_path or candidate_path.startswith(collection_path + "/:")


def _camel_tokens(value):
    spaced = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", value)
    return re.findall(r"[a-z0-9]+", spaced.lower())


def _type_tokens(type_name):
    tokens = _camel_tokens(type_name)
    return [t for t in tokens if t not in {"dto", "resource", "base", "entity"}]


def _operation_tokens(operation_key, operation):
    text = " ".join([
        operation_key.replace("/", " ").replace("-", " "),
        str(operation.get("operation_summary") or ""),
        str(operation.get("path") or ""),
    ])
    return set(re.findall(r"[a-z0-9]+", re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", text).lower()))


def _merge_fields(operations):
    fields = {}
    source_operations = []
    for op_key, operation in operations:
        schema = operation.get("response_schema") or []
        if not schema or _is_page_wrapper(schema):
            continue
        source_operations.append(op_key)
        for field in schema:
            name = field.get("name")
            if name:
                fields.setdefault(name, copy.deepcopy(field))
    return [fields[name] for name in sorted(fields)], sorted(source_operations)


def build_components(operations):
    """Build a conservative nested-type component graph.

    Resolution rules:
    - exact list-wrapper evidence wins: if a response wrapper has `list: Type[]`,
      resolve Type from non-wrapper response schemas in the same operation group.
    - otherwise, resolve only when all normalized type-name tokens appear in an
      operation's key/summary/path text.
    - unresolved refs stay explicit with their referenced_by locations.
    """
    refs = {}
    wrapper_sources = {}
    for op_key, operation in operations.items():
        for section in ("path_params", "query_params", "request_body", "response_schema"):
            for field in operation.get(section) or []:
                ref = _ref_type(field.get("type"))
                if not ref:
                    continue
                refs.setdefault(ref, []).append({
                    "operation": op_key,
                    "section": section,
                    "field": field["name"],
                    "type": field["type"],
                })
        list_ref = _wrapper_list_ref(operation.get("response_schema") or [])
        if list_ref:
            wrapper_sources.setdefault(list_ref, []).append({
                "group": _group_name(op_key),
                "path": operation.get("path"),
            })

    by_group = {}
    for op_key, operation in operations.items():
        by_group.setdefault(_group_name(op_key), []).append((op_key, operation))

    schemas = {}
    for ref in sorted(refs):
        candidates = []
        resolution = None
        for source in sorted(wrapper_sources.get(ref, []), key=lambda x: (x["group"], x.get("path") or "")):
            for op_key, operation in by_group.get(source["group"], []):
                if _same_collection_path(source.get("path"), operation.get("path")):
                    candidates.append((op_key, operation))
            resolution = "list-wrapper-sibling"
        if not candidates:
            tokens = set(_type_tokens(ref))
            if tokens:
                for op_key, operation in operations.items():
                    schema = operation.get("response_schema") or []
                    if not schema or _is_page_wrapper(schema):
                        continue
                    if tokens <= _operation_tokens(op_key, operation):
                        candidates.append((op_key, operation))
                if candidates:
                    resolution = "operation-token-match"

        fields, source_operations = _merge_fields(sorted(candidates))
        schemas[ref] = {
            "status": "resolved" if fields else "unresolved",
            "resolution": resolution or "unresolved",
            "fields": fields,
            "source_operations": source_operations,
            "referenced_by": refs[ref],
        }

    return {
        "schemas": schemas,
        "summary": {
            "referenced_types": len(schemas),
            "resolved": sum(1 for s in schemas.values() if s["status"] == "resolved"),
            "unresolved": sum(1 for s in schemas.values() if s["status"] == "unresolved"),
            "references": sum(len(s["referenced_by"]) for s in schemas.values()),
        },
    }


def main():
    raw_dir = sys.argv[1] if len(sys.argv) > 1 else \
        "vendor/zscaler-help/automate-zscaler/api-reference"
    out_dir = sys.argv[2] if len(sys.argv) > 2 else \
        "vendor/zscaler-api-specs/automate-zscaler"
    # Tolerate a legacy <product>-api-reference.json file arg — use its directory.
    if out_dir.endswith(".json"):
        out_dir = os.path.dirname(out_dir)
    contracts = parse_tree(raw_dir)
    # Split per product (first path segment of the operation key) so each product
    # gets its own <product>-api-reference.json alongside the Postman collection.
    by_product = {}
    for op, c in contracts.items():
        by_product.setdefault(op.split("/")[0], {})[op] = c
    os.makedirs(out_dir, exist_ok=True)
    for product, ops in sorted(by_product.items()):
        out = os.path.join(out_dir, f"{product}-api-reference.json")
        with open(out, "w", encoding="utf-8") as f:
            json.dump(ops, f, indent=2)
            f.write("\n")
        components = {"product": product, **build_components(ops)}
        component_out = os.path.join(out_dir, f"{product}-components.json")
        with open(component_out, "w", encoding="utf-8") as f:
            json.dump(components, f, indent=2)
            f.write("\n")
        n_body = sum(len(c["request_body"]) for c in ops.values())
        n_resp = sum(len(c["response_schema"]) for c in ops.values())
        print(f"{product}: {len(ops)} ops -> {out}  (req {n_body}, resp {n_resp})")
        print(
            f"{product}: {components['summary']['referenced_types']} component refs "
            f"({components['summary']['resolved']} resolved, "
            f"{components['summary']['unresolved']} unresolved) -> {component_out}"
        )


if __name__ == "__main__":
    main()
