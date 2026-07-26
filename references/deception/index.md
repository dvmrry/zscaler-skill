---
product: deception
topic: "deception-index"
title: "Zscaler Deception reference hub"
content-type: reference
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: f38edc59c5c6d05a13fe2cc88d6782e349276586
  vendor/zscaler-sdk-python: a2a814a4dc8b9e79a5f94126d4609cd10573c94d
  vendor/terraform-provider-zpa: e68b53e17f61870f3bec2a68bff3e3d4f1c6db05
  vendor/zscaler-mcp-server: 70e67db347441caa31f94da8f904389064db0664
  vendor/zscaler-api-specs: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
  vendor/zscaler-help: 957bb3ac5b7f9c908b7c7e187e1da7810ddd01a6
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/what-is-zscaler-deception.md"
  - "vendor/zscaler-help/about-deception-strategy.md"
  - "vendor/zscaler-help/About_Access_Policy.txt"
author-status: reviewed
---

# Zscaler Deception reference hub

Entry point for Zscaler Deception questions. The refreshed source-backed summary is [`./overview.md`](./overview.md); the per-claim forcing function is [`./_claims-ledger.md`](./_claims-ledger.md).

## Topics

| Topic | File | Status |
|---|---|---|
| Decoys, strategy, ZPA integration, and audited programmable surface | [`./overview.md`](./overview.md) | draft |

## Scope boundary

Deception is a separate active-defense product, not a ZPA feature. Its Help capture says it uses decoys and lures to detect and disrupt threats such as reconnaissance, lateral movement, ransomware, and ICS/SCADA attacks (`vendor/zscaler-help/what-is-zscaler-deception.md:8`). It integrates with ZPA for Zero Trust Network decoys without extra network components (`vendor/zscaler-help/what-is-zscaler-deception.md:45-47`), and ZPA access-policy docs describe Deception-configured policy rules as constrained for rule-order changes and copy/edit/delete options (`vendor/zscaler-help/About_Access_Policy.txt:169-177`, `:185-190`).

The audited public SDK/provider/MCP/Postman surface does not expose Deception product CRUD. Adjacent surfaces are documented in [`./overview.md`](./overview.md#source-family-sweep) and in the claims ledger.

## When to start here

- Start here for "what is Deception?", "how do decoys work?", "what changes in ZPA when Deception is integrated?", or "what public automation surface did this refresh find?"
- Start in [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for ZPA first-match policy-order behavior and Deception rule placement.
- Start in [`../_meta/portfolio-map.md`](../_meta/portfolio-map.md) for portfolio placement.
