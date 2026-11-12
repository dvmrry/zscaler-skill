# What Browser Access requires of the browser, server and session (zpa.browser-access.requirements)
Also called: browser access requirements; clientless zpa; browser access tls 1.2; browser access cors; browser access via header; browser access session cookie; browser access http only; can browser access do ssh; browser access reauthentication; browser access websocket

Browser Access is the clientless path to Private Access web applications. This subject holds what the path requires of the browser, the application and the session.

**What it is.** Browser Access lets users authenticate and reach Private Access applications through a web browser without installing Zscaler Client Connector. It is aimed at devices whose operating system Client Connector does not support and at third-party devices the company does not own or manage. [zpa.browser-access.requirements:definition] Browser Access uses the customer's existing identity provider, so current users, contractors and other third-party users can be given access without managing an internet footprint. [zpa.browser-access.requirements:existing-idp] When an application in a segment has Browser Access enabled, Client Connector access is applied to it automatically, so the application can be requested from a browser or from Client Connector. [zpa.browser-access.requirements:zcc-also-applied]

**Protocols.** Private Access supports HTTP and HTTPS for Browser Access applications. [zpa.browser-access.requirements:http-https-only] When a Browser Access application is defined, port 80 is entered by default for HTTP and 443 for HTTPS. [zpa.browser-access.requirements:default-ports] SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra] Applications are defined as FQDNs only, covered in [What an application segment can contain: entries, wildcards and ports](kb:zpa.app-segments.definition). Whether WebSocket traffic passes is open [gap:zpa.browser-access.requirements:websocket-support].

**Browser and server.** The browser must support TLS 1.2 with cipher suite ECDHE-RSA-AES128-GCM-SHA256 and any proxy in the path must not modify the page contents. The application server must also support TLS 1.2. [zpa.browser-access.requirements:tls-requirements] To resolve Browser Access-enabled applications, the App Connector must use an internal DNS; if an internal DNS is not used, the App Connector results in a DNS loop. [zpa.browser-access.requirements:internal-dns-or-loop] Private Access inserts a Via header into HTTP requests made through Browser Access. [zpa.browser-access.requirements:via-header] Private Access accepts CORS requests with the right settings, and valid OPTIONS requests that include certain headers. [zpa.browser-access.requirements:cors] The browsers the help page lists as supported for CORS requests are Firefox 81.0, Chrome 64_65, Google Chrome 86.0.4240.75, Microsoft Edge 86.0.622.43, Safari 12.0 and Safari 13.0. [zpa.browser-access.requirements:cors-browsers]

**Session.** Browser Access cookies are session based and are cleared when the browser's session ends, so users must authenticate before accessing applications. [zpa.browser-access.requirements:session-cookies] Users are asked to reauthenticate periodically, governed by the Authentication Timeout setting of the Private Access timeout policy rule. [zpa.browser-access.requirements:reauthentication] How cookies behave across tabs and incognito windows is open [gap:zpa.browser-access.requirements:cookie-edge-cases].

**Not established.** How the Client Connector transport differs [gap:zpa.browser-access.requirements:zcc-path-contrast] and where TLS terminates [gap:zpa.browser-access.requirements:ingress-data-path] are open.

What to check:
1. Whether the application is HTTP or HTTPS, since other protocols are not Browser Access traffic and go to PRA.
2. Whether the user's browser and any proxy meet the TLS and cipher requirement, and whether the backend strips or rejects the Via header.
3. Whether a CORS failure involves a browser outside the listed versions or a request without the required headers.
4. Whether a re-prompt for login is the periodic Authentication Timeout or a cleared session cookie.
5. Whether the question depends on WebSocket support or cookie behavior across tabs, which no source settles.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.browser-access.requirements:non-http-use-pra] Tier B: Derived: the Browser Access help names only HTTP and HTTPS, and the PRA overview names RDP, SSH and VNC as its clientless protocols. No source lists SSH over Browser Access as unsupported in those words.

Not known (open gaps):
- WebSocket traffic through Browser Access [gap:zpa.browser-access.requirements:websocket-support]: settled by lab-test or operator-experience
- Cookie lifetime across tabs and incognito windows [gap:zpa.browser-access.requirements:cookie-edge-cases]: settled by lab-test
- How the Client Connector path differs from Browser Access [gap:zpa.browser-access.requirements:zcc-path-contrast]: settled by source-read or support-ticket
- Where TLS terminates for Browser Access [gap:zpa.browser-access.requirements:ingress-data-path]: settled by source-read or support-ticket

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom), from zpa.browser-access: For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- decided-by references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria), from zpa.browser-access: An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type]
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say), from zpa.browser-access: The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- decided-by references/_meta/text/zpa/zpa.policy.timeout-rules.md (ZPA timeout policy rules): Users are asked to reauthenticate periodically, governed by the Authentication Timeout setting of the Private Access timeout policy rule. [zpa.browser-access.requirements:reauthentication]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes), from zpa.browser-access: SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- links-to references/_meta/text/zpa/zpa.app-segments.definition.md (What an application segment can contain: entries, wildcards and ports)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.browser-access.segment-constraints.md (Browser Access applications on a segment: per-application keys and where the constraints live)
