# ZIA Release Upgrade Summary — July 2026

**Source:** https://help.zscaler.com/zia/release-upgrade-summary-2026
**Captured:** 2026-08-04 via the official Help Center article payload.

---

This capture records the July 1–31 items needed by the authored reference
corpus. It is a scoped summary of the rendered release page, not a complete
copy of the release history.

## July 31, 2026

### Canada isolation region

- Canada is available as a Zero Trust Browser isolation region when
  configuring isolation profiles for Internet & SaaS (ZIA).

## July 17, 2026

### Select All and Hide Deleted for log filtering

- The Users, Departments, and Locations filters gain **Select All** and
  **Hide Deleted** options on Web, Firewall, DNS, Tunnel, SaaS Security,
  Endpoint DLP, and Email DLP Insights Logs pages.
- The same options are available on the applicable Users, Departments, and
  Locations filters in TCP NSS, MCAS NSS, HTTP NSS, and Cloud NSS feeds for
  Web, Firewall, DNS, Tunnel, SaaS Security, Endpoint DLP, and Email DLP logs.

This is an Admin Console and feed-filtering change. The release entry does not
state that the raw log schemas or API filtering parameters changed.

## July 13, 2026

### Virtual Service Edge on Nutanix

- ZIA supports Virtual Service Edge configuration on Nutanix.
- The Nutanix VM image is downloadable from the Virtual Service Edges page.

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
