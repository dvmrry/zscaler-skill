# Service Edges: the data plane, its form factors, and how traffic reaches one (shared.cloud-architecture.service-edges)
Also called: service edge; public service edge; data plane; policy follows the user; geolocation nearest service edge; service edge form factors; zen

Service Edges are where traffic is inspected and policy is enforced. Public Service Edges for Internet & SaaS are full-featured, inline internet security gateways that inspect all internet traffic bidirectionally for malware and enforce security and compliance policies. [shared.cloud-architecture.service-edges:zia-pse-definition]

**Reaching one.** An organization can forward its traffic to any Public Service Edge in the world, or use Zscaler's Geolocalization IP resolution to direct users' traffic to the nearest one. [shared.cloud-architecture.service-edges:forward-anywhere-or-nearest] When a user moves to a different location, the policy follows the user: the Public Service Edge downloads the appropriate policy. [shared.cloud-architecture.service-edges:policy-follows-user] Zscaler determines the closest available Public Service Edge based on the geolocation information associated with the IP address that sent the request to resolve the Zscaler gateway name (for example, zscaler.net) or the IP address from which the PAC file was downloaded. Zscaler uses MaxMind databases to associate the longitude and latitude coordinates with the source IP address; if the GeoIP coordinates are incorrect in the database, the traffic might be forwarded to a farther node, and Zscaler Support can override the coordinates when a support ticket is opened. [shared.cloud-architecture.service-edges:geo-basis] Zscaler authoritative DNS servers support the EDNS0 client subnet option; they can identify the origin of DNS requests from the client subnet options and return DNS responses based on the user's location, which the page says widely benefits end users of public DNS servers such as OpenDNS, Google and Infoblox. In the vendor's example, a request that includes client subnet options is identified by the authoritative server in Washington D.C., which returns the VIP of the Johannesburg or Capetown data center, whichever is closest to the client in South Africa. [shared.cloud-architecture.service-edges:authoritative-edns0] What the servers answer with no client subnet is open [gap:shared.cloud-architecture.service-edges:edns0-no-subnet]. The rest of how the nearest edge is chosen is open [gap:shared.cloud-architecture.service-edges:selection-algorithm]. The checks for an edge that is not the nearest are in [ip.zscaler.com and the vendor's causes when traffic does not land on the nearest Public Service Edge](kb:zia.traffic-forwarding.verification). Restricting the eligible edges is what a subcloud does: [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds).

**What happens on the edge.** Customer traffic is not passed to any other component within the Zscaler infrastructure. [shared.cloud-architecture.service-edges:traffic-stays-on-edge] The TCP stack on the Public Service Edge runs in user mode and is crafted for multitenancy and data security. [shared.cloud-architecture.service-edges:user-mode-tcp] Public Service Edges never store any data to disk. [shared.cloud-architecture.service-edges:no-disk] Logs leave the edge for the Nanolog: [Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS](kb:shared.cloud-architecture.logging-path).

**Availability.** Public Service Edges are always deployed in active-active load balancing mode worldwide, and the Central Authority monitors their health to ensure availability. [shared.cloud-architecture.service-edges:active-active] A data center can serve one VIP from several clusters: [Multi-Cluster Load Sharing is described for Public Service Edge clusters in Zscaler data centers: several clusters in different network address blocks serve the same VIP, so Zscaler can add capacity without customers moving their GRE tunnels.](kb:zia.virtual-service-edge.load-balancing:mcls-is-public-se-only), with detail in [Multi-Cluster Load Sharing: several Public Service Edge clusters behind one VIP](kb:shared.multi-cluster).

## Form factors

| Form factor | Who runs it | Subject |
| --- | --- | --- |
| ZIA Public Service Edge | Zscaler | this subject, and [In Private Access the Service Edge does not inspect the data as traffic flows through it, unlike a Service Edge in Internet & SaaS.](kb:zpa.private-service-edges.what-it-is:no-inspection) for the contrast with Private Access |
| ZIA Private Service Edge | Zscaler-managed, in the organization's data center | [Private Service Edges are installed in an organization's data center and dedicated to its traffic, but they are managed and maintained by Zscaler Cloud Operations, which monitors and maintains them with near-zero touch from the organization.](kb:zia.private-service-edge.what-it-is:dedicated-managed-by-zscaler) |
| ZIA Virtual Service Edge | VM on the organization's infrastructure | [ZIA Virtual Service Edge](kb:zia.virtual-service-edge) |
| ZPA Public Service Edge | Zscaler | [Zscaler maintains Public Service Edges; the organization manages Private Service Edges.](kb:zpa.public-service-edges.what-it-is:operator-role) |
| ZPA Private Service Edge | Zscaler-managed, hosted by the organization | [A ZPA Private Service Edge is a single-tenant instance broker that provides the functionality of a Public Service Edge for Private Access in the organization's environment. The organization hosts it within its site or on a cloud service, and Zscaler manages it.](kb:zpa.private-service-edges.what-it-is:single-tenant-broker) |

IPSec termination on a Virtual Service Edge is a cluster setting: [IPSec Local Termination, off by default, terminates client IPSec traffic at the selected Virtual Service Edge instances of the cluster. For an instance in Cluster deployment mode the instance-level option is read-only and shows the actual status; it is changed on the Virtual Service Edge Clusters page.](kb:zia.virtual-service-edge.clusters:ipsec-local-termination); the reference architecture says the opposite: [shared.ipsec:vse-termination](kb:shared.ipsec:vse-termination). The older names for each edge (ZEN, broker, PSEN) are in [Service Edge names in logs, APIs and support: ZEN, broker, PSEN, VZEN](kb:shared.terminology.service-edge-names).

**Private Access edges.** [Public Service Edges and Private Service Edges enforce user policies and provide secure transport to App Connectors.](kb:zpa.troubleshooting.access-path:edges-enforce-policy) They also build the Microtunnels: [Z-Tunnel and Microtunnel: the two tunnel layers of Private Access](kb:shared.cloud-architecture.tunnels).

**Identity at the edge.** Authentication itself is in [ZIA authentication: how a request gets a user identity](kb:zia.authentication). The order in which an edge settles a user's identity is open [gap:shared.cloud-architecture.service-edges:auth-timeline], and so is how it treats workload traffic that carries no user [gap:shared.cloud-architecture.service-edges:workload-identity].

What to check:
1. For a moved or traveling user, expect a different Public Service Edge with the same policy; for a region requirement, check the subcloud and the PAC variables.
2. For which edge served a ZIA transaction, read the log's edge fields rather than inferring from geography.

Not known (open gaps):
- How the nearest Public Service Edge is chosen [gap:shared.cloud-architecture.service-edges:selection-algorithm]: settled by source-read or lab-test. Blocks: explaining why a user's traffic landed on a distant Public Service Edge
- What the authoritative DNS servers answer when the resolver sends no client subnet [gap:shared.cloud-architecture.service-edges:edns0-no-subnet]: settled by source-read or support-ticket
- Order and precedence of authentication events at the Service Edge [gap:shared.cloud-architecture.service-edges:auth-timeline]: settled by lab-test or support-ticket. Blocks: explaining an unexpected re-authentication or a transaction judged as the wrong user
- How a Service Edge treats Cloud Connector workload traffic with no user identity [gap:shared.cloud-architecture.service-edges:workload-identity]: settled by lab-test or support-ticket. Blocks: explaining why a rule did or did not match workload traffic

Area: shared.cloud-architecture, its subjects in references/_meta/spine/shared/shared.cloud-architecture.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic): A subcloud is a subset of Public Service Edges for Internet & SaaS (ZIA). [shared.subclouds:definition]
- links-to references/_meta/text/shared/shared.cloud-architecture.logging-path.md (Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS)
- links-to references/_meta/text/shared/shared.cloud-architecture.tunnels.md (Z-Tunnel and Microtunnel: the two tunnel layers of Private Access)
- links-to references/_meta/text/shared/shared.ipsec.md (IPSec tunnels to Zscaler: where each question is answered)
- links-to references/_meta/text/shared/shared.multi-cluster.md (Multi-Cluster Load Sharing: several Public Service Edge clusters behind one VIP)
- links-to references/_meta/text/shared/shared.terminology.service-edge-names.md (Service Edge names in logs, APIs and support: ZEN, broker, PSEN, VZEN)
- links-to references/_meta/text/zia/zia.authentication.md (ZIA authentication: how a request gets a user identity)
- links-to references/_meta/text/zia/zia.private-service-edge.what-it-is.md (What a ZIA Private Service Edge is, who runs it, and what it is not)
- links-to references/_meta/text/zia/zia.traffic-forwarding.verification.md (ip.zscaler.com and the vendor's causes when traffic does not land on the nearest Public Service Edge)
- links-to references/_meta/text/zia/zia.virtual-service-edge.md (ZIA Virtual Service Edge)
- links-to references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding)
- links-to references/_meta/text/zia/zia.virtual-service-edge.load-balancing.md (How a Virtual Service Edge cluster spreads and returns traffic)
- links-to references/_meta/text/zpa/zpa.private-service-edges.what-it-is.md (What a ZPA Private Service Edge is)
- links-to references/_meta/text/zpa/zpa.public-service-edges.what-it-is.md (What a ZPA Public Service Edge is)
- links-to references/_meta/text/zpa/zpa.troubleshooting.access-path.md (The hops of a ZPA access request and where each can fail)
