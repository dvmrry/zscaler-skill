# How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout (zbi.cloud-browser)
Also called: zero trust browser architecture; cloud browser; cloud browser isolation; cbi traffic flow; isolation container; isolation idle timeout; how browser isolation works; zscaler isolation; zbi overview; ztb browser isolation; isolated session timed out; ztb; votiro; local browser rendering; isolation sandbox; zero trust browser extension; zero trust enterprise browser

Cloud Browser is the part of Zero Trust Browser that renders web pages away from the endpoint; the product names are in [Zero Trust Browser was formerly Zscaler Isolation; the NSS web log's field descriptions call it "Zero Trust Browser (formerly Isolation)".](kb:shared.terminology.product-names:zero-trust-browser). The Zero Trust Browser platform consists of Cloud Browser, which delivers internet and application access in isolation; Browser Extension, which adds browser detection and response (BDR), DLP and posture-based application access to existing browsers; and Enterprise Browser, a dedicated, hardened Chromium browser. [zbi.cloud-browser:components] Zscaler lists protecting against sophisticated phishing attacks, controlling sensitive data exposure to generative AI platforms and securing access from unmanaged devices as Zero Trust Browser use cases. [zbi.cloud-browser:use-cases] Whether ZTB in a question means Zero Trust Browser or Zero Trust Branch ([Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed](kb:zero-trust-branch.overview)) is not settled by a source [gap:zbi.cloud-browser:ztb-abbreviation].

## Rendering away from the endpoint

Cloud Browser loads the accessed web page on a remote browser in one of Zscaler's data centers and streams the rendered content to the user's native browser as a stream of pixels of WebGL instructions. [zbi.cloud-browser:remote-render] The HTML, CSS and JavaScript files and any other active content served by the isolated page never reach the user's machine or the corporate network. [zbi.cloud-browser:air-gap] Cloud Browser also lets the user view file types in isolation without downloading the files to the local machine. [zbi.cloud-browser:file-view] How the rendered stream is encoded is in [Turbo Mode: instruction-set rendering instead of pixel streaming, and what the endpoint needs](kb:zbi.turbo-mode).

## Traffic flow

Internet traffic reaches a Public Service Edge through GRE, Client Connector or another forwarding method; if the URL qualifies for an Internet & SaaS URL Filtering policy the admin created to isolate traffic, the service redirects the HTTP or HTTPS request to the isolation profile, the user's browser follows the redirect to Cloud Browser, and Cloud Browser assigns the user a temporary remote browser. [zbi.cloud-browser:zia-redirect] The exact form of the redirect is open [gap:zbi.cloud-browser:redirect-form]. The remote browser's request to the original page is routed through the nearest Public Service Edges and evaluated against all the Internet & SaaS policies the admin defined for the user, so traffic leaving the isolation browser passes through Public Service Edges before it reaches the page. [zbi.cloud-browser:egress-evaluated] In addition to the security policies Internet & SaaS enforces, Cloud Browser has data exfiltration controls that set how much the user can interact with the isolated page. [zbi.cloud-browser:exfiltration-controls]

For traffic processed through isolation the web log records the origin separately: [For traffic processed through Isolation, userlocationname holds the actual origination point while location holds the Isolation Location; for other traffic userlocationname is None.](kb:zia.logs.web-field-semantics:isolation-location). How a block on the egress leg shows up otherwise is open [gap:zbi.cloud-browser:second-leg-logging], and so is which address the destination sees [gap:zbi.cloud-browser:egress-source-address]. Whether the endpoint must resolve and reach the isolation profile URL directly is open [gap:zbi.cloud-browser:profile-url-reachability].

Which rules send traffic to Cloud Browser is in [What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy](kb:zbi.policy); the profiles they name are in [Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions](kb:zbi.isolation-profiles).

## Containers

When the user's traffic reaches Cloud Browser it creates an endpoint container for the user; a Chromium rendering engine loads and renders the page, and a proprietary experience engine converts the rendered page into a stream of images and WebGL instructions delivered to the user's browser over HTTPS. [zbi.cloud-browser:container-engines] Each user redirected to Cloud Browser gets one endpoint container that all later requests using the isolation profile share; the container is destroyed when the user logs out of the isolation session or after the default idle timeout of 10 minutes. [zbi.cloud-browser:container-reuse-timeout] How precisely the idle timeout is enforced is open [gap:zbi.cloud-browser:idle-timeout-precision], as are container resources and separation [gap:zbi.cloud-browser:container-internals] and what state a new container starts with [gap:zbi.cloud-browser:session-state-after-timeout].

## Profile settings, user experience and files

Root certificates: [Root certificates the isolation browser trusts: limits, defaults, edit and delete rules](kb:zbi.root-certificates). Banner themes: [Isolation banner themes: fields, limits and the default theme](kb:zbi.banner-notifications). Data redaction: [Redaction of sensitive text in isolation by DLP engine: settings, behaviour and what it does not cover](kb:zbi.data-redaction). Persistent State: [Persistent State and cookie persistence in isolation: what is purged, what is restored, retention and size limits](kb:zbi.persistent-state). Modes, menus, mobile and sessions: [What the user sees in isolation: experience modes, menus, Original URL, bookmarks, mobile, translation, read-only and extensions](kb:zbi.end-user-experience). Files: [Transferring and viewing files in isolation: file types, size limit, Protected Storage and printing](kb:zbi.file-handling). Sandbox and Votiro: [Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings](kb:zbi.file-scanning). Debug Mode and latency: [Isolation Debug Mode and the Network Latency window: what they do, capture and export](kb:zbi.troubleshooting). Reports: [Zero Trust Browser interactive reports: where they are and which widgets each report has](kb:zbi.reports). Browser Extension and Enterprise Browser: [Browser Extension and Enterprise Browser for Zero Trust Browser: what each is, desktop and mobile](kb:zbi.browser-extension-enterprise-browser).

## Partner file sanitization

The partner integrations page lists integrating with Votiro CDR under Zero Trust Browser > Chrome Enterprise Browser > Votiro, to further sanitize files accessed through Zero Trust Browser; its path is the Chrome Enterprise Browser. Votiro allows any file downloaded or uploaded to or from internet destinations to be sanitized by the CDR services, which consume the original file and return a file in the same format, sanitized. [zbi.cloud-browser:votiro-cdr]

## What is not captured

Whether isolation itself reports blocked active content is open [gap:zbi.cloud-browser:detection-signal]. Several features the legacy reference named have no captured article [gap:zbi.cloud-browser:uncaptured-features].

What to check:
1. Whether the request matched an Internet & SaaS URL Filtering rule built to isolate it, since only that redirect sends the request to Cloud Browser.
2. Whether a block seen inside the isolated session came from the user's own Internet & SaaS policies applied to the remote browser's request.
3. Whether the session was idle for the default 10 minutes or the user logged out, either of which destroys the container.
4. When a question says ZTB, establish whether it means Zero Trust Browser or Zero Trust Branch before routing it.

Not known (open gaps):
- Status code and URL form of the redirect to the isolation profile [gap:zbi.cloud-browser:redirect-form]: settled by lab-test or source-read. Blocks: reading a proxy or browser trace of an isolated request, and telling a broken redirect from a broken Cloud Browser session
- How a policy action on the remote browser's request appears in the logs [gap:zbi.cloud-browser:second-leg-logging]: settled by tenant-data or lab-test. Blocks: tying an isolated user's complaint to the web log record of the egress-leg decision
- Which source address and location a destination sees for an isolated page [gap:zbi.cloud-browser:egress-source-address]: settled by lab-test or source-read. Blocks: explaining geolocation or IP-allowlist differences between isolated and direct access to the same site
- Whether the endpoint must resolve and reach the isolation profile URL directly [gap:zbi.cloud-browser:profile-url-reachability]: settled by lab-test or source-read. Blocks: diagnosing an isolated page that never loads after the redirect
- How soon after 10 idle minutes a container is destroyed [gap:zbi.cloud-browser:idle-timeout-precision]: settled by lab-test. Blocks: matching a reported session loss to the idle timeout by timestamp
- Container resource limits and separation between customers' containers [gap:zbi.cloud-browser:container-internals]: settled by support-ticket or source-read. Blocks: answering performance-ceiling and multi-tenant separation questions about Cloud Browser
- What a new container keeps from the previous session [gap:zbi.cloud-browser:session-state-after-timeout]: settled by lab-test or source-read. Blocks: explaining repeated sign-in prompts in isolated sessions
- Whether isolation reports the malicious content it kept off the endpoint [gap:zbi.cloud-browser:detection-signal]: settled by source-read or lab-test. Blocks: saying where a SOC would see that an isolated page was malicious
- Whether the Votiro partner page and local browser rendering apply to Cloud Browser sessions [gap:zbi.cloud-browser:uncaptured-features]: settled by source-read. Blocks: describing what these features do or require
- Whether the abbreviation ZTB means Zero Trust Browser [gap:zbi.cloud-browser:ztb-abbreviation]: settled by source-read. Blocks: routing a question that says ZTB to browser isolation or to Zero Trust Branch

Area: zbi.cloud-browser, its subjects in references/_meta/spine/zbi/zbi.cloud-browser.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zia/zia.traffic-forwarding.md (How traffic reaches ZIA): Internet traffic reaches a Public Service Edge through GRE, Client Connector or another forwarding method; if the URL qualifies for an Internet & SaaS URL Filtering policy the admin created to isolate traffic, the service redirects the HTTP or HTTPS request to the isolation profile, the user's browser follows the redirect to Cloud Browser, and Cloud Browser assigns the user a temporary remote browser. [zbi.cloud-browser:zia-redirect]
- decided-by references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): Internet traffic reaches a Public Service Edge through GRE, Client Connector or another forwarding method; if the URL qualifies for an Internet & SaaS URL Filtering policy the admin created to isolate traffic, the service redirects the HTTP or HTTPS request to the isolation profile, the user's browser follows the redirect to Cloud Browser, and Cloud Browser assigns the user a temporary remote browser. [zbi.cloud-browser:zia-redirect]
- links-to references/_meta/text/shared/shared.terminology.product-names.md (Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC)
- links-to references/_meta/text/zbi/zbi.banner-notifications.md (Isolation banner themes: fields, limits and the default theme)
- links-to references/_meta/text/zbi/zbi.browser-extension-enterprise-browser.md (Browser Extension and Enterprise Browser for Zero Trust Browser: what each is, desktop and mobile)
- links-to references/_meta/text/zbi/zbi.data-redaction.md (Redaction of sensitive text in isolation by DLP engine: settings, behaviour and what it does not cover)
- links-to references/_meta/text/zbi/zbi.end-user-experience.md (What the user sees in isolation: experience modes, menus, Original URL, bookmarks, mobile, translation, read-only and extensions)
- links-to references/_meta/text/zbi/zbi.file-handling.md (Transferring and viewing files in isolation: file types, size limit, Protected Storage and printing)
- links-to references/_meta/text/zbi/zbi.file-scanning.md (Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings)
- links-to references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)
- links-to references/_meta/text/zbi/zbi.persistent-state.md (Persistent State and cookie persistence in isolation: what is purged, what is restored, retention and size limits)
- links-to references/_meta/text/zbi/zbi.policy.md (What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy)
- links-to references/_meta/text/zbi/zbi.reports.md (Zero Trust Browser interactive reports: where they are and which widgets each report has)
- links-to references/_meta/text/zbi/zbi.root-certificates.md (Root certificates the isolation browser trusts: limits, defaults, edit and delete rules)
- links-to references/_meta/text/zbi/zbi.troubleshooting.md (Isolation Debug Mode and the Network Latency window: what they do, capture and export)
- links-to references/_meta/text/zbi/zbi.turbo-mode.md (Turbo Mode: instruction-set rendering instead of pixel streaming, and what the endpoint needs)
- links-to references/_meta/text/zero-trust-branch/zero-trust-branch.overview.md (Zero Trust Branch: what it is, how it forwards and segments, and how it is deployed)
- links-to references/_meta/text/zia/zia.logs.web-field-semantics.md (Value encodings and caveats of ZIA web log fields)
