# ZIA Release Upgrade Summary — July 2026

**Source:** https://help.zscaler.com/zia/release-upgrade-summary-2026
**Captured:** 2026-07-22 via Codex Browser (rendered article inspection).

---

This capture records the July 1–6 items needed by the authored reference
corpus. It is a scoped summary of the rendered release page, not a complete
copy of the release history.

## July 6, 2026

### NSS support for 3rd-Party App Governance and Posture Management logs

- ZIA supports both NSS and Cloud NSS feeds for 3rd-Party App Governance and
  Posture Management logs so those records can be streamed to a SIEM.
- Access to both log types requires an Advanced SaaS Security Posture
  Management subscription.
- A 3rd-Party App Governance policy can select Zscaler Nanolog Streaming
  Service so that policy-triggered alerts are delivered through NSS.
- The Help page links to feed-configuration and output-format articles for both
  log families.

### Cloud NSS API

- The `nssLogType` field of the `ZmanageNssFeed` model used by `/nssFeeds`
  gains the enum values `POSTURE_CONTROL` and `APP_GOVERNANCE`.

### Cloud application catalog

- New cloud applications and updates to existing cloud applications are rolled
  out in phases; risk data becomes visible after the new applications are
  available on all clouds.

## July 1, 2026

- Enterprise Browser for Zero Trust Browser is listed as limited availability.
  The release describes protected access to private applications alongside
  browser controls for file transfer, data sharing, and cloud-service
  authentication.
