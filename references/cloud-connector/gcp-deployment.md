---
product: ztw
topic: "gcp-deployment"
title: "Cloud Connector on GCP — resource synchronization cadence"
content-type: reference
last-verified: "2026-07-22"
confidence: high
source-tier: code
verified-against:
  vendor/terraform-gcp-cloud-connector-modules: 0e8a8b82c45c7317d00f052a0b036396a1a184d8
sources:
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md"
  - "vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf"
  - "vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md"
author-status: draft
---

# Cloud Connector on GCP — resource synchronization cadence

This reference is intentionally limited to the resource-synchronization behavior exposed by Zscaler's vendored GCP Terraform module. The module deploys a `resource-sync-function` for GCP-to-Zscaler resource reconciliation and an optional Cloud Scheduler job that invokes it (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md:22-26,40-45`; `vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:249-262,331-353`).

## Resource-sync behavior and cadence

The module documentation says the resource-sync function reconciles the VM-instance list in the GCP project with the Zscaler Cloud Connector portal and removes dangling portal VM resources that no longer exist in GCP (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md:22-26`). The Terraform scheduler resource describes a 30-minute trigger and sets the cron expression to `*/30 * * * *` in UTC (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:331-339`).

The captured upstream pull request records that the `resource_sync` schedule changed from `*/10` to `*/30`. It describes the job as sampling GCP managed-instance-group state against Zscaler EC-group state and says the reduced sampling frequency is intended to lower the probability of the TOCTOU delete race tracked as `BUG-238838` (`vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md:10-13`). The vendored Terraform module reflects the resulting `*/30` cadence (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:331-339`).

When the optional, default-enabled scheduler is used, a dangling-resource reconciliation waits for a scheduled invocation. **Inference:** based on the `*/30` cron expression, schedule-induced delay can approach one 30-minute interval; this is not a stated cleanup SLA (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/README.md:26,43-45`; `vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:331-339,348-353`).

## Source boundary

The schedule change is explicitly a statistical mitigation, not a code fix. The upstream pull request states that the underlying race still requires a minimum-age gate in the private `resource_sync_entry` Cloud Function implementation and that work is tracked separately (`vendor/zscaler-upstream-notes/terraform-gcp-cloud-connector-pr-33.md:15-19`). The Terraform module identifies `resource_sync_entry` as the function entry point and deploys it from a configured storage object, but it does not expose the function body in this Terraform file (`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:249-262`). Accordingly, the `*/30` setting establishes the mitigation cadence, not implementation of the required code fix.

## Cross-links

- Cloud-agnostic architecture: [`./overview.md`](./overview.md)
- Supported-region boundaries: [`./regions.md`](./regions.md)
- Cloud Connector reference hub: [`./index.md`](./index.md)
