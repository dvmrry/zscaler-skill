#!/usr/bin/env python3
"""reconcile_contract.py — diff the captured automate.zscaler.com contract against
the Go SDK struct and the Terraform provider schema, and report real divergences.

This is the DAV-21 payoff: the rendered contract is the vendor's actual per-operation
schema (required/readonly/enum). Diffing it against the client-side sources surfaces
where they disagree — led by the numeric-as-string contract gap (the contract types
ZPA IDs as int64 while the Go SDK and TF treat them as strings).

Inputs:
  - normalized contract  : vendor/zscaler-api-specs/automate-zscaler/<product>-api-reference.json
  - Go SDK struct        : vendor/zscaler-sdk-go/... (json tags + Go type)
  - Terraform schema     : vendor/terraform-provider-zpa/... (Required/Optional/Computed + enum)

High-signal axes (conservative — exact names; TF snake_case→camelCase is the only
alias, derived from the TF key itself; anything unmatched is reported, never guessed):
  - presence        : field in one source but not the other
  - type drift      : contract numeric vs Go string (and vice versa)
  - required drift  : contract (request-body required) vs TF Required
  - readonly        : the contract's readonly fields vs TF Computed (narrowed — TF's
                      Optional+Computed server-defaults are NOT treated as readonly)
  - enum            : match / value-conflict (both list values, they differ) /
                      one-sided (only one side constrains)

Extractors take source TEXT (pure, unit-tested in test_reconcile_contract.py); thin
file wrappers read from disk. Run from the repo root:
  python3 scripts/automate-capture/reconcile_contract.py
"""
import json
import os
import re

ROOT = os.environ.get("REPO_ROOT", ".")

# ---- Go SDK struct extraction ---------------------------------------------

_GO_NUM = {"int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16",
           "uint32", "uint64", "float32", "float64"}


def go_category(t):
    t = t.lstrip("*")
    if t.startswith("[]"):
        return "array"
    if t in _GO_NUM:
        return "number"
    if t == "bool":
        return "boolean"
    if t == "string":
        return "string"
    return "object"


def extract_go_struct_fields(src, struct_name):
    """Top-level fields of a Go struct -> {json_name: {go_type, category}}.
    Brace-aware so nested anonymous structs don't leak. Pure (takes source text)."""
    m = re.search(r"type\s+" + re.escape(struct_name) + r"\s+struct\s*\{", src)
    if not m:
        return {}
    i = m.end()
    depth = 1
    start = i
    while i < len(src) and depth:
        if src[i] == "{":
            depth += 1
        elif src[i] == "}":
            depth -= 1
        i += 1
    body = src[start:i - 1]
    fields = {}
    # Only depth-1 lines: Name  Type  `json:"name,..."`. Skip lines inside nested
    # struct{...} blocks by tracking braces on the field-type position.
    bdepth = 0
    fre = re.compile(r"^\s*([A-Z]\w*)\s+([\[\]\*\w.]+)\s+`[^`]*json:\"([^\",]+)")
    for line in body.split("\n"):
        if bdepth == 0:
            fm = fre.match(line)
            if fm:
                _, go_type, json_name = fm.groups()
                if json_name != "-":
                    fields[json_name] = {"go_type": go_type, "category": go_category(go_type)}
        bdepth += line.count("{") - line.count("}")
    return fields


# ---- Terraform schema extraction ------------------------------------------

def snake_to_camel(s):
    parts = s.split("_")
    return parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])


def _scan_blocks_depth1(src, open_marker):
    """Yield (key, block_text) for "key": { ... } at depth 1 inside open_marker.
    Brace-aware; skips strings and // comments."""
    mi = src.find(open_marker)
    if mi == -1:
        return
    i = mi + len(open_marker)
    depth = 1
    n = len(src)
    cur_key = None
    block_start = None
    while i < n and depth:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j == -1 else j
            continue
        if c == '"':
            i += 1
            while i < n and src[i] != '"':
                if src[i] == "\\":
                    i += 1
                i += 1
            i += 1
            continue
        if c == "`":
            i += 1
            while i < n and src[i] != "`":
                i += 1
            i += 1
            continue
        if c == "{":
            if depth == 1:
                pre = src[max(0, i - 80):i]
                km = re.search(r'"([a-z0-9_]+)"\s*:\s*$', pre)
                if km:
                    cur_key = km.group(1)
                    block_start = i + 1
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 1 and cur_key is not None:
                yield cur_key, src[block_start:i]
                cur_key = None
        i += 1


def extract_tf_schema_fields(src):
    """Top-level TF schema keys -> {camel_key: {tf_key, required, optional, computed, enum}}.
    Pure (takes source text)."""
    out = {}
    for key, block in _scan_blocks_depth1(src, "Schema: map[string]*schema.Schema{"):
        enum = None
        em = re.search(r"StringInSlice\(\s*\[\]string\{([^}]*)\}", block)
        if em:
            enum = re.findall(r'"([^"]+)"', em.group(1))
        out[snake_to_camel(key)] = {
            "tf_key": key,
            "required": bool(re.search(r"\bRequired:\s*true", block)),
            "optional": bool(re.search(r"\bOptional:\s*true", block)),
            "computed": bool(re.search(r"\bComputed:\s*true", block)),
            "enum": enum,
        }
    return out


# ---- contract type category ------------------------------------------------

def contract_category(t):
    if t is None:
        return None
    arr = t.endswith("[]")
    base = t[:-2] if arr else t
    if base in ("int32", "int64", "integer", "number", "float", "double", "long"):
        return "array" if arr else "number"
    if base == "boolean":
        return "boolean"
    if base == "string":
        return "array" if arr else "string"
    return "object"


# ---- registry --------------------------------------------------------------

RESOURCES = [
    {"name": "app_connector_group", "group": "app-connector-group-management",
     "create": "adds-a-new-app-connector-group-for-the-specified-customer",
     "get": "gets-the-app-connector-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorgroup/zpa_app_connector_group.go", "AppConnectorGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_app_connector_group.go"},
    {"name": "application_segment", "group": "application-segment-management",
     "create": "adds-a-new-application-segment-for-the-specified-customer",
     "get": "gets-the-application-segment-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go", "ApplicationSegmentResource"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment.go"},
    {"name": "server_group", "group": "server-group-management",
     "create": "add-a-new-server-group",
     "get": "gets-the-server-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/servergroup/zpa_server_group.go", "ServerGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_server_group.go"},
    {"name": "segment_group", "group": "segment-group-management",
     "create": "adds-a-new-segment-group-for-the-specified-customer",
     "get": "gets-the-segment-group-details-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/segmentgroup/zpa_segment_group.go", "SegmentGroup"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_segment_group.go"},
    {"name": "provisioning_key", "group": "provisioning-key-management",
     "create": "adds-a-new-provisioning-key-for-the-specified-customer",
     "get": "gets-details-of-the-provisioning-key-for-the-specified-id",
     "go": ("vendor/zscaler-sdk-go/zscaler/zpa/services/provisioningkey/zpa_provisioning_key.go", "ProvisioningKey"),
     "tf": "vendor/terraform-provider-zpa/zpa/resource_zpa_provisioning_key.go"},
]

CONTRACT_JSON = "vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json"


def _read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def reconcile_one(res, contracts):
    create = contracts.get(f"zpa/{res['group']}/{res['create']}", {})
    get = contracts.get(f"zpa/{res['group']}/{res['get']}", {})
    # field universe = response schema (fullest); required comes from create body
    cfields = {f["name"]: f for f in (get.get("response_schema") or create.get("response_schema") or [])}
    creq = {f["name"]: f for f in create.get("request_body", [])}
    for name, f in creq.items():
        cfields.setdefault(name, dict(f))
    required_names = {n for n, f in creq.items() if f["required"]}

    go_path, struct = res["go"]
    go = extract_go_struct_fields(_read(go_path), struct)
    tf = extract_tf_schema_fields(_read(res["tf"]))

    cset, goset, tfset = set(cfields), set(go), set(tf)
    rep = {
        "resource": res["name"],
        "method": create.get("method") or get.get("method"),
        "path": create.get("path") or get.get("path"),
        "counts": {"contract": len(cset), "go": len(goset), "tf": len(tfset)},
        "presence": {
            "contract_only_vs_go": sorted(cset - goset),
            "go_only_vs_contract": sorted(goset - cset),
            "contract_only_vs_tf": sorted(cset - tfset),
        },
        "type_drift": [],
        "required_drift": [],
        "readonly": [],
        "enum": {"match": [], "value_conflict": [], "one_sided": []},
    }

    for name in sorted(cset & goset):
        cc = contract_category(cfields[name].get("type"))
        gc = go[name]["category"]
        if cc and cc != gc and {cc, gc} <= {"number", "string", "boolean"}:
            rep["type_drift"].append({"field": name, "contract": cfields[name]["type"], "go": go[name]["go_type"]})

    for name in sorted(cset & tfset):
        creq_flag = name in required_names
        tfreq = tf[name]["required"]
        if creq_flag != tfreq:
            rep["required_drift"].append({
                "field": name, "contract_required": creq_flag, "tf_required": tfreq,
                "direction": "tf_stricter" if tfreq and not creq_flag else "contract_stricter",
            })

    # readonly NARROWED: only fields the contract marks readonly; report TF treatment
    for name in sorted(cset & tfset):
        if cfields[name].get("readonly"):
            rep["readonly"].append({"field": name, "tf_computed": tf[name]["computed"],
                                    "agree": tf[name]["computed"]})

    for name in sorted(cset & tfset):
        ce, te = cfields[name].get("enum"), tf[name]["enum"]
        if not ce and not te:
            continue
        if ce and te:
            (rep["enum"]["match"] if set(ce) == set(te) else rep["enum"]["value_conflict"]).append(
                name if set(ce) == set(te) else {"field": name, "contract": ce, "tf": te})
        else:
            rep["enum"]["one_sided"].append({"field": name, "contract": ce, "tf": te})
    return rep


def build_report(contracts):
    reports = [reconcile_one(r, contracts) for r in RESOURCES]
    totals = {
        "type_drift": sum(len(r["type_drift"]) for r in reports),
        "required_drift": sum(len(r["required_drift"]) for r in reports),
        "enum_match": sum(len(r["enum"]["match"]) for r in reports),
        "enum_value_conflict": sum(len(r["enum"]["value_conflict"]) for r in reports),
        "enum_one_sided": sum(len(r["enum"]["one_sided"]) for r in reports),
        "readonly_fields": sum(len(r["readonly"]) for r in reports),
        "readonly_disagree": sum(1 for r in reports for x in r["readonly"] if not x["agree"]),
    }
    return {"product": "zpa", "resources": reports, "totals": totals}


# ---- markdown rendering ----------------------------------------------------

def render_markdown(report):
    t = report["totals"]
    out = []
    out.append("---")
    out.append('title: "DAV-21 automate.zscaler.com contract reconciliation — ZPA"')
    out.append("status: generated")
    out.append('generator: "scripts/automate-capture/reconcile_contract.py"')
    out.append("---\n")
    out.append("# automate.zscaler.com contract vs Go SDK / Terraform — ZPA\n")
    out.append("> Generated by `scripts/automate-capture/reconcile_contract.py`. Do not edit by hand; "
               "re-run after re-capturing the contract or bumping the vendor submodules.\n")
    out.append("Diffs the rendered per-operation contract "
               "(`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json`) against the Go SDK "
               "struct and the Terraform provider schema for each resource.\n")
    out.append("## Totals\n")
    out.append(f"- Type drift (contract numeric vs Go string): **{t['type_drift']}**")
    out.append(f"- Required drift (contract vs TF): **{t['required_drift']}**")
    out.append(f"- Enum: **{t['enum_match']}** match / **{t['enum_value_conflict']}** value-conflict / "
               f"**{t['enum_one_sided']}** one-sided")
    out.append(f"- Contract readonly fields checked: **{t['readonly_fields']}** "
               f"(TF disagreement: {t['readonly_disagree']})\n")
    for r in report["resources"]:
        out.append(f"## {r['resource']}\n")
        out.append(f"`{r['method']} {r['path']}` — "
                   f"contract {r['counts']['contract']} / Go {r['counts']['go']} / TF {r['counts']['tf']} fields\n")
        if r["type_drift"]:
            out.append("**Type drift** — contract says numeric, Go SDK declares string "
                       "(the API serializes these as JSON strings):\n")
            for d in r["type_drift"]:
                out.append(f"- `{d['field']}`: contract `{d['contract']}` vs Go `{d['go']}`")
            out.append("")
        if r["required_drift"]:
            out.append("**Required drift:**\n")
            for d in r["required_drift"]:
                note = "TF stricter than API" if d["direction"] == "tf_stricter" else "contract stricter than TF"
                out.append(f"- `{d['field']}`: contract required={d['contract_required']}, "
                           f"TF required={d['tf_required']} ({note})")
            out.append("")
        if r["enum"]["value_conflict"]:
            out.append("**Enum value conflicts:**\n")
            for d in r["enum"]["value_conflict"]:
                out.append(f"- `{d['field']}`: contract {d['contract']} vs TF {d['tf']}")
            out.append("")
        if r["presence"]["contract_only_vs_go"]:
            out.append(f"**Contract fields absent from the Go SDK struct:** "
                       f"{', '.join('`%s`' % x for x in r['presence']['contract_only_vs_go'])}\n")
        if r["presence"]["go_only_vs_contract"]:
            out.append(f"**Go SDK fields absent from the contract:** "
                       f"{', '.join('`%s`' % x for x in r['presence']['go_only_vs_contract'])}\n")
    out.append("## Scope\n")
    out.append("Reconciles the contract against the Go SDK and Terraform provider (the sources that carry "
               "type, required, readonly, and enum signal). Python SDK and Postman cross-checks are a "
               "documented next step. Field matching is conservative: exact names, with TF snake_case→camelCase "
               "derived from the TF key; unmatched fields are reported as presence differences, never guessed.\n")
    return "\n".join(out)


def main():
    contracts = json.load(open(os.path.join(ROOT, CONTRACT_JSON), encoding="utf-8"))
    report = build_report(contracts)
    out_dir = os.path.join(ROOT, "vendor/zscaler-api-specs/automate-zscaler")
    json_out = os.path.join(out_dir, "zpa-divergences.json")
    md_out = os.path.join(out_dir, "zpa-divergences.md")
    with open(json_out, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        f.write("\n")
    with open(md_out, "w", encoding="utf-8") as f:
        f.write(render_markdown(report) + "\n")
    t = report["totals"]
    print(f"reconciled {len(report['resources'])} resources")
    print(f"  type_drift={t['type_drift']} required_drift={t['required_drift']} "
          f"enum(match/conflict/one-sided)={t['enum_match']}/{t['enum_value_conflict']}/{t['enum_one_sided']} "
          f"readonly={t['readonly_fields']}(disagree {t['readonly_disagree']})")
    print(f"  -> {json_out}")
    print(f"  -> {md_out}")


if __name__ == "__main__":
    main()
