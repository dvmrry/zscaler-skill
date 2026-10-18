# About File Type Control Policy

**Source:** https://help.zscaler.com/zia/about-file-type-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398721, revision 3238876

---

Watch a video about File Type Control.
By default, the Zscaler service allows the upload and download of all file types. Use the File Type Control policy to restrict the upload and download of various types of files. For example, you can block audio (MP3, WAV, etc.) and video files (AVI, MP4, MPEG, etc.) so they do not interfere with your bandwidth utilization. You can define rules to restrict the transmission of various files and apply them to individuals, groups, departments, and locations. Zscaler also has a recommended policy for File Type Control.
You can also create rules for unknown file types. Zscaler performs MIME type checks for files it cannot initially identify, and any file that falls outside of well-defined MIME types for common apps is tagged as an unknown file type. To recognize the file types inside archive files, the Zscaler service also scans ZIP, 7-Zip, GZIP, TAR, and RAR files.
There is a 400MB file size limitation for file scanning. To learn more, see Ranges & Limitations.
You can allow, caution or block uploading, downloading or both. When you choose the Caution action, the Zscaler service displays a warning before it allows the user to perform the action. When the Zscaler service blocks users, it displays a notification. The content of the block notification is configured in the End User Notification page.
A File Type Control policy provides the following benefits and allows you to:
- Restrict the upload and download of various types of files, including unknown file types.
- Define rules to restrict the transmission of various files and apply them to individuals, groups, departments, and locations.
- Use the Zscaler recommended File Type Control policy, or create your own custom policy.
- Allow, caution, or block uploads and downloads. For blocked uploads and downloads, you can configure end user notifications to explain the action.
To learn how a File Type Control policy fits into the overall order of policy enforcement, see Understanding Policy Enforcement.
# About the File Type Control Page
On the File Type Control page (Internet Access > Policy > File Type Control), you can do the following:
- View the recommended policy for File Type Control.
- Configure the File Type Control policy.
- Modify the table and its columns.
- View a list of all configured File Type Control rules. For each rule, you can see the following:
  - **Rule Order**: Displays the rules based on the rule order. By default, the rules are listed in the ascending rule order. You can click the column name to display the rules in descending rule order (by default, the rules are listed in ascending rule order).
  - **Rule Name**: The name of the rule.
  - **Rule Action**: Displays if the rule status and whether the selected file types are allowed, blocked, or cautioned when uploaded or downloaded.
  - **Rule Label**: Displays the rules based on the rule labels. The rules are grouped under the associated rule labels.
  - **Admin Rank**: The assigned admin rank for the rule. This is visible only if admin ranking is enabled in the Advanced Settings.
  - By default, the admin ranking is disabled. To use this feature, you must enable Admin Rank in Policies > Common Configuration > Advanced > Advanced Settings. To learn more, see Configuring Advanced Settings.
  - **Description**: The description of the policy rule, if available.
- Edit a configured File Type Control rule.
- Duplicate a configured File Type Control rule.
- Delete a configured File Type Control rule.
- Search for a configured File Type Rule.
- Select the **Filter** icon to view the rules by rule label. The rules are grouped under the associated rule labels.
