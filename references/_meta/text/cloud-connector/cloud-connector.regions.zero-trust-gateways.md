# Regions where Zero Trust Gateways are supported (AWS and GCP) (cloud-connector.regions.zero-trust-gateways)
Also called: zero trust gateway regions; ztg supported regions; eu-central-2 zero trust gateway; zero trust gateway region not listed
Former IDs: cloud-connector-27

The supported-regions article is scoped to Zscaler Zero Trust Gateways and has two tables, Amazon Web Services and Google Cloud Platform. [cloud-connector.regions.zero-trust-gateways:scope] It is a list for Zero Trust Gateways, not for Cloud Connector VMs: [Cloud & Branch Connector regions: three region lists that must not be conflated](kb:cloud-connector.regions).

**AWS.** The AWS table lists these regions: `us-east-1`, `us-east-2`, `us-west-1`, `us-west-2`, `eu-north-1`, `eu-central-1`, `eu-south-2`, `eu-west-1`, `eu-west-2`, `eu-west-3`, `ap-southeast-1`, `ap-south-1`, `ap-south-2`, `ap-southeast-2`, `ap-southeast-4`, `ca-central-1`, `sa-east-1` and `me-south-1`. [cloud-connector.regions.zero-trust-gateways:aws-list] Whether `eu-central-2` belongs on it is a source conflict [gap:cloud-connector.regions.zero-trust-gateways:eu-central-2].

**GCP.** The GCP table lists these regions: `us-west1`, `us-west2`, `us-west3`, `us-west4`, `us-east1`, `us-east4`, `us-east5`, `us-central1`, `us-south1`, `europe-west1`, `europe-west3`, `europe-west4`, `australia-southeast1`, `asia-south1`, `asia-south2` and `asia-southeast1`. [cloud-connector.regions.zero-trust-gateways:gcp-list]

**Anything else.** Neither list contains an AWS GovCloud or AWS China region, or any region beyond those listed, so a Zero Trust Gateway in such a region is not documented as supported. [cloud-connector.regions.zero-trust-gateways:no-sovereign] For a region that is not currently available, the article says to contact Zscaler Support. [cloud-connector.regions.zero-trust-gateways:unlisted-contact-support]

What to check:
1. Whether the region code appears in the AWS or GCP list; if not, the help page directs the request to Zscaler Support.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.regions.zero-trust-gateways:no-sovereign] Tier B: Follows from the complete tables; omission is not a statement that the region is refused, and the article directs such requests to Support.

Not known (open gaps):
- Whether eu-central-2 is a supported AWS Zero Trust Gateway region [gap:cloud-connector.regions.zero-trust-gateways:eu-central-2]: settled by source-read or support-ticket or tenant-data. Blocks: answering whether a gateway can be created in eu-central-2

Area: cloud-connector.regions, its subjects in references/_meta/spine/cloud-connector/cloud-connector.regions.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.md (Cloud & Branch Connector regions: three region lists that must not be conflated)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.overview.zero-trust-gateways.md (Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available)
- see-also references/_meta/text/cloud-connector/cloud-connector.regions.deployment.md (Where a customer-deployed Cloud Connector VM can be deployed)
