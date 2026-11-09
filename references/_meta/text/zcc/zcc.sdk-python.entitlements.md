# The Python SDK's ZCC entitlement methods: what they read and why they cannot write (zcc.sdk-python.entitlements)
Also called: update_zpa_group_entitlement; update_zdx_group_entitlement; get_zpa_group_entitlements; get_zdx_group_entitlements; python entitlements empty body

How the API and the Go SDK shape these calls is in [ZCC entitlement calls: response and update body shapes](kb:zcc.api.entitlements-wire).

**Reading.** For ZCC responses, the Python SDK wraps a single-object body in a one-item list, so its entitlement getters work whether the API returns one object or a list. [zcc.sdk-python.entitlements:single-object-wrapped] The Python SDK's entitlement models cast each `groupList` and `deviceGroupList` entry (ZDX: `upmGroupList`, `upmDeviceGroupList`) with `str()`, so a group object arrives as its Python string form rather than as fields. [zcc.sdk-python.entitlements:python-group-entries-stringified]

**Writing.** The Python SDK's `update_zpa_group_entitlement` and `update_zdx_group_entitlement` take no arguments and send an empty JSON body. [zcc.sdk-python.entitlements:python-update-empty-body] So entitlements cannot be changed through the Python SDK's update methods. [zcc.sdk-python.entitlements:python-cannot-write] What the API does with the empty body is open in [What the update endpoints do with an empty body](kb:zcc.api.entitlements-wire:empty-update-effect).

Inferred, not quoted (say so when an answer rests on one):
- [zcc.sdk-python.entitlements:python-cannot-write] Tier B: Follows from the empty body; the server's response to it is open.

Area: zcc.sdk-python, its subjects in references/_meta/spine/zcc/zcc.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.api.entitlements-wire.md (ZCC entitlement calls: response and update body shapes)
