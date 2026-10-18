"Why is FTP blocked, or what controls it?" takes three questions in order.

1. **Is FTP Control allowing the protocol at all?** It is a single settings object with an FTP over HTTP switch, a native FTP switch and URL scoping, not a rule list: [[zia.ftp-control.settings]]. Defaults, passive-only behavior and where FTP Control sits in Firewall are in [[zia.firewall]].
2. **Does this user and traffic fall in scope, and does URL Filtering decide first?** Known locations, dedicated-port remote users, FTPS, malware scanning and URL Filtering precedence: [[zia.ftp-control.scope]].
3. **Once the flow is allowed, what inspects the files?** Malware Protection, DLP, Sandbox and File Type Control act on the extracted files: [[zia.ftp-control.scope]] and [[zia.file-type-control]].

Do not look for FTP Control rules, actions or user scoping: the console documents none (see claim `console-has-no-action-or-user-scope` in [[zia.ftp-control.settings]]).
