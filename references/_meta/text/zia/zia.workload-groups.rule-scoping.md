# Which ZIA rules accept workload groups, and how many (zia.workload-groups.rule-scoping)
Also called: workload_groups field; workloadGroups on rules; srcWorkloadGroups; destWorkloadGroups; 255 workload groups per rule; 8 workload groups per rule; workload groups traffic capture rule; workload groups forwarding control; 1,024 workload groups; workload group limits

Three questions come up: which rules take the field, how many groups a rule can hold, and how many groups can exist.

**Which rules.** The ZIA API contract carries `workloadGroups` on the create and update bodies of four rule types: Firewall Filtering, SSL Inspection, URL Filtering and Web DLP. [zia.workload-groups.rule-scoping:contract-carriers] The help names SSL/TLS Inspection, Firewall Filtering, URL Filtering and DLP as the Internet & SaaS policies that can use a workload group as a criterion. [zia.workload-groups.rule-scoping:help-four-policies] No other ZIA rule type was found carrying `workloadGroups` in the API contract request bodies; Bandwidth Control and Cloud App Control rules, for example, do not appear. [zia.workload-groups.rule-scoping:no-other-rule-types] The Terraform provider goes further: The Terraform provider declares `workload_groups` on five rule resources: URL Filtering, Firewall Filtering, SSL Inspection, Web DLP and Traffic Capture, each with the same ID-and-name set schema. [zia.workload-groups.rule-scoping:terraform-five-carriers] Traffic Capture rules carry `workload_groups` in the Terraform provider and Go SDK, but the ZIA API contract has no traffic-capture rules path, so the contract does not confirm the field there. [zia.workload-groups.rule-scoping:traffic-capture-not-in-contract] Tooling that follows only the MCP workflow will under-count: The MCP rule-target workflow lists four carrier rule types (Cloud Firewall, URL Filtering, SSL Inspection, Web DLP) and omits Traffic Capture. [zia.workload-groups.rule-scoping:mcp-names-four]

**Forwarding.** The Terraform Forwarding Control rule resource and the API contract's forwarding rules body do not carry a workload-groups field, although the Forwarding Control policy help lists workload groups among the resources the policy references. [zia.workload-groups.rule-scoping:forwarding-control-not-in-sources] The rule type is described in [Forwarding Control rule criteria, limits and ordering](kb:zia.forwarding-control.rules). Cloud Connector forwarding is separate: Cloud Connector traffic forwarding rules have separate Source Workload Groups and Destination Workload Groups criteria, both available only when the workload discovery service is enabled; destination workload groups apply only to Cloud Connector forwarding policies and only to the Local forwarding method. [zia.workload-groups.rule-scoping:cloud-connector-source-dest]

**What an empty field means.** Selecting no workload group ignores the criterion in policy evaluation (documented for URL Filtering and SSL/TLS Inspection rules). [zia.workload-groups.rule-scoping:empty-ignores-criterion] How the criterion is combined with the rule's other criteria is in [How URL Filtering rule criteria combine](kb:zia.url-filtering.criteria) for URL Filtering.

**How many per rule.** The help documents up to 8 workload groups per rule (URL Filtering and SSL/TLS Inspection criteria text, and the ZIA ranges and limitations table). [zia.workload-groups.rule-scoping:help-8-per-rule] The Terraform provider's `workload_groups` schema allows up to 255 items (`MaxItems`) on each rule resource that declares it: URL filtering, firewall filtering, SSL inspection, DLP web and traffic capture rules. [zia.workload-groups.rule-scoping:tf-maxitems-255] The two disagree [divergence:zia.workload-groups.rule-scoping:per-rule-limit], and whether ZIA rejects more than 8 on a rule is open [gap:zia.workload-groups.rule-scoping:server-enforced-rule-limit]. This is not the 8-tags-per-group limit in [What a workload group expression can contain](kb:zia.workload-groups.expressions).

**How many groups.** The ZIA ranges and limitations table lists 1,024 workload group entries (the row carries no per-organization qualifier). [zia.workload-groups.rule-scoping:org-limit-1024] What the 64 figure under Cloud Connector Management means is open [gap:zia.workload-groups.rule-scoping:org-limit-64].

Rule changes made through Terraform follow the activation rules in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation).

What to check:
1. Which per-rule limit to plan for, since the help documents 8 and the Terraform schema allows 255; plan for 8.
2. Whether a rule that holds more than 8 workload groups is accepted, which no source shows.

Inferred, not quoted (say so when an answer rests on one):
- [zia.workload-groups.rule-scoping:no-other-rule-types] Tier B: Absence claim: a walk of every request body under the paths in zia.openapi.json for workloadGroups, srcWorkloadGroups and destWorkloadGroups found only the Firewall Filtering, SSL Inspection, URL Filtering and Web DLP rules (and Web DLP sub-rules). Terraform also carries the field on Traffic Capture; the Forwarding Control and other rules were not found with it.
- [zia.workload-groups.rule-scoping:traffic-capture-not-in-contract] Tier B: Absence claim: a search of the paths in zia.openapi.json for traffic-capture or capture rules found none; the Go SDK service and Terraform resource do carry the field.
- [zia.workload-groups.rule-scoping:forwarding-control-not-in-sources] Tier B: Absence claim: searches of resource_zia_forwarding_control_rule.go and the /forwardingRules request body in zia.openapi.json for workload found nothing. Absence in these sources does not rule out the criterion in the product.

Sources disagree (name both sides):
- The help documents 8 workload groups per rule; the Terraform provider schema allows 255. [divergence:zia.workload-groups.rule-scoping:per-rule-limit]
  - zscaler-help: A rule takes at most 8 workload groups.
  - tf-zia: The provider validates up to 255 workload groups on a rule (the shared ID-and-name set helper is called with 255).
  Impact: Plan for 8 per rule. A Terraform plan with more than 8 passes provider validation; no source shows whether the API accepts it.
  Resolved (source-rank) by zia.workload-groups.rule-scoping:help-8-per-rule: Vendor documentation states the product limit; the provider value is a schema bound. Server-side enforcement is unobserved.

Not known (open gaps):
- Whether Forwarding Control rules can use a workload group [gap:zia.workload-groups.rule-scoping:forwarding-control-criterion]: settled by lab-test or tenant-data. Blocks: stating that Forwarding Control cannot be scoped by workload group
- What the 64 workload groups limit listed under Cloud Connector Management means [gap:zia.workload-groups.rule-scoping:org-limit-64]: settled by support-ticket. Blocks: stating a single per-organization cap
- Whether ZIA rejects more than 8 workload groups on a rule [gap:zia.workload-groups.rule-scoping:server-enforced-rule-limit]: settled by lab-test. Blocks: saying a write with 9 to 255 groups fails

Area: zia.workload-groups, its subjects in references/_meta/spine/zia/zia.workload-groups.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.workload-groups.expressions.md (What a workload group expression can contain): A workload inherits the tags of its VPC, subnet, VM and network interface. When the same key appears at more than one level (for example APP on both VPC and VM), choosing the VM tag type selects the VM's value. [zia.workload-groups.expressions:hierarchical-inheritance]
- interacts-with references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine): The ZIA API contract carries `workloadGroups` on the create and update bodies of four rule types: Firewall Filtering, SSL Inspection, URL Filtering and Web DLP. [zia.workload-groups.rule-scoping:contract-carriers]
- depends-on references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit), from zia.workload-groups: The deployed workloads and their discovered tags can be viewed on the Cloud & Branch Connector Partner Integrations page in the Admin Console. [zia.workload-groups:discovered-in-cloud-connector]
- links-to references/_meta/text/zia/zia.forwarding-control.rules.md (Forwarding Control rule criteria, limits and ordering)
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/workload-groups.md (config type)
- configured-via references/_meta/text/types/zia/url-filtering-rules.md (config type)
- configured-via references/_meta/text/types/zia/firewall-filtering-rules.md (config type)
- configured-via references/_meta/text/types/zia/ssl-inspection-rules.md (config type)
- configured-via references/_meta/text/types/zia/dlp-web-rules.md (config type)
- see-also references/_meta/text/zia/zia.workload-groups.md (ZIA Workload Groups: scoping rules to cloud workloads)
