# ZSDK ranges and limitations per organization (shared.zsdk.limits)
Also called: zsdk limits; zsdk ranges and limitations; zsdk maximum app connectors; zsdk maximum policy rules; zsdk dns txt records

ZSDK limits apply per organization unless noted otherwise, and an organization that needs a higher maximum asks Zscaler Support. [shared.zsdk.limits:per-organization]

| Area | Limits |
| --- | --- |
| Administration and organization | An organization can have 1,000 admins and 100 roles, and an admin user password can be 100 characters. [shared.zsdk.limits:administration] |
| App Connectors | An organization can have 100 App Connectors, 100 App Connector groups and 100 App Connector provisioning keys. [shared.zsdk.limits:app-connectors] |
| Applications and segments | An organization can have 6,000 applications, with 2,000 per application segment counting IP addresses, domains and wildcards alike (every entry counts as one), and 4,000 Source IP Anchoring-enabled domains or IP addresses; 6,000 application segments, 240 of them Source IP Anchoring-enabled; 200 segment groups; 50 DNS suffixes; 10,000 servers; and 1,000 server groups. [shared.zsdk.limits:applications] |
| DNS on the App Connector | DNS resolution on the App Connector resolves a single domain to no more than 200 IP addresses, and the ZSDK cloud handles up to 100 TXT records for a domain it looks up; beyond 100 the TXT records are ignored. [shared.zsdk.limits:dns] |
| Authentication and certificates | An organization can have 10 IdP configurations, 100 SAML attributes, 1,000 web server certificates and 1,000 enrollment certificates. [shared.zsdk.limits:authentication-certificates] |
| Access policy | Access policy allows 2,000 policy rules, 1,000 application segments per rule and 48 App Connector groups per rule; the 48-group limit applies even when all App Connector groups for the application are selected. [shared.zsdk.limits:access-policy] |
| Device profiles | An organization can have 200 device profiles, with 50 UUIDs per profile and 10 of each other attribute per profile. [shared.zsdk.limits:device-profiles] |
| Private Service Edges | An organization can have 100 ZSDK Private Service Edges, 100 Private Service Edge groups and 100 Private Service Edge provisioning keys. [shared.zsdk.limits:private-service-edges] |

The maximum number of segment groups is in dispute [divergence:shared.zsdk.limits:segment-group-limit], as is the number of application segments per policy rule [divergence:shared.zsdk.limits:segments-per-rule].

What to check:
1. Whether a design needs more than 48 App Connector groups behind one access policy rule, which the limit forbids even with all groups selected.
2. Whether a domain resolves to more than 200 addresses, or has more than 100 TXT records, on the App Connector.

Sources disagree (name both sides):
- How many segment groups an organization can have. [divergence:shared.zsdk.limits:segment-group-limit]
  - zscaler-help: The Ranges & Limitations page lists 200 segment groups.
  - zscaler-help: The Managing Segment Groups article says up to 100 segment groups can be added.
  Impact: A design near 100 segment groups cannot rely on either number without confirming with Zscaler Support.
- How many application segments one access policy rule can include. [divergence:shared.zsdk.limits:segments-per-rule]
  - zscaler-help: The Ranges & Limitations page lists 1,000 application segments per policy rule.
  - zscaler-help: The Managing Access Policies article says there are limits to the number of application segments applied to a rule, deferring to Ranges & Limitations, and also says the selection menu has no limit.
  Impact: The same article defers to Ranges & Limitations for the rule limit while describing the selection menu as unlimited, so a rule needing more than 1,000 application segments should be checked against the limits page and Zscaler Support.

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.zsdk.md (Zscaler SDK for Mobile Apps (ZSDK): what it is and where it is described)
- see-also references/_meta/text/shared/shared.zsdk.configuration.md (Configuring ZSDK: registered apps and app keys, segments and access policy)
