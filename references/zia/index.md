---
product: zia
topic: "zia-index"
title: "ZIA reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: reviewed
---

# ZIA reference hub

Entry point for Zscaler Internet Access (ZIA) questions. Pick the topic that matches the question shape; the files below cover a single topic each so Claude doesn't have to load everything at once.

## Topics

| Topic | File | Status |
|---|---|---|
| URL filtering rule precedence — first-match, specificity-wins, admin-rank ordering | [`./url-filtering.md`](./url-filtering.md) | draft |
| Cloud App Control and URL filtering interaction — CAC-wins-on-allow, cascading semantics | [`./cloud-app-control.md`](./cloud-app-control.md) | draft |
| SSL/TLS inspection — pipeline position, Do-Not-Inspect variants, transparent vs explicit forwarding | [`./ssl-inspection.md`](./ssl-inspection.md) | draft |
| Wildcard semantics — leading-period `.foo.com` vs exact form, 5-level subdomain depth, implicit right-wildcard | [`./wildcard-semantics.md`](./wildcard-semantics.md) | draft |
| Sandbox — Basic vs Advanced tiers, SSL-bypass dependency, quarantine edge cases, block-policy-type discriminator | [`./sandbox.md`](./sandbox.md) | draft |
| Malware Protection and Advanced Threat Protection — global cybersecurity policies (no rules, no scoping), Page Risk score, C2/phishing/XSS/country blocking, Blocked Malicious URLs, console-only diagnosis | [`./malware-and-atp.md`](./malware-and-atp.md) | draft |
| Data Loss Prevention (DLP) — dictionaries, engines, policy rules, file-size limits, ICAP/Incident-Receiver/C2C forwarding paths, pipeline gate for ZWA incidents | [`./dlp.md`](./dlp.md) | draft |
| **Locations, sublocations, Location Groups** — the forwarding-grouping primitive every ZIA rule scopes by; Manual vs Dynamic groups, the `other` sublocation, XFF, predefined Corporate/Guest/IoT/Server/Workload groups | [`./locations.md`](./locations.md) | draft |
| **Firewall Control** — Firewall Filtering + NAT + DNS + IPS sub-policies, Basic vs Advanced licensing, 5 actions including `EVAL_NWAPP`, ATP-before-IPS evaluation order, Z-Tunnel-1.0/PAC gating, IPS default-block-all | [`./firewall.md`](./firewall.md) | draft |
| **Bandwidth Control** — Bandwidth Classes + rules, contention-driven enforcement, per-location toggle, 245-class / 8-with-domains / 25K-domain caps, orphan-class default-rule inheritance, sublocation-isn't-isolation gotcha | [`./bandwidth-control.md`](./bandwidth-control.md) | draft |
| **Content inspection extras — FTP / File Type / SSH** — FTP Control (Firewall-module, passive-only, FTP-over-HTTP default-deny), File Type Control (Web-module, extension + MIME + archive + active-content, 400MB scan cap), SSH (no content inspection — L4-only; PRA is the answer) | [`./content-inspection-extras.md`](./content-inspection-extras.md) | draft |
| **Tenant Profiles** — named corporate-tenant identifiers for SaaS apps; used by CAC to allow corporate M365/Google Workspace/Slack while blocking personal tenants; header-injection mechanic; SSL inspection prerequisite; per-app variation (16 apps); YouTube/AWS explicit-block gotcha | [`./tenant-profiles.md`](./tenant-profiles.md) | draft |
| **Authentication Policy** — auth gate before all other policy; SAML / Hosted DB / Kerberos methods; frequency model (Always / Daily / Weekly / Monthly / Custom); Surrogate IP binding + TTL; auth-required toggle per location/sublocation; exemption lists; step-up via ZIdentity | [`./authentication.md`](./authentication.md) | draft |
| **Traffic forwarding methods — GRE / IPsec / PAC / ZCC** — how traffic gets INTO ZIA; static-IP/UFQDN credential model, GRE MTU/bandwidth/HA, IPsec credential object, PAC limits/auth-challenges, ZCC tunnel-mode summary, decision tree for choosing among the four | [`./traffic-forwarding-methods.md`](./traffic-forwarding-methods.md) | draft |
| **Forwarding Control + Source IP Anchoring (SIPA)** — egress routing after inspection (ZPA / DIRECT / DROP / PROXYCHAIN), SIPA mechanics (connector-as-egress for IP allowlisting), ZPA Gateway config, SIPA Direct DR mode, Z-Tunnel-1.0 gating, ZPA-side prerequisites | [`./forwarding-control.md`](./forwarding-control.md) | draft |
| ZIA API — endpoints, authentication, response shapes relevant to this skill | [`./api.md`](./api.md) | draft |
| **Snapshot schema** — what's in `snapshot/zia/*.json`, top-level shapes, common jq queries, wire-format gotchas | [`./snapshot-schema.md`](./snapshot-schema.md) | draft |
| **SaaS app + browser quirks** — root-cause catalog (cert pinning / CA-bundle pinning / auth-bypass / source-IP+CA / CDN bypass anti-pattern / QUIC / tenant-restriction silent break). Operator-facing; cross-links to ssl-inspection, tenant-profiles, source-ip-anchoring | [`./saas-app-quirks.md`](./saas-app-quirks.md) | draft |

## Log schemas

Field-level reference for ZIA log streams. Derived directly from Zscaler's published NSS output format CSVs.

| Schema | File | Status |
|---|---|---|
| Web logs — URL requests, category applied, rule hit, action, SSL state | [`./logs/web-log-schema.md`](./logs/web-log-schema.md) | draft |
| Firewall logs — L4 flows, firewall rule hits, IPS detections, NAT | [`./logs/firewall-log-schema.md`](./logs/firewall-log-schema.md) | draft |
| DNS logs — resolution events, request/response rules, DNS gateway state | [`./logs/dns-log-schema.md`](./logs/dns-log-schema.md) | draft |

For SPL patterns scoped to Zscaler questions, see [`../shared/splunk-queries.md`](../shared/splunk-queries.md). For *when* to query logs at all, see [`../shared/log-correlation.md`](../shared/log-correlation.md).

## When the question spans multiple topics

Start at [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md) for the cross-feature mental model, then descend into the specific topic file.
