# Configuring Device Posture Profiles

**Source:** https://help.zscaler.com/zscaler-client-connector/configuring-device-posture-profiles
**Captured:** 2026-04-24 via Playwright MCP.

---

Posture profiles for both Internet & SaaS and Private Access devices are created in the **Device Posture** section. They are used for configuring Private Access access policies and for adding posture profile trust levels for Internet & SaaS.

## Procedure

1. Go to **Policies > Common Configuration > Resources > Device Posture**.
2. Click **Add Device Posture**.
3. In the **Add Device Posture** window:
   - **Name** — enter a name for the profile.
   - **Platform** — select one or more:
     - Windows
     - macOS
     - Linux
     - Android
     - iOS
   - **Apply to Windows Machine Tunnel** — when selected, the posture type is evaluated and applied to the Private Access **pre-Windows-login** machine tunnel. Otherwise it is only evaluated for regular Private Access and Internet & SaaS tunnels. Applies to these Windows posture types: Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version, Zscaler Client Connector Version.
   - **Apply when added as Partner Tenant** — ZCC 4.6+ for Windows. When selected, the posture type is evaluated on the Private Access tunnel used to connect to a partner tenant.
   - **Apply to macOS Machine Tunnel** — when selected, the posture type is evaluated and applied to the Private Access **pre-macOS-login** machine tunnel. Applies to these macOS posture types: CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version, Zscaler Client Connector Version.
   - **Frequency (In Minutes)** — ZCC 4.4+ for Windows, ZCC 4.5+ for macOS. Evaluation interval in 1-minute increments. Default max: 15 minutes. Minimum: 2 minutes.

### Posture types with immediate (change-triggered) evaluation

For the following posture checks, ZCC evaluates posture **immediately when posture changes on the device**, regardless of the configured Frequency:

- Process Check
- Detect Carbon Black
- Detect CrowdStrike
- Detect SentinelOne
- Detect Microsoft Defender

ZCC continues to evaluate these on the configured Frequency as well. This immediate-evaluation feature is enabled by default; contact Zscaler Support to disable.

### Complete list of Posture Types

- Certificate Trust
- File Path
- Registry Key
- Client Certificate
- Firewall
- Full Disk Encryption
- Domain Joined
- Process Check
- Detect Carbon Black
- Detect CrowdStrike
- CrowdStrike ZTA Score
- Detect SentinelOne
- Ownership Variable
- Unauthorized Modification
- Detect Microsoft Defender
- Detect Antivirus
- OS Version
- Jamf Detection
- AzureAD Domain Joined
- Server Validated Client Certificate
- CrowdStrike ZTA Device OS Score
- CrowdStrike ZTA Sensor Setting Score
- Zscaler Client Connector Version

**Not all posture types work on all platforms.** Selecting a platform that doesn't support a posture type disables that option.

Optionally enter a **Device Posture Description**. Click **Save**.

After configuring posture profiles, use them to configure access policies (Private Access) and to add posture profile trust levels (Internet & SaaS).
