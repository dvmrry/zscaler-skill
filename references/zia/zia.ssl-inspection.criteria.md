"Why didn't this SSL rule match?" can be a criterion that was ignored or cannot be evaluated for this traffic. Start with the expression. {{operator-expression}} {{second-dimension-narrows}} {{zcc-criteria-unset-ignored}}

**Criteria that need a careful reading.**

- **Destinations.** {{destination-group-types}} {{dest-ip-groups-ignored-with-sni}}
- **User agent.** {{connect-user-agent-explicit-only}}
- **ZPA.** {{zpa-segments-sipa-only}} The criterion has no counterpart on URL Filtering or Cloud App Control rules {{gap:absent-from-url-filtering-and-cac}}.
- **Kerberos.** {{road-warrior-kerberos}}

**Platform.** {{platforms-values}} {{platforms-label-inferred}} {{device-trust-scope}}

**Identity.** {{identity-needs-zcc-or-surrogate-ip}} This is the same constraint as the first pass in [[zia.ssl-inspection.pipeline]], which is evaluated before decryption on the CONNECT or SNI alone.

How the matching rule is chosen is in [[zia.ssl-inspection.rules]]; what it then does is in [[zia.ssl-inspection.actions]]. The URL Filtering criteria tree is a different expression with different fields: [[zia.url-filtering.criteria]].
