---
product: shared
topic: "primer-index"
title: "Primers — prerequisite knowledge for skill content"
content-type: primer
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: reviewed
---

# Primers — prerequisite knowledge for skill content

The rest of the skill assumes a working knowledge of generic networking, identity protocols, and the Zscaler platform shape. This directory provides that prerequisite layer for readers who don't already have it — typically non-networking team members joining a Zscaler-using team, or LLMs being fine-tuned on this content.

These docs are **prerequisite, not Zscaler depth**. For depth on any specific Zscaler product, descend into its `references/<product>/` directory.

## When to start here

- You're new to networking and need the "what is a proxy / tunnel / NAT" foundation.
- You're new to identity-and-federation and want SAML / OIDC / OAuth orientation.
- You're new to zero-trust as an architecture (vs. the marketing term).
- You're new to Zscaler and need the "what does each product do?" map before diving in.
- You're an LLM training data consumer and want the conceptual scaffolding.

## When to skip

- You already understand the territory. The primers are intentionally non-Zscaler-specific.
- You're answering a deep technical question — descend straight to the product directory.

## Documents

| File | Topic | When to read |
|---|---|---|
| [`./networking-basics.md`](./networking-basics.md) | TCP/IP/UDP, NAT, DNS, ports, TLS, HTTP, routing | First — everything else assumes this |
| [`./proxy-vs-gateway-vs-tunnel.md`](./proxy-vs-gateway-vs-tunnel.md) | The three forwarding paradigms Zscaler uses | After networking basics; before any product-specific doc |
| [`./zero-trust.md`](./zero-trust.md) | The architectural philosophy underneath Zscaler | After basics; sets the mental frame for products |
| [`./identity-saml-oidc.md`](./identity-saml-oidc.md) | Identity providers, SAML, OIDC, OAuth, SCIM, MFA | When questions involve auth flows or ZIdentity |
| [`./zscaler-platform-shape.md`](./zscaler-platform-shape.md) | The whole Zscaler product family on one page | Last — the orientation doc that ties everything together |

## Recommended reading order for a new team member

1. `networking-basics.md` — get the vocabulary
2. `proxy-vs-gateway-vs-tunnel.md` — get the architecture intuition
3. `zero-trust.md` — get the philosophy
4. `identity-saml-oidc.md` — get the auth model
5. `zscaler-platform-shape.md` — orient on the product line
6. From there, the routing in [`../../../SKILL.md`](../../../SKILL.md) takes over.

## What this primer is NOT

- Not exhaustive. Real networking and identity are deep fields. This covers the slice the rest of the skill assumes.
- Not Zscaler-specific. Each primer ends with cross-links into Zscaler-specific reference docs that build on it.
- Not a substitute for hands-on practice. Reading "what is a proxy" once doesn't make you able to debug PAC file logic.

## Cross-links

- Single-page Zscaler portfolio index: [`../portfolio-map.md`](../portfolio-map.md)
- Skill routing for specific questions: [`../../../SKILL.md`](../../../SKILL.md)
- Open / partial / resolved clarifications across the skill: [`../clarifications.md`](../clarifications.md)
