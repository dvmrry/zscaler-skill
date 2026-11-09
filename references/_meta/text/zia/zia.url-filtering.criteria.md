# How URL Filtering rule criteria combine (zia.url-filtering.criteria)
Also called: url filtering criteria; rule criteria and or; urlCategories2; second url categories field; user risk profile; unset criteria

Within one rule, criteria combine by a fixed expression. A rule matches when all four groups are true, joined by AND: Who, Where and When [ (Users OR/AND Groups OR/AND Departments) AND User Risk Profile AND Adaptive Access Profile AND (Location Groups OR Locations) AND Time ]; What [ Request Methods AND Protocols AND URL Categories AND User Agent AND HTTP Header Profiles ]; Source [ Source IP Groups AND Source Countries ]; and Device [ (Device Groups OR Devices) AND Workload Groups AND Device Trust Level ]. [zia.url-filtering.criteria:operator-expression] Mostly AND, with three OR groups: identity (configurable OR or AND), location, and device.

In URL Filtering rules, criteria such as URL Categories and Locations are ignored when left without a value, not treated as "matches nothing": leaving Locations empty removes location from the rule's evaluation. [zia.url-filtering.criteria:unset-ignored]

A second URL Categories field (`urlCategories2` in the API) is ANDed with the first: the URL must be in a category from each field, which makes the rule narrower, not broader. [zia.url-filtering.criteria:url-categories2-and] In the About URL Filtering rule table, the Groups fields are connected with a logical AND operator, as are the URL Categories fields. [zia.url-filtering.criteria:groups-and]

**Validity window.** A rule can carry a Start Date and Time (the rule is valid starting this date and time), an End Date and Time (the rule ceases to be valid on this date and time) and a Time Zone in which the policy rule is valid. [zia.url-filtering.criteria:rule-validity-period]

**User policy on HTTPS.** The page says user-based URL policy on HTTPS traffic can be enforced in different ways, which it describes under SSL/TLS Inspection, IP surrogate and Kerberos. With SSL/TLS Inspection enabled, the service decrypts SSL/TLS transactions and sees the HTTP traffic in the tunnel (with the URI and the Zscaler cookie representing the user), and the location must have authentication enabled. If SSL/TLS interception is not feasible, the IP surrogate feature maps a user to a device IP address so the user's policies apply. With Kerberos, the service can enforce user, group and department policies on proxied HTTPS transactions without decrypting them; the location must have authentication and Kerberos enabled, and Kerberos authentication is supported only for traffic forwarded in explicit mode. [zia.url-filtering.criteria:https-user-policy]

**API field names.** The API also scopes rules by workload groups (`workloadGroups`) and by HTTP header profiles (`httpHeaderProfiles`). [zia.url-filtering.criteria:api-only-scoping] The console's User Risk Profile criterion selects user risk score levels (by default Low 0–29, Medium 30–59, High 60–79, Critical 80–100). The API carries it as `userRiskScoreLevels`. [zia.url-filtering.criteria:user-risk-score-levels]

**What ZIA can see.** Criteria that need the request itself (Request Methods, Protocols, URL path) can only be evaluated on decrypted traffic; on uninspected HTTPS only domain-level evaluation exists, so such rules silently do not fire. [zia.url-filtering.criteria:payload-criteria-need-inspection] See [Where SSL inspection sits in ZIA web policy evaluation (the two passes)](kb:zia.ssl-inspection.pipeline) for when the full request is visible.

What to check:
1. Whether a criterion left empty is intended, since an unset criterion is ignored rather than matching nothing.
2. Whether a second URL Categories field is meant as an AND, which narrows the rule.
3. Whether a rule that matches on request method, protocol or path is applied to decrypted traffic.

Inferred, not quoted (say so when an answer rests on one):
- [zia.url-filtering.criteria:user-risk-score-levels] Tier B: The console-label-to-field mapping is a chain of evidence: the help describes the criterion as risk score levels, and the rule model's only risk field is userRiskScoreLevels.
- [zia.url-filtering.criteria:payload-criteria-need-inspection] Tier B: Chain of evidence: pre-decrypt evaluation sees only the destination domain.

Area: zia.url-filtering, its subjects in references/_meta/spine/zia/zia.url-filtering.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): Criteria that need the request itself (Request Methods, Protocols, URL path) can only be evaluated on decrypted traffic; on uninspected HTTPS only domain-level evaluation exists, so such rules silently do not fire. [zia.url-filtering.criteria:payload-criteria-need-inspection]
- scoped-by references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity): A user who is logged in can still have a transaction judged as the location rather than as the user, when the transaction is one that cannot carry the authentication cookie; a user rule does not match that transaction. [zia.authentication.unauthenticated-traffic:logged-in-user-misses-user-rule]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group): URL Filtering, SSL Inspection, Cloud App Control, Firewall Filtering, Web DLP and Bandwidth Control rules each carry both a `locations` array and a `locationGroups` array, so a rule can name individual locations as well as groups. [zia.locations.rule-scoping:rules-take-both]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.url-filtering: By default, when a Cloud App Control rule explicitly allows the transaction, URL Filtering is not applied at all, so a URL Filtering block on the same site does not fire. [zia.cloud-app-control.precedence:cac-allow-skips-url-filtering]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs), from zia.url-filtering: URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- decided-by references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to), from zia.url-filtering: Category membership is resolved before rules are walked: a rule matches a URL through the category the URL resolved to, not through every category with a matching entry. [zia.url-categories.membership:resolved-before-rules]
- decided-by references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match), from zia.url-filtering: Evaluation of the policy rules stops at the first match. [zia.url-filtering.rule-order:first-match]
