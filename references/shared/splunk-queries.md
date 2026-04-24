---
product: shared
topic: "splunk-queries"
title: "SPL patterns for Zscaler log questions"
content-type: reference
last-verified: "2026-04-23"
confidence: medium
sources:
  - "references/zia/logs/web-log-schema.md"
  - "references/zia/logs/firewall-log-schema.md"
  - "references/zia/logs/dns-log-schema.md"
  - "references/zpa/logs/access-log-schema.md"
  - "https://docs.splunk.com/Documentation/SplunkCloud/latest/SearchReference"
  - "vendor/splunk-sdk-python/README.md"
author-status: draft
---

# SPL patterns for Zscaler log questions

Named SPL patterns scoped to this skill's question shapes. Answers cite a pattern by its section name (e.g. `§ url-coverage-check`) rather than inlining the full query — keeps answers readable and the catalog reusable.

## Field-name conventions

The patterns use **NSS-native field names** as documented in the Zscaler log schemas (e.g. `%s{url}` → search field `url`). If the Zscaler Technology Add-on for Splunk is installed, it aliases NSS fields to Splunk CIM-compatible names (e.g. `dest_host`, `ruleLabel`). The patterns below should still work in most deployments; if a field name doesn't match your tenant's Splunk config, check `props.conf` / `transforms.conf` in the Zscaler TA to see the exact aliasing.

## Parameter conventions

- `$INDEX_ZIA_WEB` / `$INDEX_ZIA_FW` / `$INDEX_ZIA_DNS` / `$INDEX_ZPA` — the Splunk indexes receiving each log stream. Tenant-specific; replace at query time. See [clarification `shared-01`](../_clarifications.md#shared-01-spl-index-naming-portability).
- `$URL`, `$HOSTNAME`, `$USER`, `$CATEGORY` — user-supplied parameters for a given question.
- Default time window `earliest=-30d`. Shorten to `-7d` / `-24h` for pushback-triggered validation to cut query latency.

## Patterns

### `url-coverage-check`

**Purpose:** Q1 validation. "Has URL `$URL` been seen, and if so which rule / category did it hit?"

```spl
index=$INDEX_ZIA_WEB url=$URL earliest=-30d
| stats
    count
    values(urlcat) as categories
    values(urlfilterrulelabel) as url_filter_rules
    values(apprulelabel) as cac_rules
    values(action) as actions
    by host
```

Notes:
- `urlcat` from `web-log-schema.md` is the **applied** category, not every category the URL could match.
- `urlfilterrulelabel` fires for both Allow and Block outcomes. `rulelabel` is Block-only — don't use it as the primary rule identifier for this question.
- `apprulelabel` appearing alongside `urlfilterrulelabel` means both policy layers evaluated (no cascading issue); if only `apprulelabel` appears, CAC handled the request without URL filtering (default CAC-wins behavior).

### `rule-hit-history`

**Purpose:** Q2 validation. "Which URL filtering rule is actually firing for requests matching `$URL` or `$HOSTNAME`?"

```spl
index=$INDEX_ZIA_WEB (url=$URL OR host=$HOSTNAME) earliest=-7d
| stats count by urlfilterrulelabel action
| sort -count
```

Pair with config: the rule-list from `snapshot/zia/url-filtering-rules.json` gives the ordered evaluation list. The Splunk output shows which one *actually* fired — divergence from expected-first-match is the signal.

### `ssl-inspection-observed`

**Purpose:** Q4 validation. "For a given host, was SSL inspection applied or bypassed?"

```spl
index=$INDEX_ZIA_WEB host=$HOSTNAME earliest=-7d
| stats count by ssldecrypted externalspr
| sort -count
```

Notes per `web-log-schema.md`:
- `ssldecrypted` — `Yes` / `No`.
- `externalspr` (SSL Policy Reason) — `Blocked`, `Inspected`, `N/A`, `Not inspected because of O365 bypass`, `Not inspected because of SSL policy`, `Not inspected because of UCaaS bypass`, `Not inspected because of Zscaler best practices`.

Combining both distinguishes the "inspected and allowed" / "inspected and blocked" / "bypassed with Evaluate Other Policies" / "bypassed with Bypass Other Policies" cases — per [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md).

### `segment-match-observed`

**Purpose:** Q6 validation. "For requests to `$HOSTNAME`, which ZPA segment actually handled them?"

```spl
index=$INDEX_ZPA Host=$HOSTNAME earliest=-7d
| stats count by Application AppGroup Connector Policy
| sort -count
```

Fields per `access-log-schema.md`:
- `Application` — segment name.
- `AppGroup` — segment group.
- `Connector` — App Connector that served the request.
- `Policy` — access policy rule that matched.

Note **ZPA fields are case-sensitive** per *Understanding the Log Stream Content Format* (ZIA NSS fields are mostly lowercase by convention, but ZPA LSS uses PascalCase like `Application`, `Host`).

### `segment-match-multimatch`

**Purpose:** Q6 follow-up. "For `$HOSTNAME` with Multimatch enabled, which segments matched across the specificity chain?"

```spl
index=$INDEX_ZPA Host=$HOSTNAME earliest=-24h
| stats count values(Application) as matched_segments values(Policy) as policies_fired by Username
```

Useful when the specific-FQDN segment's port doesn't cover the request and Multimatch allows fallthrough to a wildcard segment — the `matched_segments` shows exactly which ones lit up.

### `connector-failure-direct-bypass`

**Purpose:** Diagnoses the ZPA "port mismatch → direct bypass" footgun described in `app-segments.md`. If a request matched a segment but port was wrong, **it won't be in the LSS logs at all** (client-side drop, no cloud traversal).

Since the failure leaves no log, this pattern looks for the inverse — active sessions that *did* reach LSS but failed to set up:

```spl
index=$INDEX_ZPA Host=$HOSTNAME earliest=-24h
| stats count by Application ConnectionStatus InternalReason
| where ConnectionStatus!="Active"
```

If `$HOSTNAME` doesn't appear at all, combine with local packet capture or client-side logs; see [clarification `zpa-05`](../_clarifications.md#zpa-05-no-match-in-segment-criteria) for the full diagnostic tree.

### `config-reality-drift`

**Purpose:** Detect when configured policy doesn't match observed behavior. Classic example: a rule configured as Allow but logging Block action (or vice versa).

Requires joining a snapshot export against live logs. Candidate approach (requires `snapshot_rules.csv` exported by `scripts/snapshot-refresh.py`):

```spl
| inputlookup snapshot_rules.csv
| rename rule_name as urlfilterrulelabel expected_action as expected
| join urlfilterrulelabel
    [search index=$INDEX_ZIA_WEB earliest=-7d
     | stats values(action) as observed by urlfilterrulelabel]
| where expected != observed
| table urlfilterrulelabel expected observed
```

The columns reveal rules where the observed action diverges from the configured action — high-signal for Q2 "why did this unexpected block happen" debugging.

### `firewall-vs-web-module-block`

**Purpose:** Distinguish firewall-module blocks from web-module blocks when a user reports "my request was denied." From *Understanding Policy Enforcement* p.2, firewall logs and web logs differ in how they record web-module outcomes:

> When the web traffic violates a firewall policy, both the Firewall and the Web Insights logs indicate that the traffic is blocked. However, if the traffic passes the firewall policy but violates a web policy, the Firewall Insights logs indicate that the traffic is allowed, whereas the Web Insights logs indicate it as blocked.

Cross-stream query:

```spl
(index=$INDEX_ZIA_WEB OR index=$INDEX_ZIA_FW) host=$HOSTNAME action=Blocked earliest=-24h
| stats count values(action) as action values(rulelabel) as rule values(ruletype) as type by index
```

The `index` column tells you which side blocked.

## Open questions

- Index naming portability across tenants — [clarification `shared-01`](../_clarifications.md#shared-01-spl-index-naming-portability)
- Whether field extractions differ between Zscaler TA and a hand-configured feed — see [clarification `log-01`](../_clarifications.md#log-01-nss-feed-format-versions) (partially resolved)
- `ssl_decrypt` vs `ssldecrypted` field aliasing under the Zscaler TA — depends on the TA version; pattern above uses the NSS-native name.

## Cross-links

- When to query logs — [`./log-correlation.md`](./log-correlation.md)
- ZIA log schemas — [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md), [`firewall-log-schema.md`](../zia/logs/firewall-log-schema.md), [`dns-log-schema.md`](../zia/logs/dns-log-schema.md)
- ZPA LSS User Activity schema — [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md)
