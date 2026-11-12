# Setting up the AWS DLP integration resources by hand: SNS access policy, buckets, trust policy, cross-account policies and customer-managed key policies (zwa.aws-dlp-integration.manual-setup)
Also called: manual aws setup workflow automation; sts:ExternalId trust policy; customer managed key s3 sns; SSE-KMS buckets dlp; sns topic access policy; AccountOwnerAccess

**SNS topic and buckets.** In the manual SNS setup the SNS topic is created as type Standard, and the topic policy JSON includes a statement letting the s3.amazonaws.com service principal SNS:Publish. [zwa.aws-dlp-integration.manual-setup:sns-topic-policy] Who may publish, subscribe and change the topic is described two ways [divergence:zwa.aws-dlp-integration.manual-setup:sns-policy-scope]. The manually created data bucket is named <bucketNamePrefix>-data and has the Block all public access checkbox selected. [zwa.aws-dlp-integration.manual-setup:bucket-settings] The metadata bucket event notification uses Object creation event types Put and Post with an SNS topic destination. [zwa.aws-dlp-integration.manual-setup:event-notification]

**Cross-account role.** The cross-account role custom trust policy lets the Workflow Automation role (zwaAccountID, zwaRole) assume the role via sts:AssumeRole when sts:ExternalId equals <GUID>. [zwa.aws-dlp-integration.manual-setup:trust-policy] Two policies are required on the cross-account role: metadata S3 bucket read access (so Workflow Automation can read the metadata JSON) and SNS subscribe or unsubscribe (SNS:Subscribe, SNS:Unsubscribe, SNS:ConfirmSubscription). [zwa.aws-dlp-integration.manual-setup:required-policies] The data S3 bucket read access policy on the cross-account role is optional: it lets Workflow Automation display data files using a presigned URL, and can be skipped to hide the data files in the Zscaler Admin Console. [zwa.aws-dlp-integration.manual-setup:optional-data-policy]

**Customer-managed keys.** To attach the key to both S3 buckets (data and metadata), default encryption is set to Server-side encryption with AWS Key Management Service keys (SSE-KMS). [zwa.aws-dlp-integration.manual-setup:sse-kms] The documented KMS key policy update adds a statement allowing the cross-account role kms:Decrypt, kms:Encrypt, kms:GenerateDataKey* and kms:DescribeKey, and one allowing the S3 service principal kms:Decrypt and kms:GenerateDataKey*. [zwa.aws-dlp-integration.manual-setup:cmk-key-policy] With customer-managed keys, a KMS policy with kms:Decrypt on the key ARN is attached to the IAM cross-account role, and a policy with kms:GenerateDataKey on the key ARN is attached to the ZIR role for uploading data to the S3 buckets (Cloud-to-Cloud role on the Cloud-to-Cloud page). [zwa.aws-dlp-integration.manual-setup:cmk-role-policies] The KMS actions for the uploading role differ between pages [divergence:zwa.aws-dlp-integration.manual-setup:cmk-generate-data-key].

The CloudFormation route to the same resources is in [The CloudFormation template for the AWS DLP integration: required AWS permissions, parameters, defaults, conditions and stack outputs](kb:zwa.aws-dlp-integration.cloudformation-parameters), and the overview in [The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation](kb:zwa.aws-dlp-integration).

What to check:
1. Whether the cross-account role's trust policy names the Workflow Automation role and the Customer GUID as sts:ExternalId.
2. Whether the two required policies are attached to the cross-account role, and whether the optional data bucket policy was skipped.

Sources disagree (name both sides):
- The page describes the SNS topic policy as allowing only the metadata bucket to publish and the Zscaler account to subscribe, but its policy JSON grants a wider set of actions to any principal when the source owner is the Zscaler account. [divergence:zwa.aws-dlp-integration.manual-setup:sns-policy-scope]
  - zscaler-help: Only the metadata S3 bucket may publish and the Zscaler AWS account may subscribe; the organization's account has all other permissions.
  - zscaler-help: The AccountOwnerAccess statement allows Principal * actions including SNS:Publish, SNS:Subscribe, SNS:DeleteTopic and SNS:SetTopicAttributes when AWS:SourceOwner is <zwaAccountID>.
  Impact: The prose and the JSON give different answers to who can publish to, subscribe to and change the topic; the Cloud-to-Cloud page carries the same policy text, and which reading AWS enforces is not settled by the page.
- The Cloud-to-Cloud role's KMS policy is given with different actions on the Workflow Automation page and on the ZIA Cloud-to-Cloud AWS page. [divergence:zwa.aws-dlp-integration.manual-setup:cmk-generate-data-key]
  - zscaler-help: The ZIR role policy for uploading to the S3 buckets grants kms:GenerateDataKey.
  - zscaler-help: For Workflow Automation with KMS keys the ZIA Cloud-to-Cloud page gives kms:Decrypt and kms:GenerateDataKey*.
  Impact: Which KMS actions the uploading role needs is not settled; the Workflow Automation page's Cloud-to-Cloud step names the role but quotes no policy of its own.

Area: zwa.aws-dlp-integration, its subjects in references/_meta/spine/zwa/zwa.aws-dlp-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.md (The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation)
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.cloudformation-parameters.md (The CloudFormation template for the AWS DLP integration: required AWS permissions, parameters, defaults, conditions and stack outputs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.dlp.cloud-to-cloud-forwarding.md (Cloud-to-Cloud Incident Forwarding: storage onboarding for AWS, Google Cloud and Azure)
