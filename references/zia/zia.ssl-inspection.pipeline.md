"Does SSL inspection happen before or after URL Filtering?" has no one-word answer, and the flat answer ("before") loses the behavior that matters most.

The order starts outside the web module. {{firewall-first}}

Then comes a first pass that needs no decryption. {{first-pass-on-domain}} {{first-pass-subset}} {{first-pass-block}} This is why a URL Filtering block on a known-bad host works even for traffic that is never decrypted.

{{ssl-decision-between}} If the connection is inspected: {{second-pass-after-decrypt}} {{url-filtering-twice}}

What survives depends on the Do Not Inspect variant, and the two variants are very different. {{not-inspected-domain-only}} {{bypass-other-policies}} Bypass Other Policies is the common footgun: a URL Filtering block on that traffic never fires. Which traffic a Do Not Inspect rule catches also depends on forwarding mode. {{transparent-matches-destination-ip}} An exemption for Miscellaneous or Unknown meant for "unknown sites" silently exempts most traffic on GRE or IPsec locations.

Two details change outcomes at the edges. {{eun-inspects-first-transaction}} {{user-context-needed}}

Criteria that need the full request are covered in [[zia.url-filtering.criteria]]; Cloud App Control's place in each pass is in [[zia.cloud-app-control.precedence]].
