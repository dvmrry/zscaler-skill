# What the SDKs send and receive for ZPA Privileged Remote Access objects (zpa.api.pra-wire)
Also called: credential pool waap-pra-config; pra console bulk; pra approval workingHours cron; credential move targetMicrotenantId; pra portal getcName; connectionSecurity NLA; credential password returned on GET
Former IDs: zpa-23

This subject records what the SDKs send and receive for Privileged Remote Access objects that is not a plain field list: base paths, keys, defaults and response handling. The product behavior is in [PRA components: portals, consoles, approvals, credentials, policies and limits](kb:zpa.pra.components), [PRA credentials, credential pools and the credentials policy](kb:zpa.pra.credentials) and [PRA approvals: requesting, reviewing and expiry](kb:zpa.pra.approvals), and the Python tooling in [PRA operations in the Python SDK and Ansible approvals](kb:zpa.pra.tooling).

## Credential pools

Credential pools use the base path /zpa/waap-pra-config/v1/admin/customers/ in both SDKs, while the privileged approval, console, credential and portal resources use /zpa/mgmtconfig/v1/admin/customers/. The OpenAPI document has no credential-pool path. [zpa.api.pra-wire:credential-pool-base-path] A credential pool's members travel under the key `credentials`, not `praCredentials`: the Go field is tagged `credentials` without omitempty, and the Python SDK rewrites credential_ids to a list of id objects under `credentials`. The pool's credentialMappingCount is a string tagged omitempty. [zpa.api.pra-wire:credential-pool-wire-shape] The Go SDK's credential pool Create sends the POST with no response target, then lists all pools and returns the first whose name matches case-insensitively; if none matches it returns an error although the pool was created. [zpa.api.pra-wire:credential-pool-create-lookup]

Whether the undocumented credential-pool endpoints are a supported API surface is open [gap:zpa.api.pra-wire:credential-pool-not-in-contract].

## Consoles and portals

The bulk console create takes and returns a top-level array of consoles. The Python SDK's add_bulk_console accepts snake_case input (pra_application_id, pra_portal_ids), builds each entry itself with only name, enabled, praApplication, praPortals and description (enabled defaulting to True and description to an empty string), merges the extra keyword arguments into every entry, and sets the body after request creation. The request is created with body None and the list is attached afterwards as the request's json, which the HTTP client sends as given, so the camel-case conversion that create_request applies to a dict body is not applied to it: merged keyword arguments such as microtenant_id are sent in every entry in snake case as given. [zpa.api.pra-wire:console-bulk-body]

The Go SDK's PRA portal sends enabled, userNotification, userNotificationEnabled, extDomain, extDomainName, extDomainTranslation and extLabel without omitempty, so false and empty-string values are always on the wire. [zpa.api.pra-wire:portal-no-omitempty] The CNAME key differs between tools [divergence:zpa.api.pra-wire:portal-cname-key].

The connectionSecurity values a PRA sub-application accepts are in [The API's `connectionSecurity` on a PRA sub-application takes ANY, NLA, NLA_EXT, TLS, VM_CONNECT or RDP, and the Python docstring lists the same six; the Go PRA sub-application field is a plain string with no value list.](kb:zpa.api.app-segments-wire:connection-security-values).

## Approvals

A privileged approval's workingHours carries both a human-readable startTime and endTime (the Terraform provider validates them as HH:MM) and cron-expression startTimeCron and endTimeCron, plus days and timeZone. The Go SDK's comments define the cron form as seven fields: seconds, minutes, hours, day of month, month, day of week and year. [zpa.api.pra-wire:working-hours-fields] A privileged approval's top-level startTime and endTime are integers in the specification and strings in the Go struct; the Python SDK converts RFC 1123 style time strings to epoch, rejects a start more than one hour in the past and an end more than 365 days after the start, and uses the working-hours time zone or UTC. [zpa.api.pra-wire:approval-times] A privileged approval's status is one of INVALID, ACTIVE, FUTURE or EXPIRED in the specification. [zpa.api.pra-wire:approval-status-values]

In the Go SDK a privileged approval's workingHours pointer and applications slice are tagged without omitempty, and Create and Update pass the PrivilegedApproval as the request body. [zpa.api.pra-wire:approval-nil-working-hours] Under Go's encoding/json, a nil workingHours and an applications slice that was never set are therefore sent as null, and only an empty non-nil applications slice is sent as an empty array. [zpa.api.pra-wire:approval-nil-sent-as-null] DELETE /approval/expired takes an optional microtenantId query parameter and is documented with a 200 response whose body is an object, unlike the other PRA deletes and updates that return 204. The Go SDK's DeleteExpired passes the service's microtenant as that filter. [zpa.api.pra-wire:approval-delete-expired]

## Credentials

The specification's credentialType values are USERNAME_PASSWORD, SSH_KEY and PASSWORD. The Python SDK validates exactly those on create, requires the fields each type needs, and accepts an SSH private key only if it contains an OpenSSH, RSA or EC PEM header. [zpa.api.pra-wire:credential-type-values] POST /credential/{id}/move has no request body and returns 204; the destination is the targetMicrotenantId query parameter, where 0 means the Default microtenant. The Python SDK raises an error when target_microtenant_id is falsy; the Go SDK appends the parameter only when the string is non-empty. The contract also takes an optional microtenantId query parameter. The Python SDK forwards microtenant_id as microtenantId; Go's CredentialMove has no per-call microtenantId parameter and ignores the service's microtenant, so microtenantId reaches the request only from the ZPA_MICROTENANT_ID environment variable or the client's configured microtenant. [zpa.api.pra-wire:credential-move] A Python caller moving a credential to the Default microtenant passes the string "0" for target_microtenant_id: the integer 0 is falsy and is rejected, while the non-empty string "0" passes the check. [zpa.api.pra-wire:credential-move-zero-string]

Whether a credential read returns its secrets is open [gap:zpa.api.pra-wire:credential-secrets-on-read].

## Updates

PUT on a privileged approval, console, credential and portal returns 204 No Content in the specification. When the response has no body (the documented 204), the Python SDK's update for approvals, consoles, credentials, portals and credential pools returns an object holding only the id, so the response cannot be used to read back updated fields. [zpa.api.pra-wire:update-returns-204]

Whether the POST body carries the ID is open [gap:zpa.api.pra-wire:credential-pool-post-id].

What to check:
1. Whether a credential pool call used the waap-pra-config base path rather than mgmtconfig before reading a 404 as a missing pool.
2. Whether a bulk console request was a top-level array and whether the SDK dropped fields outside the five it copies.
3. Whether an approval's times were epoch values and inside the one-hour and 365-day client bounds.
4. Whether a credential move to the Default microtenant passed the string 0 rather than the integer.
5. Whether the caller read back an updated object after a PUT instead of trusting the id-only return.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.pra-wire:approval-nil-sent-as-null] Tier B: Follows from approval-nil-working-hours: neither tag has omitempty, and Create and Update send the struct as the body. That encoding/json writes a nil pointer and a nil slice as null and an empty non-nil slice as [] is Go standard-library behaviour, which no source here states. What the API does with a null workingHours on update is not established.
- [zpa.api.pra-wire:credential-move-zero-string] Tier B: Follows from the quoted `if not target_microtenant_id:` check and Python truthiness (integer 0 is falsy, the non-empty string "0" is truthy). No source shows a call with either value.

Sources disagree (name both sides):
- The wire key for a PRA portal's computed CNAME: the specification and the Python model use `getcName`, while the Go struct also has a writable `cName` field. [divergence:zpa.api.pra-wire:portal-cname-key]
  - api-specs: The specification defines the CNAME on a portal as getcName.
  - sdk-go: The Go struct carries both a `cName` field and a `getcName` field.
  - sdk-python: The Python model maps only getcName, to get_cname.
  Impact: A portal's CNAME target is read from getcName; a value set through the Go cName field has no counterpart in the specification, so do not rely on it.

Not known (open gaps):
- Whether the API returns password, privateKey and passphrase when a privileged credential is read [gap:zpa.api.pra-wire:credential-secrets-on-read]: settled by lab-test or tenant-data. Blocks: telling whether reading a credential exposes its secrets to the caller or to logs
- Whether a credential pool POST returns the new pool's ID [gap:zpa.api.pra-wire:credential-pool-post-id]: settled by lab-test. Blocks: needing the ID of a pool right after creating it
- Whether the undocumented waap-pra-config credential-pool endpoints are a supported API surface [gap:zpa.api.pra-wire:credential-pool-not-in-contract]: settled by support-ticket. Blocks: telling whether a credential-pool field or call can be relied on and checked against a published contract

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.api.app-segments-wire.md (Application segment wire behavior: what each SDK sends, drops and matches across the four segment kinds)
- links-to references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry)
- links-to references/_meta/text/zpa/zpa.pra.components.md (PRA components: portals, consoles, approvals, credentials, policies and limits)
- links-to references/_meta/text/zpa/zpa.pra.credentials.md (PRA credentials, credential pools and the credentials policy)
- links-to references/_meta/text/zpa/zpa.pra.tooling.md (PRA operations in the Python SDK and Ansible approvals)
