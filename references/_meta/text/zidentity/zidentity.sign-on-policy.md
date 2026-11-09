# Admin sign-on policy: allow/deny rules, exemptions, limits, and the trusted IP locations and location groups they match on (zidentity.sign-on-policy)
Also called: Admin Sign-On Policy; sign-on rules; sign-on policy; Trusted IP Locations; Trusted IP Location Groups; IP location groups; IP locations; restrict admin login by IP; limit administrator access by source IP

The Admin Sign-On Policy is where sign-on rules are set for access to the Zscaler Admin Console. The Admin Sign-On Policy holds sign-on rules that allow or deny a user access to the Zscaler service; rules are built from attributes and control which users can access the Zscaler Admin Console, with conditions such as trusted IP locations and trusted IP location groups. [zidentity.sign-on-policy:what-it-is]

**Who it does not cover.** The sign-on policy does not apply to the super admin (admin@<vanityurl>.zslogin.net), the primary account created when the tenant was onboarded, or to API requests initiated through the OneAPI platform or legacy API workflows. [zidentity.sign-on-policy:exemptions]

**Evaluation.** Sign-on rules are evaluated in ascending numerical order of their rule order. [zidentity.sign-on-policy:evaluation-order] When a rule is added, the sign-on policy assigns its Rule Order number automatically; rules are evaluated in ascending numerical order (Rule 1 before Rule 2). [zidentity.sign-on-policy:rule-order-auto] Authentication Service follows the Allow rule by default: unless a Deny rule is created, it implicitly allows everything. [zidentity.sign-on-policy:implicit-allow]

**Rules.** Each rule shows the criteria that trigger it, its action (Allow or Deny) and its status (Enabled or Disabled), and a rule can be enabled or disabled. [zidentity.sign-on-policy:rule-columns] Up to 256 policies can be added; a rule's name is at most 31 characters, its description at most 10,240 characters, and it can hold up to 256 criteria, with an action of Allow or Deny for the matching rule. [zidentity.sign-on-policy:rule-limits] The criteria types beyond the examples are open [gap:zidentity.sign-on-policy:criteria-types], whether rules reach end-user service logins or only Admin Console access is open [gap:zidentity.sign-on-policy:rule-scope], and whether the 256 policies are the rules is open [gap:zidentity.sign-on-policy:policy-limit-meaning].

**IP locations.** An IP location is the geographical location associated with an IP address; IP locations are used in sign-on policies and to categorize the organization's egress points that access Authentication Service. Each shows a country, an IP address and the source it was added from. [zidentity.sign-on-policy:ip-location-what] Up to 65,536 IP locations can be added, and a location's IP Address field takes up to 2,048 IP addresses. [zidentity.sign-on-policy:ip-location-limits] The values of Source are open [gap:zidentity.sign-on-policy:location-source].

**IP location CSV.** The IP location CSV has a header row and one location per row, with columns A action (+ adds, - deletes), B name shown in the Admin Console, C country, D a range of IP addresses (IPv4 or IPv6), E IP address and F IP subnet. [zidentity.sign-on-policy:ip-location-csv] Override Existing Entries is needed to update existing location information (such as country) or delete locations; without it, importing a location that already exists shows an error that identical IP locations cannot be imported. [zidentity.sign-on-policy:ip-location-csv-override] How columns D, E and F combine is open [gap:zidentity.sign-on-policy:csv-columns], and whether the single-add form takes IPv6 is open [gap:zidentity.sign-on-policy:ipv6-single-add].

**IP location groups.** IP location groups group several IP locations to organize source IP address ranges, and can be used to configure sign-on policies; each shows the locations associated with the group. [zidentity.sign-on-policy:ip-location-groups] Up to 4,096 IP location groups can be added, and the page gives a limit of 2,048 locations. [zidentity.sign-on-policy:ip-location-group-limits] The IP location group CSV has a header row and one group per line, with + to add and - to delete a group; when the group already exists and the override option is not selected, importing it shows an error that identical IP location groups cannot be imported. [zidentity.sign-on-policy:ip-location-group-csv]

**Permission.** Managing or viewing the sign-on policy also needs IP Locations Full or View Only: [An admin without IP Locations Full or View permission is not allowed to access the sign-on policy, even with Admin Sign on Policy Full or View Only.](kb:zidentity.admin-rbac.permissions:signon-needs-ip-locations).

What to check:
1. Whether the account is the super admin or an API caller, to which the sign-on policy does not apply, before reasoning from a rule.
2. Whether a Deny rule has been created, since the page says that without one everything is implicitly allowed, and the rules' order numbers, since they are evaluated in ascending order.
3. For a CSV import that errors, whether Override Existing Entries is selected when the location or group already exists.

Not known (open gaps):
- Which criteria a sign-on rule can use [gap:zidentity.sign-on-policy:criteria-types]: settled by source-read or tenant-data. Blocks: knowing what a rule can match beyond source IP
- Whether sign-on rules apply to end-user service logins or only to Admin Console access [gap:zidentity.sign-on-policy:rule-scope]: settled by lab-test or source-read. Blocks: telling whether a rule can block an end user's service login
- Whether the limit of 256 policies counts rules [gap:zidentity.sign-on-policy:policy-limit-meaning]: settled by source-read or lab-test. Blocks: planning how many rules a tenant can hold
- The values of an IP location's Source [gap:zidentity.sign-on-policy:location-source]: settled by source-read or tenant-data. Blocks: telling how a location came to exist
- How the range, address and subnet columns of the IP location CSV combine [gap:zidentity.sign-on-policy:csv-columns]: settled by lab-test or source-read. Blocks: preparing an IP location import
- Whether the single-add IP location form accepts IPv6 [gap:zidentity.sign-on-policy:ipv6-single-add]: settled by lab-test or source-read. Blocks: adding an IPv6 location in the console

Area: zidentity.sign-on-policy, its subjects in references/_meta/spine/zidentity/zidentity.sign-on-policy.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zidentity/zidentity.admin-rbac.permissions.md (Authentication Service permission modules and levels, and the cross-module dependencies)
