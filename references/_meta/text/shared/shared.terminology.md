# Zscaler terminology: where each term is defined (shared.terminology)
Also called: terminology; glossary; what does this term mean; legacy name; old name; renamed; zscaler acronyms; ZAC; Device Profile; Web Forwarding Profile; deeptrace; BC Cloud; BCP Cloud; CAC; SaaS Application Control; ECG; Edge Connector Group; ZTW; ZTC; Zscaler for Workloads; ZBI; ZCell; ZGuard; AL1; Customer-Managed Dedicated IP; Zscaler Experience Center; Zero Trust Cloud; Zero Trust Workload; what does zen mean

Zscaler has renamed components without purging the old names from logs, APIs and operator vocabulary. This lookup sends each term to the subject or doc that defines it; renames a source shows are in [Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC](kb:shared.terminology.product-names) and [Service Edge names in logs, APIs and support: ZEN, broker, PSEN, VZEN](kb:shared.terminology.service-edge-names).

Several older names and abbreviations in circulation have no captured source yet [gap:shared.terminology:unverified-aliases].

## Infrastructure

| Term | Defined in |
| --- | --- |
| Service Edge (ZIA Public, Private, Virtual; ZPA Public, Private) | [Service Edges: the data plane, its form factors, and how traffic reaches one](kb:shared.cloud-architecture.service-edges); older names in [Service Edge names in logs, APIs and support: ZEN, broker, PSEN, VZEN](kb:shared.terminology.service-edge-names) |
| Central Authority (CA) | [The Central Authority: what it holds, and how ZIA and ZPA cluster it differently](kb:shared.cloud-architecture.central-authority) |
| Zero Trust Exchange (ZTE) | [The Private Access Central Authority is the brain and nervous system of the Zero Trust Exchange: a geographically distributed system of in-sync nodes that all actively service requests.](kb:shared.cloud-architecture.central-authority:zpa-ca-active-active) |
| Nanolog cluster, Log Router | [Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS](kb:shared.cloud-architecture.logging-path) |
| Feed Central | [Zscaler Feed Central is a separate Zscaler cloud used solely for the centralized distribution of various feeds to the Zscaler clouds.](kb:shared.cloud-architecture.support-systems:feed-central) |
| Zscaler Admin Console | [Each cloud has support systems and servers, including Sandbox servers (files selected for behavioral analysis are sent there and reports are stored), PAC file servers (hosting Zscaler PAC files and custom PAC files uploaded to Zscaler), the multi-tenant Zscaler Admin Console for policy management and reporting, and Log Routers.](kb:shared.cloud-architecture.support-systems:support-systems) |
| Business Continuity Cloud | [Private Service Edges in the Business Continuity Cloud](kb:zia.private-service-edge.business-continuity) |
| App Connector | [ZPA App Connectors](kb:zpa.app-connectors) |
| Z-Tunnel | [Z-Tunnel and Microtunnel: the two tunnel layers of Private Access](kb:shared.cloud-architecture.tunnels); Client Connector's 1.0 and 2.0 in [Z-Tunnel 1.0 and 2.0: what each carries and how a profile selects one](kb:zcc.z-tunnel.versions) and [Z-Tunnel 1.0 and 2.0: where each question is answered](kb:shared.z-tunnel) |
| Microtunnel (M-Tunnel) | [Z-Tunnel and Microtunnel: the two tunnel layers of Private Access](kb:shared.cloud-architecture.tunnels) |
| Subcloud | [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds) |

## Clients, identity and API

| Term | Defined in |
| --- | --- |
| Forwarding Profile | [ZCC forwarding profiles](kb:zcc.forwarding-profiles); API path in [Forwarding profiles are created and updated through the same `POST /webForwardingProfile/edit`: the contract has a POST on that path described as updating a profile, the Go SDK's create function posts there and reports a 'create/update' failure, and the Python `update_forwarding_profile` posts there too.](kb:zcc.api.forwarding-profile-wire:edit-is-post) |
| Trusted Network | [ZCC trusted networks](kb:zcc.trusted-networks) |
| App Profile | [ZCC app profiles (web policies)](kb:zcc.app-profiles); API path in [One endpoint, `PUT /web/policy/edit`, adds or updates a policy or app profile for a platform; the Go SDK's model says the API treats a body with no `id` key as a create.](kb:zcc.api.web-policy-wire:edit-adds-or-updates) |
| LWF driver | [Windows filter driver install parameters (LWF)](kb:zcc.install.windows-driver) |
| ZIdentity, Authentication Level | [What ZIdentity (Authentication Service) is, and where each part of it is covered](kb:zidentity.overview); level limits in [Each level has a validity period in minutes, hours or days, and a parent level's validity must be less than that of any of its sub-levels. A tree of levels can hold at most 32 levels and no branch can be deeper than 4.](kb:zia.authentication.step-up:level-limits) |
| Step-Up Authentication | [Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear](kb:zidentity.step-up); on ZIA rules [Step-up authentication and ZIdentity authentication levels](kb:zia.authentication.step-up) |
| OneAPI | [How a client gets and uses a OneAPI access token](kb:shared.oneapi.authentication) |
| API Client, Resource Server | [ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime](kb:zidentity.api-clients), [ZIdentity resource servers (API resources): a read-only registry of the scopes API clients can select](kb:zidentity.resource-servers) |

## Data protection and egress

| Term | Defined in |
| --- | --- |
| DLP dictionary, EDM, MIP labels | [DLP dictionaries: predefined, cloned and custom](kb:zia.dlp.dictionaries) |
| DLP engine | [DLP engines: the unit a rule references](kb:zia.dlp.engines) |
| ICAP receiver, Zscaler Incident Receiver, cloud-to-cloud incident forwarding | [Where a DLP match goes: notification, ICAP, Incident Receiver and Cloud-to-Cloud](kb:zia.dlp.incident-forwarding); ICAP receivers in [ICAP receivers for DLP: secure and unencrypted ICAP, the FCC cloud and mTLS](kb:zia.dlp.icap-receivers), the Incident Receiver in [Zscaler Incident Receiver: requirements per platform, storage, health check and VM commands](kb:zia.dlp.incident-receiver), Cloud-to-Cloud in [Cloud-to-Cloud Incident Forwarding: storage onboarding for AWS, Google Cloud and Azure](kb:zia.dlp.cloud-to-cloud-forwarding) |
| Source IP Anchoring (SIPA) | [Source IP Anchoring across ZIA and Private Access: path, pieces and interactions](kb:shared.source-ip-anchoring), [Source IP Anchoring: what it needs on each side](kb:zia.forwarding-control.sipa) |
| Bring Your Own IP (BYOIP) | [Customer-owned Dedicated IP addresses (BYOIP)](kb:zia.forwarding-control.byoip) |
| Source IP Anchoring Direct | [Source IP Anchoring Direct during ZIA disaster recovery](kb:zia.forwarding-control.sipa-direct) |
| ZPA Gateway | [The Private Access gateway object in ZIA](kb:zia.forwarding-control.zpa-gateway) |
| ZIA Service Edge (client type) | [The client forwarding policy needs separate rules for IP-based and domain-based segments. IP-based: the Only Forward Allowed Applications action. Domain-based: Rule 1 Bypass ZPA for all client types except ZIA Service Edge, and Rule 2 Forward to ZPA for only the ZIA Service Edge client type.](kb:zia.forwarding-control.sipa:client-forwarding-policy) |
| ZPA Resolver DNS rules | [Predefined DNS Control rules and the ZPA resolvers](kb:zia.dns-control.predefined-rules) |

## Products

| Term | Defined in |
| --- | --- |
| Internet & SaaS (ZIA), Private Access (ZPA) | [Help pages name ZIA both Internet & SaaS and Internet Access, and ZPA Private Access: for example "Public Service Edges for Internet & SaaS (ZIA)", "Public Service Edges for Internet Access (ZIA)" and "Private Access (ZPA)".](kb:shared.terminology.product-names:service-names) |
| Zscaler Client Connector | [The NSS web log lists the Client Connector forwarding method value as "Zscaler Client Connector (Zscaler App)", with Zscaler App in parentheses.](kb:shared.terminology.product-names:zscaler-app) |
| Zero Trust Browser | [Zero Trust Browser was formerly Zscaler Isolation; the NSS web log's field descriptions call it "Zero Trust Browser (formerly Isolation)".](kb:shared.terminology.product-names:zero-trust-browser); Turbo Mode and isolation profiles in [How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout](kb:zbi.cloud-browser); Smart Browser Isolation in [What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy](kb:zbi.policy) |
| Cloud App Control | [ZIA Cloud App Control](kb:zia.cloud-app-control) |
| Cloud & Branch Connector | [Cloud & Branch Connector: what Cloud Connector is and where each area is described](kb:cloud-connector.overview); groups in [Cloud Connector groups: what they are for, autoscaling names, status and disabling](kb:cloud-connector.overview.groups) and [In the Cloud & Branch Connector API, /ecgroup lists Cloud & Branch Connector groups, under the tag Cloud & Branch Connector Groups.](kb:shared.terminology.product-names:ecgroup); the Terraform provider name in [The Terraform provider ZTC is the provider for Zscaler Zero Trust Cloud resources.](kb:shared.terminology.product-names:ztc-expansion) |
| Zero Trust Gateway | [Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available](kb:cloud-connector.overview.zero-trust-gateways) |
| Zscaler Digital Experience (ZDX) | [ZDX at a glance: what it measures and which subject answers each question](kb:zdx.overview); Diagnostics Sessions in [ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered](kb:zdx.diagnostics) and the API deep trace in [The ZDX API calls its on-demand per-device trace a deep trace: POST /v1/devices/{id}/deeptraces starts one on a device, limited to one active session per device and 15 active sessions across all devices, counting sessions started from the UI.](kb:shared.terminology.product-names:zdx-deep-trace); Cloud Path and Page Fetch Time in [ZDX probes: Web and Cloud Path probes, what they measure and how they run](kb:zdx.probes) and [The ZDX Score: scale, bands, score types and what lowers it](kb:zdx.score); the Telemetry and Policy Gateway in [ZDX cloud architecture: components, the telemetry path and what is undocumented](kb:zdx.cloud-architecture) |
| AI Guard, AI Access Security | [AI Guard: runtime guardrails on prompts and responses, its Proxy and DAS/API modes, and where each part is documented](kb:ai-security.ai-guard), [The AI Security family: AI Access Security, AI Guard (AI Guardrails), AI Red Teaming and the AI asset inventory](kb:ai-security.family); the Python accessor alias in [In the Python SDK, `client.zguard` is a deprecated alias for the `aiguard` property.](kb:shared.terminology.product-names:zguard-alias) |
| Workflow Automation (ZWA), incidents, workflow templates and mappings | [Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting](kb:zwa.incidents) |
| Breach Predictor | [Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with](kb:breach-predictor.overview) |
| SOC Workbench | [SOC Workbench (Agentic SOC): alert unification, correlation and prioritization, and what can be automated](kb:soc-workbench.overview) |
| Asset Exposure Management (AEM) | [Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated](kb:aem.overview) |
| Unified Vulnerability Management (UVM) | [Unified Vulnerability Management (UVM): what it does with findings, and what can be automated](kb:uvm.overview) |
| Identity Protection (ITDR) | [Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview) |
| Data Security Posture Management (DSPM) | [Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated](kb:dspm.overview) |
| Zero Trust Branch | [Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed](kb:zero-trust-branch.overview) |
| Zscaler Cellular | [Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy](kb:zscaler-cellular.overview) |
| Business Insights | [Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources](kb:business-insights.overview); the Python client in [In the Python SDK, the `zbi` service client is Zscaler Business Insights, not browser isolation.](kb:shared.terminology.product-names:zbi-is-business-insights) |
| Unified (Experience Center) | [Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated](kb:unified.overview) |

What to check:
1. Answer with the current name, give the older name in parentheses when the question used it, and keep log, ticket and runbook terms as written when quoting them.
2. Treat an alias listed only in the unverified-aliases gap as a lead, not a confirmed equivalence.

Not known (open gaps):
- Older names and abbreviations with no captured source [gap:shared.terminology:unverified-aliases]: settled by source-read or code-read. Blocks: confirming that an older term means the same component

Area: shared.terminology, its subjects in references/_meta/spine/shared/shared.terminology.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.terminology.product-names.md (Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC)
- links-to references/_meta/text/shared/shared.cloud-architecture.central-authority.md (The Central Authority: what it holds, and how ZIA and ZPA cluster it differently)
- links-to references/_meta/text/shared/shared.cloud-architecture.support-systems.md (Support systems of a Zscaler cloud, and Feed Central)
- links-to references/_meta/text/shared/shared.cloud-architecture.tunnels.md (Z-Tunnel and Microtunnel: the two tunnel layers of Private Access)
- links-to references/_meta/text/shared/shared.terminology.service-edge-names.md (Service Edge names in logs, APIs and support: ZEN, broker, PSEN, VZEN)
- links-to references/_meta/text/zia/zia.authentication.step-up.md (Step-up authentication and ZIdentity authentication levels)
- links-to references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side)
- links-to references/_meta/text/aem/aem.overview.md (Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated)
- links-to references/_meta/text/ai-security/ai-security.ai-guard.md (AI Guard: runtime guardrails on prompts and responses, its Proxy and DAS/API modes, and where each part is documented)
- links-to references/_meta/text/ai-security/ai-security.family.md (The AI Security family: AI Access Security, AI Guard (AI Guardrails), AI Red Teaming and the AI asset inventory)
- links-to references/_meta/text/breach-predictor/breach-predictor.overview.md (Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with)
- links-to references/_meta/text/business-insights/business-insights.overview.md (Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.zero-trust-gateways.md (Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available)
- links-to references/_meta/text/dspm/dspm.overview.md (Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
- links-to references/_meta/text/shared/shared.cloud-architecture.logging-path.md (Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS)
- links-to references/_meta/text/shared/shared.cloud-architecture.service-edges.md (Service Edges: the data plane, its form factors, and how traffic reaches one)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/shared/shared.source-ip-anchoring.md (Source IP Anchoring across ZIA and Private Access: path, pieces and interactions)
- links-to references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic)
- links-to references/_meta/text/shared/shared.z-tunnel.md (Z-Tunnel 1.0 and 2.0: where each question is answered)
- links-to references/_meta/text/soc-workbench/soc-workbench.overview.md (SOC Workbench (Agentic SOC): alert unification, correlation and prioritization, and what can be automated)
- links-to references/_meta/text/unified/unified.overview.md (Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated)
- links-to references/_meta/text/uvm/uvm.overview.md (Unified Vulnerability Management (UVM): what it does with findings, and what can be automated)
- links-to references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)
- links-to references/_meta/text/zbi/zbi.policy.md (What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy)
- links-to references/_meta/text/zcc/zcc.api.forwarding-profile-wire.md (ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies))
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
- links-to references/_meta/text/zcc/zcc.install.windows-driver.md (Windows filter driver install parameters (LWF))
- links-to references/_meta/text/zcc/zcc.trusted-networks.md (ZCC trusted networks)
- links-to references/_meta/text/zcc/zcc.z-tunnel.versions.md (Z-Tunnel 1.0 and 2.0: what each carries and how a profile selects one)
- links-to references/_meta/text/zdx/zdx.cloud-architecture.md (ZDX cloud architecture: components, the telemetry path and what is undocumented)
- links-to references/_meta/text/zdx/zdx.diagnostics.md (ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered)
- links-to references/_meta/text/zdx/zdx.overview.md (ZDX at a glance: what it measures and which subject answers each question)
- links-to references/_meta/text/zdx/zdx.probes.md (ZDX probes: Web and Cloud Path probes, what they measure and how they run)
- links-to references/_meta/text/zdx/zdx.score.md (The ZDX Score: scale, bands, score types and what lowers it)
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.overview.md (Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed)
- links-to references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
- links-to references/_meta/text/zia/zia.dlp.cloud-to-cloud-forwarding.md (Cloud-to-Cloud Incident Forwarding: storage onboarding for AWS, Google Cloud and Azure)
- links-to references/_meta/text/zia/zia.dlp.dictionaries.md (DLP dictionaries: predefined, cloned and custom)
- links-to references/_meta/text/zia/zia.dlp.engines.md (DLP engines: the unit a rule references)
- links-to references/_meta/text/zia/zia.dlp.icap-receivers.md (ICAP receivers for DLP: secure and unencrypted ICAP, the FCC cloud and mTLS)
- links-to references/_meta/text/zia/zia.dlp.incident-forwarding.md (Where a DLP match goes: notification, ICAP, Incident Receiver and Cloud-to-Cloud)
- links-to references/_meta/text/zia/zia.dlp.incident-receiver.md (Zscaler Incident Receiver: requirements per platform, storage, health check and VM commands)
- links-to references/_meta/text/zia/zia.dns-control.predefined-rules.md (Predefined DNS Control rules and the ZPA resolvers)
- links-to references/_meta/text/zia/zia.forwarding-control.byoip.md (Customer-owned Dedicated IP addresses (BYOIP))
- links-to references/_meta/text/zia/zia.forwarding-control.sipa-direct.md (Source IP Anchoring Direct during ZIA disaster recovery)
- links-to references/_meta/text/zia/zia.forwarding-control.zpa-gateway.md (The Private Access gateway object in ZIA)
- links-to references/_meta/text/zia/zia.private-service-edge.business-continuity.md (Private Service Edges in the Business Continuity Cloud)
- links-to references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
- links-to references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
- links-to references/_meta/text/zidentity/zidentity.resource-servers.md (ZIdentity resource servers (API resources): a read-only registry of the scopes API clients can select)
- links-to references/_meta/text/zidentity/zidentity.step-up.md (Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear)
- links-to references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.overview.md (Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy)
- links-to references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)
