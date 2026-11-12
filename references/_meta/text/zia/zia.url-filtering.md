# ZIA URL Filtering (zia.url-filtering)
Also called: url filtering; is this url blocked; url filter rule; zia url policy

"Is this URL blocked, and by which rule?" needs four questions answered in order. Skipping one is how precedence answers go wrong.

1. **Does URL Filtering run at all?** A Cloud App Control allow skips it unless cascading is on, and Bypass Other Policies skips it entirely: [Cloud App Control versus URL Filtering: which applies](kb:zia.cloud-app-control.precedence), [Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline).
2. **Which category is the URL in?** Resolved before rules, by most-specific entry across custom categories and by Retain Parent for predefined ones: [Which URL category a URL belongs to](kb:zia.url-categories.membership), with entry syntax in [How URL category entries match requests (wildcards)](kb:zia.url-categories.entry-matching).
3. **Which rules' criteria match?** The criteria expression, including the AND between two URL Categories fields and what is visible before decryption: [How URL Filtering rule criteria combine](kb:zia.url-filtering.criteria). The HTTP header profiles that rules can use as a criterion, and the header insertion profiles for the action, are in [HTTP Header Control: header profiles (criteria) and header insertion profiles, their logic, limits and disallowed keys](kb:zia.url-filtering.http-header-profiles).
4. **Which matching rule is first?** First match by ascending order, with disabled rules holding their slot: [URL Filtering rule order and first match](kb:zia.url-filtering.rule-order).

The answer is then that rule's action and its prerequisites: [URL Filtering actions and their prerequisites](kb:zia.url-filtering.actions). Tenant-wide settings can change the outcome without any rule changing: [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

Before reasoning over a tenant's rules, make sure the list is complete: [Listing URL Filtering rules and URL categories without truncation](kb:zia.url-filtering.list-pagination).

**Predefined and optional features.** The predefined CIPA Compliance Rule and its option are in [The CIPA Compliance Rule and the Enable CIPA Compliance option](kb:zia.url-filtering.cipa). Forwarding the traffic of selected categories to an ICAP server is in [ICAP receivers for URL Filtering](kb:zia.url-filtering.icap-receivers).

**Recommended rule.** The recommended URL Filtering rule is enabled, at a rule order appropriate for the organization, with the Block action for the URL categories Adult Material, Drugs, Gambling, Illegal or Questionable, and Militancy/Hate and Extremism. It applies to All HTTP requests, Any user, group, department, location and location group, Always, the HTTP and HTTPS protocols, and the OS Type, No Client Connector and Cloud Browser isolation device groups. The page also says to select device trust levels based on posture definition. [zia.url-filtering:recommended-policy]

Area: zia.url-filtering, its subjects in references/_meta/spine/zia/zia.url-filtering.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies): By default, when a Cloud App Control rule explicitly allows the transaction, URL Filtering is not applied at all, so a URL Filtering block on the same site does not fire. [zia.cloud-app-control.precedence:cac-allow-skips-url-filtering]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): On inspected HTTPS, URL Filtering therefore evaluates twice: first on the domain, then on the full decrypted request. "SSL inspection happens before URL Filtering" is wrong: the SSL decision sits between the two URL Filtering passes and gates only the second. [zia.ssl-inspection.pipeline:url-filtering-twice]
- decided-by references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): Category membership is resolved before rules are walked: a rule matches a URL through the category the URL resolved to, not through every category with a matching entry. [zia.url-categories.membership:resolved-before-rules]
- decided-by references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine): A rule matches when all four groups are true, joined by AND: Who, Where and When [ (Users OR/AND Groups OR/AND Departments) AND User Risk Profile AND Adaptive Access Profile AND (Location Groups OR Locations) AND Time ]; What [ Request Methods AND Protocols AND URL Categories AND User Agent AND HTTP Header Profiles ]; Source [ Source IP Groups AND Source Countries ]; and Device [ (Device Groups OR Devices) AND Workload Groups AND Device Trust Level ]. [zia.url-filtering.criteria:operator-expression]
- decided-by references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match): Evaluation of the policy rules stops at the first match. [zia.url-filtering.rule-order:first-match]
- scoped-by references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity): A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group): URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- links-to references/_meta/text/zia/zia.url-categories.entry-matching.md (How URL category entries match requests (wildcards))
- links-to references/_meta/text/zia/zia.url-filtering.actions.md (URL Filtering actions and their prerequisites)
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)
- links-to references/_meta/text/zia/zia.url-filtering.cipa.md (The CIPA Compliance Rule and the Enable CIPA Compliance option)
- links-to references/_meta/text/zia/zia.url-filtering.http-header-profiles.md (HTTP Header Control: header profiles (criteria) and header insertion profiles, their logic, limits and disallowed keys)
- links-to references/_meta/text/zia/zia.url-filtering.icap-receivers.md (ICAP receivers for URL Filtering)
- links-to references/_meta/text/zia/zia.url-filtering.list-pagination.md (Listing URL Filtering rules and URL categories without truncation)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/url-filtering-rules.md (config type)
- configured-via references/_meta/text/zia/zia.terraform.url-filtering-rules.md (Terraform user agent validation and isolation on URL Filtering rules)
