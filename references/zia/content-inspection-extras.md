---
product: zia
topic: "content-inspection-extras"
title: "FTP Control, File Type Control, and SSH handling"
content-type: reasoning
last-verified: "2026-06-18"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-ftp-control.md"
  - "vendor/zscaler-help/about-file-type-control.md"
  - "vendor/zscaler-help/about-ips-control.md"
  - "vendor/zscaler-help/configuring-firewall-policies.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/zia_service.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/ftp_control_policy.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/custom_file_types.py"
  - "vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json"
author-status: draft
---

# FTP Control, File Type Control, and SSH handling

Source: `vendor/zscaler-help/about-ftp-control.md`; `vendor/zscaler-help/about-file-type-control.md`; `vendor/zscaler-help/about-ips-control.md`; `vendor/zscaler-help/configuring-firewall-policies.md`.

Three narrow ZIA inspection surfaces that sit adjacent to the big policy modules (URL Filter, CAC, DLP, SSL Inspection, Sandbox, Malware/ATP, Firewall) but have their own rules, constraints, and evaluation quirks. This doc covers all three together because each is narrow enough on its own not to warrant a full reference doc, and they share enough pipeline context that reasoning about them in one place is cleaner.

## FTP Control

Source: `vendor/zscaler-help/about-ftp-control.md`.

FTP is ZIA's legacy protocol handler for file-transfer traffic. Two reasons it has its own control plane:

1. **PAC + ZCC deployments only support FTP over HTTP**, not native FTP. Without FTP Control, FTP-over-HTTP is blocked by default.
2. **FTP needs per-flow file extraction + scan** — the inspection pipeline is different from HTTP/HTTPS.

### What it does

- Access control for **native FTP** (port 21) and **FTP over HTTP**.
- Per-flow **file extraction + security scan**.
- Integration with five other policy modules via protocol-based rule conditions (DLP, Sandbox, File Type Control, URL Filtering, Bandwidth Control) — rules in those modules can condition on FTP as a protocol.

### What it supports

- **Passive FTP only.** Active FTP sends an error to the end user's browser.
- **FTPS (FTP over TLS)** in passive mode — implicit or explicit. Explicit FTPS requires a proxy in the FTP client.
- **FTP over HTTPS** — inspected like other HTTPS traffic (SSL decrypt required for content inspection).

### Where it sits

Firewall module — **Policies > Firewall > FTP Control**. Evaluates before the web module for non-HTTP FTP flows.

### Evaluation order

- **URL Filtering policy rules take precedence over FTP Control policy.** If a URL Filtering rule matches an FTP-over-HTTP flow, URL Filtering wins.
- Malware Protection scans FTP (over HTTP + native) when enabled.
- DLP / Sandbox / File Type Control evaluate FTP payload after FTP Control permits the flow.

### Operational gotchas

1. **Default-deny on FTP over HTTP.** Tenants new to Zscaler sometimes see FTP over HTTP fail silently for ZCC/PAC users — the cause is not a firewall rule; it's the default service-level block. Enable FTP Control to allow.
2. **Active FTP fails.** Passive-only is hard. Tenants with legacy servers doing active FTP get unhelpful browser errors. No workaround short of server reconfiguration.
3. **URL Filter precedence can mask FTP Control intent.** If a URL Filtering rule allows access to an FTP site but FTP Control is configured to block certain files, the URL Filter allow fires first at the URL level; FTP Control's file-type check runs downstream. Order rules accordingly.

## File Type Control

Source: `vendor/zscaler-help/about-file-type-control.md`.

File Type Control gates file upload/download by file shape — extension, MIME type, archive-content, active-content — before or alongside DLP content inspection. The module defaults to **allow all file types**; enforcement is opt-in via policy rules.

### Matching criteria

- **By extension** — e.g., `.mp3`, `.wav`, `.avi`, `.mp4`, `.mpeg`. The standard multimedia/archive/executable enumeration.
- **By MIME type** — Zscaler performs MIME detection on unidentified files; those outside known-good MIME types are tagged as **"unknown file type"**.
- **Archive content** — Zscaler unpacks ZIP, 7-Zip, GZIP, TAR, RAR and applies rules to contents. A ZIP of `.exe` files can be blocked even if `.zip` itself is allowed.
- **Active content** — newer capability; rules can target files with active content in Microsoft Office and PDF formats. Useful for blocking macro-bearing Office files or JS-laden PDFs.
- **Unscannable files** — rules can handle files the service cannot scan (encrypted archives, password-protected files, corrupt formats). Default action for unscannables is a tenant choice: fail-open or fail-closed.

### Actions

- **ALLOW**
- **CAUTION** — end-user sees a warning and must acknowledge before the transfer proceeds.
- **BLOCK** — transfer denied with a notification to the end user.

### Operations

Each rule targets **upload**, **download**, or **both** directions. A file type can be allowed on download but blocked on upload (e.g., restricting employees from uploading PII-rich file types to cloud apps).

### Protocols

Rules apply to **HTTP**, **HTTPS**, and **FTP** (confirmed in SDK enum: `HTTP_RULE`, `HTTPS_RULE`, `FTP_RULE`).

### Size limit

**400 MB for scanning.** Files larger than 400 MB are passed through without inspection — the tenant-level decision on how to treat them falls to the Unscannable Files policy or to the default-rule behavior.

### Where it sits

Web module — **Policies > File Type Control**. Evaluates as part of the post-SSL-decrypt policy stack alongside URL Filter / CAC / DLP / Sandbox.

### Pipeline interaction

- **SSL Inspection bypass = no File Type Control.** Traffic that bypasses SSL decrypt can't be inspected by File Type Control either (no visibility into HTTPS-encoded file payloads). Same rule as DLP and Sandbox — see [`./ssl-inspection.md § SSL bypass is a cross-policy gate`](./ssl-inspection.md).
- **File Type Control evaluates before DLP engines** for matching files. A file blocked by FTC never reaches DLP. If you want DLP logs of what would have been scanned, don't block at FTC — flag via CAUTION action and let DLP run.
- **Archive extraction happens at FTC.** DLP gets the extracted file list downstream — so a ZIP bomb or deeply nested archive can be terminated at FTC without stressing DLP.

### Operational gotchas

1. **Default is allow-all.** A fresh tenant has no File Type Control rules firing — zero restrictions. Enable the recommended policy as a starting point or write custom rules explicitly.
2. **CAUTION action is user-interactive.** For API-only or headless flows (cloud workloads, CI runners), CAUTION effectively = BLOCK because there's no user to acknowledge. Use BLOCK for programmatic traffic scopes.
3. **400 MB scan limit is a silent passthrough.** Files larger go through unscanned unless the Unscannable Files policy catches them. Review the policy's default action if large-file traffic is security-sensitive.
4. **Archive-extraction scope is fixed.** ZIP / 7-Zip / GZIP / TAR / RAR are inspected; other archive formats (e.g., RPM, DEB) are treated as binary blobs. A malicious binary in a `.deb` lands as an opaque file.

## SSH handling

Source: `vendor/zscaler-help/about-ips-control.md`; `vendor/zscaler-help/configuring-firewall-policies.md`.

**SSH has no dedicated content-inspection surface in ZIA.** The help-doc search turned up no "About SSH Inspection" article, and the module structure (Firewall + Web) has no SSH-specific placeholder.

### What Zscaler does for SSH

- **L4 firewall gating only.** Firewall Filtering rules can allow/block SSH via network service (port 22) or custom ports. No SSH payload inspection.
- **Network-service identification on first packet.** Zscaler identifies SSH by handshake signature in the first packet, enabling firewall action without deep inspection.
- **CONNECT-tunnel gating.** A proxy client making a `CONNECT target:22` request can be allowed or blocked via Firewall Filtering rules.

### Why

SSH is end-to-end encrypted with mutual auth between client and server. MITM'ing SSH would require control of both endpoints' keys — standard inline inspection proxies can't decrypt SSH without acting as an active MitM, which ZIA doesn't implement for SSH. Contrast with HTTPS, where SSL Inspection operates by client trusting Zscaler's cert.

### What this means for skill answers

"Why can't we scan SSH traffic for sensitive data?" — ZIA doesn't do SSH content inspection. Options:

1. **Block SSH entirely** — Firewall Filtering rule blocks port 22.
2. **Allow only to known hosts** — scope Firewall Filtering rules to specific destination IPs.
3. **Migrate to an SSH-inspecting gateway** — deploy **PRA** (`./privileged-remote-access.md`) as the SSH access path. PRA intercepts at the application layer (not transport), records sessions, and enforces capability policies. This is the correct answer for "we need to audit / restrict SSH behavior."

PRA is effectively the skill's recommended pattern for any "we need oversight of SSH/RDP/VNC" question — SSH Inspection as a standalone feature doesn't exist in ZIA.

## API/SDK surface

Source: `vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/ftp_control_policy.py`; `vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py`; `vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py`; `vendor/zscaler-sdk-python/zscaler/zia/custom_file_types.py`.

The behavioral prose above is help-doc-tier (passive-only, FTP-over-HTTP default-deny, 400 MB ceiling, archive formats — all correct). But the rule/action mechanics differ from the help framing once you look at the SDK. This section documents the actual API shapes.

### FTP Control is a tenant-wide settings object, not a rule engine

The help docs describe FTP Control as something with "policy" and per-site allow rules. Over the API it is **not** a rule list — it is a single settings object with two operations and exactly four fields:

| Operation | Method + path |
|---|---|
| Get settings | `GET /zia/api/v1/ftpSettings` |
| Update settings | `PUT /zia/api/v1/ftpSettings` |

Citations: `get_ftp_settings` builds `/ftpSettings` (`vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py:35,56-59`); `update_ftp_settings` is a PUT against the same path (`vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py:77,113-117`).

The four fields on the `FTPControlPolicy` model:

| Field | Wire key | Meaning |
|---|---|---|
| `ftp_over_http_enabled` | `ftpOverHttpEnabled` | Enable FTP over HTTP |
| `ftp_enabled` | `ftpEnabled` | Enable native FTP |
| `url_categories` | `urlCategories` | URL categories that allow FTP traffic (list of str) |
| `urls` | `urls` | Domains/URLs included for FTP Control (list of str) |

Citations: model fields (`vendor/zscaler-sdk-python/zscaler/zia/models/ftp_control_policy.py:38-44`); the same four documented as `update_ftp_settings` kwargs (`vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py:86-90`). So enabling FTP-over-HTTP for ZCC/PAC users is a single flag flip (`ftp_over_http_enabled = True`) against `/ftpSettings`, scoped by `url_categories`/`urls` — there is no per-flow ALLOW/BLOCK/CAUTION rule object in the SDK. The ALLOW/BLOCK/CAUTION mechanics in the help-derived "Actions" framing belong to File Type Control, not FTP Control.

### File Type Control is a rule resource

File Type Control is a CRUD rule resource (list/get/add/update/delete) plus an enum-lookup endpoint:

| Operation | Method + path |
|---|---|
| List rules | `GET /zia/api/v1/fileTypeRules` |
| Get one | `GET /zia/api/v1/fileTypeRules/{id}` |
| Create | `POST /zia/api/v1/fileTypeRules` |
| Update | `PUT /zia/api/v1/fileTypeRules/{id}` |
| Delete | `DELETE /zia/api/v1/fileTypeRules/{id}` |
| List file-type categories (enum) | `GET /zia/api/v1/fileTypeCategories` |

Citations: `/fileTypeRules` paths at `vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py:54-57` (list), `:104-107` (get), `:186-189` (add), `:278-281` (update), `:329-332` (delete); `/fileTypeCategories` at `:387-390`.

**The action field is `filtering_action`, not a generic `action`.** Its enum is `BLOCK` / `CAUTION` / `ALLOW` (`vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py:143`; model field `filtering_action` ← `filteringAction` at `vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py:56`, request_format `:178`).

Key rule fields (model at `vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py`):

| Field | Wire key | Notes | Citation |
|---|---|---|---|
| `filtering_action` | `filteringAction` | enum BLOCK / CAUTION / ALLOW | `filetyperules.py:56`; `file_type_control_rule.py:143` |
| `operation` | `operation` | file operation (upload / download) | `filetyperules.py:58`; `file_type_control_rule.py:149` |
| `min_size` / `max_size` | `minSize` / `maxSize` | per-rule size gate **in KB** (default 0) — distinct from the 400 MB scan ceiling | `filetyperules.py:54-55`; `file_type_control_rule.py:154-155` |
| `active_content` | `activeContent` | match files containing active content (Office/PDF) | `filetyperules.py:59` |
| `unscannable` | `unscannable` | match files the service cannot scan | `filetyperules.py:60` |
| `password_protected` | `passwordProtected` | match password-protected files | `filetyperules.py:66` |
| `protocols` | `protocols` | list of str — HTTP_RULE / HTTPS_RULE / FTP_RULE | `filetyperules.py:49` |
| `file_types` | `fileTypes` | list of file types the rule applies to | `filetyperules.py:77` |
| `size_quota` | `sizeQuota` | size quota in KB beyond which the policy applies | `filetyperules.py:52`; `file_type_control_rule.py:145` |

The per-rule `min_size`/`max_size` gate is **in KB** (`vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py:154-155`) and is separate from the tenant-level 400 MB scan ceiling documented above — a rule can scope itself to, say, files between 100 KB and 50,000 KB regardless of the global ceiling.

**`/fileTypeCategories` is an enum-lookup endpoint** returning predefined and custom file types for use as rule conditions, filterable by an `enums` query param with three values: `ZSCALERDLP` (Web DLP rules with content inspection), `EXTERNALDLP` (Web DLP rules without content inspection), and `FILETYPECATEGORYFORFILETYPECONTROL` (File Type Control policy). An `exclude_custom_file_types` boolean param drops custom types from the result (`vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py:346-414`).

The Automate contract now provides a static captured file-type vocabulary for the rule body: `fileTypes` is a contract-only enum for `POST /zia/api/v1/fileTypeRules`, beginning with `ANY`, `NONE`, and `FTCATEGORY_*` values and ending at `FTCATEGORY_TS` in the generated reconciliation (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:4754-4757`, `:4795-4805`, `:5084-5091`). Terraform does not carry a corresponding `fileTypes` choice list in the reconciled resource (`:5091`).

### Custom file types

A separate `client.zia.custom_file_types` resource manages custom file-type definitions (CRUD plus a count):

| Operation | Method + path |
|---|---|
| List | `GET /zia/api/v1/customFileTypes` |
| Get one | `GET /zia/api/v1/customFileTypes/{id}` |
| Create | `POST /zia/api/v1/customFileTypes` |
| Update | `PUT /zia/api/v1/customFileTypes/{id}` |
| Delete | `DELETE /zia/api/v1/customFileTypes/{id}` |
| Count | `GET /zia/api/v1/customFileTypes/count` |

Citations: `/customFileTypes` paths at `vendor/zscaler-sdk-python/zscaler/zia/custom_file_types.py:61-64` (list), `:111-114` (get), `:170-173` (add), `:230-233` (update), `:271-274` (delete); `/customFileTypes/count` at `:304-307`.

A custom file type carries an `extension` (max 10 chars; existing Zscaler extensions cannot be reused) and a `file_type_id` (the file-type ID maintained across predefined and custom types, distinct from the custom file-type record's own ID) — `vendor/zscaler-sdk-python/zscaler/zia/custom_file_types.py:149-155`.

## Cross-module interaction summary

Source: `vendor/zscaler-help/about-ftp-control.md`; `vendor/zscaler-help/about-file-type-control.md`; `vendor/zscaler-help/about-ips-control.md`; `vendor/zscaler-help/configuring-firewall-policies.md`.

| | FTP Control | File Type Control | SSH (Firewall) |
|---|---|---|---|
| Module | Firewall | Web | Firewall |
| Requires SSL decrypt? | For FTP over HTTPS only | Yes for HTTPS files | N/A (no content inspection) |
| Default behavior | Blocks FTP over HTTP; allows native FTP | Allows all file types | Allows per Firewall rules |
| Evaluates before DLP? | Yes (FTP upstream of web module) | Yes (archive extraction happens here) | N/A |
| Default rule precedence | URL Filter wins on matching HTTP flows | Web-module default-allow | Firewall default rule |
| API in ZIA SDK | Settings object — `client.zia.ftp_control_policy.*` | Rule resource — `client.zia.file_type_control_rule.*` (plus `client.zia.custom_file_types.*`) | Firewall only — `client.zia.firewall.*` |

Namespace citations: `client.zia.ftp_control_policy` (FTPControlPolicyAPI, `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:625`), `client.zia.file_type_control_rule` (FileTypeControlRuleAPI, `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:309`), `client.zia.custom_file_types` (CustomFileTypesAPI, `vendor/zscaler-sdk-python/zscaler/zia/zia_service.py:317`). There is no bare `client.zia.ftp_control` or `client.zia.file_type_control` property — those strings raise `AttributeError`.

## Surprises worth flagging

Source: `vendor/zscaler-help/about-ftp-control.md`; `vendor/zscaler-help/about-file-type-control.md`; `vendor/zscaler-help/configuring-firewall-policies.md`.

1. **FTP over HTTP is default-deny; native FTP is default-allow.** Counterintuitive. Zscaler's reasoning: native FTP is simpler to inspect, but the default allow predates ZCC/PAC coverage. FTP-over-HTTP is the modern forwarding path and needs an explicit FTP Control policy.

2. **Active FTP doesn't work at all.** No workaround. Modern servers do passive; legacy systems needing active FTP should be fronted with a conversion proxy or replaced.

3. **File Type Control on unidentifiable files is a tenant decision.** "Unknown file type" catches anything Zscaler's MIME detection can't classify. Tenants who block unknowns aggressively protect against novel malware formats; tenants who allow unknowns avoid false-positive blocks on legitimate niche formats. No middle ground without writing explicit rules.

4. **400 MB unscanned passthrough is the norm, not exception.** Software downloads, VM images, database dumps routinely exceed 400 MB. A tenant expecting "File Type Control will catch this .iso download" needs to verify the file size first.

5. **SSH inspection doesn't exist; PRA is the answer.** Tenants asking "how do we log SSH commands" get pointed to PRA, not to a Zscaler SSH-inspection product that doesn't exist. Worth saying plainly.

Source: `vendor/zscaler-help/about-ftp-control.md`.

6. **FTP Control is location-scoped.** FTP Control policy applies only to traffic from **defined locations**. Road-warrior users not at a known location can't use native FTP through ZIA at all — they must use FTP over HTTP via dedicated ports. The scope limitation isn't obvious from the feature name and surfaces as "FTP works in the office, not at home."

7. **Non-passive FTP fails with browser alert, not silent block.** When the destination FTP server doesn't support passive mode, the ZIA service generates an alert message in the user's browser — not a silent failure or generic timeout. Help-desk tickets for "FTP browser shows weird error" usually trace to active-FTP-server attempts.

## Cross-links

- FTP / File Type Control intersection with DLP: [`./dlp.md`](./dlp.md).
- SSL bypass cascading to content-inspection loss: [`./ssl-inspection.md § SSL bypass is a cross-policy gate`](./ssl-inspection.md).
- PRA as the SSH-audit substitute: [`../zpa/privileged-remote-access.md`](../zpa/privileged-remote-access.md).
- Firewall Control context: [`./firewall.md`](./firewall.md).
- Sandbox handling of executables (what File Type Control hands off to): [`./sandbox.md`](./sandbox.md).

## Open questions

These came up while reconciling the help-doc framing against the SDK surface and could not be fully resolved from SDK/help source. The Automate contract now narrows the File Type Control enum piece, while the runtime dependency and FTP-scope pieces remain unverified. All four are tracked together as `zia-57` in [`../_meta/clarifications.md`](../_meta/clarifications.md#zia-57-ftp-and-file-type-control-field-dependency-and-enum-surfaces).

1. **Does a per-site FTP Control rule layer exist outside the SDK?** The help docs describe "FTP Control policy" with multiple levels and per-site access (`vendor/zscaler-help/about-ftp-control.md:17-21`), but the SDK exposes only the tenant-wide `/ftpSettings` object with four fields (`vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py:35,77`; model `:38-44`). Whether per-site FTP allow/deny is configured elsewhere (e.g. via URL Filtering on FTP-protocol conditions, or a UI-only surface not mirrored in the API) is not determinable from the SDK source alone.

2. **The File Type Control `filtering_action`-to-field dependency contract is not encoded in source.** The SDK accepts `min_size`/`max_size`/`operation`/`active_content`/`unscannable`/`password_protected` as flat kwargs (`vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py:149-156`) with no client-side validation tying any field to a specific `filtering_action` value. Which combinations the API accepts or rejects (e.g. whether `active_content`/`unscannable` are meaningful with `ALLOW`) is not stated in the Python SDK source examined.

3. **The full `file_types` enum is not enumerated in the SDK, but is now captured from the Automate contract.** The model treats `file_types` as a free list of strings (`vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py:77`), and `/fileTypeCategories` remains the runtime lookup endpoint (`vendor/zscaler-sdk-python/zscaler/zia/file_type_control_rule.py:346-414`). The generated contract reconciliation now gives the static documented list for `fileTypes` (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:4795-4805`, `:5084-5091`), so use that for source-backed vocabulary checks while still treating tenant-specific custom file types as runtime data.

4. **The `protocols` value set is only partially confirmed.** `HTTP_RULE` / `HTTPS_RULE` / `FTP_RULE` are confirmed for File Type Control (`vendor/zscaler-help/about-file-type-control.md:29`), but the Python model stores `protocols` as an unconstrained list of strings (`vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py:49`) with no enum declared, so whether additional protocol tokens are accepted is not determinable from this source.
