# Configuring Emergency Access

**Source:** https://help.zscaler.com/zpa/configuring-emergency-access
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485701, revision 3243416

---

This feature and its procedures are in limited availability. Contact Zscaler Support to enable this feature for your organization.
You can provision third-party users (e.g., contractors and vendors) for emergency access to time-bound resources. Emergency access builds on top of identity providers (IdPs) that are available in Private Access (ZPA), along with arbitrary authentication domains, by managing users within the Zscaler Admin Console. You can create a user designated for emergency access within the IdP enabled for emergency access when creating a privileged approval for that user. Emergency access is only supported for Privileged Remote Access (PRA).
# Prerequisites
Prior to configuring emergency access, the following prerequisites must be met:
- If you are an end user that has not migrated to Authentication Service, you must create an Okta IdP in the Zscaler Admin Console, and you must create a group within Okta to designate the users for emergency access. The following must also be configured in Okta for the third-party user:
  - Group administrators privileges. To learn more, refer to the Okta documentation.
  - The email authenticator. To learn more, refer to the Okta documentation.
  - Authentication policies. If the authentication policy utilizes Email One Time Pins (OTPs), then the invited user can authenticate in a manner that does not require a password by providing the OTP that was sent to the registered email address. To learn more, refer to the Okta documentation.
- If you are an end user that has migrated to Authentication Service, you must use Authentication Service as an IdP.
Zscaler recommends you are aware of the following when configuring emergency access:
- Users are not stored in Private Access. All users listed on the Emergency Access Users page come directly from Okta via the Okta API. If you are using Authentication Service, all users listed on the Emergency Access Users page come directly from Authentication Service.
- Special characters such as plus symbols (+) appear as blank spaces within the username field on the Okta login page if you are using a login hint. For example, user+emergency@safemarch.com appears as user emergency@safemarch.com. You might not be able to log in depending on your Okta login rules.
- Private Access leverages the IdP API Token from Okta to fetch the members of the group designated for emergency access. Zscaler recommends using an IdP API Token with group permissions to limit access to the groups designated for emergency access. If the specified IdP API Token is more permissive, additional users might be displayed on the Emergency Access Users page.
  - All of the users visible on the Emergency Access Users page can be activated, deactivated, or updated, even though they are not part of the user group designated for emergency access.
  - If the user group designated for emergency access is deleted, users that are not part of the user group designated for emergency access are still shown on the Emergency Access Users page as long as the settings are configured. If the provided credentials have permission over multiple groups, then Private Access continues to show users of those groups even if the group designated for emergency access is deleted.
# Configuring Emergency Access
The steps to configure emergency access differ if the end user has migrated to Authentication Service or not.
- For Private Access end users who have migrated to Authentication Service
  - The following must be configured in Authentication Service for the third-party user:
    - Enable Arbitrary Guest Domains. To learn more, see Adding Guest Domains.
    - Add a user. To learn more, see Adding Users.
    - Edit the user that was added, and then verify that the user is assigned to the Dynamic Group Guest Domains and the Zscaler Emergency Access groups in the drop-down menu.
    - See image.
    - Assign the user to the Zscaler Private Access service entitlement. To learn more, see Assigning Entitlements to User and User Groups.
    - You must assign the Zscaler Private Access service entitlement if you are creating an emergency access user using session monitoring or privileged approvals.
  - From the navigation menu, go to Administration > Private Access Authentication > Emergency Access.
  - On the Emergency Access page:
  - IdP: The IdP that has Use with Arbitrary Domains enabled. This is a read-only field.
- Only Authentication Service IdPs are supported for emergency access end users who have migrated to Authentication Service. You can sign up for Authentication Service for Zscaler. To learn more, refer to What Is Authentication Service?
  - IdP API Token: Enter the Okta API token with the necessary group administrator permissions for the group that will be designated for emergency access, but is not yet created. If the group has already been created, an Okta API token can also be entered with the necessary permissions for managing users under a group to be designated for emergency access. To learn more, refer to the Okta Developer documentation.
  - The IdP API Token field is hidden if you are subscribed to Authentication Service for users and User Single Sign-On (SSO) is enabled for your tenant. To learn more, see What Is Authentication Service?
  - User Group Name: The name of the user group where the new users are created.
  - The User Group Name field is disabled if you are subscribed to Authentication Service for users and User Single Sign-On (SSO) is enabled for your tenant. To learn more, see What Is Authentication Service?
  - Emergency Authentication Domains: Enter the email address domains to manage or limit the user authentication domains for emergency access when creating privileged approvals, and click Add Items. Click Remove All to remove all entered domains. If added, only the email address domain configured in the Emergency Authentication Domains field can be used when adding a privileged approval. When no authentication domains are specified, users can be created from any authentication domain that is not an existing primary or secondary authentication domain. When an authentication domain is specified, only the specified authentication domains can be used.
- If an existing email address domain is removed from the Emergency Authentication Domain field, the privileged approvals created with it continue to be present. Additionally, the Emergency Access Authentication Domains field is hidden if you are subscribed to Authentication Service for users and User Single Sign-On (SSO) is enabled for your tenant. To learn more, see What Is Authentication Service?
- See image.
  - Click Save.
- For Private Access end users who have not migrated to Authentication Service
  - Go to Administration > Private Access Authentication > Emergency Access.
  - On the Emergency Access page:
    - IdP: The IdP that has Use with Arbitrary Domains enabled. This is a read-only field.
    - Only Okta IdPs are supported for emergency access. You can sign up for the Okta tenant for Zscaler. To learn more, refer to the Okta documentation and Configuration Guide for Okta.
    - IdP API Token: Enter the Okta API token with the necessary group administrator permissions for the group that will be designated for emergency access, but is not yet created. If the group has already been created, an Okta API token can also be entered with the necessary permissions for managing users under a group to be designated for emergency access. To learn more, refer to the Okta Developer documentation.
    - User Group Name: The name of the user group where the new users are created.
    - Emergency Authentication Domains: (Optional) Enter the email address domains to manage or limit the user authentication domains for emergency access when creating privileged approvals, and click Add Items. Click Remove All to remove all entered domains. If added, only the email address domain configured in the Emergency Authentication Domains field can be used when adding a privileged approval. When no authentication domains are specified, users can be created from any authentication domain that is not an existing primary or secondary authentication domain. When an authentication domain is specified, only the specified authentication domains can be used.
    - If an existing email address domain is removed from the Emergency Authentication Domain field, the privileged approvals created with it continue to be present.
  - See image.
  - Click Save.
When configuring emergency access within a Microtenant:
- Only the Default Microtenant can configure emergency access.
- Emergency access users can be created or edited by Microtenants that have Privileged Approvals disabled.
- The Emergency Access page is not visible for Microtenants created with Privileged Approvals disabled.
To learn more, see About Microtenants.
After emergency access has been configured, the user can additionally do the following:
- Authenticate via email-based authentication. An email is sent from the IdP or Authentication Service to the user so that they can activate their account and authenticate. Email-based authentication is required for the user provisioned in Okta or Authentication Service. To learn more about configuring the email authenticator for an Okta user, refer to the Okta documentation.
It is the organization's responsibility to implement customization, branding, emails, and replies to email addresses. Zscaler only handles the lifecycle management in the Zscaler Admin Console.
- Go to the Emergency Access Users page to view and manage the users configured for emergency access.
