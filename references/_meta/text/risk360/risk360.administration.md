# Risk360 administration: Seeds Management domains, admin roles and permissions, audit logs and the Score Change Log (risk360.administration)
Also called: risk360 seeds management; risk360 external attack surface domains; risk360 admin roles; risk360 audit logs; risk360 score change log

## Setup order

The configuration guide for Risk360 has four steps: role-based administration, domains for external attack surface analysis, peer score and financial risk settings, and alerting rules that trigger when a preset threshold is reached. [risk360.administration:setup-steps] For an organization enabled with Authentication Service, Authentication Service users are assigned as Risk360 service admins: add the Risk360 admin role in Experience Center, add the users in the Authentication Service Admin Portal, then assign them a Risk360 admin role. [risk360.administration:admin-role-flow]

## Seeds Management

Seeds Management scans the added domains weekly to identify publicly exposed assets, and shows the risk quantified for them as factors on the Factors page. [risk360.administration:seed-weekly-scan] The Seeds Management page is under Administration > Legacy Admin Management > Risk360. [risk360.administration:seed-location] Up to 10 domains can be added for scanning, whether one at a time or from a CSV file. [risk360.administration:seed-domain-limit] After domains are added (singly or from a CSV file), the Risk360 service takes up to 24–48 hours to scan and analyze them. [risk360.administration:seed-scan-latency] Domains are bulk-added by downloading a CSV template, listing the domains, uploading the file and clicking Save after a successful-upload message; on an error, the domains must be in the correct format in the CSV file before reuploading. [risk360.administration:seed-csv] How subdomains and domains past the limit are handled is not stated [gap:risk360.administration:seed-scope].

## Admin roles

Zscaler provides a default super admin role with full access to Risk360, assigned to the default admin and assignable to other admins. [risk360.administration:role-default-super-admin] The About Role Management page says role assignment maintains hierarchy so an admin can't modify the settings of an admin with a broader scope, and that the Role Management page lets an admin edit a configured admin role with lesser scope. [risk360.administration:role-hierarchy] Whether an admin may edit a role of equal scope differs between the pages [divergence:risk360.administration:role-edit-scope]. Configuring a Risk360 admin role requires the proper permissions to configure a role and organizational scope. [risk360.administration:role-prerequisites] The Role Management page (Administration > Role Management > Risk360) lists each role's Full Access areas, View-Only Access areas and Name. [risk360.administration:role-page-columns]

In a Risk360 admin role, Dashboard and User Management permissions are each View Only or None; View Only allows viewing the dashboard or the User Management page respectively. [risk360.administration:role-permission-dashboard-users] In a Risk360 admin role, Administrator Management is Full, View Only or None; Full covers adding, editing and deleting admin accounts, viewing auditors, configuring password expiration and SAML single sign-on for admins, and, under Role Management, adding, editing and deleting only roles that have equal or lesser scope. [risk360.administration:role-permission-admin-mgmt] Remote Assistance Management lets admins allow Zscaler Support to log in remotely to the Zscaler Admin Console; its permission in a Risk360 role is Full, View Only or None. [risk360.administration:role-permission-remote-assistance] Which Risk360 areas Full Access and View-Only Access cover beyond these permissions is open [gap:risk360.administration:role-access-areas].

## Audit logs and the Score Change Log

Zscaler records the login name and IP address of every user who changes configuration settings; the Risk360 Audit Logs page is under Data Explorer > Audit Logs > Risk360. [risk360.administration:audit-records] Risk360 audit logs can be searched by Resource, Admin ID or Client IP and filtered by Time Range, Action, Category, Sub-Category, Interface or Result. [risk360.administration:audit-filters] Audit log entries carry Interface (UI or API based) and Result (Success, Failure or Partially Failed). [risk360.administration:audit-fields]

The Score Change Log page (Data Explorer > Risk360 > Score Change Log) records risk score changes across categories and factors and can be filtered by Change Event, Category, Factor Group or Factor. [risk360.administration:score-change-log] Each score change log row has a Change Event (override, weight or score), Risk Category (External Attack Surface, Compromise, Lateral Propagation or Data Loss), Factor Group, Factor, Notes, Previous Value and Current Value. [risk360.administration:score-change-fields] Times in the CSV downloaded from the Risk360 Audit Logs page and from the Score Change Log page are in PDT. [risk360.administration:csv-times-pdt] Retention and the console time zone are not stated on these pages [gap:risk360.administration:log-retention-timezone]. The factor and entity overrides that the audit logs capture are in [How Risk360 scores risk: the organization score, factors, asset-level risk and Monte Carlo financial estimates](kb:risk360.scoring).

What to check:
1. Whether the domains were added to Seeds Management and 24–48 hours have passed since they were added, when asking about scan results for those domains.
2. Whether the admin's role has Administrator Management or Remote Assistance Management access at the level the task needs.
3. That times in the CSV downloaded from the audit logs or the Score Change Log are in PDT.

Sources disagree (name both sides):
- The About Role Management page and the Add Role page state the scope of roles an admin can edit differently. [divergence:risk360.administration:role-edit-scope]
  - zscaler-help: An admin can edit a configured admin role with lesser scope.
  - zscaler-help: With Role Management access, an admin can add, edit and delete roles that have equal or lesser scope.
  Impact: Whether an admin can edit a role of equal scope is not settled; do not state it either way.

Not known (open gaps):
- Whether Seeds Management enumerates subdomains and what happens past 10 domains [gap:risk360.administration:seed-scope]: settled by lab-test or support-ticket
- Which Risk360 areas the Full Access and View-Only Access columns cover [gap:risk360.administration:role-access-areas]: settled by lab-test or source-read
- Audit log and Score Change Log retention and console time zone [gap:risk360.administration:log-retention-timezone]: settled by source-read or support-ticket

Area: risk360.administration, its subjects in references/_meta/spine/risk360/risk360.administration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/risk360/risk360.scoring.md (How Risk360 scores risk: the organization score, factors, asset-level risk and Monte Carlo financial estimates)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)
- see-also references/_meta/text/risk360/risk360.alerts.md (Risk360 alerts: rule criteria and throttling, alert lifecycle, causes, webhooks, email and the ServiceNow sample)
