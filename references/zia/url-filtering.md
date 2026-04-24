---
product: zia
topic: "zia-url-filtering"
title: "ZIA URL filtering rule precedence"
content-type: reasoning
last-verified: "2026-04-23"
confidence: medium
sources:
  - "https://help.zscaler.com/zscaler-deployments-operations/url-filtering-deployment-and-operations-guide"
  - "vendor/zscaler-help/URL_Filtering_Deployment_and_Operations_Guide.pdf"
  - "https://help.zscaler.com/zia/configuring-url-filtering-policy"
  - "vendor/zscaler-help/Configuring_the_URL_Filtering_Policy.pdf"
  - "https://help.zscaler.com/zia/recommended-url-cloud-app-control-policy"
  - "vendor/zscaler-help/Recommended_URL_&_Cloud_App_Control_Policy.pdf"
  - "https://help.zscaler.com/zia/configuring-advanced-url-policy-settings"
  - "vendor/zscaler-help/Configuring_Advanced_Policy_Settings.pdf"
  - "https://help.zscaler.com/zia/about-url-categories"
  - "vendor/zscaler-help/About_URL_Categories.pdf"
  - "https://help.zscaler.com/zia/about-policy-enforcement"
  - "vendor/zscaler-help/Understanding_Policy_Enforcement.pdf"
author-status: draft
---

# ZIA URL filtering rule precedence

How ZIA decides which URL filtering rule applies to a request, what wins when multiple rules match, and how URL filtering interacts with Cloud App Control.

## Summary

URL filtering rules are evaluated top-down in **ascending rule order (Rule 1 before Rule 2)** and stop at the **first match**. But "matching" involves two layers you need to hold in your head at once:

1. **Does the URL fall into a category referenced by the rule?** Custom-category membership is resolved by *most-specific-entry-wins* across all custom categories — **not by rule order**. A wildcard entry in one custom category loses to an exact-match entry in another, even if the rule referencing the wildcard category is higher in the order.
2. **Which rule fires for the matched category?** First-match-by-rule-order across the full rule list, same as any firewall-style policy.

A rule with a wildcard category can sit at the top of the order and still silently lose to a lower-numbered rule because a different custom category had a more-specific entry for the URL. This is the pattern that most often produces confident-but-wrong intuitive answers about precedence.

Cloud App Control also gets in the way: by default, if CAC **allows** a cloud app, URL filtering does not evaluate for that transaction at all. See [Cloud App Control interaction](#cloud-app-control-interaction) below.

## Mechanics

### URL filtering evaluates twice on inspected HTTPS traffic

Per *Understanding Policy Enforcement* pp.11–13, URL filtering evaluates **twice** for inspected HTTPS:

1. **CONNECT/SNI pass** — against the destination domain only (CONNECT header in explicit mode, Client Hello SNI in transparent mode). A block here ends the connection (403 on CONNECT block; TCP reset on SNI block) without the user ever completing the TLS handshake. This is how a URL-filtering Block rule on a known-bad hostname takes effect even when SSL inspection is disabled for the target — as long as the SSL Inspection action is "Evaluate Other Policies," not "Bypass Other Policies." See [`./ssl-inspection.md`](./ssl-inspection.md) for the Do Not Inspect variants.
2. **Full-URL pass** — only after decrypt. Same rule list, re-evaluated with full URL path, HTTP method, headers, and request body available. A rule that depends on Request Method, Protocol, or URL path can only fire here.

For non-HTTPS traffic or when SSL Inspection bypassed, only the SNI-equivalent domain-level pass exists; rules relying on deeper criteria silently don't fire.

### Rule order and first-match semantics

From *Configuring the URL Filtering Policy*, p.3:

> Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order.

> The evaluation of the policy rules stops at the first match.

Additional mechanics:

- **Disabled rules hold their place.** "An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule." (*Configuring the URL Filtering Policy*, p.3.)
- **Admin rank gates what order values you can pick.** "Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule's admin rank determines the value you can select in the rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank." (*Configuring the URL Filtering Policy*, p.3.)

### Rule criteria logic

Criteria within a single rule combine with these operators (*Configuring the URL Filtering Policy*, p.1):

```
Source IP Groups (AND) Source Countries (AND) URL Categories (AND)
[Users (OR/AND) Groups (OR/AND) Departments] (AND) User Risk Profile (AND)
[Location Groups (OR) Locations] (AND) Time (AND) Request Methods (AND)
Protocols (AND) User Agent (AND) [Device Groups (OR) Devices] (AND) Device Trust
```

- Unset criteria are **ignored**, not treated as "match nothing" — every criterion reads "Selecting no value ignores this criterion in the policy evaluation."
- Users/Groups/Departments can be OR-ed or AND-ed; default OR, configurable per rule.
- **Multiple URL Categories fields AND together.** You can add a second URL Categories field (`urlCategories2` at the API level) to require a URL to be in both categories simultaneously — useful for "Social Networking AND Gambling" style narrow targeting. Docs list the two fields without naming the operator; the SDK makes the AND semantic explicit (`zscaler/zia/url_filtering.py:204-205`). An operator who expects OR (the more common default) gets surprisingly narrow matches. See [`./api.md § URL Filtering rules`](./api.md#url-filtering-rules).
- Locations and Location Groups OR together when set. If a location isn't in the selected location group, both need to match independently.

### Actions

Five user-configurable actions, per *Configuring the URL Filtering Policy* pp.10–14:

| Action | Effect | Notes |
|---|---|---|
| Allow | Pass traffic | Optional bandwidth/time quotas; HTTP header insertion (custom categories only) |
| Caution | EUN before allowing | Custom redirect URL supported |
| Block | Deny | EUN or redirect; supports Allow Override for specific users/groups |
| Isolate | Remote browser | Requires Zero Trust Browser (ZBI). Produces a 302 redirect to an isolation profile URL; ephemeral cloud browser container renders the page, streams result to user's browser. Needs SSL Inspection decrypt for HTTPS. See [`../zbi/overview.md`](../zbi/overview.md) and [`../zbi/policy-integration.md`](../zbi/policy-integration.md). |
| Conditional | Step-up auth before allowing | Requires ZIdentity + Client Connector forwarding; not supported via Service Edges. **OIDC IdP required** — SAML IdP integrations don't support step-up. See [`../zidentity/step-up-authentication.md`](../zidentity/step-up-authentication.md). |

Each action has caveats around SSL Inspection and EUN settings — see `ssl-inspection.md` for how SSL state affects action enforceability.

**Extra SDK-visible action values** (`zscaler/zia/url_filtering.py:166`): the API also accepts `ICAP_RESPONSE` (hand off to ICAP for external processing — useful when describing tenant rules authored against third-party DLP/malware scanners) and the sentinels `ANY` / `NONE`. Operators rarely configure these directly through the console, but they'll appear in snapshot JSON or API responses.

### Conditional field dependencies (Block action overrides)

**`block_override` + `override_users` / `override_groups` are conditional.** Setting an override list is silently ignored unless **both**:

1. `block_override = true`
2. `action = BLOCK`

(Per `zscaler/zia/url_filtering.py:191-194`.) When answering "why don't my override users get the prompt?", check these two fields first — the most common cause is a rule with `action != BLOCK` that still has `override_users` populated from a prior configuration.

### Custom-category regex patterns (API-only capability)

The SDK exposes **`regexPatterns`** and **`regexPatternsRetainingParentCategory`** on custom URL categories as writeable fields (`zscaler/zia/models/urlcategory.py:43-48`). Custom categories can match URLs via regex — not just URL strings, keywords, or IP ranges.

The admin console walkthrough (*About URL Categories*) doesn't surface this path; the API and TF provider do. Worth flagging when a tenant's URL-category set includes suspicious-looking entries that don't match the documented URL/keyword/IP formats — they may be regex patterns, not broken strings.

## The specificity rule — the non-obvious precedence gotcha

This is the most commonly misunderstood piece of URL filtering behavior. Paired with the wildcard-matching rules — specifically the **5-level subdomain cap** and the **asterisk-is-not-valid** behavior — this is where "intuitive" answers go wrong. See [`./wildcard-semantics.md § Surprises`](./wildcard-semantics.md) for the matching-layer surprises; this section documents the rule-evaluation-layer consequence.

From the *URL Filtering Deployment and Operations Guide*, p.2–3:

> More specific custom category entries always take precedence. URL filtering rules aren't applied to a category with a wildcard if the destination is defined more specifically in another category.

> For example, the first rule `CUSTOM_C1` contains `.example.com` and the second rule `CUSTOM_C2` contains `www.example.com`. When accessing `www.example.com`, the `CUSTOM_C1` policy isn't applied because `CUSTOM_C2` is more specific (even though `CUSTOM_C1` is higher in the rule order).

The same mechanism, restated from the *About URL Categories* article, p.20:

> When enforcing URL Filtering policy rules containing a wildcard, a Public Service Edge for Internet & SaaS (ZIA) always looks for a specific match first. For example, you have Custom Category 1 containing the wildcard entries `.example.com` and `.example.com/abc/`, and Custom Category 2 containing `abc.example.com` and `example.com/abc/def`. Also, your URL Filtering policy rule states, "For Location X, block everything in Custom Category 1". In this example, if a user tries to access `abc.example.com` or `example.com/abc/def` from Location X, they won't be blocked because those exact domain names are in Custom Category 2, which is not blocked.

Plain-language restatement: **URL-to-category matching is resolved by most-specific-entry-wins across all custom categories *before* any rule evaluates.** A URL's "category" for policy purposes is the category with the most-specific matching entry — not the category referenced by the highest-priority rule.

### Implication for "why does rule A beat rule B"

When answering a precedence question, check both layers in order:

1. **Category resolution.** For the target URL, which custom category holds the most-specific matching entry? That's the category the URL belongs to for policy purposes. A wildcard like `.example.com` in cat A loses to an exact entry like `www.example.com` in cat B.
2. **Rule evaluation.** Walk the rule list top-down. The first enabled rule whose URL Categories criterion includes the category from step 1 (and whose other criteria also match) fires.

A rule with a wildcard-matching category that "should" match may silently never fire because the URL resolved to a different category in step 1.

## Cloud App Control interaction

By default, Cloud App Control is evaluated **before** URL filtering and, when CAC **allows** a request, URL filtering does not evaluate at all.

From *Configuring the URL Filtering Policy*, p.1:

> By default, the Cloud App Control policy takes precedence over the URL Filtering policy. If a user requests a cloud app that you explicitly allow with Cloud App Control policy, the service only applies the Cloud App Control policy and not the URL Filtering policy.

Walk-through (cascading **disabled** is the default):

- **CAC allows Facebook, URL Filtering blocks `www.facebook.com`** → user can view Facebook. CAC's Allow short-circuits URL Filtering; the Block rule never evaluates. **This is not "CAC always wins" — it is "CAC's Allow short-circuits URL Filtering when cascading is off."**
- **Allow Cascading to URL Filtering enabled, same rules** → URL Filtering evaluates after CAC's Allow, fires block. Facebook is blocked.
- **CAC blocks Facebook, URL Filtering allows** → Facebook is blocked regardless of cascading. CAC Block always halts; cascading is an Allow-path-only toggle.
- **User requests a cloud app not configured in CAC (e.g. `ebay.com` with no matching CAC rule)** → URL Filtering evaluates normally; CAC does nothing.

The toggle name — "Allow Cascading *to URL Filtering*" — is the literal switch: it controls only whether URL Filtering runs after a CAC Allow. The inverse ("does URL Filtering always win over CAC?") is never true.

"Allow Cascading to URL Filtering" lives under Advanced Web App Control Options. See [`./cloud-app-control.md`](./cloud-app-control.md) for full treatment.

## Edge cases

- **`MISCELLANEOUS_OR_UNKNOWN` URLs.** Uncategorized URLs fall into this bucket. Blocking it can break user experience on newly-encountered legitimate sites. AI/ML Content Categorization (Advanced Policy Settings) can auto-assign predefined categories based on site content; see the list in *Recommended URL & Cloud App Control Policy* pp.1–3.
- **Newly Registered and Observed Domains (NROD).** Subset of `MISCELLANEOUS_OR_UNKNOWN`; populated by a separate lookup. **Can only be used in URL Filtering rules.** Requires "Enable Suspicious New Domains Lookup" in Advanced Policy Settings. Also covers Newly Revived Domains (sites dormant ~10 days then reactivated).
- **Translated content bypasses by default.** Google-Translate-style proxies render the target site's content under the translator's URL. Without "Enable Embedded Sites Categorization," URL Filtering evaluates against the translator's URL, not the underlying content. Enable the setting to enforce policy on the original site.
- **AI/ML redirect handling.** With AI/ML categorization enabled and a site responding 3xx, Zscaler allows the transaction and follows the redirect regardless of any configured block on the categorized destination. 5xx is logged as allowed. (*Configuring Advanced Policy Settings*, p.2–3.)
- **CIPA Compliance is exclusive of four other settings.** If `enable_cipa_compliance=true` in Advanced URL Filter & Cloud App Settings, the following **must** be `false` — the SDK raises `ValueError` on write; the console surfaces this only as a warning banner:
  - `enable_newly_registered_domains`
  - `consider_embedded_sites`
  - `enforce_safe_search`
  - `enable_dynamic_content_cat`

  (Source: `zscaler/zia/url_filtering.py:515-527`.) Tenants running CIPA cannot simultaneously benefit from NROD lookup, embedded-site categorization, SafeSearch enforcement, or dynamic content categorization. If a question compares "CIPA-on vs CIPA-off" behavior, this matters.
- **Silent SSL-bypass behavior.** By default, URL Filtering does NOT evaluate on traffic on the global SSL bypass list. The `enable_evaluate_policy_on_global_ssl_bypass` flag in Advanced Settings (default `false`) flips this on. If a tenant reports "URL rule didn't fire on bypassed traffic," this is the first thing to check. (`zscaler/zia/models/advanced_settings.py:44-45`.) See [`./api.md § Advanced Policy Settings`](./api.md#advanced-policy-settings).
- **SSL inspection disabled ⇒ criteria don't evaluate.** Rules using Request Method, Protocol, or other HTTP-payload-dependent criteria may not fire on non-inspected HTTPS traffic. (*URL Filtering Deployment and Operations Guide*, p.3, troubleshooting.) See [`./ssl-inspection.md`](./ssl-inspection.md).
- **Custom URL Category quotas.** 25K custom URLs/TLDs across all categories, 64 custom categories (→ 1,024 via support), 256 keywords per category (2,048 total), 2,048 keywords retaining parent category per category (2,048 total), 2,048 custom IP ranges. (*Ranges & Limitations § URL Filtering & Cloud App Control*, `vendor/zscaler-help/ranges-limitations-zia.md` — authoritative; the older per-API-doc values of "30 per category / 1,000 total" in *Configuring URL Categories Using API* p.12 are stale.)
- **URL format validation.** URL ≤1024 chars, ASCII only, domain ≤255 chars, subdomain label ≤63 chars. Non-English characters in URL Filtering are unsupported except ISO/IEC 8859-1. (*Configuring the URL Filtering Policy*, p.1.)
- **Override for Block action.** A Block rule can permit user override via SSO reauth. If SSL Inspection is disabled **and** "Show End User Notifications" is disabled in the corresponding SSL rule, override traffic is allowed without restrictions. (*Configuring the URL Filtering Policy*, p.12.)
- **Keyword matching is URL-wide.** Custom categories defined by keyword match against the entire URI, so `keyword=gambling` matches `www.google.com/search?q=gambling`. (*About URL Categories*, p.19.)
- **IP-only URLs aren't usually categorized.** Zscaler generally doesn't categorize bare IPs unless a SaaS provider dedicates the IP/range to a specific app (e.g., Office 365 IPs are categorized as Professional Services + Office 365). (*About URL Categories*, p.18.)
- **GenAI prompt-tracking flags are per-vendor.** The `URLAdvancedPolicySettings` struct (Go SDK `urlfilteringpolicies.go:150-237`) exposes per-LLM-vendor prompt-capture booleans: `enableChatGPTPrompt`, `enableCopilotPrompt`, `enableGeminiPrompt`, `enableDeepSeekPrompt`, `enableGrokPrompt`, `enableMistralPrompt`, `enableClaudePrompt`, `enableGrammarlyPrompt`, `enableWriterPrompt`, `enableMetaPrompt`, `enablePerplexityPrompt`, and `enablePoePrompt` (12 LLM vendors at the time of this writing). Enabling a per-vendor flag adds that LLM's prompt content to ZIA logs — useful for AI-usage auditing, data-leak investigation, and DLP correlation. Python SDK may not surface all 12; the Go SDK is authoritative for the current list.
- **Adjacent Advanced Settings worth knowing.** `zveloDbLookupDisabled` (disable the Zvelo URL-classification lookup pipeline) and `enableCreativeCommonsSearchResults` (allow CC-licensed search-result tagging) are also on `URLAdvancedPolicySettings`. Neither is commonly toggled but both will appear in snapshot JSON for tenants that did.

## Worked example (covers eval Q2)

Scenario: two URL filtering rules both could match a request for `www.example.com/path`.

- **Rule 10:** URL Categories = `Social Networking` (predefined), Action = Block.
- **Rule 20:** URL Categories = custom category "Corp Exceptions" containing `.example.com` (wildcard), Action = Allow.

Predefined-vs-custom is governed by the **Retain Parent Category** setting on the custom-category entry — see [clarification `zia-01`](../_clarifications.md#zia-01-predefined-vs-custom-category-specificity) for sources and detail. The outcome branches on per-entry tenant config, so the prescribed answer exercises SKILL.md's "When to decline" doctrine on the config side rather than the doc side: state the deterministic mechanics, name the config lookup needed to pick a branch, and if no snapshot is available, decline to pick.

The agent's prescribed answer:

> **Answer:** Deterministic once Retain Parent Category state on the `.example.com` entry in "Corp Exceptions" is known:
>
> - **Retain Parent OFF:** adding `.example.com` to Corp Exceptions removes matching URLs from their original Social Networking classification. `www.example.com/path` belongs *only* to Corp Exceptions; Rule 10's category criterion does not match; **Rule 20 fires → Allow**.
> - **Retain Parent ON:** `www.example.com/path` belongs to both Social Networking and Corp Exceptions simultaneously. Both rules match on category; first-match-by-rule-order wins; **Rule 10 fires → Block**.
>
> **Reasoning:** *About URL Categories* p.19 describes the Retain Parent Category toggle. *URL Filtering Deployment and Operations Guide* p.4 confirms the rule-order behavior explicitly for the Retain-Parent case ("check the rule order to make sure that another rule does not block access to this URL first"). Cross-custom specificity (which doesn't apply here — only one custom is involved) is a separate mechanism.
>
> **Sources:** `references/zia/url-filtering.md § The specificity rule`, [`references/_clarifications.md#zia-01`](../_clarifications.md#zia-01-predefined-vs-custom-category-specificity).
>
> **Confidence:** high on mechanics; without a tenant snapshot, low on which branch applies.
>
> **To pick the branch without guessing:** inspect the retain-parent counters on the Corp Exceptions category (admin console or `GET /api/v1/urlCategories/{id}`). The top-level fields are `urlsRetainingParentCategoryCount` and `ipRangesRetainingParentCategoryCount`; the keyword equivalent lives on a nested `urlKeywordCounts` object as `retainParentKeywordCount` (per Go SDK `urlcategories.go:22-97`). **There is no top-level `patternsRetainingParentCategoryCount` field** — regex pattern counters aren't surfaced this way. If logs exist, the `rule-hit-history` SPL pattern (see [`../shared/splunk-queries.md`](../shared/splunk-queries.md)) reveals which rule historically fired for the URL — fastest path to an empirical answer.

This is the failure-mode pattern the skill is designed to handle: deterministic mechanics, explicit config dependency, and a concrete resolution path — not a hedged guess.

Now change Rule 20 to reference a custom category `Corp Exceptions` containing the **exact** entry `www.example.com` instead of the wildcard:

1. Category resolution. `www.example.com/path` matches `www.example.com` exactly in "Corp Exceptions." Per the specificity rule, the URL belongs to "Corp Exceptions" for policy purposes, not to Social Networking.
2. Rule evaluation. Rule 10 doesn't match (URL is not in its category list). Rule 20 matches → Allow.

Result: **moving the entry from wildcard to exact-match in a lower-priority rule's custom category changes which rule wins, without changing any rule order.** Non-obvious; worth explaining to operators.

## Open questions

Each links to the canonical entry in [`../_clarifications.md`](../_clarifications.md) for full context and status.

- Same-specificity collision across custom categories — [clarification `zia-02`](../_clarifications.md#zia-02-same-specificity-custom-category-collision)
- Wildcard tokenization (`.example.com` vs `*.example.com` vs bare) — [clarification `zia-03`](../_clarifications.md#zia-03-wildcard-tokenization); see also [`./wildcard-semantics.md`](./wildcard-semantics.md)
- NROD propagation lag, upper-bound precision — [clarification `zia-04`](../_clarifications.md#zia-04-nrod-propagation-lag) *(partial: "within hours of going live" doc'd)*

## Cross-links

- Wildcard / URL pattern matching details — [`./wildcard-semantics.md`](./wildcard-semantics.md)
- Cloud App Control details and cascading — [`./cloud-app-control.md`](./cloud-app-control.md)
- SSL inspection interaction — [`./ssl-inspection.md`](./ssl-inspection.md)
- Cross-product policy evaluation model — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
- Log-based validation of a precedence claim (see SPL pattern `rule-hit-history`) — [`../shared/splunk-queries.md`](../shared/splunk-queries.md)
