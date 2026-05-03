# Understanding Private Service Edge Status Log Fields

**Source:** https://help.zscaler.com/zpa/understanding-private-service-edge-status-log-fields
**Captured:** 2026-04-28 via Playwright MCP.

The Log Streaming Service (LSS) can send Private Service Edge for Private Access log information to any third-party log analytics tool. By default, the Private Service Edge Status log type includes the fields listed in the following table for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template.

## Field Table

| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimestamp | The timestamp when the log was generated | %[OPT]s, %[OPT]j, %[OPT]J |
| Customer | The customer name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| SessionID | The TLS session ID | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| SessionType | The type of session. The expected value for this field is ZPN_TUNNEL_CONTROL, which denotes the session from the Private Service Edge for Private Access towards the closest Public Service Edge for Private Access. | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| SessionStatus | The status of the session. Expected values: ZPN_STATUS_AUTHENTICATED (successfully authenticated), ZPN_STATUS_AUTH_FAILED (failed to authenticate), ZPN_STATUS_DISCONNECTED (disconnected from a Service Edge) | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PackageVersion | The Private Service Edge package version | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Platform | The host platform | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ZEN | The Public Service Edge that was selected for the connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ServiceEdge | The Service Edge name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ServiceEdgeGroup | The Service Edge group name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrivateIP | The private IP address of the Private Service Edge | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Latitude | The latitude coordinate of the Private Service Edge location | %[OPT]f, %[OPT]o |
| Longitude | The longitude coordinate of the Private Service Edge location | %[OPT]f, %[OPT]o |
| CountryCode | The country code | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| TimestampAuthentication | The timestamp in microseconds when the Private Service Edge was authenticated | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampUnAuthnetication | The timestamp in microseconds when the Private Service Edge was unauthenticated (note: field name has typo "Authnetication" in source) | %[OPT]s, %[OPT]j, %[OPT]J |
| CPUUtilization | The CPU utilization in % | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| MemUtilization | The memory utilization in % | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| InterfaceDefRoute | The name of the interface to default route | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| DefRouteGW | The IP address of the gateway to default route | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrimaryDNSResolver | The IP address of the primary DNS resolver | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| HostStartTime | The time in seconds at which host was started | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ServiceEdgeStartTime | The time in seconds at which the Private Service Edge was started | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| NumOfInterfaces | The number of interfaces on the Private Service Edge host | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| BytesRxInterface | The bytes received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| PacketsRxInterface | The packets received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ErrorsRxInterface | The errors received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| DiscardsRxInterface | The discards received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| BytesTxInterface | The bytes transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| PacketsTxInterface | The packets transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| DiscardsTxInterface | The discards transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ErrorsTxInterface | The errors transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalBytesRx | The total bytes received | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalBytesTx | The total bytes transmitted | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| MicroTenantID | The Microtenant ID of the Private Service Edge | %[OPT]s, %[OPT]j |
