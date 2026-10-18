Establish first which layer decided, using [[zia.cloud-app-control.precedence]]. Then these are the documented checks.

**An allowed app is blocked.** {{allowed-app-blocked}} The likely layer is URL Filtering, running after the CAC allow because cascading is on, either tenant-wide or on that rule.

**A blocked app still works.** {{blocked-app-reachable}} Settle whether the traffic reaches Zscaler before reading rules, and see gap `quic-interception` for the QUIC caveat. Also check whether decryption hides the application from CAC: [[zia.cloud-app-control.ssl-visibility]].

**Detection that never gets a chance.** {{nrod-never-after-cac-allow}} The NROD prerequisites are in [[zia.url-filtering.advanced-settings]].

To see from logs which layer fired, use the rule-name fields described in [[zia.logs.web-rule-attribution]]. A dedicated cac-vs-url-filter-drift Splunk pattern was proposed in the legacy [Splunk queries](../shared/splunk-queries.md) doc but does not exist yet.
