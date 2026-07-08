# Maintenance

This page collects repo upkeep that does not need to sit in the root README.

## Automation

`.github/workflows/check-hygiene.yml` runs `scripts/check-hygiene.py` on every
PR touching `references/`, `references/_meta/evals/`, or the script itself,
plus on the weekly hygiene cadence. Errors fail CI; warnings are advisory. This
catches frontmatter drift, broken anchors, eval-doc desync, and
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

## Weekly upstream refresh (automated)

Most weeks, a maintainer does not need to start the upstream bump by hand.

- Renovate watches git submodules, groups them as `Zscaler upstream submodules`,
  labels the PR `upstream-bump`, and runs before 9am UTC Monday. All vendor
  submodules in `.gitmodules` (currently 20) ride the same grouped PR.
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
- The bump PR does not merge itself; `renovate.json` has no automerge setting.
  Review the checks and the vendor-impact comment, then merge manually.
- Upstream doc changes are threaded into the references by weekly doc-threading
  PRs; PR #198 / commit `9673804` is the current example.

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

## Contributing

- Reference files start as `author-status: stub` with TODO headings. Pick one,
  fill it in, bump to `draft`, and add sources.
- Keep hand-authored reasoning (`content-type: reasoning`) separate from
  reproduced or paraphrased API docs (`content-type: reference`). The
  distinction matters for later training use.
- When you change Zscaler behavior docs, update `last-verified` to the date you
  performed the verification.
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

- **Malware Protection and ATP blocks have no API coverage.**
  `references/zia/malware-and-atp.md` covers the operational and console-only
  layer; diagnosis of specific blocks still requires the ZIA Admin Console.
- **Credentialed live-tenant diagnostics are out of scope.** Tenant reads are
  handled by the read-only `zscalerctl` CLI; the never-validated SDK diagnostic
  scaffolds were removed (2026-06), as were the SDK snapshot / lookup / simulator
  scripts. Tenant config is mounted into `_data/snapshot/` out of band (private
  overlay or `zscalerctl` dump); the references reason over it.
- **Several clarifications remain open** because they require tenant-specific
  lab tests. See `PLAN.md`.
- **Snapshot schema docs are deferred** and should be written against real
  tenant output, not inferred pre-fork.
- **Z-Tunnel wire-format internals are not customer-documented.**
  `references/zcc/z-tunnel.md` covers the operational layer. Protocol-level
  questions remain Zscaler Support territory.
- **Tier 2 has programmable but shallow coverage.** ZBI and ZWA have documented
  product behavior and programmable surface, but thinner operational depth than
  Tier 1 policy and traffic-control planes.
- **Tier 3 has reasoning coverage, no verified API surface.** Deception,
  Risk360, AI Security family, ZMS, ZSDK, ITDR / Identity Protection, DSPM,
  AEM, UVM, Zscaler Cellular, SOC Workbench, Breach Predictor, Business
  Insights, Zero Trust Branch, and Experience Center / unified topics can be
  answered conceptually, but the skill must avoid inventing SDK, Terraform, or
  API behavior.
- **Tier 4 has paragraph-level awareness only.** The skill can route these
  topics, answer breadth questions, and redirect to Zscaler's help site, but
  will not claim operational depth.
