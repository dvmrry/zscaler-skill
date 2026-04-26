# About Emergency Access Users

**Source:** https://help.zscaler.com/zpa/about-emergency-access-users
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Emergency access users are third-party users (e.g., contractors and vendors) that are created in an Okta IdP and configured on the Emergency Access page of the Zscaler Admin Console.

Emergency access users provide the following benefits and enable you to:

- Create emergency access users with permissions limited to privileged approvals in the specified IdP that is enabled for emergency access.
- Provision or deprovision third-party users.
- Authenticate and notify third-party users via email-based authentication and email-based notifications.

Prior to viewing and managing emergency access users, a list of prerequisites must be met. To learn more, see Configuring Emergency Access.

## About the Emergency Access Users Page

The Emergency Access Users page is not visible if you are within a Microtenant that has Privileged Approvals disabled. To learn more, see About Microtenants.

On the Emergency Access Users page (Administration > Identity > Private Access > Emergency Access Users), you can do the following:

- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to display the filters.
- Refresh the Emergency Access Users page to reflect the most current information.
- Filter the information that appears in the table. By default, no filter is applied. You can also save applied filters to your preferences so that they're visible in future user sessions.
- View a list of emergency access users that were added. For each emergency access user, you can see:
  - First Name: The first name of the emergency access user, as provided by the admin.
  - Last Name: The last name of the emergency access user, as provided by the admin.
  - Email Address: The email address of the emergency access user, as provided by the admin.
  - Status: The status of the emergency user. The emergency access user can be in one of the following states:
    - Active: Indicates when the user is activated and has completed the email-based authentication.
    - Staged: Indicates when the user is created in the IdP but neither activated nor deactivated.
    - Provisioned: Indicates when the user is created and activated in the IdP, but still needs to complete activation via email-based authentication.
    - Deprovisioned: Indicates when the user is created in the IdP but not activated.
    - Suspended: Indicates when the user does not have access to applications within the IdP.
    - Other statuses (e.g., Password Expired, Locked Out, Recovery) might appear. To learn more, refer to the Okta Help Center.
  - Activation Date: The date and time when the emergency access user was activated by the admin.
  - Last Login Date: The date and time when the emergency access user last logged in.
- Modify the columns displayed in the table.
- Edit an emergency access user.
- Activate an emergency access user.
- Deactivate an emergency access user.
