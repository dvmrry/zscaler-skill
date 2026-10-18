# Managing Tenant Settings

**Source:** https://help.zscaler.com/secure-ai-users/managing-tenant-settings
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540885, revision 3242941

---

From the AI Guard Tenant Settings page, you can view information and make additional customizations to your AI Guard tenant. In addition to basic tenant information, you can also make changes to your security and encryption settings, and sync your Zscaler Internet Access (ZIA) end users, groups, and domains.
On the AI Guard Tenant Settings page (AI Guard > Tenant Settings), you can view the following basic information:
- Name: Name of the tenant.
- Mode: Lists whether AI Guard is in Proxy or DaaS mode.
- UUID: Universally unique identifier for your tenant.
- Zscaler AWS Account ID: Displays Zscaler’s AWS Account ID. This is used for optional AWS integrations such as log exports to AWS S3 buckets or optional AWS customer-managed keys for encryption.
See image.
# Managing Security Settings
In the Security Settings section, you have the following functionality:
- Store Prompts/Responses: Keep a history of all prompts and responses for the last 90 days for auditing.
- Enable Event Detection Feedback: Enable feedback submission on detection events. The feedback might be used for local model training. It will be securely stored with encryption.
- Enable Custom Header Encryption: Encrypt the contents of sensitive custom headers.
- Enable Content Encryption: Use customer-managed keys for additional security.
See image.
If you enable any encryption, you must provide a customer-managed key. Under Encryption - Configure Customer Managed Key:
- KMS Provider Key: AWS is currently the only supported provider type.
- Key ARN: Enter your Amazon Resource Name (ARN) encryption key.
See image.
After entering your encryption key, click Save Changes. Click Reset to revert any changes to the customer key ID and disable both content and custom header encryption settings.
# Syncing ZIA End Users and Groups with Multi-domain Support
To sync your ZIA end users and groups with AI Guard, you must first provide your Zscaler Internet Access (ZIA) information on the Tenant Settings page:
- Under ZIA Information, click the Enable ZIA User and Group Sync toggle to sync users and groups from ZIA to AI Guard. The cloud name and organization ID will be displayed below once sync is enabled and information is available.
- See image.
- Click the Enable ZIA Domain Sync toggle to sync domains from ZIA to AI Guard. This ensures all relevant domains are synchronized for policy evaluation.
- Next to Download Zscaler AI Guard Proxy Chain Certificate, click Download to download the root certificate from the portal which you can upload into ZIA to create the trust between ZIA and AI Guard.
To enable an immediate ZIA data sync outside the scheduled batch window, under Advanced Actions, click Start Sync.
# Custom Block Message for Consumer GenAI Apps
When someone is using AI Guard, you can include a custom message that appears when their prompt or response is blocked. This custom block message can be used to provide a link to the user to notify them about AI usage policy of your organization.
See image.
- Custom Prompt Block Message: Enter a message that users will see when their prompt is blocked.
- Custom Response Block Message: Enter a message that users will see when their LLM response is blocked.
- Delete Conversation on Response Block: Select if you want to automatically delete chat history of response blocking cases for providers.
After entering the block message, click Save.
# Organization Restrictions
AI Guard's tenancy restriction feature allows you to restrict user traffic access either to personal accounts, enterprise accounts, or both, and apply different access-control rules to each. This feature is currently available for Anthropic and OpenAI.
User traffic is automatically tagged at runtime. Requests matching a registered ID are tagged as "Enterprise," while unmatched requests are classified as "Personal."
To enable this functionality:
- In the left-side navigation, click Tenant Settings. The Tenant Settings page appears.
- Go to the Security tab and find the Organization Restrictions section.
- See image.
- Choose to enable the toggle for Anthropic or OpenAI.
  - When enabled, AI Guard will permit the listed organizations and deny all others.
  - When disabled, AI Guard will allow all traffic through and treat the list of organizations as Enterprise accounts. For everything else, it will assume those are Personal accounts.
- It may take up to five minutes for the changes to take effect.
- Under the LLM providers you enabled, enter your organization's specific Anthropic Org IDs or OpenAI
- Workspace IDs.
- Click Save Restrictions.
After enabling this functionality, within Policy Controls, administrators can select an "Account Type" (Personal, Enterprise, or Both) as a match criterion. This allows for specific policies (such as stricter data loss prevention or topic detection rules) to be applied to unmanaged personal traffic, while maintaining different standards for company-sanctioned workspaces.
To learn more, see Managing AI Guard Policy Control.
# Anthropic Webhook
AI Guard can integrate with Anthropic Claude's inference hooks to inspect and evaluate prompts against a tenant's detection policy in real time. AI Guard responds with an "allow" or "deny" verdict, which determines whether Claude proceeds to generate a response or the prompt is blocked.
To set up an inference hook between AI Guard and Claude:
- In the Claude UI, go to Organization Settings > Data and Privacy > Inference Hooks.
- Under Inference hooks, enable Allow for your organization.
- See image.
- In the Inference hooks section, do the following:
  - Enforce verdicts: Enable.
  - Inference hooks endpoint: Set to https://api.zseclipse.net/v1/webhook/execute
  - Prompt verdict timeout (ms): 1000ms
  - Signing secret: Copy this secret for use in AI Guard later. A signing secret is generated automatically on the first save and can be rotated at any time.
  - (Optional) Custom blocked prompt message: Enter a custom block message to show users when a prompt is blocked.
- See image.
- Leave Claude and go to the AI Security Admin Portal > AI Guard > Tenant Settings > Integrations tab.
- In the Anthropic Webhook section, click Add Secret.
- See image.
- In the Add Webhook Signing Secret window, do the following:
  - Anthropic Org UUID: Enter your organization’s Anthropic UUID.
  - Signing Secret: Enter the signing secret you copied earlier.
  - Click Add Secret.
- See image.
With the webhook integrated, create a policy to detect webhook traffic and create a policy control to set the match criteria so the policy applies to the traffic you intend. To learn more, see Adding and Managing AI Guard Policy Configurations and Managing AI Guard Policy Control.
