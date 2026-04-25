---
product: zdx
topic: "zdx-probes"
title: "ZDX probes — Web, Cloud Path, and targeting criteria"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zdx/about-probes"
  - "vendor/zscaler-help/about-probes.md"
  - "https://help.zscaler.com/zdx/understanding-probing-criteria-logic"
  - "vendor/zscaler-help/understanding-probing-criteria-logic.md"
author-status: draft
---

# ZDX probes — Web, Cloud Path, and targeting criteria

Probes are the measurement primitives in ZDX. Understanding what each type measures and how probe targeting is scoped decides whether operators get the right data to attribute a ZDX score drop to the right layer.

## Summary

Two probe types, different measurement focus:

- **Web probes** — measure application-layer performance to a specific URL. Page Fetch Time, DNS Time, Server Response Time (TTFB), Availability.
- **Cloud Path probes** — measure network-layer performance hop-by-hop along the path from endpoint to destination. Hop Count, Packet Loss, Latency (avg/min/max/stddev).

Probes target specific subsets of users via **Probing Criteria** (inclusion) and **Exclusion Criteria** — two orthogonal filter sets that combine with a specific AND/OR shape documented below.

## Mechanics

### Web probes

From *About Probes*:

> Web probes always pull objects from the server and do not do any local caching.

They request **only the top-level document** — not embedded links. Metrics:

| Metric | What it measures |
|---|---|
| Page Fetch Time | Network fetch time of the top-level web page from the probe's URL. Similar to browser dev-tools metric. |
| DNS Time | Time to resolve the hostname in the probe URL. |
| Server Response Time | Time to First Byte (TTFB). |
| Availability | Based on HTTP response code. Success = 1, timeout = 0. |

**Critical non-obvious behavior**: 

> The Secure Sockets Layer (SSL) policies configured for your organization do not apply to ZDX synthetic Web probes, though all other policies applicable to regular traffic are applied.

**ZDX Web probes skip SSL Inspection.** The stated reason is response caching at the destination server — if every customer's probe load triggered full SSL-inspected requests, destination servers would face probe-driven DDoS from the Zscaler fleet. Caching requires predictable request patterns, which SSL inspection disrupts.

Operational implications:

- **SSL Inspection audits should filter out ZDX probe traffic** — it won't appear in SSL inspection logs anyway.
- **If a probe works but real user traffic doesn't**, check SSL Inspection policies — the probe's exemption means it can't validate that path.
- URL Filtering, CAC, Firewall rules, and other non-SSL policies **do** apply to probes. A probe blocked by URL Filtering reports low availability — that's real, not a probe bug.

### Cloud Path probes

Hop-by-hop visualization of the network path. From *About Probes*:

> A Cloud Path is used to provide a summarized path visualization between the hop points of traffic. It can provide visualization for the case of a direct traffic path, as in Zscaler Client Connector to egress to destination, as well as tunneling through a Public Service Edge for Internet & SaaS (i.e., Zscaler Client Connector to egress to Public Service Edge to destination).

Two common shapes:

1. **Direct path**: ZCC → local egress → destination. For traffic bypassed from ZIA.
2. **Tunneled path**: ZCC → local egress → ZIA Public Service Edge → destination. For traffic forwarded via ZIA.

**Unreachable hops render as dotted arrows** in the visualization — differentiated from regular hops (solid arrows).

Metrics:

| Metric | What it measures |
|---|---|
| Hop Count | Number of network hops between two consecutive measured points. |
| Packet Loss | % loss at each hop point. |
| Latency | Roundtrip time. Reported as Average, Minimum, Maximum, and Standard Deviation. |

**Why Cloud Path matters for attribution**: an operator debugging "app is slow" needs to know whether the latency is in the user's local network (first hop), the ISP (middle hops), the Zscaler tunnel (known-Zscaler hop), or the application (last hop). Web probes alone can't distinguish these. Cloud Path shows the specific hop introducing the latency.

### Probe count requirements per application

- **At least one Web probe** is required to enable most applications.
- **Network-type applications** need at least one Cloud Path probe instead.
- **Predefined applications** (Teams, Zoom, O365, Salesforce, ServiceNow, Box) ship with preconfigured probes — no manual setup.

## Probing criteria — who the probe runs for

Probes target users via **Probing Criteria** (inclusion) and **Exclusion Criteria**. Both filter on User, User Group, Department, Location. The two sets combine with a specific evaluation order:

### Within a single criteria set

**Probing Criteria (inclusion)** — different field categories **AND together**:

> User: John Doe, User Group: Group B, Department: Finance → John Doe AND Group B AND Finance

To be probed, the user must match all populated field categories.

**Exclusion Criteria** — different field categories **OR together** (then the whole OR-expression is negated with NOT):

> User Group: Group C, Department: Finance → NOT (Group C OR Finance)

To be excluded, the user must match any populated exclusion field.

### Multiple items within one field

**OR logic within a single field category**, regardless of whether it's Inclusion or Exclusion:

| Example | Expression |
|---|---|
| Locations: San Jose, Los Angeles (inclusion) | (San Jose OR Los Angeles) |
| User Groups: Group B, Group C (inclusion) | (Group B OR Group C) |
| Combined: Locations + Groups (inclusion) | (San Jose OR Los Angeles) AND (Group B OR Group C) |

### Combining inclusion + exclusion

Exclusion is **evaluated first**:

> Probing: User Group: Group B, Location: California. Exclusion: Department: Finance, Location: San Jose.
>
> Expression: NOT (Finance OR San Jose) AND (Group B AND California)

So a user in Group B, located in California, Finance department → excluded (Finance matches exclusion).
A user in Group B, located in San Jose → excluded (San Jose matches exclusion).
A user in Group B, located in LA, Engineering → probed (inclusion matches, no exclusion match).

### Practical guidance

- **OR expands results.** Adding multiple items in one field makes the probe target more users.
- **AND reduces results.** Adding a new field category narrows the target.
- **Inclusion + exclusion together is narrowest.** Stacks both reductions.
- **If a probe reports no data**, check whether the criteria accidentally excluded everyone — simplify and re-check.

## Edge cases

- **Synthetic probe traffic shows up in ZIA logs as regular Web requests** (minus the SSL inspection detail). Operators filtering for user activity should account for probe traffic; a heuristic is to filter out requests to probe URLs that match the configured probe targets.
- **Web probes against a URL that blocks at SNI (pre-decrypt)**: probe returns 0 availability. Since SSL inspection is skipped for probes, the block is SNI-level — which URL Filtering does pre-decrypt anyway. Probe result is accurate but potentially confusing ("I allow this URL in URL Filter but probe says unreachable" — check the SNI-level match, not the full-URL rule).
- **Cloud Path probes on mobile networks (LTE/5G)** may show highly variable hop counts and latency as the cellular backbone reroutes. Expect noise; look at standard deviation, not absolute values.
- **Probe frequency is 5 minutes**, not configurable at the help-doc-visible surface. High-fidelity investigations require Diagnostics Sessions (1-minute resolution) rather than probe data.
- **Zscaler Hosted Probes** are a separate probe type (mentioned in the Related Articles list of *About Probes* and *Managing Zscaler Hosted Probes*) where Zscaler runs the probe on its own infrastructure rather than the customer's ZCC. Useful for apps users don't actively access but the org wants to monitor. Not deep-dived here.
- **Adaptive Mode** (referenced in Related Articles) dynamically adjusts probing behavior — documented separately. Not yet captured.

## Open questions

- Exact probe frequency in Diagnostics Sessions (help doc says "updated session data every minute" but per-probe cadence during a session isn't specified) — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md).
- Whether probe results are retained indefinitely or aged out, and at what granularity.
- How Adaptive Mode affects scoring — is the score comparable across different probe cadences?

## Cross-links

- ZDX Score (how probe metrics aggregate into the headline number) — [`./overview.md § ZDX Score`](./overview.md)
- Diagnostics Sessions (minute-resolution probing for a specific device) — [`./diagnostics-and-alerts.md`](./diagnostics-and-alerts.md)
- SSL Inspection (ZDX probes bypass it) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
