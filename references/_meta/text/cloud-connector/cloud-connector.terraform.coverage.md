# What the ZTC Terraform provider covers, and how existing objects are imported (cloud-connector.terraform.coverage)
Also called: ztc terraform missing resource; ztc provider api parity; zscaler-terraformer ztc; ztc terraform import; ztc import by name; ztc brownfield

The provider's resources and data sources are generated: run `node scripts/kb.mjs surface ztw` and read the `terraform` entries. This subject holds why something may have no resource and what the vendor's import tooling covers.

**Public API only.** The provider documentation says it keeps parity with the publicly available API and implements only what that API exposes, so a feature available in the console but not through the API cannot be in the provider. [cloud-connector.terraform.coverage:api-parity] Workload groups and ZPA segment lookups, which have no resource or data source of their own, are in [ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels](kb:cloud-connector.terraform.forwarding-rules); connector-group writes the SDK lacks are in [What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation](kb:cloud-connector.sdk-go.coverage).

**Importing existing objects.** The forwarding rule and DNS gateway importers take the import ID as a numeric ID when it parses as a number and otherwise look the object up by name. [cloud-connector.terraform.coverage:import-id-or-name] The provider's resource-importer guide lists nine ZTC resources that zscaler-terraformer can generate and import (forwarding gateway, IP destination, IP source and IP pool groups, network service groups, network services, location template, provisioning URL, traffic forwarding rule) and says any resource not listed is not supported. [cloud-connector.terraform.coverage:importer-guide-ztc-list] The same guide says the tool is not meant to be 100% perfect: some resources may not be supported yet and should be imported with `terraform import` directly, and drift after generation can come from provider schema issues or API behavior and may need manual edits to the generated HCL. [cloud-connector.terraform.coverage:importer-limitations] The vendored zscaler-terraformer lists ZTC resources as generate- and import-supported, including `ztc_dns_forwarding_gateway` and `ztc_account_groups`, and its README says any resource not listed is not supported. [cloud-connector.terraform.coverage:terraformer-ztc-list]

What to check:
1. Whether the setting is exposed by the public Cloud & Branch Connector API before looking for a provider resource for it.
2. Whether the resource to bring under management is in the Terraformer list; for one that is not, use terraform import with the resource's own importer.

Area: cloud-connector.terraform, its subjects in references/_meta/spine/cloud-connector/cloud-connector.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.coverage.md (What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)
