# AWS account groups: which Cloud Connector groups receive an account's tags (cloud-connector.workload-discovery.account-groups)
Also called: aws account group; ztc_account_groups; cloudConnectorGroups account group; tags from multiple aws accounts; cloud connector not getting tags from spoke account; zero trust gateway aws tags

AWS account groups make Cloud Connector aware of other accounts it can get workload tags from, so a Cloud Connector is not tied to the account where it is deployed; a group can link all accounts to a single Cloud Connector group. [cloud-connector.workload-discovery.account-groups:purpose] Using AWS tags with Zero Trust Gateways requires AWS account groups, which associate the accounts in a group with a Zero Trust Gateway. [cloud-connector.workload-discovery.account-groups:ztg-requires-groups]

**Binding.** An account group is associated with one or more Cloud Connector groups, selected when the group is added and changeable on its details page, where they are described as the Cloud Connector groups the tag information is sent to. [cloud-connector.workload-discovery.account-groups:group-binds-cc-groups] An account joins a group either through the optional Account Group field when the account is added, or by being selected from the account table when the group is added. [cloud-connector.workload-discovery.account-groups:account-joins-group] What a Cloud Connector group in no account group receives is not stated [gap:cloud-connector.workload-discovery.account-groups:unbound-cc-group].

**Mixed status.** The group's details page lists each member account with its own permission status: Allowed, Denied or Pending. [cloud-connector.workload-discovery.account-groups:group-shows-permission] One group can therefore hold accounts in different permission states at the same time. [cloud-connector.workload-discovery.account-groups:mixed-states] Which accounts actually yield tags follows from their status: [Tags are discovered for an Allowed account; a Denied account, whose role the service cannot assume, yields no tags for its workloads.](kb:cloud-connector.workload-discovery.permission-status:denied-no-tags).

**Limit.** An organization can create at most 128 AWS account groups. [cloud-connector.workload-discovery.account-groups:max-128]

What to check:
1. Whether the Cloud Connector group that carries the workload traffic is selected on an account group that holds the workload's AWS account.
2. Whether each account in the group shows Allowed rather than Pending or Denied.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.workload-discovery.account-groups:mixed-states] Tier B: Follows from the status being listed per member account; the help does not say so in words.

Not known (open gaps):
- Tag visibility of a Cloud Connector group that is in no account group [gap:cloud-connector.workload-discovery.account-groups:unbound-cc-group]: settled by lab-test or support-ticket. Blocks: Explaining a tag-based rule that never matches on a Cloud Connector group with no account group.

Area: cloud-connector.workload-discovery, its subjects in references/_meta/spine/cloud-connector/cloud-connector.workload-discovery.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.aws.iam.md (Cloud Connector on AWS: IAM for the instance, the autoscaling Lambda, and the deployer), from cloud-connector.workload-discovery: Only when `cloud_tags_enabled` is true (default false), it adds sns:ListTopics, ListSubscriptions, Subscribe, Unsubscribe and sqs:CreateQueue, DeleteQueue on all resources, optionally narrowed by `iam_tags_condition`, for tag-change subscriptions. [cloud-connector.aws.iam:cc-tags]
- scoped-by references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling): An account group is associated with one or more Cloud Connector groups, selected when the group is added and changeable on its details page, where they are described as the Cloud Connector groups the tag information is sent to. [cloud-connector.workload-discovery.account-groups:group-binds-cc-groups]
- interacts-with references/_meta/text/cloud-connector/cloud-connector.overview.zero-trust-gateways.md (Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available): Using AWS tags with Zero Trust Gateways requires AWS account groups, which associate the accounts in a group with a Zero Trust Gateway. [cloud-connector.workload-discovery.account-groups:ztg-requires-groups]
- depends-on references/_meta/text/cloud-connector/cloud-connector.workload-discovery.aws-accounts.md (Onboarding an AWS account for discovery: role, external ID and trust): An account joins a group either through the optional Account Group field when the account is added, or by being selected from the account table when the group is added. [cloud-connector.workload-discovery.account-groups:account-joins-group]
- interacts-with references/_meta/text/zia/zia.locations.workload-scopes.md (AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)), from cloud-connector.workload-discovery: The VPC, Namespace and Account scope types need workload discovery enabled for the tenant; the VPC Endpoint scope type does not. [zia.locations.workload-scopes:discovery-required]
- depends-on references/_meta/text/zia/zia.workload-groups.md (ZIA Workload Groups: scoping rules to cloud workloads), from cloud-connector.workload-discovery: The feature needs a subscription to a Workload SKU and a Cloud & Branch Connector account; after subscribing, Zscaler Support must enable the Workload Discovery Service Endpoint before Workload Groups can be used. [zia.workload-groups:discovery-prerequisite]
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.permission-status.md (AWS account permission status: Pending, Allowed, Denied, and refreshing it)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/account-groups.md (config type)
