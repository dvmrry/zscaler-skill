# Which AppProtection capabilities depend on the subscription (zpa.appprotection.entitlement)
Also called: appprotection license; browser protection subscription; is appprotection included with zpa; appprotection sku

Some of the console is shown only for some subscriptions. Depending on the AppProtection subscription, the AppProtection Policy page shows a Browser Protection security policy option. [zpa.appprotection.entitlement:browser-protection-option] The AppProtection profiles page links to a Browser Protection page for Browser Protection profiles. [zpa.appprotection.entitlement:browser-protection-page] The Security Policy tab includes the AppProtection and Browser Protection policy-specific features: the AppProtection Policy page and the Browser Protection Policy page are displayed if the account has those features enabled, and if they are not enabled the Security Policy tab is not shown. The Browser Protection Policy page shows the AppProtection Policy option depending on the AppProtection subscription. [zpa.appprotection.entitlement:security-policy-tab] The Browser Protection rules and profiles are in [Browser Protection policy rules and profiles: actions, criteria and fingerprint settings](kb:zpa.appprotection.browser-protection-policy).

**What is not documented.** What Browser Protection adds beyond baseline AppProtection, and the tier names that gate it, are open [gap:zpa.appprotection.entitlement:tier-entitlement]. That the default profile ships with every account is in [AppProtection profiles: control selection, paranoia level, actions and the default profile](kb:zpa.appprotection.profiles); whether the rest of AppProtection needs a separate SKU is open [gap:zpa.appprotection.entitlement:baseline-bundling].

What to check:
1. Whether the Browser Protection option appears on the AppProtection Policy page of the tenant.

Not known (open gaps):
- What Browser Protection unlocks and which tiers carry it [gap:zpa.appprotection.entitlement:tier-entitlement] (data gap): filled by operator; settled by support-ticket or tenant-data
- Whether baseline AppProtection is bundled with ZPA [gap:zpa.appprotection.entitlement:baseline-bundling]: settled by support-ticket

Area: zpa.appprotection, its subjects in references/_meta/spine/zpa/zpa.appprotection.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile), from zpa.appprotection: A profile's override options are Override None, Override All Controls and Override Specific Controls; Override None is the default, and Specific can set a different action on each selected control. [zpa.appprotection.profiles:override-modes]
- logged-in references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields), from zpa.appprotection: A Log Streaming Service log receiver can capture an AppProtection log type: information related to AppProtection policy activity. [zpa.appprotection.logging:lss-log-type]
- decided-by references/_meta/text/zpa/zpa.appprotection.policy.md (AppProtection policy rules: actions, criteria and operators), from zpa.appprotection: Private Access policy rules, a set that includes AppProtection policy, are evaluated top-down and the first matching rule is enforced. [zpa.appprotection.policy:first-match]
- scoped-by references/_meta/text/zpa/zpa.appprotection.segment-opt-in.md (Enabling AppProtection on an application segment), from zpa.appprotection: The segment's Auto AppProtection setting lets the segment's traffic be inspected by AppProtection; enabling it requires an Enrollment (CA) Certificate. [zpa.appprotection.segment-opt-in:auto-appprotection]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.appprotection: Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zpa/zpa.appprotection.browser-protection-policy.md (Browser Protection policy rules and profiles: actions, criteria and fingerprint settings)
