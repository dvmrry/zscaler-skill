---
product: zbi
topic: "zbi-index"
title: "ZBI (Zero Trust Browser / Cloud Browser Isolation) reference hub"
content-type: reference
last-verified: "2026-04-24"
confidence: high
sources: []
author-status: draft
---

# Zero Trust Browser / Cloud Browser Isolation (ZBI) reference hub

Entry point for browser-isolation questions. ZBI renders web pages on an ephemeral **cloud-hosted browser** and streams the result to the user's native browser, so HTML/CSS/JS never reach the endpoint. Used for high-risk categories (Miscellaneous & Unknown, new domains) and for sensitive internal apps accessed by unmanaged devices.

## Naming — multiple aliases, one product

The product has been renamed twice. Operators use all of these names interchangeably in tickets, runbooks, and admin consoles:

- **Zero Trust Browser / ZTB** (current marketing, newer admin UI sections — "ZTB" is the current-marketing abbreviation)
- **Cloud Browser Isolation (CBI)** (URL path / original marketing; still used in ZIA admin console references and URL Filter `Isolate` action)
- **ZBI** (Zscaler Browser Isolation — the SDK module name; survives all the rebrandings)
- **Zscaler Isolation** (legacy name — what some help-article URLs still use)

The Zscaler SDK module is named `zbi` — the initialism survives regardless of which marketing name is current. When answering a question, translate whichever term the user used to the others so they recognize the answer.

## Topics

| Topic | File | Status |
|---|---|---|
| Overview — traffic flow, container model, Turbo Mode vs pixel streaming, architecture components | [`./overview.md`](./overview.md) | draft |
| Policy integration — how ZIA URL Filter `Isolate` action, ZPA Isolation Policy, and Smart Browser Isolation compose; isolation profiles; subscription tiers | [`./policy-integration.md`](./policy-integration.md) | draft |

## Scope

In scope:

- Architecture and traffic flow
- ZIA-side: URL Filter `Isolate` action, Smart Browser Isolation policy, isolation profiles
- ZPA-side: Isolation Policy rules, ZPA isolation profiles
- Turbo Mode (instruction-streaming) vs pixel streaming
- Tiered subscriptions (full ZBI vs "Miscellaneous & Unknown" limited tier)
- Session/container lifecycle (10-min idle timeout)
- Cross-product hooks (SSL Inspection dependency, Malware Protection prerequisite)

Not in scope (explicitly deferred):

- **Votiro CDR integration** — third-party file-gateway integration for isolated downloads/uploads. Referenced in `understanding-votiro-integration-isolation` help article but not captured.
- **Local Browser Rendering** — edge feature mentioned in help articles.
- **Sandbox + Isolation integration** — file scanning flow when isolation downloads a file; referenced but not captured.
- **End-user experience features** (language translate, right-click menu, search in isolation, debug mode, isolation bar, etc.) — UX details not usually relevant to skill reasoning.
- **Zero Trust Client Browser** — the native browser extension / agent that pairs with server-side isolation; separate subsystem.

## When the question spans ZBI + another product

- **"URL Filter Isolate action — what happens?"** → [`./policy-integration.md`](./policy-integration.md) for the ZIA side, then cross to [`../zia/url-filtering.md`](../zia/url-filtering.md) for rule evaluation.
- **"ZPA Isolation Policy — how does it evaluate?"** → [`./policy-integration.md`](./policy-integration.md), then cross to [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for the policy-family evaluation order.
- **"Why did the Isolate rule fail?"** → likely SSL Inspection gap (Smart Isolation requires decrypt) or Malware Protection inbound/outbound toggles off. Cross-product gate — see [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md).
- **"Isolated session failed / timed out unexpectedly"** → container idle timeout is 10 minutes. ZPA Isolation timeout is the minimum across all configured ZPA timeout policies. See [`./overview.md`](./overview.md).
