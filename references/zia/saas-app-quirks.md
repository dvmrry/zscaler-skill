---
product: zia
topic: "saas-app-quirks"
title: "SaaS app + browser quirks — root-cause catalog"
content-type: reasoning
last-verified: "2026-04-25"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/ZIA_SSL_Inspection_Leading_Practices_Guide.txt"
  - "vendor/zscaler-help/Best_Practices_for_Testing_and_Rolling_Out_SSL_TLS_Inspection.txt"
  - "vendor/zscaler-help/SSL_Inspection_Deployment_and_Operations_Guide.txt"
  - "vendor/zscaler-help/about-tenant-profiles.md"
  - "vendor/zscaler-help/adding-tenant-profiles.md"
  - "vendor/zscaler-help/configuring-source-ip-anchoring.md"
  - "https://duo.com/docs/duo-desktop"
  - "https://help.duo.com/s/article/9585"
  - "https://learn.microsoft.com/en-us/microsoft-365/enterprise/microsoft-365-network-connectivity-principles"
author-status: draft
---

# SaaS app + browser quirks — root-cause catalog

Operator-facing catalog of SaaS-app and browser interactions with Zscaler. Organized by **root cause** rather than per-app — most quirks reduce to a small set of patterns, and recognizing the pattern is more useful than memorizing per-app workarounds. Cross-links into the canonical mechanism docs throughout.

Per-app sensitivities drift fast (vendor SDK versions, OS updates, app rewrites). What's documented here are the patterns that hold; the apps named are Tier-A examples Zscaler has explicitly cited.

## 1. Certificate pinning — bypass-or-deny

Pinned apps reject Zscaler's intercept cert. Two flavors:

**Leaf / key pinning** — application has the expected server cert hard-coded. Zscaler-cited examples (*Leading Practices Guide*, p.22):
- Most iOS / Android apps
- Adobe Creative Cloud desktop apps
- Cisco WebEx app (the desktop client)
- Dropbox desktop app
- "Many Microsoft 365 components"

**CA-bundle pinning** — application embeds a trusted-CA list and ignores the OS trust store. Zscaler's intercept CA isn't in the bundle, so handshake fails:
- **Duo Desktop / Duo Mobile / Duo Authentication Proxy** — Duo states explicitly: "Proxy connections that perform HTTPS inspection or filtering from endpoints are not supported." (`duo.com/docs/duo-desktop`; Duo KB 9585.) No deployment workaround — must bypass at the network or SSL layer.

**The decision tree per pinned app** (*Leading Practices Guide*, p.22):
1. Is it business-critical? If no → deny.
2. If yes → bypass via custom URL category (NOT a wildcard CDN bypass — see § 5).
3. Replacement-app option: replace with a non-pinned alternative if one exists.

For full mechanics + how to scope the bypass narrowly, see [`./ssl-inspection.md § What can't be inspected`](./ssl-inspection.md).

## 2. Custom truststores — developer toolchains and Firefox

OS-level CA install isn't enough for applications that bring their own trust bundle. The full per-toolchain catalog (Python/npm/git/Java/Docker/Firefox/ChromeOS) lives in [`./ssl-inspection.md § Trust store deployment`](./ssl-inspection.md). Operator-relevant takeaway: **engineering teams will hit this consistently** when ZCC + SSL inspection lands. Pre-stage the per-tool config (env vars, keystore imports, `~/.npmrc` settings) as part of the rollout.

## 3. Auth-bypass requirements — IdP and MFA endpoints

Some auth flows require post-decrypt access for tenant-restriction or MFA validation; others **must not be inspected** because the auth surface pins or has its own truststore. The split matters:

**Inspect** (post-decrypt access needed for tenant restriction / DLP):
- **Microsoft login services** — `login.microsoftonline.com`, `login.windows.net`, `login.live.com` (for personal-MSA blocking via Tenant Profile). The SSL Inspection rule scoping these must beat the M365 One-Click bypass rule in order, otherwise tenant restriction silently stops working. See [`./tenant-profiles.md`](./tenant-profiles.md).
- **Webex Login Services** — same pattern; `WEBEX_LOGIN_SERVICES` is a supported `app_type` for Tenant Profiles. (`vendor/zscaler-help/adding-tenant-profiles.md`.)

**Bypass SSL inspection** (cert pinning / CA bundle pinning / auth-flow breakage):
- **Duo endpoints** — `*.duosecurity.com`, `*.duo.com` plus `*.azureauth.duosecurity.com` for the Entra External MFA flow. CA-bundle pinning means inspection breaks the TLS channel before any auth happens. (`duo.com/docs/duo-desktop`.)
- **Microsoft 365 Click-to-Run** — Zscaler's own predefined SSL rule uses `Do Not Inspect + Bypass Other Policies`. The only predefined rule using that more-dangerous variant. (*Leading Practices Guide*, p.10; [`./ssl-inspection.md`](./ssl-inspection.md).)

**Rule-order trap** — if an SSL bypass rule for an IdP fires before the rule that needs to inspect that IdP for tenant restriction, tenant restriction silently stops working. Header-injection requires post-decrypt access; bypass = no inspection = no header. Always order the **specific tenant-restriction rule above** the broad bypass. See [`./tenant-profiles.md`](./tenant-profiles.md).

**Auth Exemptions list** — separate from SSL bypass. The ZIA Authentication Policy maintains its own URL exempt list (up to 25,000 entries) for destinations that should skip the auth challenge entirely. Common entries: `login.windows.net`, `login.microsoftonline.com`, OS update endpoints, captive-portal probes. See [`./authentication.md`](./authentication.md).

## 4. Source IP and Conditional Access — the SIPA dependency

When Microsoft Entra (or any IdP) enforces **named-location** Conditional Access — "only allow sign-ins from corporate IP ranges" — ZIA's shared Public Service Edge IPs fail the location check. Operators see CA blocks against M365 / SaaS apps from authenticated users.

**Two paths exist** (paths documented at `help.zscaler.com/zia/source-ip-anchoring-configuration-guide-microsoft-365-conditional-access`):

| Approach | Trade-off |
|---|---|
| **Add Zscaler PSE IPs to Entra named-location trusted list** | Simple. Trusts all tenants sharing those PSEs — weaker isolation. |
| **Source IP Anchoring (SIPA)** | Routes the last hop through a customer-deployed ZPA App Connector with a customer-controlled IP. Entra sees the App Connector IP. Requires both ZIA and ZPA configuration. |

See [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) for the SIPA mechanism. The same pattern applies to any SaaS that does IP-based location trust, not just Microsoft.

## 5. CDN wildcard bypass — anti-pattern

Any operator instinct to write `*.s3.amazonaws.com`, `*.blob.core.windows.net`, `*.cloudfront.net`, or `*.googleusercontent.com` as a bypass rule is wrong. The shared-tenant nature of these CDNs means the bypass becomes an allowlisted exfiltration channel for any subdomain holder. Detail and Zscaler's explicit guidance: [`./ssl-inspection.md § Bypass rule hygiene — anti-patterns`](./ssl-inspection.md).

Specific S3 buckets / Blob containers / CloudFront distributions can be bypassed by exact subdomain (`mybucket.s3.amazonaws.com`); never the parent.

## 6. QUIC / HTTP/3 — bypasses inspection by design

Browsers prefer QUIC (UDP) for any HTTPS destination. ZIA's TLS inspection relies on TCP session state — under explicit-proxy forwarding, QUIC bypasses the proxy entirely. (*Leading Practices Guide*, p.24; *CAC Deployment & Operations Guide* troubleshooting section.)

**Z-Tunnel mode interaction:**
- **Z-Tunnel 2.0** (packet-tunnel) captures UDP 443 — QUIC is intercepted at the tunnel layer
- **Z-Tunnel 1.0** (HTTP CONNECT) does not capture UDP — QUIC traffic egresses outside the tunnel

**Zscaler's recommendation**: block QUIC at the firewall. Browsers fall back to TCP/TLS, which can then be inspected. (*Leading Practices Guide*, p.24.)

The canonical case where this matters: **WebEx media** (UDP 9000 SRTP, fallback TCP 443) and **Microsoft Teams** call quality. If Z-Tunnel 2.0 captures the media flow, voice/video degrades. Process-based bypass of the conferencing client is the documented pattern.

## 7. Tenant restriction silently breaks — composite failure

The most-misconfigured pattern across all of these. Reproducible failure mode:

1. Operator enables Tenant Profiles for M365 to block personal Microsoft accounts (`restrict_personal_o365_domains = true`).
2. Operator enables M365 One-Click in ZIA Advanced Settings (or relies on the predefined Click-to-Run bypass) to "make M365 work fast."
3. The One-Click bypass fires before the tenant-restriction SSL inspection rule.
4. SSL bypass = no decrypt = no header injection (`Restrict-Access-To-Tenants`).
5. Tenant restriction is silently disabled. Personal accounts work fine. Detection requires looking at log evidence, not console state.

**Mitigation**: explicit SSL Inspection rule for **Microsoft Login Services** (Cloud App criterion, not domain wildcard), **ordered above** the M365 One-Click bypass. The same shape applies to Google Workspace and Webex Login Services tenant restriction. See [`./tenant-profiles.md`](./tenant-profiles.md).

**Microsoft v1/v2 protocol mismatch** is a separate documented failure mode for the same feature (`ms_login_services_tr_v2` flag). See same doc.

## What this doc does NOT cover

- **Specific subdomain lists for bypass** (e.g., the full WebEx domain catalog, Slack domains) — these drift; not authored at high confidence without vendored sources
- **Apple APNs specifics** beyond the generic "iOS/Android pin" framing — vendored Tier A only names the class, not specific Apple service domains
- **Mobile banking / anti-virus update channels / backup software** — no Zscaler-authored guidance found
- **Per-vendor MDM deployment steps** — Microsoft / Apple / Jamf territory, not Zscaler's
- **Slack desktop client cert pinning specifics** — the Zscaler-Slack Deployment Guide exists but wasn't directly captured
- **Entra Conditional Access SAML POST inspection mechanics** — the symptoms are well-known but the exact failure mode in TLS layer vs application layer isn't sourced

When a question lands about one of these, the right move is to point at the underlying root cause (cert pinning / CA-bundle pinning / source-IP / etc.) and recommend bypass via Cloud App or specific subdomain rather than authoring app-specific deep-dives.

## Cross-links

- SSL trust mechanics + bypass-rule hygiene: [`./ssl-inspection.md`](./ssl-inspection.md)
- Tenant Profile mechanics (CAC tenant restriction): [`./tenant-profiles.md`](./tenant-profiles.md)
- Authentication Policy + auth exemption list: [`./authentication.md`](./authentication.md)
- Source IP Anchoring (SIPA) for Conditional Access: [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
- Z-Tunnel mode + QUIC interaction: [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- Cloud App Control mechanics: [`./cloud-app-control.md`](./cloud-app-control.md)
