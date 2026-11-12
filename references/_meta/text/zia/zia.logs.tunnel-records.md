# What a ZIA tunnel log record is: log types, tunnel status, event reasons and sample counters (zia.logs.tunnel-records)
Also called: tunnel log record; tunnel insights logs columns; tunnel event reason; ipsec phase 1 log; psk mismatch; dpd timeout; tunnel sample log

The tunnel Log Type is Sample (data activity through the tunnel, GRE and IPSec), IPSec Phase 1 or IPSec Phase 2 (negotiation details, IPSec only), or Tunnel Event (status changes or failure events, GRE and IPSec). [zia.logs.tunnel-records:log-types] The record fields are the generated type [ZIA tunnel log (NSS tunnel feed)](kb:zia/tunnel-log).

**Status and events.** Tunnel Status is IPSec tunnel is up, down or renegotiated, Phase 1 or Phase 2 is down, Error while establishing Phase 1 or Phase 2, or None, which means no change from the last known status. [zia.logs.tunnel-records:status-values] The Event Reason for a tunnel status change is Lifetime expired, PSK not found, PSK mismatch, Invalid proposal, DPD timeout, Timeout or Org excluded from DC. [zia.logs.tunnel-records:event-reasons] The values are listed without definitions [gap:zia.logs.tunnel-records:tunnel-event-meanings].

**Counters.** Received Bytes and Packets are what Zscaler received through the tunnel from the organization, and Sent Bytes and Packets what Zscaler sent through the tunnel to the organization, each a total over the one-minute sample interval. [zia.logs.tunnel-records:sample-counters]

**Negotiation.** Policy Direction gives the direction in which IPSec Phase 2 policies (allowed subnets, ports and protocols) are proposed: Inbound from the organization's IPSec gateway to Zscaler, Outbound from Zscaler to the organization's IPSec gateway. [zia.logs.tunnel-records:policy-direction] Tunnel Type is GRE, IPSec IKEv1 or IPSec IKEv2; Vendor ID lists Cisco, Juniper, strongSwan, Shrew Soft, Aruba, Check Point, QuickSec and SonicWall; Session ID is a cryptographically generated random number unique per tunnel; Tunnel Destination IP is the VPN or GRE VIP the tunnel goes to. [zia.logs.tunnel-records:tunnel-and-vendor] Whether Zscaler supports only ESP or also AH is described two ways: [zia.traffic-forwarding.ipsec:ipsec-protocol](kb:zia.traffic-forwarding.ipsec:ipsec-protocol).

**Keep-alive.** The Tunnel Insights Logs article describes Keep-Alive Packets as keeping the SSL VPN connection open while the device is inactive. [zia.logs.tunnel-records:keepalive-column] The NSS description of the matching field differs [divergence:zia.logs.tunnel-records:keepalive-meaning].

**Filters.** The Tunnel Insights Logs Location Type filter lists Corporate User Traffic Group, Guest Wifi Group, IoT Traffic Group, Server Traffic Group and Unassigned Locations, and the Tunnel Destination IP filter follows on the page. [zia.logs.tunnel-records:tunnel-location-type-filter] That list omits one group that the other families list [gap:zia.logs.tunnel-records:tunnel-location-type]. Filters are in [Tunnel Insights charts are filtered by Location (default All), Location Group (default None), Tunnel Destination IP, Tunnel Source IP, Tunnel Type (All, GRE or IPSec) and VPN Credential (default All).](kb:zia.insights.data-types:tunnel-data-types); the configuration of the tunnels is in [IPSec tunnels to ZIA: limits, IKE and device settings](kb:zia.traffic-forwarding.ipsec) and [GRE tunnels to ZIA: requirements, bandwidth and deployment](kb:zia.traffic-forwarding.gre).

What to check:
1. Which Log Type a tunnel record is before reading its status, since IPSec Phase 1 and Phase 2 records apply to IPSec only.
2. Whether the keep-alive column is read as an SSL VPN keep-alive or as DPD packets received, which the two pages disagree on.
3. Whether an event reason has a documented meaning, since the values are listed without definitions.

Sources disagree (name both sides):
- The Tunnel Insights Logs article describes Keep-Alive Packets as an SSL VPN keep-alive, while the NSS tunnel output format describes the matching field as DPD packets received in a 60-second window. [divergence:zia.logs.tunnel-records:keepalive-meaning]
  - zscaler-help: The Keep-Alive packet keeps the SSL VPN connection open when the device is inactive.
  - zscaler-help: dpdrec is the number of DPD packets received in a 60-second sample window, for IPSec tunnels only and empty for GRE.
  Impact: The two descriptions give different meanings and scopes (SSL VPN against IPSec-only DPD); the pages do not say whether the console column and the NSS field are the same counter.

Not known (open gaps):
- What the tunnel Event Reason values mean and which Tunnel Status values a GRE tunnel can have [gap:zia.logs.tunnel-records:tunnel-event-meanings]: settled by lab-test or support-ticket
- Whether workload locations' tunnels are filterable by Location Type [gap:zia.logs.tunnel-records:tunnel-location-type]: settled by lab-test or support-ticket

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.traffic-forwarding.ipsec.md (IPSec tunnels to ZIA: limits, IKE and device settings)
- links-to references/_meta/text/zia/zia.insights.data-types.md (ZIA Insights chart settings: units, chart types, top-N, filters, history and the data types that appear only on an Insights page)
- links-to references/_meta/text/zia/zia.traffic-forwarding.gre.md (GRE tunnels to ZIA: requirements, bandwidth and deployment)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.insights.md (ZIA Insights: the Admin Console's traffic charts, log viewer and dashboards)
- see-also references/_meta/text/zia/zia.insights.logs.md (ZIA Insights Logs: log families, time frame, export and background queries, filters and console-only columns)
- see-also references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- see-also references/_meta/text/cloud-connector/cloud-connector.insights.analytics.md (Cloud Connector Insights pages and Insights logs: time range, aggregation and limits)
