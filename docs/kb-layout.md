# Knowledge-graph layout

`references/` is the knowledge graph: the same for every installation, built only from public sources.
Company knowledge lives in the overlay ([`data-contract/knowledge.md`](data-contract/knowledge.md)), never here.
Read it through `node scripts/kb.mjs resolve`; the model is
[`superpowers/specs/2026-10-17-kb-graph-model-design.md`](superpowers/specs/2026-10-17-kb-graph-model-design.md).

| Path | Holds | Written by |
|---|---|---|
| `references/<product>/<subject-id>.json` | one subject: prose, claims, gaps, divergences, cases, checks | people (and conversion tools) |
| `references/<product>/types/*.json` | log types and their fields | `scripts/gen-log-types.mjs` |
| `references/_meta/schema/` | JSON Schemas for subjects, types, registries, the overlay and the resolve bundle | people |
| `references/_meta/products.json` | product IDs, names and aliases | people |
| `references/_meta/sources.json` | every citable source: submodules, help captures, static files, with rank | people |
| `references/_meta/capture-manifest.json` | the hash of each cited capture | `kb.mjs manifest` |
| `vendor/github-issues/` | captured vendor GitHub issues and pull requests, cited like help pages | `scripts/issue_capture.py` |
| `references/_meta/static-captures.json` | captures that are not help articles (PDFs, notes) | people |
| `references/_meta/verified.json` | per-source citation counts at the current pins | `kb.mjs verified` |
| `references/_meta/types/` | tenant object types bound to zscalerctl and IaC | `kb.mjs import-types` |
| `references/_meta/imports/zscalerctl.json` | the pinned zscalerctl catalogue | `kb.mjs export-zscalerctl` |
| `references/_meta/surfaces/` | API, SDK and Terraform surface per product | `scripts/gen-surfaces.mjs` |
| `references/_meta/evals/` | answer evals and workflow eval shapes ([how they run](evals.md)) | people |
| `references/_meta/citation-inventory.json` | citation density of the remaining Markdown | `scripts/check-citation-density.py` |

`references/` holds no Markdown outside `_meta/archive/`. Generic background (networking, proxies and
tunnels, zero trust, identity protocols) is the [primer](primer/index.md): teaching material, not cited
knowledge.
