---
product: shared
topic: "splunk-queries"
title: "SPL patterns for Zscaler log questions"
content-type: reference
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
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

- `$INDEX_ZIA_WEB` / `$INDEX_ZIA_FW` / `$INDEX_ZIA_DNS` / `$INDEX_ZPA` — the Splunk indexes receiving each log stream. Tenant-specific; read from env vars at query time — see **Tenant-portable index naming** below.
- `$URL`, `$HOSTNAME`, `$USER`, `$CATEGORY` — user-supplied parameters for a given question.
- Default time window `earliest=-30d`. Shorten to `-7d` / `-24h` for pushback-triggered validation to cut query latency.

## Operating discipline

This catalog operates under the SIEM-generic emission discipline in [`siem-emission-discipline.md`](./siem-emission-discipline.md) — execution modes (agent-direct / user-handoff / coworking), placeholder-plumbing rule, Zscaler-published-fields-only rule, where user plumbing lives, and what stays private. Read that doc for the full framework; the Splunk specifics below are concrete instances of those generic rules.

**Splunk-specific instances:**

- **Plumbing placeholders** — env vars `$INDEX_ZIA_WEB`, `$INDEX_ZIA_FW`, `$INDEX_ZIA_DNS`, `$INDEX_ZPA`, `$INDEX_ZPA_STATUS`, `$INDEX_ZPA_METRICS`, `$INDEX_ZDX`. See [Tenant-portable index naming](#tenant-portable-index-naming) for the full list and substitution mechanics.
- **TA-default sourcetypes** — `zscalernss-web`, `zscalernss-fw`, `zscalernss-dns`, `zscalernss-alerts`. See [Zscaler Technology Add-on for Splunk](#zscaler-technology-add-on-for-splunk-ta) for the CIM mapping.
- **Tenant sourcetype mapping** — Splunk sourcetype patterns are documented per Zscaler log type in [`siem-log-mapping.md`](./siem-log-mapping.md). The user's actual sourcetypes go in CLAUDE.md / memory / private config, never in this catalog.

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

If `$HOSTNAME` doesn't appear at all, combine with local packet capture or client-side logs; see [clarification `zpa-05`](../_meta/clarifications.md#zpa-05-no-match-in-segment-criteria) for the full diagnostic tree.

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

## Tenant-portable index naming

SPL patterns parameterize the index on env vars so a fork can drop in non-default index names without editing the patterns:

- `SPLUNK_INDEX_ZIA_WEB` — ZIA web logs (default: `zscaler_web`)
- `SPLUNK_INDEX_ZIA_FW` — ZIA firewall logs (default: `zscaler_firewall`)
- `SPLUNK_INDEX_ZIA_DNS` — ZIA DNS logs (default: `zscaler_dns`)
- `SPLUNK_INDEX_ZPA` — ZPA LSS logs (default: `zscaler_zpa`)

The defaults match Zscaler's Splunk Technology Add-on out-of-the-box configuration. Tenants using custom index naming set the relevant env vars; `scripts/splunk-query.sh` substitutes them into the pattern at run time. See [`shared-01`](../_meta/clarifications.md#shared-01-spl-index-naming-portability) for the rationale.

### `zcc-device-correlate`

**Purpose:** Correlate ZCC device context with ZIA web logs — joins the `deviceowner` field (present in ZIA web logs when ZCC is the forwarding agent) to identify which device generated a specific web request.

ZCC logs are local endpoint files and are not directly queryable from Splunk. However, ZIA NSS web logs carry device identity fields when requests are forwarded by ZCC:

- `deviceowner` — the device's username/owner as registered in ZCC
- `ztunnelversion` — which Z-Tunnel version (`1.0` or `2.0`) the ZCC client was using

```spl
index=$INDEX_ZIA_WEB deviceowner=$USER earliest=-7d
| stats
    count as web_requests
    values(ztunnelversion) as tunnel_versions
    values(url) as sample_urls
    values(action) as actions
    dc(url) as unique_urls
    by deviceowner host
| sort -web_requests
```

Notes per `zcc-log-schema.md`:
- ZCC logs **tunnel lifecycle**, not individual web transactions. The web transaction records shown here are ZIA NSS records — they show the cloud-side view of what ZCC forwarded.
- If `deviceowner` is absent or empty, the request may have been forwarded via a PAC proxy or GRE tunnel rather than ZCC. Check `proto` / `clientsourceip` fields for disambiguation.
- `ztunnelversion=2.0` is the default on modern ZCC; `1.0` may indicate an older ZCC version or a compatibility fallback.

### `zcc-tunnel-down-web-gap`

**Purpose:** Diagnose ZCC tunnel-down periods by looking for gaps in a user's ZIA web log traffic — when ZCC's tunnel drops, web traffic stops appearing in ZIA NSS logs.

ZCC tunnel events are not directly visible in ZIA web logs. The diagnostic approach is to look for **time gaps** in a user's expected web activity:

```spl
index=$INDEX_ZIA_WEB login=$USER earliest=-24h
| bucket _time span=5m
| stats count as events_per_5min by _time login
| streamstats window=1 current=false last(_time) as prev_time by login
| eval gap_minutes = round((_time - prev_time) / 60, 1)
| where gap_minutes > 15
| table _time login gap_minutes prev_time
| sort _time
```

Interpretation: gaps > 15 minutes during business hours indicate periods when the user's traffic was not reaching ZIA — possible ZCC tunnel down, network change, or off-network without a forwarding fallback. Cross-reference with ZPA User Status logs (SessionStatus=ZPN_STATUS_DISCONNECTED at the same timestamp) to confirm ZCC state.

### `zdx-score-trend`

**Purpose:** Track ZDX score for a specific user over time. ZDX data reaches Splunk only if the organization has configured ZDX export — either via a ZDX-to-SIEM integration or via a custom pipeline using the ZDX API (see `references/zdx/api.md`). The field names below assume a JSON export to Splunk from the ZDX API's `get_app_user` endpoint.

```spl
index=$INDEX_ZDX user_email=$USER earliest=-7d
| timechart span=1h avg(zdx_score) as avg_score max(zdx_score) as best_score min(zdx_score) as worst_score by app_name
```

Notes from `zdx/overview.md`:
- ZDX Score is 0–100; buckets: Good (66–100), Okay (34–65), Poor (0–33).
- ZDX uses **lowest-within-window** for hourly rollup — one bad 5-minute sample drives the hour's score down.
- If no ZDX data appears, verify that: (1) ZDX export is configured, (2) the user has ZDX entitlement via `ZdxGroupEntitlements`, and (3) the user has ZCC active (ZDX metrics flow through ZCC to TPG).

### `zdx-probe-failures-correlation`

**Purpose:** Correlate ZDX probe failures for a user with access log events in ZIA/ZPA for the same window — helps distinguish "ZDX says user experience is poor" (score degradation) from "ZIA/ZPA shows the user couldn't reach the app" (access failure).

```spl
(index=$INDEX_ZDX user_email=$USER) OR
(index=$INDEX_ZIA_WEB login=$USER) OR
(index=$INDEX_ZPA Username=$USER)
earliest=-2h
| eval source_product = case(
    index="$INDEX_ZDX", "ZDX",
    index="$INDEX_ZIA_WEB", "ZIA-Web",
    index="$INDEX_ZPA", "ZPA"
  )
| eval event_summary = case(
    source_product="ZDX", "score=" . zdx_score . " app=" . app_name,
    source_product="ZIA-Web", action . " " . host,
    source_product="ZPA", ConnectionStatus . " " . Application
  )
| table _time source_product event_summary
| sort _time
```

When to use: if ZDX shows a Poor score and ZPA User Activity shows `ConnectionStatus!=Active` in the same window → ZPA tunnel failure drove the score drop. If ZDX shows Poor but ZPA access looks normal → the degradation is in application response time or network path, not ZPA itself.

### `connector-throughput-utilization`

**Purpose:** Monitor App Connector throughput — identify connectors handling disproportionate data volume or approaching bandwidth limits.

```spl
index=$INDEX_ZPA_METRICS earliest=-1h
| eval total_tx_bytes = TransmittedBytesToPublicSE + TransmittedBytesToPrivateSE
| eval total_rx_bytes = ReceivedBytesFromPublicSE + ReceivedBytesFromPrivateSE
| eval total_bytes_mb = round((total_tx_bytes + total_rx_bytes) / 1048576, 2)
| stats
    sum(total_bytes_mb) as total_mb_1h
    avg(total_bytes_mb) as avg_mb_per_interval
    avg(AppConnectionsActive) as avg_active_conns
    avg(CPUUtilization) as avg_cpu
    by Connector
| sort -total_mb_1h
| rename total_mb_1h as "Total MB (1h)", avg_mb_per_interval as "Avg MB/interval", avg_active_conns as "Avg Active Conns"
```

Fields per `app-connector-metrics.md`:
- `TransmittedBytes*` / `ReceivedBytes*` are **per-interval delta values**, not cumulative.
- Both Public SE and Private SE traffic are included. A connector routing through a Private Service Edge will show values in the PrivateSE fields.

### `connector-top-by-connection-count`

**Purpose:** Rank connectors by active connection count — detect load imbalance in a connector group that suggests a sticky-session or connector-group assignment issue.

```spl
index=$INDEX_ZPA_METRICS earliest=-30m
| stats
    avg(AppConnectionsActive) as avg_active
    max(AppConnectionsActive) as peak_active
    avg(CPUUtilization) as avg_cpu
    avg(SystemMemoryUtilization) as avg_mem
    by Connector
| sort -avg_active
| table Connector avg_active peak_active avg_cpu avg_mem
```

If connectors in the same App Connector Group show highly uneven `avg_active`, check whether:
1. The connector group uses **Round Robin** or **Weighted** load balancing.
2. Any connector has more `AppCount` segments assigned than peers.
3. A specific connector handles a high-traffic application not assigned to others.

### `connector-cpu-mem-alert`

**Purpose:** Alert threshold pattern for connector CPU and memory — suitable for a scheduled Splunk alert or saved search.

```spl
index=$INDEX_ZPA_METRICS earliest=-10m
| stats latest(CPUUtilization) as cpu latest(SystemMemoryUtilization) as sys_mem latest(ProcessMemoryUtilization) as proc_mem latest(AvailablePorts) as free_ports by Connector
| eval cpu_alert = if(cpu > 80, "HIGH", if(cpu > 60, "WARN", "OK"))
| eval mem_alert = if(sys_mem > 85, "HIGH", if(sys_mem > 70, "WARN", "OK"))
| eval port_alert = if(free_ports < 5000, "HIGH", if(free_ports < 10000, "WARN", "OK"))
| where cpu_alert != "OK" OR mem_alert != "HIGH" OR port_alert != "OK"
| table Connector cpu cpu_alert sys_mem mem_alert free_ports port_alert
```

Threshold rationale:
- CPU > 80: connector is under sustained load; ZPA connection setup times will increase.
- Memory > 85 (system): OS-level pressure; potential OOM conditions on the connector VM.
- AvailablePorts < 5000: approaching port pool exhaustion; new outbound sessions will fail when pool is empty.

### `user-status-persistent-disconnects`

**Purpose:** Find users with persistent or repeated ZCC disconnects from ZPA — surfaces users experiencing ZCC tunnel instability over time.

```spl
index=$INDEX_ZPA_STATUS SessionStatus=ZPN_STATUS_DISCONNECTED earliest=-7d
| stats
    count as disconnect_count
    dc(SessionID) as unique_sessions
    values(Platform) as platforms
    values(Version) as zcc_versions
    values(Hostname) as hostnames
    by Username
| sort -disconnect_count
| rename disconnect_count as disconnects_7d
```

A high `disconnects_7d` / `unique_sessions` ratio (e.g., many disconnects across few sessions) indicates the same sessions are cycling repeatedly — characteristic of network instability. A high `unique_sessions` with moderate disconnects is more consistent with normal roaming behavior (each network change = new session).

### `zcc-version-distribution`

**Purpose:** Audit ZCC version distribution across the fleet — identifies users running outdated ZCC versions that may have known bugs or lack features required by posture policies.

```spl
index=$INDEX_ZPA_STATUS earliest=-24h
| dedup Username sortby -_time
| stats
    count as user_count
    values(Platform) as platforms
    by Version
| sort -user_count
| eventstats sum(user_count) as total_users
| eval pct = round((user_count / total_users) * 100, 1)
| table Version user_count pct platforms
```

The `dedup` by most-recent `_time` per `Username` gets each user's current version rather than counting version events. If `$INDEX_ZPA_STATUS` has multiple LSS receivers, verify the dedup is working across all entries for the user.

### `posture-compliance-by-user`

**Purpose:** Report posture compliance status per user — shows which users have posture profile misses and which profiles are failing.

```spl
index=$INDEX_ZPA_STATUS earliest=-24h
| dedup Username sortby -_time
| eval posture_status = if(PosturesMiss == "" OR isnull(PosturesMiss), "Compliant", "NonCompliant")
| stats
    count by posture_status
| appendcols
    [search index=$INDEX_ZPA_STATUS PosturesMiss!="" earliest=-24h
     | dedup Username sortby -_time
     | mvexpand PosturesMiss
     | stats dc(Username) as users_affected by PosturesMiss
     | sort -users_affected]
```

Or for a per-user view with the specific failing profiles:

```spl
index=$INDEX_ZPA_STATUS PosturesMiss!="" earliest=-24h
| dedup Username sortby -_time
| table Username PosturesMiss PosturesHit Platform Version Hostname
| sort Username
```

`PosturesMiss` is a comma-delimited string of posture profile names. The `mvexpand` in the aggregate variant treats it as a multi-value field — requires that your LSS feed delivers it as a multi-value field; if it's a single comma-delimited string, add `| eval PosturesMiss=split(PosturesMiss, ",")` before `mvexpand`.

## Zscaler Technology Add-on for Splunk (TA)

The **Zscaler Internet Security for Splunk** add-on (Splunk App ID: 3865, available on Splunkbase at `https://splunkbase.splunk.com/app/3865`) provides:

- **Field aliases** that map NSS-native field names to Splunk CIM (Common Information Model) names, enabling searches using CIM macros and Splunk ES correlation searches.
- **Props/transforms** for sourcetype detection when logs arrive via HEC or syslog.
- **Pre-built dashboards** for web, firewall, and threat visibility.

**Key CIM mappings the TA creates** (derived from field names in the ZIA and ZPA log schemas):

| NSS / LSS field | CIM field | CIM data model |
|---|---|---|
| `login` | `user` | Authentication, Web |
| `url` | `url` | Web |
| `host` | `dest_host` | Web |
| `clientip` | `src_ip` | Web |
| `action` (ZIA) | `action` | Web |
| `rulelabel` | `rule` | Web |
| `threatname` | `threat_name` | Malware |
| `ssldecrypted` | `ssl_decrypted` | Web |
| `proto` (ZIA FW) | `transport` | Network Traffic |
| `sourceip` (ZIA FW) | `src_ip` | Network Traffic |
| `destip` (ZIA FW) | `dest_ip` | Network Traffic |
| `Username` (ZPA) | `user` | Authentication |
| `Application` (ZPA) | `app` | (custom) |
| `Connector` (ZPA) | (no CIM standard) | (custom) |

**CIM mapping caveat**: the TA version matters. Field aliases added in newer TA versions may not exist in older deployments. The patterns in this file use NSS-native field names — they work regardless of TA installation. If you use CIM macro-based searches (e.g., `| datamodel Web searches`) you must have the TA installed and the sourcetype configured correctly.

The TA sourcetype assignments (from the Splunkbase documentation):
- `zscalernss-web` — ZIA web log events
- `zscalernss-fw` — ZIA firewall log events
- `zscalernss-dns` — ZIA DNS log events
- `zscalernss-alerts` — NSS alert feed events

For ZPA LSS logs, the TA does not define a default ZPA sourcetype — ZPA LSS arrives at a custom log receiver and the sourcetype is typically set by the customer's Splunk Universal Forwarder or HEC input configuration.

## Tenant-portable index naming (updated)

In addition to the original index variables, the expanded patterns use:

- `SPLUNK_INDEX_ZPA_STATUS` — ZPA User Status LSS logs (default: `zscaler_zpa_status` or co-indexed with `zscaler_zpa` depending on LSS receiver config)
- `SPLUNK_INDEX_ZPA_METRICS` — ZPA App Connector Metrics LSS logs (default: `zscaler_zpa_metrics` or co-indexed with `zscaler_zpa`)
- `SPLUNK_INDEX_ZDX` — ZDX data exported to Splunk (no default — ZDX export to Splunk is customer-configured)

Whether ZPA User Status and App Connector Metrics land in the same index as User Activity depends on how the LSS receivers are configured. Many deployments use a single LSS receiver and a single index for all ZPA LSS log types, distinguished by the log format/fields present rather than by index.

## Open questions

- Whether field extractions differ between Zscaler TA and a hand-configured feed — see [clarification `log-01`](../_meta/clarifications.md#log-01-nss-feed-format-versions) (partially resolved)
- `ssl_decrypt` vs `ssldecrypted` field aliasing under the Zscaler TA — depends on the TA version; pattern above uses the NSS-native name.
- ZDX-to-Splunk export path is not natively offered by Zscaler as of last verification — ZDX data requires a custom pipeline via the ZDX API. The `zdx-score-trend` and `zdx-probe-failures-correlation` patterns are architecture-dependent and should be treated as aspirational until ZDX export is confirmed in the tenant.

## ZCC correlation patterns

ZCC diagnostic logs are local to the endpoint and are not streamed to Splunk. However, ZIA web logs capture ZCC-forwarded traffic and carry device-level fields — so the SIEM-queryable view of "what was a ZCC device doing" lives entirely in ZIA NSS.

### `zcc-device-activity`

**Purpose:** Find all ZIA web log entries from a specific device by owner — answers "what was this ZCC-enrolled device doing on the network" from the cloud side.

The `deviceowner` field is populated in ZIA web logs when ZCC is the forwarding agent. It reflects the device owner as registered in ZCC (typically the primary user of the device).

```spl
index=$INDEX_ZIA_WEB deviceowner=$USER earliest=-7d
| stats
    count as total_requests
    dc(host) as unique_hosts
    values(action) as actions
    values(urlcat) as categories
    values(ztunnelversion) as tunnel_versions
    by deviceowner devicehostname
| sort -total_requests
```

Cross-reference with `login` to validate that `deviceowner` and the authenticated user match. A mismatch (device registered to User A, authenticated as User B) may indicate a shared device or a credential issue.

### `zcc-bypass-detection`

**Purpose:** Identify traffic that bypassed ZCC — ZIA web log entries where the source is a corporate subnet but no `deviceowner` is populated, suggesting direct traffic that did not flow through the ZCC tunnel.

Traffic arriving via GRE/IPSec tunnel from a branch, PAC proxy, or any path other than ZCC will have no `deviceowner`. If a corporate-subnet client IP appears without `deviceowner`, that client is not using ZCC to forward traffic.

```spl
index=$INDEX_ZIA_WEB earliest=-7d
| search cip=10.0.0.0/8 OR cip=172.16.0.0/12 OR cip=192.168.0.0/16
| where isnull(deviceowner) OR deviceowner=""
| where trafficredirectmethod!="Zscaler Client Connector"
| stats
    count as sessions
    dc(cip) as unique_client_ips
    values(trafficredirectmethod) as forwarding_methods
    values(location) as locations
    by login
| sort -sessions
```

Adjust the subnet ranges to match your corporate RFC-1918 allocation. `trafficredirectmethod` shows the actual forwarding path (GRE, IPSec, PAC, etc.). A high count of corporate-IP sessions without `deviceowner` suggests devices on-network without ZCC enrolled, or ZCC disabled/bypassed.

### `zcc-version-distribution`

ZCC version data surfaces in ZPA User Status logs (the `Version` field), not in ZIA web logs directly. The existing `zcc-version-distribution` pattern in this file (see above under the Patterns section) queries `$INDEX_ZPA_STATUS` for ZCC version distribution across the fleet. If ZDX data is also in Splunk, the ZDX API's device endpoint carries software inventory that may include the ZCC version — but that path is tenant-configured and not universal.

For a combined view correlating ZCC version (from ZPA Status) with ZIA activity volume (from ZIA Web), use a subsearch join:

```spl
index=$INDEX_ZIA_WEB earliest=-24h
| stats count as web_requests by login
| join type=left login
    [search index=$INDEX_ZPA_STATUS earliest=-24h
     | dedup Username sortby -_time
     | rename Username as login
     | table login Version Platform]
| table login Version Platform web_requests
| sort -web_requests
```

---

## ZDX log patterns

ZDX does not stream to Splunk natively via NSS or LSS. ZDX data is a pull-API — metrics live in Zscaler's Azure Data Explorer backend and are retrieved via the ZDX REST API (see [`../zdx/api.md`](../zdx/api.md)). Getting ZDX data into Splunk requires one of:

- The **Zscaler ZDX Add-on for Splunk** (if installed in your tenant — a separate Splunkbase add-on distinct from the ZIA/ZPA TA)
- A custom pipeline that calls the ZDX API (`client.zdx.devices`, `client.zdx.apps`) and ships results to a Splunk index via HEC

If ZDX data is not in Splunk at all, the `zdx-score-trend` and `zdx-probe-failures-correlation` patterns elsewhere in this file are aspirational — verify ZDX-to-Splunk export before relying on them.

### `zdx-score-api-note`

**Note on ZDX Splunk integration:** ZDX does not natively integrate with NSS or LSS. If ZDX data IS present in Splunk (via the ZDX TA or a custom index), the field names below assume a JSON export from the ZDX API's `get_app_user` endpoint.

**Correlating ZDX score drops with ZIA/ZPA access events for the same user and time window:**

```spl
| tstats count WHERE index=$INDEX_ZDX earliest=-2h latest=now BY _time span=5m
| appendcols
    [| tstats count WHERE index=$INDEX_ZIA_WEB earliest=-2h latest=now BY _time span=5m]
| appendcols
    [| tstats count WHERE index=$INDEX_ZPA earliest=-2h latest=now BY _time span=5m]
```

For a user-scoped correlation when ZDX data is present:

```spl
(index=$INDEX_ZDX user_email=$USER) OR
(index=$INDEX_ZIA_WEB login=$USER) OR
(index=$INDEX_ZPA Username=$USER)
earliest=-2h
| eval source = case(
    index="$INDEX_ZDX",     "ZDX",
    index="$INDEX_ZIA_WEB", "ZIA-Web",
    index="$INDEX_ZPA",     "ZPA-Activity"
  )
| eval score_or_action = case(
    source="ZDX",        "score=" . zdx_score . " app=" . app_name,
    source="ZIA-Web",    action . " " . host,
    source="ZPA-Activity", ConnectionStatus . " " . Application
  )
| table _time source score_or_action
| sort _time
```

Interpretation: ZDX score drop coinciding with `ConnectionStatus!=Active` in ZPA → ZPA tunnel failure likely drove the score drop. ZDX score drop with normal ZPA/ZIA logs → degradation is in the application or network path, not ZPA itself.

---

## Cross-stream user-session reconstruction

**Purpose:** Given a username and time window, reconstruct what the user was doing by pulling correlated events across ZIA Web, ZIA Firewall, and ZPA Access in a single timeline. Useful for "what happened during this 30-minute window for user X" investigations.

**Field name differences across streams:**
- ZIA Web and ZIA Firewall use `login` for the username (lowercase, email format)
- ZPA User Activity uses `Username` (PascalCase, email format)
- ZCC context appears as `deviceowner` in ZIA logs (device's registered owner, may differ from `login` on shared devices)

```spl
(
  (index=$INDEX_ZIA_WEB login=$USER)
  OR (index=$INDEX_ZIA_FW login=$USER)
  OR (index=$INDEX_ZPA Username=$USER)
)
earliest=-1h latest=now
| eval source = case(
    index="$INDEX_ZIA_WEB", "ZIA-Web",
    index="$INDEX_ZIA_FW",  "ZIA-FW",
    index="$INDEX_ZPA",     "ZPA"
  )
| eval username = coalesce(login, Username)
| eval event_detail = case(
    source="ZIA-Web",
        action . " | " . host . " | cat=" . urlcat . " | rule=" . urlfilterrulelabel,
    source="ZIA-FW",
        action . " | " . nwapp . " | " . csip . ":" . cdport . " → " . cdip,
    source="ZPA",
        ConnectionStatus . " | app=" . Application . " | connector=" . Connector . " | policy=" . Policy
  )
| table _time source username event_detail
| sort _time
```

For a subsearch join approach that builds a per-user timeline anchored on a specific ZPA session:

```spl
index=$INDEX_ZPA Username=$USER earliest=-1h
| eval zpa_window_start = _time - 300
| eval zpa_window_end = _time + 300
| map maxsearches=5
    search="search (index=$INDEX_ZIA_WEB login=$USER OR index=$INDEX_ZIA_FW login=$USER) earliest=$zpa_window_start$ latest=$zpa_window_end$
            | eval source = if(index=\"$INDEX_ZIA_WEB\", \"ZIA-Web\", \"ZIA-FW\")
            | table _time source action host urlcat Application Connector"
```

Notes:
- The `coalesce(login, Username)` handles the field-name difference; both fields carry the same email-format identity.
- ZIA DNS logs use `login` as well — add `OR (index=$INDEX_ZIA_DNS login=$USER)` to include DNS events in the timeline.
- ZPA User Status logs (`$INDEX_ZPA_STATUS`) carry `Username` (PascalCase) — add to the union for session enrollment events.
- For high-volume users, narrow `earliest`/`latest` before running — the cross-stream union can be expensive.

## Cross-links

- SIEM-generic emission discipline (modes, public/private boundary, placeholders) — [`./siem-emission-discipline.md`](./siem-emission-discipline.md)
- SIEM-generic log type catalog (sourcetype patterns per Zscaler log type) — [`./siem-log-mapping.md`](./siem-log-mapping.md)
- `/z-investigate` slash command playbook (emits queries from this catalog) — [`./investigate-prompt.md`](./investigate-prompt.md)
- Troubleshooting methodology (discovery journal, claim discipline) — [`./troubleshooting-methodology.md`](./troubleshooting-methodology.md)
- When to query logs — [`./log-correlation.md`](./log-correlation.md)
- Log export architecture (where each log type comes from) — [`./log-export-architecture.md`](./log-export-architecture.md)
- ZIA log schemas — [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md), [`firewall-log-schema.md`](../zia/logs/firewall-log-schema.md), [`dns-log-schema.md`](../zia/logs/dns-log-schema.md)
- ZPA LSS User Activity schema — [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md)
- ZPA User Status schema — [`../zpa/logs/user-status-log-schema.md`](../zpa/logs/user-status-log-schema.md)
- ZPA App Connector Metrics schema — [`../zpa/logs/app-connector-metrics.md`](../zpa/logs/app-connector-metrics.md)
- ZCC log schema (client-side only — not Splunk-queryable directly) — [`../zcc/logs/zcc-log-schema.md`](../zcc/logs/zcc-log-schema.md)
- ZDX overview (score mechanics) — [`../zdx/overview.md`](../zdx/overview.md)
- ZDX API (data retrieval) — [`../zdx/api.md`](../zdx/api.md)
