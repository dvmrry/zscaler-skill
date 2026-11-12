# Automated device cleanup: device threshold, inactive removal, permanent deletion (zcc.devices.cleanup)
Also called: device cleanup; autoRemovalDays; autoPurgeDays; deviceExceedLimit; force remove oldest device; inactive devices removed automatically; permanently delete removed devices; zcc_device_cleanup; getDeviceCleanupInfo; setDeviceCleanupInfo

Three tenant-wide settings remove and delete device records without an admin acting on each one. They change records in the portal only.

**Device threshold.** Force Remove Oldest Device After User Enrolls sets a threshold number of devices; when a user enrolls a device past it, Client Connector force removes the user's oldest device. The default, Restrict, removes nothing, and an error is shown when a user tries to enroll more than 16 devices. [zcc.devices.cleanup:threshold] Lowering the minimum threshold to one device requires contacting the vendor. [zcc.devices.cleanup:threshold-minimum]

**Inactive removal.** Automatically Force Remove Inactive Devices After removes a device that has not connected to Internet & SaaS within the chosen period: 30, 60, 90, 120, 150 or 180 days, or Never, which is the default. [zcc.devices.cleanup:inactive-removal] Which timestamp marks a device inactive is stated two ways [divergence:zcc.devices.cleanup:inactivity-timestamp].

**Permanent deletion.** Permanently Delete Removed Devices After deletes a device from the admin console after it has been Removed or Unregistered for 60, 90, 120, 150 or 180 days, measured from the device's Last Deregistration Timestamp. [zcc.devices.cleanup:permanent-delete] The device-states table applies the same permanent deletion to devices in the Unregistered state and in the Removed state. [zcc.devices.cleanup:delete-from-unregistered-and-removed] The Terraform provider accepts deletion periods the console does not offer [divergence:zcc.devices.cleanup:purge-period-values].

**Timing.** After cleanup settings change, Enrolled Devices can take up to a week to reflect it. [zcc.devices.cleanup:week-lag] Cleanup removes records, not the app: [Removing a device's registration from the admin console does not remove Client Connector from the device.](kb:zcc.devices.lifecycle:removal-not-uninstall).

**API.** The API contract for reading and writing cleanup (`getDeviceCleanupInfo`, `setDeviceCleanupInfo`) types every field as a string, including `active`, `autoRemovalDays`, `autoPurgeDays`, `deviceExceedLimit` and `forceRemoveType`. [zcc.devices.cleanup:api-fields-untyped] The Terraform provider labels some values, but which API field holds which console setting, and what most force-remove type codes mean, is only partly known [gap:zcc.devices.cleanup:field-to-setting-mapping].

What to check:
1. Whether a device the user did not remove was taken by the threshold (the user enrolled a newer device past it) or by inactivity, from its state history and the cleanup settings.
2. Whether a cleanup setting was changed within the last week, since the Enrolled Devices view can lag that long.
3. Before reading or writing cleanup through the API, which field carries which setting, since the contract does not say.

Sources disagree (name both sides):
- Which timestamp decides that a device is inactive for automatic removal. [divergence:zcc.devices.cleanup:inactivity-timestamp]
  - zscaler-help: The device's most recent KeepAlive Timestamp.
  - zscaler-help: The device's Last Seen Connected to ZIA timestamp.
  Impact: A device that keeps sending keepalives but never connects to Internet & SaaS (for example a ZPA-only user) is kept by one reading and removed by the other, so predicting which devices cleanup will take needs the right timestamp.
- Which permanent-deletion periods can be set. [divergence:zcc.devices.cleanup:purge-period-values]
  - zscaler-help: The console offers 60, 90, 120, 150 or 180 days, with no 0, 30 or Never.
  - tf-zcc: The ZCC Terraform provider's `auto_purge_days` also accepts 0 and 30.
  - sdk-python: A recorded cleanup read from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) carries `autoPurgeDays` "0", a value the console does not list.
  Impact: A Terraform plan with `auto_purge_days` of 30 passes the provider's validation for a period the console does not offer, so the API may reject it or store a value the console cannot show; and a tenant reading 0 cannot tell from the console what deletion period, if any, is in force.

Not known (open gaps):
- Which cleanup API field holds which console setting, and their value encodings [gap:zcc.devices.cleanup:field-to-setting-mapping]: settled by tenant-data or support-ticket. Blocks: reading or writing cleanup settings through the API or Terraform with confidence about what a value means

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.devices.lifecycle.md (Enrolled device states and what moves a device between them): Permanently Delete Removed Devices After deletes a device from the admin console after it has been Removed or Unregistered for 60, 90, 120, 150 or 180 days, measured from the device's Last Deregistration Timestamp. [zcc.devices.cleanup:permanent-delete]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.devices.md (ZCC enrolled devices)
