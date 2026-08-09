---
product: deception
topic: "deception-claims-ledger"
title: "Deception claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: 0d789caf9b79966cd1973cc227d6d2862e46e05d
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
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

# Deception claims ledger

| Claim | Reference surface | Source line(s) |
|---|---|---|
| Deception uses advanced lures and decoys to detect and disrupt threats such as APTs, exploits, reconnaissance, lateral movement, ransomware, SCADA, and ICS attacks. | `index.md`, `overview.md` | `vendor/zscaler-help/what-is-zscaler-deception.md:8` |
| Deception integrates with the Zero Trust Exchange, tracks attack sequences, and initiates automated response actions. | `overview.md` | `vendor/zscaler-help/what-is-zscaler-deception.md:10` |
| Deception roles include Administrator, Analyst, Responder, and Super admin; Super admin coverage includes APIs, decoys, and audit logs. | `overview.md` | `vendor/zscaler-help/what-is-zscaler-deception.md:37-43` |
| Deception can integrate with ZPA to deploy Zero Trust Network decoys without additional network components or network-configuration changes. | `index.md`, `overview.md` | `vendor/zscaler-help/what-is-zscaler-deception.md:45-47` |
| Deception decoy types include Network, Threat Intelligence, Active Directory, Endpoint, and Cloud decoys. | `overview.md` | `vendor/zscaler-help/what-is-zscaler-deception.md:51-59` |
| Decoy interactions generate high-fidelity real-time alerts; ThreatParse reconstructs attacks in natural language; orchestration and remediation flows are captured in Help. | `overview.md` | `vendor/zscaler-help/what-is-zscaler-deception.md:61-75` |
| Deception Strategy configures Network, TI, AD decoys, and Landmine policies, using personalities and Internal or ZTN deployment paths. | `overview.md` | `vendor/zscaler-help/about-deception-strategy.md:8-16` |
| ZPA access-policy Help says Deception rule-order updates are not supported and regular rules must have greater order than Deception rules when present. | `index.md`, `overview.md` | `vendor/zscaler-help/About_Access_Policy.txt:169-177` |
| ZPA access-policy Help says copy, edit, and delete options are unavailable for access policies configured using Deception. | `index.md`, `overview.md` | `vendor/zscaler-help/About_Access_Policy.txt:185-190` |
| The Go SDK has an adjacent ZCC OTP response field named `deceptionSettingsOtp`; this is not a Deception product admin API. | `overview.md` | `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:11-18`, `:33-50` |
| The Python SDK has an adjacent ZCC OTP model field named `deception_settings_otp`; this is not a Deception product admin API. | `overview.md` | `vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:22-37`, `:60-65` |
| Terraform ZPA policy access rule reordering preserves an unmanaged rule named `Zscaler Deception` at order 1 and shifts user-defined rules after it. | `overview.md` | `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go:258-295` |
| MCP exposes the adjacent read-only ZCC OTP bundle as the full SDK-modeled record; the bundled ZCC workflow identifies `deceptionSettingsOtp` as the value for modifying Deception settings on a device. | `overview.md` | `vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcc/get_otp.py:46-67`; `vendor/zscaler-mcp-server/skills/zcc/generate-logout-otp/SKILL.md:35-42` |
| MCP ZPA access-policy guidance treats the licensed Deception rule as auto-provisioned and not to be modified. | `overview.md` | `vendor/zscaler-mcp-server/skills/zpa/create-access-policy-rule/SKILL.md:66-69` |
| A Deception network decoy can expose an MCP server service to AI applications and LLM chatbots; invoked tools return fabricated data and may seed responses with other deployed decoy hostnames. | `index.md`, `overview.md` | `vendor/zscaler-help/configuring-services-network-decoy.md:17-36` |
| MCP server decoy configuration includes name, version, application selection, ports, SSL, and optional PEM certificate plus unencrypted PEM private key; encrypted private keys are unsupported on this path. | `overview.md` | `vendor/zscaler-help/configuring-services-network-decoy.md:38-48` |
| The current MCP server decoy matrix lists 38 tools across 10 application families, with Support as the path for another application or tool. | `overview.md` | `vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md:12-35` |
| Gen AI decoys require Advanced, while the current plan table lists 20 total decoys for Standard and 300 for Advanced; no separate MCP-server or MCP-call quota is published. | `overview.md` | `vendor/zscaler-help/deception-ranges-and-limitations.md:12-24`, `:35-40` |
| The Deception MCP server decoy is attacker-facing and does not document an administrative MCP or Deception management API. | `index.md`, `overview.md` | `vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md:37-42`; `vendor/zscaler-help/configuring-services-network-decoy.md:50-55` |
| No Deception product CRUD surface was found in audited Go SDK, Python SDK, Ansible, MCP tools, or Postman; Terraform only had the ZPA policy-order helper. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across all six requested families for Deception product administration surface. |
| Deception admin API endpoints, auth model, audit-log export, and ZPA-managed object contract remain unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#deception-01-deception-admin-api-and-zpa-managed-object-contract` |
