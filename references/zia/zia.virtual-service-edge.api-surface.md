{{endpoints}} {{vzen-is-vse}} The "vZEN" in field and endpoint names is the Virtual Service Edge; ZPA's Service Edge Group API is a different product.

**Cluster.** {{cluster-model}} The product behavior behind these fields is in [[zia.virtual-service-edge.clusters]].

**Node.** {{node-model}} Platform rules behind the deployment mode are in [[zia.virtual-service-edge.platforms]]; the SKU wording is not reconciled with the single-size VM description ([[zia.virtual-service-edge.sizing:sku-type-vs-single-size]]).

**Deleting a cluster** is not a single request. The SDK first detaches all nodes with an update, and the detach may not reach the wire; that behavior is documented once, in [[zia.terraform.multi-step-writes]], and should not be re-derived here.

**No hardware equivalent.** These services cover the Virtual Service Edge. Whether the hardware Private Service Edge can be provisioned by API is not established: [[zia.private-service-edge.what-it-is:hardware-pse-api]].
