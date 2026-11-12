# Whether Client Connector installs the Zscaler root certificate (zcc.app-profiles.ssl-certificate)
Also called: install zscaler ssl certificate; install_ssl_certs; installCerts; zcc certificate errors; macos users see certificate errors; ios certificate zcc

An app profile determines whether the app can install the Zscaler SSL certificate on users' devices, to allow SSL inspection of traffic the app forwards to Internet & SaaS. [zcc.app-profiles.ssl-certificate:purpose] With Install Zscaler SSL Certificate enabled, the app installs the Zscaler certificate automatically, or the organization's custom certificate if one was uploaded; deployments using the app for Private Access only skip the option. [zcc.app-profiles.ssl-certificate:install-option]

**Custom certificate.** Uploading the organization's custom SSL certificate is an optional step when configuring SSL inspection for Client Connector; it is uploaded on the Advanced Configuration tab (Infrastructure > Advanced Settings > Custom Root Cert) under Custom Certificate, and when the install Zscaler SSL Certificate option is on, the custom certificate is installed on users' devices automatically. [zcc.app-profiles.ssl-certificate:custom-cert-upload]

Why a device without the root sees errors on inspected traffic is in [With the default Zscaler intermediate certificate every client must have the Zscaler root certificate installed; otherwise browsers and applications show warnings or the traffic cannot be inspected properly.](kb:zia.ssl-inspection.certificates:root-must-be-trusted); applications with their own trust stores need more, as [Some applications keep their own certificate trust store, so installing the Zscaler root in the operating system is not enough: Firefox, Python and developer tooling are the named examples, and for non-browser applications that show SSL errors the check is whether the Zscaler root is installed in the proper repository for them.](kb:zia.ssl-inspection.certificates:own-trust-stores) explains.

**iOS.** The iOS app profile has no certificate setting: the iOS section of the help, the API's `iosPolicy` block and the Go SDK's iOS block carry none. [zcc.app-profiles.ssl-certificate:no-ios-option] Client Connector does not install it there, and Zscaler recommends installing it through the MDM: [On iOS, Client Connector does not automatically install the certificate, because Apple requires certificates installed by an application to be untrusted by default; Zscaler recommends installing the root through the MDM.](kb:zcc.ssl-inspection.certificate-install:ios).

**Other platforms.** Who installs the certificate on each platform, and when: [Who installs the SSL inspection certificate on Client Connector devices, per platform](kb:zcc.ssl-inspection.certificate-install).

**Built by hand.** The key that carries the setting differs by platform and by source: [zcc.api.web-policy-wire:os-password-key-casing](kb:zcc.api.web-policy-wire:os-password-key-casing).

Certificate trust on the endpoint beyond the app profile is in [SSL inspection for Client Connector users: what Client Connector does and what ZIA does](kb:zcc.ssl-inspection).

What to check:
1. Whether the rule the device downloaded, for its platform, has Install Zscaler SSL Certificate on.
2. On iOS, whether MDM delivered the certificate, since the app profile has no option for it.
3. For a body built by hand, which key the platform block used.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.app-profiles.ssl-certificate:no-ios-option] Tier B: Absence: the iOS section of the app profile article, the OpenAPI iosPolicy properties and the Go IosPolicy struct were searched for a certificate setting; Windows, macOS, Linux and Android blocks all have one.

Area: zcc.app-profiles, its subjects in references/_meta/spine/zcc/zcc.app-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.ssl-inspection.certificates.md (SSL/TLS inspection certificates: who signs, and where the root must be trusted): With the default Zscaler intermediate certificate every client must have the Zscaler root certificate installed; otherwise browsers and applications show warnings or the traffic cannot be inspected properly. [zia.ssl-inspection.certificates:root-must-be-trusted]
- links-to references/_meta/text/zcc/zcc.ssl-inspection.certificate-install.md (Who installs the SSL inspection certificate on Client Connector devices, per platform)
- decided-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match), from zcc.app-profiles: The rule order is the order of precedence among a platform's profile rules and helps determine which rule the app downloads for a user at enrollment; precedence is by ascending number. [zcc.app-profiles.selection:ascending-precedence]
- interacts-with references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group), from zcc.app-profiles: Service entitlement selects which user groups or device groups can enroll into Private Access (ZPA), Digital Experience (ZDX) and Zscaler Deception; Internet & SaaS (ZIA) enrollment is enabled for all users by default. [zcc.entitlements:services-gated]
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zcc/zcc.ssl-inspection.md (SSL inspection for Client Connector users: what Client Connector does and what ZIA does)
