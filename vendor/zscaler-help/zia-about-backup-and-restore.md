# About Backup and Restore (ZIA)

**Source:** https://help.zscaler.com/zia/about-backup-and-restore
**Captured:** 2026-08-04 via the official Help Center article payload.

---

This capture records the operational behavior and limits needed by the authored
reference corpus. It is a scoped summary rather than a complete copy of the
article's policy catalog.

## Restore-point behavior

- Backups of policies and configuration settings can be created manually or
  through a schedule in the Zscaler Admin Console.
- A restore point represents the policies and configuration settings saved at
  the backup's date and time.
- Restoring a point overwrites all current policies and configuration settings,
  including rules and rule components such as URL categories and time
  intervals.
- A component in the current configuration that is absent from the selected
  restore point is removed during the restore.

## Limits and retention

- An organization can retain up to 12 restore points across manual and
  scheduled backups.
- One restore point can be designated the Golden Restore Point. It is retained
  indefinitely and cannot be deleted.
- When 12 restore points already exist, an administrator cannot create another
  manual point until an existing point is deleted.
- A scheduled backup at the limit removes the oldest restore point. If the
  oldest point is the golden point, the next-oldest point is removed instead.

## Data Loss Prevention boundary

- For organizations with Exact Data Match (EDM) or Indexed Document Match
  (IDM) enabled, Backup and Restore does not restore Data Loss Prevention (DLP)
  policies.

## Admin Console surface

- The feature is available at **Administration > Backup & Restore > Internet &
  SaaS Applications**.
- The page supports manual point creation, search, inventory, golden-point
  identification, and viewing or restoring saved policies and configurations.

This scoped capture does not reproduce the article's complete list of included
policy families. Do not infer that an unlisted policy or configuration family
is included in or excluded from a restore point.
