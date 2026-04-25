---
product: shared
topic: "device-posture"
title: "Device Posture — signals, evaluation, and policy consumption"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-device-posture-profiles.md"
  - "vendor/zscaler-help/configuring-device-posture-profiles.md"
author-status: draft
---

# Device Posture — signals, evaluation, and policy consumption

Device Posture is ZCC's evaluation layer that gates ZPA access policies and ZIA trust levels. A **Posture Profile** is a named bundle of criteria (file presence, encryption state, AV running, OS version, etc.) evaluated on an enrolled device. Policies can condition on whether a device matches a profile.

This is a cross-product concern: ZCC **evaluates**, ZPA **consumes** (Access Policy rules), ZIA **consumes** (Posture Profile Trust Levels). Understanding the evaluation cadence and policy-linkage semantics is prerequisite for any "why did this user's access break?" question involving posture.

## The three-product split

```
ZCC (evaluates)  →  Posture Profile evaluation every N minutes
                      ↓
                   Posture result attached to tunnel
                      ↓
                 ┌────┴────┐
                 ↓         ↓
              ZPA        ZIA
     Access Policy    Posture Profile
       references     Trust Levels
       profile by     (content-inspection
          ID            gating)
```

A profile lives in **Policies > Common Configuration > Resources > Device Posture** in the admin console — defined once, referenced by both products.

## Posture types (the signals)

The full catalog of posture types, with approximate platform coverage:

| Posture Type | Windows | macOS | Linux | iOS | Android | Notes |
|---|---|---|---|---|---|---|
| **Certificate Trust** | ✓ | ✓ | | | | Validates a certificate is trusted by the device |
| **File Path** | ✓ | ✓ | ✓ | | | File existence at a path |
| **Registry Key** | ✓ | | | | | Windows registry presence / value match |
| **Client Certificate** | ✓ | ✓ | | | | Client cert present & valid |
| **Server Validated Client Certificate** | ✓ | | | | | Cert verified against a configured server |
| **Firewall** | ✓ | ✓ | | | | OS firewall enabled |
| **Full Disk Encryption** | ✓ | ✓ | | | | BitLocker / FileVault |
| **Domain Joined** | ✓ | ✓ | | | | Joined to a Windows/AD domain |
| **AzureAD Domain Joined** | ✓ | | | | | Specifically Azure AD-joined |
| **Process Check** | ✓ | ✓ | | | | Named process is running |
| **Detect Carbon Black** | ✓ | ✓ | | | | VMware Carbon Black agent present |
| **Detect CrowdStrike** | ✓ | ✓ | | | | Falcon agent present |
| **CrowdStrike ZTA Score** | ✓ | ✓ | | | | Score from CrowdStrike Zero Trust Assessment |
| **CrowdStrike ZTA Device OS Score** | ✓ | | | | | Sub-score |
| **CrowdStrike ZTA Sensor Setting Score** | ✓ | | | | | Sub-score |
| **Detect SentinelOne** | ✓ | ✓ | | | | S1 agent present |
| **Detect Microsoft Defender** | ✓ | | | | | |
| **Detect Antivirus** | ✓ | ✓ | | | | Generic AV-present signal |
| **Ownership Variable** | ✓ | | | | | Corporate / BYOD / contractor label |
| **Unauthorized Modification** | ✓ | | | | | Tampering indicator |
| **OS Version** | ✓ | ✓ | ✓ | ✓ | ✓ | Minimum version match |
| **Jamf Detection** | | ✓ | | | | Jamf MDM-managed |
| **Zscaler Client Connector Version** | ✓ | ✓ | ✓ | ✓ | ✓ | Minimum ZCC version |

**Not all posture types work on all platforms.** The admin console disables unsupported combinations when you configure a profile.

## Evaluation cadence

- **Default:** ZCC evaluates posture profiles every **15 minutes**.
- **Configurable:** ZCC 4.4+ for Windows, ZCC 4.5+ for macOS — per-posture-type frequency can be set from **2 minutes (min) to 15 minutes (max)**.
- **Immediate-on-change (override, regardless of frequency):**
  - Process Check
  - Detect Carbon Black
  - Detect CrowdStrike
  - Detect SentinelOne
  - Detect Microsoft Defender

These five re-evaluate the moment ZCC detects the underlying state flip on the device. Applied to tunnels at next connection.

### What triggers an ad-hoc evaluation

Beyond the timer, ZCC re-evaluates posture on these events:

- The Zscaler service restarts.
- Device reboots.
- Device joins a network.
- Device comes out of hibernation.
- Device moves from non-domain-joined to domain-joined.
- Device moves from Wi-Fi to Ethernet.
- Device changes Wi-Fi networks.

## The "existing connections are not affected" rule

Posture changes impact **new connections only**. An existing tunnel established when the device matched the profile stays up even if the profile subsequently fails — until the tunnel itself drops (app restart, network switch, reboot, etc.).

**Operational implication:** posture failure doesn't retroactively revoke access. A user who passes posture, connects to a ZPA segment, then fails a posture check ten minutes later keeps the session until their ZPA app disconnects. Use ZPA's **Reauth Timeout** (see [`../zpa/policy-precedence.md § Timeout policies`](../zpa/policy-precedence.md)) to bound this — the next reauth re-evaluates posture.

## Machine Tunnel integration (the pre-login enforcement case)

ZPA can establish a **Machine Tunnel** before a user logs in — enabling pre-login scenarios like GPO application from a domain controller, login scripts that fetch from fileshares, certificate enrollment. The pre-login phase has no interactive user, so posture evaluation runs in a special mode.

Per-platform Machine Tunnel checkboxes on each posture profile:

- **Apply to Windows Machine Tunnel** — applies a subset of posture types to the pre-Windows-login tunnel: Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version, Zscaler Client Connector Version.
- **Apply to macOS Machine Tunnel** — pre-macOS-login subset: CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version, Zscaler Client Connector Version.

Posture types not listed for Machine Tunnel are user-context-dependent and can't run without a logged-in user (e.g., Process Check, AV-running checks that query per-user API surfaces).

## Partner Tenant integration (ZCC 4.6+ Windows)

**Apply when added as Partner Tenant** — when a ZCC client is added to a partner tenant (cross-tenant ZPA scenarios), posture evaluation runs in that tunnel too. Without this flag, posture only applies to the primary-tenant tunnels.

## How ZPA Access Policies consume posture

ZPA Access Policy rules (see [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)) include a **Posture** criterion operand. Each operand references a posture profile ID plus a boolean:

- `postureId: <id>, verification: TRUE` — rule matches when device **passes** this profile.
- `postureId: <id>, verification: FALSE` — rule matches when device **fails** this profile.

Multiple posture operands on one rule combine with **AND** — a rule with three posture operands requires all three conditions. Combined with other operand types (Application Segment, User, Location, etc.) also via AND. Across Access Policy rules, first-match-wins evaluation picks the first rule whose operands all match.

**Policy-construction pattern:**

- High-trust profile (corporate-managed + encrypted + AV): access to crown jewels.
- Mid-trust profile (corporate-managed only): access to business apps.
- Low-trust or failed-profile fallthrough: access to general internet or a quarantine segment.

Fallthrough ordering matters: put the strictest posture rule first, so a device passing it doesn't fall into a laxer rule.

## How ZIA consumes posture (Trust Levels)

On the ZIA side, posture profiles feed **Internet & SaaS Posture Profile Trust Levels**. Rather than being used for allow/deny decisions directly, they modulate content-inspection posture — e.g., a high-trust device gets different SSL inspection / DLP handling than an unmanaged BYOD device. See the Internet & SaaS admin docs for specifics (not yet captured in the skill).

## Surprises worth flagging

1. **Existing connections don't re-check.** A user who passes posture → connects → fails posture retains the tunnel. Don't assume posture is a real-time enforcement boundary. Bound via Reauth Timeout.

2. **Machine Tunnel evaluates a subset only.** User-context-dependent posture types (Process Check, Detect Defender, Ownership Variable) don't apply pre-login. Designing a posture profile that relies on these for pre-login enforcement silently evaluates as "pass" — gate logic that needs strict coverage should use the Machine Tunnel-eligible subset.

3. **Immediate-on-change is only for five AV/process types.** All other posture types follow the configured frequency. A user who toggles disk encryption off doesn't trigger immediate re-evaluation — they keep their current posture result until the next tick.

4. **The frequency slider goes down to 2 minutes but costs battery + API calls.** Zscaler's 15-minute default is the right trade-off for most tenants. Going lower is operator-tunable when a specific threat model requires it (e.g., detecting immediate process termination of an EDR), but expect client-side resource cost.

5. **Posture + Trusted Networks is AND, not OR.** A rule with both a Trusted Network criterion and a Posture criterion requires both to match. A "trusted network fallback" pattern (where an on-prem connection bypasses posture) needs to be configured as a separate rule with only Trusted Network as criterion, placed before the posture-checking rule.

6. **Linux, iOS, Android have sparse posture support.** Only OS Version and ZCC Version evaluate on these platforms. Policies that lean on posture for non-Windows/Mac devices default to trivially-passing for most posture types — effectively no posture gating.

7. **CrowdStrike ZTA scores come from CrowdStrike, not Zscaler.** The score is injected by the Falcon agent; Zscaler reads whatever value the agent provides. Failing CrowdStrike agent = no score = score-based posture rule fails closed.

## Common operational questions

**"User X passed posture yesterday, why are they failing today?"**
- Check evaluation frequency: 15 min default means state changes up to 15 min ago might have just propagated.
- Check for trigger events: new network? Wi-Fi change? Reboot?
- Check the posture type: AV / Process checks re-evaluate immediately-on-change; file / registry / encryption checks wait for the timer.
- Check the access rule ordering: a posture change could move the user from matching rule #5 to matching rule #8 (different app scope).

**"Why is my pre-login Machine Tunnel failing posture?"**
- Verify the posture profile's **Apply to Windows/macOS Machine Tunnel** is on.
- Verify all posture types in the profile are Machine Tunnel-eligible (see list above).
- Process Checks and AV-detection types don't work pre-login — remove or move them to a user-login-scoped profile.

## Cross-links

- ZCC evaluation architecture: [`../zcc/index.md`](../zcc/index.md).
- ZPA Access Policy posture criteria: [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md).
- Posture vs Trusted Networks: [`../zcc/trusted-networks.md`](../zcc/trusted-networks.md).
- Step-up auth can complement posture — fails-posture → require additional auth: [`../zidentity/step-up-authentication.md`](../zidentity/step-up-authentication.md).
- Reauth timeout for bounding posture staleness: [`../zpa/policy-precedence.md § Timeout policies`](../zpa/policy-precedence.md).
