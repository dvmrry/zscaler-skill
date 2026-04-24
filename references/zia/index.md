---
product: zia
topic: "zia-index"
title: "ZIA reference hub"
content-type: reference
last-verified: "2026-04-23"
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
| ZIA API — endpoints, authentication, response shapes relevant to this skill | [`./api.md`](./api.md) | stub |

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
