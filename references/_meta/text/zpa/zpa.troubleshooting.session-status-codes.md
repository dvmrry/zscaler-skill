# Private Access session status codes: where they appear, the component prefixes and the three classes (zpa.troubleshooting.session-status-codes)
Also called: session status codes; internal reason; internal status code; BRK_MT_ status code; AST_MT_ status code; zpa error code list; policy block status code

Private Access session status codes appear on the User Activity Diagnostics page; each table has its own search field and can be sorted by column. [zpa.troubleshooting.session-status-codes:where-shown] When an issue occurs accessing a Browser Access-enabled application, the end user notification (EUN) includes the error code. The EUN heading, for example ZPA BA: Proxy loop detected, is a hyperlink to the Zscaler Help Portal, and the HTTP status code is always displayed and also appears on the Diagnostics pages. [zpa.troubleshooting.session-status-codes:browser-access-eun] The code names, their classes, descriptions and resolutions are the status codes of [ZPA User Activity Log (LSS zpn_trans_log)](kb:zpa/user-activity-log), not restated here.

**Naming.** Status codes are prefixed by the related Private Access component: AC (the App Connector), CA (the Central Authority), CLT (the Zscaler Client Connector), SE (the Public Service Edge or Private Service Edge for Private Access) and ZPA BA (the Browser Access service). [zpa.troubleshooting.session-status-codes:prefixes] The article lists status codes in three tables, for Error, Info and Policy Block status codes, each with the columns Session Status, Internal Reason, Description and Resolution. [zpa.troubleshooting.session-status-codes:classes-and-columns]

**In Diagnostics.** In User Activity diagnostics the Status Code is the status of the application request, and for errors and policy blocks the connection status name links to more about it. The Internal Status Code is the internal status reason, applies only to errors and policy blocks, and points to the session status codes article for the complete list of internal reasons per connection status. [zpa.troubleshooting.session-status-codes:internal-code-scope] The page's own ICMP example shows an Info code as a status [divergence:zpa.troubleshooting.session-status-codes:internal-code-scope-vs-icmp]. Whether the LSS InternalReason field carries these Internal Reason codes is open [gap:zpa.troubleshooting.session-status-codes:internal-reason-identity].

**Disagreements in the sources.** Two entries of the LSS API example look shifted by one name [divergence:zpa.troubleshooting.session-status-codes:hash-tbl-name-shift], and one row of the article repeats another row's description [divergence:zpa.troubleshooting.session-status-codes:closed-from-client-copy]. The thresholds that the rate-limit codes refer to are not stated [gap:zpa.troubleshooting.session-status-codes:rate-limit-thresholds].

Sources disagree (name both sides):
- The Internal Status Code applies only to errors and policy blocks, yet the Diagnostics page gives an Info code as an ICMP status example [divergence:zpa.troubleshooting.session-status-codes:internal-code-scope-vs-icmp]
  - zscaler-help: The Diagnostics page says the Internal Status Code applies only to errors and policy blocks.
  - zscaler-help: The same page gives BRK_MT_TERMINATED as the status an ICMP application might show as successful.
  - zscaler-help: The session status codes article lists BRK_MT_TERMINATED in its Info table.
  Impact: The page gives an Info code as the status of an ICMP application although it limits the Internal Status Code to errors and policy blocks; which of the two statements applies to an Info entry is not stated.
- The LSS API example names AST_MT_SETUP_ERR_BRK_HASH_TBL_FULL 'Failed to process SAML response'; the article names that code differently [divergence:zpa.troubleshooting.session-status-codes:hash-tbl-name-shift]
  - zscaler-help: In the LSS API example, the entry AST_MT_SETUP_ERR_BRK_HASH_TBL_FULL is named 'SE: Failed to process SAML response'.
  - zscaler-help: The session status codes article names AST_MT_SETUP_ERR_BRK_HASH_TBL_FULL 'AC: Service Edge database is full' and BRK_MT_AUTH_SAML_DECODE_FAIL 'SE: Failed to process SAML response'.
  Impact: The example appears to have shifted one name onto the next entry: its AST_MT_SETUP_ERR_BRK_HASH_TBL_FULL carries the SAML name, and its BRK_MT_AUTH_SAML_DECODE_FAIL entry has no name. The two sources disagree and neither says which is wrong; check both before relying on either name for these two codes, including in the log type generated from the API example.
- BRK_MT_CLOSED_FROM_CLIENT and MT_CLOSED_TLS_CONN_GONE_AST_CLOSED have the same description [divergence:zpa.troubleshooting.session-status-codes:closed-from-client-copy]
  - zscaler-help: The row named 'SE: Connection closed by Client Connector' (BRK_MT_CLOSED_FROM_CLIENT) describes a connection from the App Connector to the Service Edge being terminated, ending all application sessions for that App Connector.
  - zscaler-help: The MT_CLOSED_TLS_CONN_GONE_AST_CLOSED row uses the same words for the App Connector's connection.
  Impact: The name says the Client Connector closed the connection while the description speaks of the App Connector, so the description of BRK_MT_CLOSED_FROM_CLIENT cannot be relied on; the article does not say which is right.

Not known (open gaps):
- Whether the LSS InternalReason field holds the Internal Reason codes of the session status codes article [gap:zpa.troubleshooting.session-status-codes:internal-reason-identity]: settled by tenant-data or support-ticket
- The thresholds behind the rate-limit and workload-group codes [gap:zpa.troubleshooting.session-status-codes:rate-limit-thresholds]: settled by source-read or support-ticket

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.troubleshooting.md (Troubleshooting ZPA access: from symptom to layer)
- see-also references/_meta/text/zpa/zpa.troubleshooting.log-fields.md (What the ZPA User Activity log fields say when diagnosing access: outcome and status codes, timing phases, bytes)
- see-also references/_meta/text/zpa/zpa.troubleshooting.user-activity-diagnostics.md (What a ZPA User Activity entry shows in Diagnostics and Live Logs)
- see-also references/_meta/text/zpa/zpa.troubleshooting.authentication.md (Authentication failures and step-up prompt loops in ZPA)
- see-also references/_meta/text/zpa/zpa.troubleshooting.certificates.md (Certificate and encryption failures: Browser Access, double encryption, pinned clients)
- see-also references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
