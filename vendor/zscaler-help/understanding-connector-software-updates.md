# Understanding App Connector Software Updates

**Source:** https://help.zscaler.com/zpa/understanding-connector-software-updates
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help 
App Connector Management 
App Connector Software Updates 
Understanding App Connector Software Updates
Private Access (ZPA)
Understanding App Connector Software Updates
Ask Zscaler

Watch a video about updating App Connector Software (shows legacy UI).

When creating App Connector groups, you can specify a day and time when the App Connector software is updated to the latest version. When a new software version is available, an App Connector in the group is randomly chosen to update. While updating, the App Connector restarts and becomes temporarily unavailable. Any new application access is redirected to the other App Connectors in the App Connector group.

The update occurs within a 4-hour window and starts at the specified time for the App Connector group. After an App Connector has successfully updated, another eligible App Connector in the group is chosen and updated. This continues until the 4-hour window expires or all the App Connectors in the group have updated successfully. If a software update is unsuccessful, the update process is retried in every periodic software update until all App Connectors are upgraded.

Starting in App Connector version 24.650.4 and later, a version check and automated upgrade is performed during an initial connection. To learn more, see Zscaler Trust.

If the App Connectors for your internal applications are using software that is not functioning as expected, Zscaler Support might update software for these App Connectors prior to the next periodic software update. Zscaler Support informs your organization's Private Access (ZPA) administrators in advance if there is a need for an immediate software update.

To learn more, see Scheduling Periodic Software Updates for an App Connector Group and Manually Updating App Connector Software. For information on locally updating operating system software or software packages via a deployed App Connector console, see Managing Deployed App Connectors.

About the App Connector Update Status

On the App Connectors page, you can see the update status of each App Connector in the Update Status column. There are three types of statuses:

Scheduled

If an App Connector is scheduled to update to the latest version, its Update Status displays Scheduled.

When you hover over the Scheduled status, it displays the following information:

Scheduled Version: Displays the scheduled software version that is applied when the App Connector updates.
Upgrade Window: Displays the 4-hour window during which the App Connector updates.

When the App Connector is scheduled for an update, you can't change the periodic software update time for that particular App Connector.

If an App Connector is scheduled for an update, you can also manually update the App Connector before the scheduled time. To learn more, see Manually Updating App Connector Software.

Close
Success

If an App Connector successfully updates to the latest version, its Update Status displays Success.

When you hover over the Success status, it displays the Scheduled Version, which is the scheduled software version that the App Connector updated to.

Close
Failure

If an App Connector fails to update to the latest version, its Update Status displays Failure. When you hover over the Failure status, it displays the Scheduled Version, which is the scheduled software version that the App Connector failed to update to. If a software update is unsuccessful, the update process is retried in every periodic software update until all App Connectors are upgraded.

Zscaler recommends that you restart the App Connector virtual machine (VM) to recover it from the failure state.

Close
About App Connector Host Operating System Management

App Connectors are licensed so that Zscaler can periodically update their software. However, updates to the host OS is the organization's responsibility, not Zscaler's. The App Connector software is designed to be compatible with updates to the host OS. Zscaler recommends updating the host OS whenever you determine it is necessary. To learn more, see Managing Deployed App Connectors and Operating System Security.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding App Connector Software Updates
Understanding the Manager Software
Scheduling Periodic Software Updates for an App Connector Group
Manually Updating App Connector Software
