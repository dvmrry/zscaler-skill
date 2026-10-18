# Configuring the File Type Control Policy

**Source:** https://help.zscaler.com/zia/configuring-file-type-control-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398726, revision 3238873

---

Watch a video about File Type Control.
File Type Control policies enable you to create rules to restrict the upload and download of various types of files. You can capture and store traffic blocked through this policy as PCAP files. To learn more, see About Traffic Capture Settings. You can also use the recommended File Type Control policy for guidance when configuring File Type Control policies.
# Policy Execution
The File Type Control rules consist of a series of logical operators between their criteria. The rules are triggered based on the result of the following logical operations between the criteria:
[File Types (AND) URL Categories (AND) Cloud Applications (AND) Application Segment] (AND) [Users (OR) Groups (OR) Departments] (AND) [Location Groups (OR) Locations] (AND) Time (AND) [Device Groups (OR) Devices] (AND) Protocols (AND) Device Trust Level (AND) Minimum File Size (AND) Maximum File Size.
# Configuring File Type Control Policy
To configure the File Type Control policy:
- Go to Internet Access > Policy > File Type Control.
- Click Add Rule.
- The Add Rule window appears.
- On the Add Rule page, you can configure the following sections:
  - Criteria
  - Click Add Criteria to view the drop-down menu and see the rule condition categories in gray (e.g., Who, Where, & When) and the individual rule conditions (e.g., Users) under each category.
  - See image.
  - Refer to the following condition categories for details on configuring their individual conditions:
    - What:
      - File Types: (Required) Select file types to which you want to apply the rule. You can also select Undetectable File under Other to apply the rule to unknown file types. For unknown file types, the service checks for the file type in the file header using true file type detection. If the file is still unknown, the service performs MIME type checks and tags as an unknown file type for any that fall outside of well-defined MIME types for common apps. You can select any number of file types and also search for file types. You can also select custom file types you have previously configured.
      - Zscaler-defined file types are considered before custom file types and custom file types inside archives are not detected.
      - Protocols: Select the protocols to which the rule applies.
        - FTP over HTTP: Files from FTP over HTTP websites. (Requires Firewall subscription.)
        - HTTP: Files from HTTP websites.
        - HTTPS: Files from HTTP websites encrypted by TLS/SSL.Native FTP: Files from native FTP servers. (Requires Firewall subscription.)
      - Minimum/Maximum File Size: Enter a number value between 0 and 409,600 (KB) to apply a minimum and a maximum file size limit. Entering no value ignores the criteria in the policy evaluation.
    - Active Content, Unscannable File, Password-Protected File:
      - Active Content: Enable the toggle button to apply the rule to files with active content. This criterion is applicable only to Microsoft Word, Microsoft Excel, Microsoft PowerPoint, and PDF file formats. The File Types field must be set to one of the supported file formats in order to configure this criterion.
      - Unscannable Files: Enable the toggle button to apply the rule only to files that the Zscaler service is unable to scan. This might occur if the file is in an unrecognized file format, excessive size, corrupted, or recursively compressed.
      - After enabling the Unscannable Files option, the corresponding file type policy only applies to those files that Zscaler is unable to scan. The policy is not applied to any other file types.
      - Password-Protected File: Enable the toggle button to apply the rule only to files with password protection. When enabled, only the file types that are password-protected are available. This criterion is applicable only to 7-Zip, RAR, Zip, Zipx, Password-Protected Microsoft Office Documents, Password-Protected/Encrypted Files, and PDF file types. If the toggle is not enabled, any files that are in the drop-down menu are not explicitly password-protected or encrypted.
    - Who:
      - Users: Select Select All to apply the rule to all users, or select the checkbox next to the user you want to add. To remove a user, re-select the user, or to remove all users, select Remove All.
      - Groups: Select Select All to apply the rule to all groups, or select the checkbox next to the group you want to add. To remove a group, re-select the user, or to remove all groups, select Remove All.
      - Departments: Select Select All to apply the rule to all departments, or select the checkbox next to a department.
      - Any rule that applies to unauthenticated traffic must apply to all Groups and Departments. So, if you have chosen to apply this rule to unauthenticated traffic for either Users or Departments, select Any from the drop-down menus for Groups and Departments.
    - Where:
      - URL Categories: Select the URL categories to which you want to apply the rule. The service applies the rule when users upload to or download files from sites in the selected categories. Select Any to apply the rule to all categories, or select any number of categories. You can also search for URL categories, or add a custom category.
      - You can also select custom TLD categories from this field.
      - Cloud Applications: Select any number of cloud applications or cloud application classes. Selecting no value ignores the criterion in the policy evaluation.
    - Location:
      - Locations: Select Any to apply the rule to all locations, or select up to 32 locations.
      - Contact Zscaler Support to increase the limit of Users, Groups, Departments, or Locations.
      - Location Groups: Select Any to apply the rule to all location groups, or select up to 32 location groups. You can also search for a location group.
    - Devices:
      - Devices: Select the devices for which you want to apply the rule. You can also search for a device. Selecting no value ignores the criterion in the policy evaluation.
      - Device Groups: Select the device groups for which you want to apply the rule. For Zscaler Client Connector traffic, select the appropriate group based on the device platform. Select Cloud Browser Isolation or No Client Connector to apply the rule to isolation traffic or to traffic that is not tunneled through Zscaler Client Connector, respectively. You can also search for a device group. Selecting no value ignores the criterion in the policy evaluation.
      - The Cloud Browser Isolation group is available only if Zero Trust Browser (formerly Isolation) is enabled for your organization.
    - When:
      - Time: Select Always to apply this rule to all time intervals, or select up to two time intervals.
    - Risk:
      - Device Trust Level: Select the device trust level values (High Trust, Medium Trust, Low Trust, or Unknown) to which the rule applies. While the High Trust, Medium Trust, or Low Trust evaluation is applicable only to Zscaler Client Connector traffic, Unknown evaluation applies to all traffic. Selecting no value ignores the criterion in the policy evaluation.
      - The trust levels assigned to the devices are based on your posture configurations in the Zscaler Admin Console.
  - See image.
  - To remove an individual condition from the rule, click the Delete icon. You can expand or collapse individual criteria tiles as needed.
  - Actions
  - In the Actions section, select the action to apply when the rule conditions are met:
    - Action: Choose to Allow, Block, or Caution users from uploading or downloading files.
    - If Traffic Capture is enabled, the Capture option appears when Block is selected. Captured traffic is stored in PCAP files for later analysis. To enable Traffic Capture for this policy, see Configuring Traffic Capture Settings.
    - Upload/Download: Choose whether the specified action applies to uploading files, downloading files, or both.
    - Browser Notification Template: (Optional) Select a browser-based EUN message from the drop-down menu to display the message in the browser when the user activity triggers the File Type Control Policy rule.
    - This field appears when the application access is set to either Caution or Block.
  - See image.
  - Details
  - In the Details section, provide general information about the rule:
    - Rule Name: A system-generated rule name is automatically populated, and the name can be edited. The name cannot exceed 63 characters.
    - Description: (Optional) Click Add Description and enter additional notes or information about the rule in the text field. You can adjust this field's size as needed, depending on your content length. The description cannot exceed 10,240 characters.
    - Rule Label: (Optional) Click Add Rule Label and select a label from the drop-down menu.
    - Rule Order: A rule order is automatically assigned and displayed. It determines the rule's position in the ascending order of evaluation used for all rules within the policy. You can modify the rule order, but if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
    - To modify the rule order:
      - Click Edit.
      - In the Edit Rule Order drawer that appears, enter the required rule order under Current Rule. You can review the existing rules shown in the drawer and modify your current rule order.
      - You can also adjust the number of rules displayed per page and navigate through the next and previous pages.
      - Click Apply.
    - Rule Expiration: (Optional) Enable to set a date and time to automatically stop enforcing this rule when the expiration is reached. The rule retains its place in the rule order but is not evaluated after it expires.
    - Rule Status: By default, the status is Disabled. You need to enable the rule to activate and enforce it on your traffic.
    - Disabled rules can have a rule order assigned. During evaluation, the service skips the disabled rules and moves to the successive ones.
  - See image.
- Save and activate the change.
