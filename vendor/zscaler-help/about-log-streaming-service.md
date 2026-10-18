# About the Log Streaming Service

**Source:** https://help.zscaler.com/zpa/about-log-streaming-service
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1483941, revision 3246101

---

Watch a video about the Log Streaming Service (shows legacy UI).
The Log Streaming Service (LSS) provides a better understanding of the information coming from the Private Access (ZPA) service by allowing you to create log receivers that receive information about App Connectors and users.
The LSS provides the following benefits and enables you to:
- Forward your diagnostics and status logs to a SIEM.
- Store logs for longer than the cloud retention period.
- Create analytical charts and graphs using your own in-house SIEM.
- Create events and alerts using third-party log correlation.
Zscaler retains User Activity, User Status, and App Connector log information for rolling periods of at least 14 days during the subscription term. Zscaler retains audit log information for at least 6-month periods during the subscription term. For access to logs beyond the 14 days they are available in the Zscaler Admin Console, setting up the LSS is necessary.
LSS is deployed using two components: a log receiver and an App Connector. LSS resides in the Zero Trust Exchange (ZTE) and initiates a log stream through a Public Service Edge for Private Access. The App Connector resides in your company's enterprise environment. It receives the log stream and then forwards it to a log receiver.
Zscaler supports third-party SIEM integrations for the LSS. To learn more, see the Private Access and Splunk Deployment Guide and Zscaler and Splunk Deployment Guide.
While the LSS is used to capture log data about App Connectors and users in Private Access using a log receiver, the Nanolog Streaming Service (NSS) resides in Internet & SaaS (ZIA) and allows streaming of traffic logs from the Zscaler Nanolog to your SIEM. To learn more, see Understanding the Nanolog Streaming Service.
See image.
Your App Connectors must be deployed prior to configuring a log receiver. To learn more, see the App Connector Deployment Guides for Supported Platforms.
It is possible to use mutual TLS encryption between the log receiver and the App Connector, which you can enable when configuring a log receiver. LSS traffic only occurs between the App Connector and the log receiver after mutual authentication is established. This requires them to exchange certificates. The App Connector trusts a certificate signed by a public root certificate authority (CA) in addition to certificates signed privately by a custom CA, which it gets automatically when the App Connector is deployed. The log receiver must have a certificate signed by a public root certificate authority (CA).
To use TLS encryption, you must meet the requirements to ensure successful communication:
- Log receiver:
  - Supports TLS communication.
  - Has a client certificate for mutual TLS encryption that uses a public root CA.
  - App Connectors trust certificates that are signed by a public or custom root CA.
  - Validates the chain of trust to the App Connector's enrollment certificate. One way to enable the log receiver to validate the chain of trust is to add the App Connector's enrollment certificate in the log receiver's certificate trust store.
- App Connector: Automatically receives a root certificate during deployment. The App Connector is designed to trust log receiver certificates that are either signed by the global public root CAs, or signed by custom root CAs that are used as the App Connector's enrollment certificate.
A log receiver can capture several log types.
- View the log types.
  - AppProtection: Information related to AppProtection policy activity in your organization. To learn more, see Understanding AppProtection Log Fields.
  - Audit Logs: Session information for all admins accessing the Zscaler Admin Console. To learn more, see Understanding Audit Log Fields and About Audit Logs.
  - App Connector Metrics: Information related to an App Connector's metrics. To learn more, see Understanding App Connector Metrics Log Fields.
  - App Connector Status: Information related to an App Connector's availability and connection to Private Access. To learn more, see Understanding App Connector Status Log Fields.
  - Browser Access Logs: HTTP log information related to Browser Access. To learn more, see Understanding Browser Access Log Fields and About Browser Access.
  - Business Continuity Event Log Fields: Information related to Business Continuity Events activity. To learn more, see Understanding Business Continuity Event Log Fields.
  - KRB Inspection Logs: Information related to Kerberos inspection log activity in your organization. To learn more, see Understanding KRB Inspection Log Fields.
  - LDAP Inspection Logs: Information related to LDAP inspection log activity in your organization. To learn more, see Understanding LDAP Inspection Log Fields.
  - Microsegmentation: Information related to Microsegmentation Flow activity. To learn more, see Understanding Microsegmentation Flow Log Fields.
  - Private Cloud Controller Metrics: Information related to a Private Cloud Controller's metrics. To learn more, see Understanding Private Cloud Controller Metrics Log Fields.
  - Private Cloud Controller Status: Information related to a Private Cloud Controller's availability and connection to Private Access. To learn more, see Understanding Private Cloud Controller Status Log Fields.
  - User Status - VPN Service Edge (IP Address Reservation): Information related to a user status for VPN (ZPA Service Edge). To learn more, see Understanding User Status - VPN Service Edge (IP Address Reservation) Log Fields.
  - User Status - [[variable:vpn-service-edge]**]**: Information related to a user status for VPN Service Edge. To learn more, see Understanding User Status - VPN Service Edge Log Fields.
  - Traffic Flow - VPN: Information related to VPN traffic flow metrics. To learn more, see Understanding Traffic Flow for VPN (for Legacy Apps) Log Fields.
  - Private Service Edge Metrics: Information related to a Private Service Edge's metrics. To learn more, see Understanding Private Service Edge Metrics Log Fields.
  - Private Service Edge Status: Information related to a Private Service Edge's availability and connection to Private Access. To learn more, see Understanding Private Service Edge Status Log Fields.
  - SMB Inspection Logs: Information related to SMB inspection log activity in your organization. To learn more, see Understanding SMB Inspection Log Fields.
  - User Activity: Information on end user requests to applications. To learn more, see Understanding User Activity Log Fields.
  - User Status: Information related to an end user's availability and connection to Private Access. To learn more, see Understanding User Status Log Fields.
After you select which log type to capture, you can configure a streaming policy for the information.
The LSS does not transmit any log data generated during a connection loss between Private Access and the App Connectors. After the connection is restored, it can retransmit the last 15 minutes of the log data. However, the delivery of that log data is not guaranteed. With the exception of audit log data, the LSS does not transmit any log data generated during a connection loss between the App Connector and the SIEM.
To prevent the inadvertent sharing of sensitive data, logging data is obfuscated as part of the Business-to-Business (B2B) Federation process before sharing resources between companies.
- View obfuscated logging data for B2B Federation.
  - The following user metadata is excluded from host partner logs:
    - IdP Name
    - IdP ID
    - SCIM Users
    - SCIM Groups
    - Hostname
    - Postures
  - The following App Connector data is excluded from guest partner logs:
    - Name
    - IP: Port & Protocol
    - Location
    - App Connector ID
    - App Connector Group Name
    - App Connector Group ID
  - The following application data is excluded from guest partner logs:
    - Server ID
    - Workflow ID
The following additional information also applies to obfuscated logs:
- Data processing: The only new piece of metadata added to logs is partner information. However, some of the data attributes are excluded appropriately before being distributed to the relevant partner.
- Split-log copies with redaction: There are two copies of the relevant log data generated: one copy goes to the guest partner, and the other goes to the host partner. Each copy excludes some of the data attributes to remove proprietary or sensitive information belonging to the other party (e.g., the host's App Connector IP addresses are removed from guest logs, and the guest's user metadata is removed from host logs). Each party's relevant log data is stored in their respective regions.
# About the Log Receivers Page
On the Log Receivers page (Data Explorer > Log Streaming > Log Receivers), you can do the following:
- Add a new log receiver.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Refresh the Log Receivers page to reflect the most current information.
- Modify the columns displayed in the table.
- View a list of all log receivers that are configured for your organization. For each receiver, you can see:
  - **Name**: The name of the receiver. Click the name to view details for each Log Receiver.
    - **Name**: The name of the Log Receiver.
    - **Description**: The description of the log receiver.
    - **Domain Name or IP Address**: The destination address of the server that collects the logs (e.g., your SIEM collector).
    - **TCP Port**: The TCP port that the log receiver is listening on for incoming log streams.
    - **TLS Encryption**: The status of whether the log receiver is secured using TLS.
    - **Log Type**: The specific category of data you want to stream. Each type represents a different data source.
    - **App Connector Groups**: The App Connector group that sends the logs to the log receiver.
    - **Log Stream Content**: Defines the exact structure and fields included in each log message.
  - **Domain Name or IP Address**: The domain name or IP address for the receiver.
  - **TCP Port**: The TCP port number for the receiver.
  - **TLS Encryption**: Indicates that TLS encryption is enabled or disabled for the receiver.
  - **Log Type**: The log type the receiver is capturing (e.g., **User Activity**, **User Status**, **App Connector Status**, **Browser Access**).
- Copy a log receiver's configuration and use it to create a new configuration.
- Edit a log receiver.
- Delete a log receiver.
- If a log receiver is configured using Zscaler Deception, then the copy, edit, and delete options are unavailable.
- Display more rows or a different page of the table.
