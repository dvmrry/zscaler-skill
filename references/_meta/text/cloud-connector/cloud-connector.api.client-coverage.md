# Which clients cover which parts of the Cloud Connector API: Python v1 and v2, Go, Terraform (cloud-connector.api.client-coverage)
Also called: ztw sdk coverage; cloud connector python sdk v2; zscaler-sdk-python 2.0 ztw; ztc_ip_pool_groups ipGroups; ip pools api cloud connector; cloud connector automation options

Cloud & Branch Connector is automated through the Python SDK's `ztw` package, the Go SDK's `ztw` services and the ZTC Terraform provider. Each one's modules, functions and resources are generated; this subject records the coverage differences an agent needs when choosing between them.

**Python SDK line.** The Python SDK's v2.x beta (`2.0.0bN`), announced in release 1.9.23, covers ZIA, ZDX and ZIdentity only; ZPA, ZCC, ZTW, ZTB and ZWA remain on v1.x, which stays the recommended GA release. [cloud-connector.api.client-coverage:python-v2-excludes-ztw]

**IP pools.** The `/ipGroups` endpoints manage IP pools, which the ZTC provider exposes as `ztc_ip_pool_groups` through the Go SDK's `policyresources/ipgroups` package. [cloud-connector.api.client-coverage:ip-pools-are-ip-groups] The Python SDK's `ip_groups` module lists, creates and deletes IP pools but has no get-by-ID or update method: its methods are `list_ip_groups`, `list_ip_groups_lite`, `add_ip_group` and `delete_ip_group`. [cloud-connector.api.client-coverage:python-ip-groups-partial]

**Workload groups.** No client writes workload groups: the Go SDK's writes are commented out, [In the Go SDK's ZTW `workload_groups` package, `Create`, `Update` and `Delete` sit inside one block comment (it opens before `Create` and closes after `Delete`) and are not compiled; `Get`, `GetByName` and `GetAll` are outside it.](kb:cloud-connector.sdk-go.coverage:workload-groups-writes-commented), the Python module only lists them, [The Python ZTW workload groups module has one API method, `list_groups`, a GET on the workload groups path; it cannot create, update or delete them.](kb:cloud-connector.sdk-python.coverage:workload-groups-list-only), and the provider has only a data source, [The ZTC provider has no workload group resource, and the Go SDK's ZTW package cannot write workload groups, so they are created and changed outside the ZTC provider (in the console or on the ZIA side).](kb:cloud-connector.terraform.forwarding-rules:no-workload-group-resource).

**Go gaps.** The Go SDK's commented-out activation CLI and other functions it leaves out are in [The SDK's `activation_cli/zconActivator.go` declares `package main`, then opens a block comment before its imports; `func main()` and the helper after it sit inside that comment, which closes only after the last `return nil }`.](kb:cloud-connector.sdk-go.coverage:activation-cli-commented) and [What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation](kb:cloud-connector.sdk-go.coverage).

What to check:
1. Whether a Python project that automates Cloud Connector is pinned to the v1.x line, since the v2.x beta does not include ZTW.

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.coverage.md (What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.coverage.md (What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.forwarding-rules.md (ZTC traffic forwarding and DNS rules in Terraform: forward methods, ZPA segment IDs, workload groups, WAN selection and labels)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
