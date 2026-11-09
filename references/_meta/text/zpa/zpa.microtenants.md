# ZPA Microtenants (zpa.microtenants)
Also called: microtenant; microtenants; zpa microtenant; microtenantId; microtenant_id; zpa_microtenant; delegated admin; multi-org isolation

A Microtenant question is one of eight, and mixing them is how answers go wrong.

1. **What is isolated, and what is shared?** What a Microtenant is and which resources and end-user access it covers: [What a Microtenant isolates](kb:zpa.microtenants.isolation).
2. **What can its admin see or change?** The permission levels and which Default Microtenant resources are read only or hidden: [Microtenant admin permissions](kb:zpa.microtenants.admin-permissions).
3. **Which Microtenant is a user in?** Criteria, list order and the multi-criteria operators: [How users are mapped to a Microtenant](kb:zpa.microtenants.user-mapping).
4. **Whose policy applies?** Evaluation order between the Default and a custom Microtenant: [Policy evaluation between Default and custom Microtenants](kb:zpa.microtenants.policy-evaluation).
5. **What do disable and delete do?** Status, session effects, credentials at creation, privileged approvals and deletion: [Microtenant lifecycle: create, disable, delete](kb:zpa.microtenants.lifecycle).
6. **How does a segment cross Microtenants?** Share, move, their prerequisites and the SDK calls: [Sharing and moving between Microtenants](kb:zpa.microtenants.share-and-move).
7. **How does an API call pick its scope?** The `microtenantId` query parameter and its defaults: [How an API call selects a Microtenant](kb:zpa.microtenants.api-scoping). Terraform and SDK resolver defects live in [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection) and [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle).
8. **What is not supported?** Limits, prerequisites and Default-only features: [Microtenant limits and unsupported features](kb:zpa.microtenants.limits).

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.microtenants.user-mapping.md (How users are mapped to a Microtenant): Private Access applies Microtenants in the order they are listed, top to bottom, and assigns the first match as the most relevant Microtenant; a newly created Microtenant is prioritized last by default. [zpa.microtenants.user-mapping:list-order-first-match]
- decided-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions): For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only]
- depends-on references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates): Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement]
- depends-on references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features): To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]
- decided-by references/_meta/text/zpa/zpa.microtenants.policy-evaluation.md (Policy evaluation between Default and custom Microtenants): A user in a custom Microtenant accessing a Default Microtenant segment is evaluated against the Default Microtenant first, and only if there is no match does Private Access evaluate access, timeout and client forwarding policy within the custom Microtenant. [zpa.microtenants.policy-evaluation:default-first-for-custom-user]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups): In disaster recovery mode, Private Service Edges and App Connectors mapped within a default or custom Microtenant provide traffic only to applications designated for disaster recovery. [zpa.private-service-edges.disaster-recovery:dr-microtenants]
- links-to references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant)
- links-to references/_meta/text/zpa/zpa.microtenants.lifecycle.md (Microtenant lifecycle: create, disable, delete)
- links-to references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
