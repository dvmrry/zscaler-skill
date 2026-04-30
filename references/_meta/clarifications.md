---
product: meta
topic: "clarifications-index"
title: "Clarification index — open questions across references"
content-type: reference
last-verified: "2026-04-24"
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

## Entry shape

Each entry follows this template. Body is narrative — the existing zia-01 entry is a good model.

```
### <area>-<num> — <short title>

*Origin: `references/<path>.md` § Open questions*

<one-paragraph statement of the question>

**Status**: <open | investigating | resolved | wontfix> [— last updated YYYY-MM-DD]
**Resolves with**: <evidence type from the list above>
**Blocks**: <what's blocked or unknowable until resolved> [optional]

[Body — what's been established, sources checked, partial findings, prior sweeps]

[For resolved: **Answer**: paragraph with sources cited]
```

## Workflow for adding a new entry

1. Writing a reference doc, you hit a question the sources don't answer.
2. Add it to your doc's **Open questions** section with a one-line summary.
3. Add the full entry here with a new stable ID, following the entry template above.
4. Link both ways:
   - Your doc: `See [clarification zia-07](.clarifications.md#zia-07).`
   - This file: `*Origin: references/<product>/<topic>.md § Open questions*` (placeholder path — substitute the real one)
5. **When resolving**: fold the answer into the relevant reference doc body (that's where it's useful), update the doc's `last-verified` date, then delete the entry from this register. Git history preserves it.
   - **Grandfather rule**: existing pre-2026-04-27 resolved entries (`zia-01`, `zia-03`, `zia-05`–`zia-07`, `zia-10`, `zia-13`, `zpa-02`, `zpa-03`, `zpa-05`–`zpa-08`, `shared-01`–`shared-05`) stay where they are; this policy applies to entries resolved on or after 2026-04-27.

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
| [`shared-01`](#shared-01-spl-index-naming-portability) | SPL index names come from env vars (`SPLUNK_INDEX_*`) |
| [`shared-02`](#shared-02-log-query-latency-budget) | Skill never auto-queries — always emits SPL for operator to run |
| [`shared-03`](#shared-03-script-language-choice-for-tenant-data-tooling) | Scripts implemented as Python via `uv run` |
| [`shared-04`](#shared-04-snapshot-auth-pattern) | Credentials via env vars; no `.env` convention |
| [`shared-05`](#shared-05-snapshot-format) | Raw JSON per resource; no paraphrasing |
| [`zpa-07`](#zpa-07-deception-policy-order-interaction) | Deception = separate Zscaler product; rules must fire before normal access rules to intercept attacker traffic to decoys |
| [`zpa-15`](#zpa-15-machine-groups-file-path-correction) | Machine groups misclassified as ZIA in coverage audit — file moved to `references/zpa/machine-groups.md` |

### Partially resolved

| ID | Title | What's still open |
|---|---|---|
| [`zia-04`](#zia-04-nrod-propagation-lag) | NROD propagation lag | Documented as "within hours of going live" — upper-bound precision unstated |
| [`zia-08`](#zia-08-cac-tenant-restrictions-mechanics) | CAC tenant restrictions mechanics | Supported apps + SSL-Inspection-required mechanic doc'd; per-app token-field inspection details in per-app config articles not yet vendored |
| [`zia-09`](#zia-09-cac-app-identity-when-url-maps-to-multiple-apps) | CAC app-identity when URL maps to multiple apps | URL-Lookup API is the mapping surface; internal URL-to-app resolution logic still undocumented |
| [`zia-11`](#zia-11-transparent-vs-explicit-forwarding-mixed-mode) | Transparent vs explicit forwarding mixed mode | Silent per-session drift for tenants not gating rules by Device/Location Group |
| [`log-01`](#log-01-nss-feed-format-versions) | NSS feed format versions | Exact field-presence differences between CSV/JSON/TSV output templates |
| [`log-02`](#log-02-cloud-nss-vs-legacy-nss-divergence) | Cloud NSS vs legacy NSS divergence | Both source from the same Nanolog — field content parity expected; branching most likely needed for format (Cloud NSS recommends JSON) and per-instance feed-count limits, not field presence |

### Open

`zia-02`, `zia-12`, `zia-14`, `zia-15`, `zia-16`–`zia-45`, `zpa-01`, `zpa-04`, `zpa-09`, `zpa-10`, `zpa-11`–`zpa-14`, `log-03`, `shared-06`, `shared-07`–`shared-16`, `zcc-08`–`zcc-75`.

Partial / SDK-mined (resolved via code read or help-doc capture; full lab confirmation pending): `zcc-01`, `zcc-02`, `zcc-03`, `zcc-04`, `zcc-05`, `zcc-06`, `zcc-07`, **`log-04`** (field name + illustrative values confirmed via `web-log-schema.md`; full enum of `ruletype` / `reason` values still needs a tenant export). All six ZCC enum clarifications had their **datatype** (int vs string) resolved by the Go SDK cross-check on 2026-04-24; the integer-to-meaning mapping remains open for `zcc-01` through `zcc-04` and `zcc-06`.

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

**Resolves with**: operator experience OR lab test. **Status**: open — 2026-04-28.

**Doc sweep 2026-04-23** (partial): Confirmed schema shape from *Understanding User Activity Log Fields* (`vendor/zscaler-help/Understanding_User_Activity_Log_Fields.pdf`). Key observations:

- Fields like `Application`, `AppGroup`, `Policy`, `Server`, `ServerIP`, `ServerPort`, and timestamps are **singular per record** — no array-valued segment list. This makes "single record with multiple segment IDs" structurally unlikely.
- The example record in the doc's preamble shows `ConnectionID` as a **comma-concatenated pair** (e.g., `SqyZIMkg0JTj7EABsvwA,Q+EjXGdrvbF2lPiBbedm`) where the first part matches `SessionID` exactly. This hints that `ConnectionID` may encode `<SessionID>,<attempt-or-subconnection>` when a TLS session spans multiple ZPA connections — but the field description just says "The application connection ID" without elaboration.
- `SessionID` is documented as "The TLS session ID." So: multiple `ConnectionID` values under the same `SessionID` is plausibly how sequential connection attempts within a session are tied together.

**Doc sweep 2026-04-28**: Reviewed *Understanding User Status Log Fields* PDF, *Understanding the Log Stream Content Format* PDF, and `about-log-streaming-service.md`. None contain an explicit statement about record granularity for multi-segment failover sequences. Available vendored material is exhausted on this question.

**Most-defensible inference** (not yet confirmed by an unambiguous doc statement): multi-segment failover/probe sequences generate **one LSS record per segment attempt**, with records tied together by shared `SessionID` and distinguished by distinct `ConnectionID` suffixes. Correlation via `SessionID` would then group a multi-segment sequence back into a logical session. Requires operator confirmation on a real tenant.

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

**Status**: resolved (2026-04-24).

**Answer**: Captured three Zscaler Deception help articles (`vendor/zscaler-help/what-is-zscaler-deception.md`, `about-deception-strategy.md`, `about-zpa-app-connectors-deception.md`).

**What Deception is** — a separate Zscaler product for active-defense threat detection. It deploys realistic **decoys** (fake IT assets — servers, apps, Active Directory objects, endpoints, cloud resources) across the environment. Because no legitimate business traffic should ever touch a decoy, any interaction with one is a high-confidence signal of an ongoing breach. Designed to catch threats that bypass traditional defenses — APTs, ransomware, lateral movement, reconnaissance, supply-chain attacks, SCADA/ICS attacks.

**What a Deception access policy is** — when a tenant integrates Deception with ZPA to deploy **Zero Trust Network (ZTN) decoys**, Deception creates access-policy rules inside ZPA that route attacker traffic to the decoy infrastructure via ZPA App Connectors (hosted by Zscaler, managed from the Deception Admin Portal). These rules are the mechanism Deception uses to intercept attacker traffic without requiring changes to network topology.

**Why they must evaluate first** — ZPA is first-match-wins. If a regular access rule matched attacker traffic first (granting or denying access to a real resource), the decoy would never get the connection, defeating the detection. Ordering Deception rules ahead ensures decoy traffic is captured before normal rules fire.

**Why they can't be copied/edited/deleted normally** — the rules are managed by the Deception Admin Portal as a separate product surface, not by ZPA admins. Editing them from the ZPA console would desynchronize Deception's view of what decoys exist, break the coordinated alert-and-orchestration flow, and let an attacker see changes in the real ZPA admin audit log rather than trigger a silent Deception alert.

**Threat model** — advanced threats that bypass perimeter defenses and reach lateral-movement / discovery phases. Deception provides high-fidelity detection specifically for the inside-the-network phase where traditional policy enforcement has already failed. The ordering constraint exists to preserve detection integrity; it is not a general policy-evaluation feature.

**Operational implication for ZPA admins** — don't try to manage Deception rules via the ZPA policy API or Terraform. Treat them as read-only markers showing "something is running in front of my policy chain." If the Deception product is not licensed, these rules don't exist. See `references/zpa/policy-precedence.md § Order and editing constraints` for the cross-link.

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

**Status**: resolved (2026-04-24).

**Answer**: **Environment variables**, same mechanism as `ZSCALER_*` credentials (see `shared-04`). The operator sets `SPLUNK_INDEX_ZIA_WEB`, `SPLUNK_INDEX_ZIA_FW`, `SPLUNK_INDEX_ZIA_DNS`, `SPLUNK_INDEX_ZPA` (and any others their SIEM uses) in the shell or via a secrets manager; `scripts/splunk-query.sh` substitutes these into pattern templates at run time.

Rationale:

- **Consistency with credential pattern** — operators already have a shell context populated with `ZSCALER_*` vars; SIEM index names fit the same mental model.
- **No config-file convention invented** — avoids a new `.spl-config.toml`-style file that would sit awkwardly next to the env-var-driven SDK scripts.
- **Snapshot metadata is the wrong source** — snapshot captures Zscaler config, not SIEM config. Splunk index naming is external to Zscaler and can't be inferred from tenant dumps.
- **Defaults in `splunk-queries.md`** — the reference doc shows patterns using the `zscaler_*` naming that is conventional out of the box from Zscaler's Splunk-TA; operators with non-default naming override per-pattern via env var.

Threaded into `scripts/splunk-query.sh` header (documents the 4 env vars) and `references/shared/splunk-queries.md` (§ "Tenant-portable index naming" callout).

---

### shared-02 — Log-query latency budget

*Origin: `references/shared/log-correlation.md`*

We've said logs are a "validation layer" but haven't set an SLO: at what point does a log query get too slow to be worth waiting for (vs. replying "config says X, can validate on request")? Affects when the skill auto-queries vs. defers.

**Status**: resolved (2026-04-24).

**Answer**: **The skill does not auto-query logs.** All log-validation is an explicit operator action, surfaced as a ready-to-run SPL snippet the user can paste. The skill's default loop is:

1. Answer the question from `references/` + `snapshot/` (config-derived reasoning).
2. Note where logs would validate or contradict the config-level answer, and emit the SPL query that would do so.
3. Only if the user explicitly asks ("run it", "what do the logs show?") does a script invocation happen — and even then it's the operator running `scripts/splunk-query.sh`, not the skill auto-executing.

Rationale:

- **Skills are document-only** — `SKILL.md` plus `references/` plus snapshot-JSON read. Script execution is an operator/agent-harness concern, not the skill's.
- **Log-query latency varies wildly** — from seconds (recent narrow-window Splunk search on a hot index) to minutes (broad time range, cold storage). Setting a universal SLO pins the wrong constraint.
- **Config-first answers degrade gracefully** — config reasoning is deterministic and fast; log-validation is the "verify" step, and operators can decide whether they want it based on the question's stakes.
- **Pre-emptive log queries waste tenant query budget** — Splunk license / query quota is finite. The skill should never spend those cycles uninvited.

Affects: `scripts/splunk-query.sh` is run-on-request by the operator; the skill's job is to produce the right SPL, not to run it. Threaded into `references/shared/log-correlation.md` § "When the skill recommends a log query vs answers from config".

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

**Status**: resolved (2026-04-24).

**Answer**: **Environment variables**, read directly by the SDK's default constructor. The fork-admin onboarding walkthrough in `README.md § 4. Set up ZIA + ZPA credentials` is the canonical path: `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY` for JWT), `ZSCALER_VANITY_DOMAIN`, optional `ZSCALER_CLOUD`. Legacy tenants use `ZSCALER_USE_LEGACY=true` plus product-specific vars documented in `vendor/zscaler-sdk-python/README.md § Legacy API Framework`.

Rationale for env vars over alternatives:

- **No `.env` file** committed — the skill is designed for private forks, and the repo's `.gitignore` doesn't model a `.env` convention. Operators who prefer `.env` can layer one via `direnv`, `dotenv`, or a shell-rc source — none of the scripts block this.
- **No bundled secrets-manager integration** — 1Password (`op read "op://..."`), Vault, AWS Secrets Manager, etc. are fine upstream of the shell. The scripts only consume env vars; how those get populated is the operator's choice. Example pattern for a fork: `eval "$(op read 'op://private/zscaler/.envrc')" && ./scripts/snapshot-refresh.py`.
- **Env vars are what the SDK already expects** — the `zscaler-sdk-python` OneAPI path reads these by default. Forcing a custom config layer would duplicate SDK conventions.

Affects: `.gitignore` correctly excludes `snapshot/`, `logs/`, and local-scratch paths but not `.env` (no `.env` is ever created by the skill). Script headers document the 4 required env vars in block comments. No onboarding-doc change needed beyond what's already in README step 4.

---

### shared-05 — Snapshot format

*Origin: scaffold discussion; `references/zia/api.md`*

Raw JSON dumps from the API are cheap to produce and `jq`-friendly but noisy for model consumption. Paraphrased-to-markdown is model-friendly but goes stale and adds a transformation step. Decide before the first real refresh script ships.

**Status**: resolved (2026-04-24).

**Answer**: **Raw JSON** as shipped by `snapshot-refresh.py` today — one file per resource under `snapshot/<product>/<resource>.json`, plus a `_manifest.json` capturing timestamp + per-resource counts. Wire format (camelCase for ZIA, mixed for ZPA) is preserved as-is; no paraphrasing pass.

Rationale:

- **Faithfulness over friendliness.** Paraphrased markdown risks going stale against API changes or drifting from the SDK's model. Raw JSON is source-of-truth; any transformation is downstream.
- **`jq`-first access.** Skill answers that need tenant data read JSON directly (`jq '.[] | select(.name == "X")' snapshot/zia/url-categories.json`) or via small Python helpers in the scripts. Claude handles JSON well enough that noisy fields aren't a blocker.
- **Model consumption concerns are real but bounded.** The scripts are selective — `url-lookup.py` extracts only the fields relevant to the question, doesn't pass the full JSON blob to the model. Reasoning docs under `references/` carry the narrative; snapshot answers "what does this tenant actually have configured" in raw form.
- **Deferred `snapshot-schema.md` docs** are the answer to "noisy for model consumption" — once the first fork-admin run produces real output, write camelCase-key tables and jq cheatsheets per-product (tracked in PLAN.md § 4).

A paraphrased-markdown post-processing step remains an option for the future if a fork team wants it, but no current skill answer requires one.

---

### log-04 — MP/ATP blocked-policy-type log field

*Origin: `references/zia/malware-and-atp.md` § Console-only diagnosis workflow*

Malware Protection and Advanced Threat Protection blocks have no public API surface. Diagnosis relies on Web Insights log fields indicating which policy module fired.

**Status**: partially resolved (2026-04-24).

**Answer (partial)**: `references/zia/logs/web-log-schema.md` (derived from Zscaler's NSS web-log CSV reference) documents the Block-only field set:

- **`%s{ruletype}`** — the field name on the wire. Insights column name: `Blocked Policy Type`. Example values from the schema: `File Type Control`, `Data Loss Prevention`, `Sandbox`. The MP/ATP values follow the same pattern — expected strings `Malware Protection` and `Advanced Threat Protection` respectively (not yet confirmed by a live tenant export but matches the pattern).
- **`%s{rulelabel}`** — Block-only rule name (e.g. `URL_Filtering_1`).
- **`%s{reason}`** — carries extended detail. Example values: `Virus/Spyware/Malware Blocked`, `This page is unsafe (high PageRisk index)`, `Not allowed to browse this category`. Likely the MP/ATP sub-category discriminator (Ransomware, Phishing, Botnet, etc.). Not in the Insights CSV column list but present in the NSS output.

**Key property**: `ruletype` and `rulelabel` are **Block-only**. An Allow rule firing produces no value for these fields. Operators filtering logs for "which policy blocked this" should filter on `ruletype` non-null.

**Still open**: the full enum of `ruletype` values (the examples above are illustrative, not exhaustive) and the full enum of `reason` sub-categories. A first fork-admin tenant export with at least one MP and one ATP block confirms the complete list.

---

### zcc-01 — ForwardingProfile `condition_type` enum

*Origin: `references/zcc/forwarding-profile.md` § Trusted-network evaluation*

The `condition_type` field on a `ForwardingProfile` controls how inline trusted-criteria, referenced TrustedNetworks, and the predefined set combine (AND across all of them? OR? some hybrid?). The Python SDK passes the value through without validation.

**Type confirmed (2026-04-24)**: Cross-SDK check against `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:22` reveals the field is `int`, not string. Earlier candidate-value speculation (`TRUSTED_CRITERIA_AND`, `AND`, `OR`) was wrong — the wire format uses integer codes.

**Resolves with**: lab test (configure a profile with two criteria; toggle `condition_type` between plausible integer values; observe whether both-required vs any-required changes) OR zscaler doc not yet read. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-02 — ForwardingProfile actions `network_type` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

Each item in `forwardingProfileActions` is keyed by `networkType` specifying which network-classification branch it applies to.

**Type confirmed (2026-04-24)**: Go SDK (`forwarding_profile.go:48`) types the field as `int`. Earlier speculation that values might be `TRUSTED` / `UNTRUSTED` strings was wrong — integer codes. Likely 0/1/2/... mapping to Trusted / Untrusted / VPN-Trusted / etc., but the order-to-meaning mapping is unconfirmed.

**Resolves with**: tenant snapshot of a tenant with multiple branches OR lab test. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-03 — ForwardingProfile `action_type` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

The `actionType` field on each network-type action block decides what happens to traffic in that branch.

**Type confirmed (2026-04-24)**: Go SDK (`forwarding_profile.go:49`, `:99`) types the field as `int`. Earlier speculation that values might be string literals like `NONE` / `TUNNEL` / `PAC` was wrong — integer codes. Note: in `UnifiedTunnel` sub-objects, the field is split into `actionTypeZIA` (int) and `actionTypeZPA` (int), indicating ZIA and ZPA traffic can have independent action selections within a shared unified tunnel.

**Resolves with**: tenant snapshot covering multiple profile variants OR zscaler doc not yet read. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-04 — ForwardingProfile `primary_transport` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

The `primaryTransport` field on both ZIA and ZPA actions specifies the transport protocol preference.

**Type confirmed (2026-04-24)**: Go SDK (`forwarding_profile.go:53`, `:100`, plus `UnifiedTunnel.primaryTransport:122` and `PartnerInfo.primaryTransport:115`) types the field as `int`. Earlier speculation that values might be strings like `ZTUNNEL` / `DTLS` / `TLS` was wrong — integer codes. The integer-to-protocol mapping is likely stable across the 5 instances of this field (consistent semantic across contexts) but the specific mapping is still unconfirmed.

**Resolves with**: tenant snapshot OR zscaler doc. **Status**: partially resolved — type known (`int`), semantic mapping still open.

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

Parallel to `zcc-01` but at the TrustedNetwork entity level: how do this TrustedNetwork's own criteria (DNS servers, SSIDs, etc.) combine — AND (all required) or OR (any suffices)?

**Type confirmed (2026-04-24)**: Go SDK (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:28`) types the field as `int`, not string.

**Resolves with**: lab test with two obvious criteria (one correct, one incorrect) toggling `condition_type` between 0 and 1. **Status**: partially resolved — type known (`int`), semantic mapping still open.

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

### zpa-10 — `policy_type` enum drift between data source and reorder resource

*Origin: `scripts/find-asymmetries.py` Pass 1, intra-provider scan*

*Note: this entry was originally filed as `zpa-08` but renumbered to `zpa-10` after the hygiene checker (`scripts/check-hygiene.py`) caught an ID collision with the existing resolved `zpa-08` ("When both FQDNs are equal" interpretation). New clarification IDs must scan the existing entries before claiming a number.*

The TF data source `data_source_zpa_policy_type` accepts `[ACCESS_POLICY, BYPASS_POLICY, CAPABILITIES_POLICY, CLIENT_FORWARDING_POLICY, CREDENTIAL_POLICY, GLOBAL_POLICY, INSPECTION_POLICY, ISOLATION_POLICY, REAUTH_POLICY, REDIRECTION_POLICY, SIEM_POLICY, TIMEOUT_POLICY]` (12 values). The TF resource `resource_zpa_policy_access_rule_reorder` accepts a 12-value set differing in two values: it has `CLIENTLESS_SESSION_PROTECTION_POLICY` (not in the data source) and lacks `SIEM_POLICY` (which the data source has).

Possible explanations:

1. **`SIEM_POLICY` is read-only at the policy-type level** (no rules to reorder; logs flow through it but it has no rule list). Reorder validator correctly omits it.
2. **`CLIENTLESS_SESSION_PROTECTION_POLICY` is reorderable but is a newer feature** that the data source's enum hasn't picked up yet — stale validator.
3. **Both are intentional but undocumented at the schema level.**

**Resolves with**: API exploration. List policy types via OneAPI and compare against both validators; observe whether SIEM_POLICY actually exposes a rule list; check `CLIENTLESS_SESSION_PROTECTION_POLICY` data source lookup behavior. **Status**: open candidate. Tier-A finding (validator divergence verified) but the *interpretation* is operator-uncertain. Threading deferred until interpretation lands.

---

### zpa-09 — `inspection_custom_controls.control_type` accepts `API_PREDEFINED`; `inspection_profile.control_type` does not

*Origin: `scripts/find-asymmetries.py` Pass 1, intra-provider scan*

`resource_zpa_inspection_custom_controls.go:97` lists `control_type` enum as `[API_PREDEFINED, CUSTOM, PREDEFINED, THREATLABZ, WEBSOCKET_CUSTOM, WEBSOCKET_PREDEFINED]` (6 values). `resource_zpa_inspection_profile.go:93` lists `[CUSTOM, PREDEFINED, THREATLABZ, WEBSOCKET_CUSTOM, WEBSOCKET_PREDEFINED]` (5 values — no `API_PREDEFINED`).

Possible explanations:

1. **API_PREDEFINED controls cannot be added to an inspection profile** — they exist as standalone protections but aren't profile-attachable. Profile validator correctly omits the type.
2. **Profile validator is stale** and needs to be updated to accept API_PREDEFINED.

**Resolves with**: lab test creating an `API_PREDEFINED` custom control and attempting to attach it to an inspection profile via the TF resource. If the API rejects it, explanation 1 holds; if accepted, the profile validator is stale. **Status**: open candidate. Threading deferred until lab confirms.

---

### zia-16 — Sublocation count cap per parent

*Origin: `references/zia/sublocations.md` § Open questions*

Whether a maximum number of sublocations per parent location is enforced by the API. No limit is documented in the vendor help doc, SDK source, or Terraform provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for locations) OR lab test

---

### zia-17 — Sublocation name uniqueness scope

*Origin: `references/zia/sublocations.md` § Open questions*

Whether sublocation names must be unique within their parent location or across the entire ZIA tenant. No explicit statement found in any available vendor source.

**Status**: open
**Resolves with**: lab test (create two sublocations with the same name under different parents; observe whether the API rejects the second)

---

### zia-18 — Parent location deletion behavior with sublocations

*Origin: `references/zia/sublocations.md` § Open questions*

Whether the API blocks deletion of a parent location that has active sublocations, cascade-deletes them, or returns an error. Not documented in `understanding-sublocations.md`, SDK delete method, or Terraform provider.

**Status**: open
**Resolves with**: lab test

---

### zia-19 — Sublocation reparenting via `parent_id` update

*Origin: `references/zia/sublocations.md` § Open questions*

Whether the API enforces preconditions when a sublocation is promoted to top-level (removing its `parent_id`) — e.g., whether it blocks promotion if the location already has its own sublocations, given the 2-level depth limit.

**Status**: open
**Resolves with**: lab test

---

### zia-20 — Explicit depth-limit prohibition text

*Origin: `references/zia/sublocations.md` § Open questions*

Available vendor sources show only 2-level hierarchy examples; no explicit vendor statement prohibiting sublocations from themselves having sublocations was found. Matters for operators expecting a 3-level hierarchy.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for locations)

---

### zia-21 — Time interval DST handling

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether `startTime`/`endTime` minute-offset values are evaluated against the location's configured timezone with DST applied (so a 9:00 AM rule stays at 9:00 AM local time year-round), or against a fixed UTC offset. Not documented in any available vendor source.

**Status**: open
**Resolves with**: lab test (set an interval at a DST boundary; observe behavior before/after transition) OR support ticket

---

### zia-22 — Tenant cap on `/timeIntervals` objects

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether a maximum count of user-created time interval objects exists at the tenant level. No limit stated in the help portal, SDK source, or Terraform provider.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for policy objects)

---

### zia-23 — Terraform `zia_time_interval` resource

*Origin: `references/zia/time-intervals.md` § Open questions*

No `zia_time_interval` resource block exists in the ZIA Terraform provider. Whether this surface is planned, intentionally excluded, or available only via the ZIA API is not confirmed from available provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (provider changelog or GitHub issues for terraform-provider-zia)

---

### zia-24 — Midnight-spanning time intervals

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether `endTime < startTime` is accepted by the API to represent windows that cross midnight (e.g., 11 PM to 1 AM), or whether two separate objects are required. The Go SDK struct uses plain `int` with no visible constraint.

**Status**: open
**Resolves with**: lab test

---

### zia-25 — Predefined objects in `/timeIntervals`

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether fixed predefined time interval objects (analogous to the `/timeWindows` catalog's "Work hours" and "Weekends" entries) also exist in the `/timeIntervals` endpoint, or whether `/timeIntervals` is entirely user-managed.

**Status**: open
**Resolves with**: tenant snapshot (list `/timeIntervals` on a fresh or known-clean tenant)

---

### zia-26 — Rule label names in audit log entries

*Origin: `references/zia/rule-labels.md` § Open questions*

Whether label names appear in ZIA admin audit log entries for rule create/update operations. Vendor help and SDK sources describe labels as UI/API metadata only; no audit log schema including label names was found in reviewed sources.

**Status**: open
**Resolves with**: tenant snapshot (inspect audit log entries for a rule update that adds a label)

---

### zia-27 — Rule label name field constraints

*Origin: `references/zia/rule-labels.md` § Open questions*

Character-set restrictions and maximum length on the `name` field. Not documented in the SDK model, vendor help, or Terraform provider source; the TF doc only marks the field as Required (String).

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read (Ranges & Limitations)

---

### zia-28 — Rule label name uniqueness enforcement

*Origin: `references/zia/rule-labels.md` § Open questions*

Whether `name` must be unique within a ZIA tenant and whether the API rejects duplicate names on create. Not confirmed from available sources.

**Status**: open
**Resolves with**: lab test

---

### zia-29 — Rule label `description` maximum length

*Origin: `references/zia/rule-labels.md` § Open questions*

Maximum allowed length for the `description` field. Not documented in the SDK model, vendor help, or Terraform provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations) OR lab test

---

### zia-30 — Rule label "duplicate" action semantics

*Origin: `references/zia/rule-labels.md` § Open questions*

The vendor help page lists "duplicate" as an action on the Rule Labels admin console page but does not describe what it copies — whether it duplicates label metadata only (a new unassociated label) or also copies all label-to-rule associations.

**Status**: open
**Resolves with**: lab test (duplicate a label with known rule associations; inspect both the new label and the original rules)

---

### zia-31 — `rule_label` filter on non-firewall endpoints

*Origin: `references/zia/rule-labels.md` § Open questions*

The `rule_label` query parameter is confirmed on `FirewallPolicyAPI.list_rules`. Whether equivalent filtering is available on other policy rule list endpoints (URL Filtering, Cloud App Control, etc.) is not confirmed.

**Status**: open
**Resolves with**: code read (inspect each policy list endpoint in the SDK for a `rule_label` parameter)

---

### zia-32 — Tenant cap on rule labels

*Origin: `references/zia/rule-labels.md` § Open questions*

Whether a documented maximum count of rule labels per ZIA tenant exists. Not found in vendor help or any SDK source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations)

---

### zia-33 — VSE cluster upgrade sequencing

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether maintenance-window auto-upgrades within a VSE cluster are applied as a rolling sequence (one VM at a time, preserving cluster capacity) or simultaneously across all member VMs. The vendor cluster doc describes auto-upgrade at the VM level but does not address cluster-level sequencing.

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### zia-34 — VSE cluster VM drain-before-removal

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether removing a VM from an active VSE cluster gracefully drains in-flight connections before it leaves the LB pool, or resets sessions immediately. Not described in either VSE vendor doc.

**Status**: open
**Resolves with**: operator experience OR lab test

---

### zia-35 — VSE cluster log entry granularity

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether NSS/Admin Console analytics log entries for VSE cluster traffic carry a VM-level identifier, a cluster-level identifier, or both. Not addressed in the VSE cluster or VSE VM vendor docs.

**Status**: open
**Resolves with**: tenant snapshot (inspect NSS log entries for traffic routed through a VSE cluster) OR operator experience

---

### zia-36 — VSE cluster-scoped vs VM-scoped settings boundary

*Origin: `references/zia/vse-clusters.md` § Open questions*

Which policy settings are pushed cluster-scoped versus which require per-VM configuration. The Admin Console cluster page shows name, status, members, cluster IP, and IPSec termination settings but does not distinguish scope.

**Status**: open
**Resolves with**: operator experience OR zscaler doc not yet read

---

### zia-37 — VSE NAT topology support

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether 1:1 static NAT to public IPs is supported for VSE VMs in cluster mode, and whether the IPv6-in-NAT restriction that applies to PSE clusters also applies to VSE. VSE firewall/connectivity docs reference outbound connectivity but do not address inbound NAT topology.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zia-38 — Public-cloud VSE cluster object semantics

*Origin: `references/zia/vse-clusters.md` § Open questions*

On Azure, AWS, and GCP, whether the Admin Console VSE Cluster object is a purely cosmetic grouping or carries behavioral configuration beyond what the cloud-native LB enforces. Not addressed in available sources.

**Status**: open
**Resolves with**: operator experience OR zscaler doc not yet read

---

### zia-39 — SCIM unknown `department` string handling

*Origin: `references/zia/scim-provisioning.md` § Open questions*

When ZIA receives a `department` attribute via SCIM that does not match any existing ZIA department object by name — whether ZIA auto-creates a new department object, silently drops the association, or returns an error to the IdP. Not described in `understanding-scim-zia.md` or any reviewed source.

**Status**: open
**Resolves with**: lab test OR support ticket
**Blocks**: accurate characterization of SCIM provisioning failure modes for the `department` attribute

---

### zia-40 — SCIM `active=false` session-kill semantics

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether `active=false` sent via SCIM immediately terminates active ZIA proxy sessions for the user, or only blocks future authentications (next connect/reauthentication). The vendor doc states `active=false` disables the user but does not describe session-kill semantics.

**Status**: open
**Resolves with**: lab test

---

### zia-41 — ZIA SCIM endpoint rate limits

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether ZIA SCIM endpoints (`/Users`, `/Groups`, `/Bulk`) have distinct rate limits from the general ZIA API rate limits (20 GET/10s, 10 write/10s per Go SDK). No SCIM-specific rate limit guidance is published in available vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zia-42 — SCIM tenant-level object caps

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether tenant-level caps exist on the number of SCIM-provisioned users and groups, distinct from the 128 groups/user-membership cap. Not stated in `understanding-scim-zia.md`; no Ranges & Limitations reference for SCIM object counts reviewed.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations)

---

### zia-43 — Per-IdP `department` attribute mapping behavior

*Origin: `references/zia/scim-provisioning.md` § Open questions*

How Entra ID, Okta, PingFederate, and Google Workspace each map or omit the Enterprise User `department` field by default in their SCIM integrations with ZIA. Covered in per-IdP configuration guides referenced by the ZIA vendor doc but those guides were not captured.

**Status**: open
**Resolves with**: zscaler doc not yet read (per-IdP SCIM setup articles for ZIA)

---

### zia-44 — ZIA SCIM sync log visibility

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether the ZIA admin console has a SCIM Sync Logs page analogous to the ZPA "About SCIM Sync Logs" article. The ZIA vendor doc's related-articles section lists config and API articles but no dedicated sync log article for ZIA.

**Status**: open
**Resolves with**: zscaler doc not yet read

---

### zia-45 — Per-IdP SCIM push cadence

*Origin: `references/zia/scim-provisioning.md` § Open questions*

The exact sync frequency per IdP (Okta event-triggered vs scheduled batch, Entra ID provisioning cycle timings) for ZIA SCIM provisioning. IdP-controlled behavior not consolidated in any Zscaler vendor source.

**Status**: open
**Resolves with**: zscaler doc not yet read (per-IdP SCIM configuration guides) — the IdP documentation is authoritative for cadence behavior

---

### zpa-11 — Machine group creation endpoint

*Origin: `references/zpa/machine-groups.md` § Open questions*

Whether a direct POST `/machineGroup` endpoint exists. Both SDKs expose only read operations; the vendor help doc implies groups are created through Admin Console provisioning key management and enrollment, with no API-level create operation confirmed.

**Status**: open
**Resolves with**: code read (check ZPA API reference for a POST `/machineGroup` path) OR operator experience

---

### zpa-12 — Machine group matching criteria

*Origin: `references/zpa/machine-groups.md` § Open questions*

Whether the machine group definition carries any matching criteria beyond provisioning key linkage — e.g., hostname pattern, OS type, or certificate subject on the group object itself. The Python and Go SDK models show no such fields; the vendor doc does not describe group-level matching attributes.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zpa-13 — `MACHINE_GRP` in user-session access rules

*Origin: `references/zpa/machine-groups.md` § Open questions*

Whether `MACHINE_GRP` can scope user-session ZPA access rules (not just machine-tunnel rules). The vendor doc focuses exclusively on the machine tunnel use case. Not confirmed or denied in reviewed sources.

**Status**: open
**Resolves with**: lab test (create an access rule with `MACHINE_GRP` operand and attempt to match a user-session connection)

---

### zpa-14 — Machine group capacity limits

*Origin: `references/zpa/machine-groups.md` § Open questions*

Capacity limits: machine groups per tenant, provisioning keys per group, and enrolled machines per group. No limit figures found in vendor help doc, SDK, or Terraform provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for ZPA) OR support ticket

---

### zpa-15 — Machine groups file path correction

*Origin: `references/zpa/machine-groups.md` § classification*

The coverage audit (`archive/audits/2026-04-26.md`) listed machine groups under "ZIA uncovered." All sources confirm this is a ZPA construct: vendor URL is `help.zscaler.com/zpa/about-machine-groups`; all SDK and Terraform artifacts are ZPA-only.

**Status**: resolved — 2026-04-27

**Answer**: The file was moved from `references/zia/machine-groups.md` to `references/zpa/machine-groups.md` with frontmatter corrected to `product: zpa`. The audit entry was updated to reflect this. Machine groups are a ZPA construct exclusively.

---

### shared-07 — MCLS session-level stickiness

*Origin: `references/shared/multi-cluster-load-sharing.md` § Session affinity*

Whether the MCLS VIP pool provides per-flow stickiness (all packets of a single TCP flow land on the same service node), or whether a single flow can be distributed across nodes in different clusters. Impacts DLP large-object scanning and file reassembly accuracy.

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### shared-08 — MCLS cross-cluster auth state replication

*Origin: `references/shared/multi-cluster-load-sharing.md` § Identity caching*

When a user authenticated at one service node is subsequently routed to a node in a different cluster within the MCLS pool, whether the CA re-query is transparent (no user re-prompt) or triggers a visible re-authentication event. Likely varies by auth method (IP surrogacy, cookie, Kerberos, SAML).

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### shared-09 — MCLS VIP failure detection timeout

*Origin: `references/shared/multi-cluster-load-sharing.md` § Failure modes*

How long a ZCC or router-terminated GRE/IPSec tunnel takes to detect a full datacenter VIP failure before triggering failover or re-resolution. Not documented in MCLS or architecture vendor sources.

**Status**: open
**Resolves with**: operator experience OR support ticket
**Blocks**: accurate failover SLA documentation for MCLS deployments

---

### shared-10 — Z-Tunnel 2.0 interaction with MCLS

*Origin: `references/shared/multi-cluster-load-sharing.md` § Traffic distribution*

The MCLS documentation lists VPN VIPs but does not specify Z-Tunnel 2.0 explicitly. Whether Z-Tunnel 2.0 stateful TLS multiplexing interacts differently with cross-cluster LB forwarding compared to GRE/IPSec is unconfirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### shared-11 — Government cloud MCLS topology

*Origin: `references/shared/multi-cluster-load-sharing.md` § Constraints*

Whether `zscalergov` and `zspreview` clouds operate an equivalent MCLS model or a different cluster topology. Not documented in available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### shared-12 — Azure AD CA IP evaluation frequency

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether Azure AD Conditional Access re-evaluates source IP on every HTTP request or only at token-issuance time. The SIPA config guide states post-auth traffic uses a token and "does not require being redirected through Source IP Anchoring," implying token-based evaluation, but the exact CA re-evaluation model is Microsoft's documentation responsibility.

**Status**: open
**Resolves with**: zscaler doc not yet read (Microsoft Entra ID / Azure AD CA documentation) — Microsoft-side behavior

---

### shared-13 — Azure AD CAE interaction with SIPA

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether Azure AD Continuous Access Evaluation (CAE) in tenants with IP-binding policies imposes more-frequent re-authentication and what the implications are for SIPA-anchored connections. Not addressed in any Zscaler vendor source reviewed.

**Status**: open
**Resolves with**: zscaler doc not yet read (Microsoft CAE documentation + Zscaler SIPA guidance)

---

### shared-14 — SIPA fallback when all connectors are unhealthy

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether the predefined `Fallback mode of ZPA Forwarding` ZIA forwarding rule routes SIPA-destined M365 traffic to PSE egress or drops it when all connectors in the designated SIPA connector group are unhealthy. The predefined rule exists (see `references/zia/forwarding-control.md`) but its exact fallback action for SIPA traffic is not source-confirmed.

**Status**: open
**Resolves with**: lab test OR operator experience
**Blocks**: accurate disaster-recovery documentation for SIPA deployments

---

### shared-15 — App Connector public IP sync to Azure AD Named Locations

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether an automated mechanism exists (Zscaler-provided or third-party) to sync App Connector public IPs with Azure AD Named Locations when connector IPs change. Available vendor sources state this as operator responsibility only; no automation is documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### shared-16 — Azure AD Named Locations IP range cap

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

The maximum number of IP ranges supported per Azure AD Named Location object. This is a Microsoft constraint, not Zscaler's, and was not captured in available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (Microsoft Entra ID Named Locations documentation) — Microsoft-side constraint

---

### zcc-08 — ZCC 429 response body shape

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

The exact JSON body shape of ZCC 429 responses — whether the body contains a `message`, `code`, or `Retry-After` field. The vendor doc (`legacy-understanding-rate-limiting-zcc.md`) describes only the `X-Rate-Limit-Retry-After-Seconds` header; response body is not documented.

**Status**: open
**Resolves with**: lab test (trigger a rate limit; inspect the response body)

---

### zcc-09 — Download endpoint rate limit pool scope

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether the 3 calls/day cap for download endpoints (`/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`) is a combined pool across all three or a per-endpoint cap of 3 each. The vendor doc describes "3 API calls per day" for the group; the Python SDK comment implies per-endpoint; the scoping is not authoritatively confirmed.

**Status**: open
**Resolves with**: lab test OR support ticket

---

### zcc-10 — `X-Rate-Limit-Remaining` header presence on 2xx responses

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether `X-Rate-Limit-Remaining` is present on every ZCC response (proactive header) or only on 429 responses. The vendor doc describes the header in the context of rate-limit enforcement but does not state whether it appears on all 2xx responses.

**Status**: open
**Resolves with**: lab test

---

### zcc-11 — `/forceRemoveDevices` UDID batch size cap

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

The maximum number of UDIDs accepted per `/forceRemoveDevices` or `/removeDevices` call. Not documented in the vendor help or SDK source; the SDK accepts an arbitrary list with no visible client-side cap.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-12 — `RequestExecutor` ZCC rate-limit retry behavior

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether the `RequestExecutor` (shared OneAPI SDK transport) automatically reads and honors `X-Rate-Limit-Retry-After-Seconds` on the modern ZCC API path, or whether only `LegacyZCCClientHelper` implements the retry behavior. Not confirmed from available SDK source.

**Status**: open
**Resolves with**: code read (inspect `RequestExecutor` in the Python SDK for rate-limit header handling)

---

### zcc-13 — Rate limit bucket scope: per-IP vs per-credential

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether the 100 calls/hour limit applies per IP address only, or also per API credential pair — i.e., whether two different API keys from the same IP share the same bucket or maintain separate budgets. The vendor doc states "per IP address" with no mention of per-credential sub-buckets.

**Status**: open
**Resolves with**: lab test OR support ticket

---

### zcc-14 — macOS preference domain for ZCC managed preferences

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The exact preference domain for ZCC managed preferences (the CFBundleIdentifier string used in MDM `PayloadType` or a Jamf plist). The primary vendor doc ("Customizing ZCC with Install Options for macOS") redirected at capture time; the domain was not confirmed in the fallback source.

**Status**: open
**Resolves with**: zscaler doc not yet read (primary macOS customization article or current Zscaler Jamf/Intune deployment guide)

---

### zcc-15 — System Extension profile timing on macOS

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether a reboot is required if a System Extension MDM profile arrives after the ZCC package install (rather than before or simultaneously). macOS behavior varies by version; not confirmed in captured sources.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-16 — ZCC macOS uninstall script path

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The exact path to the Zscaler-provided uninstall script on macOS. The primary vendor doc was unavailable at capture time; path is typically inside the app bundle but not confirmed from available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-17 — `launchTray = 0` vs system extension activation

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether `launchTray = 0` prevents only the tray UI (menu bar icon) or also prevents system extension activation and tunnel establishment. Not disambiguated in the parameters vendor doc.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-18 — App Store ZCC MDM managed preferences

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether the App Store-distributed ZCC build accepts managed preferences via MDM (plist/managed-app-config) the same way as the `.pkg` build. Not addressed in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-19 — ZCC Team ID and System Extension bundle identifier

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The current Team ID and System Extension bundle identifier for the ZCC release in use. Version-specific; must be obtained from the installed package or current Zscaler Jamf/Intune deployment guide.

**Status**: open
**Resolves with**: operator experience (inspect installed package) OR zscaler doc not yet read (current deployment guide)

---

### zcc-20 — Full Disk Access PPPC requirement scope

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether Full Disk Access via PPPC (Privacy Preferences Policy Control) is required for all ZCC features or only for specific features such as endpoint DLP and certain posture checks. Not enumerated in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (macOS deployment guide)

---

### zcc-21 — Minimum supported macOS version

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

An explicit vendor statement of the minimum supported macOS version for ZCC. Not found in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC release notes or system requirements article)

---

### zcc-22 — macOS update channel plist key

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether a portal-side plist key controls which macOS ZCC update channel (stable vs. early-access ring) is applied to a device. Not found in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read

---

### zcc-23 — System Extension behavior after `launchTray = 0` on macOS 13+

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The confirmed behavior of the ZCC System Extension after `launchTray = 0` on macOS 13+ with Login Items management restrictions, which can suppress system extensions at MDM policy boundaries. Not addressed in the vendor parameters doc.

**Status**: open
**Resolves with**: lab test (deploy with `launchTray = 0` on macOS 13+; verify tunnel state independently of UI presence) OR operator experience

---

### zcc-24 — Notification Templates schema and options

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

The field schema for Notification Templates — supported languages, branding/customization options, and whether templates can be scoped per App Profile. The vendor help doc references "Configuring Notification Templates for Zscaler Client Connector" as a related article, but that article was not captured.

**Status**: open
**Resolves with**: zscaler doc not yet read ("Configuring Notification Templates for Zscaler Client Connector")

---

### zcc-25 — Per-App-Profile ZPA reauthentication interval override

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether the global "Show ZPA Reauthentication Notifications Every (In Minutes)" setting can be overridden per App Profile / Web Policy. Not found in the Web Policy SDK model fields or vendor App Profile help doc.

**Status**: open
**Resolves with**: code read (inspect WebPolicy SDK model for a reauthentication-interval field) OR lab test

---

### zcc-26 — AUP multi-language support

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether the ZCC AUP tab supports per-locale templates or only a single HTML blob. Not described in `configuring-acceptable-use-policy-zscaler-app.md`; the Notification Templates doc (not yet captured) may address this.

**Status**: open
**Resolves with**: zscaler doc not yet read (Notification Templates doc)

---

### zcc-27 — Posture-failure OS-level notification

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC emits a distinct OS-level toast notification when a device posture check fails, or only updates in-app status. Not described in the vendor notification doc; posture failure is not listed as a toast trigger in reviewed sources.

**Status**: open
**Resolves with**: lab test (trigger a posture failure; observe OS notification center) OR zscaler doc not yet read

---

### zcc-28 — Certificate trust failure notification type

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC emits a ZCC-level OS toast or only a macOS/Windows system-level certificate error dialog when a certificate cannot be trusted. The event type is listed in the vendor notification overview but the exact UX is not confirmed.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-29 — Notification delivery logging

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether "notification shown," "user dismissed," or "AUP acknowledged" events appear in any Zscaler cloud log feed (ZIA analytics, ZPA analytics, ZCC audit, NSS). Not addressed in any reviewed vendor source.

**Status**: open
**Resolves with**: tenant snapshot (inspect available log feeds for notification events) OR operator experience

---

### zcc-30 — Notification Templates localization fallback

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

What language ZCC falls back to if no Notification Template matches the user's OS locale. Requires the Notification Templates doc (not yet captured).

**Status**: open
**Resolves with**: zscaler doc not yet read (Notification Templates doc)

---

### zcc-31 — Linux ZCC desktop notification support

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC on Linux emits OS-level desktop notifications (e.g., via libnotify / D-Bus), or only updates in-app status. Linux platform is referenced in Web Policy sub-policies but not addressed in the notification framework section.

**Status**: open
**Resolves with**: lab test (install ZCC on Ubuntu/RHEL; trigger a notification event) OR operator experience

---

### zcc-32 — ChromeOS notification behavior

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC on ChromeOS surfaces OS-level notifications and whether the Android notification framework applies. The vendor notification doc explicitly names only iOS and Android as unsupported, leaving ChromeOS status ambiguous.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-33 — App Supportability API endpoint

*Origin: `references/zcc/support-options.md` § Open questions*

The underlying API endpoint path and request schema for the four App Supportability toggles (Enable Support Access, Admin Email, Zscaler Ticket Submission, Hide Logging Control). The vendor help doc describes the UI flow only; no SDK service module was found for this surface in either Python or Go SDKs.

**Status**: open
**Resolves with**: code read (grep ZCC API reference for a supportability endpoint) OR zscaler doc not yet read

---

### zcc-34 — App Supportability default toggle states

*Origin: `references/zcc/support-options.md` § Open questions*

Whether "Enable Support Access" and "Hide Logging Control" are on or off for a newly provisioned tenant. The vendor doc describes configuration steps, not explicit default values; defaults were inferred but not confirmed.

**Status**: open
**Resolves with**: tenant snapshot (new tenant or factory-reset App Supportability config) OR operator experience

---

### zcc-35 — Mobile platform password gate field availability

*Origin: `references/zcc/support-options.md` § Open questions*

Whether `disable_password` appears in `iosPolicy` and `androidPolicy` sub-policy objects or only `logout_password` on mobile platforms. Available sources detail desktop sub-policies; mobile field enumeration is incomplete in reviewed sources.

**Status**: open
**Resolves with**: code read (inspect iOS/Android sub-policy SDK model fields)

---

### zcc-36 — Diagnostic bundle contents

*Origin: `references/zcc/support-options.md` § Open questions*

The specific files, directories, and log types included in the encrypted diagnostic bundle submitted via Report an Issue. The vendor doc states the bundle contains encrypted logs but does not enumerate contents; PII scope and redaction behavior are not documented.

**Status**: open
**Resolves with**: lab test (submit a Report an Issue bundle; inspect if decryptable) OR zscaler doc not yet read
**Blocks**: accurate PII/data-handling guidance for support bundle submissions

---

### zcc-37 — Diagnostic bundle local staging path

*Origin: `references/zcc/support-options.md` § Open questions*

Whether ZCC stages the diagnostic bundle to a predictable local temp directory before uploading. Relevant to DLP controls that scan outbound email attachments.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-38 — Admin event log for Report an Issue submissions

*Origin: `references/zcc/support-options.md` § Open questions*

Whether ZCC logs the time, device, and user when a Report an Issue form is submitted in any admin-side audit log, separately from the email delivery receipt. No admin-side submission log found in reviewed sources.

**Status**: open
**Resolves with**: tenant snapshot (inspect ZCC portal audit log after a Report an Issue submission)

---

### zcc-39 — ZCC Firefox integration on Linux

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether ZCC Firefox integration applies to Linux at all. The vendor doc mentions only "macOS and Windows devices." Linux Firefox snap isolation on Ubuntu adds further complexity.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-40 — `security.enterprise_roots.enabled` and ZCC certificate trust

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether ZCC's Firefox integration sets `security.enterprise_roots.enabled` (causing Firefox to inherit the OS certificate store), or whether certificate trust for ZCC's SSL Inspection CA requires a separate enterprise policy step.

**Status**: open
**Resolves with**: lab test (inspect Firefox preference state after enabling ZCC integration) OR operator experience

---

### zcc-41 — Exact Firefox preference keys ZCC writes

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Which Firefox preference keys ZCC sets (e.g., `network.proxy.type`, `network.proxy.autoconfig_url`), and whether settings are delivered via a preference file write, `policies.json`, the Firefox preference API, or another mechanism. The vendor doc states only that ZCC "enables the Use system proxy settings feature in Firefox."

**Status**: open
**Resolves with**: lab test (inspect Firefox profile directory before and after enabling ZCC integration)

---

### zcc-42 — Firefox settings persistence across major version upgrades

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether settings pushed by ZCC's Firefox integration mechanism survive a Firefox major-version update, or whether ZCC must re-apply them after each upgrade. Not addressed in available vendor sources; known risk with `prefs.js`-based settings.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-43 — Firefox integration ZCC version scope

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether Firefox integration behavior is consistent across ZCC 4.x releases, or whether specific ZCC versions introduced changes to the integration mechanism. No version-specific notes in the vendor doc.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC release notes) OR operator experience

---

### zcc-44 — AUP re-display on message change

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether updating the AUP message text in the portal causes ZCC to re-display the AUP to users who have already accepted, independently of the configured frequency setting. The vendor source describes frequency as the only display trigger; policy-change-triggered re-prompt is not mentioned.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-45 — AUP Decline button behavior

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the ZCC AUP screen includes a Decline button, and what happens if the user declines (tunnel blocked, logout forced, or nothing). The vendor source describes the screen as a gate users "must accept" but does not mention a decline path.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-46 — AUP external URL redirect support

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP message field supports a URL redirect to an external policy page, or whether all content must be embedded in the HTML field in the ZCC Portal.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-47 — AUP signature or checkbox confirmation variant

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether ZCC supports a signature-capture or checkbox-confirmation variant of the AUP rather than a simple Accept button. Not described in available vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zcc-48 — AUP Accept-only vs Accept-and-Decline

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP can be configured to show both Accept and Decline as user choices, or whether it is Accept-only. Vendor source framing implies Accept-only; not explicitly confirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zcc-49 — Minimum ZCC agent version for AUP display

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

The minimum ZCC agent version required to display the AUP, and whether older agent versions silently skip the AUP or generate an error. Not documented in the vendor source or install-parameters docs.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC release notes)

---

### zcc-50 — AUP tab suppression when Notification Templates are active

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP Settings tab is suppressed when the tenant uses Notification Templates — analogous to the End User Notifications tab being hidden in that mode. The vendor source documents Notifications tab suppression but does not address the AUP tab specifically.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (enable Notification Templates; verify AUP tab visibility)

---

### zcc-51 — AUP accept/decline event logging

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether ZCC logs individual user AUP accept/decline events in the ZCC portal audit log, ZIA NSS streams, or elsewhere. Not described in the AUP vendor source or shared audit-logs reference.

**Status**: open
**Resolves with**: tenant snapshot (inspect available log feeds for AUP acknowledgment events) OR operator experience

---

### zcc-52 — ZCC AUP single-language-only message

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether ZCC can display the AUP in the user's device locale, or whether only a single-language message is supported. The AUP message field has no documented locale-variant mechanism. Overlaps with `zcc-26`.

**Status**: open
**Resolves with**: zscaler doc not yet read (Notification Templates doc)

---

### zcc-53 — ZCC AUP HTML field size limit

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

The confirmed message size limit for the ZCC AUP HTML field. The ZIA ranges-and-limitations doc records 15K–30K bytes for notification/AUP messages in a ZIA context; direct applicability to ZCC AUP is not explicitly confirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC Ranges & Limitations) OR lab test

---

### zcc-54 — AUP behavior in machine-tunnel and kiosk scenarios

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP is shown before user login in machine-tunnel mode, and whether kiosk or shared-device deployments can bypass the AUP. Not documented in the AUP vendor source or install-parameters docs.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-55 — AUP config change propagation cadence

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether changes to AUP frequency or message content take effect immediately on the next user connect, or only after the agent's next policy refresh cycle (normally on logout/restart).

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-56 — Default `logMode` for a new App Profile

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The out-of-box default log mode (Info, Warn, or another level) when a new App Profile is created in the ZCC Portal. The vendor help doc describes available log modes but does not state the factory default; the SDK model carries the field without a default annotation.

**Status**: open
**Resolves with**: tenant snapshot (create a fresh App Profile; inspect `logMode` value) OR operator experience

---

### zcc-57 — `logLevel` vs `logMode` distinction

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether `logLevel` and `logMode` on the `WebPolicy` object are the same concept with different naming conventions at API vs UI layers, or represent independent configuration dimensions. Both fields exist on the model; vendor help uses "log mode" only.

**Status**: open
**Resolves with**: code read (inspect WebPolicy model + portal behavior) OR lab test

---

### zcc-58 — `logFileSize` values and rotation semantics

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The exact units (bytes vs MB), allowed range, default value, and rotation behavior for the `logFileSize` field on `WebPolicy`. The field is untyped in the model; no enumeration of allowed values or rotation behavior was found.

**Status**: open
**Resolves with**: code read (inspect Go SDK for validation or enum) OR lab test

---

### zcc-59 — `enable_auto_log_snippet` field semantics

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The `enable_auto_log_snippet` parameter appears on `set_web_privacy_info` in the SDK service file but is absent from the `WebPrivacy` model class; its function is not described in any reviewed source.

**Status**: open
**Resolves with**: zscaler doc not yet read OR code read (search across SDK for usages of this parameter)

---

### zcc-60 — Per-platform ZCC log file paths

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The filesystem paths where ZCC writes log files on Windows, macOS, Linux, Android, and iOS. The vendor doc mentions that "Show/Hide Logs" reveals the path to the user but provides no canonical path table. Overlaps with `zcc-68`.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-61 — Windows Event Log integration

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC writes events to the Windows Application or System event log in addition to its own log file, and if so which Event IDs it uses. The `WindowsPolicy.flow_logger_config` SDK field hints at a Windows-specific logging subsystem but its relationship to Windows Event Log is not described. Overlaps with `zcc-69`.

**Status**: open
**Resolves with**: lab test (install ZCC on Windows; inspect Event Viewer) OR operator experience

---

### zcc-62 — macOS Unified Log subsystem for ZCC

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC emits entries to OSLog (subsystem identifier, category) in addition to its own log files on macOS. Not addressed in macOS vendor docs or the SDK model. Overlaps with `zcc-70`.

**Status**: open
**Resolves with**: lab test (`log stream --predicate 'subsystem contains "zscaler"'` with ZCC installed)

---

### zcc-63 — Linux syslog/journald integration

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC on Linux writes to the system journal (journald), and if so what facility/priority it uses. The `LinuxPolicy` SDK model has no log-configuration fields; Linux-specific logging behavior is not documented.

**Status**: open
**Resolves with**: lab test (install ZCC on Linux; inspect `journalctl` output)

---

### zcc-64 — iOS log access limitations

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether iOS platform sandboxing restricts ZCC from exposing a user-accessible log view, and what the actual iOS-specific capabilities are under the App Supportability toggle. No iOS-specific log caveats found in vendor help.

**Status**: open
**Resolves with**: lab test (iOS device) OR zscaler doc not yet read (iOS-specific ZCC deployment guide)

---

### zcc-65 — Diagnostic bundle file inventory

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Specific files included in the ZIP produced by "Export Logs" and in the encrypted bundle sent via "Report an Issue"; whether the bundle includes OS network configuration, driver info, or other artifacts beyond ZCC log files. Overlaps with `zcc-36`.

**Status**: open
**Resolves with**: lab test (export logs; inspect ZIP contents)

---

### zcc-66 — In-UI log viewer vs exported ZIP consistency

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether the in-app log view and the exported ZIP always reflect the same content, or whether the viewer applies session/mode filters that exclude older rotated log data present in the ZIP.

**Status**: open
**Resolves with**: lab test

---

### zcc-67 — ZIA URL visibility in ZCC log files

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC operational logs at any verbosity level include URL paths (not just hostnames/IPs), and whether this depends on forwarding mode (PAC vs tunnel). Inferred that ZCC is transport-layer and does not log URL paths, but not explicitly confirmed.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-68 — ZCC log file paths (Windows and macOS)

*Origin: `references/zcc/troubleshooting.md` § Open questions*

The exact ZCC log file paths on Windows (`%ProgramData%\Zscaler\logs\`) and macOS (`/Library/Application Support/Zscaler/logs/`). Paths are consistent with packaging conventions and community reports but not explicitly stated in captured vendor help sources. Overlaps with `zcc-60`.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-69 — Windows Event Log source name for ZCC

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the Windows Event Log source name for ZCC events is "Zscaler", "ZscalerApp", or another string. Not documented in captured vendor sources. Overlaps with `zcc-61`.

**Status**: open
**Resolves with**: lab test (inspect Event Viewer source names with ZCC installed)

---

### zcc-70 — macOS Unified Log subsystem identifier

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the macOS Unified Log subsystem identifier for ZCC is `com.zscaler` or another string. Derived from standard macOS bundle ID conventions; not confirmed in any captured vendor source. Overlaps with `zcc-62`.

**Status**: open
**Resolves with**: lab test (`log stream --predicate 'subsystem contains "zscaler"'`)

---

### zcc-71 — Android logcat tag for ZCC

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the Android logcat tag for ZCC events is "ZscalerApp" or another string. Not confirmed in captured vendor sources.

**Status**: open
**Resolves with**: lab test (Android device with ZCC installed; `adb logcat | grep -i zscaler`)

---

### zcc-72 — "Fetch Logs" admin permission requirement

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the "Fetch Logs" action on the ZCC Portal Enrolled Devices Device Details page requires a specific admin role permission beyond read access. Not documented in the app-supportability vendor source.

**Status**: open
**Resolves with**: lab test (attempt "Fetch Logs" with a read-only admin) OR zscaler doc not yet read

---

### zcc-73 — HTTP 500 labeled "Not Implemented" in ZCC API reference

*Origin: `references/zcc/troubleshooting.md` § Open questions*

The `legacy-about-error-codes-zcc.md` vendor doc maps HTTP 500 to "Not Implemented." The conventional HTTP status for "Not Implemented" is 501. Whether this reflects an intentional API distinction from standard HTTP 500 (Internal Server Error) or is a documentation error is not clarified.

**Status**: open
**Resolves with**: support ticket OR operator experience (observe live ZCC 500 responses)

---

### zcc-74 — HTTP 503 on ZCC portal API

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether HTTP 503 is returned by the ZCC portal API during maintenance windows. 503 is documented in the ZIA/ZPA legacy API reference but not in the ZCC-specific API reference; applicability to the ZCC portal API is inferred from shared platform behavior.

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### zcc-75 — macOS Network Extension denial error code

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether a macOS user denial of the ZCC Network Extension (in System Settings → Privacy & Security) surfaces a specific ZCC error code or admin-visible alert in the ZCC Portal or audit log. Not described in captured vendor sources.

**Status**: open
**Resolves with**: lab test (deny Network Extension on macOS; observe ZCC error state and portal visibility) OR zscaler doc not yet read

---

## Resolved entries

See the **Status summary** near the top of this file for the list. Entries stay in their original positions above with `Status: resolved` and the answer inline, so anchor links (`.clarifications.md#zia-03` etc.) resolve regardless of resolution state.
