# What a workload group expression can contain (zia.workload-groups.expressions)
Also called: expressionJson; expression_json; expressionContainers; tagContainer; tagType; workload group operators; OPEN_PARENTHESES; CLOSE_PARENTHESES; workload tag types; 8 tags per workload group; Vpc-id attribute; tag scope; workload group expression string
Former IDs: zia-69

An expression has a nested structure, a set of tag types, and a limit.

**Shape.** The structured form (`expressionJson`) holds a list of `expressionContainers`; each container has a `tagType`, an `operator`, and a `tagContainer`, and the tag container holds a list of `tags` (each a `key` and `value`) plus its own `operator`. [zia.workload-groups.expressions:json-nesting] The container-level operator creates the logical relationship among tag types; the tag-container operator combines the tags within one tag type. [zia.workload-groups.expressions:operator-roles] In the console, tags of one tag scope and type are joined by an inner AND or OR, and different scopes and types by an outer AND or OR; Show Expression displays the result as a two-dimensional table with a single operator in each row and column. [zia.workload-groups.expressions:console-and-or] A documented expression is VM[(Environment = Prod) OR (SecurityGroup = Load Balancer)] AND VPC[(Region = Europe)]; the first line of each workload group expression is always defined by a tag type followed by suitable key-value pairs. [zia.workload-groups.expressions:example]

**Tag types.** The API contract's `tagType` values are ANY, VPC, SUBNET, VM, ENI and ATTR. [zia.workload-groups.expressions:tag-type-enum] The console names four resource tag types (Network Interface, Subnet, VM, VPC) plus Attribute as a fifth tag type, and a Tag Scope of Cloud-Defined, User-Defined or Any. Cloud-Defined scope selects Attribute automatically; User-Defined offers the four resource types. [zia.workload-groups.expressions:console-tag-types] The API values VPC, SUBNET, VM, ENI and ATTR correspond to the console's VPC, Subnet, VM, Network Interface and Attribute tag types. [zia.workload-groups.expressions:enum-name-mapping] What `ANY` itself means is open [gap:zia.workload-groups.expressions:any-tag-type-meaning].

**Attributes and inheritance.** The attributes a cloud provider defines, selectable under the Attribute tag type, are GroupId, GroupName, ImageId, PlatformDetails, Vpc-id and IamInstanceProfile-Arn. [zia.workload-groups.expressions:attribute-list] Vpc-id as an Attribute needs the VPC ID given by AWS as the value, but Vpc-id as a key under the VPC resource tag type accepts any user-defined value. [zia.workload-groups.expressions:vpc-id-two-meanings] A workload inherits the tags of its VPC, subnet, VM and network interface. When the same key appears at more than one level (for example APP on both VPC and VM), choosing the VM tag type selects the VM's value. [zia.workload-groups.expressions:hierarchical-inheritance]

**Operators.** The API contract allows four operator values at both levels: AND, OR, OPEN_PARENTHESES and CLOSE_PARENTHESES, even though the field description says only "either AND or OR". The parentheses values are therefore part of the API contract, not a Terraform-only addition. [zia.workload-groups.expressions:operator-enum-includes-parentheses] What the parentheses do is open [gap:zia.workload-groups.expressions:parentheses-semantics].

**Limit.** A workload group can hold at most 8 key-value pairs in total, regardless of how many tag types are used. [zia.workload-groups.expressions:max-8-tags] The per-rule limit is a different number: [Which ZIA rules accept workload groups, and how many](kb:zia.workload-groups.rule-scoping).

**Two fields, one expression.** The API carries the expression twice: `expression` as a string and `expressionJson` as the structured form. Terraform's resource declares `expression_json` as an optional attribute, and its data source declares `expression` as a computed string. [zia.workload-groups.expressions:string-and-json-fields] Whether the two stay in step is open [gap:zia.workload-groups.expressions:expression-string-sync].

**What is not known.** How the expression is evaluated against live traffic is open [gap:zia.workload-groups.expressions:runtime-evaluation].

What to check:
1. Whether Show Expression explains how traffic is matched, given that it displays only the expression table.
2. Whether an expression that uses parentheses is accepted by the API and Terraform, given that the field descriptions and console help name only AND and OR.

Inferred, not quoted (say so when an answer rests on one):
- [zia.workload-groups.expressions:enum-name-mapping] Tier B: Derived from name correspondence between the contract enum and the console tag types; no source states the mapping, and how ANY relates to the console's Any scope is not stated.

Not known (open gaps):
- How ZIA evaluates an expression against live workload traffic [gap:zia.workload-groups.expressions:runtime-evaluation]: settled by lab-test or support-ticket. Blocks: answering whether a given workload matches a group when an expression mixes AND and OR across tag types
- What OPEN_PARENTHESES and CLOSE_PARENTHESES do [gap:zia.workload-groups.expressions:parentheses-semantics]: settled by lab-test or support-ticket. Blocks: writing expressions with explicit grouping through the API
- Whether the expression string follows expressionJson on write [gap:zia.workload-groups.expressions:expression-string-sync]: settled by lab-test. Blocks: relying on `expression` after writing only `expressionJson`, or the reverse
- What the ANY tag type matches and how it relates to the console's Any scope [gap:zia.workload-groups.expressions:any-tag-type-meaning]: settled by lab-test or tenant-data. Blocks: stating the meaning of `tagType: ANY` rather than only listing it

Area: zia.workload-groups, its subjects in references/_meta/spine/zia/zia.workload-groups.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit): Membership comes from cloud-native metadata: workloads with user-defined tags and provider-defined attributes that match the group's expression belong to the group, and their traffic is forwarded by Cloud Connectors to the Zero Trust Exchange where the selected policies apply. [zia.workload-groups:cloud-metadata-source]
- links-to references/_meta/text/zia/zia.workload-groups.rule-scoping.md (Which ZIA rules accept workload groups, and how many)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/workload-groups.md (config type)
- see-also references/_meta/text/zia/zia.workload-groups.api-surface.md (Reading and writing workload groups: API, SDKs, Terraform, MCP)
- see-also references/_meta/text/zia/zia.workload-groups.md (ZIA Workload Groups: scoping rules to cloud workloads)
