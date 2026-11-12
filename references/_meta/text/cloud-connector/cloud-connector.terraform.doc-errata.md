# Where the ZTC provider documentation is wrong or incomplete, and the location template checks it does not mention (cloud-connector.terraform.doc-errata)
Also called: ztc_ip_destination_groups ip_addresses; ztc_ip_source_groups zia example; ztc_workload_groups documentation; ztc location template bandwidth units; ztc location template aup timeout; ztc_edge_connector_group dns_ip panic

The generated argument lists (`node scripts/kb.mjs surface <resource>`) come from the provider code, not its documentation pages. Where a page disagrees with the code, the code is what Terraform runs.

**Argument names and examples.** The `ztc_ip_destination_groups` attribute reference names the address list `ip_addresses`, but the resource schema's argument (and the page's own examples) is `addresses`. [cloud-connector.terraform.doc-errata:ip-destination-addresses-name] The `ztc_ip_source_groups` page's example declares a `zia_ip_source_groups` resource, a different provider's type; the ZTC resource is `ztc_ip_source_groups`. [cloud-connector.terraform.doc-errata:ip-source-example-zia] The `ztc_workload_groups` data source is registered in the provider but has no documentation page: the provider's data-source pages cover the other 19 data sources. [cloud-connector.terraform.doc-errata:workload-groups-no-doc-page] The forwarding rule page's advice to look workload groups up through the ZIA provider is in [ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels](kb:cloud-connector.terraform.forwarding-rules).

**Location template.** On create and update, before calling the API, the location template resource rejects caution combined with authentication or with AUP, AUP enabled with an AUP timeout of 0 days, and bandwidth control enforced with both upload and download limits 0. These are apply-time errors, not plan-time ones, and a 0 AUP timeout is not accepted as "no timeout" when AUP is on. [cloud-connector.terraform.doc-errata:template-apply-checks] The console's location template form labels the Enforce Bandwidth Control limits Download (Mbps) and Upload (Mbps). [cloud-connector.terraform.doc-errata:console-bandwidth-mbps] The bandwidth unit is given in several ways [divergence:cloud-connector.terraform.doc-errata:template-bandwidth-unit], and which is right is open [gap:cloud-connector.terraform.doc-errata:bandwidth-unit]. ZIA's own location bandwidth fields are in [How a location and its sublocations share bandwidth limits](kb:zia.locations.bandwidth).

**Fixed in 0.2.0.** Provider release 0.2.0 fixed a `ztc_edge_connector_group` panic involving the attribute type of `ec_instances.0.dns_ip`. [cloud-connector.terraform.doc-errata:edge-connector-group-fix-0-2-0]

What to check:
1. For a location template that fails on apply, whether it combines caution with authentication or AUP, enables AUP with a zero timeout, or enforces bandwidth with both limits at 0.
2. Which unit the configured up_bandwidth and dn_bandwidth were meant in, and what the console shows after apply.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.terraform.doc-errata:workload-groups-no-doc-page] Tier B: Listing of docs/data-sources at the pin: 19 pages, none for ztc_workload_groups.

Sources disagree (name both sides):
- The location template's upload and download bandwidth are documented in Kbps by the provider page, in bytes by the provider schema, and in Mbps by the API contract, the Python SDK and the console's location template form. [divergence:cloud-connector.terraform.doc-errata:template-bandwidth-unit]
  - tf-ztc: up_bandwidth and dn_bandwidth are in Kbps.
  - tf-ztc: Both are bandwidth in bytes (both descriptions say upload).
  - api-specs: upBandwidth is the maximum upload bandwidth in Mbps.
  - sdk-python: The Python SDK documents up_bandwidth and dn_bandwidth in Mbps.
  - zscaler-help: The console form labels the bandwidth limits Download (Mbps) and Upload (Mbps).
  Impact: A value chosen from one source may be off by a factor of 1,000 or more from what the service applies.

Not known (open gaps):
- Which unit the ZTC location template bandwidth fields use [gap:cloud-connector.terraform.doc-errata:bandwidth-unit]: settled by lab-test. Blocks: Setting up_bandwidth and dn_bandwidth to the intended limit.

Area: cloud-connector.terraform, its subjects in references/_meta/spine/cloud-connector/cloud-connector.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)
- links-to references/_meta/text/zia/zia.locations.bandwidth.md (How a location and its sublocations share bandwidth limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.terraform.coverage.md (What the ZTC Terraform provider covers, and how existing objects are imported)
