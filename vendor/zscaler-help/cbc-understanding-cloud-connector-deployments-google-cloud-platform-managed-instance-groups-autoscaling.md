# Understanding Cloud Connector Deployments with GCP Managed Instance Groups with Autoscaling

**Source:** https://help.zscaler.com/cloud-branch-connector/understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

## Topology and lifecycle

A GCP Managed Instance Group (MIG) with autoscaling adds or removes Cloud
Connector VMs as load changes. The MIG monitors VM health, replaces unhealthy
members, and replaces a member that an administrator manually terminates.
Stopping or rebooting a MIG member in the Google Cloud console can cause that
VM to be terminated.

The security stack can reside in a dedicated GCP project or in the workload
project. Because GCP requires distinct VPC networks for interfaces on a
multi-interface instance, the documented deployment creates separate
management and service/security VPCs. Custom routes in workload VPCs direct
traffic to the load balancer in front of the Cloud Connectors.

- Zonal MIGs are deployed in the configured regions or zones for high
  availability and inter-zone failover.
- A Cloud NAT gateway is deployed in each region to provide outbound access
  and dedicated external IPs.
- A Health Monitoring Cloud Run function evaluates custom VM metrics. Cloud
  Scheduler invokes it every minute by default.
- A Resource Sync Cloud Run function reconciles the Admin Console VM set with
  MIG membership. It deletes an Admin Console VM record that belongs to no
  instance group and runs every 10 minutes by default.
- The functions communicate with the Cloud Connector Admin API over HTTPS and
  do not interact directly with individual Cloud Connector VMs.

## Scaling policy documented by Help

Each Cloud Connector publishes data-plane CPU utilization at one-minute
intervals as `smedge_cpu_utilization`. Autoscaling evaluates the aggregate
metric for the MIG.

- The default target is 80% aggregate CPU utilization over two to three
  minutes.
- The Help article describes a default instance-group minimum of one VM and a
  default maximum of 10 VMs.
- In this GCP MIG scaling-policy section, the article states: **“The maximum
  cannot exceed the Cloud Connector group limit of 16 VMs per group.”**
- The default initialization period is 900 seconds. Scale-in considers members
  still initializing; scale-out ignores their utilization until initialization
  completes.

This capture preserves a public Help statement about the group limit. It does
not establish how a live tenant or API enforces that limit, nor does it replace
the defaults declared by a particular Terraform module or wrapper.

## Health monitoring

Each VM publishes `cloud_connector_aggr_health` at one-minute intervals, using
0 for unhealthy and 100 for healthy. The default recent-health window is 10
minutes; the default unhealthy threshold is five consecutive minutes, with a
flapping tolerance of seven unhealthy samples in the 10-minute window.

For missing metrics, the default actions are a warning after two minutes, a
critical log after five minutes, and a termination log plus VM deletion after
10 minutes. A terminated VM is replaced immediately.

## Access model

The article defines three service accounts for autoscaling deployments:

- Deployment Service Account.
- Cloud Connector VM Service Account.
- Cloud Function Service Account for Health Monitor and Resource Sync.

The deployment account runs Terraform. The VM account accesses credentials and
writes monitoring metrics. The function account allows the functions to read
metrics and terminate or replace VMs, using the documented compute, monitoring,
logging, and secret-access roles.
