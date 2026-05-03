---
product: zidentity
topic: "zidentity-step-up-authentication"
title: "ZIdentity Step-Up Authentication — authentication levels, ZIA/ZPA integration"
content-type: reasoning
last-verified: "2026-04-28"
verified-against:
  vendor/zscaler-sdk-python: 89a079411689fb4c6495ff6d95c619679318fbd1
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-step-up-authentication-zidentity.md"
  - "vendor/zscaler-help/understanding-step-up-authentication.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/stepup_auth_level.py"
author-status: draft
---

# ZIdentity Step-Up Authentication

The mechanism behind ZIA URL Filter's `Conditional` action and ZPA Access Policy's `Require Approval` action. When a user tries to reach a sensitive resource, ZIdentity prompts them to re-authenticate with a stronger method (typically MFA). The prompt appears via Zscaler Client Connector, not a browser redirect.

## What step-up authentication is

Step-up authentication allows dynamic requests for stronger authentication when users attempt to access sensitive resources or when risk signals indicate a potential threat. This feature enhances the existing authentication process by requiring multi-factor authentication (MFA) when needed, ensuring that access to high-risk or sensitive data is protected. (Tier A — vendor/zscaler-help/understanding-step-up-authentication.md.)

Step-up authentication is a method that prompts users to reauthenticate with a higher assurance level (e.g., using MFA) when accessing specific resources. For example, if a user logs in with a username and password (a lower assurance level), they might still be asked to verify their identity via MFA (a higher assurance level) when accessing a sensitive resource, such as financial information or critical applications.

**OIDC-only constraint:** "Step-up authentication is supported only with OIDC-based external IdP integrations." SAML IdP integrations silently don't work for step-up. (Tier A — vendor/zscaler-help/understanding-step-up-authentication.md.)

## Authentication Levels — AL1 through AL4 (and beyond)

Authentication Levels (ALs) are a hierarchical tree of authentication-strength tiers. Higher levels represent stronger authentication methods. ZIA and ZPA access policies reference these levels to gate sensitive access.

From the admin perspective, authentication levels are named objects (not fixed AL1/AL2/etc. designators — operators define the names). "AL1 to AL4" is the common naming convention, but operators can use any names and create any number of levels within the hierarchy limits.

**Tree constraints:**
- Max **32 levels total** in the tree.
- Max **depth 4** — no branch can go deeper than 4 levels.

Each level carries:

| Field | Meaning |
|---|---|
| Level Name | Display name (e.g., "AL1", "AL2", "High Assurance"). |
| Validity | How long an authentication at this level stays valid. Specify in minutes, hours, or days. |
| Description | Free-form text. |
| Message to user (optional) | Custom notification shown to the user via ZCC when the step-up is required. |

**Tree structure example:**

```
AL1 (password only, validity: 8 hours)
├── AL2 (password + TOTP, validity: 4 hours)
│   └── AL3 (password + TOTP + device trust, validity: 1 hour)
└── AL2-alt (password + FIDO, validity: 4 hours)
```

### The validity inversion — read this carefully

> The validity period for a parent level must be less than the validity period defined for any of its sub-levels.

This is **counter-intuitive at first read**. Intuitive assumption: "higher-assurance level → shorter validity" (because you want users to re-auth more often for sensitive access). The actual rule: **parent validity must be *less than* child validity**.

Worked example:

- Parent AL1 = password only. Validity: 8 hours.
- Child AL2 = password + TOTP. The rule says AL2 validity must be **greater than** 8 hours — so maybe 24 hours.

Rationale (inferred from structure — not stated in docs): the tree represents **authentication assurance achievements**. If a user authenticated to AL2, they've demonstrated higher assurance than AL1, so their assurance persists longer. The parent's validity is the "weakest guarantee" and therefore must be shorter.

**Operational implication:** admins configuring this often get the hierarchy backwards on first attempt, get a save-time validation error, and assume the system is buggy. The fix is to make child validity *longer* than parent validity.

### External IdP mapping (OIDC `acr` values)

OIDC's `acr` (Authentication Context Class Reference) claim is the standard way to communicate "what authentication level was used" in the token. ZIdentity maps its authentication levels to specific `acr` values that the external IdP issues. When ZIdentity receives a token with a particular `acr` value, it translates to the corresponding ZIdentity level for policy-matching.

**Failure mode:** if the external IdP's `acr` values don't match ZIdentity's mapped values, step-up elevation won't be recognized — the user re-authenticates but ZIdentity still thinks they're at the lower level. Requires alignment between the OIDC IdP config and ZIdentity's authentication-level mapping.

## Trigger conditions and the step-up flow

(Tier A — vendor/zscaler-help/understanding-step-up-authentication.md and understanding-step-up-authentication-zidentity.md.)

Step-up authentication is triggered when a user attempts to access a resource that requires a higher authentication level than their current session provides.

**Trigger conditions:**

| Trigger | Source |
|---|---|
| Sensitive resource access | Policy rule in ZIA (URL Filter Conditional action) or ZPA (access policy with required AL) |
| Increased risk detected | Unusual behavior or environment changes (unrecognized device or location) — ZIdentity can trigger step-up based on risk signals |
| Compliance requirements | Regulatory MFA mandates configured in policy |

**The step-up flow:**

1. **User attempts access** — user is logged in to ZIdentity with standard credentials (current authentication level, e.g., AL1).
2. **Policy match** — traffic hits a ZIA URL Filter rule with action `Conditional` or a ZPA Access Policy rule requiring a higher authentication level (e.g., AL2 or above).
3. **Level check** — ZIdentity checks the user's current authentication level against the required level. If current < required, step-up is triggered.
4. **Prompt delivery via ZCC** — the re-auth prompt comes through **Zscaler Client Connector**, not a browser redirect. ZCC displays the MFA challenge; user completes it; session upgrades to the higher level.
5. **Access granted** — after successful re-auth, traffic proceeds.

**Critical: step-up requires ZCC.** Users forwarding traffic via GRE/IPSec/PAC (non-ZCC paths) **do not receive step-up prompts**. A Conditional-action rule firing for a non-ZCC user results in a silent block or denied access — the user never gets the chance to elevate. This matches `references/zia/url-filtering.md § Conditional action` which says it's only supported with ZCC forwarding.

## Assurance levels (AL1–AL4) and ZPA access policy

ZPA access policy conditions can reference authentication levels to gate access to App Segments. The integration path:

1. An access policy rule includes an authentication level condition (requiring a specific AL or higher).
2. When a user requests access to an App Segment covered by that rule, ZPA checks the user's current authentication level against the required level.
3. If the level is insufficient, ZPA triggers the step-up flow via ZIdentity.
4. Once step-up completes and the user reaches the required level, ZPA allows the connection to proceed.

**Which ZPA access policy conditions can trigger step-up:**
- Conditions on `ACCESS_POLICY` rules that reference authentication level requirements trigger step-up when the current level is below the threshold.
- The ZPA SDK exposes `StepUpAuthLevelAPI` (`client.zpa.stepup_auth_level`) with a single read-only method `get_step_up_auth_levels()` — this returns the available authentication levels for use in ZPA policy configuration. (Tier A — sdk.md §2.62.)

**Authentication levels apply across all products.** ZIA Conditional rules and ZPA policy rules both pull from the same tenant-wide authentication-levels tree. A level created for ZPA use is also available to ZIA rules, and vice versa.

## Admin configuration steps

1. **Ensure OIDC IdP is configured.** Step-up is OIDC-only — confirm the tenant's external IdP is configured with OIDC, not SAML.
2. **Create authentication levels** in ZIdentity (Administration > Authentication > Authentication Levels). Design the tree structure before creating levels — validity inversion errors during creation are confusing if the tree design changes.
3. **Map authentication levels to OIDC `acr` values.** In ZIdentity, map each level to the corresponding `acr` value the IdP issues. Without this mapping, step-up events won't be recognized.
4. **Configure ZIA or ZPA policies** to reference the authentication levels:
   - ZIA: create a URL Filter rule with `Action = Conditional` and specify the required authentication level.
   - ZPA: configure an access policy rule with an authentication level condition.
5. **Test** from a ZCC-enrolled device. Verify the step-up prompt appears via ZCC when the policy is triggered.

## User experience when step-up is required

- The re-auth prompt appears in ZCC, not in a browser pop-up or redirect.
- ZCC displays the MFA challenge (TOTP code entry, FIDO2 tap, etc.) based on what the external IdP requires for the target authentication level.
- The user completes the challenge without leaving their current browser session — the original request is held pending the step-up completion.
- After successful step-up, access is granted and the browser session continues.
- If the user is NOT on ZCC (using PAC/GRE/IPSec forwarding), they receive no prompt — the request is denied or blocked with no explanation.
- The `Message to user` field on the authentication level object allows a custom notification message to be shown via ZCC at step-up time.

## Cross-product hook summary

Step-up is the execution layer for both these actions:

| Product | Action | How it uses step-up |
|---|---|---|
| **ZIA URL Filtering** | `Conditional` | Rule matches a URL; Conditional action triggers ZIdentity step-up before allowing access. Requires ZCC forwarding. |
| **ZPA Access Policy** | Authentication level condition | ZPA segment access requires elevated authentication; ZIdentity step-up runs before the microtunnel is allowed to the app. |

## Edge cases

- **Validity-inversion configuration errors:** admin saves a parent=24h / child=1h tree expecting tight child validity. Save fails with validation error. Fix: flip the durations so child validity > parent validity.
- **SAML IdP + Conditional Access policy:** policy rule never succeeds at stepping up. No error; the Conditional action just silently doesn't elevate. Tenant migrates to OIDC or doesn't use step-up.
- **Non-ZCC user hits a Conditional rule:** no prompt is delivered (no ZCC channel to deliver it). User sees access denied with no clear remediation path. Operator workaround: don't apply Conditional to users who aren't on ZCC, OR require ZCC for everyone who needs access to Conditional-gated resources.
- **Tree depth limit:** admin tries to add a 5th-depth sub-level; save rejected. Max depth is 4.
- **32-total limit:** large orgs with many access tiers run out of levels. Plan the hierarchy before implementing.
- **`acr` mapping drift:** external IdP team updates OIDC config to change an `acr` value without coordinating with the ZIdentity admin. Step-up elevations stop being recognized. Diagnose by inspecting the actual `acr` claim in the OIDC token and comparing to ZIdentity's mapping.
- **Risk-signal sources for "increased risk detected" step-up triggers:** not enumerated in available sources. Whether step-up can be triggered passively by risk signals (as opposed to only by explicit policy) is not fully documented. Device posture and location changes are mentioned as examples.

## Open questions

- Whether authentication levels can be configured differently per-product or only globally: the docs suggest a single tenant-wide tree.
- How step-up interacts with SCIM-provisioned users who don't have a mapped external IdP identity: can they step up at all?
- Whether the "message to user" field supports localization or just a single string per level.
- Whether step-up elevation is logged in ZIA Transaction logs or ZPA LSS User Activity logs, and with what field values.

## Cross-links

- ZIA URL Filtering Conditional action (the ZIA-side entry point) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Require Approval action (the ZPA-side entry point) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- ZPA StepUpAuthLevelAPI in SDK catalog — [`../zpa/sdk.md`](../zpa/sdk.md) §2.62
- Cross-product integrations — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
- ZIdentity overview (OIDC vs SAML IdP choice) — [`./overview.md`](./overview.md)
