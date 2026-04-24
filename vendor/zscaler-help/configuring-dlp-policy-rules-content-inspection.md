# Configuring DLP Policy Rules with Content Inspection

**Source:** https://help.zscaler.com/zia/configuring-dlp-policy-rules-content-inspection
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Policies 
Data Loss Prevention 
Configuring DLP Policy Rules with Content Inspection
Internet & SaaS (ZIA)
Configuring DLP Policy Rules with Content Inspection
Ask Zscaler

Watch a video about configuring Data Loss Prevention (DLP) Policy with or without content inspection.

This article does not apply to organizations with Evaluate All Rules mode enabled. To learn more, see Configuring DLP Policy Rules with Evaluate All Rules Mode Enabled.

You can use the Zscaler Data Loss Prevention (DLP) engines to detect data, allow or block transactions, and notify your organization's auditor when a user's transaction triggers a DLP rule. If your organization has a third-party DLP solution, Zscaler can forward information about transactions that trigger DLP policy to your third-party solution via secure Internet Content Adaptation Protocol (ICAP). However, Zscaler does not take ICAP responses from your DLP solution. Zscaler only monitors or blocks content according to the policy you configure, then forwards information about transactions so that your organization can take the necessary remediation steps.

The Zscaler DLP engines support files up to 400 MB and can scan the first 100 MB of the extracted text. The maximum size also applies to files extracted from archive files.

To configure a DLP policy rule with content inspection:

1. Configure DLP dictionaries and engines, if necessary. Use DLP dictionaries and engines as they are or modify them to suit your needs. You can also create custom dictionaries or engines. Skip this step if you don't want to modify or create custom DLP dictionaries and engines.
2. Configure DLP notification templates if you want to email notifications to your organization's auditor when your users' transactions violate DLP policy rules.
3. (Optional) Configure ICAP receivers if you want to forward information about transactions that violate DLP policy to your third-party solution. Skip this step if you don't have a third-party DLP solution or if you don't want to forward content.
4. (Optional) Configure a Zscaler Incident Receiver to forward information about content that triggers an outbound email policy rule to your Incident Receiver via secure Internet Content Adaptation Protocol (ICAP). Zscaler does not take ICAP responses from your Incident Receiver; instead, the service only monitors or blocks content according to the policy you configure, then forwards information about activities so that your organization can take necessary remediation steps.
5. (Optional) Configure Cloud-to-Cloud Incident Forwarding to send metadata and evidence about transactions that violate a DLP policy rule directly to your public cloud storage without deploying appliances.
6. Define your policy rules.

Go to Policy > Data Loss Prevention.
Click Add DLP Rule.
In the Add DLP Rule window:
Enter the following DLP Rule attributes:
Rule Order: Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule’s place in the order. You can change the value, but if you’ve enabled admin ranking, then the assigned admin rank determines the rule order values you can select.
Admin Rank: Enter a value from 0 to 7 (0 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule’s admin rank determines the value you can select in the rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
Rule Name: Enter a unique name for the DLP rule or use the default name.
Rule Status: An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.
Rule Label: Select a rule label to associate it with the rule. To learn more, see About Rule Labels.
Define the following Criteria:

Content Matching: Choose Select DLP Engines to use Zscaler DLP engines for content inspection on this rule.

See image.

Close

Inspect HTTP GET Query Parameters: You can configure DLP rules to inspect HTTP GET Query Parameters for the following URL categories: Generative AI and ML Applications, Safe Search Engines, Translation Tools, Web Search, and User-Defined Custom URL Categories. To enable, choose Enable for Inspect HTTP GET Requests, then select a URL category from the drop-down menu. To learn more, see Configuring DLP Advanced Settings.

To select a user-defined custom URL category from the drop-down menu, go to the DLP Advanced Settings page (Administration > DLP Advanced Settings) and select a User-Defined URL.

See Image.

Close

DLP Engines: Select Any to choose all DLP engines for this rule, or select up to 4 engines. You can search for DLP engines or click the Add icon to create a new DLP engine.

The Match Only option takes effect for both Allow and Block rule actions. You can select Match Only to configure how engines must trigger in order for the service to take action. To learn more, see DLP Policy Configuration Example: Match Only.

All the dictionaries in a given engine must trigger for an engine to trigger.

If deselected, only one of the engines is required to trigger in order for the service to take action.
If selected, all engines are required to trigger in order for the service to take action, and the transaction must not match any other engines from different rules.

For example, you create a DLP rule with the PCI engine and select the Match Only option. In this case, the rule does not trigger when a transaction triggers both the PCI and HIPAA engine. It only triggers when a transaction triggers only the PCI engine.

Content Locations: You can choose one or more content locations as a match criteria to target specific sections of a file or transaction. Matches vary depending on which content location you select.

To enable this feature, contact Zscaler Support.

File
Document Properties: Matches are based on the file metadata (i.e., MIP labels).
File Content: Matches are based on the actual content of the file, not including metadata.
File Name: Matches are based on the name of the file.
HTTP Body
HTTP Body: Matches are based on the non-file body of the HTTP request. Matches are based on the body of the HTTP request. Note: you must also select non-file file type when selecting HTTP Body as a content location.
Source IP Groups: Select Any to apply the rule to all source IP groups, or select any number of source IP groups. You can also search for source IP groups or click the Add icon to add a new source IP group.
URL Categories: Select Any to apply the rule to all URL categories, or select any number of URL categories. You can search for URL categories or click the Add icon to create a new URL category. You can create DLP policy rules that apply to only content being sent to specific URL categories. For example, you can create a rule that blocks credit card numbers from being sent to websites in the Adult Material URL category.

You can also select custom TLD categories from this field.

Conversely, you can create DLP policy rules to exempt some sites from a rule that blocks content. For example, an organization needs to protect its source code generally, but still allow the content to be sent to certain authorized sites. To achieve this, the organization can create one rule that blocks all outbound source code and create another rule that allows outbound source code to a specific URL category that includes the authorized URLs.

If you want to exempt a specific website or custom URL category from DLP evaluation, you must add the website or URL category to the Cloud Apps & URL Exceptions for DLP list. To learn more, see Configuring DLP Advanced Settings.

Cloud Applications: Select Any to apply the rule to all cloud applications, or select any number of cloud applications. You can also search for applications. You can create DLP policy rules that apply to only content being sent to specific cloud applications. For example, you can create a rule that blocks offensive content from being posted to Facebook.

By default, this field displays the first 100 cloud applications. The subsequent 100 cloud applications are displayed when you select Click to see more following the list. You can repeat this process to view the remaining cloud applications.

See image.

Close

Conversely, you can create DLP policy rules that allow specific kinds of content to certain applications. For example, you can have a rule that blocks the release of financial information generally and create another rule that exempts financial information being sent to an application like Salesforce.

If you want to exempt a specific cloud application from DLP evaluation, you must add the cloud application to the Cloud Apps & URL Exceptions for DLP list. To learn more, see Configuring DLP Advanced Settings.

The DLP policy applies AND logic to the URL Categories and Cloud Applications fields when inspecting your organization's traffic. In order for a DLP rule to trigger, the Zscaler service must detect the rule’s selected URL categories and cloud applications in a transaction.

Email Recipient Domain Profiles (Gmail and Outlook): Choose Include to apply the rule only to the selected domain profiles, or choose Exclude to apply the rule to all other domain profiles and not selected domain profiles. You can select up to 8 domain profiles, and you can search for domain profiles.
Cloud Application Instances: Select the cloud application instances to which the rule applies. You can select a maximum of 8 instances per rule.

The cloud application instance appears only if its parent application is selected as the cloud application.

ZPA Application Segment: Select Any to apply the rule to all Zscaler Private Access (ZPA) application segments, or select up to 255 ZPA application segments. You can also search for ZPA application segments. The list displays only those ZPA application segments that have the Source IP Anchor option enabled.

If you select the Inspect App Segments option from the list, then the configured rule applies to all the ZPA application segments paired to your ZIA tenant. This option is only available if the SIPA App Segments subscription is enabled for your organization.
See image.
Close

File Type: From the drop-down menu, choose the file types for the rule. You can create DLP policy rules that apply just to content being sent via specific file types. Policies that reference Zscaler DLP engines support different file types than policies that reference external DLP engines. Zscaler DLP engines can scan files of up to 100 MB. For an archived file, the size of individual files when decompressed can also be a maximum of 100 MB. You can also select custom file types you have previously configured.

Zscaler-defined file types are considered before custom file types and custom files inside archives are not detected.

Minimum Data Size: Enter the minimum size requirement that data must meet before the DLP rule applies. The default minimum data size, 0 KB, means there is no minimum data size requirement.
Users: You can specify how the DLP rule applies to your users.
Choose Include to apply the rule to selected users and no other users. From the drop-down menu, choose Any to apply the rule to all users or select up to 32 users.
Choose Exclude to apply the rule to all other users and not selected users. You can select up to 256 users.

When selecting users, you can search for users or click the Add icon to add a new user. If you’ve enabled the Policy for Unauthenticated Traffic, you can also select special users to apply this rule to all unauthenticated users or select specific types of unauthenticated users.

Groups: You can specify how the DLP rule applies to your groups.
Choose Include to apply the rule to selected groups and no other groups. From the drop-down menu, choose Any to apply the rule to all groups or select up to 32 groups.
Choose Exclude to apply the rule to all other groups and not selected groups. You can select up to 256 groups.

When selecting groups, you can search for groups or click the Add icon to add a new group.

Departments: You can specify how the DLP rule applies to your departments.
Choose Include to apply the rule to selected departments and no other departments. From the drop-down menu, choose Any to apply the rule to all departments or select up to 32 departments.
Choose Exclude to apply the rule to all other departments and not selected departments. You can select up to 256 departments.

When selecting departments, you can search for groups or click the Add icon to add a new department. If you’ve enabled the Policy for Unauthenticated Traffic, you can also select special departments to apply this rule to all unauthenticated transactions.

Any rule that applies to unauthenticated traffic must apply to all groups and departments. So, if you have chosen to apply this rule to unauthenticated traffic for either Users or Departments, select Any from the drop-down menus for Groups and Departments.

The DLP policy applies OR logic to the Users, Groups, and Departments fields when inspecting your organization’s traffic. In order for the DLP rule to trigger, the Zscaler service must detect at least one of the rule’s selected users, groups, or departments.

User Risk Profile: Select the user risk score levels to which the rule applies. Selecting no value ignores this criterion in the policy evaluation.

Users are assigned a risk score based on their browsing activities. A range of risk scores is grouped as a risk score level.

By default, the following user risk score levels are available:

Low: Level with user risk scores ranging from 0 to 29
Medium: Level with user risk scores ranging from 30 to 59
High: Level with user risk scores ranging from 60 to 79
Critical: Level with user risk scores ranging from 80 to 100

Contact Zscaler Support to customize the user risk score range of these levels for your organization.

Locations: Select Any to apply the rule to all locations, or select up to 32 locations. You can also search for a location or click the Add icon to add a new location.

Contact Zscaler Support to increase the limit of Users, Groups, Departments, or Locations.

Location Groups: Select Any to apply the rule to all location groups, or select up to 32 location groups. You can also search for a location group.
Time: Select Always to apply this rule to all time intervals, or select up to two time intervals. You can also search for a time interval or click the Add icon to add a new time interval.
Protocols: Select the protocols to which the rule applies.
HTTP: Data transactions and file uploads from HTTP websites.
HTTPS: Data transactions and file uploads from HTTP websites encrypted by SSL/TLS.
Native FTP: Data transactions and file uploads from native FTP servers.
WebSocket: Data transactions from WebSocket websites.
WebSocket SSL/TLS: Data transactions from WebSocket websites encrypted by SSL/TLS.

The WebSocket protocol is supported only for the Microsoft Copilot application.

Workload Groups: Select up to 8 workload groups for which you want to apply the rule. You can also search for a workload group. Selecting None ignores workload groups when the policy is evaluated. To learn more, see About Workload Groups.
Inspect Downloads: Enable this option to allow DLP inspection for content downloaded from specific cloud apps. If this option is enabled, you must also choose Any for URL Categories and at least one cloud app for Cloud Application. If disabled, the DLP rule only applies to content being sent to cloud apps. The Inspect Downloads feature does not apply to Exact Data Match (EDM) or Indexed Data Matching (IDM) engines.
(Optional) Configure the DLP Incident Receiver settings:
ICAP: Select the applicable ICAP receiver from the drop-down menu. You must configure ICAP receivers to complete this step.
Zscaler Incident Receiver: Select the applicable Zscaler Incident Receiver from the drop-down menu. You must configure your Zscaler Incident Receivers to complete this step.
Cloud-to-Cloud Forwarding: Select the applicable Tenant and Cloud-to-Cloud Forwarding Configuration from the drop-down menus. You must configure Cloud-to-Cloud Forwarding to complete this step.

Ensure that in your third-party DLP solution, you've configured a rule that detects the same data type as the rule you configure here. For example, if you configure a Zscaler DLP rule blocking credit card data, you must also configure a rule in your third-party solution blocking credit card data.

Otherwise, the information that Zscaler sends to your solution regarding a particular rule violation does not appear in your on-premises solution's dashboard. However, the rules do not need to correspond exactly. You don't need to ensure that other criteria for the rules, beyond the data type, correspond. For example, if a Zscaler DLP rule blocks credit card numbers going to a specific URL category, the rule in your on-premises DLP solution must also block credit card numbers, but needn't match the URL category criteria.

Select the Action for the rule:
Allow: The service allows and logs the transaction.
Block: The service blocks and logs the transaction.
Confirm: Users can justify the transaction to continue, or cancel the transaction altogether; in both cases, the service logs the transaction accordingly. Admins can choose to display a default template or a custom template. To learn more, see Configuring User Confirmation Notification Templates.

If the confirmation message times out without the end user taking action, the Zscaler service automatically cancels the transaction. To learn more, see Configuring User Confirmation Notification Templates.

(Optional) Define the following Notification settings:
Configure an email notification for the rule. If you do not select an auditor and notification template, a notification is not sent for this rule.
Email Auditor Type: Select whether the auditor is from a Hosted database or External to your organization.
Select or search for Email Auditor if the auditor is from a hosted database.
Select Auditor Email Address if the auditor is external, and enter the auditor’s email address.
Email Notification Template: Select a notification template from the drop-down menu.
Configure the End User Notification (EUN) for the rule. The type of EUN messages that appear on the endpoint depends on the Action configured for the rule.
End User Notification: Select Show to show an EUN message on endpoints when content triggers the DLP policy rule, or select Hide if you don't want an EUN message to appear.
Custom Message: Select Default to use the default EUN message configured for inline web DLP, or select a custom EUN message from the drop-down menu. You can also search for custom messages or click the Add icon to add a new custom message.
(Optional) Enter a Description including additional notes or information. The description cannot exceed 10,240 characters.
Click Save and activate the change.

For example, if a policy rule using predefined Zscaler DLP engines is configured as shown in the following image, the Zscaler service blocks all the files that:

Contain medical information
Are over 1,000 KB in size
Are being sent by users in the Operations group through Gmail

The Zscaler service sends an email notification regarding the policy violation to your organization's auditor but doesn't forward information to an incident receiver.

See image.

Close

To learn how to use external DLP engines to detect data and also forward information about the data to your third-party DLP solution, see Configuring DLP Policy Rules without Content Inspection.

Close
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Data Loss Prevention
Configuring DLP Policy Rules with Content Inspection
Configuring DLP Policy Rules without Content Inspection
Configuring DLP Policy Rules with Evaluate All Rules Mode Enabled
Configuring DLP Advanced Settings
Monitoring or Blocking Outbound Content by Data Size
DLP Policy Configuration Example: Match Only
Step-by-Step Configuration Guide for Webex Teams Real-Time DLP
Accessing the DSPM Admin Portal using SSO
