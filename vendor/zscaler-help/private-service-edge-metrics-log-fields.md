# Understanding Private Service Edge Metrics Log Fields

**Source:** https://help.zscaler.com/zpa/understanding-private-service-edge-metrics-log-fields
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485156, revision 3203563

---

The Log Streaming Service (LSS) can send Private Service Edge Metrics log information to any third-party log analytics tool. By default, the Private Service Edge Metrics log type includes the fields listed in the following table for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template.
- View an example Private Service Edge Metrics log.
- {"LogTimestamp":"Fri May 6 11:40:00 2022,"PrivateSE":"TestPrivateServiceEdge","CPUUtilization":"1","SystemMemoryUtilization":%j{SystemMemoryUtilization},"ProcessMemoryUtilization":%j{ProcessMemoryUtilization},"UsedTCPPortsIPv4":"1","UsedUDPPortsIPv4":"4","UsedTCPPortsIPv6":"1","UsedUDPPortsIPv6":"5","AvailablePorts":"28223","SystemMaximumFileDescriptors":"960344","SystemUsedFileDescriptors":"1211","ProcessMaximumFileDescriptors":"421000","ProcessUsedFileDescriptors":"122","AvailableDiskBytes":"261886394368", "MicroTenantID": "145257480799129312"}
The following table includes descriptions and supported field format specifications for each field within the template. To learn more about the format specifications listed for each field, including examples, see Understanding the Log Stream Content Format.
| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimeStamp | The timestamp when the log was generated | %[OPT]s%[OPT]j%[OPT]J |
| PrivateSE | The name of the Private Service Edge for Private Access | %[OPT]s%[OPT]j%[OPT]J%[OPT]o |
| CPUUtilization | The maximum CPU usage in the past 5 minutes | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| SystemMemoryUtilization | The memory utilization of the entire virtual machine (VM) | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| ProcessMemoryUtilization | The memory utilization of the Private Service Edge process | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| UsedTCPPortsIPv4 | The number of used TCP ports for an IPv4 connection | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| UsedUDPPortsIPv4 | The number of used UDP ports for an IPv4 connection | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| UsedTCPPortsIPv6 | The number of used TCP ports for an IPv6 connection | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| UsedUDPPortsIPv6 | The number of used UDP ports for an IPv6 connection | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| AvailablePorts | The number of usable ports | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| SystemMaximumFileDescriptors | The number of total Private Service Edge system file descriptors | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| SystemUsedFileDescriptors | The number of used Private Service Edge system file descriptors | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| ProcessMaximumFileDescriptors | The number of total Private Service Edge process file descriptors | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| ProcessUsedFileDescriptors | The number of used Private Service Edge process file descriptors | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| AvailableDiskBytes | The number of free bytes available for the Private Service Edge | %[OPT]s%[OPT]j%[OPT]J%[OPT]d |
| MicroTenantID | The Microtenant ID of the Private Service Edge | %[OPT]s%[OPT]j |
