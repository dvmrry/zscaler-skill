#!/usr/bin/env python3
"""Family-coverage completeness check (DAV-20 L1) — gate-style.

For each configured documentation area, compare the vendor source families that
HAVE a surface (from the deterministic L1 inventory) against the families the
docs actually CITE. A family with a surface but no citation is a coverage gap —
the class that let ZBI ship its docs without the 9-module Ansible surface (#146).

"Cited" means a real citation: a path under the frontmatter `sources:` list
(quoted or unquoted YAML), or a backticked `vendor/...` path in the body. Bare
prose mentions and `verified-against:` pins do not count.

Exit non-zero if any area has a gap, so it can run as a gate check.

Usage: scripts/check-family-coverage.py [area ...]   (default: all configured)
"""
import os, glob, re, sys
import l1_inventory as l1


def _family_of(subdir):
    """Map a vendor/<subdir> repo name to the source family it represents."""
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


def _split_frontmatter(text):
    m = re.match(r'^---\n(.*?)\n---', text, re.S)
    return (m.group(1), text[m.end():]) if m else ("", text)


def _frontmatter_source_subdirs(fm):
    """vendor/<subdir> repos listed under the frontmatter `sources:` block (quoted or unquoted)."""
    out, in_sources = [], False
    for line in fm.splitlines():
        if re.match(r'^sources:\s*$', line):
            in_sources = True
            continue
        if in_sources:
            if re.match(r'^\s+-\s', line):              # a YAML list item under sources:
                m = re.search(r'vendor/([A-Za-z0-9._-]+)', line)
                if m:
                    out.append(m.group(1))
            elif re.match(r'^\S', line):                # next top-level key ends the block
                in_sources = False
    return out


# In the body, only a backticked path counts as a citation (not quoted prose).
_BACKTICK_CITE = re.compile(r'`vendor/([A-Za-z0-9._-]+)')


def documented_families(area):
    fams = set()
    for f in glob.glob(os.path.join(l1.ROOT, "references", area, "*.md")):
        fm, body = _split_frontmatter(l1._read(f))
        for subdir in _frontmatter_source_subdirs(fm) + _BACKTICK_CITE.findall(body):
            fam = _family_of(subdir)
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
