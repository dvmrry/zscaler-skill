Bandwidth Control decides how much of a location's internet bandwidth each traffic class gets. It is not an allow or block policy: a request is given full or reduced bandwidth, never refused by this module. "Why is my bandwidth rule not doing anything?" and "why is this app slow?" need six questions answered in order.

1. **Does the traffic reach Bandwidth Control at all?** It is the last step of the web module, after the firewall and every earlier web policy, and only certain TCP protocols are shaped: [[zia.bandwidth-control.pipeline-position]], [[zia.bandwidth-control.allocation]].
2. **Is the location in scope?** Only configured locations are shaped, the location must enforce Bandwidth Control and have upload and download limits, and sublocations can share or own a slice: [[zia.bandwidth-control.location-scope]].
3. **Which class is the traffic in?** Classes group URL categories, cloud applications and domains, plus the large-file, web conferencing and VoIP classes: [[zia.bandwidth-control.classes]].
4. **Which rule references that class, and where is it in the order?** Criteria, order, admin rank and disabled rules: [[zia.bandwidth-control.rules]]. Provider reorder and rank behavior is in [[zia.terraform.rule-order.registry]].
5. **What terms does the traffic get?** Minimum and maximum percentages are applied differently, and the minimum only matters under contention: [[zia.bandwidth-control.allocation]]. A class no rule references lands in the default rule: [[zia.bandwidth-control.default-rule]].
6. **Is a cap in the way?** Rule, class and domain limits: [[zia.bandwidth-control.limits]].

For API and Terraform work, field names, enums and provider resources are in [[zia.bandwidth-control.api-surface]]. Firewall Control is a different module that allows or blocks flows: see [[zia.firewall]].
