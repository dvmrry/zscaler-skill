# Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated (unified.overview)
Also called: experience center; zscaler experience center; unified console; unified admin console; experience center api; help.zscaler.com/unified; zscaler copilot
Former IDs: unified-01

Experience Center is the console, not a separate service with its own data plane or API. Zscaler Experience Center is a unified, AI-powered administrative and operations console that consolidates management, configuration and monitoring of the Zero Trust Exchange into a single interface, and is the hub for services including ZIA, ZPA, ZDX and Client Connector. [unified.overview:what-it-is]

**How it works.** It acts as an orchestration layer over a shared data and identity architecture: a unified identity layer (users, groups and roles with RBAC applied across services), an integrated interface with shared global search, a common policy framework, Zscaler Copilot generative-AI assistance, and a unified analytics engine that aggregates logs and telemetry from Internet & SaaS, Private Access and ZDX. [unified.overview:orchestration-layer] Its listed capabilities are unified management of all Zscaler offerings, guided onboarding and configuration walkthroughs (users, traffic forwarding, security policies), Copilot-assisted troubleshooting with natural-language questions, and persona-focused views for executives and practitioners. [unified.overview:features] The Analytics menu's dashboard and report families are mapped in [Experience Center Analytics: the dashboard and report families and which subject owns each](kb:unified.analytics).

**Its assistant.** The conversational assistant in the Admin Console is ZAgent: [ZAgent: the Admin Console's conversational AI, its agents, entitlements and history retention](kb:unified.zagent).

**Administration.** The console's home page, navigation, browsers and remote assistance are in [Zscaler Admin Console: navigation, home page, search, account settings, tables, supported browsers, read-only maintenance and remote assistance](kb:unified.admin-console), and admin sign-in in [Signing in to the Zscaler Admin Console: URLs, sign-in methods, lockouts, password and MFA reset, and the upgrade to Experience Center](kb:unified.admin-console.sign-in). First-time setup is in [Experience Center guided onboarding: adding users, traffic forwarding, and the security policy steps it walks through](kb:unified.onboarding), the organization profile, subscriptions and branding in [Experience Center account management: organization profile, subscriptions, branding, and Zscaler service in Russia](kb:unified.account-management), and the Experience Center and role management audit logs in [Experience Center and Role Management audit logs: what is recorded, categories, actions, record fields, lockout, retention, search and export](kb:unified.audit-logs). Unified RBAC is in [Unified RBAC: Admin Console roles, access levels, permission categories, scopes, assignments and obfuscation](kb:shared.admin-rbac.unified), and the Adaptive Access Engine in [Adaptive Access Engine: what it is, prerequisites, profiles, signal history and overrides](kb:unified.adaptive-access).

## Automation

No vendored client has an Experience Center or unified-console service: nothing in the Go or Python SDKs, the Terraform providers, the Ansible collections, the MCP server, the OneAPI Postman collection or the captured Automate contract. [unified.overview:no-client-surface] The MCP server's cross-product connectivity workflow spans ZPA, ZIA, ZDX and ZCC, checking ZCC client status, ZDX scores and metrics, ZPA application segment and access policy configuration, and ZIA URL filtering and SSL inspection policies. [unified.overview:mcp-cross-product] Whether Experience Center has an API of its own is open [gap:unified.overview:api-surface].

## The /unified help path

The help site's /unified path holds pages beyond Experience Center itself, among them the cloud-name map, the Agentic SecOps Platform overview and the SecOps Managing Reports page. [unified.overview:unified-path-shared-pages] The cloud-name map published there is held in [Zscaler cloud names: which cloud a tenant is on, and the production name list](kb:shared.cloud-architecture.cloud-names), and the Agentic SecOps Platform pages in [The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API](kb:portfolio.secops-platform).

**Agentic Security Operations Platform.** The Agentic Security Operations Platform console pages are in [Agentic Security Operations Platform console: data sources and outegrations, administration and analytics](kb:unified.secops-platform).

What to check:
1. For automation, use the API and client of the product being configured (ZIA, ZPA, ZDX, ZCC); no source shows an Experience Center API.
2. Before treating a help.zscaler.com/unified article as an Experience Center feature, check what product it describes.

Inferred, not quoted (say so when an answer rests on one):
- [unified.overview:no-client-surface] Tier B: Rests on an absence. The Python README's product list (introduced by the quoted line) names no Experience Center API, and at the pins `git grep -i 'experience.center'` finds nothing in the Go or Python SDKs, the ZIA, ZPA, ZCC or ZTC providers, the Ansible collections or the MCP server; the OneAPI Postman collection has no match.
- [unified.overview:unified-path-shared-pages] Tier B: Rests on the captured URLs of three pages and their titles; the help site does not state what the /unified path is for.

Not known (open gaps):
- Whether Experience Center has a standalone public API [gap:unified.overview:api-surface]: settled by source-read or support-ticket. Blocks: telling an operator whether console-level objects (global policies, shared identity, analytics) can be automated as such

Area: unified.overview, its subjects in references/_meta/spine/unified/unified.overview.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/portfolio/portfolio.secops-platform.md (The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API)
- links-to references/_meta/text/shared/shared.admin-rbac.unified.md (Unified RBAC: Admin Console roles, access levels, permission categories, scopes, assignments and obfuscation)
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/unified/unified.account-management.md (Experience Center account management: organization profile, subscriptions, branding, and Zscaler service in Russia)
- links-to references/_meta/text/unified/unified.adaptive-access.md (Adaptive Access Engine: what it is, prerequisites, profiles, signal history and overrides)
- links-to references/_meta/text/unified/unified.admin-console.md (Zscaler Admin Console: navigation, home page, search, account settings, tables, supported browsers, read-only maintenance and remote assistance)
- links-to references/_meta/text/unified/unified.admin-console.sign-in.md (Signing in to the Zscaler Admin Console: URLs, sign-in methods, lockouts, password and MFA reset, and the upgrade to Experience Center)
- links-to references/_meta/text/unified/unified.analytics.md (Experience Center Analytics: the dashboard and report families and which subject owns each)
- links-to references/_meta/text/unified/unified.audit-logs.md (Experience Center and Role Management audit logs: what is recorded, categories, actions, record fields, lockout, retention, search and export)
- links-to references/_meta/text/unified/unified.onboarding.md (Experience Center guided onboarding: adding users, traffic forwarding, and the security policy steps it walks through)
- links-to references/_meta/text/unified/unified.secops-platform.md (Agentic Security Operations Platform console: data sources and outegrations, administration and analytics)
- links-to references/_meta/text/unified/unified.zagent.md (ZAgent: the Admin Console's conversational AI, its agents, entitlements and history retention)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.terminology.md (Zscaler terminology: where each term is defined)
