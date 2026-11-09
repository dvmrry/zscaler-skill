# Browser Access in LSS: log type and identity field (zpa.browser-access.logs)
Also called: browser access lss; zpn_http_trans_log; web browser log type; browser access log source type; browser access nameid; browser_access source log

Browser Access has its own LSS log type, distinct from the user activity log.

**Log type.** The LSS source log type for Browser Access is zpn_http_trans_log, shown as Web Browser, and the Python SDK maps browser_access to it. User activity is a separate source log type, zpn_trans_log. [zpa.browser-access.logs:lss-source-log-type] The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]

What to check:
1. Which LSS source log type a Browser Access question needs, since user activity is a different type.
2. Whether the identity in a Browser Access record is the SAML NameID, which differs from the user activity record.

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say): The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom), from zpa.browser-access: For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- decided-by references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria), from zpa.browser-access: An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes), from zpa.browser-access: SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
