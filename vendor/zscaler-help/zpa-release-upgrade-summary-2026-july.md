# ZPA Release Upgrade Summary — July–September 2026

**Source:** https://help.zscaler.com/zpa/release-upgrade-summary-2026
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info`, `data.body.release_notes`, and linked public article metadata).
**Status:** 200
**Canonical:** https://help.zscaler.com/zpa/release-upgrade-summary-2026
**Help node:** `1534305`
**Help revision:** `3168389`
**Release-notes payload length:** 149,279 JSON characters (Python
`json.dumps` serialization of `data.body.release_notes`, matching the capture
format)

---

This capture records the July 13–September 1 items needed by the authored
reference corpus. It is a scoped summary of the public release chronology, not
a complete copy of every release entry or cloud-category variant.

## September 1, 2026

### LSS Support for VPN (for Legacy Apps) — limited availability

- Log Streaming Service (LSS) support is available for User Status - VPN
  Service Edge (IP Address Reservation), User Status - VPN Service Edge, and
  Traffic Flow - VPN data types.
- SIEM servers can correlate the two User Status log types with their shared
  `ConnectionID` field.
- The entry links to [About the Log Streaming
  Service](https://help.zscaler.com/zpa/about-log-streaming-service),
  [Configuring a Log Receiver](https://help.zscaler.com/zpa/configuring-log-receiver),
  the VPN User Status log-field pages, and
  [Understanding Traffic Flow Log Fields - VPN for Legacy
  Apps](https://help.zscaler.com/zpa/understanding-traffic-flow-vpn-legacy-apps-log-fields).
- Help entry ID: `1538918`.

### SAML and SCIM Support for Microtenants — limited availability

- Administrators can create Microtenants from SAML attributes, SCIM
  attributes, or SCIM group criteria, combining criteria with AND and OR
  operators.
- The same functionality is supported through the cloud service API.
- The entry links to [About Microtenants](https://help.zscaler.com/zpa/about-microtenants)
  and [Configuring Microtenants](https://help.zscaler.com/zpa/configuring-microtenants).
- Help entry ID: `1532498`.

## August 31, 2026

### Chrome Enterprise Browser Support for Privileged Remote Access

- Chrome Enterprise browser is supported for Privileged Remote Access (PRA).
- See [Configuring Chrome Enterprise Browser Connector
  Settings](https://help.zscaler.com/zpa/configuring-chrome-enterprise-browser-connector-settings).
- Help entry ID: `1539624`.

### Manager Software Updates

- An updated Network Connector RPM package for Red Hat Enterprise Linux 9.x
  is available.
- The Network Connector Manager software version is `26.56.8`.
- See [Understanding the Manager
  Software](https://help.zscaler.com/zpa/about-manager-software#managerUpgrades).
- Help entry ID: `1543122`.

## August 27, 2026

### Emergency Access Integration with Authentication Service

- Emergency access for PRA is supported for tenants subscribed to
  Authentication Service for users.
- After migration to Authentication Service, the IdP API Token field is
  hidden and the User Group Name field is disabled on the Emergency Access
  page.
- The entry requires Authentication Service as the IdP instead of Okta,
  a guest domain with Arbitrary Guest Domains enabled, and assignment of the
  guest user to the Zscaler Emergency Access User Group.
- See [Configuring Emergency Access](https://help.zscaler.com/zpa/configuring-emergency-access)
  and the linked Authentication Service pages.
- Help entry ID: `1529597`.

## August 25, 2026

### Business Continuity Events Log Type in the Cloud Service API — limited availability

- The cloud service API returns the Business Continuity Events log type
  `zpn_siem_type_bc_event_log` from
  `GET /mgmtconfig/v2/admin/customers/{customerId}/lssConfig`.
- See [Managing Log Streaming Service Configurations Using
  API](https://help.zscaler.com/zpa/managing-log-streaming-service-configurations-using-api).
- Help entry ID: `1532251`.

### LSS Support for Business Continuity Events — limited availability

- LSS provides unique logs for Business Continuity events.
- The new log type can be selected while [configuring a log
  receiver](https://help.zscaler.com/zpa/configuring-log-receiver).
- See [Understanding Business Continuity Event Log
  Fields](https://help.zscaler.com/zpa/understanding-business-continuity-event-log-fields).
- Help entry ID: `1532408`.

### Privileged Remote Access Portal Enhancements — limited availability

- The PRA File Transfer System My Files page can upload up to 10 files at
  once, within the 10 GB storage limit.
- The page shows used and total storage and supports selecting and deleting
  multiple files at once.
- The entry states that this feature requires the PRA Advanced subscription.
- See [About the PRA File Transfer
  System](https://help.zscaler.com/zpa/about-privileged-remote-access-pra-file-transfer-system)
  and [Uploading and Transferring Files for the PRA File Transfer
  System](https://help.zscaler.com/zpa/uploading-and-transferring-files-pra-file-transfer-system).
- Help entry ID: `1542109`.

## August 21, 2026

### Support for Internet & SaaS Inspection with Multimatch — limited availability

- Application segments can be configured to inspect traffic with Internet &
  SaaS (ZIA) and Multimatch.
- See [Configuring Defined Application
  Segments](https://help.zscaler.com/zpa/configuring-defined-application-segments)
  and [Using Application Segment
  Multimatch](https://help.zscaler.com/zpa/using-app-segment-multimatch).
- Help entry ID: `1538863`.

## August 14, 2026

### RHEL Support for Microsegmentation

- Microsegmentation supports Red Hat Enterprise Linux distribution version 10.
- See [Supported Versions & OS Compatibility for
  Microsegmentation](https://help.zscaler.com/zpa/supported-versions-os-compatibility-microsegmentation).
- Help entry ID: `1542051`.

### SLES 16 Support for Microsegmentation

- Microsegmentation supports SUSE Linux Enterprise Server (SLES) 16.
- See [Supported Versions & OS Compatibility for
  Microsegmentation](https://help.zscaler.com/zpa/supported-versions-os-compatibility-microsegmentation).
- Help entry ID: `1542241`.

## August 10, 2026

### LSS App Connector-based Log Streaming Support in Business Continuity Cloud

- LSS App Connector-based log streaming to SIEM servers is supported during
  Business Continuity.
- See [Configuring Private
  Clouds](https://help.zscaler.com/zpa/configuring-private-clouds).
- Help entry ID: `1541812`.

### Manager Software Updates

- Updated App Connector and Private Service Edge RPM packages for RHEL 8.x
  and 9.x, plus Private Cloud Controller and Network Connector RPM packages
  for RHEL 9.x, are available.
- The Manager software version is `26.56.5`.
- See [Understanding the Manager
  Software](https://help.zscaler.com/zpa/about-manager-software#managerUpgrades).
- Help entry ID: `1542181`.

## August 7, 2026

### Export Diagnostics Logs

- Diagnostics logs can be exported as CSV files for offline troubleshooting,
  auditing, and reporting.
- Smaller exports are generated immediately; larger exports are processed as
  background jobs and become available after processing.
- See [Exporting Diagnostics
  Logs](https://help.zscaler.com/zpa/exporting-diagnostics-logs).
- Help entry ID: `1542022`.

## August 6, 2026

### Updated OVA Image for Network Connector

- Updated RHEL 9 Network Connector images are available for VMware.
- The image has a 4 GB boot partition intended to support seamless updates.
- See [Network Connector Software by
  Platform](https://help.zscaler.com/zpa/network-connector-software-platform).
- Help entry ID: `1541584`.

## August 5, 2026

### End User Isolation Experience — Clipboard Functions

- When profile restrictions prevent clipboard actions, the Zero Trust Mode
  menu shows a notification; selecting it opens the Clipboard sidebar with
  restriction details.
- See [Using the Zero Trust Mode Menu in Native Browser
  Experience](https://help.zscaler.com/zero-trust-browser/using-zero-trust-mode-menu-native-browser-experience).
- Help entry ID: `1541796`.

### End User Isolation Experience — File Transfers

- Isolation shows a temporary download-completion notification with a View
  action for the file and location in Protected Storage.
- Users can upload through Protected Storage or from their local machine to a
  website.
- See [Using the Zero Trust Mode Menu in Native Browser
  Experience](https://help.zscaler.com/zero-trust-browser/using-zero-trust-mode-menu-native-browser-experience)
  and [Transferring and Viewing Files in
  Isolation](https://help.zscaler.com/zero-trust-browser/transferring-and-viewing-files-isolation).
- Help entry ID: `1541797`.

### End User Isolation Experience — Session Indicator and Menu

- The Zero Trust Mode menu exposes Protected Storage, Clipboard, Print,
  Troubleshoot, and Information functions.
- Troubleshoot provides a debug session, network latency, ip.zscaler.com,
  and isolation-session-log export actions.
- See [Using the Zero Trust Mode Menu in Native Browser
  Experience](https://help.zscaler.com/zero-trust-browser/using-zero-trust-mode-menu-native-browser-experience).
- Help entry ID: `1541795`.

The 2026-08-04 and earlier entries remain below as captured in the prior
refresh. Where a release entry labels a feature limited availability or names
a subscription/support prerequisite, this capture preserves that boundary.

## August 4, 2026

### Manager software version 26.56.1

- A recommended Manager software update provides App Connector and Private
  Service Edge RPM packages for Red Hat Enterprise Linux 8.x and 9.x.
- The update provides Private Cloud Controller and Network Connector RPM
  packages for Red Hat Enterprise Linux 9.x.
- Manager software for App Connectors, Private Service Edges, Private Cloud
  Controllers, and Network Connectors can be downloaded from the Zscaler
  repository.
- The Manager software version is `26.56.1`.

This entry describes Manager RPM packages. It does not state that Docker,
cloud-marketplace, hypervisor, or virtual-machine images were updated, and it
does not describe upgrade enforcement or compatibility outside the named RHEL
versions.

## July 31, 2026

### Canada isolation region

- Canada is available as a Zero Trust Browser isolation region when
  configuring isolation profiles for Private Access (ZPA).

## July 23, 2026

### Updated connector, edge, and controller images

- The App Connector Docker image uses high ciphers for `microdnf` calls.
- An updated Private Service Edge Docker image is available.
- Updated Red Hat Enterprise Linux 9 images are available for App Connector,
  Private Service Edge, Private Cloud Controller, and Network Connector on
  AWS, GCP, and Microsoft Azure.
- Nutanix AHV receives updated App Connector and Private Service Edge images.
- VMware receives updated App Connector, Private Service Edge, and Private
  Cloud Controller images.
- These image updates include a 4 GB boot partition intended to support
  seamless operating-system updates.

This release entry does not name updated Hyper-V or KVM images. Their absence
from this scoped entry is not proof that those platforms are unsupported.

## July 20, 2026

### Business-to-Business Federation — limited availability

- Establishes trusted relationships between business partners.
- Administrators can create partner-federation requests, manage incoming and
  outgoing requests, and manage trusted federated partners.
- Once trust is established, application segments can be federated to a
  partner with granular controls for the shared resources and users.
- The release page states that the same functionality is supported through the
  ZPA cloud service API.
- Linked Help/API topics include understanding and configuring B2B Federation,
  partner and pending-request management, federating partners and applications
  by API, and retrieving access-policy details for federated applications.

### Step-Up Authentication for Privileged Remote Access — limited availability

- Privileged Remote Access can require users to complete additional
  authentication before access to an application is allowed.
- Conditional access for this step-up flow is supported in the Zscaler Admin
  Console.
- The release page links to Configuring Access Policies and Understanding
  Step-Up Authentication.

## July 16, 2026

- App Connector groups can be edited from the "Where are my apps being served
  from?" view to resolve unknown hosting or location details.

## July 14, 2026

- Remote troubleshooting supports `journalctl` collection of service logs or
  full system logs from App Connectors, Private Service Edges, Private Cloud
  Controllers, and Network Connectors.

## July 13, 2026

- A Get Network Interfaces command can collect the network-interface inventory
  used by an App Connector for remote troubleshooting.
- App Connector network settings can issue remote commands that enable SSH on
  the operating system and update software-interface settings on ZPA virtual
  machines in AWS, Azure, and GCP. This item is marked limited availability.
