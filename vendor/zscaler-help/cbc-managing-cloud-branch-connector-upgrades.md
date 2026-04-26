# Managing Cloud & Branch Connector Upgrades

**Source:** https://help.zscaler.com/cloud-branch-connector/managing-cloud-branch-connector-upgrades
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Deployment Management for Virtual Devices 
Managing Cloud & Branch Connector Upgrades
Cloud & Branch Connector
Managing Cloud & Branch Connector Upgrades
Ask Zscaler

Watch a video about Cloud & Branch Connector Upgrades (shows legacy UI).

When Cloud or Branch Connectors are deployed, the software is upgraded to the latest version. The upgrade patch can include OS upgrades and Zscaler software upgrades. OS upgrades do not happen in the same way other packages do. After the latest images are posted in the public cloud for Cloud Connector, you must create new deployments for the OS upgrade. The public cloud for Cloud Connector is hosted in the Zscaler Admin Console for download for Branch Connector virtual machines (VMs). The devices are reprovisioned with the latest images.

Periodic Upgrades

Cloud and Branch Connectors check for new software versions every week, and if one is available, they upgrade automatically. By default, the upgrade window starts every Sunday at midnight (local time of deployed Cloud or Branch Connector). All connectors in the Cloud Connector group or Branch Connector group on the Virtual Branch Devices and Physical Branch Devices pages are updated within a two-hour window. Upgrades for connectors within the Cloud Connector group or Branch Connector group on the Virtual Branch Devices and Physical Branch Devices pages are staggered to prevent service impact. For information on updating the upgrade schedule, see Editing Cloud Connectors, Editing Virtual Branch Devices, and Editing Physical Branch Devices.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Managing Cloud & Branch Connector Upgrades
Rotating Zscaler Service Account Passwords
