"Does SSL inspection happen before or after URL Filtering?" has no one-word answer, and the flat answer ("before") loses the behavior that matters most.

{{firewall-first}}

{{first-pass-on-domain}} {{first-pass-subset}} {{first-pass-block}}

{{ssl-decision-between}} If the connection is inspected: {{second-pass-after-decrypt}} {{url-filtering-twice}}

{{not-inspected-domain-only}} {{bypass-other-policies}} {{transparent-matches-destination-ip}} {{tunnel-locations-misc-exemption}}

{{eun-inspects-first-transaction}} {{user-context-needed}}

Criteria that need the full request are covered in [[zia.url-filtering.criteria]]; Cloud App Control's place in each pass is in [[zia.cloud-app-control.precedence]].
