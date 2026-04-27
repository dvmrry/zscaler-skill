---
product: cloud-connector
topic: cc-zero-trust-sdwan
title: "Zero Trust SD-WAN — Zscaler's SD-WAN positioning and Cloud Connector role"
content-type: reference
last-verified: 2026-04-27
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/cbc-what-zscaler-zero-trust-sd-wan.md"
  - "vendor/zscaler-help/what-zscaler-cloud-connector.md"
  - "vendor/zscaler-help/cbc-about-traffic-forwarding.md"
  - "vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md"
  - "vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md"
  - "vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.md"
  - "vendor/zscaler-help/cbc-zero-trust-security-aws-workloads-zscaler-cloud-connector.md"
  - "vendor/zscaler-help/zero-trust-exchange-zte-marketing.md"
  - "vendor/zscaler-help/admin-rbac-captures.md"
author-status: draft
---

# Zero Trust SD-WAN — Zscaler's SD-WAN positioning and Cloud Connector role

What Zscaler means when it calls the product "Zero Trust SD-WAN," how Branch Connector and Cloud Connector fit into it, and where the technical substance ends and the marketing framing begins.

---

## 1. The "Zero Trust SD-WAN" label — what Zscaler actually means

**Marketing framing.** Zscaler applies "Zero Trust SD-WAN" as an umbrella term for the Cloud & Branch Connector product family when it is used at branch offices and sites. The name positions the product in a crowded SD-WAN market while distinguishing it from traditional SD-WAN vendors on a single axis: **security posture rather than WAN optimization**.

From the product overview (`cbc-what-zscaler-zero-trust-sd-wan.md`):

> Zero Trust SD-WAN provides branches, on-premises data centers, and public clouds with fast and reliable access to the internet and private applications with a direct-to-cloud architecture that features strong security and operational simplicity. The solution eliminates lateral threat movement by connecting users and IoT/OT devices to applications through the Zscaler Zero Trust Exchange (ZTE).

**Technical reality.** The underlying product is Cloud Connector (for cloud workloads) and Branch Connector (for physical branch locations). "Zero Trust SD-WAN" is the go-to-market name Zscaler uses when pitching this capability to network-infrastructure buyers accustomed to SD-WAN procurement. There is no separate binary or product SKU called "Zero Trust SD-WAN" — the Zscaler help site places all Zero Trust SD-WAN documentation under `help.zscaler.com/cloud-branch-connector/`, the same URL space as Cloud Connector and Branch Connector.

**How it differs from what the market calls SD-WAN:**

| Dimension | Traditional SD-WAN (Cisco Viptela, VMware VeloCloud, etc.) | Zscaler Zero Trust SD-WAN |
|---|---|---|
| Core problem | WAN cost reduction, MPLS replacement, application-aware path selection across multiple uplinks | Secure branch access to internet and private apps via cloud; eliminate on-site firewalls and VPNs |
| Traffic model | Overlay network between branches — branch A to branch B via a private fabric | Branch to Zscaler cloud (ZTE) only; no branch-to-branch overlay |
| WAN optimization | Compression, deduplication, TCP optimization | Not present; Zscaler offloads optimization claims to SaaS-peering relationships at ZTE PoPs |
| MPLS replacement | Explicit goal; supports multiple WAN transports (MPLS + broadband bonding, active-active or active-passive) | Not MPLS replacement; branches still need their own uplink(s); Zscaler routes over whatever broadband is present |
| Security posture | Security is an add-on (Cisco SASE, Fortinet FWaaS, etc.) or separate stack | Security is the product; ZIA inspection and ZPA access policy are native, not add-ons |
| Branch-to-branch traffic | Direct over overlay or via regional hub | Always hairpins through ZTE; no branch-to-branch direct connectivity |
| On-premises state | Complex edge appliances with routing tables, BGP, OSPF | Lightweight VM or plug-and-play device; no overlay routing tables |

The "software-defined" in Zscaler's SD-WAN refers primarily to centralized policy management through the ZTE admin console — not to the WAN-transport virtualization and path-selection engine that defines legacy SD-WAN.

**Where the marketing claim stretches thin.** Zscaler says Zero Trust SD-WAN "replaces" site-to-site VPNs and reduces WAN complexity, which is technically true in a narrow sense: ZPA-enrolled workloads don't need site-to-site VPN tunnels. However, the product does **not** replace the WAN transport itself, does not manage multiple physical uplinks in the way traditional SD-WAN does, and does not optimize WAN throughput. The "SD-WAN" label is primarily a category hook for buyers, not a description of WAN transport capabilities.

---

## 2. Cloud Connector and Branch Connector as the SD-WAN edge

### Form factors

Zero Trust SD-WAN is realized through two sibling form factors:

**Branch Connector** — the branch-office edge. Runs as a lightweight VM on commodity x86 hardware or as a plug-and-play physical device. Deployed at branch sites; handles traffic from endpoint users, servers, IoT/OT devices, and any device on the branch LAN. Can operate in **gateway mode**, where it acts as the default gateway for the branch, absorbing all traffic before forwarding selectively to ZIA, ZPA, Direct, Local, or dropping it. The predefined WAN destination forwarding rules (e.g., "Direct rule for WAN Destinations Group") are only available on hardware devices in gateway mode.

**Cloud Connector** — the cloud-workload edge. Runs as a VM inside the customer's cloud account (AWS, Azure, or GCP). Does not sit in the branch; placed in-path for cloud workload traffic. The same forwarding engine underlies both, but Cloud Connector targets server/workload traffic rather than branch user traffic.

Both are managed from the same admin portal (`Cloud & Branch Connector Admin Portal`) and share the same traffic-forwarding rule framework. The help-site URL path is identical (`cloud-branch-connector`). They share the same five forwarding methods.

### Deployment patterns at branches

Branch Connector at a branch site typically follows one of two patterns:

**Bump-in-wire / transparent proxy mode** — placed in-path between the LAN and the internet uplink. Traffic flows through Branch Connector naturally; no endpoint reconfiguration needed.

**Gateway mode** — Branch Connector acts as the default gateway for the branch subnet. This unlocks predefined forwarding rules for WAN and LAN destinations. This mode is required for per-uplink WAN selection (Balanced / Best Link — see section 4 below).

**Zero-touch provisioning** — Zscaler documents plug-and-play deployment via provisioning URL embedded in the hardware device template. The device registers to the ZTE on first boot. This is the primary operational differentiator Zscaler claims over traditional SD-WAN appliances (which typically require site-by-site CLI configuration).

### Internet egress path

Once traffic is on Branch Connector or Cloud Connector, the egress path is:

```
Branch/Cloud LAN → Connector VM → ZTE (ZIA or ZPA Service Edge) → destination
```

The connector selects a ZTE Service Edge using geolocation (nearest PoP) by default, with optional override to pin to specific Public Service Edges, Virtual Service Edges, or sub-clouds per traffic-forwarding rule. The ZTE PoP (not the branch itself) performs security inspection, URL filtering, SSL decryption, DLP, and threat prevention. This is the "direct-to-cloud" model: branch traffic goes cloud-first, not data-center-first.

---

## 3. Capabilities

### Traffic forwarding — five methods

All traffic decision-making at the connector runs through traffic forwarding rules, evaluated in ascending rule order (lowest rule number first, first match wins). Each rule specifies forwarding method:

| Method | What it does |
|---|---|
| **ZIA** | Forward to ZIA (Internet & SaaS) via encrypted tunnel to the nearest ZIA Service Edge. Security policy inspection applies. Default for internet-bound traffic. |
| **ZPA** | Forward to ZPA (Private Access) for identity-aware access to private applications. Encrypted tunnel to ZPA Service Edge. App Connector on the application side closes the loop. |
| **Direct** | Bypass ZIA and ZPA; send directly to the destination using the Zscaler service IP address. Useful for traffic that must not be inspected (e.g., specific SaaS endpoints with their own security). |
| **Drop** | Discard all matching traffic. Packets appear in session logs; useful for enforcing segmentation or blocking unwanted egress. |
| **Local** | Forward within the cloud environment (VPC-to-VPC, subnet-to-subnet) without egressing to the internet or ZTE. Cloud Connector and Zero Trust Gateways only. Preserves original client IP. Used for east-west segmentation in cloud environments. |

### App-aware routing

The traffic-forwarding rule engine matches on:

- **Application Service Groups** — predefined named groups for Office 365, Zoom, Webex, RingCentral, LogMeIn, BlueJeans, AWS, Azure, GCP, Zscaler Cloud Endpoints, TalkDesk.
- **Network services / network service groups** — port/protocol-based matching.
- **Source IP groups / source IP addresses / source workload groups** (Cloud Connector only for workload groups).
- **Destination IPv4 groups, wildcard FQDNs, or FQDNs**.
- **Location/sublocation** — which branch or connector group the rule applies to.

This is application-layer steering in the sense that Zscaler can route Zoom to ZIA, Office 365 direct, and everything else to ZIA. It is **not** application-aware path selection in the SD-WAN sense (e.g., selecting between MPLS and broadband based on measured packet loss for a specific application). The decision is forwarding method (which Zscaler service), not which physical WAN link.

### WAN link selection (hardware Branch Connector only)

For Branch Connector hardware devices deployed in **gateway mode**, traffic-forwarding rules include a **WAN Selection** field:

- **None** — defer to the Traffic Distribution setting in the Branch Configuration Template.
- **Balanced** — distribute traffic evenly across available WAN links.
- **Best Link** — always forward via the best-performing WAN link.

This is the only documented per-link path selection capability in the help docs. It applies only to hardware Branch Connector in gateway mode; it does not apply to Cloud Connector (which has no concept of multiple physical WAN uplinks). The "best-performing" metric is not defined in the captured documentation — it is not clear from available sources whether this is measured RTT, loss, or a proprietary metric. This is an open question (see section 8).

### Redundancy and HA

For Cloud Connector (cloud workloads):

- **All-active horizontal scaling** — multiple Cloud Connectors behind a cloud-native load balancer (AWS Gateway Load Balancer, Azure Standard Load Balancer). No active/passive; all handle traffic simultaneously.
- **Primary/secondary/tertiary gateway failover** — per-connector failover to secondary ZTE Service Edge takes ~30 seconds. Tertiary is automatic (Zscaler-selected), not user-configurable.
- **Fail-close (default) / fail-open (configurable)** — if all gateways are unreachable, default drops internet-bound traffic. Fail-open lets traffic egress directly, bypassing Zscaler inspection.
- **Cross-zone load balancing** — Zscaler recommends enabling AWS GWLB cross-zone load balancing for production; at least two connectors per availability zone across at least two AZs.

For Branch Connector (branch sites):

- **HA model not fully captured in available docs** — the help content covers hardware redundancy at a high level but does not specify failover timing or mode for physical Branch Connector appliances. The ZTE-side failover (primary/secondary gateway) is the same as Cloud Connector.

ZTE PoP availability: Zscaler operates 150+ global data centers. Zero Trust Gateways (a specific Cloud Connector deployment variant) are documented as supported in 16 AWS regions as of capture date (us-east-1, us-east-2, us-west-1, us-west-2, eu-north-1, eu-central-1, eu-south-2, eu-west-1/2/3, ap-southeast-1, ap-south-1, ap-southeast-2, ca-central-1, sa-east-1, me-south-1). Additional regions require contacting Zscaler Support.

### Security inspection at the ZTE

All traffic forwarded to ZIA is subject to the full ZIA inspection stack at the PoP: SSL/TLS inspection, URL filtering, IPS, malware/ATP, DLP, firewall, sandboxing. Traffic forwarded to ZPA is subject to ZPA access policy (identity-aware, application-segment scoped) and optionally AppProtection (inline WAF/IPS). The branch or cloud connector itself performs no deep inspection — it is a traffic forwarder, not a security appliance. This is the key architectural difference versus traditional SD-WAN vendors that embed security at the edge.

---

## 4. Limits and what it explicitly is not

**Not a branch-to-branch overlay.** Zero Trust SD-WAN does not create a VPN mesh or fabric between branch locations. Branch A cannot reach Branch B via a Zscaler-managed overlay; branch-to-branch traffic must hairpin through the ZTE (Branch A → ZTE → ZPA App Connector at Branch B, if ZPA is configured) or use an existing network path entirely outside Zscaler. This is a fundamental architectural difference versus Cisco Viptela SD-WAN fabrics, VMware VeloCloud mesh, or Silver Peak Unity Boost overlays.

**Not a general-purpose router.** Branch Connector does not run routing protocols (BGP, OSPF, IS-IS). It does not participate in WAN route advertisement. It does not replace a branch router for LAN-to-LAN routing, VLAN trunking, or WAN PE-CE exchange. It sits on top of an existing network and diverts specific traffic to Zscaler.

**Not WAN optimization.** No TCP acceleration, no compression, no deduplication. Zscaler's claim to "improved application performance" is based on ZTE PoP proximity to SaaS providers (Zscaler's peering relationships) and the elimination of data-center hairpinning — not on WAN-layer protocol optimization.

**Not a substitute for MPLS.** Zero Trust SD-WAN does not carry private branch-to-branch traffic over an ISP-managed MPLS circuit, nor does it replace MPLS with a managed SD-WAN underlay. Organizations retiring MPLS still need ISP broadband circuits at each branch; Zscaler goes over those circuits to the nearest PoP.

**Not QoS-aware at the WAN layer.** There is no documented DSCP marking, traffic shaping, or queuing configuration in the Cloud & Branch Connector traffic-forwarding rules. ZIA bandwidth control (within the ZTE) applies to internet-bound traffic after it reaches the PoP; there is no per-branch WAN-link QoS.

**Not a full SD-WAN orchestrator.** Zscaler does not manage underlay circuits, ISP relationships, physical cabling, or WAN SLA monitoring. Competitors like Cisco Viptela and VMware VeloCloud provide operations consoles for end-to-end WAN visibility including per-link SLA dashboards, jitter/loss/latency monitoring per circuit, and ISP ticketing integration.

**Not available without internet.** The connector must be able to reach a Zscaler ZTE PoP over the public internet. There is no SD-WAN-style private backbone between branches. If the internet link is down, ZIA/ZPA connectivity is lost. Fail-open mode allows traffic to egress directly (no inspection); fail-close (default) drops the traffic.

---

## 5. Comparison vs traditional SD-WAN vendors

Feature comparison by axis — not a scoring exercise.

### Axis 1: Overlay fabric / branch-to-branch connectivity

- **Cisco Viptela / SD-WAN (SD-WAN fabric)**: Full mesh or hub-and-spoke overlay using VXLAN/IPSec. Any branch can reach any other branch over the fabric. Route exchange via OMP. Centralized vManage policy + vSmart control plane.
- **VMware VeloCloud**: Dynamic multipath optimization. Per-flow load balancing across multiple WAN links. Full SD-WAN mesh.
- **Silver Peak / Aruba EdgeConnect**: WAN optimization + SD-WAN. TCP optimization, compression, dedup. Unity Boost licenses enable WAN optimization on top of SD-WAN overlay.
- **Fortinet Secure SD-WAN**: SD-WAN with integrated NGFW at the edge. BGP/OSPF support. Active-active WAN uplink management.
- **Zscaler Zero Trust SD-WAN**: No overlay. Branch connects to ZTE only. Branch-to-branch traffic goes via ZPA (hairpin through cloud). No routing protocol support at the branch edge.

### Axis 2: Security model

- **Cisco / VMware / Silver Peak / Aruba**: Security is layered on (Cisco SASE add-on, VMware SASE via Symantec/Broadcom acquisition, Aruba EdgeConnect + Axis Security). Edge security often runs as a separate appliance or service insertion.
- **Fortinet**: NGFW integrated at the edge device. Security policy lives in the appliance, not in the cloud.
- **Zscaler**: Security lives entirely in the ZTE cloud. The edge device (Branch Connector) is policy-neutral — it forwards to ZTE; ZTE inspects and enforces. Consistent policy across branches because enforcement is centralized.

### Axis 3: WAN transport management

- **Viptela, VeloCloud, EdgeConnect, Fortinet**: Active management of multiple WAN transports (MPLS + broadband + LTE). Per-application SLA policies with real-time link quality monitoring and failover at sub-second to single-digit-second timescales.
- **Zscaler**: WAN Selection (Balanced / Best Link) documented for hardware Branch Connector in gateway mode only. No multi-transport SLA monitoring, no sub-second failover between uplinks, no MPLS integration. Branch connectivity to Zscaler ZTE fails over at the ZTE-gateway level (~30 seconds), not the WAN-link level.

### Axis 4: On-premises appliance complexity

- **Traditional SD-WAN**: Edge appliances run routing stacks, SD-WAN control-plane clients, security stacks, VPN endpoints, and WAN optimization agents. Significant on-site compute and operational burden.
- **Zscaler**: Branch Connector is a lightweight VM or plug-and-play device. No routing stack, no on-site security inspection engine. Zero-touch provisioning via provisioning URL. Operationally simpler for branches that only need internet and private-app access.

### Axis 5: Private application access

- **Traditional SD-WAN**: Private applications accessible via the WAN fabric or site-to-site VPN. No inherent least-privilege; once on the WAN, lateral movement is possible.
- **Zscaler**: ZPA provides application-segment-level access control. No WAN-layer access; identity and policy verification per session at the ZTE. Applications are hidden from the internet and inaccessible without ZPA policy match.

### Axis 6: IoT/OT support

- **Traditional SD-WAN**: Network segmentation via VLANs; IoT is on the same WAN fabric, increasing attack surface.
- **Zscaler**: IoT device classification (traffic-profile-based), OT-specific clientless SSH/RDP/VNC browser access via PRA. Marketed as a differentiator, but the actual classification mechanism is described at a high level only in the help docs — implementation depth is a marketing claim rather than a fully documented technical specification.

---

## 6. Common operational gotchas

### Internet-only model, all traffic hairpins to ZTE

The critical mental-model shift: all secured traffic goes to a Zscaler PoP first. For an org with branches in Chicago and Dallas, a Dallas user accessing a Chicago data-center app via ZPA hairpins: Dallas branch → nearest ZTE PoP → ZPA → App Connector in Chicago. The round-trip adds PoP-distance latency that does not exist on an MPLS circuit or SD-WAN overlay. Whether this is acceptable depends on application sensitivity to latency (batch file access: usually fine; real-time manufacturing control: often not).

### ZTE PoP availability dependency

If the nearest ZTE PoP is unreachable:
- **Default fail-close**: branch internet and private-app access stops entirely.
- **Fail-open alternative**: traffic egresses directly without inspection, creating a security gap.

There is no Zscaler-managed private backup path. Organizations with strict uptime requirements need their own circuit diversity (dual ISP) + branch-level policy decisions about fail-open behavior.

### Branch-to-branch traffic is not automatic

Organizations expecting SD-WAN-style branch meshing will be surprised. Branch-to-branch traffic requires:
1. ZPA App Connectors deployed at each branch that hosts resources.
2. ZPA Application Segments defined per application.
3. ZPA Access Policy.

This is a more deliberate configuration than SD-WAN fabric membership. The benefit is zero implicit trust between branches; the cost is more configuration work.

### Connector upgrade cadence disrupts sessions

Cloud Connector upgrades on a scheduled window (default: Sunday midnight local time) with a 2-hour stagger. During upgrade, the connector is temporarily out of rotation. Existing long-lived sessions (database connections, long-polling, streaming) through the affected connector may drop. Horizontal scaling (2+ connectors per AZ) reduces but does not eliminate the impact because existing sessions on the connector being upgraded are not migrated.

### WAN selection is hardware Branch Connector only

The "Best Link" / "Balanced" WAN selection in traffic-forwarding rules is documented exclusively for hardware Branch Connector devices deployed in gateway mode. Cloud Connector and virtual Branch Connector deployments do not have this option. Organizations evaluating Zscaler as a full SD-WAN replacement based on multi-link management should confirm hardware requirements before assuming VM-only deployments deliver that capability.

### "Zero Trust SD-WAN" and "Branch Connector" are not the same as "Cloud Connector" for cloud workloads

The help portal, admin console, and marketing material use "Zero Trust SD-WAN" to refer primarily to the branch use case. Cloud Connector (for AWS/Azure/GCP workloads) shares the same help-site URL space and the same traffic-forwarding rule engine, but is positioned separately as a cloud-workload security product, not as an SD-WAN product. In practice they are the same product family; the naming split reflects the buyer persona (network buyer for branches; cloud/security team for workloads).

### Shadow IoT/OT classification is a marketing claim with limited technical documentation

Zscaler documents device classification based on traffic profiles. The specifics (classification engine, supported device databases, update cadence, accuracy metrics, false-positive handling) are not present in the captured help documentation. Treat "automatic device classification" as a directional capability claim, not a technically specified feature, until deeper documentation or lab validation is available.

---

## 7. Open questions register

1. **Exact "Best Link" metric definition** — what signal does Branch Connector use to determine the best-performing WAN link? RTT? Packet loss? Proprietary composite score? Not specified in captured docs.

2. **Hardware Branch Connector appliance models** — Zscaler references "plug-and-play devices" but does not enumerate hardware models, throughput specs, or form factors in the captured help pages. The "Zero Trust Branch Devices" article is referenced but not captured. What are the physical appliance SKUs?

3. **Branch-to-branch via ZPA latency characterization** — in practice, what latency penalty does the ZTE hairpin add for branch-to-branch traffic vs direct MPLS? No benchmarks or SLA guidance in captured docs.

4. **WAN selection on virtual Branch Connector** — is "Best Link / Balanced" ever available on a VM-based Branch Connector deployment, or is it definitively hardware-only? The docs say "hardware device deployed in gateway mode" but do not explicitly confirm VMs are excluded under all conditions.

5. **IoT classification engine specifics** — which OT/IoT device types are supported, what's the update mechanism, and what is the false-positive/false-negative characterization?

6. **Zero Trust Gateway vs Cloud Connector group type** — the admin console offers both as Group Type options. The distinction is not documented in captured material. Likely a naming evolution (ZTG = newer); needs lab or Zscaler Support confirmation.

7. **Fail-open toggle location in admin portal** — the HA docs mention "customers can change this configuration" but do not specify the admin-portal path. Where exactly is fail-open configured?

8. **Physical Branch Connector HA model** — the HA documentation covers Cloud Connector in detail. Physical Branch Connector HA (e.g., dual-appliance active/passive at a branch) is not captured. How is branch-site HA achieved when the branch has a single hardware connector?

9. **QoS / DSCP treatment** — does Zscaler preserve DSCP markings on traffic forwarded through the connector to ZTE? Does ZTE re-mark? Not addressed in captured docs.

---

## Cross-links

- Cloud Connector architecture and HA detail: [`./overview.md`](./overview.md)
- Traffic forwarding rules — full five-method reference: [`./forwarding.md`](./forwarding.md)
- Cloud Connector and Branch Connector naming disambiguation: [`./index.md`](./index.md)
- ZPA App Connectors (required for branch-to-branch private-app access): [`../zpa/app-segments.md`](../zpa/app-segments.md)
- Portfolio context — where Zero Trust SD-WAN fits in the Zscaler product map: [`../_portfolio-map.md`](../_portfolio-map.md) § Cloud & Branch Connector (Tier 1)
