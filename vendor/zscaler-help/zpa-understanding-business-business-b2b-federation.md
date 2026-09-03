# Understanding Business-to-Business (B2B) Federation

**Source:** https://help.zscaler.com/zpa/understanding-business-business-b2b-federation
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/zpa/understanding-business-business-b2b-federation
**Help node:** `1540783`
**Help revision:** `3224116`
**Body content length:** 30,040 HTML characters
---

This feature is in **limited availability** and requires a Private Access (ZPA)
Federation license. The page directs readers to contact Zscaler Support for
more information.

Business-to-Business (B2B) Federation enables organizations to provide
Zero Trust access to private applications across independent Private Access
tenants. A host tenant owns the application and a guest tenant represents the
user organization. The page states that both partners need a Private Access
tenant, must complete admin migration to Authentication Service, and must have
Zscaler Experience Center enabled. The page also states that partners need an
active Private Access license, but only the host partner needs a Federation
license to share applications.

Both partners need the Partner permission in their administrator role, and the
host partner needs the Federate Application permission. Both partners must
originate from the same cloud. The page lists App Connector/Private Service
Edge version 24.298.1 or later and these Zscaler Client Connector prerequisites:

- Windows: `4.7.0.88` or later, or `4.6.0.282` or later.
- macOS: `4.5.2.98` or later.
- iOS: `4.4.1` or later, with the Use Tunnel SDK Version `4.3` or above setting
  enabled in the Zscaler Client Connector Portal.
- Android: `3.10` or later.
- Linux: `4.2` or later.

## Federation process

The page describes Zero Trust Partner Federation as a secure token exchange:

1. Establish mutual trust between the Private Access tenants.
2. The host publishes private application segments to the guest.
3. The guest configures an access policy for the host-published segments.

The page defines host partner, guest partner, application consumer,
provisioning, deprovisioning, and Partner Federation request terminology. It
lists native partner collaboration, mergers/acquisitions/divestitures,
multi-tenant/MSSP environments, and federal/public-sector compliance as use
cases.

This capture preserves the page's limited-availability and licensing
statements. It does not establish commercial availability, entitlement for a
particular tenant, or an Automate/SDK API contract.
