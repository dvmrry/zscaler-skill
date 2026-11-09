# Zscaler cloud architecture (shared.cloud-architecture)
Also called: cloud architecture; zscaler architecture; zero trust exchange architecture; how is a zscaler cloud built; control plane data plane; zia vs zpa infrastructure

What Zscaler runs on a tenant's behalf, component by component, and where the two main services part ways. Zscaler describes its Internet & SaaS cloud infrastructure as three key components: the Central Authority, the Public Service Edges for Internet & SaaS, and Nanolog clusters. [shared.cloud-architecture:three-components]

1. **Which cloud?** A tenant lives on one named cloud: [Zscaler cloud names: which cloud a tenant is on, and the production name list](kb:shared.cloud-architecture.cloud-names).
2. **Control plane.** The Central Authority holds policy and configuration, built differently per service: [The Central Authority: what it holds, and how ZIA and ZPA cluster it differently](kb:shared.cloud-architecture.central-authority).
3. **Data plane.** Service Edges inspect traffic and enforce policy, in public, private and virtual forms: [Service Edges: the data plane, its form factors, and how traffic reaches one](kb:shared.cloud-architecture.service-edges). A subcloud narrows which edges a tenant uses: [Subclouds: restricting which Service Edges handle a tenant's traffic](kb:shared.subclouds).
4. **Logs.** Log Routers, Nanolog clusters, NSS and LSS: [Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS](kb:shared.cloud-architecture.logging-path).
5. **Supporting systems and feeds.** Sandbox and PAC servers, the Admin Console, and Feed Central: [Support systems of a Zscaler cloud, and Feed Central](kb:shared.cloud-architecture.support-systems).
6. **Private Access tunnels and trust.** Z-Tunnels and Microtunnels in [Z-Tunnel and Microtunnel: the two tunnel layers of Private Access](kb:shared.cloud-architecture.tunnels), certificates in [Private Access certificate trust: tenant CAs, Zscaler PKI, pinning and key custody](kb:shared.cloud-architecture.trust-model).
7. **When something fails.** Per component, including the Business Continuity Cloud and client fail-open: [What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs](kb:shared.cloud-architecture.failure-domains).

## Two services, two infrastructures

Private Access was built from the ground up for secure remote access and runs on its own multi-tenant infrastructure, separate from Internet & SaaS; the separation ensures that when one organization uses both services, public and internal traffic never mix on the same device. [shared.cloud-architecture:zpa-separate] An organization does not need Internet & SaaS to use Private Access. When it uses both, Client Connector inherits some functionality from Internet & SaaS, such as enrollment, user profiles and traffic management. [shared.cloud-architecture:zpa-without-zia] [Zscaler Client Connector forwards traffic for internal applications to Private Access and other traffic goes to Internet & SaaS.](kb:zpa.troubleshooting.no-access:other-traffic-elsewhere) A tenant using both services therefore deals with two sets of components: the Internet & SaaS Central Authority, Public Service Edges and Nanolog with NSS, and the Private Access Central Authority, Service Edges and Log Streaming Service. [shared.cloud-architecture:separate-stacks] What, if anything, links the two stacks for one tenant is open [gap:shared.cloud-architecture:cross-product-linkage].

**Making changes live.** A ZIA change is saved but not live until activated: [The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status.](kb:zia.api.activation:saved-not-live). Which products stage changes behind an activation at all is in [Which Zscaler products stage changes behind an activation](kb:shared.activation); whether a ZPA write needs any such step is open: [Whether a ZPA write is live without an activation call](kb:zpa.api.activation:write-takes-effect).

**Names.** Older names for these components (ZEN, broker, Z-App) are mapped in [Zscaler terminology: where each term is defined](kb:shared.terminology).

Inferred, not quoted (say so when an answer rests on one):
- [shared.cloud-architecture:separate-stacks] Tier B: Composed from the two architecture articles and the LSS article; no source lists the per-service components side by side.

Not known (open gaps):
- What links a tenant's Internet & SaaS and Private Access infrastructure [gap:shared.cloud-architecture:cross-product-linkage]: settled by source-read. Blocks: reasoning about whether an identity or certificate change in one service affects the other

Area: shared.cloud-architecture, its subjects in references/_meta/spine/shared/shared.cloud-architecture.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/shared/shared.cloud-architecture.central-authority.md (The Central Authority: what it holds, and how ZIA and ZPA cluster it differently)
- links-to references/_meta/text/shared/shared.cloud-architecture.cloud-names.md (Zscaler cloud names: which cloud a tenant is on, and the production name list)
- links-to references/_meta/text/shared/shared.cloud-architecture.failure-domains.md (What happens when a Zscaler component fails: edges, Central Authority, cloud, feeds, logs)
- links-to references/_meta/text/shared/shared.cloud-architecture.logging-path.md (Where Zscaler logs go: Log Routers, Nanolog clusters, NSS and LSS)
- links-to references/_meta/text/shared/shared.cloud-architecture.service-edges.md (Service Edges: the data plane, its form factors, and how traffic reaches one)
- links-to references/_meta/text/shared/shared.cloud-architecture.support-systems.md (Support systems of a Zscaler cloud, and Feed Central)
- links-to references/_meta/text/shared/shared.cloud-architecture.trust-model.md (Private Access certificate trust: tenant CAs, Zscaler PKI, pinning and key custody)
- links-to references/_meta/text/shared/shared.cloud-architecture.tunnels.md (Z-Tunnel and Microtunnel: the two tunnel layers of Private Access)
- links-to references/_meta/text/shared/shared.subclouds.md (Subclouds: restricting which Service Edges handle a tenant's traffic)
- links-to references/_meta/text/shared/shared.terminology.md (Zscaler terminology: where each term is defined)
- links-to references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating)
- links-to references/_meta/text/zpa/zpa.api.activation.md (Whether ZPA changes need an activation step)
- links-to references/_meta/text/zpa/zpa.troubleshooting.no-access.md (A user cannot reach a private application at all)
