# Understanding Private Cloud Controller Status Log Fields

Source: https://help.zscaler.com/zpa/understanding-private-cloud-controller-status-log-fields
Fetched: 2026-04-28

The Log Streaming Service (LSS) can send Private Cloud Controller Status log information to any third-party log analytics tool. By default, the Private Cloud Controller Status log type includes the fields listed in the following table for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template. The supported log field format specification must be included (i.e., %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o).

## Field Table

| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimestamp | The timestamp when the log was generated | %[OPT]s, %[OPT]j, %[OPT]J |
| Customer | The customer name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| SessionID | The TLS session ID | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| SessionType | The type of session. The expected value for this field is ZPN_TUNNEL_CONTROL, which denotes the session from the Private Cloud Controller towards the closest Public Service Edge for Private Access. | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| SessionStatus | The status of the session. Expected values: ZPN_STATUS_AUTHENTICATED (successfully authenticated), ZPN_STATUS_AUTH_FAILED (failed to authenticate), ZPN_STATUS_DISCONNECTED (disconnected from a Service Edge) | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Version | The Private Cloud Controller package version | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PackageVersion | The package version | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Platform | The host platform | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ZEN | The Public Service Edge that was selected for the connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrivateCloudController | The Private Cloud Controller name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrivateCloudControllerGroup | The Private Cloud Controller group name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrivateIP | The private IP address of the Private Cloud Controller | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PublicIP | The public IP address of the Private Cloud Controller | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Latitude | The latitude coordinate of the Private Cloud Controller location | %[OPT]f, %[OPT]o |
| Longitude | The longitude coordinate of the Private Cloud Controller location | %[OPT]f, %[OPT]o |
| CountryCode | The country code | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| TimestampAuthentication | The timestamp in microseconds when the Private Cloud Controller was authenticated | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampUnAuthentication | The timestamp in microseconds when the Private Cloud Controller was unauthenticated | %[OPT]s, %[OPT]j, %[OPT]J |
| CPUUtilization | The CPU utilization in % | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| MemUtilization | The memory utilization in % | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| InterfaceDefRoute | The name of the interface to default route | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| DefRouteGW | The IP address of the gateway to default route | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrimaryDNSResolver | The IP address of the primary DNS resolver | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| HostUpTime | The time in seconds at which host was started | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| PrivateCloudControllerStartTime | The time in seconds at which the Private Cloud Controller was started | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| NumOfInterfaces | The number of interfaces on the Private Cloud Controller host | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| BytesRxInterface | The bytes received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| PacketsRxInterface | The packets received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ErrorsRxInterface | The errors received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| DiscardsRxInterface | The discards received on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| BytesTxInterface | The bytes transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| PacketsTxInterface | The packets transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ErrorsTxInterface | The errors transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| DiscardsTxInterface | The discards transmitted on the interface | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalBytesRx | The total bytes received | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalBytesTx | The total bytes transmitted | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| MicroTenantID | The Microtenant ID of the Private Cloud Controller | %[OPT]s, %[OPT]j |
