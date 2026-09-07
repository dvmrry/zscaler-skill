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

- Reference files start as `author-status: stub` with TODO headings. Pick one,
  fill it in, bump to `draft`, and add sources.
- Keep hand-authored reasoning (`content-type: reasoning`) separate from
  reproduced or paraphrased API docs (`content-type: reference`). The
  distinction matters for later training use.
- When all cited sources for a behavior document are reverified, update
  `last-verified` to that verification date. A bounded edit that does not
  reverify every cited source retains the existing date and records its narrower
  source scope instead of implying a full-document recheck.
- Resolving a clarification: update the entry in
  `references/_meta/clarifications.md` in place. Set `Status: resolved`, add an
  `Answer:` paragraph, and cite sources. Do not delete resolved entries; other
  docs link to them by anchor.
- Adding a new clarification: pick the next `<area>-<num>` ID and link both
  ways, from the origin reference doc to the clarification and from the
  clarification back to the origin.

## Testing the Skill

`references/_meta/evals/evals.json` has the canonical prompts with structured
assertions. The format is intended for a skill-creator-style eval harness: run
each prompt with and without the skill loaded, then diff the outputs.

For tenant-specific prompts, `tenant_data_required: true` signals that the
harness should expect a decline-with-helpful-pointers when `_data/snapshot/` is
empty.

## Known Gaps

- **Malware Protection and ATP settings are programmable, but transaction
  verdicts are not returned by those settings endpoints.**
  `references/zia/malware-and-atp.md` covers the GET/PUT settings surfaces and
  the separate Web Insights / log workflow needed to diagnose a specific block.
- **Credentialed live-tenant diagnostics are out of scope.** Tenant reads are
  handled by the read-only `zscalerctl` CLI; the never-validated SDK diagnostic
  scaffolds were removed (2026-06), as were the SDK snapshot / lookup / simulator
  scripts. Tenant config is mounted into `_data/snapshot/` out of band (private
  overlay or `zscalerctl` dump); the references reason over it.
- **Several clarifications remain open** because they require tenant-specific
  lab tests. See `PLAN.md`.
- **Snapshot schema docs are anticipatory, not tenant-validated.** The ZIA,
  ZPA, ZCC, and ZIdentity schema guides are derived from SDK, Postman, and
  provider sources at medium confidence; validate them against real tenant
  output before promoting their wire-shape claims.
- **Z-Tunnel wire-format internals are not customer-documented.**
  `references/zcc/z-tunnel.md` covers the operational layer. Protocol-level
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
