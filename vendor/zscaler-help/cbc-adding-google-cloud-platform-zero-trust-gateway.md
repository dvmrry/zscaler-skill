# Adding a Google Cloud Platform Zero Trust Gateway

**Source:** https://help.zscaler.com/cloud-branch-connector/adding-google-cloud-platform-zero-trust-gateway
**Captured:** 2026-08-04 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

GCP Zero Trust Gateways are in Limited Availability and require Zscaler
Support enablement.

The add workflow is under **Infrastructure > Connectors > Cloud > Zero Trust
Gateway -- GCP**. The configuration contract rendered by the article is:

- **Gateway Name** identifies the gateway.
- **Region** selects the GCP region. A gateway can be deployed in one region,
  and the region cannot be changed after creation.
- **Availability Zone** requires at least two zones for the gateway
  components.
- **Location Name** is optional. When supplied, the location is available to
  policy and is synchronized between the Cloud Connector and Internet & SaaS
  policy pages.
- **Location Template** selects the template for the associated location.

The IAM Principals tab accepts a principal value and one of three principal
types: **User**, **Group**, or **Service Account**. The service checks an
incoming connection and allows it when it comes from an intercept endpoint
group associated with an added IAM principal. The principal is associated with
the customer's VPC.

The Review tab precedes the final **Create** action.
