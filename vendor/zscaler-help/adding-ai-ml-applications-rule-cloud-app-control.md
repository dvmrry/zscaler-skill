# Adding an AI/ML Applications Rule for Cloud App Control

**Source:** https://help.zscaler.com/zia/adding-ai-ml-applications-rule-cloud-app-control
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/zia/adding-ai-ml-applications-rule-cloud-app-control
**Help node:** `1459041`
**Help revision:** `3228648`
**Body content length:** 29,648 HTML characters
**Public PDF:** https://help.zscaler.com/pdf/gov/en/1459041.pdf

---

This page describes an AI/ML Applications rule for the ZIA Cloud App Control
policy. It is distinct from the generic Cloud App Control rule article.

## Granular actions

The current public body lists these granular actions:

- ChatGPT: Chatting, Uploading, Downloading, Deleting, Sharing, and Inviting.
- Google Gemini: Chatting, Downloading, Renaming, and Uploading.
- Microsoft Copilot: Chatting, Deleting, Renaming, Sharing, and Uploading.
- Perplexity: Chatting, Deleting, Sharing, and Uploading.
- Poe: Chatting, Deleting, Sharing, and Uploading.
- Runway: Creating, Deleting, Downloading, Renaming, and Sharing.

When multiple applications are selected together, only their common granular
actions appear. The page requires SSL/TLS Inspection for granular actions to
work as expected.

## Capture Prompts

The current body documents a **Capture Prompts** option:

> Enable this option to categorize and store end user prompts (up to 2 KB in
> size) for generative AI (Gen AI) applications.

The page states that prompts are stored in Zscaler logs for the period defined
by the organization, and authorized users with log access can view prompts
entered by end users. The option appears only when Gen AI applications that
support prompt configuration are selected. The page directs administrators to
Configuring Advanced Policy Settings for more information.

## Other AI/ML rule behavior

The page documents daily bandwidth and time quotas, rule actions, notification
settings, and tenant profiles. **Tenant Profiles** appears only when ChatGPT
or Claude is selected as the cloud application, and the selected applications
must not be exempted from SSL/TLS Inspection.
