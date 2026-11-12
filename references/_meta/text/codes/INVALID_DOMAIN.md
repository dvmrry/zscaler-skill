# INVALID_DOMAIN: a status code of ZPA User Activity Log (LSS zpn_trans_log) (zpa/user-activity-log)
- name: AC: DNS resolution failed
- error type: InternalError
- status: Error
- admin action: NA
- Help article (Error codes): AC: DNS resolution failed. None of the App Connectors configured for the application could successfully resolve the hostname within three seconds of sending a DNS request. This might be because of a DNS resolution failure on the App Connector or a misconfigured DNS in the DC environment. The App Connector resolves DNS successfully, but the health check fails. This might happen because the App Connector cannot reach the application server over the network or the App Connector can reach the application server, but the server is rejecting the health check. Resolution: Ensure that the hostname is correctly configured. Verify the App Connector can consistently resolve DNS for the hostname. Check that the App Connector can reach the application server and the server accepts requests on the expected ports. Ensure that services between the App Connector and the application server (e.g., access control lists, host-based firewalls, etc.) allow them to communicate on the expected ports and protocols.
- Source: `vendor/zscaler-help/configuring-log-streaming-service-configurations-using-api.json:281,282,283,284`
- Source: `vendor/zscaler-help/zpa-understanding-private-access-session-status-codes.json:29`
