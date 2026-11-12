# Chrome posture profiles and the Chrome Enterprise Browser connector settings (zpa.posture-profiles.chrome)
Also called: Chrome posture profile; Chrome Enterprise browser posture; Chrome Enterprise Browser Connector; device trust connector; CHROME_POSTURE_PROFILE

A Chrome posture profile is a set of criteria evaluated on devices with the Chrome Enterprise browser, and Private Access policies can be configured based on the evaluation. The posture profile must be defined first to begin configuring access policies. [zpa.posture-profiles.chrome:what-it-is] Zscaler recommends reviewing Chrome posture profiles periodically to ensure security evaluation is required for devices using the Chrome Enterprise browser. [zpa.posture-profiles.chrome:periodic-review]

**When it is evaluated.** A posture evaluation occurs when a device experiences one of these network changes: it reboots, joins or changes a Wi-Fi network, comes out of hibernation, moves from non-domain joined to domain-joined, or moves from a Wi-Fi connection to an Ethernet connection. [zpa.posture-profiles.chrome:evaluation-triggers] Zscaler Client Connector evaluates Chrome posture profiles every 15 minutes. New connections are established based on updated security postures, and existing connections are not affected by updates to security postures. [zpa.posture-profiles.chrome:evaluation-cadence] The Client Connector posture schedule is in [When and how often posture is evaluated](kb:zpa.posture-profiles.evaluation); whether this one needs Client Connector and how the 30-minute browser refresh relates to the 15-minute evaluation are open [gap:zpa.posture-profiles.chrome:chrome-evaluation].

**What it can evaluate.** A Chrome posture profile can evaluate the Browser Version, the Operating System (Unspecified Operating System, ChromeOS, ChromiumOS, Windows, macOS or Linux), the CrowdStrike Agent (enabled or disabled) and the Disk Encryption type (Unspecified, Unknown, Disabled or Encrypted Disk Encryption). [zpa.posture-profiles.chrome:posture-types-a] As configured, a Chrome posture profile can also evaluate OS Firewall and Screen Lock Secured, each offered as Unspecified, Unknown, Disabled and Encrypted values, the Safe Browsing Protection Level (Unspecified, Inactive, Standard or Enhanced) and the Key Trust Level (Unspecified Key Trust Level, ChromeOS Verified Mode, ChromeOS Developer Mode, Chrome Browser Hardware Key, Chrome Browser OS Key or Chrome Browser No Key). [zpa.posture-profiles.chrome:posture-types-b] The pages give different Secure Boot Mode values [divergence:zpa.posture-profiles.chrome:secure-boot-mode-values] and different Screen Lock Secured values [divergence:zpa.posture-profiles.chrome:screen-lock-secured-values]. The same names appear as fields of the Chrome Enterprise diagnostics log, described in [ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export](kb:zpa.troubleshooting.diagnostics). The expanded details of a Chrome posture profile on the Chrome Posture Profile page list a Browser Type, the type of browser. [zpa.posture-profiles.chrome:browser-type-in-details] Whether the configuration steps offer it is open [gap:zpa.posture-profiles.chrome:chrome-evaluation].

**Connector settings.** The Chrome Enterprise Browser Connector settings let Private Access create access policies that verify whether a user accesses private applications through the Chrome Enterprise browser. The URL Patterns to Allow and the Service Accounts values from the Admin Console are copied to set up the Chrome Enterprise device trust connector for Zscaler in the Google Admin Console. Google Workspace domains are entered under Organization Information, with a comma between them, and after saving an access policy is configured with Chrome Enterprise Browser as a criteria. [zpa.posture-profiles.chrome:connector-settings] For a cross-origin or same-origin AJAX request from the Chrome Enterprise browser, the JavaScript code should include withCredentials = true. Zscaler recommends refreshing the browser every 30 minutes to refresh the posture, and the page says to contact Zscaler Support to enable the CORS feature. [zpa.posture-profiles.chrome:ajax-and-refresh]

The profile hub is [ZPA posture profiles](kb:zpa.posture-profiles); the policy criterion is in [Criteria available on ZPA access policy rules](kb:zpa.policy.criteria).

What to check:
1. Whether a policy that rests on a Chrome posture profile defines the profile first, since the profile must exist before policies are configured on it.
2. Whether a posture change happened within the 15-minute evaluation or after a listed network change, since existing connections are not affected by updates to security postures.
3. Which Secure Boot Mode values a rule or filter relies on, since the pages differ.
4. Whether the URL pattern and service account from the Admin Console were entered in the device trust connector in the Google Admin Console.

Sources disagree (name both sides):
- The Secure Boot Mode values: Disabled and Encrypted in the posture profile configuration, Enable and Disable in the diagnostics filter [divergence:zpa.posture-profiles.chrome:secure-boot-mode-values]
  - zscaler-help: The profile configuration offers Unspecified, Unknown, Disabled and Encrypted Secure Boot Mode.
  - zscaler-help: The Chrome Enterprise diagnostics query builder lists Unspecified, Unknown, Enable and Disable Secure Boot Mode.
  Impact: The pages share Unspecified and Unknown but name the other two values differently. Which values a rule or a diagnostics filter must use for Secure Boot Mode is not settled by either page, and neither says that one list describes the other.
- The Screen Lock Secured values: Disabled and Encrypted in the posture profile configuration, Enabled and Disabled in the diagnostics filter [divergence:zpa.posture-profiles.chrome:screen-lock-secured-values]
  - zscaler-help: The profile configuration offers Unspecified, Unknown, Disabled and Encrypted Screen Lock Secured.
  - zscaler-help: The Chrome Enterprise diagnostics query builder lists Unspecified Secured Screen Lock, Unknown Secured Screen Lock, Enabled Screen Lock and Disabled Screen Lock.
  Impact: The pages name the Screen Lock Secured values differently, and the diagnostics list also words the Unspecified and Unknown entries differently. Which values a rule or a diagnostics filter must use is not settled by either page, and neither says that one list describes the other.

Not known (open gaps):
- How Chrome posture is evaluated: the evaluator, the refresh and the Browser Type field [gap:zpa.posture-profiles.chrome:chrome-evaluation]: settled by source-read or lab-test

Area: zpa.posture-profiles, its subjects in references/_meta/spine/zpa/zpa.posture-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles), from zpa.posture-profiles: Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels. [zpa.posture-profiles.object-model:zcc-defined]
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
- links-to references/_meta/text/zpa/zpa.posture-profiles.md (ZPA posture profiles)
- links-to references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated)
- links-to references/_meta/text/zpa/zpa.troubleshooting.diagnostics.md (ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export)
