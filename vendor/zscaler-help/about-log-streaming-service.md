# About the Log Streaming Service

**Source:** https://help.zscaler.com/zpa/about-log-streaming-service
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help — Log Streaming Service — About the Log Streaming Service

The Log Streaming Service (LSS) provides a better understanding of the information coming from the Private Access (ZPA) service by allowing you to create log receivers that receive information about App Connectors and users.

The LSS provides the following benefits and enables you to:

- Forward your diagnostics and status logs to a SIEM.
- Store logs for longer than the cloud retention period.
- Create analytical charts and graphs using your own in-house SIEM.
- Create events and alerts using third-party log correlation.

Zscaler retains User Activity, User Status, and App Connector log information for rolling periods of at least 14 days during the subscription term. Zscaler retains audit log information for at least 6-month periods during the subscription term. For access to logs beyond the 14 days they are available in the Zscaler Admin Console, setting up the LSS is necessary.

LSS is deployed using two components: a log receiver and an App Connector. LSS resides in the Zero Trust Exchange (ZTE) and initiates a log stream through a Public Service Edge for Private Access. The App Connector resides in your company's enterprise environment. It receives the log stream and then forwards it to a log receiver.

Zscaler supports third-party SIEM integrations for the LSS. To learn more, see the Private Access and Splunk Deployment Guide and Zscaler and Splunk Deployment Guide.

While the LSS is used to capture log data about App Connectors and users in Private Access using a log receiver, the Nanolog Streaming Service (NSS) resides in Internet & SaaS (ZIA) and allows streaming of traffic logs from the Zscaler Nanolog to your SIEM.

Your App Connectors must be deployed prior to configuring a log receiver.

It is possible to use mutual TLS encryption between the log receiver and the App Connector, which you can enable when configuring a log receiver. LSS traffic only occurs between the App Connector and the log receiver after mutual authentication is established. This requires them to exchange certificates. The App Connector trusts a certificate signed by a public root certificate authority (CA) in addition to certificates signed privately by a custom CA, which it gets automatically when the App Connector is deployed. The log receiver must have a certificate signed by a public root certificate authority (CA).

To use TLS encryption, you must meet the requirements to ensure successful communication:

- **Log receiver:**
  - Supports TLS communication.
  - Has a client certificate for mutual TLS encryption that uses a public root CA.
  - App Connectors trust certificates that are signed by a public or custom root CA.
  - Validates the chain of trust to the App Connector's enrollment certificate. One way to enable the log receiver to validate the chain of trust is to add the App Connector's enrollment certificate in the log receiver's certificate trust store.
- **App Connector:** Automatically receives a root certificate during deployment. The App Connector is designed to trust log receiver certificates that are either signed by the global public root CAs, or signed by custom root CAs that are used as the App Connector's enrollment certificate.

## Log Types

A log receiver can capture the following log types:

- **AppProtection**: Information related to AppProtection policy activity in your organization.
- **Audit Logs**: Session information for all admins accessing the Zscaler Admin Console.
- **App Connector Metrics**: Information related to an App Connector's metrics.
- **App Connector Status**: Information related to an App Connector's availability and connection to Private Access.
- **Browser Access Logs**: HTTP log information related to Browser Access.
- **Private Cloud Controller Metrics**: Information related to a Private Cloud Controller's metrics.
- **Private Cloud Controller Status**: Information related to a Private Cloud Controller's availability and connection to Private Access.
- **Private Service Edge Metrics**: Information related to a Private Service Edge's metrics.
- **Private Service Edge Status**: Information related to a Private Service Edge's availability and connection to Private Access.
- **User Activity**: Information on end user requests to applications.
- **User Status**: Information related to an end user's availability and connection to Private Access.
- **Microsegmentation**: Information related to Microsegmentation Flow activity.

After you select which log type to capture, you can configure a streaming policy for the information.

## Delivery Guarantees

The LSS does not transmit any log data generated during a connection loss between Private Access and the App Connectors. After the connection is restored, it can retransmit the last 15 minutes of the log data. However, the delivery of that log data is not guaranteed. With the exception of audit log data, the LSS does not transmit any log data generated during a connection loss between the App Connector and the SIEM.

## About the Log Receivers Page

On the Log Receivers page (Logs > Log Streaming > Log Receivers), you can do the following:

- View a list of applied filters available from the current and previous user sessions.
- Add a new log receiver.
- View a list of all log receivers that are configured for your organization. For each receiver, you can see: Name, Domain Name or IP Address, TCP Port, TLS Encryption, Log Type.
- Copy a log receiver's configuration and use it to create a new configuration.
- Edit an existing log receiver.
- Delete a log receiver.

If a log receiver is configured using Zscaler Deception, then the copy, edit, and delete options are unavailable.
