# About the Application Catalog for Microsegmentation

**Source:** https://help.zscaler.com/zpa/about-application-catalog-microsegmentation
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This is a scoped summary of the current rendered Help article. It records the
portal surface needed by the reference corpus rather than copying the article's
images and navigation.

The Application Catalog gives administrators visibility into applications used
to generate machine-learning (ML) tags that can be applied to resource groups.
It lists applications and application categories used for ML resource-tag
recommendations and supports comparison across the collected application data.

## Portal surface

The page is under **Policies > Access Control > Segmentation > Application
Catalog**. Administrators can refresh the page, show or hide columns and
filters, and paginate the result table.

Filters are available for:

- Application Name
- Application Category
- Process
- Protocol
- Port

Each result can expose:

- **Application Name**
- **Application Category**
- **Process Name**
- **Protocol**, including protocol types such as UDP and TCP
- **Port Start**
- **Port End**

## Source boundary

This article documents the Zscaler Admin Console. It does not enumerate a
GraphQL query, REST endpoint, SDK filter type, or other programmatic contract.
The presence of process, protocol, and port filters in the portal must not be
used by itself to claim that the same filters exist in the Microsegmentation
API or an SDK.
