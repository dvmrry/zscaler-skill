# Cloud Connector rule endpoints on the wire: which forwarding and DNS rule fields each client sends (cloud-connector.api.rules-wire)
Also called: ecRules ecRdr; ecRules ecDns; ztw forwarding rule api fields; destWorkloadGroups; srcWorkloadGroups; ztw dns rule action enum; REDIR_RES; zpaAppSegments
Former IDs: cloud-connector-23

Traffic forwarding rules (`/ecRules/ecRdr`), DNS rules (`/ecRules/ecDns`) and log and control rules (`/ecRules/self`) share one rule shape, but the contract, the two SDKs and the Terraform provider each model a different subset of it. Paths and field lists are generated; this subject records where the clients disagree with the contract.

## Enumerated fields

In the Go SDK the forwarding rule's `Type` and `ForwardMethod` and the DNS rule's `Action` are plain strings. The supported values of `Type` and `ForwardMethod` appear only in doc comments; the `Action` comment lists no values. [cloud-connector.api.rules-wire:go-enums-are-comments] The forwarding method values each source lists, and which token the console's Local method uses, are in [The API contract lists eight `forwardMethod` values for creating or updating a traffic forwarding rule (INVALID, DIRECT, PROXYCHAIN, ZIA, ZPA, ECZPA, ECSELF, DROP); rules read back may also carry ENATDEDIP and GEOIP. LOCAL_SWITCH is not among the request values.](kb:cloud-connector.forwarding.methods:contract-enums) and [cloud-connector.forwarding.methods:local-token](kb:cloud-connector.forwarding.methods:local-token), with the open question of which values the API accepts in [Meaning of ENATDEDIP, GEOIP and PROXYCHAIN on Cloud Connector rules, and the accepted forwardMethod set](kb:cloud-connector.forwarding.methods:method-semantics). The rule `type` field is separate from the method: [The API contract says all traffic forwarding rules are assigned the `EC_RDR` type by default.](kb:cloud-connector.forwarding.rule-order:type-ec-rdr).

## Forwarding rule fields

Workload group criteria are sent by some clients and absent from the contract [divergence:cloud-connector.api.rules-wire:workload-groups]. Whether destination workload groups are accepted, and only on Local rules, is open [gap:cloud-connector.api.rules-wire:local-switch-acceptance]; whether `LOCAL_SWITCH` is the Local method's API value is open in [Whether LOCAL_SWITCH is the API value of the console's Local forwarding method](kb:cloud-connector.terraform.forwarding-rules:local-switch-wire-value).

The contract and the Go SDK name the ZPA application segment list differently on a write [divergence:cloud-connector.api.rules-wire:zpa-segments-key].

The source IP group exclusion flag is covered in [The API contract's forwarding rule create body has no `sourceIpGroupExclusion` member.](kb:cloud-connector.source-ip-groups.rule-use:exclusion-not-in-forwarding-contract) and [The ZTC provider's `ztc_traffic_forwarding_rule` exposes an optional boolean `source_ip_group_exclusion` ('Source IP groups that must be excluded from the rule application') and copies it into the SDK request.](kb:cloud-connector.source-ip-groups.rule-use:exclusion-terraform-sends), with the open question in [What the API does with sourceIpGroupExclusion on a Cloud Connector forwarding rule](kb:cloud-connector.source-ip-groups.rule-use:exclusion-applicability). The contract's forwarding rule create body describes both `srcIpv6Groups` and `destIpv6Groups` as not applicable to Cloud & Branch Connector, while the Go SDK's forwarding rule still carries both fields. [cloud-connector.api.rules-wire:ipv6-groups-not-applicable]

## DNS rule fields

The DNS rule actions differ between the contract (eleven) and Terraform (four): [The API contract lists eleven DNS rule `action` values: ALLOW, BLOCK, REDIR_REQ, REDIR_RES, REDIR_ZPA, REDIR_REQ_DOH, REDIR_REQ_KEEP_SENDER, REDIR_REQ_TCP, REDIR_REQ_UDP, BLOCK_WITH_RESPONSE and BLOCK_WITH_EUN.](kb:cloud-connector.dns.policies:contract-actions), [A DNS rule using any of the seven other contract actions (including REDIR_RES and the DoH, TCP and UDP redirects) cannot be written through the Terraform resource.](kb:cloud-connector.dns.policies:tf-subset); whether one of them is the help's overwrite-DNS-response action is open in [Whether "overwriting DNS responses" is the REDIR_RES action](kb:cloud-connector.dns.policies:response-overwrite).

The contract's DNS rule body has a `zpaIpGroup` reference, which the forwarding rule body does not have; the forwarding rule body takes ZPA application segments instead. [cloud-connector.api.rules-wire:dns-rule-zpa-ip-group] The ZTC provider accepts that block but never sends it: [The DNS forwarding-rule resource accepts a `zpa_ip_group` block (documented as applying to the `REDIR_ZPA` action) but never uses it. The request builder does not set the SDK's `ZPAIPGroup` field and the read path does not set `zpa_ip_group` in state, although the SDK model has the field and the matching data source does read it. A configured value is accepted by the schema and silently ignored on create and update, and a value present on the server never appears in state.](kb:cloud-connector.terraform.provider-behavior:dns-rule-zpa-ip-group-dropped).

What to check:
1. Whether a rule criterion a client sets (workload groups, ZPA segments) is one the contract lists for the write, before trusting that the API applied it.

Sources disagree (name both sides):
- Which sources carry source and destination workload groups on a traffic forwarding rule. [divergence:cloud-connector.api.rules-wire:workload-groups]
  - api-specs: The contract's create and update bodies for a forwarding rule have neither `srcWorkloadGroups` nor `destWorkloadGroups`.
  - sdk-go: The Go SDK's forwarding rule has `srcWorkloadGroups` only.
  - sdk-python: The Python SDK maps `src_workload_groups_ids` and `dest_workload_groups_ids` to `srcWorkloadGroups` and `destWorkloadGroups` in the request body, and documents the destination list as valid for the `LOCAL_SWITCH` forward method.
  - sdk-python: The Python accessor's docstring ties destination workload groups to `LOCAL_SWITCH`.
  - tf-ztc: The ZTC provider sends `src_workload_groups` as the SDK's `SrcWorkloadGroups`; the Go model it uses has no destination field.
  - zscaler-help: The console offers source workload groups on rules of several methods and destination workload groups only for the Local method.
  Impact: The console and the Python SDK show that destination workload groups exist, but the contract documents neither list and the Go SDK and Terraform cannot send a destination list; a destination-workload-group rule can be written only through the Python SDK or a raw call, and no source shows the API's handling of either key.
- Under which keys a forwarding rule write carries ZPA application segments and segment groups. [divergence:cloud-connector.api.rules-wire:zpa-segments-key]
  - api-specs: The contract's create and update bodies carry `zpaAppSegments` and neither `zpaApplicationSegments` nor `zpaApplicationSegmentGroups`; those two appear only in the rule as read back.
  - api-specs: The contract's rule listing returns `zpaApplicationSegments`.
  - sdk-go: The Go SDK, which the ZTC provider uses, writes the segments as `zpaApplicationSegments`, a field it documents as applicable only to the ECZPA method.
  - sdk-go: The Go SDK also writes segment groups as `zpaApplicationSegmentGroups`.
  - sdk-python: The Python SDK documents `zpa_app_segments` for rule writes and maps it to `zpaAppSegments`, the contract's key; it also maps `zpa_application_segments` and `zpa_application_segment_groups` to the read-back keys.
  - sdk-python: The Python accessor's docstring names `zpa_app_segments` as the rule's ZPA application segments.
  Impact: A Python caller using the documented `zpa_app_segments` sends the contract's key; a Go or Terraform write sends `zpaApplicationSegments` and `zpaApplicationSegmentGroups`, which the contract lists only in responses. Either the contract's request schema is incomplete or those writes use keys the API does not read on write; no source shows which, so an ECZPA rule written through Go or Terraform should be read back to confirm its segments.

Not known (open gaps):
- Whether the API accepts destination workload groups on a forwarding rule, and only on Local rules [gap:cloud-connector.api.rules-wire:local-switch-acceptance]: settled by lab-test. Blocks: building Local forwarding rules with destination workload groups through the API

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules)
- links-to references/_meta/text/cloud-connector/cloud-connector.forwarding.methods.md (Cloud Connector forwarding methods: ZIA, ZPA, Direct, Drop, Local, and their API tokens)
- links-to references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.rule-use.md (Which Cloud Connector rules take source IP groups, and how the source criterion behaves)
- links-to references/_meta/text/cloud-connector/cloud-connector.forwarding.rule-order.md (Cloud Connector traffic forwarding rule order, status, rank and rule type)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
