---
product: zpa
topic: "b2b-federation"
title: "ZPA Business-to-Business Federation"
content-type: reference
last-verified: "2026-08-12"
verified-against:
  vendor/zscaler-help: f25ce272f7a62b45afbbabb6cf475cd325700201
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd
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
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/browser_access_groups/browser_access_groups.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/federated_application/federated_application.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/one_identity_controller/one_identity_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_rule/policy_group_rule.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_set/policy_group_set.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/policycommon/policycommon.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go"
  - "vendor/zscaler-sdk-python/CHANGELOG.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/one_identity.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/one_identity.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/policy_group_rule.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/policy_group_set.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py"
author-status: draft
---

# ZPA Business-to-Business Federation

Source: `vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md`.

Business-to-Business Federation is a limited-availability ZPA feature announced
on July 20, 2026 that establishes trusted relationships between business
partners (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:55-59`).

## Partner trust lifecycle

Source: `vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md`.

Administrators can create partner-federation requests, manage incoming and
outgoing requests, and manage trusted federated partners
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:60-61`). Once
trust is established, an application segment can be federated to a partner with
granular controls for the shared resources and users
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:62-63`).

## ZPA cloud service API

Source: `vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md`; `vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go`; `vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py`.

The release summary states that the same federation functionality is supported
through the ZPA cloud service API
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:64-65`). The
Help and release capture identifies linked topics for partner and pending-request
management, federating partners and applications, and retrieving access-policy
details for federated applications, but it does not contain endpoint paths,
HTTP methods, or request and response bodies
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:66-68`).

The SDKs now provide client-declared endpoint evidence for part of that gap.
The comparison below is intentionally about wrapper behavior only: an SDK
package or changelog entry is not proof that a tenant exposes the operation or
has the corresponding B2B entitlement.

## New Go ZPA surfaces and unresolved cross-SDK contract

Source: `vendor/zscaler-sdk-go/CHANGELOG.md`; `vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/browser_access_groups/browser_access_groups.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/federated_application/federated_application.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/one_identity_controller/one_identity_controller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_rule/policy_group_rule.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_set/policy_group_set.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policycommon/policycommon.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go`; `vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py`; `vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py`; `vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py`; `vendor/zscaler-sdk-python/zscaler/zpa/one_identity.py`; `vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py`.

At Go `4b7101202cde25e1e60552f1cb215d2c70cdc3bd`, the B2B policy controller
uses the admin-customer base and calls the guest-policy path with `GET` through
the shared paginator, returning typed policy rules
(`vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go:13-35`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go:231-260`). Python's
`b2b_policy` wrapper uses the non-admin customer base, also issues `GET`, and
returns the raw response rather than a typed rule collection
(`vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py:23-59`). The Go changelog
calls this operation `PUT`
(`vendor/zscaler-sdk-go/CHANGELOG.md:83-87`). The method conflict is therefore
between changelog prose and both executable SDKs; the base-path and response
shape differences remain open.

The same Go change adds related ZPA packages whose paths do not form a complete
cross-SDK contract:

| Go package | Source-declared surface | Cross-SDK / changelog observation |
|---|---|---|
| `federated_application` | Typed, paginated `GET /application/host/{hostID}` plus `PUT /application/federate` with `applicationGid` and `guestGids` (`vendor/zscaler-sdk-go/zscaler/zpa/services/federated_application/federated_application.go:28-66`). | Python lists `/application/host` without the host ID and updates `/application/{application_id}` (`vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py:26-68,70-104`); the Go changelog advertises the Go paths (`vendor/zscaler-sdk-go/CHANGELOG.md:83-86`). |
| `customer_domain_controller` | Admin-customer `GET /v2/associationtype/{type}/domains`, decoded as a bare array; no Go write method (`vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go:12-40`). | Python adds `POST` `add_update_domain` to the same path (`vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py:26-90,92-171`), and the Go changelog advertises both GET and POST (`vendor/zscaler-sdk-go/CHANGELOG.md:88-90`). |
| `browser_access_groups` | Admin-customer `/browserAccessGroups`; typed model and read-only `GetAll`/`Get` methods (`vendor/zscaler-sdk-go/zscaler/zpa/services/browser_access_groups/browser_access_groups.go:28-67,179-195`). | No corresponding module is captured in the Python ZPA tree; the nearby Python Browser Access module is for application-segment variants (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py:19-31`). The Go PR #456 changelog list is silent on this package (`vendor/zscaler-sdk-go/CHANGELOG.md:57-90`). |
| `one_identity_controller` | Admin-customer `GET /iamidpmapping` returning one typed object (`vendor/zscaler-sdk-go/zscaler/zpa/services/one_identity_controller/one_identity_controller.go:11-42`). | Python calls the same path as a list and its nested model has `syncVersion`, which is absent from the Go model (`vendor/zscaler-sdk-python/zscaler/zpa/one_identity.py:26-68`; `vendor/zscaler-sdk-python/zscaler/zpa/models/one_identity.py:59-89`). The changelog is silent. |
| `policy_group`, `policy_group_rule`, `policy_group_set` | Go adds typed policy-group reads/update/delete/all/reorder, typed rule list/create/get/delete/reorder, and read-only set/rule/summary/statistics methods (`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go:37-159`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_rule/policy_group_rule.go:31-133`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group_set/policy_group_set.go:29-166`). | Go `CreateRule` posts to `/policyGroupSet/{set}/rule` and `ReorderGroup` uses `PUT .../rule/{group}/reorder`, while Python creates at `POST .../group` and reorders at `PUT .../group/{group}/reorder` (`vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go:102-150`; `vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py:38-77,364-388`). The Go changelog instead describes `GET .../group` as "Add a new Policy Group" and lists reorder as POST (`vendor/zscaler-sdk-go/CHANGELOG.md:57-73`). |

The policy packages also share `DesktopPolicyMappings` and add `groupId`,
`linkText`, and `url` fields to the v2 policy model
(`vendor/zscaler-sdk-go/zscaler/zpa/services/policycommon/policycommon.go:1-22`;
`vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go:124-166`).
These are model/wire declarations, not proof of a tenant-side feature.

## Open questions / gaps

Source: `vendor/zscaler-sdk-go/CHANGELOG.md`; `vendor/zscaler-sdk-go/zscaler/zpa/services/b2b_policy_controller/b2b_policy_controller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/customer_domain_controller/customer_domain_controller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/federated_application/federated_application.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/browser_access_groups/browser_access_groups.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/one_identity_controller/one_identity_controller.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/policy_group/policy_group.go`; `vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py`; `vendor/zscaler-sdk-python/zscaler/zpa/customer_domain.py`; `vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py`; `vendor/zscaler-sdk-python/zscaler/zpa/one_identity.py`; `vendor/zscaler-sdk-python/zscaler/zpa/policy_group.py`.

- Does the B2B guest-policy operation use the Go/Python `GET`, or the Go
  changelog's `PUT`, and is the admin-customer or non-admin customer base
  canonical?
- Is `POST /v2/associationtype/{type}/domains` a supported write operation even
  though the Go package omits it, or is the Go changelog/Python surface stale?
- Are both federated-application path forms valid for different operations, or
  is one SDK using a stale/alternate route? Confirm host-ID semantics and the
  update target with a contract or live call.
- Is `browser_access_groups` intentionally Go-only, or simply not yet ported to
  Python? The source tree cannot establish tenant availability or entitlement.
- Does `/iamidpmapping` return a single object or a list, and should Go model
  `syncVersion`?
- Is Go `CreateRule` intentionally a policy-group-set rule operation, and should
  `ReorderGroup` use `/rule/` or `/group/`? The executable clients and changelog
  disagree on operation names and paths.

## Segment-side SDK surface

Source: `vendor/zscaler-sdk-go/CHANGELOG.md`; `vendor/zscaler-sdk-python/CHANGELOG.md`; `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentbrowseraccess/application_segment_browser_access.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentinspection/zpa_application_segment_inspection.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegmentpra/zpa_application_segment_pra.go`; `vendor/zscaler-sdk-go/zscaler/zpa/services/common/common.go`; `vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py`.

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
