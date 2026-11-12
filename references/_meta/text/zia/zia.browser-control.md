# Browser Control: vulnerability checks and warnings, browser blocking, the Client Connector scope, the recommended policy and Secure Browsing reports (zia.browser-control)
Also called: Browser Control policy; Browser Vulnerability Protection; Browser Blocking; Allow All Browsers; outdated browsers; vulnerable plugins; Secure Browsing reports; Not allowed to use this browser

Browser Control warns users and can block browsers. A Browser Control policy warns users from going to the internet when they use outdated or vulnerable browsers, plugins and applications. The Zscaler service examines browser versions and patches (including beta browsers), internet applications (for example Adobe Flash, Sun Java, Apple QuickTime) and media download applications (for example Windows Media Player). It can also block the use of browsers or specific browser versions that are older or have known vulnerabilities, and the Admin Console displays the latest 12 versions for most browsers. [zia.browser-control:purpose-and-coverage]

**Vulnerability protection.** Browser Vulnerability Protection has Enable Checks & User Notification, which warns users of outdated or vulnerable browsers, plugins and applications. When enabled, How Often to Check is Daily, Monthly or Weekly; Disable Notification for Browsers disables warnings for all browsers; and any number of plugins and of applications can be chosen to be exempted from warnings. The page says this feature is only applicable with browser-based authentication (non-Zscaler Client Connector). [zia.browser-control:vulnerability-protection-settings] What the check frequency and the exemption lists default to is open [gap:zia.browser-control:browser-defaults].

**Browser blocking.** Browser Blocking has Allow All Browsers, which lets all browsers and their versions access the internet; if it is disabled, specific browsers and their versions can be blocked for Chrome, Firefox, Microsoft Browsers, Opera, Safari and Brave. [zia.browser-control:browser-blocking] The Help list does not line up with the registered type's version fields [gap:zia.browser-control:browser-list-vs-fields]. Which browsers fall outside the latest 12 versions is open [gap:zia.browser-control:twelve-versions-scope].

**Client Connector.** The Recommended Browser Control Policy page says Browser Control policy settings only work for non-Zscaler Client Connector traffic, that if Client Connector is enabled the Browser Vulnerability Protection settings do not take effect, and that Browser Blocking settings still take effect if Client Connector is enabled. [zia.browser-control:client-connector-scope] The page's first and last sentences differ on Browser Blocking [divergence:zia.browser-control:client-connector-blocking].

**Recommended policy and reports.** For vulnerable browsers Zscaler recommends enabling Enable Checks & User Notification and disabling Allow All Browsers. [zia.browser-control:recommended-policy] Secure Browsing reports track the use of vulnerable browsers, plugins and applications; they are in the Secure Browsing section of the Standard Reports tab of Interactive Reports. Separately, in Data Explorer > Internet & SaaS > Web Insights, on the Insights tab, choosing User as the Data Type and the Secure Browsing Status filter set to Vulnerable lists users who are using vulnerable browsers, plugins and applications for which warnings are set. [zia.browser-control:secure-browsing-reports]

Browser Control's place in the threat-protection enforcement order is in [Where Malware Protection and ATP checks fall in the web enforcement order](kb:zia.atp.enforcement-order), and the audit sections that report on it are in [Risk and posture scoring reports: Company Risk Score, User Risk, Configuration Risk, Security Policy Audit and the Attack Surface Report](kb:zia.reports.risk). The registered type has Smart Isolation fields that the Help article does not mention [gap:zia.browser-control:smart-isolation-fields].

What to check:
1. Whether the user's traffic is Client Connector traffic, stating that the recommended-policy page differs on whether Browser Blocking still applies rather than choosing one reading.
2. Whether the warning feature applies, since the page says it is only applicable with browser-based authentication.

Sources disagree (name both sides):
- The Recommended Browser Control Policy page says Browser Control settings only work for non-Client Connector traffic and, in its last sentence, that Browser Blocking still takes effect with Client Connector. [divergence:zia.browser-control:client-connector-blocking]
  - zscaler-help: Browser Control policy settings only work for non-Client Connector traffic.
  - zscaler-help: Browser Blocking settings still take effect if Client Connector is enabled.
  Impact: Whether a blocked browser is stopped for a Client Connector user depends on which sentence holds; the page gives no scope that reconciles them.

Not known (open gaps):
- Defaults of the check frequency and Allow All Browsers [gap:zia.browser-control:browser-defaults]: settled by tenant-data or source-read
- How the Help browser list maps to the registered type's version fields [gap:zia.browser-control:browser-list-vs-fields]: settled by tenant-data or source-read
- Which browsers fall outside the latest 12 versions [gap:zia.browser-control:twelve-versions-scope]: settled by tenant-data or support-ticket
- Smart Isolation fields on the Browser Control type [gap:zia.browser-control:smart-isolation-fields]: settled by source-read

Area: zia.browser-control, its subjects in references/_meta/spine/zia/zia.browser-control.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order)
- links-to references/_meta/text/zia/zia.reports.risk.md (Risk and posture scoring reports: Company Risk Score, User Risk, Configuration Risk, Security Policy Audit and the Attack Surface Report)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/browser-control-settings.md (config type)
- see-also references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
- see-also references/_meta/text/zia/zia.sdk-python.service-behaviors.md (Python SDK service-specific behavior for ZIA: admin, AppTotal, browser control, smart isolation and GRE tunnel VIPs)
