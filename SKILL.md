---
name: zscaler
description: >
  Answer questions about the Zscaler portfolio — full operational depth
  (T1, with SDK / TF / OneAPI exposure) on ZIA, ZPA (including
  AppProtection inline WAF/IPS sub-component and Browser Access), ZCC
  (Client Connector), ZDX (Digital Experience — T1 borderline,
  observability layer per 2026-05-04 verification gate), ZIdentity
  (unified identity + OneAPI authentication + step-up auth), and
  Cloud & Branch Connector (ZTW/ZTC — VM-based traffic forwarding for
  cloud workloads and branch offices); programmable-but-shallow (T2)
  on ZBI (Zero Trust Browser / Cloud Browser Isolation), ZWA
  (Workflow Automation — DLP incident lifecycle), AI Guard (Python
  OneAPI configuration plus legacy policy detection), ZMS and EASM
  (read-only/query-only Python surfaces), Zscaler Cellular / ZCell,
  and Business Insights (Python custom-app/report APIs; distinct from
  Zero Trust Browser); plus extended awareness with reasoning docs
  (T3, without a verified SDK/TF management surface) on Deception
  (decoys/honeypots for post-perimeter detection), Risk360 (cyber risk
  quantification / Monte Carlo / CISO board reporting), the AI Security
  family beyond AI Guard (AI Red Teaming / AI Guardrails / four-pillar
  governance), ZSDK, AEM, DSPM, ITDR, UVM, Experience Center, Breach
  Predictor, SOC Workbench, and Zero Trust Branch; plus paragraph-level
  awareness (T4) of Resilience, BCC, CTEM, Cloud Protection, Posture
  Control, M365 Copilot, Red Canary MDR, MTH, B2B, ZINS (shadow-IT
  NSS Collector), and Federal Cloud variants. Covers URL category
  coverage, URL filtering rule precedence, wildcard matching semantics,
  SSL inspection ordering, cloud app control interaction with URL
  filtering, DLP three-layer model, sandbox / malware / ATP, firewall
  filtering, ZPA app-segment matching and policy evaluation order,
  AppProtection profiles / paranoia levels, Browser Access wildcard
  certificate rules, ZCC forwarding-profile / trusted-network decisions
  (which decide whether traffic reaches ZIA or ZPA in the first place),
  ZDX score / probe / diagnostic-session questions about user experience,
  browser isolation (Isolate action, Smart Browser Isolation, isolation
  profiles), Cloud Connector provisioning and activation, and Zscaler
  portfolio breadth ("what is X?", "does Zscaler do Y?"). Use whenever
  the user mentions Zscaler, ZIA, ZPA, ZCC, ZDX, ZBI, ZWA, ZTW, ZTC,
  CBC, Zero Trust Browser, Cloud Browser Isolation, Client Connector,
  AppProtection, Browser Access, Deception, Risk360, AI Guard,
  AI Guardrails, AI Red Teaming, AI Security, ZMS, microsegmentation,
  east-west traffic, ZCell, Business Insights, ZINS, EASM, URL categories, URL filtering, cloud
  app control, SSL inspection, DLP, sandbox, app segments, forwarding
  profiles, trusted networks, ZDX score, probes, diagnostic sessions /
  deeptraces, isolation profiles, prompt injection, jailbreak detection,
  LLM guardrails, or asks "is $URL covered / blocked / allowed".
  Also use for "why does this rule win", "what happens when these
  policies overlap", "why is this user's app slow", "what happens when
  traffic gets isolated", "what is $product", or "does Zscaler have
  something for $use-case" questions, even if the user does not
  explicitly name Zscaler.
---

# Zscaler

A skill for reasoning about Zscaler ZIA and ZPA configuration — what gets matched, what wins, and why.

## What this skill knows

This skill encodes **how Zscaler actually behaves** — rule precedence, wildcard semantics, SSL inspection ordering, and policy evaluation across ZIA and ZPA. That knowledge is the product; live API access alone will give confidently wrong answers about precedence.

Two kinds of question this skill handles:

- **General behavior** — "how do wildcards match?", "what happens when URL filtering and cloud app control both apply?". Answerable anywhere, sourced from `references/`.
- **Tenant-specific lookups** — "is `reddit.com` in a URL category in *our* tenant?". These need tenant state, which comes only from a company overlay: its IaC repo, or a live read-only `zscalerctl` call. Public upstream has no tenant and stores no tenant data.

Structured troubleshooting with a symptom, affected scope, and timeframe should
use the portable `zscaler-investigator` skill or the `/z-investigator` runtime
adapter. This broad `zscaler` entrypoint is for ad-hoc Q&A and lightweight
lookups, not discovery-journal investigations.

## Answer tiers

Every answer starts from the knowledge graph. `node scripts/kb.mjs resolve <id | text>` returns
one bundle: the subjects, claims and gaps for the question, and, for a configured company overlay,
what the other two tiers can add. The overlay is found at `$ZSCALER_KB_OVERLAY`, or else at
`<runtime-data mount>/overlay/` when it has an `overlay.json` (`node scripts/runtime-data-path.mjs overlay`).

| Tier | Source | Use it for |
|---|---|---|
| 1 | Knowledge: public index plus the overlay's company records | How Zscaler behaves; how *we* do things |
| 2 | IaC, when `overlay.json` declares `iac` | What our configuration is, as of the last backfill |
| 3 | Live `zscalerctl`, when `overlay.json` declares `live` | What is true now, and drift from IaC |

The bundle's `tiers` block says which of 2 and 3 are available. For a type, `type.iac` says whether
the IaC repo covers it (and which values it cannot represent), and `type.live.command` names the
read-only `zscalerctl` command.

- **Use tier 2 before tier 3.** Read the IaC files the overlay points to and cite them.
- **Use tier 3 only** when IaC does not cover the type, field or value, is too stale for the
  question, or the question is about drift. Run or draft the named read-only command and use its JSON in
  this session; when working a case, save it to the case's `evidence/` and cite it. Never keep live
  reads as a standing tenant cache. Until `zscalerctl` is adopted where you are,
  use soft language: "if installed", "I can draft the read-only command." See
  [`references/_meta/tooling.md`](references/_meta/tooling.md).
- **With no overlay**, do not invent tenant truth. Answer the general case from the knowledge graph,
  say which tenant fact is missing, and name the `zscalerctl` command that would answer it.

Provider source under `vendor/terraform-provider-*` is reference material for what a provider can
express, never what *we* deployed; provider behavior and defects are in the `*.terraform.*`
subjects. `<mount>/schemas/` remains a cache for log-schema decompositions and query skeletons
produced by scripts; raw logs are a validation layer (see **When to consult logs**).

## Knowledge graph (converted areas)

Every product is now typed records, not Markdown docs. Resolve instead of
reading files:

```bash
node scripts/kb.mjs resolve "<subject ID, old clarification ID, or a few words>"
node scripts/kb.mjs resolve zdx          # a product ID or name: its areas and their subjects
```

The output is one JSON bundle: the subject's reasoning with its claims inlined,
every claim with tier, confidence and quote-anchored citations, open gaps
(semantic and data), cases, the bound tenant object types (with IaC coverage
and the `zscalerctl` read command), and any company-overlay facets labelled
`layer: company`. Text with several matches returns `candidates`; pick one and
resolve its ID. A question in plain words works too: when no alias matches, the
candidates are ranked by the question's words (`"match": "ranked"`), best first.
Every subject bundle lists its `neighbors` (parent, children, siblings): when the
subject you resolved does not hold the answer, the one next to it often does. A product (`zia`, `ZPA`, `Client Connector`, `shared`) returns
`areas`: the product's table of contents, generated from its subject IDs.
Cite claim IDs (`zia.url-filtering.rule-order:first-match`) in Sources. Old IDs such as `zia-02` resolve to their gap.

Data gaps say which tier can fill them (`iac`, `live`, `operator`). An earlier
rule that depends on a data gap is undecidable offline and shields every rule
below it: say so rather than skipping to a later rule.

## Question routing

Go straight to the reference file that covers the question shape. Treat this
table as a resolver, not a preload list: select one row, read the named file,
then stop unless the question genuinely spans multiple products or policies.

| Question shape | Start with |
|---|---|
| Is URL X in a category? Is it blocked/allowed? (no CAC mentioned) | Resolve `zia.url-filtering` (the four-question walk), then the subject it points to. Predefined-category membership is a data gap: resolvable live only. |
| Question mentions a Cloud App Control rule (CAC) — e.g. "CAC allows Facebook but URL filter blocks it, what happens?" | Resolve `zia.cloud-app-control.precedence` first: a CAC allow skips URL Filtering unless cascading is on, and a CAC block is final. |
| Why does rule A beat rule B? Why didn't a disabled/higher-order rule fire? | Resolve `zia.url-categories.membership` (category is decided before rules; specificity and Retain Parent), then `zia.url-filtering.rule-order` (first match, disabled rules hold their slot, admin rank). If either rule is a CAC rule, `zia.cloud-app-control.precedence`. |
| How do wildcards match (`*.foo.com` vs `.foo.com` vs `foo.com`)? | Resolve `zia.url-categories.entry-matching`. **Asterisks are not a valid Zscaler wildcard**; translate to the leading-period form and say so. |
| Does SSL inspection happen before or after X? | Resolve `zia.ssl-inspection.pipeline`: URL Filtering evaluates **twice** on inspected HTTPS, with the SSL decision between the passes. Other SSL topics: resolve `zia.ssl-inspection`. |
| Cloud app control vs URL filtering interaction | Resolve `zia.cloud-app-control.precedence`. Other CAC topics: resolve `zia.cloud-app-control`. |
| Why wasn't this file sandboxed / caught by Sandbox? | Resolve `zia.sandbox` — tier scope, SSL-bypass prerequisite, static-analysis fast-path, and the settings-vs-transaction boundary: Malware Protection and ATP settings have SDK/API coverage, while identifying which engine blocked one transaction still requires Web Insights or equivalent logs. |
| "Why was this blocked?" and it's NOT URL Filter / CAC / SSL / Firewall — suspect Malware Protection or ATP | Resolve `zia.atp` / `zia.malware-protection` — ATP categories, Page Risk, botnet/C2, Blocked Malicious URLs and Security Exceptions, enforcement order, and the settings APIs. Per-transaction diagnosis uses the log fields in `zia.atp.block-diagnosis`; the settings endpoints do not return transaction verdicts (`zia.sandbox.verdicts`). |
| DLP / data loss prevention / "why didn't DLP catch this?" / DLP dictionaries / DLP engines / EDM / ICAP / MIP labels / GenAI prompt scanning | Resolve `zia.dlp` — three-layer model (dictionaries → engines → rules; rules reference engines not dictionaries), 400MB/100MB/5-level inspection limits, Evaluate-All-Rules mode, ICAP-is-one-way, Cloud-to-Cloud Incident Forwarding feeds ZWA, HTTP GET query parameter inspection for GenAI URL categories. |
| ZPA app-segment matching — esp. two overlapping wildcard segments | `node scripts/kb.mjs resolve zpa.app-segments`. For two segments with identical specificity, the tiebreaker hits [clarification `zpa-04`](kb:zpa.app-segments.matching:same-specificity-tie) — answer at **Confidence: medium** until lab-verified. |
| ZPA App Connector — "our App Connectors won't enroll" / provisioning keys / scheduled upgrades / VM cloning fingerprint / connector health | `node scripts/kb.mjs resolve zpa.app-connectors` — VM model, provisioning-key key-utilization footgun (#1 enrollment failure), 4-hour rolling upgrade window, cert enrollment, Cloud-Connector-vs-App-Connector distinction, cross-product SIPA hook. |
| SCIM provisioning / automated user-group lifecycle / "why isn't my IdP sync working" | `node scripts/kb.mjs resolve shared.scim` (ZIA side: resolve `zia.scim`) |
| ZPA policy precedence | `node scripts/kb.mjs resolve zpa.policy` |
| "Why didn't ZIA see this traffic?" / "Why did traffic go direct?" / ZCC forwarding-profile questions | `node scripts/kb.mjs resolve zcc.forwarding-profiles` — per-network-type action branches (TRUSTED/UNTRUSTED), Z-Tunnel vs PAC vs NONE, fail-open, captive portal grace. **Several enum values are inferred, not documented** — answer at `Confidence: medium` and cite the open gaps `zcc.api.forwarding-profile-wire:condition-type-values`, `:network-type-values`, `:action-type-values`, `:primary-transport-values` and `zcc.forwarding-profiles.internet-actions:system-proxy-vs-action` where relevant. |
| Trusted-network detection / "Why is my user classified as untrusted at the office?" | `node scripts/kb.mjs resolve zcc.trusted-networks` — DNS, SSID, DHCP, subnet, egress-IP criteria and their combination. |
| ZPA `TRUSTED_NETWORK` access-policy condition not firing | Start at `node scripts/kb.mjs resolve zcc.forwarding-profiles.private-access-actions` — the `sendTrustedNetworkResultToZpa` toggle is usually the cause. Then `node scripts/kb.mjs resolve zpa.policy`. |
| Which forwarding profile / web policy does this user get? ZCC password / uninstall-protection / SSL-cert-install questions | `node scripts/kb.mjs resolve zcc.app-profiles` — scope (user/group/device-group), `forwarding_profile_id` link, per-platform sub-policies (Windows/macOS/Linux/iOS/Android), disaster recovery. |
| ZCC telemetry / log-collection / packet-capture policy | `node scripts/kb.mjs resolve zcc.web-privacy` — `collect_user_info`, `collect_machine_hostname`, packet-capture toggles; note `collect_zdx_location` ANDs with entitlements. |
| ZCC device inventory / force-remove / VM-cloning fingerprint issues / "when did this device last check in?" | `node scripts/kb.mjs resolve zcc.devices` — Device fields, states, remove vs force-remove, device cleanup, CSV downloads. |
| "User can't reach ZPA" / "ZDX has no data for this user" — entitlement first | `node scripts/kb.mjs resolve zcc.entitlements` — `zpa_enable_for_all` trump card, ZPA vs ZDX group lists, Machine Tunnel toggle, ZDX location dual-source dependency. |
| Z-Tunnel 1.0 vs 2.0 / "why isn't this non-web traffic tunneling" / bypass-list behavior / GRE-and-ZCC-2.0 | `node scripts/kb.mjs resolve zcc.z-tunnel` — CONNECT-proxy vs DTLS packet-tunnel, single-IP-NAT-or-fallback-to-1.0, 4-layer bypass architecture (VPN Gateway → Destination Exclusions/Inclusions with specificity-wins → Port-based → Domain-based PAC), 3.8+ Windows redirect-web-traffic truth table. |
| Cross-product mental model ("how does policy evaluation work in general?") | `node scripts/kb.mjs resolve shared.policy-evaluation` |
| Activation — "I changed a ZIA rule; why isn't it taking effect?" / activation API endpoints / ZIA-vs-ZPA activation-model differences | `node scripts/kb.mjs resolve shared.activation` — areas: `shared.activation.cbc` |
| Source IP Anchoring (SIPA) — "we need our source IP to show up as customer-controlled for Office 365 / Conditional Access / legacy IP-allowlist apps" / "SIPA traffic is egressing with wrong IP" / SIPA Direct / ZIA DR fallback | `node scripts/kb.mjs resolve shared.source-ip-anchoring` (ZIA side: resolve `zia.forwarding-control.sipa`) — areas: `shared.source-ip-anchoring.egress-options` |
| Terminology translation — "what's a ZEN?" / "PSEN" / "Z-App" / "App Profile vs Web Policy" / "ZTW vs ZTC" — any Zscaler naming disambiguation | `node scripts/kb.mjs resolve shared.terminology` — areas: `shared.terminology.product-names`, `shared.terminology.service-edge-names` |
| "What does Zscaler actually run?" / Central Authority / Service Edge types / Business Continuity Cloud / Z-Tunnel vs M-Tunnel / PKI and cert trust | `node scripts/kb.mjs resolve shared.cloud-architecture` — areas: `shared.cloud-architecture.central-authority`, `shared.cloud-architecture.cloud-names`, `shared.cloud-architecture.failure-domains`, `shared.cloud-architecture.logging-path`, `shared.cloud-architecture.service-edges`, `shared.cloud-architecture.support-systems`, `shared.cloud-architecture.trust-model`, `shared.cloud-architecture.tunnels` |
| PAC files — `${GATEWAY}` / `${SECONDARY_GATEWAY}` / `${GATEWAY_HOST}` substitution / Kerberos-PAC / subcloud-variable form / custom PAC upload / "why is my PAC change not taking effect" | `node scripts/kb.mjs resolve shared.pac-files` — areas: `shared.pac-files.coverage`, `shared.pac-files.hosting`, `shared.pac-files.kerberos`, `shared.pac-files.syntax`, `shared.pac-files.variables` |
| ZIA Locations, sublocations, Location Groups — "which rules apply at this location?" / sublocation IP-overlap rules / `other` sublocation / predefined Corporate/Guest/IoT/Server/Workload groups / Dynamic vs Manual groups / XFF | Resolve `zia.locations` — sublocations and the `other` catch-all, IP scoping, parent-only versus shared settings, sublocation bandwidth modes, manual and dynamic groups, automatic group assignment, which rules take locations and groups. |
| Device Posture — posture profiles / "why did this user's ZPA access break?" / posture types (CrowdStrike/SentinelOne/Defender/Disk-Encryption/Registry/File-Path/OS-Version) / evaluation cadence / Machine Tunnel / existing-connection immunity | `node scripts/kb.mjs resolve shared.device-posture` — areas: `shared.device-posture.trust-levels` |
| ZIA Firewall Control — "why was this blocked and it's not a URL Filter rule?" / Firewall Filtering / NAT / DNS / IPS / FTP Control / signature-based IPS / custom Snort-like signatures / Basic vs Advanced licensing | Resolve `zia.firewall` (DNS Control: `zia.dns-control`) — four sub-policies (Filtering / NAT / DNS / IPS), pipeline position before web-module, 5 actions including `EVAL_NWAPP` for network-app identification, Advanced-licensing-required for user-group-department-IPS criteria, IPS default rule BLOCK-ALL, ATP rules evaluate BEFORE IPS when both licensed, Z-Tunnel-1.0/PAC requires Advanced Settings toggle to engage firewall. |
| ZPA Browser Access — "how do I give a contractor / partner access to an internal web app without installing ZCC" / wildcard certificate rules / CNAME / TLS 1.2 cipher requirement | `node scripts/kb.mjs resolve zpa.browser-access` — clientless browser path, dual-access model (enabling BA auto-adds ZCC), TLS 1.2 cipher `ECDHE-RSA-AES128-GCM-SHA256`, wildcard cert matches one level only (`*.example.com` does NOT cover `app.local.example.com`), same vs different hostname cert mechanics, mutual-exclusions with SIPA / Double Encryption / Multimatch, TCP-only constraint. |
| ZPA Privileged Remote Access (PRA) — RDP / SSH / VNC / jump host / bastion / session recording / approval workflow / credential pooling / break-glass access | `node scripts/kb.mjs resolve zpa.pra` — clientless protocol relay, 6 config objects (Portal / Console / Credentials / Credential Pool / Approvals / Capabilities Policy / Privileged Policy), 3 credential types (immutable protocol), time-bounded approval windows (not floating), 6-status session recording lifecycle, prioritized transcoding, permalinks. Capabilities page under maintenance at capture time. |
| Subclouds — "why is my traffic going to the wrong region" / GDPR-only PSE pool / private-DC-only routing / subcloud-qualified PAC variables (`${GATEWAY.<Subcloud>.<Cloud>}`) / CONUS / propagation lag | `node scripts/kb.mjs resolve shared.subclouds` — areas: `shared.subclouds.api` |
| NSS / Cloud NSS / log streaming / "why did my SIEM miss logs" / Nanolog / NSS Collector (Shadow IT) | `node scripts/kb.mjs resolve shared.nss` — areas: `shared.nss.collector`, `shared.nss.delivery-modes`, `shared.nss.feeds`, `shared.nss.reliability`, `shared.nss.servers` |
| ZIA Bandwidth Control — "how do I guarantee business-critical bandwidth during contention?" / Bandwidth Classes / per-location scope | Resolve `zia.bandwidth-control` — classes and rules, how minimums and maximums are allocated (the maximum applies at all times, the minimum under contention), the default rule and orphan classes, the location toggle, limits and the API. |
| FTP / File Type / SSH — "why is FTP-over-HTTP blocked?" / "can I block .mp4 downloads?" / "how do we audit SSH?" / any narrow inspection question beyond URL / CAC / DLP / SSL / Sandbox / Malware | Resolve `zia.ftp-control`, `zia.file-type-control` or `zia.ssh-control`. FTP Control is a settings object with no per-user rules; File Type Control has criteria, actions and a pipeline position before DLP; SSH has no content inspection in ZIA. |
| ZIA authentication — "why are users showing as the location / unauthenticated?" / SAML or Kerberos / surrogate IP / authentication frequency / exempted URLs | Resolve `zia.authentication` — org settings, methods, per-location enforcement, what unauthenticated traffic gets, surrogate IP, exemptions, step-up levels. |
| ZIA Forwarding Control — forward methods (DIRECT / ZPA / PROXYCHAIN / dedicated IP) / ZPA gateway / predefined forwarding rules / dedicated proxy ports | Resolve `zia.forwarding-control` — methods and their required fields, rule criteria and order, the ZPA gateway, SIPA (`zia.forwarding-control.sipa`), Terraform timing. |
| Tenant profiles / tenant restriction — "allow only our Microsoft 365 / Google Workspace tenant" | Resolve `zia.tenant-profiles` — the headers ZIA inserts per app, the SSL/TLS inspection prerequisite, supported apps (console vs API), limits, API and Terraform behavior. |
| How traffic reaches ZIA — GRE / IPsec / VPN credentials / hosted PAC / ZCC tunnels / proxy chaining; explicit vs transparent proxy | Resolve `zia.traffic-forwarding` (per method: `.gre`, `.gre-failover`, `.ipsec`, `.vpn-credentials`, `.pac`, `.zcc`) and `zia.proxy-mode` (which method yields which mode: `zia.proxy-mode.forwarding-map`). |
| Private or Virtual Service Edge — PSE sizing / cluster design / Location binding and the open-proxy risk / VSE clusters, load balancing, upgrades | Resolve `zia.private-service-edge` or `zia.virtual-service-edge`. |
| ZIA user provisioning — LDAP/AD directory sync / SAML auto-provisioning / ZIA SCIM attributes, departments, deactivation, rate limits | Resolve `zia.ad-integration` and `zia.scim` (cross-product SCIM: `node scripts/kb.mjs resolve shared.scim`). |
| SaaS apps that misbehave under ZIA — tenant restriction defeated by a Microsoft 365 bypass rule / Conditional Access source IP / QUIC / CDN wildcard exemptions / IdP endpoints | Resolve `zia.saas-apps`. |
| Time-based rules — time intervals, time zones, firewall time windows | Resolve `zia.time-intervals`. |
| Which API endpoint, SDK call or Terraform resource handles an object — "what does `zia_x` call?" / "which SDK method reaches `/urlCategories`?" | `node scripts/kb.mjs surface <terraform name | API path | Go package | Python module or method>` — generated from the pinned spec, SDKs and provider; behavior of those calls is in the `zia.terraform.*`, `zia.sdk-go.*` and area subjects. |
| ZIA Terraform provider behavior — "why does this plan show drift?" / activation from Terraform / rule order / what a resource sends or drops / provider modes and rate limits | Resolve `zia.terraform` (walks the provider subjects). |
| Python SDK behavior shared by every product — key casing on requests and responses, retries, paging, the error slot, OneAPI vs legacy client | `node scripts/kb.mjs resolve shared.sdk-python.request-handling` — areas: `shared.sdk-python.response-handling`, `shared.sdk-python.pagination`, `shared.sdk-python.retries`, `shared.sdk-python.errors`, `shared.sdk-python.client-configuration`. The Go SDK's are `shared.sdk-go.*`. |
| Zscaler Python SDK against ZIA — authentication, return tuples, paging, retries, which client has a service | Resolve `zia.sdk-python` and `zia.api.sdk-coverage`; API-side behavior (activation, rate limits, wire shapes) is `zia.api`. |
| ZIA CASB / SaaS Security API — tenants, data-at-rest scans, quarantine, CASB DLP and malware rules, SaaS Security Insights logs | Resolve `zia.casb`. |
| Workload groups, IoT discovery, rule labels, admin audit logs, backup and restore | Resolve `zia.workload-groups`, `zia.iot`, `zia.rule-labels`, `zia.audit-logs`, `zia.backup-restore`. |
| Admin RBAC / admin users / roles / scopes / audit / "why can this admin do X here but not Y there?" / "how do I create an API client?" | `node scripts/kb.mjs resolve shared.admin-rbac` — areas: `shared.admin-rbac.zia`, `shared.admin-rbac.zpa` |
| OneAPI / "how do I authenticate to Zscaler APIs?" / token endpoint / rate limits / "why is my token rejected" / OAuth flow / JWT auth / API base URLs / activation gate / EDIT_LOCK_NOT_AVAILABLE / 409 / 429 | `node scripts/kb.mjs resolve shared.oneapi` — areas: `shared.oneapi.authentication`, `shared.oneapi.base-urls`, `shared.oneapi.government-clouds`, `shared.oneapi.rate-limits`, `shared.oneapi.response-codes`, `shared.oneapi.write-practices` |
| Secrets over the API / "can a read-only API client see secrets?" / scoping a least-privilege API client / "does GET return the provisioning key / connector API key / device uninstall password / VPN PSK?" / which resource families leak credentials on read | `node scripts/kb.mjs resolve shared.secret-surfaces` — areas: `shared.secret-surfaces.revealed`, `shared.secret-surfaces.withheld` |
| Question spans ZIA + ZPA, or ZCC + a server product — silently-wrong-answer territory | **Start at** `node scripts/kb.mjs resolve shared.integrations` — the cross-product hooks by direction, with links to each product's subject |
| "Why is this user's app slow?" / "Is it the network or the app?" / ZDX Score / probes / diagnostic sessions (deeptraces) / alerts | `node scripts/kb.mjs resolve zdx.overview` — areas: `zdx.score` (`zdx.score.calculation`), `zdx.probes` (`zdx.probes.criteria`), `zdx.applications`, `zdx.devices` (`zdx.devices.health-and-events`, `zdx.devices.geolocation`, `zdx.devices.call-quality`), `zdx.diagnostics` (deep traces; the console calls them Diagnostics Sessions), `zdx.alerts`, `zdx.reports`, `zdx.administration`, `zdx.cloud-architecture`. |
| ZDX API / SDK methods | `node scripts/kb.mjs resolve zdx.api` — areas: `zdx.api.hosts-and-auth`, `zdx.api.rate-limits`, `zdx.api.conventions`, `zdx.api.client-coverage`, `zdx.sdk-go`, `zdx.sdk-python`; endpoints and SDK calls come from `node scripts/kb.mjs surface <name or path>` (product `zdx`). The contract's `/v1/config` area (applications, monitors, collections) writes configuration, and no SDK calls it: `zdx.applications:config-no-sdk`. |
| Cloud Browser Isolation / Zero Trust Browser / ZBI / URL Filter `Isolate` action / "what happens when isolation fires" | `node scripts/kb.mjs resolve zbi.cloud-browser` — areas: `zbi.turbo-mode`, `zbi.policy`, `zbi.smart-isolation`, `zbi.private-access-isolation`, `zbi.isolation-profiles`, `zbi.misc-unknown-subscription`, `zbi.api`. Python `client.zbi` is **Business Insights**, not Zero Trust Browser, and "ZTB" in a ticket can mean Zero Trust Browser or Zero Trust Branch (`zero-trust-branch.overview`). |
| ZIdentity / "what is ZIdentity?" / SAML vs OIDC / MFA / single sign-on across Zscaler products | `node scripts/kb.mjs resolve zidentity.overview` — areas: `zidentity.overview.external-idps`, `zidentity.users` (`zidentity.users.provisioning` for JIT vs SCIM), `zidentity.groups`, `zidentity.entitlements`, `zidentity.admin-rbac` (`zidentity.admin-rbac.permissions`). |
| OneAPI authentication / API client creation / client secret vs JWT / ZSCALER_CLIENT_ID setup | `node scripts/kb.mjs resolve shared.oneapi.authentication` for the token flow, then `zidentity.api-clients` (Python `client.zid.api_client`, Go `api_clients`) — areas: `zidentity.api-clients.secrets`, `zidentity.api-clients.access-tokens`, `zidentity.api-clients.access-policy`, `zidentity.resource-servers`. |
| Step-up authentication / Conditional Access / "why isn't the MFA prompt appearing?" / Authentication Levels | `node scripts/kb.mjs resolve zidentity.step-up` — areas: `zidentity.step-up.levels` (a parent level is the stronger one; its validity must be shorter than its sub-levels'). Whether step-up is OIDC-only is a divergence: `zidentity.step-up:oidc-strictness`. |
| ZIdentity API / `client.zid.*` methods / SCIM-like user provisioning | `node scripts/kb.mjs resolve zidentity.api` — areas: `zidentity.api.pagination`, `zidentity.api.query-filters`, `zidentity.api.client-coverage`, `zidentity.sdk-go`, `zidentity.sdk-python`; endpoints and SDK calls come from `node scripts/kb.mjs surface <name or path>` (product `zid`). |
| Cloud Connector / Branch Connector / "why isn't my AWS/Azure/GCP workload reaching Zscaler?" / ZTW / ZTC / CBC | `node scripts/kb.mjs resolve cloud-connector.overview` — areas: `cloud-connector.overview.gateway-failover`, `cloud-connector.overview.groups`, `cloud-connector.overview.load-balancing`, `cloud-connector.overview.zero-trust-gateways` |
| Cloud Connector traffic forwarding rules / "why is my workload going direct instead of to ZIA?" / forwarding methods | `node scripts/kb.mjs resolve cloud-connector.forwarding` — areas: `cloud-connector.forwarding.criteria`, `cloud-connector.forwarding.log-and-control`, `cloud-connector.forwarding.methods`, `cloud-connector.forwarding.predefined-rules`, `cloud-connector.forwarding.rule-order` |
| Cloud Connector API / SDK / Terraform | `node scripts/kb.mjs resolve cloud-connector.api`, `cloud-connector.sdk-go`, `cloud-connector.sdk-python` and `cloud-connector.terraform` (Python reaches ZTW as `client.ztw` on the v1.x line; the `2.0.0bN` beta does **not** include ZTW: `cloud-connector.api.client-coverage`); endpoints, SDK calls and every `ztc_*` argument come from `node scripts/kb.mjs surface <name or path>` (product `ztw`) |
| "What happens to DLP incidents after detection?" / Workflow Automation / ZWA / auto-notify / auto-escalate / auto-create-ticket | `node scripts/kb.mjs resolve zwa.incidents` — areas: `zwa.workflows` (templates, mappings, notifications, ticketing), `zwa.audit-logs`. |
| ZWA API / incident search / evidence retrieval | `node scripts/kb.mjs resolve zwa.api` — areas: `zwa.api.incidents-wire`; no API or SDK configures workflows: `zwa.workflows:no-workflow-api`. Endpoints and SDK calls come from `node scripts/kb.mjs surface <name or path>` (product `zwa`). Evidence reads return the matched content: treat as sensitive. |
| Zscaler Deception / decoys / honeypots / "what is Deception?" / "why are there ZPA access rules I can't edit?" / lateral-movement detection / APT / post-breach detection | `node scripts/kb.mjs resolve deception.overview` — areas: `deception.plans`, `deception.mcp-server-decoys`. |
| ZPA AppProtection / ZPA Inspection / WAF for private apps / OWASP / Kerberos+SMB+LDAP inspection / "is AppProtection part of ZPA?" / `zpn_inspection_profile_id` | `node scripts/kb.mjs resolve zpa.appprotection` — inline WAF/IPS for ZPA-protected apps (formerly called "Inspection"). 6 control categories (OWASP CRS 4.8 / ThreatLabZ / **Active Directory protocols Kerberos+SMB+LDAP** / API / WebSocket / custom). Three-tier policy model (Controls → Profiles → Rules). Paranoia Levels 1-4. Default profile `OWASP Top-10 for Visibility` is read-only. **Multimatch mutually exclusive on same segment.** TLS 1.2 cipher `ECDHE-RSA-AES128-GCM-SHA256` for inline decryption (same as Browser Access). Logs flow through ZPA LSS, **not ZIA NSS** — SIEM teams must add LSS receiver. Browser Protection appears tier-gated within AppProtection subscription. |
| Risk360 / cyber risk quantification / "what's our risk score?" / Monte Carlo / financial loss estimation / SEC compliance / CISO board reporting / NIST CSF / MITRE ATT&CK alignment | `node scripts/kb.mjs resolve risk360.overview` — areas: `risk360.scoring`. No vendored client covers Risk360: `risk360.overview:no-client-surface`. |
| AI Security family / AI Guard / AI Guardrails / AI Red Teaming / "how does Zscaler protect AI prompts?" / prompt injection / jailbreak detection / LLM guardrails / sensitive data leakage to LLM / DaaS sidecar / Proxy mode for LLMs | `node scripts/kb.mjs resolve ai-security.family` — areas: `ai-security.ai-guard` (`ai-security.ai-guard.detectors`, `.policies`, `.zia-integration`, `.tenant-settings`, `.admin-access`, `.observability`, `.runtime-api`, `.admin-api`, `.integrations`), `ai-security.asset-inventory-api`; Zscaler's example integrations (Claude Code, Cursor, Cline, Windsurf, Codex, CI, AWS, Apigee, Azure APIM, Kong, LiteLLM, Portkey, TrueFoundry, NeMo) are `ai-security.ai-guard.integrations.<host>`, with fail posture and interception compared in the parent; Python reaches AI Guard as `client.aiguard`; endpoints and SDK calls come from `node scripts/kb.mjs surface <name or path>` (products `aiguard`, `aisec`). |
| ZMS / Zscaler Microsegmentation / east-west traffic / workload-to-workload policy / "how does ZMS differ from ZPA?" / lateral movement prevention / host-agent firewall / WFP / nftables | `node scripts/kb.mjs resolve zms.overview` — areas: `zms.portal`, `zms.provisioning-keys`, `zms.api` (`zms.api.queries`, `zms.api.enums-and-filters`; Python `client.zms`, GraphQL), `zms.mcp`. **ZPA segments user→app traffic; ZMS segments app→app traffic.** |
| EASM / External Attack Surface Management / organizations / findings / lookalike domains | `node scripts/kb.mjs resolve easm.api` (Python `client.zeasm`) — areas: `easm.findings`, `easm.lookalike-domains`, `easm.mcp`; endpoints and SDK calls come from `node scripts/kb.mjs surface <name or path>` (product `easm`). |
| Zscaler Cellular / ZCell / SIM inventory / cellular anomaly policy / SIM analytics | `node scripts/kb.mjs resolve zscaler-cellular.overview` — areas: `zscaler-cellular.sims`, `zscaler-cellular.monitoring`, `zscaler-cellular.deployment-credentials`, `zscaler-cellular.api` (`zscaler-cellular.api.wire-notes`, `zscaler-cellular.sdk-python.location-groups`), `zscaler-cellular.mcp`; Python reaches it as `client.zcell`; endpoints and SDK calls come from `node scripts/kb.mjs surface <name or path>` (product `zcell`). |
| Business Insights / SaaS Application Management / workplace utilization / `client.zbi` reports or custom apps | `node scripts/kb.mjs resolve business-insights.overview` — areas: `business-insights.api` (Python `client.zbi` is Business Insights, not Zero Trust Browser; surface product `bi`). |
| Agentic SecOps apps / UVM / AEM / DSPM / Agentic SOC / SOC Workbench / Identity Protection / ITDR / Breach Predictor / Experience Center / ZAgent / Zero Trust Branch / ZTB | `node scripts/kb.mjs resolve aem.secops-platform` for the shared platform; per product `uvm.overview`, `aem.overview`, `dspm.overview` (`dspm.scanning`), `soc-workbench.overview`, `identity-protection.overview`, `breach-predictor.overview`, `unified.overview` (`unified.zagent`), `zero-trust-branch.overview` (`zero-trust-branch.api`; surface product `ztb`). |
| ZIA API endpoint or response shape | `node scripts/kb.mjs surface <path or name>`, then `kb:zia.api` |
| ZPA API endpoint or response shape | `node scripts/kb.mjs surface <path or name>`, then `kb:zpa.api` |
| ZCC API endpoint or response shape | `node scripts/kb.mjs surface <path or name>`, then `kb:zcc.api` |
| Terraform provider resource or schema | `node scripts/kb.mjs surface <resource name>` (arguments, enums, defaults, API paths), then `references/terraform.md` |
| ZIA web log fields / what NSS reports | `node scripts/kb.mjs resolve zia/web-log` (fields), `zia.logs.web-records`, `zia.logs.web-field-semantics` |
| ZIA firewall log fields | `node scripts/kb.mjs resolve zia/firewall-log` (fields), `zia.logs.firewall-records` |
| ZIA DNS log fields | `node scripts/kb.mjs resolve zia/dns-log` (fields), `zia.logs.dns-record-fields`, `zia.logs.dns-outcome` |
| ZPA LSS log fields (User Activity, User Status, connector and edge status and metrics) | `node scripts/kb.mjs resolve zpa/user-activity-log` (fields; likewise `zpa/user-status-log`, `zpa/app-connector-metrics-log`, ...), `zpa.logs.user-activity` |
| Cloud & Branch Connector NSS log fields (session, DNS, event, metrics) | `node scripts/kb.mjs resolve ztw/session-log` (fields; likewise `ztw/dns-log`, `ztw/event-log`, `ztw/metrics-vm-log`, `ztw/metrics-instance-log`, `ztw/metrics-resource-log`), `cloud-connector.logs` |
| SPL patterns / "how do I query for X?" | `node scripts/kb.mjs resolve shared.splunk` |
| "should I check logs here?" / validation guidance | `node scripts/kb.mjs resolve shared.log-correlation` |

If the question shape isn't here, start with `node scripts/kb.mjs resolve shared.policy-evaluation` and follow its cross-links.

**For breadth questions** ("does Zscaler have a product for X?", "what is Risk360?", "is AppProtection part of ZPA?", "what's the difference between Cloud Connector and Posture Control?"), start with [`references/_meta/portfolio-map.md`](references/_meta/portfolio-map.md) — single-page index of every Zscaler product with deep-dive / awareness / out-of-scope tier. Tells the skill what coverage depth to claim before answering.

**For prerequisite-knowledge questions** ("what's a proxy?", "what's the difference between SAML and OIDC?", "what does zero trust actually mean?", "how does NAT work?"), start with [`references/_meta/primer/`](references/_meta/primer/) — five primer docs covering generic networking, forwarding paradigms, zero-trust philosophy, identity protocols, and the Zscaler platform shape. Use this when the asker is non-networking-background or when you need to set up conceptual scaffolding before diving into a product-specific answer.

**For meta-questions about the skill itself** ("where does general Zscaler knowledge end and tenant-specific data begin?", "how should this skill combine doc knowledge with what we know operationally?"), see [`references/_meta/layering-model.md`](references/_meta/layering-model.md) — the three-layer framing (general / tenant / SME tribal) with anti-patterns and operational implications for fine-tune training. For the pre-release `zscalerctl` companion boundary, see [`references/_meta/tooling.md`](references/_meta/tooling.md): `zscalerctl` observes tenant state; this skill reasons over it.

**If you are an AI agent**, prefer [`references/_meta/agent-patterns.md`](references/_meta/agent-patterns.md) over the prose runbooks below. It contains pure typed Python functions for cloud classification, auth-framework detection, and error interpretation: `detect_cloud()`, `is_gov_cloud()`, `detect_auth_framework()`, and `interpret_error()`. The canonical implementation lives at `scripts/agent_patterns.py`. It performs no tenant or SDK calls; use the overlay's IaC, supplied command output, or the read-only `zscalerctl` companion for observation.

**For actionable / procedural questions** — "which auth path should I use?", "how do I detect if this is a gov cloud?", "I'm getting 401 / rule isn't applying / 429 rate-limited / EDIT_LOCK / activation stuck — what do I do?", "how do I rotate credentials safely?", "how do I round-trip a config without hitting the read/write asymmetry?" — start at [`references/_meta/runbooks.md`](references/_meta/runbooks.md). The runbook contains: (1) authentication selection decision tree with concrete diagnostic checks, (2) diagnostic procedures for cloud detection / OneAPI-vs-legacy detection / migration status, (3) troubleshooting flows for the six most common failure modes, (4) credential lifecycle patterns including rotation, fallback, OneAPI ↔ legacy coexistence, gov-cloud forced-legacy. **This is the home for "what should I DO?" questions** — the rest of the skill is reference (how things work); the runbook is procedural (what steps to take). Each product `api.md` cross-links here, and each api.md also has a "Common SDK patterns" subsection with inline code so you don't have to switch docs to find the call signature you need.

**For verifying a finding before threading it into the skill** — i.e., any time a user reports behavior that's not yet documented — apply [`references/_meta/verification-protocol.md`](references/_meta/verification-protocol.md). The four-tier model (source-verified / behavior-verified / operator-reported / inferred) governs what language is permitted, where the finding can land, and how user assertions get treated when they conflict with sources. **This is binding for assistant behavior:** treat user-reported behavior as a tier-C candidate by default, run the source-check sequence before threading, never use "verified" language for unverified content, and hold the line on tier C/D when users push for tier-A treatment without producing evidence.

**Before quoting any reference summary, do a targeted clarification lookup** —
search `references/_meta/clarifications.md` by the selected product prefix,
cited clarification ID, or the specific field/behavior in question. Do not load
the entire clarification ledger for routine answers. When a matching entry
applies, cite the clarification ID and adjust confidence accordingly.

## Answer format

Return every non-trivial answer in this shape. It keeps answers grounded, makes uncertainty visible, and gives a future trainer a consistent structure to learn from.

```markdown
## Answer
<direct answer in 1–3 sentences; lead with the conclusion>

## Reasoning
<why, citing the specific mechanics — rule order, match type, evaluation stage>

## Sources
- zia.url-filtering.rule-order:first-match (claim IDs from a resolved bundle), or references/<file>.md (§ section) for areas not yet converted
- <overlay IaC path>/zia/url-filtering-rules (rule IDs 42, 47 — only if tier 2 was read), or the `zscalerctl` command run (tier 3)

## Confidence
high | medium | low — <one-line reason; e.g. "stub reference, inferred from Zscaler KB">
```

For trivial factual questions ("what's a URL category?") you can drop Reasoning and Confidence, but keep Sources.

### Confidence rule when sources disagree

When two vendored sources describe the same behavior in different — even subtly different — ways:

1. **Do not silently pick one.** Report `Confidence: medium` at most, sometimes `low` depending on severity.
2. **Cite both sources** in the `## Sources` section.
3. **Name the divergence explicitly** in `## Reasoning` — one sentence identifying what the two sources say and why it matters for the answer.
4. If the divergence overlaps an open clarification in [`references/_meta/clarifications.md`](references/_meta/clarifications.md), cite the clarification ID.

Concrete example: *Understanding Application Access* p.1 describes the port-mismatch outcome two ways ("bypasses ZPA and sends traffic directly" vs "client connection request is dropped by ZPA"). Those are two perspectives on the same event — reconciled in `node scripts/kb.mjs resolve zpa.app-segments`. An answer using this material should cite the reconciled section, not either single quote, and report `Confidence: medium` if the user's question hinges on what happens to the traffic after the bypass.

A claim derived by **inference** — extrapolating a stated rule beyond its documented scope — gets `Confidence: low` and an explicit note in Reasoning calling out that it's an extrapolation. Do not dress inferences as quoted fact.

## When to consult logs

Default: answer from the knowledge graph and, for tenant facts, the overlay's IaC or a live `zscalerctl` read (see **Answer tiers**). Logs are the **validation layer**, not the first stop — they add latency and cost.

Consult logs when **any** of:

- The user pushes back on a config-derived answer.
- Config is ambiguous (multiple rules could match, wildcard could go either way, segments overlap).
- The question is inherently observational ("when did this start breaking?", "how often does Y happen?").
- You suspect config/reality drift — rules recently changed, or the answer smells wrong.

Do not consult logs for pure semantic questions ("how do wildcards match?") — reasoning docs handle those. See [`shared.log-correlation`](kb:shared.log-correlation) for the full decision rule.

When you do query, follow a named check from [`shared.splunk`](kb:shared.splunk) and its children (each check's name, such as `rule-hit-history`, resolves to the subject that holds it) rather than inventing a search, and say which claims the search relies on. If logs contradict config, call that drift out explicitly in the Answer — it's the high-signal finding.

## When to decline

- **Tenant state needed, no observation available** — say so directly, and still answer the general case if there is one. Name the read-only `zscalerctl` command from the resolved bundle; if `@zscalerctl` is available, offer to run it, otherwise ask for sanitized command output.
- **Relevant reference is still a stub** (`author-status: stub`, no body yet) — say the skill hasn't written this down yet, describe what you know from the file's TODO headings, and mark **Confidence: low**.
- **Question maps to a known open clarification** — if a reference doc cross-links an entry in [`references/_meta/clarifications.md`](references/_meta/clarifications.md) that covers the user's question, cite the clarification ID (e.g. "this hits `zia-03` — wildcard tokenization is unresolved in our public material"), answer what you can, and flag the gap rather than hallucinating the rest.
- **T1 — operational deep-dive (SDK / TF / API + multi-component coverage)** — ZIA, ZPA (including AppProtection inline WAF/IPS sub-component and Browser Access), ZCC (forwarding profiles, trusted networks, fail-open), ZIdentity (unified identity, OneAPI auth, step-up authentication), Cloud & Branch Connector (ZTW/ZTC — Cloud Connector VM architecture, traffic forwarding rules, SDK/TF surface), and ZDX (score, probes, diagnostic sessions, alerts — **T1 borderline: observability layer rather than enforcement, per 2026-05-04 verification gate**). Answer with full confidence and cite specific reference sections including API endpoints, rule semantics, and policy evaluation order.
- **T2 — programmable but shallow (SDK / API exposure, narrow surface)** — ZBI (Cloud Browser Isolation / Zero Trust Browser), ZWA (Workflow Automation), AI Guard, ZMS, EASM, Zscaler Cellular / ZCell, and Business Insights. The surface is not uniformly writable: ZMS and the Python EASM client are read-only/query-only, while AI Guard, ZCell, and the Business Insights custom-app/report-config families include writes. Answer at confidence: medium-to-high for the documented surface; flag the precise client/parity gap when the question pushes beyond it.
- **T3 — extended reasoning, no verified SDK / TF management surface** — Deception, Risk360, AI Security family surfaces beyond AI Guard, ZSDK, AEM, DSPM, ITDR, UVM, Experience Center, Breach Predictor, SOC Workbench, and Zero Trust Branch. Route to the product reasoning doc or portfolio entry, answer at confidence: medium, and state the exact captured coverage boundary instead of applying a blanket portal-only claim to a neighboring Tier 2 product. Do NOT fabricate field names, API endpoints, or programmatic config patterns.
- **T4 — paragraph-only routing (one-paragraph framing in portfolio map)** — Resilience, BCC, CTEM, Cloud Protection, Posture Control, M365 Copilot, Red Canary MDR, MTH, B2B, ZINS (shadow-IT NSS Collector), Federal Cloud variants (`zscalergov`, `zscalerten`, ZPA GOV/GOVUS), or any other Zscaler-marketed product not in the T1 / T2 / T3 lists. Start at [`references/_meta/portfolio-map.md`](references/_meta/portfolio-map.md) for the one-paragraph framing. Give the conceptual answer and point to the Zscaler help site / TAM for operational depth — do NOT fabricate API details or rule behaviors. Confidence: medium at most.
- **T5 — truly out of scope** — currently empty. Reserved for deprecated / internal / unshipped products. If a user question lands here, decline outright.
- **Partial scope within T1** — ZCC device-posture rules and on-device web policy are partially in scope (`node scripts/kb.mjs resolve zcc` lists its areas; the gaps are in those subjects). ZDX's application-specific call-quality integrations (Microsoft Teams, Zoom deep-dives) are partially in scope — see `zdx.devices.call-quality` and its gaps. ZIdentity's IdP-specific configurations (Entra, AD FS, Okta) and MFA method configs are partially in scope — see `zidentity.overview.external-idps` and its gaps. (Note: ZBI moved to T2; see `zbi.cloud-browser:uncaptured-features` and the other `zbi.*` gaps for Votiro CDR integration, Sandbox+Isolation, Local Browser Rendering, and end-user UX features.)

Do not guess precedence, matching semantics, or evaluation order from first principles. These are exactly the places Zscaler's real behavior diverges from intuition — wrong confident answers here are the failure mode this skill exists to prevent.

## Recognizing a deferred topic from frontmatter

Before answering with high confidence, check the relevant reference doc's frontmatter:

| Frontmatter signal | What it means | What to do |
|---|---|---|
| `confidence: low` or `medium` | Doc author flagged uncertainty | Lead the answer with the same confidence; cite what's solid, flag what's not |
| `source-tier: code` | Sourced from SDK / TF only (help-portal page broken or non-existent) | Answer to the SDK shape; note that runtime behavior may differ; recommend tenant verification |
| `author-status: stub` | TODO headings only, no body | Don't answer from the doc; use the headings to describe what would be covered and decline the substantive answer |
| Doc cross-links a clarification ID (`zia-03`, `zpa-04`, etc.) | Known unresolved gap | Cite the ID and answer within the gap's bounds |
| Doc opens with a "tenant access required" note | Lab test or live-API verification needed | Answer the general case; answer tenant-specific only from the overlay's IaC or a live read |

**Topics this skill cannot answer without tenant access** (load-bearing list — when asked about these without a configured overlay, decline with a pointer rather than guess):

- The `tz` / `country` write-side current behavior on ZIA Location Management (read returns unprefixed; write accepted-form is unverified post-API change)
- Whether VMSS upgrade window behavior on Cloud Connector matches the documented Sunday-midnight-local pattern in *your* deployment
- Whether the Python SDK Server Group `servers[]` model gap affects you (TF works fine; Python explicit-server-mode does not)
- Default zsroot password for new Cloud Connector / Branch Connector deployments
- Whether the ZIA `showEunatp` wire-casing asymmetry (mixed-case on read, uppercase on write) is current API behavior
- Specific cipher / TLS-version posture Zscaler presents at the SSL inspection edge
- Anything labeled `confidence: medium` + `source-tier: code` where the SDK is the only source — runtime divergence is possible

This list expands as the skill grows; `references/_meta/clarifications.md` is the canonical index. When in doubt, prefer "I don't know without your tenant" over a confident guess.

## Known open questions

[`references/_meta/clarifications.md`](references/_meta/clarifications.md) is the canonical index of unresolved questions across the skill — each with a stable ID (`zia-03`, `shared-02`, etc.), what resolves it, and which reference doc raised it. When a user's question overlaps a known gap, cite the ID and be explicit that the answer is bounded by that gap.
