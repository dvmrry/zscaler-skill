---
name: zscaler
description: >
  Answer questions about the Zscaler portfolio from a citation-backed knowledge graph: ZIA (URL filtering and
  categories, wildcard matching, SSL inspection order, Cloud App Control, DLP, sandbox, malware and ATP,
  firewall, traffic forwarding), ZPA (app segments, policy order, App Connectors, Browser Access, PRA,
  AppProtection), ZCC / Client Connector (forwarding profiles, trusted networks, Z-Tunnel), ZDX (score, probes,
  diagnostic sessions / deeptraces), ZIdentity (OneAPI authentication, API clients, step-up), Cloud & Branch
  Connector (ZTW / ZTC / CBC), Zero Trust Browser / Cloud Browser Isolation (ZBI), Workflow Automation (ZWA), AI
  Guard and AI Security, ZMS microsegmentation, EASM, Zscaler Cellular, Business Insights, and the SecOps family
  (Risk360, Deception, UVM, AEM, DSPM, ITDR, Breach Predictor, Agentic SOC, Zero Trust Branch); plus their APIs,
  Python and Go SDKs, Terraform providers and log formats. Use whenever the user mentions Zscaler or any of these
  products or features, asks "is $URL covered / blocked / allowed", "why does this rule win", "what happens when
  these policies overlap", "why is this user's app slow", "what is $product", or "does Zscaler have something for
  $use-case", even without naming Zscaler.
---

# Zscaler

This skill answers how Zscaler behaves (rule precedence, matching semantics, evaluation order, API and SDK
behavior) from a knowledge graph of sourced claims, and, with a company overlay, how *your* tenant is set up.
Those are exactly the places where real behavior diverges from intuition: do not answer them from memory or first
principles.

Structured troubleshooting with a symptom, an affected scope and a timeframe belongs to the
`zscaler-investigator` skill (`/z-investigator`); this entry point is for questions and lookups.

## Answer tiers

| Tier | Source | Use it for |
|---|---|---|
| Knowledge | the public graph plus the company overlay's records | how Zscaler behaves; how *we* do things |
| IaC | the overlay's IaC repos | what our configuration is, as of the repo's last commit |
| Live | read-only `zscalerctl`, when the overlay declares it | what is true now, and drift from IaC |

The overlay is at `$ZSCALER_KB_OVERLAY` or `<runtime-data mount>/overlay/` (`node scripts/runtime-data-path.mjs
overlay`). IaC reads go only to the repos the overlay lists.

- **IaC before live.** Company records carry the values or file locations their IaC pointers resolve to; read
  the located files when the answer depends on our configuration, and state the `committed` date of what you used.
- **Live only** when IaC does not cover the type, field or value, is too stale, or the question is about drift.
  Run or draft a read-only `zscalerctl` command; keep the result in this session (a case may save it
  under its `evidence/`), never as a standing tenant cache. Until `zscalerctl` is adopted where you are, say "if
  installed" and offer to draft the command.
- **No overlay:** never invent tenant truth. Answer the general case, say which tenant fact is missing, and name
  the command that would answer it.

Vendored provider and SDK source say what a tool can express, never what *we* deployed.

## Using the knowledge graph

Retrieval is a file read and one command: the spine, then one `read`. Many runtimes stop for a person to approve
every shell command, so keep to that one (a second `read` only when the first points at something the answer
needs).

1. **Spine.** With your file tool, read `references/_meta/spine/<product>.json` for each product the question
   involves (`zia`, `zpa`, `zcc`, `cloud-connector`, `zdx`, `zidentity`, `shared` for cross-product material and log
   correlation; the smaller products by their ID prefix). One line per area: its summary and the areas it connects
   to by typed edges (decided-by, scoped-by, interacts-with, depends-on, reached-via, logged-in). Then open
   `references/_meta/spine/<product>/<area id>.json` (for example `references/_meta/spine/zia/zia.url-filtering.json`)
   for the 3 to 6 areas that bear on the question, following the edges: one line per subject with its title, its
   opening fact and its typed edges. File reads need no approval.
2. **Decide what the answer needs.** Before reading, work out what decides the outcome the question is about:
   which policies run and in what order, how their rules match and what scopes them, how the traffic is
   forwarded, what sits in the path. Then work out what evidence would show the cause: which log and which
   fields. Pick from the spine the areas and subjects that hold those mechanisms, not only the ones that share
   the question's words; the edges show where each mechanism lives. Your own Zscaler knowledge chooses what to
   read; it is never a source for the answer.
3. **Read.** `node scripts/kb.mjs read <area | subject | type | field> ...` in one call, usually 3 to 6 arguments:
   for example `read zia.url-filtering zia.url-categories zia/web-log#urlfilterrulelabel`. An area reads every
   subject under it; take whole areas for the mechanisms the question turns on, and single subjects from areas over
   about 10k tokens (each area's `tokens` in the product spine). For log evidence, name the fields
   (`zia/web-log#ssldecrypted`) or the log type; each product's spine file lists its log types. Claims arrive inline
   with their citable ID in brackets (`[zia.url-filtering.rule-order:first-match]`), then further facts, inferred
   (Tier B) claims with their conditions, sources that disagree with each side, and open gaps with what would fill
   them. `read` then walks the graph one hop: the subjects the ones you named link to follow under "Linked
   subjects", the most-linked first, and every other link prints as one line with the claim that establishes it;
   read one of those by ID only if the answer needs it. With a company overlay, each subject, type or field is
   followed by the company records about it and the types it binds: scope, confidence, validated date, field map and
   IaC locations.
4. **Tenant configuration (overlay only).** When the answer depends on how *our* tenant is set up, open the IaC
   files the company records locate, with your file tools, and search them for the objects the question names
   (the app, rule, location or category). Give the file's `committed` date.

Run each command bare, from the repo root: no `cd`, no pipe, no redirect. Permission checks approve a bare
command; a compound one is refused or prompts again. When a command's output is long and the runtime saves it to a
file, open that file with your file tool, never with `cat`, `grep` or another shell command.

```bash
node scripts/kb.mjs map <product> ...                     # the spine as text, when a file read is not available
node scripts/kb.mjs read <area | subject | type> ...       # reading text with claim IDs; company records with an overlay
node scripts/kb.mjs resolve <id>                          # one subject or old ledger ID as a JSON bundle, with citations
node scripts/kb.mjs surface <name | API path | SDK package or method | product>   # endpoints, SDK calls, Terraform arguments
```

- **Claims.** Tier A claims quote their source. Tier B claims are inferences with stated `conditions`: say so
  when an answer rests on one. Cite claim IDs (`zia.url-filtering.rule-order:first-match`).
- **Gaps** are what is not known. A data gap says which tier can fill it (`iac`, `live`, `operator`); an earlier
  rule that depends on an unfilled data gap is undecidable offline and shields every rule below it: say so rather
  than skipping to a later rule. Old ledger IDs such as `zia-02` resolve to their gap.
- **Divergences** are sources that disagree. Do not pick one silently: name both, and answer at medium confidence
  at most.
- **Checks** are what to verify before relying on an answer; follow the ones the subject names.
- **Company records** follow [`docs/data-contract/knowledge.md`](docs/data-contract/knowledge.md):
  attribute them as company knowledge, give scope, confidence and `validated` date, and emit `do_not_infer`
  verbatim.

## Traps

Read the named subject before answering; these are the points answers most often get wrong.

- **Wildcards:** asterisks are not a valid Zscaler wildcard; `.example.com` is (bare domain plus subdomains, up to
  5 levels). Translate `*.` to the leading-period form and say so: `zia.url-categories.entry-matching`.
- **SSL inspection:** URL Filtering evaluates twice on inspected HTTPS, with the SSL decision between the passes:
  `zia.ssl-inspection.pipeline`.
- **Cloud App Control vs URL Filtering:** a CAC allow skips URL Filtering unless cascading is on; a CAC block is
  final: `zia.cloud-app-control.precedence`.
- **Rule order:** the category is decided before rules run; a disabled rule keeps its slot; admin rank bounds
  reordering: `zia.url-categories.membership`, `zia.url-filtering.rule-order`.
- **Malware and ATP:** the settings have API and SDK coverage, but which engine blocked one transaction comes only
  from Web Insights or equivalent logs: `zia.sandbox.verdicts`, `zia.atp.block-diagnosis`.
- **DLP:** rules reference engines, not dictionaries: `zia.dlp`.
- **ZPA segments:** two segments with identical specificity have an undocumented tiebreak; answer at medium
  confidence: `zpa.app-segments.matching:same-specificity-tie`.
- **ZPA `TRUSTED_NETWORK` not firing:** usually the forwarding profile's `sendTrustedNetworkResultToZpa` toggle:
  `zcc.forwarding-profiles.private-access-actions`.
- **ZCC forwarding-profile enums** are partly inferred, not documented; answer at medium confidence and cite the
  open gaps in `zcc.api.forwarding-profile-wire`.
- **Cross-product questions** (ZIA plus ZPA, ZCC plus a server product) are silently-wrong-answer territory: start
  at `shared.integrations`.
- **Secrets on read:** which GETs return provisioning keys, API keys, passwords or PSKs: `shared.secret-surfaces`.
- **ZDX:** the SDK's "deeptrace" is the console's Diagnostics Session; the contract's `/v1/config` configuration
  API exists but no SDK calls it: `zdx.applications:config-no-sdk`.
- **Naming collisions:** Python `client.zbi` is **Business Insights**, not Zero Trust Browser (`zbi.*`), and "ZTB"
  can mean Zero Trust Browser or Zero Trust Branch (`zero-trust-branch.overview`). Cloud & Branch Connector is ZTW
  in the API and SDKs and ZTC in Terraform.
- **Cloud Connector SDK:** Python reaches it as `client.ztw` on the v1.x line;
  the `2.0.0bN` beta does **not** include ZTW: `cloud-connector.api.client-coverage`.
- **ZIdentity API clients:** the first client comes from the console; after that Python `client.zid.api_client`
  (singular) and Go `api_clients` manage clients and secrets; resource servers are read-only:
  `zidentity.api-clients`, `zidentity.resource-servers`.
- **Step-up:** a parent authentication level is the stronger one (its validity must be shorter than its
  sub-levels'); whether step-up is OIDC-only is a divergence: `zidentity.step-up`.
- **Python accessors for the smaller products:** AI Guard `client.aiguard`, ZMS `client.zms` (read-only GraphQL),
  EASM `client.zeasm`, Cellular `client.zcell`; Zscaler's AI Guard integration examples are
  `ai-security.ai-guard.integrations`.

For a portfolio-level entry (Resilience, BCC, CTEM, Posture Control, Red Canary MDR, CASB as a term, B2B, the
federal clouds), read its `portfolio.*` subject; `portfolio.overview` maps each need to its product. Most of
their API and rule details are open gaps: give the conceptual answer and do not invent API details or rule behavior.

## Answer format

```markdown
## Answer
<direct answer in 1–3 sentences; lead with the conclusion>

## Reasoning
<why, citing the mechanics: rule order, match type, evaluation stage; name any Tier B claim, gap or divergence the answer rests on>

## Sources
- zia.url-filtering.rule-order:first-match (claim IDs from what you read)
- company.zia.<record> (company knowledge, validated <date>), an IaC repo path and commit date, or the zscalerctl command run

## Confidence
high | medium | low — <one-line reason>
```

For trivial factual questions you may drop Reasoning and Confidence, but keep Sources. Confidence follows the
claims: high on Tier A claims that answer the question directly; medium when the answer rests on a Tier B claim, a
divergence or an extrapolation (say it is one); low when it rests on a gap.

## When to consult logs

Logs are the validation layer, not the first stop. Consult them when the user pushes back on a config-derived
answer, the configuration is ambiguous, the question is observational ("when did this start?"), or you suspect
drift. Follow a named check from `shared.splunk` and its children rather than inventing a search, and say which
claims the search relies on (`shared.log-correlation` has the decision rule). If logs contradict configuration,
lead with that drift: it is the finding.

## When to decline

- **Tenant state needed and no overlay or observation:** say so, answer the general case, and name the read-only
  command that would answer it.
- **The graph has a gap for it:** answer what the claims support, cite the gap, and say what would resolve it.
- **Nothing in the spine covers it:** say the skill does not cover it rather than answering from memory.
