# Managing AI Guard Log Exports

**Source:** https://help.zscaler.com/ai-guard/managing-ai-guard-log-exports
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Dashboard & Diagnostics
Managing AI Guard Log Exports
AI Guard
Managing AI Guard Log Exports
Ask Zscaler

The AI Guard Log Exports page allows you to manage and configure third-party integrations to export incident data. You can do this through either Amazon Web Services (AWS) CrowdStrike (CRWD) or AWS S3 event exporting.

Azure Data Explorer (ADX) Event Export

To add an ADX event export instance:

Under Azure ADX Event Export, click Add Instance. The Add Integration window appears.

See image.

In the Add Integration window:
Name: Enter a name for your event export instance.
Enabled: Select this option to activate the event report functionality.
Meta Event Hub Connection String: Enter the SAS connection string for the meta Event Hub (e.g. aiguard-meta). Obtain via: az eventhubs eventhub authorization-rule keys list.
Content Event Hub Connection String: (Optional) Enter the SAS connection string for the content Event Hub (e.g. aiguard-content). Obtain via: az eventhubs eventhub authorization-rule keys list.
Export Allowed/Detected Prompts: Select to export allowed and detected prompts.
Export Blocked Prompts: Select to export blocked prompts.
Click Validate Connection to check whether the information you entered is accurate and working.
Click Save Integration. The Azure ADX Event Export Integrations page opens. Your integration appears on this page.
CRWD Event Export

Use the CRWD integration to export event metadata to CrowdStrike HTTP Event Collector (HEC) and event contents to AWS S3.

To add a CRWD event export instance:

Under CRWD Event Export, click Add Instance. The Add Integration window appears.

See image.

In the Add Integration window:
Name: Enter a name for your event export instance.
Enabled: Select this option to activate the event report functionality.
AWS S3 Bucket: Enter the AWS S3 bucket location where the tenant's event content files will be stored.
Bucket Key Prefix: (Optional) Enter the key prefix for objects created in the S3 bucket.
Tags: (Optional) Click Add Tag to enter the tag key and value to apply to the object put in the S3 bucket. To use this feature, the IAM role requires permissions for the "s3:PutObjectTagging" action.
Region of Bucket: Enter the region of the bucket.
IAM Cross-Account Role ARN: Enter the Amazon Resource Name (ARN) of the IAM cross-account role created in the tenant's AWS account.
IAM Cross-Account Role External ID: The external ID of the IAM cross-account role which is created in the tenant's AWS account. It should be filled in automatically.
CrowdStrike HEC Bearer Token: Enter the bearer token to authenticate the CrowdStrike HEC.
CrowdStrike HEC URL: Enter the URL of the CrowdStrike HEC (raw endpoint) where tenant's events (metadata) will be posted.
Export Allowed/Detected Prompts: Select to export allowed and detected prompts.
Export Blocked Prompts: Select to export blocked prompts.
Click Validate Connection to check whether the information you entered is accurate and working.
Click Save Integration. The CRWD Event Export Integrations page opens. Your integration appears on this page.
S3 Event Export

Use the S3 integration to export event metadata and contents to AWS S3. A cloud formation template to set the right roles and policies can be found on the Zscaler AI Guard portal.

To add an S3 event export instance:

Under S3 Event Export, click Add Instance. The Add Integration window appears.

See image.

In the Add Integration window:
Name: Enter a name for your event export instance.
Enabled: Select this option to activate the event report functionality.
AWS S3 Metadata Bucket: Enter the AWS S3 bucket location where the tenant's event metadata files will be stored.
AWS S3 Content Bucket: Enter the AWS S3 bucket where the tenant's event content files will be stored.
Bucket Key Prefix: (Optional) Enter the key prefix for objects created in the S3 bucket.
Tags: (Optional) Click Add Tag to enter the tag key and value to apply to the object put in the S3 bucket. To use this feature, the IAM role requires permissions for the "s3:PutObjectTagging" action.
Region of Bucket: Enter the region of the bucket.
IAM Cross-Account Role ARN: Enter the ARN of the IAM cross-account role created in the tenant's AWS account.
IAM Cross-Account Role External ID: The external ID of the IAM cross-account role created in the tenant's AWS account. This field auto-populates.
Export Allowed/Detected Prompts: Select to export allowed and detected prompts.
Export Blocked Prompts: Select to export blocked prompts.
Click Validate Connection to check whether the information you entered is accurate and working.
Click Save Integration. The S3 Event Export Integrations page opens. Your integration appears on this page.
Splunk Event Export

Under Splunk Event Export, click Add Instance. The Add Integration window appears.

See image.

In the Add Integration window:
Name: Enter a name for your event export instance.
Enabled: Select this option to activate the event report functionality.
Splunk Metadata HEC Bearer Token: Enter the bearer token used to authenticate Splunk HEC for the tenant's events (metadata).
Splunk Metadata HEC URL: Enter the URL of the Splunk HEC (raw endpoint) where the tenant's events (metadata) will be posted.
Splunk Content HEC Bearer Token: (Optional) Enter the bearer token used to authenticate to the Splunk HEC for tenant's events (content).
Splunk Content HEC URL: (Optional) Enter the URL of the Splunk HEC (raw endpoint) where tenant's events (content) will be posted.
Export Allowed/Detected Prompts: Select to export allowed and detected prompts.
Export Blocked Prompts: Select to export blocked prompts.
Click Validate Connection to check whether the information you entered is accurate and working.
Click Save Integration. The Splunk Export Integrations page opens. Your integration appears on this page.
