# What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop (cloud-connector.sdk-python.coverage)
Also called: dest_workload_groups_ids; destWorkloadGroups python; ztw python workload groups write; list_groups ztw; ztw discovery_service python

The Python SDK's ZTW modules and their endpoints are generated (`node scripts/kb.mjs surface ztw`, the `sdk_python` entries). This subject records the two places where what they send or cover matters for an answer.

**Destination workload groups.** Release 1.9.13 of the Python SDK added a `dest_workload_groups_ids` attribute to the ZTW forwarding rules module. [cloud-connector.sdk-python.coverage:dest-workload-groups-added-1-9-13] `add_rule` and `update_rule` in the Python ZTW forwarding-rules module build `local_reformat_params` from `reformat_params`, minus its `url_categories` entry, and pass it to `transform_common_id_fields`; `reformat_params` maps `dest_workload_groups_ids` to the wire key `destWorkloadGroups`. [cloud-connector.sdk-python.coverage:dest-workload-groups-wire-key] Only the Python SDK sends the field: the API contract and the Go SDK do not carry it [cloud-connector.api.rules-wire:workload-groups](kb:cloud-connector.api.rules-wire:workload-groups), and whether the API accepts it is open in [Cloud Connector rule endpoints on the wire: which forwarding and DNS rule fields each client sends](kb:cloud-connector.api.rules-wire). The console criterion it maps to, and its Local-only scope, are in [Which ZIA rules accept workload groups, and how many](kb:zia.workload-groups.rule-scoping).

**Workload groups.** The Python ZTW workload groups module has one API method, `list_groups`, a GET on the workload groups path; it cannot create, update or delete them. [cloud-connector.sdk-python.coverage:workload-groups-list-only] Neither SDK nor the ZTC provider writes workload groups: [ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels](kb:cloud-connector.terraform.forwarding-rules).

**Discovery service.** Both SDKs call the discovery-permissions PUT, but name its path parameter differently: the Python method takes `account_group_id`, the Go function `awsAccountID`. [cloud-connector.sdk-python.coverage:discovery-path-param-names] Which ID the API actually takes there is open in [AWS account permission status: Pending, Allowed, Denied, and refreshing it](kb:cloud-connector.workload-discovery.permission-status).

What to check:
1. Read back a forwarding rule written with dest_workload_groups_ids and confirm destWorkloadGroups was stored, since the API contract does not list it.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.sdk-python.coverage:workload-groups-list-only] Tier B: Absence: zscaler/ztw/workload_groups.py at the pin defines two methods, __init__ and list_groups; no create, update or delete method exists in the module.

Area: cloud-connector.sdk-python, its subjects in references/_meta/spine/cloud-connector/cloud-connector.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.rules-wire.md (Cloud Connector rule endpoints on the wire: which forwarding and DNS rule fields each client sends)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.permission-status.md (AWS account permission status: Pending, Allowed, Denied, and refreshing it)
- links-to references/_meta/text/zia/zia.workload-groups.rule-scoping.md (Which ZIA rules accept workload groups, and how many)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.sdk-go.coverage.md (What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation)
- see-also references/_meta/text/cloud-connector/cloud-connector.forwarding.methods.md (Cloud Connector forwarding methods: ZIA, ZPA, Direct, Drop, Local, and their API tokens)
