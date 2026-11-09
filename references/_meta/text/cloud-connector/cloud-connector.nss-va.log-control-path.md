# Log and Control Forwarding and NSS: the two legs that carry connector logs (cloud-connector.nss-va.log-control-path)
Also called: log and control forwarding nss; cloud connector logs missing in siem; log and control gateway logs; connector log upload path; log and control forwarding first match

Connector logs pass two separately configured legs before they reach a SIEM. This subject separates them.

**First leg, connector to Zscaler cloud.** The Log and Control Forwarding policy controls how a connector's traffic logs and operational messages are forwarded to the Zscaler cloud, covering enrollment, policy changes, software updates and sending logs. [cloud-connector.nss-va.log-control-path:lc-scope] Each rule's scope (locations or Cloud & Branch Connector groups) and its Log and Control Gateway are in [A rule's name is at most 31 characters; its source is all locations or up to 8, or all or specific Cloud & Branch Connector groups; its action is a Log and Control Gateway; its description is at most 10,240 characters.](kb:cloud-connector.forwarding.log-and-control:rule-fields); the rule model is in [Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud](kb:cloud-connector.forwarding.log-and-control).

**Second leg, Nanolog to SIEM.** A connector log reaches a SIEM over two legs: the connector forwards it to the Zscaler cloud under the Log and Control Forwarding policy, and an NSS VM streams it from the Nanolog to the SIEM. A Log and Control Forwarding rule configures only the first leg; the NSS VM authenticates with its own certificate and is configured by NSS servers and feeds. [cloud-connector.nss-va.log-control-path:two-legs] The NSS side is in [NSS servers for Cloud & Branch Connector: certificate, buffering and sizing](kb:cloud-connector.nss-va.servers) and [NSS feeds for Cloud & Branch Connector: limits, output and SIEM destination](kb:cloud-connector.nss-va.feeds).

**When the first leg breaks.** What a connector does with its logs when its Log and Control Gateway is unreachable, and what the console then shows, is open [gap:cloud-connector.nss-va.log-control-path:log-upload-starvation]. Rules are evaluated in ascending order, [Log and Control rules are evaluated in ascending numerical order; a disabled rule is skipped but keeps its place.](kb:cloud-connector.forwarding.log-and-control:rule-order), with a default rule created automatically, [A default Log and Control Forwarding rule with a default gateway action is created automatically, and it cannot be duplicated or deleted.](kb:cloud-connector.forwarding.log-and-control:default-rule); whether evaluation stops at the first matching rule is open [gap:cloud-connector.nss-va.log-control-path:rule-first-match].

What to check:
1. Which Log and Control Forwarding rule covers the connector's location or group, and whether its gateway is reachable from the connector.
2. Whether the records are missing in the console's Insights logs too, which places the break on the first leg rather than the NSS leg.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.nss-va.log-control-path:two-legs] Tier B: Chain of evidence: the Log and Control Forwarding articles scope the policy to traffic the connector sends to the Zscaler cloud, and the NSS articles describe a VM that streams from the Nanolog after authenticating with a server certificate. No source describes the two together.

Not known (open gaps):
- What happens to connector logs when the Log and Control Gateway is unreachable [gap:cloud-connector.nss-va.log-control-path:log-upload-starvation]: settled by lab-test or source-read. Blocks: telling a broken first leg from a broken NSS leg when the SIEM and Insights stop receiving records
- Whether Log and Control Forwarding evaluation stops at the first matching rule [gap:cloud-connector.nss-va.log-control-path:rule-first-match]: settled by source-read or lab-test. Blocks: deciding which Log and Control Forwarding rule, and so which gateway, applies to a connector covered by several rules

Area: cloud-connector.nss-va, its subjects in references/_meta/spine/cloud-connector/cloud-connector.nss-va.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/cloud-connector/cloud-connector.forwarding.log-and-control.md (Log and Control Forwarding: how a Connector's logs and control traffic reach the Zscaler cloud): The Log and Control Forwarding policy controls how a connector's traffic logs and operational messages are forwarded to the Zscaler cloud, covering enrollment, policy changes, software updates and sending logs. [cloud-connector.nss-va.log-control-path:lc-scope]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.feeds.md (NSS feeds for Cloud & Branch Connector: limits, output and SIEM destination), from cloud-connector.nss-va: Both Cloud Connector and Branch Connector can generate Session, DNS, Event and Metrics logs, and an NSS feed specifies which log data the NSS sends to the SIEM. [cloud-connector.nss-va:log-types]
- depends-on references/_meta/text/cloud-connector/cloud-connector.nss-va.servers.md (NSS servers for Cloud & Branch Connector: certificate, buffering and sizing), from cloud-connector.nss-va: For Cloud & Branch Connector, NSS uses a VM to stream traffic logs in real time from the Zscaler Nanolog to a SIEM, and an NSS server is the representation of that VM in the Admin Console. [cloud-connector.nss-va:what-nss-is]
