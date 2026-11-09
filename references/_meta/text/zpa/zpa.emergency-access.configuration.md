# Configuring Emergency Access: availability, settings, authentication domains, Microtenants (zpa.emergency-access.configuration)
Also called: emergency access limited availability; emergency authentication domains; emergency access page not visible microtenant; emergency access settings okta group; remove authentication domain privileged approvals; emergency access default microtenant

Setting up the feature is a gate, then identity, then the Emergency Access page. Emergency Access is in limited availability, and Zscaler Support enables it for an organization. [zpa.emergency-access.configuration:limited-availability] Emergency access provisions third-party users such as contractors and vendors for access to time-bound resources, and builds on the IdPs available in Private Access with arbitrary authentication domains. [zpa.emergency-access.configuration:purpose]

**Settings.** The Emergency Access page has an IdP (read-only), an IdP API Token, a User Group Name where new users are created, and Emergency Authentication Domains. [zpa.emergency-access.configuration:settings] The IdP and token requirements are in [Emergency Access identity: where users live, which IdPs, and how they sign in](kb:zpa.emergency-access.identity).

**Authentication domains.** If Emergency Authentication Domains are set, only those email domains can be used when adding a privileged approval; if none are set, users can be created from any authentication domain that is not an existing primary or secondary authentication domain. [zpa.emergency-access.configuration:domains-semantics] Removing an email domain from the Emergency Authentication Domains field does not remove the privileged approvals created with it. [zpa.emergency-access.configuration:domain-removal] How to take back an approval whose domain was removed is open [gap:zpa.emergency-access.configuration:approval-removal-paths].

**Creating users.** A user designated for emergency access is created within the emergency access IdP when a privileged approval is created for that user. [zpa.emergency-access.configuration:create-with-approval]

**Microtenants.** Within a Microtenant, only the Default Microtenant can configure emergency access, and Microtenants with Privileged Approvals disabled can still create or edit emergency access users. [zpa.emergency-access.configuration:microtenant-rules] The Emergency Access and Emergency Access Users pages are not visible for Microtenants with Privileged Approvals disabled, the default for that Microtenant field. [zpa.emergency-access.configuration:microtenant-privileged-approvals] The two do not obviously fit together [divergence:zpa.emergency-access.configuration:microtenant-user-access].

The users page and statuses: [Emergency Access Users page: statuses, dates and actions](kb:zpa.emergency-access.users). What the feature covers and does not: [What Emergency Access covers: PRA only, approvals, audit and what stays unverified](kb:zpa.emergency-access.scope).

What to check:
1. Whether the feature has been enabled by Zscaler Support, since the page does not exist otherwise.
2. Whether the tenant is the Default Microtenant, and whether the Microtenant has Privileged Approvals enabled.
3. The Emergency Authentication Domains list against the domain used on a privileged approval.

Sources disagree (name both sides):
- Microtenants with Privileged Approvals disabled can create or edit emergency access users, yet the Emergency Access Users page is not visible to them. [divergence:zpa.emergency-access.configuration:microtenant-user-access]
  - zscaler-help: Emergency access users can be created or edited by Microtenants that have Privileged Approvals disabled.
  - zscaler-help: The Emergency Access Users page is not visible within a Microtenant that has Privileged Approvals disabled.
  Impact: It is not stated how such a Microtenant creates or edits users without the page (possibly by API or from the Default Microtenant). Do not tell an admin in that Microtenant to use the page.

Not known (open gaps):
- How an approval created with a removed domain is ended [gap:zpa.emergency-access.configuration:approval-removal-paths]: settled by lab-test or support-ticket

Area: zpa.emergency-access, its subjects in references/_meta/spine/zpa/zpa.emergency-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.emergency-access.identity.md (Emergency Access identity: where users live, which IdPs, and how they sign in): The IdP shown on the Emergency Access page is the IdP that has Use with Arbitrary Domains enabled, and the field is read-only. [zpa.emergency-access.identity:idp-arbitrary-domains]
- logged-in references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled), from zpa.emergency-access: The admin audit log lists Emergency Access and Emergency Access User as resource types. [zpa.emergency-access.scope:audit-resource-types]
- scoped-by references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry), from zpa.emergency-access: Emergency access users have permissions limited to privileged approvals in the IdP enabled for emergency access. [zpa.emergency-access.scope:scoped-to-approvals]
- links-to references/_meta/text/zpa/zpa.emergency-access.scope.md (What Emergency Access covers: PRA only, approvals, audit and what stays unverified)
- links-to references/_meta/text/zpa/zpa.emergency-access.users.md (Emergency Access Users page: statuses, dates and actions)
