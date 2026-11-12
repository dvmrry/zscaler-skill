# Enrolled device states and what moves a device between them (zcc.devices.lifecycle)
Also called: zcc device state; removal pending; device removal pending stuck; soft remove vs force remove; quarantine device zcc; device re-registers after removal; zcc device limit 16; udid changes; zcc keepalive

An enrolled device record in the Client Connector portal moves through a small set of states. Most removal questions come down to which state the device is in and whether it has sent a keepalive since.

**The states.** A Registered device has Client Connector enrolled and logged in with a user. An Unregistered device is one whose user manually logged out of the app. [zcc.devices.lifecycle:registered-unregistered] Removal Pending means an administrator soft removed the device and Client Connector has not yet sent a keepalive. A device also enters it when the user is removed from User Management in Internet & SaaS. [zcc.devices.lifecycle:removal-pending] A device becomes Removed when a soft-removed device sends its next keepalive or has its policy updated manually, when its user exceeds the configured device threshold, when it has been inactive for the configured automatic-removal period, or when an administrator force removes it. [zcc.devices.lifecycle:removed-conditions] An administrator quarantines a device (Device Management page: its User ID, then Quarantine in the Actions drop-down menu) to limit or block its access to Zscaler applications; a quarantined device cannot be used to log in, cannot be soft removed, is eligible for hard deletion, and does not count against the device limit. [zcc.devices.lifecycle:quarantined]

**The device limit.** A username can enroll at most 16 devices. Registered and Removal Pending devices count against the limit; Unregistered, Removed and Quarantined devices do not. [zcc.devices.lifecycle:device-limit] A removed device can be enrolled again while the user has fewer than 16 enrolled devices. [zcc.devices.lifecycle:re-enroll-removed]

**Soft removal.** A soft remove sets the device to Removal Pending and takes effect at the device's next keepalive, typically within an hour, when it becomes Removed; Client Connector then logs the user out without uninstalling, and the user sees no service interruption or authentication errors. [zcc.devices.lifecycle:soft-remove] After soft removal, the vendor names cases that may need a force remove: the device stays in Removal Pending for more than a day, which means the user is inactive, or Client Connector fails to send the keepalive or is uninstalled before the keepalive is sent. [zcc.devices.lifecycle:pending-over-a-day] In the Classic UI, after an admin soft removes a device from the Admin Console, it can take an hour for the device to be completely removed, but an end user can immediately remove the device from Client Connector by clicking Update Policy, which logs the user out without uninstalling the app from the device. [zcc.devices.lifecycle:user-deprovision]

**Force removal.** A force remove in the console works on one device at a time and sets it to Removed immediately; Client Connector on the device is logged out at its next automatic policy update or when the user clicks Update Policy, and the user may see service interruption or authentication errors. [zcc.devices.lifecycle:force-remove] Which states the console accepts for a force remove is stated two ways [divergence:zcc.devices.lifecycle:force-remove-states]. The API call is in [Removing devices and machine tunnels through the API and SDKs](kb:zcc.devices.removal-api).

**Removal does not uninstall.** Removing a device's registration from the admin console does not remove Client Connector from the device. [zcc.devices.lifecycle:removal-not-uninstall] A quarantined device cannot be re-enrolled, matched by its device fingerprint, until an administrator unquarantines it, which moves it to Removed and lets it log in again. [zcc.devices.lifecycle:quarantine-blocks-reenrollment] Whether a device that re-enrolls after removal gets a new record is open [gap:zcc.devices.lifecycle:re-enrollment-record].

**Identifiers.** Client Connector generates a UDID for every new installation; the same UDID continues through uninstall, reinstall and reboot, is unique to each user and device, and differs from user to user on the same device. [zcc.devices.lifecycle:udid] The Device ID is the device's unique ID in the admin console database, generated for each new enrollment and continued for subsequent enrollments. [zcc.devices.lifecycle:device-id] The hardware fingerprint is an ID created from the device's hardware, such as its serial number, BIOS ID and battery ID. [zcc.devices.lifecycle:hardware-fingerprint] Whether a UDID is scoped to one tenant is open [gap:zcc.devices.lifecycle:udid-tenant-scope], and so is what a shared hardware fingerprint does [gap:zcc.devices.lifecycle:hardware-fingerprint-cloning].

**Keepalive.** Soft removal and log fetch wait for the device's keepalive, and its interval is stated two ways [divergence:zcc.devices.lifecycle:keepalive-interval]. Clicking Update Policy in Client Connector sends a keepalive immediately instead of waiting for the next one. [zcc.devices.lifecycle:update-policy-sends-keepalive]

Automatic removal and permanent deletion are in [Automated device cleanup: device threshold, inactive removal, permanent deletion](kb:zcc.devices.cleanup).

What to check:
1. Which state the device is in now, since Unregistered (user logged out) and Removed (admin or cleanup) look alike in a list but have different causes.
2. Whether a device stuck in Removal Pending has sent a keepalive since the soft remove; more than a day in Removal Pending means the user is inactive, one of the cases the vendor says may need a force remove.
3. Whether the goal is to stop the device enrolling again, which removal does not do and quarantine does.
4. Whether a user who cannot enroll has 16 devices in Registered or Removal Pending, which count against the limit.

Sources disagree (name both sides):
- Which device states the console's Force Remove accepts. [divergence:zcc.devices.lifecycle:force-remove-states]
  - zscaler-help: Registered and Removal Pending devices can be force removed.
  - zscaler-help: Only Removal Pending devices can be force removed from the device details page.
  Impact: An admin reading the device-details page would soft remove a Registered device first and wait for a keepalive that may never come, when the force-remove article allows removing it directly; the API's force-remove call also accepts Registered devices (zcc.api.devices-wire:force-remove).
- How often Client Connector sends its keepalive. [divergence:zcc.devices.lifecycle:keepalive-interval]
  - zscaler-help: Every 80 minutes.
  - zscaler-help: Usually once every hour while the device is active.
  Impact: Anything that waits on the keepalive (a soft remove, a log fetch) can take up to 80 minutes rather than an hour, so a device still pending at 60 minutes is not yet evidence of a stuck client.

Not known (open gaps):
- Whether a device that enrolls again after removal gets a new record and UDID [gap:zcc.devices.lifecycle:re-enrollment-record]: settled by lab-test or tenant-data. Blocks: answers about whether device history survives a removal and re-enrollment
- Whether a UDID is scoped to one tenant [gap:zcc.devices.lifecycle:udid-tenant-scope]: settled by support-ticket or lab-test. Blocks: cross-tenant device correlation after a migration or merger
- What happens when two devices report the same hardware fingerprint [gap:zcc.devices.lifecycle:hardware-fingerprint-cloning]: settled by lab-test or support-ticket. Blocks: diagnosing VDI or cloned-image devices that flap between users or policies

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zcc/zcc.devices.cleanup.md (Automated device cleanup: device threshold, inactive removal, permanent deletion): Automatically Force Remove Inactive Devices After removes a device that has not connected to Internet & SaaS within the chosen period: 30, 60, 90, 120, 150 or 180 days, or Never, which is the default. [zcc.devices.cleanup:inactive-removal]
- links-to references/_meta/text/zcc/zcc.devices.removal-api.md (Removing devices and machine tunnels through the API and SDKs)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zcc/devices.md (config type)
- see-also references/_meta/text/zcc/zcc.devices.md (ZCC enrolled devices)
