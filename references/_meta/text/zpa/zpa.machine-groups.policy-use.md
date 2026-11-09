# Using a machine group in a ZPA policy rule (zpa.machine-groups.policy-use)
Also called: MACHINE_GRP operand; machine group policy condition; machine group and client type; machine tunnel policy scope; which rules accept machine groups

This subject covers machine group conditions in policy rules.

**The pairing.** In the console, when a machine group is selected in an access policy or AppProtection policy rule, the Machine Tunnel client type is also required. [zpa.machine-groups.policy-use:console-pairs-client-type] The Terraform provider checks a v1 `MACHINE_GRP` operand by looking up the group by ID, and a v2 operand only for at least one value; neither check looks for a `CLIENT_TYPE` operand in the same rule. [zpa.machine-groups.policy-use:provider-checks-group-only] What an API-created rule without the pair matches is open [gap:zpa.machine-groups.policy-use:api-without-client-type]. How this fits federated policies is open [gap:zpa.machine-groups.policy-use:federated-client-type-reconciliation]. The client types themselves: [The Machine Tunnel client type in ZPA policy](kb:zpa.machine-tunnels.client-type-policy).

**Operand shape.** In the v1 `zpa_policy_access_rule` resource (the provider also registers a separate `zpa_policy_access_rule_v2`) a machine group condition is an operand with `object_type = "MACHINE_GRP"`, `lhs = "id"` and `rhs` set to the machine group ID. [zpa.machine-groups.policy-use:operand-v1] In the v2 access policy rule resource (`zpa_policy_access_rule_v2`) a machine group condition is an operand with `object_type = "MACHINE_GRP"` and the machine group IDs in `values`; its operand table gives `NA` for `lhs` and `rhs`. [zpa.machine-groups.policy-use:operand-v2]

**Rule types.** At v4.4.16 the provider documents `MACHINE_GRP` as an operand for the access and forwarding policy rules in both their v1 and v2 forms and for the browser protection rule, and no longer for the inspection and isolation rules; at v4.4.15 it documented it for those two rules in both forms as well. [zpa.machine-groups.policy-use:rule-resources] The machine group data source doc still names inspection and isolation policies [divergence:zpa.machine-groups.policy-use:data-source-doc-lists-inspection-isolation]. How the provider writes these rules and what it loses: [What the ZPA Terraform provider sends and loses when writing policy rules](kb:zpa.terraform.policy-rule-writes). What happens to a group condition on other platforms is open [gap:zpa.machine-groups.policy-use:machine-grp-platforms].

What to check:
1. Whether the rule also selects the Machine Tunnel client type, since the console requires the pair.
2. Which operand shape the access rule resource generation expects: lhs and rhs in `zpa_policy_access_rule`, values in `zpa_policy_access_rule_v2`.
3. Whether the rule type can carry a machine group condition at all.
4. What a machine group condition with no Machine Tunnel client type matches, which needs a lab test.
5. Whether the rule is a federated access policy, where the client type is limited to Client Connector.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.machine-groups.policy-use:provider-checks-group-only] Tier B: Rests on absence: validateOperand validates each operand on its own, and ValidatePolicyRuleConditions' MACHINE_GRP case tests only that values is non-empty; neither inspects sibling operands.

Sources disagree (name both sides):
- Whether a machine group can be a condition of an inspection or isolation rule: the machine group data source doc says it can be referenced there, while the v1 inspection and isolation resource schemas do not list MACHINE_GRP. [divergence:zpa.machine-groups.policy-use:data-source-doc-lists-inspection-isolation]
  - tf-zpa: The machine group data source doc names inspection and isolation policies among the policies it can be referenced in.
  - tf-zpa: The v1 inspection rule schema accepts no MACHINE_GRP condition.
  - tf-zpa: The v1 isolation rule schema accepts no MACHINE_GRP condition.
  Impact: A configuration that follows the data source doc into an inspection or isolation rule uses an object type the rule schema does not list.

Not known (open gaps):
- What the API does with a machine group condition that has no Machine Tunnel client type [gap:zpa.machine-groups.policy-use:api-without-client-type]: settled by lab-test. Blocks: saying what an API-created machine group rule without the client type matches
- Whether a machine group condition has any effect on platforms without machine tunnels [gap:zpa.machine-groups.policy-use:machine-grp-platforms]: settled by lab-test
- Machine group conditions in federated policies that allow only the Client Connector client type [gap:zpa.machine-groups.policy-use:federated-client-type-reconciliation]: settled by lab-test. Blocks: saying whether a machine group condition can be used in a federated policy

Area: zpa.machine-groups, its subjects in references/_meta/spine/zpa/zpa.machine-groups.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.client-type-policy.md (The Machine Tunnel client type in ZPA policy): In the console, when a machine group is selected in an access policy or AppProtection policy rule, the Machine Tunnel client type is also required. [zpa.machine-groups.policy-use:console-pairs-client-type]
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)
