# Redaction of sensitive text in isolation by DLP engine: settings, behaviour and what it does not cover (zbi.data-redaction)
Also called: redactive sensitive text; isolation data redaction; Data Redaction tab; redact editable fields; display last 4 characters

Redaction in an isolation profile (Internet & SaaS or Private Access) lets the admin choose which sensitive information from which Internet & SaaS DLP engines is redacted for users during isolation. [zbi.data-redaction:what-is-redacted] During an isolated session, sensitive data on a web page is replaced in real time with password-blocking symbols, and printing is also subject to redaction. [zbi.data-redaction:replacement-symbols] Enabling redaction does not impact files: images, PDFs and uploaded or downloaded file types still show sensitive data. [zbi.data-redaction:files-not-redacted]

**Internet & SaaS settings.** The Internet & SaaS profile Data Redaction tab takes DLP engines, the dictionaries to redact for each engine, web page redaction, optional redaction of editable fields rendered in web pages, clipboard data redaction, a redaction message, and an option to display the last four characters. [zbi.data-redaction:zia-redaction-settings] Clipboard data redaction can be configured only if the Allow Copy & Paste From settings are enabled on the Security tab (stated in both profile articles). [zbi.data-redaction:clipboard-needs-copy-paste]

**Private Access labels.** The Private Access profile labels the engine setting DLP Engines to Match and the editable-field setting Redact Data Entry Fields. [zbi.data-redaction:pa-redaction-labels]

What to check:
1. Whether the file or image that still shows sensitive data is covered by redaction at all.
2. Whether Allow Copy & Paste From is enabled on the Security tab before clipboard redaction is configured.

Area: zbi.data-redaction, its subjects in references/_meta/spine/zbi/zbi.data-redaction.json
