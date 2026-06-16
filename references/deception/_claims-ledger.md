---
product: deception
topic: "deception-claims-ledger"
title: "Deception claims ledger - Tier 3 misc refresh"
content-type: reference
last-verified: "2026-06-16"
verified-against:
  vendor/zscaler-sdk-go: fe52adcee3dc10bbad12ea8e9f8e17a4583c655a
  vendor/zscaler-sdk-python: b3c3645fd530b668c463ce5f1331cfcfc7cb4c00
  vendor/terraform-provider-zia: 717926eb564bb21dea1f8e0c3222e6593b29f849
  vendor/terraform-provider-zpa: 8d7d7f3a8fc63bd428233b629eb08bce834e975c
  vendor/ziacloud-ansible: 896b418f25eb793551c99f9c470d3897d25f6ad1
  vendor/zpacloud-ansible: 84ab824d6ce5853c12add6ae3280dcfb8db273a2
  vendor/zscaler-mcp-server: a2162c384e1ffb68b3bf14783ea9a1a762c85ff5
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
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zcc/get_otp.py"
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
| MCP exposes the adjacent ZCC OTP bundle and identifies `deception_settings_otp` as the OTP for modifying Deception settings on a device. | `overview.md` | `vendor/zscaler-mcp-server/zscaler_mcp/tools/zcc/get_otp.py:1-18`, `:57-75` |
| MCP ZPA access-policy guidance treats the licensed Deception rule as auto-provisioned and not to be modified. | `overview.md` | `vendor/zscaler-mcp-server/skills/zpa/create-access-policy-rule/SKILL.md:66-69` |
| No Deception product CRUD surface was found in audited Go SDK, Python SDK, Ansible, MCP tools, or Postman; Terraform only had the ZPA policy-order helper. | `overview.md` | AUDIT-SCOPED ABSENCE -> 2026-06-16 search across all six requested families for Deception product administration surface. |
| Deception admin API endpoints, auth model, audit-log export, and ZPA-managed object contract remain unresolved. | `overview.md`, `clarifications.md` | OPEN QUESTION -> `references/_meta/clarifications.md#deception-01-deception-admin-api-and-zpa-managed-object-contract` |
