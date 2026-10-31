# Knowledge-graph layout

`references/` is the knowledge graph: the same for every installation, built only from public sources.
Company knowledge lives in the overlay ([`data-contract/knowledge.md`](data-contract/knowledge.md)), never here.
Agents open the spine with their file tools, then read the areas, subjects, log types and fields they picked with one
`node scripts/kb.mjs read <area | subject | type | field> ...` (`SKILL.md` "Retrieval"); `kb.mjs resolve` is the JSON
bundle interface for scripts. The record contracts are the schemas under `references/_meta/schema/`.

| Path | Holds | Written by |
|---|---|---|
| `references/<product>/<subject-id>.json` | one subject: prose, claims, gaps, divergences, cases, checks | people (and conversion tools) |
| `references/<product>/types/*.json` | log types and their fields | `scripts/gen-log-types.mjs` |
| `references/_meta/spine/` | the agents' entry point: `<product>.json` lists a product's areas, log types and reference areas with the areas their typed edges reach; `<product>/<area>.json` lists an area's subjects with their opening fact and edges. `gen-spine.mjs --check` gates it | `scripts/gen-spine.mjs` |
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

`references/` holds no Markdown outside `_meta/archive/`. Generic background (networking, proxies and
tunnels, zero trust, identity protocols) is the [primer](primer/index.md): teaching material, not cited
knowledge.
