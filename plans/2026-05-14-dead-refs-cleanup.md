# Dead refs and cleanup sweep - 2026-05-14

## Purpose

Capture the broad repo sweep for dead references, stale names, and cleanup gaps.
Use this as the working plan for mechanical cleanup first, then content-bearing
updates after review.

## Mechanical checks run

- `./scripts/check-hygiene.py`
- `bash scripts/check-citations.sh`
- `./scripts/check-staleness.sh`
- `python3 scripts/check-orphans.py`
- `python3 scripts/check-doc-links.py`
- `./scripts/check-workflow-evals.py`
- `git diff --check`

## Baseline result

All checks passed except the known `check-hygiene.py` eval-coverage warning:

- 74 `confidence: high` refs lack eval coverage.

No stale `bundles.md`, `routes/`, `kit`, or workflow-specific old bundle
terminology was found in the current sweep.

## Findings

### High

1. Presentation docs still use old slash command names.
   - `docs/skill-overview.html` uses `/z-investigate` and `/z-audit`.
   - Current commands are `/z-investigator` and `/z-auditor`.
   - Mechanical fix.

2. User-facing tier taxonomy is stale.
   - `README.md` still describes `Tier 2a` / `Tier 2b`.
   - Canonical taxonomy in `references/_meta/portfolio-map.md` is flat Tier 1-5.
   - Content-bearing fix; do after the mechanical pass.

3. Onboarding deck has stale portfolio classification.
   - `docs/onboarding.html` still treats ZBI/ZWA as T1 and uses T2a/T2b language.
   - Canonical portfolio map now classifies ZBI/ZWA as Tier 2.
   - Content-bearing fix; do after the mechanical pass.

### Medium

4. The case artifact convention doc linked to old methodology paths.
   - `references/shared/troubleshooting-methodology.md` no longer exists.
   - `references/shared/audit-methodology.md` no longer exists.
   - Current files are `agents/investigator/methodology.md` and
     `agents/auditor/methodology.md`.
   - Mechanical fix.

5. Clarification examples use a bad `.clarifications.md` path.
   - `references/_meta/template.md`
   - `references/_meta/clarifications.md`
   - Mechanical fix to `clarifications.md#...`.

### Low

6. Several prose/example references use old prompt filenames.
   - Examples include `soc-prompt.md`, `investigate-prompt.md`, and
     `audit-prompt.md`.
   - Current canonical files are `agents/<role>/prompt.md`.
   - Mechanical fix where the reference is not historical context.

7. Windsurf runtime notes list old adapter names.
   - `z-audit.md` should be `z-auditor.md`.
   - Mechanical fix.

8. `docs/skill-overview.html` still says `audit-prompt.md` in a UI label.
   - Mechanical fix.

## Cleanup order

1. Apply mechanical path/name fixes. **Done 2026-05-14.**
2. Re-run the targeted stale-name scan and mechanical checks. **Done 2026-05-14.**
3. Separately update `README.md` tier taxonomy to match the portfolio map.
4. Separately update `docs/onboarding.html` product/tier slide to match the
   portfolio map.
5. Decide whether the eval-coverage warning needs a dedicated plan.

## Mechanical cleanup applied

- Fixed stale `/z-investigate` and `/z-audit` presentation labels to
  `/z-investigator` and `/z-auditor`.
- Fixed the case artifact convention links to point at
  `agents/investigator/methodology.md` and `agents/auditor/methodology.md`.
- Fixed clarification example anchors to real `clarifications.md#...` targets.
- Replaced old prompt-file examples (`investigate-prompt.md`,
  `audit-prompt.md`, `soc-prompt.md`) with canonical `agents/<role>/prompt.md`
  references where they were not historical context.
- Fixed Windsurf runtime note adapter filenames from `z-audit.md` to
  `z-auditor.md`.

## Verification after mechanical cleanup

- `./scripts/check-hygiene.py`: pass, with existing eval-coverage warning.
- `bash scripts/check-citations.sh`: pass.
- `python3 scripts/check-doc-links.py`: pass.
- `git diff --check`: pass.
- Targeted stale-name scan for old command/prompt/methodology names: clean.
- Tracked Markdown local-link sweep: clean.
