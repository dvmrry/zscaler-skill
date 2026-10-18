# Understanding App Connector Status Log Fields

**Source:** https://help.zscaler.com/zpa/understanding-app-connector-status-log-fields
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1483951, revision 3203516

---

The Log Streaming Service (LSS) can send App Connector Status log information to any third-party log analytics tool. By default, the App Connector Status log type includes the fields listed in the following table for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template. For example, you can add the ConnectionLogType field as a custom log field to distinguish between AppProtection and event logs. The expected values for this field are event_log and inspection_log. The supported log field format specification must be included (i.e., %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o).
- View an example App Connector Status log.
- {"LogTimestamp": "Wed Jul 3 05:17:22 2019","Customer": "Safe March","SessionID": "8A64Qwj9zCkfYDGJVoUZ","SessionType": "ZPN_ASSISTANT_BROKER_CONTROL","SessionStatus": "ZPN_STATUS_AUTHENTICATED","Version": "19.20.3","Platform": "el7","ZEN": "US-NY-8179","Connector": "Seattle App Connector 1","ConnectorGroup": "Azure App Connectors","PrivateIP": "10.0.0.4","PublicIP": "52.224.237.221","Latitude": 47.000000,"Longitude": -122.000000,"CountryCode": "","TimestampAuthentication": "2019-06-27T05:05:23.348Z","TimestampUnAuthentication": "","CPUUtilization": 1,"MemUtilization": 20,"ServiceCount": 2,"InterfaceDefRoute": "eth0","DefRouteGW": "10.0.0.1","PrimaryDNSResolver": "168.63.129.16","HostStartTime": "1513229995","ConnectorStartTime": "1555920005","NumOfInterfaces": 2,"BytesRxInterface": 319831966346,"PacketsRxInterface": 1617569938,"ErrorsRxInterface": 0,"DiscardsRxInterface": 0,"BytesTxInterface": 192958782635,"PacketsTxInterface": 1797471190,"ErrorsTxInterface": 0,"DiscardsTxInterface": 0,"TotalBytesRx": 10902554,"TotalBytesTx": 48931771, "MicroTenantID": "145257480799129312"}
The following table includes descriptions and supported field format specifications for each field within the template. To learn more about the format specifications listed for each field, including examples, see Understanding the Log Stream Content Format.
| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimestamp | Timestamp when the log was generated | %[OPT]s%[OPT]j%[OPT]J |
| Customer | The customer name | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| SessionID | The TLS session ID | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| SessionType | The type of session. The expected value for this field is ZPN_ASSISTANT_BROKER_CONTROL, which denotes the session from the App Connector towards the closest Public Service Edge for Private Access. | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| SessionStatus | The status of the session. The expected values for this field are:ZPN_STATUS_AUTHENTICATED: App Connector successfully authenticated in Private AccessZPN_STATUS_AUTH_FAILED: App Connector failed to authenticate in Private AccessZPN_STATUS_DISCONNECTED: App Connector disconnected from a Service Edge for Private Access | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| Version | The App Connector package version | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| Platform | The host platform | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| ZEN | The Public Service Edge that was selected for the connection | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| Connector | The App Connector name | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| ConnectorGroup | The App Connector group name | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| PrivateIP | The private IP address of the App Connector | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| PublicIP | The public IP address of the App Connector | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| Latitude | The latitude coordinate of the App Connector location | %[OPT]f%[OPT]o |
| Longitude | The longitude coordinate of the App Connector location | %[OPT]f%[OPT]o |
| CountryCode | The country code | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| TimestampAuthentication | Timestamp in microseconds when the App Connector was authenticated | %[OPT]s%[OPT]j%[OPT]J |
| TimestampUnAuthentication | Timestamp in microseconds when the App Connector was unauthenticated | %[OPT]s%[OPT]j%[OPT]J |
| CPUUtilization | The CPU utilization in % | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| MemUtilization | The memory utilization in % | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| ServiceCount | The number of services (i.e., combinations of domains or IP addresses and TCP or UDP ports) being monitored by the App Connector | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| InterfaceDefRoute | The name of the interface to default route | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| DefRouteGW | The IP address of the gateway to default route | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| PrimaryDNSResolver | The IP address of the primary DNS resolver | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| HostStartTime | Time in seconds at which host was started | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| ConnectorStartTime | Time in seconds at which the App Connector was started | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| NumOfInterfaces | The number of interfaces on the App Connector host | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| BytesRxInterface | The bytes received on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| PacketsRxInterface | The packets received on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| ErrorsRxInterface | The errors received on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| DiscardsRxInterface | The discards received on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| BytesTxInterface | The bytes transmitted on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| PacketsTxInterface | The packets transmitted on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| ErrorsTxInterface | The errors transmitted on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| DiscardsTxInterface | The discards transmitted on the interface | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| TotalBytesRx | The total bytes received | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| TotalBytesTx | The total bytes transmitted | %[OPT]d%[OPT]x%[OPT]f%[OPT]o |
| MicroTenantID | The Microtenant ID of the App Connector | %[OPT]s%[OPT]j |
