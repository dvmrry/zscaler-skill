# BRK_MT_SETUP_FAIL_RATE_LIMIT_LOOP_DETECTED: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: SE: Connection failed due to Microtunnel loop
- error type: ActionableError
- status: Error
- admin action: Broker rejected the mtunnel request because it detected a potential mtunnel creation looping issue.
- Help article (Error codes): SE: Connection failed due to Microtunnel loop. The Public Service Edge or Private Service Edge rejected the Microtunnel request because a potential Microtunnel creation loop was detected. To learn more, see Ranges & Limitations. Resolution: Check if the traffic from the App Connector is routed to the Cloud Connector. If the problem persists, contact Zscaler Support to learn more.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:203,204,205,206`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:94`
