Sizing is an arithmetic exercise with one assumption and two hard rules.

**The assumption.** {{upload-assumption}} {{size-both-directions}}

**The designs.** {{design-pse3}} {{design-pse5}} {{design-pse5-dedicated}} Their per-cluster limits: {{node-counts}} {{cluster-totals}} {{upload-caps}}

**Worked answers.** {{worked-examples}} {{always-quoted-n-plus-one}} {{pse5-above-1gbps}} Whether the PSE 3 limit and the PSE 5 recommendation above 1 Gbps of download reconcile is open {{gap:pse3-above-1gbps-tension}}.

**The hard rule.** {{over-5gbps-needs-dedicated-and-review}} The address and port budget per design is in [[zia.private-service-edge.ip-requirements]].

Design behavior (why a minimum of two nodes, how the LB pair works) is in [[zia.private-service-edge.cluster-architecture]]. Whether to deploy a PSE at all is [[zia.private-service-edge.when-to-deploy]].
