# ZCC admin users on the wire: the admin sync operations and the serviceType field (zcc.api.admin-users-wire)
Also called: zcc admin sync; syncZiaZdxAdminUsers; syncZpaAdminUsers; getAdminUsersSyncInfo; zcc admin not visible; zcc admin serviceType

Client Connector Portal admins can come from ZIA, ZDX and ZPA, and the API has operations that synchronize ZCC's local copy of them. This subject records what those operations are described as doing and how admin records are typed.

**Sync.** `POST /syncZiaZdxAdminUsers` synchronizes ZCC's local copy of all ZIA and ZDX admin users and `POST /syncZpaAdminUsers` that of the ZPA admin users; `GET /getAdminUsersSyncInfo` is described as synchronizing the local copy of admin users. [zcc.api.admin-users-wire:sync-operations] Whether admins added in another product are missing from ZCC until a sync runs is open [gap:zcc.api.admin-users-wire:sync-visibility].

**Records.** The Go SDK reads an admin user's `serviceType` as an integer (1 ZIA, 2 ZPA, 3 ZID, 4 ZDX) and says the API sends it as a JSON number; an earlier string type failed to decode. [zcc.api.admin-users-wire:service-type-number] The contract types the field as a string [divergence:zcc.api.admin-users-wire:service-type-wire-type].

What to check:
1. Whether a sync ran after the admin was added in ZIA, ZDX or ZPA, when that admin is missing from the Client Connector Portal.

Sources disagree (name both sides):
- The JSON type of an admin user's `serviceType`: the contract defines a string, the Go SDK says the API sends a number. [divergence:zcc.api.admin-users-wire:service-type-wire-type]
  - api-specs: The contract's `getAdminUsers` response types `serviceType` as a string with byte format.
  - sdk-go: The Go SDK types it as an int because the API emits a JSON number, and a string type caused decode failures.
  Impact: A strictly typed client generated from the contract fails to decode admin users when the field arrives as a number.

Not known (open gaps):
- Whether admins added elsewhere appear in ZCC only after a sync [gap:zcc.api.admin-users-wire:sync-visibility]: settled by lab-test or support-ticket. Blocks: explaining an admin who exists in ZIA but not in the Client Connector Portal

Area: zcc.api, its subjects in references/_meta/spine/zcc/zcc.api.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zcc/zcc.api.md (The ZCC API from a client's side: hosts, sign-in, limits, conventions and wire notes)
- see-also references/_meta/text/zcc/zcc.api.rate-limits.md (ZCC API rate limits: 100 calls an hour, 3 a day for downloads, and how the SDKs back off)
