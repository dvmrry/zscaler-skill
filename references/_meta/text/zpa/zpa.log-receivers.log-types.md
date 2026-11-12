# Log types a ZPA log receiver can carry, and their codes (zpa.log-receivers.log-types)
Also called: lss log types; zpn_trans_log; zpn_auth_log; zpn_ast_auth_log; zpn_http_trans_log; zpn_sys_auth_log; zpn_ast_comprehensive_stats; zpn_pbroker_comprehensive_stats; zpn_waf_http_exchanges_log; zms_flow_log; zpn_sitec_auth_log; zpn_smb_inspection_log; zpn_auth_log_1id; sourceLogType values; source_log_type
Former IDs: zpa-40, zpa-41

The help, the API and the tools name the log types differently and accept different sets of them.

**The types.** The Log Streaming Service page lists nineteen log types a receiver can capture: AppProtection, Audit Logs, App Connector Metrics, App Connector Status, Browser Access Logs, Business Continuity Event Log Fields, KRB Inspection Logs, LDAP Inspection Logs, Microsegmentation, Private Cloud Controller Metrics and Status, two User Status VPN Service Edge types, Traffic Flow - VPN, Private Service Edge Metrics and Status, SMB Inspection Logs, User Activity and User Status. [zpa.log-receivers.log-types:help-log-types] The field schemas of the per-type logs are in the legacy references: User Activity [What a ZPA User Activity log record says and does not say](kb:zpa.logs.user-activity), User Status [What a ZPA User Status log record says and does not say](kb:zpa.logs.user-status), App Connector Status [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status), App Connector Metrics [What the ZPA App Connector Metrics log reports and what it leaves open](kb:zpa.logs.app-connector-metrics), Browser Access [What a ZPA Browser Access log record says and does not say](kb:zpa.logs.browser-access), Microsegmentation Flow [What a ZPA Microsegmentation Flow log record says and does not say](kb:zpa.logs.microsegmentation-flow), Private Service Edge Status [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status) and Metrics [Private Service Edge and Private Cloud Controller Metrics logs](kb:zpa.logs.service-edge-metrics), Private Cloud Controller Status [ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers](kb:zpa.logs.control-session-status) and Metrics [Private Service Edge and Private Cloud Controller Metrics logs](kb:zpa.logs.service-edge-metrics).

**Codes in the API.** The LSS API article lists sixteen sourceLogType values: zpn_trans_log (User Activity), zpn_auth_log (User Status), zpn_ast_auth_log (App Connector Status), zpn_http_trans_log (Browser Access), zpn_audit_log (Audit Log), zpn_sys_auth_log (Private Service Edge Status), zpn_ast_comprehensive_stats (App Connector Metrics), zpn_waf_http_exchanges_log (AppProtection), zpn_smb_inspection_log, zpn_ldap_inspection_log, zpn_krb_inspection_log, zpn_pbroker_comprehensive_stats (Private Service Edge Metrics), zpn_sitec_auth_log and zpn_sitec_comprehensive_stats (Private Cloud Controller Status and Metrics), zms_flow_log (Microsegmentation Flow Logs) and zpn_siem_type_bc_event_log (Business Continuity Events). [zpa.log-receivers.log-types:code-map] LSS configurations cannot be created or updated with zpn_siem_type_bc_event_log as the sourceLogType. [zpa.log-receivers.log-types:bc-event-not-writable]

**Subsets in tools.** The Python SDK maps exactly eight keys to codes, and these are the only values it accepts for a receiver's source log type: app_connector_metrics, app_connector_status, audit_logs, browser_access, private_svc_edge_status, user_activity, user_status and web_inspection. [zpa.log-receivers.log-types:python-source-map] The Terraform resource zpa_lss_config_controller accepts nine source_log_type codes: zpn_trans_log, zpn_auth_log, zpn_ast_auth_log, zpn_http_trans_log, zpn_audit_log, zpn_ast_comprehensive_stats, zpn_sys_auth_log, zpn_waf_http_exchanges_log and zpn_pbroker_comprehensive_stats. [zpa.log-receivers.log-types:tf-resource-types] The zpa_lss_config_log_type_formats data source validates log_type against sixteen codes: the nine of the resource plus zpn_smb_inspection_log, zpn_auth_log_1id, zpn_sitec_auth_log, zpn_sitec_comprehensive_stats, zpn_ldap_inspection_log, zms_flow_log and zpn_krb_inspection_log. [zpa.log-receivers.log-types:tf-format-lookup-types] The Terraform resource rejects six codes the API article lists as supported for a receiver: zpn_smb_inspection_log, zpn_ldap_inspection_log, zpn_krb_inspection_log, zpn_sitec_auth_log, zpn_sitec_comprehensive_stats and zms_flow_log, so those receivers cannot be created through the resource. [zpa.log-receivers.log-types:tf-narrower-than-api]

**Single types.** The audit log stream is in [Streaming ZPA audit logs to a SIEM: log type, fields, filtering](kb:zpa.audit-logs.streaming), the AppProtection stream in [Where AppProtection events go: the LSS log type and its fields](kb:zpa.appprotection.logging) and the Browser Access stream in [Browser Access in LSS: log type and identity field](kb:zpa.browser-access.logs). The VPN console pages are in [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn) and [VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data](kb:zpa.vpn.diagnostics); how they relate to the streamed VPN types is open there.

Whether the API accepts the codes the provider's resource rejects was an open question until the API article was captured [gap:zpa.log-receivers.log-types:format-only-codes]. One format-lookup code has no label in any source [gap:zpa.log-receivers.log-types:auth-log-1id-label].

**Business Continuity Event log.** Its field table and its example record differ on the Component field and the timestamp name [divergence:zpa.log-receivers.log-types:business-continuity-event-fields].

What to check:
1. Which code the log type uses on the wire, from the API article's list, before reading the SDK or provider list.
2. Whether the tool in use accepts the code: the Python SDK takes eight keys, the Terraform resource nine codes, the format-lookup data source sixteen.
3. That Business Continuity Events cannot be created or updated through sourceLogType.
4. Whether zpn_auth_log_1id is being used, which only the format lookup knows.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.log-types:tf-narrower-than-api] Tier B: Set difference between the two sourceLogType lists; the resource validates source_log_type with validation.StringInSlice, which rejects any value outside its list. The server-side behavior of the API is taken from the article, not tested.

Sources disagree (name both sides):
- On the Business Continuity Event log fields page, the table describes Component as the maximum CPU usage in the past 5 minutes and names the timestamp LogTimeStamp, while the example record carries "Zscaler Client Connector" for Component and names the timestamp LogTimestamp. [divergence:zpa.log-receivers.log-types:business-continuity-event-fields]
  - zscaler-help: Table: Component is the maximum CPU usage in the past 5 minutes, and the timestamp field is LogTimeStamp.
  - zscaler-help: Example record: Component is "Zscaler Client Connector", and the timestamp field is LogTimestamp.
  Impact: A consumer cannot tell from the article whether Component is a CPU figure or a component name, or whether the timestamp field is LogTimeStamp or LogTimestamp.

Not known (open gaps):
- What zpn_auth_log_1id is [gap:zpa.log-receivers.log-types:auth-log-1id-label]: settled by support-ticket or lab-test

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers)
- links-to references/_meta/text/zpa/zpa.logs.service-edge-metrics.md (Private Service Edge and Private Cloud Controller Metrics logs)
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zpa/zpa.appprotection.logging.md (Where AppProtection events go: the LSS log type and its fields)
- links-to references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
- links-to references/_meta/text/zpa/zpa.browser-access.logs.md (Browser Access in LSS: log type and identity field)
- links-to references/_meta/text/zpa/zpa.logs.app-connector-metrics.md (What the ZPA App Connector Metrics log reports and what it leaves open)
- links-to references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.microsegmentation-flow.md (What a ZPA Microsegmentation Flow log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)
- links-to references/_meta/text/zpa/zpa.logs.user-status.md (What a ZPA User Status log record says and does not say)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.diagnostics.md (VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
- see-also references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
