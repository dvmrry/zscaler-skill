# What the ZPA admin audit log records, how long it is kept, and whether it can be pulled (zpa.audit-logs.what-is-recorded)
Also called: zpa audit log retention; zpa audit log 6 months; zpa audit api; zpa audit log export; zpa admin sign in log; audit log api key client id

The ZPA audit log is the admin-side record of the Private Access configuration.

**What it records.** ZPA records session information for every admin who signs in to the Zscaler Admin Console: the audit log shows sign-in and sign-out attempts, actions and request ID, including the configuration changes made during the session. [zpa.audit-logs.what-is-recorded:admin-sessions] Changes made through the API are recorded as well: the Client ID column holds the client ID of the API key that made the change, and the Action column covers actions performed by an admin or via the API. [zpa.audit-logs.what-is-recorded:api-changes] The Action column takes nine values: Create, Update, Delete, Download, Nonce MaxUsage Increment, Sign In, Sign Out, Sign In Failure and Client Session Revoked. [zpa.audit-logs.what-is-recorded:actions] For each action the console can show the differences between the pre-configuration and post-configuration values, and the details can be downloaded as a JSON file. [zpa.audit-logs.what-is-recorded:pre-post-values] For policy configuration changes, when a criterion is set to Any the action is recorded but the change details do not display Any for that criterion. [zpa.audit-logs.what-is-recorded:policy-any-omitted] Log Receiver is one of the Resource Types an audit entry can carry, so changes to log receivers are themselves audited. [zpa.audit-logs.what-is-recorded:log-receiver-resource-type]

**How long.** The ZPA Audit Logs page states that audit logs are stored for up to 6 months, and its date-range filter defaults to 6 Months. [zpa.audit-logs.what-is-recorded:retention] The two help pages word the period differently [divergence:zpa.audit-logs.what-is-recorded:retention-wording].

**How to read it.** ZPA has no pull-based audit-log export in its API specification, SDKs or Terraform provider; the audit log is read in the Admin Console (with a CSV download) or streamed by the Log Streaming Service. [zpa.audit-logs.what-is-recorded:no-pull-api] The ZIA equivalent is a pull report: [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api).

How the stream reaches a SIEM: [Streaming ZPA audit logs to a SIEM: log type, fields, filtering](kb:zpa.audit-logs.streaming). Who can download: [Who can read and download ZPA audit logs](kb:zpa.audit-logs.access).

What to check:
1. Whether the change was made in an admin session or through the API, from the Admin ID and Client ID columns.
2. Whether the action is a configuration change or a session event, from the Action column.
3. Whether the change falls inside the retention window before searching the console, and whether an audit stream was already in place if it does not.
4. For a policy change, that criteria set to Any are not shown in the recorded details, so a missing criterion is not evidence it was removed.
5. Whether a receiver change appears under the Log Receiver resource type when a stream stopped or changed.
6. That no pull API exists, so an automated export means a Log Streaming Service receiver.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.audit-logs.what-is-recorded:no-pull-api] Tier B: Absence claim. A search of the ZPA OpenAPI document (automate-zscaler/openapi/zpa.openapi.json, whose only LSS-related paths are lssConfig, lssConfig/logType/formats, lssConfig/statusCodes and lssConfig/clientTypes), of the ZPA packages of the Python and Go SDKs and of the ZPA provider found `zpn_audit_log` only as an LSS log type and no audit-log retrieval path or function. The Admin Console is the only interactive reader documented.

Sources disagree (name both sides):
- How long ZPA keeps audit logs: the Audit Logs help page says they are stored for up to 6 months, while the Log Streaming Service page says Zscaler retains them for at least 6-month periods. [divergence:zpa.audit-logs.what-is-recorded:retention-wording]
  - zscaler-help: Stored for up to 6 months (a ceiling).
  - zscaler-help: Retained for at least 6-month periods during the subscription term (a floor).
  Impact: An answer that promises records older than 6 months from the console, or that treats 6 months as guaranteed, goes beyond what both pages establish; only a stream to a SIEM gives a retention the tenant controls.

Area: zpa.audit-logs, its subjects in references/_meta/spine/zpa/zpa.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service), from zpa.audit-logs: A log receiver's source log type for audit logs is `zpn_audit_log`; the Python SDK reaches it through the `audit_logs` key. [zpa.audit-logs.streaming:audit-source-type]
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
- links-to references/_meta/text/zpa/zpa.audit-logs.access.md (Who can read and download ZPA audit logs)
- links-to references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
