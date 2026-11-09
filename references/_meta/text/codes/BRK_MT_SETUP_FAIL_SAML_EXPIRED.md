# BRK_MT_SETUP_FAIL_SAML_EXPIRED: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: SE: Timeout policy blocked access
- error type: ActionableError
- status: reauthBlock
- admin action: Reauthenticate
- Help article (Policy Block codes): SE: Timeout policy blocked access. The Private Access service blocked the application or Web Browser request because the timeout policy requires the user to authenticate. Resolution: The user must reauthenticate in Zscaler Client Connector. If needed, update the timeout policy to increase the interval before a timeout. To learn more, see Configuring Timeout Policies.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:893,894,895,896`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:216`
