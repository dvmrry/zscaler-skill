# Cloud Connector group endpoints on the wire: release channels, VM status and upgrade scheduling (cloud-connector.api.ec-groups-wire)
Also called: ztw ecgroup; ecgroup releaseChannel; ecgroup vmStatus; ecgroup scheduleupgrade; cloud connector upgrade api; edge connector group api; vmUpgradeMetrics

Cloud & Branch Connector groups (edge connector groups in the SDKs) are where VM release channels, enable or disable, and upgrade windows are set through the API. The Go package's read and delete functions and the contract's paths are generated; the two API references disagree on which upgrade operations exist.

What a group is for is in [Groups let you apply policies to a set of deployed Cloud Connectors and upgrade the Cloud Connectors in a group while keeping redundancy during the upgrade.](kb:cloud-connector.overview.groups:group-purpose), and how upgrades, windows and release channels work is in [Cloud & Branch Connector software upgrades: weekly window, stagger and release channels](kb:cloud-connector.upgrades).

## The two references disagree

The legacy group reference has bulk release-channel and VM-status operations, [The help's group API reference has a bulk operation that updates the release channel of Cloud Connector VMs, taking STABLE, LATEST or BETA for lists of group IDs and VM IDs.](kb:cloud-connector.upgrades:release-channel-api) and [The same reference has a bulk operation that enables or disables Cloud Connector VMs (ENABLE or DISABLE), returning the VMs that failed.](kb:cloud-connector.upgrades:vm-status-api), and an upgrade-metrics read, [A group API read returns Cloud Connector release-channel and scheduled-upgrade metrics: counts of VMs per release channel and per upgrade state (blocked, bootstrapping, failed, scheduled, up to date), filterable by platform, release channel, location, group name and upgrade status (SCHEDULED, NO_PENDING_UPGRADE, FAILED_OTHER, BOOTSTRAPPING, BLOCKED).](kb:cloud-connector.upgrades.monitoring:upgrade-metrics); how the console uses them is in [On the Cloud Connector Groups overview, selected groups or connectors can be given an upgrade schedule (a day and time for periodic software updates) or a new release channel, and each group shows its Upgrade Window.](kb:cloud-connector.upgrades:group-actions). The OneAPI contract has none of those three operations and has its own per-VM status and upgrade-schedule operations instead [divergence:cloud-connector.api.ec-groups-wire:upgrade-operations].

The Go SDK has no function for the bulk operations: [So the bulk VM status, release-channel and upgrade-metrics operations of the group API have no Go SDK function; a Go program reaches them only with raw requests.](kb:cloud-connector.sdk-go.coverage:bulk-vm-ops-not-in-go). Whether any operation upgrades a connector immediately is open in [Whether any operation upgrades a connector immediately](kb:cloud-connector.upgrades:upgrade-now).

What to check:
1. Which reference a script was written against before debugging a 404 on an EC group upgrade call: the legacy reference's bulk paths are absent from the OneAPI contract, and the contract's per-VM and schedule paths are absent from the legacy reference.

Sources disagree (name both sides):
- Which group and VM upgrade operations exist: the legacy reference's bulk calls or the OneAPI contract's per-VM and schedule calls. [divergence:cloud-connector.api.ec-groups-wire:upgrade-operations]
  - zscaler-help: The legacy reference has bulk release-channel, bulk VM-status and upgrade-metrics operations.
  - api-specs: The OneAPI Postman collection, like the legacy reference, has the bulk VM-status, bulk release-channel and upgrade-metrics requests under `ZTWBaseUrl`.
  - api-specs: The OneAPI contract has none of those three paths.
  - api-specs: The OneAPI contract instead has a PUT that updates the scheduled upgrade time and a per-VM PUT that changes one VM's status to `ENABLE` or `DISABLE` in the path.
  - api-specs: The per-VM status operation takes the status as a path segment.
  - zscaler-help: The legacy reference has no schedule-upgrade path.
  Impact: The generated surface follows the OneAPI contract, so the bulk release-channel and VM-status calls do not appear there. Which set the live API serves on each host is not shown; a script should be tested against the host it will run on.

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.upgrades.md (Cloud & Branch Connector software upgrades: weekly window, stagger and release channels)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.coverage.md (What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation)
- links-to references/_meta/text/cloud-connector/cloud-connector.upgrades.monitoring.md (Watching Cloud Connector upgrades: VM record fields, upgrade metrics and upgrade events)
