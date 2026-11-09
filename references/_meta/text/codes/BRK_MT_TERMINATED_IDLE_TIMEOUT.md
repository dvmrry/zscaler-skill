# BRK_MT_TERMINATED_IDLE_TIMEOUT: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: SE: Timeout policy closed idle connection
- error type: ActionableError
- status: Info
- admin action: open a new connection to the application
- Help article (Info codes): SE: Timeout policy closed idle connection. If an idle timeout is configured, Private Access will keep the user's application session alive for the interval specified by the Idle Connection Timeout prior to terminating the session. This is not an error scenario, only a function of the service. Resolution: No action required.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:149,150,151,152`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:202`
