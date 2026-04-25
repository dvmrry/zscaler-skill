---
product: shared
topic: "log-correlation"
title: "When and how to consult logs"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "references/zia/logs/web-log-schema.md"
  - "references/zia/logs/firewall-log-schema.md"
  - "references/zia/logs/dns-log-schema.md"
  - "references/zpa/logs/access-log-schema.md"
  - "references/shared/splunk-queries.md"
author-status: draft
---

# When and how to consult logs

Logs are a **validation layer**, not a primary source. Config (snapshot/ + reference docs) answers first. Logs come in when the config answer is doubted, ambiguous, or the question is inherently observational.

## Default order of operations

1. **Config answer first.** For any question, derive the expected answer from `snapshot/` config + `references/` reasoning docs. State it with Confidence appropriate to the source.
2. **Validate with logs only when triggered** (see below). Cite the log source and the query used.
3. **Report drift explicitly.** If logs contradict config, that's the high-signal finding — say so plainly.

## When to query logs

Consult logs when **any** of:

- **User pushes back on the config answer.** They often know something the config doesn't show.
- **Config answer is ambiguous.** Multiple rules could match; a wildcard could be interpreted more than one way; a segment could be owned by more than one policy.
- **Question is inherently observational.** "When did this start breaking?", "how many X per day?", "who's been hitting Y?" — config can't answer these.
- **You suspect config/reality drift.** Stale deployments, activation lag, upstream migrations — logs are the ground truth.

## When NOT to query logs

- **Pure semantic questions.** "How do wildcards match?" is answered from reasoning docs, not from observing. Logs add noise.
- **Fresh config changes.** A rule activated five minutes ago hasn't logged enough to be useful; go by config.
- **When the config answer is clear and the user hasn't pushed back.** Logs cost latency and compute — don't burn either for no reason.

## When the skill recommends a log query vs answers from config

The skill is document-only and never auto-executes log queries. The loop is:

1. **Answer from config first** — `references/` + `snapshot/` produces the deterministic answer. State it with Confidence appropriate to the source.
2. **Emit SPL for validation** — when the question would benefit from log confirmation, produce a ready-to-run snippet citing the SPL pattern by name (`see references/shared/splunk-queries.md § url-coverage-check`). The operator pastes it into their SIEM or runs `scripts/splunk-query.sh <pattern-name> <args>`.
3. **Never pre-emptively run the query.** Log-query latency varies wildly (seconds to minutes depending on index hotness and time range), and tenant query budgets are finite. The operator decides whether the validation cost is worth paying — the skill's job is to produce the right query, not to run it.

Exception: when a harness explicitly wires in live log-query capability (e.g., a fork adds an MCP server for Splunk), the skill still defaults to config-first answers but may include log validation in a single turn. That's a per-fork decision, not the skill's default. See [`shared-02`](../_clarifications.md#shared-02-log-query-latency-budget) for the rationale.

## Citation shape when logs are used

In the `Sources` section of an answer:

```markdown
## Sources
- references/zia/url-filtering.md (§ Rule precedence)
- snapshot/zia/url-filtering-rules.json (rule 42)
- logs: ZIA web, last 30d, 127 records matched — see queries: references/shared/splunk-queries.md § "url-coverage-check"
```

Always name the SPL pattern by its section in `splunk-queries.md` rather than inlining the whole query — keeps answers readable and the query catalog reusable.

## Open questions

- Behavior when the user has no log access (e.g., empty `snapshot/`, no Splunk credentials) — answer should fall back to config-only with explicit limitation stated; see SKILL.md's "When to decline" section.

## Cross-links

- SPL patterns — [`./splunk-queries.md`](./splunk-queries.md)
- ZIA log schemas — [`../zia/logs/`](../zia/logs/)
- ZPA log schema — [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md)
