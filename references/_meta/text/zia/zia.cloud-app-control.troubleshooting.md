# Cloud App Control troubleshooting: blocked-but-allowed and allowed-but-blocked (zia.cloud-app-control.troubleshooting)
Also called: users can still access blocked cloud app; cac not blocking; quic bypass cac; pac file bypass; zscaler blocking an allowed cloud app; nrod cac

Establish first which layer decided, using [Cloud App Control versus URL Filtering: which applies](kb:zia.cloud-app-control.precedence). Then these are the documented checks.

**An allowed app is blocked.** When Zscaler blocks a cloud app that Cloud App Control allows, Zscaler's first check is whether Allow Cascading to URL Filtering is enabled and, if so, whether a matching URL Filtering rule allows the traffic. [zia.cloud-app-control.troubleshooting:allowed-app-blocked]

**A blocked app still works.** When users still reach a blocked cloud app, Zscaler's checks are: whether their transactions appear in Web or Firewall Insights (if not, Zscaler says the traffic may go direct and bypass the rules, and that the PAC file or proxy settings can block the traffic), and whether the protocol is QUIC in Firewall Insights (if so, disable QUIC in the browser). [zia.cloud-app-control.troubleshooting:blocked-app-reachable] The QUIC caveat is open [gap:zia.cloud-app-control.troubleshooting:quic-interception].

**Detection that never gets a chance.** Because NROD can only be used in URL Filtering rules, a malicious new domain that only an NROD block would catch is not caught when a CAC rule explicitly allows the app and cascading is off: URL Filtering, and so NROD, never runs. [zia.cloud-app-control.troubleshooting:nrod-never-after-cac-allow] The NROD prerequisites are in [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

To see from logs which layer fired, use the rule-name fields described in [Which rule decided a web transaction, from the logs](kb:zia.logs.web-rule-attribution).

What to check:
1. Whether an allowed app is blocked by URL Filtering after a CAC allow, by checking whether cascading is on tenant-wide or on that rule.
2. Whether the traffic reaches Zscaler at all, before reading any rule.
3. Whether the blocked app's traffic uses QUIC, since QUIC interception is open.
4. Whether decryption leaves CAC only domain-level information for the app.

Inferred, not quoted (say so when an answer rests on one):
- [zia.cloud-app-control.troubleshooting:nrod-never-after-cac-allow] Tier B: Derived from two existing claims. Whether a domain that matches a CAC app can also be in the NROD category is not shown by any source.

Not known (open gaps):
- Which deployments cannot intercept QUIC [gap:zia.cloud-app-control.troubleshooting:quic-interception]: settled by source-read or operator-experience. Blocks: telling an operator whether QUIC is the cause

Area: zia.cloud-app-control, its subjects in references/_meta/spine/zia/zia.cloud-app-control.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- decided-by references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies): Enabling Allow Cascading to URL Filtering in Advanced Settings makes the service apply the URL Filtering policy even when a Cloud App Control rule allows the transaction, so a URL Filtering block then applies. [zia.cloud-app-control.precedence:cascading-allow-path]
- interacts-with references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes): Because NROD can only be used in URL Filtering rules, a malicious new domain that only an NROD block would catch is not caught when a CAC rule explicitly allows the app and cascading is off: URL Filtering, and so NROD, never runs. [zia.cloud-app-control.troubleshooting:nrod-never-after-cac-allow]
- decided-by references/_meta/text/zia/zia.cloud-app-control.rule-criteria.md (What a Cloud App Control rule matches on), from zia.cloud-app-control: A Cloud App Control rule matches on the logical expression: [Cloud Applications OR Cloud Application Instances OR Cloud Application Risk Profile] AND [Groups OR Users OR Departments] AND [Location Groups OR Locations] AND Time AND [Devices OR Device Groups OR Device Trust Level OR CONNECT User-Agent OR User Risk Profile]. [zia.cloud-app-control.rule-criteria:criteria-expression]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.cloud-app-control: A Cloud App Control rule matches on the logical expression: [Cloud Applications OR Cloud Application Instances OR Cloud Application Risk Profile] AND [Groups OR Users OR Departments] AND [Location Groups OR Locations] AND Time AND [Devices OR Device Groups OR Device Trust Level OR CONNECT User-Agent OR User Risk Profile]. [zia.cloud-app-control.rule-criteria:criteria-expression]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.cloud-app-control: For traffic that is not decrypted, including destinations covered by the one-click options, Cloud App Control can use only the domain-level information from the first pass (CONNECT host or SNI), so it has less to identify the application with than for decrypted traffic. [zia.cloud-app-control.ssl-visibility:domain-level-only-when-not-decrypted]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.cloud-app-control: By default, when a Cloud App Control rule explicitly allows the transaction, URL Filtering is not applied at all, so a URL Filtering block on the same site does not fire. [zia.cloud-app-control.precedence:cac-allow-skips-url-filtering]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.cloud-app-control.ssl-visibility.md (Cloud App Control and SSL inspection: what CAC can see)
