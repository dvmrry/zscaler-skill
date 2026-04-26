# Configuring Emergency Access

**Source:** https://help.zscaler.com/zpa/configuring-emergency-access
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

This feature and its procedures are in limited availability. Contact Zscaler Support to enable this feature for your organization.

Within the Zscaler Admin Console, you can provision third-party users (e.g., contractors and vendors) for emergency access to time-bound resources. Emergency access builds on top of identity providers (IdPs) that are available in Private Access, along with arbitrary authentication domains, by managing users within the Zscaler Admin Console. You can create a user designated for emergency access within the IdP enabled for emergency access when creating a privileged approval for that user. Emergency access is only supported for Privileged Remote Access.

## Prerequisites

Prior to configuring emergency access, the following prerequisites must be met:

- You must create an Okta IdP in the Zscaler Admin Console, and you must create a group within Okta to designate the users for emergency access. The following must also be configured in Okta for the third-party user:
  - Group administrators privileges. To learn more, refer to the Okta Help Center.
  - The email authenticator. To learn more, refer to the Okta Help Center.
  - Authentication policies. If the authentication policy utilizes Email One Time Pins (OTPs), then the invited user can authenticate in a manner that does not require a password by providing the OTP that was sent to the registered email address.
- The IdP provisioned with Okta must have Use with Arbitrary Domains enabled. To learn more, see Configuring an IdP for Single Sign-On.

Zscaler recommends you are aware of the following when configuring emergency access:

- Users are not stored in Private Access. All users listed on the Emergency Access Users page come directly from Okta via the Okta API.
- Special characters such as plus symbols (+) appear as blank spaces within the username field on the Okta login page if you are using a login hint. For example, user+emergency@safemarch.com appears as user emergency@safemarch.com. You might not be able to log in depending on your Okta login rules.
- Private Access leverages the IdP API Token from Okta to fetch the members of the group designated for emergency access. Zscaler recommends using an IdP API Token with group permissions to limit access to the groups designated for emergency access. If the specified IdP API Token is more permissive, additional users might be displayed on the Emergency Access Users page.
- All of the users visible on the Emergency Access Users page can be activated, deactivated, or updated, even though they are not part of the user group designated for emergency access.
- If the user group designated for emergency access is deleted, users that are not part of the user group designated for emergency access are still shown on the Emergency Access Users page as long as the settings are configured. If the provided credentials have permission over multiple groups, then Private Access continues to show users of those groups even if the group designated for emergency access is deleted.

## Configuring Emergency Access

To configure emergency access for Private Access:

1. Go to Administration > Identity > Private Access > Emergency Access.
2. On the Emergency Access page:
   - **IdP:** The IdP that has Use with Arbitrary Domains enabled. This is a read-only field.

Only Okta IdPs are supported for emergency access. You can sign up for the Okta tenant for Zscaler.

   - **IdP API Token:** Enter the Okta API token with the necessary group administrator permissions for the group that will be designated for emergency access, but is not yet created. If the group has already been created, an Okta API token can also be entered with the necessary permissions for managing users under a group to be designated for emergency access.
   - **User Group Name:** The name of the user group where the new users are created.
   - **Emergency Authentication Domains:** (Optional) Enter the email address domains to manage or limit the user authentication domains for emergency access when creating privileged approvals, and click Add Items. Click Remove All to remove all entered domains. If added, only the email address domain configured in the Emergency Authentication Domains field can be used when adding a privileged approval. When no authentication domains are specified, users can be created from any authentication domain that is not an existing primary or secondary authentication domain. When an authentication domain is specified, only the specified authentication domains can be used.

If an existing email address domain is removed from the Emergency Authentication Domain field, the privileged approvals created with it continue to be present.

3. Click Save to save the configuration, or Clear to clear the configuration.

When configuring emergency access within a Microtenant:

- Only the Default Microtenant can configure emergency access.
- Emergency access users can be created or edited by Microtenants that have Privileged Approvals disabled.
- The Emergency Access page is not visible for Microtenants created with Privileged Approvals disabled.

To learn more, see About Microtenants.

After emergency access has been configured, the user can additionally do the following:

- Authenticate via email-based authentication. An email is sent from the IdP to the user so that they can activate their account and authenticate. Email-based authentication is required for the user provisioned in Okta. To learn more about configuring the email authenticator for an Okta user, refer to the Okta Help Center.

It is the organization's responsibility to implement customization, branding, emails, and replies to email addresses. Zscaler only handles the lifecycle management in the Zscaler Admin Console.

- Go to the Emergency Access Users page to view and manage the users configured for emergency access.
