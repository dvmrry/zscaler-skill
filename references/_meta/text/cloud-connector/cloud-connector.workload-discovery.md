# AWS workload discovery for Cloud Connector: what it is and how the pieces fit (cloud-connector.workload-discovery)
Also called: workload discovery service; aws partner integrations; tag discovery service; aws account onboarding cloud connector; tag-based policy aws workloads; publicCloudInfo; aws workload discovery

This subject walks the AWS integration that lets Cloud Connector policy match workloads by tag and cloud attribute. Each step has its own subject. The workload discovery service is a Zscaler-managed service that discovers workloads in an AWS account and fetches their user-defined tags and cloud-provider-generated attributes, which are used in security policies. [cloud-connector.workload-discovery:what-it-does] AWS partner integrations, which add AWS accounts so the Zscaler service can fetch their metadata and user-defined tags can be used in policies, are enabled by contacting Zscaler Support. [cloud-connector.workload-discovery:support-enabled]

**Onboarding.** Onboarding starts in the Zscaler Admin Console; once the AWS account appears there, a configuration is created in the AWS account: create a role, update the Cloud Connector role for SQS permissions, configure EventBridge, and configure namespaces and duplicate IP addresses. [cloud-connector.workload-discovery:onboarding-order] The account record, the IAM role and the trust values are in [Onboarding an AWS account for discovery: role, external ID and trust](kb:cloud-connector.workload-discovery.aws-accounts); reading whether Zscaler can assume the role is in [AWS account permission status: Pending, Allowed, Denied, and refreshing it](kb:cloud-connector.workload-discovery.permission-status). What the CloudFormation template installs is only partly visible in the sources [gap:cloud-connector.workload-discovery:cloudformation-body].

**Which Cloud Connectors receive the tags.** Account groups tie accounts to Cloud Connector groups: [AWS account groups: which Cloud Connector groups receive an account's tags](kb:cloud-connector.workload-discovery.account-groups).

**How changes arrive.** Polling, EventBridge and the SNS and SQS delivery to Cloud Connector are in [How tag changes reach Cloud Connector: polling, EventBridge, SNS and SQS](kb:cloud-connector.workload-discovery.update-path).

**Regions and status.** Region selection, the per-region discovery status and turning data collection off are in [Workload discovery regions, per-region status, and turning data collection off](kb:cloud-connector.workload-discovery.regions).

**Overlapping addresses.** The `zs:namespace` VPC tag and duplicate IP handling are in [Namespaces and the zs:namespace VPC tag: overlapping IPs in workload discovery](kb:cloud-connector.workload-discovery.namespaces).

**Using the data.** Two discovered attributes reach beyond EC2: GroupId, the security group of the attached ENI, can identify an AWS Lambda function workload, and PlatformDetails also covers AWS Lambda and other services when not used in the context of EC2. [cloud-connector.workload-discovery:lambda-attributes] The full attribute list is [The attributes a cloud provider defines, selectable under the Attribute tag type, are GroupId, GroupName, ImageId, PlatformDetails, Vpc-id and IamInstanceProfile-Arn.](kb:zia.workload-groups.expressions:attribute-list), and workload groups built from it are in [ZIA Workload Groups: scoping rules to cloud workloads](kb:zia.workload-groups). Cloud Connector forwarding rules take source and destination workload groups only with discovery enabled: [Cloud Connector traffic forwarding rules have separate Source Workload Groups and Destination Workload Groups criteria, both available only when the workload discovery service is enabled; destination workload groups apply only to Cloud Connector forwarding policies and only to the Local forwarding method.](kb:zia.workload-groups.rule-scoping:cloud-connector-source-dest). Sublocation scopes by VPC, account or namespace, which need discovery except for the VPC Endpoint scope, are in [AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)](kb:zia.locations.workload-scopes).

**API and SDKs.** The Cloud Connector API documents the AWS account (`/publicCloudInfo`), account group (`/accountGroups`) and discovery-service (`/discoveryService`) operations under its Partner Integrations tag. [cloud-connector.workload-discovery:api-surface-generated] SDK defects on these calls are in [Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects](kb:cloud-connector.sdk-go.service-defects).

**Other clouds.** Azure and GCP partner integrations are covered in [Cloud Connector partner integration endpoints: AWS accounts in the contract, Azure and GCP outside it](kb:cloud-connector.api.partner-integrations-wire), [Cloud Connector on Azure: workload discovery service, partner configuration, event grid and account details](kb:cloud-connector.azure.workload-discovery) and [Cloud Connector on GCP: workload discovery service](kb:cloud-connector.gcp.workload-discovery).

What to check:
1. Whether Zscaler Support has enabled AWS partner integrations for the tenant before looking for missing accounts or tags.
2. Which onboarding step is missing in the AWS account: the role, the Cloud Connector role's SNS and SQS permissions, the EventBridge rule, or namespace tags.
3. Whether the account's permission status is Allowed, and whether the account sits in an account group bound to the Cloud Connector group that carries the traffic.
4. Read the operation paths, SDK functions and Terraform resources for these calls from the generated surface (`node scripts/kb.mjs surface /publicCloudInfo`) rather than from this subject.

Not known (open gaps):
- What the workload discovery CloudFormation template installs [gap:cloud-connector.workload-discovery:cloudformation-body]: settled by source-read or operator-experience. Blocks: Auditing a deployed discovery role or Cloud Connector role against what Zscaler's template grants.

Area: cloud-connector.workload-discovery, its subjects in references/_meta/spine/cloud-connector/cloud-connector.workload-discovery.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.locations.workload-scopes.md (AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)): The VPC, Namespace and Account scope types need workload discovery enabled for the tenant; the VPC Endpoint scope type does not. [zia.locations.workload-scopes:discovery-required]
- depends-on references/_meta/text/zia/zia.workload-groups.md (ZIA Workload Groups: scoping rules to cloud workloads): The feature needs a subscription to a Workload SKU and a Cloud & Branch Connector account; after subscribing, Zscaler Support must enable the Workload Discovery Service Endpoint before Workload Groups can be used. [zia.workload-groups:discovery-prerequisite]
- depends-on references/_meta/text/cloud-connector/cloud-connector.aws.iam.md (Cloud Connector on AWS: IAM for the instance, the autoscaling Lambda, and the deployer): Only when `cloud_tags_enabled` is true (default false), it adds sns:ListTopics, ListSubscriptions, Subscribe, Unsubscribe and sqs:CreateQueue, DeleteQueue on all resources, optionally narrowed by `iam_tags_condition`, for tag-change subscriptions. [cloud-connector.aws.iam:cc-tags]
- links-to references/_meta/text/cloud-connector/cloud-connector.api.partner-integrations-wire.md (Cloud Connector partner integration endpoints: AWS accounts in the contract, Azure and GCP outside it)
- links-to references/_meta/text/cloud-connector/cloud-connector.azure.workload-discovery.md (Cloud Connector on Azure: workload discovery service, partner configuration, event grid and account details)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp.workload-discovery.md (Cloud Connector on GCP: workload discovery service)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.account-groups.md (AWS account groups: which Cloud Connector groups receive an account's tags)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.aws-accounts.md (Onboarding an AWS account for discovery: role, external ID and trust)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.namespaces.md (Namespaces and the zs:namespace VPC tag: overlapping IPs in workload discovery)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.permission-status.md (AWS account permission status: Pending, Allowed, Denied, and refreshing it)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.regions.md (Workload discovery regions, per-region status, and turning data collection off)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.update-path.md (How tag changes reach Cloud Connector: polling, EventBridge, SNS and SQS)
- links-to references/_meta/text/zia/zia.workload-groups.expressions.md (What a workload group expression can contain)
- links-to references/_meta/text/zia/zia.workload-groups.rule-scoping.md (Which ZIA rules accept workload groups, and how many)
