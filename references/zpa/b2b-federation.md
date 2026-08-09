---
product: zpa
topic: "b2b-federation"
title: "ZPA Business-to-Business Federation"
content-type: reference
last-verified: "2026-07-22"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md"
author-status: draft
---

# ZPA Business-to-Business Federation

Business-to-Business Federation is a limited-availability ZPA feature announced
on July 20, 2026 that establishes trusted relationships between business
partners (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:55-59`).

## Partner trust lifecycle

Administrators can create partner-federation requests, manage incoming and
outgoing requests, and manage trusted federated partners
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:60-61`). Once
trust is established, an application segment can be federated to a partner with
granular controls for the shared resources and users
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:62-63`).

## ZPA cloud service API

The release summary states that the same federation functionality is supported
through the ZPA cloud service API
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:64-65`). The
local capture identifies linked topics for partner and pending-request
management, federating partners and applications, and retrieving access-policy
details for federated applications, but it does not contain endpoint paths,
HTTP methods, or request and response bodies
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:66-68`).

## Open questions

- **Detailed API contract** - The endpoint paths, HTTP methods, request and
  response bodies, and detailed semantics for partner requests, partner and
  application federation, and federated-application access-policy retrieval are
  not established by the local release capture
  (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:64-68`) -
  *unverified, requires captured bodies for the linked API topics*

## Cross-links

- Application segment model: [`./app-segments.md`](./app-segments.md)
- Access policy evaluation: [`./policy-precedence.md`](./policy-precedence.md)
- ZPA API overview: [`./api.md`](./api.md)
