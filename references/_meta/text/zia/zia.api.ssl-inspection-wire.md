# SSL Inspection rule wire notes: Kerberos road warriors, ZPA segments and predefined rules (zia.api.ssl-inspection-wire)
Also called: road_warrior_for_kerberos; zpa_app_segments ssl inspection; predefined ssl inspection rules cannot be deleted terraform

A few SSL Inspection rule settings are not covered by the console criteria. The nested action shape is in [SSL/TLS inspection rule wire format: the nested action object, tokens and casing](kb:zia.ssl-inspection.api-shape) and the rule inventory and cap in [SSL/TLS inspection rule order, predefined and default rules, limits](kb:zia.ssl-inspection.rules).

**Settings.** The SSL Inspection rule setting road_warrior_for_kerberos applies the rule to remote users that use PAC with Kerberos authentication. [zia.api.ssl-inspection-wire:road-warrior-kerberos] An SSL Inspection rule can name ZPA application segments that have Source IP Anchoring enabled. [zia.api.ssl-inspection-wire:zpa-app-segments]

**Predefined rules.** Default and predefined rules cannot be deleted; predefined ones can be imported and reordered, but destroying one fails; default rules should not be imported. [zia.api.ssl-inspection-wire:predefined-not-destroyable] MCP server issue #56 reported that adding SharePoint Online to an SSL inspection rule returned no response because the SSL inspection API accepts only internal enum strings such as ONEDRIVE; it was closed as completed on 2026-04-28 with a reply from a member of the repository's organization, signed Zscaler DevRel, to upgrade to v0.10.5. [zia.api.ssl-inspection-wire:mcp-sharepoint-enum-report]

What to check:
1. Whether a predefined SSL Inspection rule is being deleted, which the provider does not support.
2. Whether the rule was meant to cover remote PAC users on Kerberos, which is its own SSL Inspection rule setting.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.ssl-inspection.api-shape.md (SSL/TLS inspection rule wire format: the nested action object, tokens and casing)
- links-to references/_meta/text/zia/zia.ssl-inspection.rules.md (SSL/TLS inspection rule order, predefined and default rules, limits)
