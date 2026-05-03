---
product: zcc
topic: forwarding-profiles
title: "ZCC forwarding profiles — portal configuration, network environments, and app profile assignment"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-forwarding-profiles-zscaler-client-connector.md"
  - "vendor/zscaler-help/about-forwarding-profiles.md"
author-status: draft
---

# ZCC forwarding profiles — portal configuration, network environments, and app profile assignment

This document covers the **portal-side view** of forwarding profiles: what they are, how network environments are classified, what the key configuration sections control, and how profiles are assigned to users via app profiles. For the full SDK and wire-format detail (field-level types, integer enum values, ForwardingProfileActions structure), see [`./forwarding-profile.md`](./forwarding-profile.md).

## What a forwarding profile is

A forwarding profile tells Zscaler Client Connector how to treat traffic from a user's device based on the **network environment** the device is currently in. The profile independently configures behavior for:

- **Internet & SaaS traffic** (ZIA) — where to send it (Z-Tunnel, PAC, or direct)
- **Private Access traffic** (ZPA) — whether to tunnel, bypass, or follow a specific path

Each ZCC-enrolled device has exactly one active forwarding profile at a time, determined by the App Profile (Web Policy) assigned to the user or device. A single tenant can have many forwarding profiles to match different network topologies (multiple offices, home workers, contractors, etc.) (Tier A — vendor/zscaler-help/about-forwarding-profiles.md).

---

## Network environments ZCC recognizes

ZCC continuously evaluates the device's current network and classifies it into one of the following types. The active classification determines which branch of the forwarding profile is applied (Tier A — vendor/zscaler-help/about-forwarding-profiles.md):

| Network Type | Definition |
|---|---|
| **On-Trusted Network** | Device is connected to a private network that meets the profile's Trusted Network Criteria (DNS servers, hostnames, SSIDs, subnets, egress IPs, or DHCP servers match) |
| **Off-Trusted Network** | Device is on an untrusted network (public Wi-Fi, home broadband, etc.) |
| **VPN-Trusted Network** | Device is connected to a trusted network through a VPN in **full-tunnel** mode; VPN installs a default route and interface description contains "Cisco", "Juniper", "Fortinet", "PanGP", or "VPN" (Windows); or creates `utun`, PPP, or GPD interface (macOS) |
| **Split VPN-Trusted Network** | Device is connected to a trusted network via **split-tunnel** VPN; VPN does not install a default route and interface description still matches VPN vendor keywords |

### VPN-Trusted vs Off-Trusted edge cases

ZCC does **not** classify a network as VPN-Trusted in these scenarios:

- The VPN doesn't install a default route and uses another mechanism to capture all traffic.
- The VPN interface description (Windows) does not contain one of the recognized vendor keywords.
- The VPN runs in split-tunnel mode (routes only some subnets).

On macOS, interface description keyword matching is not used — only the interface type matters (`utun`, PPP, GPD). ZCC treats split-tunnel VPN as "Split VPN-Trusted Network," not as "Off-Trusted."

The current network type is displayed to the user in the ZCC app on both the Internet Security window and the Private Access window.

---

## Configuration sections

Navigation: **Infrastructure > Connectors > Client > Forwarding Profile for Platforms > Add Forwarding Profile**

The portal UI organizes the forwarding profile into the following sections (Tier A — vendor/zscaler-help/configuring-forwarding-profiles-zscaler-client-connector.md):

### Profile Definition

Basic identifying information: profile name and any description. This is also where the Trusted Network Criteria configuration lives — the specific signals ZCC uses to evaluate whether the device is on a trusted network.

Trusted Network Criteria can include:

- DNS servers — match by IP
- DNS search domains — match by domain suffix
- Hostnames with expected resolved IP addresses
- DHCP servers — match by IP
- Default gateways — match by IP
- Subnets (CIDR) — match on the device's network address
- Trusted egress IPs — match the public IP the network NATs to

Multiple criteria can be combined using AND or OR logic (configured via the condition type field). Criteria can reference standalone Trusted Network entities or be defined inline on the profile.

### Trusted Network Criteria

Configures which signals ZCC uses to evaluate the On-Trusted Network classification. This section may expand on the inline criteria with references to separately defined Trusted Network objects (see [`./trusted-networks.md`](./trusted-networks.md)).

### Trusted Network Evaluation

Controls whether trusted-network evaluation is enabled at all, and how evaluation signals are combined. If trusted-network evaluation is disabled, ZCC always treats the device as Off-Trusted Network regardless of actual network conditions.

### Windows Driver Selection

Controls the Windows Lightweight Filter (LWF) driver mode, which affects how ZCC intercepts traffic at the network stack level on Windows. This is a per-profile setting, allowing tenants to deploy different driver modes to different user populations (e.g., testing a new driver mode on a pilot group).

### Forwarding Profile Action for Internet & SaaS

Defines, per network type (On-Trusted, Off-Trusted, VPN-Trusted, Split VPN-Trusted), how ZCC handles traffic destined for the internet and SaaS applications. Each network-type branch independently specifies:

- **Action**: Send through Z-Tunnel (ZIA inspection), apply a PAC file, or bypass ZIA entirely (direct)
- **Z-Tunnel version**: Z-Tunnel 2.0 (DTLS + TLS) or Z-Tunnel 1.0 (legacy)
- **Transport**: DTLS with TLS fallback, TLS only
- **PAC content**: Custom PAC URL or inline PAC when action is PAC-based
- **System proxy integration**: Honor existing OS proxy settings, set a proxy server, or use a PAC URL
- **IPv6 handling**: Drop or pass IPv6 traffic
- **MTU settings**: Path MTU discovery, ZCC virtual adapter MTU

A common trusted-network pattern: set the On-Trusted action to "bypass ZIA" (`actionType = NONE`) for users on the corporate LAN that has its own perimeter controls, while keeping Off-Trusted set to Z-Tunnel. **A misconfigured or over-broad trusted-network criterion silently moves users to the bypass branch**, producing unintended ZIA-inspection bypass without any policy change.

### Forwarding Profile Action for Private Access

Independently configures ZPA behavior per network type. ZPA actions are orthogonal to ZIA actions — the same profile can have:

- ZIA: bypass on trusted network
- ZPA: always tunnel (on all network types)

This pattern is common for offices with on-prem internet gateways but no on-prem ZPA infrastructure.

Notable ZPA action setting: **Send Trusted Network Result to ZPA** — controls whether ZCC reports its current trusted-network evaluation state to the ZPA policy engine. ZPA access policies can include a TRUSTED_NETWORK condition; that condition will never match if this toggle is off, regardless of the device's actual network.

---

## Relationship between forwarding profiles and app profiles

An **App Profile** (also called a Web Policy in the SDK/API) is the entity that assigns a forwarding profile to a user or device. The App Profile references the forwarding profile by ID. A user's active App Profile determines their active forwarding profile (Tier A — vendor/zscaler-help/about-forwarding-profiles.md).

```
User / Device
    └── assigned to → App Profile (Web Policy)
                          └── references → Forwarding Profile
                                               ├── On-Trusted action (ZIA)
                                               ├── Off-Trusted action (ZIA)
                                               ├── On-Trusted action (ZPA)
                                               └── Off-Trusted action (ZPA)
```

One tenant can have many App Profiles and many Forwarding Profiles. For example:

- "Field Workers" App Profile → "Mobile/Off-Network" Forwarding Profile (always Z-Tunnel)
- "HQ Users" App Profile → "Corporate LAN" Forwarding Profile (bypass on trusted, Z-Tunnel off-trusted)
- "Contractors" App Profile → "Contractor" Forwarding Profile (Z-Tunnel always, no ZPA)

**App profile changes propagate only on user logout/restart.** ZCC downloads updated App Profile settings only when the user logs out and back in, or restarts the computer. Pushing a critical forwarding profile change does not take effect on currently-connected devices until their next ZCC restart cycle (Tier A — vendor/zscaler-help/about-forwarding-profiles.md).

---

## Portal operations

From the Forwarding Profile page (Infrastructure > Connectors > Client > Forwarding Profile for Platforms), admins can (Tier A — vendor/zscaler-help/about-forwarding-profiles.md):

- Add a forwarding profile
- Search for a profile by name
- View all configured profiles
- Edit an existing profile
- Copy an existing profile (useful for creating a variant without starting from scratch)
- Delete a profile
- View the default forwarding profile (system-provided baseline)

A profile that is referenced by an active App Profile cannot be deleted without first updating the App Profile to reference a different profile.

---

## SDK and API objects

The forwarding profile wire-format is documented in detail in [`./forwarding-profile.md`](./forwarding-profile.md). Key notes for cross-referencing:

- SDK object: `ForwardingProfile` (Python: `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py`)
- Python SDK service: `vendor/zscaler-sdk-python/zscaler/zcc/forwarding_profile.py`
- Go SDK service: `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go`
- Wire-format enum fields (`conditionType`, `networkType`, `actionType`, `primaryTransport`) are integers, not strings — documented in [`./forwarding-profile.md § Wire-type correction`](./forwarding-profile.md)
- Fail-open policy is a separate object (`FailOpenPolicy`) at the tenant level, not embedded in the forwarding profile

---

## Common configuration patterns and gotchas

### "All traffic bypassing ZIA on corporate LAN"

Check: On-Trusted action for Internet & SaaS is set to bypass/direct (`actionType` equivalent to `NONE`). Also check Trusted Network Criteria — if criteria are too broad (e.g., `192.168.0.0/16` matches typical home routers), home users will be classified as On-Trusted and bypass ZIA.

### "ZPA TRUSTED_NETWORK policy rules never fire"

Two causes: (1) `evaluate_trusted_network` is false on the profile, so the trusted-network state is never evaluated; or (2) `sendTrustedNetworkResultToZpa` is off on the ZPA action block, so ZCC never reports the trusted-network state to ZPA even if evaluation is working.

### "Policy change didn't take effect immediately"

Expected behavior — App Profile (and therefore Forwarding Profile) changes propagate only on ZCC logout/restart. No manual propagation mechanism is documented.

### "Split VPN vs full VPN behavior differs"

Full VPN (VPN-Trusted) and split VPN (Split VPN-Trusted) are distinct network types in the forwarding profile. They can have different ZIA and ZPA actions configured. Misclassification usually stems from VPN interface description keywords not matching (Windows) or the VPN using a non-standard interface type (macOS).

---

## Cross-links

- Forwarding profile SDK/wire-format detail — [`./forwarding-profile.md`](./forwarding-profile.md)
- Trusted Network objects — [`./trusted-networks.md`](./trusted-networks.md)
- App Profiles / Web Policy (profile assignment) — [`./web-policy.md`](./web-policy.md)
- Z-Tunnel versions and transport options — [`./z-tunnel.md`](./z-tunnel.md)
- ZCC API surface — [`./api.md`](./api.md)
- PAC files (PAC content in forwarding profiles) — [`../shared/pac-files.md`](../shared/pac-files.md)
- Fail-open policy (captive portal, tunnel failure) — [`./forwarding-profile.md § Fail-open policy`](./forwarding-profile.md)
