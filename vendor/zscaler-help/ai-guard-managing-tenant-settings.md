# Managing Tenant Settings

**Source:** https://help.zscaler.com/ai-guard/managing-tenant-settings
**Captured:** 2026-05-22 via Codex Browser.

---

AI Guard Help
Configuration
Managing Tenant Settings
AI Guard
Managing Tenant Settings
Ask Zscaler

From the AI Guard Tenant Settings page, you can view information and make additional customizations to your AI Guard tenant. In addition to basic tenant information, you can also configure your network access control policy to allow IPv4 CIDR ranges, add custom request headers, make changes to your security and encryption settings, and sync your Zscaler Internet Access (ZIA) end users, groups, and domains.

On the AI Guard Tenant Settings page (AI Guard > Tenant Settings), you can view the following basic information:

Name: Name of the tenant.
Mode: Lists whether AI Guard is in Proxy or DaaS mode.
UUID: Universally unique identifier for your tenant.
Zscaler AWS Account ID: Displays your AWS Account ID. This is used for optional AWS integrations such as log exports to AWS S3 buckets or optional AWS customer-managed keys for encryption.

See image.

Managing Network Access Control Policy

To manage your network access control policy:

In the left-side navigation, click Tenant Settings. The Tenant Settings page appears.

Under the Network Access Control Policy, enter up to 10 IPv4 CIDR ranges. After entering one, press Enter, Comma, Space, or paste a list to add more.

See image.

Click Submit.

To delete an IPv4 CIDR range, click the Delete icon next to it.

See image.

Managing Custom Request Headers

Custom request headers must follow the following guidelines:

A maximum of 5 custom request headers is allowed.
Header names must not exceed 64 characters.
You can use the following characters: a-z A-Z 0-9 !#$%&'*+-.^_`|~
Header names are case insensitive and must be unique.
A conversation ID header is optional.

To manage your custom request headers:

In the left-side navigation, click Tenant Settings. The Tenant Settings page appears.

Under Custom Request Headers, enter a Header Name and click Add Header.

See image.

(Optional) Under Conversation ID Header, you can select a header from the drop-down menu to use as the conversation ID header. This header will be used to track related requests.
Click Submit and in the Update Custom Request Headers window, click Yes.

In addition to adding headers you can also:

Mark as sensitive: This allows for extra protection of headers that may contain sensitive information. Select the Mark as sensitive checkbox. If you selected a custom header as a Conversation ID Header, then you will not be able to mark it as sensitive until you remove it.
Edit: To make changes to a custom header, click the Edit icon next to the header, make the required changes, and click the Save icon.
Delete: To delete a custom header, click the Delete icon and in the Delete this Header? window click Yes.

See image.

After you make all changes, click Submit. In the Update Custom Request Headers window, click Yes.
Managing Security Settings

In the Security Settings section, you have the following functionality:

Store Prompts/Responses: Keep a history of all prompts and responses for the last 90 days for auditing.
Enable Event Detection Feedback: Enable feedback submission on detection events. The feedback might be used for local model training. It will be securely stored with encryption.
Enable Custom Header Encryption: Encrypt the contents of sensitive custom headers.
Enable Content Encryption: Use customer-managed keys for additional security.

See image.

If you enable any encryption, you must provide a customer-managed key. Under Encryption - Configure Customer Managed Key:

KMS Provider Key: AWS is currently the only supported provider type.
Key ARN: Enter your Amazon Resource Name (ARN) encryption key.

See image.

After entering your encryption key, click Save Changes. Click Reset to revert any changes to the customer key ID and disable both content and custom header encryption settings.

Syncing ZIA End Users and Groups with Multi-domain Support

To sync your ZIA end users and groups with AI Guard, you must first provide your Zscaler Internet Access (ZIA) information on the Tenant Settings page:

Under ZIA Information, click the Enable ZIA User and Group Sync toggle to sync users and groups from ZIA to AI Guard. The cloud name and organization ID will be displayed below once sync is enabled and information is available.

See image.

Click the Enable ZIA Domain Sync toggle to sync domains from ZIA to AI Guard. This ensures all relevant domains are synchronized for policy evaluation.
Next to Download Zscaler AI Guard Proxy Chain Certificate, click Download to download the root certificate from the portal which you can upload into ZIA to create the trust between ZIA and AI Guard.

To enable an immediate ZIA data sync outside the scheduled batch window, under Advanced Actions, click Start Sync.

Custom Block Message for Consumer GenAI Apps

When someone is using AI Guard, you can include a custom message that appears when their prompt or response is blocked. This custom block message can be used to provide a link to the user to notify them about AI usage policy of your organization

See image.

Custom Prompt Block Message: Enter a message that users will see when their prompt is blocked.
Custom Response Block Message: Enter a message that users will see when their LLM response is blocked.
Delete Conversation on Response Block: Select if you want to automatically delete chat history of response blocking cases for providers.

After entering the block message, click Save.
