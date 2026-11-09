# Troubleshooting OneAPI and ZIA calls: a 401, a change that is not live, an activation that stays 409, and a 429 (shared.oneapi.troubleshooting)
Also called: oneapi troubleshooting; 401 unauthorized oneapi; zia change not taking effect; activation stuck; activation 409; 429 rate limit exceeded; why is my zia change not live

A 401, a change that is not live, an activation that stays at 409, and a 429 each have a short sequence of checks below. Each check rests on the claims or gaps it names. Status codes are in [OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes](kb:shared.oneapi.response-codes), and the auth mechanics are in [How a client gets and uses a OneAPI access token](kb:shared.oneapi.authentication).

**Changes not live.** ZIA writes wait for activation [The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status.](kb:zia.api.activation:saved-not-live), and the product-level view is in [Which Zscaler products stage changes behind an activation](kb:shared.activation).

**Limits.** Each product has its own limit model [Rate limits are not one model across OneAPI: ZIA and Cloud & Branch Connector weight endpoints per method, ZPA counts per IP in 10-second windows, ZDX tiers by license count, Client Connector counts calls per hour with a daily cap on downloads, and Business Insights tiers by endpoint group.](kb:shared.oneapi.rate-limits:models-differ).

**Maintenance or permission.** A ZIA 403 can be a maintenance window or a permission problem [A maintenance 403 can therefore be told apart from a permission 403 by the `x-zscaler-mode: read-only` header or the `STATE_READONLY` code; a 403 without them points to the role, SKU or access causes.](kb:shared.oneapi.response-codes:read-only-distinguishable).

What to check:
1. If the token request succeeds but API calls return 401, check that the token request carries audience https://api.zscaler.com. An incorrect audience is one listed cause.
2. If the token request itself fails, check the token endpoint host and the credentials. A failed token request returns 400.
3. For a government tenant, confirm the client routes gov or govus and the tenant has a ZIdentity API client; otherwise use the product's legacy path.
4. If the tenant is not on Authentication Service, OneAPI is unavailable: use the legacy path. OneAPI needs the Authentication Service subscription.
5. If the client secret was rotated just now, do not conclude it is wrong yet: whether propagation takes time is open.
6. Identify which path the script uses from its SDK client and variables before changing credentials.
7. If nothing above applies, rotate the API client secret in ZIdentity and update the variables. The new value is shown once.
8. If a ZIA change was written but not activated, it is saved and not live. Check the activation status, then activate.
9. If other admins or automation may have queued changes, a queued activation waits for every editing administrator and cannot be cancelled.
10. If a write returned EDIT_LOCK_NOT_AVAILABLE with 409, another writer holds the lock: wait, retry, and coordinate.
11. A disabled rule keeps its position in the order but is skipped. Check that the rule you expect to match is enabled and in the order you intend.
12. Check a rule's order against the Sandbox default: the provider treats order 127 as the default rule.
13. Where a URL matches more than one custom category, the more specific entry decides the category whatever the rule order. Equal-specificity collisions are open.
14. Check the web log's Blocked Policy Type to see which control blocked the transaction. The field applies to Block rules.
15. If activation reports a processing queue, wait instead of stacking activations. The activation endpoint is budgeted at 10 POSTs per minute and 40 per hour.
16. If activation reports an invalid pending change, find it in the admin console and fix or revert it. The status name is unconfirmed.
17. Poll activation status no faster than every 30 seconds. The typical completion time is unconfirmed.
18. A read-only maintenance window is temporary: a 403 with x-zscaler-mode: read-only or STATE_READONLY is maintenance, not permission.
19. Do not use Cloud & Branch Connector forced activation to clear a 409: the captured contract describes it only as forced activation.
20. Do not change settings in the admin console while scripts run, because the service may lock a configuration being edited.
21. For ZIA and Cloud & Branch Connector, a 429 follows weight-based limits: heavy DELETE, medium POST and PUT, light GET.
22. For ZPA, the limit is per IP over 10-second windows, and a 429 carries a retry-after header.
23. For ZDX, limits depend on the tenant's tier by license count, and the rate-limit header names differ by host.
24. For Client Connector on OneAPI, the limit is 100 calls per hour at tenant level, with 3 per day for the download endpoints. Responses carry X-Rate-Limit-Remaining and X-Rate-Limit-Retry-After-Seconds.
25. Honor Retry-After: the Python SDK waits the header value plus one second, or the reset header plus one second, and does not retry without either.
26. Serialize concurrent jobs against one product where possible. Whether they share one budget is open.
27. Whether a persistent 429 is cleared by a rate-limit increase is open; do not assume it is.

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.oneapi.response-codes.md (OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes)
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token)
- links-to references/_meta/text/shared/shared.oneapi.rate-limits.md (OneAPI rate limits by product, and how the Go SDK throttles)
- links-to references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating)
