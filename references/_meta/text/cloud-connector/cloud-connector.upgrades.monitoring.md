# Watching Cloud Connector upgrades: VM record fields, upgrade metrics and upgrade events (cloud-connector.upgrades.monitoring)
Also called: upgradeStatus; upgradeDayOfWeek; vmUpgradeMetrics; cloud connector upgrade status; cloud connector upgrade failed; lastUpgradeTime

Upgrade progress can be read three ways: from each VM's record, from fleet-wide upgrade metrics, and from the upgrade events a connector streams.

**Per VM.** A VM record carries `lastUpgradeTime`, `upgradeStartTime`, `upgradeEndTime`, `upgradeDayOfWeek` (documented as Sunday by default) and `upgradeStatus`, an int32 described only as the scheduled upgrade status, with no enum. [cloud-connector.upgrades.monitoring:vm-upgrade-fields] What the integer upgrade status means is open, with the VM status flags, in [Meaning of the per-VM status flags and integer upgrade status](kb:cloud-connector.insights.connector-status:vm-status-codes).

**Across the fleet.** A group API read returns Cloud Connector release-channel and scheduled-upgrade metrics: counts of VMs per release channel and per upgrade state (blocked, bootstrapping, failed, scheduled, up to date), filterable by platform, release channel, location, group name and upgrade status (SCHEDULED, NO_PENDING_UPGRADE, FAILED_OTHER, BOOTSTRAPPING, BLOCKED). [cloud-connector.upgrades.monitoring:upgrade-metrics]

**As events.** The start and end of each upgrade, with Success or Fail, are streamed as event logs: [UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name.](kb:cloud-connector.logs.event-records:upgrade-events).

What to check:
1. Whether any VMs are counted as failed or blocked in the upgrade metrics after a window.
2. Whether an UPGRADE_END event with severity Error arrived for the connector, which names the failure where the integer status does not.

Area: cloud-connector.upgrades, its subjects in references/_meta/spine/cloud-connector/cloud-connector.upgrades.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/cloud-connector/cloud-connector.logs.event-records.md (Cloud Connector event logs: state changes for health, tunnels, gateways and upgrades): UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]
- logged-in references/_meta/text/types/ztw/event-log.md (Cloud & Branch Connector Event log (NSS feed)): UPGRADE_START (Info) carries the current version, the new version and the package name; UPGRADE_END carries the current version, an upgrade status of Success for Info and Fail for Error, and the package name. [cloud-connector.logs.event-records:upgrade-events]
- scoped-by references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling), from cloud-connector.upgrades: On the Cloud Connector Groups overview, selected groups or connectors can be given an upgrade schedule (a day and time for periodic software updates) or a new release channel, and each group shows its Upgrade Window. [cloud-connector.upgrades:group-actions]
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.connector-status.md (Cloud Connector status: what Active, Inactive and Disabled mean, and the per-VM API record)
