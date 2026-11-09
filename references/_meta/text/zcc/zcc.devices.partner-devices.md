# Partner devices: the Partner Devices list, its filters, search, exports, the 24-hour removal of unregistered devices and the device details (zcc.devices.partner-devices)
Also called: Partner Devices page; partner device fingerprint; Registered Partner Device Details; partner devices with access to my tenant

In the Admin Console the Partner Devices page (Infrastructure > Client Connector > Partner Devices) lists the partner devices with access to the organization's tenant, which partner organizations get once access is enabled. [zcc.devices.partner-devices:what-it-is] Partner logins themselves are in [Private Access partner logins: who may log in to whose tenant, and what the user does and sees](kb:zcc.partner-tenants); the organization's own devices are in [ZCC enrolled devices](kb:zcc.devices).

**The list.** The list filters by Active From (7, 30, 60, 90, 120, 150 or 180 days, or older than 180 days), Users (all users or a specific user), States (Registered, Unregistered, Removal Pending, Removed or Quarantined) and OS (all operating systems or a specific one, all shown by default). [zcc.devices.partner-devices:filters] The States filter's default is given two ways [divergence:zcc.devices.partner-devices:default-states]. For each partner device the list shows User ID, OS Type, Device Model, Client Connector Version and Device State, and each page shows up to 100 devices by default. [zcc.devices.partner-devices:list-columns] Partner devices can be found by exact match on Device ID, UDID, Machine Hostname (which the end user or the operating system can customize), Hardware Fingerprint, Client Connector Version or App Profile Name. [zcc.devices.partner-devices:exact-match-search]

**Actions and exports.** From the page, selected devices can be soft removed from the Admin Console (Delete in the Actions drop-down menu or the Delete icon), and the device fingerprint and the one-time password of each partner device can be viewed. [zcc.devices.partner-devices:actions] Soft removal itself is in [Enrolled device states and what moves a device between them](kb:zcc.devices.lifecycle). The device fingerprint of all partner devices exports as a CSV file with Device Details (All Fields, such as manufacturer, model, username, machine hostname and UDID, or Custom Fields such as User, OS Type, Device Model, OS Version and VPN State), Disable Reasons, and Service Status (Internet & SaaS, Private Access and Digital Experience as On, Off or Error, for services the organization has enabled). [zcc.devices.partner-devices:exports]

**Removal of unregistered devices.** Unregistered partner devices are removed if they were inactive in the previous 24 hours, which allows the same user or a new user to log in. [zcc.devices.partner-devices:inactive-removal] Whether this interacts with automated device cleanup is open [gap:zcc.devices.partner-devices:cleanup-interaction].

**Device details.** The Registered Partner Device Details window gives, as registration details, the User ID (the Client Connector username), Device ID (an internal Zscaler identifier), Last Registration Time (the last login on the device), Last Deregistration Time (the last logout), Client Connector Version, Tunnel Version (the last Z-Tunnel version the device connected with) and Device State (the registration status). [zcc.devices.partner-devices:details-registration] The window also gives Owner (the locally logged-in user on Windows and macOS, the Client Connector username on Android and iOS, shown if Collect Device Owner Information is enabled), Machine Hostname (shown if Collect Machine Hostname Information is enabled), Unique-ID, OS, Model, Manufacturer, MAC Address, Device Locale and Hardware Fingerprint. [zcc.devices.partner-devices:details-device] The window also gives ZPA Enabled, ZPA Health (active or inactive) and Last Seen Connected to ZPA, and Device State (the device's policy status), Last Seen with Client Connector Active, Last Configuration Download Time and Configuration Download Count (the number of times the app profile was updated since enrollment); the device can also be force removed from the Admin Console from this view. [zcc.devices.partner-devices:details-status] Which one-time passwords a partner device shows is open [gap:zcc.devices.partner-devices:partner-otp-and-services].

What to check:
1. Before saying which partner devices the list shows by default, the divergence over the States filter, and the filters actually set.
2. For a partner device that cannot log in after being unregistered, whether it was removed after 24 hours of inactivity.

Sources disagree (name both sides):
- The Partner Devices page gives two defaults for the list: the States filter says all states except Removed are shown, and a later sentence says the list is filtered to all users, all states and all operating systems. [divergence:zcc.devices.partner-devices:default-states]
  - zscaler-help: States filter: by default all states except Removed are shown.
  - zscaler-help: Device list: by default the list shows all users, all states and all operating systems.
  Impact: Whether removed partner devices appear in the list before any filter is set is not settled by the page.

Not known (open gaps):
- Whether the 24-hour removal of unregistered partner devices interacts with automated cleanup [gap:zcc.devices.partner-devices:cleanup-interaction]: settled by source-read or lab-test
- Which one-time passwords and services a partner device shows [gap:zcc.devices.partner-devices:partner-otp-and-services]: settled by source-read or lab-test

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.devices.md (ZCC enrolled devices)
- links-to references/_meta/text/zcc/zcc.devices.lifecycle.md (Enrolled device states and what moves a device between them)
- links-to references/_meta/text/zcc/zcc.partner-tenants.md (Private Access partner logins: who may log in to whose tenant, and what the user does and sees)
