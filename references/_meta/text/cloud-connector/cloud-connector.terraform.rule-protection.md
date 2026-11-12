# Whether the ZTC Terraform provider protects predefined traffic rules (cloud-connector.terraform.rule-protection)
Also called: terraform destroy predefined rule; cannot be deleted predefined rule; validatePredefinedRules; delete default forwarding rule terraform; ztc_traffic_forwarding_rule destroy; ZPA Resolver rule deleted

The ZTC provider has validators that reject deleting a few named traffic rules, but they match by name and are not on the delete path. The forwarding-rule and DNS-rule resources each define a validator that rejects deletion of a rule only when its name is one of a short hard-coded list (for forwarding rules, six names such as "ZPA Forwarding Rule" and "Client Connector to ZPA"; for DNS rules, two). The validators test the name only, not any default or predefined flag on the rule. [cloud-connector.terraform.rule-protection:guards-match-fixed-names] The log-forwarding validator tests for the same two names as the DNS-rule validator ("ZPA Resolver" and "Redirect Resolution of Zscaler Domains to WAN CTR") and for no other name. [cloud-connector.terraform.rule-protection:log-guard-uses-dns-names]

**Delete paths.** The forwarding-rule Delete reads the rule ID and sends the API delete. It does not fetch the rule and does not call validatePredefinedRules. [cloud-connector.terraform.rule-protection:forwarding-delete-skips-guard] In the DNS-rule Delete, the code that fetches the rule and calls validatePredefinedDNSRules is commented out, and the function goes on to send the API delete. [cloud-connector.terraform.rule-protection:dns-delete-guard-commented-out] In the log-rule Delete, the code that fetches the rule and calls validatePredefinedLogRules is commented out, and the function goes on to send the API delete. [cloud-connector.terraform.rule-protection:log-delete-guard-commented-out] The three traffic-rule resources never read the rule's default or predefined flag. Only the log-rule data source copies default_rule into state. [cloud-connector.terraform.rule-protection:resources-ignore-default-flag]

**Destroying a managed predefined rule.** A terraform destroy, or removing the resource block, of a predefined traffic rule that is under management (for example after an import) sends the API delete for it with no provider-side refusal, for forwarding, DNS and log rules alike. [cloud-connector.terraform.rule-protection:destroy-sends-delete-for-protected-rules] Whether the API itself refuses is open [gap:cloud-connector.terraform.rule-protection:api-predefined-delete].

Rule position and reordering behavior is a separate matter, covered for the ZIA provider in [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order).

What to check:
1. Which rules in the plan are predefined or default rules, before any destroy or resource-block removal in a configuration that manages Cloud Connector traffic rules: list the rule IDs in the plan.
2. Whether each rule's `defaultRule` or `predefined` flag is set, checked through the console or API, since the three resources never read that flag.
3. Whether the validators' fixed names match the predefined rules on the tenant, since they test the name only.
4. Whether a destroy of a predefined rule would be refused, since the provider sends the delete without a check and the API's answer is open.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.terraform.rule-protection:forwarding-delete-skips-guard] Tier B: Rests on the absence of a call. Read the whole body of resourceTrafficForwardingRuleDelete and searched for validatePredefined across ztc/ at v0.2.0 and HEAD: the validator appears only at its definition in the forwarding-rule, DNS-rule and log-rule resource files, and (as comments) in the DNS and log Delete functions. The same search at other tags was not run.
- [cloud-connector.terraform.rule-protection:resources-ignore-default-flag] Tier B: Rests on an absence. Searched ztc/ at v0.2.0 and HEAD, case-insensitively, for DefaultRule, default_rule, Predefined and predefined, including schema keys and expand/flatten functions: the only reads are in the log-rule data source; other hits are comments and the name validators. The SDK rule models do carry these fields; the provider resources never read them.
- [cloud-connector.terraform.rule-protection:destroy-sends-delete-for-protected-rules] Tier C: Depends on the rule being in state (a predefined rule enters a resource's state by import, since Terraform did not create it), and on the API then accepting the delete. Whether the API refuses to delete predefined rules is not known from the provider code (gap api-predefined-delete). If the API refuses, the apply fails with the API's error instead of the provider's, and the protection is the server's alone.

Not known (open gaps):
- Whether the ZTC API refuses to delete predefined traffic rules [gap:cloud-connector.terraform.rule-protection:api-predefined-delete]: settled by lab-test. Blocks: saying whether an unguarded delete removes a predefined rule or only returns an error
- Names of the predefined log-forwarding rules [gap:cloud-connector.terraform.rule-protection:predefined-log-rule-names]: settled by lab-test. Blocks: saying whether the log-rule validator would protect any real log rule if it were called

Area: cloud-connector.terraform, its subjects in references/_meta/spine/cloud-connector/cloud-connector.terraform.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules): The default rule allows all DNS traffic and always keeps the lowest precedence; its action can be modified but it cannot be deleted. It is listed as the Default Connector DNS Rule, the catch-all that permits all queries. [cloud-connector.dns.policies:default-rule]
- interacts-with references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud): A default Log and Control Forwarding rule with a default gateway action is created automatically, and it cannot be duplicated or deleted. [cloud-connector.forwarding.log-and-control:default-rule]
- interacts-with references/_meta/text/cloud-connector/cloud-connector.forwarding.predefined-rules.md (Predefined Cloud Connector traffic forwarding rules): A default forwarding rule with a default gateway is predefined for Internet & SaaS: each tenant comes with a default rule that forwards internet-bound traffic to Internet & SaaS using automatically selected gateways. [cloud-connector.forwarding.predefined-rules:default-zia]
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/forwarding-rules.md (config type)
- configured-via references/_meta/text/types/ztw/traffic-dns-rules.md (config type)
- configured-via references/_meta/text/types/ztw/traffic-log-rules.md (config type)
