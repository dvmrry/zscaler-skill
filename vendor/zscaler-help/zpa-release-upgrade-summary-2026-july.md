# ZPA Release Upgrade Summary — July 2026

**Source:** https://help.zscaler.com/zpa/release-upgrade-summary-2026
**Captured:** 2026-07-22 via Codex Browser (rendered article inspection).

---

This capture records the July 13–20 items needed by the authored reference
corpus. It is a scoped summary of the rendered release page, not a complete
copy of the release history.

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
