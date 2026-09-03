---
product: zpa
topic: "b2b-federation"
title: "ZPA Business-to-Business Federation"
content-type: reference
last-verified: "2026-08-12"
verified-against:
  vendor/zscaler-help: dbe545d5918392c4067ff897e748698c80220fef
  vendor/zscaler-sdk-go: 4b7101202cde25e1e60552f1cb215d2c70cdc3bd
  vendor/zscaler-sdk-python: 5bef9cbdb85d881502899bf98550496df0ecb0db
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md"
  - "vendor/zscaler-help/zpa-understanding-business-business-b2b-federation.md"
  - "vendor/zscaler-help/zpa-configuring-business-business-federation.md"
  - "vendor/zscaler-help/zpa-about-pending-requests-partners.md"
  - "vendor/zscaler-help/zpa-about-federated-partners.md"
  - "vendor/zscaler-help/zpa-federating-defined-application-segments.md"
  - "vendor/zscaler-help/zpa-about-access-policies-defined-partners.md"
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
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/federate-applications/federate-application"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/federate-applications/get-federated-applications-from-host"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/create-federation-token"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/delete-provisioning"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/get-active-federation-partners"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/get-provisionings"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/request-approval"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/update-federation-state"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/update-notes"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/update-provisioning-state"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/verify-token"
  - "https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/policies-for-b2b-federation/get-partner-policy-rules-on-federated-apps"
author-status: draft
---

# ZPA Business-to-Business Federation

Source: `vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md`; `vendor/zscaler-help/zpa-understanding-business-business-b2b-federation.md`.

Business-to-Business Federation is a limited-availability ZPA feature announced
on July 20, 2026 that establishes trusted relationships between business
partners (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:55-59`).

## Partner trust lifecycle

Source: `vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md`; `vendor/zscaler-help/zpa-about-pending-requests-partners.md`; `vendor/zscaler-help/zpa-about-federated-partners.md`; `vendor/zscaler-help/zpa-federating-defined-application-segments.md`.

Administrators can create partner-federation requests, manage incoming and
outgoing requests, and manage trusted federated partners
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:60-61`). Once
trust is established, an application segment can be federated to a partner with
granular controls for the shared resources and users
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:62-63`).

## B2B prerequisites and roles

Source: `vendor/zscaler-help/zpa-understanding-business-business-b2b-federation.md:12-35`.

The current Help page marks B2B Federation as **limited availability** and
requires a ZPA Federation license. Both partners need a ZPA tenant, must
complete administrator migration to Authentication Service, and must have
Zscaler Experience Center enabled. Both partners need an active Private Access
license, but only the host partner needs the Federation license to share
applications (`vendor/zscaler-help/zpa-understanding-business-business-b2b-federation.md:12-23`).

The host tenant owns the private application and the guest tenant represents
the user organization. Both administrator roles need the **Partner** permission;
the host administrator also needs **Federate Application**. Both partners must
originate from the same cloud (`vendor/zscaler-help/zpa-understanding-business-business-b2b-federation.md:16-27`).

The Help prerequisites require App Connectors or Private Service Edges at
version `24.298.1` or later and list these minimum Zscaler Client Connector
versions: Windows `4.7.0.88` or `4.6.0.282`, macOS `4.5.2.98`, iOS `4.4.1` with
Use Tunnel SDK Version `4.3` or above enabled, Android `3.10`, and Linux `4.2`
(`vendor/zscaler-help/zpa-understanding-business-business-b2b-federation.md:25-35`).

## Host/guest token and approval workflow

Source: `vendor/zscaler-help/zpa-configuring-business-business-federation.md:16-39`; `vendor/zscaler-help/zpa-about-pending-requests-partners.md:12-17`.

Before configuration, both the host and guest administrators should be
available during the configured **Token Validity (In Hours)** period, and either
partner can initiate the process (`vendor/zscaler-help/zpa-configuring-business-business-federation.md:16-18`).
The public console workflow has three steps: generate and share an access
token, verify the token and send an approval request, then approve the
federation request (`vendor/zscaler-help/zpa-configuring-business-business-federation.md:20-26`).

The generating administrator opens **Add Partner**, selects **Generate Access
Token**, confirms **My Tenant**, optionally adds notes, chooses token validity,
and generates the token. The token is shown once, is valid only for the
selected period, and is then shared with the partner
(`vendor/zscaler-help/zpa-configuring-business-business-federation.md:28-32`).
The partner selects **Verify Access Token**, pastes the token, and clicks
**Verify**; after validation, **Send Approval Request** sends the request to the
partner administrator and places it on Pending Requests. A token is single-use,
invalid after use or expiration, and separate tokens are required for each
partner (`vendor/zscaler-help/zpa-configuring-business-business-federation.md:34-39`).

The Pending Requests capture clarifies the cross-tenant gate: the guest submits
the request and token details, the host reviews and validates them, and after
token verification both the host and guest partner must approve or deny the
pending request. After approval, it appears on Federated Partners
(`vendor/zscaler-help/zpa-about-pending-requests-partners.md:12-17`).

## Pending, federated, and defined application states

Source: `vendor/zscaler-help/zpa-about-pending-requests-partners.md:19-27`; `vendor/zscaler-help/zpa-about-federated-partners.md:12-24`; `vendor/zscaler-help/zpa-federating-defined-application-segments.md:12-20`.

**Pending Requests** is the intermediate request state. Its documented request
statuses are **Token Verified**, **Pending Approval**, and **Pending
Verification**; the page describes this state as an auditable step before
controlled cross-tenant resource and user access
(`vendor/zscaler-help/zpa-about-pending-requests-partners.md:19-27`).

**Federated Partners** represents established trust: the host and guest
administrators' B2B request has been approved by both partners. The page lists
**Active**, **Pause**, and **Terminate** as partner status values/actions and
allows administrators to view federated applications and navigate back to
Pending Requests (`vendor/zscaler-help/zpa-about-federated-partners.md:12-24`).

The application-segment federation workflow starts on the host's **Defined
Application Segments** page: the administrator uses **Federate Application**,
selects one or more trusted partners, and saves the selection
(`vendor/zscaler-help/zpa-federating-defined-application-segments.md:12-17`).
If a partner is deselected and the change is saved, guest partner end users
immediately lose access to all applications
(`vendor/zscaler-help/zpa-federating-defined-application-segments.md:19-20`).

## Federating defined application segments

Source: `vendor/zscaler-help/zpa-federating-defined-application-segments.md:12-33`.

Applications using IP addresses cannot be federated because of possible IP
overlap and routing conflicts in the guest partner's network. Before federation,
the application segment must have **Source IP Anchor**, **Double Encryption**,
**Bypass**, **Bypass during Reauthentication**, **ZIA Inspection**, and
**AppProtection** disabled (`vendor/zscaler-help/zpa-federating-defined-application-segments.md:22-33`).

## Access policies for shared applications

Source: `vendor/zscaler-help/zpa-about-access-policies-defined-partners.md:12-24`.

The **Defined by Partners** access-policy page lists rules created by the guest
partner for the host partner's applications. **Defined by My Tenant** lists
rules defined by the host for its internal applications and users
(`vendor/zscaler-help/zpa-about-access-policies-defined-partners.md:12-16`).
Each policy row exposes its name and rule action; documented actions are
**Allow Access**, **Block Access**, and **Require Approval**
(`vendor/zscaler-help/zpa-about-access-policies-defined-partners.md:18-24`).

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

The current public Automate operation pages expose the following twelve-route
contract for application federation, tenant-federation provisioning, and
partner policy retrieval. These are publication-level method/path/body
statements; they do not establish tenant entitlement, limited-availability
gating, or live backend acceptance.

| Capability | Method and path | Published contract details |
|---|---|---|
| [Federate application](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/federate-applications/federate-application) | `PUT /mgmtconfig/v1/customers/{customerId}/application/federate` | `customerId:int64`; optional `microtenantId:int64`; required body `applicationGid:int64` and `guestGids[]`; response `applicationGid`, `guestIds[]`, and `message`. |
| [Get federated applications from host](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/federate-applications/get-federated-applications-from-host) | `GET /mgmtconfig/v1/customers/{customerId}/application/host/{host_id}` | `customerId:int64` and `host_id:int64`; optional `microtenantId`, `page`, `pagesize`, and `search`; paged wrapper with `currentCount`, `list`, `message`, `totalCount`, and `totalPages`. Entries include domains, enabled state, ID/name, port ranges, and `hostInfo` with approval/federation status and partner identity. |
| [Create federation token](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/create-federation-token) | `POST /mgmtconfig/v1/customers/{customerId}/tenant-federation/token` | Optional `microtenantId`; required `expiryTimeInSeconds:int64` (33,600–86,400); optional `notes`; response contains `id:int64`, `token`, and `tokenExpirationEpochSeconds:int64`. |
| [Delete provisioning](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/delete-provisioning) | `DELETE /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}` | `customerId` and `federation_id` are required IDs; optional `microtenantId`; 204 response with no body. |
| [Get active federation partners](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/get-active-federation-partners) | `GET /mgmtconfig/v1/customers/{customerId}/tenant-federation/partners` | Optional `microtenantId`, `page`, `pagesize`, and `search`, plus sort fields; paged partner entries expose approval/federation status, partner GID/name, and partner scope name. |
| [Get provisionings](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/get-provisionings) | `GET /mgmtconfig/v1/customers/{customerId}/tenant-federation` | Optional `microtenantId`, `page`, `pagesize`, `search`, `sortBy`, and `sortDir`; entries expose creation/modification times, ID, initiator state, notes, partner information, and provisioning status (`PENDING_VERIFICATION`, `PENDING_APPROVAL`, `APPROVED`, `DENIED`, `TERMINATED`). |
| [Request approval](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/request-approval) | Current route entry only | The slug is present in the current sitemap, but its search-index document is the generic Automation Hub shell. Method, path, body, and response details are therefore not asserted from the current public page. |
| [Update federation state](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/update-federation-state) | `PUT /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}/federation-state/{status}` | Required IDs; `status` is `INACTIVE` or `ACTIVE`; optional `microtenantId`; 204 response. |
| [Update notes](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/update-notes) | Current route entry only | The slug is present in the current sitemap, but its search-index document is the generic Automation Hub shell. Method, path, body, and response details are therefore not asserted from the current public page. |
| [Update provisioning state](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/update-provisioning-state) | `PUT /mgmtconfig/v1/customers/{customerId}/tenant-federation/{federation_id}/provisioning-state/{status}` | Required IDs; `status` is `APPROVED`, `DENIED`, or `TERMINATED`; optional `microtenantId`; 204 response. |
| [Verify federation token](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/partner-federation-provisioning/verify-token) | `POST /mgmtconfig/v1/customers/{customerId}/tenant-federation/token/verify` | Optional `microtenantId`; body requires `token`; response includes partner information, partner notes, success, and token expiration epoch seconds. |
| [Get partner policy rules on federated apps](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/policies-for-b2b-federation/get-partner-policy-rules-on-federated-apps) | `GET /mgmtconfig/v1/customers/{customerId}/policySet/rules/policyType/GLOBAL_POLICY/guest/{guest_id}` | Required `customerId:int64` and Partner Guest ID `guest_id:int64`; optional `microtenantId`, `page`, `pagesize`, and `search`; paged response contains a large policy-rule object with actions, conditions, app-connector groups, app-server groups, and service-edge groups. |

The Help release summary remains the source for the feature's limited-
availability and trust-lifecycle framing: administrators create and manage
incoming/outgoing partner-federation requests and trusted partners, then
federate application segments with granular controls after trust is
established (`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:55-68`).

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

## Python SDK coverage and source-quality gaps

The Python SDK provides **partial** coverage rather than no B2B surface. The
`application_federation` service lists applications from a host and updates an
application; `tenant_federation_provisioning` lists provisionings and partners
and provides add/update/delete methods; and `b2b_policy` retrieves global policy
rules (`vendor/zscaler-sdk-python/zscaler/zpa/application_federation.py:26-104`;
`vendor/zscaler-sdk-python/zscaler/zpa/tenant_federation_provisioning.py:26-199`;
`vendor/zscaler-sdk-python/zscaler/zpa/b2b_policy.py:23-59`). It does not expose
explicit methods for the current token-create, token-verify, approval,
federation-state, notes, or provisioning-state actions.

The SDK host-list path is `/zpa/mgmtconfig/v1/customers/{customer_id}/application/host`
and does not include the Automate page's `/{host_id}` suffix; its tenant-
federation methods likewise construct `/zpa/mgmtconfig/...` paths, while the
current Automate pages present `/mgmtconfig/...`. Treat this as a service-prefix
and operation-shape divergence to reconcile before using a raw SDK-generated
URL, not as proof that either surface is universally accepted.

The current B2B pages type `microtenantId` as optional `int64` where a schema is
published. Seven existing scoped operations—app-connector-group listing,
provisioning-key create/delete/list/get/update, and service-edge-group listing—
also gained optional `microtenantId` metadata, but their current source entries
provide a description without a type schema. The normalized field is therefore
`type:null`; preserve that source-quality gap rather than inferring a type or
validation rule. See the current
[app-connector-group list](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/app-connector-group/gets-all-configured-app-connector-groups-for-the-specified-customer),
[provisioning-key list](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/nonce/gets-details-of-all-configured-provisioning-keys-for-the-specified-customer),
[private broker groups](https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zpa/service-edge-group/get-private-broker-groups)
pages. The source descriptions mention `0` for the Default scope and `null`
for customer data, but do not establish broader acceptance semantics.

## Open questions

- **Route-registry boundary** - The current sitemap establishes twelve B2B
  route entries, but the `request-approval` and `update-notes` pages currently
  expose only generic-shell search metadata, so their method/path/body/response
  contracts remain unverified here. The adjacent visible-version-profile route
  is likewise generic in the current index; do not carry forward its previously
  observed `page`, `pagesize`, and `search` fields without a durable capture.
- **Live contract boundary** - The ten re-readable current Automate pages
  establish the publication-level method/path/schema details shown above, but do not
  establish tenant entitlement, limited-availability gating, authentication
  scope requirements, or live backend acceptance. A tenant-side check or
  current detailed Help body is still required for those questions.
- **Segment-field semantics** - The SDKs establish `guestDetails`,
  `hbrEnabled`, `stickyEntity`, and `stickyGroup` as current wire fields, but do
  not establish accepted values or how those fields participate in partner
  federation. Tracked as [clarification `zpa-83`](../_meta/clarifications.md#zpa-83-application-segment-hbr-sticky-and-guestdetails-semantics).

## Cross-links

- Application segment model: [`./app-segments.md`](./app-segments.md)
- Access policy evaluation: [`./policy-precedence.md`](./policy-precedence.md)
- ZPA API overview: [`./api.md`](./api.md)
