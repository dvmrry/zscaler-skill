# The vZEN API: Virtual Service Edge clusters and nodes (zia.virtual-service-edge.api-surface)
Also called: virtualZenClusters; virtualZenNodes; vzen api; vzen_clusters; vzen_nodes; vse api; zia_vzen_cluster terraform; vse deploymentMode

The Go SDK manages Virtual Service Edge clusters at /zia/api/v1/virtualZenClusters and Virtual Service Edge nodes at /zia/api/v1/virtualZenNodes. [zia.virtual-service-edge.api-surface:endpoints] The SDK's vZEN types are the Virtual Service Edge: the cluster type documents itself as the Virtual Service Edge cluster, and the node type as the Virtual Service Edge. [zia.virtual-service-edge.api-surface:vzen-is-vse] The "vZEN" in field and endpoint names is the Virtual Service Edge; ZPA's Service Edge Group API is a different product.

**Cluster.** The cluster model carries a status (ENABLED, DISABLED, DISABLED_BY_SERVICE_PROVIDER or NOT_PROVISIONED_IN_SERVICE_PROVIDER), the cluster IP, subnet mask and default gateway, an ipSecEnabled flag, and a virtualZenNodes member list that the SDK documents as needing at least two instances. [zia.virtual-service-edge.api-surface:cluster-model] The product behavior behind these fields is in [The Virtual Service Edge cluster: limits, object, build order and Location binding](kb:zia.virtual-service-edge.clusters).

**Node.** The node model carries a deploymentMode of STANDALONE or CLUSTER (CLUSTER only on VMware ESXi), a loadBalancerIpAddress that applies only when the deployment mode is CLUSTER, an inProduction flag, a status that can also be IN_TRIAL, and a vzenSkuType of SMALL, MEDIUM or LARGE. [zia.virtual-service-edge.api-surface:node-model] The Terraform documentation both limits the load balancer IP to cluster mode and shows it on a standalone node [divergence:zia.virtual-service-edge.api-surface:tf-lb-ip-doc-example-standalone]. Platform rules behind the deployment mode are in [Where a Virtual Service Edge runs and which platforms can cluster](kb:zia.virtual-service-edge.platforms); the SKU wording is not reconciled with the single-size VM description ([Virtual Service Edge SKU types versus a single-sized VM](kb:zia.virtual-service-edge.sizing:sku-type-vs-single-size)).

**Deleting a cluster** is not a single request: the SDK first detaches all nodes with an update, and the detach may not reach the wire, as [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes) documents.

**Hardware equivalent.** Whether the hardware Private Service Edge can be provisioned by API is not established: [Whether any API provisions hardware PSE 3 / PSE 5](kb:zia.private-service-edge.what-it-is:hardware-pse-api).

Sources disagree (name both sides):
- Whether `load_balancer_ip_address` is meaningful on a STANDALONE Virtual Service Edge node in Terraform. [divergence:zia.virtual-service-edge.api-surface:tf-lb-ip-doc-example-standalone]
  - tf-zia: The argument documentation says the load balancer IP applies only when the deployment mode is CLUSTER.
  - tf-zia: The first example sets load_balancer_ip_address together with deployment_mode STANDALONE.
  Impact: The provider schema marks the attribute optional and the example sets it for a standalone node, so the provider does not reject the combination. Do not read a set load balancer IP on a standalone node as proof the platform uses it.

Area: zia.virtual-service-edge, its subjects in references/_meta/spine/zia/zia.virtual-service-edge.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.virtual-service-edge.clusters.md (The Virtual Service Edge cluster: limits, object, build order and Location binding), from zia.virtual-service-edge: For production, a Virtual Service Edge is deployed in a cluster. A cluster requires at least two Virtual Service Edges for active-active redundancy and load balancing, which provides N+1 redundancy for production. [zia.virtual-service-edge.clusters:production-needs-cluster]
- depends-on references/_meta/text/zia/zia.virtual-service-edge.platforms.md (Where a Virtual Service Edge runs and which platforms can cluster), from zia.virtual-service-edge: Virtual Service Edges are supported on VMware ESX/ESXi, Microsoft Azure, AWS EC2, Microsoft Hyper-V and Google Cloud Platform. [zia.virtual-service-edge.platforms:supported-platforms]
- interacts-with references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side), from zia.virtual-service-edge: The Source IP Anchoring feature is not supported with Virtual Service Edges. [zia.virtual-service-edge.limits:no-sipa]
- scoped-by references/_meta/text/zia/zia.locations.model.md (What a ZIA location is and what the console enforces for it), from zia.virtual-service-edge: A Virtual Service Edge cluster, or a standalone Virtual Service Edge, is bound to a Location so the organization can enable authentication, firewall, SSL/TLS inspection and location-level policies; the service associates the traffic the Virtual Service Edge receives with that Location and applies its policies. [zia.virtual-service-edge.clusters:bind-to-location]
- links-to references/_meta/text/zia/zia.private-service-edge.what-it-is.md (What a ZIA Private Service Edge is, who runs it, and what it is not)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
- links-to references/_meta/text/zia/zia.virtual-service-edge.sizing.md (How much a Virtual Service Edge VM can do)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/vzen-clusters.md (config type)
- configured-via references/_meta/text/types/zia/vzen-nodes.md (config type)
- see-also references/_meta/text/zia/zia.virtual-service-edge.md (ZIA Virtual Service Edge)
