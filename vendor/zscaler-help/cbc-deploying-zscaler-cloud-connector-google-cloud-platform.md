# Deploying Zscaler Cloud Connector on the Google Cloud Platform

**Source:** https://help.zscaler.com/cloud-branch-connector/deploying-zscaler-cloud-connector-google-cloud-platform
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

The documented GCP deployment method is Terraform. The article says to deploy
an autoscaling template only as an autoscaling deployment and a non-autoscaling
template only as a non-autoscaling deployment.

## Required service-account boundaries

The deployment prerequisites distinguish three service-account roles:

1. An admin service account runs Terraform during deployment.
2. A service account is assigned for use by each Cloud Connector VM.
3. Autoscaling deployments use a service account for the Cloud Run functions.

The deployment account is granted the compute, network, security, service
account, secret, and project-IAM roles listed by the article. Autoscaling adds
Cloud Functions, Cloud Scheduler, and Storage administration. The VM account
is used to access credentials from GCP Secret Manager or HashiCorp Vault and,
for autoscaling, receives Monitoring Metric Writer. The Cloud Run function
account receives Compute Instance Admin, Monitoring Viewer, Logs Writer, and
Cloud Run Invoker, plus the selected secret-access method.

The article allows Terraform to create the VM and Cloud Run function service
accounts or allows the administrator to create them before deployment.

## Deployment and traffic routing

The workflow downloads the GCP Terraform repository, enters its `examples`
directory, and runs:

```shell
./zsec up
```

After deployment, workload traffic must be routed to Cloud Connector. The
documented route is a static IPv4 route whose destination is `0.0.0.0/0` and
whose next hop is an internal TCP/UDP load-balancer forwarding rule. The
workload network tag and the workload VPC are selected as part of that routing
workflow.

Once deployment is verified, the portal can apply Traffic Forwarding, Log and
Control Forwarding, and DNS Control policies.
