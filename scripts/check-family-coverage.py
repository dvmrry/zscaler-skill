#!/usr/bin/env python3
"""Family-coverage completeness check (DAV-20 L1) — gate-style.

For each configured documentation area, compare the vendor source families that
HAVE a surface (from the deterministic L1 inventory) against the families the
docs actually CITE. A family with a surface but no citation is a coverage gap —
the class that let ZBI ship its docs without the 9-module Ansible surface (#146).

"Cited" means evidence in the product's knowledge-graph subjects (references/<area>/*.json) or in a subject
they link to directly (a `[[...]]` link, `related`, or `derived_from`): every evidence item names a registered
source and a path, which resolve to a vendor path. One hop, because some products' code lives in another
product's subjects (browser isolation's API is Internet & SaaS and Private Access operations). Aliases and
prose mentions do not count.

Exit non-zero if any area has a gap, so it can run as a gate check.

Usage: scripts/check-family-coverage.py [area ...]   (default: all configured)
"""
import glob, json, os, re, sys
import l1_inventory as l1


def _family_of_path(path):
    """Map a vendor path to the source family it represents."""
    if path.startswith("vendor/zscaler-api-specs/automate-zscaler/"):
        return "automate-contract"
    m = re.match(r'vendor/([A-Za-z0-9._-]+)', path)
    if not m:
        return None
    subdir = m.group(1)
    if subdir == "zscaler-sdk-go":
        return "go-sdk"
    if subdir == "zscaler-sdk-python":
        return "python-sdk"
    if subdir.startswith("terraform-") or subdir in ("zscaler-terraformer", "zscaler-terraform-skills"):
        return "terraform"
    if "ansible" in subdir or subdir.endswith("-playbooks"):
        return "ansible"
    if subdir == "zscaler-mcp-server":
        return "mcp"
    if subdir == "zscaler-api-specs":
        return "postman"
    return None  # e.g. zscaler-help — not a code family the inventory tracks


def _source_roots():
    reg = json.load(open(os.path.join(l1.ROOT, "references/_meta/sources.json")))
    return {sid: src["root"] for sid, src in reg["sources"].items()}


def _evidence(node):
    """Every evidence item in a subject: any object carrying a registered `source` and a `path`."""
    if isinstance(node, dict):
        if isinstance(node.get("source"), str) and isinstance(node.get("path"), str):
            yield node
        for v in node.values():
            yield from _evidence(v)
    elif isinstance(node, list):
        for v in node:
            yield from _evidence(v)


_LINK = re.compile(r"\[\[([a-z0-9][a-z0-9.-]*)(?::[a-z0-9-]+)?\]\]")


def _linked_subjects(data):
    """Subject IDs a subject points at: prose links, related entries and qualified derived_from refs."""
    text = json.dumps(data)
    out = set(_LINK.findall(text))
    out |= {r["to"].split(":")[0] for r in data.get("related", []) if isinstance(r.get("to"), str)}
    for kind in ("claims", "divergences", "gaps", "cases"):
        for item in (data.get(kind) or {}).values():
            out |= {ref.split(":")[0] for ref in item.get("derived_from", []) if ":" in ref}
    return out


def _subject_file(sid):
    return os.path.join(l1.ROOT, "references", sid.split(".")[0], f"{sid}.json")


def documented_families(area):
    roots = _source_roots()
    own = {f: json.load(open(f)) for f in glob.glob(os.path.join(l1.ROOT, "references", area, "*.json"))}
    linked = set().union(*(_linked_subjects(d) for d in own.values())) if own else set()
    docs = list(own.values()) + [json.load(open(_subject_file(sid))) for sid in sorted(linked) if os.path.exists(_subject_file(sid))]
    fams = set()
    for data in docs:
        for ev in _evidence(data):
            root = roots.get(ev["source"])
            fam = root and _family_of_path(f"{root}/{ev['path']}")
            if fam:
                fams.add(fam)
    return fams


def main(argv):
    areas = argv[1:] or list(l1.PRODUCTS)
    gaps_found = False
    print("family-coverage check (surface families that the docs do not cite)\n")
    for product in areas:
        cfg = l1.PRODUCTS[product]
        area = cfg.get("doc_area", product)
        surface = l1.surface_families(l1.get_inventory(product))
        documented = documented_families(area)
        gaps = surface - documented
        if gaps:
            gaps_found = True
            print(f"  GAP  {product}: surface has {sorted(gaps)} but references/{area}/ cites none of it")
            print(f"       (surface={sorted(surface)}  documented={sorted(documented)})")
        else:
            print(f"  ok   {product}: {sorted(surface)} all cited")
    print()
    if gaps_found:
        print("Coverage gaps found. Document the missing family or note an explicit audit-scoped absence.")
        return 1
    print("No coverage gaps.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
