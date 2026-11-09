# Access policy for Browser Access: client type and unsupported criteria (zpa.browser-access.policy)
Also called: browser access client type; web browser client type; zpn_client_type_exporter; zpn_client_type_browser_isolation; browser access posture; browser access posture deny; country codes browser access; agentless user posture

Browser Access sessions are matched by client type in access policy, and the Web Browser client type limits which other criteria a rule may use.

**Targeting.** An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type] In the Terraform provider's Browser Access policy rule documentation, the CLIENT_TYPE operand value zpn_client_type_exporter is the one that enforces access via browser access to application segments, and zpn_client_type_zappl is the one for Client Connector. [zpa.browser-access.policy:exporter-operand] The Go SDK client-type list defines zpn_client_type_browser_isolation as a separate client type from zpn_client_type_exporter and zpn_client_type_zapp. [zpa.browser-access.policy:browser-isolation-client-type] What the browser-isolation value matches is open [gap:zpa.browser-access.policy:browser-isolation-operand].

**Limits on criteria.** Rules that use the Web Browser or Internet & SaaS Service Edge client types cannot also use posture profiles or trusted networks criteria, which only work with Client Connector. [zpa.browser-access.policy:no-posture-with-web-browser] The Country Codes criteria type is not supported in Browser Access or Privileged Remote Access applications. [zpa.browser-access.policy:country-codes-unsupported] How a rule that mixes posture with other client types behaves for a browser session is open [gap:zpa.browser-access.policy:posture-rule-outcome].

Session reauthentication is in [What Browser Access requires of the browser, server and session](kb:zpa.browser-access.requirements).

What to check:
1. Which client type value the rule or Terraform resource uses for browser sessions, and that the provider documents the exporter value for it.
2. Whether a rule intended for browser users also carries posture, trusted network or country criteria that the help says do not apply.
3. Whether a posture-related deny for a browser session can be explained by a source or is the unverified outcome.

Not known (open gaps):
- What a Browser Access session gets from a rule that has a posture condition [gap:zpa.browser-access.policy:posture-rule-outcome]: settled by lab-test
- What zpn_client_type_browser_isolation matches [gap:zpa.browser-access.policy:browser-isolation-operand]: settled by lab-test

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom), from zpa.browser-access: For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say), from zpa.browser-access: The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes), from zpa.browser-access: SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- interacts-with references/_meta/text/zpa/zpa.pra.access-policy.md (Access policy for PRA: privileged approval, step-up and rule criteria): The Country Codes criteria type is not supported in Browser Access or Privileged Remote Access applications. [zpa.browser-access.policy:country-codes-unsupported]
- links-to references/_meta/text/zpa/zpa.browser-access.requirements.md (What Browser Access requires of the browser, server and session)
