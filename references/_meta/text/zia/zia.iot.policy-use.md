# How IoT traffic is targeted by policy (zia.iot.policy-use)
Also called: iot device group; enforce iot policy control; iot policy status; iot traffic group; block iot devices; iot firewall rule; iot url filtering; iot_enforce_policy_set
Former IDs: zia.iot.policy-use:enforce-iot-policy-control

"Can I write a rule for IoT devices?" has three parts: how a rule selects IoT traffic, what the location must enable first, and what the predefined rules are for.

**Selecting IoT traffic.** The Device Groups criterion has an IoT choice that applies a rule to IoT traffic, alongside Cloud Browser Isolation and No Client Connector. It appears in URL Filtering, Cloud App Control, SSL/TLS Inspection and Forwarding Control rules. [zia.iot.policy-use:iot-device-group] The IoT device group is available only if IoT discovery is enabled for the organization. [zia.iot.policy-use:iot-group-availability] Firewall Filtering is the exception: The Firewall Filtering Device Groups criterion lists only Cloud Browser Isolation and No Client Connector as special choices; no IoT choice is documented there. [zia.iot.policy-use:firewall-has-no-iot-group] Whether the single IoT choice distinguishes device classes is open [gap:zia.iot.policy-use:iot-device-group-granularity]. Rule-field semantics for URL Filtering are in [How URL Filtering rule criteria combine](kb:zia.url-filtering.criteria).

**The location must enforce it.** Cloud App Control rules apply to IoT devices from a location or sublocation that has Enforce IoT Policy Control enabled, to devices the AI/ML engine identified and classified (for example printers, sensors) under the IoT group in the Device Groups criterion. [zia.iot.policy-use:cac-iot-needs-enforce] URL Filtering rules can also be applied to IoT devices from a location or a sublocation that has the Enforce IoT Policy Control option enabled, to IoT devices identified and classified (for example printers, sensors) by the Zscaler AI/ML under the IoT group in the Device Groups criterion. [zia.iot.policy-use:url-filtering-iot-needs-enforce] The `iotEnforcePolicySet` location field (Terraform `iot_enforce_policy_set`) is the API form of the Enforce IoT Policy Control option. [zia.iot.policy-use:enforce-flag-is-console-option] Whether the option depends on Enable IoT Discovery is open [gap:zia.iot.policy-use:enforce-option-scope]. The discovery switch itself is in [What the IoT Report discovers, and what it takes to get data](kb:zia.iot.discovery).

**Selecting by location instead.** A location of type IoT traffic joins the predefined IoT Traffic Group, and rules can scope to that group: [Location groups: manual and dynamic, conditions, limits, predefined groups](kb:zia.locations.groups), with the rule-side mechanics in [Which policies scope by location and location group](kb:zia.locations.rule-scoping). Targeting IoT traffic through the IoT Traffic Group selects by the location's type, so it covers every device at that location, not only IoT-classified ones. [zia.iot.policy-use:group-is-by-location]

**Predefined rules.** Cloud App Control ships Allow Unauthenticated Traffic for IoT Classifications rules, disabled by default, so the engine can classify devices that other rules would block: [Cloud App Control categories (rule types), limits and predefined rules](kb:zia.cloud-app-control.rule-types). URL Filtering has a predefined Allow Unauthenticated Traffic for IoT Classifications rule that can be enabled to temporarily allow unauthenticated traffic that could be blocked by other rules, so that the Zscaler AI/ML can classify devices. The rule is disabled by default and cannot be deleted, and only its Rule Order, Rule Status, Rule Label and Description can be modified. [zia.iot.policy-use:url-filtering-iot-predefined-rule] SSL/TLS Inspection ships an Unauthorized Traffic Bypass for IoT Classifications rule: [SSL/TLS inspection rule order, predefined and default rules, limits](kb:zia.ssl-inspection.rules). Why IoT devices usually cannot be inspected is in [What SSL/TLS inspection cannot inspect: pinned apps, client certs, QUIC, BYOD, IoT](kb:zia.ssl-inspection.uninspectable).

**The Policy Status widget.** Currently only URL Filtering policy status and statistics data is available in the IoT Report; the default policy None (default) is a URL Filtering policy and not an IoT-specific policy, so it is not counted as an IoT policy. The Policy Status filter (All, No Policies or Applied) is only applicable for IoT devices, not servers or unmanaged user devices. [zia.iot.policy-use:policy-status-url-filtering-only] What counts as applied was open [gap:zia.iot.policy-use:policy-status-widget].

What to check:
1. Whether Enable IoT Discovery and Enforce IoT Policy Control are on at the device's location, when a URL Filtering or Cloud App Control rule using the IoT device group never matches.

Inferred, not quoted (say so when an answer rests on one):
- [zia.iot.policy-use:enforce-flag-is-console-option] Tier B: Matched by name only: the field is separate from iotDiscoveryEnabled, and no source states the mapping; the Terraform and Go descriptions of the field are empty. Confirm by toggling the console option and reading the location back.
- [zia.iot.policy-use:firewall-has-no-iot-group] Tier B: Rests on the absence of an IoT choice in the captured Firewall Filtering help page; a newer console could add one.
- [zia.iot.policy-use:group-is-by-location] Tier B: Derived: the predefined group is filled in from the location type selection, and nothing ties its membership to device classification.

Not known (open gaps):
- Whether a rule can target a specific IoT classification, or only IoT traffic as a whole [gap:zia.iot.policy-use:iot-device-group-granularity]: settled by lab-test or support-ticket. Blocks: any answer that a rule matches only cameras, printers or another single IoT class
- What counts as an IoT policy applied in the Policy Status widget [gap:zia.iot.policy-use:policy-status-widget]: settled by lab-test or tenant-data. Blocks: reading the devices-with-no-policies count as a security finding
- IoT targeting in DNS Control, DLP and Bandwidth Control [gap:zia.iot.policy-use:other-rule-types-iot]: settled by source-read or lab-test
- Whether Enforce IoT Policy Control depends on Enable IoT Discovery [gap:zia.iot.policy-use:enforce-option-scope]: settled by source-read or lab-test. Blocks: diagnosing a URL Filtering rule on the IoT device group that never matches

Area: zia.iot, its subjects in references/_meta/spine/zia/zia.iot.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.rule-types.md (Cloud App Control categories (rule types), limits and predefined rules): Cloud App Control rules apply to IoT devices from a location or sublocation that has Enforce IoT Policy Control enabled, to devices the AI/ML engine identified and classified (for example printers, sensors) under the IoT group in the Device Groups criterion. [zia.iot.policy-use:cac-iot-needs-enforce]
- depends-on references/_meta/text/zia/zia.iot.discovery.md (What the IoT Report discovers, and what it takes to get data): The IoT device group is available only if IoT discovery is enabled for the organization. [zia.iot.policy-use:iot-group-availability]
- scoped-by references/_meta/text/zia/zia.locations.groups.md (Location groups: manual and dynamic, conditions, limits, predefined groups): Targeting IoT traffic through the IoT Traffic Group selects by the location's type, so it covers every device at that location, not only IoT-classified ones. [zia.iot.policy-use:group-is-by-location]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.rules.md (SSL/TLS inspection rule order, predefined and default rules, limits): The Device Groups criterion has an IoT choice that applies a rule to IoT traffic, alongside Cloud Browser Isolation and No Client Connector. It appears in URL Filtering, Cloud App Control, SSL/TLS Inspection and Forwarding Control rules. [zia.iot.policy-use:iot-device-group]
- interacts-with references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine): The Device Groups criterion has an IoT choice that applies a rule to IoT traffic, alongside Cloud Browser Isolation and No Client Connector. It appears in URL Filtering, Cloud App Control, SSL/TLS Inspection and Forwarding Control rules. [zia.iot.policy-use:iot-device-group]
- links-to references/_meta/text/zia/zia.locations.rule-scoping.md (Which policies scope by location and location group)
- links-to references/_meta/text/zia/zia.ssl-inspection.uninspectable.md (What SSL/TLS inspection cannot inspect: pinned apps, client certs, QUIC, BYOD, IoT)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/locations.md (config type)
- configured-via references/_meta/text/types/zia/url-filtering-rules.md (config type)
- configured-via references/_meta/text/types/zia/cloud-app-control.md (config type)
- configured-via references/_meta/text/types/zia/ssl-inspection-rules.md (config type)
- configured-via references/_meta/text/types/zia/forwarding-rules.md (config type)
