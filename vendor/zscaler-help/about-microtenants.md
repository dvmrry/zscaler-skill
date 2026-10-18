# About Microtenants

**Source:** https://help.zscaler.com/zpa/about-microtenants
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485681, revision 3245028

---

Contact Zscaler Support to enable this feature for your organization.
A Microtenant is a delegated administrator responsibility that is assigned to an admin by an admin with Microtenant administrator privileges. Microtenants are defined by an authentication domain and assigned to admins based on country, department, and company for role-based administration control.
Microtenants provide the following benefits and enable you to:
- Delegate the responsibilities of an admin.
- Manage the configuration of shared application segments, segment groups, servers, server groups, App Connectors, App Connector groups, and policies exclusive to users within their country, department, and operating company.
- View the dashboard and logs exclusive to the users within their country, department, and operating company.
- Share application segments between different Microtenants.
A Microtenant is created within a tenant and is used when departments or subsidiaries within an organization want to manage their configurations independently. For example, an organization can delegate admin responsibilities to the admins of their subsidiaries, allowing them to independently manage their configurations. In the following diagram, the admin of an organization (Neoglobal Corp) has created two Microtenants for Subsidiary-1 and Subsidiary-2. End users of each subsidiary (i.e., Microtenants) can access resources (e.g., applications) from the default or global tenant, as well as those created within their respective subsidiaries. By default, end users of different subsidiaries cannot access resources configured in other Microtenants.
# Prerequisites
To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. To learn more, see Understanding Software Updates in Private Access.
# Limitations
Zscaler recommends you consider the following before configuring a Microtenant:
- App Profile Configuration
- Admins that want to map machine tunnels to their respective Microtenant must have a one-to-one mapping between an app profile and the individual Microtenant. For example, a tenant has the following app profiles in the Zscaler Admin Console:
| Rule Number | Policy Name | User Groups | Machine Token |
|---|---|---|---|
| 1 | Early_Adopters | Beta_Grp | None |
| 2 | China_Users | PRC_Grp | None |
| 3 | Default | All | Machine_Token_from_Default_Tenant |
- The following Microtenants are configured:
| Microtenant Number | Name | Authentication Domain |
|---|---|---|
| 1 | Microtenant_for_US_Users | us.com |
| 2 | Microtenant_for_China_Users | prc.com |
| 3 | Default | All |
- In this example, all machine tunnels enroll against the Default Microtenant. This allows all users to access the Default Microtenant resources over the machine tunnel.
- Configurations That Can Only Be Managed or Configured by the Default Microtenant Admin
  - IdP Configuration
  - Enrollment (CA) Certificates
  - Microtenants
- Contact the Default Microtenant admin if you need help configuring or managing certain features and use cases.
- Disaster Recovery Configuration
- The Microtenants feature is not supported when disaster recovery is enabled. When Disaster Recovery Mode is activated, all users have access to all applications that are designated for disaster recovery. In the following diagram, user A and B are from USA and India and have access to separate applications when disaster recovery is disabled. After disaster recovery is enabled, both users have access to all applications that are designated for disaster recovery.
- When in Disaster Recovery Mode, Private Service Edges for Private Access and App Connectors mapped within a default or custom Microtenant provide traffic to only applications designated for disaster recovery. To learn more, see Understanding Disaster Recovery.
- Features Supported Only for a Default Microtenant but Not Supported for a Standard Microtenant
  - AI-Powered Recommendations for Application Segments
  - Application Segments Usage
  - AppProtection for Private Application Traffic
  - Authentication Service
  - Browser Access with CORS
  - Client Hostname Validation
  - Disaster Recovery
  - Extranet Application Support
  - Inspect Traffic with ZIA
  - Log Streaming Service
  - Source IP-Anchor enabled applications
  - VPN (for Legacy Apps)
  - Zscaler Branch Connector
  - Zscaler Cloud Connector
There can be situations where users from one Microtenant need to access one or more application segments from another Microtenant. Applications that are present in a Microtenant can be shared with other Microtenants. If an application is not shared with any other Microtenant, it can be moved to the Default Microtenant. To learn more, see Sharing Defined Application Segments and Moving Defined Application Segments.
Policy evaluation behaves differently when Microtenants are enabled for your organization. To learn more, see About Policies.
Feature permissions vary for users within the Default Microtenant, for users within a custom Microtenant, or when resources are shared with other Microtenants. To learn more, see Configuration Permissions for Microtenants.
# About the Microtenants Page
On the Private App Microtenants page (Private Access > B2B Exchange > Microtenants), you can do the following:
- Add a new Microtenant.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Modify the columns displayed in the table.
- View a list of all Microtenants. For each Microtenant, you can see:
  - Priority: The evaluation order number for the Microtenant. Private Access applies Microtenants based on the order they are listed (i.e., top to bottom), and assigns the first match as the most relevant Microtenant. Click the number and manually enter a new value to change the Microtenant order. Click the Confirm icon, and then click Confirm to save the new priority. By default, newly created Microtenants are prioritized last in the table. Users that belong to multiple Microtenants are assigned a Microtenant in the table based on the highest evaluation order.
  - Updating the priority order impacts user access to applications and applied policies, as users can be reassigned to new Microtenants. It can also affect user access to inherited application segments with access policies defined at the Microtenant level.
  - Name: The name of the Microtenant.
  - Description: The description of the Microtenant.
  - Authentication Domain: The authentication domain used to authenticate the admins to the Microtenant.
  - Status: The status of the Microtenant.
  - Privileged Approvals: The privileged approval for the Microtenant. Enable to allow approval-based access even if no Authentication Domain is selected. The Emergency Access and Emergency Access Users pages are not visible for Microtenants with Privileged Approvals disabled. This field is Disabled by default.
  - The Privileged Approvals option is only supported for applications that have Privileged Remote Access enabled. To learn more, see Configuring Defined Application Segments.
- Edit the configuration of a Microtenant.
- Users mapped to Microtenants that are using Private Service Edges reauthenticate when the Microtenant is disabled.
- Delete a Microtenant.
- Deleting a Microtenant deletes all log receivers that the Microtenant is associated with.
- Display more rows or a different page of the table.
