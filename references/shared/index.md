---
product: shared
topic: "shared-index"
title: "Shared / cross-product reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: reviewed
---

# Shared / cross-product reference hub

Docs under `references/shared/` are **not tied to a single Zscaler product**. They cover cross-cutting concerns: mental models for policy evaluation, the cloud architecture that hosts all products, activation mechanics, the glossary that translates between product naming conventions, and the catalog of inter-product configuration hooks.

## Topics

| Topic | File | Status |
|---|---|---|
| Policy evaluation meta-model — how ZIA and ZPA rule-evaluation differ (default-allow vs default-deny), what's shared, what isn't | [`./policy-evaluation.md`](./policy-evaluation.md) | draft |
| Cloud architecture — Central Authority (ZIA active-passive vs ZPA active-active), Service Edge form factors, Nanolog, Feed Central, Business Continuity Cloud, Z-Tunnel vs M-Tunnel, PKI | [`./cloud-architecture.md`](./cloud-architecture.md) | draft |
| **Cross-product integrations** — the canonical catalog of hooks between ZIA, ZPA, ZCC, ZDX, ZBI, ZIdentity, Cloud Connector, ZWA — organized by direction of coupling, with failure-mode notes and a question-shape routing table | [`./cross-product-integrations.md`](./cross-product-integrations.md) | draft |
| Activation lifecycle — ZIA staged-vs-live gate, API endpoints, EUSA, ZPA contrast | [`./activation.md`](./activation.md) | reviewed |
| Terminology — legacy / current / log-field aliases across all products (ZEN, PSEN, VSEN, Z-App, App Profile vs Web Policy, ZTW vs ZTC, etc.) | [`./terminology.md`](./terminology.md) | reviewed |
| Source IP Anchoring (SIPA) — ZIA+ZPA cross-product feature for preserving customer-controlled source IP at destination (Office 365 Conditional Access, IP-allowlist apps) | [`./source-ip-anchoring.md`](./source-ip-anchoring.md) | draft |
| SCIM provisioning — cross-product user/group lifecycle (ZIA + ZPA + ZIdentity), attribute-mapping differences, Python-SDK gap (Go SDK has full CRUD) | [`./scim-provisioning.md`](./scim-provisioning.md) | draft |
| Log-correlation guidance — when to consult logs vs rely on config, cross-product correlation patterns | [`./log-correlation.md`](./log-correlation.md) | draft |
| SPL query patterns — canonical SPL snippets for Zscaler log analysis | [`./splunk-queries.md`](./splunk-queries.md) | draft |

## When to start here vs a product directory

- **Start here** when a question doesn't obviously belong to one product — "how does Zscaler authenticate API calls?", "how do these products fit together?", "what does ZEN mean?", "why is my change not taking effect?"
- **Start in a product directory** (`references/zia/`, `references/zpa/`, etc.) when the question names a specific feature of one product.
- **Start in `cross-product-integrations.md`** when the question smells multi-product — "traffic hit ZIA then ZPA, something's weird" or "why didn't this feature work across products?"

## What the `_clarifications.md` at the parent level is for

`references/_clarifications.md` is the canonical index of open and resolved questions across the skill — each with a stable ID (`zia-03`, `shared-02`, etc.) that reference docs cross-link to. Skim it when reading any doc that cites a clarification; answer confidence should match the current status.
