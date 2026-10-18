"Can I write a rule for IoT devices?" has three parts: how a rule selects IoT traffic, what the location must enable first, and what the predefined rules are for.

**Selecting IoT traffic.** {{iot-device-group}} {{iot-group-availability}} Firewall Filtering is the exception: {{firewall-has-no-iot-group}} So a rule for IoT devices in URL Filtering, Cloud App Control, SSL/TLS Inspection or Forwarding Control uses the IoT device group; the captured Firewall Filtering page offers no IoT choice, so scope by location or address. The single IoT choice may not distinguish device classes, which is an open question on this subject. Rule-field semantics for URL Filtering are in [[zia.url-filtering.criteria]].

**The location must enforce it.** {{enforce-iot-policy-control}} {{cac-iot-needs-enforce}} {{enforce-flag-is-console-option}} If a URL Filtering or Cloud App Control rule using the IoT device group never matches, check Enable IoT Discovery and Enforce IoT Policy Control on the device's location before changing the rule. The discovery switch itself is in [[zia.iot.discovery]].

**Selecting by location instead.** A location of type IoT traffic joins the predefined IoT Traffic Group, and rules can scope to that group: [[zia.locations.groups]], with the rule-side mechanics in [[zia.locations.rule-scoping]]. {{group-is-by-location}}

**Predefined rules.** Cloud App Control ships Allow Unauthenticated Traffic for IoT Classifications rules, disabled by default, so the engine can classify devices that other rules would block: [[zia.cloud-app-control.rule-types]]. SSL/TLS Inspection ships an Unauthorized Traffic Bypass for IoT Classifications rule: [[zia.ssl-inspection.rules]]. Why IoT devices usually cannot be inspected is in [[zia.ssl-inspection.uninspectable]].

**The Policy Status widget.** The captured help page does not define it, so a device shown with no policies is not proof that it is unprotected; see the open gaps on this subject.
