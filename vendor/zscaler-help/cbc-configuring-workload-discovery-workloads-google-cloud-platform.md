# Configuring Workload Discovery for Workloads in Google Cloud Platform

**Source:** https://help.zscaler.com/cloud-branch-connector/configuring-workload-discovery-workloads-google-cloud-platform
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

The workload discovery service is Zscaler-managed. It discovers GCP workloads
and cloud/user metadata that can be used in security policy.

## Discovered attributes

The article lists these attribute paths:

- `labels`
- `tags`
- `networkInterfaces.network`
- `networkInterfaces.subnetwork`
- `serviceAccounts.email`
- `machineType`
- `zone`
- `disks.sourceImage`

## Discovery identity and permissions

The service uses Google Cloud Asset Inventory `searchAllResources`, whose quota
is enforced per GCP project. The article advises other tools using that API to
use a different quota/consumer project to avoid shared rate-limit contention.

Zscaler uses service-account impersonation and short-lived credentials. The
documented viewer-style access includes Compute Viewer, Cloud Asset Viewer, and
Browser, with Browser limited to the service-account project. The following
APIs must be enabled per project:

- IAM Service Account Credentials
- Cloud Resource Manager
- Cloud Asset
- Compute Engine

The customer grants the Zscaler service-account identity the Service Account
Token Creator role. The Cloud Connector service account is also assigned
`roles/pubsub.editor` so connector VMs can receive workload-delta messages.

## Polling and VM-start notifications

Workload discovery polls every five minutes by default. For near-instant VM
start updates, the article describes Pub/Sub notifications and adds
`roles/pubsub.owner` and `roles/pubsub.viewer` to the Cloud Connector VM. A
logging sink captures `compute.instances.start`, publishes it to the shared
topic, and triggers immediate discovery polling.

## Terraform deployment package

The Admin Console supplies a downloadable Terraform ZIP with:

- `core_infra`, which creates service accounts, IAM roles, and logging sinks.
- `centralized_grants`, which grants cross-project discovery permissions.

The package automates service-account configuration, impersonation rights,
logging sinks, and Pub/Sub subscriptions for workload-change events.
