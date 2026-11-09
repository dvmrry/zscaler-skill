# ZPA certificates: enrollment (CA) certificates and web server certificates (zpa.certificates)
Also called: private access certificates; zpa certificate types; enrollment certificate vs web server certificate

Private Access has two kinds of uploaded certificate, and a question about one is not answered by the other:

1. **Enrollment (CA) certificates: which ones sign Client Connector and the software components, and how are they made?** Zscaler-issued and own-CA workflows, preloaded certificates, CSRs, chain upload and limits: [Enrollment (CA) certificates in Private Access](kb:zpa.certificates.enrollment).
2. **Web server certificates: what does a Browser Access application present?** HTTPS or HTTP, upload rules, CSR subject, wildcards and Zscaler-managed certificates: [Certificates for Browser Access applications: wildcards, managed and custom](kb:zpa.browser-access.certificates).
3. **Why does a certificate or encryption failure occur?** [Certificate and encryption failures: Browser Access, double encryption, pinned clients](kb:zpa.troubleshooting.certificates).
4. **How do the API and SDKs model them?** [Enrollment and Browser Access certificate API: wire keys, paths and client quirks](kb:zpa.api.certificates-wire).

The components that enroll with these certificates are in [ZPA software components: Manager software, OAuth enrollment, network settings and STIG images](kb:zpa.software-components).

Area: zpa.certificates, its subjects in references/_meta/spine/zpa/zpa.certificates.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.api.certificates-wire.md (Enrollment and Browser Access certificate API: wire keys, paths and client quirks)
- links-to references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom)
- links-to references/_meta/text/zpa/zpa.certificates.enrollment.md (Enrollment (CA) certificates in Private Access)
- links-to references/_meta/text/zpa/zpa.software-components.md (ZPA software components: Manager software, OAuth enrollment, network settings and STIG images)
- links-to references/_meta/text/zpa/zpa.troubleshooting.certificates.md (Certificate and encryption failures: Browser Access, double encryption, pinned clients)
