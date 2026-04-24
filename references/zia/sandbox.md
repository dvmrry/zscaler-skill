---
product: zia
topic: "zia-sandbox"
title: "ZIA Sandbox — what gets analyzed, what blocks, and why"
content-type: reasoning
last-verified: "2026-04-23"
confidence: medium-high
sources:
  - "vendor/zscaler-mcp-server/commands/investigate-sandbox.md"
  - "vendor/zscaler-mcp-server/skills/zia/investigate-sandbox/SKILL.md"
  - "vendor/zscaler-help/ZIA_SSL_Inspection_Leading_Practices_Guide.pdf (SSL-as-prerequisite)"
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

## Open questions

- **No API for Malware Protection or ATP block diagnosis** — the MCP server documents this gap explicitly. Skill should surface this limitation when users hit either policy type. Candidate for a new clarification if we find it warrants one.
- **Sandbox quota semantics** — `zia_get_sandbox_quota` exists but response schema isn't documented in the vendored MCP skill. Unclear what the units are (files/day? bytes/month?).

## Cross-links

- SSL inspection — upstream gate for sandbox visibility — [`./ssl-inspection.md`](./ssl-inspection.md)
- URL filtering — may block before Sandbox engages — [`./url-filtering.md`](./url-filtering.md)
- Activation gate — Sandbox rule changes stage like any other ZIA config — [`../shared/activation.md`](../shared/activation.md)
