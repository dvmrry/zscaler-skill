---
product: zbi
topic: "zbi-index"
title: "ZBI (Zero Trust Browser / Cloud Browser Isolation) reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-is-zero-trust-browser.md"
  - "vendor/zscaler-help/understanding-turbo-mode-isolation.md"
  - "vendor/zscaler-help/configuring-smart-browser-isolation-policy.md"
  - "vendor/zscaler-help/zpa-about-isolation-policy.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go"
  - "vendor/terraform-provider-zia/zia/data_source_zia_cloud_browser_isolation_profile.go"
  - "vendor/terraform-provider-zpa/zpa/provider.go"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule_v2.go"
  - "vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/get_isolation_profile.py"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py"
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# Zero Trust Browser / Cloud Browser Isolation (ZBI) reference hub

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`; `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`.

Entry point for browser-isolation questions. Zero Trust Browser renders web pages on an ephemeral **cloud-hosted browser** and streams the result to the user's native browser, so HTML/CSS/JS never reach the endpoint (`vendor/zscaler-help/what-is-zero-trust-browser.md:14`, `:18`). It is used for internet traffic routed through ZIA policies and private-app access routed through ZPA isolation policy (`vendor/zscaler-help/what-is-zero-trust-browser.md:22`, `vendor/zscaler-help/zpa-about-isolation-policy.md:16`).

## Naming — multiple aliases, one product

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py`; `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbibannercontroller/cbibannercontroller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiregions/cbiregions.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbicertificatecontroller/cbicertificatecontroller.go`.

The product has been renamed twice. Operators use all of these names interchangeably in tickets, runbooks, and admin consoles:

- **Zero Trust Browser / ZTB** (current marketing, newer admin UI sections — "ZTB" is the current-marketing abbreviation)
- **Cloud Browser Isolation (CBI)** (URL path / original marketing; still used in ZIA admin console references and URL Filter `Isolate` action)
- **ZBI** (legacy shorthand often used in tickets for Zscaler Browser Isolation; do not assume this means the Python `client.zbi` accessor)
- **Zscaler Isolation** (legacy name — what some help-article URLs still use)

Important namespace caveat: the current Python SDK's `client.zbi` service is explicitly **Zscaler Business Insights**, not Zero Trust Browser (`vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-24`, `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:237`, `:331-335`). Browser-isolation automation lives under ZIA Cloud Browser Isolation, ZPA CBI/isolation surfaces, Terraform provider resources/data sources, Ansible modules, MCP ZPA tools, and the Postman CBI controllers. When answering a question, translate the user's wording to the current source surface before naming an SDK accessor.

## Topics

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`; `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go`; `vendor/terraform-provider-zia/zia/data_source_zia_cloud_browser_isolation_profile.go`; `vendor/terraform-provider-zpa/zpa/provider.go`; `vendor/ziacloud-ansible/plugins/modules/zia_cloud_browser_isolation_profile_info.py`; `vendor/zpacloud-ansible/plugins/modules/zpa_policy_access_isolation_rule_v2.py`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/get_isolation_profile.py`; `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/access_isolation_rules.py`; `vendor/zscaler-api-specs/oneapi-postman-collection.json`.

| Topic | File | Status |
|---|---|---|
| Overview — traffic flow, container model, Turbo Mode vs pixel streaming, architecture components | [`./overview.md`](./overview.md) | draft |
| Policy integration — how ZIA URL Filter `Isolate` action, ZPA Isolation Policy, and Smart Browser Isolation compose; isolation profiles; subscription tiers | [`./policy-integration.md`](./policy-integration.md) | draft |
| **API surface** — Python and Go ZIA read surfaces, ZPA CBI profile/banner/certificate CRUD, read-only region/ZPA projection/profile surfaces, Terraform/Ansible/MCP/Postman coverage, Business Insights namespace caveat, and singular-vs-plural endpoint quirks | [`./api.md`](./api.md) | draft |
| Claims ledger — claim-by-claim source map and open-question forcing function for this refresh | [`./_claims-ledger.md`](./_claims-ledger.md) | draft |

## Scope

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`; `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`.

In scope:

- Architecture and traffic flow
- ZIA-side: URL Filter `Isolate` action, Smart Browser Isolation policy, isolation profiles
- ZPA-side: Isolation Policy rules, ZPA isolation profiles
- Turbo Mode (instruction-streaming) vs pixel streaming
- Tiered subscriptions (full ZBI vs "Miscellaneous & Unknown" limited tier)
- Session/container lifecycle (10-min idle timeout)
- Cross-product hooks (SSL Inspection dependency, Malware Protection prerequisite)
- Programmable surfaces for ZIA read/profile references, ZPA CBI profile and related objects, ZPA isolation policy rules, Smart Browser Isolation Terraform configuration, Ansible read/write modules, MCP read/write policy tooling, and the Python `client.zbi` naming collision

Not in scope (explicitly deferred):

- **Votiro CDR integration** — third-party file-gateway integration for isolated downloads/uploads. Referenced in `understanding-votiro-integration-isolation` help article but not captured.
- **Local Browser Rendering** — edge feature mentioned in help articles.
- **Sandbox + Isolation integration** — file scanning flow when isolation downloads a file; referenced but not captured.
- **End-user experience features** (language translate, right-click menu, search in isolation, debug mode, isolation bar, etc.) — UX details not usually relevant to skill reasoning.
- **Zero Trust Client Browser** — the native browser extension / agent that pairs with server-side isolation; separate subsystem.
- **Business Insights custom-app/report APIs** — surfaced by Python `client.zbi`; covered here only to prevent Browser Isolation misattribution.

## When the question spans ZBI + another product

Source: `vendor/zscaler-help/configuring-smart-browser-isolation-policy.md`; `vendor/zscaler-help/zpa-about-isolation-policy.md`; `vendor/zscaler-help/understanding-isolation-miscellaneous-unknown-category-zia.md`.

- **"URL Filter Isolate action — what happens?"** → [`./policy-integration.md`](./policy-integration.md) for the ZIA side, then cross to [`../zia/url-filtering.md`](../zia/url-filtering.md) for rule evaluation.
- **"ZPA Isolation Policy — how does it evaluate?"** → [`./policy-integration.md`](./policy-integration.md), then cross to [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for the policy-family evaluation order.
- **"Why did the Isolate rule fail?"** → likely SSL Inspection gap (Smart Isolation requires decrypt) or Malware Protection inbound/outbound toggles off. Cross-product gate — see [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md).
- **"Isolated session failed / timed out unexpectedly"** → container idle timeout is 10 minutes. ZPA Isolation timeout is the minimum across all configured ZPA timeout policies. See [`./overview.md`](./overview.md).
