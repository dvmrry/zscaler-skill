# The Machine Tunnel client type in ZPA policy (zpa.machine-tunnels.client-type-policy)
Also called: zpn_client_type_machine_tunnel policy; machine tunnel access policy rule; does my access rule cover the machine tunnel; machine tunnel blocked by default; client type machine tunnel forwarding rule; client type enum

This subject covers how policy types refer to the Machine Tunnel client type.

**In access policy.** Machine Tunnel is one of the client types an access policy rule can select, beside Zscaler Client Connector, Client Connector for VDI, Client Connector Partner, Branch Connector, Cloud Connector, Web Browser, Internet & SaaS Service Edge and Extranet. [zpa.machine-tunnels.client-type-policy:client-type-listed] The SDK's client types test expects the clientTypes endpoint to label `zpn_client_type_machine_tunnel` as Machine Tunnel and `zpn_client_type_zapp` as Client Connector. [zpa.machine-tunnels.client-type-policy:wire-labels] When a rule selects more than one client type, Private Access combines them with OR. [zpa.machine-tunnels.client-type-policy:client-types-or] [If no access policy rule matches, or no rule is defined at all, access to the application is implicitly set to Block Access.](kb:zpa.policy.evaluation-order:default-access-block) An access rule that selects only the Client Connector client type does not select Machine Tunnel, so a machine tunnel session is covered only by a rule that selects Machine Tunnel; a session no rule covers meets the default Block Access outcome. [zpa.machine-tunnels.client-type-policy:machine-tunnel-needs-own-rule]

**In other policy types.** Client forwarding policy rules define when application requests are forwarded to Private Access from Zscaler Client Connector; with no matching rule the application is implicitly set to Forward to Private Access. [zpa.machine-tunnels.client-type-policy:client-forwarding-meaning] The provider documents `zpn_client_type_machine_tunnel` as a `CLIENT_TYPE` value for the v1 forwarding rule. [zpa.machine-tunnels.client-type-policy:forwarding-rule-accepts] Redirection policy rules set criteria for preferring Private Service Edges over Public Service Edges for Private Access. The Python SDK's add_redirection_rule_v2 helper accepts exactly five client type values: edge connector, branch connector, machine tunnel, zapp and zapp partner. [zpa.machine-tunnels.client-type-policy:redirection-client-types] The order between forwarding and access policy for these sessions is open [gap:zpa.machine-tunnels.client-type-policy:order-forwarding-vs-access].

**What the Terraform provider accepts.** The provider's v1 policy rule validation accepts eleven client type values, including `zpn_client_type_machine_tunnel`; it does not accept `zpn_client_type_zia_inspection`. [zpa.machine-tunnels.client-type-policy:tf-v1-client-types] The provider's v2 policy rule validation accepts twelve client type values: the eleven the v1 `validateOperand` accepts plus `zpn_client_type_zia_inspection`. [zpa.machine-tunnels.client-type-policy:tf-v2-client-types] The provider's twelve-value `supportedClientTypes` map is consulted when validating log receiver filters (the `zpn_auth_log` and `zpn_trans_log` source types); the v1 policy rule validator (`ValidateConditions`, which runs `validateOperands` on each condition, and so `validateOperand` on each operand) and the v2 validator (`ValidatePolicyRuleConditions`) check client types against their own lists. [zpa.machine-tunnels.client-type-policy:tf-lss-validator] The v2 documents disagree with that validation [divergence:zpa.machine-tunnels.client-type-policy:v2-docs-omit-machine-tunnel]. How the provider writes and loses rule fields: [What the ZPA Terraform provider sends and loses when writing policy rules](kb:zpa.terraform.policy-rule-writes).

Pairing a machine group with this client type: [Using a machine group in a ZPA policy rule](kb:zpa.machine-groups.policy-use). Posture on the same sessions: [Device posture on the ZPA machine tunnel](kb:zpa.machine-tunnels.posture).

What to check:
1. Whether an access rule selects Machine Tunnel; a rule that selects only Client Connector does not cover the tunnel.
2. Whether no rule matched, in which case access is blocked by default.
3. Which client type value the Terraform resource generation accepts, and which validator list applies.
4. What a client forwarding or redirection rule means for a machine tunnel session.
5. Which label the console shows for a client type value.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.machine-tunnels.client-type-policy:machine-tunnel-needs-own-rule] Tier B: Chain of evidence: the console lists Client Connector and Machine Tunnel as separate client types and says nothing of one standing in for the other.

Sources disagree (name both sides):
- The provider's v2 forwarding rule document leaves `zpn_client_type_machine_tunnel` out of its CLIENT_TYPE value list, while the provider's v2 validation accepts it and the v1 document lists it. [divergence:zpa.machine-tunnels.client-type-policy:v2-docs-omit-machine-tunnel]
  - tf-zpa: The v2 forwarding rule CLIENT_TYPE values are listed without machine tunnel (and with a misspelt `zpn_client_type_zappl`).
  - tf-zpa: The v2 validation list includes `zpn_client_type_machine_tunnel`.
  Impact: A reader of the v2 document would conclude machine tunnel cannot be selected in a v2 forwarding rule, which the provider's own validation contradicts.

Not known (open gaps):
- Whether client forwarding policy for a machine tunnel is evaluated before access policy [gap:zpa.machine-tunnels.client-type-policy:order-forwarding-vs-access]: settled by lab-test or source-read

Area: zpa.machine-tunnels, its subjects in references/_meta/spine/zpa/zpa.machine-tunnels.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel): An access policy can use posture profile criteria with the Machine Tunnel client type when the device runs Zscaler Client Connector 3.9 or later. [zpa.machine-tunnels.posture:policy-client-version]
- interacts-with references/_meta/text/zpa/zpa.machine-groups.policy-use.md (Using a machine group in a ZPA policy rule): In the console, when a machine group is selected in an access policy or AppProtection policy rule, the Machine Tunnel client type is also required. [zpa.machine-groups.policy-use:console-pairs-client-type]
- depends-on references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch), from zpa.machine-tunnels: With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS. [zcc.entitlements.zpa:machine-tunnel-for-all]
- depends-on references/_meta/text/zpa/zpa.machine-groups.md (ZPA machine groups), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- logged-in references/_meta/text/zpa/zpa.machine-tunnels.monitoring.md (Machine tunnel status and removal in Client Connector), from zpa.machine-tunnels: A machine tunnel's status is Active, Inactive, Removed or Unregistered. Active, the default, means connected to Private Access before user login; Removed means the configuration was deleted or deactivated in the Admin Console; Unregistered means it is no longer connected to Zscaler services or policies. [zpa.machine-tunnels.monitoring:status-values]
- depends-on references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- links-to references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/client-types.md (config type)
- see-also references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)
