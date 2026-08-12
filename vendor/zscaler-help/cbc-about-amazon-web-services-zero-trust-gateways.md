# About Amazon Web Services Zero Trust Gateways

**Source:** https://help.zscaler.com/cloud-branch-connector/about-zero-trust-gateways
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Amazon Web Services (AWS) Zero Trust Gateway is a Zscaler cloud-native service
offering in public clouds. The article marks AWS gateways as **Limited
Availability** and says Zscaler Support must enable the feature.

## Service boundary

- Secures workload communication to the internet and private destinations as a
  Zscaler Zero Trust Cloud SaaS offering without customer-managed security
  infrastructure.
- Uses consistent security policies in multi-cloud environments.
- Removes the need to deploy NAT gateways, security infrastructure, load
  balancers, and virtual machines for the gateway service.
- Applies advanced firewall protection, SSL inspection, DLP, and IPS as a
  cloud-native service.

## AWS Gateway page

The portal path is **Infrastructure > Connectors > Cloud > Zero Trust Gateway
-- AWS**. The page supports search, refresh, add, edit, delete, filtering, and
detail analysis.

Gateway rows expose name, ID, region, availability-zone ID, endpoint service
name, location, endpoint count, operational status, and service status. The
documented service-status values are **Healthy**, **Unhealthy**, and **Not
Available**. Although operational status can be Enabled or Disabled, the
article says an administrator cannot disable AWS gateways.
