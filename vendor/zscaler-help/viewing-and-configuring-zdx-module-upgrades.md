# Viewing and Configuring ZDX Module Upgrades

**Source:** https://help.zscaler.com/zscaler-client-connector/viewing-and-configuring-zdx-module-upgrades
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1529195, revision 3243133

---

If you use Digital Experience (ZDX), Zscaler regularly releases new versions of the base ZDX Module that are compatible with Zscaler Client Connector for Windows and Zscaler Client Connector for macOS. Zscaler Client Connector automatically rolls out the latest version. You can configure a delayed rollout to apply a version to selected user groups for testing purposes for up to 180 days.
Contact Zscaler Support to enable this feature.
You can download an upgrade package and manually deploy with the Mobile Device Management (MDM) used by your organization or with the CLI. This feature is available only with Zscaler Client Connector version 4.7 and later for Windows.
The following options are available:
- View Auto Rollout Information
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Select the platform (Windows or macOS) and view the fields:
    - ZDX Module Version: The ZDX Module version that has been rolled out.
    - Zscaler Client Connector Min-Max Version: The earliest and latest versions of Zscaler Client Connector that the ZDX Module version is compatible with.
    - Devices: The number of devices using the ZDX Module version. Click the Information icon to display the number.
- Configure a Delayed Rollout
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Select Delay Rollout and click Save.
  - See image.
  - Select the platform (Windows or macOS) and disable the Rollout option for the ZDX Module version you want to delay the rollout for.
  - Click Submit to confirm you want to delay the rollout.
  - The Edit icon displays in the Action column.
  - Click Edit to display the Rollout Version window.
  - See image.
  - In the Rollout Version window, select the User Groups that will receive the rollout, and enter the date and time to apply the rollout, then click Rollout.
  - If you want to delay the rollout for all users, you can select all user groups and enter a date up to 180 days from the day the ZDX Module version was released. Zscaler Client Connector automatically rolls out the ZDX Module version to all users when the 180-day maximum is reached unless you freeze the rollout.
  - The ZDX Module version Status is changed to Pending and the Auto Rollout In value is changed to the number of days before Zscaler Client Connector automatically rolls out the version.
  - See image.
- Freeze a Delayed Rollout
- If you want to delay a rollout beyond the 180-day maximum (e.g., you encountered issues in testing and need additional time to address them), you can freeze a delayed rollout:
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Click the Lock icon beside the ZDX Module version.
  - The Request to Freeze Rollout window appears.
  - See image.
  - Enter the case number (e.g., the Salesforce case number) if you know it and the reason you are freezing the rollout.
  - Click Submit.
  - The Status changes to Frozen and the Auto Rollout In field is cleared.
- Unfreeze a Frozen Rollout
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Click the Lock icon beside the frozen ZDX Module version, and click Unfreeze in the confirmation window.
  - The rollout returns to a Status of Pending (if you unfreeze it fewer than 180 days after it was released) or is immediately rolled out (if you unfreeze it 180 or more days after it was released).
- Download an Upgrade Package
  - From the navigation menu, go to Infrastructure > Client Connector > App Store.
  - Select Windows and select the ZIP URL (32 bit) or ZIP URL (64 bit) download link for the ZDX Module Version package.
  - You can use the downloaded package with your MDM or Group Policy Object (GPO) to upgrade the ZDX Module based on your organization’s procedures. You can also upgrade from the CLI.
