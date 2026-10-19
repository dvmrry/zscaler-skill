---
product: zcc
topic: "zcc-index"
title: "ZCC reference hub"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
sources: []
author-status: draft
---

# Zscaler Client Connector (ZCC) reference hub

Entry point for Zscaler Client Connector questions — the agent installed on end-user devices that decides **where each packet goes** (to a Public Service Edge for ZIA inspection, to ZPA, to a local PAC, or direct) and how to behave when the cloud is unreachable.

## Why ZCC matters to ZIA/ZPA answers

Almost every ZIA or ZPA answer leans on ZCC implicitly. "User X is blocked" might be a ZIA URL filter decision, or it might be a ZCC forwarding profile that sent the traffic direct instead of to ZIA. "ZPA segment isn't picked up" might be a segment-config problem — or a ZCC forwarding profile that decided this network is Trusted and the user should bypass ZPA entirely. When a question straddles the client / cloud boundary, start here.

## Topics

| Topic | File | Status |
|---|---|---|
| Forwarding profile (wire view) — SDK / wire-format / reasoning: how ZCC decides per-network where to forward traffic (PAC / tunnel / none), ZIA actions vs ZPA actions, integer enum values, fail-open behavior | [`zcc.forwarding-profiles`](kb:zcc.forwarding-profiles) | draft |
| Forwarding profiles (portal view) — portal configuration: network environments (On-/Off-/VPN-/Split-VPN-Trusted), the config sections, and app-profile assignment of a profile to users. Paired portal-view counterpart to `forwarding-profile.md` (wire view) | [`zcc.forwarding-profiles`](kb:zcc.forwarding-profiles) | draft |
| Trusted networks — detection criteria (DNS, SSIDs, DHCP, subnets, etc.) that switch ZCC's active profile branch | [`zcc.trusted-networks`](kb:zcc.trusted-networks) | draft |
| Web policy / App Profiles — on-device policy (PAC URL, per-platform passwords, SSL cert install, DR fallback) and the user↔forwarding-profile assignment link. The policy object that ties users/groups/device-groups to a forwarding profile, `logMode`/`logLevel`/`logFileSize`, DNS/packet-tunnel bypass lists, fail-close settings, and per-service disable passwords. The legacy `WebPolicy` surface and the modern `application_profiles` SDK surface (`client.zcc.application_profiles`, REST `/application-profiles`) both target this object | [`zcc.app-profiles`](kb:zcc.app-profiles) | draft |
| Web privacy — telemetry / log-collection policy (what ZCC reports up, what local users can export) | [`zcc.web-privacy`](kb:zcc.web-privacy) | draft |
| Devices — inventory, states, cleanup, remove vs force-remove, CSV downloads | [`zcc.devices`](kb:zcc.devices) | draft |
| Entitlements — which users/groups are entitled to ZPA and ZDX (`zpa_enable_for_all` trump card, ZDX location dual-toggle) | [`zcc.entitlements`](kb:zcc.entitlements) | draft |
| Z-Tunnel 1.0 vs 2.0 — CONNECT-proxy vs DTLS/TLS packet tunnel, single-IP NAT requirement, GRE-incompatibility, 4-layer bypass architecture | [`zcc.z-tunnel`](kb:zcc.z-tunnel) | draft |
| ZCC API — SDK surface, endpoint prefixes, wire-format keys (camelCase), method summary | [`zcc.api`](kb:zcc.api) | draft |
| **Azure VM deployment** — ZCC inside AVD session hosts / Windows 365 Cloud PCs; multi-session limit; Azure Fabric IP bypass (`168.63.129.16`/`169.254.169.254`); IMDS migration (July 2025); Z-Tunnel 1.0 vs 2.0 RDP semantics; ZCC 4.3.2+ predefined Windows 365/AVD bypass | [`zcc.install.azure-virtual-desktop`](kb:zcc.install.azure-virtual-desktop) | draft |
| **Device posture profiles** — ZCC-side check types, 15-min eval cadence (configurable in 4.4+ Windows), Linux client cert paths, per-OS support matrix, profile assignment to forwarding/access policies | [`zcc.device-posture`](kb:zcc.device-posture) | draft |
| **Install-time parameters** — Windows / macOS / iOS / Android parameter reference; STRICTENFORCEMENT / POLICYTOKEN / MTAUTHREQUIRED / BCP / LWF driver flags; reinstall-required vs runtime-tunable; fail-close lockout gotchas | [`zcc.install`](kb:zcc.install) | draft |
| **macOS install customization** — silent `.pkg` deployment, MDM managed-preferences, plist keys, PPPC/TCC profiles, System Extension pre-approval, System Extension vs kernel extension model, post-install gotchas | [`zcc.install.macos-deployment`](kb:zcc.install.macos-deployment) | draft |
| **Firefox integration** — why Firefox needs separate handling (its own proxy store), enable/disable toggle location, Windows+macOS support, excluded variants (MS Store / Dev Preview), cert-trust gap, Z-Tunnel 1.0 vs 2.0 interaction | [`zcc.firefox.integration`](kb:zcc.firefox.integration) | draft |
| **Acceptable Use Policy** — in-app AUP consent prompt; enable/disable toggle; portal location; per-platform behavior; user interaction flow | [`zcc.acceptable-use`](kb:zcc.acceptable-use) | draft |
| **End-user notifications** — block pages, ZCC in-app alerts, system tray messages; customization options; notification types by trigger | [`zcc.notifications`](kb:zcc.notifications) | draft |
| **User logging controls** — what end users can see and suppress in ZCC client logs; log export; privacy toggle interaction | [`zcc.logging.user-access`](kb:zcc.logging.user-access) | draft |
| **Support options** — built-in diagnostics, feedback submission, self-service controls available to end users; Send Feedback log packaging | [`zcc.support-options`](kb:zcc.support-options) | draft |
| **Troubleshooting** — error codes, common failure modes (tunnel down, enrollment failure, proxy bypass), diagnostic workflow | [`zcc.troubleshooting`](kb:zcc.troubleshooting) | draft |
| **ZCC SDK** — Python and Go service catalog (`client.zcc.*`); method summary; legacy vs OneAPI auth paths; rate-limit client behavior | [`zcc.sdk-python`](kb:zcc.sdk-python) | draft |
| **ZCC Terraform provider** — resource/data-source catalog for `terraform-provider-zcc`; OneAPI-only auth; automation coverage boundaries | [`zcc.terraform`](kb:zcc.terraform) | draft |
| **API rate limits** — 100 calls/hour general cap, 3 calls/day download endpoints, `X-Rate-Limit-*` headers, retry semantics, bulk UDID batching, pagination discipline | [`zcc.api.rate-limits`](kb:zcc.api.rate-limits) | draft |
| **API schemas** — full ZCC REST endpoint catalog with request/response shapes derived from the SDK | [`zcc.api`](kb:zcc.api) | draft |
| **API source divergences** — where the Go and Python SDKs disagree on field types, wire-key casing (incl. the per-platform `install_ssl_certs`/`installCerts` trap), GET-vs-POST type asymmetry, empty-body Python writes, the non-uniform `/edit` HTTP method, and the three Go-only `/v2` services (`notification_template`, `zia_posture`, `trusted_network_v2`); which source to trust per field | [`zcc.api`](kb:zcc.api) | draft |
| **SSL inspection (ZCC)** — client-side SSL trust / inspection behavior, certificate handling on the device | [`zcc.ssl-inspection`](kb:zcc.ssl-inspection) | draft |
| **getOtp bundle** — per-device one-time passcodes (logout/exit/uninstall/revert + per-service disable OTPs) keyed by UDID | [`zcc.passwords-and-otp.otp`](kb:zcc.passwords-and-otp.otp) | draft |

## What this hub does NOT cover yet

- **Admin users / roles / secrets.** ZCC portal admin surface (`client.zcc.admin_user`, `client.zcc.secrets`, `client.zcc.company`). Rarely relevant to policy-reasoning questions.
- **Captive portal detection deep-dive.** Covered at feature-surface level in [`zcc.forwarding-profiles`](kb:zcc.forwarding-profiles); the exact detection heuristics (which HTTP probes ZCC uses, timing of state transitions) are not in the SDK or this doc set.
- **Z-Tunnel wire-format protocol internals.** `kb:zcc.z-tunnel` covers the customer-facing architecture (CONNECT vs DTLS/TLS, packet-level coverage, bypass semantics, deployment best practices). The lower-level framing, keepalive, and session-resumption mechanics remain undocumented customer-facing — Zscaler Support / SE engagement territory.

## When the question spans ZCC + another product

- **"Why didn't ZIA see this traffic?"** — start here (`forwarding-profile.md`), then `kb:zia.ssl-inspection` or `url-filtering.md`.
- **"Why didn't ZPA match this app?"** — start at `kb:zpa.app-segments` (client-side segment matching happens in ZCC, but the segment *config* is the primary question). Cross to `forwarding-profile.md` only if the profile's Trusted-Network evaluation is suspect.
- **"Traffic goes direct instead of through Zscaler"** — this is almost always a ZCC forwarding-profile issue (`action_type: NONE` on the active network-type branch, or a permissive TrustedNetwork match). Start here.

## Open questions

- **Captive-portal grace as an App Profile setting.** Captive-portal handling is exposed on the `WebPolicy`/company surface (`captivePortalConfig` — `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:850`) and on the Fail-Open policy (`enable_captive_portal_detection`, `captive_portal_web_sec_disable_minutes` — `vendor/zscaler-sdk-python/zscaler/zcc/fail_open_policy.py:108-109`), not on the `ApplicationProfile` model. Whether the modern `/application-profiles` object carries an equivalent captive-portal grace field is not established in the SDK source; the App Profiles topic row deliberately does not claim it.
