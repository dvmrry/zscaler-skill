{{same-service-as-public}} So a PSE is not a different product with different features: the inspection stack and the control-plane connections are the Public Service Edge's, moved onto the customer's premises. {{dedicated-managed-by-zscaler}} {{zscaler-may-change-it}} "Ours, in our data center" therefore does not mean "ours to schedule": Zscaler provisions, maintains and changes it, and the customer's job is the network around it (see [[zia.private-service-edge.ip-requirements]] and [[zia.private-service-edge.deployment]]).

{{hardware-and-virtual}} The software form factor is customer-operated and has its own cluster rules, covered in [[zia.virtual-service-edge]]; the two should not be mixed in one sizing exercise. The hardware designs and their limits are in [[zia.private-service-edge.sizing]].

Some legacy comparison rows (Public Service Edge throughput and routing labels) have no source ([[zia.private-service-edge.what-it-is:unverified-comparison-rows]]).

Monitoring: {{health-dashboard-needs-zdx}} What a tenant without ZDX gets instead is not documented ([[zia.private-service-edge.what-it-is:no-zdx-monitoring]]).

**The name collides with ZPA.** {{zpa-pse-is-different}} {{binds-through-location-not-group}} If an answer mentions a group or a provisioning key for a ZIA PSE, it has crossed into ZPA. The ZIA binding is the Location, and it carries a hazard: [[zia.private-service-edge.location-binding]].

Provisioning by API is not established either way ([[zia.private-service-edge.what-it-is:hardware-pse-api]]); do not tell anyone a hardware PSE can or cannot be provisioned through the API.
