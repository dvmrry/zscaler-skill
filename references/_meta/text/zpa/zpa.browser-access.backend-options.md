# Use Untrusted Certificates and unauthenticated OPTIONS for Browser Access (zpa.browser-access.backend-options)
Also called: trust_untrusted_cert; allow_options; trustUntrustedCert; allowOptions; use untrusted certificates; allow unauthenticated options request; browser access cors preflight; browser access untrusted backend certificate
Former IDs: zpa-36

Two per-application settings decide whether Browser Access tolerates an unverifiable backend certificate and whether it forwards a CORS preflight.

**Untrusted certificates.** For an HTTPS Browser Access application the Use Untrusted Certificates setting is selected by default. If it is not selected, requests that reach the application through an untrusted web server certificate are not successful. [zpa.browser-access.backend-options:use-untrusted-certificates]

**Preflight requests.** Allow Unauthenticated OPTIONS Request lets Private Access forward an unauthenticated HTTP preflight OPTIONS request from the browser to the application. Private Access forwards only valid OPTIONS requests that include the Access-Control-Request-Headers, Access-Control-Request-Method and Origin headers. [zpa.browser-access.backend-options:allow-unauthenticated-options] Private Access accepts CORS requests issued from one valid Browser Access domain to another. The application server must use with-credentials mode so the browser passes cookies, and must allow requests whose Origin header is null or a valid Browser Access application. [zpa.browser-access.backend-options:cors-between-ba-domains]

**API flags.** The clientless application object in the Python SDK carries trustUntrustedCert and allowOptions flags, which correspond by name to the Use Untrusted Certificates and Allow Unauthenticated OPTIONS Request settings. [zpa.browser-access.backend-options:api-field-names] Whether those flags are exactly these settings is open [gap:zpa.browser-access.backend-options:field-setting-mapping].

The certificate error these settings relate to is in [External versus internal hostname for a Browser Access application](kb:zpa.browser-access.hostnames).

What to check:
1. Whether the application is HTTPS and the Use Untrusted Certificates setting is selected, since requests through an untrusted certificate fail without it.
2. Whether a failing preflight carries the three required headers, and whether Allow Unauthenticated OPTIONS Request is on.
3. Whether an API or Terraform value of the two flags is read as the UI setting, which is inferred by name only.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.browser-access.backend-options:api-field-names] Tier B: The SDK model is a passthrough and the help page names the settings by label. The match between the API flags and the UI settings is by name only; see the field-setting-mapping gap.

Not known (open gaps):
- API flags trustUntrustedCert and allowOptions versus the UI settings [gap:zpa.browser-access.backend-options:field-setting-mapping]: settled by lab-test or source-read

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom), from zpa.browser-access: For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- decided-by references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria), from zpa.browser-access: An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type]
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say), from zpa.browser-access: The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes), from zpa.browser-access: SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- links-to references/_meta/text/zpa/zpa.browser-access.hostnames.md (External versus internal hostname for a Browser Access application)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/browser-access.md (config type)
- see-also references/_meta/text/zpa/zpa.browser-access.requirements.md (What Browser Access requires of the browser, server and session)
