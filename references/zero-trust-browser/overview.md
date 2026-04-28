---
product: zero-trust-browser
topic: overview
title: "Zero Trust Browser — remote browser isolation (formerly Zscaler Isolation)"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/what-is-zero-trust-browser.md"
  - "vendor/zscaler-help/ztb-turbo-mode-isolation.md"
author-status: draft
---

# Zero Trust Browser — remote browser isolation (formerly Zscaler Isolation)

## What it is

Zero Trust Browser (ZTB, formerly Zscaler Isolation) provides remote browser isolation (RBI) — loading accessed web pages on a remote, ephemeral browser in a Zscaler data center and streaming the rendered content to the user's native browser. Active web content (HTML, CSS, JavaScript) never reaches the user's machine or corporate network, creating an air gap between the user and potentially harmful web content (Tier A — vendor/zscaler-help/what-is-zero-trust-browser.md).

The product is fully integrated with ZIA (Internet & SaaS) and ZPA (Private Access), allowing granular policy-based isolation of specific web traffic.

## Three primary components

| Component | Purpose |
|---|---|
| **Browser extension** | Handles web-based security and access; enables the isolation session in the user's local browser |
| **Lightweight agent (Zero Trust Client Browser)** | Enforces device posture controls and advanced data protection during the isolation session |
| **Cloud browser** | Remote Chromium-based browser running in a Zscaler data center; accesses the actual web content |

## Traffic flow

1. Internet-bound traffic from the user forwarded to ZIA Public Service Edge via GRE tunnel, ZCC, or other Zscaler-recommended forwarding method
2. If the URL matches a URL Filtering policy configured to isolate traffic, the HTTP/S request is redirected to the isolation profile URL with the original URL in the query string
3. User's browser follows the redirect to the isolation profile URL
4. Zero Trust Browser assigns a temporary, remote browser container (endpoint container) to the user
5. Remote browser connects to the original URL — this request also routes through ZIA Public Service Edge for full policy inspection
6. Rendered page content is streamed to the user's native browser

**Key property**: The remote browser's request to the actual web page also passes through ZIA, so all ZIA security policies apply to the actual web traffic. Isolation adds an air gap on top of standard ZIA inspection (Tier A — vendor/zscaler-help/what-is-zero-trust-browser.md).

## Isolation profiles

Admins create isolation profiles in the Zscaler Admin Console. Profiles define data exfiltration controls and rendering options for isolated sessions.

- **Default isolation profiles**: Automatically created for all organizations with Zero Trust Browser. Separate defaults for ZIA and ZPA.
- **ZIA isolation profiles**: Applied when ZIA URL filtering policy triggers isolation.
- **ZPA isolation profiles**: Applied when ZPA policy sends private app traffic through isolation.

### Configurable controls within profiles

Isolation profiles control the level of interaction users can have with isolated pages:
- Clipboard access (read/write/none)
- File upload/download
- Printing
- Cookie persistence
- Rendering mode (pixel streaming vs. Turbo Mode)
- Read-only mode
- Banner notifications (customizable per profile)

## Turbo Mode

Turbo Mode is an alternative rendering method to pixel streaming. Instead of streaming images/pixels, it transfers rendered instructions from the isolated browser to the local browser as an instruction set, then renders natively (Tier A — vendor/zscaler-help/ztb-turbo-mode-isolation.md).

**Benefits:**
- Up to 50 frames per second rendering
- Much less bandwidth intensive than pixel streaming
- Caching of rendering instructions — faster scrolling with minimal additional data
- Near-native browsing experience

**Requirements:**
- Hardware acceleration enabled on user's device
- WebGL and WebGL2 support
- Not supported on Internet Explorer 11

**Security**: No compromise to security — web content still processed in isolation containers. Only rendered output appears in user's browser. No code executes locally.

Turbo Mode must be enabled in the isolation profile by an admin.

## Container lifecycle

- Each user gets a dedicated endpoint container
- All subsequent requests to that isolation profile use the same container (session persistence)
- Container destroyed on: manual user logout from isolation session, or default 10-minute idle timeout

## ZIA integration

ZIA URL filtering policy is the primary trigger for isolation. Admins configure a URL category or custom URL list to use an isolation profile instead of standard allow/block.

Common use cases for ZIA-triggered isolation:
- Uncategorized or risky websites
- Miscellaneous/Unknown categories
- Specific high-risk categories (e.g., newly registered domains)
- BYOD user policies

## ZPA integration

ZPA can send private app traffic through isolation. This provides browser-based access to internal web apps from unmanaged devices without exposing the apps to the device:
- ZPA forwards traffic to ZIA isolation
- User accesses private apps in an isolated session
- No private app content reaches the unmanaged device directly

Use case: secure SaaS and internal app access from unmanaged devices without requiring ZCC enrollment.

## Additional features

- **Sandbox integration**: Isolated file downloads can be sent to Zscaler Sandbox for malware analysis before delivery
- **Votiro integration**: Third-party content disarm and reconstruction (CDR) integration for file handling in isolation
- **Root certificates**: Separate root cert management for ZIA isolation and ZPA isolation
- **Multiple sessions**: Users can access multiple isolated sessions simultaneously
- **Language translation**: Translation of isolated web content
- **Debug mode**: Admin troubleshooting capability
- **Mobile support**: Isolation experience on mobile devices
- **Persistent state**: Configurable session state persistence across isolation sessions

## API surface

No dedicated Zero Trust Browser REST API was found in available sources. Configuration is via the Zscaler Admin Console. ZIA API includes URL filtering policy configuration which can reference isolation profiles (indirect API access). Treat as primarily portal-managed for isolation-specific configuration.

## Key operational notes

- Zero Trust Browser requires a separate SKU/license; it does not come with base ZIA.
- The isolation profile URL is a publicly routable URL managed by Zscaler; DNS resolution of this URL must not be blocked.
- Isolation adds latency relative to direct browsing — Turbo Mode significantly reduces this latency vs. pixel streaming.
- The air-gap is a prevention control, not a detection control. Users browsing in isolation cannot exfiltrate data through the browser session without explicit profile controls permitting it.

## What Zero Trust Browser is not

- Not a VPN. Traffic still routes through ZIA for inspection.
- Not a virtual desktop (VDI). Only the browser session is isolated; the local device OS and applications are unchanged.
- Not a clientless VPN replacement. While ZPA isolation enables private app access from unmanaged devices, ZPA itself is still required.

## Cross-links

- ZIA URL filtering (primary isolation trigger): [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA (private app isolation use case): [`../zpa/index.md`](../zpa/index.md)
- Zscaler Sandbox (file analysis integration): [`../zia/sandbox.md`](../zia/sandbox.md)
- Portfolio map: [`../_portfolio-map.md`](../_portfolio-map.md)
