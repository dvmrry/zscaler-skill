---
product: zcc
topic: ssl-inspection-zcc
title: "ZCC SSL inspection — agent-side certificate trust and inspection configuration"
content-type: reference
last-verified: "2026-05-01"
confidence: low
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-ssl-inspection-zscaler-client-connector.md"
  - "vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md"
  - "vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py"
  - "vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go"
author-status: draft
---

# ZCC SSL inspection — agent-side certificate trust and inspection configuration

## Source availability note

The primary vendor source (`vendor/zscaler-help/configuring-ssl-inspection-zscaler-client-connector.md`) redirected to an unrelated NSS-servers page during capture (line 8 of the captured file confirms the redirect, with no article content). This document records what is known from adjacent vendor sources — primarily the SDK-level App Profile fields for certificate trust — and clearly marks gaps. **Confidence remains low** for the topic as a whole. Operators needing authoritative detail should consult the ZCC help portal directly at `help.zscaler.com/zscaler-client-connector/configuring-ssl-inspection-zscaler-client-connector`.

What this document *can* answer authoritatively (from SDK sources):

- Per-platform App Profile field for Zscaler CA installation, including the Windows/Linux/macOS/Android/iOS wire-key matrix — see [§ Certificate trust by platform — App Profile fields](#certificate-trust-by-platform).

What it *cannot* answer (genuine gaps):

- Whether a dedicated "SSL Inspection" configuration page exists in the ZCC Portal beyond the App Profile cert-install toggles
- Whether ZCC has any inline SSL inspection capability beyond deferring to ZIA cloud inspection
- Per-app SSL bypass mechanics specific to the ZCC agent (vs the ZIA-policy-level bypass and the Z-Tunnel 2.0 bypass architecture documented at [`./z-tunnel.md`](./z-tunnel.md))

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

Firefox uses its own certificate store and does not automatically trust OS-level CAs. ZCC has a Firefox integration path that installs the Zscaler CA into Firefox's store automatically. From the help capture (`configuring-firefox-integration-zscaler-client-connector.md:26`): *"If you choose not to use Firefox integration for Zscaler Client Connector, then you must manually install the appropriate signing certificates from Firefox."* Disabling Firefox integration shifts cert install to a manual user/IT task. See [`./firefox-integration.md`](./firefox-integration.md).

### Certificate trust by platform

The actual SDK fields for ZCC certificate installation, sourced directly from the App Profile model. **The wire key for the cert-install field is not consistent across platforms, and the Python and Go SDKs disagree on Windows.** Full citations and details in [`./web-policy.md § install_ssl_certs wire-key matrix`](./web-policy.md):

| Platform | Python wire key | Go wire key | Notes |
|---|---|---|---|
| Windows | `install_ssl_certs` (snake_case) — `webpolicy.py:834,892` | `installCerts` (camelCase) — `web_policy.go:206` | **SDK conflict** — Python and Go disagree on the wire format. Verify against a real tenant. |
| Linux | `installCerts` — `webpolicy.py:927,943` | `installCerts` — `web_policy.go:106` | Consistent. |
| macOS | `installCerts` — `webpolicy.py:1098,1132` | `installCerts` — `web_policy.go:120` | Consistent. Python attribute is `install_certs`, not `install_ssl_certs`. |
| Android | `installCerts` — `webpolicy.py:1022,1058` | `installCerts` — `web_policy.go:68` | Consistent. Python attribute is `install_certs`. |
| iOS | **Not present** (`webpolicy.py:951–972`) | **Not present** (`web_policy.go:95–102`) | iOS App Profile has **no SSL-cert-install field at all**. iOS cert distribution is MDM-managed (configuration profile), not ZCC App Profile-managed. |

**Operational implication for iOS deployments**: a tenant deploying ZCC on iOS for the first time and expecting `install_ssl_certs = true` to push the Zscaler root CA will be surprised. iOS cert install must be done via MDM (Intune, Jamf, etc.) — there is no per-App-Profile toggle. This is a common cause of "iOS users see cert errors but Windows users don't" tickets.

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

## Diagnosing "browser shows the original cert, not Zscaler's intermediate"

A common symptom is "the browser shows the destination's original certificate, not the Zscaler intermediate — SSL inspection isn't happening." Three distinct root causes, only one of which is actually a ZCC SSL-inspection misconfiguration:

1. **Traffic is bypassing ZIA entirely** — if the user's Forwarding Profile sends traffic direct on this network type (e.g., `actionType = NONE` on the active branch, see [`./forwarding-profile.md`](./forwarding-profile.md)), or if the destination is in the App Profile's VPN Gateway Bypass / Destination Exclusions list (see [`./z-tunnel.md`](./z-tunnel.md) § Bypass semantics), ZIA never sees the traffic and no inspection happens. **The original cert is correct in this case** — there is no Zscaler interception. Check forwarding-profile actions and bypass lists first, before suspecting SSL config.

2. **QUIC / HTTP3 traffic** — Safari (and Chrome to a lesser extent) uses QUIC over UDP 443 for many destinations. ZIA's forward proxy operates on TCP — **QUIC traffic skips ZIA proxy inspection entirely**, even when the user is on a network that should otherwise tunnel through ZIA. Result: no ZIA logs for the request, original destination cert visible, Cloud App Control / URL Filtering rules don't fire. The lever is `dropQuicTraffic` in PolicyExtension (`webpolicy.py:417`) or a Cloud Firewall rule blocking UDP 443 — see [`./forwarding-profile.md § QUIC / HTTP3 traffic bypasses`](./forwarding-profile.md). **This is increasingly the answer when a "browser-specific" SSL inspection failure is reported** — Safari is the most common trigger because of its aggressive QUIC defaults.

3. **The destination is in ZIA's Do Not Inspect SSL category** — managed in ZIA SSL inspection policy, not ZCC. Banking, healthcare, and certain SaaS categories are commonly in Do-Not-Inspect lists. ZIA still sees and logs the connection (so logs *do* exist, unlike the QUIC case) but doesn't decrypt — original cert is preserved. See `references/zia/ssl-inspection.md`.

Diagnostic flow:

| ZIA logs present? | Original cert visible? | Likely cause |
|---|---|---|
| No | Yes | **Traffic bypassing ZIA** — check Forwarding Profile actions, App Profile bypasses, or QUIC (UDP 443) routing |
| Yes (with TLS handshake details but no decrypt) | Yes | Destination in ZIA Do-Not-Inspect category — by design |
| Yes, with decrypted URL detail | No (Zscaler intermediate visible) | SSL inspection working as intended |
| Yes, with decrypted URL detail | Yes (browser cert error) | Cert install gap — Zscaler CA not in OS/browser trust store; check the per-platform App Profile `install_ssl_certs` (or `installCerts`) field per [§ Certificate trust by platform](#certificate-trust-by-platform) |

The "no logs + original cert" combination is the QUIC bypass case in roughly all observed instances on Safari/macOS. Confirm before suspecting cert config.

---

## Relationship to ZIA SSL inspection

The full ZIA SSL inspection reference — covering inspection policy rules, bypass categories, certificate management, and the SSL inspection pipeline — is at `references/zia/ssl-inspection.md`. For ZCC-deployed users, the effective SSL inspection behavior is jointly determined by:

1. **ZCC forwarding mode** — whether traffic flows through ZIA Z-Tunnel at all (if the user is on a trusted network with bypass action, ZIA sees none of the traffic)
2. **ZIA SSL inspection policy** (cloud-side) — which destinations are decrypted; managed via ZIA Admin Portal or ZIA API
3. **ZCC certificate trust settings** (agent-side) — whether the Zscaler CA is trusted on the endpoint so that decrypted-and-re-encrypted connections don't generate certificate errors

All three must be aligned for SSL inspection to function without end-user disruption.

---

## Open items

The primary vendor source for ZCC-side SSL inspection configuration (`help.zscaler.com/zscaler-client-connector/configuring-ssl-inspection-zscaler-client-connector`) was unavailable at time of capture. The following remain unconfirmed and require direct portal or vendor documentation review (some originally-listed items have since been answered from SDK source — see notes):

- Whether a dedicated "SSL Inspection" configuration page exists in the ZCC Portal separate from App Profile settings — **unanswered**.
- ~~The exact App Profile fields (with SDK field names) for Zscaler CA auto-installation per platform~~ — **answered** in [§ Certificate trust by platform — App Profile fields](#certificate-trust-by-platform) from `webpolicy.py` and `web_policy.go`. Outstanding: which Windows wire-key the API actually accepts (Python emits snake_case `install_ssl_certs`, Go emits camelCase `installCerts`).
- Whether ZCC supports inline SSL inspection (acting as a local proxy) or only defers to ZIA cloud inspection — **unanswered**. ZCC's `redirectWebTraffic` and listening-proxy behavior in Z-Tunnel 2.0 (see [`./z-tunnel.md`](./z-tunnel.md)) operate at the tunnel/forwarding layer; whether they perform any inspection or just forwarding remains undocumented.
- Per-app SSL bypass at the ZCC level (vs ZIA policy-level bypass) — **partially answered**. ZCC App Profile has `bypass_app_ids`, `bypass_custom_app_ids`, `app_identity_names`, `app_service_ids` fields (see [`./web-policy.md § App bypass fields`](./web-policy.md)) that exclude apps from ZCC interception entirely — those apps don't enter the Z-Tunnel and therefore don't reach ZIA inspection. Whether there's a separate "ZCC SSL bypass" mechanism distinct from this app-level bypass is undocumented.
- iOS cert install via MDM — what specific MDM payload type and CA identifier does Zscaler recommend? Not in the captured sources.

---

## Cross-links

- ZIA SSL inspection policy (cloud-side, the primary inspection engine) — `references/zia/ssl-inspection.md`
- ZCC App Profile / Web Policy (certificate trust settings live here) — [`./web-policy.md`](./web-policy.md)
- Forwarding profiles (whether traffic reaches ZIA at all) — [`./forwarding-profile.md`](./forwarding-profile.md) and [`./forwarding-profiles.md`](./forwarding-profiles.md)
- Firefox certificate trust (separate store, separate ZCC integration) — [`./firefox-integration.md`](./firefox-integration.md)
- ZCC install parameters (CA install at enrollment time) — [`./install-parameters.md`](./install-parameters.md)
