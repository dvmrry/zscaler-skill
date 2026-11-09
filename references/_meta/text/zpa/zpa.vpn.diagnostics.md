# VPN Connected Users and the VPN Diagnostics pages: user logs, traffic flow logs and access policy data (zpa.vpn.diagnostics)
Also called: vpn connected users; vpn user logs; vpn traffic flow logs; vpn access policy data; vpn diagnostics

The VPN Connected Users page shows a user's connection status to a VPN Service Edge, and displays the username, assigned client IP address, connected VPN Service Edge and the current VPN connection status. Username is the user's email address, Client IP Address is the address assigned to the client, Hostname is the client's hostname, and Connected Device State indicates whether the client device is connected or disconnected from the VPN Service Edge. [zpa.vpn.diagnostics:connected-users] The vpnConnectedUsers API read is in [Machine group list scoping and vpnConnectedUsers wire details](kb:zpa.api.machine-groups-wire).

**User logs.** The User Logs page of VPN Diagnostics shows the number of Total, Successful, Errors and Others transactions for users' VPN connections. [zpa.vpn.diagnostics:user-logs-counters] A user log entry has an Event Type (the type of VPN session event), a Connection End (blank if the VPN connection is ongoing), a Client Name (the client's email address), a Result (Success or Error) and a Client Tunnel IP. Its details include the Client Version (the Client Connector version), the Last Handshake (date and time of the last TCP handshake), the ZPA Service Edge, a Failure Reason, the VPN Service Edge IP and a Connection ID. [zpa.vpn.diagnostics:user-logs-fields]

**Traffic flow logs.** A traffic flow log entry has a Session State (Open or Closed), a Source and a Destination (IP address and port number) and a Protocol (TCP or UDP). Its details include the Access Policy triggered by the traffic, the Duration the connection was active, and the total bytes and packets received and sent. [zpa.vpn.diagnostics:traffic-flow-fields]

**Streamed VPN logs.** The User Status - VPN Service Edge and User Status - VPN Service Edge (IP Address Reservation) log types share a ConnectionID key field, which can be used to merge the user status logs produced by both, and which enables SIEM servers to link, correlate and integrate the data from both sources. [zpa.vpn.diagnostics:connection-id-merge] The streamed Traffic Flow VPN page's field table and example record differ on its time fields and session state [divergence:zpa.vpn.diagnostics:traffic-flow-vpn-example].

**Export.** The user logs and the traffic logs can each be viewed in JSON format or downloaded as a text file. [zpa.vpn.diagnostics:log-export]

**Access policy data.** On the Access Policy Data page the VPN Service Edge to view is selected, and the page shows the total bytes and packets allowed and blocked for users' VPN connections, including traffic that does not match any access policy rule and is blocked by default. Each rule shows Bytes and Packets, and the policy rule history drawer has Bytes and Packets charts for all the traffic that triggered the rule. [zpa.vpn.diagnostics:access-policy-data] The rules are in [VPN access policy rules: source, destination, default block, rule order and limits](kb:zpa.vpn.access-policy).

**Open.** The time ranges, retention and export limits of these pages are open [gap:zpa.vpn.diagnostics:ranges-retention], as are the values of some fields [gap:zpa.vpn.diagnostics:field-values] and whether these console fields are the streamed ones [gap:zpa.vpn.diagnostics:lss-relation].

The streamed log types are in [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types); the User Activity Diagnostics pages are in [ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export](kb:zpa.troubleshooting.diagnostics) and [What a ZPA User Activity entry shows in Diagnostics and Live Logs](kb:zpa.troubleshooting.user-activity-diagnostics); remote commands are in [VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors](kb:zpa.vpn.support-information); the hub is [ZPA VPN (for Legacy Apps): what it is, its components and where each question goes](kb:zpa.vpn).

Sources disagree (name both sides):
- On the Traffic Flow for VPN (For Legacy Apps) log fields page, the table gives FlowStartTime integer and float format specifiers and describes SessionState as open or closed, while the example record writes FlowStartTime as an ISO date string and SessionState as "close". [divergence:zpa.vpn.diagnostics:traffic-flow-vpn-example]
  - zscaler-help: Table: FlowStartTime takes the integer and float specifiers %[OPT]d, %[OPT]x, %[OPT]f and %[OPT]o, and SessionState is described as open or closed.
  - zscaler-help: Example record: FlowStartTime is an ISO date string and SessionState is "close".
  Impact: A consumer cannot tell from the article whether FlowStartTime is numeric or a date string, or whether SessionState takes open and closed or "close".

Not known (open gaps):
- Time ranges, retention and export limits of the VPN Diagnostics pages [gap:zpa.vpn.diagnostics:ranges-retention]: settled by source-read or tenant-data
- The values of Event Type, Failure Reason and the Others transaction class [gap:zpa.vpn.diagnostics:field-values]: settled by tenant-data or support-ticket
- Whether the console diagnostics fields are the streamed VPN log fields [gap:zpa.vpn.diagnostics:lss-relation]: settled by source-read or tenant-data

Area: zpa.vpn, its subjects in references/_meta/spine/zpa/zpa.vpn.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.api.machine-groups-wire.md (Machine group list scoping and vpnConnectedUsers wire details)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- links-to references/_meta/text/zpa/zpa.troubleshooting.diagnostics.md (ZPA Live Logs and Private Diagnostics: views, time ranges, retention, filters and export)
- links-to references/_meta/text/zpa/zpa.troubleshooting.user-activity-diagnostics.md (What a ZPA User Activity entry shows in Diagnostics and Live Logs)
- links-to references/_meta/text/zpa/zpa.vpn.md (ZPA VPN (for Legacy Apps): what it is, its components and where each question goes)
- links-to references/_meta/text/zpa/zpa.vpn.access-policy.md (VPN access policy rules: source, destination, default block, rule order and limits)
- links-to references/_meta/text/zpa/zpa.vpn.support-information.md (VPN Support Information: diagnostic sessions and commands on VPN Service Edges and Network Connectors)
