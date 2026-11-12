# The ZCC v2 API: RESTful paths, offset paging and the list envelope (zcc.api.v2-wire)
Also called: zcc papi public v2; zcc notification templates api; zcc zia posture profiles api; zcc skip perPage keyword; PaginatedResponseV2; zcc v2 404

Three ZCC object families have a v2 API under `/zcc/papi/public/v2`: notification templates, ZIA posture profiles and trusted networks. Only the Go SDK and the Terraform provider call them; the Python SDK and the captured contract do not cover them.

## Paging

The Go SDK pages v2 lists by offset with the query parameters `skip` and `perPage`, searches with `keyword`, and adds per-family filters: `type` for trusted networks and `platformType` for ZIA posture profiles. [zcc.api.v2-wire:offset-query] The Go SDK's model says every v2 list endpoint wraps its records in an object with `items`, `total`, `offset`, `limit` and `count`, unlike the v1 lists, which it describes as bare JSON arrays. [zcc.api.v2-wire:list-envelope]

How the Go helper walks pages, and where it can skip records or loop, is in [The ZCC v2 helper advances `Skip` by the page size it asked for, after a page that is neither empty, short against `Limit`, nor past `Total`. It never advances by the returned `Count` or `Limit`.](kb:shared.sdk-go.list-pagination:zcc-skip-advances-by-requested-size) and [Two of the ZCC v2 helper's three exits depend on envelope metadata: `Limit > 0` for the short-page check and `Total > 0` for the total check. A non-empty page whose `limit` and `total` are 0 triggers neither, so the helper keeps requesting pages until one comes back empty. The first exit, `Count == 0`, needs no metadata beyond `count`: a server that omits `count` stops the walk after one page.](kb:shared.sdk-go.list-pagination:zcc-guards-need-envelope-metadata). The page size the Go SDK sends is its own: [The ZCC v2 drain helper clamps its page size like the v1 helper (0 or less becomes 50, more than 5000 becomes 5000), and all three v2 callers pass the default of 50. The single-page `ReadPageV2` turns 0 or less into 50 but does not cap a larger value.](kb:shared.sdk-go.list-pagination:zcc-v2-page-size). What the server caps or defaults is open [How ZCC v2 endpoints cap page size and fill the paging envelope](kb:shared.sdk-go.list-pagination:zcc-v2-envelope-behavior).

## Families

The Go SDK says the v2 `keyword` search is a substring match, so its lookups by name for notification templates, ZIA posture profiles and trusted networks narrow by keyword on the server and then compare names case-insensitively on the client. [zcc.api.v2-wire:name-lookup-substring] Trusted networks: [What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs](kb:zcc.api.trusted-networks-wire).

A v2 ZIA posture profile as the Go SDK models it has an integer `id`, a `name`, an integer `platform`, and three trust levels (`highTrustCriteria`, `mediumTrustCriteria`, `lowTrustCriteria`), each a `cs` array of criteria sets whose `cn` arrays hold criteria with `id`, `name` and `udid`. [zcc.api.v2-wire:posture-shape] The Go SDK says the ZIA posture list's `platformType` filter selects a device platform, with 0 meaning all platforms. [zcc.api.v2-wire:posture-platform-filter]

A v2 notification template as the Go SDK models it uses JSON booleans for its toggles and nests ZIA and ZPA settings in `ziaNotificationTemplate` and `zpaNotificationTemplate`, unlike the `notificationTemplateContract` block inside an iOS web policy, whose 0/1 flags are quoted strings. [zcc.api.v2-wire:notification-template-shape]

The captured Automate contract has no operations for notification templates or ZIA posture profiles, though the Terraform provider manages both as resources. [zcc.api.v2-wire:contract-lacks-v2] The OneAPI Postman collection has no ZCC v2 request either: none of its `{{ZCCBaseUrl}}` requests is under `/v2` or names trusted-networks, notification-templates or zia-posture-profiles, so the Go SDK and the Terraform provider are the only sources for these endpoints. [zcc.api.v2-wire:postman-lacks-v2] Whether v2 replaces the v1 endpoints is open [Whether the v2 trusted-network API replaces v1 and shares its records](kb:zcc.api.trusted-networks-wire:v1-v2-coexistence).

What to check:
1. Whether the tenant serves the v2 family at all, from the status of a one-item list call, before debugging a v2 object read.
2. Whether a v2 list was paged with `skip` and `perPage` and read from `items`, not with v1's `page` and `pageSize`.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.api.v2-wire:postman-lacks-v2] Tier B: A search of the collection at the pin for `{{ZCCBaseUrl}}/v2`, `{{ZCCBaseUrl}}/papi/public/v2`, `trusted-networks` and `zia-posture` found nothing; `notification-templates` appears only in ZIA DLP help links. The collection's ZCC requests are the 9 in "Client Connector" and the 50 in "Zscaler Client Connector", all v1 or the login.

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zcc/zcc.api.trusted-networks-wire.md (What goes on the wire for ZCC trusted networks: the v1 webTrustedNetwork and v2 trusted-networks APIs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.api.md (The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes)
