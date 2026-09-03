# Secure Access to AI Apps — Release Upgrade Summary (2026)

**Source:** https://help.zscaler.com/secure-ai-users/release-upgrade-summary-2026
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info`, `data.body.release_notes`, and linked public article metadata).
**Status:** 200
**Canonical:** https://help.zscaler.com/secure-ai-users/release-upgrade-summary-2026
**Help node:** `1539123`
**Help revision:** `3202337`
**Release-notes payload length:** 45,648 JSON characters
**Capture form:** scoped paraphrase of the public release chronology; the
release-vs-body discrepancy below is intentionally preserved.

---

## August 26, 2026 — AI Guard for Users 08/26/2026

### Additional CrowdStrike Log Export Option

AI Guard supports **CrowdStrike SIEM Direct Export** alongside the existing
S3-dependent CrowdStrike option. The release entry says administrators can
choose direct export to the CrowdStrike HEC endpoint or route event content
through an intermediary AWS S3 bucket.

### New CrowdStrike Parser for AI Guard

CrowdStrike's portal includes an AI Guard parser under the Generic bender
connection type named `zscaler-aiguard`.

### Enhancements and bug fixes

- Topic definitions now support up to 1,000 characters.
- LLM Provider match criteria support up to 100 entries, up from 10.
- Detector version information appears in the Policy Configuration UI.
- All detectors support base64.

The release entry is ID `1543094` and links to [Managing AI Guard Log
Exports](https://help.zscaler.com/secure-ai-users/managing-ai-guard-log-exports).

## August 12, 2026 — AI Guard for Users 08/12/2026

AI Guard supports direct browser interactions with **Copilot.com**, including
request blocking, response blocking, and custom messages. The release entry
requires the ZIA configuration URL `www.copilot.com`. Entry ID: `1543000`.
See [Integrating ZIA with AI Guard](https://help.zscaler.com/secure-ai-users/integrating-zia-ai-guard).

## August 10, 2026 — AI Guard for Users 08/10/2026

AI Guard supports **Copilot in Excel**, including request blocking, response
blocking, and custom messages. The release entry requires the ZIA
configuration URL `augloop.office.com`. Entry ID: `1542999`.
See [Integrating ZIA with AI Guard](https://help.zscaler.com/secure-ai-users/integrating-zia-ai-guard).

## August 7, 2026 — AI Guard for Users 08/07/2026

- Log exports can filter out the Tools field; the option is enabled by default
  for new and existing exports.
- AI Guard can integrate with Anthropic Claude inference hooks to inspect and
  evaluate prompts against a tenant detection policy and return an Allow or
  Deny verdict.
- Malicious URLs can be configured as a prompt-policy detection category.
- The Text (Pattern) detector supports up to 100 regex patterns per policy,
  increased from 10; each pattern can be up to 3,000 characters.
- Dashboard event tables support CSV export in addition to PDF.

Entry ID: `1542715`. See [Managing AI Guard Log
Exports](https://help.zscaler.com/secure-ai-users/managing-ai-guard-log-exports)
and [Managing Tenant Settings](https://help.zscaler.com/secure-ai-users/managing-tenant-settings).

## July 31, 2026 — AI Guard for Users 07/31/2026

The US Government ID category in the Secrets detector supports only Detect and
Disable. Existing BLOCK or ALLOW configurations transition to Disabled when a
Secrets policy configuration is updated, and newly created policies default
the category to Disabled.

Entry ID: `1542685`. See [Adding and Managing AI Guard Policy
Configurations](https://help.zscaler.com/secure-ai-users/adding-and-managing-ai-guard-policy-configurations).

## Release-note versus current log-export body

The 2026-08-26 release note above documents CrowdStrike SIEM Direct Export and
the `zscaler-aiguard` parser. On 2026-09-03, the current public bodies for
[AI Guard for Users log exports](https://help.zscaler.com/secure-ai-users/managing-ai-guard-log-exports)
and [AI Guard for Apps & Infrastructure log
exports](https://help.zscaler.com/secure-ai-apps-infra/managing-ai-guard-log-exports)
still describe CrowdStrike metadata sent to HEC and event contents sent to an
AWS S3 bucket; neither body contains the terms **Direct Export**, **SIEM**, or
`zscaler-aiguard`. The current body metadata is:

| Page | Status | Canonical | Help node | Revision | Body length |
|---|---:|---|---:|---:|---:|
| [AI Guard for Users log exports](https://help.zscaler.com/secure-ai-users/managing-ai-guard-log-exports) | 200 | `/secure-ai-users/managing-ai-guard-log-exports` | `1540889` | `3224164` | 12,759 HTML chars |
| [AI Guard for Apps & Infrastructure log exports](https://help.zscaler.com/secure-ai-apps-infra/managing-ai-guard-log-exports) | 200 | `/secure-ai-apps-infra/managing-ai-guard-log-exports` | `1541825` | `3224165` | 12,892 HTML chars |

This capture records the discrepancy and does not decide whether the release
note or either current body is authoritative.

---

## July 10, 2026

- Tenant restriction can distinguish personal accounts, enterprise accounts, or both for Anthropic and OpenAI traffic.
- Microsoft 365 Copilot streaming-response inspection is available for the M365 web experience, M365 desktop apps, Word, and Outlook web.

## June 29, 2026 — AI Guard 2.19.0

- Added an encrypted prompt allowlist.
- Expanded detection detail presentation, PII/secret span highlighting, and prompt-injection explainability.
- Added Windsurf as a supported provider.

## June 15, 2026 — AI Guard 2.18.3

- Added detected entities and confidence scores to dashboard detection summaries.
- Added Japanese to the Language detector and label disabling to the Secrets detector.

## May 30 and May 15, 2026 — AI Guard 2.17.0 / 2.16.0

- Added Mistral Vibe as a provider.
- Added Gemini CLI support in Proxy mode and Bedrock Anthropic traffic support in User mode.

## May 1, 2026 — AI Guard 2.15.1

- Replaced the fixed Administrator/Editor/Viewer role model with custom roles and permissions.
- Added Azure Data Explorer export through Azure Event Hub for event metadata and content.

## April 24, 2026 — AI Guard 2.14.2

- Added Codex application support for request and response blocking; existing ChatGPT forwarding covers the required ZIA URL configuration.
- Added GitHub Copilot prompt visibility and blocking, while response inspection remained unsupported in this release.
- Added AWS account ID display and manual ZIA synchronization to tenant settings.
- Added Microsoft 365/Copilot response-blocking improvements and Audit Log entries for policy changes.

## April 10, 2026 — AI Guard 2.13.1

- New tenants automatically receive preconfigured default LLM providers; existing customers are unaffected.
- Added ElevenLabs text-to-speech support.

## March 27 and March 18, 2026 — AI Guard 2.12.0 / 2.11.0

- Added the Intellectual Property detector, PII detector action disabling, prompt-action log-export filters, chat-history deletion, and PDF exports.
- Added Napkin AI, DeepAI, Gemini Enterprise, OpenCode, Gamma, Builder.io, MaxAI, Lovable, Bolt, and Gemini Code coverage. The March 18 User-mode additions supported request blocking only.

## February 27, 2026 — AI Guard 2.10.0

- Added Splunk log export and initial Gemini Workspace User-mode support.
- Expanded PII visualizations and added entity-level Audit Log diffs.
