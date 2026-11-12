# The Log Receivers page in the Admin Console (zpa.log-receivers.admin-console)
Also called: log receivers page; copy log receiver; deception log receiver read only

The Log Receivers page lists, copies, edits and deletes receivers.

**List.** The Log Receivers page shows for each receiver its name, domain name or IP address, TCP port, TLS Encryption status and log type, and the receiver's details add the description, the App Connector groups and the log stream content. [zpa.log-receivers.admin-console:page-columns]

**Operations.** A receiver can be copied to create a new configuration, edited and deleted from the page. [zpa.log-receivers.admin-console:copy-edit-delete] If a log receiver is configured using Zscaler Deception, the copy, edit and delete options are unavailable. [zpa.log-receivers.admin-console:deception-readonly]

What to check:
1. Whether the receiver was created by Zscaler Deception when copy, edit and delete are missing.
2. Which columns to read for a quick check of address, port, TLS and log type.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
- see-also references/_meta/text/zpa/zpa.audit-logs.access.md (Who can read and download ZPA audit logs)
