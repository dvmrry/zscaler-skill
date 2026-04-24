---
product: zidentity
topic: "zidentity-step-up-authentication"
title: "ZIdentity Step-Up Authentication — authentication levels, ZIA/ZPA integration"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "https://help.zscaler.com/zidentity/understanding-step-up-authentication"
  - "vendor/zscaler-help/understanding-step-up-authentication-zidentity.md"
  - "https://help.zscaler.com/zidentity/configuring-authentication-levels"
  - "vendor/zscaler-help/configuring-authentication-levels.md"
author-status: draft
---

# ZIdentity Step-Up Authentication

The mechanism behind ZIA URL Filter's `Conditional` action and ZPA Access Policy's `Require Approval` action. When a user tries to reach a sensitive resource, ZIdentity prompts them to re-authenticate with a stronger method (typically MFA). The prompt appears via Zscaler Client Connector, not a browser redirect.

## Summary

- **Authentication Levels** (AL1, AL2, AL3, AL4, …) are a **hierarchical tree** of authentication-strength tiers. Higher levels represent stronger authentication methods. ZIA and ZPA access policies reference these levels to gate sensitive access.
- **Step-up triggers when the user's current session authentication level is insufficient** for the resource being accessed.
- **OIDC-only**: "Step-up authentication is supported only with OIDC-based external IdP integrations." SAML IdP integrations silently don't work for step-up.
- **Limits**: max **32 levels total** per tree, max **depth 4** per branch.
- **Validity inversion gotcha**: "The validity period for a parent level must be **less than** the validity period defined for any of its sub-levels." This is the opposite of the usual hierarchy-where-more-specific-is-shorter intuition.

## Mechanics

### Authentication Levels

From *Configuring Authentication Levels*:

> An authentication level in ZIdentity represents a specific strength of authentication with hierarchical levels where higher levels represent stronger authentication methods.

Each level carries:

| Field | Meaning |
|---|---|
| Level Name | Display name (e.g., "AL1", "AL2", "High Assurance"). |
| Validity | How long an authentication at this level stays valid. Specify in minutes, hours, or days. |
| Description | Free-form text. |
| Message to user (optional) | Custom notification shown to the user via ZCC when the step-up is required. |

**Tree structure**: levels can nest as sub-levels to form a hierarchy. Example:

```
AL1 (password only, validity: 8 hours)
├── AL2 (password + TOTP, validity: 4 hours)
│   └── AL3 (password + TOTP + device trust, validity: 1 hour)
└── AL2-alt (password + FIDO, validity: 4 hours)
```

Limits:

- **Max 32 levels total** in the tree.
- **Max depth 4** — no branch can go deeper than 4 levels.

### The validity inversion — read this carefully

> The validity period for a parent level must be less than the validity period defined for any of its sub-levels.

This is **counter-intuitive at first read**. Intuitive assumption: "higher-assurance level → shorter validity" (because you want users to re-auth more often for sensitive access). The actual rule: **parent validity must be *less than* child validity**.

Worked example — imagine:

- Parent AL1 = password only. Validity: 8 hours (user logs in once, stays logged in all day).
- Child AL2 = password + TOTP. The rule says AL2 validity must be **greater than** 8 hours — so maybe 24 hours.

Rationale (inferred from the structure — not stated in docs): the tree represents **authentication assurance achievements**. If a user authenticated to AL2, they've demonstrated higher assurance than AL1, so their assurance persists longer. The parent's validity is the "weakest guarantee" and therefore must be shorter.

**Operational implication**: admins configuring this often get the hierarchy backwards on first attempt, get a save-time validation error, and then assume the system is buggy. Flag this in skill answers.

### External IdP mapping (OIDC `acr` values)

> If you have configured external IdP for authentication via OIDC, you need to map the authentication levels to their respective `acr` values in the IdP.

OIDC's `acr` (Authentication Context Class Reference) claim is the standard way to communicate "what authentication level was used" in the token. ZIdentity maps its authentication levels to specific `acr` values that the external IdP issues. When ZIdentity receives a token with a particular `acr` value, it translates to the corresponding ZIdentity level for policy-matching.

**Failure mode**: if the external IdP's `acr` values don't match ZIdentity's mapped values, step-up elevation won't be recognized — the user re-authenticates but ZIdentity still thinks they're at the lower level. Requires alignment between the OIDC IdP config and ZIdentity's authentication-level mapping.

## The step-up flow

From *Understanding Step-Up Authentication*:

1. **User attempts access** — user logs in to ZIdentity with standard credentials (username + password, the lowest level in their auth hierarchy).
2. **Accessing a sensitive resource** — user's traffic hits a ZIA URL Filter rule with action `Conditional` or a ZPA Access Policy rule with action `Require Approval`, each configured to require a specific authentication level (e.g., AL3).
3. **Step-up triggered** — ZIdentity checks the user's current authentication level against the required level. If current < required, ZIdentity prompts the user to re-authenticate.
4. **Prompt delivery via ZCC** — the re-auth prompt comes through **Zscaler Client Connector**, not a browser redirect. ZCC displays the MFA challenge; user completes it; session upgrades to the higher level.
5. **Access granted** — after successful re-auth, traffic proceeds.

**Critical: step-up requires ZCC.** Users forwarding traffic via GRE/IPSec/PAC (non-ZCC paths) **do not receive step-up prompts**. A Conditional-action rule firing for a non-ZCC user results in a silent block or denied access — the user never gets the chance to elevate. This matches `references/zia/url-filtering.md § Conditional action` which says it's only supported with ZCC forwarding.

### Use cases

Per the help doc:

- **Sensitive Resource Access** — critical applications gated by step-up.
- **Increased Risk Detected** — unusual behavior or environment changes (unrecognized device, unfamiliar location). The help doc suggests ZIdentity can trigger step-up based on risk signals, though the exact risk-signal sources aren't enumerated here.
- **Compliance Requirements** — regulatory MFA mandates.

### Cross-product hook summary

Step-up is the execution layer for both these actions:

| Product | Action | How it uses step-up |
|---|---|---|
| **ZIA URL Filtering** | `Conditional` | Rule matches a URL; Conditional action triggers ZIdentity step-up before allowing access. Requires ZCC forwarding. |
| **ZPA Access Policy** | `Require Approval` (sometimes "Conditional Access") | ZPA segment access requires elevated authentication; ZIdentity step-up runs before the microtunnel is allowed to the app. |

See [`../zia/url-filtering.md`](../zia/url-filtering.md) and [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md) for the product-side configuration.

## Edge cases

- **Validity-inversion configuration errors**: admin saves a parent=24h / child=1h tree expecting tight child validity. Save fails with validation error. Fix: flip the durations.
- **SAML IdP + Conditional Access policy**: policy rule never succeeds at stepping up. No error; the Conditional action just silently doesn't elevate. Tenant migrates to OIDC or doesn't use step-up.
- **Non-ZCC user hits a Conditional rule**: no prompt is delivered (no ZCC channel to deliver it). User sees access denied with no clear remediation path. Operator workaround: don't apply Conditional to users who aren't on ZCC, OR require ZCC for everyone.
- **Tree depth limit**: admin tries to add a 5th-depth sub-level; save rejected. Max depth is 4.
- **32-total limit**: large orgs with many access tiers run out of levels. Plan the hierarchy before implementing.
- **Authentication level applied across all products**: ZIA Conditional rules and ZPA Require Approval rules **both** pull from the same tenant-wide authentication-levels tree. A level created for ZPA use is also available to ZIA rules.
- **`acr` mapping drift**: external IdP team updates OIDC config to change an `acr` value without coordinating with the ZIdentity admin. Step-up elevations stop being recognized. Diagnose by inspecting the actual `acr` claim in the OIDC token and comparing to ZIdentity's mapping.

## Open questions

- **Risk-signal sources for "increased risk detected" step-up triggers**: not enumerated. Device? Location? Impossible-travel heuristics? Would be useful to know whether step-up can be triggered passively or only by policy.
- **Whether authentication levels can be configured differently per-product or only globally**: the docs suggest a single tenant-wide tree.
- **How step-up interacts with SCIM-provisioned users who don't have a mapped external IdP identity**: can they step up at all?
- **Whether the "message to user" field supports localization or just a single string per level**.

## Cross-links

- ZIA URL Filtering Conditional action (the ZIA-side entry point) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Require Approval action (the ZPA-side entry point) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- Cross-product integrations — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- Overview (OIDC vs SAML IdP choice) — [`./overview.md`](./overview.md)
