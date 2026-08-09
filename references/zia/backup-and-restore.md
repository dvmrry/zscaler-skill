---
product: zia
topic: "backup-and-restore"
title: "ZIA Backup and Restore — restore semantics, retention, and DLP boundary"
content-type: reference
last-verified: "2026-08-04"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/zia-about-backup-and-restore.md"
author-status: draft
---

# ZIA Backup and Restore — restore semantics, retention, and DLP boundary

Source: `vendor/zscaler-help/zia-about-backup-and-restore.md`.

ZIA can create backups of policies and configuration settings manually or on a
schedule. Each backup becomes a restore point representing the saved state at
that date and time (`vendor/zscaler-help/zia-about-backup-and-restore.md:12-17`).
The Admin Console surface is **Administration > Backup & Restore > Internet &
SaaS Applications** (`vendor/zscaler-help/zia-about-backup-and-restore.md:41-46`).

## Restore is replacement, not a merge

Restoring a point overwrites the current policies and configuration settings,
including rules and rule components such as URL categories and time intervals.
A component present in the current configuration but absent from the selected
restore point is removed during the restore
(`vendor/zscaler-help/zia-about-backup-and-restore.md:18-22`).

Treat restore as replacement of the covered policies and configuration, not as
a merge. Account for changes made after the selected point because the
documented restore behavior removes covered components that are absent from the
saved point (`vendor/zscaler-help/zia-about-backup-and-restore.md:18-22`).

## Restore-point limits and retention

| Condition | Documented behavior |
|---|---|
| Total retained points | Up to 12 across manual and scheduled backups (`vendor/zscaler-help/zia-about-backup-and-restore.md:24-27`) |
| Golden point | One point can be designated golden; it is retained indefinitely and cannot be deleted (`vendor/zscaler-help/zia-about-backup-and-restore.md:28-29`) |
| Manual backup at 12 points | Creation is blocked until an existing point is deleted (`vendor/zscaler-help/zia-about-backup-and-restore.md:30-31`) |
| Scheduled backup at 12 points | The oldest non-golden point is removed; if the oldest point is golden, the next-oldest point is removed (`vendor/zscaler-help/zia-about-backup-and-restore.md:32-33`) |

The retention behavior differs between manual and scheduled creation: reaching
the limit blocks another manual point, while a scheduled run can evict an older
non-golden point.

## DLP boundary

For organizations with Exact Data Match (EDM) or Indexed Document Match (IDM)
enabled, Backup and Restore does **not** restore Data Loss Prevention policies
(`vendor/zscaler-help/zia-about-backup-and-restore.md:35-39`). Do not treat a
successful restore as evidence that the tenant's DLP policy state was restored
when either feature is enabled.

## Coverage boundary

The captured source intentionally does not reproduce the Help article's full
catalog of included policy and configuration families. An unlisted family must
not be inferred to be either included in or excluded from a restore point
(`vendor/zscaler-help/zia-about-backup-and-restore.md:48-50`). This page is
therefore scoped to the captured Help/Admin Console behavior and does not
generalize those semantics to an API, SDK, Terraform provider, or MCP surface.

## Cross-links

- DLP policy behavior: [`./dlp.md`](./dlp.md)
- Time-interval rule components: [`./time-intervals.md`](./time-intervals.md)
- URL-category and rule behavior: [`./url-filtering.md`](./url-filtering.md)
- ZIA reference hub: [`./index.md`](./index.md)
