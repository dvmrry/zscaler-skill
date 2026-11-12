# ZPA admin audit logs (zpa.audit-logs)
Also called: zpa audit log; zpa admin audit; zpn_audit_log; who changed zpa config; zpa admin activity log

Who changed what in ZPA, how long the record is kept, and how it reaches a SIEM.

1. **What is recorded, for how long, and can it be pulled?** [What the ZPA admin audit log records, how long it is kept, and whether it can be pulled](kb:zpa.audit-logs.what-is-recorded).
2. **How is it streamed, and which fields arrive?** [Streaming ZPA audit logs to a SIEM: log type, fields, filtering](kb:zpa.audit-logs.streaming), with the receiver mechanics in [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers).
3. **Who may read and download it?** [Who can read and download ZPA audit logs](kb:zpa.audit-logs.access).

ZIA keeps a separate, pull-based audit log: [ZIA audit logs: who changed what](kb:zia.audit-logs).

Area: zpa.audit-logs, its subjects in references/_meta/spine/zpa/zpa.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service): A log receiver's source log type for audit logs is `zpn_audit_log`; the Python SDK reaches it through the `audit_logs` key. [zpa.audit-logs.streaming:audit-source-type]
- links-to references/_meta/text/zia/zia.audit-logs.md (ZIA audit logs: who changed what)
- links-to references/_meta/text/zpa/zpa.audit-logs.access.md (Who can read and download ZPA audit logs)
- links-to references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
- links-to references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled)
