# Certificate and encryption failures: Browser Access, double encryption, pinned clients (zpa.troubleshooting.certificates)
Also called: zpa certificate error; browser access certificate warning; double encryption failure; zpa certificate pinned client; wildcard certificate one level

Certificate failures differ by access method, and a failure in the application's own TLS is not a ZPA policy failure.

**Browser Access.** Hostname and certificate rules are in [External versus internal hostname for a Browser Access application](kb:zpa.browser-access.hostnames) and [Certificates for Browser Access applications: wildcards, managed and custom](kb:zpa.browser-access.certificates), the wildcard depth in [Certificates for Browser Access applications: wildcards, managed and custom](kb:zpa.browser-access.certificates).

**Double Encryption.** Traffic between Zscaler Client Connector and the Public Service Edge for Private Access is encrypted with TLS 1.2 by default, and Double Encryption adds a second layer of encryption for traffic between Zscaler Client Connector on the user's device and the App Connector. [zpa.troubleshooting.certificates:double-encryption-layer] It cannot be combined with Browser Access or Source IP Anchoring: [Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings).

**Unsourced readings.** Connector-side handshake failures, certificate chains on double-encrypted segments, and pinned clients are not sourced [gap:zpa.troubleshooting.certificates:connector-handshake-failures] [gap:zpa.troubleshooting.certificates:pinned-clients].

What to check:
1. Whether the access method is Browser Access, a double-encrypted segment or a client application, since the failure differs.
2. For Browser Access, whether the external and internal hostnames differ, which shows end users a certificate error, and whether the wildcard certificate is one level too shallow.
3. Whether the segment uses Double Encryption and whether Browser Access or Source IP Anchoring is also set on it.
4. Whether the DoubleEncryption field of the log matches the segment setting.
5. Whether a client application is rejecting the certificate while the ZPA side completed, which is not shown to be diagnosable from the log.

Not known (open gaps):
- Handshake failures on double-encrypted segments [gap:zpa.troubleshooting.certificates:connector-handshake-failures]: settled by lab-test or support-ticket
- Certificate-pinned client applications [gap:zpa.troubleshooting.certificates:pinned-clients]: settled by operator-experience or lab-test
- Browser Access certificate warnings and policy [gap:zpa.troubleshooting.certificates:browser-access-cert-warning-policy]: settled by lab-test

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom): For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- interacts-with references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring): Double Encryption cannot be enabled when Browser Access or Source IP Anchoring is selected for any application, and should be disabled for extranet application segments. [zpa.app-segments.settings:double-encryption-exclusions]
- links-to references/_meta/text/zpa/zpa.browser-access.hostnames.md (External versus internal hostname for a Browser Access application)
