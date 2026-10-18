# Understanding Software Updates in Private Access

**Source:** https://help.zscaler.com/zpa/understanding-software-updates-private-access
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540994, revision 3234062

---

Watch a video about updating App Connector Software Updates (shows legacy UI).
Watch a video about Private Service Edge Software Updates (shows legacy UI).
When creating an App Connector, Private Service Edge, Private Cloud Controller, or Network Connector group, you can specify a day and time when the software is updated to the latest version. When a new software version is available, a software component in the group is randomly chosen to update. While updating, the software component restarts and becomes temporarily unavailable. Any new application access is redirected to the other software components in the group. Software components refer to App Connectors, Private Service Edges for Private Access (ZPA), and Private Cloud Controllers.
The update occurs within a 4-hour window and starts at the specified time for the software component group. After a software component has successfully updated, another eligible software component in the group is chosen and updated. This continues until the 4-hour window expires or all the software components in the group have updated successfully. If a software update is unsuccessful, the update process is retried in every periodic software update until all software components are upgraded.
Starting with App Connector and Private Service Edge version 24.650.4 and later, a version check and automated upgrade is performed during an initial connection. To learn more, see Zscaler Trust.
If the software components for your internal applications are using software that is not functioning as expected, Zscaler Support might update software for these software components prior to the next periodic software update. Zscaler Support informs your organization's Private Access administrators in advance if there is a need for an immediate software update.
To learn more, see Scheduling Periodic Software Updates in Private Access and Manually Updating Software Components. For information on locally updating OS software or software packages via a deployed App Connector console, see Managing Deployed Software Components.
# About Software Update Statuses
On each software component page, you can see the software update status in the Software Update column. The following types of statuses are available:
- Scheduled (all software components)
- If a software component is scheduled to update to the latest version, its Update Status displays Scheduled.
- When you hover over the Scheduled status, it displays the following information:
  - **Scheduled Version**: Displays the scheduled software version that is applied when the software component updates.
  - **Upgrade Window**: Displays the 4-hour window during which the software component updates.
- When the software component is scheduled for an update, you can't change the periodic software update time for that particular software component.
- If a software component is scheduled for an update, you can also manually update the software component before the scheduled time. To learn more, see Manually Updating Software Components.
- Success (all software components)
- If a software component successfully updates to the latest version, its Update Status displays Success.
- When you hover over the Success status, it displays the Scheduled Version, which is the scheduled software version that the software component updated to.
- Failure (all software components)
- If a software component fails to update to the latest version, its Update Status displays Failure.
- When you hover over the Failure status, it displays the Scheduled Version, which is the scheduled software version that the software component failed to update to. If a software update is unsuccessful, the update process is retried in every periodic software update until all software components are upgraded.
- Zscaler recommends that you restart the software component's virtual machine (VM) to recover it from the failure state.
- Not Scheduled (App Connector and Private Service Edges)
- After an App Connector or Private Service Edge is created, its initial Upgrade Status displays Not Scheduled.
- Partial Failure (Private Service Edges)
- If a supporting file fails to update, the Private Service Edge's Upgrade Status displays Partial Failure.
- When you hover over the Information icon next to the supporting file, it displays the Scheduled Version, which is the scheduled supporting file version that the Private Service Edge failed to update. Zscaler recommends troubleshooting to figure out why the supporting file failed to update.
- Restarting (Private Service Edges)
- After the Private Service Edge downloads the new software version, it needs to restart to complete the update. Its Upgrade Status is Restarting.
# About App Connector Host OS Management
App Connectors are licensed so that Zscaler can periodically update their software. However, updates to the host OS are the organization's responsibility, not Zscaler's. The component software is designed to be compatible with updates to the host OS. Zscaler recommends updating the host OS whenever you determine it is necessary. To learn more, see Managing Deployed Software Components and Operating System Security.
