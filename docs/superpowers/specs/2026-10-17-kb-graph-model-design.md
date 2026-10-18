# Knowledge graph model — design

**Date:** 2026-10-17 · **Status:** revised after one independent review; ready for the first
slice · **Target:** 1.0 (breaking; no Markdown back-compat)

## Purpose

The knowledge base exists to give agents the semantics LLMs get confidently wrong — rule
precedence, matching, evaluation order — with every claim graded by source. Today that model is
stored as ~98k lines of Markdown, so its real structure (claims, citations, subjects, cross-links,
open questions) is recovered by regex in ~5k lines of checkers, cited by line number (~6,800
citations; reverify PRs are 47–97% mechanical), and duplicated across hand-maintained indexes.

This design makes the structure canonical: typed records with stable, readable IDs; prose attached
to the records it explains; Markdown/HTML rendered from them. Its second job is to let agents
apply that knowledge to tenant state — IaC or live `zscalerctl` reads — and to company knowledge
in an overlay, through one lookup instead of a file search.

Mental model: the public KB is the base weights (general semantics), the company index is an
adapter on top of them, and IaC / live state are the input that gets evaluated through both.

## Lessons carried from `feat/structured-data-model` (2026-09/10)

- **The Markdown is not the asset; the model is.** No byte-identical renders, no preserved anchors,
  no legacy fields carried inside records.
- **The reasoning docs are the core.** They are restructured first, not last.
- **No line numbers in content.** Citations anchor on quotes or JSON pointers.
- **Model before retrieval.** No ranking, BM25, or concept expansion until the model exists and
  evals show lookup by ID and alias is insufficient.
- **IDs a person can read.** `zia.url-filtering.rule-order`, never `route-001`.
- **No new top-level directories.** Content stays under `references/`.

## Answer sources

| Tier | Source | Answers | Cost |
|---|---|---|---|
| 1 | **Knowledge** — public index + company index | How Zscaler behaves; how *we* do things | Free |
| 2 | **IaC**, if the overlay configures it | What our configuration is, as of the last backfill | Free, local |
| 3 | **Live `zscalerctl`** | What is true now; drift vs IaC | API calls, needs a key |

Tier 3 is used only when tier 2 cannot answer (type, field, or value not covered, or too stale for
the question) or the question is about drift (out-of-band change). There is no stored snapshot
tier: `_data/snapshot/` is retired. Piping a live `zscalerctl` result into a tool for one session is
a tier-3 use, not a cache.

**Tiers 2 and 3 exist only company-side.** The public project has no tenant: Zscaler offers no
developer tenant, and there is no published OpenAPI spec (`zscaler-api-specs` is our own capture).
So:

- **The public index uses only `zscalerctl`'s offline, credential-free catalogue.** Generating
  types, Terraform status, and data gaps never touches a tenant.
- **Public bundles name the tier-3 command,** e.g. "resolvable live via `zscalerctl zia url-lookup`".
  The resolver offers to run it only when `overlay.json` declares a live tool.
- **Public CI never verifies against a tenant.** Behavior observed live (tier B) enters the public
  index only through promotion, re-authored from a public source.

## Levels of knowledge

There are three levels:

- **Evidence** — vendor captures; overlay logs, cases, and schemas.
- **Claims** — the cited facts.
- **Reasoning** — the subject prose, the stored synthesis.

Agents read top-down. The reasoning is the payload; agents drop to claims or evidence only to
verify. Retrieving the synthesis by subject ID replaces re-deriving it from raw findings on every
question.

## Two indices, one resolver

```
public index (this repo)                 company index (overlay)
  subjects, claims, divergences, gaps,     company claims & procedures, mappings,
  cases, sources, path roles               IaC coverage pointers, systems, evidence sources
  object types (config + log)
            \                                   /
             `--------- kb resolver ----------'
                  one merged, layer-labelled bundle per subject or object type
```

The company index never redefines a public node. Every company record attaches to public IDs with a
declared relation (see **Company index**). With no overlay present the resolver returns public-only
results, silently.

## Identifiers

IDs are the stability contract, so the grammar is fixed here and enforced by the validator.

```abnf
scope       = product / "shared"            ; product = id in products.json
segment     = 1*(ALPHA-lower / DIGIT) *("-" 1*(ALPHA-lower / DIGIT))
subject-id  = scope 1*("." segment)          ; zia.url-filtering.rule-order
item-id     = subject-id ":" segment         ; zia.url-filtering.rule-order:first-match
type-id     = scope "/" segment              ; zia/url-filtering-rules, zia/web-log
field-id    = type-id "#" field-path         ; zia/url-filtering-rules#locations[].id
field-path  = name *("." name / "[]")        ; name = API field name, case preserved
company-id  = "company." subject-id-tail     ; company.zia.splunk-web-mapping
```

- **Each separator means one thing.** `.` builds hierarchy, `:` marks an item inside a subject,
  `/` marks a type, and `#` marks a field.
- **Items** are claims, cases, divergences, and gaps.
  - Inside their own subject file they are referenced by the bare local name (`first-match`).
  - Everywhere else the qualified form (`zia.url-filtering.rule-order:first-match`) is required.
- **Cross-product** subjects use `shared.` (`shared.policy-evaluation`).
- **Type scopes follow `zscalerctl`.** Where its product name differs from the KB product, the
  product's `type_scope` in `products.json` records it: Cloud Connector types are `ztw/…`.
- **`aliases`** are search terms: terminology, legacy names, SDK/Terraform/API names. They need not
  be unique. Text resolution is an exact normalized match on IDs and aliases, and returns a
  candidate list when more than one node matches.
- **`former_ids`** are separate from aliases and must be unique graph-wide.
  - A renamed or merged node lists the IDs it replaced.
  - A split leaves a tombstone, `{ "id": …, "status": "split", "into": [ … ] }`.
  - Legacy clarification IDs (`zia-02`) become `former_ids` of the gaps that replace them.
- **Meaning changes get a new ID.** If a claim's meaning changes, it gets a new ID and the old one is
  marked `superseded_by`. Wording fixes keep the ID.

## Node kinds

| Kind | Example ID | Authored or generated |
|---|---|---|
| `product` | `zia` | authored |
| `subject` | `zia.url-filtering.rule-order` | authored |
| `claim` | `…rule-order:first-match` | authored |
| `case` | `…rule-order:predefined-category-shields-later-block` | authored |
| `divergence` | `…criteria:url-categories2-operator` | authored |
| `gap` | `…category-matching:same-specificity-collision` (semantic), `zia.url-categories.membership:predefined-membership` (data) | authored; tier-3 resolvability generated |
| `source` | `zscaler-help`, `sdk-go`, `tf-zia` | authored registry |
| `type` (config) | `zia/url-filtering-rules` | generated from `zscalerctl` exports |
| `type` (log) | `zia/web-log` | **authored** from NSS feed captures |
| `field` | `zia/url-filtering-rules#order`, `zia/web-log#urlfilterrulelabel` | part of its type |
| `path-role` | `shared.path.upstream-firewall` | authored (deferred; see **Adjacent systems**) |

## Records

### Subject file

One file per subject holds the subject and all of its items. Items are **objects keyed by local
ID**, not arrays, so JSON Patch paths stay stable for CI-authored patches.

`references/zia/url-filtering.rule-order.json`

```json
{
  "schema_version": 1,
  "id": "zia.url-filtering.rule-order",
  "title": "URL filtering rule order and first-match",
  "aliases": ["rule precedence", "why did rule A beat rule B"],
  "binds": ["zia/url-filtering-rules#order", "zia/url-filtering-rules#state"],
  "related": [
    { "rel": "interacts-with", "to": "zia.cloud-app-control.precedence" },
    { "rel": "depends-on", "to": "zia.url-filtering.category-matching" }
  ],
  "claims": {
    "first-match": {
      "statement": "Rules evaluate in ascending `order` and evaluation stops at the first match.",
      "tier": "A",
      "binds": ["zia/url-filtering-rules#order"],
      "evidence": [
        { "source": "zscaler-help", "path": "Configuring_the_URL_Filtering_Policy.txt",
          "quotes": ["The evaluation of the policy rules stops at the first match."] }
      ]
    },
    "disabled-holds-slot": {
      "statement": "A disabled rule is skipped but keeps its position in the order.",
      "tier": "A",
      "binds": ["zia/url-filtering-rules#state", "zia/url-filtering-rules#order"],
      "evidence": [
        { "source": "zscaler-help", "path": "Configuring_the_URL_Filtering_Policy.txt",
          "quotes": ["does not lose its place in the rule order. The service skips it and moves to the next rule."] }
      ]
    }
  },
  "cases": {},
  "divergences": {},
  "gaps": {}
}
```

**Claim fields.**

- Required:
  - `statement` — one or two sentences, Markdown.
  - `tier` — A–D, per the verification protocol.
  - `evidence` — at least one entry.
- Optional:
  - `binds`;
  - `conditions` — version or configuration scope;
  - `status` — `active` (default), `superseded`, or `retracted`, with `superseded_by`;
  - `gaps` — the gap IDs that qualify this claim.

**Confidence is derived from tier and evidence, not stored.** An override needs a stated reason.

**Chains and tool behavior** (added with the provider-defect slice):

- **`derived_from`** lists the claims a chain-of-evidence claim follows from, so each link is
  explicit. A claim needs `evidence` or `derived_from`; Tier A always needs its own evidence.
- **Evidence `at`** lists git refs (an audited tag, and `HEAD` for the pin) where the quotes must
  hold. A bump that removes cited code fails the `HEAD` anchor, which flags a candidate fix.
- **`upstream`** records a tool defect's vendor status: unfiled, filed, acknowledged, fixed,
  wontfix, or do-not-file.
- **Tool claims are about the client, not the product.** SDK and provider code proves what the
  client sends and how it reacts. A consequence that depends on the server's reply is a gap, or a
  conditional Tier B claim, never a Tier A fact.

### Prose

`references/zia/url-filtering.rule-order.md` sits beside its subject file. It holds the
explanation: why the behavior happens, where intuition goes wrong, how it interacts with its
neighbours. It has no frontmatter. Markers:

| Marker | Renders as | Rule |
|---|---|---|
| `{{first-match}}` | the claim's **statement**, inline, with its citation | Prose never restates a claim in its own words; it inlines it. |
| `{{first-match\|ref}}` | a citation only | Used to refer back to a claim already inlined. |
| `[[zia.url-filtering.category-matching]]` | a link to the subject | — |
| `[[zia.url-filtering.rule-order:first-match]]` | a link to another subject's claim | — |

The validator enforces two things:

- every claim in the subject is inlined exactly once, or else listed in a generated "Further facts"
  block;
- every marker resolves.

Paragraphs with no marker are reported per subject as **unanchored**. They are allowed — argument and
explanation need not cite — but the count is visible in review, and the CI verifier spot-checks them
for unmarked factual assertions.

### Cases

Cases carry synthetic config, a request, and an expected verdict, tied to the claims they exercise.
They are the structured form of agent evals for policy-evaluation subjects. Their shape follows
`zsimulator-dev`'s what-if fixture schema (versioned), so it can consume them later. No acceptance
criterion depends on `zsim`; it is an early spike.

```json
"cases": {
  "predefined-category-shields-later-block": {
    "claims": ["first-match"],
    "config": { "rules": [
      { "id": 1, "order": 1, "state": "ENABLED", "action": "ALLOW", "urlCategories": ["SOCIAL_NETWORKING"] },
      { "id": 2, "order": 2, "state": "ENABLED", "action": "BLOCK" } ] },
    "request": { "url": "https://social.example/" },
    "expect": { "verdict": "ambiguous", "at_rule": 1,
                "gap": "zia.url-categories.membership:predefined-membership" }
  }
}
```

The verdict is ambiguous **at the early rule**: an undecidable earlier rule shields later rules and is
never skipped.

### Divergences

```json
"divergences": {
  "<local-id>": {
    "summary": "What the sources disagree about.",
    "positions": [
      { "evidence": { "source": "zscaler-help", "path": "…", "quotes": ["…"] }, "says": "position A" },
      { "evidence": { "source": "sdk-go", "path": "…", "quotes": ["…"] }, "says": "position B" }
    ],
    "impact": "What an operator gets wrong if they trust the wrong source."
  }
}
```

(The draft's example here, the `urlCategories2` operator, was not a real divergence: the current
help capture states the AND explicitly, in agreement with the SDK.)

### Observed behavior supersedes documentation

The source ranking (SDK > MCP > specs > providers > help) orders what sources *say*. It does
not decide what Zscaler *does*. SDK code especially establishes client behavior, and an API
claim derived from reading it is an inference. When a Tier-B observation contradicts a doc- or
SDK-derived claim in the same scope, the observation wins:

- the contradicted claim stays, with `status: superseded` and `superseded_by`, or the
  disagreement is recorded as a divergence;
- the divergence's `resolution` names the observed claim and the rule that applied
  (`observed-supersedes-documentation` or `observed-supersedes-sdk-inference`). The validator
  rejects an observation-rule resolution whose claim is not Tier B;
- open gaps that `resolves_with` `tenant-data` or `lab-test` close the same way, with the
  observation as evidence.

Observations reach the public index two ways:

- **Public:** published, reproducible, sanitized validation records, such as `zscalerctl-dev`'s
  `URL_FILTERING_PAGINATION_VALIDATION.md` (100 of 133 rules returned by an SDK read).
- **Private:** overlay records, promoted by publishing such a sanitized, reproducible check. This
  keeps the rule that public claims rest on public evidence.

Over time, `zscalerctl`-observed behavior becomes the main source for settling open gaps and
correcting SDK-derived API claims.

### Gaps

One kind covers everything the graph knows it does not know. It replaces `clarifications.md`.

```json
"gaps": {
  "same-specificity-collision": {
    "kind": "semantic", "former_ids": ["zia-02"],
    "title": "Same-specificity custom category collision",
    "status": "open", "resolves_with": ["lab-test"],
    "blocks": "deterministic answers when two custom categories match at equal specificity"
  }
}
```

```json
"gaps": {
  "predefined-membership": {
    "kind": "data",
    "title": "Which predefined categories a URL belongs to",
    "about": ["zia/url-categories", "zia/url-filtering-rules#urlCategories"],
    "why": "Vendor docs never publish predefined-category membership; IaC fetches custom categories only.",
    "resolvable_by": ["live"],
    "status": "open"
  }
}
```

- **`semantic`** gaps: the behavior itself is unknown. They resolve with a lab test, a vendor answer,
  or a source read.
- **`data`** gaps: the behavior is known but an input is missing.
  - `resolvable_by` is drawn from `iac`, `live`, `operator`, and `none`.
  - The tier-3 command (e.g. `zscalerctl zia url-lookup <host>`) is authored as `live_command` and
    **checked mechanically** against the pinned `zscalerctl`'s command list (`introspect`).
    `schema gaps` lists what `zscalerctl` does *not* read, so it cannot supply commands.
- **Out of scope:** engine limitations and invalid-input codes (`zsim`'s `UNKNOWN_STATE`,
  `DUPLICATE_ORDER`, unmodeled toggles). They stay in the tool that raises them.
- **Value-vocabulary mismatches** (e.g. web-log `proto` vs. rule `protocols` tokens) are data gaps
  until a vocabulary record exists. Vocabulary records are deferred.

### Object types

**Config types are generated, never hand-edited.**

- **Inputs:**
  - `zscalerctl` catalogue exports (`schema list`, `schema references`, `schema gaps`,
    `introspect`, all `--format json`). CI produces them from the pinned `zscalerctl-dev` submodule
    and commits them with the `zscalerctl` version.
  - `infrawright-dev` packs (registry, overrides, `pack.json`), which are already JSON.
- **Output:** `references/_meta/types/<product>.json`.

**Ownership.** `zscalerctl` owns field shape, type, sensitivity classification, and descriptions.
The KB owns behavior, as claims bound to fields. The KB never duplicates a field description.

```json
{
  "id": "zia/url-filtering-rules", "kind": "config", "product": "zia",
  "names": {
    "zscalerctl": "zia/url-filtering-rules", "terraform": "zia_url_filtering_rules",
    "api": "urlFilteringRules", "sdk_go": "urlfilteringpolicies"
  },
  "fields": {
    "order":          { "type": "int" },
    "urlCategories":  { "type": "array<string>", "references": "zia/url-categories" },
    "urlCategories2": { "type": "array<string>", "references": "zia/url-categories",
                        "terraform": { "status": "adoption-omitted", "source": "infrawright acknowledged_drops" } }
  },
  "terraform": {
    "unsupported_if": [{ "match": { "action": "ISOLATE" }, "status": "provider-missing",
      "provider": "zscaler/zia@4.8.3",
      "reason": "Import cannot reconstruct cbi_profile when the API omits it." }]
  }
}
```

- **Terraform status values:**
  - `provider-missing` — the provider schema cannot hold it.
  - `adoption-omitted` — the adoption tooling drops it by choice.
  - `conditional` — `unsupported_if`, for value-dependent gaps.
- **Tool-added fields** (`referenced_by`, joins) carry `"origin": "zscalerctl"`, so they are never
  presented as API behavior.

**Log types are authored.** They are transcribed from NSS feed captures: there is no machine-readable
vendor schema. NSS feed formats are the canonical public log types. SIEM and pipeline shapes are
company `mapping` records.

## Sources and citations

```json
{ "source": "sdk-go", "path": "zscaler/zia/services/.../x.go", "quotes": ["UrlCategories2 []string"] }
{ "source": "postman", "path": "oneapi-postman-collection.json", "pointer": "/item/3/request/url" }
```

**Anchors.**

- **`quotes`** — one or more short, distinctive strings, each at most ~300 characters. Every quote
  must be found after whitespace normalization. Several short quotes replace one long one.
- **`pointer`** — a JSON Pointer, for JSON sources where text quotes would be ambiguous.
- **No line numbers or SHAs are stored.** Line numbers are computed at render time.
- **Ambiguity is a validation error.** A quote that occurs more than once in its file fails until it
  is lengthened, or until the evidence entry gives an **`after` anchor**. An `after` anchor is a
  unique quote that sets context, such as a function signature. Each quote then resolves to its first
  occurrence after it. This exists because the Python SDK repeats identical docstrings for
  `add_rule` and `update_rule`.
- **Normalization.** Whitespace, zero-width characters, and Unicode private-use glyphs (PDF icon
  characters inside sentences of converted captures) are all treated as one space, on both sides.

**Pin discipline, per source kind** (declared in `references/_meta/sources.json`):

| Kind | Examples | Pin | Re-check trigger |
|---|---|---|---|
| `submodule` | SDKs, providers, MCP server, `zscalerctl-dev`, `infrawright-dev` | the gitlink | the gitlink changes |
| `capture` | `vendor/zscaler-help`, `vendor/zscaler-api-specs` (committed files, ~65% of today's citations) | the capture manifest: per file, `captured_from` URL, `captured_at`, content hash | any captured file changes |

- **Captures replace in place.** A re-capture overwrites the same path, so no dated sibling files
  accumulate. A quote can therefore never keep validating against a stale copy.
- **Long-term, captures move into a mirror repository** vendored as a submodule. That is the sitemap-
  driven capture script; it is not part of the slice.
- **PDF-derived `.txt` files are the source of record,** and the converter is pinned.
- **`references/_meta/verified.json` is generated by CI.** It holds source → pin → last check date →
  result. It answers "when was this last verified" without `git log -S`, and it changes only when a
  pin changes.

CI re-checks every affected quote on a trigger:

- When all quotes are found, records are untouched.
- When a quote is missing or ambiguous, that one claim is flagged.

This replaces the manual reverify cycle.

## Company index (overlay)

```
<overlay>/
  overlay.json                 config: IaC repo location, live tool
  knowledge/<scope>/*.json     company records
  knowledge/<scope>/*.md       prose for those records
```

```json
{ "schema_version": 1,
  "iac": { "path": "../<iac-repo>", "kind": "infrawright" },
  "live": { "tool": "zscalerctl" } }
```

### Relations

Every company record declares how it attaches:

| Relation | Valid targets | Meaning | Requires |
|---|---|---|---|
| `extends` | subject, type, field | Public is silent; this adds knowledge | — |
| `narrows` | claim | A scoped exception to a public claim | `scope` |
| `contradicts` | claim | Same scope, opposite outcome | `scope`, evidence |
| `maps` | type, field | A company representation of a public type (e.g. Splunk) | `map` |
| `binds` | path role | A real system that fills a public role | `system` |

`scope` is an object. Every key is optional, and at least one is required:

- `environment` (e.g. `"our tenant"`);
- `cloud`;
- `version` (product, client, or provider version);
- `condition` (prose describing the configuration in which it holds).

A scope the resolver cannot evaluate is shown, not applied.

### Record kinds

| Kind | Relation | Content |
|---|---|---|
| `claim` | `extends` / `narrows` / `contradicts` | Behavior we observed: scope, confidence, evidence (pointers into overlay evidence) |
| `procedure` | `extends` | Our runbook; presented, never executed automatically |
| `mapping` | `maps` | e.g. Splunk sourcetype and field ↔ `zia/web-log#urlfilterrulelabel`; lists public fields that **don't survive** the company pipeline, which surface as data gaps |
| `iac-coverage` | `extends` | Refresh tier, plus **JSON pointers** into the IaC repo for disabled types, reasons, and added checks |
| `system`, `evidence-source` | `binds` | See **Adjacent systems** (deferred) |

### Promotion

A company claim moves `active` → `promoted` → `retired`.

**`promoted`** requires two things:

- `promoted_to`: the public claim ID that now carries the behavior;
- evidence that is publicly citable.

The public claim is authored from the public source, never from the private record. The existing
knowledge-contract rule still holds: private material never flows into public prose.

**Unattachable evidence** is overlay material that maps to no public ID. The evaluation battery reports
it, and it drives new public subjects, which are authored from public sources.

### Evidence vs records

Most of today's overlay is evidence: logs, recordings, case journals, schemas. Evidence stays raw and
in place. Records are distilled from it over time, prioritized by what evaluations show agents
getting wrong, and they cite evidence by pointer. The overlay is not converted wholesale.

### Evaluation battery

A fixed protocol, run on the work machine. Its report template carries only aggregate counts and
public IDs. It measures:

- resolution to the right subject and company facet;
- layer precedence by question scope;
- token cost compared with file reading;
- unattachable evidence.

### Adjacent systems (deferred)

**Public `path-role` nodes** model the places where non-Zscaler systems affect Zscaler behavior:
a PAC host, an upstream firewall or NSG, egress NAT, connector deployment templates. Each carries
requirement claims linked to the subjects it affects.

**The company index binds its real systems to those roles:**

- **`system`** — what it is, plus a pointer to its repo, path, or backup;
- **`evidence-source`** — which logs exist for it, or `resolvable_by: operator`.

This makes "it's not Zscaler" diagnosable. It is proved later on the forwarding, PAC, and App
Connector subjects.

## Resolver

`node scripts/kb.mjs resolve <id | text>`. There is no database and no MCP wrapper until evals
demand them.

**The resolver is a pure, deterministic CLI.** It produces a JSON bundle on stdout and has no side
effects. Every consumer is a thin adapter over it:

- the agent skill loader;
- a Medina pack, via Medina's JSON line protocol;
- a later MCP wrapper.

The public index and the company overlay are plain git repositories, read as data.

**Output.** One bundle, with a JSON schema at `references/_meta/schema/bundle.schema.json`:

- subject title and rendered prose, with claims inlined;
- each claim with its tier, derived confidence, and citations (rendered line numbers);
- the subject's open gaps and divergences;
- bound types and fields, each with:
  - tier 2: IaC coverage, freshness, and Terraform status;
  - tier 3: the `zscalerctl` command that reads it, and any data gaps it resolves;
- company facets, each labelled `layer: company` with its relation, scope, and confidence.

**Precedence** is applied by the agent from the question's scope, not by blending:

- **Questions about *our* environment:** company facets first, then the public rule they extend,
  narrow, or contradict.
- **General behavior questions:** public claims first, then any company `narrows` or `contradicts`
  facet, surfaced explicitly.
- **Contradictions are always shown,** never resolved silently.

## Layout

```
references/
  _meta/
    products.json  sources.json  verified.json (generated)
    capture-manifest.json         per captured file: URL, captured_at, hash
    types/<product>.json          generated
    schema/*.schema.json          record and bundle contracts
  <scope>/
    <subject-id>.json             subject + claims, cases, divergences, gaps
    <subject-id>.md               prose
scripts/kb.mjs                    validate | render | resolve | reanchor | import-types
```

**Generated, not authored:**

- config types;
- API, SDK, and Terraform surface tables (today's `api-schemas.md`, `sdk.md`, `terraform.md`);
- question routing, the portfolio map, the terminology table, and gap status counts;
- rendered Markdown and HTML.

**Retired as the migration completes:**

- `SKILL.md`'s routing table;
- `_claims-ledger.md` files;
- `clarifications.md`;
- `citation-inventory.json`;
- per-doc `verified-against`, `last-verified`, and `sources` frontmatter;
- `_data/snapshot/`;
- the regex Markdown checkers.

## Stability contract

What must not churn is **IDs and record schemas**, not file paths:

- Every record carries its own `id`, and references resolve by ID.
- Every schema carries `schema_version`, and a version change ships with a migration script.
- Folder layout is an implementation detail and can be reorganized without breaking references.
- Renames, merges, and splits are recorded through `former_ids` and tombstones.

## Transition

The 75 reasoning docs will not convert in one change, so the mixed period is explicit:

- **Unconverted docs stay as they are.** `SKILL.md` routing points converted areas at
  `kb.mjs resolve` and the rest at their Markdown files.
- **A converted doc is deleted in the same change that converts it.** No doc exists in both forms.
  A partially converted doc keeps its other sections and replaces each moved section with a link to
  the new subject.
- **Inbound links become `kb:` links.** `kb.mjs migrate-links` maps each converted file's anchors to
  subjects, using a reviewed table in `scripts/kb-migrate.mjs`. It maps migrated ledger anchors
  through `former_ids` and relabels links whose text names the old file. `kb.mjs validate` checks
  every `kb:` link in legacy Markdown.
- **Migrated clarifications leave the ledger.** Their entries and summary rows are removed, and the
  ledger lists each old ID with its new gap ID.
- **Evals for converted areas** change from `must_cite_files` to `must_cite` IDs. `run-evals.py`
  scores both forms, and `kb.mjs validate` checks the IDs.
- **The existing checkers keep running on legacy docs** until the last doc converts.
  - They skip KB prose through one shared rule: a `.md` with a sibling `.json` (`isKbProse` in
    `kb-lib.mjs`, `is_kb_prose` in `kb_prose.py`).
  - `check-citations` treats `kb:` like a URL scheme.
  - The source-pin check treats a link-only edit (the diff disappears once links are blanked) as
    unchanged. Retargeting a link does not demand re-verifying a doc's sources, but a real prose edit
    still does.
- **The fast gate runs `kb.mjs validate --no-citations`**, and the full gate and CI run it with every
  quote anchored.

## Vertical slice (first build)

Built by hand, before anything is delegated.

**Converted and deleted:**

- `references/zia/url-filtering.md`;
- `references/zia/wildcard-semantics.md`.

**Partly converted, the rest left as legacy:**

- the summary, pipeline, Do Not Inspect, and worked-example sections of
  `references/zia/ssl-inspection.md`;
- the summary, evaluation-order, precedence, and worked-example sections of
  `references/zia/cloud-app-control.md`.

Each remaining legacy doc links to the new subject.

**Subjects, as built.** Membership and entry matching are category concepts that rule evaluation
consumes, so they live under `zia.url-categories`. The two-pass model is the web pipeline, so it
lives under `zia.ssl-inspection`.

- `zia.url-filtering` (topic: the four-question walk), with `.rule-order`, `.criteria`, `.actions`,
  `.advanced-settings`, and `.list-pagination`;
- `zia.url-categories.membership`, `.entry-matching`, and `.entry-format`;
- `zia.ssl-inspection.pipeline`;
- `zia.cloud-app-control.precedence`;
- `zia.logs.web-rule-attribution`.

**Types:**

- all 166 `zscalerctl` config types, generated, including `zia/url-filtering-rules` and
  `zia/url-categories`;
- `zia/web-log`, authored from the NSS CSV, with `rulelabel` (Block-only), `ruletype`,
  `urlfilterrulelabel`, `apprulelabel`, `urlcat`, `urlcatmethod`, and others.

The coverage diff against the retired docs, with the corrections found, is in
`2026-10-17-kb-slice-coverage.md`.

**Synthetic overlay fixture:**

- a Splunk `mapping` onto `zia/web-log`, with one dropped field;
- an `iac-coverage` record pointing at a synthetic IaC JSON file that marks `ISOLATE` rules as not
  adoptable;
- one `narrows` claim.

### Acceptance

1. **Bundle.** `bundle.schema.json` exists. Golden bundles for `zia/url-filtering-rules` and
   `zia.url-filtering.rule-order` are checked in, and `resolve` reproduces them exactly. The type
   bundle includes rule semantics, web-log fields, Terraform status, the data gap with its tier-3
   command, and the company mapping and coverage.
2. **Coverage diff.** Every sentence that carries a citation in today's `url-filtering.md` and
   `wildcard-semantics.md` maps to a claim, or is listed as dropped with a reason.
3. **Evals.**
   - Evals 2–5 pass through the resolver via the eval harness. Eval 1 (tenant data, no overlay)
     declines correctly.
   - Token use on evals 1–5 is ≤50% of the file-reading path, with the same model.
4. **Citations.**
   - Every claim has ≥1 evidence entry, and every quote is found.
   - There are zero ambiguous quotes, and no line numbers or SHAs are stored.
   - `verified.json` is generated.
5. **Cases.** Every slice case has a non-null `expect`, including the predefined-membership
   ambiguity case.
6. **Render.** `render` is deterministic (`--check`), and its output for the slice reads as a doc a
   person would accept.

## Decisions (2026-10-17)

1. **Rendered Markdown** is not committed. It is generated on demand and published as HTML from CI.
2. **Type inputs.**
   - `zscalerctl-dev` and `infrawright-dev` (public) are pinned as submodules.
   - CI commits `zscalerctl`'s JSON catalogue exports.
   - The internal IaC repo stays company-side, and `overlay.json` points to it.
3. **Subject granularity** is about one subject per H2/H3 section of today's reasoning docs, validated
   on the slice.
4. **Gap IDs** follow the readable node scheme, and legacy clarification IDs become `former_ids`.
5. **Field ownership.** `zscalerctl` owns field shape and descriptions; the KB owns behavior.
6. **Three tiers, strictly.** There is no stored snapshot tier.

## Deferred

- HTML publishing and the MCP wrapper.
- Value-vocabulary records.
- Adjacent systems (path roles, `system` and `evidence-source` records).
- The help-capture mirror and its sitemap-driven capture script.
- **Terraform provider defects** — the planned second slice, from the owner's audit of the four
  providers. Defects become records tied to provider and version, with upstream issue links.
  Company-specific context never enters the public index.
