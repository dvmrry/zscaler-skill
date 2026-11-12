# ZDX devices: the device list, device detail and per-device application scores (zdx.devices)
Also called: zdx devices; zdx device; zdx device inventory; zdx device detail; os_build; wifi_adapter; ssid; bssid; zdx device network; zdx device apps; zdx device app score trend; get_device_app
Former IDs: zdx-23, zdx-29

A device is the endpoint whose Client Connector reports ZDX data; the API reads devices as a list and one at a time. The device list returns all active devices with basic details, for the last 2 hours if no time range is given; the contract notes that the JSON must contain the user's ID and email address to associate a device with the user. [zdx.devices:device-list]

**Detail.** The device detail read returns the device model information, tunnel type, network and software details, for the last 2 hours if no time range is given. [zdx.devices:device-detail] In the contract a device's `network` is an array, and each entry carries the Wi-Fi adapter (`wifi_adapter`), Wi-Fi type (`wifi_type`), network SSID (`ssid`), channel (`channel`) and BSSID (`bssid`) beside its IPv4, IPv6 and MAC addresses (`ipv4`, `ipv6`, `mac`). [zdx.devices:network-wifi] In the contract a device's software details include `os_build`, the OS build version on the device. [zdx.devices:os-build] In the console, the user details page displays the devices in use with device information such as the OS type and version, CPU, memory, and private and public IP; which devices appear depends on the time selected and factors such as device network issues and offline or sleep status. A device's information window organizes further details under Hardware, Network or Software tabs, and the Software tab shows the ZDX and Client Connector versions. [zdx.devices:console-device-info] A device's Tunnel Type in the console depends on the device profile and is one of Tunnel 1.0 or TWLP, Tunnel 2.0 in DTLS Mode, Tunnel 2.0 in TLS Mode or Tunnel Unknown; Unknown means ZDX could not detect it. [zdx.devices:tunnel-type] When a device is shared between multiple users, the user count is higher than the device count; in the Devices Overview's example there are two users and one device. [zdx.devices:shared-device-counts] Whether the Wi-Fi fields are filled for wired or cellular interfaces is not documented [gap:zdx.devices:wifi-field-population].

**Filters.** The MAC address and private IPv4 filters are typed differently by the contract and the Python SDK [divergence:zdx.devices:mac-ipv4-filter-type]; the Go device list has neither, [The Go device list cannot filter by MAC address or private IPv4: its `GetDevicesFilters` carries user IDs, emails, location, department, geolocation, offset and limit beside the shared time filters, while the contract and the Python `list_devices` offer `mac_address` and `private_ipv4`.](kb:zdx.api.client-coverage:go-device-filters).

**Applications on a device.** The device-applications read lists all active applications for a device with each one's ZDX score, for the last 2 hours if no time range is given. [zdx.devices:device-apps] The read for one application on a device returns that application's ZDX score trend for the device, a series with `metric`, `unit` and `datapoints`, for the last 2 hours if no time range is given. [zdx.devices:device-app-trend]

**More per device.** Health metrics and events are in [ZDX device health metrics and device events](kb:zdx.devices.health-and-events), geolocation in [ZDX geolocations: active geolocations, geo filters and coordinates](kb:zdx.devices.geolocation), call quality in [ZDX call-quality metrics per device and meeting](kb:zdx.devices.call-quality), and per-device Web and Cloud Path probe reads in [The API's Cloud Path read for an application on a device returns summary data for the whole path (total hops, packet loss, latency and tunnel type, if available) and a similar summary for each hop, defaulting to the last 2 hours.](kb:zdx.probes:cloudpath-hop-data). The console's Device Health Score and hardware and usage profiles are in [The Device Health Score and the hardware and usage profiles of the Devices Overview](kb:zdx.devices.health-score), its hardware, process, software and patch inventory in [Hardware, process, software and software patch inventory in the ZDX console](kb:zdx.devices.inventory), and Microsoft Endpoint Analytics scores in [Microsoft Endpoint Analytics (Intune) scores in ZDX](kb:zdx.devices.endpoint-analytics). Paging and time ranges are in [Reading ZDX report data: time ranges, paging, users and what the reads return](kb:zdx.reports).

**Groups of devices.** Whether ZDX has device groups or cohorts usable as report filters is not documented [gap:zdx.devices:device-groups].

**Client differences.** The Go SDK decodes the per-device application read as a single record rather than a series, [zdx.sdk-go.service-defects:device-app-shape](kb:zdx.sdk-go.service-defects:device-app-shape); other differences between the Go and Python device models are in [Go SDK ZDX services: where the structs and functions disagree with the contract](kb:zdx.sdk-go.service-defects).

What to check:
1. Whether a device-detail field such as `os_build` or a Wi-Fi field is missing because the client model drops it, since the contract documents it.
2. Whether the device was active in the time range before treating it as missing from the device list.

Sources disagree (name both sides):
- The device list's `mac_address` and `private_ipv4` filters: the contract types each as an array of int64 integers, while the Python `list_devices` docstring documents each as a string. [divergence:zdx.devices:mac-ipv4-filter-type]
  - api-specs: `mac_address` is an array of int64 integers.
  - api-specs: `private_ipv4` is an array of int64 integers.
  - sdk-python: Both are strings: a MAC address and a private IPv4 address of the device.
  Impact: A MAC address or dotted IPv4 address does not fit the contract's integer type, and no source says how the server parses these filters, so a filter that matches nothing may be a format problem rather than an absent device.

Not known (open gaps):
- Whether the Wi-Fi fields are filled for every interface [gap:zdx.devices:wifi-field-population]: settled by lab-test or tenant-data. Blocks: Wi-Fi root-cause answers from device detail
- Whether ZDX has device groups or cohorts [gap:zdx.devices:device-groups]: settled by source-read or lab-test. Blocks: fleet-segment answers by device group

Area: zdx.devices, its subjects in references/_meta/spine/zdx/zdx.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.sdk-go.service-defects.md (Go SDK ZDX services: where the structs and functions disagree with the contract)
- links-to references/_meta/text/zdx/zdx.api.client-coverage.md (Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls)
- links-to references/_meta/text/zdx/zdx.devices.call-quality.md (ZDX call-quality metrics per device and meeting)
- links-to references/_meta/text/zdx/zdx.devices.endpoint-analytics.md (Microsoft Endpoint Analytics (Intune) scores in ZDX)
- links-to references/_meta/text/zdx/zdx.devices.geolocation.md (ZDX geolocations: active geolocations, geo filters and coordinates)
- links-to references/_meta/text/zdx/zdx.devices.health-and-events.md (ZDX device health metrics and device events)
- links-to references/_meta/text/zdx/zdx.devices.health-score.md (The Device Health Score and the hardware and usage profiles of the Devices Overview)
- links-to references/_meta/text/zdx/zdx.devices.inventory.md (Hardware, process, software and software patch inventory in the ZDX console)
- links-to references/_meta/text/zdx/zdx.probes.md (ZDX probes: Web and Cloud Path probes, what they measure and how they run)
- links-to references/_meta/text/zdx/zdx.reports.md (Reading ZDX report data: time ranges, paging, users and what the reads return)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- see-also references/_meta/text/zdx/zdx.dashboards.md (ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service)
