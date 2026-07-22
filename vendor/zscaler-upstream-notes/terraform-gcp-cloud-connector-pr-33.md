# Terraform GCP Cloud Connector — PR 33

**Source:** https://github.com/zscaler/terraform-gcp-cloud-connector-modules/pull/33
**Captured:** 2026-07-22 via GitHub API.
**Merged:** 2026-07-20T16:21:55Z.
**Commit:** `0e8a8b82c45c7317d00f052a0b036396a1a184d8`.

---

The upstream pull request changes the `resource_sync` schedule from `*/10` to
`*/30`. Its stated purpose is to reduce how often the Cloud Function samples
GCP managed-instance-group state against Zscaler EC-group state and thereby
lower the probability of a TOCTOU delete race tracked as `BUG-238838`.

The pull request explicitly characterizes the schedule change as a statistical
mitigation rather than a code fix. It says the underlying
`resource_sync_entry` race requires a minimum-age gate in the Cloud Function
itself; that implementation lives in a private `cloud-functions` repository
and is tracked separately.
