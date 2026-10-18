Sizing is an arithmetic exercise with one assumption and two hard rules.

**The assumption.** {{upload-assumption}} {{size-both-directions}} Size on total throughput, not download alone: 1.8 Gbps of download is really 2.34 Gbps once the assumed upload is added.

**The designs.** {{design-pse3}} {{design-pse5}} {{design-pse5-dedicated}} Their per-cluster limits: {{node-counts}} {{cluster-totals}} {{upload-caps}} So the headline "up to 24 Gbps" is an upload figure for four LB instances, not a total-throughput ceiling.

**Worked answers.** {{worked-examples}} {{always-quoted-n-plus-one}} {{pse5-above-1gbps}} The Private Service Edge 3 cluster handles up to 1.2 Gbps of download but the page still recommends Private Service Edge 5 above 1 Gbps; the page does not reconcile the two ([[zia.private-service-edge.sizing:pse3-above-1gbps-tension]]).

**The hard rule.** {{over-5gbps-needs-dedicated-and-review}} This is a design review, and it changes the address and port budget: see [[zia.private-service-edge.ip-requirements]].

Design behavior (why a minimum of two nodes, how the LB pair works) is in [[zia.private-service-edge.cluster-architecture]]. Whether to deploy a PSE at all is [[zia.private-service-edge.when-to-deploy]].
