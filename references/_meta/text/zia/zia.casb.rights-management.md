# Watermark and redaction profiles for Data at Rest Scanning DLP (zia.casb.rights-management)
Also called: watermark profile; watermarking; redaction profile; redaction; watermarkProfile; redactionProfile

Watermark profiles are used in SaaS Security Data at Rest Scanning DLP: when sensitive content triggers a rule, the service uses the watermark profile associated with the rule to superimpose text diagonally across pages and images, and a profile can also include headers and footers. The profiles add watermark content to multiple file types. [zia.casb.rights-management:watermark-what]

**Watermark profile fields.** A watermark profile has a Profile Name of up to 128 characters, optional Header Text and Footer Text of up to 50 characters each, and Watermark Text of up to 15 characters; the font style (color, size, style) is applied automatically and cannot be configured. [zia.casb.rights-management:watermark-fields] The Watermarking page lists each profile's Profile Name and Watermark Text, both sortable, with actions to edit or delete a watermark profile. [zia.casb.rights-management:watermark-page] The file types watermarking supports are open [gap:zia.casb.rights-management:watermark-file-types].

**Redaction.** Redaction profiles are used in SaaS Security Data at Rest Scanning DLP to hide sensitive content: when content triggers a rule, the service uses the redaction profile associated with the rule to replace the content to protect with asterisk (*) or hash (#) characters. [zia.casb.rights-management:redaction-what]

**Redaction profile fields.** A redaction profile has a Profile Name of up to 128 characters and a Redaction Type of Use Asterisks to Redact or Use Hash Signs to Redact; the Redaction page lists the Redaction Type (asterisks or hash signs) as a sortable column. [zia.casb.rights-management:redaction-fields] Redaction profiles support Archive (.tar, .zip), Comma-Separated Value (.csv), Microsoft Excel (.xls, .xlsm, .xltm, .xlsx, .xltx), Microsoft PowerPoint (.ppt, .pptm, .ppsm, .potm, .pptx, .ppsx, .potx), Microsoft Word (.doc, .docm, .dotm, .docx, .dotx), PDF (editable and read-only files), Plain Text (.txt) and Rich Text (.rtf) files. [zia.casb.rights-management:redaction-file-types]

**Which rule applies a profile.** Which rule action applies a watermark or redaction profile is open [gap:zia.casb.rights-management:applying-action]. The rule's versioning choice for watermarked files is in [CASB Data at Rest Scanning DLP rules](kb:zia.casb.dlp-rules), and restoring a redacted version is in [CASB quarantine and tombstone files](kb:zia.casb.quarantine).

What to check:
1. Whether a watermark profile's header, footer and watermark text are within 50, 50 and 15 characters, and that the font style cannot be configured.
2. Whether the file is of a type redaction profiles support.
3. Whether the question needs the file types watermarking supports or the action that applies a profile, which no captured page states.

Not known (open gaps):
- Which file types watermarking supports [gap:zia.casb.rights-management:watermark-file-types]: settled by source-read or lab-test
- Which rule action applies a watermark or redaction profile [gap:zia.casb.rights-management:applying-action]: settled by source-read or lab-test

Area: zia.casb, its subjects in references/_meta/spine/zia/zia.casb.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.casb.dlp-rules.md (CASB Data at Rest Scanning DLP rules), from zia.casb: Data at Rest Scanning DLP rules are evaluated in ascending rule order, and a disabled rule keeps its place in the order while the service skips it and moves to the next rule. [zia.casb.dlp-rules:rule-order-ascending]
- logged-in references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming), from zia.casb: SaaS Security Insights logs show every scan performed by the Zscaler SaaS Connector for a SaaS application tenant and are stored for 180 days on the Nanolog servers. [zia.casb.insights-logs:retention-180]
- decided-by references/_meta/text/zia/zia.casb.rule-types.md (CASB rule types: the eight categories and their separate rule lists), from zia.casb: DLP rule order is defined relative to other Data at Rest Scanning DLP rules and malware rule order relative to other Data at Rest Scanning Malware rules, so the two kinds are separate ordered lists. [zia.casb.rule-types:order-separate-lists]
- depends-on references/_meta/text/zia/zia.casb.scans.md (CASB scan schedules: states, historical data, stop and restart), from zia.casb: A configured rule inspects nothing until it is added to a scan schedule: the Zscaler service does not inspect content until a scan is configured. [zia.casb:no-scan-no-inspection]
- depends-on references/_meta/text/zia/zia.casb.tenants.md (CASB tenants: connecting a SaaS application, states and reauthorization), from zia.casb: Zscaler Data at Rest Scanning provides visibility and security for the sanctioned SaaS applications used in the organization, and a SaaS application is authorized with Zscaler by adding it as a tenant. [zia.casb.tenants:tenant-authorizes-app]
- links-to references/_meta/text/zia/zia.casb.quarantine.md (CASB quarantine and tombstone files)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.casb.md (ZIA CASB (SaaS Security API): scanning data at rest in sanctioned SaaS applications)
