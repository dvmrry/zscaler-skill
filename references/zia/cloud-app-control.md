---
product: zia
topic: "zia-cloud-app-control"
title: "ZIA Cloud App Control and URL filtering interaction"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/zscaler-deployments-operations/cloud-app-control-deployment-and-operations-guide"
  - "vendor/zscaler-help/Cloud_App_Control_Deployment_and_Operations_Guide.pdf"
  - "https://help.zscaler.com/zia/configuring-url-filtering-policy"
  - "vendor/zscaler-help/Configuring_the_URL_Filtering_Policy.pdf"
  - "https://help.zscaler.com/zia/recommended-url-cloud-app-control-policy"
  - "vendor/zscaler-help/Recommended_URL_&_Cloud_App_Control_Policy.pdf"
  - "https://help.zscaler.com/zia/configuring-advanced-url-policy-settings"
  - "vendor/zscaler-help/Configuring_Advanced_Policy_Settings.pdf"
  - "https://help.zscaler.com/zia/about-policy-enforcement"
  - "vendor/zscaler-help/Understanding_Policy_Enforcement.pdf"
author-status: draft
---

# ZIA Cloud App Control and URL filtering interaction

How Cloud App Control (CAC) evaluates against SaaS / cloud application traffic, how it composes with URL Filtering, and which layer wins when the two disagree.

## Summary

CAC evaluates **before** URL Filtering. For a cloud-app transaction:

- **CAC explicitly allows** → URL Filtering **does not evaluate** (default). The transaction is allowed even if a URL Filtering rule would otherwise block it. Flip this with "Allow Cascading to URL Filtering" — then URL Filtering also evaluates after CAC allow.
- **CAC explicitly blocks** → request is blocked. Cascading does not rescue this; URL Filtering does not get to override.
- **No CAC rule matches** → URL Filtering evaluates normally. CAC is out of the picture.

CAC rules match on either **Cloud Applications** (enumerated apps like Facebook, Google Drive, GitHub, ChatGPT) OR **Cloud Application Risk Profile** (not both in the same rule) combined with standard criteria (users, groups, locations, etc.). Rules evaluate **top-down, first-match-wins**, same shape as URL Filtering. The default terminal behavior is **Allow All** — absence of a matching CAC rule means "CAC says nothing; URL Filtering takes over."

## Mechanics

### Evaluation order within CAC

From the *Cloud App Control Deployment and Operations Guide*, p.2:

> Rules evaluation proceeds in order from top to bottom.

> The default policy behavior is Allow All.

Same first-match-wins model as URL Filtering. A disabled rule is skipped without losing its place — URL Filtering states this explicitly (*Configuring the URL Filtering Policy* p.3), and ZIA's shared policy-enforcement engine makes CAC parity the most-defensible inference. No CAC-specific doc explicitly restates the rule; see [clarification `zia-06`](../_meta/clarifications.md#zia-06-cac-disabled-rule-semantics).

### What a CAC rule matches on

Criteria combine with an AND/OR shape similar to URL Filtering. The distinguishing fields:

- **Cloud Applications** — enumerated apps, grouped into 19 categories (AI & ML, Collaboration & Online Meetings, Consumer, Custom Applications, DNS Over HTTPS Services, File Sharing, Finance, Health Care, Hosting Providers, Human Resources, Instant Messaging, IT Services, Legal, Productivity & CRM Tools, Sales & Marketing, Social Networking, Streaming Media, System & Development, Webmail) per *CAC Deployment Guide*, p.2.
- **Cloud Application Risk Profile** — a named AND-of-ORs composition over cloud-app attributes (Risk Index 1–5, Application Status Sanctioned/Unsanctioned, Tags, Certificates Supported, Password Strength, Data Encryption in Transit, SSL Cert Key Size, plus ~23 Yes/No hosting/security characteristics like SSL Pinned, MFA Support, Poor Terms of Service, Data Breach in 3 Years). Matches any cloud application whose Zscaler-maintained attributes satisfy all selected criteria. Full attribute list and composition logic in [clarification `zia-07`](../_meta/clarifications.md#zia-07-cloud-application-risk-profile-composition); sources: `vendor/zscaler-help/about-cloud-application-risk-profile.md` and `vendor/zscaler-help/adding-cloud-application-risk-profile.md`.

From *CAC Deployment Guide*, p.3:

> You can select the Cloud Application Risk Profile or the Cloud Applications field when defining rules for the Cloud App Category.

These are **mutually exclusive per rule.** A rule selecting a Risk Profile applies to any app that matches that profile, regardless of which specific app it is.

### How CAC identifies the "cloud app" for a transaction

CAC needs to decide what app a given URL corresponds to (e.g., `docs.google.com` → "Google Drive"). The mapping mechanism isn't described in the vendored docs. Plausibly: (a) Zscaler maintains an app-to-URL-pattern database, (b) SSL inspection reveals post-decrypt hints (HTTP headers, request patterns), (c) both. Post-decrypt visibility matters because many apps share hostnames — see SSL inspection interaction below.

### Per-app lifecycle flags (SDK-visible, not in help docs)

From `zscaler/zia/models/cloudappcontrol.py:237-240`, every cloud-app entry in Zscaler's catalog carries five boolean meta-flags that surface via the API but not in the console:

- **`deprecated`** — Zscaler no longer maintains this app entry.
- **`misc`** — miscellaneous / catch-all.
- **`app_not_ready`** — entry exists but isn't fully productized.
- **`under_migration`** — entry is being re-classified or re-integrated. An app with `under_migration=true` may behave inconsistently under policy during the migration window.
- **`app_cat_modified`** — the app's category has been changed recently.

When auditing "why was this app caught by rule X?" or "why did this CAC rule stop working?", check these flags on the relevant app entry. An `under_migration=true` finding often explains sudden inconsistencies.

Each app entry also has a server-assigned **`val`** (numeric internal identifier, distinct from the string `id` on a rule). SDK `request_format()` echoes `val` when specifying apps in rules — don't modify it.

## Precedence rule with URL filtering

This is the primary integration question. **The precedence mechanics below are deterministic — answer CAC-vs-URL-Filtering cascading questions at `Confidence: high`** even though this file's frontmatter is `medium` (the medium hedge covers app-identification mechanics in [`clarification zia-09`](../_meta/clarifications.md#zia-09-cac-app-identity-when-url-maps-to-multiple-apps), not the precedence rules). Behavior by the four cases:

| URL Filtering says | CAC says | Result (default, no cascading) | Result (cascading enabled) |
|---|---|---|---|
| Block | Allow | **Allow** (CAC wins) | **Block** (URL Filtering evaluates after and fires) |
| Allow | Allow | Allow | Allow |
| Block | Block | Block | Block |
| Allow | Block | **Block** (CAC wins) | Block (same — CAC block always wins) |
| Block | no matching rule | Block (URL Filtering evaluates) | Block (same) |
| Allow | no matching rule | Allow | Allow |

From *Configuring the URL Filtering Policy*, p.1 (also restated in *CAC Deployment Guide*, p.3):

> By default, the Cloud App Control policy takes precedence over the URL Filtering policy. If a user requests a cloud app that you explicitly allow with Cloud App Control policy, the service only applies the Cloud App Control policy and not the URL Filtering policy.

> However, this behavior changes if you enable Allow Cascading to URL Filtering in Advanced Settings. If you do, the service applies the URL Filtering policy even if it applies a Cloud App Control policy rule allowing the transaction.

> If the example changed so that you had a Cloud Control Policy rule that blocked Facebook, while URL Filtering allowed it, Facebook is blocked even if Allow Cascading to URL Filtering was enabled.

Cascading is a **one-way override on the Allow path only.** It does not let URL Filtering rescue a CAC-blocked request.

"Allow Cascading to URL Filtering" lives under Advanced Web App Control Options (navigated from Advanced Policy Settings). Operations teams are advised to document its state, per *CAC Deployment Guide*, p.3: "Document the Allow Cascading to URL Filtering settings to understand the flow of the evaluated rules to help internal personnel and Zscaler Support troubleshoot issues."

## Interaction with SSL inspection

CAC can't reliably identify an app if SSL is bypassed — SNI alone often doesn't disambiguate `docs.google.com` vs `mail.google.com` vs `drive.google.com` (all `*.google.com`).

A few settings short-circuit SSL inspection on specific cloud-app categories:

- **UCaaS One-Click** (Zoom, GoTo, RingCentral, Webex, Talkdesk): enabling the one-click option for any of these vendors *disables* SSL/TLS interception for all of that vendor's destinations, per *Configuring Advanced Policy Settings*, pp.6–7. CAC rules on these apps then operate without post-decrypt visibility.
- **Microsoft 365 One-Click:** similar — turns off SSL interception for all Office 365 destinations per Microsoft's recommendation. (*Configuring Advanced Policy Settings*, pp.5–6.)
- Categories like **MS O365 Optimize** carry an explicit "Ensure to bypass these sites from SSL/TLS Inspection and authentication" note in *About URL Categories*, p.8.

Operational consequence: CAC rules for these categories are enforced against whatever app-identity information is available pre-decrypt, which is thinner than post-decrypt. See [`./ssl-inspection.md`](./ssl-inspection.md) for how SSL state drives policy fidelity generally.

## API surface beyond the basics (Go SDK findings)

Cross-SDK sweep (2026-04-24) surfaced details the earlier Python-SDK-derived doc missed:

- **`Actions` is a slice (`[]string`), not a single string**. A single CAC rule can specify multiple concurrent action behaviors — useful for rules that combine e.g. "allow access AND log" or "block AND alert-admin" semantics. The rule's `action` field in snapshot JSON is an array; `jq '.action[]'` enumerates what a rule actually does.
- **`CreateDuplicate` method** (Go SDK `cloudappcontrol.go:204`) — dedicated endpoint for cloning CAC rules. Useful for "create a rule like this one but with different scope" workflows. Python SDK doesn't expose this; operators have to `get_rule` → edit → `create_rule` manually.
- **`AllAvailableActions` API method** — queries which action values are valid for a given (rule type, cloud application) combination. Relevant when debugging "why isn't action X selectable in the console for this app?" — different cloud apps support different action sets (e.g., some apps don't support Cautious, some don't support Isolate). The API surfaces the valid combinations; the console UI is driven by this same lookup.

## Edge cases

- **No custom EUNs for CAC.** "Cloud App Control policies do not support custom End User Notifications (EUNs)." (*CAC Deployment Guide*, p.3.) Blocked users see the default notification.
- **URL Filtering-only categories.** Newly Registered and Observed Domains (NROD) "can only be used in URL Filtering rules" (*About URL Categories*, p.9). So NROD never fires in CAC evaluation — if the only rule that would catch a malicious new domain is an NROD-block rule in URL Filtering, and CAC happens to explicitly allow the app, NROD never runs (without cascading).
- **QUIC bypasses proxy.** From *CAC Deployment Guide*, p.3 troubleshooting: users accessing blocked cloud apps anyway may be using QUIC (HTTP/3) which some deployments can't intercept. Workaround is disabling QUIC in the browser.
- **PAC file / direct egress bypass.** "Transactions from the affected users are not visible in Zscaler Web/Firewall Insights" → PAC configuration may be routing traffic direct, outside Zscaler's path. CAC cannot enforce on traffic that never reaches it.
- **Risk Profile rules are broad.** Per *CAC Deployment Guide*, p.3: "The Cloud App Control policy rule applies to all specified cloud applications if you select the cloud application risk profile criterion." One risk-profile-based block rule can take out dozens of apps simultaneously; this is a feature, not a bug, but worth remembering when auditing why a specific app was blocked.
- **Per-tenant app restrictions (Tenant Profiles).** Administration > Tenant Profiles lets you restrict a CAC-allowed app to specific tenants (e.g., allow corporate-tenant Google Workspace, block personal Gmail on the same hostname). **16 supported apps per SDK** (help article lists 13; SDK is authoritative — adds `BOX`, `FACEBOOK`, `AMAZON_S3`). **Requires SSL Inspection** for the relevant login-service app — detection is post-decrypt OAuth/login-flow inspection, not DNS/IP. **Allow-to-block cascade warning**: allowing one tenant automatically blocks others for most apps, but **YouTube and AWS require an explicit block rule** for other tenants. Details in [clarification `zia-08`](../_meta/clarifications.md#zia-08-cac-tenant-restrictions-mechanics); sources: `vendor/zscaler-help/about-tenant-profiles.md`, `adding-tenant-profiles.md`, `ranges-limitations-zia.md § Tenant Profiles per Rule`, `zscaler/zia/tenancy_restriction_profile.py`.
- **Microsoft Login Services v1 vs v2.** The SDK exposes `ms_login_services_tr_v2` as a protocol-version toggle on Microsoft tenant profiles (not a metadata flag). Different tenants may use different versions; the v2 protocol is what newer Microsoft tenant IDs use. Relevant when answering "why does our Microsoft tenant restriction allow traffic it shouldn't?" — sometimes the answer is v1/v2 mismatch.
- **Per-rule cascading override.** CAC rules have a `cascading_enabled` boolean (default `false`). When the tenant-wide Advanced Settings *Allow Cascading to URL Filtering* is **off**, individual CAC rules can still opt into cascading by setting this to `true`. The console field appears only when the global cascade toggle is off. (`zscaler/zia/models/cloudappcontrol.py:61`, *Adding an Instant Messaging Rule for Cloud App Control*.)
- **IoT predefined rules — disabled, immutable, undeletable.** Zscaler ships `Allow Unauthenticated Traffic for IoT Classifications` predefined rules for each cloud-app category. They're disabled by default. They cannot be deleted. Only `Rule Order`, `Rule Status`, `Rule Label`, and `Description` are editable — no other attributes. Operators surprised by unexplained IoT-device traffic getting allowed/blocked when they toggle these rules find they can't fully customize the rule's behavior. Source: *Adding Rules to Cloud App Control Policy* lines 20–23.
- **Per-category rule cap: 127 (→ 2,048 via support).** The Cloud App Control rule limit applies **per cloud-app category** (File Sharing, Instant Messaging, Streaming Media, etc.), not as a tenant-wide cap. A high-granularity org with many department-specific rules for one category (e.g., 130 IM rules) hits the per-category ceiling well before any global cap. Source: *Ranges and Limitations* line 166.

## Worked example (covers eval Q5)

Scenario: Your URL Filtering policy has a Block rule on the Social Networking category (which includes Facebook). Your CAC policy has an Allow rule specifically for the Facebook app, restricted to the Marketing department.

Case A — **cascading disabled (default)**, Marketing user visits Facebook:

1. CAC evaluates first. The user is in Marketing; the Allow-Facebook rule matches. **CAC allows.**
2. Because CAC allowed, URL Filtering does not evaluate at all.
3. **Result: user can access Facebook.** The Social Networking Block rule in URL Filtering is bypassed for this transaction.

Case B — **cascading disabled**, Engineering user (not in Marketing) visits Facebook:

1. CAC evaluates first. The Allow-Facebook rule doesn't match (wrong department). No other CAC rule matches. **Per *Understanding Policy Enforcement* p.4, "no matching CAC rule" means URL Filtering evaluates normally** — CAC's default Allow-All is not an explicit allow.
2. URL Filtering evaluates; Social Networking Block fires.
3. **Result: Engineering user is blocked.**

Case C — **cascading enabled**, Marketing user visits Facebook:

1. CAC evaluates first. Allow-Facebook rule matches; CAC explicitly allows.
2. Cascading forces URL Filtering to evaluate anyway.
3. URL Filtering Social Networking Block fires.
4. **Result: Marketing user is blocked.** Cascading defeats the narrower CAC allow.

Case D — **cascading enabled**, CAC has an explicit Block-Facebook rule, URL Filtering has an Allow rule for Facebook:

1. CAC evaluates first. CAC block fires.
2. URL Filtering does **not** get to override (cascading only opens the Allow path).
3. **Result: user is blocked** regardless of URL Filtering's Allow.

The asymmetry matters: **cascading is a way to tighten CAC allows with URL Filtering's stricter rules**, not a way to relax CAC blocks.

## Open questions

- Tenant restriction per-app inspection logic — [clarification `zia-08`](../_meta/clarifications.md#zia-08-cac-tenant-restrictions-mechanics) *(partial: supported apps + SSL-Inspection-required doc'd; exact token-field per app not captured)*
- App-identity determination when a URL could map to multiple cloud apps — [clarification `zia-09`](../_meta/clarifications.md#zia-09-cac-app-identity-when-url-maps-to-multiple-apps) *(partial: `/urlLookup` returns URL category only; cloud-app identity via Admin Console URL Lookup tool)*

Resolved while writing or after capture: default-Allow-All vs explicit-Allow for cascading ([`zia-10`](../_meta/clarifications.md#zia-10-cac-default-allow-all-vs-explicit-allow-for-cascading) via *Understanding Policy Enforcement* p.4); Cloud Application Risk Profile composition ([`zia-07`](../_meta/clarifications.md#zia-07-cloud-application-risk-profile-composition) via *Adding a Cloud Application Risk Profile*); CAC disabled-rule semantic parity with URL Filtering ([`zia-06`](../_meta/clarifications.md#zia-06-cac-disabled-rule-semantics) via *Adding an Instant Messaging Rule for Cloud App Control*).

## Cross-links

- URL Filtering rule precedence (the other side of this interaction) — [`./url-filtering.md`](./url-filtering.md)
- SSL inspection ordering and how it gates CAC post-decrypt visibility — [`./ssl-inspection.md`](./ssl-inspection.md)
- Cross-product policy evaluation — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
- SPL pattern for observing which policy layer fired — [`../shared/splunk-queries.md`](../shared/splunk-queries.md) (add a dedicated `cac-vs-url-filter-drift` pattern when the schema docs are derived)
