---
product: zcc
topic: ssl-inspection-zcc
title: "ZCC SSL inspection — agent-side certificate trust and inspection configuration"
content-type: reference
last-verified: "2026-04-28"
confidence: low
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-ssl-inspection-zscaler-client-connector.md"
author-status: draft
---

# ZCC SSL inspection — agent-side certificate trust and inspection configuration

## Source availability note

The vendor source for this topic (`vendor/zscaler-help/configuring-ssl-inspection-zscaler-client-connector.md`) redirected to an unrelated page during capture and contains no usable content. This document records what is known from adjacent sources and clearly marks gaps. Confidence is low. Operators needing authoritative detail should consult the ZCC help portal directly at `help.zscaler.com/zscaler-client-connector/configuring-ssl-inspection-zscaler-client-connector`.

---

## ZCC SSL inspection vs ZIA SSL inspection

There are two distinct SSL inspection configurations relevant to ZCC-deployed users:

### ZIA SSL inspection (cloud-side)

ZIA performs SSL/TLS decryption and re-encryption at the Service Edge (the cloud proxy). The ZIA SSL inspection policy (`references/zia/ssl-inspection.md`) controls which categories and destinations are decrypted. This is the primary location where SSL inspection policy is managed for users whose traffic flows through ZIA via Z-Tunnel.

When ZCC is in Z-Tunnel mode and routes traffic to a ZIA Service Edge, ZIA performs the actual SSL break-and-inspect. The user's device must trust the ZIA intermediate CA certificate for ZIA inspection to work without browser certificate errors.

### ZCC agent-side SSL configuration

ZCC has its own SSL-related settings that operate at the endpoint, distinct from ZIA's cloud-side SSL inspection policy. These cover:

- **Certificate trust installation** — whether ZCC installs the Zscaler root CA certificate into the OS trust store, enabling ZIA SSL inspection without browser certificate warnings.
- **SSL inspection bypass at the agent** — whether specific applications or traffic types bypass SSL inspection at the ZCC level before traffic even reaches ZIA.

These are configured in the App Profile (Web Policy) per platform, not in a separate "SSL inspection" policy object on ZCC's side.

---

## Certificate trust — what ZCC configures on the endpoint

For ZIA SSL inspection to work transparently to end users, the Zscaler root CA certificate must be trusted by the operating system and/or individual applications. ZCC can install this certificate automatically as part of enrollment and App Profile configuration.

The App Profile (per platform: Windows, macOS, iOS, Android) includes settings that control whether ZCC:

- Installs the Zscaler root CA into the OS certificate store during enrollment
- Installs the certificate into platform-specific trust stores (e.g., Firefox has its own certificate store separate from the OS on Windows and macOS)

These settings are part of the App Profile / Web Policy configuration, not a standalone ZCC SSL inspection policy object. See [`./web-policy.md`](./web-policy.md) for the App Profile field catalog.

### Firefox certificate trust

Firefox uses its own certificate store and does not automatically trust OS-level CAs. ZCC has a Firefox integration path that installs the Zscaler CA into Firefox's store. This is configured separately — see [`./firefox-integration.md`](./firefox-integration.md).

---

## SSL inspection bypass at the ZCC agent level

Certain applications (thick clients, mobile apps, applications using certificate pinning) may break when their TLS connections are intercepted by a cloud proxy. ZCC supports per-application and per-destination bypass at the agent level:

- **App-level bypass** — specified in the App Profile or ZIA policy; certain applications are excluded from SSL inspection
- **Domain/IP bypass** — specific destinations can be excluded from SSL inspection in ZIA's SSL inspection policy (cloud-side exclusions take precedence over interception for matching traffic)

The distinction from ZIA SSL inspection policy: ZIA exclusions are evaluated at the cloud proxy after traffic arrives from ZCC. Agent-side bypasses (configured on ZCC) prevent certain traffic from entering the Z-Tunnel in the first place, depending on forwarding profile action settings.

---

## Platform-specific behavior

SSL inspection and certificate trust behavior varies by platform due to OS differences in certificate store architecture:

| Platform | OS trust store used | Notes |
|---|---|---|
| Windows | Windows Certificate Store | ZCC can install Zscaler CA via Group Policy or ZCC enrollment |
| macOS | macOS Keychain | ZCC enrollment can install CA; may require MDM approval on newer macOS |
| iOS | iOS Keychain | MDM profile required to install custom CA on iOS |
| Android | Android certificate store | Varies by Android version; enterprise-managed devices via MDM |
| Linux | System CA store (distro-dependent) | Manual installation or MDM; less automated |

Certificate pinning in mobile and desktop applications bypasses OS trust stores entirely. Applications using certificate pinning will fail SSL inspection regardless of CA installation; they require explicit bypass in ZIA SSL inspection policy or application-level exemption.

---

## SDK and API surface

The ZCC Python SDK (`vendor/zscaler-sdk-python/zscaler/zcc/`) does not include a dedicated SSL inspection service module. SSL-related configuration for ZCC is surfaced through:

- **App Profile / Web Policy** (`web_policy.py` / `models/webpolicy.py`) — platform sub-policies include certificate installation settings
- **ZIA SSL Inspection Policy** (ZIA product, not ZCC) — manages which traffic is decrypted at the cloud

There is no `ssl_inspection` or `certificate_trust` service module in the ZCC SDK. Any SSL-related ZCC configuration that cannot be managed via App Profile must be done through the ZCC Portal admin console.

### Terraform

There is no ZCC Terraform provider in the vendor sources. SSL inspection configuration for ZCC users is managed via:

- ZCC Portal (App Profile settings)
- ZIA Terraform provider (`terraform-provider-zia`) for the ZIA-side SSL inspection policy (`resource_zia_ssl_inspection_rules.go`)

---

## Relationship to ZIA SSL inspection

The full ZIA SSL inspection reference — covering inspection policy rules, bypass categories, certificate management, and the SSL inspection pipeline — is at `references/zia/ssl-inspection.md`. For ZCC-deployed users, the effective SSL inspection behavior is jointly determined by:

1. **ZCC forwarding mode** — whether traffic flows through ZIA Z-Tunnel at all (if the user is on a trusted network with bypass action, ZIA sees none of the traffic)
2. **ZIA SSL inspection policy** (cloud-side) — which destinations are decrypted; managed via ZIA Admin Portal or ZIA API
3. **ZCC certificate trust settings** (agent-side) — whether the Zscaler CA is trusted on the endpoint so that decrypted-and-re-encrypted connections don't generate certificate errors

All three must be aligned for SSL inspection to function without end-user disruption.

---

## Open items

The primary vendor source for ZCC-side SSL inspection configuration (`help.zscaler.com/zscaler-client-connector/configuring-ssl-inspection-zscaler-client-connector`) was unavailable at time of capture. The following are unconfirmed from available sources and require direct portal or vendor documentation review:

- Whether a dedicated "SSL Inspection" configuration page exists in the ZCC Portal separate from App Profile settings
- The exact App Profile fields (with SDK field names) for Zscaler CA auto-installation per platform
- Whether ZCC supports inline SSL inspection (acting as a local proxy) or only defers to ZIA cloud inspection
- Per-app SSL bypass configuration specifics at the ZCC level (vs ZIA policy-level bypass)

---

## Cross-links

- ZIA SSL inspection policy (cloud-side, the primary inspection engine) — `references/zia/ssl-inspection.md`
- ZCC App Profile / Web Policy (certificate trust settings live here) — [`./web-policy.md`](./web-policy.md)
- Forwarding profiles (whether traffic reaches ZIA at all) — [`./forwarding-profile.md`](./forwarding-profile.md) and [`./forwarding-profiles.md`](./forwarding-profiles.md)
- Firefox certificate trust (separate store, separate ZCC integration) — [`./firefox-integration.md`](./firefox-integration.md)
- ZCC install parameters (CA install at enrollment time) — [`./install-parameters.md`](./install-parameters.md)
