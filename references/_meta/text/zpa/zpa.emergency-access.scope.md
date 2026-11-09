# What Emergency Access covers: PRA only, approvals, audit and what stays unverified (zpa.emergency-access.scope)
Also called: emergency access pra only; emergency access zcc zia; emergency access audit logs; emergency access bypass policy; emergency access privileged approval scope; emergency access browser access

Emergency access reaches one kind of access. Emergency access is only supported for Privileged Remote Access. [zpa.emergency-access.scope:pra-only] Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]

**How it is bounded.** One existing IdP is designated for emergency access, and a privileged approval can select it to apply its date and time rules to the emergency access users, who are managed in an Okta IdP and viewed on the Emergency Access Users page. [zpa.emergency-access.scope:one-idp] [A privileged approval is a set start and end date and time during which an end user has access to a privileged console. After the window expires the user can no longer access the console.](kb:zpa.pra.components:approvals-def)

**Client.** [Privileged Remote Access is a clientless remote desktop gateway that lets end users connect to servers, jump hosts, bastion hosts or desktops using RDP, SSH, VNC and RealVNC from a modern browser, without installing Zscaler Client Connector or any browser plugin.](kb:zpa.pra:definition) An emergency access user needs no Client Connector, because emergency access is PRA-only and PRA is clientless. [zpa.emergency-access.scope:no-client-connector] Whether ZIA is in the path or its policies apply to these sessions is open [gap:zpa.emergency-access.scope:zia-path].

**Policy.** Whether PRA capability, credential and portal policies stay in effect for emergency access users, and whether there is any general access path, is open [gap:zpa.emergency-access.scope:policy-still-applies].

**Audit.** The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types] Whether user activations and authentications are logged is open [gap:zpa.emergency-access.scope:authentication-logging].

Settings and gating: [Configuring Emergency Access: availability, settings, authentication domains, Microtenants](kb:zpa.emergency-access.configuration).

What to check:
1. That the access requested is Privileged Remote Access, not general ZPA application access.
2. The privileged approval that bounds the user's access window.
3. Admin Audit Log entries by resource type Emergency Access and Emergency Access User for configuration changes.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.emergency-access.scope:no-client-connector] Tier B: Derived from two articles. Neither says it for emergency access users specifically.

Not known (open gaps):
- Whether ZIA is in the path of emergency access sessions [gap:zpa.emergency-access.scope:zia-path]: settled by lab-test or support-ticket
- Whether PRA policies still apply to emergency access users [gap:zpa.emergency-access.scope:policy-still-applies]: settled by lab-test or support-ticket
- Whether emergency access activations and sign-ins are logged [gap:zpa.emergency-access.scope:authentication-logging]: settled by lab-test

Area: zpa.emergency-access, its subjects in references/_meta/spine/zpa/zpa.emergency-access.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled): The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types]
- scoped-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry): Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]
- depends-on references/_meta/text/zpa/zpa.emergency-access.configuration.md (Configuring Emergency Access: availability, settings, authentication domains, Microtenants), from zpa.emergency-access: Emergency Access is in limited availability, and Zscaler Support enables it for an organization. [zpa.emergency-access.configuration:limited-availability]
- depends-on references/_meta/text/zpa/zpa.emergency-access.identity.md (Emergency Access identity: where users live, which IdPs, and how they sign in), from zpa.emergency-access: The IdP shown on the Emergency Access page is the IdP that has Use with Arbitrary Domains enabled, and the field is read-only. [zpa.emergency-access.identity:idp-arbitrary-domains]
- links-to references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes)
- links-to references/_meta/text/zpa/zpa.pra.components.md (PRA components: portals, consoles, approvals, credentials, policies and limits)
