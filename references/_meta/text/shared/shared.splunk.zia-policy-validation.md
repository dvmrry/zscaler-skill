# Checking a ZIA policy answer against web logs (shared.splunk.zia-policy-validation)
Also called: url-coverage-check; rule-hit-history; ssl-inspection-observed; config-reality-drift; which rule actually fired; was this url inspected; configured allow but logged block

A configuration answer about URL Filtering, Cloud App Control or SSL inspection can be checked against the web records of the traffic it governs. The fields that carry each answer, and their limits, are below.

**Category.** urlcat is the category of the destination URL, with the categorization source beside it: [`urlcat` records the category of the transaction's destination URL, and `urlcatmethod` records the source of that categorization.](kb:zia.logs.web-rule-attribution:category-source). How it relates to the other category fields, and what a URL in several categories shows, is open: [How urlclass, urlsupercat and urlcat relate](kb:zia.logs.web-field-semantics:url-category-fields).

**Rule.** rulelabel is filled only for Block rules: [`rulelabel` and `ruletype` are filled only when a Block rule applied; an allowed transaction has neither, so an empty `rulelabel` does not mean no rule matched.](kb:zia.logs.web-rule-attribution:rulelabel-block-only). URL Filtering and Cloud App Control each have their own rule-name field: [URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty.](kb:zia.logs.web-rule-attribution:separate-layer-labels). A web record that names a Cloud App Control rule in apprulelabel and no URL Filtering rule fits a Cloud App Control allow that skipped URL Filtering, the default when cascading is off, while a record naming both shows both layers evaluated. [shared.splunk.zia-policy-validation:cac-only-label]

**Action.** The full set of action values, and which subsystem fills action, is open: [Full set of action values and which subsystem fills action](kb:zia.logs.web-rule-attribution:action-values-precedence).

**Order.** The rule that should have matched is the first match in ascending order: [Evaluation of the policy rules stops at the first match.](kb:zia.url-filtering.rule-order:first-match).

**SSL inspection.** ssldecrypted says whether the transaction was SSL/TLS inspected, with Yes and No as examples; externalspr holds the SSL/TLS policy reasons, with Blocked, Inspected, N/A, Not inspected because of Microsoft 365 bypass, Not inspected because of SSL/TLS policy, Not inspected because of UCaaS bypass and Not inspected because of Zscaler best practices as examples, and the full list is under the SSL/TLS Policy Reason filter on the Web Insights page. [shared.splunk.zia-policy-validation:ssl-fields] Which inspection action a reason corresponds to, including the two Do Not Inspect variants in [A rule's action is Inspect, Do Not Inspect, or Block, and Do Not Inspect has two variants: Evaluate Other Policies, which keeps URL Filtering and Cloud App Control in play and exposes certificate, SNI, OCSP, TLS-floor and notification settings, and Bypass Other Policies, which bypasses web policies for the TLS traffic; the help page lists no further settings for Bypass.](kb:zia.ssl-inspection.actions:variants), is open [gap:shared.splunk.zia-policy-validation:ssl-reason-reading].

What to check:
1. To see whether a URL has been seen and how it was handled, search web records for the url over the window and list urlcat, urlfilterrulelabel, apprulelabel and action per host.
2. Identify the rule that fired from urlfilterrulelabel, not rulelabel, which is empty for allowed traffic.
3. To check which URL Filtering rule fires, count web records for the url or host by urlfilterrulelabel and action, and compare with the ordered rule list from IaC or a live zscalerctl read; a different first match is the finding.
4. When records name a Cloud App Control rule but no URL Filtering rule, check the tenant's cascading setting before concluding URL Filtering did not run.
5. To see whether a host was inspected, count its web records by ssldecrypted and externalspr.
6. To find configuration drift, compare each URL Filtering rule's configured action from a configuration export with the actions observed under its urlfilterrulelabel; a rule logging an action it is not configured with is the finding.
7. Do not filter on action=Blocked alone and treat the result as every denial.

Inferred, not quoted (say so when an answer rests on one):
- [shared.splunk.zia-policy-validation:cac-only-label] Tier B: Assumes urlfilterrulelabel is empty when URL Filtering did not run; the field table does not say what it holds then.

Not known (open gaps):
- Which SSL inspection action each ssldecrypted and externalspr combination corresponds to [gap:shared.splunk.zia-policy-validation:ssl-reason-reading]: settled by tenant-data or source-read. Blocks: Telling from logs which SSL inspection rule action applied

Area: shared.splunk, its subjects in references/_meta/spine/shared/shared.splunk.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): A web record that names a Cloud App Control rule in apprulelabel and no URL Filtering rule fits a Cloud App Control allow that skipped URL Filtering, the default when cascading is off, while a record naming both shows both layers evaluated. [shared.splunk.zia-policy-validation:cac-only-label]
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
- links-to references/_meta/text/zia/zia.ssl-inspection.actions.md (What an SSL/TLS inspection action does: Inspect, Do Not Inspect, Block and their settings)
- links-to references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match)
