# Streaming ZPA audit logs to a SIEM: log type, fields, filtering (zpa.audit-logs.streaming)
Also called: zpn_audit_log; lss audit log; audit log fields; auditOldValue; auditNewValue; auditOperationType; clientAuditUpdate; stream zpa audit logs to splunk; siem policy audit
Former IDs: zpa-32, zpa-33, zpa-34, zpa-35

Audit logs are streamed by a log receiver of the Audit Logs type; the receiver mechanics are in [ZPA log receivers and the Log Streaming Service](kb:zpa.log-receivers).

**Log type.** The Audit Logs log type carries session information for all admins accessing the Zscaler Admin Console. [zpa.audit-logs.streaming:audit-log-type] A log receiver's source log type for audit logs is `zpn_audit_log`; the Python SDK reaches it through the `audit_logs` key. [zpa.audit-logs.streaming:audit-source-type]

**Fields.** The field list was an open question until the field article was captured [gap:zpa.audit-logs.streaming:field-schema]. By default the audit stream carries thirteen fields in each template (CSV, JSON, TSV): modifiedTime, creationTime, modifiedBy, requestID, auditOldValue, auditNewValue, auditOperationType, objectType, objectName, objectID, customerID, modifiedByUser and clientAuditUpdate. [zpa.audit-logs.streaming:default-fields] auditOperationType takes Create, Client Session Revoked, Delete, Download, Sign In, Sign In Failure, Sign Out and Update; the Nonce MaxUsage Increment action of the console is not listed for this field. [zpa.audit-logs.streaming:operation-values] auditOldValue holds the previous value when the action is delete, sign out or update, and auditNewValue holds the new value when the action is create, sign in or update; for a policy object the value is Allow for an access policy, Intercept for a client forwarding policy and Re_Auth for a timeout policy. [zpa.audit-logs.streaming:old-new-value] objectType is the location in the Admin Console where the action was performed and corresponds to the Resource Type on the Audit Log page; objectName corresponds to the Resource Name. [zpa.audit-logs.streaming:object-fields] clientAuditUpdate indicates whether the entry is associated with admin or client credentials, with expected values 0 and 1. [zpa.audit-logs.streaming:client-audit-update] While configuring the log receiver the default log stream content can be edited to capture only specific fields, which creates a Custom log template. [zpa.audit-logs.streaming:custom-template]

**Delivery.** The audit-log exception to the loss behavior is in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health); what the exception means is open [gap:zpa.audit-logs.streaming:audit-recovery-mechanism].

**Filtering.** The Terraform provider rejects a status-code filter on a `zpn_audit_log` receiver, and the documented status-codes response lists codes only for the User Status, App Connector Status, User Activity and Private Service Edge Status log types. [zpa.audit-logs.streaming:no-audit-status-filter] The Terraform provider accepts policy rule operands only on User Status and User Activity receivers and returns an invalid-source-log-type error for any other source log type, which includes `zpn_audit_log`. [zpa.audit-logs.streaming:no-audit-policy-rule] [The Python SDK describes SIEM_POLICY as the parent policy set of a receiver's policy rule: policyRuleResource must carry the policySetId of that set, which the SDK looks up from the SIEM_POLICY policy type before it sends policy_rules.](kb:zpa.log-receivers.filtering:siem-policy-set) What the API itself accepts for an audit-log receiver is open [gap:zpa.audit-logs.streaming:audit-filter-api] [gap:zpa.audit-logs.streaming:siem-policy-purpose].

**Microtenants.** On a log receiver, when a Microtenant is disabled only audit logs are streamed for it, and all Microtenants are selected by default when the receiver is configured in the Default Microtenant. [zpa.audit-logs.streaming:disabled-microtenant-audit-only] Audit Logs of the Default Microtenant are not visible to a Microtenant admin [Microtenant admin permissions](kb:zpa.microtenants.admin-permissions), and deleting a Microtenant deletes the log receivers it is associated with [Microtenant lifecycle: create, disable, delete](kb:zpa.microtenants.lifecycle). How a microtenant's own audit entries are scoped between it and its parent is open [gap:zpa.audit-logs.streaming:microtenant-scoping].

What to check:
1. That the receiver's log type is Audit Logs (source log type zpn_audit_log) rather than User Activity.
2. Which fields the receiver's stream content includes, against the default field list, if a custom template was saved.
3. Whether the entry is a change or a session event from auditOperationType, and which of auditOldValue or auditNewValue applies.
4. That no status-code filter or streaming policy is expected to narrow an audit-log receiver.
5. Whether a gap in the SIEM data coincides with a connection loss, and that the audit-log exception is not described further.
6. Whether microtenants are enabled on the receiver when a microtenant's audit entries are missing, and which microtenant the admin belongs to.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.audit-logs.streaming:no-audit-status-filter] Tier B: Provider behavior plus an absence in an example response: the status-codes example in the API article shows four top-level log types and none for audit logs. What the server does with a filter sent directly is not shown (see gap audit-filter-api).
- [zpa.audit-logs.streaming:no-audit-policy-rule] Tier B: Reading the object-type switch in validateLSSConfigControllerFilters: the cases are zpn_auth_log and zpn_trans_log and the default returns the error. This is the client's validation, not the server's.

Not known (open gaps):
- What the audit-log exception to the loss behavior does [gap:zpa.audit-logs.streaming:audit-recovery-mechanism]: settled by lab-test or support-ticket
- Whether the API accepts a filter on an audit-log receiver [gap:zpa.audit-logs.streaming:audit-filter-api]: settled by lab-test
- Whether a SIEM policy rule can narrow an audit-log stream [gap:zpa.audit-logs.streaming:siem-policy-purpose]: settled by lab-test or source-read
- Whether a microtenant's audit entries are isolated or visible to the parent [gap:zpa.audit-logs.streaming:microtenant-scoping]: settled by lab-test or tenant-data

Area: zpa.audit-logs, its subjects in references/_meta/spine/zpa/zpa.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service): A log receiver's source log type for audit logs is `zpn_audit_log`; the Python SDK reaches it through the `audit_logs` key. [zpa.audit-logs.streaming:audit-source-type]
- interacts-with references/_meta/text/zpa/zpa.microtenants.lifecycle.md (Microtenant lifecycle: create, disable, delete): On a log receiver, when a Microtenant is disabled only audit logs are streamed for it, and all Microtenants are selected by default when the receiver is configured in the Default Microtenant. [zpa.audit-logs.streaming:disabled-microtenant-audit-only]
- depends-on references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required): While configuring the log receiver the default log stream content can be edited to capture only specific fields, which creates a Custom log template. [zpa.audit-logs.streaming:custom-template]
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.log-receivers.filtering.md (Narrowing a ZPA log stream: status codes and streaming policy)
- links-to references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.audit-logs.what-is-recorded.md (What the ZPA admin audit log records, how long it is kept, and whether it can be pulled)
