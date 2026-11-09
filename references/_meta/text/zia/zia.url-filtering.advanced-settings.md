# Advanced URL Filtering settings that change outcomes (zia.url-filtering.advanced-settings)
Also called: advanced policy settings; newly registered domains; NROD; miscellaneous or unknown; embedded sites categorization; translated pages bypass; AI/ML content categorization; CIPA compliance; gen ai prompt capture; global ssl bypass policy evaluation

Tenant-wide settings change URL Filtering outcomes without any rule changing.

**Uncategorized traffic.** Miscellaneous or Unknown holds sites Zscaler has not yet classified; blocking it outright also blocks newly encountered legitimate sites. [zia.url-filtering.advanced-settings:misc-unknown] Newly Registered and Observed Domains (NROD) is a subset of Miscellaneous: uncategorized domains created in the last 30 days or seen for the first time, found by checking Miscellaneous or Unknown URLs against an NROD database. It can be used only in URL Filtering rules. [zia.url-filtering.advanced-settings:nrod-definition] Enable Suspicious New Domains Lookup is required to use the Newly Registered and Observed Domains and Newly Revived Domains categories in a rule; it identifies newly registered and observed domains within hours of going live, and also identifies newly revived domains. [zia.url-filtering.advanced-settings:nrod-lookup-prerequisite]

**What URL is judged.** Without Embedded Sites Categorization, a page viewed through a translation service is judged by the translator's URL; enabling it enforces URL Filtering on the translated site itself. [zia.url-filtering.advanced-settings:embedded-sites] With AI/ML content categorization on, a blocked-category site that answers with a redirect (3xx) is allowed and the redirect is followed, and a server error (5xx) is logged as allowed; other responses follow the policy for the identified category. [zia.url-filtering.advanced-settings:aiml-redirect]

**Exclusions and bypasses.** CIPA compliance cannot be enabled together with newly-registered-domain lookup, embedded-site categorization, SafeSearch enforcement, or dynamic content categorization; both SDKs check for that combination and return an error before the PUT is built or sent. [zia.url-filtering.advanced-settings:cipa-exclusive] Policy evaluation for traffic on the global SSL bypass list is a separate switch (`enableEvaluatePolicyOnGlobalSSLBypass`) that defaults to off, so URL Filtering rules may not apply to globally bypassed traffic. [zia.url-filtering.advanced-settings:global-ssl-bypass-evaluation] For how SSL inspection decides what URL Filtering sees at all, see [Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline).

Gen AI prompt capture covers the named applications (ChatGPT, Microsoft Copilot, Gemini, Perplexity, Poe, Meta AI, WRITER, DeepSeek, Grok AI, Claude, Mistral, Grammarly, QuillBot, Google AI). Prompts are logged in Web Insights up to 2 KB each; Copilot prompts are stored only for unauthenticated users, and capture works for Copilot Chat but not Copilot inside Office apps. [zia.url-filtering.advanced-settings:genai-prompts] The Python response model reads only eight of the prompt flags [divergence:zia.url-filtering.advanced-settings:prompt-flags-python-model].

**Writing through automation.** The Go SDK sends every advanced-settings boolean even when false (except `blockSkype`, and `safeSearchApps` stays optional), so a sparse struct written to toggle one setting turns the others off. [zia.url-filtering.advanced-settings:go-full-state-write] What a serialized Creative Commons false does to an enabled setting is open [gap:zia.url-filtering.advanced-settings:creative-commons-backend-effect].

**One-click breakouts.** The Microsoft 365 and UCaaS one-click toggles (`enableMsftO365`, `enableUcaasZoom`, `enableUcaasLogMeIn`, `enableUcaasRingCentral`, `enableUcaasWebex`) are fields of the URL Filtering and Cloud App Control settings at `/advancedUrlFilterAndCloudAppSettings`. [zia.url-filtering.advanced-settings:ucaas-one-click-fields]

What to check:
1. Whether a rule on NROD matches anything, given that the Suspicious New Domains lookup must be enabled first.
2. Whether a block on a category stops a redirecting response, given that AI/ML categorization follows redirects.
3. Whether URL Filtering rules apply to globally SSL-bypassed traffic, which depends on a separate evaluation switch.
4. Whether the advanced settings are read in full before any one toggle is written.
5. Whether a tenant-wide setting explains a rule that should have fired and did not.

Inferred, not quoted (say so when an answer rests on one):
- [zia.url-filtering.advanced-settings:misc-unknown] Tier B: The definition is documented; the operational consequence follows from it.
- [zia.url-filtering.advanced-settings:embedded-sites] Tier B: The enabled behavior is documented; the disabled behavior is inferred from the setting existing to change it.
- [zia.url-filtering.advanced-settings:global-ssl-bypass-evaluation] Tier B: The field and its default are in the SDKs; its effect on URL Filtering specifically is inferred from the field's description.

Sources disagree (name both sides):
- How many Gen AI prompt flags each SDK models [divergence:zia.url-filtering.advanced-settings:prompt-flags-python-model]
  - sdk-python: The Python response model reads and emits eight prompt flags: ChatGPT, Microsoft Copilot, Gemini, Poe, Meta, Perplexity, Google AI and QuillBot.
  - sdk-go: The Go model also carries DeepSeek, Writer, Grok, Mistral, Claude and Grammarly, for 14 in all, matching the Help list.
  Impact: A typed Python read silently lacks six prompt flags; do not inventory Gen AI prompt capture posture from the Python model alone.

Not known (open gaps):
- Upper bound on how quickly a new domain reaches NROD [gap:zia.url-filtering.advanced-settings:nrod-lag]: settled by support-ticket
- Reading a tenant's advanced URL Filtering and Cloud App settings [gap:zia.url-filtering.advanced-settings:settings-not-live-readable] (data gap): filled by iac or operator
- What a serialized enableCreativeCommonsSearchResults:false does to an enabled setting [gap:zia.url-filtering.advanced-settings:creative-commons-backend-effect]: settled by lab-test. Blocks: applying the URL and cloud-app settings resource to a tenant that has Creative Commons search results enabled

Area: zia.url-filtering, its subjects in references/_meta/spine/zia/zia.url-filtering.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): Policy evaluation for traffic on the global SSL bypass list is a separate switch (`enableEvaluatePolicyOnGlobalSSLBypass`) that defaults to off, so URL Filtering rules may not apply to globally bypassed traffic. [zia.url-filtering.advanced-settings:global-ssl-bypass-evaluation]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies): Enabling Allow Cascading to URL Filtering in Advanced Settings makes the service apply the URL Filtering policy even when a Cloud App Control rule allows the transaction, so a URL Filtering block then applies. [zia.cloud-app-control.precedence:cascading-allow-path]
- interacts-with references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): Newly Registered and Observed Domains (NROD) is a subset of Miscellaneous: uncategorized domains created in the last 30 days or seen for the first time, found by checking Miscellaneous or Unknown URLs against an NROD database. It can be used only in URL Filtering rules. [zia.url-filtering.advanced-settings:nrod-definition]
- scoped-by references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity), from zia.url-filtering: A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.url-filtering: URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs), from zia.url-filtering: URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- decided-by references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine), from zia.url-filtering: A rule matches when all four groups are true, joined by AND: Who, Where and When [ (Users OR/AND Groups OR/AND Departments) AND User Risk Profile AND Adaptive Access Profile AND (Location Groups OR Locations) AND Time ]; What [ Request Methods AND Protocols AND URL Categories AND User Agent AND HTTP Header Profiles ]; Source [ Source IP Groups AND Source Countries ]; and Device [ (Device Groups OR Devices) AND Workload Groups AND Device Trust Level ]. [zia.url-filtering.criteria:operator-expression]
- decided-by references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.url-filtering: Evaluation of the policy rules stops at the first match. [zia.url-filtering.rule-order:first-match]
