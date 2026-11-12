# ZSDK Browser Access: availability, prerequisites, unsupported features and DNS (shared.zsdk.browser-access)
Also called: zsdk browser access; zsdk web browser client type; zsdk browser access cname; zsdk browser access certificate

Browser Access gives browser-based applications zero trust protection without an SDK or software agent, providing identity verification, Transport Layer Security and back-end cloaking, and routes back-end traffic through the Zscaler cloud. [shared.zsdk.browser-access:what-it-provides] Browser Access is in Limited Availability and Zscaler Support must be contacted to enable it; the release notes list it as a feature in limited availability on October 31, 2025. [shared.zsdk.browser-access:availability]

## Setup

After an application segment is defined and enabled for Browser Access, a browser token validator must be added for it. [shared.zsdk.browser-access:token-validator-required] Web Browser is a client type in access policy rules, for applications that require access over a web browser. [shared.zsdk.browser-access:web-browser-client-type]

## Application prerequisites

When a Browser Access application uses a certificate, its FQDN must be properly named and resolvable by App Connectors through internal DNS and owned by the tenant; web servers must serve relative URLs; and an application that uses the HTTP header Content-Security-Policy must accept an external FQDN in the host/origin header. [shared.zsdk.browser-access:prerequisites-with-certificate] The prerequisites article says that when a Browser Access application uses a certificate, an uploaded combined PEM file is needed containing the full certificate chain, the private key and RSA formatting. [shared.zsdk.browser-access:certificate-file-requirement] With a certificate, Browser Access does not support absolute URLs, wildcard cookies, wildcard Browser Access applications, applications with IP addresses, domains unregistered in the account, or applications sending CORS requests to Browser Access applications. [shared.zsdk.browser-access:unsupported-with-certificate]

## Application segment settings and DNS

The Browser Access Internal URL takes a protocol (HTTP or HTTPS), a domain or IP address, a port (default 80 for HTTP and 443 for HTTPS) and a certificate; the Use Untrusted Certificates checkbox is selected by default when HTTPS is the protocol. [shared.zsdk.browser-access:internal-url-defaults] Allow Unauthenticated OPTIONS Request forwards the browser's unauthenticated HTTP pre-flight OPTIONS request to the application, and the article says this is required to enable Browser Access on the application segment. [shared.zsdk.browser-access:unauthenticated-options] For a Browser Access application with a custom certificate the CNAME from the Browser Access page is added to public DNS; with a Zscaler-managed certificate Zscaler manages the public DNS entries; and the App Connector must use an internal DNS or a DNS loop results. [shared.zsdk.browser-access:public-dns-cname]

Certificate and token validator details, including whether a certificate is required, are in [ZSDK token validators, browser token validators and web server certificates](kb:shared.zsdk.authentication).

What to check:
1. Whether the Browser Access application uses a certificate and meets the FQDN, relative URL and Content-Security-Policy prerequisites.
2. Whether the App Connector resolves Browser Access applications through an internal DNS.

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.zsdk.authentication.md (ZSDK token validators, browser token validators and web server certificates)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.zsdk.md (Zscaler SDK for Mobile Apps (ZSDK): what it is and where it is described)
- see-also references/_meta/text/shared/shared.zsdk.applications.md (ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs)
- see-also references/_meta/text/shared/shared.zsdk.configuration.md (Configuring ZSDK: registered apps and app keys, segments and access policy)
