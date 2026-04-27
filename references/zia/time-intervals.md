---
product: zia
topic: time-intervals
title: "ZIA Time Intervals — reusable schedule objects for policy rule evaluation"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-time-intervals.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/time_intervals.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_time_windows.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/time_intervals/time_intervals.go"
  - "vendor/terraform-provider-zia/docs/data-sources/zia_firewall_filtering_time_window.md"
author-status: draft
---

# ZIA Time Intervals — reusable schedule objects for policy rule evaluation

## 1. Definition

A time interval is a named, reusable ZIA object that specifies a set of days of the week
and a single contiguous clock-time window (start time to end time) within those days.
Time intervals are referenced by ZIA policy rules as an additional match criterion; a rule
configured with a time interval only evaluates for traffic that arrives while the current
time falls within the interval.
(Tier A — vendor/zscaler-help/about-time-intervals.md)

### Timezone handling

Timezone resolution depends on whether the user is associated with a known ZIA location:

- **Location-sourced user.** If the user's traffic arrives from an IP address that maps to
  a configured ZIA location, the policy engine uses the timezone configured on that
  location. The Public Service Edge (PSE) that processes the request applies the
  location's timezone when evaluating whether the current moment falls inside a time
  interval.
- **Remote user (no configured location).** If the user is a remote user — including users
  forwarding traffic via Zscaler Client Connector — and there is no location configured
  for them, the PSE uses its own local timezone. The PSE's timezone is the timezone of
  the data center where that PSE is deployed, not the user's geographic location.

Practical consequence: the same moment in wall-clock time may cause the rule to trigger
for a location-scoped user but not for a remote user, or vice versa, depending on the
offsets between the location's configured timezone, the PSE's data-center timezone, and
the time window boundaries.
(Tier A — vendor/zscaler-help/about-time-intervals.md)

There is no per-rule timezone override; timezone resolution is determined entirely by
whether the user has a configured location. The tenant-global timezone setting is not
documented as affecting time-interval evaluation.

## 2. Schema

The `TimeInterval` object exposed by both SDKs has the following fields:

| Field | Type | API wire key | Notes |
|---|---|---|---|
| `id` | integer | `id` | Assigned by the API; omitted on create |
| `name` | string | `name` | Human-readable identifier; used by SDKs for lookup by name |
| `start_time` | integer | `startTime` | Minutes from midnight (0 = 00:00, 1439 = 23:59) |
| `end_time` | integer | `endTime` | Minutes from midnight; must be > `startTime` within the same calendar day |
| `days_of_week` | list of string | `daysOfWeek` | Enumerated day values (see below) |

(Tier B — vendor/zscaler-sdk-python/zscaler/zia/models/time_intervals.py;
vendor/zscaler-sdk-go/zscaler/zia/services/time_intervals/time_intervals.go)

### Day-of-week enumeration

Valid values for `days_of_week` / `daysOfWeek`:

| Value | Meaning |
|---|---|
| `EVERYDAY` | All seven days; selects the full week |
| `SUN` | Sunday |
| `MON` | Monday |
| `TUE` | Tuesday |
| `WED` | Wednesday |
| `THU` | Thursday |
| `FRI` | Friday |
| `SAT` | Saturday |

When `EVERYDAY` is set, all days are selected. Individual day tokens can be combined in
any subset. An interval covering Monday–Friday would use
`["MON", "TUE", "WED", "THU", "FRI"]`.
(Tier B — vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py docstring;
vendor/terraform-provider-zia/docs/data-sources/zia_firewall_filtering_time_window.md)

### Time format

Times are expressed as **integer minutes elapsed since midnight** (0–1439), not as
HH:MM strings. The vendor help article illustrates times in 12-hour AM/PM notation
(e.g., "8:00 AM to 5:00 PM"), but the wire format is integers: 0 = midnight, 480 = 8:00 AM,
1020 = 5:00 PM, 1439 = 23:59.
(Tier B — vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py example in docstring,
lines 165–169)

### Recurrence model

A single time interval object holds exactly one contiguous time window (one `startTime`
and one `endTime`) paired with a set of days. The API does not support multiple disjoint
time windows within a single object (for example, "8–12 and 14–18 on weekdays"). To
represent non-contiguous windows, create multiple time interval objects and attach them
both to the rule.

There is no built-in weekly recurrence configuration beyond the `daysOfWeek` selection;
the interval implicitly recurs every week on the named days.
(Tier B — vendor/zscaler-sdk-go/zscaler/zia/services/time_intervals/time_intervals.go
struct definition; vendor/zscaler-sdk-python/zscaler/zia/models/time_intervals.py)

### Relationship to Firewall Time Windows

ZIA exposes two distinct schedule primitives:

- **Time Intervals** (`/timeIntervals` endpoint, `TimeIntervalsAPI` service): the full-CRUD
  object described in this document. Referenced by most rule types.
- **Firewall Time Windows** (`/timeWindows` endpoint, listed under `FirewallNetworkResourcesAPI`):
  a read-only catalog of predefined named schedule objects (e.g., "Work hours", "Weekends",
  "Off hours") that are specifically used by cloud firewall filtering rules. Firewall Time
  Windows are not user-creatable; they are a fixed lookup table. The API provides
  `GET /timeWindows` and `GET /timeWindows/lite` but no POST/PUT/DELETE.
  (Tier B — vendor/zscaler-sdk-python/zscaler/zia/sdk.md lines 817–818;
  vendor/terraform-provider-zia/docs/data-sources/zia_firewall_filtering_time_window.md)

The `TimeWindows` model (Go field key `dayOfWeek`, singular) is structurally identical to
`TimeIntervals` (Go field key `daysOfWeek`, plural) but is used in a different context
and accessed via a different endpoint.
(Tier B — vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_time_windows.py)

## 3. Where time intervals are referenced

The table below lists ZIA rule types that accept a `timeWindows` criterion (the shared
field name across all rule types at the API level). The field accepts a list of
`{id, name}` references to either Time Interval or Firewall Time Window objects depending
on the rule type.

| Rule type | API endpoint | SDK model file | TF resource |
|---|---|---|---|
| Cloud Firewall Filtering | `/firewallFilteringRules` | `cloud_firewall_rules.py` | `zia_firewall_filtering_rule` |
| Cloud Firewall DNS Control | `/firewallDnsRules` | `cloud_firewall_dns_rules.py` | `zia_firewall_dns_rule` |
| Cloud Firewall IPS Control | `/firewallIpsRules` | `cloud_firewall_ips_rules.py` | `zia_firewall_ips_rule` |
| URL Filtering | `/urlFilteringRules` | `url_filtering_rules.py` | `zia_url_filtering_rules` |
| DLP Web Rules | `/webDlpRules` | — (Python model absent; Go struct present) | `zia_dlp_web_rules` |
| SSL Inspection | `/sslInspectionRules` | `ssl_inspection_rules.py` | `zia_ssl_inspection_rules` |
| File Type Control | `/fileTypeControlRules` | `filetyperules.py` | `zia_file_type_control_rules` |
| Cloud App Control | `/cloudApplicationRules` | `cloudappcontrol.py` | `zia_cloud_app_control_rule` |
| Forwarding Control | `/forwardingRules` | `forwarding_control_policy.py` | `zia_forwarding_control_rule` |
| NAT Control | `/natRules` | `nat_control_policy.py` | `zia_nat_control_rules` |
| Bandwidth Control | `/bandwidthControlRules` | `bandwidth_control_rules.py` | `zia_bandwidth_control_rule` |
| Traffic Capture | `/trafficCapturePolicies` | `traffic_capture.py` | `zia_traffic_capture_rules` |
| Sandbox Rules | — (Go only) | — (Python model absent) | `zia_sandbox_rules` |

Sources per column:
- Python model files: vendor/zscaler-sdk-python/zscaler/zia/models/ (confirmed by grepping
  for `time_windows` field in each model). DLP web rules and Sandbox rules Python models do
  not include `time_windows`; confirmed present in the Go SDK structs.
  (Tier B — vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_web_rules/dlp_web_rules.go;
  vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_rules/sandbox_rules.go)
- Firewall Filtering per-rule limit: up to 2 time windows per rule.
  (Tier B — references/zia/firewall.md, criterion-limit table)

Rule types confirmed as **not** having a `time_windows` field in the Python models or Go
structs (based on the model file listing): CASB DLP rules, CASB Malware rules, FTP
Control Policy.

### SDK field name note

All rule modules that accept time references use the field name `time_windows` (Python
snake_case) / `timeWindows` (API wire key / Go JSON tag). The Python SDK's
`transform_common_id_fields` helper automatically reshapes a plain integer list
`[1, 2, 3]` into `[{"id": 1}, {"id": 2}, {"id": 3}]` for this field before sending.
(Tier B — references/zia/sdk.md line 1655;
vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py)

## 4. Evaluation semantics

When a rule includes a time interval condition, the PSE checks whether the current
resolved time (see Section 1 for timezone rules) falls within the interval's window on
the matching day. If the current time is inside the window, the rule is eligible to
match and its other criteria are evaluated normally. If the current time is outside the
window, the rule is **skipped entirely** — the PSE moves to the next rule in order.

Skipping a rule due to a non-matching time interval does not produce a block or allow
decision on its own; evaluation continues down the ordered rule list. A request that
passes all rules without a match reaches the default rule (which in most ZIA policies is
a block or allow catch-all, depending on the policy type).

This interaction with rule order means time-bounded policies must be designed carefully:
an allow rule with a business-hours window will be skipped outside those hours, and
whether access is then permitted or denied depends on what lower-priority rules (or the
default rule) determine.
(Tier A — vendor/zscaler-help/about-time-intervals.md, general policy evaluation
description; consistent with URL Filtering policy evaluation in references/zia/url-filtering.md)

## 5. Holidays and exceptions

Time interval objects have no built-in support for date-based exclusions such as public
holidays, one-off closure days, or exceptions to the weekly recurrence. The schema
contains only `daysOfWeek`, `startTime`, and `endTime`; there is no `excludeDates` or
holiday-calendar reference field.
(Tier B — vendor/zscaler-sdk-go/zscaler/zia/services/time_intervals/time_intervals.go;
vendor/zscaler-sdk-python/zscaler/zia/models/time_intervals.py)

To prevent a time-bounded rule from applying on a specific date (e.g., a public holiday),
operators must disable the rule manually for that day or create a higher-priority rule
that explicitly allows or blocks the traffic for that period and removes the time
condition. There is no dedicated "holiday calendar" object in ZIA.

## 6. CRUD via SDK and Terraform

### Python SDK

Accessor: `client.zia.time_intervals`

| Method | Signature | HTTP |
|---|---|---|
| `list_time_intervals` | `(query_params=None)` | GET `/timeIntervals`; supports `page`, `page_size`, `search` |
| `list_time_intervals_lite` | `()` | GET `/timeIntervals/lite` |
| `get_time_interval` | `(interval_id: int)` | GET `/timeIntervals/{id}` |
| `add_time_intervals` | `(**kwargs)` | POST `/timeIntervals` |
| `update_time_intervals` | `(interval_id: int, **kwargs)` | PUT `/timeIntervals/{id}` |
| `delete_time_intervals` | `(interval_id: int)` | DELETE `/timeIntervals/{id}` |

(Tier B — vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py)

Create example:

```python
interval, _, error = client.zia.time_intervals.add_time_intervals(
    name="Weekdays Business Hours",
    start_time=480,          # 8:00 AM
    end_time=1020,           # 5:00 PM
    days_of_week=["MON", "TUE", "WED", "THU", "FRI"],
)
```

### Go SDK

Package: `zscaler/zia/services/time_intervals`

| Function | Signature |
|---|---|
| `Get` | `(ctx, service, intervalID int) (*TimeInterval, error)` |
| `GetTimeIntervalByName` | `(ctx, service, name string) (*TimeInterval, error)` |
| `Create` | `(ctx, service, interval *TimeInterval) (*TimeInterval, *http.Response, error)` |
| `Update` | `(ctx, service, intervalID int, interval *TimeInterval) (*TimeInterval, *http.Response, error)` |
| `Delete` | `(ctx, service, intervalID int) (*http.Response, error)` |
| `GetAll` | `(ctx, service) ([]TimeInterval, error)` |

(Tier B — vendor/zscaler-sdk-go/zscaler/zia/services/time_intervals/time_intervals.go)

### Terraform

There is no managed resource (`resource` block) for time intervals in the ZIA Terraform
provider. The Terraform provider exposes time window lookup only as a **data source** for
the read-only Firewall Time Windows catalog:

```hcl
data "zia_firewall_filtering_time_window" "work_hours" {
  name = "Work hours"
}
```

This data source returns `start_time`, `end_time`, and `day_of_week` and can be used to
reference predefined time windows in firewall filtering rule resources.
(Tier B — vendor/terraform-provider-zia/docs/data-sources/zia_firewall_filtering_time_window.md;
references/zia/terraform.md line 1166)

User-created time intervals (from the `/timeIntervals` endpoint) are not exposed as a
managed Terraform resource or data source in the available provider source. Management of
user-created time intervals via Terraform requires importing by numeric ID if a resource
is added in the future, or managing them out-of-band via the API/SDK.

### Activation requirement

ZIA changes are staged and only take effect after an activation call. This applies to time
interval CRUD operations. After creating, updating, or deleting a time interval, callers
must invoke `activation.UpdateActivationStatus` (Go SDK) or the equivalent Python method
to commit the change. Failing to activate leaves the interval in a pending state.
(Tier B — vendor/zscaler-sdk-go/CLAUDE.md, "ZIA/ZTW require activation" note)

## 7. Operational gotchas

### Timezone misconfiguration causes unexpected rule behavior

The most common source of confusion with time intervals is a mismatch between the
timezone configured on a ZIA location and the user's actual geographic timezone. A user
in a different timezone from their associated location will experience time-bounded rules
activating and deactivating at unexpected local times. This is by design but must be
communicated to end-users when deploying time-restricted policies.
(Tier A — vendor/zscaler-help/about-time-intervals.md)

### Remote users use PSE timezone

Remote users (not mapped to a configured location) inherit the timezone of whichever PSE
they connect through. If a remote workforce is geographically distributed, the same time
interval will activate at different local times for different users depending on which
PSE serves each request. Users in the same city who connect through different PSEs may
see different effective policy windows.
(Tier A — vendor/zscaler-help/about-time-intervals.md)

### DST behavior

No vendor source documents explicit DST handling for time intervals. Whether the start/end
minute-offset values are interpreted in the location's timezone including DST offsets, or
in a fixed UTC offset, is not confirmed from available sources. This is flagged as a
deferred question (see Section 8 and the clarifications file).

### Per-rule time window cap (Firewall rules)

Firewall filtering rules accept a maximum of 2 time windows per rule.
(Tier B — references/zia/firewall.md, criterion-limit table)

No cap on the total number of time interval objects per tenant is documented in available
sources.

### Minutes-from-midnight wire format surprises

The `startTime` and `endTime` fields accept integers (minutes from midnight), not HH:MM
strings. Code that passes string values (e.g., `"08:00"`) will fail or produce unexpected
results. The Python SDK docstring shows integer values (e.g., `start_time='0'`,
`end_time='1439'`), and the Go struct uses `int`.
(Tier B — vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py;
vendor/zscaler-sdk-go/zscaler/zia/services/time_intervals/time_intervals.go)

### Python SDK docstring uses string for integer fields

The Python SDK `add_time_intervals` docstring shows `start_time='0'` and `end_time='1439'`
as string literals, but the model maps these to `config["startTime"]` and
`config["endTime"]` directly (no type coercion). The Go struct defines both as `int`.
Callers should pass integers to avoid potential serialization edge cases.
(Tier B — vendor/zscaler-sdk-python/zscaler/zia/models/time_intervals.py;
vendor/zscaler-sdk-python/zscaler/zia/time_intervals.py lines 165–168)

### DLP web rules and sandbox rules require Go SDK for time window support

The Python SDK model for `dlp_web_rules` does not include a `time_windows` field
(confirmed absent from `dlp_web_rules.py`). The Go SDK struct does include it. Similarly,
the sandbox rules Python model is absent. Operators automating DLP or sandbox rule
management with time conditions should use the Go SDK or the raw REST API rather than the
Python SDK.
(Tier B — vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_web_rules/dlp_web_rules.go;
vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py — field absent)

## 8. ZPA comparison

ZPA does not have a time interval or schedule-window object for policy evaluation.
ZPA access policy rules do not include a time-of-day or day-of-week match condition.
The only time-related constructs in ZPA are session timeout values (`reauth_timeout`,
`reauth_idle_timeout`) in the Timeout Policy, which govern session re-authentication
cadence rather than rule activation windows.
(Tier B — references/zpa/policy-precedence.md)

## 9. Cross-links

- [ZIA Firewall Filtering](./firewall.md) — criterion limits including the 2-time-window cap
- [ZIA URL Filtering](./url-filtering.md) — Time as a rule criterion in the criteria-logic diagram
- [ZIA DLP](./dlp.md) — DLP web rules (time windows absent from Python model)
- [ZIA Bandwidth Control](./bandwidth-control.md) — time-windowed contention rules guidance
- [ZIA SDK reference](./sdk.md) — `TimeIntervalsAPI` entry; `FirewallNetworkResourcesAPI` for `list_time_windows`
- [ZIA Terraform reference](./terraform.md) — `zia_firewall_filtering_time_window` data source
- [ZPA Policy Precedence](../zpa/policy-precedence.md) — ZPA has no equivalent schedule object

---

## Deferred questions

See also [`_clarifications.md`](../_clarifications.md) — `zia-21` through `zia-25`.

1. **DST handling.** Whether `startTime`/`endTime` minute-offsets are evaluated against
   the location's timezone with DST adjustments applied, or against a fixed UTC offset,
   is not documented in available sources. Requires live API testing or vendor confirmation.

2. **Tenant-level cap on time interval objects.** No maximum count of user-created time
   interval objects per tenant is documented in any available source.

3. **Terraform managed resource.** No `zia_time_interval` managed resource is present in
   the Terraform provider source. Whether one is planned or whether the `/timeIntervals`
   endpoint is intentionally excluded is not confirmed.

4. **Midnight-spanning intervals.** Whether a time window from, for example, 22:00 to
   02:00 (spanning midnight) is supported by configuring `endTime` < `startTime`, or
   whether midnight-spanning windows require two separate interval objects, is not
   documented.

5. **Predefined time intervals.** The help portal references named windows such as
   "Work hours", "Weekends", and "Off hours" in the Firewall Time Windows catalog. Whether
   corresponding predefined objects also exist in the `/timeIntervals` catalog (distinct
   from the `/timeWindows` read-only list) is not confirmed from available sources.
