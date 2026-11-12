# VPN user enablement rules: who may open a VPN tunnel (zpa.vpn.user-enablement)
Also called: user enablement; vpn user enablement; vpn entitlement; vpn connected user entitlement

User enablement rules define which users gain access to VPN tunnels. A VPN connected user can't connect to the VPN Service Edge if they aren't entitled for VPN (for Legacy Apps). [zpa.vpn.user-enablement:what-it-is] The criteria types that can be configured with user enablement are posture profiles, SAML attributes and SCIM attributes. If the device's posture changes and no longer meets the requirements set by the posture profile rule, the VPN (for Legacy Apps) session is deactivated. [zpa.vpn.user-enablement:criteria-types]

**Matching and order.** A VPN tunnel request must match all the conditions within a user enablement rule, and user enablement rules use AND and OR operators. Private Access applies rules based on the order they are listed, and a rule's place in the Rule Order can be changed by manually entering a new value on the User Enablement page. [zpa.vpn.user-enablement:match-and-order] The ZPA access policy rule order is in [Access policy rule order](kb:zpa.policy.access-rule-order).

**Writing a rule.** A rule's action is Allow Access or Block Access to VPN tunnels. An optional Message to User is displayed to users when the rule's action and criteria are met. The rule name cannot contain special characters except periods, hyphens and underscores. [zpa.vpn.user-enablement:actions-and-message] A rule can have up to 10 condition sets. If multiple attributes or groups are added to the rule, Private Access uses an OR operator between them by default, which can be toggled to AND by clicking it. If multiple IdPs are selected, Private Access also uses OR between them by default. [zpa.vpn.user-enablement:condition-sets] For a posture profile in a condition set, the choices are VERIFIED, meaning Client Connector verified the VPN connected user's device against the criteria in the posture profile, or VERIFICATION FAILED, meaning Client Connector was unable to verify it. [zpa.vpn.user-enablement:posture-values] By default, the user enablement rule for SAML Attributes is set to Any SAML attribute. SCIM criteria are chosen from the drop-down menu as a specific SCIM attribute, such as departments, display name or title, or a specific SCIM group name. [zpa.vpn.user-enablement:identity-criteria]

**When an IdP setting is disabled.** If the IdP's SAML Attributes for Policy setting is disabled but the user enablement rule has criteria for SAML attributes, an OR operator makes Private Access skip the SAML criteria and continue with the SCIM attributes and groups, while an AND operator makes Private Access not evaluate the rule until the SAML criteria are removed. The mirror case holds for the SCIM Attributes and Groups for Policy setting with SCIM criteria: OR skips the SCIM criteria and continues with SAML, and AND leaves the rule unevaluated until the SCIM criteria are removed. [zpa.vpn.user-enablement:idp-policy-setting-disabled] The access policy states the same rule in [If the IdP's SAML Attributes for Policy (or SCIM Attributes and Groups for Policy) setting is disabled but a rule has criteria of that kind, an OR operator skips those criteria and evaluates the other kind, while an AND operator makes Private Access not evaluate the rule at all.](kb:zpa.policy.criteria:idp-policy-setting-disabled). If the IdP configuration for SSO includes SAML attributes or SCIM attributes from multiple IdPs, Zscaler recommends not using the AND Boolean operator between user enablement rules. [zpa.vpn.user-enablement:multi-idp-and]

**Open.** What happens when no rule matches, and whether the first match wins, is open [gap:zpa.vpn.user-enablement:no-match-behavior].

The step in the configuration order is in [VPN (for Legacy Apps) prerequisites and configuration order](kb:zpa.vpn.setup), the traffic rules in [VPN access policy rules: source, destination, default block, rule order and limits](kb:zpa.vpn.access-policy) and the hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

What to check:
1. Whether a user is entitled for VPN (for Legacy Apps), since a user who is not cannot connect to the VPN Service Edge.
2. Whether the IdP's SAML or SCIM setting for policy is disabled while the rule has criteria for it, and which operator joins the criteria.

Not known (open gaps):
- What happens when no user enablement rule matches, and whether the first match wins [gap:zpa.vpn.user-enablement:no-match-behavior]: settled by lab-test or support-ticket

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.policy.access-rule-order.md (Access policy rule order)
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.access-policy.md (VPN access policy rules: source, destination, default block, rule order and limits)
- links-to references/_meta/text/zpa/zpa.vpn.setup.md (VPN (for Legacy Apps) prerequisites and configuration order)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.policy.md (ZPA policy evaluation)
