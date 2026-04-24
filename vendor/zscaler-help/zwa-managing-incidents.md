# Managing Incidents (Workflow Automation)

**Source:** https://help.zscaler.com/workflow-automation/managing-incidents
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Workflow Automation Help 
Workflow Automation for Data Protection 
Incident Management 
Managing Incidents
Workflow Automation
Managing Incidents
Ask Zscaler

The Incidents page in Workflow Automation captures and displays a list of the transactions that have violated the Data Protection policies (Inline DLP, Endpoint DLP, Email DLP, and SaaS Security DLP) that your organization has configured in the Zscaler Admin Console. Each such recorded transaction is known as an incident. This page enables you to review and remediate Data Loss Prevention (DLP) incidents.

You can view high-level visibility and insight into your organization's Data Loss Prevention (DLP) incidents using the Incident Analytics dashboard. This dashboard provides a variety of information about the incidents over a specified timeframe, such as the time taken to triage and resolve incidents, previous and current incident counts, and the cumulative number of new and resolved incidents, etc. To learn more, see About the Incident Analytics Dashboard.

The following is a primary process flow for incident resolution using the Zscaler Admin Console:

Workflow Automation assigns the transaction that violated the DLP policies of an organization (the incident) to an admin who has edit access to that incident group.

If the violated rules belong to an incident group that is not mapped to an admin, incidents are not auto-assigned to an admin. For those incidents, super admins can log in to the Incidents page and assign admins manually.

The admin accesses the Incidents page in the Zscaler Admin Console to review new incidents.
The admin then starts investigating the new incident and determines whether to notify the end user (the next step) or escalate to an approver or the end user's manager (the step after that), depending upon the severity of the incident.
An email notification requests justification from the end user. After receiving a justification, the admin either closes the incident or escalates it to an approver or the end user's manager (the next step).
The approver or the end user's manager receives an email notification requesting advice on how to proceed. After the approver responds, the admin proceeds with the incident or closes it, depending upon the response.

While investigating an incident, the admin can also change the priority of the incident and assign a new DLP admin.

A restricted admin can only assign an incident to a super admin.

Viewing Incidents

On the Incidents page (Administration > Workflow Automation > Data Protection > Incidents), you can do the following:

Export incidents to a CSV file.
Refresh the page to display the latest information.
Select a date range for the incidents displayed on the Incidents page.
Filter the incident information that is displayed on the page by priority. To display only information about critical and high-priority incidents, select High Only.
Filter the incident information that is displayed on the page by severity. To display only information about high-severity incidents, select High Only.
Use and manage the incident filters.
Reset all the applied filters.

View the following widgets:

All: Displays the total number of incidents that have occurred in your organization (i.e., Open, Unassigned, Resolved, Waiting Feedback, and Escalated incidents).
Open: Displays the number of open incidents (i.e., incidents with the status New, Investigating, or Received Justification Response).
Unassigned: Displays the number of incidents that are not assigned to a DLP admin.
Resolved: Displays the number of closed incidents (i.e., incidents with the status Resolved).
Waiting Feedback: Displays the number of incidents awaiting justification from the end user or awaiting feedback from the approver after escalation (i.e., incidents with the status Validating with User or Escalated).
Escalated: Displays the number of incidents escalated to the managers or approvers for further review (i.e., incidents with the status Escalated).
Response Available: Displays the number of incidents where a user has provided a response from a user notification, or where a manager or approver has provided a response from an escalation notification (i.e., incidents with the status Received Justification Response).

You can click a widget to view only the applicable incidents for the selected widget. For example, if you click the Open widget, only the incidents with the status New, Investigating, or Received Justification Response are displayed in the incidents table, and the widget is highlighted with a blue border. To reset the selection, click the widget again.

Perform actions against one or more incidents available on a single page or bulk actions against all incidents available across different pages.
Search for an incident by All or Transaction ID. The search only shows results that match the search string.

All: This option allows you to enter free-form text that can match multiple incidents. This search is not case-sensitive.

You can search for incidents associated with a URL by entering a complete URL (e.g., https://www.jumpshare.com/https-post) or the complete host name (e.g., www.jumpshare.com) for a URL.

You can also enter multiple strings within a single text string. If you enter multiple strings within a text string, each string is treated with an AND operation. For example, if you enter Microsoft Office as the text string, all incidents containing Microsoft and Office are returned with this search, such as Microsoft Office, Microsoft Office 365, and Office 365 Microsoft. This search does not return incidents containing only Microsoft or Office.

If you choose user attributes for obfuscation, you cannot search for incidents using these obfuscated user attributes.

In addition, there might be times when you perform a free-form text search for incidents and some of the incidents might not display in the search results due to the obfuscation settings. A notification message appears at the top of the incidents table to inform you of this situation.

See image.

Close

To learn more about obfuscation settings, see Managing Account Settings and Managing Admin Assignments.

Transaction ID: This option allows you to search for one or more incidents by their transaction IDs. To search for multiple incidents, enter the transaction IDs separated by a comma. You can search for up to 10 incidents.

You can also search for an incident using its duplicate transaction ID. The search result provides the actual transaction ID of the incident. To learn more about duplicated incidents, see Viewing & Managing Incident Details.

View a list of incidents that have occurred in your organization. For each incident, you can view:
Transaction ID: The transaction ID for the incident. If duplicate incidents exist for an incident, this column also displays the total count of the duplicate incidents next to the transaction ID. To learn more, see Understanding Duplicate Incidents in Workflow Automation.
System Creation Date: The date and time when the incident was created in the system. Workflow Automation searches the incidents based on the System Creation Date, and by default it sorts the incidents based on the Incident Date.
Last Change Date: The date and time when the incident was last modified. The date and time are displayed in the local time zone of the admin.
Priority: The priority of the incident. Priorities are Critical, High, Medium, and Low.
Severity: The severity of the incident. Severities are High, Medium, and Low.
DLP Admin: The DLP admin who is responsible for the incident.
Source DLP Type: The type of DLP policy that the incident violated. Source DLP types are Inline, Email, Endpoint, and SaaS Security.
DLP Type: The type of DLP incident. This value is retrieved from the incident itself.
Labels: The labels assigned to the incident.
Status: The status of the incident. Statuses are:
New
Investigating
Validating with User
Justification Response Received
Escalated
Resolved
Engine(s): The DLP engines associated with the incident.
Dictionary Match Count(s): The DLP dictionaries associated with the incident. The number of times the incident matched a specific dictionary is displayed in brackets (e.g., Financial Statements [10]).
Rule(s): The DLP rules associated with the incident.
Action: The action associated with the incident.
Destination: The destination of the incident.
Last Change: The latest state of the incident. It indicates the most recent change to the incident.
Incident Date: The date and time when the incident was generated due to a policy violation. The date and time are displayed in the local time zone of the end user.
Incident Groups: The incident groups associated with the incident.
Justification Reason: The reason for the incident submitted by the end user, the end user's manager, or another approver.
Justification Note: The justification type of the incident.
Username: The name of the end user responsible for the incident. When you click the name link, you are redirected to the Incidents page, which displays only the incidents created by that end user. The user filter is automatically applied in the Filters section. If you applied other filters before clicking the name link, those filters remain applied, as well. If you choose the User Name attribute for obfuscation, multiple asterisks appear for this field. To learn more about user data obfuscation, see Managing Account Settings and Managing Admin Assignments.
Client IP: The client IP address of the end user. If you choose the Client IP attribute for obfuscation, multiple asterisks appear for this field. To learn more about user data obfuscation, see Managing Account Settings and Managing Admin Assignments.
File Name: The name of the file associated with the incident. If an evidence file for a DLP incident exceeds 100 MB in size, the Zscaler service replaces the original file with a placeholder evidence file. The placeholder file retains the original name with ".txt" appended (e.g., attachment.pdf.txt and samplefile.xlsx.txt). When the placeholder is open or downloaded, the placeholder provides a message indicating that the file is too large to send.
File Type: The type or extension of the file.
File MD5: The 32-character MD5 hash of the file.
Application Name: The name of the application.
Application Category: The category of the application.
Home Location: The home location of the end user.
Work Location: The work location of the end user.
Department: The department of the end user.
Referrer URL: The referrer URL of the application.
File Source Location: The source location of the file.
File Size: The size of the file in bytes.
File Modification Time: The date and time that the file was last modified.
Document Type: The type of document.
Resolution Date: The date and time when the incident was resolved (i.e., closed).
Integration: The name of the DLP application integration in Workflow Automation where the incident occurred. To learn more, see Configuring the DLP Application Integration Using Amazon Web Services, Configuring the DLP Application Integration Using Azure, and Configuring the DLP Application Integration Using Google Cloud Platform.
Channel: The type of channel (e.g., Network Drive Transfer or Remote Drive Transfer) that the user used to cause the incident. This field appears only for incidents of Source DLP type Endpoint.
External Collaborators Groups: The collaborator groups outside your organization for the incident. This field appears only for incidents of Source DLP type SaaS Security.
File Link Expiry: The date and time when the file link expires. This field appears only for incidents of Source DLP type SaaS Security.
File Modified By: The email address of the user who last modified the file. This field appears only for incidents of Source DLP type SaaS Security.
File Shared By: The email address of the user who shared the file. This field appears only for incidents of Source DLP type SaaS Security.
File Shared At: The date and time when the file was shared. This field appears only for incidents of Source DLP type SaaS Security.
Triggered Recipients: The recipients who took actions that triggered rules on which some action was taken, such as allow and block. This field appears only for incidents of Source DLP type Email. If you choose the Recipient Email attribute for obfuscation, multiple asterisks appear for each recipient email in this field. To learn more about user data obfuscation, see Managing Account Settings and Managing Admin Assignments.
Internal Recipients: The recipients within your organization who received the email that caused the incident. This field appears only for incidents of Source DLP type SaaS Security. If you choose the Recipient Email attribute for obfuscation, multiple asterisks appear for each recipient email in this field. To learn more about user data obfuscation, see Managing Account Settings and Managing Admin Assignments.
External Recipients: The recipients outside your organization who received the email that caused the incident. This field appears only for incidents of Source DLP type SaaS Security. If you choose the Recipient Email attribute for obfuscation, multiple asterisks appear for each recipient email in this field. To learn more about user data obfuscation, see Managing Account Settings and Managing Admin Assignments.
Protocol: The protocol (e.g., FTP, HTTP, or HTTPS) used for the incident. This field appears only for incidents of Source DLP type Inline.
User Groups: The groups that the end user belongs to in your organization.
Destination Type: The destination type (e.g., Removable Storage Device) for the incident.
Component: The specific subresource within a SaaS tenant where the violation occurred. This field appears only for incidents of Source DLP type SaaS Security.
Content Location: The category of the collaboration channel for the event. This field appears only for incidents of Source DLP type SaaS Security.
Workspace: The name or identifier of the collaboration workspace. This field appears only for incidents of Source DLP type SaaS Security.
Domains: The domains associated with the transaction context. This field appears only for incidents of Source DLP type SaaS Security.
Modify the table and its columns.
View detailed information about each incident on the Incident Details page.
View the number of rows of incidents displayed on the page. You can modify the number of rows using the Rows per page drop-down menu.

See image.

Close

Managing Incidents

The Incidents page allows you to perform certain actions to manage the incidents assigned to you.

Apply Time Range Filter

You can filter the incidents displayed on the Incidents page by the date and time of occurrence. By default, this page displays information about the incidents that occurred in the current calendar week (Sunday through Saturday). The time range filter applies to all widgets. Time ranges are:

Hours
Current Hour
Last Hour
Last 2 Hours
Last 6 Hours
Last 12 Hours
Days
Current Day
Last Day
Weeks
Current Week
Last Week
Months
Current Month
Last Month

Custom Date Range

To view the incidents that occurred in a specific date range, you can use the Custom Date Range option and specify the start and end dates and times. To specify a custom date range:

Select the Custom Date Range option. A calendar appears with the current date selected. To the right of the calendar, three columns appear, displaying the hours, minutes, and seconds for a day.

See image.

Close

Select the start date on the calendar, and then in the columns to the right, select the start time (i.e., hour, minute, and second). As you select the date and time, they appear in the Start date field under the calendar.

See image.

Close

Click OK. The date and time you selected appear in the Start date field, and the End date field is selected.

Select the end date in the calendar, and then in the columns to the right, select the end time (i.e., hour, minute, and second).

See image.

Close

Click OK.

The Custom Date Range option only supports incidents that are up to 6 months old, and you can only search for a maximum of a three-month rolling window.

See image.

Close

Close
Export Incidents

You can export all incidents, or you can use the filter criteria or sort the incidents to modify the incidents that are displayed, and then export those incidents. After you perform the export action, and when your incident file export is successfully completed, Workflow Automation emails you a notification stating that your incident file export is successfully completed. The incident file is available on the Downloads page, where you can download the incidents to a CSV file. The CSV file lists the incidents in the order in which they appeared in the Incidents table when you exported them.

Exporting numerous incidents takes time to download. Only a maximum of three bulk activities (download incidents and bulk actions) can be in progress concurrently.

Close
Perform Actions

To manage incidents, you can perform various actions against them. You can also perform these same actions against a single incident on the Incident Details page.

To perform actions:

On the Incidents page, select the checkbox next to one or more Transaction IDs on a single page to select the incidents.
From the Actions drop-down menu, select one of the following actions that you want to perform:
Assign DLP Admin

To assign a DLP admin for incidents:

Select Assign DLP Admin.

The Assign DLP Admin window appears.

In the Assign DLP Admin window, you can:

DLP Admin: Select a DLP admin to assign to the incident. The drop-down menu displays only the DLP admins who have edit access to the incident groups. If you have selected two or more incidents, the menu displays only DLP admins who have edit access to at least one incident group of the selected incidents. An empty menu indicates that no DLP admin has edit access to the incident groups.

Only DLP admins with full access to Workflow Automation can assign incidents to DLP admins with restricted access.

Notes: (Optional) Enter additional notes for the action.
Click Assign.

See image.

Close

Close
Assign to Me

To assign incidents to yourself, select Assign to Me. The selected incidents are assigned to you.

Close
Assign Priority

To assign or modify priority for incidents:

Select Assign Priority.

The Assign Priority window appears.

In the Assign Priority window, you can:
Priority: From the drop-down menu, select the priority for the incidents.
Notes: (Optional) Enter additional notes for the action.
Click Assign.

See image.

Close

Close
Close Incident

To close incidents:

Select Close Incident.

The Close Incident window appears.

In the Close Incident window, you can:
Notes: (Optional) Enter additional notes for the action.
Resolution Label: Select a resolution label and values associated with the label.
False Positive: If the incident is a false positive, select the False Positive checkbox
Click Close Incidents.

See image.

Close

After an incident is closed (status is Resolved), you can still perform all the other actions against the incident except for the Investigating and Escalate actions, but the incident status remains at Resolved.

Close
Notify User

To notify the current user about the incident:

Select Notify User.

The Notify User window appears.

In the Notify User window, you can:
Channel Type: Select the channel type through which you want to send the incident notification to the end-user. The current user for the incident is displayed in the Current State Details section of the Incident Details page.
Note to user: (Optional) Enter additional notes for the action.
Click Submit.

See image.

Close

Close
Investigating

To investigate incidents:

Select Investigating.

The Investigating window appears.

(Optional) In the Investigating window, enter additional notes for the action.
Click Submit.

See image.

Close

Close
Escalate

To notify the user's manager or another approver about the incident:

Select Escalate. The Escalate window appears.
In the Escalate window, you can:
User Type: Select the type of user (Manager and Approver) to whom you want to escalate the incident. If you select the Approver user type, the Approver field appears, where you can select the approver of your choice for the incident.
Channel Type: Select the channel type through which you want to send the escalations to the user's manager or approver for further review.
Note to user: (Optional) Enter additional notes for the action.
Click Submit.

See image.

Close

Close
Label

To add or remove labels for an incident:

Select Label.

The Add or Remove Label window appears.

In the Add or Remove Label window, you can add or remove labels for an incident:
To add a label:
Click Add.
In the Label field, from the drop-down menu, select a label for the incident.
In the Value field, from the drop-down menu, select the label value if values are associated with that label.
Click the Add icon to input more labels and values to add to the incident.
Click Submit.
To remove a label:
Click Remove.
In the Label field, from the drop-down menu, select a label for the incident.
In the Value field, from the drop-down menu, select the label value if values are associated with that label.
Click the Add icon to input more labels and values to be removed from the incident.
Click Submit.

See image.

Close

Click the Delete icon to remove a label-value pair for the incident.

Close
Update Incident Group

You can use the Update Incident Group action to do the following:

Add additional incident groups to multiple incidents.
Delete one or more of the incident groups that are currently assigned to multiple incidents. Deleting incident groups might result in unassigned incidents and the removal of the admin assigned to the incident.
Update the incident group that is used for assigning the admin to multiple incidents. When making this update, you can select one of the newly added incident groups, or you can select another one of the incident groups that was previously assigned to the incidents.
Assign a default incident group to those unassigned incidents that might occur as a result of deleting an existing assigned incident group.

To update incident groups assigned to multiple incidents:

Select Update Incident Group. The Update Incident Group window appears, displaying the following information:

In the Available section, all the incident groups that have been assigned to at least one admin appear in alphabetical order. The number of available incident groups appears in parentheses next to the heading. To learn more, see Managing Admin Assignments.
In the Assigned section, the incident groups that are currently assigned to the incidents appear. The number of assigned incident groups appears in parentheses next to the heading.

See image.

Close

(Optional) Add incident groups:

(Optional) At the top of the window, use the search field to locate an incident group in the Available section.

The search for incident groups spans across the Available, Assigned, and Newly added sections.

In the Available section, click the Add icon next to each incident group that you want to add to the incidents. The incident group is moved from the Available section to the Newly added section. The number of newly added incident groups appears in parentheses next to the heading.

In the Newly added section, you can also delete a newly added incident group by clicking the Delete icon next to an incident group. After you delete an incident group, that incident group is displayed in the Available section. You can also click Reset to reset the window to the original incident group settings.

See image.

Close

(Optional) Delete assigned incident groups. You can delete assigned incident groups even if you have not added new incident groups. In the Assigned section, click the Delete icon next to each incident group you want to delete. After you delete an incident group, that incident group is displayed in the Available section.

See image.

Close

If you delete an assigned incident group in the Assigned section, and you have not added any new incident groups in the Newly added section, the Assign Default Group checkbox becomes available and is selected. Deleting an assigned incident group might result in unassigned incidents and the removal of the admin assignments for those incidents. Assigning a default group is only required if you delete an assigned incident group, and you have not added any new incident groups.

You must have at least one incident group assigned to the incidents. If you delete all the assigned and newly added incident groups, a message appears, stating that at least one group must be assigned. You can also click Reset to reset the window to the original incident group settings.

If you deleted an assigned incident group in the Assigned section, and you did not add any new incident groups in the Newly added section, assign the default incident group to be used for those incidents that might become unassigned as a result of the assigned incident group deletion. The system automatically selects the Assign Default Group checkbox. From the Incident Group drop-down menu, select the default incident group to be used for assigning admins to those unassigned incidents. The menu lists all the incident groups that have been assigned to at least one admin, and they are displayed in alphabetical order.

See image.

Close

(Optional) Update the admin assignment for the incidents:

You can update the admin assignment for the incidents to use one of the newly added incident groups or to use another one of the previously existing assigned incident groups.

Select the Update Admin Assignment checkbox. The Incident Group field appears.

From the Incident Group drop-down menu, select the incident group to be used for assigning the admin to the incidents. This menu lists all the incident groups that are displayed in the Assigned and Newly added sections of the window.

See image.

Close

(Optional) In the Notes field, enter additional notes for updating the incident groups.
Click Update. The Incident page appears. To see the updates, refresh the page. After refreshing the page, you can see the following updates:
The Incident Groups field for each incident displays the updated incident groups. Some of the incidents might display the default incident group if you assigned a default incident group.
The Priority field might change on the incidents based on the final list of incident groups that you assigned to the incidents. The priority for the incidents is derived from the incident groups assigned to the incidents. If the incident groups have different priorities, the highest priority is used.
If you updated the admin assignment to use a different incident group, the DLP Admin field for the incidents displays the name of the admin derived from that incident group.
If you assigned a default incident group to support unassigned incidents, the DLP Admin field for those incidents displays the name of the admin derived from the default incident group.
The Last Change field for each incident displays the latest state change that occurred for the incident group updates.
Close

See image.

Close

Close
Perform Bulk Actions

To perform bulk actions:

On the Incidents page, select the checkbox of the Transaction ID header on the incident table.
Click Select All Incidents. This action selects all incidents with or without filter criteria available across different pages on the incidents table.

From the Actions drop-down menu, select one of the following actions that you want to perform:

Assign DLP Admin

To assign a DLP admin for incidents:

Select Assign DLP Admin.

The Assign DLP Admin window appears.

In the Assign DLP Admin window, you can:

DLP Admin: Select a DLP admin to assign to the incidents. The drop-down menu displays only the DLP admins who have edit access to the incident groups. An empty menu indicates that no DLP admin has edit access to the incident groups.

Only DLP admins with full access to Workflow Automation can assign incidents to DLP admins with restricted access.

Notes: (Optional) Enter additional notes for the action.
Click Assign.

See image.

Close

Close
Assign to Me

To assign incidents to yourself:

Select Assign to Me.

The Assign to Me window appears.

(Optional) In the Assign to Me window, enter additional notes for the action.
Click Assign to Me.

See image.

Close

Close
Close Incident

To close incidents:

Select Close Incident.

The Confirm Bulk Action window appears.

In the Confirm Bulk Action window, you can:
Notes: (Optional) Enter additional notes for the action.
Resolution Label: Select a resolution label and values associated with the label.
False Positive: If the incident is a false positive, select the False Positive checkbox
Click Close Incidents.

See image.

Close

Close
Label

To add or remove labels for incidents:

Select Label.

The Add or Remove Label window appears.

In the Add or Remove Label window, you can perform an add or remove labels bulk action for incidents:
To add a label:
Click Add.
In the Label field, from the drop-down menu, select a label for the incident.
In the Value field, from the drop-down menu, select the label value if values are associated with that label.
Click the Add icon to input more labels and values to add to the incident.
Click Submit.
To remove a label:
Click Remove.
In the Label field, from the drop-down menu, select a label for the incident.
In the Value field, from the drop-down menu, select the label value if values are associated with that label.
Click the Add icon to input more labels and values to be removed from the incident.
Click Submit.

See image.

Close

Click the Delete icon to remove a label-value pair for the incident.

Close
Update Incident Group

You can use the Update Incident Group action to do the following:

Add additional incident groups to multiple incidents.
Delete one or more of the incident groups that are currently assigned to multiple incidents. Deleting incident groups might result in unassigned incidents and the removal of the admin assigned to the incident.
Update the incident group that is used for assigning the admin to multiple incidents. When making this update, you can select one of the newly added incident groups, or you can select another one of the incident groups that was previously assigned to the incidents.
Assign a default incident group to those unassigned incidents that might occur as a result of deleting an existing assigned incident group.

To update incident groups assigned to multiple incidents:

Select Update Incident Group. The Update Incident Group window appears, displaying the following information:

In the Available section, all the incident groups that have been assigned to at least one admin appear in alphabetical order. The number of available incident groups appears in parentheses next to the heading. To learn more, see Managing Admin Assignments.
In the Assigned section, the incident groups that are currently assigned to the incidents appear. The number of assigned incident groups appears in parentheses next to the heading.

See image.

Close

(Optional) Add incident groups:

(Optional) At the top of the window, use the search field to locate an incident group in the Available section.

The search for incident groups spans across the Available, Assigned, and Newly added sections.

In the Available section, click the Add icon next to each incident group that you want to add to the incidents. The incident group is moved from the Available section to the Newly added section. The number of newly added incident groups appears in parentheses next to the heading.

In the Newly added section, you can also delete a newly added incident group by clicking the Delete icon next to an incident group. After you delete an incident group, that incident group is displayed in the Available section. You can also click Reset to reset the window back to the original incident group settings.

See image.

Close

(Optional) Delete assigned incident groups. You can delete assigned incident groups even if you have not added new incident groups. In the Assigned section, click the Delete icon next to each incident group you want to delete. After you delete an incident group, that incident group is displayed in the Available section.

See image.

Close

If you delete an assigned incident group in the Assigned section, and you have not added any new incident groups in the Newly added section, the Assign Default Group checkbox becomes available and is selected. Deleting an assigned incident group might result in unassigned incidents and the removal of the admin assignments for those incidents. Assigning a default group is only required if you delete an assigned incident group, and you have not added any new incident groups.

You must have at least one incident group assigned to the incidents. If you delete all the assigned and newly added incident groups, a message appears, stating that at least one group must be assigned. You can also click Reset to reset the window back to the original incident group settings.

If you deleted an assigned incident group in the Assigned section, and you did not add any new incident groups in the Newly added section, assign the default incident group to be used for those incidents that might become unassigned as a result of the assigned incident group deletion. The system automatically selects the Assign Default Group checkbox. From the Incident Group drop-down menu, select the default incident group to be used for assigning admins to those unassigned incidents. The menu lists all the incident groups that have been assigned to at least one admin, and they are displayed in alphabetical order.

See image.

Close

(Optional) Update the admin assignment for the incidents:

You can update the admin assignment for the incidents to use one of the new incident groups that you added or to use another one of the existing assigned incident groups.

Select the Update Admin Assignment checkbox. The Incident Group field appears.

From the Incident Group drop-down menu, select the incident group to be used for assigning the admin to the incidents. This menu lists all the incident groups that are displayed in the Assigned and Newly added sections of the window.

See image.

Close

(Optional) In the Notes field, enter additional notes for updating the incident groups.
Click Update. The Incident page appears, displaying the incident group updates for the incidents. To see the updates, refresh the page. After refreshing the page, you can see the following updates:
The Incident Groups field for each incident displays the updated incident groups. Some of the incidents might display the default incident group if you assigned a default incident group.
The Priority field might change on the incidents based on the final list of incident groups that you assigned to the incidents. The priority for the incidents is derived from the incident groups assigned to the incidents. If the incident groups have different priorities, the highest priority is used.
If you updated the admin assignment to use a different incident group, the DLP Admin field for the incidents displays the name of the admin derived from that incident group.
If you assigned a default incident group to support unassigned incidents, the DLP Admin field for those incidents displays the name of the admin derived from the default incident group.
The Last Change field for each incident displays the latest state change that occurred for the incident group updates.
Close

See image.

Close

Performing bulk action on numerous incidents takes time to complete. You can check the status of your bulk action on the Bulk Actions page. After you confirm the bulk action, and it is complete, Workflow Automation emails you a notification stating that your bulk action is successfully completed.

Only a maximum of three bulk activities (download incidents and bulk actions) can be in progress concurrently.

Close
View Incident Details

To go to the Incident Details page, click the Transaction ID of an incident on the Incidents page. You can view detailed information about each incident, such as incident ID, violation details, state changes, priority, and severity, and manage the incident.

See image.

Close

To view the Incident Details page for an incident in a new tab of the same browser window, right-click the Transaction ID of an incident on the Incidents page, and select Open in New Tab. In the new tab, the Incident Details page appears, displaying the detailed information for the incident. You can perform actions on the incident on this page, and you can click the Refresh button at the top of the page to display the latest information for the incident. To learn more about the actions, see Viewing & Managing Incident Details.

See image.

Close

Close
Modify Rows Per Page

To modify the number of incidents displayed per page, click the Rows per page drop-down menu and select the number of rows. Options are 10 rows, 20 rows, 25 rows, 50 rows, and 100 rows. The default display is 10 rows.

You can also configure the rows that are displayed on the page using the Table Options dialog window.

See image.

Close

Close
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Managing Incident Groups
Managing Incident Group Mappings
Managing Incidents
Viewing & Managing Incident Details
Managing Incident Summaries
Understanding Duplicate Incidents in Workflow Automation
Using Incident Filters in Workflow Automation
Responding to an End User Notification
Responding to an Escalation Notification
Responding to a User Digest Notification
Responding to a DLP Admin Digest Notification
Understanding Notification Reminders
Managing Priorities
Managing Labels
