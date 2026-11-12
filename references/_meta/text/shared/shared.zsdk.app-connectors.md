# ZSDK App Connector sizing, provisioning keys, groups, settings, enrollment and deployment checklist (shared.zsdk.app-connectors)
Also called: zsdk app connector throughput; zsdk app connector provisioning key; zsdk app connector group; zsdk app connector enrollment; zsdk app connector deployment checklist; zsdk app connector auto delete

Placement, redundancy and platforms of App Connectors are in [ZSDK architecture: Service Edges, App Connectors and the mobile client](kb:shared.zsdk.architecture); their per-organization maximums are in [ZSDK ranges and limitations per organization](kb:shared.zsdk.limits).

## Sizing

App Connector throughput numbers are aggregated (inbound plus outbound), connectors communicate over the default gateway, and double encryption affects throughput by an amount that varies with the number of double-encrypted applications. [shared.zsdk.app-connectors:throughput-aggregate-and-gateway] With N+1 failover, the documented example for a 1 Gbps aggregate data-center connection is 2 to 3 App Connectors without double encryption and 4 to 6 with it. [shared.zsdk.app-connectors:throughput-sizing-example] Throughput can be raised up to 1 Gbps per App Connector with more memory, more CPUs and faster network link speed; for a 10 Gbps data-center connection the VM spec is 8 vCPU cores (4 CPU cores for physical machines) and 8 GB RAM, and the exact throughput varies with other network factors. [shared.zsdk.app-connectors:throughput-up-to-1gbps] Zscaler recommends more App Connectors with lower specifications over fewer with higher specifications, because a failure of a larger connector can affect more user traffic or sessions. [shared.zsdk.app-connectors:scale-out-recommendation] The per-specification throughput table did not survive capture [gap:shared.zsdk.app-connectors:throughput-table-labels].

## Provisioning keys

An App Connector provisioning key is a text string generated when an App Connector is added; it acts as the connector's ID so the ZSDK cloud can verify it and identify the App Connector group it deploys into, and several keys can be associated with one group. [shared.zsdk.app-connectors:provisioning-key-purpose] A provisioning key has a configurable maximum number of uses and a utilization count; once the maximum is reached the key cannot deploy more App Connectors and cannot be copied, though the maximum can always be edited. [shared.zsdk.app-connectors:provisioning-key-usage-limit] When a provisioning key is edited, its name is the prefix of each App Connector enrolled with it, the App Connector Group field cannot be modified, and the signing certificate signs the certificates of all App Connectors deployed with the key. [shared.zsdk.app-connectors:provisioning-key-edit-fields] When a provisioning key is incorrectly copied, the App Connector console reports an enrollment login failure with http status 401 followed by "Certificate enrollment failed." [shared.zsdk.app-connectors:provisioning-key-incorrect-copy-symptom]

## App Connector groups and settings

Each App Connector belongs to one App Connector group, and every group should be associated with at least one provisioning key and one server group to serve any application; connectors should be assigned only to applications they can reach. [shared.zsdk.app-connectors:group-membership-rules] In an App Connector group, DNS Resolution Option defaults to IPv4 and IPv6 (select IPv6 only with end-to-end IPv6 support), Persist Local Version Profile is Disabled by default and the Version Profile is Default. [shared.zsdk.app-connectors:group-defaults] The DNS Resolution Option sets whether the App Connectors in the group do DNS resolution checks over IPv4, IPv6 or both; the connector must have the corresponding interface enabled and the application servers must support it. [shared.zsdk.app-connectors:group-dns-resolution-option] An App Connector group name cannot contain special characters except periods, hyphens and underscores; Status disables or enables the group and Description is optional. [shared.zsdk.app-connectors:group-name-and-status] The App Connector group edit window has a Disaster Recovery setting that designates the group for disaster recovery, an App Connector Software Update Schedule set by day of the week and start time, and an App Connector Location whose marker click fills Latitude, Longitude and Location Details. [shared.zsdk.app-connectors:group-dr-update-location-fields] An App Connector group can be added when creating an App Connector, deleting one opens a Delete Confirmation window where a checkbox is selected to confirm, and an existing group can take new App Connectors without creating a new group each time. [shared.zsdk.app-connectors:group-add-delete-reuse] App Connector Settings can auto-delete App Connectors with a disconnected status after a set number of days, optionally including disabled ones; Auto Delete is Disabled by default. [shared.zsdk.app-connectors:auto-delete] Per-connector management is not captured [gap:shared.zsdk.app-connectors:per-connector-management].

## Enrollment and deployment

On first install an App Connector generates a local private key encrypted with a hardware fingerprint, makes a CSR, authenticates it with the provisioning key, and receives a TLS client certificate pinned to the hardware fingerprint. [shared.zsdk.app-connectors:enrollment-process] An enrolled App Connector is paired with a single customer account and cannot be enrolled again; App Connectors in VM environments should never be cloned because the keys no longer match the virtual hardware fingerprints. [shared.zsdk.app-connectors:enrollment-one-account-no-clone]

The deployment checklist marks as Mandatory verifying that every App Connector meets the minimum CPU, memory and disk-sizing requirements. [shared.zsdk.app-connectors:deployment-checklist-mandatory] The checklist rates as Highly Recommended: changing the default App Connector password with passwd, a minimum of 2 App Connectors by the N+1 rule, and an internal-network placement with one connector without a public IP address and one with a default route to the internet. [shared.zsdk.app-connectors:deployment-checklist-highly-recommended] The checklist rates as Recommended placing App Connectors as close as possible to the API gateway or servers hosting the mobile application and giving them unrestricted access to the application, including ICMP. [shared.zsdk.app-connectors:deployment-checklist-recommended]

What to check:
1. Whether the provisioning key has reached its maximum number of uses, or was copied incorrectly, when an App Connector cannot enroll.
2. Whether an App Connector in a VM environment was cloned.
3. Whether the App Connector group's DNS Resolution Option matches the interfaces enabled on the connectors and supported by the application servers.

Not known (open gaps):
- Which specification each per-App Connector throughput value belongs to [gap:shared.zsdk.app-connectors:throughput-table-labels]: settled by source-read
- How an individual App Connector is edited, deleted or shown as enrolled [gap:shared.zsdk.app-connectors:per-connector-management]: settled by source-read

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.zsdk.architecture.md (ZSDK architecture: Service Edges, App Connectors and the mobile client)
- links-to references/_meta/text/shared/shared.zsdk.limits.md (ZSDK ranges and limitations per organization)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.zsdk.md (Zscaler SDK for Mobile Apps (ZSDK): what it is and where it is described)
- see-also references/_meta/text/shared/shared.zsdk.applications.md (ZSDK application segments, segment groups, servers, server groups, device profiles and configuration graphs)
- see-also references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors)
