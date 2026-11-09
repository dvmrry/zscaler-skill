# Browser Access: clientless ZPA access to web applications (zpa.browser-access)
Also called: browser access; clientless access; clientless zpa web app; give contractor access without zcc; byod zpa web app; browser access overview; ba app segment; browser access vs zcc vs pra

Browser Access is ZPA's clientless path for web applications. A question about it usually falls into one of the areas below, and each is answered in its own subject.

1. **Is Browser Access the right path?** What it carries, what the browser and server must support, and how sessions and reauthentication work: [What Browser Access requires of the browser, server and session](kb:zpa.browser-access.requirements). RDP, SSH and VNC go to [Privileged Remote Access: what it is and where each question goes](kb:zpa.pra).
2. **Why does the user see a certificate error?** External versus internal hostname: [External versus internal hostname for a Browser Access application](kb:zpa.browser-access.hostnames), with the untrusted-certificate setting in [Use Untrusted Certificates and unauthenticated OPTIONS for Browser Access](kb:zpa.browser-access.backend-options).
3. **Which certificate covers which name?** Wildcards, managed and custom certificates and the CNAME: [Certificates for Browser Access applications: wildcards, managed and custom](kb:zpa.browser-access.certificates).
4. **What can the hosting segment not use?** Double Encryption, ports and CNAME resolution, whether Multimatch applies (an earlier version of the article said so; the current one does not), and the per-application keys: [Browser Access applications on a segment: per-application keys and where the constraints live](kb:zpa.browser-access.segment-constraints).
5. **How do access rules treat browser sessions?** Client type and the criteria that do not apply: [Access policy for Browser Access: client type and unsupported criteria](kb:zpa.browser-access.policy).
6. **Where do users find their applications?** User portals, their certificates, links and acceptable use policy: [Private Access user portals and portal links: what they are, how users reach them, certificates and DNS, links, download links and the acceptable use policy](kb:zpa.user-portal).
7. **Where are the logs?** [Browser Access in LSS: log type and identity field](kb:zpa.browser-access.logs).
8. **How do tools write the segment?** [Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform](kb:zpa.browser-access.tooling), with Ansible child handling in [How the Ansible Browser Access, PRA and Inspection modules reconcile child applications](kb:zpa.app-segments.ansible-children). Terraform lifecycle defects are in [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle).

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom): For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- decided-by references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria): An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes): SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say): The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- links-to references/_meta/text/zpa/zpa.app-segments.ansible-children.md (How the Ansible Browser Access, PRA and Inspection modules reconcile child applications)
- links-to references/_meta/text/zpa/zpa.browser-access.backend-options.md (Use Untrusted Certificates and unauthenticated OPTIONS for Browser Access)
- links-to references/_meta/text/zpa/zpa.browser-access.hostnames.md (External versus internal hostname for a Browser Access application)
- links-to references/_meta/text/zpa/zpa.browser-access.logs.md (Browser Access in LSS: log type and identity field)
- links-to references/_meta/text/zpa/zpa.browser-access.requirements.md (What Browser Access requires of the browser, server and session)
- links-to references/_meta/text/zpa/zpa.browser-access.segment-constraints.md (Browser Access applications on a segment: per-application keys and where the constraints live)
- links-to references/_meta/text/zpa/zpa.browser-access.tooling.md (Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
- links-to references/_meta/text/zpa/zpa.user-portal.md (Private Access user portals and portal links: what they are, how users reach them, certificates and DNS, links, download links and the acceptable use policy)
