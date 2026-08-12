---
product: zbi
topic: "zbi-overview"
title: "ZBI overview — architecture, traffic flow, rendering modes"
content-type: reasoning
last-verified: "2026-07-20"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
  vendor/terraform-provider-zia: cfe618fa7cb6f88939ec703520cfa230ec35bf0a
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
confidence: high
source-tier: mixed
sources:
  - "https://help.zscaler.com/zero-trust-browser/what-is-zero-trust-browser"
  - "vendor/zscaler-help/what-is-zero-trust-browser.md"
  - "https://help.zscaler.com/zero-trust-browser/understanding-turbo-mode-isolation"
  - "vendor/zscaler-help/understanding-turbo-mode-isolation.md"
  - "vendor/zscaler-help/configuring-smart-browser-isolation-policy.md"
  - "vendor/zscaler-help/zpa-about-isolation-policy.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py"
  - "vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py"
  - "vendor/zscaler-sdk-python/zscaler/oneapi_client.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go"
  - "vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go"
  - "vendor/terraform-provider-zpa/zpa/provider.go"
author-status: draft
---

# ZBI overview — architecture, traffic flow, rendering modes

What Zero Trust Browser actually does: render a web page on a Zscaler-hosted browser instance, then stream the rendering to the user's local browser. The user interacts with pixels (or with remotely-generated rendering instructions in Turbo Mode); the real HTML, CSS, and JavaScript never reach the endpoint (`vendor/zscaler-help/what-is-zero-trust-browser.md:14`, `:18`, `vendor/zscaler-help/understanding-turbo-mode-isolation.md:15`, `:17`).

## Summary

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`.

**The isolation container is ephemeral and cloud-resident.** Each user gets an endpoint container allocated at first isolation request; subsequent requests hitting the same isolation profile reuse it; the container is destroyed when the user logs out manually or after **10 minutes of idle time** (`vendor/zscaler-help/what-is-zero-trust-browser.md:38`).

**Traffic passes through Zscaler Public Service Edges twice** on the way to the destination:

1. User's browser → PSE → (URL Filter detects rule with `Isolate` action) → redirect to isolation profile URL with original URL in query string
2. User's browser follows the redirect → isolation profile URL → ephemeral cloud browser container
3. Cloud browser → PSE (second traversal!) → destination web page
4. Cloud browser renders page → ZBI experience engine streams pixels (or Turbo Mode instructions) → user's browser

Because the cloud browser's egress traffic hits a Public Service Edge too, the remote browser's request to the destination is also evaluated by the user's Internet & SaaS policies (`vendor/zscaler-help/what-is-zero-trust-browser.md:22`, `:30`). Treat this as a separate egress-inspection leg, not as proof that every policy family produces duplicate log events.

## Mechanics

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`.

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

**The second Public Service Edge traversal is why isolated egress is still inspected.** This isn't a bug; it's the designed security model. If an operator asks whether ZIA policy still applies to isolated traffic, the source-backed answer is: the user's original request must hit a ZIA policy that redirects it to the isolation profile URL, and the cloud browser's outbound request to the original destination is also routed through the nearest Public Service Edges and evaluated against Internet & SaaS policies (`vendor/zscaler-help/what-is-zero-trust-browser.md:28`, `:30`).

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

Zero Trust Browser does not appear in the captured sources as a standalone policy family. Routing to isolation composes with existing ZIA and ZPA policies:

- **ZIA URL Filter `Isolate` action** — how ZIA decides to route to ZBI. See [`../zia/url-filtering.md`](../zia/url-filtering.md).
- **ZPA Isolation Policy** — how ZPA decides to route private-app access to ZBI. See [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md).
- **Isolation profile** — tenant-configured object that specifies *how* the isolated session behaves (Turbo Mode, copy/paste allow, file-transfer allow, print, read-only, region, etc.). Different profiles can apply to different URL Filter rules or different ZPA Isolation rules. See [`./policy-integration.md`](./policy-integration.md).

## Use cases

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`.

Common ZIA-triggered isolation patterns (URL Filter `Isolate` action):

- Uncategorized or risky websites
- Miscellaneous & Unknown category (the limited-tier subscription path)
- Newly registered domains and other high-risk categories
- BYOD / unmanaged-device user policies

**ZPA-routed isolation — BYOD framing.** ZPA can send private-app traffic through ZBI so users access internal web apps in an isolated session, with no private-app content reaching the device directly. Concrete framing: **secure SaaS and internal app access from unmanaged devices without requiring ZCC enrollment.** The unmanaged endpoint never touches HTML/CSS/JS or private-app DNS.

## What ZBI is not

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`.

Boundary disclaimers that come up in scoping conversations:

- **Not a VPN.** Traffic still routes through ZIA / ZPA for inspection — ZBI is layered *on top of* the existing forward-proxy or ZTNA path, not a replacement.
- **Not a VDI.** Only the browser session is isolated. The local device OS and applications are unchanged; ZBI is not a remote desktop.
- **Not a clientless-VPN replacement.** ZPA-routed isolation enables private-app access from unmanaged devices, but ZPA itself (App Connectors, segmentation, policy) is still required underneath — ZBI doesn't supply the connectivity layer on its own.

## API surface

Source: `vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py`; `vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go`; `vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go`; `vendor/terraform-provider-zpa/zpa/provider.go`.

**No single dedicated "Zero Trust Browser" SDK namespace.** The programmable surface is split:

- ZIA read/profile-reference surface: Python `client.zia.cloud_browser_isolation.list_isolation_profiles()` and Go `zia/services/browser_isolation` both list `/zia/api/v1/browserIsolation/profiles` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_browser_isolation.py:37-60`, `vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:13`, `:30-48`).
- ZPA CBI configuration surface: Python `client.zpa.cbi_profile` and Go `zpa/services/cloudbrowserisolation/cbiprofilecontroller` expose profile create, read, update, and delete operations (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:37`, `:86`, `:124`, `:248`, `:351`; `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:102`, `:137`, `:146`, `:155`, `:164`).
- Terraform wraps both sides: ZIA has Smart Isolation/profile-reference fields, and ZPA registers CBI banner, certificate, external-profile, isolation-rule, and read-only data-source surfaces (`vendor/terraform-provider-zia/zia/resource_zia_browser_control_policy.go:116-126`, `:170-177`; `vendor/terraform-provider-zpa/zpa/provider.go:157-159`, `:169`, `:226-232`).
- Python `client.zbi` is a **Business Insights** service, not browser isolation (`vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-24`, `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:237`, `:331-335`).

The honest answer to "is this programmable?" depends on the object. ZIA isolation-profile lookup and Smart Isolation/profile references are programmable; ZPA CBI profile/banner/certificate objects and isolation policy rules have write surfaces; several console UX features remain help-only or unresolved in captured sources.

## Light mentions (one-line each)

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`.

Features captured in vendor docs but not deep-dived here. Skill should recognize the names and route to vendor docs / TAM for depth:

- **Language translation** — translate isolated web content within the session.
- **Mobile support** — isolation experience on mobile devices (iOS / Android browsers).
- **Debug mode** — admin troubleshooting capability surfaced in the isolation session.
- **Multiple simultaneous sessions** — a user can have multiple isolated sessions open at once (different profiles / different URLs).
- **Votiro CDR integration** — third-party content-disarm-and-reconstruction integration for files passing through isolation. Not deep-dived; see `understanding-votiro-integration-isolation` help article.
- **Sandbox + Isolation integration** — isolated file downloads can be routed to Zscaler Sandbox for malware analysis before delivery.

## Edge cases

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`.

- **Smart Browser Isolation explicitly depends on SSL/TLS Inspection.** The Smart Isolation help page says suspicious websites are decrypted using SSL/TLS Inspection and enabling the feature creates an editable SSL/TLS Inspection rule (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:16`, `:24`). Whether every manual URL Filtering `Isolate` rule has identical decrypt behavior is not established by the captured source; track that as an open question rather than stating it as a hard failure mode.
- **During ZPA maintenance windows, Isolation may be unavailable.** From the ZPA Isolation help article: "If ZPA is undergoing a maintenance period, Isolation might not be available." Operator-visible failure mode.
- **Isolated egress still traverses Internet & SaaS policy on the second PSE pass.** The source says the remote browser's request to the original web page is routed through the nearest Public Service Edges and evaluated against all policies defined for the user (`vendor/zscaler-help/what-is-zero-trust-browser.md:30`). Specific log shapes and user-visible failure modes for second-leg blocks need tenant evidence.
- **Smart Browser Isolation auto-creates an SSL Inspection rule.** When you enable Smart Isolation, ZIA silently adds a decrypt rule for suspicious websites. Operators auditing SSL Inspection rule count are often surprised. See [`./policy-integration.md`](./policy-integration.md).
- **Isolation containers run in specific Zscaler data centers.** Region selection on the isolation profile controls which region hosts the container. Data-residency reviewers should know containers can be confined to specific regions; the default is "All."
- **The cloud browser's egress is a Zscaler-owned IP, not the user's egress IP.** Destinations that geolocate by source IP see the user as being "wherever the container is," not where the user is. This is occasionally user-visible ("why am I seeing the US homepage when I'm in Germany?") and is inherent to the architecture.
- **The isolation profile URL is publicly routable, not a private endpoint.** It's a Zscaler-managed URL on the public internet; the endpoint follows the `302` redirect to that URL to reach the cloud browser. **DNS resolution of the isolation profile URL must not be blocked at the endpoint** — a strict outbound DNS allowlist that drops the isolation hostname will silently break isolation. Operationally surfaces as "the redirect happens, then the page never loads."
- **Air-gap is a prevention control, not a detection control.** Because active web content (HTML/CSS/JS) never reaches the endpoint, a malicious page rendered inside the container cannot exploit the user's machine — but the malicious page also won't surface in endpoint-visibility tooling as "blocked." Detection of the page being malicious is downstream of the cloud-browser-egress leg (URL Filter / Sandbox / ATP on the second PSE traversal). Don't expect isolation to *flag* the bad content; expect it to *prevent reach*.

## Open questions

Source: `vendor/zscaler-help/what-is-zero-trust-browser.md`; `vendor/zscaler-help/understanding-turbo-mode-isolation.md`.

- **Exact container-destroy latency** after the 10-minute idle threshold — is it 10:00 hard, or 10:00 + some grace? Not documented numerically.
- **Container resource limits** (memory, CPU) — not surfaced in the customer-facing docs.
- **Cross-tenant isolation between containers** — implied by the architecture but not explicitly described.

## Cross-links

- Policy integration (isolation profiles, ZIA / ZPA rule configuration) — [`./policy-integration.md`](./policy-integration.md)
- Claims ledger for this refresh — [`./_claims-ledger.md`](./_claims-ledger.md)
- ZIA URL Filter (`Isolate` action) — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZPA Isolation Policy (in the policy family evaluation order) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
- SSL Inspection (prerequisite for isolating HTTPS) — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
