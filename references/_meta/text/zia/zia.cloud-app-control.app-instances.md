# Cloud application instances: identifiers, supported applications and limits (zia.cloud-app-control.app-instances)
Also called: cloud application instance; cloud app instance; instance identifier; corporate instance; tenant restriction by instance; Instances page

The cloud application instances feature creates instances for cloud applications to which specific instance identifiers (for example domains) are added, and the instances are associated with Cloud App Control policy rules and DLP policy rules. It lets administrators apply granular control (sharing, uploading, downloading and so on) through Cloud App Control rules and control actions by domain type in Cloud App Control, DLP with content inspection and DLP without content inspection. [zia.cloud-app-control.app-instances:what-it-is] Viewing (File Sharing, Social Networking and System & Development), viewing and listening (Streaming Media) and viewing mail (Webmail) are not granular controls for their respective categories. [zia.cloud-app-control.app-instances:not-granular-controls]

**Supported applications.** The About Cloud Application Instances table's applications include Appspace, Bitbucket, GitHub, Gmail, Google Drive, Google Gemini, Launchpad, Microsoft Copilot, Microsoft Teams, Okta, OneDrive, Outlook (Office 365), Quickbase, SharePoint Online, Slack, SourceForge, Workday, Zeplin and Zoom as the cloud applications for which instances can be created. [zia.cloud-app-control.app-instances:supported-applications]

**Blocking the rest of the application.** For cloud applications, if a Cloud App Control rule allows access to an instance and blocks the rest, the service blocks the main URLs (for example www.box.com, www.okta.com), so users must log in through the corporate instance URL (for example www.zscaler.app.box.com/login, www.zscaler.okta.com/login) instead of the main URL. [zia.cloud-app-control.app-instances:main-url-blocked]

**Fields.** An instance has a name (displayed when configuring Cloud App Control and DLP rules), an Instance Type (the parent cloud application) and up to 1,024 instance identifiers, each a URL with a name. Bitbucket and GitHub identifiers take the forms .bitbucket.org/<organization name>/<repository name>/ and .github.com/<organization name>/<repository name>/, and GitHub instances can also take keyword identifiers, so one keyword can identify a large number of repositories that follow a naming convention. [zia.cloud-app-control.app-instances:instance-fields] How a GitHub keyword is matched against a repository is open [gap:zia.cloud-app-control.app-instances:github-keyword-matching]. The Instances page lists each instance's Instance Type (the parent cloud application it is tied to) and its number of instance identifiers, and filters instances by instance type. [zia.cloud-app-control.app-instances:instances-page]

**Limits.** An organization can have 512 cloud application instances, and Zscaler Support can be contacted about raising that to 4,096. Each instance takes 1,024 instance identifiers, each identifier up to 128 characters, with at most 2,048 identifiers across all instances (Zscaler Support can be contacted about raising that to 8,192), and a rule takes up to 8 cloud application instances. [zia.cloud-app-control.app-instances:instance-limits]

The rule criteria that name instances are in [What a Cloud App Control rule matches on](kb:zia.cloud-app-control.rule-criteria), and the DLP rules that can use them are in [Web DLP policy rules: order, criteria and actions](kb:zia.dlp.rules). Custom applications are in [SaaS Applications page: application status, tags and custom cloud applications](kb:zia.cloud-app-control.custom-applications).

What to check:
1. Whether the rule allows an instance and blocks the rest of the application, since the main URLs are then blocked and users must log in through the corporate instance URL.
2. Whether the application is one of those that supports instances before relying on an instance rule.
3. Whether the organization is at its instance, identifier or per-rule limit.

Not known (open gaps):
- How a GitHub keyword instance identifier is matched [gap:zia.cloud-app-control.app-instances:github-keyword-matching]: settled by source-read or lab-test

Area: zia.cloud-app-control, its subjects in references/_meta/spine/zia/zia.cloud-app-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.cloud-app-control.rule-criteria.md (What a Cloud App Control rule matches on), from zia.cloud-app-control: A Cloud App Control rule matches on the logical expression: [Cloud Applications OR Cloud Application Instances OR Cloud Application Risk Profile] AND [Groups OR Users OR Departments] AND [Location Groups OR Locations] AND Time AND [Devices OR Device Groups OR Device Trust Level OR CONNECT User-Agent OR User Risk Profile]. [zia.cloud-app-control.rule-criteria:criteria-expression]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group), from zia.cloud-app-control: A Cloud App Control rule matches on the logical expression: [Cloud Applications OR Cloud Application Instances OR Cloud Application Risk Profile] AND [Groups OR Users OR Departments] AND [Location Groups OR Locations] AND Time AND [Devices OR Device Groups OR Device Trust Level OR CONNECT User-Agent OR User Risk Profile]. [zia.cloud-app-control.rule-criteria:criteria-expression]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs), from zia.cloud-app-control: URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.cloud-app-control: For traffic that is not decrypted, including destinations covered by the one-click options, Cloud App Control can use only the domain-level information from the first pass (CONNECT host or SNI), so it has less to identify the application with than for decrypted traffic. [zia.cloud-app-control.ssl-visibility:domain-level-only-when-not-decrypted]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.cloud-app-control: By default, when a Cloud App Control rule explicitly allows the transaction, URL Filtering is not applied at all, so a URL Filtering block on the same site does not fire. [zia.cloud-app-control.precedence:cac-allow-skips-url-filtering]
- links-to references/_meta/text/zia/zia.cloud-app-control.custom-applications.md (SaaS Applications page: application status, tags and custom cloud applications)
- links-to references/_meta/text/zia/zia.dlp.rules.md (Web DLP policy rules: order, criteria and actions)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/cloud-app-instances.md (config type)
- see-also references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
