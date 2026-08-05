# Cloud & Branch Connector Release Upgrade Summary (2026) — Scoped Capture

**Source:** https://help.zscaler.com/cloud-branch-connector/release-upgrade-summary-2026
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.release_notes`) extraction.

---

This capture retains the 2026 entries relevant to GCP deployment, Zero Trust
Gateway, Cloud & Branch Connector group APIs, and Azure partner integrations.

## August 3 — GCP Zero Trust Gateway

The release notes introduce GCP Zero Trust Gateway as a fully managed,
cloud-native SaaS security offering. It secures cloud-to-internet and
cloud-to-cloud workload traffic without customer-managed security
infrastructure. The feature is in Limited Availability.

## July 6 — Layer 4 ingress

Cloud & Branch Connector adds Source Network Address Translation and
Destination Network Address Translation for AWS, Azure, and GCP. The same entry
announces Azure Gateway Load Balancer support through Terraform.

## May 29 — AWS Zero Trust Gateway regions

AWS Zero Trust Gateway support adds `ap-south-2` and `ap-southeast-4`.

## May 11 — release channels and upgrade APIs

Cloud Connector upgrades add **stable**, **latest**, and **beta** release
channels. The associated API entry adds:

- `PUT /ecgroup/releaseChannel` — update the release channel for VMs.
- `PUT /ecgroup/vmStatus` — update VM status in bulk.
- `GET /ecgroup/vmUpgradeMetrics` — retrieve release-channel and scheduled
  upgrade metrics.

## March 26 — GCP image and Terraform package

The GCP VM image is updated to `zs-cc-ga-03092026`. The release entry directs
new deployments to GCP Terraform scripts v0.3.1 and says those scripts default
to the new Google Cloud Marketplace image.

## March 6 — Azure partner-integration APIs

The release notes add programmatic Azure account, group, region, subscription,
resource-group, storage-account, permission, and topic-synchronization access:

- `GET /publicCloudTenant`
- `POST /publicCloudTenant`
- `GET /publicCloudTenant/ccGroups`
- `GET /publicCloudTenant/count`
- `GET /publicCloudTenant/supportedRegions`
- `GET /publicCloudTenant/{id}`
- `PUT /publicCloudTenant/{id}`
- `DELETE /publicCloudTenant/{id}`
- `PUT /discoveryService/azure/subscriptionSync`
- `POST /discoveryService/azure/tenantPermission`
- `POST /discoveryService/azure/{region}/resourceGroups`
- `POST /discoveryService/azure/{region}/storageAccounts`
- `PUT /discoveryService/azure/{region}/topicSync`

A separate March 6 entry increases the maximum number of subscriptions under
one Azure partner-integration account from 32 to 128.

## February 9 — GCP MIG autoscaling

Cloud Connector VM version `zs-cc-ga-02042026` adds GCP MIG autoscaling. The
entry says portal references to autoscaling also refer to a MIG with
autoscaling, and that Support must enable the feature.
