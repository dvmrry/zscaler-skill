# FTP Control settings and API object (zia.ftp-control.settings)
Also called: ftp control settings; ftpSettings; allow ftp over http; allow native ftp; ftp allowed urls; ftp control api; zia_ftp_control_policy

The FTP Control page has an Allow FTP over HTTP option that lets browsers connect to FTP over HTTP sites and download files. A remote user on a dedicated port is supported for FTP over HTTP. [zia.ftp-control.settings:allow-fohttp] Allow Native FTP lets users connect to native FTP sites and download files. When it is on, Allow Any URL Category opens FTP to every category. With that off, the policy is limited to the Allowed URL Categories (super categories, categories or both, including custom categories) and up to 25,000 Allowed URLs. [zia.ftp-control.settings:native-ftp-scoping] The recommended FTP Control policy, which the Zscaler service includes on the FTP Control page, disables Allow FTP over HTTP and Allow Native FTP, and, listed after Allow Native FTP, disables Allow Any URL Category and sets Allowed URL Categories to None. [zia.ftp-control.settings:recommended-ftp-policy] The recommended policy does not state the tenant default, which stays open [gap:zia.ftp-control.settings:native-ftp-default]. Allowed URLs work when the FTP proxy can retrieve the URLs. With transparent traffic forwarding, enter an IP address instead of a URL. The vendor's alternatives are an FQDN-based Firewall rule that allows the traffic, forward proxy mode, or FTP traffic over HTTP CONNECT. [zia.ftp-control.settings:urls-need-proxy-retrieval] Allowed URLs in FTP Control settings count toward the 25K custom URLs/TLDs limit, together with custom category entries, auth exemption URLs and the other lists the limits page names. [zia.ftp-control.settings:allowed-urls-count-toward-custom-limit] The FTP Control configuration steps describe two allow-or-block settings, FTP over HTTP and native FTP, with URL category and URL scoping for native FTP. They describe no allow/block/alert action selector and no user, group or department scoping. [zia.ftp-control.settings:console-has-no-action-or-user-scope] The ALLOW, CAUTION and BLOCK actions belong to File Type Control: [File Type Control actions, direction and defaults](kb:zia.file-type-control.actions).

Over the API: FTP Control is one settings object. The API exposes `GET` and `PUT` on `/ftpSettings` and nothing to create or delete rules. [zia.ftp-control.settings:api-get-put] The settings object has four fields: `ftpOverHttpEnabled`, `ftpEnabled`, `urlCategories` and `urls`. A read returns `ftpEnabled` and `ftpOverHttpEnabled` always. [zia.ftp-control.settings:api-fields] Enabling FTP over HTTP for Client Connector and PAC users is a single boolean write, `ftpOverHttpEnabled`, scoped by `urlCategories` and `urls`; there is no per-flow rule object. [zia.ftp-control.settings:enable-fohttp-flag] The shape of `urlCategories` differs between sources [divergence:zia.ftp-control.settings:url-categories-element-type].

The default of the native FTP switch is open [gap:zia.ftp-control.settings:native-ftp-default], and how Allow Any URL Category appears in the API is open [gap:zia.ftp-control.settings:allow-any-category-representation].

Defaults and passive-only behavior are in [FTP Control scope, protocols and precedence](kb:zia.ftp-control.scope); who the policy applies to is in [FTP Control scope, protocols and precedence](kb:zia.ftp-control.scope).

What to check:
1. Whether a rule list, action column or user scoping is being sought for FTP, since the console documents none.
2. Whether URL Filtering precedence explains an FTP failure, checked before the user's location when the settings look right.

Inferred, not quoted (say so when an answer rests on one):
- [zia.ftp-control.settings:console-has-no-action-or-user-scope] Tier B: Rests on an absence. The recaptured configuration page (revision 3240462) lists every setting on the Edit page; none is an action or a user, group, department or location selector. A tenant console could still expose more than the help page documents.
- [zia.ftp-control.settings:enable-fohttp-flag] Tier B: Follows from the console option, the API fields and the settings object's GET/PUT shape (the claims derived from); the absence of a per-flow rule object rests on the API surface having no FTP rule endpoint.

Sources disagree (name both sides):
- The contract shapes `urlCategories` as objects; the Python SDK model forms the list as strings. [divergence:zia.ftp-control.settings:url-categories-element-type]
  - api-specs: urlCategories items are URL category objects (name, backendName, urlSupercategory and more).
  - sdk-python: The model forms the urlCategories list with element type str.
  Impact: Reading or round-tripping `urlCategories` through the Python SDK may not preserve the category objects the API returns. What the API accepts on write is not shown by either source.

Not known (open gaps):
- Default of ftpEnabled and what turning it off does [gap:zia.ftp-control.settings:native-ftp-default]: settled by tenant-data or lab-test. Blocks: advising whether a tenant that never touched FTP Control allows native FTP
- How Allow Any URL Category appears in the API [gap:zia.ftp-control.settings:allow-any-category-representation] (data gap): filled by live; run `zscalerctl zia ftp-control-policy show`; settled by tenant-data or lab-test. Blocks: reading a tenant's native FTP scope from its API object

Area: zia.ftp-control, its subjects in references/_meta/spine/zia/zia.ftp-control.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.ftp-control.scope.md (FTP Control scope, protocols and precedence), from zia.ftp-control: The FTP Control policy applies to traffic from the known locations of an organization. For a remote user on a dedicated port the service supports FTP over HTTP, and it can scan the content their browser downloads from FTP sites for viruses and spyware. [zia.ftp-control.scope:location-scope]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control): FTP Control settings are configured within Firewall: the firewall policy help points to FTP Control for them. [zia.ftp-control.scope:ftp-sits-in-firewall]
- interacts-with references/_meta/text/zia/zia.file-type-control.md (ZIA File Type Control), from zia.ftp-control: DLP, Sandbox and File Type Control policies can also be applied to files extracted from FTP and FTP over HTTP. [zia.ftp-control.scope:dlp-sandbox-ftc-on-extracted]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.ftp-control: Scanning of FTP over HTTP and native FTP traffic is enabled or disabled on the Malware Protection page; the FTP Control page allows or blocks that traffic. In Malware Protection, the Protocol Inspection section has Inspect FTP over HTTP and Inspect FTP toggles. Each scans all files, including those with up to 5 layers of recursive compression, in the direction the Traffic Inspection setting selects. [zia.ftp-control.scope:malware-toggles]
- scoped-by references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): Allow Native FTP lets users connect to native FTP sites and download files. When it is on, Allow Any URL Category opens FTP to every category. With that off, the policy is limited to the Allowed URL Categories (super categories, categories or both, including custom categories) and up to 25,000 Allowed URLs. [zia.ftp-control.settings:native-ftp-scoping]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering), from zia.ftp-control: URL Filtering rules take precedence over the FTP Control policy. [zia.ftp-control.scope:ftp-url-filtering-precedence]
- links-to references/_meta/text/zia/zia.file-type-control.actions.md (File Type Control actions, direction and defaults)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/ftp-control-policy.md (config type)
- see-also references/_meta/text/zia/zia.ftp-control.md (ZIA FTP Control)
