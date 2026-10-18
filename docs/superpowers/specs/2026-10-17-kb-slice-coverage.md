# URL Filtering slice: coverage diff

Where each cited statement in the two retired docs went
(`references/zia/url-filtering.md`, `references/zia/wildcard-semantics.md`, as of `main` `a53e9f5`),
what was dropped and why, and what the conversion corrected. Section-level partial conversions of
`ssl-inspection.md` and `cloud-app-control.md` are listed at the end.

## `url-filtering.md`

| Old section / statement | Now |
|---|---|
| Summary (two layers: category, then rule) | `zia.url-filtering` (four-question walk); `zia.url-categories.membership:resolved-before-rules` |
| URL Filtering evaluates twice on inspected HTTPS | `zia.ssl-inspection.pipeline`: `first-pass-on-domain`, `first-pass-block`, `url-filtering-twice`, `not-inspected-domain-only` |
| Rule order, first match, disabled holds slot, admin rank | `zia.url-filtering.rule-order`: `ascending-order`, `first-match`, `disabled-holds-slot`, `admin-rank-precedes` |
| Criteria operator expression; unset criteria ignored | `zia.url-filtering.criteria:operator-expression`, `:unset-ignored` |
| Second URL Categories field is AND | `zia.url-filtering.criteria:url-categories2-and` (**corrected**, see below) |
| `userRiskScoreLevels` | `zia.url-filtering.criteria:user-risk-score-levels` (**corrected**) |
| `workloadGroups`, HTTP header profiles | `zia.url-filtering.criteria:api-only-scoping` |
| Python kwarg mapping for header-profile IDs (`utils.py`) | **Dropped:** SDK argument plumbing, not product behavior; belongs to the future generated SDK-surface layer |
| Actions table (Allow, Caution, Block, Isolate, Conditional) | `zia.url-filtering.actions`: `caution`, `isolate-needs-zbi`, `conditional-prereqs` |
| Isolate mechanics (302 to isolation profile, container rendering) | **Not moved:** Zero Trust Browser behavior; stays in `references/zbi/` until that area converts |
| Conditional requires an OIDC IdP | **Not moved:** step-up behavior; stays in `references/zidentity/step-up-authentication.md` |
| `ICAP_RESPONSE`, `ANY`, `NONE` | `zia.url-filtering.actions:api-action-values` |
| Block override field dependencies | `zia.url-filtering.actions:override-conditions` |
| List pagination differs by SDK | `zia.url-filtering.list-pagination` (**corrected**) |
| Custom-category regex patterns | `zia.url-categories.entry-format:regex-patterns` (adds: Support must enable it) |
| The specificity rule; implication for "why does rule A beat rule B" | `zia.url-categories.membership:specific-entry-wins`, `:resolved-before-rules` |
| Cloud App Control interaction | `zia.cloud-app-control.precedence` |
| Edge: Miscellaneous or Unknown | `zia.url-filtering.advanced-settings:misc-unknown` |
| Edge: NROD | `…advanced-settings:nrod-definition`, `:nrod-lookup-prerequisite`; gap `:nrod-lag` (was `zia-04`) |
| Edge: translated content | `…advanced-settings:embedded-sites` |
| Edge: AI/ML redirect handling | `…advanced-settings:aiml-redirect` |
| Edge: CIPA exclusive of four settings | `…advanced-settings:cipa-exclusive` (now cites both SDKs) |
| Edge: Go advanced settings are full-state writes | `…advanced-settings:go-full-state-write` |
| Edge: silent SSL-bypass behavior | `…advanced-settings:global-ssl-bypass-evaluation` (Tier B; the SDK describes the switch as all policy evaluation) |
| Edge: SSL inspection disabled ⇒ payload criteria don't evaluate | `zia.url-filtering.criteria:payload-criteria-need-inspection` |
| Edge: custom URL category quotas | `zia.url-categories.entry-format:category-quotas` |
| Edge: URL format validation, non-English | `…entry-format:length-limits`, `:non-english` |
| Edge: override for Block without inspection | `zia.url-filtering.actions:override-unrestricted-without-inspection` |
| Edge: keyword matching is URL-wide | `…entry-format:keywords-whole-uri` |
| Edge: IP-only URLs rarely categorized | `zia.url-categories.membership:ip-rarely-categorized` |
| Edge: Gen AI prompt tracking (14 apps) | `…advanced-settings:genai-prompts` |
| Edge: Python exposes 8 of the 14 prompt flags | **Not moved:** an SDK divergence; stays in `references/zia/api-divergences.md` |
| Edge: `zveloDbLookupDisabled`, `enableCreativeCommonsSearchResults` | **Dropped:** field names without a behavior claim; belong in the generated type layer once `zscalerctl` reads these settings |
| Worked example (eval 2, Retain Parent branches) | `zia.url-categories.membership` cases `retain-parent-off-custom-rule-fires`, `retain-parent-on-rule-order-decides`, `exact-in-lower-rule-beats-wildcard-in-higher-rule` |
| "To pick the branch": retain-parent counters | `zia.url-categories.membership:retain-parent-counters` |
| Open questions `zia-02`, `zia-04`; resolved `zia-03` | gaps `membership:same-specificity-collision`, `advanced-settings:nrod-lag`, `entry-matching:wildcard-tokenization` |
| Cross-link to `snapshot-schema.md` | **Dropped:** saved snapshots are retired |
| Cross-link to the `rule-hit-history` SPL pattern | Replaced by `zia.logs.web-rule-attribution` (which fields name the deciding rule); the SPL itself stays in `references/shared/splunk-queries.md` |

## `wildcard-semantics.md`

| Old section / statement | Now |
|---|---|
| Leading-period wildcard, 5-level cap | `zia.url-categories.entry-matching:leading-period-wildcard`; gap `:exactly-five-levels` (was `zia-14`) |
| Asterisk is not a valid wildcard; console accepts it | `…entry-matching:asterisk-invalid`; gap `:console-accepts-asterisk` (was `zia-15`) |
| Exact form does not match subdomains | `…entry-matching:exact-form` |
| Right-side matching implicit (port, path, query) | `…entry-matching:right-side-implicit` |
| Trailing-slash path semantics | `…entry-matching:trailing-slash` |
| Specificity precedence (exact > `.sub` > `.parent`) | `…entry-matching:exact-beats-wildcard`; across categories, `zia.url-categories.membership` |
| Scheme independence | `…entry-matching:scheme-not-matched` (Tier B: inferred from the format rule) |
| Bulk URL-add is all-or-nothing | `zia.url-categories.entry-format:bulk-add-all-or-nothing` |
| Format rules (lowercase, no scheme, `host.domain`, ASCII), underscores, TLD-only, lengths | `…entry-format:format-rules`, `:underscore-rules`, `:no-tld-only`, `:length-limits` |
| `TLD_CATEGORY` with entries in `dbCategorizedUrls` | `…entry-format:category-type-filter`; gap `:tld-category-entries` (**corrected**) |
| Keyword vs URL entries | `…entry-format:keywords-whole-uri` |
| Worked example (eval 3) | `…entry-matching` url-match cases, including `wildcard-at-five-levels-ambiguous` |

## Partial conversions

| Doc | Sections moved | Now |
|---|---|---|
| `ssl-inspection.md` | Summary, pipeline position, the two Do Not Inspect variants, worked example (eval 4) | `zia.ssl-inspection.pipeline`; gaps `:mixed-forwarding` (`zia-11`), `:bypass-and-default-rule` (`zia-12`) |
| `cloud-app-control.md` | Summary, evaluation order, precedence rule, worked example (eval 5) | `zia.cloud-app-control.precedence`; resolved gaps `:default-allow-vs-explicit` (`zia-10`), `:cac-disabled-rules` (`zia-06`) |

## Corrections the conversion surfaced

1. **Go SDK pagination.** The old doc said Go `GetAll` "aggregates every page". It calls
   `ReadAllPages` with `pageSize=1000` and stops at the first short page. `zscalerctl-dev`'s
   public validation record shows a real tenant returning 100 of 133 rules that way. Agents
   would have trusted a truncated list.
2. **`urlCategories2` operator.** The old doc said the help docs don't name the operator. The
   current capture does ("connected with a logical AND operator"), so help and SDK agree and there
   is no divergence.
3. **User Risk Profile.** The old doc called `userRiskScoreLevels` "distinct from the
   `userRiskProfile` reference". No `userRiskProfile` field exists; the console's User Risk Profile
   criterion selects risk score levels.
4. **Retain Parent field.** Ledger `zia-01` listed `patternsRetainingParentCategoryCount` and
   `keywordsRetainingParentCategoryCount`. Neither exists in the SDK; the keyword count is
   `retainParentKeywordCount`. `url-filtering.md` had said so, so the KB contradicted itself.
5. **Retain Parent mechanism.** The Go SDK documents `dbCategorizedUrls` as the retain-parent URL
   list, which gives the Retain Parent rule a direct Tier-A source. The same comment undercuts the
   wildcard doc's "put TLD entries in `dbCategorizedUrls`", whose citation only showed the field
   existed. That is now an open gap.
6. **Five subdomain levels.** The wildcard doc called the cap "a hard limit" in one section and
   "borderline, see `zia-14`" in another. It is now one claim, one gap, and an `ambiguous` case.
7. **URL Categories listing.** `zscalerctl-dev` records a 20-record clamp when listing URL
   categories. That is new to the KB (`list-pagination:categories-clamp-20`).

## Source-quality findings

- **Some help captures are not verbatim.** `configuring-ssl-tls-inspection-policy.md` is partly a
  paraphrase by the capturing agent, and `adding-instant-messaging-rule-cloud-app-control.md`
  embeds the agent's own commentary inside the capture ("resolves `zia-06`"). Claims quote only the
  embedded vendor text. A capture script that stores raw page text only would prevent this.
- **PDF-converted `.txt` captures carry private-use glyphs and zero-width characters** inside
  sentences. Anchoring treats them as whitespace.
- **PDF `.txt` captures have no source URL** in the capture manifest (`captured_from: null`); the old
  docs' frontmatter paired them with help URLs by hand.

## Suggestions for `zscalerctl-dev`

- **Include each resource's API path in `introspect`.** infrawright's registry keys on API paths
  too, and 128 of 166 types currently get no Terraform mapping because the names differ
  (`zia/locations` vs `zia_location_management`).
- **Read the advanced URL and cloud-app settings** (`advancedUrlFilterAndCloudAppSettings`), or list
  them in `schema gaps`. Today they are neither read nor listed as a gap, though IaC carries them.
