# Cloud & Branch Connector regions: three region lists that must not be conflated (cloud-connector.regions)
Also called: cloud connector regions; cloud connector supported regions; supportedRegions; ztc_supported_regions; workload discovery regions; is cloud connector available in region

"Is it available in this region?" has three different answers depending on what is meant. Each list below answers only its own question.

1. **Customer-deployed Cloud Connector VMs.** Where the VM itself can be deployed: [Where a customer-deployed Cloud Connector VM can be deployed](kb:cloud-connector.regions.deployment).
2. **Zscaler-managed Zero Trust Gateways.** The help article's AWS and GCP tables: [Regions where Zero Trust Gateways are supported (AWS and GCP)](kb:cloud-connector.regions.zero-trust-gateways).
3. **Workload discovery.** The API's `/publicCloudInfo/supportedRegions` operation is described as retrieving the AWS regions supported for workload discovery settings (WDS); its items are regions supported by Zscaler's Tag Discovery Service. [cloud-connector.regions:wds-endpoint] Each returned region has an `id`, a `name` and a `cloudType` whose values are AWS, AZURE and GCP, although the same field's description calls AWS the default and mandatory value. [cloud-connector.regions:wds-cloud-types]

No source states that any two of these lists are equal, or that the gateway tables match Public Service Edge locations [gap:cloud-connector.regions:region-set-parity].

How Cloud Connectors in different regions relate to each other, and to the Service Edges they reach: [Cloud Connector placement across regions: centralized, decentralized, overlapping address space](kb:cloud-connector.regions.topology).

What to check:
1. Which of the three region questions is being asked: VM deployment, Zero Trust Gateway, or workload discovery.
2. For workload discovery, the tenant's live answer from the supported-regions endpoint rather than a gateway table.

Not known (open gaps):
- Whether the workload-discovery, Zero Trust Gateway and Cloud Connector region sets coincide [gap:cloud-connector.regions:region-set-parity] (data gap): filled by operator; settled by tenant-data or support-ticket. Blocks: using one region list to answer a question about another

Area: cloud-connector.regions, its subjects in references/_meta/spine/cloud-connector/cloud-connector.regions.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.deployment.md (Where a customer-deployed Cloud Connector VM can be deployed)
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.topology.md (Cloud Connector placement across regions: centralized, decentralized, overlapping address space)
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.zero-trust-gateways.md (Regions where Zero Trust Gateways are supported (AWS and GCP))
