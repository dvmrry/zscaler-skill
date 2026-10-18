{{what-it-is}} {{cloud-metadata-source}}

Location groups are covered elsewhere: the predefined Workload Traffic location group and how a location lands in it are in [[zia.locations.groups]] and [[zia.locations.group-assignment]], and the sublocations Cloud Connector creates for workloads are in [[zia.locations.workload-scopes]]. {{both-fields}}

**Before expecting any of this to exist.** {{discovery-prerequisite}} {{discovered-in-cloud-connector}}

**Who can change them.** {{edit-permission}} {{console-page}}

**Reading order.**

1. What an expression can say, and what it cannot be shown to do: [[zia.workload-groups.expressions]].
2. Which rules accept a workload group, and how many per rule: [[zia.workload-groups.rule-scoping]].
3. Reading and writing them through the API, Terraform and MCP: [[zia.workload-groups.api-surface]].

How ZIA evaluates an expression against live traffic is open [[zia.workload-groups.expressions:runtime-evaluation]].
