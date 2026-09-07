# Updating the Host OS and Software Packages

**Source:** https://help.zscaler.com/zpa/updating-host-os-and-software-packages
**Captured:** 2026-09-07 via rendered Zscaler Help article in browser.
**Capture form:** scoped paraphrase of introductory guidance and prerequisites; component-specific command panels are excluded.

## Responsibility and supported update context

The organization is responsible for the host OS and software-package updates
for App Connectors, Private Service Edges, Private Cloud Controllers, and
Network Connectors. Zscaler separately updates its component software. The
article says its procedure can update RHEL 9.4 or 9.5 to RHEL 9.6 and later.

## Maintenance prerequisites

- Zscaler recommends OS updates at least every five weeks.
- Validate component connectivity to the update servers.
- Prebuilt-image components must be provisioned to a Private Access tenant
  to receive software updates through the OS package manager.

## Update window and capacity

Local policy determines the OS update schedule. The article recommends warning
users about possible rolling reconnections and estimates 20 minutes of downtime
per component during the update.

Do not update every App Connector or Private Service Edge in a group at once.
Concurrent updates within a group are allowed when enough remaining components
are running to carry the traffic load.

## Capture boundary

The downtime is a vendor estimate, not a measured guarantee for a tenant. This
capture does not reproduce the component-specific command sequences or prove
the safety of an upgrade on a particular image, tenant, or deployment.
