---
product: meta
topic: "clarifications-index"
title: "Clarification index — open questions across references"
content-type: reference
last-verified: "2026-04-23"
confidence: high
sources: []
author-status: reviewed
---

# Clarification index

Centralized list of open questions raised across `references/*.md`. Each entry has a stable ID so a human or agent can say "see `zia-03`" without ambiguity and have everyone land in the same place.

## Conventions

**ID format**: `<area>-<num>`.

- `zia-*` — ZIA-scoped behavior question
- `zpa-*` — ZPA-scoped behavior question
- `zcc-*` — ZCC (Client Connector) behavior question
- `shared-*` — cross-product or skill-wide question
- `log-*` — log-schema / NSS / LSS question that spans multiple products

IDs are stable forever. If an entry is resolved, it stays here with its answer — don't renumber.

**Status**:

- `open` — unresolved
- `investigating` — someone is gathering evidence; note who / when
- `resolved` — has been answered; keep the entry with the answer preserved
- `wontfix` — judged not worth resolving (note why)

**Resolves with** — what kind of evidence would close this:

- `lab test` — controlled test tenant required
- `tenant snapshot` — the internal fork's live config would reveal it
- `support ticket` — Zscaler support needs to confirm
- `zscaler doc not yet read` — should be in public docs somewhere, haven't found it
- `operator experience` — someone running this in production can confirm
- `code read` — SDK or TF provider source resolves it
- `design decision` — not a Zscaler fact question; something we need to choose

## Workflow for adding a new entry

1. Writing a reference doc, you hit a question the sources don't answer.
2. Add it to your doc's **Open questions** section with a one-line summary.
3. Add the full entry here with a new stable ID.
4. Link both ways:
   - Your doc: `See [clarification zia-07](../_clarifications.md#zia-07).`
   - This file: `*Origin: references/zia/foo.md § Open questions*`
5. When resolving an entry, update the `Status:` line and add an `Answer:` paragraph. Don't delete.

---

## Status summary

Skim this before reading the full entries.

### Resolved

| ID | Title |
|---|---|
| [`zia-01`](#zia-01-predefined-vs-custom-category-specificity) | Predefined-vs-custom via Retain Parent Category toggle |
| [`zia-03`](#zia-03-wildcard-tokenization) | Wildcard tokenization — leading-period only; asterisk invalid |
| [`zia-05`](#zia-05-admin-rank-order-collision) | Admin rank structurally enforces precedence regardless of order-value collisions |
| [`zia-06`](#zia-06-cac-disabled-rule-semantics) | CAC disabled-rule semantic identical to URL Filtering (doc'd verbatim in per-category CAC rule articles) |
| [`zia-07`](#zia-07-cloud-application-risk-profile-composition) | Cloud Application Risk Profile composition — full attribute list documented |
| [`zia-10`](#zia-10-cac-default-allow-all-vs-explicit-allow-for-cascading) | CAC default Allow-All is not "explicit allow" |
| [`zia-13`](#zia-13-explicit-pipeline-order-sourcing) | Pipeline order — firewall → web module two-pass |
| [`zpa-02`](#zpa-02-zpa-more-granular-definition) | "More granular" = most-specific FQDN wins |
| [`zpa-03`](#zpa-03-multimatch-mixed-style-evaluation) | Multimatch mixed style — rejected at config time |
| [`zpa-05`](#zpa-05-no-match-in-segment-criteria) | "No match in segment" = port mismatch specifically |
| [`zpa-06`](#zpa-06-require-approval-action-semantics) | Require Approval = Conditional Access = ZIdentity step-up |
| [`zpa-08`](#zpa-08-when-both-fqdns-are-equal-interpretation) | FQDN-equal first-match ordering confirmed |
| [`shared-03`](#shared-03-script-language-choice-for-tenant-data-tooling) | Scripts implemented as Python via `uv run` |

### Partially resolved

| ID | Title | What's still open |
|---|---|---|
| [`zia-04`](#zia-04-nrod-propagation-lag) | NROD propagation lag | Documented as "within hours of going live" — upper-bound precision unstated |
| [`zia-08`](#zia-08-cac-tenant-restrictions-mechanics) | CAC tenant restrictions mechanics | Supported apps + SSL-Inspection-required mechanic doc'd; per-app token-field inspection details in per-app config articles not yet vendored |
| [`zia-09`](#zia-09-cac-app-identity-when-url-maps-to-multiple-apps) | CAC app-identity when URL maps to multiple apps | URL-Lookup API is the mapping surface; internal URL-to-app resolution logic still undocumented |
| [`zia-11`](#zia-11-transparent-vs-explicit-forwarding-mixed-mode) | Transparent vs explicit forwarding mixed mode | Silent per-session drift for tenants not gating rules by Device/Location Group |
| [`log-01`](#log-01-nss-feed-format-versions) | NSS feed format versions | Exact field-presence differences between CSV/JSON/TSV output templates |
| [`log-02`](#log-02-cloud-nss-vs-legacy-nss-divergence) | Cloud NSS vs legacy NSS divergence | Both source from the same Nanolog — field content parity expected; branching most likely needed for format (Cloud NSS recommends JSON) and per-instance feed-count limits, not field presence |

### Investigating

| ID | Title |
|---|---|
| [`zpa-01`](#zpa-01-multi-segment-match-representation-in-lss) | Multi-segment match representation in LSS — schema shape suggests one record per segment; comma-concatenated ConnectionID hints at multi-attempt encoding |

### Open

`zia-02`, `zia-12`, `zia-14`, `zia-15`, `zpa-04`, `zpa-07`, `log-03`, `log-04`, `shared-01`, `shared-02`, `shared-04`, `shared-05`, `shared-06`, `zcc-01`, `zcc-02`, `zcc-03`, `zcc-04`, `zcc-06`.

Partial / SDK-mined (resolved via code read or help-doc capture; full lab confirmation pending): `zcc-05`, `zcc-07`.

---

## Entries

### zia-01 — Predefined vs custom category specificity

*Origin: `references/zia/url-filtering.md` § Open questions*

If a URL matches both a predefined category (e.g., Social Networking) and a custom category with varying specificity, which one wins at policy evaluation time? Zscaler docs describe specificity-wins-across-custom-categories but are silent on custom-to-predefined comparison.

**Status**: resolved (2026-04-23).

**Answer**: The "both categories" premise is governed by the **Retain Parent Category** setting on each custom-category entry, which controls whether adding a URL to a custom category removes it from its predefined classification.

From *About URL Categories* (`vendor/zscaler-help/About_URL_Categories.pdf`) p.19:

> If you manually add a URL or subdomain to an existing super category, category, or custom category, you can also specify whether you want it to retain its original parent category. For example, if you manually add www.google.com to a User-Defined category, you can specify whether you want google.com also to retain its original Web Search category.

Two cases:

- **Retain Parent Category OFF** (default behavior for manually-added URLs in most contexts): the URL is removed from its original predefined classification and belongs *only* to the custom category. Rules against the predefined category do not match. Rules against the custom category do.
- **Retain Parent Category ON**: the URL belongs to **both** the custom and its original predefined category simultaneously. Rules against either can match → **rule order decides** which fires (same first-match-wins principle that governs rule evaluation generally).

*URL Filtering Deployment and Operations Guide* (`vendor/zscaler-help/URL_Filtering_Deployment_and_Operations_Guide.pdf`) p.4 confirms the rule-order behavior for the Retain-Parent case explicitly:

> Wrong category is shown on the blocked page: Check logs to see which category is logged for the transaction. Is the URL in question added to a custom category? If the site is added in the Retaining Parent category, check the rule order to make sure that another rule does not block access to this URL first.

This is a *different* resolution mechanism from the custom-to-custom specificity rule. Specificity-wins handles the case where a URL matches multiple custom categories at different specificities — it picks which one the URL "belongs to" before rules evaluate. Retain Parent Category handles the case where a URL is simultaneously in a custom and a predefined category — in that case rule order is the tiebreaker.

Operationally visible via the "No. of URLs Retaining Parent Category" / "No. of Keywords Retaining Parent Category" / "No. of IP Ranges Retaining Parent Category" columns on the URL Categories page (*About URL Categories* pp.21–22), and via the `urlsRetainingParentCategoryCount`, `keywordsRetainingParentCategoryCount`, `ipRangesRetainingParentCategoryCount`, and `patternsRetainingParentCategoryCount` fields in the `/urlCategories` API response (*Configuring URL Categories Using API*).

**Implication for the Q5-style question in `url-filtering.md`**: check the Retain-Parent state of the custom entry. If OFF → URL is only in the custom category, the predefined rule won't match. If ON → URL is in both, rule order resolves which fires. The prior "two plausible outcomes" framing collapses into one deterministic flow once Retain Parent is known.

---

### zia-02 — Same-specificity custom category collision

*Origin: `references/zia/url-filtering.md` § Open questions*

If two custom categories contain the identical exact entry (e.g., both have `www.example.com`), which category wins the URL at category-resolution time? Creation order? Internal category ID? First-rule-that-references-one?

**Resolves with**: lab test OR tenant snapshot. **Status**: open. **Blocks**: deterministic precedence answers when admins have overlapping custom categories.

**Doc sweep 2026-04-23**: Checked *About URL Categories*, *URL Filtering Deployment and Operations Guide*, *Configuring URL Categories Using API*, *Configuring the URL Filtering Policy*. None address two custom categories containing an identical exact entry. The "specific match first" rule (*About URL Categories* p.20) and the "more specific takes precedence" statement (*URL Filtering Ops Guide* p.2) only disambiguate when specificity differs. For equal-specificity collisions, no doc rule fires.

One data point, not a resolution: *Configuring URL Categories Using API* shows each category carries an internal numeric `val` identifier that increments on creation (CUSTOM_05 → val 132, CUSTOM_10 → val 137, CUSTOM_16 → val 143). This suggests ordering information exists internally, but whether category resolution uses it — vs creation-timestamp, vs alphabetical, vs something else — is not stated. Still a lab-test or tenant-snapshot question.

---

### zia-03 — Wildcard tokenization

*Origin: `references/zia/url-filtering.md` § Open questions; feeds `references/zia/wildcard-semantics.md`*

Zscaler's docs show wildcards as `.example.com` (leading dot, no asterisk). Whether `*.example.com`, `*example.com`, bare `example.com` behave differently was unclear.

**Status**: resolved (2026-04-23).

**Answer**: From *URL Format Guidelines* (`vendor/zscaler-help/url-format-guidelines.md`, captured via Playwright from https://help.zscaler.com/zia/url-format-guidelines):

- `*` is **not** a valid wildcard character. `*.safemarch.com` and `*safemarch.com` are explicitly **not permitted**.
- Leading period `.safemarch.com` is the only domain-level wildcard form. It matches: the bare domain, subdomains up to 5 levels deep, and any path under any of those.
- Exact form `safemarch.com` (no leading period) matches only the exact domain, plus implicit right-side path wildcard.
- Right-side (path / port / query-string) matching is implicit — no syntax needed.
- Exact match takes priority over wildcard match across custom categories.

Full semantics codified in `references/zia/wildcard-semantics.md`.

---

### zia-04 — NROD propagation lag

*Origin: `references/zia/url-filtering.md` § Open questions*

How long after a URL is first observed does Newly Registered and Observed Domains classification propagate to URL Filtering evaluation? Affects "why did this brand-new domain slip past our NROD-block rule" questions.

**Status**: partially resolved (2026-04-23).

**Answer**: Zscaler publishes the propagation-lag ceiling as "within hours of going live." From *Configuring Advanced Policy Settings* (`vendor/zscaler-help/Configuring_Advanced_Policy_Settings.pdf`) p.1, describing the Enable Suspicious New Domains Lookup toggle:

> Enable this option to provide advanced protection to users against the newly registered and observed domains that are **identified within hours of going live**. This feature also identifies newly revived domains. These domains are often considered potentially malicious until they are well-known or categorized. Identifying them improves the overall security posture. This feature is a prerequisite for using the Newly Registered and Observed Domains and Newly Revived Domains URL categories in a policy rule.

Context from *About URL Categories* (`vendor/zscaler-help/About_URL_Categories.pdf`) p.9:

> Sites whose domains were created in the last 30 days and are currently not categorized by Zscaler. ... To determine if a Miscellaneous or Unknown URL belongs in the Newly Registered and Observed Domain (NROD) category, when a URL is found in the Miscellaneous or Unknown category, it is checked against Zscaler's NROD database. If there's a match, the URL is categorized as a Newly Registered and Observed Domain.

So two distinct time windows now have doc-backed values:

- **Propagation lag** (domain goes live → appears in Zscaler's NROD database): "within hours" per Advanced Policy Settings. Not a precise SLA, but Zscaler's own published bound.
- **Eligibility window** (how long a domain stays in NROD after creation): 30 days per About URL Categories.

Related category "Newly Revived Domains" (*About URL Categories* p.18) covers sites reactivated after ~10 days of inactivity; different phenomenon, shares the same lookup toggle.

**Still open**: upper-bound precision. "Within hours" could mean 1, 6, or 24 — affects whether a Block-on-NROD rule reliably catches a domain that went live earlier the same day. Resolves with support ticket OR operator experience (observed delay in practice).

---

### zia-05 — Admin rank order collision

*Origin: `references/zia/url-filtering.md` § Open questions*

Admin rank gates what order values a rule can have. Can two rules at different admin ranks end up with the same numerical order? If so, which evaluates first — the higher-ranked one, the older one, the alphabetically earlier one?

**Status**: resolved (2026-04-23).

**Answer**: Admin rank is a structural precedence guarantee, not a tiebreaker layered on top of rule order. The question's premise (two rules at different admin ranks with the same numerical order) is effectively neutralized by the doc's behavior guarantee.

From *Configuring the URL Filtering Policy* (`vendor/zscaler-help/Configuring_the_URL_Filtering_Policy.pdf`) p.3:

> **Edit Rule Order**: Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order. You can change the value, but if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
>
> **Admin Rank**: Enter a value from 0 to 7 (0 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule's admin rank determines the value you can select in the rule order, so that **a rule with a higher admin rank always precedes a rule with a lower admin rank**.

Two takeaways:

1. **Structural guarantee**: When Admin Rank is enabled, the console constrains the rule-order values each admin can pick so that a higher-rank rule (lower admin-rank number — 0 = highest) always ends up earlier in the evaluation order than a lower-rank rule.
2. **Functional behavior**: Evaluation order is deterministic and matches admin-rank precedence. Even if the numerical `order` value could somehow be equal across ranks (via API bypass or migration), the higher-rank rule is the one that fires first by design.

Admin Rank is an opt-in feature ("if you've enabled Admin Rank"); without it, rule order is a flat numeric sequence and admin identity doesn't affect evaluation.

Applies to ZIA URL Filtering, SSL Inspection, and other ZIA policy types that expose the Admin Rank field. ZPA access policies don't use the same admin-rank mechanism based on vendored material.

---

### zia-06 — CAC disabled rule semantics

*Origin: `references/zia/cloud-app-control.md` § Mechanics*

For URL Filtering, the docs explicitly state that disabled rules keep their place in the rule order. The CAC Deployment Guide doesn't restate this — whether disabled CAC rules behave identically (skip-in-place) or differently (removed from the evaluation list, changing effective order) is unstated. Very likely identical but unconfirmed.

**Status**: resolved (2026-04-23).

**Answer**: CAC's Rule Status semantic is **identical to URL Filtering's** — doc'd verbatim in the per-category Adding-X-Rule articles.

From *Adding an Instant Messaging Rule for Cloud App Control* (`vendor/zscaler-help/adding-instant-messaging-rule-cloud-app-control.md`), which is the template that all 19 per-category CAC rule-adding articles follow:

> **Rule Status**: An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.

This matches *Configuring the URL Filtering Policy* (`Configuring_the_URL_Filtering_Policy.pdf`) p.3 word-for-word. CAC-Rule-Status-parity-with-URL-Filtering is now directly documented, not inferred.

Corroborating facts:

- *Adding Rules to the Cloud App Control Policy* (`vendor/zscaler-help/adding-rules-cloud-app-control-policy.md`) describes the predefined *Allow Unauthenticated Traffic for IoT Classifications* rule as "disabled by default and cannot be deleted" with Rule Status as a modifiable field — confirming per-rule Rule Status exists as a first-class CAC field, not just a URL-Filtering-only construct.
- The shared policy-enforcement engine doc (*Understanding Policy Enforcement* pp.1–13, see `zia-13`) covers URL Filtering and CAC under the same evaluation semantics, making cross-module behavioral divergence structurally unlikely.

---

### zia-07 — Cloud Application Risk Profile composition

*Origin: `references/zia/cloud-app-control.md` § Mechanics*

The CAC rule form offers "Cloud Application Risk Profile" as an alternative to enumerated "Cloud Applications." What a Risk Profile consists of — geolocation of data handling, vendor security attestations, encryption posture, published breach history, or something else — isn't described in the vendored docs. Needed to confidently answer "why was this app caught by our Medium-risk block rule?"

**Status**: resolved (2026-04-23).

**Answer**: A Cloud Application Risk Profile is an AND-of-ORs composition over a fixed set of **cloud-application attributes**. The profile matches any cloud application whose attributes satisfy all selected criteria.

From *About Cloud Application Risk Profile* (`vendor/zscaler-help/about-cloud-application-risk-profile.md`) and *Adding a Cloud Application Risk Profile* (`vendor/zscaler-help/adding-cloud-application-risk-profile.md`):

**Core classification attributes** (each can take one or more values; values within an attribute combine with OR):

- **Risk Index** — 1–5 (1 = lowest, 5 = highest). Each cloud application is assigned a Zscaler-computed risk score, with per-app overrides available from the Application Information page. Multi-select supported.
- **Application Status** — `Sanctioned` / `Unsanctioned`. Set per-app by the customer (see *About Cloud Application Status*).
- **Tags** — customer-assigned tags (see *About Cloud Application Tags*).
- **Certificates Supported** — named compliance certifications (e.g., `AICPA`, `GDPR`). Include- or exclude-style membership.
- **Password Strength** — `Good` / `Poor` / `Unknown` (see article for the full criteria definitions).
- **Data Encryption in Transit** — `SSLv2` / `SSLv3` / `TLSv1.0` / `TLSv1.1` / `TLSv1.2` / `TLSv1.3` / `Unknown`.
- **SSL Cert Key Size** — `Any` / `2048 Bits` / `256 Bits` / `3072 Bits` / `384 Bits` / `4096 Bits` / `Unknown`.

**Hosting & security characteristics** (each takes `Yes` / `No` / `Unknown`):

- Poor Terms of Service
- Admin Audit Logs
- Data Breach in 3 Years
- Source IP Restrictions
- MFA Support
- File Sharing
- SSL Pinned
- HTTP Security Header Support
- Evasive
- DNS CAA Policy
- Weak Cipher Support
- Valid SSL Certificate
- Published CVE Vulnerability
- Vulnerable to Heartbleed
- Vulnerable to Poodle
- Vulnerable to Logjam
- Support for WAF
- Remote Access Screen Sharing
- Vulnerability Disclosure Policy
- Sender Policy Framework (SPF)
- DomainKeys Identified Mail (DKIM)
- Domain-Based Message Authentication (DMARC)
- Malware Scanning for Content

**Composition logic**: AND between attributes; OR between multiple values within a multi-select attribute (Risk Index, Certificates Supported, Data Encryption in Transit, SSL Cert Key Size).

Example from the doc: `[Risk Index (1 OR 3 OR 5)] AND [Application Status (Sanctioned)] AND [Certificates Supported (AICPA OR GDPR)] AND [SSL Pinned (Yes)]`.

**Where the per-app attribute values come from**: Zscaler ThreatLabz (the vendor's security research arm) maintains the attribute database for known cloud apps. Customers can override Risk Index per app from the Application Information page. Status and Tags are customer-set.

**Implication for "why was this app caught by our Medium-risk block rule?"**: inspect the rule's attached Risk Profile config, then look up the app's current attribute values on its Application Information page and compare. Any attribute mismatch is the exonerator; an all-match is the culprit.

---

### zia-08 — CAC tenant restrictions mechanics

*Origin: `references/zia/cloud-app-control.md` § Edge cases*

Zscaler supports distinguishing corporate vs personal instances of the same SaaS app on shared hostnames (e.g., corporate Google Workspace vs personal Gmail both under `*.google.com`). The detection mechanism — header inspection post-decrypt, tenant ID parameter, OAuth audience claim, DNS-based hints — isn't described in the vendored CAC guide.

**Status**: partially resolved (2026-04-23).

**Answer**: Feature is called **Tenant Profiles** (or "tenancy restriction"), configured under Administration > Tenant Profiles and attached to Cloud App Control rules.

From *About Tenant Profiles* (`vendor/zscaler-help/about-tenant-profiles.md`) and *Adding Tenant Profiles* (`vendor/zscaler-help/adding-tenant-profiles.md`):

**Supported cloud applications** — the help article *Adding Tenant Profiles* lists 13, but the SDK's `tenancy_restriction_profile.py:146-149` enumerates **16**. SDK is authoritative; help article is stale.

SDK-authoritative `app_type` enum values:

- `YOUTUBE` (help-listed)
- `GOOGLE` (help-listed as "Google Apps")
- `MSLOGINSERVICES` (help-listed as "Microsoft Login Services")
- `SLACK` (help-listed)
- **`BOX`** — SDK-only
- **`FACEBOOK`** — SDK-only
- `AWS` (help-listed as "Amazon Web Services")
- `DROPBOX` (help-listed)
- `WEBEX_LOGIN_SERVICES` (help-listed)
- **`AMAZON_S3`** — SDK-only
- `ZOHO_LOGIN_SERVICES` (help-listed)
- `GOOGLE_CLOUD_PLATFORM` (help-listed)
- `ZOOM` (help-listed)
- `IBMSMARTCLOUD` (help-listed)
- `GITHUB` (help-listed)
- `CHATGPT_AI` (help-listed as "ChatGPT")

**Key mechanics:**

1. **SSL Inspection is required** for tenant restrictions to function. The Tenant Profile article explicitly instructs adding the relevant login-service app as a criterion in an SSL Inspection rule (e.g., for Office 365 tenant restrictions, include "Microsoft Login Services" in an SSL Inspection rule with higher order than the Office 365 One Click Rule). This confirms the detection model: **post-SSL-decrypt inspection of the login/OAuth flow**, not DNS-based or connection-IP-based.
2. **Identifier types are per-app-specific** (from *Ranges & Limitations — URL Filtering & Cloud App Control*, `ranges-limitations-zia.md`):
   - AWS: account IDs (12 digits)
   - ChatGPT: workspace IDs (up to 64 chars)
   - Dropbox: team IDs
   - GitHub: enterprise slugs
   - Google Apps: domains (e.g., `yourcorp.com`)
   - Google Cloud Platform: organization IDs
   - IBM SmartCloud: account IDs
   - Microsoft Login Services v1: Tenant Directory ID; v2: Tenant Directory ID:Policy ID; plus M365 Tenants or Tenant IDs
   - Slack: Workspace ID (both "Your" and "Allowed" flavors)
   - YouTube: Channel ID and School ID
   - Webex Login Services: Webex tenants
   - Zoho Login Services: Zoho IDs
   - Zoom: policy label
3. **Allow-to-block cascading**: allowing a specific tenant automatically blocks other tenants for most apps (subsequent policies not evaluated). **Exceptions**: YouTube and AWS still evaluate subsequent policies, so an **explicit block rule is required** to block other tenants for those two.
4. **One tenant per SaaS application per organization for some apps** (see Ranges & Limitations for the full per-app matrix — GitHub is 1 profile/rule, Microsoft v1/v2 directory IDs are 1 each, Zoom is 1 policy label; most others support 100–500 identifiers per profile).

**Still open**: the per-app inspection logic at the token level (OAuth audience claim, login-request header, SAML assertion attribute, etc.) isn't enumerated in the articles I captured. "Inspected post-decrypt in the login flow" is the mechanism class — the exact token field per app would be in per-app configuration guides (e.g., *Configuring a Microsoft Login Services Tenant Profile*, etc.) that weren't captured in this sweep. Low priority — the high-level mechanism is enough for skill answers, and per-app detail is operator-facing rather than skill-facing.

---

### zia-09 — CAC app-identity when URL maps to multiple apps

*Origin: `references/zia/cloud-app-control.md` § Mechanics*

Many hostnames serve multiple cloud apps (e.g., `*.google.com` covers Drive, Docs, Gmail, Meet). How CAC picks which app identity a given request maps to — URL path, post-decrypt HTTP headers, user agent, some combination — isn't in the vendored material. Affects any "which CAC category applies to this URL" answer.

**Status**: partially resolved (2026-04-23).

**Answer** (partial): URL-to-app resolution is surfaced through the `/urlLookup` API endpoint and the Admin Console URL Lookup tool. From *Understanding Cloud App Categories* (`vendor/zscaler-help/understanding-cloud-app-categories.md`): "You can look up a cloud application for a URL using the URL Lookup tool or the urlLookup API."

Background from *Configuring URL Categories Using API* p.11:

> Custom URL classification is not returned by this request. Any URLs that are not categorized under a predefined URL category returns a value of MISCELLANEOUS_OR_UNKNOWN.

So `/urlLookup` returns **predefined URL categories** (not Cloud App identity directly). For Cloud App identity specifically, the Admin Console URL Lookup tool provides the cloud app name, but that endpoint isn't documented in the API reference articles we've captured.

**What this means operationally**: to answer "what Cloud App does URL X map to," the most-defensible path is (a) run `/urlLookup` for URL category, (b) cross-reference with the tenant's Cloud App Control supported-apps list (see "Viewing Supported Cloud Applications" — Policies > Access Control > SaaS Application Control > Policies), and (c) use the Admin Console URL Lookup tool for authoritative cloud-app identity.

**Still open**: the internal logic Zscaler uses to resolve a shared-hostname URL to a specific cloud-app identity (e.g., how `*.google.com` splits into Drive vs Docs vs Gmail vs Meet) isn't documented. Presumably post-decrypt URL-path / HTTP-header inspection (given the Tenant Profiles model in `zia-08` works the same way), but not explicitly stated. Lab-testable with a few known URLs and the URL Lookup tool.

---

### zia-10 — CAC default Allow-All vs explicit Allow for cascading

*Origin: `references/zia/cloud-app-control.md` § Worked example Case B*

The CAC Deployment Guide says "The default policy behavior is Allow All." The URL Filtering Policy article separately says URL Filtering evaluates when "a user requests a Cloud App for which you have not configured a Cloud App Control policy rule." Tension: does a CAC terminal Allow-All default count as an "explicit allow" (triggering URL Filtering bypass unless cascading is on) or as "no rule applied" (URL Filtering always evaluates)?

**Status**: resolved (2026-04-23).

**Answer**: "No matching CAC rule" means URL Filtering evaluates — CAC's Allow-All default is *not* an explicit allow. From *Understanding Policy Enforcement*, p.3-4:

> If a user requests a cloud app for which you have not configured a Cloud App Control policy rule (for example, the user requests eBay.com, and you don't have a Cloud App Control rule for eBay.com), the service still evaluates and applies the URL filtering policy.

Case B in `cloud-app-control.md` stands correct as originally written.

---

### zia-11 — Transparent vs explicit forwarding mixed mode

*Origin: `references/zia/ssl-inspection.md` § Mechanics*

Under transparent forwarding, SSL Inspection policies evaluate on both SNI and destination IP; under explicit forwarding, only SNI. Many real deployments mix modes (branch offices via GRE, remote users via Zscaler Client Connector explicit proxy). When a user transitions between these paths within the same session, or when a single tenant has both forwarding types active, are SSL Inspection rules evaluated consistently? Specifically: does a rule like "Do Not Inspect: URL Category = Miscellaneous" produce different results for the same user depending on which path the traffic took?

**Status**: partially resolved (2026-04-23).

**Answer (partial)**: Policy evaluation is **deterministic per traffic path, not per user**. A connection is evaluated based on the forwarding method it used — that much is already captured in `zia-13`. The Leading Practices Guide treats this as a design point to plan around, not a hidden gotcha:

From *ZIA SSL Inspection Leading Practices Guide* (`vendor/zscaler-help/ZIA_SSL_Inspection_Leading_Practices_Guide.pdf`) p.14:

> You can only use user attributes if the traffic forwarded to Zscaler is from the Zscaler Client Connector (preferred) or if you enable Enforce Surrogate IP and properly work for traffic flowing through GRE or IPSec tunnels to Zscaler. Without Zscaler Client Connector or Surrogate IP, the service cannot identify the user (before inspection) to properly apply user-based policies and determine if inspection is desired. Device Groups (OS Type). You can only identify device groups if the traffic is forwarded to Zscaler via the Zscaler Client Connector.

The recommended pattern (pp.28–30) is to encode path-awareness in rules via **Device Group** (`Client Connector` / `No Client Connector`) or **Location Group** criteria rather than relying on implicit consistency. The worked example on p.29 includes:

> Rule 1: Inspect if Cloud App is OneDrive or SharePoint, Device Group is Android, iOS, Windows, or macOS, and the Location is HQ.
> ...
> Rule 4: Exempt if Device Group is No Client Connector for Location HQ.

A single TCP connection is bound to one forwarding path, so "mid-session transitions" don't exist at the evaluation layer. Successive connections by the same user over different paths will evaluate against the same rule set but can produce different matches — which is the recommended way to encode "inspect on-CC devices, exempt everything else."

**Still open** (low priority): whether a tenant whose rules don't use Device Group or Location Group criteria can suffer **silent per-session drift** when a category-based Do-Not-Inspect rule hits the SNI+IP (transparent) vs SNI-only (explicit) evaluation asymmetry. The canonical example is "Do Not Inspect: URL Category = Miscellaneous": under transparent forwarding this can over-exempt via IP-category matching (most public IPs default to Miscellaneous); under explicit forwarding it affects only actual unknown SNIs. See `references/zia/ssl-inspection.md § Transparent vs explicit traffic forwarding — what the SSL rule matches on` for the established mechanics. Whether this is observable as a "same-user-different-session" artifact is still a lab/operator question.

---

### zia-12 — SSL bypass interaction with URL filtering default rule

*Origin: `references/zia/ssl-inspection.md` § Open questions*

When an SSL rule fires with "Do Not Inspect + Evaluate Other Policies" and traffic proceeds to URL filtering, if no explicit URL filtering rule matches, does the URL filtering default terminal rule still fire? The docs describe the two-variant behavior (Evaluate vs Bypass) but don't explicitly say whether the implicit URL-filtering default counts as "a rule" for the Evaluate path. This matters for tenants relying on a default-Block URL filtering stance to catch anything that slipped past explicit rules on non-inspected traffic.

**Resolves with**: lab test. **Status**: open. **Low priority** — most deployments use default-Allow URL filtering, making this a corner case.

---

### zia-14 — Leading-period wildcard at exactly 5 subdomain levels

*Origin: `references/zia/wildcard-semantics.md` § Worked example*

The *URL Format Guidelines* article says the leading-period wildcard applies "up to 5 subdomain levels deep." Whether a request at exactly 5 subdomain levels (e.g., `serv3.serv2.serv1.atlanta.safemarch.com`, which the article explicitly lists as matching `.safemarch.com`) is inclusive of level 5 or whether 5 is the exclusive cap isn't explicitly stated. The example uses 4 subdomain labels (`serv3.serv2.serv1.atlanta.safemarch.com` is 4 extra segments before `safemarch.com`).

**Resolves with**: lab test. **Status**: open. **Low priority** — 5-level-deep subdomain patterns are uncommon in practice.

---

### zia-15 — Console accepts asterisk despite docs marking it invalid

*Origin: `references/zia/wildcard-semantics.md` § Asterisk is not a valid wildcard character*

The *URL Format Guidelines* article states unambiguously that `*.safemarch.com` and `*safemarch.com` are "not permitted". Operator report (2026-04-23) contradicts this: the ZIA admin console does accept `*` in URL entries at save time without rejecting the input. What's ambiguous:

- Whether the console silently rewrites the entry to the leading-period form under the hood.
- Whether it stores the asterisk literally and treats it as a no-op character (so `*.example.com` matches nothing, or only `example.com` if the `*` and `.` are stripped).
- Whether it's accepted at save time but then fails a downstream validation before becoming effective.
- Whether the docs are stale and asterisk wildcards actually function the way operators intuitively expect.

**Why it matters**: a tenant that has `*.example.com` entries in custom URL categories today may think they're wildcarding subdomains when in fact nothing is being matched. A snapshot-driven lookup that trusts the docs will give a confidently wrong answer.

**Resolves with**: lab test (enter `*.example.com`, re-read via API, observe what's stored; then test matching against `example.com` and `www.example.com`) OR support ticket. **Status**: open.

---

### zia-13 — Explicit pipeline-order sourcing

*Origin: `references/zia/ssl-inspection.md` § Mechanics*

Our three drafts asserted the pipeline is SSL Inspection → URL Filtering → Cloud App Control. No single vendored source stated the full ordering explicitly.

**Status**: resolved (2026-04-23).

**Answer** (from *Understanding Policy Enforcement*, `vendor/zscaler-help/Understanding_Policy_Enforcement.pdf`, pp.1–13; canonical URL https://help.zscaler.com/zia/about-policy-enforcement):

The actual flow is more nuanced than the simpler SSL→URL→CAC framing:

1. **Firewall module always evaluates first.** For outbound web traffic, firewall policy runs before the web module sees the transaction. Example from the doc: firewall allows Box.net + web module blocks Box.net → traffic is blocked. Firewall "allow" does not supersede web block; both must pass.
2. **Web module evaluation depends on traffic type and SSL state.** For HTTPS traffic there are **two passes**:
   - **CONNECT/SNI pass** (domain-only): URL Filtering + Cloud App Control + Advanced Threat Protection (known malicious URLs) + Bandwidth Control evaluate using only the destination domain. In explicit-proxy mode, this happens on the CONNECT request; in transparent mode, on the SNI.
   - **SSL Inspection policy decision**: evaluate whether to decrypt.
   - **Full-URL pass** (only if decrypted): the complete policy pipeline runs on the decrypted URL and body — see the 10-step GET order on p.3–5 of the Policy Enforcement doc (Custom Malicious URLs → Cloud App Control → URL Filtering → Security Exceptions → Browser Control → Country Blocking → IPS → Suspicious Content → P2P → Bandwidth).
3. **Per-method policy order differs.** HTTP POST adds Malware Protection, File Type Control, and DLP steps. HTTP GET/POST Response adds Sandbox, Malware, File Type Control, AI/ML Content Categorization.

This means URL Filtering and CAC effectively evaluate **twice** on inspected HTTPS traffic — once domain-only, once full-URL. The drafts' simpler "before/after" framing was roughly right but missed the two-pass nuance. Corrected in `ssl-inspection.md` Mechanics section.

---

### log-01 — NSS feed format versions

*Origin: `references/zia/logs/web-log-schema.md`, `firewall-log-schema.md`, `dns-log-schema.md`*

Zscaler publishes NSS output in multiple formats. Whether field presence and naming differ between them was unclear.

**Status**: partially resolved (2026-04-23).

**Answer**: From *General Guidelines for NSS Feeds and Feed Formats* (`vendor/zscaler-help/General_Guidelines_for_NSS_Feeds_and_Feed_Formats.pdf`) pp.1–4:

- Field names are the same across output types — the guidelines confirm a unified format-specifier system (`%s{}`, `%d{}`, `%x{}`) used across all output formats.
- The article lists **ten NSS feed types** (Web, Firewall, DNS, Tunnel, SaaS Security, SaaS Security Activity, Admin Audit, Endpoint DLP, Email DLP, Sandbox Verdict) but we've only vendored three of those field CSVs (Web, Firewall, DNS).
- Recommended ≤50 fields per feed due to syslog message size. If more, verify SIEM can ingest.
- Hex encoding: URL characters ≤ `0x20` or ≥ `0x7F` are encoded as `%HH`. Example: `\n` → `%0A`, space → `%20`.
- Cloud NSS + JSON output: use hex-encoded field variants (e.g., `%s{elogin}` instead of `%s{login}`) and set Feed Escape Character to `,\"` to avoid JSON parsing issues in the SIEM.
- Duplicate Logs setting: buffer replay window before detected-disconnect timestamp, configurable up to 60 minutes.

**Still open**: the article doesn't enumerate which fields differ between CSV/JSON/TSV output templates when the same field name is emitted in each. For our vendored CSVs, we've assumed field presence is identical across output formats — that's consistent with the Guidelines article but not literally stated. Low-priority open question.

---

### log-02 — Cloud NSS vs legacy NSS divergence

*Origin: `references/zia/logs/web-log-schema.md`*

Zscaler Cloud NSS (hosted) and legacy NSS (on-prem appliance) differ in field availability and timestamp behavior. Whether our SPL patterns need to branch on which one produced a record is unknown.

**Status**: partially resolved (2026-04-23).

**Answer**: Both variants source from the **same Nanolog storage**, which significantly reduces the risk of field-presence divergence. From *Understanding Nanolog Streaming Service (NSS)* (`vendor/zscaler-help/understanding-nanolog-streaming-service.md`):

- **VM-based NSS**: "The Nanolog then streams copies of the logs to each NSS in a highly compressed format... When an NSS receives the logs from the Nanolog, it decompresses and detokenizes them, applies the configured filters to exclude unwanted logs, converts the filtered logs to the configured output format so that they can be consumed and parsed by your SIEM, and then streams the logs to your SIEM over a raw TCP connection."
- **Cloud NSS**: HTTPS API feed push model. "You can create one Cloud NSS feed per ZIA log type per Cloud NSS instance. When configuring a Cloud NSS feed, you can customize the feed format; Zscaler recommends using JSON."

Since both decompress/detokenize the same Nanolog records, **field content is equivalent**. What differs is:

- **Transport**: raw TCP (VM) vs HTTPS POST batches (Cloud).
- **Feed-count limits**: up to 16 feeds per NSS server (Web & Firewall capped at 8 each) for VM; **one feed per ZIA log type per Cloud NSS instance** for Cloud.
- **Format recommendation**: customizable on both, but Zscaler recommends **JSON** for Cloud NSS; VM deployments commonly use the VM's configurable flat format.
- **Reliability model**: VM buffers logs in memory for resiliency + one-hour recovery from Nanolog; Cloud uses separate one-hour Nanolog replay capability.

**Implication for SPL patterns**: branching on *field presence* is unlikely needed (same Nanolog source). Branching by **format** (JSON-native vs custom-delimited TCP) is the realistic split — e.g., `spath` vs `rex` extraction upstream. A field-by-field diff test on a live tenant is the definitive way to confirm.

**Still open (minor)**: whether the format-conversion step on the VM side ever omits a field that appears in Cloud NSS's JSON output. Ordinary operator testing closes this.

---

### log-03 — Timestamp timezone handling

*Origin: `references/zia/logs/web-log-schema.md`*

`%s{tz}` is documented as the NSS feed's configured timezone, but the behavior when a tenant has multiple NSS feeds with different TZs, or when Cloud NSS aggregates from multiple regions, isn't stated.

**Resolves with**: lab test OR zscaler doc not yet read. **Status**: open. **Low priority** — most SPL patterns use `_time` which Splunk normalizes to UTC regardless.

---

### zpa-01 — Multi-segment match representation in LSS

*Origin: `references/zpa/logs/access-log-schema.md`*

When a ZPA client resolves to multiple application segments in sequence (e.g., failover, or a sequence of probes), how is that represented in LSS output? One record per segment, a single record with multiple segment IDs, or something else?

**Resolves with**: zscaler doc not yet read (Understanding User Activity Log Fields — now vendored at `vendor/zscaler-help/Understanding_User_Activity_Log_Fields.pdf`, so this is ready to resolve in the next derivation pass). **Status**: investigating (material available).

**Doc sweep 2026-04-23** (partial): Confirmed schema shape from *Understanding User Activity Log Fields* (`vendor/zscaler-help/Understanding_User_Activity_Log_Fields.pdf`). Key observations, not a full resolution:

- Fields like `Application`, `AppGroup`, `Policy`, `Server`, `ServerIP`, `ServerPort`, and timestamps are **singular per record** — no array-valued segment list. This makes "single record with multiple segment IDs" structurally unlikely.
- The example record in the doc's preamble shows `ConnectionID` as a **comma-concatenated pair** (e.g., `SqyZIMkg0JTj7EABsvwA,Q+EjXGdrvbF2lPiBbedm`) where the first part matches `SessionID` exactly. This hints that `ConnectionID` may encode `<SessionID>,<attempt-or-subconnection>` when a TLS session spans multiple ZPA connections — but the field description just says "The application connection ID" without elaboration.
- `SessionID` is documented as "The TLS session ID." So: multiple `ConnectionID` values under the same `SessionID` is plausibly how sequential connection attempts within a session are tied together.

**Most-defensible inference** (not yet confirmed by an unambiguous doc statement): multi-segment failover/probe sequences generate **one LSS record per segment attempt**, with records tied together by shared `SessionID` and distinguished by distinct `ConnectionID` suffixes. Correlation via `SessionID` would then group a multi-segment sequence back into a logical session.

Remains in Investigating until either (a) a doc explicitly states record granularity (check `Understanding User Status Log Fields`, or the LSS sections of NSS/LSS deployment docs), or (b) an operator confirms in practice.

---

### zpa-02 — ZPA "more granular" definition

*Origin: `references/zpa/app-segments.md` § Specificity-wins rule*

*Configuring Defined Application Segments* p.10 says Zscaler Client Connector "attempts to match traffic to the more granular application segment" when two segments cover the same destination. How "more granular" is computed wasn't stated.

**Status**: resolved (2026-04-23).

**Answer**: From *Understanding Application Access* (`vendor/zscaler-help/Understanding_Application_Access.pdf`) p.1 and *Using Application Segment Multimatch* (`vendor/zscaler-help/Using_Application_Segment_Multimatch.pdf`) p.9: "more granular" means **most-specific FQDN wins** among overlapping segments. The Multimatch article's Example 1 (p.9) shows the specificity stack explicitly: `server1.db.hr.company.com` > `*.db.hr.company.com` > `*.hr.company.com` > `*.company.com` > `*.com`. IP-subnet equivalent (p.10): `/32` host > `/24` subnet. Note the specificity comparison is strictly on the **domain/address** dimension; port-range narrowness does not enter the "granularity" judgment.

---

### zpa-03 — Multimatch mixed-style evaluation

*Origin: `references/zpa/app-segments.md` § Multimatch*

If two overlapping segments set different Multimatch styles on the same domain-set (one INCLUSIVE, one EXCLUSIVE), what happens?

**Status**: resolved (2026-04-23).

**Answer**: From *Using Application Segment Multimatch* (`vendor/zscaler-help/Using_Application_Segment_Multimatch.pdf`) p.1:

> Private Access (ZPA) evaluates Multimatch across all application segments that include the same applications. When an administrator enables or disables Multimatch for an application segment, Private Access checks all other application segments that contains any overlapping domains to determine whether the change is allowed. If a domain is found in multiple application segments with different Multimatch settings, there is a conflict and the application segment cannot be updated.

So the config is **rejected at update time**; you cannot get into a mixed-style state. Mixed styles are validated at modification time, not silently reconciled at traffic time.

---

### zpa-04 — Same-FQDN same-Bypass tie-break

*Origin: `references/zpa/app-segments.md` § Bypass precedence*

*Configuring Defined Application Segments* p.12 states that if the same FQDN is in multiple segments and one has `Bypass = Always`, that segment wins. But: if *two* segments both have `Bypass = Always` for the same FQDN, or both have `Bypass = On Corporate Network`, which one is selected? Presumably the most-granular-wins rule resumes, but not stated explicitly.

**Resolves with**: lab test. **Status**: open. **Low priority** — uncommon configuration.

---

### zpa-05 — "No match in segment" criteria

*Origin: `references/zpa/app-segments.md` § Specificity-wins rule*

What does "no match in this application segment" mean precisely — port mismatch, protocol mismatch, segment disabled, server group unavailable, or App Connector health failure?

**Status**: resolved (2026-04-23).

**Answer**: From *Understanding Application Access* (`vendor/zscaler-help/Understanding_Application_Access.pdf`) p.1, the "no match" case is specifically the **destination port** not being configured in the selected (most-granular) segment:

> If two or more application segments cover the same destination address, Zscaler Client Connector attempts to match traffic to the more granular application segment. If there is no match in this application segment for the destination port, Zscaler Client Connector bypasses ZPA and sends traffic directly.

Worked example from that same page: Segment 1 = `*.example.com` TCP 1-65535; Segment 2 = `www.example.com` TCP 8843. User requests `www.example.com:80` → matches Segment 2 (more specific FQDN), but port 80 is not in Segment 2's port list → traffic is dropped. *Not* fallback to Segment 1.

Additionally, *Using Application Segment Multimatch* (p.7, p.13) confirms: "Traffic that is dropped at the client level means that traffic matches the hostname, but it does not match the protocol and port. In this condition, traffic is not sent to the cloud for further processing. This means that policy evaluation does not occur, and the user is not able to access the application segment. In this case, traffic is not visible in the Private Access diagnostics."

Note: other failure modes (segment disabled, server group unavailable, connector health failure) are **not** the "no match" case — they would fail downstream of segment selection. The "no match → direct bypass" behavior is specifically port-mismatch.

---

### zpa-06 — Require Approval action semantics

*Origin: `references/zpa/policy-precedence.md` § Rule actions*

*About Access Policy* p.6 lists "Require Approval" as one of three rule actions (Allow Access, Block Access, Require Approval). What does it do?

**Status**: resolved (2026-04-23).

**Answer**: From *Configuring Access Policies* (`vendor/zscaler-help/Configuring_Access_Policies.pdf`) p.3 and *Understanding Step-Up Authentication* (`vendor/zscaler-help/understanding-step-up-authentication.md`):

The rule action is actually called **Conditional Access** in the Configuring Access Policies doc. "Require Approval" in About Access Policy is informal terminology for the same thing. Mechanics:

- **Conditional Access** rule action invokes step-up authentication via **ZIdentity**. Requires a ZIdentity subscription.
- Step-up authentication uses **Authentication Levels (AL1 to AL4)**, hierarchical where higher = stronger assurance.
- Flow: user logs in at standard level → attempts access to a Conditional-Access-gated application → ZIdentity checks required level → if insufficient, prompts for reauthentication (typically MFA via Zscaler Client Connector) → on success, access granted.
- **Supported only with OIDC-based external IdP integrations.**
- End-user UX: per *Verifying Access to Applications* (`vendor/zscaler-help/verifying-access-to-applications.md`), user sees a "pending verification" status in Zscaler Client Connector and clicks "Verify Now" to complete the step-up. Requires Client Connector v4.6+ (Windows, ZPA only), v4.7+ (Windows ZIA / macOS both).
- Separate **"Allow with Privileged Approval"** checkbox exists on Allow-action rules for Privileged Remote Access-enabled application segments — different feature, distinct from Conditional Access step-up.

So: "Require Approval" = "Conditional Access" = ZIdentity step-up authentication. Three names for the same behavior. "Allow with Privileged Approval" is a separate PRA-specific capability.

---

### zpa-07 — Deception policy order interaction

*Origin: `references/zpa/policy-precedence.md` § Order and editing constraints*

*About Access Policy* p.6 states: regular access policies must have rule order greater than Deception-configured policies; Deception-configured rules cannot be copied/edited/deleted normally. The doc doesn't explain *what* a Deception access policy is, how it evaluates, or what threat model it addresses.

**Resolves with**: zscaler doc not yet read (Zscaler Deception module docs). **Status**: open. **Low priority** unless we're authoring deception-specific content.

---

### zpa-08 — "When both FQDNs are equal" interpretation

*Origin: `references/zpa/policy-precedence.md` § Specificity-vs-top-down quirk*

*Access Policy Deployment and Operations Guide* pp.2–3 states: "When both FQDNs are equal, ZPA performs a top-down ranking approach. So, if rule 1 is `*.specific.web.com` and rule 2 is `specific.web.com`, then rule 1 would apply, because it's processed first."

**Status**: clarified by *About Policies* / Policy Evaluation Order section (2026-04-23), though the Deployment Guide's example remains oddly phrased.

**Answer**: *About Policies* (`vendor/zscaler-help/About_Policies.pdf`) p.2 is the authoritative statement. The "Policy Evaluation Order" section:

> Private Access evaluates policy rules using the most specific application segment and a top-down, first-match principle. For example, when a user requests a specific application, Private Access starts evaluating all of your configured policies, starting with the first rule in a set of policy rules. As soon as it finds a policy that matches the criteria that was specified in a rule, it enforces that policy rule and disregards all other rules that follow, including any potentially conflicting rules.

The "Conflicting Access Policy Rules" examples (pp.3–6) confirm: **when rules overlap (either by broad segment match or by group membership), the first rule in order that matches the user's criteria fires — other rules are never evaluated.** This is the same first-match model as ZIA URL filtering.

Reading back into the Deployment Guide's oddly-worded example: the most defensible interpretation is that "when both FQDNs are equal" informally means "when both rules' criteria would match the same request" — i.e., when specificity doesn't uniquely disambiguate, rule order decides. The doc's example is imprecise language for a correct concept.

**Still open (minor)**: whether `*.specific.web.com` can match the bare `specific.web.com` as a wildcard edge-case. Lab test if it matters for a specific tenant.

There is no standalone "Policy Evaluation Order" article — the content lives as a section within *About Policies*.

---

### shared-06 — ZPA disabled-rule semantics

*Origin: `references/shared/policy-evaluation.md` § Shared patterns*

ZIA explicitly documents that a disabled URL filtering rule retains its order position and is simply skipped during evaluation (*Configuring the URL Filtering Policy* p.3). No equivalent statement is made in the vendored ZPA access-policy material. Whether a disabled ZPA rule behaves the same (skip-in-place) or differently (removed from the evaluation list entirely) is not stated.

**Resolves with**: lab test OR zscaler doc not yet read (likely "Configuring Access Policies"). **Status**: open. **Low priority** — behavior is almost certainly parity with ZIA.

---

### shared-01 — SPL index naming portability

*Origin: `references/shared/splunk-queries.md`*

Our SPL patterns parameterize on `$INDEX_ZIA_WEB` / `$INDEX_ZPA` etc. Where those values come from in practice — env var, config file, pulled from snapshot metadata — is undecided. Affects how we make SPL patterns tenant-portable when index naming varies between customers.

**Resolves with**: design decision. **Status**: open.

---

### shared-02 — Log-query latency budget

*Origin: `references/shared/log-correlation.md`*

We've said logs are a "validation layer" but haven't set an SLO: at what point does a log query get too slow to be worth waiting for (vs. replying "config says X, can validate on request")? Affects when the skill auto-queries vs. defers.

**Resolves with**: design decision AND operator experience. **Status**: open.

---

### shared-03 — Script language choice for tenant-data tooling

*Origin: earlier scaffold discussion; referenced in `scripts/snapshot-refresh.py`, `scripts/url-lookup.py`, `scripts/splunk-query.sh`*

Real implementations of the refresh / lookup / splunk-query scripts would need auth, pagination, retry. Bash + curl vs Python + SDK was undecided during scaffolding.

**Status**: resolved (2026-04-23).

**Answer**: Python via `uv run --script` shebang, using the vendored `zscaler-sdk-python`. Implemented:

- `scripts/url-lookup.py` — mirrors the `investigate-url` workflow from `vendor/zscaler-mcp-server/commands/investigate-url.md`.
- `scripts/snapshot-refresh.py` — dumps ZIA + ZPA config to `snapshot/<product>/*.json` with `--zia-only` / `--zpa-only` flags and a `_manifest.json`.
- `scripts/splunk-query.sh` — kept as bash stub (Splunk SDK is Python but the Splunk path is not the critical one and the bash stub matches the legacy pattern).

---

### shared-04 — Snapshot auth pattern

*Origin: `scripts/snapshot-refresh.py` header comments*

Where credentials come from when running the refresh scripts — env vars, `.env` file, `op read` (1Password CLI), cloud secrets manager — is undecided. Shapes `.gitignore`, script structure, and onboarding docs.

**Resolves with**: design decision. **Status**: open.

---

### shared-05 — Snapshot format

*Origin: scaffold discussion; `references/zia/api.md`*

Raw JSON dumps from the API are cheap to produce and `jq`-friendly but noisy for model consumption. Paraphrased-to-markdown is model-friendly but goes stale and adds a transformation step. Decide before the first real refresh script ships.

**Resolves with**: design decision. **Status**: open. **Preference note**: JSON for v1, document a post-processing paraphrase step for later.

---

### log-04 — MP/ATP blocked-policy-type log field

*Origin: `references/zia/malware-and-atp.md` § Console-only diagnosis workflow*

Malware Protection and Advanced Threat Protection blocks have no public API surface. Diagnosis relies on Web Insights log fields indicating which policy module fired. The operator flow (Security Dashboard → Web Insights → `Blocked Policy Type`) is documented, but:

- The exact NSS/Cloud-NSS field name (`blockedpolicytype`, `blocked_policy_type`, `policytype`, etc.) is unverified.
- The enum values distinguishing MP vs ATP (and their sub-categories — "Ransomware", "Phishing", "Botnet", etc.) are unverified.
- Whether MP category vs ATP category lands in the same field or separate fields is unverified.

**Resolves with**: tenant snapshot (a real Web Insights export) OR the NSS output format CSV for web logs, which is referenced in `references/zia/logs/web-log-schema.md`. **Status**: open.

A first fork-admin Web Insights export for any known MP or ATP block will answer this in one pass.

---

### zcc-01 — ForwardingProfile `condition_type` enum

*Origin: `references/zcc/forwarding-profile.md` § Trusted-network evaluation*

The `condition_type` field on a `ForwardingProfile` controls how inline trusted-criteria, referenced TrustedNetworks, and the predefined set combine (AND across all of them? OR? some hybrid?). The SDK passes the value through without validation, so valid values aren't enumerated in source.

**Resolves with**: lab test (configure a profile with two criteria; toggle `condition_type` between plausible values; observe whether both-required vs any-required changes) OR zscaler doc not yet read (`help.zscaler.com` ZCC configuration articles). **Status**: open.

Candidate values: `TRUSTED_CRITERIA_AND`, `TRUSTED_CRITERIA_OR`, or plain `AND`/`OR`.

---

### zcc-02 — ForwardingProfile actions `network_type` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

Each item in `forwardingProfileActions` is keyed by `networkType` specifying which network-classification branch it applies to. Likely `TRUSTED` / `UNTRUSTED` at minimum; possibly additional tiers for VPN-trusted, captive-portal-detected, or similar states. The SDK does not enumerate valid values.

**Resolves with**: tenant snapshot of a tenant with multiple branches OR lab test. **Status**: open.

---

### zcc-03 — ForwardingProfile `action_type` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

The `actionType` field on each network-type action block decides what happens to traffic in that branch. Informed guesses based on ZCC behaviors: `NONE` (direct, bypass ZIA), `TUNNEL` / `ENFORCE_POLICIES` (send via Z-Tunnel), `PAC` (honor PAC), possibly `VPN` / `TUNNEL_WITH_LOCAL_PROXY`. The SDK does not enumerate.

**Resolves with**: tenant snapshot covering multiple profile variants OR zscaler doc not yet read. **Status**: open.

---

### zcc-04 — ForwardingProfile `primary_transport` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

The `primaryTransport` field on both ZIA and ZPA actions specifies the transport protocol preference. Likely values: `ZTUNNEL` (Z-Tunnel 2.0 proprietary), `DTLS`, `TLS`. Exact enum not documented.

**Resolves with**: tenant snapshot OR zscaler doc. **Status**: open.

---

### zcc-05 — `systemProxyData` vs native forwarding action precedence

*Origin: `references/zcc/forwarding-profile.md` § Edge cases*

When a forwarding-profile action has `systemProxy=true` with `systemProxyData` specifying a PAC URL or proxy server, and it also specifies `actionType` (e.g. TUNNEL), how does ZCC decide which to honor? In particular: does the system-proxy PAC evaluate before the Z-Tunnel action, or does it only apply when `actionType` is `PAC`-equivalent?

**Resolves with**: lab test OR zscaler doc. **Status**: partially resolved (2026-04-24).

**Partial answer (2026-04-24)**: The *Best Practices for Adding Bypasses for Z-Tunnel 2.0* help article (`vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md`) documents two 3.8+ Windows flags — `Redirect Web Traffic to Zscaler Client Connector Listening Proxy` and `Use Z-Tunnel 2.0 for Proxied Web Traffic` — as the officially-supported way to combine system-proxy-style routing with Z-Tunnel 2.0. The truth table for their interaction is captured in [`../zcc/z-tunnel.md § Domain-based bypasses`](../zcc/z-tunnel.md). SDK fields: `redirect_web_traffic` and `use_tunnel2_for_proxied_web_traffic` on `ForwardingProfileActions`.

Key interaction surfaced by the article: `Use Z-Tunnel 2.0 for Proxied Web Traffic` applies **only to the default return statement in the App Profile PAC**. Traffic matching a specific PAC statement that routes to a particular Service Edge silently uses Z-Tunnel 1.0, regardless of the flag state.

**Remaining gap**: behavior when `systemProxyData` (OS-level proxy settings) is populated AND an `actionType` is set that conflicts with it — e.g., does a system PAC URL override a Tunnel action, or vice versa? Needs lab confirmation on a real tenant.

---

### zcc-06 — TrustedNetwork `condition_type` enum

*Origin: `references/zcc/trusted-networks.md` § `condition_type`*

Parallel to `zcc-01` but at the TrustedNetwork entity level: how do this TrustedNetwork's own criteria (DNS servers, SSIDs, etc.) combine — AND (all required) or OR (any suffices)? SDK does not enumerate.

**Resolves with**: lab test with two obvious criteria (one correct, one incorrect) toggling `condition_type`. **Status**: open.

---

### zcc-07 — Forwarding-profile assignment to users/devices

*Origin: `references/zcc/api.md` § Open questions*

The SDK's `client.zcc.forwarding_profile` surface exposes CRUD on profile objects but no method for associating a profile with a user, group, or device. ZCC admin UX offers "App Profiles" that select a forwarding profile — but the App Profile API is not exposed under `client.zcc` in the current SDK. How does assignment happen programmatically?

**Resolves with**: partial answer from SDK mining (see below). Full completeness: lab confirmation on a real tenant that WebPolicy is the sole assignment mechanism. **Status**: partially resolved (2026-04-24).

**Partial answer (2026-04-24, revised same-day after help-doc capture)**:

From `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md` (Zscaler help "About Zscaler Client Connector App Profiles"), the admin-portal object is called an **App Profile**, and one of its first-class functions is: *"Select the forwarding profile for Zscaler Internet Access (ZIA) and Zscaler Private Access (ZPA) services."* App Profiles also carry: policy rule order, scope (all users vs groups), uninstall/disable/logout password gates, SSL cert installation, log generation settings, and a **default policy** (the fallback when no user-matching rule fires).

Mapping to SDK:

- The SDK's `WebPolicy` (`zscaler/zcc/models/webpolicy.py`) has the matching shape: `forwarding_profile_id` field, `rule_order`, scope (`user_ids` / `group_ids` / `device_group_ids`), per-platform sub-policies (Windows / macOS / Linux / iOS / Android), uninstall password gates, `install_ssl_certs`, log settings. The endpoint path — `/zcc/papi/public/v1/webPolicy/...` — uses `webPolicy` on the wire even though the UI calls them "App Profiles."
- **Most likely App Profile in UI == WebPolicy in SDK.** The `web`-prefix naming is a wire/API historical artifact; marketing renamed to "App Profile" after the SDK was written.

Two first-pass-tenant-resolvable sub-questions remain:

1. Confirm the name equivalence by comparing `WebPolicy` snapshot output against an App Profile as displayed in the portal.
2. Identify where the App Profile "default policy" (from the help doc) lives at the API level. Candidates: a WebPolicy flagged as default, a separate tenant-level fallback setting, or the terminal-position Web Policy in `rule_order`.

Also discovered in the help-doc capture: App Profiles carry **per-app bypass lists** (process-based and IP-based) — fields that correspond to the SDK's `WebPolicy.bypass_app_ids` / `bypass_custom_app_ids`. This is the "application bypass" feature (see `about-application-bypass` in the Related Articles list) — a user-noticeable behavior where ZCC skips interception for specific apps. Deserves its own reference doc eventually; not yet written.

**Status updated from "the SDK doesn't expose assignment" to "assignment is in WebPolicy, which is called App Profile in the portal."**

---

## Resolved entries

See the **Status summary** near the top of this file for the list. Entries stay in their original positions above with `Status: resolved` and the answer inline, so anchor links (`../_clarifications.md#zia-03` etc.) resolve regardless of resolution state.
