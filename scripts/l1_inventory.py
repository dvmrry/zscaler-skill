#!/usr/bin/env python3
"""L1 cross-family inventory (DAV-20) — deterministic, anchored attribution.

For a documentation area, inventory each vendor source family's surface using
collision-free anchors (no fuzzy term matching):

  go-sdk / python-sdk : per-product SDK package directory          (dir-anchor)
  terraform           : provider file whose SDK *import* matches the product
                        anchor AND that defines a resource/data source
  postman             : request URL contains a configured Postman endpoint stem
  automate-contract   : rendered Automate contract JSON operations (endpoint-path)
  mcp / ansible       : the collection / tools dir of the SDK parent (parent-scoped)

A product whose SDK lives in its own top-level package and has no parent IaC
collection (e.g. ZWA) correctly resolves to an SDK-only surface.

This is a derived index. Markdown stays canonical; regenerate in the gate.
No third-party deps (stdlib ast + regex + json); tree-sitter not required.
"""
import ast, json, re, os, glob, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, "vendor")
ANSIBLE_COLL = {"zia": "ziacloud-ansible", "zpa": "zpacloud-ansible"}
FAMILIES = ["go-sdk", "python-sdk", "terraform", "mcp", "ansible", "automate-contract", "postman"]
MCP_PACKAGE_ROOTS = ("src/zscaler_mcp", "zscaler_mcp")

# Per-area config. `parents` = the SDK parent products that own the IaC
# collections / mcp tool dirs. `go_anchor` = SDK import-path substrings
# identifying the product's Go packages (the TF wrapper-edge anchor too).
# `resource_stems` scope the parent-organized families (mcp/ansible) and seed
# the Go endpoint-keyword filter. `endpoint_stems` anchor contract paths; use
# `postman_endpoint_stems` when the collection's base-variable path shape differs.
PRODUCTS = {
    "zia": dict(parents=["zia"],
                go_anchor=["zia/services"],
                py_globs=["zscaler-sdk-python/zscaler/zia/*.py"],
                endpoint_stems=["/zia/api/"],
                resource_stems=["zia"],
                mcp_all_parent=True,
                doc_area="zia"),
    "zpa": dict(parents=["zpa"],
                go_anchor=["zpa/services"],
                py_globs=["zscaler-sdk-python/zscaler/zpa/*.py"],
                endpoint_stems=["/zpa/"],
                postman_endpoint_stems=["/mgmtconfig/", "/cbiconfig/", "/userconfig/"],
                resource_stems=["zpa"],
                mcp_all_parent=True,
                doc_area="zpa"),
    "zbi": dict(parents=["zia", "zpa"],
                go_anchor=["cloudbrowserisolation", "zia/services/browser_isolation"],
                py_globs=["zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py",
                          "zscaler-sdk-python/zscaler/zpa/cbi_*.py"],
                endpoint_stems=["/cbiconfig/", "/browserIsolation/", "/isolation/profiles"],
                resource_stems=["cloud_browser_isolation", "cbi", "isolation", "browser_isolation"]),
    "zwa": dict(parents=["zwa"],
                go_anchor=["zwa/services", "/zwa/"],
                py_globs=["zscaler-sdk-python/zscaler/zwa/*.py"],
                endpoint_stems=["/dlp/v1/incidents", "/dlp/v1/customer/audit"],
                resource_stems=["dlp_incident", "customer_audit", "workflow_automation"]),
}


def _rel(p):
    return p.replace(V + "/", "")


def _read(p):
    return open(p, encoding="utf-8", errors="replace").read()


def _ep_terms(cfg):
    """Endpoint-keyword filter for Go endpoint constants, derived from config."""
    terms = set(cfg["resource_stems"])
    for stem in cfg["resource_stems"]:
        terms.update(t for t in stem.split("_") if len(t) > 2)
    return terms


# Parse real Go import declarations -> [(local_name, path)] for zscaler-sdk-go
# imports only. Handles aliased imports and grouped `import ( ... )` blocks, and
# (unlike a whole-file substring scan) ignores SDK paths that appear in comments
# or string literals.
def _go_sdk_imports(src):
    out = []

    def add(alias, path):
        if "zscaler-sdk-go" in path:
            out.append((alias or path.rsplit("/", 1)[-1], path))

    def is_ident(c):
        return c.isalnum() or c == "_"

    def skip_line_comment(i):
        j = src.find("\n", i)
        return len(src) if j == -1 else j + 1

    def skip_block_comment(i):
        j = src.find("*/", i + 2)
        return len(src) if j == -1 else j + 2

    def skip_quoted(i, quote):
        i += 1
        while i < len(src):
            if src[i] == "\\" and quote != "`":
                i += 2
                continue
            if src[i] == quote:
                return i + 1
            i += 1
        return len(src)

    def strip_comments_keep_strings(text):
        chars, i = [], 0
        while i < len(text):
            if text.startswith("//", i):
                j = text.find("\n", i)
                if j == -1:
                    break
                chars.append("\n")
                i = j + 1
            elif text.startswith("/*", i):
                j = text.find("*/", i + 2)
                comment = text[i:] if j == -1 else text[i:j + 2]
                chars.extend("\n" for c in comment if c == "\n")
                i = len(text) if j == -1 else j + 2
            elif text[i] in ('"', "'", "`"):
                quote, start = text[i], i
                i += 1
                while i < len(text):
                    if text[i] == "\\" and quote != "`":
                        i += 2
                        continue
                    if text[i] == quote:
                        i += 1
                        break
                    i += 1
                chars.append(text[start:i])
            else:
                chars.append(text[i])
                i += 1
        return "".join(chars)

    def parse_spec(line):
        m = re.match(r'\s*(?:([A-Za-z_]\w*|\.)\s+)?(?:"([^"]+)"|`([^`]+)`)', line)
        if m:
            add(m.group(1), m.group(2) or m.group(3))

    def block_end(i):
        while i < len(src):
            if src.startswith("//", i):
                i = skip_line_comment(i)
            elif src.startswith("/*", i):
                i = skip_block_comment(i)
            elif src[i] in ('"', "'", "`"):
                i = skip_quoted(i, src[i])
            elif src[i] == ")":
                return i
            else:
                i += 1
        return len(src)

    i = 0
    while i < len(src):
        if src.startswith("//", i):
            i = skip_line_comment(i)
            continue
        if src.startswith("/*", i):
            i = skip_block_comment(i)
            continue
        if src[i] in ('"', "'", "`"):
            i = skip_quoted(i, src[i])
            continue
        if src.startswith("import", i):
            before = src[i - 1] if i else ""
            after = src[i + len("import")] if i + len("import") < len(src) else ""
            if (not before or not is_ident(before)) and (not after or not is_ident(after)):
                j = i + len("import")
                while j < len(src) and src[j].isspace():
                    j += 1
                if j < len(src) and src[j] == "(":
                    end = block_end(j + 1)
                    block = strip_comments_keep_strings(src[j + 1:end])
                    for line in block.splitlines():
                        parse_spec(line)
                    i = end + 1
                    continue
                line_end = src.find("\n", j)
                line_end = len(src) if line_end == -1 else line_end
                parse_spec(strip_comments_keep_strings(src[j:line_end]))
                i = line_end
                continue
        i += 1
    return out


def _py_symbols(path):
    items = []
    try:
        tree = ast.parse(_read(path))
    except Exception as e:  # never crash the inventory on one bad file
        return [{"kind": "parse-error", "name": str(e)[:80]}]

    def fn(node, cls=None):
        return {"kind": "method" if cls else "func",
                "name": (cls + "." if cls else "") + node.name,
                "args": [a.arg for a in node.args.args if a.arg not in ("self", "cls")],
                "line": node.lineno}

    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            items.append(fn(node))
        elif isinstance(node, ast.ClassDef):
            items.append({"kind": "class", "name": node.name, "line": node.lineno})
            for sub in node.body:
                if isinstance(sub, (ast.FunctionDef, ast.AsyncFunctionDef)) and not sub.name.startswith("_"):
                    items.append(fn(sub, node.name))
    return items


_GO_FUNC = re.compile(r'^func\s+(\([^)]*\)\s*)?([A-Z]\w*)\s*\(')
_GO_EP = re.compile(r'=\s*"(/[^"]+)"')


def _go_symbols(path, ep_terms):
    items = []
    for i, line in enumerate(_read(path).splitlines(), 1):
        m = _GO_FUNC.match(line)
        if m:
            items.append({"kind": "func", "name": m.group(2), "line": i})
        e = _GO_EP.search(line)
        if e and any(k in e.group(1).lower() for k in ep_terms):
            items.append({"kind": "endpoint", "name": e.group(1), "line": i})
    return items


# A Terraform file is a "surface" file only if it imports the product's SDK
# package (see _go_sdk_imports) AND defines a real resource/data source.
# Real SDKv2 builders are `func resourceX() *schema.Resource` (no args, Resource
# return) — this excludes schema helpers like `resourceFooSchema(desc) *schema.Schema`.
# Plugin-framework resources are caught by their interface assertion.
_TF_RESOURCE_SIGNAL = re.compile(
    r'func\s+(?:resource|dataSource)\w+\s*\(\s*\)\s*\*schema\.Resource'   # SDKv2 builder
    r'|_\s+(?:resource\.Resource|datasource\.DataSource)\s*='            # plugin-framework assertion
)


def _tf_symbols(path):
    src = _read(path)
    items = [{"kind": m.group(1), "name": m.group(1) + m.group(2)}
             for m in re.finditer(r'^func\s+(resource|dataSource)(\w+)\s*\(\s*\)\s*\*schema\.Resource', src, re.M)]
    for label, pat in (("req", r'Required:\s*true'), ("opt", r'Optional:\s*true'),
                       ("computed", r'Computed:\s*true')):
        n = len(re.findall(pat, src))
        if n:
            items.append({"kind": "schema", "name": f"{label}={n}"})
    # wrapper edge: SDK funcs called via the import's LOCAL name (alias-aware)
    for local, p in _go_sdk_imports(src):
        pkg = p.rsplit("/", 1)[-1]
        for fn in sorted(set(re.findall(r'\b' + re.escape(local) + r'\.([A-Z]\w*)\(', src))):
            items.append({"kind": "wraps", "name": f"{pkg}.{fn}"})
    return items


# ---- anchored file selection ----
def _go_files(cfg):
    return sorted(f for f in glob.glob(V + "/zscaler-sdk-go/**/*.go", recursive=True)
                  if not f.endswith("_test.go") and any(a in f for a in cfg["go_anchor"]))


def _py_files(cfg):
    out = []
    for g in cfg["py_globs"]:
        out += glob.glob(os.path.join(V, g))
    return sorted(set(out))


def _tf_files(cfg):
    # Recursive: providers vary in layout — zia/zpa are flat (zia/*.go) while
    # newer plugin-framework providers (zcc, ztc) nest under internal/framework/.
    out = []
    for f in glob.glob(V + "/terraform-provider-*/**/*.go", recursive=True):
        if f.endswith("_test.go"):
            continue
        if "/vendor/" in f[len(V):]:   # skip a provider's OWN vendored deps (e.g. a vendored SDK copy)
            continue
        src = _read(f)
        sdk_paths = [p for _, p in _go_sdk_imports(src)]
        if not any(a in p for p in sdk_paths for a in cfg["go_anchor"]):
            continue  # anchor must appear in an actual SDK import, not any substring
        if not _TF_RESOURCE_SIGNAL.search(src):
            continue  # must define a resource/data source, not be a helper/CLI/util file
        out.append(f)
    return sorted(set(out))


def _mcp_files(cfg):
    out = []
    package_root = next(
        (
            candidate
            for candidate in MCP_PACKAGE_ROOTS
            if os.path.isdir(os.path.join(V, "zscaler-mcp-server", candidate))
        ),
        MCP_PACKAGE_ROOTS[0],
    )
    for parent in cfg["parents"]:
        for f in glob.glob(V + f"/zscaler-mcp-server/{package_root}/tools/{parent}/*.py"):
            if cfg.get("mcp_all_parent") or any(s in os.path.basename(f) for s in cfg["resource_stems"]):
                out.append(f)
    return sorted(set(out))


def _ansible_files(cfg):
    out = []
    for parent in cfg["parents"]:
        coll = ANSIBLE_COLL.get(parent)
        if not coll:
            continue
        for f in glob.glob(V + f"/{coll}/plugins/modules/*.py"):
            if any(s in os.path.basename(f) for s in cfg["resource_stems"]):
                out.append(f)
    return sorted(set(out))


def _ansible_symbols(path):
    src, items = _read(path), []
    for pat, kind in ((r'^module:\s*(\S+)', "module"), (r'^short_description:\s*(.+)', "desc")):
        m = re.search(pat, src, re.M)
        if m:
            items.append({"kind": kind, "name": m.group(1).strip()[:60]})
    st = sorted(set(re.findall(r'state\s*==\s*"(present|absent)"', src)))
    if st:
        items.append({"kind": "crud", "name": "state:" + "/".join(st)})
    return items


def _postman_requests(cfg):
    out, stems = [], cfg.get("postman_endpoint_stems", cfg["endpoint_stems"])
    path = V + "/zscaler-api-specs/oneapi-postman-collection.json"
    if not os.path.exists(path):
        return out
    data = json.load(open(path, encoding="utf-8"))

    def walk(node):
        if isinstance(node, dict):
            req = node.get("request")
            if isinstance(req, dict):
                url = req.get("url", {})
                raw = url.get("raw", "") if isinstance(url, dict) else str(url)
                if any(s in raw for s in stems):
                    out.append({"kind": "request",
                                "name": f'{req.get("method", "?")} {node.get("name", "")[:50]}'})
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(data)
    return out


def _contract_ops(cfg):
    products = cfg.get("contract_products", cfg.get("parents", []))
    if isinstance(products, str):
        products = [products]
    stems = cfg.get("contract_endpoint_stems", cfg["endpoint_stems"])
    out = {}
    for product in products:
        path = os.path.join(V, "zscaler-api-specs", "automate-zscaler", f"{product}-api-reference.json")
        if not os.path.exists(path):
            continue
        data = json.load(open(path, encoding="utf-8"))
        items = []
        for op, contract in sorted(data.items()):
            api_path = contract.get("path") or ""
            if stems and not any(stem in api_path for stem in stems):
                continue
            method = contract.get("method") or "?"
            body = len(contract.get("request_body") or [])
            resp = len(contract.get("response_schema") or [])
            items.append({"kind": "operation",
                          "name": f"{method} {api_path} req={body} resp={resp}",
                          "operation": op})
        if items:
            out[_rel(path)] = items
    return out


def get_inventory(product):
    """Return {family: {relative_path: [items]}} for a configured product."""
    cfg = PRODUCTS[product]
    ep_terms = _ep_terms(cfg)
    inv = {}
    inv["go-sdk"] = {_rel(f): _go_symbols(f, ep_terms) for f in _go_files(cfg)}
    inv["python-sdk"] = {_rel(f): _py_symbols(f) for f in _py_files(cfg)}
    inv["terraform"] = {_rel(f): _tf_symbols(f) for f in _tf_files(cfg)}
    inv["mcp"] = {_rel(f): _py_symbols(f) for f in _mcp_files(cfg)}
    inv["ansible"] = {_rel(f): _ansible_symbols(f) for f in _ansible_files(cfg)}
    inv["automate-contract"] = _contract_ops(cfg)
    inv["postman"] = {"oneapi-postman-collection.json": _postman_requests(cfg)}
    return inv


def surface_families(inv):
    """Families that actually have a surface (>=1 item)."""
    return {fam for fam, files in inv.items() if any(items for items in files.values())}


if __name__ == "__main__":
    product = sys.argv[1] if len(sys.argv) > 1 else "zbi"
    inv = get_inventory(product)
    print(f"L1 inventory — {product}  (surface: {sorted(surface_families(inv))})")
    for fam in FAMILIES:
        files = inv.get(fam, {})
        n = sum(len(v) for v in files.values())
        print(f"\n### {fam}  ({len(files)} files, {n} items)" + ("" if n else "  — none"))
        for path, items in files.items():
            names = [it.get("name") for it in items if it.get("kind") != "class"]
            print(f"  {path.split('/')[-1]}: " + ", ".join(names[:12]) + (" …" if len(names) > 12 else ""))
