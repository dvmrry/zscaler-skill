**One size.** {{single-vm-size}} {{throughput-listed-for-esxi-only}} So the 600 Mbps ceiling is documented for ESXi; the other platforms have no published figure, and a cloud sizing exercise should not borrow it. The SKU wording elsewhere is not reconciled with a single size ([[zia.virtual-service-edge.sizing:sku-type-vs-single-size]]).

**SSL inspection is what the card is for.** {{ssl-cps-without-card}} {{ssl-card-recommendation}} {{nitrox-card-esxi}} The card is therefore an ESXi answer; on the other platforms the lever is more instances.

**Resources.** {{vm-resources}} {{memory-48gb-standalone-and-cluster}} {{memory-64gb-large-files}}

**Scaling out.** {{cluster-aggregate-derived}} The cluster limits themselves are in [[zia.virtual-service-edge.clusters]]. Compare the hardware designs in [[zia.private-service-edge.sizing]] only for the order of magnitude; the two use different assumptions.
