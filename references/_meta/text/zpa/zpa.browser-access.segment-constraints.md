# Browser Access applications on a segment: per-application keys and where the constraints live (zpa.browser-access.segment-constraints)
Also called: browser access double encryption; browser access multimatch; browser access port range; browser access tcp only; is_cname_enabled browser access; browser access sipa; clientlessApps fields; why is double encryption failing on this segment

A segment that hosts a Browser Access application is constrained by settings that other subjects hold, and each clientless application carries its own set of keys.

**Per-application keys.** Each clientless (Browser Access) application on a segment includes, in the Python SDK model, the keys id, appId, name, description, enabled, certificateId, certificateName, applicationPort, applicationProtocol, domain, hidden, localDomain, portal, trustUntrustedCert, allowOptions, cname, microtenantId, microtenantName, extDomain, extDomainName and extLabel, among others such as appResource. [zpa.browser-access.segment-constraints:clientless-app-fields]

**Settings that apply to a segment hosting Browser Access.** Double Encryption cannot be enabled with Browser Access ([Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings)). For Source IP Anchoring (open) and the CNAME setting (not applicable to Browser Access) see [Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings). The TCP port range and FQDN-only rules are in [What an application segment can contain: entries, wildcards and ports](kb:zpa.app-segments.definition). Whether Multimatch applies to Browser Access differs between captures of the article: [Multimatch prerequisites, restrictions and App Connector selection](kb:zpa.app-segments.multimatch-requirements).

Port and clientless-application write ordering in Terraform is in [Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform](kb:zpa.browser-access.tooling). The certificate and hostname choices are in [Certificates for Browser Access applications: wildcards, managed and custom](kb:zpa.browser-access.certificates).

What to check:
1. Which key of the clientless application a setting maps to before reading it back from an API or SDK object.

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring): Double Encryption cannot be enabled when Browser Access or Source IP Anchoring is selected for any application, and should be disabled for extranet application segments. [zpa.app-segments.settings:double-encryption-exclusions]
- depends-on references/_meta/text/zpa/zpa.app-segments.definition.md (What an application segment can contain: entries, wildcards and ports): Applications defined for Browser Access can only be FQDNs. [zpa.app-segments.definition:ba-fqdn-only]
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom), from zpa.browser-access: For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- decided-by references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria), from zpa.browser-access: An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type]
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say), from zpa.browser-access: The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes), from zpa.browser-access: SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- links-to references/_meta/text/zpa/zpa.app-segments.multimatch-requirements.md (Multimatch prerequisites, restrictions and App Connector selection)
- links-to references/_meta/text/zpa/zpa.browser-access.tooling.md (Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform)
