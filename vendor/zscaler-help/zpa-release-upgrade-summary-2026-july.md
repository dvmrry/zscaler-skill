# ZPA Release Upgrade Summary — July–August 2026

**Source:** https://help.zscaler.com/zpa/release-upgrade-summary-2026
**Captured:** 2026-08-04 via the official Help Center article payload.

---

This capture records the July 13–August 4 items needed by the authored reference
corpus. It is a scoped summary of the rendered release page, not a complete
copy of the release history.

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
