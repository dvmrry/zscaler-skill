# SCIM groups and attributes as ZPA policy criteria (zpa.scim.policy-criteria)
Also called: SCIM_GROUP operand; scim operand; enable_scim_based_policy; scim attributes and groups for policy; scim rule never matches; scim criteria multiple idp; scim microtenant; scim source ip anchoring
Former IDs: zpa-65, zpa-66, zpa-68

SCIM criteria reach a rule through two operand types and a per-IdP setting.

**Operands.** A SCIM group criterion is an operand with object_type SCIM_GROUP whose lhs is the IdP's ID (the zpa_idp_controller id) and whose rhs is the SCIM group's ID (the zpa_scim_groups id); the v1 resources set them as lhs and rhs, and the v2 resources as an entry_values pair. [zpa.scim.policy-criteria:scim-group-operand] A SCIM attribute criterion is an operand with object_type SCIM carrying idp_id, an lhs that is the SCIM attribute header's ID and an rhs that is the value to match; v1 resources require idp_id, and the v2 resources take lhs and rhs as an entry_values pair. [zpa.scim.policy-criteria:scim-attribute-operand] How the engine compares the value is open [gap:zpa.scim.policy-criteria:string-equality].

**Values.** For a SCIM operand in a v1 policy resource (`zpa_policy_access_rule` validates through `ValidateConditions`, which calls `validateOperand`; `zpa_policy_access_rule_v2` calls `ValidatePolicyRuleConditions` instead), the provider fetches the attribute's observed values with GetValues and rejects an rhs that matches none of them, comparing with strings.EqualFold, so the check ignores case. [zpa.scim.policy-criteria:value-must-be-observed] The documentation and the code disagree on case [divergence:zpa.scim.policy-criteria:value-case], and the engine's behavior is open [gap:zpa.scim.policy-criteria:zpa-66-case-sensitivity].

**The IdP setting.** The IdP object carries scimEnabled, enableScimBasedPolicy, disableSamlBasedPolicy, scimServiceProviderEndpoint and scimSharedSecretExists. [zpa.scim.policy-criteria:idp-flags] The IdP object carries `enableScimBasedPolicy`, which matches by name the SCIM Attributes and Groups for Policy setting; no source maps the field to the setting. [zpa.scim.policy-criteria:flag-is-setting] On the IdP configuration page the setting that allows SCIM attributes and SCIM groups in policy (labelled SCIM Attributes for Policy there) applies only if SCIM Sync is enabled as well, and the SCIM enabling page says the same of its SCIM Attributes for Policy setting. [zpa.scim.policy-criteria:policy-setting-needs-sync] The IdP and access policy pages name the setting differently (see [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration)). Whether both flags are needed is open [gap:zpa.scim.policy-criteria:both-flags-needed]. What a disabled setting does to a rule is in [If the IdP's SAML Attributes for Policy (or SCIM Attributes and Groups for Policy) setting is disabled but a rule has criteria of that kind, an OR operator skips those criteria and evaluates the other kind, while an AND operator makes Private Access not evaluate the rule at all.](kb:zpa.policy.criteria:idp-policy-setting-disabled). The earlier question on this fallback is closed [gap:zpa.scim.policy-criteria:zpa-65-setting-fallback]. The SAML counterpart is in [How SAML attributes act as policy criteria](kb:zpa.saml-attributes.policy-criteria).

**IdPs.** SCIM groups are listed per IdP and each group carries the IdP's ID, so groups of the same name under two IdPs are distinct objects. [zpa.scim.policy-criteria:groups-per-idp] Choosing IdPs and joining criteria is covered in [A rule's SAML and SCIM criteria are chosen per IdP: the admin selects the IdP configuration, which must be configured for User SSO, selects more than one IdP when needed, and then picks the criteria, which appear under SAML and SCIM Attributes and the IdP name.](kb:zpa.saml-attributes.policy-criteria:idp-selection).

**Rule families.** The provider's access, forwarding, timeout, inspection and isolation rule resources, each in its v1 and v2 form, accept SAML, SCIM and SCIM_GROUP among their operand object types. [zpa.scim.policy-criteria:families] The earlier question on isolation rules is closed [gap:zpa.scim.policy-criteria:zpa-68-isolation-scim]. [The access, timeout, forwarding, inspection and isolation v2 policy rule docs, and the browser protection rule doc, describe the resource as recommended, not required, when a rule needs more than 1000 resource criteria.](kb:zpa.terraform.policy-rule-resources:v2-recommended-over-1000)

**Scope limits.** [The v1 access rule doc says microtenant_id is not supported inside operands when object_type is SAML, SCIM, SCIM_GROUP, IDP, POSTURE or TRUSTED_NETWORK, and follows it directly with the sentence that ZPA automatically assumes the posture profile ID that belongs to the parent tenant.](kb:zpa.terraform.policy-rule-resources:operand-microtenant-unsupported-types) For resources defined in the Default Microtenant, SAML Attributes, SCIM Attributes and SCIM Group are Full for the Default Microtenant and Read only for a Microtenant. [zpa.scim.policy-criteria:microtenant-read-only] When Source IP Anchoring traffic is restricted to certain users in the Admin Console, Zscaler says not to add user-based SAML or SCIM criteria in the access policy. [zpa.scim.policy-criteria:sipa] How anchored traffic gets its country is in [For Cloud Connectors, Source IP Anchoring traffic and Private Access multi-hop, the country criterion uses the last NATed layer 3 public IP address, so SIPA traffic takes its country from the Internet & SaaS Public Service Edge's public IP.](kb:zpa.policy.criteria:country-last-nat-ip).

Provider defects that affect rule writes are in [What the ZPA Terraform provider sends and loses when writing policy rules](kb:zpa.terraform.policy-rule-writes), and ordinary lookups in [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection).

What to check:
1. Which object type the rule uses and what its lhs and rhs hold: IdP ID and group ID for SCIM_GROUP, attribute header ID and value for SCIM.
2. Whether the IdP has the SCIM Attributes and Groups for Policy setting on, and what operator the rule uses, since the outcome differs between OR and AND.
3. Which IdP the user authenticated through, because criteria belong to one IdP.
4. Whether the value in a SCIM operand is one the attribute actually carries, listed by the values call, and whether case could matter.
5. Whether the rule family can carry SCIM criteria, and whether a Terraform rule is v1 or v2.
6. Whether a Microtenant or Source IP Anchoring is involved, which restrict where SCIM criteria apply.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.scim.policy-criteria:flag-is-setting] Tier B: Statement narrowed after verification: the spec types scimEnabled and enableScimBasedPolicy only as booleans, so the earlier mapping of scimEnabled to SCIM provisioning and the 'both on' reading are moved to gap both-flags-needed. Matched by name only.
- [zpa.scim.policy-criteria:groups-per-idp] Tier B: The per-IdP listing and the idpId field are shown; two same-named groups under two IdPs are not shown in a source.

Sources disagree (name both sides):
- Whether a SCIM attribute value in a rule must match the observed value exactly or case-insensitively. [divergence:zpa.scim.policy-criteria:value-case]
  - tf-zpa: The rhs must exactly match one of the observed values.
  - tf-zpa: The provider's own check accepts a value that differs from an observed value only in case.
  Impact: The provider accepts case variants that the documentation calls non-matching; whether ZPA's policy engine treats them as equal is not shown.

Not known (open gaps):
- Whether the policy engine compares SCIM attribute values case-sensitively [gap:zpa.scim.policy-criteria:zpa-66-case-sensitivity]: settled by lab-test. Blocks: saying whether a rule on 'engineering' matches a user whose value is 'Engineering'
- How the SCIM operand compares its value with the user's attribute [gap:zpa.scim.policy-criteria:string-equality]: settled by lab-test. Blocks: stating exact comparison semantics for multi-valued attributes
- Whether SCIM criteria need both scimEnabled and enableScimBasedPolicy on [gap:zpa.scim.policy-criteria:both-flags-needed]: settled by lab-test. Blocks: saying which IdP flags a SCIM rule depends on

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.saml-attributes.policy-criteria.md (How SAML attributes act as policy criteria): A rule's SAML and SCIM criteria are chosen per IdP: the admin selects the IdP configuration, which must be configured for User SSO, selects more than one IdP when needed, and then picks the criteria, which appear under SAML and SCIM Attributes and the IdP name. [zpa.saml-attributes.policy-criteria:idp-selection]
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy): It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-resources.md (ZPA Terraform policy rule resources: v1 and v2 conditions, operand types and provider changes)
- depends-on references/_meta/text/zpa/zpa.scim.attributes-and-groups.md (SCIM attributes and groups in Private Access): SCIM groups are configured in the IdP and pulled into Private Access when SCIM is enabled (the help page calls them attributes configured in the IdP), and the SCIM Groups page lists the groups synced to Private Access over SCIM by the IdP. [zpa.scim.attributes-and-groups:groups-from-idp]
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)
