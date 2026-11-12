# EXPTR_MT_TLS_SETUP_FAIL_VERSION_MISMATCH: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: ZPA BA: TLS Wrong Version Number
- error type: ActionableError
- status: Error
- admin action: BA app need TLS 1.2 to be enabled on application server
- Help article (Error codes): ZPA BA: TLS Wrong Version Number. A TLS version mismatch between Private Access and the Browser Access-enabled application occurred. This happens when the web server is running TLS 1.0/1.1 or earlier versions. Resolution: Enable TLS 1.2 on the web server.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:197,198,199,200`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:165`
