# Cloud Connector traffic forwarding rule order, status, rank and rule type (cloud-connector.forwarding.rule-order)
Also called: cloud connector forwarding rule order; ecRdr rule order; cloud connector rule precedence; cloud connector admin rank; EC_RDR; cloud connector disabled forwarding rule
Former IDs: cloud-connector-10

The Zscaler service evaluates traffic forwarding rules in ascending numerical order (Rule 1 before Rule 2), and a rule's order setting is its place in that order. [cloud-connector.forwarding.rule-order:ascending] When a rule is disabled the service skips it and moves to the next one, but the rule keeps its place in the rule order. [cloud-connector.forwarding.rule-order:disabled-keeps-place] Whether evaluation stops at the first matching rule is not stated in the Cloud & Branch Connector help [gap:cloud-connector.forwarding.rule-order:first-match].

Where the predefined Internet & SaaS default rule sits relative to custom rules is not stated either [gap:cloud-connector.forwarding.rule-order:default-position]; the predefined rules themselves are in [Predefined Cloud Connector traffic forwarding rules](kb:cloud-connector.forwarding.predefined-rules).

**Name.** A rule name is generated automatically and can be changed; its maximum length is 31 characters. [cloud-connector.forwarding.rule-order:name-31]

**Rank.** The Go SDK and the API contract disagree on whether a forwarding rule's rank applies to Cloud & Branch Connector at all [divergence:cloud-connector.forwarding.rule-order:rank-applicability]. Whether rank limits the editable rule order, as it does in ZIA, and how many forwarding rules a tenant may hold, are open [gap:cloud-connector.forwarding.rule-order:rank-and-rule-limit].

**Rule type.** The API contract says all traffic forwarding rules are assigned the `EC_RDR` type by default. [cloud-connector.forwarding.rule-order:type-ec-rdr]

How the Terraform provider writes rank and order on every update, and how it can report success with rules out of order, is in [How the ZTC (Cloud Connector) Terraform provider applies rule order](kb:cloud-connector.terraform.rule-order).

What to check:
1. The rule's order and status: a disabled rule is skipped but keeps its slot.
2. Whether the rule order in the tenant matches the declared order after a Terraform apply.

Sources disagree (name both sides):
- Whether the `rank` member of a traffic forwarding rule applies to Cloud & Branch Connector. [divergence:cloud-connector.forwarding.rule-order:rank-applicability]
  - sdk-go: The Go SDK's ZTW forwarding rule model describes `Rank` as the admin rank assigned to the forwarding rule.
  - api-specs: The API contract describes the `rank` member of the traffic forwarding rule request as not applicable to Cloud & Branch Connector.
  Impact: Reasoning that a Cloud Connector forwarding rule's rank constrains its order, as admin rank does for ZIA rules, rests on the SDK comment alone; the contract says the member does not apply.

Not known (open gaps):
- Whether traffic forwarding evaluation stops at the first matching rule [gap:cloud-connector.forwarding.rule-order:first-match]: settled by source-read or lab-test. Blocks: deterministic answers about which forwarding rule handled a flow
- Position of the predefined default Internet & SaaS forwarding rule [gap:cloud-connector.forwarding.rule-order:default-position]: settled by tenant-data or source-read. Blocks: answering what happens to traffic no custom rule matches
- Forwarding rule count limit and whether rank gates rule order [gap:cloud-connector.forwarding.rule-order:rank-and-rule-limit]: settled by support-ticket or lab-test. Blocks: capacity planning and admin-rank questions for forwarding rules

Area: cloud-connector.forwarding, its subjects in references/_meta/spine/cloud-connector/cloud-connector.forwarding.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/cloud-connector/cloud-connector.forwarding.predefined-rules.md (Predefined Cloud Connector traffic forwarding rules), from cloud-connector.forwarding: A default forwarding rule with a default gateway is predefined for Internet & SaaS: each tenant comes with a default rule that forwards internet-bound traffic to Internet & SaaS using automatically selected gateways. [cloud-connector.forwarding.predefined-rules:default-zia]
- reached-via references/_meta/text/cloud-connector/cloud-connector.aws.traffic-steering.md (Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint), from cloud-connector.forwarding: The workload route is a 0.0.0.0/0 destination whose target is, for non-GWLB deployments, the network interface of the Cloud Connector service interface and, for GWLB deployments, the Gateway Load Balancer endpoint. [cloud-connector.aws.traffic-steering:route-targets]
- interacts-with references/_meta/text/cloud-connector/cloud-connector.dns.md (Cloud & Branch Connector DNS handling: DNS policies and DNS gateways), from cloud-connector.forwarding: Rules with wildcard domains or FQDNs need the workloads' DNS queries routed through the Cloud or Branch Connector; for HTTP/HTTPS traffic DNS is not required, but UDP and non-web traffic require it. [cloud-connector.forwarding.criteria:dns-required]
- decided-by references/_meta/text/cloud-connector/cloud-connector.forwarding.criteria.md (Cloud Connector forwarding rule criteria: scope, services, sources, destinations, FQDNs), from cloud-connector.forwarding: A rule can name up to 8 locations or sublocations; with none it applies to all locations. On the ZIA-method form, a rule uses either Location/Sublocation or Cloud & Branch Connector Groups, not both. [cloud-connector.forwarding.criteria:location-or-groups]
- decided-by references/_meta/text/cloud-connector/cloud-connector.forwarding.methods.md (Cloud Connector forwarding methods: ZIA, ZPA, Direct, Drop, Local, and their API tokens), from cloud-connector.forwarding: The Traffic Forwarding page shows each rule's forwarding method as one of Direct, ZIA, ZPA, Drop, or Local. [cloud-connector.forwarding.methods:console-methods]
- logged-in references/_meta/text/cloud-connector/cloud-connector.logs.session-records.md (Cloud Connector session records: aggregation and rule attribution), from cloud-connector.forwarding: A session record can name two rules: the redirect (traffic forwarding) rule applied to the transaction, and the Cloud or Branch Connector self-rule applied to it. [cloud-connector.logs.session-records:rule-fields]
- interacts-with references/_meta/text/cloud-connector/cloud-connector.overview.gateway-failover.md (Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open), from cloud-connector.forwarding: The default gateway configuration fails closed: internet-bound workload traffic is dropped if none of the Cloud Connectors in the same group can establish connectivity to any Internet & SaaS Service Edge. [cloud-connector.overview.gateway-failover:fail-close-default]
- scoped-by references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling), from cloud-connector.forwarding: A rule can name up to 32 Cloud or Branch Connector groups; with none it applies to all groups. [cloud-connector.forwarding.criteria:groups-32]
- scoped-by references/_meta/text/zia/zia.workload-groups.rule-scoping.md (Which ZIA rules accept workload groups, and how many), from cloud-connector.forwarding: Cloud Connector traffic forwarding rules have separate Source Workload Groups and Destination Workload Groups criteria, both available only when the workload discovery service is enabled; destination workload groups apply only to Cloud Connector forwarding policies and only to the Local forwarding method. [zia.workload-groups.rule-scoping:cloud-connector-source-dest]
- logged-in references/_meta/text/types/ztw/session-log.md (Cloud & Branch Connector Session log (NSS feed)), from cloud-connector.forwarding: A session record can name two rules: the redirect (traffic forwarding) rule applied to the transaction, and the Cloud or Branch Connector self-rule applied to it. [cloud-connector.logs.session-records:rule-fields]
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.rule-order.md (How the ZTC (Cloud Connector) Terraform provider applies rule order)
