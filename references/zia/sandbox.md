---
product: zia
topic: "zia-sandbox"
title: "ZIA Sandbox — what gets analyzed, what blocks, and why"
content-type: reasoning
last-verified: "2026-04-24"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-mcp-server/commands/investigate-sandbox.md"
  - "vendor/zscaler-mcp-server/skills/zia/investigate-sandbox/SKILL.md"
  - "vendor/zscaler-help/ZIA_SSL_Inspection_Leading_Practices_Guide.txt (SSL-as-prerequisite)"
  - "https://help.zscaler.com/zia/about-sandbox"
author-status: draft
---

# ZIA Sandbox behavior

The Sandbox module (Cloud Sandbox / Advanced Sandbox) subjects suspicious files to dynamic behavioral analysis before allowing or blocking them. This doc captures operational reasoning patterns distilled from the Zscaler MCP server's `investigate-sandbox` workflow — things the help site doesn't clearly enumerate.

## What actually gets analyzed — Basic vs Advanced

Two Sandbox tiers. The difference drives most "why wasn't this file analyzed?" questions.

| | Basic Sandbox | Advanced Sandbox |
|---|---|---|
| File types | `.exe`, `.dll`, `.scr`, `.ocx`, `.sys`, `.zip` only | Broad — Office documents, PDFs, archives, scripts, many more |
| File size | **≤2 MB** | Larger ceilings per subscription |
| Action on out-of-scope | File passes through unanalyzed (silently) | Subject to policy |

**Critical operational fact:** If a tenant is on Basic Sandbox and a `.docx` or a 3 MB `.exe` hits the proxy, Sandbox **does not analyze it** and it's passed through. Malware Protection or ATP may still catch it at another policy layer, but Sandbox itself does nothing. Always confirm the tenant's Sandbox tier when answering "why wasn't my file sandboxed?"

## Static analysis fast-path

Per the MCP `investigate-sandbox` skill, for Office and PDF files, Sandbox first runs a static analysis step:

- **No macros or embedded scripts detected** → fast-pathed as `BENIGN — No Active Content` without Sandbox submission.
- **Active content present** → submitted for dynamic analysis.

An operator who sees "Benign — No Active Content" in logs should not interpret that as "Sandbox analyzed this and cleared it." It means "Sandbox's pre-check found nothing interesting enough to analyze."

## SSL inspection as a hard prerequisite

**Sandbox cannot see files inside HTTPS traffic that isn't decrypted.** From the *ZIA SSL Inspection Leading Practices Guide* and cross-confirmed by the MCP `investigate-sandbox` skill:

- If an SSL Inspection rule with `Do Not Inspect` matches the download's domain/category, Sandbox **does not see the file**. Period.
- This is the #1 cause of "file wasn't sandboxed" in HTTPS-heavy environments.

**Canonical skill answer when a file appears unanalyzed:** check whether an SSL bypass rule matches the source URL *before* exploring Sandbox policy.

## Quarantine edge cases

The MCP skill calls out three non-obvious quarantine scenarios:

### One-time download links

Files hosted with URLs that expire or return 404/403 on re-download (e.g., signed S3 URLs, time-limited sharing services).

- Sandbox quarantines the file during first-submit analysis.
- After quarantine, user tries to re-download → origin returns 404/403.
- File appears "stuck in quarantine" indefinitely.
- **Resolution:** create a Sandbox rule for the domain using **Allow and scan** (the file delivers while background analysis runs; Patient 0 alerting still triggers if verdict is malicious).

### Dynamic-hash files

Same logical file hosted at a URL that generates a new MD5 per request (e.g., signed payloads, embedded timestamps, per-user watermarks).

- Each request yields a different hash → each triggers a new quarantine cycle.
- User sees the file perpetually "being analyzed."
- **Resolution:** same — Allow-and-scan rule for the domain.

### Public Service Edge cache propagation lag

After a file receives a BENIGN verdict on one Public Service Edge, other PSEs may still show it as quarantined until their caches sync.

- User hits PSE-A first, file is analyzed, verdict BENIGN.
- User later hits PSE-B (different geo, different time), file appears still-quarantined.
- **Resolution:** wait (cache propagation is eventual); if persistent, open a Zscaler Support ticket referencing the MD5.

## "Blocked by Sandbox" vs "Blocked by Malware Protection" vs "Blocked by ATP"

The ZIA Insights log's **Blocked Policy Type** field is the discriminator. Each has dramatically different API surface:

| Blocked Policy Type | API coverage | Skill can diagnose? |
|---|---|---|
| **Sandbox** | Full — `zia_get_sandbox_report`, `zia_get_sandbox_quota`, `zia_get_sandbox_behavioral_analysis` | Yes |
| **Malware Protection** | **None** — API-blind area | No — direct to portal |
| **Advanced Threat Protection (ATP)** | **None** — API-blind area | No — direct to portal |

If a user says "ZIA blocked my file," the first clarification to ask is which policy type logged the block. Sandbox is the only one we can introspect via API; Malware Protection and ATP require console access — the operator workflow (Security Dashboard, Web Insights, category-based remediation) is in [`./malware-and-atp.md § Console-only diagnosis workflow`](./malware-and-atp.md).

## A BENIGN Sandbox verdict is not a clean bill of health

The Sandbox verdict covers only the Sandbox engine's analysis. A file that Sandbox cleared can still be blocked downstream by:

- Malware Protection (signature / reputation-based)
- ATP (known malicious URL / botnet / etc.)
- URL Filtering (domain category block)
- File Type Control

Conversely, a file blocked by Sandbox is blocked before any other engine sees it.

When answering "why is this file blocked when Sandbox says it's clean," the usual answer is Malware Protection or ATP — both with no API coverage.

## Troubleshooting decision tree (from MCP skill)

```
File unexpectedly blocked?
├─ Blocked Policy Type = Sandbox?
│  ├─ Fetch report via MD5 → threat details, behavioral analysis
│  └─ Check Sandbox Detail Report for confidence score
├─ Blocked Policy Type = Malware Protection or ATP?
│  └─ No API diagnosis. Direct to ZIA Admin Console.
│     See malware-and-atp.md for the console workflow (Security Dashboard
│     → Web Insights filter → category identification → remediation).
└─ Not blocked per logs?
   ├─ Check SSL Inspection policy — does a Do Not Inspect rule match the domain?
   │  └─ If yes: Sandbox never saw it. Not a Sandbox issue.
   ├─ Check Sandbox tier (Basic vs Advanced)
   ├─ Check file type / size against tier limits
   └─ Static analysis fast-path? (Office/PDF with no active content → BENIGN, not analyzed)

File stuck in quarantine?
├─ One-time download URL? (signed S3, time-limited) → Allow-and-scan rule
├─ Dynamic hash? (new MD5 per request) → Allow-and-scan rule
└─ Persistent after verdict? → PSE cache propagation lag; support ticket if persistent
```

## Default rule order is `127`, NOT `-1` — Sandbox is the outlier

Most ZIA rule types return their default rule with `order = -1` (a sentinel meaning "always last, can't be reordered before"). **Sandbox returns its default rule with `order = 127`** — a real number, not a sentinel. From upstream `zscaler/terraform-provider-zia` issue #405 (closed; tracked under engineering ticket `BUG-208047`):

- The default Sandbox rule is named `Default BA Rule` and is returned by `GET /sandboxRules` with `order = 127`.
- TF / API operators creating new Sandbox rules with order 1–4 expect the default to occupy `-1` and a clear gap before that. Instead, the API tries to fit new rules around the literal `127` value, which causes ordering chaos for tenants with fewer than 127 rules total.
- **Operational pattern**: when modeling Sandbox rules in code, treat `127` as the default rule's reserved slot. Don't try to set a custom rule to `order = 127` (collides with default); don't try to set `order > 127` (the API rejects); leave `order ≤ 126` for custom rules.
- **Symptom**: a Terraform plan that worked yesterday suddenly wants to renumber every rule because the default rule's `127` order changed how the diff calculates positions.
- **Workaround until BUG-208047 ships**: keep custom rule orders contiguous starting at 1, expect the default at 127, and don't import the default rule into TF state (it's immutable in effect; the `Default BA Rule` create attempt returns `DUPLICATE_ITEM`).

This default-order anomaly is **not documented** in Zscaler's help portal at capture date; it's purely an API behavior visible only when you query the rules collection. Cross-link to [`zia-XX`](../_meta/clarifications.md) if a clarification entry is added.

## Sandbox Rule API — programmatic control of first-time-file behavior

Beyond the analysis / report layer, Sandbox has a full **rule CRUD surface** the earlier doc treated as console-only. The Go SDK (`vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_rules/sandbox_rules.go`) exposes a `SandboxRules` object with standard scope fields (Locations, Groups, Departments, Users, Device Groups) plus Sandbox-specific behaviors:

- **`BaRuleAction`** — `ALLOW` or `BLOCK`. The terminal verdict action.
- **`FirstTimeEnable`** / **`FirstTimeOperation`** — what to do with a file Sandbox has never seen before. `FirstTimeOperation` enum: `ALLOW_SCAN` (let through while scanning), `QUARANTINE` (hold until verdict), `ALLOW_NOSCAN` (let through without scanning), `QUARANTINE_ISOLATE` (hold and isolate).
- **`MLActionEnabled`** — enable AI/ML verdict action alongside signature-based detection.
- **`ByThreatScore`** — decision gated by Sandbox threat score threshold.
- **`BaPolicyCategories`** — which Sandbox threat categories the rule applies to.
- **`FileTypes`** — which file types trigger this rule (PE, Office, PDF, Archive, etc.).
- **`ZPAAppSegments`** — scope the rule to specific ZPA Application Segments (cross-product reference, same pattern as SSL Inspection's `zpa_app_segments`; see [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) for the SIPA relationship).

**The "Allow and scan" resolution surfaced elsewhere in this doc is literally `FirstTimeOperation = "ALLOW_SCAN"`** on a Sandbox rule. An operator asking "how do I configure first-time file behavior via API" has a full CRUD path — it's not a console-only feature.

Python SDK may not cover all these fields; Go SDK is authoritative for the full surface today.

## Discan API — out-of-band instant inspection

Separate from `SubmitFile` (which submits to Sandbox for full dynamic analysis), Go SDK exposes **`Discan`** (`sandbox_submission.go:44` — `POST /zscsb/discan`) for **real-time out-of-band file inspection** without dynamic analysis. Combines:

- AV (anti-virus) signature matching
- ATP (Advanced Threat Protection) reputation checks
- Sandbox cloud-effect lookup (known-file verdict if already analyzed by any tenant)
- AI/ML scoring

Use case: an operator wants an instant verdict on a file, doesn't want to queue it for 3-10 minutes of dynamic analysis. Discan returns AV+ATP+cloud-effect+AI verdicts synchronously. Won't catch novel malware that needs dynamic-analysis detection, but catches a high fraction of known-bad and reputation-scored files instantly.

## Open questions

- **No API for Malware Protection or ATP block diagnosis** — the MCP server documents this gap explicitly. Skill should surface this limitation when users hit either policy type. Candidate for a new clarification if we find it warrants one.
- ~~**Sandbox quota semantics** — `zia_get_sandbox_quota` exists but response schema isn't documented in the vendored MCP skill. Unclear what the units are (files/day? bytes/month?).~~ **Resolved (2026-04-24)**: Go SDK `RatingQuota` struct (`sandbox_report.go:18-25`) defines the response as `{ StartTime int, Used int, Allowed int, Scale string, Unused int }`. Quota is a **time-bounded count of report retrievals**, not bytes — `StartTime` is epoch; `Scale` is the time unit (hour/day/month/etc.); `Used`/`Allowed`/`Unused` are report-count buckets. Quota applies to the Sandbox report-fetch API, not to submission volume.

## Cross-links

- SSL inspection — upstream gate for sandbox visibility — [`./ssl-inspection.md`](./ssl-inspection.md)
- URL filtering — may block before Sandbox engages — [`./url-filtering.md`](./url-filtering.md)
- Activation gate — Sandbox rule changes stage like any other ZIA config — [`../shared/activation.md`](../shared/activation.md)
