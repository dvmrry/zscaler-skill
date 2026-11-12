# GCP Zero Trust Gateway: managed service boundary and restrictions (cloud-connector.gcp-ztg)
Also called: gcp zero trust gateway; gcp ztg; zero trust gateway google cloud; network security integration zscaler; nsi packet intercept zscaler; gcp ztg regions; is gcp ztg generally available

GCP Zero Trust Gateway is a Zscaler-operated service, not a Cloud Connector VM the customer deploys. [GCP Zero Trust Gateways are a Zscaler cloud-native service offering in public clouds that is supported in GCP.](kb:cloud-connector.overview.zero-trust-gateways:gcp-managed) [Both the AWS and GCP gateway pages describe securing workloads through the Zscaler Zero Trust Cloud as a SaaS offering without managing security infrastructure, removing the need to deploy NAT gateways, security infrastructure, load balancers and VMs.](kb:cloud-connector.overview.zero-trust-gateways:no-infrastructure) GCP gateways are in Limited Availability, and Zscaler Support enables the feature. [cloud-connector.gcp-ztg:limited-availability]

**What it carries.** GCP gateways support Private Access for web traffic only, support Internet & SaaS functionality, and apply firewall, SSL inspection, DLP and IPS as a cloud-native service. [cloud-connector.gcp-ztg:traffic-scope] Whether non-web private applications have any path through it is open [gap:cloud-connector.gcp-ztg:non-web-private-access].

**Restrictions.**
- DNS interception is not supported by GCP gateways. [cloud-connector.gcp-ztg:no-dns-interception]
- Packet interception for Network Security Integration (NSI) cancels the high-bandwidth networking benefit of third-generation or newer machine series, and the article says not to configure NSI for a VM that needs more than 7 Gbps. [cloud-connector.gcp-ztg:nsi-throughput]
- Regional network firewall policies are not supported for packet intercept. [cloud-connector.gcp-ztg:no-regional-firewall-policy]
- In-band integration is not supported in Google Cloud VMware Engine, Google Distributed Cloud-Hosted, Google Distributed Cloud-Edge, Google Private Cloud, Google Cloud Run and GKE Enterprise. [cloud-connector.gcp-ztg:in-band-unsupported]
- To have the network firewall policy evaluated before VPC firewall rules, the article says to run gcloud compute networks update on the VPC with the network firewall policy enforcement order set to `BEFORE_CLASSIC_FIREWALL`; the capture renders the VPC name and the flag with no space between them, so the command text is not copy-ready. [cloud-connector.gcp-ztg:firewall-enforcement-order]

**The GCP resources involved.** An intercept deployment group is a GCP-provided resource that lets the Zscaler service intercept and inspect workload traffic from the customer's VPCs; an intercept endpoint group is a project-wide resource that gives access to the Zscaler-managed security service in GCP. [cloud-connector.gcp-ztg:intercept-groups] Creating a gateway and binding principals is in [Creating a GCP Zero Trust Gateway: region, zones, location, IAM principals](kb:cloud-connector.gcp-ztg.creation); routing a VPC through it from the GCP console is in [Registering a VPC with a GCP Zero Trust Gateway: NSI in-band endpoint group, security profile group and firewall policy](kb:cloud-connector.gcp-ztg.vpc-registration); health, configuration and traffic tests are in [Operating a GCP Zero Trust Gateway: health states, configuration rejection, traffic tests](kb:cloud-connector.gcp-ztg.operations).

**Regions.** The supported GCP regions are [The GCP table lists these regions: `us-west1`, `us-west2`, `us-west3`, `us-west4`, `us-east1`, `us-east4`, `us-east5`, `us-central1`, `us-south1`, `europe-west1`, `europe-west3`, `europe-west4`, `australia-southeast1`, `asia-south1`, `asia-south2` and `asia-southeast1`.](kb:cloud-connector.regions.zero-trust-gateways:gcp-list), with [For a region that is not currently available, the article says to contact Zscaler Support.](kb:cloud-connector.regions.zero-trust-gateways:unlisted-contact-support) for others; whether this set matches other region sets is open in [Whether the workload-discovery, Zero Trust Gateway and Cloud Connector region sets coincide](kb:cloud-connector.regions:region-set-parity).

**Not settled.** No GA date or default entitlement is documented [gap:cloud-connector.gcp-ztg:ga-timing], and whether the AWS and GCP gateways share one operating contract is open in [Whether AWS and GCP Zero Trust Gateways share one operating contract](kb:cloud-connector.overview.zero-trust-gateways:aws-gcp-parity). The customer-deployed GCP Cloud Connector is a different product path: [Cloud Connector on GCP: deployment, service accounts and network shape](kb:cloud-connector.gcp).

What to check:
1. Whether the tenant has GCP Zero Trust Gateway enabled at all, since it is Limited Availability and enabled by Zscaler Support.
2. Whether the failing traffic is DNS, non-web private-application traffic, or traffic from an unsupported GCP platform, none of which the gateway handles.
3. Whether the affected VM needs more than 7 Gbps, or the intercept relies on a regional network firewall policy.
4. Whether the VPC evaluates the network firewall policy before classic VPC firewall rules.
5. Whether the gateway's region is in the supported list.

Not known (open gaps):
- GA date and default entitlement for GCP Zero Trust Gateway [gap:cloud-connector.gcp-ztg:ga-timing]: settled by source-read or support-ticket. Blocks: telling a customer whether the gateway is available without a Support request
- Non-web private-application traffic through GCP Zero Trust Gateway [gap:cloud-connector.gcp-ztg:non-web-private-access]: settled by source-read or lab-test. Blocks: advising on private applications that are not web traffic

Area: cloud-connector.gcp-ztg, its subjects in references/_meta/spine/cloud-connector/cloud-connector.gcp-ztg.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.zero-trust-gateways.md (Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available)
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.zero-trust-gateways.md (Regions where Zero Trust Gateways are supported (AWS and GCP))
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp.md (Cloud Connector on GCP: deployment, service accounts and network shape)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.creation.md (Creating a GCP Zero Trust Gateway: region, zones, location, IAM principals)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.operations.md (Operating a GCP Zero Trust Gateway: health states, configuration rejection, traffic tests)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.vpc-registration.md (Registering a VPC with a GCP Zero Trust Gateway: NSI in-band endpoint group, security profile group and firewall policy)
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.md (Cloud & Branch Connector regions: three region lists that must not be conflated)
