# Configuring an App Update in the Zscaler Client Connector App Store

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-app-update-zscaler-client-connector-app-store
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1285441, revision 3243861

---

Watch a video about Configuring an App Update in the Zscaler Client Connector App Store.
Zscaler regularly releases new versions of Zscaler Client Connector. As an admin, you can decide what app version is used by your organization by configuring a Zscaler Client Connector app update. You can configure an app update to control which version (if any) is available when the app is automatically updated or when end users manually update the app.
You can configure an app update only for Windows, macOS, and Linux. Updates for iOS and Android are controlled by the App Store and Google Play or your MDM solution.
After your users enroll with Zscaler Client Connector, the app automatically checks every two hours to see if an updated version is available and automatically updates the app if one is available. Alternatively, the user can click Update App in the More window to check for and install any available updates.
The app update retains any existing installation parameters set on the user devices (e.g., strictEnforcement or policyToken).
See image.
You can configure an app update for selected groups that's rolled out at the same time, or configure a phased rollout that gradually upgrades devices for selected groups.
With a phased rollout, admins can test a new build before deploying an update to all users. The admin can pause a phased rollout to address issues or modify the version or schedule. View the phased rollout progress on the Client Connector App Store page.
See image.
The following app update options are available:
- Configure an App Update
- Before you can configure an app update for a release, you must first enable a build.
  - To enable builds on the New Releases tab:
    - From the navigation menu, go to Infrastructure > Client Connector > App Store.
    - On the New Releases tab, select a platform.
    - Click Enable Build for the Zscaler Client Connector versions you want to configure for an app update.
    - Click Save.
  - See image.
  - Confirm the versions you enable on the Registered Devices tab, not the New Releases tab.
  - To configure an app update for a release, click Add App Store Group Policy on the Update Settings tab.
  - See image.
  - In the Add App Store Group Policy window, select from the following settings:
    - From the User Groups drop-down menu, select the groups to which you want to apply this configuration.
    - Groups are synced from Internet & SaaS, and are only available when Internet & SaaS is enabled and configured. If Internet & SaaS is not enabled, the groups might not appear.
    - If a group is already configured for an app update, that group cannot be added to subsequent app updates until the pending app update is complete.
    - In the Windows - Version to Install, macOS - Version to Install, and Linux - Version to Install drop-down menus, select the Zscaler Client Connector version you want automatically updated on your users' devices.
    - When multiple versions are configured for the same OS, and a user belongs to more than one group in those configurations, the latest version is updated for that user.
    - If any devices are already upgraded to a later version, you cannot roll out an update for an earlier version.
    - For Zscaler Client Connector version 3.7 and later for Windows, enable or disable Use 64-Bit Installer for Windows to install the 64-bit build on devices.
    - (Optional) Click in the Apply From Timestamp (in UTC) field and select a date and time from the calendar to define a time and date for your auto-update to start. If this field is left blank, the app automatically checks for a new update during the next cycle, which is every two hours, and updates automatically.
    - Roll Out Type: Select one of the following methods to deploy an app update:
      - Phased Rollout: Enable this option to deploy the selected Zscaler Client Connector versions to the selected groups in a gradual rollout.
| Day | Percentage of Devices Upgraded |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 3 | 5 |
| 4 | 10 |
| 5 | 20 |
| 6 | 50 |
| 7 | 100 |
      - The rollout process begins according to the scheduled date and is completed within 7 days.
      - Mass Rollout: Enable this option to deploy the selected Zscaler Client Connector versions to the selected groups at the same time.
    - To pause a phased rollout, click the Pause () icon. To resume the rollout, click the Play () icon. The phased rollout resumes from the point where you paused it.
    - Click Save.
    - See image.
    - In the Group Based Version Rollout - Confirmation window, click Proceed.
- Edit an App Update
- You can edit an app update, including a phased rollout that's in progress.
  - Edit a Zscaler Client Connector version update:
    - On the Update Settings tab, click the Edit icon () for the rollout you want to edit.
    - Make the desired changes in the Edit App Store Group Policy window.
    - Click Save.
  - Edit a phased rollout: You can pause a phased rollout to modify the configuration and then resume the phased rollout. The phased rollout resets to day one after you resume it.
    - On the Update Settings tab, click the Pause icon () for the phased rollout you want to modify.
    - In the Pause Rollout window, click OK.
    - Click the Edit icon ().
    - Make the desired changes in the Edit App Store Group Policy window.
    - Click Save.
    - Click Proceed in the Confirm window to restart the phased rollout.
    - Click Proceed in the Group Based Version Rollout - Confirmation window.
- When you disable a Zscaler Client Connector update, Zscaler Client Connector never automatically updates on your users' devices. Your organization takes full responsibility for updating the app using its own mechanism (for example, using a GPO policy to do a fresh install of a desired version).
- To disable the Zscaler Client Connector app update option:
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Select the Update Settings tab, and click Add App Store Group Policy.
  - See image.
  - Select from the following settings in the Add App Store Group Policy window:
    - From the User Groups drop-down menu, select the groups to which you want to apply this configuration.
      - Groups are synced from Internet & SaaS, and are only available when Internet & SaaS is enabled and configured. If Internet & SaaS is not enabled, the groups might not appear.
      - If a group is already configured for an app update, that group cannot be added to subsequent app updates until the pending app update is complete.
    - In the Windows - Version to Install, macOS - Version to Install, and Linux - Version to Install drop-down menus, select Disable.
  - Click Save.
  - See image.
  - In the Group Based Version Rollout - Confirmation window, click Proceed.
- You can edit the default app store group policy, which allows you to specify a Zscaler Client Connector app update option per OS. The default app store group policy applies to all groups that aren’t explicitly specified in your group policies.
- To edit the default app store group policy:
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Select the Update Settings tab, locate the group policy named ALL, and then click the Edit () icon.
  - See image.
  - In the Windows - Version to Install, macOS - Version to Install, and Linux - Version to Install drop-down menus, select one of the following options:
    - Latest: Zscaler Client Connector automatically updates to the latest version.
    - Disable: Zscaler Client Connector never updates on its own. Your organization is responsible for updating the app.
    - Version to Install: The version to which you want Zscaler Client Connector to automatically update.
  - For Zscaler Client Connector version 3.7 and later for Windows, enable Use 64-Bit Installer for Windows to install the 64-bit build on devices.
  - (Optional) Click in the Apply From Timestamp (in UTC) field and select a date and time from the calendar to define a time and date for your auto-update to start. If this field is left blank, the app automatically checks for a new update during the next cycle, which is every two hours, and updates automatically.
  - Click Save.
  - See image.
  - In the Group Based Version Rollout - Confirmation window, click Proceed.
- No App Update
- Edit the Default Policy
