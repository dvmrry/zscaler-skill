# Deployment Templates for Zscaler Cloud Connector — GCP Scope

**Source:** https://help.zscaler.com/cloud-branch-connector/deployment-templates-zscaler-cloud-connector
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction; scoped to the GCP section.

---

Zscaler publishes Infrastructure as Code deployment templates for AWS, Azure,
and GCP. The GCP templates are Terraform templates and can deploy into a new or
existing VPC.

## GCP template families

The article lists:

- **Basic:** Starter Deployment Template; Starter Deployment Template with
  Private Access.
- **Internal Load Balancer:** Starter; Starter with Private Access; Custom.
- **MIG Autoscaling with Internal Load Balancer:** Starter; Starter with
  Private Access; Custom.

The article says an autoscaling template must be used for an autoscaling
deployment and a non-autoscaling template for a non-autoscaling deployment.

## Common resource shape

The GCP template descriptions include separate management and service VPC
networks, routers, NAT, and subnets; peering between the management and service
VPCs; workload and bastion resources; a Cloud Connector instance template; a
service interface on the service VPC; and a management interface on the
management VPC.

Internal-load-balancer variants add a standard passthrough internal load
balancer, a regional backend service, health checks, a forwarding rule, and
load-balancer firewall rules. Private Access variants add Cloud DNS firewall
rules and managed forwarding zones.

MIG-autoscaling variants additionally describe:

- A Cloud Connector MIG and Compute Autoscaler policy.
- Health Monitor and Resource Sync Cloud Functions.
- Cloud Scheduler jobs for both functions.
- A storage bucket containing the Zscaler Cloud Function ZIP.
- A VM service account with secret-access and Monitoring Metric Writer roles.
- A shared function service account with secret access, Compute Instance
  Admin, Monitoring Viewer, Logs Writer, and Cloud Run Invoker.

The resource inventories are template descriptions; they do not themselves
define the current deployment-region list.
