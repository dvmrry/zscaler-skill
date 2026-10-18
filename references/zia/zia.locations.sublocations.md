{{what-it-is}} {{what-it-is-for}}

**Auto-created `other`.** {{other-auto-created}} {{other-takes-parent-rules}} {{other-is-a-policy-gap}} Before tightening rules on a location's sublocations, list the rules that reach `other` and `other6` too. How the default rule catches traffic no rule matches is in [[zia.url-filtering.rule-order]].

**Names and limits.** {{cap-2000}} {{name-in-use-error}}

**Finding and changing sublocations.** {{separate-list-endpoint}} {{parent-id-writable}} The Go SDK lookups that wrongly report a sublocation as missing are in [[zia.sdk-go.service-defects]], and the Terraform data source gaps are in [[zia.terraform.data-source-fidelity]]. Delete order, reparenting and depth are open questions (see the gaps below).

Which IPs a sublocation matches: [[zia.locations.ip-scoping]]. Which settings it owns: [[zia.locations.inheritance]]. Bandwidth: [[zia.locations.bandwidth]]. Group membership, including the Workload default: [[zia.locations.group-assignment]]. API, SDK and Terraform shapes: [[zia.locations.automation]].
