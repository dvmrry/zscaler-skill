# Service Edge names in logs, APIs and support: ZEN, broker, PSEN, VZEN (shared.terminology.service-edge-names)
Also called: zen; public zen; private zen; pzen; vzen; psen; vsen; zscaler enforcement node; broker; zpa broker; private broker; clientzen; connectorzen; virtualzen

Current help pages say Service Edge, but older names survive in log fields, API paths and conversation. Where a source shows the older name, it is below.

**ZEN.** [ClientZEN is the Public Service Edge for Private Access that received the request from Zscaler Client Connector, while TimestampConnectionStart is stamped when a Public Service Edge or Private Service Edge received the initial request.](kb:zpa.logs.user-activity:client-zen-private-access) In the Private Access user activity log, ConnectorZEN is the Public Service Edge that sent the request from the App Connector. [shared.terminology.service-edge-names:connector-zen] The ZIA API lists and adds Virtual Service Edge clusters at /virtualZenClusters and Virtual Service Edges at /virtualZenNodes. [shared.terminology.service-edge-names:virtual-zen-api] So ZEN in a Zscaler field or path name denotes a Service Edge: the ZPA log's ClientZEN and ConnectorZEN hold Public Service Edges, and the ZIA API's virtualZen paths hold Virtual Service Edges. [shared.terminology.service-edge-names:zen-is-service-edge]

**Broker.** Broker is a name for a Private Access Service Edge: the help describes the ZPA Private Service Edge as a single-tenant broker that provides the functionality of a Public Service Edge for Private Access. [shared.terminology.service-edge-names:broker-is-zpa-service-edge]

**Internet & SaaS logs.** ZIA web and firewall logs identify the data center rather than the edge: [The NSS web log names the data center that handled a transaction (datacenter, datacentercity, datacentercountry); its field table has no cluster or service node field.](kb:shared.multi-cluster:datacenter-in-logs).

**Unconfirmed.** The expansions and abbreviations used for each edge (PZEN, PSEN, VSEN and others) are not in a captured source [gap:shared.terminology.service-edge-names:legacy-acronyms], and neither is the form of edge host names in logs [gap:shared.terminology.service-edge-names:edge-hostnames].

What to check:
1. When a log, ticket or runbook says ZEN or broker, read it as a Service Edge and keep the original term when quoting it.
2. Before reading PZEN as public or private, ask which product and form factor is meant; the abbreviation's expansion is unconfirmed.

Inferred, not quoted (say so when an answer rests on one):
- [shared.terminology.service-edge-names:zen-is-service-edge] Tier B: Generalizes from the names these sources use; no source defines ZEN.
- [shared.terminology.service-edge-names:broker-is-zpa-service-edge] Tier B: The sources use broker descriptively for the Private Service Edge; no source states that broker is a former product name or names the Public Service Edge a broker.

Not known (open gaps):
- Older names and abbreviations for each Service Edge [gap:shared.terminology.service-edge-names:legacy-acronyms]: settled by source-read. Blocks: translating an abbreviation in a ticket or runbook with certainty
- Form of Service Edge host names in logs [gap:shared.terminology.service-edge-names:edge-hostnames]: settled by tenant-data or source-read. Blocks: mapping a log value to a data center

Area: shared.terminology, its subjects in references/_meta/spine/shared/shared.terminology.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.multi-cluster.md (Multi-Cluster Load Sharing: several Public Service Edge clusters behind one VIP)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.terminology.md (Zscaler terminology: where each term is defined)
- see-also references/_meta/text/shared/shared.cloud-architecture.service-edges.md (Service Edges: the data plane, its form factors, and how traffic reaches one)
