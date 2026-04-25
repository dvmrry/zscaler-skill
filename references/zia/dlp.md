---
product: zia
topic: "zia-dlp"
title: "ZIA Data Loss Prevention — dictionaries, engines, policy rules"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/about-dlp-engines"
  - "vendor/zscaler-help/about-dlp-engines.md"
  - "https://help.zscaler.com/zia/about-dlp-dictionaries"
  - "vendor/zscaler-help/about-dlp-dictionaries.md"
  - "https://help.zscaler.com/zia/configuring-dlp-policy-rules-content-inspection"
  - "vendor/zscaler-help/configuring-dlp-policy-rules-content-inspection.md"
  - "https://help.zscaler.com/zia/understanding-predefined-dlp-dictionaries"
  - "vendor/zscaler-help/understanding-predefined-dlp-dictionaries.md"
  - "vendor/zscaler-help/Understanding_Policy_Enforcement.pdf"
author-status: draft
---

# ZIA Data Loss Prevention (DLP)

Detects sensitive data in user traffic and decides whether to allow, block, or forward the event for downstream handling. The detection engine for Data Protection across ZIA — consumed by URL Filtering / Cloud App Control (as a pipeline gate) and by Workflow Automation (as the incident source).

## Summary

Three-layer object model:

1. **DLP Dictionaries** — detection primitives. Predefined (credit card numbers, SSNs, HIPAA, etc.) or custom (operator-defined patterns, phrases, Microsoft Information Protection labels, exact data matching).
2. **DLP Engines** — collections of one or more dictionaries with Boolean operators (AND / OR / NOT). The reusable detection units.
3. **DLP Policy Rules** — reference **engines**, not dictionaries directly. Rules define who, when, what action when an engine triggers.

**Critical constraint**: DLP policy rules reference engines, never dictionaries directly. An operator asking "can I write a DLP rule that matches my custom dictionary X?" — they have to wrap X in an engine first. Creates a one-level indirection that's easy to forget.

**SSL decrypt dependency** (recurring theme — see [`./ssl-inspection.md § SSL bypass is a cross-policy gate`](./ssl-inspection.md)): DLP engines need decrypted content to inspect. Without SSL Inspection decrypting the traffic, DLP sees nothing. The single most common "DLP didn't fire" cause is an SSL Inspection bypass upstream.

**Downstream: ZWA.** DLP incidents flow into Workflow Automation for triage + automated remediation. See [`../zwa/overview.md`](../zwa/overview.md) for the incident lifecycle.

## Mechanics

### DLP Dictionaries

From *About DLP Dictionaries*:

> A DLP dictionary contains a set of patented algorithms that are designed to detect specific kinds of information in your users' traffic and activities.

Three categories:

**Predefined dictionaries** — Zscaler ships hundreds of these covering: credit cards, SSNs, passport numbers, bank account numbers, HIPAA data, GDPR categories, financial terms, medical terms, source code signatures, API keys, and MANY more. The *Understanding Predefined DLP Dictionaries* article enumerates all of them; as of capture the list is large (~170K char article). Can be **edited** (some) or **cloned** (most).

**Custom dictionaries** — operator-defined for tenant-specific data. Four composition methods:

- **Patterns** — regex-style patterns matching format-specific strings (account numbers, internal ID formats, etc.).
- **Phrases** — literal string matches for tenant-specific terminology, project code names, legal document markers.
- **MIP (Microsoft Information Protection) labels** — match files with specific MIP classification labels applied. Cross-product with Microsoft 365 classification.
- **Exact Data Matching (EDM)** — matches against a specific data set (an uploaded list of customer records, employee PII, etc.). Stronger than pattern matching because false-positive rate is near-zero.

**Confidence Score Threshold** — each dictionary has a threshold that governs what counts as a violation vs noise. Tunable per-dictionary; conservative for high-signal patterns (credit cards → low threshold = many matches), strict for fuzzy patterns (medical terms → high threshold = only confident matches).

### DLP Engines

From *About DLP Engines*:

> A DLP engine is a collection of one or more DLP dictionaries. When you define your DLP policy rules and Endpoint DLP policy rules, you must reference DLP engines, rather than DLP dictionaries.

**Compose with Boolean operators.** An engine can say "(CreditCards OR SSNs) AND Healthcare" to detect a record that contains financial-OR-identity data in a medical context. Composite engines give operators policy-rule-level detection logic without bloating the rule set.

Zscaler ships predefined engines (HIPAA, PCI, GDPR, etc.) that already combine multiple dictionaries per regulation. Custom engines let operators compose their own.

**Channels** (*About DLP Engines*): an engine can be scoped to specific channels — Network Share, Personal Cloud Storage, Printing, Removable Storage. These are the **Endpoint DLP** channels; engines scoped to them only trigger on that traffic type. Inline (web) DLP engines don't need channel scoping.

### DLP Policy Rules with Content Inspection

From *Configuring DLP Policy Rules with Content Inspection*:

Location: `Policy > Data Loss Prevention`.

Rule attributes:

- **Rule Order** — ascending numerical, first-match-wins. Same pattern as URL Filter (see [`./url-filtering.md`](./url-filtering.md)).
- **Admin Rank** — 0 (highest) to 7. Rules with higher admin rank always precede lower; rank gates which Rule Order values an admin can select.
- **Rule Status** — Enabled / Disabled. Disabled rules retain their order slot (same pattern as URL Filter).
- **Rule Label** — freeform categorization tag.

Rule criteria:

- **Content Matching** — select DLP engines (up to 4 per rule). "Any" applies to all engines.
- **Match Only mode** — for both Allow and Block actions, controls how engines must trigger together. See *DLP Policy Configuration Example: Match Only* in Zscaler docs.
- **Inspect HTTP GET Query Parameters** — enables DLP inspection on URL query strings for specific URL categories: Generative AI and ML Applications, Safe Search Engines, Translation Tools, Web Search, and User-Defined Custom URL Categories. **Particularly relevant for GenAI-prompt data exfil detection** (pairs with the LLM-vendor prompt-tracking flags in Advanced URL Settings — see [`./url-filtering.md § GenAI prompt-tracking flags`](./url-filtering.md)).

### Content inspection limits

**File size limits** (*Configuring DLP Policy Rules with Content Inspection* + *About DLP Engines*):

- **400 MB max file size** — files larger than this aren't inspected. Applies to files inside archives as well (each archive entry checked against the 400 MB cap).
- **100 MB max extracted text** — DLP scans only the first 100 MB of extracted text from a file. A 400 MB DOCX with 200 MB of extracted text has its last 100 MB un-inspected.
- **5 levels of compression** — nested archives beyond 5 levels deep aren't scanned. An attacker wrapping payload in 6-level-nested ZIPs silently evades DLP.

These limits affect real operational questions — "why didn't DLP catch this 500 MB PDF?" lands on the first limit.

### "Evaluate All Rules" mode

> This article does not apply to organizations with Evaluate All Rules mode enabled.

Default DLP evaluation is first-match-wins (the usual pattern). **Evaluate All Rules** is an alternative mode that runs every DLP rule against every request. Why: when you want to log ALL DLP violations for audit purposes, not just the first match. Covered in a separate help article (*Configuring DLP Policy Rules with Evaluate All Rules Mode Enabled*, not captured here).

Tenants in Evaluate All Rules mode have a fundamentally different DLP-rule mental model. Skill answers about DLP evaluation order must branch on this mode. If uncertain, check the tenant config or ask.

### Forwarding paths — what happens when a rule fires

Four destinations for DLP events (from *Configuring DLP Policy Rules with Content Inspection*):

1. **ZIA native action** — Allow or Block the transaction. The rule's default behavior.
2. **DLP notification templates** — email the organization's auditor when a rule fires. Admin-configured templates.
3. **ICAP receivers (third-party DLP)** — forward DLP-relevant transaction data to a third-party DLP solution (RSA, Symantec, etc.) via secure ICAP. **Zscaler does not accept ICAP responses** — ICAP is one-way forwarding, not a decision-making handoff. Zscaler decides based on its own policy; the third-party solution gets a copy for analysis.
4. **Zscaler Incident Receiver** — Zscaler-native destination for outbound email policy rule content. Same ICAP transport; still one-way.
5. **Cloud-to-Cloud Incident Forwarding (C2C)** — forward metadata + evidence directly to the customer's public cloud storage (AWS S3, Azure Blob, etc.). No appliance to deploy. This is where **ZWA ingests its incidents** (see [`../zwa/overview.md`](../zwa/overview.md)) — ZWA reads from the C2C incident stream.

### Pipeline position

DLP evaluates in the **full-URL pass** post-decrypt (per [`./ssl-inspection.md § Pipeline position`](./ssl-inspection.md)). Specifically:

```
Firewall module  (pass?)
      ↓
Web module — SNI/CONNECT pass  (domain-only: URL Filter, CAC, known-bad ATP, Bandwidth)
      ↓
SSL Inspection decision  (decrypt? bypass?)
      ↓
Web module — Full-URL pass  (URL Filter, CAC, ATP content, DLP, Sandbox, Malware, File Type, IPS)
```

DLP is in the terminal tier of the full-URL pass alongside Sandbox, Malware, File Type Control, and IPS content checks. All of these **share the SSL-decrypt dependency** — bypass SSL for a URL and all of them silently stop working for that URL.

## Cross-product hooks

| Direction | Hook | Failure mode |
|---|---|---|
| Upstream ← SSL Inspection | DLP needs decrypted content | SSL bypass silently disables DLP for matching traffic |
| Upstream ← URL Filter / CAC | If URL/CAC blocks first, DLP never evaluates | "DLP didn't catch this" may be because the user was URL-blocked upstream before DLP saw the payload |
| Downstream → ZWA | DLP incidents flow to Workflow Automation via C2C Incident Forwarding | If C2C isn't configured, ZWA never sees incidents even if DLP is firing |
| Downstream → ICAP third-party | Forwarded transaction data | One-way — third-party can analyze but can't change Zscaler's decision |
| Downstream → Notification templates | Email to auditor | Template must be configured separately; rule-level enablement alone doesn't produce email |

## Endpoint DLP

The channels on an engine (Network Share, Personal Cloud Storage, Printing, Removable Storage) indicate this is **Endpoint DLP** — DLP enforced by Zscaler Client Connector on the endpoint itself, not by the Public Service Edge. Endpoint DLP is a distinct feature that uses the same dictionaries and engines but runs agent-side. Key differences:

- **Enforcement location**: endpoint, not cloud.
- **Traffic scope**: user activity on the endpoint (file uploads to USB, printing, copying to network share, moving to personal cloud like Dropbox/OneDrive-personal) — not web traffic.
- **Requires ZCC** with Endpoint DLP entitlement.
- **Separate policy rule type** from inline DLP rules.

Not deeply covered here; flagged for future work if operators need it.

## Outbound Email DLP

A distinct DLP variant (*What Is Zscaler Outbound Email DLP?* — referenced but not captured). Scans outbound email at the email-gateway layer rather than web traffic. Uses the same dictionaries and engines. Zscaler Incident Receiver is specifically for outbound email policy rule content.

Not deeply covered here.

## Edge cases

- **Archive inspection has a 5-level recursion limit.** Nested ZIPs beyond 5 levels aren't scanned. Separate from the 400 MB file size limit.
- **Content beyond 100 MB of extracted text isn't scanned.** An operator reporting "DLP didn't catch content in a big document" — the content may have been past the 100 MB inspection window.
- **`Any` engine selection in a rule** — selects all engines. Risky in broad allowing/blocking rules; can cascade-trigger on unrelated dictionaries.
- **ICAP receivers are one-way.** Third-party DLP can see the traffic but can't veto Zscaler's decision. Operators coming from Symantec DLP / Forcepoint DLP where third-party is decisive sometimes expect different semantics.
- **Evaluate All Rules mode changes evaluation fundamentally.** A tenant migrating between modes needs to re-verify rule behavior — rules that were dormant under first-match-wins may all start firing.
- **DLP rule scope depends on SSL Inspection rule scope.** DLP can't scope tighter than SSL Inspection decrypts. If SSL Inspection decrypts only a subset of traffic, DLP's effective scope is that subset regardless of what the DLP rule's criteria say.
- **Large file uploads time out before DLP completes.** For files close to the 400 MB cap, DLP may take long enough that the HTTP connection's underlying timeout intervenes. Investigate with Web Insights — look for "DLP pending" or timeout states in log records.

## Open questions

- **Exact confidence-score threshold semantics** for predefined dictionaries — the thresholds are tunable but the score-to-confidence mapping isn't numeric in the help docs. Needs tenant tuning based on false-positive rates.
- **Whether MIP label matching requires Microsoft 365 integration config** on the Zscaler side, or works purely from document-metadata inspection.
- **Evaluate All Rules mode — specific semantics** for conflicting rule actions. If Rule 1 Blocks and Rule 3 Allows the same event, and both fire under Evaluate All Rules, what's the terminal action? Not captured here; help article exists (not yet vendored).
- **EDM (Exact Data Matching) operational mechanics** — how the matching works without the source data leaving the tenant, hashing approach, update cadence. Likely covered in separate help articles.

## Cross-links

- SSL Inspection (upstream decrypt dependency) — [`./ssl-inspection.md`](./ssl-inspection.md)
- URL Filtering (upstream gate; may block before DLP sees traffic) — [`./url-filtering.md`](./url-filtering.md)
- Cloud App Control (parallel decryption dependency) — [`./cloud-app-control.md`](./cloud-app-control.md)
- Malware Protection / ATP (adjacent cybersecurity-policy family sharing pipeline position) — [`./malware-and-atp.md`](./malware-and-atp.md)
- Sandbox (another SSL-decrypt-dependent detection engine) — [`./sandbox.md`](./sandbox.md)
- ZWA Workflow Automation (downstream incident lifecycle) — [`../zwa/overview.md`](../zwa/overview.md)
- Cross-product integration catalog (SSL-decrypt gate + ZWA hook) — [`../shared/cross-product-integrations.md`](../shared/cross-product-integrations.md)
