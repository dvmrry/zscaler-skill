---
product: zcc
topic: "device-posture"
title: "ZCC device posture profiles — checks, cadence, per-OS specifics"
content-type: reasoning
last-verified: "2026-04-26"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/about-device-posture-profiles.md"
  - "vendor/zscaler-help/configuring-device-posture-profiles.md"
  - "vendor/zscaler-help/configuring-client-certificate-posture-check-linux.md"
author-status: draft
---

# ZCC device posture profiles — checks, cadence, per-OS specifics

This is the ZCC-specific implementation doc for device posture profiles. It covers the check types ZCC supports, evaluation mechanics, and per-OS specifics. For the cross-product concept (how ZPA and ZIA consume posture results, machine-tunnel integration, policy-construction patterns, and the full platform-compatibility matrix) see [`../shared/device-posture.md`](../shared/device-posture.md). Don't duplicate what's there — cross-link.

## What a device posture profile is in ZCC

A device posture profile is a named set of criteria that ZCC evaluates **on the endpoint**. The result — pass or fail — is attached to the active tunnel and surfaced to ZIA (as a Trust Level) and ZPA (as an Access Policy condition). Profiles are defined in the admin console at **Policies > Common Configuration > Resources > Device Posture**; defined once, referenced by both products.

The key ZCC-specific point: ZCC is the evaluator. Neither ZPA nor ZIA independently inspect the device; they receive ZCC's reported result and act on it. This means evaluation cadence (when ZCC runs the check) and staleness (how old a result can be before it affects policy) are entirely ZCC-side concerns.

## Posture check types

The full catalog of posture types ZCC supports. Not all work on all platforms — the admin console disables unsupported combinations at profile-creation time. For the per-platform compatibility matrix see [`../shared/device-posture.md § Posture types`](../shared/device-posture.md).

**Endpoint state:**
- OS Version — minimum version match (Windows, macOS, Linux, iOS, Android)
- Full Disk Encryption — BitLocker / FileVault / equivalent
- Firewall — OS firewall enabled
- Domain Joined — Active Directory domain membership (Windows, macOS)
- AzureAD Domain Joined — Azure AD join state (Windows only)
- Unauthorized Modification — device-tampering indicator (Windows only)
- Ownership Variable — corporate / BYOD / contractor label (Windows only)
- Zscaler Client Connector Version — minimum ZCC version (all platforms)

**Certificate / PKI:**
- Client Certificate — client cert present and valid
- Server Validated Client Certificate — cert verified against a configured server
- Certificate Trust — certificate is trusted by the device's trust store

**File system / process / registry:**
- File Path — file exists at a specified path
- Registry Key — Windows registry key present / value matches
- Process Check — named process is running

**EDR / AV agents:**
- Detect Carbon Black — VMware Carbon Black agent present
- Detect CrowdStrike — CrowdStrike Falcon agent present
- CrowdStrike ZTA Score — score from CrowdStrike Zero Trust Assessment API
- CrowdStrike ZTA Device OS Score — sub-score
- CrowdStrike ZTA Sensor Setting Score — sub-score
- Detect SentinelOne — SentinelOne agent present
- Detect Microsoft Defender — Defender running (Windows only)
- Detect Antivirus — generic AV-present signal
- Jamf Detection — Jamf MDM-managed (macOS only)

## Evaluation cadence

**Default:** ZCC evaluates all posture profiles every **15 minutes**. New connections pick up the updated result; existing connections are not retroactively affected.

**Configurable frequency** (per-profile, in the Frequency field):
- ZCC 4.4+ for Windows, ZCC 4.5+ for macOS
- Range: 2 minutes (min) to 15 minutes (max), in 1-minute increments

**Immediate (change-triggered) evaluation** — regardless of the configured frequency, these five posture types re-evaluate the moment ZCC detects the underlying state flip:
- Process Check
- Detect Carbon Black
- Detect CrowdStrike
- Detect SentinelOne
- Detect Microsoft Defender

Immediate evaluation is on by default; it can be disabled by Zscaler Support. All other posture types (file, registry, encryption, certificate, OS version, etc.) wait for the timer.

**Ad-hoc triggers** — beyond the timer, ZCC re-evaluates posture on:
- Zscaler service restart
- Device reboot
- Device joins a network
- Device comes out of hibernation
- Device moves from non-domain-joined to domain-joined
- Device moves from Wi-Fi to Ethernet or changes Wi-Fi networks

**Operational implication of cadence:** a policy change pushed to the admin console does not take effect on already-connected devices until their next evaluation tick (up to 15 minutes), and even then only for new connections. A user who was connected before the posture policy tightened keeps their tunnel until it naturally drops. See [`../shared/device-posture.md § The "existing connections are not affected" rule`](../shared/device-posture.md) for ZPA Reauth Timeout as the bound.

## Per-OS specifics

### Linux

Linux has the sparsest posture support: **OS Version**, **Zscaler Client Connector Version**, and **File Path** are the main supported types. Client Certificate is available but requires manual setup.

**Client Certificate posture check on Linux** (unique setup path):

1. Upload a CA certificate (root CA or intermediate) to the Zscaler Admin Console.
2. Copy `client_cert.pem` (Base64-encoded, `.pem` extension required) to the endpoint:
   - **Non-Exportable Private Key disabled:** `~/.Zscaler/certificates/` — user-accessible
   - **Non-Exportable Private Key enabled:** `/opt/zscaler/client_cert/` — root-only permissions
3. Copy the associated private key (Base64-encoded, `.key` extension required):
   - **Non-Exportable Private Key disabled:** `~/.Zscaler/certificates/private/`
   - **Non-Exportable Private Key enabled:** `/opt/zscaler/private_key/` — this directory is created at ZCC install time, root-owned with 755 permissions. **ZCC validates the private key file's permission; posture fails if the file is readable by non-root users.**
4. Intermediate CAs (if any) must be in either the system trust store or `/opt/zscaler/intermediate_ca/`.

Verify after setup:
- Ubuntu: `openssl verify -show_chain -CApath /etc/ssl/certs/ <client_cert_file>`
- CentOS/Fedora: `openssl verify -show_chain -CApath /etc/pki/ca-trust/extracted/pem/ <client_cert_file>`

The two-path split (user-accessible vs root-only) exists to support Non-Exportable Private Key, which prevents the cert from being extracted from the device. Non-Exportable Private Key = tighter security, but requires the cert be placed in the privileged path before ZCC can find it.

### Windows

- Broadest posture type coverage — all types except Jamf Detection apply.
- Configurable evaluation frequency available from ZCC 4.4+.
- **Apply to Windows Machine Tunnel** — when enabled on a posture profile, the following types evaluate against the pre-login machine tunnel: Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version, Zscaler Client Connector Version. User-context types (Process Check, Detect Defender, AV checks) cannot run pre-login.
- **Apply when added as Partner Tenant** (ZCC 4.6+) — posture evaluation runs on the ZPA Private Access tunnel used to connect to a partner tenant.

### macOS

- Configurable evaluation frequency available from ZCC 4.5+.
- **Apply to macOS Machine Tunnel** supports this subset pre-login: CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version, Zscaler Client Connector Version.
- Jamf Detection is macOS-exclusive — verifies the device is managed by Jamf MDM.

### iOS and Android

Posture support is minimal: **OS Version** and **Zscaler Client Connector Version** only. Policies that rely on richer posture signals for iOS/Android users are effectively unenforced for those posture types — treat those platforms as "version-check only" in posture design.

## Profile assignment and consumption

Posture profiles are defined centrally and consumed in two places:

1. **ZPA Access Policies** — a rule references a profile ID with a pass/fail condition. First-match-wins evaluation across rules. See [`../shared/device-posture.md § How ZPA Access Policies consume posture`](../shared/device-posture.md).
2. **ZIA Posture Profile Trust Levels** — profiles feed content-inspection tiers for Internet & SaaS.

There is no direct link between a posture profile and a forwarding profile or web policy in the ZCC object model. The forwarding profile (see [`./forwarding-profile.md`](./forwarding-profile.md)) governs traffic routing; posture results are consumed downstream by ZPA/ZIA policy, not by the forwarding profile itself. Trusted-network evaluation (see [`./trusted-networks.md`](./trusted-networks.md)) is a separate, parallel signal.

## Failure modes

**Posture evaluation failure (ZCC can't run the check):**
If ZCC fails to evaluate a check — e.g., it can't access the registry, or the certificate path isn't readable — the result is treated as a failed posture. On Linux, a private key file with non-root-readable permissions (when Non-Exportable Private Key is enabled) explicitly triggers this: ZCC detects the permission violation and reports posture failure rather than reading the key.

**Stale results (cadence gap):**
Up to the configured frequency (default 15 minutes) of state-lag between a real-world change and a posture update. For AV/process types that evaluate immediately-on-change, this window collapses to near-zero; for all others it's up to the full interval. Existing tunnels are never retroactively revoked — staleness only affects new connections after the next evaluation tick.

**Version mismatch:**
Posture types introduced in newer ZCC versions are silently unavailable on clients below the required version. An **OS Version** or **ZCC Version** posture check can gate access for clients that are too old; deploying a posture type that requires ZCC 4.4+ on a fleet with mixed ZCC versions will result in inconsistent evaluation until the fleet is upgraded.

**CrowdStrike ZTA score unavailable:**
CrowdStrike ZTA Score posture types read the score from the Falcon agent. If the Falcon agent is not running, or the agent hasn't yet obtained a score, the score is absent and the check fails closed. This is indistinguishable to ZPA from "score too low" — point operators toward the Falcon agent status, not the Zscaler posture rule, when investigating CrowdStrike-ZTA-based failures.

## Cross-links

- Cross-product posture concept, platform matrix, machine-tunnel integration, policy construction — [`../shared/device-posture.md`](../shared/device-posture.md)
- How posture result flows into forwarding decisions — it doesn't directly; forwarding is governed by [`./forwarding-profile.md`](./forwarding-profile.md)
- Trusted Networks (parallel on-device signal, separate from posture) — [`./trusted-networks.md`](./trusted-networks.md)
- ZPA Access Policy posture criteria and Reauth Timeout — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
