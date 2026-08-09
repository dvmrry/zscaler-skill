# Analyzing Google Cloud Platform Zero Trust Gateway Details

**Source:** https://help.zscaler.com/cloud-branch-connector/analyzing-google-cloud-platform-zero-trust-gateway-details
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

GCP Zero Trust Gateways are in Limited Availability and require Zscaler
Support enablement.

The detail page exposes **Dashboard**, **Status**, **Intercept Information**,
**Config**, **Analytics**, **Events**, and **Traffic Simulation**.

## Dashboard and status

The dashboard identifies the gateway name, service status, internal Zero Trust
Gateway ID, cloud provider, creation and modification dates, intercept
deployment group, region, location template, availability zones, location, and
the configured user, group, and service-account IAM principals.

Per availability zone, the Status tab reports:

- **Internet** -- reachability to Internet & SaaS.
- **Local Egress** -- ability to forward direct traffic.
- **Private Applications** -- reachability to Private Access.

The corresponding health values are:

- **Healthy** -- backend traffic is operating as expected.
- **Unhealthy** -- traffic is dropped because no healthy backend processing is
  available.
- **Degraded** -- redundancy may be reduced, but traffic is still forwarded.

Intercept information identifies the project-wide intercept endpoint group
and the GCP project in which it was created.

## Configuration, analytics, and events

The Config tab records activated Internet & SaaS configuration versions,
submission time, and Active or Inactive status. The article says a gateway can
reject an activated version if that version prevents the gateway from
functioning, and the page supports comparing two versions.

Analytics reports total bytes and packets processed by the internal load
balancer for a selected time frame. Events report event, category, type, start
time, and status.

## Traffic simulation

Traffic Simulation creates a temporary environment in Zscaler's GCP account,
sends traffic through the endpoint, and returns GCP curl output for forwarding
and Internet & SaaS policy tests. Creation takes approximately five minutes;
the environment lasts one hour and can be renewed for another hour. A test
created for one GCP gateway is available to the other GCP gateways in the same
Cloud Connector account across regions.
