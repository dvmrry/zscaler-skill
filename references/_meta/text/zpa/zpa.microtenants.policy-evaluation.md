# Policy evaluation between Default and custom Microtenants (zpa.microtenants.policy-evaluation)
Also called: microtenant policy evaluation; microtenant policy order; which microtenant policy applies; microtenant redirection policy; default microtenant evaluated first

Which policy decides depends on the user's Microtenant and where the segment lives.

**Same Microtenant.** A user in the Default Microtenant accessing a Default Microtenant segment, or a user in a custom Microtenant accessing a segment within a custom Microtenant, is evaluated for access, timeout and client forwarding policy using the most specific application segment within that Microtenant. [zpa.microtenants.policy-evaluation:same-scope-most-specific]

**Custom user, Default segment.** A user in a custom Microtenant accessing a Default Microtenant segment is evaluated against the Default Microtenant first, and only if there is no match does Private Access evaluate access, timeout and client forwarding policy within the custom Microtenant. [zpa.microtenants.policy-evaluation:default-first-for-custom-user]

**Redirection.** A user in a custom Microtenant is evaluated for redirection policies of only that custom Microtenant, and a user in the Default Microtenant only for the Default Microtenant's. [zpa.microtenants.policy-evaluation:redirection-own-scope] General ZPA policy precedence is outside this subject, and which Microtenant the user is in is in [How users are mapped to a Microtenant](kb:zpa.microtenants.user-mapping).

What to check:
1. Whether the application segment is in the user's own Microtenant or in the Default Microtenant, since the Default Microtenant is evaluated first for a custom-Microtenant user.
2. Whether the policy in question is a redirection policy, which is evaluated only for the user's own Microtenant.

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zpa/zpa.microtenants.user-mapping.md (How users are mapped to a Microtenant): End users that are authenticated to Private Access with the selected authentication domains are mapped to their relevant Microtenant. [zpa.microtenants.user-mapping:criteria-map-users]
- decided-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions), from zpa.microtenants: For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only]
- depends-on references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates), from zpa.microtenants: Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement]
- depends-on references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features), from zpa.microtenants: To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types): A user in the Default Microtenant accessing a Default Microtenant segment, or a user in a custom Microtenant accessing a segment within a custom Microtenant, is evaluated for access, timeout and client forwarding policy using the most specific application segment within that Microtenant. [zpa.microtenants.policy-evaluation:same-scope-most-specific]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups), from zpa.microtenants: In disaster recovery mode, Private Service Edges and App Connectors mapped within a default or custom Microtenant provide traffic only to applications designated for disaster recovery. [zpa.private-service-edges.disaster-recovery:dr-microtenants]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/microtenants.md (config type)
