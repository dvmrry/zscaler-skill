---
product: shared
topic: "primer-zero-trust"
title: "Primer — zero trust mental model"
content-type: primer
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
audience: "non-networking professional who needs to reason about Zscaler"
---

# Primer — zero trust mental model

"Zero Trust" is the architectural philosophy underneath Zscaler's whole product line. Without understanding it, the products feel like a random collection; with it, they're a coordinated implementation of one big idea.

## The traditional model: castle and moat

Pre-zero-trust, security was perimeter-based:

- Build a strong **outer perimeter** (firewall, VPN concentrator, DMZ).
- Once inside the perimeter, everyone is trusted.
- Apps inside the corporate network assume the requester is authenticated by virtue of being on the inside.

This worked when everyone was in offices, apps lived in corporate data centers, and laptops never left the building. It stopped working when:

- Apps moved to SaaS (no perimeter to put them inside).
- Users went mobile (laptops on hotel Wi-Fi shouldn't be trusted automatically).
- Insider threats became prominent (one compromised user inside the perimeter = full access).
- Lateral movement became the standard attack pattern (breach one machine, pivot through the trusted internal network).

## The zero-trust shift

Zero Trust says: **trust nothing implicitly. Verify every connection. Authorize per resource. Assume the network is hostile.**

Three principles:

1. **Verify explicitly.** Every connection authenticates and authorizes against the user's identity, device posture, and request context. No "you're inside the firewall" shortcut.

2. **Apply least privilege.** Each user gets access to specific apps they're authorized for, not "the network." Knowing that `bob@company.com` can SSH to a jump host doesn't mean Bob can ping every other server.

3. **Assume breach.** Build the architecture as if the attacker is already inside somewhere. Limit blast radius via segmentation; detect lateral movement; rotate credentials; record sessions.

## Concrete consequences

| Castle-and-moat | Zero trust |
|---|---|
| User connects to corporate VPN, gains network-level access | User authenticates per-app, gets app-specific tunnel |
| Internal apps trust the network they're on | Apps require valid identity + device + posture for every request |
| One firewall is the security boundary | Security is enforced at every connection |
| Laptops in offices = trusted; laptops at coffee shops = untrusted | Same enforcement everywhere; trust is verified, not assumed |
| Compromised insider has wide access | Compromised insider has access to only what their identity allows |
| Lateral movement uses internal network | Lateral movement is gated by per-resource policy |

## How Zscaler implements this

The product line maps onto zero-trust principles directly:

### Identity (verify explicitly)
- **ZIdentity** — unified identity layer; every connection identifies a user.
- **Step-up authentication** — re-verify when a session crosses a trust boundary.
- **Posture profiles** — device-state checks (encryption, AV running, OS version) as part of "verify explicitly."

### Per-resource authorization (least privilege)
- **ZPA** — users authenticate per-app, not per-network. Each app segment has its own access policy.
- **AppProtection** — even authorized users have their traffic inspected for attack patterns; authentication ≠ unconditional trust.
- **PRA** — privileged access (RDP / SSH / VNC) gated through approval workflows + session recording. Even admins don't get implicit trust.

### Inspection everywhere (assume breach)
- **ZIA** — every web/internet connection inspected for malware, DLP violations, threats.
- **Sandbox** — files inspected before delivery to user.
- **Deception** — decoys catch attackers post-perimeter (assumes they're already inside).
- **ITDR / Identity Protection** — detects credential theft and identity attacks.

### Segmentation (limit blast radius)
- **ZPA app segmentation** — each app is its own segment with its own policy. Compromising one user's access to one app doesn't expose others.
- **ZMS (Workload Microsegmentation)** — east-west traffic between servers also requires per-flow policy (out of scope of this skill but worth knowing about).

### Visibility + response
- **ZDX** — observability of user experience (catches subtle issues that broad metrics miss).
- **Risk360** — quantifies risk; tracks if zero-trust posture is improving.
- **NSS / LSS** — every event flows to SIEM for correlation.
- **ZWA** — incident response workflow.

## What zero trust is NOT

Useful negative space:

- **Not a single product.** It's an architecture. Zscaler implements it; so do other vendors with different products. Don't conflate "zero trust" with "Zscaler."
- **Not the absence of trust.** It's *verified* trust per connection, not zero trust in the casual sense. The name is misleading.
- **Not impossible to bypass.** Misconfigured zero-trust policies have escape hatches. Implementation matters more than the label.
- **Not just for remote work.** Zero trust applies inside the office, inside the data center, between cloud workloads. "Remote access without VPN" is one application of it.
- **Not perimeter-free.** Zero trust still has perimeters; they're just at every resource boundary instead of just at the network edge.
- **Not a quick migration.** Castle-and-moat → zero trust is multi-year for most enterprises.

## Where Zscaler products combine

A request from a user to a private application, in zero-trust shape:

```
1. User authenticates via ZIdentity (identity verification)
   → returns OAuth token or SAML assertion

2. ZCC checks device posture (encryption, AV, OS version)
   → passes posture profile to ZPA

3. User requests app FQDN
   → DNS returns ZPA Synthetic IP
   → ZCC routes the connection through Z-Tunnel + ZPA Microtunnel

4. ZPA Access Policy evaluates: identity + device posture + time + location
   → allow or deny

5. If allowed, AppProtection inspects the traffic
   → allow / block / redirect based on inline inspection

6. Connection arrives at App Connector inside customer environment
   → App Connector connects to actual application

7. Every request is logged via LSS
   → flows to SIEM (via NSS Cloud or VM-based LSS receiver)
```

Each step is a "verify explicitly" gate. None of them assume trust based on the previous.

## Cultural / organizational implications

Zero trust isn't only an architecture; it's an operating model:

- **Identity becomes infrastructure.** ZIdentity / Active Directory / Okta become as critical as the network itself.
- **Device hygiene becomes mandatory.** Posture checks gate access; users with out-of-compliance devices get reduced access (zero, sometimes degraded).
- **Per-app policy becomes the unit of work.** Rather than "give Bob VPN," it's "give Bob access to Salesforce with these conditions." Multiplied across hundreds of apps and thousands of users.
- **Remediation is automation.** Detect-and-react cycles get short. SIEM + SOAR + workflow automation become essential.
- **Audit becomes continuous.** Logs flow to compliance systems; risk dashboards (Risk360) become governance tools.

For a non-networking person joining a Zscaler-using team: the conceptual shift is "I'm not protecting a network. I'm protecting a graph of identity-resource relationships, each governed by policy."

## Cross-links

- Networking primer: [`./networking-basics.md`](./networking-basics.md)
- Forwarding paradigms (which transport zero-trust traffic uses): [`./proxy-vs-gateway-vs-tunnel.md`](./proxy-vs-gateway-vs-tunnel.md)
- Identity primer: [`./identity-saml-oidc.md`](./identity-saml-oidc.md)
- Zscaler platform shape: [`./zscaler-platform-shape.md`](./zscaler-platform-shape.md)
- Cross-product integrations (zero-trust hooks across the suite): [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Policy evaluation patterns (zero trust in practice): [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
