# What a ZPA User Activity log record says and does not say (zpa.logs.user-activity)
Also called: zpn_trans_log record; user activity log fields; ConnectionStatus Open Close Active; ZENBytes since last transaction log; ServerSetupTime; ConnectionSetupTime; multi-segment match LSS; PRAFileTransferList; ClientZEN ConnectorZEN; ConnectionID SessionID

The User Activity log (zpn_trans_log) carries one record per application connection, but several things about how records relate are not stated in the vendor help.

**Identity.** The User Activity Username is the username as entered into Zscaler Client Connector, and the User Status log has a Username field described only as the user name. [zpa.logs.user-activity:username-in-both-logs] Whether the two values are the same, or an email address, is open [gap:zpa.logs.user-activity:username-identity]. The console's Diagnostics pages describe the Username differently [What a ZPA User Activity entry shows in Diagnostics and Live Logs](kb:zpa.troubleshooting.user-activity-diagnostics). Hostname is the device name as reported by Zscaler Client Connector and only provides valid values for Zscaler Client Connector and machine tunnel client types. [zpa.logs.user-activity:hostname-client-types]

**Connection keys.** In the User Activity example record ConnectionID is two comma-joined values whose first part equals the record's SessionID, while the field table describes ConnectionID only as the application connection ID and SessionID as the TLS session ID. [zpa.logs.user-activity:connection-id-pair] How a multi-segment sequence appears is open [gap:zpa.logs.user-activity:multi-segment-lss].

**Status and counters.** The listed status values differ in case from the example [divergence:zpa.logs.user-activity:status-case]. In the example record, whose ConnectionStatus is active, TimestampConnectionEnd is an empty string, as are the first-byte-to-client and last-byte-from-connector timestamps. [zpa.logs.user-activity:end-empty-while-active] What triggers Active records is open [gap:zpa.logs.user-activity:active-cadence], as is counter reset [gap:zpa.logs.user-activity:byte-counter-reset]. What Open, Close and Active mean is open [What Open, Close and Active mean, and the Policy field when empty](kb:zpa.troubleshooting.log-fields:status-meanings).

**Timing.** PolicyProcessingTime is described as the time in microseconds taken for processing the access policy associated with the application, while ConnectionSetupTime is described as the time taken by the App Connector to process a notification from the App Connector selection microservice and set up the connection to the application server, with no unit stated. [zpa.logs.user-activity:policy-processing-unit] Whether the phases overlap is open [gap:zpa.logs.user-activity:timing-overlap], as is the scope of ServerSetupTime [gap:zpa.logs.user-activity:server-setup-scope]. Timestamps are described in microseconds but shown as ISO strings, which the default template produces with the :iso8601 modifier [divergence:zpa.logs.user-activity:timestamp-format].

**Edges and connector.** ClientZEN is the Public Service Edge for Private Access that received the request from Zscaler Client Connector, while TimestampConnectionStart is stamped when a Public Service Edge or Private Service Edge received the initial request. [zpa.logs.user-activity:client-zen-private-access] A field named Connector, described as the App Connector name, appears in the User Activity, App Connector Status and App Connector Metrics logs. [zpa.logs.user-activity:connector-name-three-logs] Whether the ZEN fields are outside tenant influence is open [gap:zpa.logs.user-activity:zen-tenant-control], and the ZEN naming history is unsourced [gap:zpa.logs.user-activity:zen-naming]. The Server field is the server ID name, and the server ID must be set to zero if Dynamic Server Discovery is enabled; the example record has Server 0. [zpa.logs.user-activity:server-zero-dsd]

**Other field names and values.** The default template reads the client-to-client field as c2c, not the table's ClientToClient [divergence:zpa.logs.user-activity:client-to-client-variable]. The example cases AppMicroTenantID differently from the table and template [divergence:zpa.logs.user-activity:app-microtenant-id-case], and DoubleEncryption is listed as On or Off but written as a number [divergence:zpa.logs.user-activity:double-encryption-values].

**Privileged Remote Access.** The field table and example name the Privileged Remote Access consoles policy-ID field PRAConsolesPolicyID, described as the consoles policy ID, alongside PRAApprovalID and PRACredentialPolicyID. [zpa.logs.user-activity:pra-policy-id-name] The default template writes that field and the shared-user list under other names [divergence:zpa.logs.user-activity:pra-field-names]. PRAErrorStatus is the PRA session error status 'if available', and PRARecordingStatus is described as the recording status of the PRA file transfer with expected values Available, Not Available and Started. [zpa.logs.user-activity:pra-error-optional] In the example record PRAFileTransferList and PRASharedUserList are JSON documents carried inside a string value; the first file entry has name, action, status, start and end timestamps, an inspected flag, file type, md5, an inspection_verdict that is itself a JSON string, and inspection_time. [zpa.logs.user-activity:pra-file-transfer-json] The example spellings differ from the listed ones [divergence:zpa.logs.user-activity:pra-enum-spelling], and when these fields are empty outside PRA is open [gap:zpa.logs.user-activity:pra-population].

What to check:
1. Whether ConnectionStatus was compared case-insensitively before concluding a connection never reached Active.
2. Whether a connection with several records was summed from delta counters or read from the totals, given the reset rules are unstated.
3. Whether the Server field is zero because Dynamic Server Discovery is on before treating it as a missing server.
4. Whether the Hostname field is blank because the client type is not Zscaler Client Connector or a machine tunnel.
5. Whether a custom template or parser uses the default template's names, PRACapabilityPolicyID, PRASharedUsersList and c2c, rather than the table's PRAConsolesPolicyID, PRASharedUserList and ClientToClient.
6. Whether a DoubleEncryption filter matches the numeric values that arrive rather than the listed On and Off.

Sources disagree (name both sides):
- ConnectionStatus values as listed versus as shown in the example [divergence:zpa.logs.user-activity:status-case]
  - zscaler-help: The field table gives the expected ConnectionStatus values as Open, Close and Active.
  - zscaler-help: The example record carries ConnectionStatus in lower case.
  Impact: A SIEM filter or lookup that matches ConnectionStatus case-sensitively on Active may miss records that carry active. Normalise case before filtering, and check a real tenant record.
- Timestamp fields described in microseconds versus shown as ISO 8601 strings [divergence:zpa.logs.user-activity:timestamp-format]
  - zscaler-help: The Timestamp* fields are described as timestamps in microseconds.
  - zscaler-help: The example record shows the same fields as ISO 8601 strings with millisecond precision.
  - zscaler-help: The default User Activity template writes every Timestamp* field with the :iso8601 modifier ([[zpa/user-activity-log]]).
  - zscaler-help: The content-format article shows the :iso8601 modifier rendering a timestamp field as an ISO 8601 string: %s{startrx_us:iso8601} appears as 2017-09-05T09:44:06.363Z.
  Impact: The default template renders the Timestamp* fields with :iso8601, so a default-format record carries ISO 8601 strings, as the example shows. A custom template that writes them without :iso8601 may produce another form; read the format from the receiver's template rather than assuming microsecond integers.
- Two PRA field names in the field table and example versus the default template [divergence:zpa.logs.user-activity:pra-field-names]
  - zscaler-help: The field table and example name the fields PRAConsolesPolicyID and PRASharedUserList.
  - zscaler-help: The default User Activity template writes them as PRACapabilityPolicyID and PRASharedUsersList ([[zpa/user-activity-log]]).
  Impact: Field names are case sensitive and exact. The table spells them PRAConsolesPolicyID and PRASharedUserList; the default template writes PRACapabilityPolicyID and PRASharedUsersList. A custom template built from the table names may not emit these fields, and a parser keyed on one pair misses the other; check a real record.
- The client-to-client field name in the table versus the default template's variable [divergence:zpa.logs.user-activity:client-to-client-variable]
  - zscaler-help: The field table names the field ClientToClient, the status of the client-to-client connection, and the example uses that key.
  - zscaler-help: The default User Activity template reads the variable c2c and labels it ClientToClient in its JSON form ([[zpa/user-activity-log]]).
  Impact: Field names are case sensitive and exact. The table names it ClientToClient; the default template reads c2c. A custom template built from the table name may not emit the field; copy the variable from the default template and check a real record.
- AppMicroTenantID casing in the table and default template versus the example [divergence:zpa.logs.user-activity:app-microtenant-id-case]
  - zscaler-help: The field table names the field AppMicroTenantID, the Microtenant ID of the application.
  - zscaler-help: The default User Activity template also writes AppMicroTenantID ([[zpa/user-activity-log]]).
  - zscaler-help: The example record keys it AppMicrotenantID, with a lower-case t.
  Impact: A parser keyed on the example's AppMicrotenantID misses the AppMicroTenantID that the table and default template name. Match the key case-insensitively or check a real record.
- DoubleEncryption values as listed versus the example and the default template [divergence:zpa.logs.user-activity:double-encryption-values]
  - zscaler-help: The field table gives the expected DoubleEncryption values as On and Off.
  - zscaler-help: The example record has DoubleEncryption 0, an unquoted number.
  - zscaler-help: The default User Activity template writes DoubleEncryption with the %d specifier ([[zpa/user-activity-log]]).
  Impact: A filter on On or Off may miss records from the default template, which writes the field as a number as the example shows. Which number means on is not stated; check a real record with double encryption enabled.
- PRA field values as listed versus as shown in the example [divergence:zpa.logs.user-activity:pra-enum-spelling]
  - zscaler-help: The field table lists PRACredentialLoginType as Username/Password, SSH Key or Password and PRASharedMode as Monitor or Control.
  - zscaler-help: The example record shows Username-Password and lower-case control.
  Impact: A rule that matches the listed spellings exactly may miss records that use the example spellings.

Not known (open gaps):
- How a multi-segment sequence is represented in LSS [gap:zpa.logs.user-activity:multi-segment-lss]: settled by lab-test or tenant-data. Blocks: reading one user request that resolved through several application segments as one record or several
- What triggers a ConnectionStatus Active record on a long-lived connection [gap:zpa.logs.user-activity:active-cadence]: settled by lab-test or support-ticket. Blocks: budgeting log volume or counting connections from User Activity records
- Delta and total byte counter reset semantics [gap:zpa.logs.user-activity:byte-counter-reset]: settled by lab-test or support-ticket. Blocks: summing ZENBytes or ZENTotalBytes across the records of one connection
- Whether the setup-time fields are sequential, overlapping or nested [gap:zpa.logs.user-activity:timing-overlap]: settled by lab-test or support-ticket. Blocks: adding AppLearnTime, CAProcessingTime, PolicyProcessingTime, ConnectorZENSetupTime, ConnectionSetupTime and ServerSetupTime into a total
- What ServerSetupTime covers: TCP handshake, TLS, or more [gap:zpa.logs.user-activity:server-setup-scope]: settled by lab-test or support-ticket. Blocks: comparing ServerSetupTime across TLS and non-TLS applications
- Whether User Activity Username is an email address and equals the User Status Username [gap:zpa.logs.user-activity:username-identity]: settled by tenant-data or lab-test. Blocks: correlating per-user activity across User Activity and User Status records
- Whether the PRA fields are empty or absent outside a Privileged Remote Access session [gap:zpa.logs.user-activity:pra-population]: settled by tenant-data. Blocks: parsing User Activity records for non-PRA connections
- Whether ZEN fields name only Zscaler-managed edges the tenant cannot influence [gap:zpa.logs.user-activity:zen-tenant-control]: settled by source-read or support-ticket. Blocks: treating a wrong or distant ZEN as a support ticket rather than a tenant configuration question
- Whether ZEN is the legacy name for Public Service Edge in these fields [gap:zpa.logs.user-activity:zen-naming]: settled by source-read. Blocks: explaining ClientZEN and ConnectorZEN to operators

Area: zpa.logs, its subjects in references/_meta/spine/zpa/zpa.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
- links-to references/_meta/text/zpa/zpa.troubleshooting.user-activity-diagnostics.md (What a ZPA User Activity entry shows in Diagnostics and Live Logs)
