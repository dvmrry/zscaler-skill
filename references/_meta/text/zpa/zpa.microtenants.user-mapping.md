# How users are mapped to a Microtenant (zpa.microtenants.user-mapping)
Also called: microtenant authentication domain; microtenant priority; microtenant criteria; user assigned to wrong microtenant; microtenant list order; criteria_attribute; AuthDomain microtenant; microtenant saml scim criteria

A user is assigned to one Microtenant by its criteria and the list order.

**Criteria.** End users that are authenticated to Private Access with the selected authentication domains are mapped to their relevant Microtenant. [zpa.microtenants.user-mapping:criteria-map-users] A Microtenant's criteria can be authentication domains, External IAM IdPs (supported only for IdPs created in Authentication Service), or SAML and SCIM attributes (in limited availability, where existing users must reauthenticate or reconnect to use them). [zpa.microtenants.user-mapping:criteria-types] Multiple attributes or groups in a Microtenant use an OR operator by default, multiple IdPs use an OR operator by default, and either can be toggled to AND. [zpa.microtenants.user-mapping:attribute-operators] When the IdP setting for SAML or SCIM attributes for policy is disabled but the Microtenant has criteria for them, an OR operator skips those criteria and keeps evaluating the others, while an AND operator stops Private Access from evaluating the Microtenant until the criteria are removed. [zpa.microtenants.user-mapping:idp-setting-disabled] The Terraform resource accepts one criteria attribute: The Terraform `zpa_microtenant_controller` resource documents `AuthDomain` as the only supported value of `criteria_attribute`. [zpa.microtenants.user-mapping:terraform-criteria-authdomain]

**Order.** Private Access applies Microtenants in the order they are listed, top to bottom, and assigns the first match as the most relevant Microtenant; a newly created Microtenant is prioritized last by default. [zpa.microtenants.user-mapping:list-order-first-match] Updating the priority order impacts user access to applications and applied policies, because users can be reassigned to new Microtenants. [zpa.microtenants.user-mapping:priority-change-impact]

**Overlap.** The Go share and move tests retry a Microtenant create that fails with the error `domains.already.exists.in.other.microtenant`, which indicates the API can reject a create because the authentication domain is already used by another Microtenant. [zpa.microtenants.user-mapping:domain-in-other-microtenant-error] Whether an authentication domain can sit in two Microtenants at all is open [gap:zpa.microtenants.user-mapping:auth-domain-uniqueness].

What to check:
1. The order of the Microtenant list, since the first match is the user's Microtenant and a reorder can reassign users.
2. Which criteria the Microtenant uses, and the operator between multiple attributes or IdPs.
3. Whether the IdP setting for SAML or SCIM attributes for policy is enabled when the Microtenant uses those criteria.
4. Whether an authentication domain may appear in more than one Microtenant.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.microtenants.user-mapping:domain-in-other-microtenant-error] Tier B: Derived from test code that matches an error string, not from a vendor statement of the rule. The string appears in the Go share and move tests (commented-out blocks); no test asserts the rule under which the API returns it. Statement reworded to name the tests rather than 'the Go SDK's Microtenant tests'.

Not known (open gaps):
- Whether one authentication domain can belong to more than one Microtenant [gap:zpa.microtenants.user-mapping:auth-domain-uniqueness]: settled by lab-test. Blocks: answering whether a domain collision can occur, or only attribute-criteria overlap

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions), from zpa.microtenants: For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only]
- depends-on references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates), from zpa.microtenants: Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement]
- depends-on references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features), from zpa.microtenants: To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]
- decided-by references/_meta/text/zpa/zpa.microtenants.policy-evaluation.md (Policy evaluation between Default and custom Microtenants), from zpa.microtenants: A user in a custom Microtenant accessing a Default Microtenant segment is evaluated against the Default Microtenant first, and only if there is no match does Private Access evaluate access, timeout and client forwarding policy within the custom Microtenant. [zpa.microtenants.policy-evaluation:default-first-for-custom-user]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups), from zpa.microtenants: In disaster recovery mode, Private Service Edges and App Connectors mapped within a default or custom Microtenant provide traffic only to applications designated for disaster recovery. [zpa.private-service-edges.disaster-recovery:dr-microtenants]
- scoped-by references/_meta/text/zpa/zpa.saml-attributes.policy-criteria.md (How SAML attributes act as policy criteria): A Microtenant's criteria can be authentication domains, External IAM IdPs (supported only for IdPs created in Authentication Service), or SAML and SCIM attributes (in limited availability, where existing users must reauthenticate or reconnect to use them). [zpa.microtenants.user-mapping:criteria-types]
- scoped-by references/_meta/text/zpa/zpa.scim.policy-criteria.md (SCIM groups and attributes as ZPA policy criteria): A Microtenant's criteria can be authentication domains, External IAM IdPs (supported only for IdPs created in Authentication Service), or SAML and SCIM attributes (in limited availability, where existing users must reauthenticate or reconnect to use them). [zpa.microtenants.user-mapping:criteria-types]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.microtenants.lifecycle.md (Microtenant lifecycle: create, disable, delete)
