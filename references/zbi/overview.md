---
product: zbi
topic: "zbi-overview"
title: "ZBI overview — architecture, traffic flow, rendering modes"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
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

## Edge cases

- **URL Filter rule with `Isolate` action requires SSL Inspection for HTTPS** — to generate the 302 redirect at all. A site matching the rule but falling under an SSL bypass for that category silently won't be isolated.
- **During ZPA maintenance windows, Isolation may be unavailable.** From the ZPA Isolation help article: "If ZPA is undergoing a maintenance period, Isolation might not be available." Operator-visible failure mode.
- **Isolated egress still hits URL Filter on the second PSE pass.** A rule that allows a destination for regular users but blocks it for isolated egress (unusual but possible) can produce "user sees rendering start, then page goes blank" — the destination loaded once, then URL Filter blocked the egress for further resources.
- **Smart Browser Isolation auto-creates an SSL Inspection rule.** When you enable Smart Isolation, ZIA silently adds a decrypt rule for suspicious websites. Operators auditing SSL Inspection rule count are often surprised. See [`./policy-integration.md`](./policy-integration.md).
- **Isolation containers run in specific Zscaler data centers.** Region selection on the isolation profile controls which region hosts the container. Data-residency reviewers should know containers can be confined to specific regions; the default is "All."
- **The cloud browser's egress is a Zscaler-owned IP, not the user's egress IP.** Destinations that geolocate by source IP see the user as being "wherever the container is," not where the user is. This is occasionally user-visible ("why am I seeing the US homepage when I'm in Germany?") and is inherent to the architecture.

## Open questions

- **Exact container-destroy latency** after the 10-minute idle threshold — is it 10:00 hard, or 10:00 + some grace? Not documented numerically.
- **Container resource limits** (memory, CPU) — not surfaced in the customer-facing docs.
- **Cross-tenant isolation between containers** — implied by the architecture but not explicitly described.

## Cross-links

- Policy integration (isolation profiles, ZIA / ZPA rule configuration) — [`./policy-integration.md`](./policy-integration.md)
- ZIA URL Filter (`Isolate` action) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Isolation Policy (in the policy family evaluation order) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- SSL Inspection (prerequisite for isolating HTTPS) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
