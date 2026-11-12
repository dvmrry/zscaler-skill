# What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes (zpa.troubleshooting.log-fields)
Also called: user activity log fields; ConnectionStatus; InternalReason; ConnectionSetupTime; AppLearnTime; CAProcessingTime; ConnectorZENSetupTime; ServerSetupTime; zpn_trans_log fields; lss policy field; lss status codes; internal status code

The User Activity log is the per-connection record that the diagnostic subjects read.

**Outcome and policy.** The Policy field of a User Activity record is the access policy rule name. [zpa.troubleshooting.log-fields:policy-field] ConnectionStatus is the status of the connection, with expected values Open, Close and Active. [zpa.troubleshooting.log-fields:connection-status-values] InternalReason is described as the internal reason for the status of the transaction. [zpa.troubleshooting.log-fields:internal-reason] Connector is the App Connector name, ConnectorZEN is the Public Service Edge that sent the request from the App Connector, and ClientZEN is the Public Service Edge for Private Access that received the request from Zscaler Client Connector. [zpa.troubleshooting.log-fields:connector-fields] The meanings of the ConnectionStatus values are not sourced [gap:zpa.troubleshooting.log-fields:status-meanings]. The LSS API returns the LSS status codes from GET /mgmtconfig/v2/admin/lssConfig/statusCodes. Its example response groups the codes under the log types zpn_auth_log, zpn_ast_auth_log, zpn_trans_log (the User Activity log type) and zpn_sys_auth_log. Under zpn_trans_log it lists codes such as BRK_MT_TERMINATED, and an entry carries an errorType, a name, an adminAction and a status: AST_MT_SETUP_ERR_NO_DNS_TO_SERVER is an ActionableError named "AC: DNS resolution failed for unmonitored app", with status Error. [zpa.troubleshooting.log-fields:status-codes-endpoint] The User Activity Diagnostics page shows an Internal Status Code. The application segment help says that for ICMP access it can show as successful (e.g., BRK_MT_TERMINATED) after the App Connector is selected "even though it is unreachable", which can occur when the App Connector has on-access or no health reporting. [zpa.troubleshooting.log-fields:internal-status-code-example] How that example fits the code's documented scope is recorded in [Private Access session status codes: where they appear, the component prefixes and the three classes](kb:zpa.troubleshooting.session-status-codes). InternalReason values appear to be the zpn_trans_log codes of the LSS status-codes response. [zpa.troubleshooting.log-fields:internal-reason-status-codes] That InternalReason carries these codes is inferred, not stated [gap:zpa.troubleshooting.log-fields:internal-reason-values].

**Destination.** Host is the destination host domain or IP address, and ServerIP and ServerPort are the destination IP address and port of the server. [zpa.troubleshooting.log-fields:server-fields]

**Timing phases.** The User Activity log's timing fields include AppLearnTime (App Connectors learning about the application and reporting to the central authority), CAProcessingTime (processing in the central authority), ConnectorZENSetupTime (setting up the connection between the App Connector and Public Service Edge), ConnectionSetupTime (the App Connector processing a notification from the App Connector selection microservice and setting up the connection to the application server) and ServerSetupTime (setting up the connection at the server). [zpa.troubleshooting.log-fields:timing-fields] What a high value in each phase means is not sourced [gap:zpa.troubleshooting.log-fields:timing-readings] [gap:zpa.troubleshooting.log-fields:app-learn-health-reporting].

**Bytes and encryption.** The ZENBytes fields hold the additional bytes since the last transaction log, while the ZENTotalBytes fields hold the totals. [zpa.troubleshooting.log-fields:byte-counters] DoubleEncryption is the double encryption status of the connection, with expected values On and Off. [zpa.troubleshooting.log-fields:double-encryption-field] What byte counters indicate with a slow setup is not sourced [gap:zpa.troubleshooting.log-fields:byte-counter-reading].

**Multimatch.** Whether the Application and AppGroup fields list all matched segments is tracked with the log schema: [What a ZPA User Activity log record says and does not say](kb:zpa.logs.user-activity).

What to check:
1. Which access policy rule fired, from the Policy field, and whether the field is empty.
2. Whether a connector name is present on a Close record, before reading connector-side causes.
3. Which timing phase is high, comparing AppLearnTime, CAProcessingTime, ConnectorZENSetupTime, ConnectionSetupTime and ServerSetupTime.
4. Whether the byte counters are per-interval or totals before comparing them.
5. Whether the InternalReason value is listed in the LSS status-codes response and, if it is, the fields its entry gives.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.troubleshooting.log-fields:internal-reason-status-codes] Tier B: No source states that the InternalReason field carries these codes, or that the Internal Status Code on the User Activity Diagnostics page is the InternalReason value; both are assumed. The inference rests on the field's description (the internal reason for the status of the transaction), on the status-codes response listing codes under zpn_trans_log, the User Activity log type, and on the application segment help giving BRK_MT_TERMINATED, a zpn_trans_log code, as an example of the Internal Status Code the User Activity Diagnostics page shows. That every InternalReason value is in the response is not shown.

Not known (open gaps):
- What Open, Close and Active mean, and the Policy field when empty [gap:zpa.troubleshooting.log-fields:status-meanings]: settled by lab-test or tenant-data
- InternalReason values [gap:zpa.troubleshooting.log-fields:internal-reason-values]: settled by support-ticket or tenant-data
- Reading a high value in each timing phase [gap:zpa.troubleshooting.log-fields:timing-readings]: settled by lab-test or support-ticket
- High AppLearnTime and Health Reporting [gap:zpa.troubleshooting.log-fields:app-learn-health-reporting]: settled by lab-test or support-ticket
- Low byte counters with a high setup time [gap:zpa.troubleshooting.log-fields:byte-counter-reading]: settled by lab-test

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say): The Policy field of a User Activity record is the access policy rule name. [zpa.troubleshooting.log-fields:policy-field]
- links-to references/_meta/text/zpa/zpa.troubleshooting.session-status-codes.md (Private Access session status codes: where they appear, the component prefixes and the three classes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- see-also references/_meta/text/zpa/zpa.troubleshooting.no-access.md (A user cannot reach a private application at all)
- see-also references/_meta/text/zpa/zpa.troubleshooting.slow.md (A ZPA application is slow)
- see-also references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
