---
product: shared
topic: "command-routing"
title: "Command routing — which slash command for which framing"
content-type: reference
last-verified: "2026-04-30"
confidence: high
sources: []
author-status: draft
---

# Command routing — which slash command for which framing

Canonical rubric for choosing among the kit's four agent personas. The same rubric is used by:

- The CC `/z` router slash command (front-door classification of fresh framings)
- Each playbook's "Fit check" sub-step (catches misaligned `/z-<persona>` invocations)
- Each Windsurf workflow's pre-load fit-check (the reliably-visible surface on Windsurf, since workflow files are always fully loaded but playbooks may be lazy-loaded)
- Engineers reading the kit who need to pick a command

The fit-checks in playbooks and workflows compress this rubric to ~10 lines for weak-model reliability; this file is the long-form version with examples and edge cases.

## The four personas — one-line each

| Command | Question it answers | Output artifact |
|---|---|---|
| `/z-investigate` | Why is **this specific thing** broken? | Discovery journal (`journal.md`) |
| `/z-audit` | Is this consistent and well-formed? | Audit register |
| `/z-architect` | Will this scale? | Recommendation register |
| `/z-soc` | Is this defensible? | Posture register (`posture.md`) |

The personas are **disjoint by intent**, even though they share the same register format and discipline. A given framing should map to exactly one in most cases; ambiguity is a signal to ask the user.

## Framing shapes

### `/z-investigate` — symptom + scope + (ideally) adjacent successes

Signature shape: **something is failing now, and we want to know why.** A good investigation framing has:

- **Symptom** — what's not working: "ssh.dev.azure.com:22 fails", "Salesforce SSO loops", "users in EMEA can't reach Salesforce"
- **Scope** — who / where / when: "for one user in Frankfurt", "since 14:00 UTC", "all users on connector group us-east-1"
- **What works** (adjacent successes that narrow hypotheses) — "port 443 to same destination still works", "other locations unaffected"

Example framings that fit:

- `/z-investigate ssh.dev.azure.com:22 fails for users in Frankfurt since 14:00 UTC; port 443 still works`
- `/z-investigate Salesforce SSO redirect loops for one user, started this morning, other SAML apps fine`
- `/z-investigate connector group us-east-1 disconnected at 14:30 UTC, no recent changes`

### `/z-audit` — lint scope (file / directory / topic / "recent")

Signature shape: **scan this collection of artifacts for consistency / hygiene / structural problems.** A good audit framing has:

- **Scope** — files, directories, "recent changes", topic keyword: `references/zia/logs/`, `references/shared/siem-log-mapping.md`, `splunk` (topic), `recent`, `.` (whole repo)
- **Optional check subset** — `confidence`, `cross-links`, `frontmatter`, etc.

Example framings that fit:

- `/z-audit references/zpa/`
- `/z-audit recent` — last N modified files
- `/z-audit splunk` — anything Splunk-related across paths
- `/z-audit . confidence` — whole repo, confidence-calibration check only

### `/z-architect` — capacity / horizon / topology

Signature shape: **plan or evaluate sizing for a given growth target.** A good architect framing has:

- **Scope** — what resource is being sized: connector group, segment, server group, PSE cluster
- **Horizon / target** — "3x growth by Q3", "double user count next year", "add EMEA region"
- **Evidence access** — config-only or config + metrics; whether LSS Connector Metrics / NSS feeds are available

Example framings that fit:

- `/z-architect App Connector Group us-east-1, planning 3x growth by Q3, Splunk has Connector Metrics`
- `/z-architect adding EMEA region — what connectors / PSE / topology do we need?`
- `/z-architect right-size PSE cluster for current load, metrics in Splunk`

### `/z-soc` — posture / threat model / control family

Signature shape: **review tenant security posture against threats.** A good SOC framing has:

- **Scope** — what's being reviewed: ZPA admin RBAC, ZIA URL filtering bypasses, telemetry coverage, a specific app segment
- **Subtype** (optional) — `policy`, `access`, `coverage`, `config`, `activity`
- **Threat model** (optional) — what adversary or scenario the review is anchored to

Example framings that fit:

- `/z-soc ZPA admin RBAC — least-privilege review`
- `/z-soc URL filtering SSL inspection bypasses, threat model: data exfil`
- `/z-soc telemetry coverage — are all expected NSS/LSS feeds arriving in Splunk?`
- `/z-soc admin activity in last 30 days, look for unusual after-hours changes`

## Marker patterns

Compressed lookup. The fit-checks in playbooks and workflows reference these; the full discussion lives in the framing-shapes section above.

| Marker words / phrases in framing | Likely persona |
|---|---|
| **Symptom** — "failing", "broken", "can't reach", "loops", "disconnected at", "since <time>", "started this morning" | `/z-investigate` |
| **Scope (lint)** — "audit references/", "check files", "review docs", paths to .md files, `recent`, "consistency", "frontmatter", "links", "orphans" | `/z-audit` |
| **Capacity** — "growth", "scale to", "Nx", "size", "headroom", "capacity", "by Q<n>", "add <region>", "right-size" | `/z-architect` |
| **Posture** — "RBAC", "least-privilege", "least-priv", "bypass exposure", "telemetry coverage", "DLP gap", "admin activity", "threat model", "control coverage", "step-up auth", "stale admins", "exposure" | `/z-soc` |

## Counter-patterns (markers suggesting wrong persona)

| If the user typed `/z-X` but framing has... | They likely meant |
|---|---|
| `/z-investigate` framing with no symptom + posture vocabulary | `/z-soc` |
| `/z-investigate` framing with no symptom + capacity vocabulary | `/z-architect` |
| `/z-investigate` framing with directory paths and "consistency" | `/z-audit` |
| `/z-audit` framing with active symptom + scope + recency | `/z-investigate` |
| `/z-audit` framing with growth horizon | `/z-architect` |
| `/z-audit` framing with RBAC / bypass / threat-model words | `/z-soc` |
| `/z-architect` framing with active symptom (failure scope) | `/z-investigate` |
| `/z-architect` framing with directory paths | `/z-audit` |
| `/z-architect` framing with posture / threat words | `/z-soc` |
| `/z-soc` framing with active symptom ("user can't reach") | `/z-investigate` |
| `/z-soc` framing with growth / capacity question | `/z-architect` |
| `/z-soc` framing with directory paths and "consistency" | `/z-audit` |

## Decision rule for fit-checks (use this exact logic)

1. **Read the framing.** Identify the dominant marker category from the table above.
2. **If the dominant marker matches the invoked persona** — proceed with the playbook.
3. **If the dominant marker matches a different persona** — output a redirect: "Your framing looks like a `<other-persona>` task: `<one-line reason citing the markers seen>`. Re-invoke as `/z-<other-persona>`?" — and **stop**. Do not proceed with the rest of the playbook. Do not load further files.
4. **If markers are mixed / ambiguous** — default to proceeding with the invoked persona, but in the first response *flag the alternative*: "Proceeding as `/z-<invoked>`. Note: framing also has `<other-persona>` markers; if `/z-<other-persona>` was intended, let me know."

The "stop on clear redirect" behavior is intentional: it prevents the agent from doing investigation work when the user clearly wanted SOC posture, etc. The "proceed with flag on ambiguous" behavior is also intentional: it avoids over-cautious refusal of borderline framings.

## Ambiguous framings — examples

These are real ambiguous cases worth thinking about:

| Framing | Tension | Recommended handling |
|---|---|---|
| "Connector group us-east-1 disconnected — should we add capacity?" | Symptom + capacity | Default: `/z-investigate` for the disconnection; flag `/z-architect` as follow-up after RCA |
| "URL filtering rule bypasses — are they working as intended?" | Posture-flavored audit | Default: `/z-soc` (subtype `policy`); audit-style consistency check is secondary |
| "Audit our admin RBAC" | Audit *or* SOC | Default: `/z-soc` (subtype `access`) — RBAC review is posture, not file lint |
| "Are our LSS feeds healthy?" | Telemetry coverage *or* investigation | Default: `/z-soc` (subtype `coverage`); switch to `/z-investigate` if a specific feed is broken right now |
| "Our connectors are slow — can we scale up?" | Symptom + capacity | Default: `/z-investigate` first (slow ≠ undersized necessarily); architect after RCA |

## Cross-links

- [`./README.md`](./README.md) — what's in `_meta/`
- [`../shared/investigate-prompt.md`](../shared/investigate-prompt.md) — `/z-investigate` playbook
- [`../shared/audit-prompt.md`](../shared/audit-prompt.md) — `/z-audit` playbook
- [`../shared/architect-prompt.md`](../shared/architect-prompt.md) — `/z-architect` playbook
- [`../shared/soc-prompt.md`](../shared/soc-prompt.md) — `/z-soc` playbook
- [`./charter.md`](./charter.md) § 5 — design-for-the-weakest-model principle
- [`../../proposals/windsurf-routing-and-fit-check.md`](../../proposals/windsurf-routing-and-fit-check.md) — the proposal that motivates this rubric
