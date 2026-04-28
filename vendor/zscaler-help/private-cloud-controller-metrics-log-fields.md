# Understanding Private Cloud Controller Metrics Log Fields

Source: https://help.zscaler.com/zpa/understanding-private-cloud-controller-metrics-log-fields
Fetched: 2026-04-28

The Log Streaming Service (LSS) can send Private Cloud Controller Metrics log information to any third-party log analytics tool. By default, the Private Cloud Controller Metrics log type includes the fields listed in the following table for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template.

## Field Table

| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimestamp | The timestamp when the log was generated | %[OPT]s, %[OPT]j, %[OPT]J |
| PrivateCloudController | The Private Cloud Controller name | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| CPUUtilization | The maximum CPU usage in the past 5 minutes | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| SystemMemoryUtilization | The memory utilization of the entire VM | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| ProcessMemoryUtilization | The memory utilization of the Private Cloud Controller process | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| UsedTCPPortsIPv4 | The number of used TCP ports for an IPv4 connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| UsedUDPPortsIPv4 | The number of used UDP ports for an IPv4 connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| UsedTCPPortsIPv6 | The number of used TCP ports for an IPv6 connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| UsedUDPPortsIPv6 | The number of used UDP ports for an IPv6 connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| AvailablePorts | The number of usable ports | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| SystemMaximumFileDescriptors | The number of total Private Cloud Controller system file descriptors | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| SystemUsedFileDescriptors | The number of used Private Cloud Controller system file descriptors | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| ProcessMaximumFileDescriptors | The number of total Private Cloud Controller process file descriptors | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| ProcessUsedFileDescriptors | The number of used Private Cloud Controller process file descriptors | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
| AvailableDiskBytes | The number of free bytes available for a Private Cloud Controller | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]d |
