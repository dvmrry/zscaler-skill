# Onboarding an AWS account for discovery: role, external ID and trust (cloud-connector.workload-discovery.aws-accounts)
Also called: aws account external id; trusted account id; trusted role zscaler; generate external id; cloudformation template workload discovery; discovery role permissions; ztc_public_cloud_info external_id; workloadDiscoverySettings

Adding an AWS account records the Zscaler side of a cross-account role trust; the AWS side is a role the operator deploys. An account records the AWS account ID where workloads are deployed, the name of the AWS trusting role in that account, an external ID, the name of the event bus in the Zscaler account that is the target of events from the operator's account, the Trusted Account ID (the ID of the Zscaler AWS account) and the Trusted Role (the name of the trusted role in the Zscaler AWS account). [cloud-connector.workload-discovery.aws-accounts:account-fields]

**External ID.** The external ID is the one in the trust relationship of the IAM role that Zscaler uses when fetching tag information. It must be added to the AWS IAM role configuration, and if it is regenerated it must be updated in the AWS account. [cloud-connector.workload-discovery.aws-accounts:external-id-must-be-in-role] The API contract states the account's external ID must be unique across organizations (two organizations cannot use the same one), may be shared by multiple accounts within one organization, is 2 to 128 characters long, and may contain letters, numbers and the symbols + = , . @ : / and -. [cloud-connector.workload-discovery.aws-accounts:external-id-rules] The help asks for a unique ID per account while the API allows accounts in one organization to share one [divergence:cloud-connector.workload-discovery.aws-accounts:external-id-uniqueness]. The API can create an external ID for an AWS account: the request carries the AWS account ID and role name and the response is the external ID as a string. The Python SDK reads that reply as plain text. [cloud-connector.workload-discovery.aws-accounts:generate-external-id]

**External ID in Terraform.** In the ZTC provider's `ztc_public_cloud_info` resource, `external_id` is computed only, both at the top level and inside `account_details`, and the request builder copies the top-level value from state into the request. [cloud-connector.workload-discovery.aws-accounts:terraform-external-id-computed] A Terraform configuration therefore cannot choose the external ID, and the first create sends none: state holds an empty value, and the SDK field is tagged `omitempty`, so it is left out of the body. Later updates send the value read back from the API. [cloud-connector.workload-discovery.aws-accounts:terraform-cannot-choose-external-id] Whether the API then assigns an ID on its own is not shown [gap:cloud-connector.workload-discovery.aws-accounts:external-id-on-create].

**The role.** The role can be created either by selecting Launch Cloudformation template in AWS console while adding the AWS account in the Admin Console, or manually. [cloud-connector.workload-discovery.aws-accounts:role-via-cloudformation-or-manual] Creating the role needs the trusted role, the external ID and these permissions: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeInstances and ec2:DescribeNetworkInterfaces, with ec2:DescribeIamInstanceProfileAssociations and ec2:DescribeVpcEndpoints listed as optional. [cloud-connector.workload-discovery.aws-accounts:role-permissions] After the account details are saved, the CloudFormation template is either launched in the AWS console, where it appears with values from the Admin Console and must be confirmed and executed, or downloaded to run later when the Zscaler admin cannot execute it in AWS. The account is onboarded once the template has been executed. [cloud-connector.workload-discovery.aws-accounts:cloudformation-launch-or-download]

**The template by API.** The API returns the CloudFormation template URL; with the optional `awsAccountId` query parameter the URL is customized with account-specific values, otherwise a generic template URL is returned. [cloud-connector.workload-discovery.aws-accounts:template-url-endpoint] Both SDKs read the template URL as text rather than JSON; the Python SDK's comment says the endpoint returns a plain-text URL even though the Content-Type is application/json. [cloud-connector.workload-discovery.aws-accounts:template-url-plain-text]

**Zscaler's side of the trust.** The workload discovery settings read returns the Zscaler side of the trust: the ID of the Zscaler AWS account required in the AWS trust policy and the name of the trusted role in that account. [cloud-connector.workload-discovery.aws-accounts:trust-settings-endpoint] The Go SDK reads that response as a list while the contract describes one object [divergence:cloud-connector.workload-discovery.aws-accounts:trust-settings-shape].

**Limits and logging.** An organization can create at most 512 AWS accounts. [cloud-connector.workload-discovery.aws-accounts:max-512] The Python SDK documents `cloudWatchGroupArn` in the account details as the CloudWatch log group ARN and says to use "DISABLED" to disable it. [cloud-connector.workload-discovery.aws-accounts:cloudwatch-disabled]

Whether Zscaler can then assume the role, and how that status is read, is in [AWS account permission status: Pending, Allowed, Denied, and refreshing it](kb:cloud-connector.workload-discovery.permission-status).

What to check:
1. Whether the role's trust policy names the Trusted Account ID and Trusted Role shown on the account, and the account's current external ID.
2. Whether the external ID was regenerated after the role was deployed, and the role updated to match.
3. Whether the discovery role grants the four required EC2 describe permissions, and the two optional ones where instance profiles or VPC endpoints matter.
4. When the account is managed with Terraform, read the external ID from state after apply rather than setting it in configuration.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.workload-discovery.aws-accounts:terraform-cannot-choose-external-id] Tier B: Follows from the provider code, from the SDK's `CreatePublicCloudInfo` and `UpdatePublicCloudInfo` sending the struct through `CreateResource` and `UpdateWithPutResource` (quoted), which marshal the caller's struct (ztw-writes-marshal-caller-struct), and from Go's omitempty semantics for a plain string field; the package defines no MarshalJSON. Not observed on the wire.

Sources disagree (name both sides):
- The help asks for a unique external ID for each account; the API contract allows several accounts in one organization to share one. [divergence:cloud-connector.workload-discovery.aws-accounts:external-id-uniqueness]
  - zscaler-help: Each account gets its own external ID.
  - api-specs: Multiple accounts can share the same external ID within the same organization; it must be unique across organizations.
  Impact: Reusing one external ID across an organization's accounts may be accepted by the API although the console guidance is one per account. Whether the console rejects a shared ID is not shown.
- The Go SDK decodes the workload discovery settings into a list; the API contract describes the response as a single object. [divergence:cloud-connector.workload-discovery.aws-accounts:trust-settings-shape]
  - sdk-go: The response is an array of settings objects.
  - api-specs: The response is one object with `trustedAccountId` and `trustedRoleName`.
  Impact: If the API answers with an object as documented, decoding it into a Go slice fails and `GetWorkloadDiscoverySettings` returns an error; Python and direct API reads are not affected by this.

Not known (open gaps):
- Whether the API assigns an external ID when a create sends none [gap:cloud-connector.workload-discovery.aws-accounts:external-id-on-create]: settled by lab-test. Blocks: Knowing which external ID to put in the role's trust policy for an account created by Terraform.

Area: cloud-connector.workload-discovery, its subjects in references/_meta/spine/cloud-connector/cloud-connector.workload-discovery.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.aws.iam.md (Cloud Connector on AWS: IAM for the instance, the autoscaling Lambda, and the deployer), from cloud-connector.workload-discovery: Only when `cloud_tags_enabled` is true (default false), it adds sns:ListTopics, ListSubscriptions, Subscribe, Unsubscribe and sqs:CreateQueue, DeleteQueue on all resources, optionally narrowed by `iam_tags_condition`, for tag-change subscriptions. [cloud-connector.aws.iam:cc-tags]
- interacts-with references/_meta/text/zia/zia.locations.workload-scopes.md (AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)), from cloud-connector.workload-discovery: The VPC, Namespace and Account scope types need workload discovery enabled for the tenant; the VPC Endpoint scope type does not. [zia.locations.workload-scopes:discovery-required]
- depends-on references/_meta/text/zia/zia.workload-groups.md (ZIA Workload Groups: scoping rules to cloud workloads), from cloud-connector.workload-discovery: The feature needs a subscription to a Workload SKU and a Cloud & Branch Connector account; after subscribing, Zscaler Support must enable the Workload Discovery Service Endpoint before Workload Groups can be used. [zia.workload-groups:discovery-prerequisite]
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.permission-status.md (AWS account permission status: Pending, Allowed, Denied, and refreshing it)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/ztw/public-cloud-accounts.md (config type)
- configured-via references/_meta/text/types/ztw/public-cloud-info.md (config type)
- see-also references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit)
- see-also references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
