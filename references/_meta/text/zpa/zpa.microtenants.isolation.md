# What a Microtenant isolates (zpa.microtenants.isolation)
Also called: what is a microtenant; microtenant isolation; microtenant vs tenant; subsidiary isolation; microtenant end users; default microtenant

A Microtenant sits inside a tenant and scopes who administers what and which resources users reach.

**What it is.** A Microtenant is a delegated administrator responsibility that an admin with Microtenant administrator privileges assigns to an admin; Microtenants are defined by an authentication domain and assigned to admins by country, department and company. [zpa.microtenants.isolation:delegated-scope] A Microtenant is created within a tenant and is used when departments or subsidiaries within an organization want to manage their configurations independently. [zpa.microtenants.isolation:intended-use] Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement] The Python and Go SDKs address Microtenants under the customer ID the client is configured with (`/zpa/mgmtconfig/v1/admin/customers/{customerId}/microtenants`), and the API describes the list as the Microtenants 'for the specified customer'. [zpa.microtenants.isolation:same-customer-path]

**What its admin manages.** A Microtenant admin can manage the configuration of shared application segments, segment groups, servers, server groups, App Connectors, App Connector groups and policies exclusive to users within their country, department and operating company, and can view the dashboard and logs exclusive to those users. [zpa.microtenants.isolation:managed-config] IdP configuration, Enrollment (CA) certificates and Microtenants can be managed or configured only by the Default Microtenant admin. [zpa.microtenants.isolation:default-only-config] What is shared with the parent tenant beyond that is open [gap:zpa.microtenants.isolation:shared-billing-infrastructure]. Whether connectors are shared or owned per Microtenant is open [gap:zpa.microtenants.isolation:app-connectors-shared]. Per-resource permission levels are in [Microtenant admin permissions](kb:zpa.microtenants.admin-permissions).

**What its end users reach.** End users of a Microtenant can access resources from the default (global) tenant as well as those created within their own Microtenant, and by default end users of different subsidiaries cannot access resources configured in other Microtenants. [zpa.microtenants.isolation:end-user-visibility] Sharing an application across Microtenants is in [Sharing and moving between Microtenants](kb:zpa.microtenants.share-and-move), and whose policy decides is in [Policy evaluation between Default and custom Microtenants](kb:zpa.microtenants.policy-evaluation).

What to check:
1. Whether the resource asked about was created in the Microtenant or in the Default Microtenant, since a Microtenant admin manages its own resources and sees most Default resources read only.
2. Whether the application was shared explicitly when an end user in one Microtenant reaches an application configured in another.
3. Whether the configuration in question is one only the Default Microtenant admin can change.
4. Whether a billing, subscription or infrastructure claim was taken from this knowledge base, since none is sourced.
5. Whether an answer says App Connectors are owned by the Default tenant or by the Microtenant, which no source states.

Not known (open gaps):
- Whether billing, subscription and Zscaler infrastructure are shared across Microtenants [gap:zpa.microtenants.isolation:shared-billing-infrastructure]: settled by support-ticket. Blocks: answering what a Microtenant shares with its parent tenant beyond IdP configuration and enrollment certificates
- Whether App Connectors are shared and not owned by Microtenants [gap:zpa.microtenants.isolation:app-connectors-shared]: settled by lab-test or support-ticket. Blocks: answering whether connectors are owned by the Default tenant or by each Microtenant

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.microtenants.policy-evaluation.md (Policy evaluation between Default and custom Microtenants): End users of a Microtenant can access resources from the default (global) tenant as well as those created within their own Microtenant, and by default end users of different subsidiaries cannot access resources configured in other Microtenants. [zpa.microtenants.isolation:end-user-visibility]
- decided-by references/_meta/text/zpa/zpa.microtenants.user-mapping.md (How users are mapped to a Microtenant), from zpa.microtenants: Private Access applies Microtenants in the order they are listed, top to bottom, and assigns the first match as the most relevant Microtenant; a newly created Microtenant is prioritized last by default. [zpa.microtenants.user-mapping:list-order-first-match]
- decided-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions), from zpa.microtenants: For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only]
- depends-on references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features), from zpa.microtenants: To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups), from zpa.microtenants: In disaster recovery mode, Private Service Edges and App Connectors mapped within a default or custom Microtenant provide traffic only to applications designated for disaster recovery. [zpa.private-service-edges.disaster-recovery:dr-microtenants]
- links-to references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/microtenants.md (config type)
