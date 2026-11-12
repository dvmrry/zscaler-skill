# ZIA device inventory: Client Connector devices and the predefined OS-type device groups (zia.devices)
Also called: Device Management; device groups; device group criterion; Device Groups page; OS type device groups

The Device Management page displays all the devices in the organization that have Zscaler Client Connector deployed, and devices can be selected when configuring policies, to identify Client Connector-managed devices to apply Internet & SaaS security policies. [zia.devices:devices-page-scope] The Devices page shows each device's Device ID, Device Hostname, OS Type, OS Version, Device Model and Device Owner. [zia.devices:device-fields] The Device Hostname field displays values only if Zscaler Client Connector has been configured to collect the hostname information. [zia.devices:hostname-condition] The Devices page leads to the Device Groups, VDI Devices and VDI Device Groups pages. [zia.devices:devices-related-pages]

**Device groups.** The Device Groups page displays a list of predefined groups that are defined based on the OS types of the devices in the organization, and the devices that have Zscaler Client Connector deployed are categorized under the respective groups based on their OS type. [zia.devices:device-groups-by-os] Device groups let an admin organize devices into logical groups to apply Internet & SaaS security policies to many devices at once. [zia.devices:device-groups-purpose] The Device Groups page shows each group's Group Name and No. of Devices, the number of devices belonging to the group. [zia.devices:device-group-fields]

**What the pages leave open.** Whether groups other than the predefined ones can be created is open [gap:zia.devices:group-creation]. Which OS types make up the predefined groups is open [gap:zia.devices:predefined-os-types]. How the choices that rule pages show in the Device Groups criterion relate to these groups is open [gap:zia.devices:criterion-choices]. What the VDI Devices and VDI Device Groups pages hold is open [gap:zia.devices:vdi-pages].

The rules that select device groups are in [SSL/TLS inspection rule criteria and the ones that silently don't match](kb:zia.ssl-inspection.criteria), [What a Cloud App Control rule matches on](kb:zia.cloud-app-control.rule-criteria), [Traffic Capture Essentials and Traffic Capture for NDR: storage, rules, limits and obfuscation](kb:zia.traffic-capture) and [How IoT traffic is targeted by policy](kb:zia.iot.policy-use); the per-rule caps are in [Firewall rule, criteria and group limits](kb:zia.firewall.limits); the API coverage is in [Which ZIA services the Go and Python SDKs cover, and where](kb:zia.api.sdk-coverage).

Not known (open gaps):
- Whether device groups other than the predefined OS-type groups can be created [gap:zia.devices:group-creation]: settled by tenant-data or lab-test
- Which OS types make up the predefined device groups [gap:zia.devices:predefined-os-types] (data gap): filled by live; run `zscalerctl zia device-groups list`; settled by tenant-data
- How the Cloud Browser Isolation, No Client Connector and IoT choices in rule Device Groups criteria relate to the predefined groups [gap:zia.devices:criterion-choices]: settled by tenant-data or source-read
- What the VDI Devices and VDI Device Groups pages hold [gap:zia.devices:vdi-pages]: settled by source-read

Area: zia.devices, its subjects in references/_meta/spine/zia/zia.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.api.sdk-coverage.md (Which ZIA services the Go and Python SDKs cover, and where)
- links-to references/_meta/text/zia/zia.cloud-app-control.rule-criteria.md (What a Cloud App Control rule matches on)
- links-to references/_meta/text/zia/zia.firewall.limits.md (Firewall rule, criteria and group limits)
- links-to references/_meta/text/zia/zia.iot.policy-use.md (How IoT traffic is targeted by policy)
- links-to references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match)
- links-to references/_meta/text/zia/zia.traffic-capture.md (Traffic Capture Essentials and Traffic Capture for NDR: storage, rules, limits and obfuscation)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/devices.md (config type)
- configured-via references/_meta/text/types/zia/device-groups.md (config type)
