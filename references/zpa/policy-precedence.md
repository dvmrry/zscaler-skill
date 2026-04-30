---
product: zpa
topic: "zpa-policy-precedence"
title: "ZPA access policy precedence"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/about-policies"
  - "vendor/zscaler-help/About_Policies.pdf"
  - "https://help.zscaler.com/zpa/about-access-policy"
  - "vendor/zscaler-help/About_Access_Policy.pdf"
  - "https://help.zscaler.com/zpa/configuring-access-policies"
  - "vendor/zscaler-help/Configuring_Access_Policies.pdf"
  - "https://help.zscaler.com/zpa/access-policy-configuration-examples"
  - "vendor/zscaler-help/Access_Policy_Configuration_Examples.pdf"
  - "https://help.zscaler.com/zscaler-deployments-operations/access-policy-deployment-and-operations-guide"
  - "vendor/zscaler-help/Access_Policy_Deployment_and_Operations_Guide.pdf"
  - "https://help.zscaler.com/zpa/using-app-segment-multimatch"
  - "vendor/zscaler-help/Using_Application_Segment_Multimatch.pdf"
author-status: draft
---

# ZPA access policy precedence

How ZPA evaluates access policy rules, how they compose with the application-segment matching from `app-segments.md`, and what wins when rules conflict.

## Summary

From *About Access Policy* p.1, the authoritative one-liner:

> Private Access evaluates access policy rules using the most specific application segment and a top-down, first-match principle.

Which decomposes into **two ordered stages**:

1. **Segment selection** (runs in Zscaler Client Connector — see [`./app-segments.md`](./app-segments.md)): pick the most-specific application segment that covers the destination address. If the port doesn't match in that segment, traffic is dropped client-side without ZPA involvement.
2. **Policy evaluation** (runs in ZPA): on rules referencing the selected segment (directly or via a segment group containing it), **top-down, first-match**. First rule whose criteria all evaluate true fires — Allow Access, Block Access, or Require Approval.

**Default when no rule matches**: block. Per *Access Policy Deployment and Operations Guide* p.2: "The default policy behavior is to block access." And *Access Policy Configuration Examples* p.11: "until you configure policy rules for applications, users are blocked from accessing any applications or segment groups."

This is the opposite of ZIA URL Filtering's default-allow. Confusing the two is a common source of wrong intuitive answers across the two products.

## Mechanics

### Criteria types

From *About Access Policy* pp.1–3, criteria available on an access policy rule:

| Criterion | Meaning |
|---|---|
| Application Segments | Specific application segments the rule applies to |
| Segment Groups | Groups of segments the rule applies to |
| Branch Connector Groups | Branch Connector groups |
| Chrome Enterprise Browser | Whether user accesses apps via Chrome Enterprise browser |
| Client Connector Posture Profiles | Zscaler Client Connector device posture checks |
| Client Connector Trusted Networks | Trusted-network state reported by Zscaler Client Connector |
| Client Types | `Zscaler Client Connector`, `Client Connector for VDI`, `Client Connector Partner`, `Branch Connector`, `Cloud Connector`, `Machine Tunnel`, `Web Browser`, `Internet & SaaS Service Edge`, `Extranet` |
| Cloud Connector Groups | Cloud Connector groups |
| Country Codes | Country of the user's IP. **Special handling for Cloud Connectors / Source IP Anchoring / multi-hop: policy uses the *last NATed layer-3 public IP*, not the user's original IP.** (*About Access Policy* p.2.) |
| Extranet | Extranet resources (locations or sublocations) |
| Locations | Branch Connector, Cloud Connector, or other locations and sublocations |
| Machine Groups | Configured machine groups |
| Platforms | `Windows`, `macOS`, `Linux`, `Android` |
| Risk Scores | User risk scores from an external risk source (e.g., Internet & SaaS) |
| SAML Attributes | User attributes from the IdP's SAML assertion |
| SCIM Attributes | User attributes learned via SCIM |
| SCIM Groups | SCIM groups learned via SCIM |
| Workload Groups | Workload groups from cloud workloads |

### Boolean operators

From *About Access Policy* pp.3–5:

- **Multiple application segments in one rule**: implicit **OR**. "Private Access evaluates this application segment criteria as `Sales OR QA Site OR Internal Services`." (p.3.)
- **Multiple segment groups in one rule**: implicit **OR**.
- **Application Segment criteria vs Segment Group criteria**: explicit **OR**. A user matching either branch satisfies the app-scope portion.
- **Between distinct criteria types** (e.g., SAML Attribute AND Country AND Client Type): explicit **AND**. All criteria types must be satisfied.

So a rule structurally looks like:

```
(app_segments OR segment_groups)  AND
(saml_attrs)                       AND
(countries)                        AND
(client_types)                     AND
...
```

Where each bracketed group internally OR-s its values and cross-group uses AND.

### Rule actions

There's terminology drift between *About Access Policy* p.6 and *Configuring Access Policies* p.3 — the About Access Policy article lists "Allow Access, Block Access, Require Approval," while Configuring Access Policies lists "Allow Access, Block Access, Conditional Access" plus a separate "Allow with Privileged Approval" checkbox for PRA-enabled segments.

The authoritative version is *Configuring Access Policies* p.3:

- **Allow Access** — allows access to applications.
- **Block Access** — blocks access. Supports an optional **Pop-Up Message to User** (p.3; only visible when Rule Action = Block; only for Zscaler Client Connector v4.7+ on Windows).
- **Conditional Access** — step-up authentication. Requires ZIdentity subscription. Forces additional authentication match before granting access.
- **Allow with Privileged Approval** (checkbox on Allow-action rules) — only for Privileged Remote Access; primarily for PRA-enabled application segments. Contact Zscaler Support for setup.

"Require Approval" from About Access Policy is likely an informal name for Conditional Access or Allow with Privileged Approval — see [clarification `zpa-06`](../_meta/clarifications.md#zpa-06-require-approval-action-semantics). The step-up authentication mechanism behind these actions lives in ZIdentity — see [`../zidentity/step-up-authentication.md`](../zidentity/step-up-authentication.md). **OIDC IdP integration required** — SAML IdPs don't support step-up.

### SDK-visible fields not surfaced in help docs

Several first-class fields on access-policy rules are visible via the API/TF/SDK layer but not highlighted in the help articles. Relevant when reading snapshots or writing policy-as-code.

- **Two distinct reauth fields** (`zscaler/zpa/models/policyset_controller_v2.py:49-50`):
  - `reauth_timeout` — session duration before a full re-authentication is required.
  - `reauth_idle_timeout` — idle duration before re-auth.
  - **Both default to `None`**, meaning the global tenant setting applies when a rule doesn't override. If a user asks "why is this session re-auth-ing sooner than the rule says", check both the rule value and the tenant global.
  - ⚠️ **Both are `ForceNew` at the Terraform/API level** (`terraform-provider-zpa/zpa/common.go:554-562`). **Changing either on an existing rule requires destroy-recreate** — the API refuses in-place updates. Operationally: an admin can't just "bump the timeout" on a running rule; the rule is deleted and re-created, which can shuffle rule order and cause transient policy gaps. Plan changes during maintenance windows.
- **`devicePostureFailureNotificationEnabled`** (bool — Python SDK calls this `device_posture_failure_notification_enabled`, but the wire/snapshot JSON key is camelCase per Go SDK `policysetcontrollerv2.go:78`) — controls whether users see a notification when device posture causes access denial. Useful context when debugging silent posture-based blocks. Operators querying snapshot JSON must use the camelCase form.
- **Conditional cross-field dependencies for action-specific profiles** (`zscaler/zpa/models/policyset_controller_v2.py:61-65`):
  - `zpn_isolation_profile_id` — only relevant when `action = ISOLATE`. References a ZPA isolation profile that configures the isolated browser session (Turbo Mode, copy/paste allow, region, etc.). See [`../zbi/policy-integration.md`](../zbi/policy-integration.md) for the isolation-profile surface and [`../zbi/overview.md`](../zbi/overview.md) for the container/rendering model.
  - `zpn_inspection_profile_id` / `zpn_inspection_profile_name` — only relevant when `action = INSPECT`.
  - **SDK does not validate** that the profile ID matches the action type. Setting an irrelevant profile ID passes silently; the API's behavior in that case is unstated. When debugging "why isn't my isolation profile applying?", verify the action actually is `ISOLATE`.
- **`credential` and `credential_pool`** are nested sub-objects on access-policy rules — used for PRA (Privileged Remote Access) rules to attach credentials directly. Not a separate rule type.
- **Operand match forms are mutually exclusive** (`zscaler/zpa/models/policyset_controller_v2.py:266-272`). Each policy criterion in the API is expressed as an `Operand` object with one of two match forms:
  - `values` — list of IDs (used for most object types: Application Segments, Segment Groups, Locations, etc.).
  - `entry_values` — list of `{lhs, rhs}` pairs (used for SAML / SCIM / SCIM_GROUP attribute matching, where `lhs` is the attribute name and `rhs` is the matched value).
  - Knowing which form a criterion uses matters when you're constructing policy programmatically or parsing snapshot JSON; mixing forms on a single Operand is invalid.

### Order and editing constraints

From *About Access Policy* pp.5–6:

- Rules are listed in a fixed order; "Rule Order" is the policy evaluation number.
- Rule order can be changed by clicking the number and entering a new value.
- **Deception-policy constraint:** "Updating the rule order of an access policy configured using Zscaler Deception is not supported. When changing the rule order of a regular access policy and there is an access policy configured using Deception, the rule order of the regular access policy must be greater than the rule order for an access policy configured using Deception." Also: "If an access policy is configured using Deception, the copy, edit, and delete options are unavailable." Resolution (2026-04-24) in [clarification `zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction): these rules belong to the separate Zscaler Deception product, which deploys decoy infrastructure (fake servers, AD objects, etc.) inside ZPA. Because ZPA is first-match-wins, Deception rules must evaluate ahead of regular rules so attacker traffic hits a decoy before matching any real-resource rule — otherwise the detection silently fails. Copy/edit/delete are disabled because the rules are managed from the Deception Admin Portal, not the ZPA console; editing them out-of-band would desynchronize Deception's view and let an attacker's activity show up as a normal admin audit event instead of triggering a Deception alert. **Operational implication:** don't manage these rules via the ZPA API or Terraform; if the Deception product isn't licensed, they don't exist.

## The specificity-vs-top-down precedence quirk

*About Policies* p.2 gives the authoritative statement:

> Private Access evaluates policy rules using the most specific application segment and a top-down, first-match principle. For example, when a user requests a specific application, Private Access starts evaluating all of your configured policies, starting with the first rule in a set of policy rules. As soon as it finds a policy that matches the criteria that was specified in a rule, it enforces that policy rule and disregards all other rules that follow, including any potentially conflicting rules.

The *Conflicting Access Policy Rules* examples (*About Policies* pp.3–6) show this concretely:

- Example 1: "Allow any user to any app" (rule 1) + "Block Sales from any app" (rule 2) → Sales users are **not blocked** because rule 1 matches them first. Fix: reorder so rule 2 comes before rule 1.
- Example 2: "Allow Marketing all apps" (rule 1) + "Deny Marketing the Operations Apps segment group" (rule 2) → Marketing **still has access** to Operations Apps because rule 1 matches first. Same fix.

So "most specific segment wins" happens at segment selection (see [`./app-segments.md`](./app-segments.md)), but once a policy rule matches — regardless of whether the rule references a broad segment or a specific one — evaluation stops.

The *Access Policy Deployment and Operations Guide* pp.2–3 contains an oddly-phrased example that was previously a clarification (`zpa-08`, now resolved via *About Policies*): "When both FQDNs are equal, ZPA performs a top-down ranking approach." The most defensible interpretation is "when two rules would both match a given request, rule order decides" — consistent with the first-match principle from *About Policies*.

Under Multimatch, the picture extends: multiple segments match the same request, but the policy rule that fires is still decided by top-down first-match across the matched-segment rule set. See next section.

## Policy evaluation under Multimatch

From *Using Application Segment Multimatch* pp.5–8, the definitive examples. Short version:

- With `EXCLUSIVE` (default): one segment is selected per request. Only rules scoped to that segment (directly or via its segment group) evaluate. Rules scoped to other overlapping segments don't fire even if they'd match.
- With `INCLUSIVE` (Multimatch): **all overlapping segments are matched** and their rules are evaluated top-down. A block rule on any matched segment can fire before an allow rule further down, even if the allow rule applies to a more-specific or different segment.

Worked example (p.8, slightly abbreviated):

Segments: `Wildcard_AS` (`*.example.com`, TCP 1-52 + 54-65535, Multimatch on) and `Server1_AS` (`server1.example.com`, TCP 443 + 3389, Multimatch on).

Rules, in order:

1. Allow Server1_AS for Admin (Admin_Grp)
2. Block Server1_AS for All
3. Allow Wildcard_AS for All

Traffic matrix (from the doc's table):

| User | Request | Matched rule |
|---|---|---|
| user1 (Admin_Grp) | `server1.example.com:3389` | Rule 1 (Allow for Admin) |
| user1 | `server1.example.com:443` | Rule 1 (Allow for Admin) |
| user1 | `server1.example.com:22` | Rule 3 (Allow Wildcard_AS — `server1.example.com:22` matches `*.example.com` + port 22 in Wildcard_AS's range) |
| user3 (IT_Grp) | `server1.example.com:443` | **Rule 2 (Block for All)** — even though Rule 3 would allow on Wildcard_AS, Rule 2 on the more-specific Server1_AS fires first in top-down order |

Without Multimatch (and the same rules), the traffic-dropped-at-client case fires for several of these (see the tables on pp.5–6 for the non-Multimatch versions), because the Server1_AS segment is "carved out" of Wildcard_AS — see [`./app-segments.md`](./app-segments.md#the-carved-out-default-behavior).

## Configuration patterns

From *Access Policy Configuration Examples*, common patterns (p.1–18). Summary only — see the doc for full screenshots:

- **Allow any user to any application** — both criteria blank, Rule Action = Allow.
- **Allow specific group to specific segment groups** — Segment Groups criterion + SAML Attributes for the group.
- **Allow specific users to any application** — Application Segments blank, SAML Attributes for the IdP + user.
- **Block specific users from all applications** — Rule Action = Block, criteria select the group. Because of default-block, this pattern usually requires a trailing Allow rule for everyone else. *Access Policy Configuration Examples* p.8: "if the users you want to block are covered under another access policy rule which allows them access, that allow policy must be listed after this block policy."
- **Block specific users from specific applications, allow others** — two-rule pattern: block rule (scoped) at higher order, allow rule for other users at lower order. p.11: "configuring a policy rule to deny users access would only be useful for the following circumstances: The number of users being blocked from application segments or segment groups is relatively small compared to the number of users with access."

## Edge cases

- **SCIM sync timing.** Per *Access Policy Deployment and Operations Guide* p.3: "After you enable SCIM, Zscaler checks if a user is present in the SCIM database. Based on this information, Zscaler decides if the user is allowed or blocked access to ZPA. Ensure the SCIM user sync is complete before enabling SCIM policies for these users. If not, the ZPA service evaluates policies on the users it does not recognize. After SCIM sync is enabled, Zscaler recommends waiting for a minimum of 48 hours (sometimes up to a week) before enabling SCIM policies." Effectively: SCIM criteria on a policy against a mid-sync user will likely deny by default.
- **Cloud Connector / SIPA / multi-hop country coding.** Per *About Access Policy* p.2: country criterion uses the last NATed layer-3 public IP. For Source IP Anchoring traffic, this means the country is the ZIA Public Service Edge's country, not the user's. A country-scoped ZPA rule will misfire for SIPA users. See [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) for the full SIPA cross-product flow.
- **Deception policy ordering.** Regular rules must have order greater than Deception rules. Copy/edit/delete disabled on Deception-configured rules. Deception is a separate Zscaler product that deploys decoy infrastructure inside ZPA to detect lateral-movement attackers; rules must fire first to route attacker traffic to decoys before real-resource rules match. See [`zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction). (*About Access Policy* p.6; `vendor/zscaler-help/what-is-zscaler-deception.md`.)
- **Default block.** No matching rule = blocked. Per *Access Policy Configuration Examples* p.11: "until you configure policy rules for applications, users are blocked from accessing any applications or segment groups."
- **`rule_order` must be sequential and account for ALL pre-existing rules — including invisible Deception rules.** From upstream `zscaler/terraform-provider-zpa` issue #166 (closed, fixed in v2.3.1): a TF tenant setting `rule_order = 1, 3, 4, ...` (gap at 2) saw rules silently fail to land in the requested order. Two findings from the maintainer thread: (a) **gaps in `rule_order` cause Terraform to reorder unpredictably** because the API treats absent slots as fillable; (b) **if Zscaler Deception is enabled in the tenant, an immutable Deception rule occupies `rule_order = 1`** automatically — TF-managed rules must start at 2 (or later) and stay sequential. Operators with Deception don't see the rule in the ZPA admin console as editable, but the API includes it in the order calculation. Cross-link to [`zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction) and the Deception bullet immediately above.
- **`rule_order` vs `priority` are different fields.** TF resource `zpa_policy_access_rule` exposes both: `rule_order` controls evaluation position (1 = first; influences first-match-wins outcome); `priority` is a separate metadata field (sometimes used by the admin console for display grouping). Setting them inconsistently doesn't error but confuses readers — keep them aligned (e.g., `rule_order = N, priority = N`) for clarity.

## ZPA policy families and their evaluation order

Access policy doesn't live in isolation — several policy families evaluate in a specific order. Distilled from the MCP server's `skills/zpa/create-*-policy-rule/` workflows.

### Policy order

1. **Forwarding Policy** (evaluated first) — decides whether ZPA handles the traffic at all. A `BYPASS` action sends traffic direct to the internet, skipping both ZPA routing and access-policy evaluation entirely. An `INTERCEPT` action keeps traffic on ZPA. `INTERCEPT_ACCESSIBLE` is a hybrid: route through ZPA only if reachable via App Connectors; otherwise fall back to direct internet — intended for hybrid apps that exist both internally and publicly.
2. **Access Policy** — only evaluates if Forwarding kept traffic on ZPA. Decides ALLOW / DENY / REQUIRE_APPROVAL.
3. **Timeout Policy** — independent of the Allow/Deny decision; governs session re-auth timing. Only action is `RE_AUTH`.
4. **Inspection Policy** (v2) — `INSPECT` or `BYPASS_INSPECT`. Controls whether AppProtection inline inspection runs.

**Common misconfiguration** the MCP skills flag: mixing forwarding `BYPASS` with access-policy `DENY` for the same app. The DENY never fires because forwarding bypassed ZPA first — users still reach the app directly.

### Dangerous defaults

- **Empty conditions list = global rule.** A forwarding rule with no conditions is a global bypass for ALL traffic. An access rule with no conditions allows all users to all apps. Both the MCP forwarding-rule and access-rule skills explicitly call this out as dangerous.
- **Newly created rules are appended at the end.** Rule order matters (see first-match-wins above); always verify order after creation. The MCP skill notes there's no `order` parameter at create time — rule order is a post-hoc attribute to manage.
- **Rule order can be changed programmatically** — two dedicated APIs in Go SDK (`policysetcontrollerv2.go:324-415`):
  - **`Reorder`** — `PUT .../rule/{id}/reorder/{newOrder}` — move a single rule to a new order position.
  - **`BulkReorder`** — accepts a full ordered rule-ID list and applies the entire re-ordering in one atomic call. Useful after importing rules or for large rule-order refactors.
  - Plus `GetRiskScoreValues` (v2 endpoint) — retrieves valid values for the `RISK_FACTOR_TYPE` criterion (the ZIA-sourced user risk score; see [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)).
  - Python SDK may not expose these directly; the `list_rules` → manual-edit pattern is the Python fallback. Fork teams doing large-scale ZPA rule reorganization should prefer the Go SDK or direct HTTP.

### Timeout policy specifics

From `skills/zpa/create-timeout-policy-rule/`:

- **Timeout values are strings**: `"N Minutes"`, `"N Hours"`, `"N Days"`, or `"Never"`. **Not raw integers** — wire-format quirk that breaks programmatic constructors.
- **Default session timeout: 2 days** (172,800 seconds). **Default idle timeout: 10 minutes** (600 seconds). These apply when a rule's `reauth_timeout` / `reauth_idle_timeout` are unset.
- **Posture-based tiering**: set `POSTURE` condition with `rhs: "false"` to target *non-compliant* devices and apply shorter timeouts. Compliant devices fall through to a separate rule with longer timeouts. Risk-tiered session management without IDP-side posture assertions. See [`../shared/device-posture.md`](../shared/device-posture.md) for the posture-type catalog, evaluation cadence, and Machine Tunnel subset.
- **Restricted condition-type subset**: timeout rules do NOT support `COUNTRY_CODE`, `TRUSTED_NETWORK`, `CLIENT_TYPE` criteria that are available on access/forwarding rules. Rules attempting these conditions fail at save.

### Condition-format AND/OR semantics (cross-all-policy-types)

This is the #1 most-confused aspect of ZPA policy authoring per the MCP skill authors:

- **Multiple condition blocks (separate operands) are ANDed**: Block 1 AND Block 2 AND Block 3.
- **Operands within a single block are ORed**: within Block 1, `user A OR user B OR group C`.
- **Mixed object types within a block**: `SAML` and `SCIM_GROUP` can share a block (ORed together) to say "this specific user OR anyone in this group."
- **PLATFORM condition wire format**: the RHS is the string `"true"` / `"false"`, not a boolean. Consistent with `tcp_keep_alive` quirk on app segments.
- **RISK_FACTOR_TYPE condition is the cross-product hook**: it pulls ZIA user risk scoring into ZPA access decisions. If a tenant asks "how can ZPA access decisions react to user browsing risk?", the answer is a RISK_FACTOR_TYPE condition referencing ZIA-computed risk tiers.
- **POSTURE condition RHS**: `posture_udid` from the profile object, not the profile name or ID. Easy to get wrong.

These semantics apply identically across Access, Forwarding, and Timeout policies — but the Inspection policy (v2) has its own narrower condition set.

## Open questions

- Deception policy broader interaction model — [clarification `zpa-07`](../_meta/clarifications.md#zpa-07-deception-policy-order-interaction) (resolved 2026-04-24)
- Alias mapping for "Require Approval" vs "Conditional Access" vs "Allow with Privileged Approval" — [clarification `zpa-06`](../_meta/clarifications.md#zpa-06-require-approval-action-semantics) (partially resolved)

Resolved while writing this doc:

- "When both FQDNs are equal" interpretation — [clarification `zpa-08`](../_meta/clarifications.md#zpa-08-when-both-fqdns-are-equal-interpretation) — resolved via *About Policies* Policy Evaluation Order section. No standalone article exists; content lives inside *About Policies*.

## Cross-links

- Application segment matching (the stage that runs *before* access policy) — [`./app-segments.md`](./app-segments.md)
- LSS access log schema — for observational validation of which rule matched — [`./logs/access-log-schema.md`](./logs/access-log-schema.md) — the `Policy` field carries the fired rule name.
- Cross-product policy evaluation mental model — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
- Wire-format schema for `snapshot/zpa/access-policy-rules.json` (ruleOrder-as-string, operand tree, 19-value objectType enum) — [`./snapshot-schema.md`](./snapshot-schema.md)
