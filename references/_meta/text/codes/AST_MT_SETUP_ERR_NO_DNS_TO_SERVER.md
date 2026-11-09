# AST_MT_SETUP_ERR_NO_DNS_TO_SERVER: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: AC: DNS resolution failed for unmonitored app
- error type: ActionableError
- status: Error
- admin action: User requested application access is not available due to the connector not able to resolve DNS. If the error persists, contact Zscaler Support.
- Help article (Error codes): AC: DNS resolution failed for unmonitored app. The end host (not a proxy or a configured server group) is not resolvable. The code only comes up in a specific use case when there is all of the following: No-health application Dynamic server discovery is enabled (i.e., no server group configured) The target application has failed to resolve Resolution: Execute the Linux Shell Command with the URL that failed in the transaction to understand why the DNS resolution is failing, and why the App Connector is failing the DNS.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:857,858,859,860`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:30`
