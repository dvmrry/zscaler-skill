---
product: deception
topic: "deception-index"
title: "Zscaler Deception reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
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
author-status: reviewed
---

# Zscaler Deception reference hub

Entry point for Zscaler Deception questions. The refreshed source-backed summary is [`./overview.md`](./overview.md); the per-claim forcing function is [`./_claims-ledger.md`](./_claims-ledger.md).

## Topics

| Topic | File | Status |
|---|---|---|
| Decoys, strategy, ZPA integration, attacker-facing MCP server decoys, and audited management surface | [`./overview.md`](./overview.md) | draft |

## Scope boundary

Deception is a separate active-defense product, not a ZPA feature. Its Help capture says it uses decoys and lures to detect and disrupt threats such as reconnaissance, lateral movement, ransomware, and ICS/SCADA attacks (`vendor/zscaler-help/what-is-zscaler-deception.md:8`). It integrates with ZPA for Zero Trust Network decoys without extra network components (`vendor/zscaler-help/what-is-zscaler-deception.md:45-47`), and ZPA access-policy docs describe Deception-configured policy rules as constrained for rule-order changes and copy/edit/delete options (`vendor/zscaler-help/About_Access_Policy.txt:169-177`, `:185-190`).

The audited public SDK/provider/management-MCP/Postman surface does not expose
Deception product CRUD. Current Help does document an attacker-facing network
decoy that speaks MCP to AI applications and serves fabricated tool responses
(`vendor/zscaler-help/supported-mcp-server-decoy-applications-and-tools.md:12-17`,
`:37-42`). That protocol decoy is not an administrative MCP integration. The
distinction and adjacent programmable surfaces are documented in
[`./overview.md`](./overview.md#mcp-server-decoys-attacker-facing) and the claims
ledger.

## When to start here

- Start here for "what is Deception?", "how do decoys work?", "what changes in ZPA when Deception is integrated?", "what is the Deception MCP server decoy?", or "what public automation surface did this refresh find?"
- Start in [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for ZPA first-match policy-order behavior and Deception rule placement.
- Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md) for portfolio placement.
