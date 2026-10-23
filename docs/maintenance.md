# Maintenance

This page collects repo upkeep that does not need to sit in the root README.

## Automation

`.github/workflows/check-hygiene.yml` runs `scripts/check-hygiene.py` on every
PR and on the weekly hygiene cadence. Errors fail CI; warnings are advisory.
This catches frontmatter drift, broken anchors, eval-doc desync, and
resolved-clarification propagation gaps.

`.github/workflows/issue-watch.yml` runs `scripts/issue-watch.py` in
sticky-issue mode every Monday at 13:00 UTC. The first run creates a sticky
issue with label `issue-watch-digest` and seeds it with a 30-day-lookback
digest of upstream Zscaler GitHub issues. Each subsequent run rewrites the body
in place with the latest digest; the sticky issue's `last_check` HTML-comment
marker carries state so no Actions cache or local `state.json` is needed.

`.github/workflows/maintenance-digest.yml` runs
`scripts/maintenance-digest.py` weekly after the main hygiene cadence. It
updates a sticky issue with label `maintenance-digest` with stale references,
stale help captures, vendor drift counts, eval coverage warnings, script
scaffolds, and TODO/stub inventory. This is advisory backlog generation, not a
merge gate.

`.github/workflows/vendor-impact.yml` runs on PRs touching `vendor/**` or
`.gitmodules`. It posts or updates a PR comment with submodule commit logs and
`check-vendor-drift.py` counts, runs `scripts/find-asymmetries.py`, and uploads
the vendor impact summary plus asymmetry candidates as artifacts. Use this for
Renovate and submodule PR triage before merging.

`.github/workflows/refresh-discovery.yml` is the cheap daily publication scan.
It runs `npm run refresh:discovery` with temporary JSON and Markdown report
paths, restores the most recent successful observation baseline through the
Actions artifacts API when one is available, and uploads the new report and
baseline as artifacts. A missing artifact is reported as bootstrap coverage;
the workflow does not silently treat an unavailable baseline as an unchanged
source. The job summary contains the bounded Markdown report, and the scan
does not open issues, mutate sources, or send notifications.

## Knowledge-graph refresh loop

Every claim quotes a pinned source, so a source change shows up as quotes that no longer anchor. The loop
below takes a source change to a reviewable pull request; each step is deterministic and needs no model.
Keep scratch output outside the checkout (`$TMP` below).

1. **Help captures.** `python3 scripts/help_capture.py check --replace --json > $TMP/drift.json` refetches
   every capture, rewrites the ones whose page revision moved, and reports them (exit 1 means drift). After a
   change to the renderer itself, use `help_capture.py rerender` instead: it re-renders captures still at
   their captured revision and reports any whose revision moved.
1a. **Issues.** `python3 scripts/issue_capture.py check --replace --json > $TMP/issues.json` refetches the
   captured GitHub issues; a changed state (an issue closed, a pull request merged) marks every line of it
   changed, and `node scripts/kb-drift.mjs $TMP/issues.json` lists the claims citing it.
2. **Spacing-only breaks.** `node scripts/kb.mjs requote --write` re-quotes every capture quote or `after`
   anchor that a re-render broke only by whitespace (one span equal to it up to spacing); without `--write`
   it lists them. A reworded or ambiguous quote is left for step 3.
3. **Review.** `node scripts/kb-drift.mjs $TMP/drift.json` sorts every evidence entry that cites a changed
   page into `broken` (re-anchor it, or turn the claim into a gap if the page no longer says it),
   `in-change` (it still anchors, on or next to a changed line: read the change against the claim) and
   `untouched`. Gone and maintenance pages are listed with the claims that cite them.
4. **Submodule bumps.** A pin bump re-anchors every quote into that submodule at the new pin; a quote that
   breaks there is a real source change, never a spacing one, so it goes through review, not `requote`. A
   quote can also keep anchoring while the code beside it changes what the claim says (a field added to a
   request body the claim says holds only three). `node scripts/kb-drift.mjs --pins <base-ref>` diffs every
   moved pin and sorts the evidence citing changed files into the same `broken`, `in-change` and `untouched`;
   read every `in-change` entry against its claim.
5. **Generated layers.** `node scripts/gen-surfaces.mjs <product>` after a spec capture or an SDK or
   provider pin changes, and `node scripts/gen-log-types.mjs` after an NSS or LSS field article changes;
   both take `--check`.
6. **Records.** `node scripts/kb.mjs manifest` records the changed captures' hashes and
   `node scripts/kb.mjs verified` regenerates `references/_meta/verified.json`.
6a. **Retrieval.** `node scripts/kb-retrieval.mjs` reports how a plain-question resolve ranks each eval's gold
   subjects; the gate fails when any ranks worse than `scripts/fixtures/kb-retrieval-baseline.json`. After an
   intended ranking or subject change, rewrite the baseline with `--write` and review its diff.
7. **Gate.** `node scripts/check-full.mjs` (validate, lint, generated-layer checks and every test, with
   temporary files under one root it removes).
8. **Pull request.** Open it with the drift review in the description. It never merges itself.

A model-graded claim audit (does each quote support its claim's statement?) is worth running on the claims
the review marks `broken` or `in-change`; it calls a model API, so it runs outside the repo and outside CI.

## Weekly upstream refresh (automated)

Most weeks, a maintainer does not need to start the upstream bump by hand.

- Renovate watches git submodules, normally groups them as `Zscaler upstream
  submodules`, labels the PR `upstream-bump`, and runs before 9am UTC Monday.
  Four compatibility-sensitive roots — the AWS, Azure, and GCP Cloud Connector
  modules plus `terraform-provider-zia` — are excluded from that group and
  require Dependency Dashboard approval before Renovate opens separate PRs.
  Approve a Cloud Connector module only after checking its Terraform syntax
  against the documented floor; approve the ZIA provider only at an exact
  released tag.
- A bump PR that changes `vendor/**` or `.gitmodules` triggers the hygiene
  workflow. The non-advisory hygiene checks fail the job on real errors; vendor
  family coverage and vendor drift are advisory so expected upstream movement is
  visible without deadlocking every bump.
- `vendor-impact.yml` also runs on vendor PRs. Read its PR comment first: it
  contains the submodule commit logs and `check-vendor-drift.py` counts. The
  workflow also runs the asymmetry scan and uploads that output as an artifact.
- Monday at 13:00 UTC, `check-hygiene.yml` and `issue-watch.yml` run by cron.
  Issue watch updates the sticky `issue-watch-digest` issue with upstream
  Zscaler GitHub issue activity.
- Monday at 13:20 UTC, `maintenance-digest.yml` updates the sticky
  `maintenance-digest` issue. Its stale checks use 60 days for reference docs'
  `last-verified` dates and 90 days for help captures.
- Bump PRs do not merge themselves; `renovate.json` has no automerge setting.
  Review the checks and the vendor-impact comment, then merge manually.
- Upstream doc changes are threaded into the references by weekly doc-threading
  PRs; PR #198 / commit `9673804` is one example.

## Discovery cadence and boundaries

The daily discovery scan is deliberately cheaper than a content refresh. It
records the current `.gitmodules`/index gitlinks and uses the authenticated
`gh api` CLI to observe GitHub default heads and latest releases. It records
Help sitemap URLs and `lastmod` values, and checks only the Automate main and
runtime JavaScript assets with conditional requests. It never downloads Help
article pages or Automate operation pages, and it labels every delta as an
observed publication candidate. The report keeps product counts and bounded
Markdown examples rather than printing a sitemap-sized page queue; the JSON
report retains the complete bounded candidate array for downstream filtering.

Run it locally with output paths outside this checkout (the baseline is
optional):

```bash
npm run refresh:discovery -- \
  --output /tmp/zscaler-refresh-discovery/report.json \
  --markdown /tmp/zscaler-refresh-discovery/report.md \
  --baseline /tmp/zscaler-refresh-discovery/baseline.json \
  --since 2026-09-01
```

Use the weekly cadence for bounded integration review: inspect the daily JSON
candidate array (the Markdown file is intentionally only bounded examples),
capture only selected changed sources, and run the normal
reference/provenance checks before editing knowledge. Use the monthly cadence
for broader coverage work such as a bounded Automate contract sweep or Help
coverage accounting. A changed main/runtime asset is only a capture candidate;
this discovery helper cannot infer a semantic API delta. A sitemap truncation,
incomplete child fetch, HTTP failure, or missing `gh` authentication is reported
as partial/unknown. Missing `lastmod` values remain visible in the coverage
count and mean that this scan cannot detect a date-only change for that URL. No
available prior artifact is reported explicitly as bootstrap coverage; an
Actions API or artifact download failure is instead a restore failure, remains
unknown, and blocks replacement-baseline publication. Failed checks preserve
their prior observations rather than replacing them with empty-success state.

The implementation is intentionally dependency-free and bounded: Node's
standard library, fixed request timeout/retry/rate limits, at most four
concurrent source requests, a small sitemap-index fan-out, conditional asset
requests, and atomic writes to external paths. GitHub credentials remain in
`gh`'s existing authentication context and are never copied into output.
Regression coverage is in `scripts/refresh-discovery.test.mjs`; run it with:

```bash
node --test scripts/refresh-discovery.test.mjs
```

The tests use local fixtures and injected Git/`gh`/HTTP runners for first-run,
unchanged/304, changed, and failure/preserved-baseline cases. No live network
request is required. The JSON report retains the complete bounded candidate
array for review or filtering; Markdown intentionally shows only bounded
examples.

## Submodule Management

Renovate handles the normal Monday bump. Use a manual bump only to fast-track a
specific source before the next scheduled PR.

To bump an individual submodule to upstream HEAD:

```bash
git submodule update --remote vendor/zscaler-sdk-python
git add vendor/zscaler-sdk-python
git commit -m "bump sdk-python"
```

After a manual bump, use the same review path as Renovate: wait for hygiene,
read the vendor-impact summary, and propagate real SDK / Terraform / contract
changes into the affected reference docs.

For checked-in Help/API captures, commit the captured source before recording
that commit in a reference's `verified-against` metadata. Preserve those source
commits when merging the documentation PR (use a merge commit, not squash or
rebase), unless the provenance pins are explicitly rewritten and revalidated
against replacement source commits. Otherwise a clean CI checkout cannot
resolve a capture commit that existed only on the discarded branch.

## Contributing

- Knowledge is JSON subjects under `references/<product>/`, one subject per file, validated against
  `references/_meta/schema/` (the model is
  `docs/superpowers/specs/2026-10-17-kb-graph-model-design.md`). A Tier A claim quotes its source; a Tier B
  claim states its `conditions`. `node scripts/kb.mjs validate` anchors every quote and pointer.
- What no source settles is a gap, not a hedge in prose. Resolving one: set `status: resolved` and write a
  `resolution` that names the claim that settles it; keep its `former_ids`, so old IDs still resolve.
- What a team has observed but no public source states (an incident finding, a support answer) is company
  knowledge: it goes in the overlay as a record ([`data-contract/knowledge.md`](data-contract/knowledge.md)),
  never into the public graph.
- A vendor GitHub issue that bears on documented behavior (a known defect, a request answered with a
  release) is captured with `python3 scripts/issue_capture.py capture <url>` and cited like a help page:
  quote what it reports, and pin the state the claim rests on with a pointer to `/source` and `expect`
  (`{"state": "open"}`). The weekly issue-watch digest lists the candidates; capture only what you cite.
- Moving a claim between subjects renames it: use `node scripts/kb.mjs move-claim <from> <to> [--merge]`,
  which rewrites every reference.

## Testing the Skill

`references/_meta/evals/evals.json` has the canonical prompts with structured
assertions. The format is intended for a skill-creator-style eval harness: run
each prompt with and without the skill loaded, then diff the outputs.

For tenant-specific prompts, `tenant_data_required: true` signals that the
harness should expect a decline-with-helpful-pointers when no overlay IaC or live
`zscalerctl` data is available.

## Known Gaps

- **Malware Protection and ATP settings are programmable, but transaction
  verdicts are not returned by those settings endpoints.**
  `kb:zia.atp.api-surface` and `kb:zia.malware-protection.api-surface` cover the
  settings surfaces, and `kb:zia.atp.block-diagnosis` the log workflow needed to
  diagnose a specific block.
- **Credentialed live-tenant diagnostics are out of scope.** Tenant reads are
  handled by the read-only `zscalerctl` CLI; the never-validated SDK diagnostic
  scaffolds were removed (2026-06), as were the SDK snapshot / lookup / simulator
  scripts. Tenant config comes from the overlay's IaC or a live read-only
  `zscalerctl` read (no saved snapshot tier); the references reason over it.
- **Open gaps** are in the graph, with what would resolve each (often a lab test or a tenant read):
  every resolved bundle lists its subject's gaps.
- **Z-Tunnel wire-format internals are not customer-documented.**
  `kb:zcc.z-tunnel` covers the operational layer. Protocol-level
  questions remain Zscaler Support territory.
- **Tier 2 has programmable but shallow coverage.** ZBI, ZWA, AI Guard, ZMS,
  EASM, Zscaler Cellular / ZCell, and Business Insights have documented product
  behavior and programmable surfaces, but thinner operational depth than Tier 1
  policy and traffic-control planes. ZMS and EASM are read-only/query-only;
  do not imply write parity across the tier.
- **Tier 3 has reasoning coverage, no verified SDK/TF management surface.** Deception,
  Risk360, AI Security family beyond AI Guard, ZSDK, ITDR / Identity
  Protection, DSPM, AEM, UVM, SOC Workbench, Breach Predictor, Zero Trust
  Branch, and Experience Center / unified topics can be answered conceptually,
  but the skill must avoid inventing SDK, Terraform, or API behavior.
- **Tier 4 has paragraph-level awareness only.** The skill can route these
  topics, answer breadth questions, and redirect to Zscaler's help site, but
  will not claim operational depth.
