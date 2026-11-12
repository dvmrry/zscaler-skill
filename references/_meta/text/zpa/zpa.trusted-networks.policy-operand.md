# The TRUSTED_NETWORK operand in ZPA policy rules (zpa.trusted-networks.policy-operand)
Also called: TRUSTED_NETWORK operand; trusted network policy condition; trusted network rhs false; lhs network_id; trusted network rule never matches; client connector trusted networks criterion
Former IDs: zpa-78

This subject covers the TRUSTED_NETWORK policy operand.

**In the console.** In an access policy rule, Client Connector Trusted Networks is a criterion naming the type of network the user is connected to that Zscaler Client Connector can trust. Selecting several trusted networks combines them with OR. [zpa.trusted-networks.policy-operand:console-criterion] Rules that use the Web Browser or Internet & SaaS Service Edge client types cannot also use posture profile or trusted network criteria; those criteria work only with Client Connector. [zpa.trusted-networks.policy-operand:client-connector-only]

**In Terraform.** In the v1 access, forwarding and inspection rule resources (`zpa_policy_access_rule`, `zpa_policy_forwarding_rule`, `zpa_policy_inspection_rule`), a trusted network condition is an operand with `object_type = "TRUSTED_NETWORK"`, `lhs` set to the trusted network's `network_id` and `rhs = "true"`. Up to v4.4.15 the `zpa_policy_isolation_rule` doc described it the same way; at v4.4.16 that doc no longer lists it. [zpa.trusted-networks.policy-operand:operand-v1] In the v2 access, forwarding and inspection rule docs (`zpa_policy_access_rule_v2`, `zpa_policy_forwarding_rule_v2`, `zpa_policy_inspection_rule_v2`) the trusted network operand has `entry_values` whose `lhs` is the trusted network's `network_id` and whose `rhs` is documented as `"true"` or `"false"`. [zpa.trusted-networks.policy-operand:operand-v2] At v4.4.16 the provider documents `TRUSTED_NETWORK` as an operand for the access, forwarding and inspection policy rules in their v1 and v2 forms and for the browser protection rule, and no longer for the isolation rule, v1 or v2; up to v4.4.15 it documented it for the isolation rule in both forms as well. [zpa.trusted-networks.policy-operand:rule-resources] The trusted network data source doc still lists the isolation policy [divergence:zpa.trusted-networks.policy-operand:data-source-doc-lists-isolation].

**What the provider checks.** The v1 access rule resource calls ValidateConditions, which applies the lookup validator, and the v2 access rule resource calls ValidatePolicyRuleConditions, which applies the v2 validator. [zpa.trusted-networks.policy-operand:validator-by-generation] For the v1 policy rule resources that accept the operand (access, forwarding and inspection), the provider looks the `lhs` up by `networkId` through the SDK's GetByNetID, so a value that is not a known `networkId` fails validation, and it requires `rhs` to be exactly `"true"`. [zpa.trusted-networks.policy-operand:v1-lookup] For v2 policy rule resources the provider requires a non-empty `lhs` and an `rhs` of `"true"` or `"false"`, and does not look the `lhs` up. [zpa.trusted-networks.policy-operand:v2-no-lookup] The two validators disagree on `rhs` [divergence:zpa.trusted-networks.policy-operand:rhs-false-accepted]. What a false condition means is open [gap:zpa.trusted-networks.policy-operand:rhs-false-semantics]. What a wrong identifier does is open [gap:zpa.trusted-networks.policy-operand:wrong-id-effect].

How the provider writes these rules and what it loses: [What the ZPA Terraform provider sends and loses when writing policy rules](kb:zpa.terraform.policy-rule-writes). The identifiers: [The ZPA trusted network object and how to fetch it](kb:zpa.trusted-networks.object).

What to check:
1. Whether the operand's lhs is the trusted network's networkId and not its id.
2. Which rule resource generation is in use, which decides which rhs values pass validation.
3. Whether a false condition is being relied on to target off-network users, which no source settles.
4. Whether the rule's client type is Client Connector, since the criterion works only there.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.trusted-networks.policy-operand:v2-no-lookup] Tier B: Rests on absence: the TRUSTED_NETWORK case of ValidatePolicyRuleConditions was read in full and makes no SDK call.

Sources disagree (name both sides):
- Whether `rhs = "false"` is a legal trusted network condition depends on the rule resource generation: the v1 validator accepts only "true", the v2 validator and the v2 document accept "false". [divergence:zpa.trusted-networks.policy-operand:rhs-false-accepted]
  - tf-zpa: The v1 validator rejects any `rhs` other than "true".
  - tf-zpa: The v2 validator accepts "true" or "false".
  - tf-zpa: The v2 document lists `"true"` or `"false"` for `rhs`, while its own value table lists `"true"`.
  Impact: The same condition passes plan in a v2 rule and fails in a v1 rule. Neither validator says what the server does with "false".
- Whether a trusted network can be a condition of an isolation rule: the trusted network data source doc lists the isolation policy, while the v1 isolation resource schema does not list TRUSTED_NETWORK. [divergence:zpa.trusted-networks.policy-operand:data-source-doc-lists-isolation]
  - tf-zpa: The trusted network data source doc lists the isolation policy among the policies it can be referenced in.
  - tf-zpa: The v1 isolation rule schema accepts no TRUSTED_NETWORK condition.
  Impact: A configuration that follows the data source doc into an isolation rule uses an object type the rule schema does not list.

Not known (open gaps):
- What ZPA does with a TRUSTED_NETWORK condition whose rhs is false [gap:zpa.trusted-networks.policy-operand:rhs-false-semantics]: settled by lab-test. Blocks: using a false condition to target off-network users
- What a rule does when the lhs is the object id instead of the networkId [gap:zpa.trusted-networks.policy-operand:wrong-id-effect]: settled by lab-test. Blocks: explaining a never-matching trusted network rule by the identifier

Area: zpa.trusted-networks, its subjects in references/_meta/spine/zpa/zpa.trusted-networks.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.trusted-networks.object.md (The ZPA trusted network object and how to fetch it): The provider documents that the trusted network data source can be referenced within an access, forwarding, inspection or isolation policy and a service edge group. [zpa.trusted-networks.object:data-source-targets]
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network), from zpa.trusted-networks: Zscaler Client Connector identifies a trusted network by criteria defined for it on the Trusted Networks page, and a forwarding profile can select several predefined trusted networks. [zpa.trusted-networks.zcc-relationship:zcc-defines-criteria]
- interacts-with references/_meta/text/zpa/zpa.trusted-networks.zcc-relationship.md (Trusted networks in ZPA and in Client Connector): The trusted networks offered when building a ZPA access policy rule are the ones configured in the Client Connector Portal; the AppProtection policy page names the Admin Console instead. [zpa.trusted-networks.zcc-relationship:policy-menu-source]
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/trusted-networks.md (config type)
- configured-via references/_meta/text/types/zpa/client-types.md (config type)
