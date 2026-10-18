# About Sandbox

**Source:** https://help.zscaler.com/zia/about-sandbox
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399801, revision 3225235

---

Watch a video about Sandbox.
Sandbox provides an additional layer of security against zero-day threats and Advanced Persistent Threats (APTs) through Sandbox analysis, an integrated file behavioral analysis. To ensure your organization's web security, the Zscaler service runs and analyzes files in a virtual environment to detect malicious behavior. It propagates a hash of malicious files to all Public Service Edges for Internet & SaaS (ZIA) throughout the cloud, effectively maintaining a real-time denylist so it can prevent users anywhere in the world from downloading malicious files. Additionally, you can use AI analysis in the rules that make up your Sandbox policy to instantly determine the likelihood of a file being benign or suspicious.
Sandbox provides the following benefits and allows you to:
- Analyze unknown files in a virtual environment to detect malicious behavior.
- Hash propagation of malicious files across all Public Service Edges for Internet & SaaS to protect users anywhere in the world from downloading malicious files.
- Use AI tools to provide real-time analysis of unknown files.
# About the Default Sandbox Rule
By default, the sandbox does the following:
- It analyzes Windows executable files and Windows library files (such as dynamic-link libraries) that are 2 MB or less and downloaded from URLs in suspicious URL categories. The suspicious URL categories include:
  - Nudity
  - Pornography
  - Anonymizer
  - FileHost
  - Shareware Download
  - Web Host
  - Miscellaneous or Unknown
  - Other Miscellaneous
The service also analyzes these files if they’re contained in ZIP archive files.
Zscaler Sandbox supports file sizes up to 50MB for Windows EXEs, Android APKs, and Archive file types.
- When users attempt to download files that meet the preceding criteria and the service has never seen the files before, the service allows the downloads and sends the files to the Sandbox engine for analysis.
- It blocks files that contain the following types of malicious files:
  - **Adware**: Files that automatically render advertisements or install adware. Often, these advertisements are unwanted and can lead to spyware or other grayware-oriented privacy violations.
  - **Malware & Botnets**: Files that behave like APTs, exploits, botnets, trojans, keyloggers, spyware, and other malware. This is a catchall category for any malicious file that doesn't fall under the other Sandbox categories. Most Sandbox-classified files aren't clearly known to be a specific threat or malware family-oriented because there aren't specific signatures or indicators to categorize the file. Instead, it categorizes the file based on an aggregation of the file’s OS and application behaviors and network activity.
  - **P2P & Anonymizers**: Files that exhibit behaviors consistent with P2P/anonymizer programs, such as Tor Browser or other VPN services, that essentially make a user’s internet activity untraceable.
- It blocks malicious file downloads from any of the following protocols:
  - **FTP over HTTP**: File downloads from FTP over HTTP websites.
  - **HTTP**: File downloads from HTTP websites.
  - **HTTPS**: File downloads from HTTP websites encrypted by TLS/SSL.
  - **Native FTP**: File downloads from native FTP servers.
You can modify the default rule, but it isn't recommended.
If you've configured the Sandbox policy to block known malicious files and a user attempts to download a malicious file, the service displays a notification explaining that the file was blocked because it is malicious. The service also logs transactions in real time, and you can view Sandbox reports and data under Dashboard and Analytics.
To learn how this policy fits into the overall order of policy enforcement, see About Policy Enforcement.
# Advanced Sandbox Features
If your organization has Advanced Sandbox, you have the following benefits:
- You can add rules to the Sandbox policy. Rules are applied in the rule order list from first to last. The default rule is always the last rule checked.
- You can scan files sized higher than 2 MB.
- You can specify which file types the sandbox analyzes. Zscaler supports sandboxing for the following:
  - File Types
    - Archive
      - 7-Zip
      - Bzip2
      - Tar
      - RAR
      - ZIP
      - ZIP with Suspicious Script File
    - Executable
      - Visual Basic Script
      - Windows Executable
      - Windows Library
      - Windows PowerShell Script
    - Microsoft Office
      - Microsoft Excel
      - Microsoft PowerPoint
      - Microsoft RTF
      - Microsoft Word
    - Mobile
      - Android Application Package
    - Other Documents
      - Portable Document Format
    - Web Content
      - Adobe Flash
      - HTML Application
      - Java Applet
- You can enable artificial intelligence (AI) pre-scanning for unknown files in quarantine.
- By default, Advanced Sandbox allows for 100 API file submissions per day. This quota can be raised by contacting your Zscaler Account team or Zscaler Support. To learn more, see Obtaining Sandbox Reports Using API and Sandbox Submission API.
- You can compare the report outputs of an unpatched vulnerable VM with a fully patched secure VM to identify mitigation effectiveness and potential risk. To learn more, see Viewing Sandbox Reports and Data.
- If you use Internet & SaaS to inspect Private Access (ZPA) traffic, uploads to Private Access assets are sandboxed if the file is unknown to the Zscaler service.
## Default Rules for Advanced Sandbox
The following disabled rules are included in Advanced Sandbox:
- Sandbox_Docs_Trusted
  - **Rule Order**: 1
  - **Admin Rank**: 7
  - **Rule Name**: Sandbox_Docs_Trusted
  - **Rule Status**: Disabled
  - **File Type**s: Microsoft Office (group) & PDF
  - **Sandbox Categories**: All
  - **Protocols**: FTP over HTTP, HTTP, HTTPS, Native FTP
  - **First-Time Action**: Allow & Scan
  - **AI Instant Verdict**: Enabled
  - **Action for Subsequent Downloads**: Block
  - **Description**: Advanced Sandbox Documents rule created during company creation. This policy rule is intended to be used with a custom user-defined URL Category Trusted Sites (or other applicable name), which after creation needs to be added to the policy via the URL Category control. This policy rule intentionally does not subject documents coming from Trusted Sites to the same level of inspection as untrusted sites.
- Sandbox_Docs_Archives
  - **Rule Order**: 2
  - **Admin Rank**: 7
  - **Rule Name**: Sandbox_Docs_Archives
  - **Rule Status**: Disabled
  - **File Types**: Microsoft Office (group), PDF, and Archives (group)
  - **Sandbox Categories**: All
  - **Protocols**: FTP over HTTP, HTTP, HTTPS, Native FTP
  - **First-Time Action**: Quarantine
  - **AI Instant Verdict**: Enabled
  - **Action for Subsequent Downloads**: Block
  - **Description**: Advanced Sandbox Documents and Archives rule created during company creation. This rule must apply to all URL categories other than the custom user-defined URL Category Trusted Sites.
- Sandbox_Exes_Web
  - **Rule Order**: 3
  - **Admin Rank**: 7
  - **Rule Name**: Sandbox_Exes_Web
  - **Rule Status**: Disabled
  - **File Types**: Executable (group), Web Content (group)
  - **Sandbox Categories**: All
  - **Protocols**: FTP over HTTP, HTTP, HTTPS, Native FTP
  - **First-Time Action**: Quarantine
  - **AI Instant Verdict**: Enabled
  - **Action for Subsequent Downloads**: Block
  - **Description**: Advanced Sandbox Executables and Web Content rule created during company creation.
You can enable and update these rules to fit your organization's needs.
## Advanced Detections Features
If your organization has the Advanced Detections package for Advanced Sandbox, you can analyze EXE and DLL files sized up to 200 MB.
# About the Sandbox Page
If you don't have Advanced Sandbox, some of the following options are not available.
On the Sandbox page (Policies > Cybersecurity > Inline Security > Sandbox > Sandbox Policy), you can do the following:
- View the recommended policy for Sandbox.
- Search for a configured Sandbox rule. You can click the **Filter** icon to filter the displayed rules by rule label.
- Select which columns are visible in the table. You can also choose **Show All Columns**.
- Add a rule to the Sandbox policy.
- View a list of all configured Sandbox rules. For each rule, you can view the following details:
  - **Rule Order**: The rule order number. Sandbox rules are evaluated in ascending numerical order. The default rule is evaluated last.
  - **Admin Rank**: The assigned admin rank for the rule. This is visible only if admin ranking is enabled in the Advanced Settings.
  - **Rule Name**: The name of the rule.
  - **Rule Action**: Displays the configured Sandbox actions of the rule.
  - **Label**: The rule label applied to the rule, if available.
  - **File Types**: The file types selected for the rule.
  - **URL Categories**: The URL categories selected for the rule.
  - **Users**: The users selected for the rule to apply to
  - **Groups**: The groups selected for the rule to apply to.
  - **Departments**: The departments selected for the rule to apply to.
  - **Locations**: The locations selected for the rule to apply to.
  - **Location Groups**: The location groups selected for the rule to apply to.
  - **Sandbox Categories**: The Sandbox categories selected for the rule to apply to.
  - **Protocols**: The Sandbox categories selected for the rule to apply to.
  - **ZPA Application Segment**: The Private Access application segments selected for the rule to apply to.
  - **Status**: Displays if the rule is **Enabled** or **Disabled**.
  - **Description**: The description of the rule, if available.
- Edit a configured Sandbox rule.
- Duplicate a configured Sandbox rule.
- Delete a configured Sandbox rule.
- Go to the Advanced Policy Settings page.
