**What it is.** {{full-featured-dedicated}} {{approval-and-licence}} {{reasons-to-deploy}} Those are the same reasons the hardware form factor lists ([[zia.private-service-edge.when-to-deploy]]); the choice between them is operating model and ceiling, not feature set. The per-VM ceiling is in [[zia.virtual-service-edge.sizing]].

**Where it runs.** {{supported-platforms}} {{image-downloads}} Nutanix has a VM image but nothing else is established for it ([[zia.virtual-service-edge.platforms:nutanix-support-scope]]). {{os-24-or-later}} {{vmotion-esxi-7}}

**Which platforms can cluster.** {{cluster-mode-selectable-on-esxi}} {{public-cloud-no-native-cluster}} Hyper-V is where the documentation disagrees with itself ([[zia.virtual-service-edge.platforms:hyper-v-cluster-mode]]); treat ESXi as the only platform with an unambiguous native cluster. The cluster mechanics for that case are [[zia.virtual-service-edge.clusters]] and [[zia.virtual-service-edge.load-balancing]].

One more disagreement to know about: the minimum ESXi version differs between the specifications table and the cluster configuration article ([[zia.virtual-service-edge.platforms:esxi-minimum-version]]).
