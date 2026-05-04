---
product: zbi
topic: "zbi-overview"
title: "ZBI overview — architecture, traffic flow, rendering modes"
content-type: reasoning
last-verified: "2026-05-04"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zero-trust-browser/what-is-zero-trust-browser"
  - "vendor/zscaler-help/what-is-zero-trust-browser.md"
  - "https://help.zscaler.com/zero-trust-browser/understanding-turbo-mode-isolation"
  - "vendor/zscaler-help/understanding-turbo-mode-isolation.md"
author-status: draft
---

# ZBI overview — architecture, traffic flow, rendering modes

What ZBI actually does: render a web page on a Zscaler-hosted browser instance, then stream the rendering to the user's local browser. The user interacts with pixels (or with remotely-generated rendering instructions in Turbo Mode); the real HTML, CSS, and JavaScript never reach the endpoint.

## Summary

**The isolation container is ephemeral and cloud-resident.** Each user gets an endpoint container allocated at first isolation request; subsequent requests in the same session reuse it; the container is destroyed when the user logs out manually or after **10 minutes of idle time**.

**Traffic passes through Zscaler Public Service Edges twice** on the way to the destination:

1. User's browser → PSE → (URL Filter detects rule with `Isolate` action) → redirect to isolation profile URL with original URL in query string
2. User's browser follows the redirect → isolation profile URL → ephemeral cloud browser container
3. Cloud browser → PSE (second traversal!) → destination web page
4. Cloud browser renders page → ZBI experience engine streams pixels (or Turbo Mode instructions) → user's browser

Because the cloud browser's egress traffic hits a PSE too, **ZIA policies evaluate twice — once on the user's original request, and again on the cloud browser's request**. DLP, Sandbox, URL Filter, and CAC all get applied to the cloud browser's egress as well.

## Mechanics

### Components

From *What Is Zero Trust Browser?*:

- **Endpoint container** — ephemeral containerized browser instance allocated per user. Runs the Chromium rendering engine.
- **Chromium rendering engine** — loads the real web page. Runs in the container, not on the endpoint.
- **Experience engine (proprietary)** — converts rendered page to a stream of images (pixel streaming) or a stream of rendering instructions (Turbo Mode).
- **Delivery channel** — secure HTTPS connection carrying the stream to the user's native browser.
- **Browser extension** + **lightweight agent** (*Zero Trust Client Browser*) — pairs with server-side ZBI; handles device posture, data protection during session, and private-app access. Separate subsystem, not deep-dived here.

### Traffic flow in detail

For ZIA-routed isolation (the common path):

```
User browser ──GRE/Z-Tunnel/PAC──▶ Public Service Edge
                                     │
                                     │  URL Filter rule with Isolate action fires
                                     │  on matching URL; action = 302 redirect to
                                     │  isolation profile URL?original=<url>
                                     ▼
User browser ──follows redirect──▶ Isolation profile URL (ZBI endpoint)
                                     │
                                     ▼
                                   Ephemeral container allocated
                                   Chromium loads the original URL
                                     │
                                     ▼
Cloud browser ──egress──▶ Public Service Edge ──▶ Destination
                                     │
                                     ▼
                                   Rendered content back to cloud browser
                                     │
                                     ▼
                                   Experience engine: pixels or instructions
                                     │
                                     ▼
User browser ──HTTPS stream──────── Isolation profile URL
```

**The double-PSE traversal is why ZIA policies apply on both legs.** This isn't a bug; it's the designed security model. If an operator asks "does DLP apply to isolated traffic?" — yes, on the cloud-browser-egress leg. If they ask "is URL Filter applied?" — yes, on both the user's initial request (that's how the Isolate action fires) and the cloud browser's outbound request.

### Rendering modes — pixel streaming vs Turbo Mode

Two ways to convey the rendered page back to the user:

**Pixel streaming (default)**:

- Container renders, experience engine captures frames as images, streams to user.
- Works on any browser that can display HTTPS-delivered image streams.
- Bandwidth: high (frames are images).
- Frame rate: lower.

**Turbo Mode**:

- Container renders, experience engine extracts the browser's rendering instructions, sends the instructions to the user's native browser.
- User's browser replays the instructions locally (so local compute is used for painting, but not for parsing/executing page code).
- Bandwidth: much lower (instructions are small).
- Frame rate: up to 50 fps.
- Includes caching of rendering instructions — subsequent scrolls of the same page transfer little/no data.
- **Security: same.** "No code is executed locally on the device" — only rendering instructions are transferred, not HTML/JS.

**Turbo Mode requirements**:

- Device hardware acceleration enabled.
- WebGL and WebGL2 support on the endpoint browser.
- **Not supported on Internet Explorer 11.**

**When to use which**:

- Turbo Mode for most modern desktop/mobile devices. Default-on-if-supported.
- Pixel streaming for IE11 or WebGL-disabled endpoints.

Turbo Mode is configured per isolation profile, not globally. Same user on different isolation profiles can see different modes.

### Session lifecycle

- **First isolation request**: container allocated, added to user's session.
- **Subsequent requests hitting the same isolation profile**: reuse the same container.
- **Container destruction triggers**:
  - User manually logs out of the isolation session.
  - Default **10-minute idle timeout**.
  - ZPA Isolation additionally uses "minimum timeout across all configured ZPA timeout policies" — the lower of the two wins.

**Operational pattern**: a user returning to an isolated page after lunch (>10 min idle) gets a fresh container. That container is cold — no cookies, no form state, no per-session cache. Expect users to re-auth on returning destinations. This is by design (isolation is a security primitive, not a browsing convenience).

### Policy-evaluation placement

ZBI doesn't have its own policy engine in the ZIA/ZPA sense. It composes with existing policies:

- **ZIA URL Filter `Isolate` action** — how ZIA decides to route to ZBI. See [`../zia/url-filtering.md`](../zia/url-filtering.md).
- **ZPA Isolation Policy** — how ZPA decides to route private-app access to ZBI. See [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md).
- **Isolation profile** — tenant-configured object that specifies *how* the isolated session behaves (Turbo Mode, copy/paste allow, file-transfer allow, print, read-only, region, etc.). Different profiles can apply to different URL Filter rules or different ZPA Isolation rules. See [`./policy-integration.md`](./policy-integration.md).

## Use cases

Common ZIA-triggered isolation patterns (URL Filter `Isolate` action):

- Uncategorized or risky websites
- Miscellaneous & Unknown category (the limited-tier subscription path)
- Newly registered domains and other high-risk categories
- BYOD / unmanaged-device user policies

**ZPA-routed isolation — BYOD framing.** ZPA can send private-app traffic through ZBI so users access internal web apps in an isolated session, with no private-app content reaching the device directly. Concrete framing: **secure SaaS and internal app access from unmanaged devices without requiring ZCC enrollment.** The unmanaged endpoint never touches HTML/CSS/JS or private-app DNS.

## What ZBI is not

Boundary disclaimers that come up in scoping conversations:

- **Not a VPN.** Traffic still routes through ZIA / ZPA for inspection — ZBI is layered *on top of* the existing forward-proxy or ZTNA path, not a replacement.
- **Not a VDI.** Only the browser session is isolated. The local device OS and applications are unchanged; ZBI is not a remote desktop.
- **Not a clientless-VPN replacement.** ZPA-routed isolation enables private-app access from unmanaged devices, but ZPA itself (App Connectors, segmentation, policy) is still required underneath — ZBI doesn't supply the connectivity layer on its own.

## API surface

**No dedicated ZBI / Zero Trust Browser REST API.** Configuration is primarily portal-managed via the Zscaler Admin Console — isolation profiles, regions, profile-level controls (clipboard / upload / download / print / read-only), Turbo Mode toggle. The ZIA API includes URL Filtering rule configuration that can reference an isolation profile (indirect access — you can wire the `Isolate` action and reference profile names via API, but the profile object itself is portal-configured). The Python SDK exposes `zscaler/zia/cloud_browser_isolation.py` (a thin surface) and the Go SDK has `zscaler/zpa/services/cloudbrowserisolation/*`; treat these as supplementary to portal config rather than a full management surface. **Caveat for users expecting a programmable surface:** if a question presupposes "configure isolation profiles via API" the honest answer is "portal."

## Light mentions (one-line each)

Features captured in vendor docs but not deep-dived here. Skill should recognize the names and route to vendor docs / TAM for depth:

- **Language translation** — translate isolated web content within the session.
- **Mobile support** — isolation experience on mobile devices (iOS / Android browsers).
- **Debug mode** — admin troubleshooting capability surfaced in the isolation session.
- **Multiple simultaneous sessions** — a user can have multiple isolated sessions open at once (different profiles / different URLs).
- **Votiro CDR integration** — third-party content-disarm-and-reconstruction integration for files passing through isolation. Not deep-dived; see `understanding-votiro-integration-isolation` help article.
- **Sandbox + Isolation integration** — isolated file downloads can be routed to Zscaler Sandbox for malware analysis before delivery.

## Edge cases

- **URL Filter rule with `Isolate` action requires SSL Inspection for HTTPS** — to generate the 302 redirect at all. A site matching the rule but falling under an SSL bypass for that category silently won't be isolated.
- **During ZPA maintenance windows, Isolation may be unavailable.** From the ZPA Isolation help article: "If ZPA is undergoing a maintenance period, Isolation might not be available." Operator-visible failure mode.
- **Isolated egress still hits URL Filter on the second PSE pass.** A rule that allows a destination for regular users but blocks it for isolated egress (unusual but possible) can produce "user sees rendering start, then page goes blank" — the destination loaded once, then URL Filter blocked the egress for further resources.
- **Smart Browser Isolation auto-creates an SSL Inspection rule.** When you enable Smart Isolation, ZIA silently adds a decrypt rule for suspicious websites. Operators auditing SSL Inspection rule count are often surprised. See [`./policy-integration.md`](./policy-integration.md).
- **Isolation containers run in specific Zscaler data centers.** Region selection on the isolation profile controls which region hosts the container. Data-residency reviewers should know containers can be confined to specific regions; the default is "All."
- **The cloud browser's egress is a Zscaler-owned IP, not the user's egress IP.** Destinations that geolocate by source IP see the user as being "wherever the container is," not where the user is. This is occasionally user-visible ("why am I seeing the US homepage when I'm in Germany?") and is inherent to the architecture.
- **The isolation profile URL is publicly routable, not a private endpoint.** It's a Zscaler-managed URL on the public internet; the endpoint follows the `302` redirect to that URL to reach the cloud browser. **DNS resolution of the isolation profile URL must not be blocked at the endpoint** — a strict outbound DNS allowlist that drops the isolation hostname will silently break isolation. Operationally surfaces as "the redirect happens, then the page never loads."
- **Air-gap is a prevention control, not a detection control.** Because active web content (HTML/CSS/JS) never reaches the endpoint, a malicious page rendered inside the container cannot exploit the user's machine — but the malicious page also won't surface in endpoint-visibility tooling as "blocked." Detection of the page being malicious is downstream of the cloud-browser-egress leg (URL Filter / Sandbox / ATP on the second PSE traversal). Don't expect isolation to *flag* the bad content; expect it to *prevent reach*.

## Open questions

- **Exact container-destroy latency** after the 10-minute idle threshold — is it 10:00 hard, or 10:00 + some grace? Not documented numerically.
- **Container resource limits** (memory, CPU) — not surfaced in the customer-facing docs.
- **Cross-tenant isolation between containers** — implied by the architecture but not explicitly described.

## Cross-links

- Policy integration (isolation profiles, ZIA / ZPA rule configuration) — [`./policy-integration.md`](./policy-integration.md)
- ZIA URL Filter (`Isolate` action) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Isolation Policy (in the policy family evaluation order) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- SSL Inspection (prerequisite for isolating HTTPS) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
