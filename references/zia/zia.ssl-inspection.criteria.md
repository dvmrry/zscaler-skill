"Why didn't this SSL rule match?" is almost always a criterion that was silently ignored or can't be evaluated for this traffic. Start with the expression. {{operator-expression}} Criteria in different groups are ANDed, so adding a second dimension narrows a rule; only values inside a bracket widen it. {{zcc-criteria-unset-ignored}}

Four criteria behave differently from what their names suggest.

- Destinations. {{destination-group-types}} {{dest-ip-groups-ignored-with-sni}} Scope SSL rules by FQDN groups, URL categories or cloud applications, not IP groups, unless the target really has no SNI.
- User agent. {{connect-user-agent-explicit-only}}
- ZPA. {{zpa-segments-sipa-only}} It is a cross-product reference from ZIA into ZPA that URL Filtering and Cloud App Control rules do not have.
- Kerberos. {{road-warrior-kerberos}}

Platform is the criterion most often misread. {{platforms-values}} {{platforms-label-inferred}} {{device-trust-scope}}

Identity needs a forwarding method that supplies it. {{identity-needs-zcc-or-surrogate-ip}} This is the same constraint as the first pass in [[zia.ssl-inspection.pipeline]], which is evaluated before decryption on the CONNECT or SNI alone.

How the matching rule is chosen is in [[zia.ssl-inspection.rules]]; what it then does is in [[zia.ssl-inspection.actions]]. The URL Filtering criteria tree is a different expression with different fields: [[zia.url-filtering.criteria]].
