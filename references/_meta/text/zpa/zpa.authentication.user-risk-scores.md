# User risk scores in Private Access (zpa.authentication.user-risk-scores)
Also called: User Risk Scores page; override user risk score; risk score levels; risk expiry

A user risk score estimates the organization's risk exposure from a particular user, generated from the user's DLP violations, risky behavior, unsanctioned cloud application usage and other suspicious factors. User risk scores can be added as a criteria type to access policy rules. [zpa.authentication.user-risk-scores:definition] User risk scores are not supported in User Portals or Privileged Remote Access Portals. [zpa.authentication.user-risk-scores:unsupported-portals]

**Levels.** The available user risk scores are Low (0–29), Medium (30–59), High (60–79) and Critical (80–100). [zpa.authentication.user-risk-scores:levels]

**The page.** The User Risk Scores page lists Username, Risk Source (for example ZIA), Risk Score (Low, Medium, High, Critical), Risk Expiry, Last Updated, Overridden Risk Score and Overridden Risk Expiry. The IdP Name filter is applied by default and can be cleared. [zpa.authentication.user-risk-scores:page-columns] When an IdP is deleted, all user risk scores associated with the users of that IdP are also deleted, and the IdP Name filter no longer shows the deleted IdP. [zpa.authentication.user-risk-scores:idp-deletion] Which risk sources exist besides ZIA, how Risk Expiry is set and what Override Risk Expiry can be set to is open [gap:zpa.authentication.user-risk-scores:sources-and-expiry].

**Overriding.** An admin can edit or override a user risk score's override risk score and override risk expiration. Override User Risk Score is available with scores that have not already been overridden, Edit User Risk Score and Reset with scores that have been overridden, and Reset returns an overridden score to its original value. [zpa.authentication.user-risk-scores:override-rules]

Risk scores as a rule criterion are covered in [Criteria available on ZPA access policy rules](kb:zpa.policy.criteria).

What to check:
1. Which level the score falls in and whether an override is in effect, since the page shows both the score and the overridden score.
2. Whether the IdP was deleted, which deletes the scores of its users.
3. Whether the rule is applied to a User Portal or Privileged Remote Access Portal, which do not support user risk scores.

Not known (open gaps):
- Risk sources other than ZIA, how Risk Expiry is set, and what Override Risk Expiry can be [gap:zpa.authentication.user-risk-scores:sources-and-expiry]: settled by tenant-data or support-ticket

Area: zpa.authentication, its subjects in references/_meta/spine/zpa/zpa.authentication.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
