# What a ZPA Public Service Edge is (zpa.public-service-edges.what-it-is)
Also called: zpa public service edge; control service edge; zscaler public service edge for private access; public service edge scale; virtual service edge zpa; public service edge safe mode

A Public Service Edge is the Zscaler-operated broker tier of Private Access, and it is not the ZIA product of the same name.

**What it is.** Public Service Edges for Private Access are deployed in Zscaler data centers around the world; Zscaler maintains them and they are the cloud-based portion of the Private Access data forwarding path. [zpa.public-service-edges.what-it-is:public-definition] Zscaler maintains Public Service Edges; the organization manages Private Service Edges. [zpa.public-service-edges.what-it-is:operator-role] Public Service Edges for Private Access can handle hundreds of thousands of concurrent users with millions of concurrent sessions, and enforce access and reauthentication policies. [zpa.public-service-edges.what-it-is:scale] For any Microtunnel, the Control Service Edge is the Public Service Edge that handles cloud-level system messages to establish the M-Tunnel. [zpa.public-service-edges.what-it-is:control-service-edge]

**Function.** A Public Service Edge brokers like a Private Service Edge: [Like a Public Service Edge, a Private Service Edge manages the connections between Zscaler Client Connector and App Connectors. It registers with the Private Access Cloud, which lets it download the relevant policies and configurations and enforce all Private Access policies, and it caches path selection decisions.](kb:zpa.private-service-edges.what-it-is:broker-function). It does not inspect traffic: [In Private Access the Service Edge does not inspect the data as traffic flows through it, unlike a Service Edge in Internet & SaaS.](kb:zpa.private-service-edges.what-it-is:no-inspection). Authentication of the edges and clients: [Zscaler Client Connector and App Connectors authenticate with the organization's public key infrastructure (PKI); Public Service Edges and Private Service Edges authenticate with Zscaler's PKI. The Z-Tunnel is further authenticated using SAML 2.0.](kb:zpa.private-service-edges.data-path:pki-roles). Active-active deployment: [Service Edges are deployed in active-active mode for availability and redundancy.](kb:zpa.private-service-edges.deployment:active-active).

**Logs.** Log data for Public Service Edges is exported to log routers, which direct it to the Log Streaming Service hosted in the geographic region for each organization; the Log Streaming Service analyzes events reported primarily by Public or Private Service Edges. [zpa.public-service-edges.what-it-is:log-routing]

**Not in ZPA.** Virtual Service Edge is an Internet & SaaS (ZIA) product; it does not appear in the ZPA parts of the Python SDK, the Go SDK or the Terraform provider, and ZPA's customer-deployed edge is the Private Service Edge. [zpa.public-service-edges.what-it-is:no-vse-in-zpa]

**What is not captured.** The failure behavior and Safe-mode are open [gap:zpa.public-service-edges.what-it-is:safe-mode], and so are caching and reconnect [gap:zpa.public-service-edges.what-it-is:ca-reconnect-semantics], client selection [gap:zpa.public-service-edges.what-it-is:public-selection], and a dedicated Public-tier article [gap:zpa.public-service-edges.what-it-is:no-public-help-page].

What to check:
1. Whether the question is about Private Access rather than Internet & SaaS, since the ZIA Public Service Edge and the ZIA Virtual Service Edge are other products.
2. Whether the question assumes an operator can deploy, configure or update a Public Service Edge; Zscaler maintains them.
3. Whether a scale or fail-safe behavior is asked about: the capture states the scale only, and fail-open or fail-closed behavior is not captured.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.public-service-edges.what-it-is:no-vse-in-zpa] Tier B: Absence: git grep -i "virtual service edge" at the pin of vendor/zscaler-sdk-python (zscaler/zpa), vendor/zscaler-sdk-go (zscaler/zpa) and vendor/terraform-provider-zpa returns nothing; the help capture for the Virtual Service Edge is an Internet & SaaS article.

Not known (open gaps):
- Scale, Safe-mode and default URL-block behavior of the ZPA broker tier [gap:zpa.public-service-edges.what-it-is:safe-mode]: settled by source-read. Blocks: describing failure behavior of the Public tier
- Policy caching and Central Authority reconnect behavior of the Public tier [gap:zpa.public-service-edges.what-it-is:ca-reconnect-semantics]: settled by source-read or support-ticket. Blocks: stating Public tier behavior when the control plane is unreachable
- How a client is assigned a Public Service Edge [gap:zpa.public-service-edges.what-it-is:public-selection]: settled by source-read. Blocks: explaining why a client landed on a given Public Service Edge
- Dedicated ZPA Public Service Edge help page [gap:zpa.public-service-edges.what-it-is:no-public-help-page]: settled by source-read. Blocks: citing a Public-tier-specific article

Area: zpa.public-service-edges, its subjects in references/_meta/spine/zpa/zpa.public-service-edges.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service): Log data for Public Service Edges is exported to log routers, which direct it to the Log Streaming Service hosted in the geographic region for each organization; the Log Streaming Service analyzes events reported primarily by Public or Private Service Edges. [zpa.public-service-edges.what-it-is:log-routing]
- links-to references/_meta/text/zpa/zpa.private-service-edges.what-it-is.md (What a ZPA Private Service Edge is)
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges), from zpa.public-service-edges: A tenant's Private Service Edge groups sit alongside Public Service Edges: a group can be configured to be prioritized over a closer Public Service Edge. [zpa.private-service-edges.what-it-is:coexists-with-public]
- links-to references/_meta/text/zpa/zpa.private-service-edges.data-path.md (Tunnels, certificates and firewall requirements on the Private Service Edge path)
- links-to references/_meta/text/zpa/zpa.private-service-edges.deployment.md (Private Service Edge platforms, host OS maintenance, capacity and limits)
