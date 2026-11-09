# AST_MT_SETUP_ERR_NO_PROCESS_FD: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: AC: File descriptors are exhausted for App Connector process
- error type: InternalError
- status: Error
- admin action: NA
- Help article (Error codes): AC: File descriptors are exhausted for App Connector process. The transaction failed as the App Connector processing could not secure additional file descriptors from the operating system. Resolution: Increase the number of App Connectors in the App Connector group.To learn more, see Adding App Connectors to an Existing App Connector Group. If the App Connector group is set up for a wildcard application, try creating more application segments along with App Connector groups in order to have greater load distribution across the App Connector groups.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:227,228,229,230`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:40`
