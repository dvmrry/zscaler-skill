# About AppProtection Profiles

**Source:** https://help.zscaler.com/zpa/about-appprotection-profiles
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485006, revision 3243391

---

AppProtection profiles allow you to determine how traffic is inspected and managed. Each AppProtection profile uses a paranoia level if using API controls, ThreatLabZ predefined controls, Open Web Application Security Project (OWASP) predefined controls, or WebSocket predefined controls. Predefined controls are a selection of the controls to establish the requirements for AppProtection, and what action is taken for those controls. You can use your own WebSocket custom controls or HTTP custom controls, or you can use the ThreatLabZ predefined controls, OWASP predefined controls, API controls, or WebSocket predefined controls. You can also apply the same action for all the controls, or a different action for each control in the AppProtection profile.
AppProtection profiles provide the following benefits and enable you to:
- Create a comprehensive security profile by selecting controls from multiple categories (OWASP predefined controls, HTTP custom controls, WebSocket controls, API controls, and ThreatLabZ controls).
- Assign a specific action to take in the event of malicious traffic (Allow, Block, or Redirect).
# Using the Default AppProtection Profile Template
A default AppProtection profile is included with the setup of your Private Access (ZPA) account. It is named Recommended OWASP Top 10 Profile in the AppProtection profile table. Use the default profile as a template for custom AppProtection profiles. When the default template is used, recommended controls for OWASP predefined controls and ThreatLabZ controls are automatically selected. The default profile can't be edited or deleted.
See image.
Some controls are excluded from the default AppProtection profile for higher efficacy.
After creating an AppProtection profile, you can add it to an AppProtection policy for the Private Access service to use. To learn more, see About AppProtection Policy.
# About the AppProtection Page
On the AppProtection page (Private Access > Private App Protection > Policy > Protection Profiles > AppProtection), you can do the following:
- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
- Hide the filters on the page by clicking **Hide Filters**. Click **Show Filters** to display the filters.
- Refresh the AppProtection page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Add an AppProtection profile.
- Expand all the rows in the table to see more information about each AppProtection profile.
- View a list of all configured AppProtection profiles. For each profile, you can see:
  - **Name**: The name of the AppProtection profile. When you expand the row, the following information is displayed:
    - **Description**: The description of the AppProtection profile, if available.
    - **Paranoia Level**: The associated level which corresponds to the levels available in the AppProtection controls.
    - **Used in AppProtection Controls**: The predefined and custom controls in use by the AppProtection profile. When you click the level listed, you can view the following information for each predefined control:
      - **Control Number**: A number identifying the predefined control.
      - **Control Name**: The name of the predefined control.
      - **Control Action**: What action occurs when the predefined control is in use.
      - **Control Exception**: If an exception has been added to a predefined control, **Exceptions** is displayed. Click **Exceptions** to view the details for that specific exception in the **Edit Exceptions** window in a read-only format.
See image.
- **OWASP_CRS Version**: The OWASP predefined control version selected for the AppProtection profile.
- **Subscribed to ThreatLabZ**: If the AppProtection profile is subscribed to automatically add new ThreatLabZ predefined controls, **Yes** is displayed. If the profile is not subscribed to receive new ThreatLabZ controls, **No** is displayed.
- Modify the columns displayed in the table.
- Copy an existing AppProtection profile, and use it to create a new AppProtection profile.
- Edit an AppProtection profile.
- Delete an AppProtection profile.
You can't edit or delete the default AppProtection profile.
- Display more rows or a different page of the table.
- Go to the Browser Protection page to view and manage your Browser Protection profiles.
