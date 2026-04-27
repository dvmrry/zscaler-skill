---
product: zcc
topic: firefox-integration
title: "ZCC Firefox Integration — handling Firefox's independent proxy stack"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md"
  - "references/zcc/web-policy.md"
  - "references/zcc/z-tunnel.md"
  - "references/shared/pac-files.md"
author-status: draft
---

# ZCC Firefox Integration — handling Firefox's independent proxy stack

## Why Firefox requires special handling

Most browsers (Chrome, Edge, Safari) inherit proxy settings from the operating system. When ZCC sets the system proxy — either to a PAC URL or to its local listening proxy — those browsers pick up the change automatically and forward traffic through Zscaler.

Firefox does not follow OS proxy settings by default. Firefox maintains its own proxy configuration store, independent of the OS. On Windows and macOS, Firefox reads proxy settings from its internal preference engine (`network.proxy.*` in `prefs.js`), not from the OS proxy API. This means ZCC's normal "set system proxy" mechanism does not reach Firefox unless Firefox is explicitly configured to use system settings, or ZCC takes a direct action to override Firefox's own proxy store.

Without a Firefox-specific integration step, Firefox traffic:

- Bypasses ZCC's listening proxy entirely in Z-Tunnel 1.0 mode, going direct to the internet
- In Z-Tunnel 2.0 (packet-filter mode), Firefox traffic is still captured at the network layer, but the SSL inspection certificate trust and PAC-based forwarding decisions that depend on proxy settings are affected

This document covers the integration mechanism ZCC uses, per-platform behavior, certificate trust, and known failure modes.

---

## Integration mechanism — enabling Firefox integration in ZCC

The Firefox integration setting is a global toggle in the ZCC portal. It is not a per-forwarding-profile setting, not a per-user group setting, and not an install-time parameter.

**Location in admin console:**

1. Zscaler Client Connector Portal > Administration
2. Left navigation: Client Connector Support
3. Tab: Endpoint Integration
4. Checkbox: Enable Firefox Integration

(Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

**When enabled:**

- ZCC attempts to configure Firefox to use "Use system proxy settings" on macOS and Windows devices. (Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)
- ZCC overrides Firefox proxy settings and prevents the end user from changing them. (Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

**When disabled:**

- ZCC ignores Firefox entirely and does not create or overwrite any Firefox proxy configuration. (Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)
- Proxy settings must be added to Firefox's configuration manually or via an external MDM/GPO mechanism.
- The Zscaler signing certificate must also be installed in Firefox's certificate store manually. (Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

---

## Per-platform behavior

### Windows and macOS

Firefox integration is supported on Windows and macOS. When the toggle is enabled, ZCC sets Firefox to "Use system proxy settings" — which causes Firefox to delegate proxy resolution to the OS, where ZCC's proxy setting is already active.

(Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

### Linux

The vendor doc does not mention Linux. Firefox integration support on Linux is not confirmed from available Zscaler help sources.

See `references/_clarifications-sweep-2026-04.md` under "Deferred — ZCC Firefox integration" for the open question on Linux scope.

### Excluded Firefox variants

The following Firefox variants are explicitly excluded from ZCC Firefox integration support:

- Mozilla Developer Preview (Firefox Nightly-based developer edition distributed by Mozilla)
- Firefox downloaded from the Microsoft Store

(Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

Standard Firefox ESR and standard Firefox release channel on Windows and macOS are implicitly covered by the integration mechanism; the vendor doc does not enumerate differences between ESR and the standard release channel.

---

## Certificate trust

Firefox maintains its own certificate store, separate from the operating system trust store. On Windows and macOS, the OS trust store is used by Chrome, Edge, and Safari — but not by Firefox unless Firefox is specifically configured to trust the enterprise root.

SSL inspection by ZIA requires the Zscaler root CA to be trusted by Firefox. Without it, Firefox users subject to SSL inspection will see MITM-style certificate warnings on inspected HTTPS sites.

**When Firefox integration is disabled:** the Zscaler signing certificate must be manually installed in Firefox's certificate store. (Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

**When Firefox integration is enabled:** ZCC configures Firefox to use system proxy settings. Whether this also causes Firefox to inherit the OS certificate store (via Firefox's `security.enterprise_roots.enabled` preference) is not confirmed from available Zscaler vendor sources. The `security.enterprise_roots.enabled` preference, when set to `true`, causes Firefox to trust certificates in the OS root store — which would include the Zscaler root CA if ZCC's `install_ssl_certs` is enabled on the platform's Web Policy sub-policy.

The `install_ssl_certs` per-platform field on the ZCC Web Policy (App Profile) controls whether ZCC pushes the Zscaler root CA into the OS certificate store. If `install_ssl_certs` is false for the relevant platform, Firefox will not have the Zscaler root CA available even if it is reading from the OS store.

(Tier B — `references/zcc/web-policy.md`, `windowsPolicy`/`macPolicy` `install_ssl_certs` field)

The specific mechanism by which ZCC ensures Firefox's `security.enterprise_roots.enabled` is set — or whether it is set at all as part of the integration — is not confirmed from available Zscaler vendor sources. See the deferred clarification below.

---

## Z-Tunnel mode interaction

### Z-Tunnel 1.0

Z-Tunnel 1.0 is a CONNECT-request-based proxy. It forwards proxy-aware traffic — traffic that is configured to go through a proxy — to the Zscaler Public Service Edge. Traffic that is not proxy-aware goes direct.

Firefox without integration does not use the system proxy and is therefore not proxy-aware in the ZCC context. Firefox traffic bypasses Z-Tunnel 1.0's forwarding path and goes direct to the internet.

With Firefox integration enabled, Firefox routes through ZCC's listening proxy as a proxy client, and its traffic is tunneled to the Service Edge via Z-Tunnel 1.0.

(Tier B — `references/zcc/z-tunnel.md`)

### Z-Tunnel 2.0

Z-Tunnel 2.0 is a packet-filter-level tunnel that captures all IP traffic from the endpoint regardless of proxy awareness. Firefox traffic is captured at the network layer in Z-Tunnel 2.0 deployments even without Firefox integration enabled.

However, packet-level capture does not replace proxy integration for the following functions:

- **Certificate trust**: SSL inspection still requires the Zscaler root CA in Firefox's trust store. Packet capture does not insert the certificate; Firefox will show MITM warnings on inspected traffic if its own cert store does not have the root CA.
- **PAC-based forwarding decisions**: If a PAC URL is configured as the forwarding action, Firefox ignores that PAC unless it is configured to use the system proxy or a specific PAC URL. Z-Tunnel 2.0 in packet-filter mode may carry the traffic regardless, but proxy-level behavior (bypass exceptions, direct routing for specific destinations specified in PAC) may not be honored in Firefox.
- **Acceptable Use Policy (AUP) and authentication**: ZIA authentication flows that depend on the browser communicating through the proxy may behave differently if Firefox is not proxy-aware.

In Z-Tunnel 2.0 deployments, Firefox integration is still relevant for correct certificate trust and consistent policy enforcement even though packet-level capture covers basic traffic forwarding.

(Tier B — `references/zcc/z-tunnel.md`)

---

## PAC file delivery

When ZCC is configured to use a PAC-based forwarding action (rather than Z-Tunnel), or when an enterprise deploys Firefox with a PAC URL explicitly, the PAC URL must reach Firefox through a mechanism that Firefox honors.

The following delivery mechanisms exist for Firefox:

**System proxy delegation (via ZCC Firefox integration):** When Firefox integration is enabled and Firefox is set to "Use system proxy settings," Firefox inherits the system PAC URL if ZCC has configured one at the OS level. This is the ZCC-managed path.

**Firefox enterprise policies (`policies.json`):** Organizations can deploy a `policies.json` file alongside Firefox to enforce proxy settings, including a PAC URL. This is an external mechanism independent of ZCC. `policies.json` is the cross-platform Firefox enterprise policy file supported on Windows, macOS, and Linux.

**Group Policy (Windows only):** On Windows, Firefox respects proxy settings pushed via the Firefox ADMX Group Policy template. This is equivalent in effect to `policies.json` but delivered via the Windows Group Policy framework.

**Manual Firefox configuration:** Users (or administrators via a deployment script) can configure `network.proxy.autoconfig_url` and `network.proxy.type = 2` directly in Firefox preferences. This is the least manageable approach for enterprise deployments.

The PAC URL itself — when Zscaler-hosted — provides per-request geolocation-based PSE selection and server-side variable substitution. A self-hosted copy of the PAC loses these benefits.

(Tier B — `references/shared/pac-files.md` for PAC URL mechanics; `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md` for ZCC's role)

---

## App Profile (Web Policy) configuration

The ZCC Web Policy (App Profile) carries the PAC URL and forwarding profile reference that affect how ZCC forwards traffic once Firefox is proxy-aware. The relevant fields:

| Field | Location in Web Policy | Role |
|---|---|---|
| `pac_url` | Top-level Web Policy | PAC URL ZCC uses for its own forwarding when the forwarding profile action is PAC. Firefox uses this indirectly once integration sets it to follow system proxy. |
| `install_ssl_certs` | `windowsPolicy` / `macPolicy` sub-policy | Controls whether ZCC pushes the Zscaler root CA into the OS certificate store. Required for Firefox to trust inspected traffic if Firefox reads from the OS store. |
| `forwarding_profile_id` | Top-level Web Policy | Links the Web Policy scope to the active Forwarding Profile, which determines whether ZCC uses Z-Tunnel or PAC for forwarding. |

(Tier B — `references/zcc/web-policy.md`)

The Firefox integration toggle itself lives outside the Web Policy object — it is at Administration > Client Connector Support > Endpoint Integration and applies tenant-globally.

(Tier A — `vendor/zscaler-help/configuring-firefox-integration-zscaler-client-connector.md`)

---

## ESR vs standard Firefox

The vendor doc does not distinguish between Firefox Extended Support Release (ESR) and the standard release channel for the purposes of Firefox integration support. Both are implicitly covered by the integration mechanism on Windows and macOS, since ZCC acts on Firefox's proxy preference store without regard to the release channel.

Operationally, ESR and standard Firefox share the same `policies.json` schema and Group Policy template. Enterprises that deploy ESR tend to have longer update cycles, which reduces the risk of a Firefox update resetting proxy preferences but increases the lag before security patches are applied.

ESR-specific integration differences are not confirmed from available Zscaler vendor sources.

---

## Common failure modes

### Firefox not honoring the system proxy

**Symptom:** Firefox traffic bypasses Zscaler even though ZCC is connected and other browsers work.

**Cause:** Firefox integration is disabled, or was disabled and Firefox's proxy setting was not restored to "Use system proxy settings" by a subsequent policy push.

**Resolution:** Enable Firefox integration in the ZCC portal (Administration > Client Connector Support > Endpoint Integration). If Firefox integration cannot be enabled, configure Firefox to use the system proxy via `policies.json` or Group Policy, and install the Zscaler root CA manually.

### Firefox MITM certificate warnings on HTTPS sites

**Symptom:** Firefox shows an `SEC_ERROR_UNKNOWN_ISSUER` or similar certificate error on sites that other browsers reach without errors, specifically sites subject to SSL inspection.

**Cause:** The Zscaler root CA is present in the OS certificate store but not in Firefox's certificate store. This occurs when Firefox does not have `security.enterprise_roots.enabled = true` or the CA has not been manually imported into Firefox.

**Resolution:** Install the Zscaler root CA into Firefox's certificate store via `policies.json` (`Certificates` policy with `ImportEnterpriseRoots: true`), or by manually importing the certificate. Ensuring `install_ssl_certs` is true on the relevant Web Policy platform sub-policy populates the OS trust store, but Firefox reads its own store unless configured otherwise.

### Firefox integration does not apply to unsupported variants

**Symptom:** Firefox installed from the Microsoft Store or Mozilla Developer Preview does not follow proxy settings set by ZCC.

**Cause:** These variants are explicitly unsupported by ZCC Firefox integration.

**Resolution:** Use standard Firefox or Firefox ESR from Mozilla's download site. Enforce via software management policy.

### Firefox auto-update resets proxy preferences

**Symptom:** After a Firefox update, proxy settings revert and Firefox traffic bypasses Zscaler again.

**Cause:** Firefox updates can reset `prefs.js` to defaults, removing any proxy configuration that was not set via an enforced policy mechanism.

**Resolution:** Deliver proxy settings via `policies.json` or Group Policy rather than relying on `prefs.js` edits alone. Enforced settings in `policies.json` survive Firefox updates. ZCC's integration mechanism uses Firefox's preference API; whether this setting persists across major Firefox updates is not confirmed from available vendor sources.

### ESR and standard Firefox version skew

**Symptom:** Firefox integration works on ESR devices but not on devices running the standard release channel, or vice versa.

**Cause:** The Firefox preference API is consistent between ESR and standard channels; version skew is unlikely to cause a difference in integration behavior. If a difference is observed, confirm that the installed Firefox binary is not a Microsoft Store variant on standard-channel devices.

### Firefox snap on Linux is sandboxed

The Firefox snap package on Ubuntu (the default Firefox installation method on Ubuntu 22.04+) runs in a confined sandbox that restricts access to host system resources, including the system PAC file and potentially the OS certificate store. A PAC URL delivered via the OS-level proxy setting may not be accessible to a sandboxed Firefox snap.

This is a Linux-specific operational concern. Since ZCC Firefox integration does not confirm Linux support in available vendor sources, and the snap sandbox complicates system-proxy inheritance, organizations deploying ZCC on Linux with Firefox should validate behavior independently.

---

## Operational gotchas

- **Firefox integration is tenant-global.** There is no mechanism to enable Firefox integration for some user groups and disable it for others within the same ZCC portal instance. The toggle at Endpoint Integration applies to all managed endpoints.

- **Firefox from the Microsoft Store is unsupported.** Organizations that allow users to install apps from the Microsoft Store may find Firefox variants that ZCC does not configure. Software management policies should direct users to the standard Mozilla installer.

- **`policies.json` is cross-platform; Group Policy is Windows-only.** Enterprises managing mixed Windows/macOS fleets who need to enforce Firefox proxy settings outside of ZCC's integration toggle should use `policies.json` on macOS and can use either mechanism on Windows.

- **Firefox auto-update cadence is faster than ESR.** Standard Firefox updates approximately every four weeks. `policies.json`-enforced proxy settings persist through updates; `prefs.js`-only configurations may not.

- **The Endpoint Integration tab also contains other ZCC endpoint settings** (listening port, VPN adapter names, synthetic IP range). A change to the Firefox integration toggle on this tab is a tenant-wide change; confirm scope before toggling in production.

---

## Open clarifications

The following aspects of Firefox integration are not confirmed from available Zscaler vendor sources and are deferred to the clarifications file:

- Whether Firefox integration on Linux is supported at all
- Whether ZCC's integration mechanism sets `security.enterprise_roots.enabled` in Firefox preferences as part of enabling "Use system proxy settings," or whether the certificate trust step requires a separate enterprise policy
- The specific Firefox preference keys ZCC writes when the integration is enabled (i.e., the exact `network.proxy.*` values and how they are delivered — preference file write, `policies.json`, or another mechanism)
- Whether the integration survives Firefox major version upgrades without a ZCC re-push or MDM policy re-application
- Whether Firefox integration behavior differs between ZCC 4.x and earlier releases

See `/Users/dm/src/gh/dvmrry/zscaler-skill/references/_clarifications-sweep-2026-04.md` under "Deferred — ZCC Firefox integration."

---

## Cross-links

- ZCC install-time parameters (no Firefox-specific install parameter confirmed; enrollment and platform behavior) — [`./install-parameters.md`](./install-parameters.md)
- PAC file mechanics — geolocation, variable substitution, self-hosted limitations — [`../shared/pac-files.md`](../shared/pac-files.md)
- Forwarding profile — Z-Tunnel vs PAC action type, `system_proxy` field, `systemProxyData` — [`./forwarding-profile.md`](./forwarding-profile.md)
- Z-Tunnel 1.0 vs 2.0 — bypass architecture, packet-filter capture scope — [`./z-tunnel.md`](./z-tunnel.md)
- Web Policy / App Profile — `pac_url`, `install_ssl_certs`, per-platform sub-policies — [`./web-policy.md`](./web-policy.md)
- ZIA SSL inspection — root CA requirements, HTTP/2 inspection — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
