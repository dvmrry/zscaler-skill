# Which device posture types each platform supports (zcc.device-posture.platform-support)
Also called: posture types on linux; posture types on ios; posture types on android; mobile posture support; posture platform matrix

The vendor states platform support per posture type; these claims collect it per platform. Version floors per type are in [Device posture check types: what each checks, where it applies, and how it passes](kb:zcc.device-posture.check-types).

**Windows.** Windows supports every posture type except Ownership Variable, Unauthorized Modification and Jamf Detection. [zcc.device-posture.platform-support:windows-types]

**macOS.** macOS supports Certificate Trust, Client Certificate, Server Validated Client Certificate (from 5.0), File Path, Firewall, Full Disk Encryption, Domain Joined, OS Version, Zscaler Client Connector Version, Process Check, the Carbon Black, CrowdStrike, SentinelOne and Microsoft Defender checks, the CrowdStrike ZTA scores, Detect Antivirus and Jamf Detection; it does not support Registry Key, AzureAD Domain Joined, Ownership Variable or Unauthorized Modification. [zcc.device-posture.platform-support:macos-types]

**Linux.** Linux supports Certificate Trust, Client Certificate, Full Disk Encryption (from 1.4), Process Check (from 1.3), Detect Microsoft Defender (from 1.4) and OS Version (from 1.4); File Path, Firewall, Domain Joined, Zscaler Client Connector Version and the other EDR and antivirus checks are not offered for Linux. [zcc.device-posture.platform-support:linux-types]

**Android.** Android supports Certificate Trust, Full Disk Encryption, OS Version (from 3.7), Ownership Variable and Unauthorized Modification; Client Certificate support for Android ends with Client Connector 5.0. [zcc.device-posture.platform-support:android-types]

**iOS.** iOS supports Certificate Trust, Ownership Variable and Unauthorized Modification; neither OS Version nor Zscaler Client Connector Version is offered for iOS. [zcc.device-posture.platform-support:ios-types]

What to check:
1. Whether a profile that targets mobile or Linux users relies on a type that platform does not offer, since such a type is simply unavailable for it.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.device-posture.platform-support:windows-types] Tier B: Collected from each type's stated platforms; a type whose statement does not name Windows is counted as unsupported there. The set of posture types is the twenty type claims in zcc.device-posture.check-types, all listed in derived_from.
- [zcc.device-posture.platform-support:macos-types] Tier B: Collected from each type's stated platforms; a type whose statement does not name macOS is counted as unsupported there. The set of posture types is the twenty type claims in zcc.device-posture.check-types, all listed in derived_from.
- [zcc.device-posture.platform-support:linux-types] Tier B: Collected from each type's stated platforms; a type whose statement does not name Linux is counted as unsupported there.
- [zcc.device-posture.platform-support:android-types] Tier B: Collected from each type's stated platforms; a type whose statement does not name Android is counted as unsupported there.
- [zcc.device-posture.platform-support:ios-types] Tier B: Collected from each type's stated platforms; a type whose statement does not name iOS is counted as unsupported there.

Area: zcc.device-posture, its subjects in references/_meta/spine/zcc/zcc.device-posture.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/shared/shared.device-posture.trust-levels.md (Internet & SaaS device trust levels: how posture becomes a policy criterion), from zcc.device-posture: An Internet & SaaS posture profile holds an expression for each of High Trust, Medium Trust and Low Trust; Client Connector evaluates the checks of all levels on the device and the highest matching level is used. [shared.device-posture.trust-levels:level-expressions]
- scoped-by references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies)), from zcc.device-posture: An app profile, on each platform's policy page (Windows, macOS, Linux, iOS and Android), can apply an Internet & SaaS (ZIA) posture profile. [zcc.device-posture:zia-posture-profile]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.evaluation.md (When and how often posture is evaluated), from zcc.device-posture: Zscaler Client Connector evaluates device posture profiles every 15 minutes, new connections are established on the updated posture, and existing connections are not affected by updates to security postures. [zpa.posture-profiles.evaluation:cadence]
- interacts-with references/_meta/text/zpa/zpa.posture-profiles.policy-operand.md (The POSTURE operand in ZPA policy rules), from zcc.device-posture: In the console each posture profile in a condition set is set to VERIFIED, meaning Zscaler Client Connector verified the device against the profile's criteria, or VERIFICATION FAILED, meaning it was unable to verify the device against them. [zpa.posture-profiles.policy-operand:console-states]
- links-to references/_meta/text/zcc/zcc.device-posture.check-types.md (Device posture check types: what each checks, where it applies, and how it passes)
