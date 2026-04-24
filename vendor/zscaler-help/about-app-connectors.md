# About App Connectors

**Source:** https://help.zscaler.com/zpa/about-connectors
**Captured:** 2026-04-23 via Playwright MCP.

---

Private Access (ZPA) Help — App Connector Management — App Connectors — About App Connectors

App Connectors provide the secure authenticated interface between a customer's servers and the Private Access cloud.

## Core Architecture Facts

- **Outbound-only connections.** App Connectors do not require any inbound open ports to operate. This is the key security property that makes ZPA safe to deploy without exposing internal apps to the internet.
- **Always active.** Typically deployed in redundant configuration.
- **App Connectors never communicate with each other.** Each is independent.
- Typically deployed in the **DMZ** or on a network segment that can reach both secured applications and the Private Access cloud.
- Co-location with enterprise apps is supported, or deployment in any location with connectivity to the applications.

## App Connector Selection

Private Access selects the **closest App Connector** given:
- The location of the user
- The App-Connector-to-application latency

(Selection logic inputs named but not further elaborated — this is as deep as the doc goes on connector selection.)

## Supported Platforms

Standard VM image distributable for:

- Amazon Web Services (AWS)
- Docker
- Google Cloud Platform (GCP)
- Kubernetes
- Linux (Red Hat Enterprise Linux 8 or 9)
- Microsoft Azure
- Nutanix
- OpenShift
- VMware vCenter or vSphere Hypervisor (ESXi)

**STIG images** are provided by default for AWS, GCP, Microsoft Azure, Nutanix, and VMware.

Other hypervisor / cloud environments (e.g., Oracle Cloud) are supported via the Linux-instance + RPM-based deployment path.

## Enrollment

Two methods:

- **Enrollment tokens** (preferred)
- **App Connector provisioning key**

Replacing a deployed App Connector requires deleting the config and re-enrolling. To reuse a deployed VM image, you can apply the new provisioning key by replacing the old key.

## Version Profiles

Each App Connector has an associated Version Profile:

- **Default** — currently-blessed default version
- **Previous Default** — the prior default
- **New Release** — the newest version
- **Custom** — per-org custom version profile

## Operational Visibility

Per-connector fields visible on the App Connectors page (Infrastructure > Private Access > Component > App Connectors):

- Name (OAuth-enabled format: `GroupName-UserCode-TimeStamp`)
- App Connector Group
- Enrollment Certificate
- App Connector Host Platform (e.g., AWS)
- App Connector Host OS (e.g., RHEL 8/9)
- App Connector Package OS (compile-time OS)
- **Public Service Edge the App Connector connects to** — useful for debugging routing
- Last Connection / Last Disconnect to Zscaler
- Location (derived from the App Connector group)
- Public IP / Private IP (last-known for disconnected)
- Uptime
- Enrollment Time
- Manager Version, Software Version, Version Profile, Connection Health, Status

Auto Delete setting: removes disconnected or disabled App Connectors after a set number of days.

Alert: if any App Connectors have been disconnected for **1 year or more**, an alert appears at login.

## Management Edge Cases

- App Connectors managed **by Zscaler** (e.g., used for Zscaler Deception, or hardware Branch Connector) are **read-only** — cannot be edited or deleted from the console.
- Host Dedicated IP (HDIP) and Branch Connector-managed App Connectors have reduced field visibility.
