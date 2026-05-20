# `_data/cases/` — saved investigations, reviews, and incident retros

Structured location for saved troubleshooting cases. Captures what was asked,
what we investigated, what evidence was used, and what changed because of it.
The case may be a production incident, a hygiene failure, a posture review, an
exploratory investigation, or a tenant-side operational issue. The skill
dogfoods its own discipline — durable work lives here under the same standards
we apply to Zscaler-tenant investigations.

Lives under `_data/` (rather than `references/_meta/`) because cases typically
contain context-specific data — real CI logs, real timestamps, real commit
hashes, sometimes tenant identifiers. The `_data/` private-by-default posture is
the right home; engineers commit skill-internal cases that have no sensitive
data, and add `.gitignore` rules for tenant-side case dirs that need full
privacy.

## Per-case structure

Each case gets its own directory: `<YYYY-MM-DD>-<short-slug>/`. The slug is
descriptive enough to recognize from a directory listing six months later.

```
2026-04-30-ci-silent-failures/
├── journal.md       — the discovery journal from /z-investigator
├── timeline.md      — chronological order of events
├── postmortem.md    — root cause, lessons, what changed, follow-ups
└── evidence/            — raw artifacts (CI logs, command output, screenshots)
    └── <files>      — gitignored per the policy below; .gitkeep preserves the dir
```

## File-by-file conventions

### `journal.md`

Generated from `/z-investigator <framing>` and the subsequent triage. Follows the discovery-journal format from [`../../agents/investigator/methodology.md`](../../agents/investigator/methodology.md): claims with sources, status, timestamps. Confidence-tiered status enums (`Open (likely)` / `Confirmed (medium)` / `Ruled out` / `Stale` / `Resolved`).

Capture the journal **as it was during the investigation**, not a cleaned-up retrospective. The reasoning trail matters more than the final answer; readers want to see how hypotheses were prioritized and ruled out.

### `timeline.md`

Chronological. ISO-8601 timestamps. One line per event. Includes detection time, hypotheses, fix attempts, verification, follow-ups. Short — a glance gives the shape.

### `postmortem.md`

Written **after** the dust settles, not during. The postmortem / retro is not a standalone narrative — it is a conclusion layer over `journal.md`. Every causal claim, decision point, and warning disposition in the postmortem should trace back to a journal claim, timeline entry, or evidence-manifest row. If the journal contained material warnings, the retro must explicitly say how each warning was resolved, accepted, deferred, or ruled out before recommending further forward motion. Use [`../../agents/retro/prompt.md`](../../agents/retro/prompt.md) / [`../../agents/retro/methodology.md`](../../agents/retro/methodology.md) as the executable workflow for writing or reviewing this file.

Sections:

- **Summary** — one paragraph; what happened, what was the impact, what changed
- **Evidence map** — journal, timeline, evidence manifest, related commits, and PRs that support the retro
- **Root cause** — confirmed cause(s); cite the journal claims that established them
- **Warnings and decision gates** — material warnings raised during the journal, their disposition, and why it was safe to proceed or why work stopped
- **Why it wasn't caught earlier** — the systemic angle; what was the silent gap?
- **What changed** — every concrete edit attributable to this incident, with commit refs
- **Lessons** — generalized takeaways usable for future investigations
- **Follow-ups** — open work spawned by this; cross-link to `IMPROVEMENTS.md` entries

Keep it blameless and brief. The artifact's purpose is institutional memory, not narrative. A retro that cannot cite the journal is incomplete; a retro that ignores unresolved warnings is not a basis for pushing forward.

### `evidence/`

Raw artifacts that the journal cites — CI run logs, command output, screenshots, API response dumps, snapshot captures, packet traces. **Ignored by default**: `_data/` is in `.gitignore`. Engineers can choose to commit specific case directories and evidence files by adding explicit `!` overrides when the content is safe to publish.

The journal/evidence relationship matters: **journal claims cite evidence files; the evidence is what makes the claims falsifiable.** A claim like "InternalReason field shows CONNECTOR_UNHEALTHY (12 sessions)" cites `evidence/lss-connector-unhealthy-2026-04-30T14-30Z.json` — the raw query result. Future readers can verify the claim against the source.

Why gitignored by default: raw artifacts often contain things — IPs, hostnames, user IDs, full timestamps with context — that would be redacted in the journal/timeline/postmortem but appear unredacted in the source. Default-private avoids the "we forgot to scrub one file" failure mode.

#### Evidence file naming

SIEM exports default to opaque filenames — Splunk's CSV download names look like `splunk_search_results_2026-04-30_14-30-15.csv`, with no clue to the query that produced them. The exported file usually doesn't carry the query inside it either. Once the file lands on disk, context is lost.

**At save time, rename to `<source>-<topic>-<YYYY-MM-DDTHH-MMZ>.<ext>`.** The pattern:

- `<source>` — `splunk`, `sentinel`, `elastic`, `sumo`, `zpa-api`, `zia-api`, `zdx-api`, `zcc-api`, `cli`, `screenshot`
- `<topic>` — short kebab-case descriptor of what was queried: `lss-connector-health`, `web-log-rule-hit`, `connector-groups-list`
- ISO 8601 UTC timestamp with hyphens for filesystem safety (`:` is not portable in filenames)

Examples:

- `splunk-lss-connector-health-2026-04-30T14-30Z.csv`
- `zpa-api-connector-groups-2026-04-30T14-32Z.json`
- `sentinel-zia-rule-hits-2026-04-30T14-45Z.csv`
- `screenshot-portal-segment-config-2026-04-30T15-00Z.png`

#### `evidence/MANIFEST.md`

Because the rename alone doesn't carry the query, every evidence directory
should have a `MANIFEST.md` that captures the source query/request, digest, and
what each file is. The agent writes a row at save time; future readers (human
or agent) read the manifest first when entering the directory.

Format — markdown table, append-only:

```markdown
# evidence/ manifest

Each row: one evidence file, its source query/request, digest, summary, and
touched claim. Append at save; never silently overwrite.

| Evidence Ref | Source | Captured At | Source File Hash | Query/Request Ref | Summary | Touched Claims |
|---|---|---|---|---|---|---|
| `_data/cases/example/evidence/splunk-lss-connector-health-20260430T143000Z.csv` | Splunk | 2026-04-30T14:30:00Z | `<sha256>` | `index=$INDEX_ZPA sourcetype=zpa-lss-userstatus earliest=-2h \| stats count by ConnectionStatus, ConnectorID` | Connector health status counts for the incident window. | H1: Connector group is unhealthy |
| `_data/cases/example/evidence/zpa-api-connector-groups-20260430T143200Z.json` | ZPA API | 2026-04-30T14:32:00Z | `<sha256>` | `GET /mgmtconfig/v1/admin/customers/{customerId}/appConnectorGroup` | Full list of App Connector Groups. | H2: App Connector Group assignment changed |
```

The query/request ref and summary columns are load-bearing — they let a future
reader (or the agent in a later turn) understand what the file represents.
Empty query/request ref = opaque file. If the user pastes results into chat
without the query or request, the agent should ask for or reconstruct it before
saving.

When the agent saves an evidence file, it does both: write the file with the
renamed path and append a row to `MANIFEST.md`. When
`scripts/investigator-artifacts.mjs capabilities` reports `import-evidence`,
use that helper for the copy/hash/manifest step. When the agent reads
`evidence/`, it reads `MANIFEST.md` first.

## Privacy posture

The public repo default is private: `_data/cases/*` is ignored unless a fork or
branch explicitly opts a case back in. Three categories:

| Content | Default | Override |
|---|---|---|
| Skill-internal case artifacts with no tenant data | **Ignored by default** | Add `!` overrides for the case directory and safe files |
| Tenant-side case artifacts with real tenant identifiers | **Ignored by default** | Internal fork policy decides whether to commit redacted journals, full private journals, or nothing |
| `evidence/` raw artifacts | **Ignored by default** | Add parent-directory and per-file `!` overrides only when safe |

This public contract document is tracked; runtime `_data/cases/` content is
not.

Git re-include rules must reopen every ignored parent before a file can be
tracked. A safe public example looks like:

```gitignore
!_data/cases/2026-04-30-ci-silent-failures/
!_data/cases/2026-04-30-ci-silent-failures/journal.md
!_data/cases/2026-04-30-ci-silent-failures/timeline.md
```

If publishing selected evidence, also reopen `evidence/` before the file:

```gitignore
!_data/cases/2026-04-30-ci-silent-failures/evidence/
!_data/cases/2026-04-30-ci-silent-failures/evidence/MANIFEST.md
```

## Naming and indexing

- Directory names use ISO date prefix for chronological sort
- Slugs are kebab-case, descriptive enough to scan
- Cross-link cases from related references when the lessons are load-bearing for future readers (e.g., a CI case that surfaces a workflow-discipline gap should get a back-link from the relevant methodology / playbook doc)

## Case examples

Case directories are ignored by default, so this public contract does not link
to a canonical tracked example. If a fork publishes a safe example case, link it
from this section and use it as the local template for future cases.

## How investigations land here

Every `/z-investigator` invocation saves a `journal.md` in this directory by default — the playbook's First Response procedure persists the journal at first render and updates it in place as the investigation progresses. `_data/cases/` is the skill's umbrella home for any saved investigation artifact.

**Routine flow (most investigations):**

1. Engineer or agent runs `/z-investigator <framing>`
2. Agent picks a slug (`<YYYY-MM-DD>-<short-descriptive-slug>`) and writes `journal.md` at first response
3. Subsequent turns update `journal.md` in place — claims promote/dismiss, statuses change
4. When the investigation closes (resolved, parked, or escalated), the journal is the saved artifact

For **exploratory investigations** that aren't incidents, only `journal.md` exists in the directory — that's the expected and correct shape. Don't author timeline / postmortem for a "how does X work?" exploration.

**Incident flow (production break, regression, hygiene failure):**

1–4 as above, plus:
5. Author `timeline.md` from commit history + chat record
6. Re-read `journal.md` and list every material warning / unresolved claim before drafting the retro
7. Author `postmortem.md` within ~24h while context is fresh; tie each conclusion and warning disposition back to the journal
8. Capture cited raw artifacts under `evidence/` (gitignored by default)
9. `IMPROVEMENTS.md` gets follow-up entries for any deferred work

Privacy is unchanged across both flows: `_data/cases/*` is gitignored by default, so journals stay local until the engineer explicitly opts in to publish.

## Cross-links

- [`../../agents/investigator/methodology.md`](../../agents/investigator/methodology.md) — discovery journal format
- [`../../agents/retro/prompt.md`](../../agents/retro/prompt.md) and [`../../agents/retro/methodology.md`](../../agents/retro/methodology.md) — journal-first postmortem workflow
- [`../../agents/auditor/methodology.md`](../../agents/auditor/methodology.md) — register format if a post-incident audit is warranted
- [`../../IMPROVEMENTS.md`](../../IMPROVEMENTS.md) — skill-level backlog where follow-ups land
- [`./README.md`](./README.md) — `_data/` directory convention overview
