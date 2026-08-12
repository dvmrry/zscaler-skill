---
product: zpa
topic: "b2b-federation"
title: "ZPA Business-to-Business Federation"
content-type: reference
last-verified: "2026-08-12"
verified-against:
  vendor/zscaler-sdk-go: c87854fb29ae0e97beccf0345c99fdd49252ea5a
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md"
  - "vendor/zscaler-sdk-go/CHANGELOG.md"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py"
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

## Segment-side SDK surface

Go v3.8.45 and Python v1.9.41 add a `guestDetails` field to application
segments alongside `hbrEnabled`, `stickyEntity`, and `stickyGroup`
(`vendor/zscaler-sdk-go/CHANGELOG.md:16,23-27`;
`vendor/zscaler-sdk-python/CHANGELOG.md:3-19`). In Go, the new field is present
on the base, Browser Access, Inspection, and PRA segment variants. Each guest
record contains `federationId`; its nested partner record exposes approval and
federation status plus partner GID, name, and scope name
(`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go:61-73`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go:57-62`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go:57-61`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go:51-59`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:161-172`).

That shape is consistent with the Help-described act of federating an
application segment to a trusted partner, but the release notes do not map the
four new fields to API operations, accepted enums, or lifecycle transitions.
Treat it as segment-side schema evidence, not as the missing B2B endpoint
contract. Python uses one shared segment model for the same top-level fields,
but v1.9.41 cannot decode a non-null `guestDetails[].partnerInfo` because the
constructor references `common.PartnerInfo` while the new class is local to the
application-segment module
(`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:74-90,1164-1208`).
Use the Go model or raw HTTP until that wrapper defect is corrected.

## Open questions

- **Detailed API contract** - The endpoint paths, HTTP methods, request and
  response bodies, and detailed semantics for partner requests, partner and
  application federation, and federated-application access-policy retrieval are
  not established by the local release capture
  (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:64-68`) -
  *unverified, requires captured bodies for the linked API topics*
- **Segment-field semantics** - The SDKs establish `guestDetails`,
  `hbrEnabled`, `stickyEntity`, and `stickyGroup` as current wire fields, but do
  not establish accepted values or how those fields participate in partner
  federation. Tracked as [clarification `zpa-83`](../_meta/clarifications.md#zpa-83-application-segment-hbr-sticky-and-guestdetails-semantics).

## Cross-links

- Application segment model: [`./app-segments.md`](./app-segments.md)
- Access policy evaluation: [`./policy-precedence.md`](./policy-precedence.md)
- ZPA API overview: [`./api.md`](./api.md)
