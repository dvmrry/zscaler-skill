# About Active Directory Controls

**Source:** https://help.zscaler.com/zpa/about-active-directory-controls
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1515521, revision 3240237

---

The Active Directory controls in the Zscaler Admin Console are predefined controls that are enforced by enabling Active Directory in an application segment. The supported protocols are Kerberos, SMB, and LDAP. Active Directory controls are displayed on the Active Directory Controls page. You can add Active Directory controls to an AppProtection profile. An AppProtection profile defines how the Active Directory controls and other AppProtection controls are managed. You can view the Active Directory control inspection results on the Active Directory Protection dashboard.
Active Directory controls provide the following benefits and enable you to:
- Protect internal applications from the latest threats by inspecting Active Directory-enabled application segment transactions for security violations.
- Gain detailed visibility on Active Directory data (users, errors, suspicious activity, and AppProtection control and profile violations) over a selected time frame.
# About the Active Directory Controls Page
On the Active Directory Controls page (Private Access > Private App Protection > Protection Controls > Active Directory Controls), you can do the following:
- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
- Hide the filters on the page by clicking **Hide Filters**. Click **Show Filters** to show the filters.
- Refresh the Active Directory Controls page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Expand all of the rows in the table to see more information about each Active Directory control.
- View a list of Active Directory controls. For each Active Directory control, you can view:
  - **Control Number**: A number to differentiate each Active Directory control. When expanded, the following information is displayed:
    - **Description**: An explanation of how the control works.
    - **Paranoia Level**: The associated level, which corresponds to the levels available in an AppProtection profile.
    - **Used in AppProtection Profiles**: The AppProtection profiles using the Active Directory control. Click an AppProtection profile if you want to edit it.
  - **Name**: The name of the Active Directory control.
  - **Severity**: The level of severity for the control number. The severity levels are **Low**, **Medium**, **High**, and **Critical**.
  - **Control Action**: What action occurs when the Active Directory control is in use.
- Modify the columns displayed in the table.
- Go to the ThreatLabZ Controls page to view and manage the available ThreatLabZ controls.
- Go to the OWASP Predefined Controls page to view and manage the available OWASP predefined controls.
- Go to the Custom Controls page to view and manage the available custom controls.
- Go to the WebSocket Controls page to view and manage the available WebSocket controls.
- Go to the API Controls page to view and manage the available API controls.
