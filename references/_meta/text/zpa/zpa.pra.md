# Privileged Remote Access: what it is and where each question goes (zpa.pra)
Also called: privileged remote access; pra; clientless rdp; clientless ssh; clientless vnc; pra vs browser access; does pra work without zcc; jump host bastion zpa; contractor rdp without password
Former IDs: zpa-57

PRA is the clientless path for RDP, SSH and VNC; Browser Access is the clientless path for web applications. This subject walks the PRA area and sends each question to the subject that holds it.

**What it is.** Privileged Remote Access is a clientless remote desktop gateway that lets end users connect to servers, jump hosts, bastion hosts or desktops using RDP, SSH, VNC and RealVNC from a modern browser, without installing Zscaler Client Connector or any browser plugin. [zpa.pra:definition] PRA is meant to give third parties such as vendors, contractors and suppliers, IT administrators and remote employees controlled access to privileged servers and applications, for specific consoles and a specific time frame. [zpa.pra:third-party-access] An admin can supply configured credentials for short-term end users, or prompt end users to enter their own credentials when they use a privileged console. [zpa.pra:credential-options]

1. **What are the parts?** Portals, consoles, approvals, credentials, policies and application segments, and their limits: [PRA components: portals, consoles, approvals, credentials, policies and limits](kb:zpa.pra.components); the privileged portal's fields, certificate and what end users see in the PRA Portal: [PRA privileged portals and the PRA Portal: fields, certificates and DNS, what end users see, and console login](kb:zpa.pra.portals); the portals policy that sets file and approval permissions in the PRA Portal: [PRA portals policy: file, inspection and approval permissions in the PRA Portal](kb:zpa.pra.portals-policy).
2. **How do users get credentials?** Credential types, pools and the credentials policy: [PRA credentials, credential pools and the credentials policy](kb:zpa.pra.credentials); discovery, providers, the Managed, Discovered and Ignored pages and rotation: [PRA managed credentials: discovery, credential providers, the Managed, Discovered and Ignored lifecycle, and credential classes](kb:zpa.pra.managed-credentials).
3. **How is access time-limited?** Requests, approvers and windows: [PRA approvals: requesting, reviewing and expiry](kb:zpa.pra.approvals).
4. **What can users do in a session?** File transfer, clipboard, recording and session sharing permissions: [PRA consoles policy: file transfer, clipboard, recording and sharing](kb:zpa.pra.consoles-policy); file transfer mechanics and the PRA File Transfer System: [PRA file transfer: in-console transfer, the PRA File Transfer System and the Sandbox integration](kb:zpa.pra.file-transfer); inviting participants and passing control: [PRA live session sharing: participants, invitations, control and ejection](kb:zpa.pra.live-sessions).
5. **Where are recordings and who can play them?** [PRA session recordings: status, transcoding, playback and sharing](kb:zpa.pra.session-recording).
6. **How is the application segment set up?** [PRA application segments: protocols, ports, connection security and constraints](kb:zpa.pra.app-segments), with access policy and step-up in [Access policy for PRA: privileged approval, step-up and rule criteria](kb:zpa.pra.access-policy).
7. **How do SDKs and Ansible handle PRA objects?** [PRA operations in the Python SDK and Ansible approvals](kb:zpa.pra.tooling) and [How the Ansible Browser Access, PRA and Inspection modules reconcile child applications](kb:zpa.app-segments.ansible-children). Terraform deletion and credential defects are in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths), [What the ZPA Terraform provider sends and loses when writing policy rules](kb:zpa.terraform.policy-rule-writes) and [How the Zscaler Terraform providers store, log, and send secrets](kb:shared.terraform.credential-handling).

**Open.** Whether the features exist outside PRA is open [gap:zpa.pra:absent-from-base-zpa]. A comparison with standard ZPA access is open [gap:zpa.pra:alternatives-guidance], and so is a comparison with dedicated PAM products [gap:zpa.pra:pam-comparison].

SSH in ZIA is covered in [SSH traffic in ZIA: what is and is not inspected](kb:zia.ssh-control); the web-application path is [What Browser Access requires of the browser, server and session](kb:zpa.browser-access.requirements).

What to check:
1. Whether the need is a web application (Browser Access) or an RDP, SSH or VNC session (PRA).
2. Whether a comparison question rests on the unverified guidance about standard ZPA access or PAM products.

Not known (open gaps):
- Whether recording, approvals and credential pooling exist outside PRA [gap:zpa.pra:absent-from-base-zpa]: settled by source-read or lab-test
- Choosing between standard ZPA access, Browser Access and PRA [gap:zpa.pra:alternatives-guidance]: settled by source-read or operator-experience
- How PRA relates to dedicated privileged access management products [gap:zpa.pra:pam-comparison]: settled by source-read

Area: zpa.pra, its subjects in references/_meta/spine/zpa/zpa.pra.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.browser-access.requirements.md (What Browser Access requires of the browser, server and session): SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- decided-by references/_meta/text/zpa/zpa.pra.access-policy.md (Access policy for PRA: privileged approval, step-up and rule criteria): In an access policy rule, the Allow with Privileged Approval option is available only to tenants that have PRA and is aimed at PRA-enabled application segments. [zpa.pra.access-policy:allow-with-privileged-approval]
- scoped-by references/_meta/text/zpa/zpa.pra.app-segments.md (PRA application segments: protocols, ports, connection security and constraints): Enabling Privileged Remote Access for an application means choosing a protocol (VNC, RealVNC, SSH or RDP) and a port; the defaults are 5900 for VNC and RealVNC, 3389 for RDP and 22 for SSH. [zpa.pra.app-segments:enable-and-defaults]
- decided-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry): After the approved window ends the user loses access to the console. Approvals whose window has ended show as Expired, upcoming ones show as Future, and an admin can purge expired approvals to clean up the table. [zpa.pra.approvals:window-expiry]
- depends-on references/_meta/text/zpa/zpa.pra.components.md (PRA components: portals, consoles, approvals, credentials, policies and limits): A privileged portal must exist before a privileged console is created, because a console is assigned to existing portals, and the same console can appear in more than one portal. [zpa.pra.components:portal-before-console]
- decided-by references/_meta/text/zpa/zpa.pra.consoles-policy.md (PRA consoles policy: file transfer, clipboard, recording and sharing): A consoles policy rule is assigned to selected privileged consoles and controls file uploads, file downloads, clipboard copy and paste, session recording, session sharing and joining live sessions. The rule's criteria choose application segments and segment groups, with SAML and SCIM or session and user attributes. [zpa.pra.consoles-policy:scope]
- decided-by references/_meta/text/zpa/zpa.pra.credentials.md (PRA credentials, credential pools and the credentials policy): A privileged credentials policy rule assigns either one privileged credential or one credential pool to consoles. When a user opens a console with such a policy they reach it without logging in, and deleting the policy removes the assignment so the console prompts for a login again. [zpa.pra.credentials:credentials-policy-assigns]
- decided-by references/_meta/text/zpa/zpa.pra.portals-policy.md (PRA portals policy: file, inspection and approval permissions in the PRA Portal): Portals policy rules allow deleting uploaded files, uploading inspected files, uploading inspected Internet & SaaS Sandbox files, accessing uninspected files in the PRA File Transfer System pages, and requesting and reviewing privileged approvals on the My Approvals and My Requests pages. Portals policies allow users to access the PRA File Transfer System and My Approvals pages in the PRA Portal they assign the rule to. [zpa.pra.portals-policy:scope]
- logged-in references/_meta/text/zpa/zpa.pra.session-recording.md (PRA session recordings: status, transcoding, playback and sharing): Session recording is enabled through the Record Sessions setting of a consoles policy. A user in a recorded console sees a Recording notification at the top of the console window, and the recording ends when the user ends the session. [zpa.pra.session-recording:recording-enabled-by-policy]
- links-to references/_meta/text/shared/shared.terraform.credential-handling.md (How the Zscaler Terraform providers store, log, and send secrets)
- links-to references/_meta/text/zia/zia.ssh-control.md (SSH traffic in ZIA: what is and is not inspected)
- links-to references/_meta/text/zpa/zpa.app-segments.ansible-children.md (How the Ansible Browser Access, PRA and Inspection modules reconcile child applications)
- links-to references/_meta/text/zpa/zpa.pra.file-transfer.md (PRA file transfer: in-console transfer, the PRA File Transfer System and the Sandbox integration)
- links-to references/_meta/text/zpa/zpa.pra.live-sessions.md (PRA live session sharing: participants, invitations, control and ejection)
- links-to references/_meta/text/zpa/zpa.pra.managed-credentials.md (PRA managed credentials: discovery, credential providers, the Managed, Discovered and Ignored lifecycle, and credential classes)
- links-to references/_meta/text/zpa/zpa.pra.portals.md (PRA privileged portals and the PRA Portal: fields, certificates and DNS, what end users see, and console login)
- links-to references/_meta/text/zpa/zpa.pra.tooling.md (PRA operations in the Python SDK and Ansible approvals)
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
- links-to references/_meta/text/zpa/zpa.terraform.policy-rule-writes.md (What the ZPA Terraform provider sends and loses when writing policy rules)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.api.pra-wire.md (What the SDKs send and receive for ZPA Privileged Remote Access objects)
- configured-via references/_meta/text/types/zpa/pra-app-segments.md (config type)
