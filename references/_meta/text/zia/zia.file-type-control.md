# ZIA File Type Control (zia.file-type-control)
Also called: file type control; file type policy; block file types; upload download file type; block mp3 zip exe; ftc

"Why was this file blocked, or why was it not?" needs four questions answered in order.

1. **Does a rule exist and is it enabled?** With no matching rule every file type is allowed, and a new rule starts disabled: [File Type Control actions, direction and defaults](kb:zia.file-type-control.actions).
2. **Do the rule's criteria match this file?** File type (including unknown and inside archives), size, active content, unscannable and password-protected conditions, protocols and scope: [File Type Control rule criteria](kb:zia.file-type-control.criteria).
3. **Did the traffic reach File Type Control, and in what order?** Decryption, the position relative to Malware Protection, DLP and Sandbox, and the 400 MB scanning limit: [Where File Type Control sits in the inspection order](kb:zia.file-type-control.pipeline). For FTP flows start with [ZIA FTP Control](kb:zia.ftp-control).
4. **What does the match do?** Allow, Caution or Block, in the rule's direction: [File Type Control actions, direction and defaults](kb:zia.file-type-control.actions).

For tenant data and automation, field names, enums and the custom file type endpoints are in [File Type Control API shape: rules, categories and custom types](kb:zia.file-type-control.api-shape). SSH is not a File Type Control or inspection topic: [SSH traffic in ZIA: what is and is not inspected](kb:zia.ssh-control).

Area: zia.file-type-control, its subjects in references/_meta/spine/zia/zia.file-type-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.file-type-control.actions.md (File Type Control actions, direction and defaults): Each rule's action applies to uploads, downloads or both. [zia.file-type-control.actions:operation]
- decided-by references/_meta/text/zia/zia.file-type-control.criteria.md (File Type Control rule criteria): A rule fires when all of these hold: File Types AND URL Categories AND Cloud Applications AND Application Segment; Users OR Groups OR Departments; Location Groups OR Locations; Time; Device Groups OR Devices; Protocols; Device Trust Level; Minimum File Size; Maximum File Size. [zia.file-type-control.criteria:criteria-expression]
- interacts-with references/_meta/text/zia/zia.file-type-control.pipeline.md (Where File Type Control sits in the inspection order): For an HTTP POST request, File Type Control checks the POST after Malware Protection and before Data Loss Prevention. For a GET or POST response, it checks the files in the response after Malware Protection and before the Sandbox analysis of unknown files. [zia.file-type-control.pipeline:post-and-response-position]
- interacts-with references/_meta/text/zia/zia.ftp-control.md (ZIA FTP Control): A File Type Control rule's Protocols criterion includes FTP over HTTP (files from FTP over HTTP websites) and Native FTP (files from native FTP servers); both require a Firewall subscription. [zia.file-type-control.actions:ftp-via-protocol-criterion]
- interacts-with references/_meta/text/zia/zia.dlp.evaluation.md (Why DLP did or did not fire: pipeline position, evaluation mode and exemptions): For a POST request the Public Service Edge applies policies in a listed order in which Cloud App Control, URL Filtering, Malware Protection and File Type Control all come before Data Loss Prevention. [zia.dlp.evaluation:dlp-after-url-and-file-type]
- scoped-by references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group): A rule's Locations and Location Groups each take Any or up to 32 entries, and Time takes Always or up to two time intervals. A rule for unauthenticated traffic must apply to all Groups and Departments. [zia.file-type-control.criteria:scope-limits]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection): These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many): These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- links-to references/_meta/text/zia/zia.file-type-control.api-shape.md (File Type Control API shape: rules, categories and custom types)
- links-to references/_meta/text/zia/zia.ssh-control.md (SSH traffic in ZIA: what is and is not inspected)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/file-type-rules.md (config type)
- configured-via references/_meta/text/types/zia/custom-file-types.md (config type)
- see-also references/_meta/text/zia/zia.file-type-control.runbook.md (How the Internet & SaaS File Type Control policy troubleshooting runbook confirms fault and checks detection, SSL inspection, protocol and rule criteria)
