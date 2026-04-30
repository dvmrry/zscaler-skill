---
product: zpa
topic: "privileged-remote-access"
title: "Privileged Remote Access (PRA) — clientless RDP/SSH/VNC"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: mixed
sources:
  - "vendor/zscaler-help/privileged-remote-access-captures.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/pra_*.py"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_pra.go"
author-status: draft
---

# Privileged Remote Access (PRA) — clientless RDP/SSH/VNC

PRA is ZPA's privileged-access product surface: a clientless gateway that proxies RDP, SSH, and VNC sessions from a user's browser to internal servers, jump hosts, and bastion hosts — with credential pooling, approval workflows, capability controls (file transfer / clipboard), and full session recording. Confidence **medium** because several source articles returned Japanese-fallback during capture; re-verify quantitative claims against the live pages before leaning on them.

## When to use PRA vs. the alternatives

| Need | Tool |
|---|---|
| Web app access without ZCC | **Browser Access** ([`./browser-access.md`](./browser-access.md)) — HTTP/HTTPS only |
| Native RDP/SSH with ZCC installed, credentials known, no recording | Standard ZPA access — treat the target as an app segment, user RDPs with their own creds over ZPA |
| RDP/SSH with **shared credentials**, **session recording**, **approval workflow**, or **clientless access** | **PRA** |
| Jump-host / bastion with full audit trail | **PRA** |
| Emergency admin break-glass with oversight | **PRA** |

PRA is the answer whenever audit / approval / credential-pool / recording is required — those features do not exist in base ZPA.

## Architecture

```
user browser ──(HTTPS Privileged Portal)──▶ Zscaler PRA Gateway ──(RDP/SSH/VNC via App Connector)──▶ Privileged Console
```

- **Privileged Portal** — the end-user-facing entry point. A web-browser URL (behaves like Browser Access) for submitting requests and launching approved sessions.
- **PRA Gateway** — Zscaler-hosted protocol translator. Converts in-browser HTML5 session control into native RDP/SSH/VNC packets sent through the App Connector mesh.
- **Privileged Console** — the target system config object. One per host-protocol pair. A single bastion running both SSH and RDP has two console objects.
- **Privileged Application Segment** — a ZPA segment variant (`zpa_application_segment_pra` in TF) that exposes consoles to the policy engine.

All traffic traverses ZPA's App Connector outbound mesh; no inbound ports opened on the target.

## The six policy + config objects

1. **Privileged Credentials** — stored creds for machine login. Three types: Username/Password (RDP, optional domain), SSH Key (username + key + optional passphrase), VNC Password. **Type is immutable** after creation.

2. **Privileged Credential Pools** — groups of credentials. Map via SAML/SCIM conditions to users who should be auto-logged in with a pooled cred. When the pool is exhausted (all creds in-use), access blocks.

3. **Privileged Credentials Policy** — maps users to credential pools. Drives "which user gets which cred set for which console."

4. **Privileged Approvals** — time-bounded access requests. Requester specifies console + start-date + duration + reason; approver reviews and grants with specified access window.

5. **Privileged Capabilities Policy** — per-console capability controls: clipboard allow/deny, file-transfer direction (upload-only, download-only, bidirectional, none), session monitoring by approvers, emergency takeover. (English doc was under maintenance at capture time; re-verify specifics.)

6. **Privileged Policies** (access policy rules) — gate who can request access to which console. Evaluated first-match-wins like other ZPA access policies. See [`./policy-precedence.md`](./policy-precedence.md) for evaluation semantics.

## Credential pooling — why it matters

The pool model decouples users from credentials. A team of 12 DBAs shares a pool of 3 database-admin creds; when a DBA launches a session, PRA auto-logs them in with whichever pooled cred is free. The DBA **never sees the password**. When the session ends, the cred returns to the pool.

**Implications:**

- Users can't leak creds they never know.
- Cred rotation is a central action — rotate the pool, every user's next session uses the new cred.
- **Pool exhaustion = access block**, not queue. If all 3 creds are busy, user 4 gets denied until one frees. Size pools for peak, not average.
- SAML / SCIM attributes drive which pool a user gets; changes in identity provider propagate automatically via policy eval.

## Approval workflow

Not all PRA consoles require approval — approval is configured per-policy. For consoles that do:

1. User hits the **PRA Portal > My Requests** tab.
2. Selects microtenant + console + start date + duration + (optional) reason.
3. Submits.
4. Approver reviews (filter by console or requester) via **Analytics > Privileged Remote Access > Approval Requests**.
5. Approver approves with a grant window (can modify duration) or denies.
6. On approve, user gets time-bounded access. Access **auto-expires** at window end; no manual revoke required.

Approval metadata: requester, console, access period, reason, status, request timestamp. Retained in Analytics for audit.

## Session recording

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

PRA uses a dedicated segment variant. In Terraform that's `zpa_application_segment_pra`; in the Python/Go SDKs the resource type carries `_pra` suffixes on methods.

Relevant integration points from `references/zpa/app-segments.md`:

- **Multimatch is not supported** on segments containing PRA-enabled applications. From the reference architecture: "Multimatch must be disabled if the configuration contains applications using the Access Type of Browser Access, AppProtection, or Privileged Remote Access."
- **SIPA is not supported** on PRA segments — same architectural reason as Browser Access (protocol relay terminates before backend sees the packet).
- The `VM_CONNECT` action value surfaces on PRA segments (distinct from the standard ZPA CONNECT mechanism).

## Capabilities policy (what users can actually do in-session)

**Caveat:** at capture time the English Privileged Capabilities Policy help article was under maintenance. Below is reconstructed from references in other articles — re-verify before leaning on specifics.

Per-console controls commonly include:

- **Clipboard** — copy from remote allowed? paste to remote? bidirectional?
- **File transfer** — upload to remote? download from remote? neither? both?
- **Session monitoring** — can an approver join/observe a live session?
- **Emergency takeover** — can an admin forcibly seize or terminate a session in progress?
- **Session sharing** — can multiple users connect to the same session?

These are policy objects, not per-session flags — the same capability set applies to every session on a given console.

## Operational gotchas

1. **Pool exhaustion = hard block, not queue.** A team that shares a pool sized to average usage will intermittently get denied at peak. Size pools for peak demand, or configure fallback consoles.

2. **Credential type is immutable.** A credential configured for RDP can't be reused for SSH on the same target — create a separate credential object. Migrating a target's protocol means creating new credentials.

3. **Approval windows are start+duration, not floating.** An approval granted for 2pm-4pm is usable only during that window. Users who miss the window need to re-request.

4. **Recording transcoding is async.** A session that just ended isn't immediately streamable. Check status before expecting playback; use prioritized transcoding for urgent forensic review.

5. **PRA sessions don't respect ZCC posture on clientless flows.** When a user reaches PRA via a browser on an unmanaged device, ZCC posture doesn't evaluate — posture policies that gate RDP access only work when the user comes from a ZCC-enrolled device. For clientless PRA, rely on IdP + Approval + Capabilities, not on device posture.

6. **PRA is not a full PAM replacement.** It covers session brokering + credential pooling + recording, but lacks the credential-vaulting / rotation / secrets-management breadth of a dedicated PAM (CyberArk, HashiCorp Vault). Tenants with heavy PAM requirements typically pair PRA with an external PAM: PAM manages vaulting and rotation; PRA consumes the current cred and handles the session-broker layer.

## Common questions this unlocks

- "How do we give contractors RDP to the bastion without them ever seeing the password?" → credential pool mapped via SCIM group.
- "Why did my PRA session fail to start?" → check credential pool exhaustion, then access policy match, then approval status.
- "Where are recordings stored, and who can play them back?" → server-side; admins with Session Recording Full Access role.
- "Can we require 2-of-N approval?" → not natively documented; approvals are 1-approver-approves model.
- "Does PRA work without ZCC?" → yes, clientless — that's the main value prop. The user only needs a browser that can handle the Privileged Portal (HTML5-based session).

## Cross-links

- App segment variant config: [`./app-segments.md § Multimatch constraint`](./app-segments.md).
- Policy evaluation order for PRA access rules: [`./policy-precedence.md`](./policy-precedence.md).
- Terraform `zpa_application_segment_pra` schema: [`../shared/terraform.md`](../shared/terraform.md).
- Alternative clientless path (web apps only): [`./browser-access.md`](./browser-access.md).
- Device Posture on PRA clientless paths: posture does not evaluate — see [`../shared/device-posture.md`](../shared/device-posture.md) for when posture applies.
