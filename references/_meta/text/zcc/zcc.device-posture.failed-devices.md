# Which devices are failing posture: the Failed Posture Devices page and the dashboard's Device Posture page (zcc.device-posture.failed-devices)
Also called: Failed Posture Devices; failed device posture; Top 10 Failed Device Posture Trend; Compliant vs Non-Compliant; which devices failed posture checks

The Failed Posture Devices page and the dashboard's Device Posture page are available only if Digital Experience (ZDX) or Client Connector Telemetry is enabled. [zcc.device-posture.failed-devices:availability] Telemetry is in [ZCC end-user support options (App Supportability)](kb:zcc.support-options); why a check fails is in [Why a device fails posture, and what the user sees](kb:zcc.device-posture.failure-modes).

**Failed Posture Devices page.** The Failed Posture Devices page (Infrastructure > Client Connector > Failed Posture Devices) lists devices that failed posture checks, filtered by Time (three-hour intervals up to 24 hours), Failed Device Posture (one posture profile) and OS (Windows, macOS or both; both shown by default). [zcc.device-posture.failed-devices:page-filters] For each device the list shows User ID, OS Type, Device Model, First Failure Time, Last Failure Time and Count (the number of times the device posture failed for the device), and each page shows up to 50 devices by default. [zcc.device-posture.failed-devices:columns] The list exports as a CSV file: Export All exports all devices for a chosen time interval of up to 24 hours within the past 14 days, and Export View exports the information currently visible on the page. [zcc.device-posture.failed-devices:export]

**Dashboard Device Posture page.** The dashboard's Device Posture page filters by Time (failed-posture times in three-hour intervals up to 24 hours, with data shown up to the past 7 days) and OS (Windows, macOS or both; both shown by default). [zcc.device-posture.failed-devices:dashboard-filters] The Device Posture page's widgets are Top 10 Failed Device Posture Trend, Top 50 Failed Posture Profiles, Top 10 Non-Compliant Devices and Compliant vs Non-Compliant. The widget descriptions cover the trendline of the top 10 posture profiles with the most failing devices (or of up to 10 profiles chosen in the Top 50 Failed Posture Profiles widget), the top 50 profiles by failing devices (a click opens the failed devices on the Failed Devices page), the number of non-compliant devices for the top 10 failures by profile, and compliant against non-compliant devices for the top 10 failed profiles with each profile's failure total and trend. [zcc.device-posture.failed-devices:dashboard-widgets] The other dashboard pages are in [The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs](kb:zcc.devices.dashboard).

**Open questions.** The 7-day and 14-day reach, platforms beyond Windows and macOS, and how Count relates to evaluation are open [gap:zcc.device-posture.failed-devices:coverage-details].

What to check:
1. For a page that lists no failed devices, whether Digital Experience (ZDX) or Client Connector Telemetry is enabled.

Not known (open gaps):
- Reach, platforms and Count on the failed-posture pages [gap:zcc.device-posture.failed-devices:coverage-details]: settled by source-read or lab-test

Area: zcc.device-posture, its subjects in references/_meta/spine/zcc/zcc.device-posture.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/shared/shared.device-posture.trust-levels.md (Internet & SaaS device trust levels: how posture becomes a policy criterion), from zcc.device-posture: An Internet & SaaS posture profile holds an expression for each of High Trust, Medium Trust and Low Trust; Client Connector evaluates the checks of all levels on the device and the highest matching level is used. [shared.device-posture.trust-levels:level-expressions]
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.device-posture: An app profile, on each platform's policy page (Windows, macOS, Linux, iOS and Android), can apply an Internet & SaaS (ZIA) posture profile. [zcc.device-posture:zia-posture-profile]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated), from zcc.device-posture: Zscaler Client Connector evaluates device posture profiles every 15 minutes, new connections are established on the updated posture, and existing connections are not affected by updates to security postures. [zpa.posture-profiles.evaluation:cadence]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.policy-operand.md (The POSTURE operand in ZPA policy rules), from zcc.device-posture: In the console each posture profile in a condition set is set to VERIFIED, meaning Zscaler Client Connector verified the device against the profile's criteria, or VERIFICATION FAILED, meaning it was unable to verify the device against them. [zpa.posture-profiles.policy-operand:console-states]
- links-to references/_meta/text/zcc/zcc.device-posture.failure-modes.md (Why a device fails posture, and what the user sees)
- links-to references/_meta/text/zcc/zcc.devices.dashboard.md (The Client Connector dashboard: Platform Details and Device Events widgets, license usage and what each needs)
- links-to references/_meta/text/zcc/zcc.support-options.md (ZCC end-user support options (App Supportability))

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles)
