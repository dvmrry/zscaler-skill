# Cloud & Branch Connector Groups API — Upgrade Operations

**Source:** https://help.zscaler.com/legacy-apis/cloud-branch-connector-groups
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` endpoint discovery and the page-linked OpenAPI 3.0.1 document.
**OpenAPI source:** https://help.zscaler.com/sites/default/files/api-docs/Cloud%20%26%20Branch%20Connector%20Groups_13.json?VersionId=AcpXRh4d1F6lve7tJzLeWXSMdGjnPHCW

---

The release-note link under `/cloud-branch-connector/cloud-branch-connector-groups`
resolves to this legacy-API reference page.

## `PUT /ecgroup/releaseChannel`

Updates release channels for Cloud Connector VMs in bulk. The request schema
is `EcVmReleaseChannelReq`:

- `releaseChannel`: `STABLE`, `LATEST`, or `BETA`.
- `vmGroupIds`: array of integer Cloud Connector group IDs.
- `vmIds`: array of integer Cloud Connector VM IDs.

## `PUT /ecgroup/vmStatus`

Updates the status of Cloud Connector VMs in bulk. The request schema is
`EcVmStatusUpgradeReq`:

- `status`: `ENABLE` or `DISABLE`.
- `vmGroupIds`: array of integer Cloud Connector group IDs.
- `vmIds`: array of integer Cloud Connector VM IDs.

The response schema `EcVmStatusSummary` carries `failedVms`, an object that
maps failed VM entries to string results.

## `GET /ecgroup/vmUpgradeMetrics`

Retrieves release-channel and scheduled-upgrade metrics. Query filters include:

- `deployType`: `CLOUD`.
- `autoScale`: boolean.
- `zeroTrustGroup`: boolean.
- `platform`: one or more of `AWS`, `AZURE`, or `GCP`.
- `releaseChannel`: one or more of `STABLE`, `LATEST`, or `BETA`.
- `locationId`: one or more integer location IDs.
- `name`: Cloud Connector group name.
- `upgradeStatus`: one or more of `SCHEDULED`, `NO_PENDING_UPGRADE`,
  `FAILED_OTHER`, `BOOTSTRAPPING`, or `BLOCKED`.

The response schema `VmUpgradeMetrics` reports release channel, total devices
scheduled for upgrade, and upgrade status.

These operations make the group API mutable for release-channel and VM-status
management. No immediate per-VM “upgrade now” operation appears in this scoped
OpenAPI page.
