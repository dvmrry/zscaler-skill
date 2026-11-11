# Maintenance

This page collects repo upkeep that does not need to sit in the root README.

## Automation

`.github/workflows/check-hygiene.yml` (the required `hygiene` check) runs
`node scripts/check-full.mjs` on every PR, on pushes to main and on Monday's
cron: the same gate a maintainer runs locally, so the list of checks lives in
`check-full.mjs` and `check-fast.mjs` and nowhere else. Errors fail CI;
advisory checks report without failing. `lint-js.yml` and `lint-py.yml` are
the other two required checks (Biome and Ruff).

`.github/workflows/kb-refresh.yml` runs the knowledge-graph refresh loop below
through `node scripts/kb-refresh.mjs`: a cheap pass after each daily discovery
run, and the full pass every Monday at 12:00 UTC. It opens one `kb-refresh` pull
request and keeps adding to it while it is open. See "Daily and weekly
knowledge-graph refresh" below.

`.github/workflows/issue-watch.yml` runs `scripts/issue-watch.py` in
sticky-issue mode every Monday at 13:00 UTC. The first run creates a sticky
issue with label `issue-watch-digest` and seeds it with a 30-day-lookback
digest of upstream Zscaler GitHub issues. Each subsequent run rewrites the body
in place with the latest digest; the sticky issue's `last_check` HTML-comment
marker carries state so no Actions cache or local `state.json` is needed.

`.github/workflows/maintenance-digest.yml` runs
`scripts/maintenance-digest.py` weekly after the main hygiene cadence. It
updates a sticky issue with label `maintenance-digest` with stale help
captures, eval coverage warnings, script scaffolds, and TODO inventory. Vendor
drift against the graph is the refresh pull request's job, not the
digest's. This is advisory backlog generation, not a merge gate.

`.github/workflows/vendor-impact.yml` runs on PRs touching `vendor/**` or
`.gitmodules`. It posts or updates a PR comment with submodule commit logs and the
knowledge-graph pin review (`kb-drift.mjs --pins`: evidence citing a changed
file, sorted into broken, in changed text and untouched), runs `scripts/find-asymmetries.py`, and uploads
the vendor impact summary plus asymmetry candidates as artifacts. Use this for
Renovate and submodule PR triage before merging.

`.github/workflows/bump-regenerate.yml` runs on Renovate's bump PRs. It
regenerates the layers built from vendored sources and commits them to the
bump's branch, so what the gate still fails on is quotes the new code broke.

`.github/workflows/refresh-discovery.yml` is the cheap daily publication scan.
It runs `npm run refresh:discovery` with temporary JSON and Markdown report
paths, restores the most recent successful observation baseline through the
Actions artifacts API when one is available, and uploads the new report and
baseline as artifacts. A missing artifact is reported as bootstrap coverage;
the workflow does not silently treat an unavailable baseline as an unchanged
source. The job summary contains the bounded Markdown report. The scan itself
does not open issues, mutate sources, or send notifications; `kb-refresh.yml`
acts on each successful run's report.

## Knowledge-graph refresh loop

Every claim quotes a pinned source, so a source change shows up as quotes that no longer anchor. The loop
below takes a source change to a reviewable pull request; each step is deterministic and needs no model.
Keep scratch output outside the checkout (`$TMP` below).

1. **Help captures.** `python3 scripts/help_capture.py check --replace --json > $TMP/drift.json` refetches
   every capture (help.zscaler.com and automate.zscaler.com pages, and www.zscaler.com product pages, which the
   site rate-limits, so those are fetched three seconds apart) and reports the ones whose page revision moved
   (exit 1 means drift); it rewrites them only once
   every page was checked, so a run that fails part way changes nothing. A page the site still fails to serve
   after retries is reported unavailable, like one under maintenance. After a
   change to the renderer itself, use `help_capture.py rerender` instead: it re-renders captures still at
   their captured revision and reports any whose revision moved.
1a. **Issues.** `GITHUB_TOKEN=$(gh auth token) python3 scripts/issue_capture.py check --replace --json > $TMP/issues.json`
   (without a token, GitHub's anonymous rate limit stops a full check part way) refetches the
   captured GitHub issues; a changed state (an issue closed, a pull request merged) marks every line of it
   changed, and `node scripts/kb-drift.mjs $TMP/issues.json` lists the claims citing it.
2. **Spacing-only breaks.** `node scripts/kb.mjs requote --write` re-quotes every capture quote or `after`
   anchor that a re-render broke only by whitespace (one span equal to it up to spacing); without `--write`
   it lists them. A reworded or ambiguous quote is left for step 3.
3. **Review.** `node scripts/kb-drift.mjs $TMP/drift.json` sorts every evidence entry that cites a changed
   page into `broken` (re-anchor it, or turn the claim into a gap if the page no longer says it),
   `in-change` (it still anchors, on or next to a changed line: read the change against the claim) and
   `untouched`. Gone and maintenance pages are listed with the claims that cite them. A page that moved to a
   new address with the same content is reported `moved` (its old address becomes an alias), and only the
   evidence pointing at its address can break. `node scripts/kb-drift.mjs --by-subject $TMP/drift.json
   $TMP/issues.json --pins <base-ref>` lists the same entries per subject across every review, so each subject
   gets one writer. `node scripts/kb-drift.mjs --renames $TMP/drift.json` lists the names the changed pages
   replaced ("Internet & SaaS" -> "Internet Access") and the subjects whose own wording (titles, aliases, prose,
   statements) still uses the old one, which the evidence review does not reach.
4. **Submodule bumps.** On main Renovate opens them; on a branch it does not watch, `node scripts/bump-pins.mjs`
   lists what would move (`--apply` checks out and stages the new pins). It moves a submodule renovate.json holds
   for approval only to a release tag, force-fetches tags so they match a fresh clone, and names any tag upstream
   re-pointed, since evidence `at` resolves through tag names. A pin bump re-anchors every quote into that submodule at the new pin; a quote that
   breaks there is a real source change, never a spacing one, so it goes through review, not `requote`. A
   quote can also keep anchoring while the code beside it changes what the claim says (a field added to a
   request body the claim says holds only three). `node scripts/kb-drift.mjs --pins <base-ref>` diffs every
   moved pin and sorts the evidence citing changed files (evidence whose `at` names only fixed refs excepted; `at`
   with `HEAD` moves with the pin) into the same `broken`, `in-change` and `untouched`;
   read every `in-change` entry against its claim.
5. **Generated layers.** `node scripts/gen-surfaces.mjs all` (or one product) after a spec capture or an SDK or
   provider pin changes, `node scripts/gen-log-types.mjs` after an NSS or LSS field article changes, and
   `node scripts/gen-releases.mjs` after a release-note page changes; each takes `--check`. A zscalerctl pin change also needs `node scripts/kb.mjs export-zscalerctl` (needs Go) and
   `import-types`, and changes the resolve goldens in `scripts/fixtures/kb-golden/`: rewrite them with
   `node scripts/regen-goldens.mjs` and read the diff.
6. **Records.** `node scripts/kb.mjs manifest` records the changed captures' hashes and
   `node scripts/kb.mjs verified` regenerates `references/_meta/verified.json`.
6a. **Retrieval.** `node scripts/kb-retrieval.mjs` reports how a plain-question resolve ranks each eval's gold
   subjects; the gate fails when any ranks worse than `scripts/fixtures/kb-retrieval-baseline.json`. After an
   intended ranking or subject change, rewrite the baseline with `--write` and review its diff.
7. **Gate.** `node scripts/check-full.mjs` (validate, lint, generated-layer checks and every test, with
   temporary files under one root it removes).
8. **Pull request.** Open it with the drift review in the description. It never merges itself.

`node scripts/kb-refresh.mjs --out $TMP` runs steps 1, 1a, 2, 3 (the review), 5 and 6 in that order and writes
the check reports, the full review (`review.md`), the same entries by subject (`by-subject.md`), the rename sweep
(`renames.md`), the capture queue (`capture-queue.md`) and a pull-request description bounded to GitHub's size
limit (`body.md`). It does not commit, push or run the gate. While editing a subject, `node scripts/kb.mjs check
<subject-id> ...` validates and lints just those subjects in about a second.

**Capture queue.** `node scripts/capture-queue.mjs` lists the help pages the pinned vendor material links to
that are not captured, ranked by how many cited vendor files link each. Clear old addresses first with
`python3 scripts/help_capture.py alias <url> ...` (a URL that redirects to a captured page becomes that capture's
alias), run `node scripts/kb.mjs manifest`, then capture what the graph needs with `help_capture.py capture`.

**Claim audit.** `validate` proves each quote is in its source; `python3 scripts/claim_audit.py` asks whether
the quotes state everything the statement says. Haiku judges every claim and Opus re-judges the covered and
unsure verdicts; each claim comes out `overreach`, `borderline` (a person decides) or `covered`. Run it on the
claims a change adds or rewrites, and on what the review marks `broken` or `in-change`:

```bash
python3 scripts/claim_audit.py build --base origin/main --out $TMP/audit   # claims new or changed since main
python3 scripts/claim_audit.py run --out $TMP/audit
python3 scripts/claim_audit.py record --out $TMP/audit                     # into references/_meta/claim-audit.json
python3 scripts/claim_audit.py status
python3 scripts/claim_audit.py review --base origin/main > $TMP/audit/review.md   # the borderline claims, for the PR
```

`review` prints the claims a person decides as Markdown for the pull request: each one's statement with the parts
the judges found unstated in bold, its quotes and its file. Paste it into the description or a comment and settle
each one in review: fine as written, narrowed, or given the quote that states it. Without `--base` it covers the
whole graph, and `--all` adds the overreach claims, which are fixed before merge rather than reviewed. A backlog
too large for one pull request goes to GitHub issues: `review --checklists --out <dir>` writes one checklist per
product (split to fit an issue body), each claim a checkbox with its statement and a link to its line at the
current commit; open each file as an issue labelled `claim-review`. A ticked box is fine as written; a comment
naming a claim asks for a fix, which lands in a pull request like any other. One run's verdicts vary (two full runs
agreed on 90% of unchanged claims and on only 69% of borderline ones), but a flag is usually real: when an Opus
reviewer read each of the 1,259 claims either run flagged, against its quotes and sources, 97% of those flagged in
both runs and 88% of those flagged in one needed a change, most often a quote that stops short of the part it
backs. So review every flag; to review a subset first, such as the claims flagged in two runs, pass `review --checklists` that list with `--ids`.

Verdicts are kept per claim with a hash of its statement and evidence, so `build --unaudited` finds what changed
since its audit. It runs through the `claude` CLI on a Claude plan's quota, never in CI. Before trusting a
rubric or model change, rerun the calibration set (`build --calibration`, `run`, `grade`). A rubric change
empties the record when the next run is recorded, so record any run in flight first, then re-audit every claim.

## Daily and weekly knowledge-graph refresh (automated)

- **Daily**, after each successful discovery run, `kb-refresh.yml` runs
  `kb-refresh.mjs --discovery <report> --changed-only`, the cheap pass:
  - it refetches only the captures whose page discovery saw change (a new
    sitemap date) or leave the help sitemap;
  - it captures new pages in sections the graph already captures, at most 40 a
    run, as `<section>-<slug>.json`;
  - it recaptures the Automate API reference and the OneAPI Postman collection
    when discovery saw the Automate assets change.

  A renamed page's capture follows its redirect during the check and keeps the
  old address as an alias, so the new address is not captured twice. When
  discovery saw nothing, the run stops there.
- **Mondays at 12:00 UTC**, the full pass refetches every help and issue
  capture, since a page can change without a new sitemap date, and does the
  same discovery work.
- **When something moved**, the run commits the rewritten and new captures and
  records to the `kb-refresh` branch. The first run opens a pull request whose
  description is the drift review, followed by what discovery found: new pages
  captured, pages that left the sitemap, new pages in sections the graph does
  not capture, the Automate state and vendor releases.

  While that pull request is open, later runs commit on top of its branch and
  add their review as a comment, so fixes pushed to the branch are kept. Every
  run uploads the full review, diffs included, as the `kb-refresh` artifact,
  and dispatches the three required checks on the branch, because a pull
  request opened with `GITHUB_TOKEN` starts no `pull_request` workflows.
- **Before merging**, fix what the gate fails on. Broken evidence fails the
  gate on that pull request:
  - re-anchor it on the branch, or turn the claim into a gap when the source
    no longer says it. `node scripts/kb-reanchor.mjs --base main --write`
    does the re-anchoring for capture quotes, in claims and in divergence
    positions. It is given `KB_MODEL_ENDPOINT` and `KB_MODEL`, any
    OpenAI-compatible endpoint, plus `KB_MODEL_API_KEY` if that endpoint needs
    one. For each broken quote it tells the model why it broke. A missing quote
    comes with the old passage and the same part of the new page. A quote the
    page now repeats, for another OS or model, comes with every place it
    occurs, so the model can give an `after` anchor that picks the right
    section. It checks the decisions together, one evidence entry at a time:
    - the entry, as the decisions would leave it, must anchor by the gate's own
      rule, with at most one new anchor, and every quote that anchors now must
      still anchor;
    - each quote whose place a decision set is placed against its old
      surroundings, the sentence or item just before it and the one just
      after, as they were. A repair between them, where they are on the page
      once, is safe. One outside them is rejected, so a page that gained a
      second OS's or model's copy of a section does not move a claim onto the
      wrong copy. One the text cannot settle is applied and marked **check** in
      the report: the page repeats that part, its surroundings changed, it sat
      at the page's start or end, or the vendor moved it. Only the headings and
      the statement's meaning can tell which copy such a quote is about.

    A page the vendor rewrote can be rejected where the repair was right; that
    is left for a person. The run's last line counts the quotes to check as
    `review`. It asks the model once more about the
    decisions the checks rejected. It restates a claim only when every restate
    decision of the reply that wrote the statement was accepted. It regenerates
    the spines and `verified.json`, and leaves what the page no longer supports
    for a person. Read its `--report` before committing;
  - read every in-change entry against its claim;
  - run the claim audit on the claims you touched.

  The new captures are uncited until a coverage pass writes their claims.

## Weekly upstream refresh (automated)

Most weeks, a maintainer does not need to start the upstream bump by hand.

- Renovate watches git submodules, normally groups them as `Zscaler upstream
  submodules`, labels the PR `upstream-bump`, and runs before 9am UTC Monday.
  `terraform-provider-zia` is excluded from that group and needs Dependency
  Dashboard approval before Renovate opens its own PR: approve it only at an
  exact released tag, so claims cite a version that shipped. Nothing here runs
  the vendored modules or providers; a bump of any of them is reviewed with
  `node scripts/kb-drift.mjs --pins <base-ref>` like any other source.
- Renovate keeps `.node-version`, the Node that CI and version managers
  install, at the newest release of its LTS line, so Node security fixes arrive
  as ordinary update PRs on the Monday schedule. A new major waits for
  Dependency Dashboard approval.
  The supported floor is separate: `MIN_NODE_VERSION` in `scripts/doctor.mjs`,
  equal to `engines` in `package.json`. The `node-floor` job in
  `check-hygiene.yml` runs the fast gate on it, so a script that needs a newer
  Node fails there. Raising the floor is a deliberate change to both and to the
  install docs.
- On a Renovate bump PR, `bump-regenerate.yml` regenerates the layers built
  from vendored sources on the bump's branch and commits them:
  - the API surfaces;
  - the zscalerctl import and config types;
  - the resolve goldens;
  - the spines and `verified.json`.

  It dispatches the required checks, since its push starts no workflows.
  Renovate leaves the branch alone after that, and the next bump comes once
  this one merges.
- A bump PR runs the full gate. A quote that no longer anchors at the new pin
  fails it: that is a real source change to re-anchor on the bump branch.
  `node scripts/kb-reanchor.mjs --base main` does this for code too. It
  compares the file at the old pin with the new, re-anchors broken `after`
  context anchors, and for a claim about one version keeps the quote and pins
  the evidence to that version (`old_version`).

  Refactored code needs a careful reviewer: a re-quote can be valid text from
  the wrong function. Review its `--json` output, edit it where it is wrong,
  and apply exactly that with `--apply <file.json>`. Re-running would ask
  the model again, and its decisions differ from run to run.
- `vendor-impact.yml` also runs on vendor PRs. Read its PR comment first: it
  contains the submodule commit logs and the pin review, whose in-change list
  is the evidence to read against its claims even when nothing is broken. The
  workflow also runs the asymmetry scan and uploads that output as an artifact.
- Monday at 13:00 UTC, `check-hygiene.yml` and `issue-watch.yml` run by cron.
  Issue watch updates the sticky `issue-watch-digest` issue with upstream
  Zscaler GitHub issue activity; an issue worth keeping is captured with
  `issue_capture.py` (see Contributing), after which the refresh tracks it.
- Monday at 13:20 UTC, `maintenance-digest.yml` updates the sticky
  `maintenance-digest` issue.
- Bump PRs do not merge themselves; `renovate.json` has no automerge setting.
  Review the checks and the vendor-impact comment, then merge manually.

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
changes into the claims that cite them.

## Contributing

- Knowledge is JSON subjects under `references/<product>/`, one subject per file, validated against
  `references/_meta/schema/` (the layout is `docs/kb-layout.md`). A Tier A claim quotes its source; a Tier B
  claim states its `conditions`. `node scripts/kb.mjs validate` anchors every quote and pointer.
- Every part of a Tier A statement must be readable in its quotes. The claim audit rejects most often:
  an absence ("the module creates no X") with no line saying so; a count or list the quotes do not contain;
  "create and update" where only create is quoted; a comparison with another claim; a version shown only by
  `HEAD` (pin evidence `at` the release tag when the version matters); and a template or module named in the
  statement ("the Starter template's role") when no quoted line names it, since the file path alone does not.
- What no source settles is a gap, not a hedge in prose. Resolving one: set `status: resolved` and write a
  `resolution` that names the claim that settles it; keep its `former_ids`, so old IDs still resolve.
- What a team has observed but no public source states (an incident finding, a support answer) is company
  knowledge: it goes in the overlay as a record ([`data-contract/knowledge.md`](data-contract/knowledge.md)),
  never into the public graph.
- A vendor GitHub issue that bears on documented behavior (a known defect, a request answered with a
  release) is captured with `python3 scripts/issue_capture.py capture <url>` and cited like a help page:
  quote what it reports, and pin the state the claim rests on with a pointer to `/source` and `expect`
  (`{"state": "open"}`). A statement about who replied needs the comment heading quoted (`## Comment
  (MEMBER, <date>)`, which `issue_capture.py text` prints) and any signature it names. The weekly
  issue-watch digest lists the candidates; capture only what you cite.
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
