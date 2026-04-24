# What Is Zscaler Client Connector?

**Source:** https://help.zscaler.com/zscaler-client-connector/what-is-zscaler-client-connector
**Captured:** 2026-04-23 via Playwright MCP.

---

Zscaler Client Connector Help — What Is Zscaler Client Connector?

## Products Supported

A single-agent endpoint app that supports:

- **Internet & SaaS (ZIA)** — web traffic forwarding + policy enforcement, on- or off-network.
- **Private Access (ZPA)** — secure tunnel to enterprise internal apps.
- **Zscaler Digital Experience (ZDX)** — synthetic probing to SaaS/internet apps.
- **Endpoint DLP** — monitors endpoint activities (printing, removable storage, network-share saves, personal cloud uploads).

## Core Architecture

On **PC (Windows/macOS):** installs a **Zscaler Network Adapter** that captures web traffic at the OS level. Traffic flows through Client Connector to the Public Service Edge.

On **mobile (Android/iOS/Android on ChromeOS):** establishes a local VPN that captures application traffic and routes it through Client Connector.

For **Android specifically:** Client Connector establishes a **proprietary, secure HTTP-tunnel-based VPN** to forward mobile traffic. Uses **Samsung SAFE KNOX APIs** for enforceability on Samsung devices. (On non-Samsung Android, users may be able to turn off the VPN.)

On **PC:** when user connects to the web, the network adapter captures web traffic. ZCC then:
1. Uses **geolocation** to locate the nearest **Public Service Edge for Internet & SaaS**.
2. Establishes a lightweight tunnel called the **Z-Tunnel** to that Public Service Edge.
3. Forwards user web traffic through the tunnel.

## Service Edge Selection and Re-evaluation

ZCC regularly checks whether the current Public Service Edge is still optimal. Triggers:

- Regular intervals (unspecified duration)
- Network change (e.g., user moves Wi-Fi)
- App or device restart

**Override options:**

- Specify particular Public Service Edges to tunnel to (required if using Private Service Edges or Virtual Service Edges).
- **Multi-destination routing** (ZCC 1.4+): route traffic for certain domains to one Service Edge, rest to the nearest Public Service Edge.
- PAC file: custom routing rules, including bypass domains (e.g., identity-federation URLs).
- PAC file is saved locally so it remains accessible during internet outages — allows continued access to internal resources.

**Browser proxy override**: by default, Client Connector overrides any user-configured browser proxy settings so users can't manipulate traffic routing. Configurable per app profile.

**IP conflict handling**: Zscaler uses `100.64.0.0/16` for tunneling by default. If a conflict is detected, Zscaler shifts to `100.65.0.0/16`, and can range up to `100.83.0.0/16`.

## Authentication

- Supports all auth mechanisms supported by the Zscaler service, **except Kerberos**.
- SAML with 2FA supported.
- **ZPA requires SAML authentication.**

## Enforcement Controls

- App profile can enforce: users cannot log out, disable, or uninstall Client Connector without an admin-provided password.
- **Trusted Network Detection** — can detect corporate network connection; when true, can disable the app's internet security service so user traffic flows through the network's own traffic forwarding (e.g., corporate GRE tunnel).
- **Captive Portal Detection** — detects captive-portal networks (airports, hotels); can disable service for a configured period, then auto-re-enable.

## SSL Inspection

- ZCC **auto-installs the Zscaler SSL certificate** during enrollment.
- SSL inspection is then available for web traffic forwarded by the app.
- **ZIA only — Private Access does not support SSL inspection.**
- Mobile SSL inspection requires explicit enablement in the ZIA Admin Portal.

## Update Model

- Auto-update to latest release (opt-in).
- Alternative: admin-controlled push from the Admin Console after testing.
- Client checks for updates at regular intervals, on log-out/log-back-in, and on device restart.

## Deployment

- Windows/macOS: silent deploy via normal software distribution.
- Android / Android on ChromeOS / iOS: via MDM.
- User login enrolls the device with the Zscaler service; app downloads its administration settings + app profile.
- App checks for admin setting / profile updates regularly.

## Admin Console Visibility

- Dashboard: license usage, device models, platforms, OS, devices on outdated app versions.
- Device fingerprint information per enrolled device.
- In-app support: users can send email to internal support or open tickets to Zscaler Support directly from the app.
