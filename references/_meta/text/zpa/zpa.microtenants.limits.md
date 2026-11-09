# Microtenant limits and unsupported features (zpa.microtenants.limits)
Also called: microtenant limit; how many microtenants; microtenant prerequisites; features not supported in microtenant; microtenant disaster recovery; microtenant 24.63.1

The feature has a count limit, a version floor and a list of features it does not carry.

**Limit.** The ranges and limitations article allows 100 Microtenants. [zpa.microtenants.limits:microtenant-limit]

**Prerequisite.** To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]

**Not supported.** The Microtenants feature is not supported when disaster recovery is enabled. [zpa.microtenants.limits:dr-unsupported] These features are supported only for a Default Microtenant and not for a standard Microtenant: AI-Powered Recommendations for Application Segments, Application Segments Usage, AppProtection for Private Application Traffic, Authentication Service, Browser Access with CORS, Client Hostname Validation, Disaster Recovery, Extranet Application Support, Inspect Traffic with ZIA, Log Streaming Service, Source IP-Anchor enabled applications, VPN (for Legacy Apps), Zscaler Branch Connector and Zscaler Cloud Connector. [zpa.microtenants.limits:default-only-features]

What to check:
1. Whether the feature the answer relies on is one of those supported only in the Default Microtenant.
2. Whether the deployment uses disaster recovery, which the Microtenants feature does not support.
3. The App Connector and Private Service Edge versions against the prerequisite.
4. The Microtenant count against the documented limit.

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.microtenants.user-mapping.md (How users are mapped to a Microtenant), from zpa.microtenants: Private Access applies Microtenants in the order they are listed, top to bottom, and assigns the first match as the most relevant Microtenant; a newly created Microtenant is prioritized last by default. [zpa.microtenants.user-mapping:list-order-first-match]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups): The Microtenants feature is not supported when disaster recovery is enabled. [zpa.microtenants.limits:dr-unsupported]
- decided-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions), from zpa.microtenants: For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only]
- depends-on references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates), from zpa.microtenants: Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement]
- decided-by references/_meta/text/zpa/zpa.microtenants.policy-evaluation.md (Policy evaluation between Default and custom Microtenants), from zpa.microtenants: A user in a custom Microtenant accessing a Default Microtenant segment is evaluated against the Default Microtenant first, and only if there is no match does Private Access evaluate access, timeout and client forwarding policy within the custom Microtenant. [zpa.microtenants.policy-evaluation:default-first-for-custom-user]
