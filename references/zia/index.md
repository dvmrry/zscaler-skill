---
product: zia
topic: "zia-index"
title: "ZIA reference hub"
content-type: reference
last-verified: "2026-04-24"
verified-against:
  vendor/zscaler-help: 21dff098eac2abffb7f8dfdebd43a968971d6490
confidence: high
sources:
  - "vendor/zscaler-help/zia-about-backup-and-restore.md"
  - "vendor/zscaler-help/zia-release-upgrade-summary-2026-july.md"
  - "vendor/zscaler-help/zia-dedicated-ip-using-customer-owned-ip-addresses.md"
author-status: reviewed
---

# ZIA reference hub

Entry point for Zscaler Internet Access (ZIA) questions. Pick the topic that matches the question shape; the files below cover a single topic each so Claude doesn't have to load everything at once.

## Topics

| Topic | File | Status |
|---|---|---|
| URL filtering rule precedence — first-match, specificity-wins, admin-rank ordering | [`zia.url-filtering`](kb:zia.url-filtering) | draft |
| Cloud App Control and URL filtering interaction — CAC-wins-on-allow, cascading semantics | [`zia.cloud-app-control`](kb:zia.cloud-app-control) | draft |
| SSL/TLS inspection — pipeline position, Do-Not-Inspect variants, transparent vs explicit forwarding | [`zia.ssl-inspection`](kb:zia.ssl-inspection) | draft |
| Wildcard semantics — leading-period `.foo.com` vs exact form, 5-level subdomain depth, implicit right-wildcard | [`zia.url-categories.entry-matching`](kb:zia.url-categories.entry-matching) | draft |
| Sandbox — Basic vs Advanced tiers, SSL-bypass dependency, quarantine edge cases, block-policy-type discriminator | [`zia.sandbox`](kb:zia.sandbox) | draft |
| Malware Protection and Advanced Threat Protection — global cybersecurity policies (no rules, no scoping), settings API/SDK, Page Risk score, C2/phishing/XSS/country blocking, Blocked Malicious URLs, and log-based per-transaction diagnosis | [`zia.atp`](kb:zia.atp) | draft |
| Data Loss Prevention (DLP) — dictionaries, engines, policy rules, file-size limits, ICAP/Incident-Receiver/C2C forwarding paths, pipeline gate for ZWA incidents | [`zia.dlp`](kb:zia.dlp) | draft |
| **Locations, sublocations, Location Groups** — the forwarding-grouping primitive every ZIA rule scopes by; Manual vs Dynamic groups, the `other` sublocation, XFF, predefined Corporate/Guest/IoT/Server/Workload groups | [`zia.locations`](kb:zia.locations) | draft |
| **Firewall Control** — Firewall Filtering + NAT + DNS + IPS sub-policies, Basic vs Advanced licensing, 5 actions including `EVAL_NWAPP`, ATP-before-IPS evaluation order, Z-Tunnel-1.0/PAC gating, IPS default-block-all | [`zia.firewall`](kb:zia.firewall) | draft |
| **Bandwidth Control** — Bandwidth Classes + rules, contention-driven enforcement, per-location toggle, 245-class / 8-with-domains / 25K-domain caps, orphan-class default-rule inheritance, sublocation-isn't-isolation gotcha | [`zia.bandwidth-control`](kb:zia.bandwidth-control) | draft |
| **Content inspection extras — FTP / File Type / SSH** — FTP Control (Firewall-module, passive-only, FTP-over-HTTP default-deny), File Type Control (Web-module, extension + MIME + archive + active-content, 400MB scan cap), SSH (no content inspection — L4-only; PRA is the answer) | [`zia.ftp-control`](kb:zia.ftp-control) | draft |
| **Tenant Profiles** — named corporate-tenant identifiers for SaaS apps; used by CAC to allow corporate M365/Google Workspace/Slack while blocking personal tenants; header-injection mechanic; SSL inspection prerequisite; per-app variation (16 apps); YouTube/AWS explicit-block gotcha | [`zia.tenant-profiles`](kb:zia.tenant-profiles) | draft |
| **Authentication Policy** — auth gate before all other policy; SAML / Hosted DB / Kerberos methods; frequency model (Always / Daily / Weekly / Monthly / Custom); Surrogate IP binding + TTL; auth-required toggle per location/sublocation; exemption lists; step-up via ZIdentity | [`zia.authentication`](kb:zia.authentication) | draft |
| **Traffic forwarding methods — GRE / IPsec / PAC / ZCC** — how traffic gets INTO ZIA; static-IP/UFQDN credential model, GRE MTU/bandwidth/HA, IPsec credential object, PAC limits/auth-challenges, ZCC tunnel-mode summary, decision tree for choosing among the four | [`zia.traffic-forwarding`](kb:zia.traffic-forwarding) | draft |
| **Proxy modes — Explicit vs Transparent destination resolution** — how the Service Edge identifies the destination host once traffic arrives; CONNECT hostname (explicit) vs SNI / cert fallback (transparent); forwarding-method-to-proxy-mode mapping table; IP-category evaluation difference and its SSL bypass implications | [`zia.proxy-mode`](kb:zia.proxy-mode) | draft |
| **Forwarding Control, Dedicated IP/BYOIP + Source IP Anchoring (SIPA)** — egress routing after inspection (ZPA / DIRECT / DROP / PROXYCHAIN), Support-assisted customer-owned Dedicated IP prefixes, SIPA mechanics (connector-as-egress for IP allowlisting), ZPA Gateway config, SIPA Direct DR mode, Z-Tunnel-1.0 gating, ZPA-side prerequisites | [`zia.forwarding-control`](kb:zia.forwarding-control) | draft |
| **Private Service Edge (PSE)** — on-prem cluster architecture (N+1, LB active-passive/CARP, DSR), three cluster tiers (PSE 3 / PSE 5 Integrated LB / PSE 5 Dedicated LB with throughput ceilings), IP/NAT requirements (public IPs required, 1:1 NAT disables IPv6), open-proxy risk when adding locations, ZDX dependency for Health Dashboard | [`zia.private-service-edge`](kb:zia.private-service-edge) | draft |
| ZIA API — endpoints, authentication, response shapes relevant to this skill | [`./api.md`](./api.md) | draft |
| **SaaS app + browser quirks** — root-cause catalog (cert pinning / CA-bundle pinning / auth-bypass / source-IP+CA / CDN bypass anti-pattern / QUIC / tenant-restriction silent break). Operator-facing; cross-links to ssl-inspection, tenant-profiles, source-ip-anchoring | [`zia.saas-apps`](kb:zia.saas-apps) | draft |
| **DNS Control** — separate policy module inside Firewall; three predefined rules (UCaaS One Click + ZPA Resolver for Locations + ZPA Resolver for Road Warrior with rule-order requirement); DoH handling; DNS tunnel detection; NROD 2–36 hour categorization latency | [`zia.dns-control`](kb:zia.dns-control) | draft |
| **Workload Groups** — policy-scoping primitive used by URL Filtering / Firewall / SSL Inspection / DLP / Traffic Capture rules; tag-based expression model (`tagType` + `operator` + tag key/value); SDK + TF-derived (help portal page non-functional) | [`zia.workload-groups`](kb:zia.workload-groups) | draft |
| **Sublocations** — subdivisions of Locations; own bandwidth/auth settings; the `other` sublocation for uncategorized IPs; XFF header inheritance; sublocation count limits | [`zia.locations.sublocations`](kb:zia.locations.sublocations) | draft |
| **Time intervals** — reusable schedule objects referenced in URL Filtering / Firewall rules; granularity, overlap handling, timezone behavior | [`zia.time-intervals`](kb:zia.time-intervals) | draft |
| **Rule labels** — tagging construct for policy rule organization and API filtering; no effect on rule evaluation order; label-to-rule relationship | [`zia.rule-labels`](kb:zia.rule-labels) | draft |
| **VSE clusters** — Virtual Service Edge HA grouping; cluster membership; traffic distribution across VSE VMs; failover behavior | [`zia.virtual-service-edge.clusters`](kb:zia.virtual-service-edge.clusters) | draft |
| **Backup and Restore** — replacement semantics, 12-point retention, golden restore point behavior, and the EDM/IDM DLP exclusion | [`zia.backup-restore`](kb:zia.backup-restore) | draft |
| **IoT Report** — device-type classification and traffic visibility; IoT policy scoping; predefined IoT location groups | [`zia.iot`](kb:zia.iot) | draft |
| **API CASB** — out-of-band SaaS app scanning via OAuth/API (not inline); Insights logs; SaaS Security Posture; distinct from inline SSL-inspection CASB path | [`./api-casb.md`](./api-casb.md) | draft |
| **SCIM provisioning** — ZIA-specific SCIM behavior; group-to-department mapping; attribute constraints; SCIM endpoint differences from ZPA | [`zia.scim`](kb:zia.scim) | draft |
| **Admin audit logs** — ZIA admin change events; 6-month retention; available fields; query approach | [`zia.audit-logs`](kb:zia.audit-logs) | draft |
| **ZIA SDK** — service and method catalog (`client.zia.*`); Python and Go coverage; pagination helpers; activation wrappers | [`./sdk.md`](./sdk.md) | draft |
| **ZIA Terraform** — `zia_*` resource catalog; provider configuration; activation hook; known resource gaps | [`./terraform.md`](./terraform.md) | draft |

## Log schemas

Field-level reference for ZIA log streams. Derived directly from Zscaler's published NSS output format CSVs.

| Schema | File | Status |
|---|---|---|
| Web logs — URL requests, category applied, rule hit, action, SSL state | [`./logs/web-log-schema.md`](./logs/web-log-schema.md) | draft |
| Firewall logs — L4 flows, firewall rule hits, IPS detections, NAT | [`./logs/firewall-log-schema.md`](./logs/firewall-log-schema.md) | draft |
| DNS logs — resolution events, request/response rules, DNS gateway state | [`./logs/dns-log-schema.md`](./logs/dns-log-schema.md) | draft |

For SPL patterns scoped to Zscaler questions, see [`../shared/splunk-queries.md`](../shared/splunk-queries.md). For *when* to query logs at all, see [`../shared/log-correlation.md`](../shared/log-correlation.md).

The July 17 release added **Select All** and **Hide Deleted** to the Users,
Departments, and Locations filters on the Web, Firewall, DNS, Tunnel, SaaS
Security, Endpoint DLP, and Email DLP Insights pages and on applicable NSS feed
filters (`vendor/zscaler-help/zia-release-upgrade-summary-2026-july.md:19-28`).
This is documented as an Admin Console and feed-configuration change; the
release does not state that raw log schemas or API filter parameters changed
(`vendor/zscaler-help/zia-release-upgrade-summary-2026-july.md:30-31`).

## Recent deployment and isolation additions

- Canada is now listed as a Zero Trust Browser isolation-profile region for
  ZIA. The release does not publish a region identifier or API enum
  (`vendor/zscaler-help/zia-release-upgrade-summary-2026-july.md:12-17`).
- The July 13 release adds Virtual Service Edge configuration on Nutanix and
  says the Nutanix VM image is downloadable from the Virtual Service Edges page
  (`vendor/zscaler-help/zia-release-upgrade-summary-2026-july.md:33-38`). This
  establishes platform/image availability, not Nutanix cluster topology or
  sizing; see [`zia.private-service-edge`](kb:zia.private-service-edge) and
  [`zia.virtual-service-edge.clusters`](kb:zia.virtual-service-edge.clusters).

## API schema references

Field-and-endpoint-level catalogs derived from Zscaler SDKs and Postman collections.

| Schema | File | Status |
|---|---|---|
| API endpoint inventory — full ZIA REST endpoint catalog with request/response shapes | [`./api-schemas.md`](./api-schemas.md) | draft |
| Postman-collection-derived schemas — extracted struct shapes and parameter types from the OneAPI Postman collection | [`./api-postman-schemas.md`](./api-postman-schemas.md) | draft |
| API source divergences — where the Go SDK, Python SDK, and MCP tooling disagree (e.g. Cloud App Control per-(rule, app, action) atomic validation) | [`./api-divergences.md`](./api-divergences.md) | draft |

## When the question spans multiple topics

Start at [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md) for the cross-feature mental model, then descend into the specific topic file.
