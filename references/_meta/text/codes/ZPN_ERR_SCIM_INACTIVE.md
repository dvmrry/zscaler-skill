# ZPN_ERR_SCIM_INACTIVE: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: SE: User termination request received from SCIM
- error type: InternalError
- status: Info
- admin action: NA
- Help article (Error codes): SE: Error due to SCIM user deactivated. The Public Service Edge or Private Service Edge received an error because a SCIM user was deactivated. Resolution: If the user is allowed access, ensure that SCIM is enabled. If the user’s access is blocked, ensure that the IdP is enabled and that the SCIM sync is working for that IdP.
- Help article (Error codes): SE: User termination request received from SCIM. The Private Access service closed the connection due to the user being disabled via SCIM. All active application sessions were terminated. Resolution: No action required.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:946,947,948,949`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:112`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:158`
