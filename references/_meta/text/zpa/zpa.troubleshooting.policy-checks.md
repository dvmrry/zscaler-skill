# Checking policy match, forwarding, posture and timeout for a blocked user (zpa.troubleshooting.policy-checks)
Also called: zpa policy verification; zpa posture failing silently; posture_udid vs id; forwarding bypass block never fires; zpa broad allow above narrow block; zpa timeout session shorter

Policy is checked in evaluation order: forwarding, then access, with posture and timeout rules deciding re-authentication.

**Evaluation.** The order and defaults are in [Evaluation order across ZPA policy types](kb:zpa.policy.evaluation-order), rule order in [Access policy rule order](kb:zpa.policy.access-rule-order), and the operand forms in [Boolean logic and operand forms of ZPA policy conditions](kb:zpa.policy.conditions).

**Posture.** The cadence is in [Where ZPA access evidence lives: console, client, connector, log streaming](kb:zpa.troubleshooting.signals) and the failure notification in [Rule fields beyond criteria: reauth, posture notification and profile IDs](kb:zpa.policy.rule-fields). Whether a wrong identifier makes a condition never match, and whether never-evaluated differs from failed, are not sourced [gap:zpa.troubleshooting.policy-checks:posture-udid-vs-id] [gap:zpa.troubleshooting.policy-checks:posture-never-vs-failed].

**Timeouts.** The default timeout rule is in [Evaluation order across ZPA policy types](kb:zpa.policy.evaluation-order), and the help and MCP skill disagree on the defaults [ZPA timeout policy rules](kb:zpa.policy.timeout-rules).

What to check:
1. Whether a forwarding rule with a bypass action applies to the traffic, which means the access rules are never evaluated for it.
2. Which rule matched first and whether a broad allow sits above a narrow block.
3. That the rule meant to allow the user names the segment or its group and that every criterion (identity, platform, posture) is satisfied.
4. Whether any rule or timeout rule for the user has a POSTURE condition, which identifier its lhs uses, and whether the device has evaluated the profile.
5. Whether the rule's device posture failure notification is enabled, since the message shows only when it is.
6. Which timeout rule applies and its authentication and idle values, noting that the help and the MCP skill give different defaults.
7. Whether SCIM criteria are used and the SCIM sync is complete for the user.
8. No matching rule means the request is blocked, so a blocked session can come from a rule not covering the segment.

Not known (open gaps):
- Posture profile identifier in a condition [gap:zpa.troubleshooting.policy-checks:posture-udid-vs-id]: settled by lab-test
- A posture profile that has never been evaluated versus one that failed [gap:zpa.troubleshooting.policy-checks:posture-never-vs-failed]: settled by lab-test or support-ticket

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types): Client forwarding policy rules are evaluated before access policy rules, and a match in client forwarding policy makes Private Access disregard the other policy rules, including conflicts. [zpa.policy.evaluation-order:client-forwarding-before-access]
- links-to references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order)
- links-to references/_meta/text/zpa/zpa.policy.conditions.md (Boolean logic and operand forms of ZPA policy conditions)
- links-to references/_meta/text/zpa/zpa.policy.rule-fields.md (Rule fields beyond criteria: reauth, posture notification and profile IDs)
- links-to references/_meta/text/zpa/zpa.policy.timeout-rules.md (ZPA timeout policy rules)
- links-to references/_meta/text/zpa/zpa.troubleshooting.signals.md (Where ZPA access evidence lives: console, client, connector, log streaming)
