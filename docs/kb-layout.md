# Knowledge-graph layout

`references/` is the knowledge graph: the same for every installation, built only from public sources.
Company knowledge lives in the overlay ([`data-contract/knowledge.md`](data-contract/knowledge.md)), never here.
Agents open the spine with their file tools, then the text files of the subjects and log types they picked under
`references/_meta/text/`, and run `node scripts/kb.mjs read --company <ids>` once for company records, plus one
call for the records it lists that the answer needs (`SKILL.md` "Using the knowledge graph"); `kb.mjs read` prints
the same text in one call, and `kb.mjs resolve` is the JSON bundle interface for scripts. The record contracts are
the schemas under `references/_meta/schema/`.

| Path | Holds | Written by |
|---|---|---|
| `references/<product>/<subject-id>.json` | one subject: prose, claims, gaps, divergences, cases, checks | people (and conversion tools) |
| `references/<product>/types/*.json` | log types and their fields | `scripts/gen-log-types.mjs` |
| `references/_meta/spine/` | the agents' entry point: `<product>.json` lists a product's areas, log types and reference areas with the areas their typed edges reach; `<product>/<area>.json` lists an area's subjects with their opening fact and edges. `gen-spine.mjs --check` gates it | `scripts/gen-spine.mjs` |
| `references/_meta/text/` | the reading text agents open with file tools, so the public graph needs no shell command: `<product>/<subject id>.md` is a subject as `kb.mjs read` prints it, with its aliases, its one-hop links as file paths, and what configures it and its see-also subjects by title; `types/<type id>.md` a log or config type; `codes/` each ZPA LSS status code and ZIA policy reason. `gen-text.mjs --check` gates it | `scripts/gen-text.mjs` |
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
| `references/_meta/releases/` | each product's release notes by date, verbatim from the help captures | `scripts/gen-releases.mjs` |
| `references/_meta/evals/` | answer evals, the retrieval eval's gold facts (`facts.json`) and workflow eval shapes ([how they run](evals.md)) | people |
| `references/_meta/evals/claim-audit/` | the claim audit's rubric and calibration set ([how it runs](maintenance.md)) | people |
| `references/_meta/claim-audit.json` | each audited claim's verdict, keyed by a hash of its statement and evidence | `scripts/claim_audit.py record` |

`references/` holds no Markdown outside `_meta/archive/`. Generic background (networking, proxies and
tunnels, zero trust, identity protocols) is the [primer](primer/index.md): teaching material, not cited
knowledge.
