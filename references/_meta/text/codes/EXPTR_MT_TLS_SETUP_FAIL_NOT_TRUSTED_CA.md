# EXPTR_MT_TLS_SETUP_FAIL_NOT_TRUSTED_CA: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: ZPA BA: CA Was Not Trusted
- error type: ActionableError
- status: Error
- admin action: Use a cert with a trusted CA or change settings to not require it
- Help article (Error codes): ZPA BA: CA was Not Trusted. The application server certificate is not signed by a trusted CA and Private Access is configured to verify that the web server certificate is signed by a trusted CA. Resolution: Either specify HTTP as the protocol for this application, replace the existing certificate with a certificate signed by a trusted CA, or use Untrusted Certificates.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:335,336,337,338`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:161`
