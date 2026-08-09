---
product: zpa
topic: "privileged-remote-access"
title: "Privileged Remote Access (PRA) — clientless RDP/SSH/VNC"
content-type: reasoning
last-verified: "2026-07-22"
verified-against:
  vendor/zscaler-sdk-python: d2eb8096283e0aa32f88c0033bc77609caa0e5c9
  vendor/zpacloud-ansible: 9d7948b3f0ac3f5054391a0adb1b587e43e69891
  vendor/terraform-provider-zpa: 287e4c1f720d89d2405e0925c98dc4b050a93767
  vendor/zscaler-mcp-server: 080d175246f48d04f0f6b1b2cdacd1c646ffc37b
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/privileged-remote-access-captures.md"
  - "vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md"
  - "vendor/zscaler-sdk-python/docsrc/zs/guides/release_notes.rst"
  - "vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py"
  - "vendor/zpacloud-ansible/CHANGELOG.md"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_pra.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_inspection.py"
  - "vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py"
  - "vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_application_segment_pra.py"
  - "vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_pra_approval.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/pra_portal.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go"
  - "vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zpa/app_segments_pra.py"
  - "vendor/zscaler-mcp-server/skills/zpa/application_segment-pra-onboard/SKILL.md"
author-status: draft
---

# Privileged Remote Access (PRA) — clientless RDP/SSH/VNC

PRA is ZPA's privileged-access product surface: a clientless gateway that proxies RDP, SSH, and VNC sessions from a user's browser to internal servers, jump hosts, and bastion hosts — with credential pooling, approval workflows, capability controls (file transfer / clipboard), and full session recording. Confidence **medium** because several source articles returned Japanese-fallback during capture; re-verify quantitative claims against the live pages before leaning on them.

## When to use PRA vs. the alternatives

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go`.

| Need | Tool |
|---|---|
| Web app access without ZCC | **Browser Access** ([`./browser-access.md`](./browser-access.md)) — HTTP/HTTPS only |
| Native RDP/SSH with ZCC installed, credentials known, no recording | Standard ZPA access — treat the target as an app segment, user RDPs with their own creds over ZPA |
| RDP/SSH with **shared credentials**, **session recording**, **approval workflow**, or **clientless access** | **PRA** |
| Jump-host / bastion with full audit trail | **PRA** |
| Emergency admin break-glass with oversight | **PRA** |

Session recording, approval workflow, and credential pooling are documented as PRA features (`privileged-remote-access-captures.md:31-43, :55-61, :75-94`) and are implemented by dedicated PRA-specific API surfaces (`pra_approval.py:26`, `pra_credential_pool.py:25`). The Terraform PRA segment resource is hardcoded to `app_types = "SECURE_REMOTE_ACCESS"` (`resource_zpa_application_segment_pra.go:595`), distinct from the standard application-segment resource.

## Architecture

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go`.

```
user browser ──(HTTPS Privileged Portal)──▶ Zscaler PRA Gateway ──(RDP/SSH/VNC via App Connector)──▶ Privileged Console
```

- **Privileged Portal** — the end-user-facing entry point. A web-browser URL (behaves like Browser Access) for submitting requests and launching approved sessions.
- **PRA Gateway** — Zscaler-hosted protocol translator. Converts in-browser HTML5 session control into native RDP/SSH/VNC packets sent through the App Connector mesh.
- **Privileged Console** — the target system config object. One per host-protocol pair. A single bastion running both SSH and RDP has two console objects.
- **Privileged Application Segment** — a ZPA segment variant (`zpa_application_segment_pra` in TF) that exposes consoles to the policy engine.

All traffic traverses ZPA's App Connector outbound mesh; no inbound ports opened on the target.

## The six policy + config objects

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_portal.py`.

1. **Privileged Credentials** — stored creds for machine login. Three types: Username/Password (RDP, optional domain), SSH Key (username + key + optional passphrase), VNC Password. **Type is immutable** after creation.

2. **Privileged Credential Pools** — groups of credentials. Map via SAML/SCIM conditions to users who should be auto-logged in with a pooled cred. When the pool is exhausted (all creds in-use), access blocks.

3. **Privileged Credentials Policy** — maps users to credential pools. Drives "which user gets which cred set for which console."

4. **Privileged Approvals** — time-bounded access requests. Requester specifies console + start-date + duration + reason; approver reviews and grants with specified access window.

5. **Consoles Policy** — capability controls assigned to selected privileged
   consoles: file upload (optionally inspected through ZIA), file download,
   clipboard copy/paste, session recording, session sharing in Control or
   Monitor mode, and joining live sessions.

6. **Privileged Policies** (access policy rules) — gate who can request access to which console. Evaluated first-match-wins like other ZPA access policies. See [`./policy-precedence.md`](./policy-precedence.md) for evaluation semantics.

### SDK operations of note

Source: `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_console.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py`.

A few PRA operations map directly onto the behaviors above and are worth knowing exist when debugging or onboarding at scale. (Full method signatures live in [`./sdk.md`](./sdk.md); this is just the capability map.)

- **Pool-usage introspection** — `get_credential_pool_info(pool_id)` returns the credential info mapped to a pool (`pra_credential_pool.py:148`, GET `/credential-pool/{pool_id}/credential`). This is the operation an operator reaches for when chasing pool exhaustion: it shows which credentials a pool actually holds.
- **Expired-approval cleanup** — `expired_approval(microtenant_id)` bulk-deletes all expired privileged approvals (`pra_approval.py:367`, DELETE `/approval/expired`). Approvals auto-expire at window end (see §Approval workflow); this is the housekeeping call that clears the expired records out.
- **Bulk console onboarding** — `add_bulk_console(consoles)` creates multiple consoles in one call (`pra_console.py:353`, POST `/praConsole/bulk`), each tied to a `pra_application_id` and one or more `pra_portal_ids`.
- **Credential relocation across microtenants** — `credential_move(credential_id)` moves a credential between the parent tenant and a microtenant; `target_microtenant_id` is required and `0` targets the Default microtenant (`pra_credential.py:334`, POST `/credential/{credential_id}/move`).

## Credential pooling — why it matters

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py`.

The pool model decouples users from credentials. A team of 12 DBAs shares a pool of 3 database-admin creds; when a DBA launches a session, PRA auto-logs them in with whichever pooled cred is free. The DBA **never sees the password**. When the session ends, the cred returns to the pool.

**Implications:**

- Users can't leak creds they never know.
- Cred rotation is a central action — rotate the pool, every user's next session uses the new cred.
- **Pool exhaustion = access block**, not queue. If all 3 creds are busy, user 4 gets denied until one frees. Size pools for peak, not average.
- SAML / SCIM attributes drive which pool a user gets; changes in identity provider propagate automatically via policy eval.

## Approval workflow

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_portal.py`.

Not all PRA consoles require approval — approval is configured per-policy. For consoles that do:

1. User hits the **PRA Portal > My Requests** tab.
2. Selects microtenant + console + start date + duration + (optional) reason.
3. Submits.
4. Approver reviews (filter by console or requester) via **Analytics > Privileged Remote Access > Approval Requests**.
5. Approver approves with a grant window (can modify duration) or denies.
6. On approve, user gets time-bounded access. Access **auto-expires** at window end; no manual revoke required.

Approval metadata: requester, console, access period, reason, status, request timestamp. Retained in Analytics for audit.

## Session recording

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`.

All PRA sessions can be recorded; recording is managed per-console.

### Recording lifecycle (status enum)

| Status | Meaning |
|---|---|
| **Failed** | Recording didn't complete — invalid creds, network issue. |
| **Completed** | Session done; recording not yet post-processed. |
| **Available** | Ready for download but not streaming yet. |
| **Queued** | Awaiting transcoding. |
| **Transcoding** | Converting RAW → streaming format. |
| **Streaming Ready** | Transcoded and browser-playable. |

**Storage and access:** Server-side. Admins with the **Session Recording Full Access** role permission can download, stream, and share.

**Sharing:** URL copy with other admins in the same tenant. **Permalinks allow sharing at specific timestamps** — useful for "watch from minute 12" forensic reviews.

**Prioritized transcoding:** Admins can bump a recording to the front of the transcode queue for urgent review.

## ZPA application-segment integration

Source: `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go`.

PRA uses a dedicated segment variant. In Terraform that's `zpa_application_segment_pra`; in the Python/Go SDKs the resource type carries `_pra` suffixes on methods.

Relevant integration points from `references/zpa/app-segments.md`:

- **Multimatch is not supported** on segments containing PRA-enabled applications. From the reference architecture: "Multimatch must be disabled if the configuration contains applications using the Access Type of Browser Access, AppProtection, or Privileged Remote Access."
- **SIPA is not supported** on PRA segments — same architectural reason as Browser Access (protocol relay terminates before backend sees the packet).
- On PRA segments, each app entry carries a `connection_security` value, validated against the enum `ANY`, `NLA`, `NLA_EXT`, `TLS`, `VM_CONNECT`, `RDP` (`resource_zpa_application_segment_pra.go:268`). `VM_CONNECT` is one of these connection-security/protocol options, not a separate "action" — it pairs with an `application_protocol` of `RDP`, `SSH`, or `VNC` (`resource_zpa_application_segment_pra.go:260`).

A PRA app entry's `application_protocol` is validated against `RDP`, `SSH`, `VNC` (`resource_zpa_application_segment_pra.go:260`), and `app_types` is forced to `["SECURE_REMOTE_ACCESS"]` on every PRA app the resource builds (`resource_zpa_application_segment_pra.go:595`) — you don't set it yourself. That hardcoding is what distinguishes a PRA segment from a standard application segment at the API layer.

## Consoles Policy (what users can actually do in-session)

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`.

The live Help page now calls this surface **Consoles Policy**. The former
Privileged Capabilities Policy URL redirects to the current article. A policy
assigned to selected privileged consoles can enable:

- **File Uploads**, optionally inspected inline when the ZIA integration is
  available;
- **File Downloads**;
- **Clipboard Copy** from the console and **Clipboard Paste** into it;
- **Record Sessions**;
- **Share Sessions Mode** as Control or Monitor; and
- **Join Sessions Mode**.

These controls are disabled by default. Policy changes during a live session
do not affect that session; the new settings apply when a new session starts.
The Help article also states that recording captures screen output but excludes
file-transfer and clipboard-transfer contents
(`vendor/zscaler-help/privileged-remote-access-captures.md`).

For VNC-enabled consoles, enabling uploads or downloads requires SSH on port 22
with the same credentials used for VNC. The connection fails when SFTP is
disabled on the target (`vendor/zscaler-help/privileged-remote-access-captures.md`).

## Step-Up Authentication

Source: `vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md`; `vendor/zpacloud-ansible/CHANGELOG.md`; `vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py`; `vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_pra.py`; `vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_inspection.py`; `vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_pra_approval.py`; `vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_application_segment_pra.py`.

Zscaler announced Step-Up Authentication for Privileged Remote Access as a
limited-availability feature on July 20, 2026
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:70-77`). It can
require a user to complete additional authentication before application access,
and the Zscaler Admin Console supports conditional access for this flow
(`vendor/zscaler-help/zpa-release-upgrade-summary-2026-july.md:70-77`).

### Ansible 2.2.11 reconciliation boundaries

The ZPA Ansible collection now uses both `email_ids` and, when supplied,
`application_ids` to select an existing PRA approval. An approval for the same
email set but a different application set is skipped so the requested approval
can be created instead of overwriting the unrelated one
(`vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py:250-275`; regression
coverage at
`vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_pra_approval.py:148-191`).

PRA sub-application reconciliation is also parent-scoped in 2.2.11. On update,
the module resolves `pra_app_id` only from `pra_apps` belonging to the parent
segment; on create it leaves the parent and child IDs empty, and it emits
`deleted_pra_apps` only for stale children of that parent
(`vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_pra.py:502-546`).
The new tests cover avoiding a foreign child ID, resolving an owned child,
deleting a stale child, recreating a missing child, and preserving idempotence
when the child remains present
(`vendor/zpacloud-ansible/tests/unit/plugins/modules/test_zpa_application_segment_pra.py:97-159`,
`:161-238`, `:302-325`). Missing-child detection is domain-presence checking,
not full nested-object reconciliation: it does not establish that changes to a
live child's port, protocol, certificate, or other nested fields will be
detected (`vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_pra.py:440-452`).

Do not extend the PRA result to Inspection segments. The Inspection module now
detects a declared domain with no live `inspection_apps` child, but its update
payload still places deletion IDs under `deleted_pra_apps` and then invokes the
PRA update and read clients
(`vendor/zpacloud-ansible/plugins/modules/zpa_application_segment_inspection.py:418-430`,
`:532-538`, `:591-605`). The changelog labels Inspection orphan repair as fixed,
but these executable payload and client paths do not establish that result
(`vendor/zpacloud-ansible/CHANGELOG.md:12-16`). Treat the end-to-end repair as
unproven; the runtime consequence requires an upstream fix or live validation.

## Operational gotchas

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go`.

1. **Pool exhaustion = hard block, not queue.** A team that shares a pool sized to average usage will intermittently get denied at peak. Size pools for peak demand, or configure fallback consoles.

2. **Credential type is immutable.** A credential configured for RDP can't be reused for SSH on the same target — create a separate credential object. Migrating a target's protocol means creating new credentials.

3. **Approval windows are start+duration, not floating.** An approval granted for 2pm-4pm is usable only during that window. Users who miss the window need to re-request.

4. **`working_hours` is optional in current Python SDK / Ansible clients.** Python SDK v1.9.34 fixes `pra_approval.working_hours`, defaults time conversion to UTC when working hours are omitted, and serializes `workingHours` only when a caller explicitly supplies it because the API rejects a partial or empty `workingHours` object (`vendor/zscaler-sdk-python/docsrc/zs/guides/release_notes.rst:350-361`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py:193-220`, `:285-312`). The ZPA Ansible collection v2.2.5 carries the same operational fix for `zpa_pra_approval`, including truly optional `working_hours` and sending only the intended update payload (`vendor/zpacloud-ansible/CHANGELOG.md:67-75`; `vendor/zpacloud-ansible/plugins/modules/zpa_pra_approval.py:76-79`, `:366-405`).

5. **Recording transcoding is async.** A session that just ended isn't immediately streamable. Check status before expecting playback; use prioritized transcoding for urgent forensic review.

6. **PRA sessions don't respect ZCC posture on clientless flows.** When a user reaches PRA via a browser on an unmanaged device, ZCC posture doesn't evaluate — posture policies that gate RDP access only work when the user comes from a ZCC-enrolled device. For clientless PRA, rely on IdP + Approval + Capabilities, not on device posture.

7. **PRA is not a full PAM replacement.** It covers session brokering + credential pooling + recording, but lacks the credential-vaulting / rotation / secrets-management breadth of a dedicated PAM (CyberArk, HashiCorp Vault). Tenants with heavy PAM requirements typically pair PRA with an external PAM: PAM manages vaulting and rotation; PRA consumes the current cred and handles the session-broker layer.

## Common questions this unlocks

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go`.

- "How do we give contractors RDP to the bastion without them ever seeing the password?" → credential pool mapped via SCIM group.
- "Why did my PRA session fail to start?" → check credential pool exhaustion, then access policy match, then approval status.
- "Where are recordings stored, and who can play them back?" → server-side; admins with Session Recording Full Access role.
- "Can we require 2-of-N approval?" → not natively documented; approvals are 1-approver-approves model.
- "Does PRA work without ZCC?" → yes, clientless — that's the main value prop. The user only needs a browser that can handle the Privileged Portal (HTML5-based session).

## Open questions

Source: `vendor/zscaler-help/privileged-remote-access-captures.md`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_approval.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential.py`; `vendor/zscaler-sdk-python/zscaler/zpa/pra_credential_pool.py`; `vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go`.

- **Are session recording, approval workflow, and credential pooling formally absent from base (non-PRA) ZPA?** The captured help articles, Python SDK, and Terraform provider all document these features as PRA-specific constructs but none of those sources directly states they are unavailable in standard ZPA. The dedicated PRA SDK modules and the `SECURE_REMOTE_ACCESS`-only `app_types` enum on the PRA segment resource are strong implicit evidence, but a direct source statement would be needed to assert the negative. (Tracked as [`zpa-57`](../_meta/clarifications.md#zpa-57-whether-session-recording-approval-workflow-and-credential-pooling-are-formally-absent-from-base-non-pra-zpa).)

## Cross-links

- App segment variant config: [`./app-segments.md § Multimatch constraint`](./app-segments.md).
- Policy evaluation order for PRA access rules: [`./policy-precedence.md`](./policy-precedence.md).
- Terraform `zpa_application_segment_pra` schema: [`../shared/terraform.md`](../shared/terraform.md).
- Alternative clientless path (web apps only): [`./browser-access.md`](./browser-access.md).
- Device Posture on PRA clientless paths: posture does not evaluate — see [`../shared/device-posture.md`](../shared/device-posture.md) for when posture applies.
