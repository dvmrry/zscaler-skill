Establish first which layer decided, using [[zia.cloud-app-control.precedence]]. Then these are the documented checks.

**An allowed app is blocked.** {{allowed-app-blocked}}

**A blocked app still works.** {{blocked-app-reachable}} The QUIC caveat is open {{gap:quic-interception}}.

**Detection that never gets a chance.** {{nrod-never-after-cac-allow}} The NROD prerequisites are in [[zia.url-filtering.advanced-settings]].

To see from logs which layer fired, use the rule-name fields described in [[zia.logs.web-rule-attribution]].
