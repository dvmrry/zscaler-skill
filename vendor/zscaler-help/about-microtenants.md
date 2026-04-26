# About Microtenants

**Source:** https://help.zscaler.com/zpa/about-microtenants
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Contact Zscaler Support to enable this feature for your organization.

A Microtenant is a delegated administrator responsibility that is assigned to an admin by an admin with Microtenant administrator privileges. Microtenants are defined by an authentication domain and assigned to admins based on country, department, and company for role-based administration control.

Microtenants provide the following benefits and enable you to:

- Delegate the responsibilities of an admin.
- Manage the configuration of shared application segments, segment groups, servers, server groups, App Connectors, App Connector groups, and policies exclusive to users within their country, department, and operating company.
- View the dashboard and logs exclusive to the users within their country, department, and operating company.
- Share application segments between different Microtenants.

A Microtenant is created within a tenant and is used when departments or subsidiaries within an organization want to manage their configurations independently. For example, an organization can delegate admin responsibilities to the admins of their subsidiaries, allowing them to independently manage their configurations. In the following diagram, the admin of an organization (Neoglobal Corp) has created two Microtenants for Subsidiary-1 and Subsidiary-2. End users of each subsidiary (i.e., Microtenants) can access resources (e.g., applications) from the default or global tenant, as well as those created within their respective subsidiaries. By default, end users of different subsidiaries cannot access resources configured in other Microtenants.

Zscaler recommends you consider the following before configuring a Microtenant:

- App Profile Configuration
- Configurations That Can Only Be Managed or Configured by the Default Microtenant Admin
- Disaster Recovery Configuration
- Supported Features within a Microtenant

There can be situations where users from one Microtenant need to access one or more application segments from another Microtenant. Applications that are present in a Microtenant can be shared with other Microtenants. If an application is not shared with any other Microtenant, it can be moved to the Default Microtenant. To learn more, see Sharing Defined Application Segments and Moving Defined Application Segments.

## About the Private App Microtenants Page

On the Private App Microtenants page (Administration > Admin Management > Role Based Access Control > Private App Microtenants), you can do the following:

- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to display the filters.
- Refresh the Private App Microtenants page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions.
- Add a new Microtenant.
- Expand all the rows in the table to see more information about each Microtenant.
- View a list of all Microtenants. For each Microtenant, you can see:
  - Name: The name of the Microtenant.
  - Description: The description of the Microtenant.
  - Authentication Domain: The authentication domain used to authenticate the admins to the Microtenant.
  - Status: The status of the Microtenant.
  - Privileged Approvals: The privileged approval for the Microtenant. Enable to allow approval-based access even if no Authentication Domain is selected. The Emergency Access and Emergency Access Users pages are not visible for Microtenants with Privileged Approvals disabled. This field is Disabled by default.

The Privileged Approvals option is only supported for applications that have Privileged Remote Access enabled. To learn more, see Configuring Defined Application Segments.

- Modify the columns displayed in the table.
- Edit the configuration of a Microtenant.

Users mapped to Microtenants that are using Private Service Edges reauthenticate when the Microtenant is disabled.

- Delete a Microtenant.
- Display more rows or a different page of the table.
