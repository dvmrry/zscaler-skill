# NO_CONNECTOR_AVAILABLE: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: CA: App Connector is not available
- error type: InternalError
- status: Error
- admin action: NA
- Help article (Error codes): CA: App Connector is not available. None of the App Connectors are configured to reach this application. None of the App Connectors have learned the configuration for this application even though the application is associated with App Connectors through configuration. The application was just configured or the App Connector has just restarted and is still learning its configuration. The App Connector is unable to learn its configuration from the Private Access certificate authority (CA). Resolution: Ensure that at least one App Connector group is configured to reach this application. Ask the user to access the application again. If the error persists, contact Zscaler Support.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:317,318,319,320`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:46`
