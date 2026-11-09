# ZPA Emergency Access (zpa.emergency-access)
Also called: emergency access; zpa emergency access; break glass pra access; third party time-bound access zpa; emergency access users okta

Emergency Access is for third-party users who have no account in the tenant's own identity setup. Questions about it come down to five things, in this order.

1. **Is it enabled?** Limited availability, the settings and Microtenant rules: [Configuring Emergency Access: availability, settings, authentication domains, Microtenants](kb:zpa.emergency-access.configuration).
2. **Where does the user live, and how do they sign in?** [Emergency Access identity: where users live, which IdPs, and how they sign in](kb:zpa.emergency-access.identity).
3. **What state is the user in?** [Emergency Access Users page: statuses, dates and actions](kb:zpa.emergency-access.users).
4. **What does it cover?** PRA only, approvals, audit: [What Emergency Access covers: PRA only, approvals, audit and what stays unverified](kb:zpa.emergency-access.scope).
5. **Which calls?** [Emergency Access through the API, the Python SDK and Terraform](kb:zpa.emergency-access.api-surface).

Area: zpa.emergency-access, its subjects in references/_meta/spine/zpa/zpa.emergency-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.emergency-access.configuration.md (Configuring Emergency Access: availability, settings, authentication domains, Microtenants): Emergency Access is in limited availability, and Zscaler Support enables it for an organization. [zpa.emergency-access.configuration:limited-availability]
- depends-on references/_meta/text/zpa/zpa.emergency-access.identity.md (Emergency Access identity: where users live, which IdPs, and how they sign in): The IdP shown on the Emergency Access page is the IdP that has Use with Arbitrary Domains enabled, and the field is read-only. [zpa.emergency-access.identity:idp-arbitrary-domains]
- logged-in references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled): The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types]
- scoped-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry): Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]
- links-to references/_meta/text/zpa/zpa.emergency-access.api-surface.md (Emergency Access through the API, the Python SDK and Terraform)
- links-to references/_meta/text/zpa/zpa.emergency-access.scope.md (What Emergency Access covers: PRA only, approvals, audit and what stays unverified)
- links-to references/_meta/text/zpa/zpa.emergency-access.users.md (Emergency Access Users page: statuses, dates and actions)
