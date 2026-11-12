# The CloudFormation template for the AWS DLP integration: required AWS permissions, parameters, defaults, conditions and stack outputs (zwa.aws-dlp-integration.cloudformation-parameters)
Also called: cloudformation stack aws dlp; bucketNamePrefix; ziaRoleARN; allowKMSKeyCreate; enableReadAccessToDataBucket; lockRententionDays; zwaAccountID

To create the CloudFormation stack the AWS user needs, at a minimum, AmazonS3FullAccess (data and metadata buckets), AWSKeyManagementServicePowerUser (KMS key for the SNS topic message encryption), IAMFullAccess or a custom IAM policy with Create Role and Create Policy (cross-account policy for accessing the S3 bucket), and AmazonSNSFullAccess (SNS topic). [zwa.aws-dlp-integration.cloudformation-parameters:minimum-permissions] On the Configure stack options page the Stack failure options and Advanced options keep their defaults, and the I acknowledge that AWS CloudFormation might create IAM resources with custom names checkbox must be selected. [zwa.aws-dlp-integration.cloudformation-parameters:stack-options] Stack creation starts as CREATE_IN_PROGRESS and ends as CREATE_COMPLETE; the Outputs tab gives the IAM cross-account role ARN and external ID, SNS topic ARN, support role ARN (if created) and S3 bucket name prefix, which are required when adding the integration in Workflow Automation. [zwa.aws-dlp-integration.cloudformation-parameters:stack-outputs]

**Zscaler-specific parameters.** The Zscaler-specific parameters zwaAccountID, zwaRole and customerGuid are copied from the Account Settings page; zwaRole restricts the integration to that role in the Workflow Automation AWS account. [zwa.aws-dlp-integration.cloudformation-parameters:zwa-parameters] The ziaRoleARN parameter is the only role allowed to write S3 objects for the S3 bucket policy; it is the ZIR role ARN on the Incident Receiver page and the Cloud-to-Cloud role ARN on the Cloud-to-Cloud page. [zwa.aws-dlp-integration.cloudformation-parameters:zia-role-arn] The bucketNamePrefix parameter can be up to 40 characters and must not contain dots. [zwa.aws-dlp-integration.cloudformation-parameters:bucket-name-prefix]

**Encryption.** The encryptBuckets and encryptTopic parameters default to false. [zwa.aws-dlp-integration.cloudformation-parameters:encryption-defaults] kmsArnS3 applies only when encryptBuckets is true and allowKMSKeyCreate is false; kmsArnSNS applies only when encryptTopic is true and allowKMSKeyCreate is false. [zwa.aws-dlp-integration.cloudformation-parameters:kms-arn-conditions] allowKMSKeyCreate (default false) lets the stack create a KMS key linked to the S3 buckets and SNS topic; it only applies when both encryptBuckets and encryptTopic are true. [zwa.aws-dlp-integration.cloudformation-parameters:allow-kms-key-create]

**Retention, logging and access.** lockRententionMode selects Governance or Compliance retention for Object Lock-protected object versions, and lockRententionDays (default 180) is the number of days an object remains locked. [zwa.aws-dlp-integration.cloudformation-parameters:object-lock] enableCloudtrail (default false) enables S3 data events in CloudTrail; cloudTrailLogsBucket applies only when enableCloudtrail is true. [zwa.aws-dlp-integration.cloudformation-parameters:cloudtrail] enableExpiration defaults to false; expirationDaysCurrent defaults to 365, expirationDaysNonCurrent (permanent deletion of non-current versions) to 60, and incompleteMultipartDays (abort incomplete multipart uploads) to 7. [zwa.aws-dlp-integration.cloudformation-parameters:expiration-defaults] enableReadAccessToDataBucket (default true) gives the integration account read access to the data bucket. [zwa.aws-dlp-integration.cloudformation-parameters:role-defaults]

Defaults for the SNS topic name and the object lock retention mode are not on the page [gap:zwa.aws-dlp-integration.cloudformation-parameters:unstated-defaults]. The overview is [The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation](kb:zwa.aws-dlp-integration), and the same resources created by hand are in [Setting up the AWS DLP integration resources by hand: SNS access policy, buckets, trust policy, cross-account policies and customer-managed key policies](kb:zwa.aws-dlp-integration.manual-setup).

What to check:
1. Whether the AWS user creating the stack holds the minimum permissions the page lists.
2. Whether encryptBuckets and encryptTopic were set to true and allowKMSKeyCreate to false, since kmsArnS3 and kmsArnSNS apply only then.
3. Whether the bucketNamePrefix is within 40 characters and has no dots.

Not known (open gaps):
- What are the default SNS topic name and the default lockRententionMode? [gap:zwa.aws-dlp-integration.cloudformation-parameters:unstated-defaults]: settled by lab-test or source-read

Area: zwa.aws-dlp-integration, its subjects in references/_meta/spine/zwa/zwa.aws-dlp-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.md (The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation)
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.manual-setup.md (Setting up the AWS DLP integration resources by hand: SNS access policy, buckets, trust policy, cross-account policies and customer-managed key policies)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zwa/zwa.aws-dlp-integration.privacy-settings.md (The Hide privacy checkboxes on the AWS DLP integration: per-role defaults for admins, end users and managers or approvers, and their dependencies)
