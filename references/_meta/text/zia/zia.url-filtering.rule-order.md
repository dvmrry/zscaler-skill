# URL Filtering rule order and first match (zia.url-filtering.rule-order)
Also called: url filtering rule precedence; why does rule A beat rule B; first match wins; disabled rule order; admin rank rule order
Former IDs: zia-05

URL Filtering is a first-match policy. URL Filtering rules evaluate in ascending `order` (Rule 1 before Rule 2). [zia.url-filtering.rule-order:ascending-order] Evaluation of the policy rules stops at the first match. [zia.url-filtering.rule-order:first-match]

**Category first.** Which category a URL is in is decided before any rule is walked: [Category membership is resolved before rules are walked: a rule matches a URL through the category the URL resolved to, not through every category with a matching entry.](kb:zia.url-categories.membership:resolved-before-rules).

**Disabled rules and admin ranks.** A disabled rule is skipped but keeps its position in the order. [zia.url-filtering.rule-order:disabled-holds-slot] With Admin Rank enabled, a rule's admin rank (0 is highest, 7 lowest) constrains the order values it can take: a higher-ranked rule always precedes a lower-ranked one, and an admin cannot pick a rank above their own. [zia.url-filtering.rule-order:admin-rank-precedes]

**Rules that never run.** If Cloud App Control explicitly allows the transaction, URL Filtering does not run unless cascading is enabled ([Cloud App Control versus URL Filtering: which applies](kb:zia.cloud-app-control.precedence)). On inspected HTTPS, URL Filtering runs twice, once on the domain and once on the full URL ([Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline)).

What to check:
1. Which category the URL belongs to, since it is resolved before any rule is walked.
2. Whether a higher rule fails to fire only because the URL resolved to a different category.
3. Whether a disabled rule is the reason a higher rule appears not to fire.
4. Whether an admin rank limits the positions a rule can take in the order.

Area: zia.url-filtering, its subjects in references/_meta/spine/zia/zia.url-filtering.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies): By default, when a Cloud App Control rule explicitly allows the transaction, URL Filtering is not applied at all, so a URL Filtering block on the same site does not fire. [zia.cloud-app-control.precedence:cac-allow-skips-url-filtering]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): On inspected HTTPS, URL Filtering therefore evaluates twice: first on the domain, then on the full decrypted request. "SSL inspection happens before URL Filtering" is wrong: the SSL decision sits between the two URL Filtering passes and gates only the second. [zia.ssl-inspection.pipeline:url-filtering-twice]
- decided-by references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): Category membership is resolved before rules are walked: a rule matches a URL through the category the URL resolved to, not through every category with a matching entry. [zia.url-categories.membership:resolved-before-rules]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- decided-by references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine): A rule matches when all four groups are true, joined by AND: Who, Where and When [ (Users OR/AND Groups OR/AND Departments) AND User Risk Profile AND Adaptive Access Profile AND (Location Groups OR Locations) AND Time ]; What [ Request Methods AND Protocols AND URL Categories AND User Agent AND HTTP Header Profiles ]; Source [ Source IP Groups AND Source Countries ]; and Device [ (Device Groups OR Devices) AND Workload Groups AND Device Trust Level ]. [zia.url-filtering.criteria:operator-expression]
- scoped-by references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity), from zia.url-filtering: A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.url-filtering: URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both]
