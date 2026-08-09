---
product: deception
topic: "deception-overview"
title: "Zscaler Deception - decoys, ZPA integration, and audited surface"
content-type: reasoning
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 1872e3bdad259457f9261801841b4a8d3f4a6074
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-is-zscaler-deception.md"
  - "vendor/zscaler-help/about-deception-strategy.md"
  - "vendor/zscaler-help/About_Access_Policy.txt"
  - "vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md"
  - "vendor/zscaler-help/configuring-services-network-decoy.md"
  - "vendor/zscaler-help/deception-ranges-and-limitations.md"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py"
  - "vendor/zscaler-mcp-server/skills/zpa/create-access-policy-rule/SKILL.md"
author-status: draft
---

# Zscaler Deception - decoys, ZPA integration, and audited surface

Zscaler Deception is sourceable as an active-defense product with decoys,
lures, alerting, investigation, orchestration, and ZPA integration. The audited
management surface is narrower: the refresh found adjacent ZCC OTP, ZPA
policy-order, and MCP guidance hooks, but no Deception product
SDK/provider/management-MCP/Postman CRUD surface. Separately, current Help
documents a network-decoy service that speaks MCP to AI clients; it is an
attacker-facing deception surface, not a management tool.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No Deception product service surface found. The Go SDK has an adjacent ZCC OTP response field named `deceptionSettingsOtp` on the ZCC `/getOtp` endpoint (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:11-18`, `:33-50`). |
| Python SDK | No Deception product service surface found. The Python SDK has an adjacent ZCC OTP model field named `deception_settings_otp` (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:22-37`, `:60-65`). |
| Terraform | No Deception product resource found. The ZPA provider has a policy-order helper that detects a rule named `Zscaler Deception` at order `1`, preserves it when unmanaged by Terraform, and shifts user-defined order values after it (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go:258-295`). |
| Ansible | No Deception product module found in the audited ZIA or ZPA collections. |
| MCP | No Deception administrative tool was found in the vendored management MCP server. It exposes the adjacent read-only ZCC OTP bundle (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:46-67`), while its ZCC workflow identifies `deceptionSettingsOtp` as the value for modifying Deception settings on a device (`vendor/zscaler-mcp-server/skills/zcc/generate-logout-otp/SKILL.md:35-42`). The ZPA access-policy skill treats a licensed Deception rule as tenant auto-provisioned and not to be modified (`vendor/zscaler-mcp-server/skills/zpa/create-access-policy-rule/SKILL.md:66-69`). Current Help separately documents an adversary-facing Deception network decoy that implements the MCP protocol (`vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md:37-42`). |
| Postman | No Deception product endpoint family found in the audited OneAPI collection. |
| Help | Deception has captured Help coverage for product behavior, strategy/personality workflow, roles, decoys, ZPA integration, alerting, ThreatParse, orchestration, remediation, MCP server decoys, and plan boundaries (`vendor/zscaler-help/what-is-zscaler-deception.md:8-10`, `:37-47`, `:51-75`; `vendor/zscaler-help/about-deception-strategy.md:8-16`; `vendor/zscaler-help/configuring-services-network-decoy.md:17-48`; `vendor/zscaler-help/deception-ranges-and-limitations.md:12-24`). |

## What it is

The Deception Help capture describes the product as a targeted threat detection solution using lures and decoys to detect and disrupt threats such as APTs, reconnaissance, lateral movement, ransomware, SCADA, and ICS attacks (`vendor/zscaler-help/what-is-zscaler-deception.md:8`). It also says Deception integrates with the Zero Trust Exchange, tracks the attack sequence, and initiates automated response actions across the platform (`vendor/zscaler-help/what-is-zscaler-deception.md:10`).

The same capture lists network, threat-intelligence, Active Directory, endpoint, and cloud decoys (`vendor/zscaler-help/what-is-zscaler-deception.md:51-59`). It says attacker interactions with decoys generate high-fidelity real-time alerts, ThreatParse reconstructs attacks in natural language, orchestration rules can take actions, and additional decoys can validate remediation (`vendor/zscaler-help/what-is-zscaler-deception.md:61-75`).

## Strategy and ZPA integration

Deception Strategy is a configuration page for Network decoys, Threat Intelligence decoys, Active Directory decoys, and Landmine policies (`vendor/zscaler-help/about-deception-strategy.md:8`). The strategy model uses predefined personalities and can deploy using Internal or Zero Trust Network decoys (`vendor/zscaler-help/about-deception-strategy.md:10-16`).

The Deception product can integrate with ZPA to deploy Zero Trust Network decoys without extra network components or network-configuration changes (`vendor/zscaler-help/what-is-zscaler-deception.md:45-47`). In the ZPA access-policy Help capture, Deception-configured access policy rule order is not supported for direct update, and regular rules must have a greater order than Deception rules when Deception is present (`vendor/zscaler-help/About_Access_Policy.txt:169-177`). The same capture says copy, edit, and delete options are unavailable for an access policy configured using Deception (`vendor/zscaler-help/About_Access_Policy.txt:185-190`).

## MCP server decoys (attacker-facing)

Source: `vendor/zscaler-help/configuring-services-network-decoy.md`; `vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md`; `vendor/zscaler-help/deception-ranges-and-limitations.md`.

The Gen AI service on a network decoy can be configured as an **MCP Server**.
An MCP-compatible AI application or LLM chatbot invokes the decoy tools and
receives fabricated responses
(`vendor/zscaler-help/configuring-services-network-decoy.md:17-36`). The portal
can incorporate hostnames from deployed Threat Intelligence and Zero Trust
Network decoys into those responses, directing an attacker toward other decoys
in the customer environment
(`vendor/zscaler-help/configuring-services-network-decoy.md:32-36`).

The MCP service configuration includes server name, server version, one or more
application families, one or more ports with SSL selected per port, and optional
PEM certificate and unencrypted PEM private key. Encrypted private keys are not
supported on this custom-certificate path
(`vendor/zscaler-help/configuring-services-network-decoy.md:38-48`). The current
published matrix contains 38 tools across 10 application families and directs
requests for another application or tool to Zscaler Support
(`vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md:12-35`).

Gen AI decoys are an Advanced-plan feature and are not supported on Standard.
The same limits table lists 20 total decoys for Standard and 300 for Advanced,
API Access only on Advanced, and Audit Logs on both plans
(`vendor/zscaler-help/deception-ranges-and-limitations.md:12-24`). It does not
publish a separate numeric limit for MCP server decoys or MCP tool calls
(`vendor/zscaler-help/deception-ranges-and-limitations.md:35-40`).

This MCP surface is the service an adversary interacts with. It does not close
the separate management-API question: neither the tool matrix nor the service
configuration article documents administrative MCP tools or a Deception tenant
CRUD API
(`vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md:37-42`,
`vendor/zscaler-help/configuring-services-network-decoy.md:50-55`).

## Programmability posture

The Help capture says the Super admin role can manage Deception features and configurations such as user roles, APIs, decoys, and audit logs (`vendor/zscaler-help/what-is-zscaler-deception.md:37-43`). That establishes that an API concept exists in the Deception admin product, but the audited public SDK/provider/MCP/Postman trees do not expose a Deception product CRUD surface. Keep ZPA policy-order and ZCC OTP hooks separate from Deception product administration. See [clarification `deception-01`](../_meta/clarifications.md#deception-01-deception-admin-api-and-zpa-managed-object-contract).

## Open questions

- `deception-01`: The public captures do not identify the Deception admin API endpoints, API auth model, audit-log export contract, or the exact boundary for ZPA-managed objects created by Deception. See [clarification `deception-01`](../_meta/clarifications.md#deception-01-deception-admin-api-and-zpa-managed-object-contract).

## Cross-links

- Deception hub: [`./index.md`](./index.md)
- ZPA policy precedence: [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZPA Deception ordering clarification: [`zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
