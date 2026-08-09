# About Google Cloud Platform Zero Trust Gateways

**Source:** https://help.zscaler.com/cloud-branch-connector/about-google-cloud-platform-zero-trust-gateways
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

## Availability and service boundary

- Google Cloud Platform (GCP) Zero Trust Gateway is a Zscaler cloud-native
  service offering in GCP.
- GCP gateways are in Limited Availability. Zscaler Support must enable the
  feature.
- The service secures internet-bound and private-destination workload traffic
  without requiring the customer to manage the security infrastructure.
- Private Access support is limited to web traffic. Internet & SaaS
  functionality is supported.

## Documented restrictions

- DNS interception is not supported.
- Network Security Integration (NSI) packet interception removes the
  high-bandwidth networking benefit of third-generation-or-newer machine
  series. The article says not to configure NSI for a VM that requires more
  than 7 Gbps.
- Regional network firewall policies are not supported for packet intercept.
- In-band integration is not supported for Google Cloud VMware Engine,
  Google Distributed Cloud-Hosted, Google Distributed Cloud-Edge, Google
  Private Cloud, Google Cloud Run, or GKE Enterprise.
- To make a network firewall policy evaluate before classic VPC firewall
  rules, the article renders this command:

  ```shell
  gcloud compute networks update vpc-name--network-firewall-policy-enforcement-order=BEFORE_CLASSIC_FIREWALL
  ```

  The command is preserved as rendered; this capture does not repair or infer
  omitted whitespace.

## GCP Gateway page

The portal path is **Infrastructure > Connectors > Cloud > Zero Trust Gateway
-- GCP**. The page supports search, refresh, add, edit, delete, filtering, and
detail analysis.

The table exposes name, internal ID, region, availability-zone ID, intercept
deployment group, intercept-endpoint-group count, location, creation and
modification times, and service status. Service status values are **Healthy**,
**Unhealthy**, and **Not Available**.

An intercept deployment group is described as the GCP resource through which
Zscaler intercepts and inspects VPC workload traffic. An intercept endpoint
group is described as a project-wide resource through which a project accesses
the Zscaler-managed security service.
