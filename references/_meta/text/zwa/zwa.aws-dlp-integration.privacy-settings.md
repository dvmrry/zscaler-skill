# The Hide privacy checkboxes on the AWS DLP integration: per-role defaults for admins, end users and managers or approvers, and their dependencies (zwa.aws-dlp-integration.privacy-settings)
Also called: aws hide evidence data; aws hide trigger data; aws hide policy details; aws hide policy details for non-triggered matches; presigned evidence links; data privacy settings aws integration

**Admins.** For admins, Hide Evidence Data - Admin and Hide Trigger Data - Admin are selected by default and Hide Policy Details - Admin is not selected by default. [zwa.aws-dlp-integration.privacy-settings:admin-settings]

**End users.** For end users responding to an incident notification, Hide Evidence Data - End User, Hide Trigger Data - End User and Hide Policy Details - End User are each selected by default. [zwa.aws-dlp-integration.privacy-settings:end-user-settings]

**Managers and approvers.** For approvers or managers responding to an incident escalation notification, Hide Evidence Data - Manager/Approver, Hide Trigger Data - Manager/Approver and Hide Policy Details - Manager/Approver are each selected by default. [zwa.aws-dlp-integration.privacy-settings:manager-settings]

**Dependencies.** The Hide Policy Details for Non-Triggered Matches checkbox (Non-Triggered Engines and Dictionaries and Other Matched Rules sections) is only available when the matching Hide Policy Details checkbox is not selected, for each of Admin, End User and Manager/Approver; for Admin it is not selected by default. [zwa.aws-dlp-integration.privacy-settings:non-triggered-dependency] If Hide Evidence Data or Hide Trigger Data is disabled but read access to the S3 bucket was not enabled when the CloudFormation stack was created, no one can generate evidence links or view trigger data in the Zscaler Admin Console. [zwa.aws-dlp-integration.privacy-settings:no-read-access-consequence] The defaults of the end user and manager non-triggered checkboxes are not on the page [gap:zwa.aws-dlp-integration.privacy-settings:non-triggered-defaults]. The integration these belong to is [The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation](kb:zwa.aws-dlp-integration), and the CloudFormation stack read access setting is in [The CloudFormation template for the AWS DLP integration: required AWS permissions, parameters, defaults, conditions and stack outputs](kb:zwa.aws-dlp-integration.cloudformation-parameters).

What to check:
1. Whether Hide Evidence Data or Hide Trigger Data is selected for the role in question, and whether read access to the S3 bucket was enabled when the stack was created.

Not known (open gaps):
- Are Hide Policy Details for Non-Triggered Matches - End User and - Manager/Approver selected by default? [gap:zwa.aws-dlp-integration.privacy-settings:non-triggered-defaults]: settled by lab-test

Area: zwa.aws-dlp-integration, its subjects in references/_meta/spine/zwa/zwa.aws-dlp-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.md (The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation)
- links-to references/_meta/text/zwa/zwa.aws-dlp-integration.cloudformation-parameters.md (The CloudFormation template for the AWS DLP integration: required AWS permissions, parameters, defaults, conditions and stack outputs)
