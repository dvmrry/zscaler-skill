#!/usr/bin/env python3
"""parse_contract.py — rendered automate.zscaler.com op-page text -> normalized contract.

Deterministic, no network, no LLM. Reads the raw <article> text that capture.cjs
dumped and emits, per operation, {operation, source_url, raw_sha256, method, path,
path_params, query_params, request_body, response_schema} where each field is
{name, type, required, readonly, enum}. The parser is the trust boundary between
the rendered page and every downstream consumer, so it is pinned by
test_parse_contract.py against committed fixtures.

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
token, where types are a closed primitive set plus PascalCase object refs. That
cleanly separates camelCase field names (e.g. praEnabled) from types (string).
"""
import json
import os
import re
import sys

PRIMITIVES = {
    "string", "boolean", "number", "integer", "int32", "int64",
    "object", "float", "double", "long", "date", "date-time",
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
_READONLY_RE = re.compile(r"Only applicable for a GET request|Ignored in PUT/POST/DELETE")


def _is_type(s):
    """A type token: primitive, or PascalCase object ref, with optional [] suffix."""
    if not s:
        return False
    base = s[:-2] if s.endswith("[]") else s
    if base in PRIMITIVES:
        return True
    return bool(re.match(r"^[A-Z][A-Za-z0-9_]*$", base))


def _is_name(s):
    """A field name: single identifier token, not a structural keyword."""
    if not s or s in SECTION_MARKERS or s in LANG_TABS or s == "REQUIRED":
        return False
    return bool(re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", s))


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
            else:
                m = _ENUM_RE.search(ln)
                if m:
                    enum = [x.strip() for x in m.group(1).split(",") if x.strip()]
            i += 1
        fields.append({
            "name": name, "type": typ,
            "required": required, "readonly": readonly, "enum": enum,
        })
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


def main():
    raw_dir = sys.argv[1] if len(sys.argv) > 1 else \
        "vendor/zscaler-help/automate-zscaler/api-reference"
    out = sys.argv[2] if len(sys.argv) > 2 else \
        "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json"
    contracts = parse_tree(raw_dir)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(contracts, f, indent=2)
        f.write("\n")
    n_body = sum(len(c["request_body"]) for c in contracts.values())
    n_resp = sum(len(c["response_schema"]) for c in contracts.values())
    print(f"Parsed {len(contracts)} ops -> {out}")
    print(f"  request-body fields: {n_body}   response-schema fields: {n_resp}")


if __name__ == "__main__":
    main()
