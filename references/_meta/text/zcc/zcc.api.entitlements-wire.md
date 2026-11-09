# ZCC entitlement calls: response and update body shapes (zcc.api.entitlements-wire)
Also called: getZpaGroupEntitlements; updateZpaGroupEntitlement; getZdxGroupEntitlements; updateZdxGroupEntitlement; UpdateZpaGroupEntitlements; entitlements api shape

Paths and methods are in the generated API surface. The shapes are where the sources part ways. What the settings mean is in [ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group](kb:zcc.entitlements).

**Reading.** The API document and a recorded response return one object per call, while the Go SDK reads a list [divergence:zcc.api.entitlements-wire:get-response-shape]. The Python SDK accepts either: [For ZCC responses, the Python SDK wraps a single-object body in a one-item list, so its entitlement getters work whether the API returns one object or a list.](kb:zcc.sdk-python.entitlements:single-object-wrapped).

**Writing.** The update body in the API document is not the shape the Go SDK sends [divergence:zcc.api.entitlements-wire:update-body-shape]. The Python SDK sends an empty body: [The Python SDK's `update_zpa_group_entitlement` and `update_zdx_group_entitlement` take no arguments and send an empty JSON body.](kb:zcc.sdk-python.entitlements:python-update-empty-body). What the API does with an empty update is open [gap:zcc.api.entitlements-wire:empty-update-effect].

What to check:
1. Before scripting a change, compare the body your client sends with the API document's update body.
2. Before relying on a Go SDK read, check whether the tenant returns one object or a list.

Sources disagree (name both sides):
- Whether a GET of ZPA or ZDX entitlements returns one object or a list [divergence:zcc.api.entitlements-wire:get-response-shape]
  - api-specs: The API document's response is a single object holding `groupList`, `deviceGroupList`, the switches and `totalCount` (the ZDX response likewise), with `page`, `pageSize` and `search` parameters.
  - sdk-go: The Go SDK decodes each page into a list of entitlement objects and pages until a page is shorter than the page size.
  - sdk-python: Recorded responses from one test tenant (recorded with SDK 1.9.13, Python SDK cassette) are a single JSON object for both the ZPA and the ZDX call, with and without paging parameters.
  Impact: The API document and the one recorded tenant agree on a single object. The Go SDK decodes the body into a list, which does not fit that shape, so a Go read of entitlements is likely to fail on such a tenant; whether any tenant returns a list is not shown. The Python SDK accepts either shape and takes no side.
- What the update body for ZPA or ZDX entitlements contains [divergence:zcc.api.entitlements-wire:update-body-shape]
  - api-specs: The API document's update body uses `enableForAll`, `computeDeviceGroups`, `groupIds`, `groupNames`, `deviceGroupIds`, `deviceGroupNames` and `machineTunEnabledForAll` (ZDX: `logoutZCC` instead of the machine tunnel field), and returns a success envelope.
  - sdk-go: The Go SDK sends the read shape back: `zpaEnableForAll`, `groupList` and `deviceGroupList` objects, `computeDeviceGroupsForZPA`, and decodes the response as an entitlement object.
  Impact: A Go SDK update may send keys the endpoint does not read, so an entitlement change can appear to succeed without taking effect.

Not known (open gaps):
- What the update endpoints do with an empty body [gap:zcc.api.entitlements-wire:empty-update-effect]: settled by lab-test

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.sdk-python.entitlements.md (The Python SDK's ZCC entitlement methods: what they read and why they cannot write)
- links-to references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group)
