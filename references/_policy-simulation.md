---
product: shared
topic: "policy-simulation"
title: "Policy simulation — predict rule evaluation without sending traffic"
content-type: reasoning
last-verified: "2026-04-25"
confidence: medium
source-tier: code
sources:
  - "scripts/policy_simulator.py"
  - "scripts/simulate-policy.py"
  - "references/zia/url-filtering.md"
  - "references/zia/wildcard-semantics.md"
author-status: draft
---

# Policy simulation — predict rule evaluation without sending traffic

A pure-function simulator over a tenant's snapshotted URL filter rules + categories. Given a request description (URL, user, location, etc.), predicts which rule fires and why — without actually sending traffic through Zscaler.

**Confidence: medium** — the simulator encodes the documented rule-evaluation semantics (rule order, first-match-wins, disabled-rule-holds-slot, criteria filtering, basic category match) but **does NOT yet model the full specificity-wins-across-custom-categories pattern matching, the two-pass URL filter under SSL inspection, or DLP/Sandbox/CAC interactions**. Use it for first-pass "would this URL be blocked?" intuition; verify against logs once they're available.

## Scope (initial)

The simulator covers **ZIA URL Filtering** specifically:

- ✅ Rule order + first-match-wins
- ✅ Disabled-rule-holds-slot (rules can be disabled but still occupy their order slot; conservative model: continue iteration past disabled rules — see Gaps)
- ✅ Criteria filtering — locations, location groups, departments, user groups, users, device category, source IP (basic exact-match)
- ✅ URL → category resolution with leading-period wildcard semantics + 5-level depth cap (per `references/zia/wildcard-semantics.md`)
- ✅ Default fall-through (no rule matched → DEFAULT_ALLOW)
- ✅ "What-if" mode — include disabled rules in matching for change-validation use

What's **NOT yet modeled** (gaps):

- ❌ **Cloud App Control (CAC)** — separate evaluation surface. CAC rules evaluate before URL Filtering at both SNI and full-URL passes. Modeling them requires a parallel rule set + interaction logic.
- ❌ **DLP / Sandbox / Malware Protection / ATP** — different policy layers; would need their own simulators.
- ❌ **SSL inspection two-pass model** — URL Filtering evaluates twice on inspected HTTPS (pre-decrypt SNI pass + post-decrypt full-URL pass); the simulator runs once. SSL bypass status is captured in `URLFilterRequest.is_https_decrypted` for future use.
- ❌ **Specificity-wins-across-custom-categories with full path/keyword matching** — current implementation matches on the host portion only. A URL like `https://wiki.example.com/internal/secret` matches a category entry of `wiki.example.com` but doesn't model path-based or keyword-based category entries. The specificity tiebreak across categories uses a simple length heuristic; a full engine would need wildcard expansion + per-category rule precedence.
- ❌ **Forwarding control / SIPA routing** — pre-URL-filter routing decisions aren't simulated.
- ❌ **Time-of-day criteria** — rules can have time interval criteria; the simulator surfaces them in trace but doesn't fully evaluate against the request's `time` field.
- ❌ **Tenant default rule** — when `state.advanced_settings.dynamic_user_risk_enabled = true` or `block_internet_until_accepted_terms`, default behavior changes. The simulator returns DEFAULT_ALLOW unconditionally.
- ❌ **CIDR matching for source IPs** — current logic is exact-match.

These gaps don't make the simulator useless — they make it **conservative**. False negatives (the simulator says no rule matches when one would) are more likely than false positives.

## Inputs and outputs

```python
@dataclass
class URLFilterRequest:
    url: str
    user_email: str | None = None
    user_groups: list[str] = []
    department: str | None = None
    location: str | None = None
    location_groups: list[str] = []
    device_category: str | None = None
    source_ip: str | None = None
    time: datetime | None = None
    is_https_decrypted: bool | None = None   # reserved for two-pass model

@dataclass
class SimulationResult:
    matched_rule_id: int | None        # None → fall-through to default
    matched_rule_name: str | None
    action: str                         # ALLOW | BLOCK | CAUTION | ISOLATE | DEFAULT_ALLOW
    matched_url_category: str | None
    trace: list[TraceStep]              # full evaluation trace per rule
    request: URLFilterRequest
```

Each `TraceStep` records `(rule_id, rule_name, decision, note)` where `decision ∈ {matched, skipped:disabled, skipped:criteria, skipped:no-category-match}`. The trace is the value of the simulator — it shows *why* a rule matched or didn't, not just the final answer.

## Worked example

Given the rule set below (taken from a typical tenant snapshot):

```
Rule #1: Block evil.example.com           [BLOCK, category=CUSTOM_BLOCK, enabled]
Rule #2: Allow wiki for engineering        [ALLOW, category=CUSTOM_ALLOW, dept=engineering]
Rule #3: Block social networking           [BLOCK, category=SOCIAL_NETWORKING, DISABLED]
Rule #4: Allow social                      [ALLOW, category=SOCIAL_NETWORKING, enabled]
```

| Request | Result | Trace summary |
|---|---|---|
| `https://evil.example.com/path` | rule #1 BLOCK | matched on rule #1; CUSTOM_BLOCK category |
| `https://foo.badnews.example.com` | rule #1 BLOCK | leading-period wildcard `.badnews.example.com` matched; CUSTOM_BLOCK |
| `https://wiki.example.com` (engineering) | rule #2 ALLOW | criteria match (dept=engineering); CUSTOM_ALLOW |
| `https://wiki.example.com` (sales) | DEFAULT_ALLOW | rule #2 skipped (department mismatch); no other rule applies |
| `https://www.reddit.com` (default mode) | rule #4 ALLOW | rule #3 skipped:disabled (holds slot); rule #4 matched |
| `https://www.reddit.com` (`--include-disabled`) | rule #3 BLOCK | "what-if" mode; disabled rule fires |

The last two rows are the same request, different mode — useful for change validation: "if I re-enabled rule #3, what would happen to reddit traffic?"

## Use as a library

```python
from policy_simulator import simulate_url_filter, URLFilterRequest

req = URLFilterRequest(url="https://wiki.example.com", department="engineering")
result = simulate_url_filter(req, rules_snapshot, categories_snapshot)
print(result.summary())
# → "https://wiki.example.com → rule #2 'Allow Wiki for Engineering' action=ALLOW category='CUSTOM_ALLOW'"
```

## Use as a CLI

```bash
./scripts/simulate-policy.py --url https://www.reddit.com
./scripts/simulate-policy.py --url https://wiki.example.com --department engineering
./scripts/simulate-policy.py --url https://x.com --include-disabled    # what-if
./scripts/simulate-policy.py --url https://x.com --json                 # machine output
```

Requires `snapshot/zia/url-filtering-rules.json` + `snapshot/zia/url-categories.json`. Run `./scripts/snapshot-refresh.py --zia-only` first.

## Change validation

Two-call pattern for "what would changing this rule do?":

```python
before = simulate_url_filter(request, rules, categories)
# Mutate the rule set in memory (or load a proposed-state snapshot)
rules_after = [...modified rules...]
after = simulate_url_filter(request, rules_after, categories)

diff = diff_simulations(before, after)
# {'url': ..., 'rule_changed': True/False, 'action_changed': True/False, ...}
```

For a meaningful change-validation harness, run the simulator against a representative set of test URLs before AND after the proposed change; surface only the diffs. That's the natural extension when the simulator gets validated against real log data — the test URLs become a regression suite.

## When to use the simulator vs. logs

The simulator answers **"what should happen?"** based on the documented evaluation logic. Logs answer **"what actually happened?"** based on real traffic. Use both:

| Question | Simulator | Logs |
|---|---|---|
| "Would this URL be blocked?" (no log evidence yet) | ✅ Predict | ❌ No data |
| "Why did this URL get blocked?" (log shows it did) | ✅ Trace shows the matching rule | ✅ Logs confirm |
| "What would changing this rule do?" | ✅ Run before/after diff | ❌ Can't query future traffic |
| "Is the simulator accurate?" | — | ✅ Compare predictions to logs |

Once log data is available (per the `references/shared/log-correlation.md` decision rule), the simulator can be validated against it. Discrepancies become bug reports against the simulator OR clarifications about Zscaler's actual behavior.

## Cross-links

- Source: `scripts/policy_simulator.py` (canonical implementation)
- Runnable CLI: `scripts/simulate-policy.py`
- Underlying URL filter logic: [`./zia/url-filtering.md`](./zia/url-filtering.md)
- Wildcard semantics (URL → category resolution): [`./zia/wildcard-semantics.md`](./zia/wildcard-semantics.md)
- Snapshot format: [`./zia/snapshot-schema.md`](./zia/snapshot-schema.md)
- Why-was-this-blocked runbook: [`./_runbooks.md § Troubleshooting flows § TS-2`](./_runbooks.md)
- Log correlation (validation against actual traffic): [`./shared/log-correlation.md`](./shared/log-correlation.md)
