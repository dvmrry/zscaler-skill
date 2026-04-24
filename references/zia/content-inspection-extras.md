---
product: zia
topic: "content-inspection-extras"
title: "FTP Control, File Type Control, and SSH handling"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/about-ftp-control.md"
  - "vendor/zscaler-help/about-file-type-control.md"
  - "vendor/zscaler-help/about-ips-control.md"
  - "vendor/zscaler-help/configuring-firewall-policies.md"
author-status: draft
---

# FTP Control, File Type Control, and SSH handling

Three narrow ZIA inspection surfaces that sit adjacent to the big policy modules (URL Filter, CAC, DLP, SSL Inspection, Sandbox, Malware/ATP, Firewall) but have their own rules, constraints, and evaluation quirks. This doc covers all three together because each is narrow enough on its own not to warrant a full reference doc, and they share enough pipeline context that reasoning about them in one place is cleaner.

## FTP Control

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

## Cross-module interaction summary

| | FTP Control | File Type Control | SSH (Firewall) |
|---|---|---|---|
| Module | Firewall | Web | Firewall |
| Requires SSL decrypt? | For FTP over HTTPS only | Yes for HTTPS files | N/A (no content inspection) |
| Default behavior | Blocks FTP over HTTP; allows native FTP | Allows all file types | Allows per Firewall rules |
| Evaluates before DLP? | Yes (FTP upstream of web module) | Yes (archive extraction happens here) | N/A |
| Default rule precedence | URL Filter wins on matching HTTP flows | Web-module default-allow | Firewall default rule |
| API in ZIA SDK | Yes — `client.zia.ftp_control.*` | Yes — `client.zia.file_type_control.*` | Firewall only — `client.zia.firewall.*` |

## Surprises worth flagging

1. **FTP over HTTP is default-deny; native FTP is default-allow.** Counterintuitive. Zscaler's reasoning: native FTP is simpler to inspect, but the default allow predates ZCC/PAC coverage. FTP-over-HTTP is the modern forwarding path and needs an explicit FTP Control policy.

2. **Active FTP doesn't work at all.** No workaround. Modern servers do passive; legacy systems needing active FTP should be fronted with a conversion proxy or replaced.

3. **File Type Control on unidentifiable files is a tenant decision.** "Unknown file type" catches anything Zscaler's MIME detection can't classify. Tenants who block unknowns aggressively protect against novel malware formats; tenants who allow unknowns avoid false-positive blocks on legitimate niche formats. No middle ground without writing explicit rules.

4. **400 MB unscanned passthrough is the norm, not exception.** Software downloads, VM images, database dumps routinely exceed 400 MB. A tenant expecting "File Type Control will catch this .iso download" needs to verify the file size first.

5. **SSH inspection doesn't exist; PRA is the answer.** Tenants asking "how do we log SSH commands" get pointed to PRA, not to a Zscaler SSH-inspection product that doesn't exist. Worth saying plainly.

## Cross-links

- FTP / File Type Control intersection with DLP: [`./dlp.md`](./dlp.md).
- SSL bypass cascading to content-inspection loss: [`./ssl-inspection.md § SSL bypass is a cross-policy gate`](./ssl-inspection.md).
- PRA as the SSH-audit substitute: [`../zpa/privileged-remote-access.md`](../zpa/privileged-remote-access.md).
- Firewall Control context: [`./firewall.md`](./firewall.md).
- Sandbox handling of executables (what File Type Control hands off to): [`./sandbox.md`](./sandbox.md).
