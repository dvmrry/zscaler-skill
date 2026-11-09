# BRK_MT_SETUP_FAIL_NO_POLICY_FOUND: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: SE: Policy is not configured for access
- error type: ActionableError
- status: PolicyBlock
- admin action: Update policy to allow user
- Help article (Policy Block codes): SE: Policy is not configured for access. The Private Access service blocked the application request because a policy isn't configured for the requested application. The application request is also blocked when an application segment or a segment group is disabled. Resolution: Update the policy to allow the user. Enable the application segment and segment group.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:515,516,517,518`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:215`
