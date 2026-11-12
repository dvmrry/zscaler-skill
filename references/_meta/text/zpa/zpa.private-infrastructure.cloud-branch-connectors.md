# Cloud Connectors, Cloud Connector groups and Branch Connector groups under Private Access > Private Infrastructure (zpa.private-infrastructure.cloud-branch-connectors)
Also called: about cloud connectors; cloud connector groups page; branch connector groups page; private infrastructure cloud connectors

Cloud Connectors are VMs that simplify traffic forwarding to Zscaler services (Internet & SaaS and Private Access) and secure server access to the internet. [zpa.private-infrastructure.cloud-branch-connectors:cloud-connector-what] Cloud Connectors extend Internet & SaaS and Private Access capabilities to cloud-native workloads, simplify multi-cloud networking, and secure workload traffic to the internet while connecting to private applications in other cloud regions or data centers. [zpa.private-infrastructure.cloud-branch-connectors:cloud-connector-benefits]

**Cloud Connectors page.** The Cloud Connectors page (Private Access > Private Infrastructure > Cloud Connectors) lists deployed Cloud Connectors with their Name and Cloud Connector Group; by default no filters are applied. [zpa.private-infrastructure.cloud-branch-connectors:cloud-connectors-page]

**Cloud Connector groups.** Cloud Connector groups are made of individual Cloud Connectors and are used to configure policy rules; they let admins apply policies to a group and upgrade members while maintaining redundancy. [zpa.private-infrastructure.cloud-branch-connectors:cloud-connector-groups] The Cloud Connector Groups page (Private Access > Private Infrastructure > Cloud Connector Groups) lists deployed groups, with a details drawer per group; by default no filters are applied. [zpa.private-infrastructure.cloud-branch-connectors:cloud-connector-groups-page]

**Branch Connector groups.** Branch Connector groups are clusters of Branch Connectors used to configure policy rules; they let admins apply policies to a group and upgrade members while maintaining redundancy, and the page says you can create them in the Zscaler Admin Console using the images shared with your hypervisor. [zpa.private-infrastructure.cloud-branch-connectors:branch-connector-groups] The Branch Connector Groups page (Private Access > Private Infrastructure > Branch Connector Groups) lists deployed groups, with a details drawer per group; by default no filters are applied. [zpa.private-infrastructure.cloud-branch-connectors:branch-connector-groups-page] How a Cloud Connector group comes to exist differs between pages [divergence:zpa.private-infrastructure.cloud-branch-connectors:cloud-group-creation]. The pages give no limits or group sizes, and do not say what the details drawers show [gap:zpa.private-infrastructure.cloud-branch-connectors:group-limits-and-drawers]. The product itself is in [Cloud & Branch Connector: what Cloud Connector is and where each area is described](kb:cloud-connector.overview), and the policy criterion that lists Branch Connector Groups is in [Criteria available on ZPA access policy rules](kb:zpa.policy.criteria).

Sources disagree (name both sides):
- The Private Access page says Cloud Connector groups are created and updated in the Admin Console, while the Cloud Connector overview says they are created automatically on deployment in AWS, Azure or GCP. [divergence:zpa.private-infrastructure.cloud-branch-connectors:cloud-group-creation]
  - zscaler-help: Groups are created and updated in the Admin Console.
  - zscaler-help: Groups are created automatically on deployment in AWS, Azure or GCP.
  Impact: An admin looking for where to create a Cloud Connector group for a cloud deployment may expect a console step the other page says is not needed; the pages do not say whether both apply.

Not known (open gaps):
- Limits, group sizes and the contents of the Details drawers for Cloud and Branch Connector groups [gap:zpa.private-infrastructure.cloud-branch-connectors:group-limits-and-drawers]: settled by source-read

Area: zpa.private-infrastructure, its subjects in references/_meta/spine/zpa/zpa.private-infrastructure.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling)
