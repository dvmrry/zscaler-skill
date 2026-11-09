# ZIA users, groups and departments: shape and limits (zia.ad-integration.identity-objects)
Also called: 128 groups per user; group limit; user can belong to one department; department limit; user id format; 140K groups; 1400K users; name length limits

Whatever the provisioning method, the result is the same three objects, and the same limits apply.

**Users.** A user ID must be in the form of an email address. It need not be a valid address, but it must be unique and its domain must belong to the organization. [zia.ad-integration.identity-objects:user-id-form] The Add User form's User ID field allows alphanumeric characters and certain special characters up to a maximum of 127 characters and corresponds to the email field in the API, whose data validation supports a broader range of characters. The User Name field allows UTF-8 characters up to a maximum of 127 characters, while the limits table gives 128. The Comments content cannot exceed 10,240 characters. [zia.ad-integration.identity-objects:add-user-field-limits] The Users page lists, among other columns, a User Risk Profile that displays the User Risk Score generated from DLP violations, risky user behavior, unsanctioned cloud application usage and other suspicious factors; the column appears only when Enable Real-Time Risk Score Updates is selected in Advanced Settings, and a score higher than Low can be reset to Low. The page also lists predefined groups created by the Zscaler service. [zia.ad-integration.identity-objects:users-page-contents] Creating an admin with an entitlement to the Internet & SaaS service also creates a corresponding user, and the Delete option is not available for these user entries; they are deleted by deleting the corresponding admin accounts. Disabling a user with the same user name as an admin also disables the admin. [zia.ad-integration.identity-objects:admin-linked-users]

**Departments.** Unlike groups, a user can belong to only one department. The article says that a user belonging to multiple departments would be reported upon multiple times, and that if users belong to more than one department, administrator scopes defined by department can cause conflicts. [zia.ad-integration.identity-objects:one-department] The Add User page says the Zscaler service uses groups when it applies policies and departments for reporting purposes, and that departments are used in policies and reports. [zia.ad-integration.identity-objects:groups-departments-use]

**Groups.** The help articles state that a user can belong to up to 128 groups and that directory synchronization handles up to 128 groups per user (the limits table says 127 by default, see divergence). [zia.ad-integration.identity-objects:groups-per-user] A company can have up to 140K groups. A user can be associated with maximum 127 groups via API and the Zscaler Admin Console; however, when a user is created or updated via Directory Sync or SCIM, they can be associated with more than 127 groups. The same Add User page also says a user can belong to up to 128 groups. [zia.ad-integration.identity-objects:groups-by-write-path] The cap is given as 16, 127, 128 or more than 127 depending on the page and on how the user is written [divergence:zia.ad-integration.identity-objects:groups-per-user-cap]. On the Add Groups page a group name can contain up to 128 characters, and group and department comments cannot exceed 10,240 characters. [zia.ad-integration.identity-objects:group-name-and-comment-limits] What happens past the cap is open [gap:zia.ad-integration.identity-objects:over-cap-behavior].

**Other sources.** Groups and departments can also be added when configuring policies, and from the Groups and Departments pages by CSV import, not only by provisioning. [zia.ad-integration.identity-objects:added-in-policy]

**Sizes.** Per organization the limits table lists 1,400K users, 140K groups and 140K departments. [zia.ad-integration.identity-objects:org-limits] The users-per-organization figure differs between pages: [zia.ad-integration.hosted-user-database:users-per-org](kb:zia.ad-integration.hosted-user-database:users-per-org). The limits table gives a user name of at most 128 characters, a department name of at most 128 characters and a group name of 128 characters or 127 bytes. [zia.ad-integration.identity-objects:name-lengths] The user name length differs between pages [divergence:zia.ad-integration.identity-objects:user-name-length]. Per-rule caps (for example 32 users, groups or departments on a rule) belong to each rule type, see [Firewall rule, criteria and group limits](kb:zia.firewall.limits) and [Forwarding Control rule criteria, limits and ordering](kb:zia.forwarding-control.rules).

The SCIM attribute names that populate these fields are in [ZIA SCIM attribute mapping](kb:zia.scim.attribute-mapping), and how SCIM groups and departments land is in [How SCIM groups and departments land in ZIA](kb:zia.scim.groups-and-departments).

What to check:
1. Whether the user name or user count in question sits in a range the pages disagree on, before stating one limit.
2. Whether the user's group count is under the 128-group cap before a rule depends on the user's membership in many groups.
3. Whether the user really has a single department.
4. Whether the group or department already exists before a rule is scoped to it.

Sources disagree (name both sides):
- The Add User and CSV import pages give 127 characters for the User Name field and the limits table gives 128. [divergence:zia.ad-integration.identity-objects:user-name-length]
  - zscaler-help: The User Name field allows UTF-8 characters up to a maximum of 127 characters.
  - zscaler-help: The CSV import page gives the same 127 characters.
  - zscaler-help: The limits table gives a User Name of 128 characters.
  Impact: A user name of exactly 128 characters is inside one limit and outside the other.
- Captured pages give 16, 127, 128 and more than 127 groups per user, depending on the page and how the user is written. [divergence:zia.ad-integration.identity-objects:groups-per-user-cap]
  - zscaler-help: The directory synchronization article says the service synchronizes up to 16 groups per user.
  - zscaler-help: A user can be associated with maximum 127 groups via the API and the Admin Console, but with more than 127 when created or updated via Directory Sync or SCIM.
  - zscaler-help: The same Add User page also says a user can belong to up to 128 groups.
  - zscaler-help: The SCIM article says the total number of groups associated with a single user cannot exceed 128.
  - zscaler-help: A user can belong to up to 128 groups.
  - zscaler-help: Groups per User is 127 groups by default, which also reads as a default that can be changed.
  Impact: A user with exactly 128 groups is inside one limit and outside the other, and 'by default' leaves open whether Support can raise it. The split by write path (127 by API or console, more by sync or SCIM) fits a 128 SCIM cap but not the 16 in the synchronization article. Do not state any one number as certain for an edge case.

Not known (open gaps):
- What happens when a push or sync exceeds the group cap [gap:zia.ad-integration.identity-objects:over-cap-behavior]: settled by lab-test or support-ticket. Blocks: advice on large-enterprise group sprawl

Area: zia.ad-integration, its subjects in references/_meta/spine/zia/zia.ad-integration.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity), from zia.ad-integration: Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- interacts-with references/_meta/text/zia/zia.authentication.unauthenticated-traffic.md (What happens to traffic with no user identity), from zia.ad-integration: Enforcing policy by department, group and user, and reporting by user, requires users, groups and departments to be provisioned into the Zscaler database first and authentication to be enabled. With authentication disabled at a known location the service does not know who the users are and applies the location's policies. [zia.ad-integration:identity-needed]
- interacts-with references/_meta/text/zia/zia.scim.setup.md (Enabling ZIA SCIM: prerequisites, base URL and token), from zia.ad-integration: SCIM provisioning is not supported with Active Directory or OpenLDAP user repositories. To migrate from directory synchronization, enable Disable Directory Sync and Enable SCIM Provisioning on the Authentication Default Settings page. [zia.scim.setup:not-with-directory]
- links-to references/_meta/text/zia/zia.ad-integration.hosted-user-database.md (Hosted User Database: adding users by hand, importing users, groups and departments by CSV, and one-time tokens and links)
- links-to references/_meta/text/zia/zia.firewall.limits.md (Firewall rule, criteria and group limits)
- links-to references/_meta/text/zia/zia.forwarding-control.rules.md (Forwarding Control rule criteria, limits and ordering)
- links-to references/_meta/text/zia/zia.scim.attribute-mapping.md (ZIA SCIM attribute mapping)
- links-to references/_meta/text/zia/zia.scim.groups-and-departments.md (How SCIM groups and departments land in ZIA)
