---
product: shared
topic: "source-ip-anchoring"
title: "Source IP Anchoring (SIPA) — preserve organization-controlled source IP via ZPA App Connector"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zia/understanding-source-ip-anchoring"
  - "vendor/zscaler-help/understanding-source-ip-anchoring.md"
  - "https://help.zscaler.com/zpa/understanding-source-ip-anchoring-direct"
  - "vendor/zscaler-help/understanding-source-ip-anchoring-direct.md"
  - "https://help.zscaler.com/zia/configuring-source-ip-anchoring"
  - "vendor/zscaler-help/configuring-source-ip-anchoring.md"
  - "https://help.zscaler.com/zia/configuring-forwarding-policies-source-ip-anchoring-using-zpa"
  - "vendor/zscaler-help/configuring-forwarding-policies-source-ip-anchoring-using-zpa.md"
  - "vendor/zscaler-help/About_Access_Policy.pdf"
author-status: draft
---

# Source IP Anchoring (SIPA)

A ZIA + ZPA cross-product feature that forwards ZIA-processed internet traffic through a **ZPA App Connector** before delivery to the destination, so the destination sees the App Connector's IP address (customer-controlled) instead of Zscaler's Public Service Edge IP. Used for SaaS destinations that apply source-IP-based identity or allowlisting (Office 365 Conditional Access, banking / financial service providers, legacy apps with IP-allow-only auth).

## Summary

- **Traffic flow**: `client → ZIA Public Service Edge (inspection) → ZIA Forwarding Control rule (Method = ZPA) → ZPA Gateway → ZPA App Connector → destination`.
- **Destination-visible source IP** = the ZPA App Connector's IP (customer-deployed VM), not the ZIA PSE's.
- **Licensing**: SIPA subscription is separate. A **ZPA license is NOT required** to use SIPA — operators can deploy App Connectors purely as SIPA egress points without holding a ZPA entitlement.
- **Two variants:**
  - **SIPA (standard)** — routes via Client Forwarding Policy with `Bypass ZPA` for non-ZIA-Service-Edge clients + `Forward to ZPA` for the ZIA Service Edge client.
  - **SIPA Direct** — fallback config for when ZIA is in disaster recovery mode. Flips Client Forwarding actions so ZCC clients also forward to ZPA directly. Must be manually reverted when DR ends.
- **Multi-product setup**: ZPA Admin Portal (App Segments + Client Forwarding Policy + Access Policy) AND ZIA Admin Portal (Forwarding Control + DNS Control + ZPA Gateway config) must be configured in tandem. Most SIPA failures are one side mis-configured while the other is correct.

## Why SIPA exists — the use-case motivation

Legacy applications, regulatory SaaS services, and most notably **Microsoft 365 Conditional Access** support authentication patterns that require the destination to trust the source IP address. In a normal Zscaler deployment, traffic egresses from Zscaler's Public Service Edge IPs (shared infrastructure across many tenants). This is a problem when:

- The destination has a **static allowlist of customer-owned IPs**.
- Compliance requires traffic to **originate from a corporate-owned IP range**.
- The destination uses source-IP-based **location trust signals** for conditional access.

SIPA solves this by sending the "last hop" through a customer-deployed App Connector VM whose IP is under customer control.

## Mechanics

### Traffic flow

Normal ZIA (no SIPA):

```
Client ──► ZIA Public Service Edge ──► destination
                                   ▲
                                   └── destination sees the PSE's public IP
```

SIPA:

```
Client ──► ZIA Public Service Edge ──► ZPA Gateway ──► ZPA App Connector ──► destination
                                                                         ▲
                                                                         └── destination sees
                                                                             the App Connector's
                                                                             customer-controlled IP
```

Key property: **ZIA inspection still happens first**. SIPA doesn't bypass ZIA — it changes the egress IP only. All ZIA policy modules (URL Filter, CAC, SSL Inspection, DLP, Malware Protection, ATP, File Type Control, IPS, Sandbox, Firewall Filtering) evaluate normally before the forwarding-method decision routes the already-inspected packet to the ZPA App Connector.

### Configuration chain — ZPA side

Per *Configuring Source IP Anchoring*:

**App Segment** — create the segment representing the destination:

- Enable **`Source IP Anchor`** option on the segment config. This is the on-off flag. Without it, none of the rest works.
- Set **Bypass field** to `Use Client Forwarding Policy`. This tells ZCC not to handle this segment directly; let the Client Forwarding Policy decide.
- **Configure separately per app type** — domain-based vs IP-based apps take different rule shapes below. A segment is one or the other, not both.

**Client Forwarding Policy** — determines what happens when a ZCC-connected client (or ZIA Service Edge acting as client) tries to reach the segment:

| Application type | Rule |
|---|---|
| IP-based | Single rule: Action = `Only Forward Allowed Applications` scoped to the Source-IP-Anchoring Segment Groups. |
| Domain-based | Two rules. Rule 1: Action = `Bypass ZPA` for the SIPA Segment Groups, client types **except** `ZIA Service Edge`. Rule 2: Action = `Forward to ZPA` for the SIPA Segment Groups, client type **only** `ZIA Service Edge`. |

The asymmetry exists because for domain-based apps, ZCC clients should go direct (not through ZPA), while ZIA-Service-Edge-initiated traffic (which is what SIPA produces) should be forwarded to ZPA. IP-based apps have simpler routing because ZCC's DNS hijack doesn't apply to raw IPs.

**Access Policy** — determines who can reach the segment once forwarding lands it in ZPA:

| Application type | Rule |
|---|---|
| IP-based | Two rules. Rule 1: `Block Access` for all client types **except** `ZIA Service Edge`. Rule 2: `Allow Access` for **only** `ZIA Service Edge`. Rule 1 exists to prevent ZCC from being able to reach these apps directly — SIPA apps are intended to be reachable only through the SIPA flow. |
| Domain-based | One rule: Allow access for the `ZIA Service Edge` client type to the domain-based SIPA application. |

**Critical gotcha**: if SIPA traffic is scoped to specific users via ZIA user/SAML/SCIM attributes, **don't add user-based SAML/SCIM criteria to the ZPA Access Policy rule** (per the help article's warning). The user matching is already done at the ZIA layer; duplicating it at the ZPA layer can cause traffic to be blocked on the ZPA side because ZPA sees the ZIA Service Edge as the client identity, not the original user.

### Configuration chain — ZIA side

**Forwarding Control rule** — at `Policy > Forwarding Control`, create a rule with:

- `Forwarding Method = ZPA` (the rule forwards traffic to a ZPA App Connector through the ZPA gateway).
- `Application Segment` criteria = the SIPA-enabled App Segments.
- `Forward to ZPA Gateway` dropdown = a ZPA Gateway (must be configured first; see below).

Criteria match like any ZIA Forwarding Control rule (Location, User, Source IP, etc.). Rule order is top-down, first-match-wins.

**ZPA Gateway** — create at `Administration > ZPA Gateway` (or equivalent) as a named reference to the ZPA tenant. ZIA Forwarding Control rules select a ZPA Gateway to forward to.

**DNS Control rules** — enable pre-configured DNS rules so ZIA's DNS resolution returns the ZPA Synthetic IP for SIPA destinations:

- **`ZPA Resolver for Road Warrior`** — for remote users (road warriors). **Enable this.**
- **`ZPA Resolver for Locations`** — for users on corporate locations. **Enable this.**

Rule order matters: `ZPA Resolver for Road Warrior` **must be higher in rule order than** `ZPA Resolver for Locations`. Per the help doc, if Road Warrior is rule 4, Locations should be rule 5 or later. If reversed, road-warrior traffic falls into the Locations pool and egresses through the wrong IP range.

**Zscaler's explicit warning**: don't disable the `ZPA Resolver for Road Warrior` rule. If disabled, road-warrior SIPA traffic routes via the Locations IP pools → wrong egress → destination sees the wrong IP → SIPA intent defeated silently.

**Z-Tunnel 1.0 compatibility**: SIPA for Z-Tunnel 1.0 traffic requires `Administration > Advanced Settings > Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` to be enabled. Without it, Z-Tunnel 1.0 users don't get SIPA forwarding applied.

### ZIA policies that can scope to SIPA traffic

SIPA-anchored traffic is visible to (and can be scoped by) these ZIA policy modules:

- DLP Policy (with or without content inspection)
- File Type Control
- Firewall Filtering
- IPS Control
- Sandbox
- SSL Inspection

Useful for: "DLP-scan all M365 uploads and egress through our corporate IP for Conditional Access." Creates a composed policy: ZIA inspects, ZPA delivers with the corporate IP, M365 Conditional Access accepts.

## SIPA Direct — disaster-recovery variant

From *Understanding Source IP Anchoring Direct*: when ZIA is in disaster recovery (unreachable or impaired), SIPA's default flow breaks because ZIA Service Edge isn't available to initiate forward-to-ZPA traffic.

**SIPA Direct** is a **configuration switch** for Client Forwarding Policy and Access Policy that lets ZCC clients forward directly to ZPA (bypassing the normal "ZIA Service Edge forwards" flow):

| Rule | Standard SIPA | SIPA Direct |
|---|---|---|
| Domain-based Client Forwarding | `Bypass ZPA` for ZCC clients; `Forward to ZPA` for ZIA Service Edge | `Forward to ZPA` for **both** ZCC and ZIA Service Edge |
| IP-based Client Forwarding | `Only Forward Allowed Applications` | `Forward to ZPA` |
| Access Policy | Allow only `ZIA Service Edge` client | Allow **ZCC clients** to access too |

**Constraints that break SIPA Direct:**

- Access Policy rules that block ZCC clients anywhere in the policy chain prevent Direct mode from working.
- Access Policy rules that cause Default Rule to fire block Direct mode.

**Operational implication**: SIPA Direct is not a drop-in fallback — it requires pre-planning. Operators should have an Access Policy rule that **explicitly allows ZCC-client access** to SIPA apps so that Direct mode works when needed. Otherwise the tenant discovers during a DR event that their SIPA flow can't fail over.

**When DR ends**, the configurations must be reverted manually — not automatic. Operator runbook should include "revert SIPA Direct config" as a post-DR step.

## Mutually-exclusive features

SIPA cannot coexist with several ZPA segment features. From `references/zpa/app-segments.md`:

- **Browser Access** — a SIPA segment can't also be a Browser Access segment.
- **Double Encryption** — SIPA segments can't have Double Encryption enabled.
- **Multimatch** (`match_style = INCLUSIVE`) — SIPA segments must be `EXCLUSIVE`. Save-time validation rejects the combination.

These mutual exclusions live in the `match_style` / `double_encrypt` validation rules. Operators planning SIPA should architect segments accordingly from the start — converting a Multimatch-enabled segment to SIPA requires disabling Multimatch first (which may impact other traffic).

## ICMP limitations

SIPA supports ICMP for ICMP-enabled ZPA App Segments, but with constraints:

- **Only ICMP echo requests/responses.** Other ICMP types (destination unreachable, time exceeded, etc.) don't work through SIPA.
- **No traceroute.** The ICMP protocol traceroute functionality is not supported. Use ZDX for path tracing instead (see [`../zdx/probes.md § Cloud Path`](../zdx/probes.md)).
- **990-byte ICMP payload cap.** Larger ICMP payloads get dropped.

## Unsupported protocols

- **RTSP (Real Time Streaming Protocol)** — explicitly not supported. SIPA cannot carry RTSP streams; apps requiring RTSP must use a different path.

## Policy footguns

### Country-code matching uses the wrong IP

Per *About Access Policy* p.2 (and codified in `references/zpa/policy-precedence.md`): ZPA country-code criterion uses the **last NATed layer-3 public IP**. For SIPA traffic, that's the **ZIA Public Service Edge's IP**, not the user's original IP.

Consequence: a ZPA Access Policy rule that scopes by "user in country X" misfires for SIPA users because the policy sees the ZIA PSE's country, not the user's actual country. A user in Singapore accessing a SIPA app via an ZIA PSE in Tokyo would be evaluated as "in Japan" by that rule.

See [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for the country-code criterion general description.

### SSL Inspection criterion filters to SIPA-enabled segments

The ZIA SSL Inspection rule's `zpa_app_segments` criterion **only lists ZPA segments that have `Source IP Anchor` enabled**. Operators expecting to see all their ZPA segments in the SSL rule dropdown will miss the non-anchor-enabled ones silently.

This cross-product filter is a deliberate design choice — SSL inspection scoped to ZPA segments only makes sense when the segment is serving SIPA traffic (which ZIA can see), not pure-ZPA traffic (which doesn't flow through ZIA's SSL pipeline). Non-obvious to operators who don't realize SIPA is a prerequisite.

See [`../zia/ssl-inspection.md § Rule criteria`](../zia/ssl-inspection.md) for the ZIA-side description.

### DNS resolution correctness

The SIPA flow relies on ZIA's DNS rules returning ZPA Synthetic IPs. If the client's DNS resolver is not Zscaler's DNS (e.g., the endpoint is using public 8.8.8.8 instead of Zscaler's DNS for UDP traffic), DNS resolution returns the real destination IP and traffic bypasses SIPA entirely.

**Best practice** (from the help doc): forward all DNS requests for SIPA-target domains to the Zscaler service so the predefined ZPA DNS Resolver rules take effect.

## Diagnostic workflow for "SIPA isn't working"

When SIPA traffic appears to exit with the wrong source IP (Zscaler PSE IP visible at destination instead of App Connector IP):

1. **Verify ZPA App Segment has `Source IP Anchor` enabled.** Without this flag, the rest of the config doesn't engage.
2. **Verify ZPA Client Forwarding Policy rules match the IP-based-vs-domain-based pattern correctly.** Mismatched action types here are the most common config error.
3. **Verify ZPA Access Policy allows `ZIA Service Edge` client type.** If only ZCC client types are allowed, SIPA traffic gets denied on the ZPA side.
4. **Verify ZIA Forwarding Control rule has `Forwarding Method = ZPA`** and points at the correct ZPA Gateway + Application Segment.
5. **Verify ZIA DNS Control rules `ZPA Resolver for Road Warrior` and `ZPA Resolver for Locations` are enabled** in the correct rule-order.
6. **Verify DNS routing** — the client's DNS is going through Zscaler, so the ZPA Synthetic IPs get returned.
7. **Verify Z-Tunnel 1.0 compatibility toggle** (if any users are on Z-Tunnel 1.0): `Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` is on.
8. **If ZIA is under disaster recovery**: flip to SIPA Direct config; otherwise SIPA stops working during the DR window.

## Open questions

- **Whether SIPA forwarding loops on itself**: if a SIPA-forwarded request's destination is itself behind another SIPA-forwarded segment, does ZIA detect the loop? Not documented.
- **Exact behavior when ZPA App Connector is down**: does traffic fall back to non-SIPA egress, or fail? Help doc doesn't explicitly say.
- **Multi-Connector scale/selection**: with multiple App Connectors in the target group, how does ZPA choose which one handles a given SIPA flow? Typical ZPA nearest-Connector selection, presumably — not confirmed for SIPA specifically.

## Cross-links

- ZPA application segments (where the `Source IP Anchor` flag lives) — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- ZPA policy precedence (country-code footgun, client-type criteria) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZIA SSL Inspection (the `zpa_app_segments` criterion filters to SIPA-enabled segments) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- Cross-product integrations (silent-miss catalog) — [`./cross-product-integrations.md`](./cross-product-integrations.md)
- ZPA App Connector (the VM that terminates SIPA traffic) — `references/zpa/app-segments.md` references App Connector Group conceptually
- Cloud Architecture (shared platform context) — [`./cloud-architecture.md`](./cloud-architecture.md)
