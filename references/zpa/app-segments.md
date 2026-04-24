---
product: zpa
topic: "zpa-app-segments"
title: "ZPA application segment matching"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zpa/configuring-defined-application-segments"
  - "vendor/zscaler-help/Configuring_Defined_Application_Segments.pdf"
  - "https://help.zscaler.com/zpa/about-application-access"
  - "vendor/zscaler-help/Understanding_Application_Access.pdf"
  - "https://help.zscaler.com/zpa/using-app-segment-multimatch"
  - "vendor/zscaler-help/Using_Application_Segment_Multimatch.pdf"
  - "https://www.zscaler.com/resources/reference-architectures"
  - "vendor/zscaler-help/zpa-user-to-app-segmentation-refarch.pdf"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment.md"
  - "vendor/terraform-provider-zpa/docs/resources/zpa_application_segment_multimatch_bulk.md"
author-status: draft
---

# ZPA application segment matching

How ZPA picks which application segment handles a request when two or more segments cover the same destination.

## Summary

From *Configuring Defined Application Segments*, p.10:

> When two or more application segments cover the same destination address, Zscaler Client Connector attempts to match traffic to the more granular application segment. If there is no match in this application segment, Zscaler Client Connector bypasses Private Access and sends traffic directly.

So the default matching rule is **most-specific-segment-wins**, evaluated client-side by Zscaler Client Connector. And — critically — **failure to match within the selected segment causes a direct bypass**, not fallback to a less-specific segment.

Multimatch (opt-in) changes this: a segment in `INCLUSIVE` mode allows a request to match multiple segments simultaneously. Segments in the default `EXCLUSIVE` mode match only one at a time.

Separate precedence rules apply to the **Bypass** setting: if a segment containing the FQDN has `Bypass = Always`, that segment's bypass takes priority over any client forwarding policy rule.

## Mechanics

### What defines an application segment

Per *Configuring Defined Application Segments* pp.1–16, the core fields:

| Field | Meaning | Source |
|---|---|---|
| `domain_names` | FQDN, IP, local domain, or wildcard (e.g., `*.safemarch.com`). Hyphenated IP ranges not allowed. | p.3 |
| `tcp_port_ranges` / `udp_port_ranges` | Ports the segment covers. | p.11 |
| `segment_group_id` | The segment group the segment belongs to (for policy references). | p.17 |
| `server_groups` | The server groups hosting the applications. | pp.18–20 |
| `health_reporting` | `ON_ACCESS`, `CONTINUOUS`, or `NONE`. | p.15 |
| `bypass_type` | `Use Client Forwarding Policy` (default), `Always`, `On Corporate Network`. | p.12 |
| `is_cname_enabled` | Whether App Connectors send CNAME DNS records. | p.16 |
| `match_style` | `EXCLUSIVE` (default) or `INCLUSIVE` (Multimatch). | `zpa_application_segment_multimatch_bulk.md` |

TF example (from `zpa_application_segment.md`):

```terraform
resource "zpa_application_segment" "this" {
  name              = "Example"
  enabled           = true
  health_reporting  = "ON_ACCESS"
  bypass_type       = "NEVER"
  is_cname_enabled  = true
  tcp_port_ranges   = ["8080", "8080"]
  domain_names      = ["server.acme.com"]
  segment_group_id  = zpa_segment_group.this.id
  server_groups { id = [zpa_server_group.this.id] }
}
```

### SDK-visible fields not surfaced in help docs

A few fields live at the API/TF level but are absent from or under-documented in the help articles. Relevant when reading snapshot JSON or writing policy about segments programmatically.

- **`enabled` defaults to `True`** on newly-constructed segment objects (`zscaler/zpa/models/application_segment.py:41`). Help docs don't highlight this; a caller who forgets to set `enabled` ends up with a live segment, not a draft. When auditing "why is this segment active?", don't assume the author explicitly turned it on.
- **Dual port-range formats coexist:**
  - `tcp_port_ranges` / `udp_port_ranges` — list of strings, e.g. `["80", "8080-8090"]` (the field name the TF provider uses)
  - `tcp_port_range` / `udp_port_range` — list of `{from, to}` dicts
  - SDK `request_format()` sends both (`zscaler/zpa/models/application_segment.py:90-107`). Different endpoints may prefer one or the other; both are tolerated. In snapshot JSON, you may see the same ports emitted twice in two formats.
- **`inspect_traffic_with_zia`** (bool, default `False`) — enables ZIA inline inspection for ZPA traffic at the segment level. This is the ZPA-side hook for ZIA+ZPA integration (distinct from ZIA's `zpa_app_segments` on SSL inspection rules, which operates the reverse direction). When a request touches both products, check both toggles.
- **Governance flags** (server-assigned, appear across ZPA resources):
  - `read_only` — set by Zscaler-managed or microtenant-restricted objects. Cannot be modified by customer admins.
  - `zscaler_managed` — Zscaler owns this segment (e.g., Deception-configured). Edit/delete unavailable via API.
  - `restriction_type` — further microtenant-scope restriction indicator.
  - Treat any segment with `read_only=true` or `zscaler_managed=true` as immutable for skill answers.
- ⚠️ **`select_connector_close_to_app` is immutable.** TF marks it `ForceNew` (`resource_zpa_application_segment.go:197`): toggling connector-proximity routing on an existing segment **destroys and recreates the segment** at the API level. Applies to all segment variants (base, `_pra`, `_inspection`, `_browser_access`). Operationally: plan for access interruption when changing connector routing strategy.
- **`bypass_type` has three values, not two**: `ALWAYS`, `NEVER`, `ON_NET` (`resource_zpa_application_segment.go:83-87`). **`ON_NET`** (bypass only for on-network users) is undocumented in most help articles but is a valid API value — useful for hybrid on-network-vs-remote patterns.
- **`icmp_access_type` enum**: `PING_TRACEROUTING`, `PING`, `NONE` (default `NONE`) — controls ICMP behavior on the segment. Relevant when a question asks "why can I ping this app through ZPA?"
- **`tcp_keep_alive` is a string enum `"0"` / `"1"`, not boolean** (`:228-230`). Wire-format quirk: callers writing JSON payloads programmatically must send strings.
- **Go-SDK-only segment fields not surfaced in Python.** Cross-SDK sweep (2026-04-24) found these fields on `ApplicationSegmentResource` in Go (`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go`) that the Python SDK doesn't model. They appear in snapshot JSON for tenants using them:
  - **`bypassOnReauth`** — whether the segment bypasses ZPA on session re-authentication. Operationally significant: affects hybrid on-net/off-net users who re-auth mid-session (session flaps can briefly skip ZPA inspection).
  - **`extranetEnabled`** — extranet access toggle for the segment.
  - **`apiProtectionEnabled`** / **`autoAppProtectEnabled`** / **`adpEnabled`** — AppProtection and Application Data Protection-related flags.
  - **`weightedLoadBalancing`** — weighted balancing across App Connectors instead of default strategy.
  - **`fqdnDnsCheck`** — FQDN DNS-resolution health check on the segment.
  - **`healthCheckType`** — discriminates health-check strategies beyond the `health_reporting` enum.
  - **`policyStyle`** — finer-grained policy-style selector (undocumented enum).
  - **`zpnerId`** — Zscaler internal reference identifier.

  Callers scripting against the wire directly (HTTP or Go SDK) can set these; Python-SDK callers can only read them out of snapshot JSON.
- **Cross-microtenant Move and Share operations** are Go-SDK-only:
  - **`AppSegmentMicrotenantMove`** (`applicationsegment_move/` service) — `POST .../application/{id}/move`. Moves a segment from one microtenant to another.
  - **`AppSegmentMicrotenantShare`** (`applicationsegment_share/` service) — `PUT .../application/{id}/share`. Shares a segment across microtenant boundaries.
  - These pair with the `read_only` / `shared_from_microtenant` / `shared_to_microtenant` governance flags documented above. An operator asking "how do I move a segment to a different microtenant programmatically" needs the Go SDK or direct HTTP — Python SDK has no equivalent.

### Wildcard domain constraints

From *Configuring Defined Application Segments* p.3:

> You can also define the application with a wildcard only (i.e., `*`), but this should be the only application in the application segment. You can't define an application this way unless approved by Zscaler. Contact Zscaler Support for more information.

And p.15:

> You can't choose Continuous health reporting for applications configured with more than 10 ports or if any of the applications in the application segment are defined with only a wildcard (e.g., `*`).

## The specificity-wins rule (covers eval Q6)

From *Configuring Defined Application Segments* p.10 and *Understanding Application Access* p.1, the definitive rule:

> If two or more application segments cover the same destination address, Zscaler Client Connector attempts to match traffic to the more granular application segment. If there is no match in this application segment **for the destination port**, Zscaler Client Connector bypasses ZPA and sends traffic directly. (*Understanding Application Access*, p.1 — emphasis added.)

Key behavioral points:

1. **Matching runs client-side** in Zscaler Client Connector, not server-side in ZPA.
2. **Most-specific FQDN/IP wins.** Per *Using Application Segment Multimatch* p.9, specificity is ranked strictly on domain: `server1.db.hr.company.com` > `*.db.hr.company.com` > `*.hr.company.com` > `*.company.com` > `*.com`. IP equivalent: `/32` host > `/24` subnet. Port narrowness does not enter specificity.
3. **"No match" means port mismatch specifically** — the destination hostname resolved to the segment, but the destination port is not in the segment's `tcp_port_ranges` / `udp_port_ranges`. In that case Zscaler Client Connector bypasses ZPA and sends the traffic direct. **It does not fall back to a less-specific segment.**

### The "carved out" default behavior

From *Using Application Segment Multimatch* p.4:

> After a specific FQDN (Fully Qualified Domain Name) has been configured in an application segment, it is removed from the wildcard application segment by default. Even though `server1.example.com` is part of the `Wildcard_AS` application segment for the `*.example.com` application on the TCP port range of 54 to 65535, this access does not match the `Wildcard_AS` application segment.

So configuring a specific-FQDN segment **removes** that FQDN from any overlapping wildcard segment entirely — you can't define an FQDN and expect it to still fall through to the wildcard when ports don't match. This is the primary reason accidental direct-bypass happens on ZPA deployments.

Two fixes: (a) configure all needed ports in the specific segment; (b) enable Multimatch on the wildcard so it catches ports the specific segment doesn't cover.

### Worked example — port-mismatch footgun

From *Understanding Application Access* p.1:

- **Segment 1:** FQDN `*.example.com`, TCP 1-65535, UDP 1-65535.
- **Segment 2:** FQDN `www.example.com`, TCP 8843.

User requests `www.example.com:80`:

1. Most-specific match: Segment 2 wins (`www.example.com` > `*.example.com`).
2. Segment 2's port list does not include 80.
3. No match in Segment 2 for the destination port → **Zscaler Client Connector does not forward the request to ZPA**. The same *Understanding Application Access* page phrases this two ways: "Zscaler Client Connector bypasses ZPA and sends traffic directly" (client-perspective: the packet exits via the client's default route, not through ZPA) and "the client connection request is dropped by ZPA" (ZPA-perspective: ZPA never forwards the request to any App Connector). The two phrasings describe the same event — ZPA is out of the path for that request. **What happens to the traffic after** depends on the client's forwarding profile and network egress, which are outside ZPA's policy scope; whether the request succeeds against the destination directly, is blocked at a perimeter firewall, or never resolves is not determined by the app-segment config.
4. **Segment 1 is not consulted** — the request does not fall back to the less-specific segment.
5. The doc states this is resolved by opening TCP 80 on Segment 2, or by enabling Multimatch so the wildcard segment catches ports the specific segment doesn't cover.

### Bypass precedence

From *Configuring Defined Application Segments* p.12:

> The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule.

> If the same FQDN is defined in multiple application segments, and one of them has the Bypass setting set to Always, then that application segment takes precedence.

So for same-FQDN overlap resolution:

- If any covering segment has `bypass_type = Always` → that segment wins, and the client forwards direct.
- Otherwise, the most-granular-wins rule applies per above.

### Multimatch (INCLUSIVE mode)

From *Using Application Segment Multimatch* p.4:

> Multimatch allows admins to create new application segments without the risk of unwanted access failure if a user attempts to access a FQDN with undefined ports. After Multimatch is enabled, the wildcard application segment catches all UDP or TCP ports that are not configured in the more specific application segment.

Multimatch resolves the port-mismatch footgun by letting a wildcard segment catch ports the specific segment doesn't cover.

**Validation at config time, not traffic time.** From *Using Application Segment Multimatch* p.1:

> Private Access (ZPA) evaluates Multimatch across all application segments that include the same applications. When an administrator enables or disables Multimatch for an application segment, Private Access checks all other application segments that contains any overlapping domains to determine whether the change is allowed. If a domain is found in multiple application segments with different Multimatch settings, there is a conflict and the application segment cannot be updated.

So a mixed-style config (one segment INCLUSIVE, another EXCLUSIVE for the same domain) is rejected — you cannot get into that state.

**Multimatch specificity stack.** From *Using Application Segment Multimatch* p.9:

> Multiple matches apply to applications from most specific to least specific. As soon as an application is encountered that does not support Multimatch, the multimatching stops.

Concrete example (p.9, Example 1):

| Application | Multimatch | Match for `server1.db.hr.company.com`? |
|---|---|---|
| `*.db.hr.company.com` | Enabled | Matched |
| `*.ui.hr.company.com` | Disabled | Not matched |
| `*.hr.company.com` | Enabled | Matched |
| `*.company.com` | Disabled | Not matched |

When Multimatch is on across the specificity chain, multiple segments match. As soon as an `Disabled` segment is reached in the chain, descent stops.

**Policy evaluation under Multimatch.** From pp.5–8: with Multimatch enabled, the **access policy** search runs across all matched segments' rules. A block rule on a specific segment stops traffic even when the wildcard segment's rule would allow. Example from p.8: Rule 1 = Allow Server1_AS for Admin; Rule 2 = Block Server1_AS for All; Rule 3 = Allow Wildcard_AS for All. User `user3` (non-admin) requesting `server1.example.com:443` → matches Server1_AS + Wildcard_AS → Rule 2 Block fires first by top-down order → blocked.

**Multimatch prerequisites** (p.1):

- App Connectors or Private Service Edges on version 24.298.1+
- Zscaler Client Connector: Windows 4.6.0.282+ or 4.7.0.88+; macOS 4.5.2.98+; iOS 4.4.1+ (requires "Use Tunnel SDK Version 4.3 or above" setting); Android 3.10+; Linux 4.2+.

**Multimatch disallowed features** (*Configuring Defined Application Segments* p.16 + *Using Application Segment Multimatch* p.2):

> Multimatch must be disabled if the configuration contains applications using the Access Type of Browser Access, AppProtection, or Privileged Remote Access. Additionally, Multimatch must be disabled if the configuration contains applications using Double Encryption, Inspect Traffic with Internet & SaaS (ZIA), and Source IP Anchor.

Plus from *Configuring Defined Application Segments* p.16: "If Multimatch is enabled, Health Reporting on an app segment can only be set to On Access or None."

**IP-based Multimatch.** From *Using Application Segment Multimatch* pp.10–11, the same rules apply to IP subnets and individual IPs — a `/32` is carved out of a containing `/24` by default, and Multimatch restores the catch-fallthrough behavior for ports not defined on the `/32`.

## Edge cases

- **ICMP asymmetric aggregation.** From p.13: "If ICMP is enabled for a specific application in an application segment and the same application is disabled for ICMP in a different application segment, then Zscaler Client Connector considers ICMP enabled for that application and forwards the ICMP request to Private Access." — Cross-segment ICMP behavior is OR-aggregated, not most-specific-wins.
- **IdP application overlap.** From p.1: "If your IdP is defined as an application within an application segment, the Authentication Timeout for the IdP application must be set to Never. If an IdP domain overlaps with a domain configured for application discovery, you must bypass the IdP domain in Private Access (ZPA) to avoid user reauthentication failure."
- **CNAME propagation.** From p.16: the `is_cname_enabled` setting controls whether App Connectors return CNAME DNS records to Zscaler Client Connector. "This setting is not applicable for Browser Access applications, and Private Access functions as if the option is disabled. If Zscaler Client Connector is on a macOS or an iOS device and the application needs to be accessed by CNAME, it is best to disable this setting."
- **Browser Access segment constraints.** From p.11: "If you selected Browser Access for any application, the port range must include the port specified. If you selected Browser Access for any application, you must use TCP port ranges."
- **Double encryption mutual exclusion.** From p.12: "If you selected Browser Access or Source IP Anchoring for any application, you can't enable Double Encryption."
- **Source IP Anchor (SIPA) feature flag.** Enabling `Source IP Anchor` on a segment opts into the SIPA cross-product flow — ZIA-inspected traffic is forwarded to this segment's App Connector so the destination sees a customer-controlled IP (not a Zscaler PSE IP). Full mechanics (ZPA-side + ZIA-side dual config, DNS Resolver rule ordering, SIPA Direct variant for ZIA DR mode, licensing) in [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md). Mutually exclusive with Browser Access, Double Encryption, and Multimatch on the same segment. The SIPA flag is also the filter determining which ZPA segments appear in ZIA SSL Inspection rule's `zpa_app_segments` criterion — non-SIPA segments are invisible to that selector.
- **Health reporting + wildcard.** From p.15, cited above: `CONTINUOUS` health reporting is not allowed if any application in the segment is a bare `*` wildcard.

## Worked example (covers eval Q6)

Scenario: Two application segments both cover `foo.internal.corp`, which a user requests:

- **Segment A:** `domain_names = ["*.internal.corp"]`, `tcp_port_ranges = ["443"]`, `bypass_type = NEVER`, `match_style = EXCLUSIVE`.
- **Segment B:** `domain_names = ["foo.internal.corp"]`, `tcp_port_ranges = ["443"]`, `bypass_type = NEVER`, `match_style = EXCLUSIVE`.

Applying *Configuring Defined Application Segments* p.10:

1. Both segments cover the destination. Segment B's `foo.internal.corp` is "more granular" than Segment A's `*.internal.corp`.
2. Zscaler Client Connector picks Segment B.
3. If Segment B matches the port (443) — which it does — Segment B handles the request. Segment A does not evaluate.

Variation: user requests `foo.internal.corp:8080`:

1. Both segments still cover the destination hostname.
2. Most-granular rule picks Segment B.
3. Segment B does not cover port 8080 → "no match in this application segment" per p.10.
4. **Zscaler Client Connector bypasses Private Access and sends traffic directly** — it does not retry against Segment A.

Consequence: Segment A's wildcard coverage is effectively dead for any port unless the specific-FQDN segments below it explicitly open that port. This is the most common footgun with overlapping segments.

Variation: Segment A adds `bypass_type = Always`:

1. Per p.12, the segment with `Bypass = Always` takes precedence for shared-FQDN overlap.
2. Segment A wins; its Bypass setting fires. Request goes direct, does not reach ZPA.

Variation: both segments set `match_style = INCLUSIVE` (Multimatch):

1. Both segments match simultaneously. Access policy rules on both apply.
2. Per TF doc: "A domain can only be INCLUSIVE or EXCLUSIVE." — so this only works if both segments agree on the INCLUSIVE style for the overlap.

### Same-specificity collision (both segments claim `*.internal.corp`)

Scenario from eval Q6: two segments with **identical** `domain_names = ["*.internal.corp"]`, same `match_style`, neither with `Bypass = Always`. Specificity ranks strictly on FQDN shape, so neither is "more granular" than the other. The `p.10` rule ("ZCC attempts to match to the more granular segment") doesn't decide the tie.

The guard rails:

1. **Save-time validation likely blocks it.** *Using Application Segment Multimatch* p.1 says overlapping domains with mixed Multimatch settings are rejected. Two EXCLUSIVE segments with identical FQDNs hit the same save-time check per [`clarification zpa-03`](../_clarifications.md#zpa-03-multimatch-mixed-style-evaluation). If the tenant managed to save both, one of the Multimatch/save-time rules was bypassed or is newer than the segments.
2. **If both saved anyway**, the runtime tie-break is **not documented** — this is [`clarification zpa-04`](../_clarifications.md#zpa-04-same-fqdn-same-bypass-tie-break). Operator-observed behavior: ZCC picks one deterministically per session, but which one is unspecified.
3. **Bypass overrides specificity.** If one segment has `bypass_type = Always`, that segment wins regardless of the specificity tie — per p.12 above.
4. **Port-mismatch behavior still applies** inside the chosen segment: if the picked segment's ports don't cover the request, traffic drops/bypasses; it does not fall back to the other tied segment.

**Answer this question at `Confidence: medium`** — the mechanics above are solid, but the runtime tie-break (step 2) is unresolved until lab-tested; cite `zpa-04`.

## Open questions

- Same-FQDN, same-Bypass-setting tie-break — [clarification `zpa-04`](../_clarifications.md#zpa-04-same-fqdn-same-bypass-tie-break) (still open)

Resolved while writing this doc (answers preserved in `_clarifications.md`):

- "More granular" definition — [clarification `zpa-02`](../_clarifications.md#zpa-02-zpa-more-granular-definition) — most-specific FQDN wins, strictly on domain dimension.
- Multimatch mixed-style evaluation — [clarification `zpa-03`](../_clarifications.md#zpa-03-multimatch-mixed-style-evaluation) — rejected at config time, not reconciled at traffic time.
- "No match in segment" criteria — [clarification `zpa-05`](../_clarifications.md#zpa-05-no-match-in-segment-criteria) — specifically port mismatch; client drops the connection, no fallback to less-specific segment.

## Cross-links

- ZPA access policy precedence (the next layer — which segment is *allowed*) — [`./policy-precedence.md`](./policy-precedence.md)
- Cross-product policy evaluation — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
- LSS access log schema (for observational validation of which segment actually matched) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
