# What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation (cloud-connector.sdk-go.coverage)
Also called: ztw go sdk workload groups create; workload_groups commented out; activation_cli; zconActivator; ztw ecgroup create update; ztw go sdk activate after change; GetEcRDRCount log rules; destWorkloadGroups go sdk

Which functions each ZTW package exports, and which endpoints they call, is generated (`node scripts/kb.mjs surface ztw`). This subject records the vendor code that sits in block comments and does not compile, and what the packages do not cover.

**Functions that do not compile.** In the Go SDK's ZTW `workload_groups` package, `Create`, `Update` and `Delete` sit inside one block comment (it opens before `Create` and closes after `Delete`) and are not compiled; `Get`, `GetByName` and `GetAll` are outside it. [cloud-connector.sdk-go.coverage:workload-groups-writes-commented] The `traffic_log_rules` package's `GetEcRDRCount` is inside a block comment, while the forwarding and DNS rule packages each define a compiled `GetEcRDRCount`. [cloud-connector.sdk-go.coverage:log-rule-count-commented] The SDK's `activation_cli/zconActivator.go` declares `package main`, then opens a block comment before its imports; `func main()` and the helper after it sit inside that comment, which closes only after the last `return nil }`. [cloud-connector.sdk-go.coverage:activation-cli-commented] A working activation CLI ships with the Terraform provider instead: [Activating ZTC changes from Terraform: the activation resource and the ztcActivator CLI](kb:cloud-connector.terraform.activation).

**Activation.** The Go SDK's ZTW create, update and delete functions do not activate; staged changes take effect only when the caller calls `activation.UpdateActivationStatus` or `activation.ForceActivationStatus`. [cloud-connector.sdk-go.coverage:no-auto-activation] The activate and forced-activate calls are described in [Reading Cloud & Branch Connector activation status](kb:shared.activation.cbc).

**Connector groups.** The Go `ecgroup` package defines only two endpoints, the group collection and its lite view, and six functions: `Get`, `GetByName`, `GetAll`, `GetEcGroupLiteID` and `GetEcGroupLiteByName` read groups and `Delete` deletes one; none creates or updates a group. [cloud-connector.sdk-go.coverage:ecgroup-endpoints] So the bulk VM status, release-channel and upgrade-metrics operations of the group API have no Go SDK function; a Go program reaches them only with raw requests. [cloud-connector.sdk-go.coverage:bulk-vm-ops-not-in-go]

**Forwarding rules.** The Go SDK's ZTW forwarding rule struct carries source workload groups (`srcWorkloadGroups`) and no destination workload groups field. [cloud-connector.sdk-go.coverage:go-no-dest-workload-groups] The Python SDK sends that field: [What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop](kb:cloud-connector.sdk-python.coverage).

**Partner integrations.** Whether REST paths exist for Azure and GCP partner integration, which neither SDK covers, is open in [Cloud Connector partner integration endpoints: AWS accounts in the contract, Azure and GCP outside it](kb:cloud-connector.api.partner-integrations-wire).

Two packages that write the same DNS gateway endpoint are compared in [ZTC forwarding and DNS gateways in Terraform and the Go SDK: subclouds, manual proxies, and the two DNS gateway resources](kb:cloud-connector.terraform.gateways); the read-only ZPA-resources package is in [ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels](kb:cloud-connector.terraform.forwarding-rules); service functions that misroute or mis-assert are in [Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects](kb:cloud-connector.sdk-go.service-defects).

What to check:
1. Whether a ZTW function is inside a block comment in the vendor source before relying on it (workload group writes, the log-rule count, the activation CLI).
2. Whether the Go program calls activation after its writes; nothing in the ZTW services activates for it.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.sdk-go.coverage:no-auto-activation] Tier B: Absence: the ZTW service packages were searched at the pin for calls into the activation package or the activate endpoints; only the activation package itself uses them.
- [cloud-connector.sdk-go.coverage:bulk-vm-ops-not-in-go] Tier B: Absence: no ZTW Go package at the pin defines the releaseChannel, vmStatus or vmUpgradeMetrics paths of the group API reference (searched zscaler/ztw/services).
- [cloud-connector.sdk-go.coverage:go-no-dest-workload-groups] Tier B: Absence: forwarding_rules.go was searched at the pin for workload; SrcWorkloadGroups is the only match.

Area: cloud-connector.sdk-go, its subjects in references/_meta/spine/cloud-connector/cloud-connector.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.partner-integrations-wire.md (Cloud Connector partner integration endpoints: AWS accounts in the contract, Azure and GCP outside it)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.coverage.md (What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.activation.md (Activating ZTC changes from Terraform: the activation resource and the ztcActivator CLI)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.gateways.md (ZTC forwarding and DNS gateways in Terraform and the Go SDK: subclouds, manual proxies, and the two DNS gateway resources)
- links-to references/_meta/text/shared/shared.activation.cbc.md (Reading Cloud & Branch Connector activation status)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.api.ec-groups-wire.md (Cloud Connector group endpoints on the wire: release channels, VM status and upgrade scheduling)
