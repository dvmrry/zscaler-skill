# When and how often posture is evaluated (zpa.posture-profiles.evaluation)
Also called: posture evaluation frequency; posture 15 minutes; existing connections posture; posture re-evaluation; posture trigger events; immediate posture evaluation

Posture results reach ZPA from Client Connector's evaluation schedule.

**Schedule.** Zscaler Client Connector evaluates device posture profiles every 15 minutes, new connections are established on the updated posture, and existing connections are not affected by updates to security postures. [zpa.posture-profiles.evaluation:cadence] From Zscaler Client Connector 4.4 on Windows and 4.5 on macOS, the evaluation frequency can be set per posture type in one-minute steps, with a maximum default of 15 minutes and a minimum of 2 minutes. [zpa.posture-profiles.evaluation:frequency-setting]

**Immediate and triggered evaluation.** Process Check, Detect Carbon Black, Detect CrowdStrike, Detect SentinelOne and Detect Microsoft Defender are evaluated immediately when the posture changes on the device, regardless of the frequency setting, and the client also keeps evaluating them on the configured frequency; the feature is on by default and Zscaler Support can disable it. [zpa.posture-profiles.evaluation:immediate-checks] Network and device changes that trigger a posture evaluation are: the Zscaler service restarting, and a device rebooting, joining a network, coming out of hibernation, moving from non-domain joined to domain-joined, moving from Wi-Fi to Ethernet, or changing Wi-Fi networks. [zpa.posture-profiles.evaluation:triggers]

**Open questions.** Whether a timeout rule bounds staleness is open [gap:zpa.posture-profiles.evaluation:reauth-bounds-staleness]. Why some types are absent from the machine tunnel is open [gap:zpa.posture-profiles.evaluation:user-context-types]. How the result reaches ZPA is open [gap:zpa.posture-profiles.evaluation:result-reporting].

The pre-login type lists are in [Device posture on the ZPA machine tunnel](kb:zpa.machine-tunnels.posture), and the criteria that consume results are in [The POSTURE operand in ZPA policy rules](kb:zpa.posture-profiles.policy-operand).

What to check:
1. When the device was last evaluated: the default is every 15 minutes, or the per-type frequency where it is configurable.
2. Whether the posture type re-evaluates immediately on change or waits for the timer.
3. Whether the connection in question is new or already established, since existing connections keep their posture.
4. Whether a network or device event just occurred that triggers evaluation.
5. Whether staleness is being assumed to be bounded by a timeout rule.

Not known (open gaps):
- Whether a ZPA reauthentication timeout bounds how stale a posture result can be [gap:zpa.posture-profiles.evaluation:reauth-bounds-staleness]: settled by lab-test. Blocks: advising a timeout rule as a posture enforcement bound
- How a posture result gets from Client Connector to ZPA [gap:zpa.posture-profiles.evaluation:result-reporting]: settled by support-ticket. Blocks: explaining why a result is stale or missing in ZPA
- Why some posture types cannot run on the pre-login machine tunnel [gap:zpa.posture-profiles.evaluation:user-context-types]: settled by support-ticket. Blocks: designing a machine tunnel profile around the excluded types

Area: zpa.posture-profiles, its subjects in references/_meta/spine/zpa/zpa.posture-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles): A device posture profile is a set of criteria evaluated on the device, and policies in both Internet & SaaS and Private Access can act on the outcome. [zcc.device-posture:evaluated-on-device]
- links-to references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel)
- links-to references/_meta/text/zpa/zpa.posture-profiles.policy-operand.md (The POSTURE operand in ZPA policy rules)
