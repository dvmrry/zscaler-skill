---
product: zcc
topic: "zcc-index"
title: "ZCC reference hub"
content-type: reference
last-verified: "2026-04-24"
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
| Forwarding profile — how ZCC decides per-network where to forward traffic (PAC / tunnel / none), ZIA actions vs ZPA actions, fail-open behavior | [`./forwarding-profile.md`](./forwarding-profile.md) | draft |
| Trusted networks — detection criteria (DNS, SSIDs, DHCP, subnets, etc.) that switch ZCC's active profile branch | [`./trusted-networks.md`](./trusted-networks.md) | draft |
| Web policy — on-device policy (PAC URL, per-platform passwords, SSL cert install, DR fallback) and the user↔forwarding-profile assignment link | [`./web-policy.md`](./web-policy.md) | draft |
| Web privacy — telemetry / log-collection policy (what ZCC reports up, what local users can export) | [`./web-privacy.md`](./web-privacy.md) | draft |
| Devices — inventory, states, cleanup, remove vs force-remove, CSV downloads | [`./devices.md`](./devices.md) | draft |
| Entitlements — which users/groups are entitled to ZPA and ZDX (`zpa_enable_for_all` trump card, ZDX location dual-toggle) | [`./entitlements.md`](./entitlements.md) | draft |
| Z-Tunnel 1.0 vs 2.0 — CONNECT-proxy vs DTLS/TLS packet tunnel, single-IP NAT requirement, GRE-incompatibility, 4-layer bypass architecture | [`./z-tunnel.md`](./z-tunnel.md) | draft |
| ZCC API — SDK surface, endpoint prefixes, wire-format keys (camelCase), method summary | [`./api.md`](./api.md) | draft |
| **Snapshot schema** — what's in `snapshot/zcc/*.json`, mixed-case WebPolicy quirks, CSV-in-string fields, integer-coded enums (`zcc-01` through `zcc-06` territory), common jq queries | [`./snapshot-schema.md`](./snapshot-schema.md) | draft |
| **Azure VM deployment** — ZCC inside AVD session hosts / Windows 365 Cloud PCs; multi-session limit; Azure Fabric IP bypass (`168.63.129.16`/`169.254.169.254`); IMDS migration (July 2025); Z-Tunnel 1.0 vs 2.0 RDP semantics; ZCC 4.3.2+ predefined Windows 365/AVD bypass | [`./azure-vm-deployment.md`](./azure-vm-deployment.md) | draft |
| **Device posture profiles** — ZCC-side check types, 15-min eval cadence (configurable in 4.4+ Windows), Linux client cert paths, per-OS support matrix, profile assignment to forwarding/access policies | [`./device-posture.md`](./device-posture.md) | draft |
| **Install-time parameters** — Windows / macOS / iOS / Android parameter reference; STRICTENFORCEMENT / POLICYTOKEN / MTAUTHREQUIRED / BCP / LWF driver flags; reinstall-required vs runtime-tunable; fail-close lockout gotchas | [`./install-parameters.md`](./install-parameters.md) | draft |
| **macOS install customization** — silent `.pkg` deployment, MDM managed-preferences, plist keys, PPPC/TCC profiles, System Extension pre-approval, System Extension vs kernel extension model, post-install gotchas | [`./macos-install-customization.md`](./macos-install-customization.md) | draft |
| **Firefox integration** — why Firefox needs separate handling (its own proxy store), enable/disable toggle location, Windows+macOS support, excluded variants (MS Store / Dev Preview), cert-trust gap, Z-Tunnel 1.0 vs 2.0 interaction | [`./firefox-integration.md`](./firefox-integration.md) | draft |
| **Acceptable Use Policy** — in-app AUP consent prompt; enable/disable toggle; portal location; per-platform behavior; user interaction flow | [`./acceptable-use-policy.md`](./acceptable-use-policy.md) | draft |
| **End-user notifications** — block pages, ZCC in-app alerts, system tray messages; customization options; notification types by trigger | [`./end-user-notifications.md`](./end-user-notifications.md) | draft |
| **User logging controls** — what end users can see and suppress in ZCC client logs; log export; privacy toggle interaction | [`./user-logging-controls.md`](./user-logging-controls.md) | draft |
| **Support options** — built-in diagnostics, feedback submission, self-service controls available to end users; Send Feedback log packaging | [`./support-options.md`](./support-options.md) | draft |
| **Troubleshooting** — error codes, common failure modes (tunnel down, enrollment failure, proxy bypass), diagnostic workflow | [`./troubleshooting.md`](./troubleshooting.md) | draft |
| **ZCC SDK** — Python and Go service catalog (`client.zcc.*`); method summary; legacy vs OneAPI auth paths; rate-limit client behavior | [`./sdk.md`](./sdk.md) | draft |
| **API rate limits** — 100 calls/hour general cap, 3 calls/day download endpoints, `X-Rate-Limit-*` headers, retry semantics, bulk UDID batching, pagination discipline | [`./api-rate-limits.md`](./api-rate-limits.md) | draft |
| **API schemas** — full ZCC REST endpoint catalog with request/response shapes derived from the SDK | [`./api-schemas.md`](./api-schemas.md) | draft |
| **SSL inspection (ZCC)** — client-side SSL trust / inspection behavior, certificate handling on the device | [`./ssl-inspection-zcc.md`](./ssl-inspection-zcc.md) | draft |

## What this hub does NOT cover yet

- **Admin users / roles / secrets.** ZCC portal admin surface (`client.zcc.admin_user`, `client.zcc.secrets`, `client.zcc.company`). Rarely relevant to policy-reasoning questions.
- **Captive portal detection deep-dive.** Covered at feature-surface level in [`./forwarding-profile.md § Fail-open and captive portal`](./forwarding-profile.md); the exact detection heuristics (which HTTP probes ZCC uses, timing of state transitions) are not in the SDK or this doc set.
- **Z-Tunnel wire-format protocol internals.** `references/zcc/z-tunnel.md` covers the customer-facing architecture (CONNECT vs DTLS/TLS, packet-level coverage, bypass semantics, deployment best practices). The lower-level framing, keepalive, and session-resumption mechanics remain undocumented customer-facing — Zscaler Support / SE engagement territory.

## When the question spans ZCC + another product

- **"Why didn't ZIA see this traffic?"** — start here (`forwarding-profile.md`), then `references/zia/ssl-inspection.md` or `url-filtering.md`.
- **"Why didn't ZPA match this app?"** — start at `references/zpa/app-segments.md` (client-side segment matching happens in ZCC, but the segment *config* is the primary question). Cross to `forwarding-profile.md` only if the profile's Trusted-Network evaluation is suspect.
- **"Traffic goes direct instead of through Zscaler"** — this is almost always a ZCC forwarding-profile issue (`action_type: NONE` on the active network-type branch, or a permissive TrustedNetwork match). Start here.
