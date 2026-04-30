# `_data/incidents/` — incident artifacts and post-mortems

Structured location for incident-investigation artifacts. Captures what happened, what we did, and what changed because of it. The kit dogfoods its own discipline — when something breaks (CI silently failing, schema drift across a Renovate bump, a deployment regression, a tenant-side operational issue), the resulting artifact lives here under the same standards we apply to Zscaler-tenant investigations.

Lives under `_data/` (rather than `references/_meta/`) because incidents typically contain context-specific data — real CI logs, real timestamps, real commit hashes, sometimes tenant identifiers. The `_data/` private-by-default posture is the right home; engineers commit kit-internal incidents that have no sensitive data, and add `.gitignore` rules for tenant-side incident dirs that need full privacy.

## Per-incident structure

Each incident gets its own directory: `<YYYY-MM-DD>-<short-slug>/`. The slug is descriptive enough to recognize from a directory listing six months later.

```
2026-04-30-ci-silent-failures/
├── journal.md       — the discovery journal from /z-investigate
├── timeline.md      — chronological order of events
├── postmortem.md    — root cause, lessons, what changed, follow-ups
└── evidence/            — raw artifacts (CI logs, command output, screenshots)
    └── <files>      — gitignored per the policy below; .gitkeep preserves the dir
```

## File-by-file conventions

### `journal.md`

Generated from `/z-investigate <framing>` and the subsequent triage. Follows the discovery-journal format from [`../../references/shared/troubleshooting-methodology.md`](../../references/shared/troubleshooting-methodology.md): claims with sources, status, timestamps. Confidence-tiered status enums (`Open (likely)` / `Confirmed (medium)` / `Ruled out` / `Stale` / `Resolved`).

Capture the journal **as it was during the investigation**, not a cleaned-up retrospective. The reasoning trail matters more than the final answer; readers want to see how hypotheses were prioritized and ruled out.

### `timeline.md`

Chronological. ISO-8601 timestamps. One line per event. Includes detection time, hypotheses, fix attempts, verification, follow-ups. Short — a glance gives the shape.

### `postmortem.md`

Written **after** the dust settles, not during. Sections:

- **Summary** — one paragraph; what happened, what was the impact, what changed
- **Root cause** — confirmed cause(s); cite the journal claims that established them
- **Why it wasn't caught earlier** — the systemic angle; what was the silent gap?
- **What changed** — every concrete kit edit attributable to this incident, with commit refs
- **Lessons** — generalized takeaways usable for future investigations
- **Follow-ups** — open work spawned by this; cross-link to `IMPROVEMENTS.md` entries

Keep it blameless and brief. The artifact's purpose is institutional memory, not narrative.

### `evidence/`

Raw artifacts that the journal cites — CI run logs, command output, screenshots, API response dumps, snapshot captures, packet traces. **Gitignored by default**: `_data/incidents/*/evidence/*` is in `.gitignore` (with `.gitkeep` preserved so the directory survives). Engineers can choose to commit specific files by adding `!` overrides per-file when the content is safe to publish.

The journal/evidence relationship matters: **journal claims cite evidence files; the evidence is what makes the claims falsifiable.** A claim like "InternalReason field shows CONNECTOR_UNHEALTHY (12 sessions)" cites `evidence/lss-connector-unhealthy-2026-04-30T14-30Z.json` — the raw query result. Future readers can verify the claim against the source.

Why gitignored by default: raw artifacts often contain things — IPs, hostnames, user IDs, full timestamps with context — that would be redacted in the journal/timeline/postmortem but appear unredacted in the source. Default-private avoids the "we forgot to scrub one file" failure mode.

## Privacy posture

Three categories:

| Content | Default | Override |
|---|---|---|
| Kit-internal incident artifacts (no tenant data — e.g., today's CI silent-failure incident) | **Tracked publicly** | Add `.gitignore` rule per-incident if you change your mind |
| Tenant-side incident artifacts (Zscaler operational issues with real tenant identifiers) | **Tracked, but redact tenant-specifics** OR add to `.gitignore` to keep fully private | Per fork policy |
| `evidence/` raw artifacts | **Gitignored** | Add `!` override per-file when safe |

The README itself is always tracked — it documents the convention.

## Naming and indexing

- Directory names use ISO date prefix for chronological sort
- Slugs are kebab-case, descriptive enough to scan
- Cross-link incidents from related references when the lessons are load-bearing for future readers (e.g., a CI incident that informs the discipline in [`../../references/_meta/charter.md`](../../references/_meta/charter.md) § 6 should get a back-link there)

## Canonical example

[`2026-04-30-ci-silent-failures/`](./2026-04-30-ci-silent-failures/) — the first incident captured under this convention. Use as a template for future incidents.

## How investigations land here

Every `/z-investigate` invocation saves a `journal.md` in this directory by default — the playbook's First Response procedure persists the journal at first render and updates it in place as the investigation progresses. `_data/incidents/` is the kit's umbrella home for any saved investigation artifact; the name reflects that incidents are the most common shape, not that every saved investigation must be one.

**Routine flow (most investigations):**

1. Engineer or agent runs `/z-investigate <framing>`
2. Agent picks a slug (`<YYYY-MM-DD>-<short-descriptive-slug>`) and writes `journal.md` at first response
3. Subsequent turns update `journal.md` in place — claims promote/dismiss, statuses change
4. When the investigation closes (resolved, parked, or escalated), the journal is the saved artifact

For **exploratory investigations** that aren't incidents, only `journal.md` exists in the directory — that's the expected and correct shape. Don't author timeline / postmortem for a "how does X work?" exploration.

**Incident flow (production break, regression, hygiene failure):**

1–4 as above, plus:
5. Author `timeline.md` from commit history + chat record
6. Author `postmortem.md` within ~24h while context is fresh
7. Capture cited raw artifacts under `evidence/` (gitignored by default)
8. `IMPROVEMENTS.md` gets follow-up entries for any deferred work

Privacy is unchanged across both flows: `_data/incidents/*` is gitignored by default, so journals stay local until the engineer explicitly opts in to publish.

## Cross-links

- [`../../references/_meta/charter.md`](../../references/_meta/charter.md) § 6 (Workflow discipline — including self-maintenance via `/z-investigate`)
- [`../../references/shared/troubleshooting-methodology.md`](../../references/shared/troubleshooting-methodology.md) — discovery journal format
- [`../../references/shared/audit-methodology.md`](../../references/shared/audit-methodology.md) — register format if a post-incident audit is warranted
- [`../../IMPROVEMENTS.md`](../../IMPROVEMENTS.md) — kit-level backlog where follow-ups land
- [`../README.md`](../README.md) — `_data/` directory convention overview
