# The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs (zcc.devices.dashboard)
Also called: Client Connector dashboard; Platform Details; Device Events page; Version Distribution; License Usage widget; Password Usage widget

The Client Connector Dashboard (Analytics > Infrastructure > Platform Details) provides information about the organization's enrolled devices, including service status, on three pages: Platform Details (OS platform details such as device model and device state), Device Posture (devices that fail their device posture checks) and Device Events (Internet & SaaS and Private Access service status, and users turning off the services via passwords). [zcc.devices.dashboard:what-it-is] The Device Posture page is in [Which devices are failing posture: the Failed Posture Devices page and the dashboard's Device Posture page](kb:zcc.device-posture.failed-devices).

**Platform Details.** Platform Details filters by device state (all states, or a specific state such as Registered, Unregistered, Removal Pending, Removed or Quarantined) and by operating system (all or a specific one). [zcc.devices.dashboard:platform-filters] The Version Distribution widget counts devices on supported and unsupported Client Connector versions: supported versions are enabled on the App Store's New Releases tab and listed on its Update Settings tab; unsupported versions are enabled on New Releases but earlier than the supported versions on Update Settings. Clicking the graph lists the devices, by User ID, in Enrolled Devices. [zcc.devices.dashboard:version-distribution] The tabs it reads are in [Rolling out Client Connector: App Store downloads, deployment phases, pilot tests and update test groups](kb:zcc.install.rollout). The Device Model and Device OS widgets show the top 5 models and OSs and group the rest as Others; Device State shows the enrolled devices' states and the app profiles applied to them; Enrolled Devices by Platform shows their platforms. Clicking a model, OS, state or platform in its chart lists the matching devices in Enrolled Devices. [zcc.devices.dashboard:model-os-state-platform]

**License usage.** The License Usage widget shows the organization's subscription and license information, Subscribed (the number of user subscriptions for Client Connector) against Used (the number of users enrolled); it applies only to Internet & SaaS and is not shown with Private Access only. Licenses are calculated on the unique username, so a user with Client Connector on three devices still has one license. [zcc.devices.dashboard:license-usage]

**Device Events.** The Device Events page is available for Windows users only and needs Digital Experience (ZDX) or Client Connector Telemetry enabled; a Time Range filter selects the time range of its data. [zcc.devices.dashboard:device-events-availability] Telemetry is in [ZCC end-user support options (App Supportability)](kb:zcc.support-options). The ZIA and ZPA device service status widget counts enrolled devices with the ZDX service enabled and without it (Non-ZDX), with Internet & SaaS and with Private Access enabled, and devices that have had Internet & SaaS (Off ZIA) or Private Access (Off ZPA) turned off. [zcc.devices.dashboard:service-status-widget] The service turn-off widgets count the unique users who turned the service off and the total number of times it was turned off, both even if it was turned back on; another widget shows how many times Internet & SaaS and Private Access were turned off over the past 24 hours. [zcc.devices.dashboard:turn-off-widgets] The Password Usage widgets count users who turned services off, users who used the Disable ZIA OTP or Disable ZPA OTP password from the enrolled device's Device Details (OTP) and users who used the app profile's Disable Password ZIA or ZPA password (Master), and the number of times ZIA and ZPA were turned off with each OTP and each master password. [zcc.devices.dashboard:password-usage] The passwords behind these counts are in [One-time passwords for an enrolled device](kb:zcc.passwords-and-otp.otp) and [App profile passwords: logout, disable, exit and uninstall, per platform](kb:zcc.passwords-and-otp.app-profile-passwords).

**Open questions.** How long the data is kept, what Time Range options exist, and how some counts are taken are open [gap:zcc.devices.dashboard:counting-details].

What to check:
1. For a Device Events page that shows no data, whether the user is on Windows and whether Digital Experience (ZDX) or Client Connector Telemetry is enabled.
2. For a license count that looks low against devices, that licenses count unique usernames rather than devices.

Not known (open gaps):
- Dashboard data retention, Time Range options and how some counts are taken [gap:zcc.devices.dashboard:counting-details]: settled by source-read or lab-test

Area: zcc.devices, its subjects in references/_meta/spine/zcc/zcc.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.device-posture.failed-devices.md (Which devices are failing posture: the Failed Posture Devices page and the dashboard's Device Posture page)
- links-to references/_meta/text/zcc/zcc.install.rollout.md (Rolling out Client Connector: App Store downloads, deployment phases, pilot tests and update test groups)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.app-profile-passwords.md (App profile passwords: logout, disable, exit and uninstall, per platform)
- links-to references/_meta/text/zcc/zcc.passwords-and-otp.otp.md (One-time passwords for an enrolled device)
- links-to references/_meta/text/zcc/zcc.support-options.md (ZCC end-user support options (App Supportability))

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.devices.md (ZCC enrolled devices)
- see-also references/_meta/text/zcc/zcc.passwords-and-otp.md (ZCC uninstall, disable and logout passwords and one-time passwords)
