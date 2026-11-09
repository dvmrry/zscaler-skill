# ZIA FTP Control (zia.ftp-control)
Also called: ftp control; zia ftp; native ftp; ftp over http; ftp blocked; active ftp; ftp policy

"Why is FTP blocked, or what controls it?" takes three questions in order.

1. **Is FTP Control allowing the protocol at all?** It is a single settings object with an FTP over HTTP switch, a native FTP switch and URL scoping, not a rule list: [FTP Control settings and API object](kb:zia.ftp-control.settings). Defaults, passive-only behavior and where FTP Control sits in Firewall are in [FTP Control scope, protocols and precedence](kb:zia.ftp-control.scope).
2. **Does this user and traffic fall in scope, and does URL Filtering decide first?** Known locations, dedicated-port remote users, FTPS, malware scanning and URL Filtering precedence: [FTP Control scope, protocols and precedence](kb:zia.ftp-control.scope).
3. **Once the flow is allowed, what inspects the files?** Malware Protection, DLP, Sandbox and File Type Control act on the extracted files: [FTP Control scope, protocols and precedence](kb:zia.ftp-control.scope) and [ZIA File Type Control](kb:zia.file-type-control).

Do not look for FTP Control rules, actions or user scoping: the console documents none (see claim `console-has-no-action-or-user-scope` in [FTP Control settings and API object](kb:zia.ftp-control.settings)).

Area: zia.ftp-control, its subjects in references/_meta/spine/zia/zia.ftp-control.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zia/zia.ftp-control.scope.md (FTP Control scope, protocols and precedence): The FTP Control policy applies to traffic from the known locations of an organization. For a remote user on a dedicated port the service supports FTP over HTTP, and it can scan the content their browser downloads from FTP sites for viruses and spyware. [zia.ftp-control.scope:location-scope]
- decided-by references/_meta/text/zia/zia.ftp-control.settings.md (FTP Control settings and API object): Allow Native FTP lets users connect to native FTP sites and download files. When it is on, Allow Any URL Category opens FTP to every category. With that off, the policy is limited to the Allowed URL Categories (super categories, categories or both, including custom categories) and up to 25,000 Allowed URLs. [zia.ftp-control.settings:native-ftp-scoping]
- interacts-with references/_meta/text/zia/zia.file-type-control.md (ZIA File Type Control): DLP, Sandbox and File Type Control policies can also be applied to files extracted from FTP and FTP over HTTP. [zia.ftp-control.scope:dlp-sandbox-ftc-on-extracted]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control): FTP Control settings are configured within Firewall: the firewall policy help points to FTP Control for them. [zia.ftp-control.scope:ftp-sits-in-firewall]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection): Scanning of FTP over HTTP and native FTP traffic is enabled or disabled on the Malware Protection page; the FTP Control page allows or blocks that traffic. In Malware Protection, the Protocol Inspection section has Inspect FTP over HTTP and Inspect FTP toggles. Each scans all files, including those with up to 5 layers of recursive compression, in the direction the Traffic Inspection setting selects. [zia.ftp-control.scope:malware-toggles]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): URL Filtering rules take precedence over the FTP Control policy. [zia.ftp-control.scope:ftp-url-filtering-precedence]
