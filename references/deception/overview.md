---
product: deception
topic: "deception-overview"
title: "Zscaler Deception - decoys, ZPA integration, and audited surface"
content-type: reasoning
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: cd24ac6b1f409d6752b5de8092e50dcab7b8c5c0
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zia: ae339087b83ef20d8c25e96bdeb6da025611a492
  vendor/terraform-provider-zpa: 41cac5f54065b1a2264d0ab057eba8d0b35fca25
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 63c8cc3f6e34dc37fea478c2ab7b0453e6ee5218
  vendor/zscaler-mcp-server: 47fe874551023bf8d138c24612aa4ea0f16aaa56
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-is-zscaler-deception.md"
  - "vendor/zscaler-help/about-deception-strategy.md"
  - "vendor/zscaler-help/About_Access_Policy.txt"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py"
  - "vendor/zscaler-mcp-server/skills/zpa/create-access-policy-rule/SKILL.md"
author-status: draft
---

# Zscaler Deception - decoys, ZPA integration, and audited surface

Zscaler Deception is sourceable as an active-defense product with decoys, lures, alerting, investigation, orchestration, and ZPA integration. The audited programmable surface is narrower: the refresh found adjacent ZCC OTP, ZPA policy-order, and MCP guidance hooks, but no Deception product SDK/provider/MCP/Postman CRUD surface.

## Source-family sweep

| Family | Audit result |
|---|---|
| Go SDK | No Deception product service surface found. The Go SDK has an adjacent ZCC OTP response field named `deceptionSettingsOtp` on the ZCC `/getOtp` endpoint (`vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:11-18`, `:33-50`). |
| Python SDK | No Deception product service surface found. The Python SDK has an adjacent ZCC OTP model field named `deception_settings_otp` (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:22-37`, `:60-65`). |
| Terraform | No Deception product resource found. The ZPA provider has a policy-order helper that detects a rule named `Zscaler Deception` at order `1`, preserves it when unmanaged by Terraform, and shifts user-defined order values after it (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go:258-295`). |
| Ansible | No Deception product module found in the audited ZIA or ZPA collections. |
| MCP | No Deception product tool found. MCP exposes the adjacent read-only ZCC OTP bundle and documents `deception_settings_otp` as the OTP for modifying Deception settings on a device (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:1-7`, `:46-63`, `:84-98`). The ZPA access-policy skill also treats a licensed Deception rule as tenant auto-provisioned and not to be modified (`vendor/zscaler-mcp-server/skills/zpa/create-access-policy-rule/SKILL.md:66-69`). |
| Postman | No Deception product endpoint family found in the audited OneAPI collection. |
| Help | Deception has captured Help coverage for product behavior, strategy/personality workflow, roles, decoys, ZPA integration, alerting, ThreatParse, orchestration, and remediation (`vendor/zscaler-help/what-is-zscaler-deception.md:8-10`, `:37-47`, `:51-75`; `vendor/zscaler-help/about-deception-strategy.md:8-16`). |

## What it is

The Deception Help capture describes the product as a targeted threat detection solution using lures and decoys to detect and disrupt threats such as APTs, reconnaissance, lateral movement, ransomware, SCADA, and ICS attacks (`vendor/zscaler-help/what-is-zscaler-deception.md:8`). It also says Deception integrates with the Zero Trust Exchange, tracks the attack sequence, and initiates automated response actions across the platform (`vendor/zscaler-help/what-is-zscaler-deception.md:10`).

The same capture lists network, threat-intelligence, Active Directory, endpoint, and cloud decoys (`vendor/zscaler-help/what-is-zscaler-deception.md:51-59`). It says attacker interactions with decoys generate high-fidelity real-time alerts, ThreatParse reconstructs attacks in natural language, orchestration rules can take actions, and additional decoys can validate remediation (`vendor/zscaler-help/what-is-zscaler-deception.md:61-75`).

## Strategy and ZPA integration

Deception Strategy is a configuration page for Network decoys, Threat Intelligence decoys, Active Directory decoys, and Landmine policies (`vendor/zscaler-help/about-deception-strategy.md:8`). The strategy model uses predefined personalities and can deploy using Internal or Zero Trust Network decoys (`vendor/zscaler-help/about-deception-strategy.md:10-16`).

The Deception product can integrate with ZPA to deploy Zero Trust Network decoys without extra network components or network-configuration changes (`vendor/zscaler-help/what-is-zscaler-deception.md:45-47`). In the ZPA access-policy Help capture, Deception-configured access policy rule order is not supported for direct update, and regular rules must have a greater order than Deception rules when Deception is present (`vendor/zscaler-help/About_Access_Policy.txt:169-177`). The same capture says copy, edit, and delete options are unavailable for an access policy configured using Deception (`vendor/zscaler-help/About_Access_Policy.txt:185-190`).

## Programmability posture

The Help capture says the Super admin role can manage Deception features and configurations such as user roles, APIs, decoys, and audit logs (`vendor/zscaler-help/what-is-zscaler-deception.md:37-43`). That establishes that an API concept exists in the Deception admin product, but the audited public SDK/provider/MCP/Postman trees do not expose a Deception product CRUD surface. Keep ZPA policy-order and ZCC OTP hooks separate from Deception product administration. See [clarification `deception-01`](../_meta/clarifications.md#deception-01-deception-admin-api-and-zpa-managed-object-contract).

## Open questions

- `deception-01`: The public captures do not identify the Deception admin API endpoints, API auth model, audit-log export contract, or the exact boundary for ZPA-managed objects created by Deception. See [clarification `deception-01`](../_meta/clarifications.md#deception-01-deception-admin-api-and-zpa-managed-object-contract).

## Cross-links

- Deception hub: [`./index.md`](./index.md)
- ZPA policy precedence: [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZPA Deception ordering clarification: [`zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction)
- Claims ledger: [`./_claims-ledger.md`](./_claims-ledger.md)
