# How the Log Streaming Service reaches a SIEM (zpa.log-receivers.architecture)
Also called: how does lss work; lss app connector log forwarding; lss vs nss; log receiver reachable; lss data flow

LSS forwards ZPA logs through an App Connector, so the path, the order of deployment and the reach of the receiver follow from that.

**Components.** LSS lets an organization create log receivers that receive information about App Connectors and users in Private Access; the help lists forwarding diagnostics and status logs to a SIEM and storing logs longer than the cloud retention period among its benefits. [zpa.log-receivers.architecture:purpose] LSS is deployed using two components, a log receiver and an App Connector: LSS resides in the Zero Trust Exchange and starts a log stream through a Public Service Edge, and the App Connector in the company's environment receives the stream and forwards it to the log receiver. [zpa.log-receivers.architecture:two-components] A receiver is addressed by a domain name or IP address and a TCP port, the port on which the log receiver listens for incoming log streams. [zpa.log-receivers.architecture:tcp-port] LSS captures log data about App Connectors and users in Private Access, while the Nanolog Streaming Service resides in Internet & SaaS (ZIA) and streams traffic logs from the Zscaler Nanolog to a SIEM. [zpa.log-receivers.architecture:not-nss] Zscaler supports third-party SIEM integrations for LSS and points to its Private Access and Splunk Deployment Guide and Zscaler and Splunk Deployment Guide. [zpa.log-receivers.architecture:third-party-siem]

**Before configuring.** App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first] Because the App Connector forwards the stream to the receiver, the receiver's address and port must be reachable from the App Connector's network. [zpa.log-receivers.architecture:receiver-reachable-from-connector]

**Which connector group carries the stream.** Logs go to the App Connector group that is geographically closest to the LSS instance, and transmission switches to App Connectors in another location when the connectors of the previously selected group are unavailable. [zpa.log-receivers.architecture:closest-group] If each App Connector group points to a different log receiver and is configured for the exact same LSS, the same log is sent to an App Connector in each group. [zpa.log-receivers.architecture:duplicate-per-group]

**Receiver address and application segments.** When a log receiver is created, the service also creates an internal application segment with the receiver's FQDN or IP address, and if that address overlaps an application segment, the segment's Bypass setting takes precedence, so a bypassed address on a trusted network is unreachable from the user's device. [zpa.log-receivers.architecture:internal-segment]

**Log Connector groups.** The Log Connector Groups page is under Data Explorer > Log Streaming > Private Log Streaming > Log Connector Groups. Each Log Connector is mapped to one Log Connector group, a log type is then mapped to one or multiple Log Connector groups for log forwarding, and the Log Connector must be up and running for the group to be active. [zpa.log-receivers.architecture:log-connector-groups] A Log Connector group's details include its Location, the Enrollment Certificate its Log Connectors use for enrollment, a DNS Resolution Option, Disaster Recovery, Disable AppProtection and Privileged Remote Access flags, a Version Profile for the Log Connector build, the next periodic software update, Network Settings (network parameters such as DNS, routing, proxy servers and time services), and the numbers of enrolled App Connectors and provisioning keys associated with the group. [zpa.log-receivers.architecture:log-connector-group-details] How a Log Connector relates to an App Connector, and whether receivers use Log Connector groups or the App Connector groups above, is open [gap:zpa.log-receivers.architecture:log-connector].

**Business Continuity Event log.** The field table and example record of the Business Continuity Event log disagree, a divergence recorded in [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types).

Capacity of a receiver and reaching an internet-exposed SIEM are not sourced [gap:zpa.log-receivers.architecture:capacity-limits] [gap:zpa.log-receivers.architecture:internet-exposed-receiver].

What to check:
1. That the App Connector group named on the receiver exists and has deployed, connected connectors.
2. That the SIEM address and port are reachable from the network the App Connector sits in, not from the internet or the cloud.
3. Whether the receiver's address overlaps an application segment whose Bypass setting changes what a user device can reach.
4. Whether more than one connector group points at the same stream, which sends the log once per group.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.architecture:receiver-reachable-from-connector] Tier B: Inference from the documented path (cloud to connector to receiver); the help does not state a reachability requirement in these words.

Not known (open gaps):
- What a Log Connector is and how its groups relate to App Connector groups [gap:zpa.log-receivers.architecture:log-connector]: settled by source-read or support-ticket
- A receiver exposed to the internet and Splunk transports [gap:zpa.log-receivers.architecture:internet-exposed-receiver]: settled by lab-test or support-ticket
- Receiver throughput and capacity [gap:zpa.log-receivers.architecture:capacity-limits]: settled by support-ticket or lab-test

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors): Because the App Connector forwards the stream to the receiver, the receiver's address and port must be reachable from the App Connector's network. [zpa.log-receivers.architecture:receiver-reachable-from-connector]
- depends-on references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups): Logs go to the App Connector group that is geographically closest to the LSS instance, and transmission switches to App Connectors in another location when the connectors of the previously selected group are unavailable. [zpa.log-receivers.architecture:closest-group]
- interacts-with references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks): When a log receiver is created, the service also creates an internal application segment with the receiver's FQDN or IP address, and if that address overlaps an application segment, the segment's Bypass setting takes precedence, so a bypassed address on a trusted network is unreachable from the user's device. [zpa.log-receivers.architecture:internal-segment]
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
