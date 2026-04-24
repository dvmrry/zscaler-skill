---
product: zia
topic: "zia-wildcard-semantics"
title: "ZIA URL pattern and wildcard matching"
content-type: reasoning
last-verified: "2026-04-23"
confidence: high
sources:
  - "https://help.zscaler.com/zia/url-format-guidelines"
  - "vendor/zscaler-help/url-format-guidelines.md"
  - "https://help.zscaler.com/zia/about-url-categories"
  - "vendor/zscaler-help/About_URL_Categories.pdf"
  - "https://help.zscaler.com/zscaler-deployments-operations/url-filtering-deployment-and-operations-guide"
  - "vendor/zscaler-help/URL_Filtering_Deployment_and_Operations_Guide.pdf"
author-status: draft
---

# ZIA URL pattern and wildcard matching

How ZIA matches URLs configured in custom URL categories and URL filtering rules against user requests. Directly cited from Zscaler's *URL Format Guidelines* article.

## Summary

Zscaler uses **leading-period wildcards only** — asterisks (`*`) at the start of a domain are **not permitted**. Right-side (path) wildcards are implicit and always apply.

The two forms:

| Form | What it matches |
|---|---|
| `.example.com` (leading period) | The bare domain `example.com`, any subdomain up to 5 levels deep, plus any path under any of those. |
| `example.com` (no leading period) | The exact domain only, plus any path. Does **not** match subdomains. |

Exact match takes priority over wildcard match across custom URL categories.

## Mechanics

### Leading-period wildcard behavior

From *URL Format Guidelines*:

> A leading period (`.`) functions as a wildcard to the left of the named URL up to 5 subdomain levels deep (i.e., the same policies are applied to the subdomains, as well) or matches exactly to the named URL or matches to the named URL with any directory or file to its right.
>
> Thus, the entry `.safemarch.com` also applies to:
>
> - `atlanta.safemarch.com`
> - `serv3.serv2.serv1.atlanta.safemarch.com`
> - `safemarch.com`
> - `safemarch.com/company/webinars`
> - `serv3.serv2.serv1.atlanta.safemarch.com/company/webinars`

Three things packed into that behavior:

1. Matches any subdomain level up to **5 deep**.
2. Matches the bare domain itself (no leading subdomain).
3. Matches any path under any of the above.

### Exact-match form (no leading period)

From *URL Format Guidelines*:

> To exactly match only with the stated domain or subdomain entry, avoid the leading period. For example, the entry `safemarch.com` applies to `safemarch.com` or `safemarch.com/company/webinars`.

The exact form matches:

- The literal domain name.
- Any path under it (implicit right-wildcard).

It does **not** match subdomains. `safemarch.com` will not match `www.safemarch.com`.

### Asterisk is not a valid wildcard character

From *URL Format Guidelines*:

> Do not use an asterisk (`*`) as a wildcard character at the beginning of a domain. For example, `.safemarch.com` is permitted, while `*safemarch.com` and `*.safemarch.com` are not permitted.

This is non-obvious and often a source of wrong intuition — many URL filtering products use `*.example.com` syntax. **Zscaler does not.** Use the leading-period form.

**Docs-vs-console mismatch** — operator report (2026-04-23) is that the ZIA admin console accepts `*` in URL entries at save time despite the documented rule. What the console actually stores or matches when given an asterisk entry is unverified. See [clarification `zia-15`](../_clarifications.md#zia-15-console-accepts-asterisk-despite-docs-marking-it-invalid). Until resolved, don't rely on `*`-form entries in a tenant even if they saved without error — translate every answer back to the leading-period form this doc describes.

### Right-side (path/port) matching is implicit

From *URL Format Guidelines*:

> Wildcard characters addressing the right side of a stated URL are not explicitly used; they are always assumed. Because of this, the URL entry `safemarch.com` applies to:
>
> - `safemarch.com:10443`
> - `safemarch.com/index.htm`
> - `safemarch.com/work/mail?=next`

The domain entry matches the domain plus any port, path, or query string — no special syntax required.

### Path/directory matching with trailing slash

From *URL Format Guidelines*:

> If you want to categorize a specific file or directory under the root domain (for example, `safemarch.com/resources/ftp.htm` or `safemarch.com/resources`), be aware:
>
> - `safemarch.com/resources` or `safemarch.com/resources/ftp.htm` (with no trailing forward slash) matches the exact string.
> - `safemarch.com/resources/` (with trailing forward slash) matches any file or directory underneath it.

Trailing-slash semantics is the **path-level analog** of leading-period at the domain level: with the slash, it's a wildcard over descendants; without it, it's an exact match.

## Specificity precedence

From *URL Format Guidelines*:

> The exact match takes priority over the wildcard matches. For example, when a user requests for `atlanta.safemarch.com`, a category that contains the exact match, `atlanta.safemarch.com` takes priority over another category that contains the wildcard match, `.atlanta.safemarch.com` or `.safemarch.com`.

Consistent with the general specificity rule from *URL Filtering Deployment and Operations Guide* p.2 (quoted in [`./url-filtering.md`](./url-filtering.md)): most-specific custom-category entry wins across categories, not rule order.

Order of specificity for a request to `atlanta.safemarch.com`:

1. Exact: `atlanta.safemarch.com` (highest priority).
2. Leading-period exact-subdomain-or-deeper: `.atlanta.safemarch.com`.
3. Leading-period parent: `.safemarch.com`.

## URL format rules

From *URL Format Guidelines*:

- **Lowercase only.** Enter `www.safemarch.com`, not `www.Safemarch.com`.
- **No protocol schema.** Enter `www.safemarch.com`, not `http://www.safemarch.com`.
- **Format:** `host.domain`.
- **Underscores** (`_`):
  - Not allowed in TLD or SLD of a URL with subdomain: `www.safemarch.c_om`, `www.safe_march.com` invalid.
  - Allowed in subdomain or path: `ww_w.safemarch.com`, `www.safemarch.com/resources_1` valid.
  - If no subdomain, underscore is allowed in SLD: `safe_march.com` valid.
  - Lone underscore cannot be a subdomain: `_.safemarch.com` invalid; `www_.safemarch.com` valid.
- **TLD-only URLs** not allowed. Cannot add `.gov` as a URL.
- **ASCII only**.
- **Length limits:**
  - URL ≤ 1,024 characters.
  - Domain before `:` ≤ 255 characters.
  - Domain label between periods ≤ 63 characters.

Invalid-format URLs cause the whole custom-category update request to be rejected with an error code.

## Worked example (covers eval Q3)

Scenario: a user asks "Does a rule matching `*.example.com` match `example.com` itself? What about `foo.bar.example.com`? Does the scheme matter?"

First translate from intuitive syntax to Zscaler syntax: **`*.example.com` is not valid in Zscaler.** The Zscaler-equivalent entry is `.example.com` (leading period). With that translation:

| Request | Matched by `.example.com`? | Why |
|---|---|---|
| `example.com` | **Yes** | Bare-domain inclusion per the wildcard rule |
| `www.example.com` | **Yes** | 1-level subdomain |
| `foo.bar.example.com` | **Yes** | 2-level subdomain (≤5) |
| `a.b.c.d.example.com` | **Yes** | 4-level subdomain (≤5) |
| `a.b.c.d.e.example.com` | **No** | 5-level subdomain — the rule says "up to 5 subdomain levels deep" so this is borderline; see [clarification `zia-14`](../_clarifications.md#zia-14-leading-period-wildcard-at-exactly-5-subdomain-levels) for verification |
| `www.example.com/path` | **Yes** | Implicit right-wildcard |
| `http://www.example.com` | **Yes** (protocol is stripped at config and ignored at match) | Schema independence per format rules |
| `https://www.example.com` | **Yes** | Same |
| `myexample.com` | **No** | Leading period requires the segment before it to end at the period; `myexample.com` is a different domain |

And for the exact-match variant `example.com`:

| Request | Matched by `example.com`? |
|---|---|
| `example.com` | Yes |
| `example.com/anything` | Yes (implicit right-wildcard) |
| `www.example.com` | **No** (exact-match does not match subdomains) |
| `foo.example.com` | **No** |

## Edge cases

- **Schema independence.** URLs are configured without `http://` or `https://` prefix. Scheme is not part of matching.
- **Port is part of the implicit right-wildcard.** `safemarch.com` matches `safemarch.com:10443`.
- **Path directory vs file.** Trailing slash on path = descendants; no slash = exact string.
- **Keyword vs URL entries.** Custom categories support keyword matching (entire URI match) in addition to URL/wildcard entries — see *About URL Categories* p.19–20. Keyword `gambling` matches `www.google.com/search?q=gambling`. Out of scope for this doc; see [`./url-filtering.md`](./url-filtering.md).

## Open questions

- Whether the "up to 5 subdomain levels" rule is inclusive or exclusive of level 5 — [clarification `zia-14`](../_clarifications.md#zia-14-leading-period-wildcard-at-exactly-5-subdomain-levels)
- What the console actually stores / matches when `*`-form entries are saved despite docs marking them invalid — [clarification `zia-15`](../_clarifications.md#zia-15-console-accepts-asterisk-despite-docs-marking-it-invalid)

Resolved while writing this doc:

- Wildcard tokenization — [clarification `zia-03`](../_clarifications.md#zia-03-wildcard-tokenization) — resolved via *URL Format Guidelines*. Only leading-period (`.domain.com`) wildcards exist; asterisks are invalid. Right-side path wildcarding is implicit.

## Cross-links

- URL filtering rule precedence (specificity rule quoted from this doc) — [`./url-filtering.md`](./url-filtering.md)
- About URL Categories (classes, super categories, custom categories) — cited in [`./url-filtering.md`](./url-filtering.md) § Category Resolution
- Custom URL Categories via API — `vendor/zscaler-help/Configuring_URL_Categories_Using_API.pdf` (cited in [`./api.md`](./api.md) when authored)
