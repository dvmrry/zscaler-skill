# Using Application Segment Multimatch

**Source:** https://help.zscaler.com/zpa/using-app-segment-multimatch
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/zpa/using-app-segment-multimatch
**Help node:** `1485951`
**Help revision:** `3227044`
**Body content length:** 28,216 HTML characters
**Public PDF:** https://help.zscaler.com/pdf/gov/en/1485951.pdf

---

Multimatch allows an application request to match multiple application
segments. Private Access evaluates Multimatch across application segments that
include the same applications. If overlapping domains have different
Multimatch settings, the application segment cannot be updated.

## Prerequisites

The page requires App Connectors or Private Service Edges to be version
24.298.1 or later. It lists these Zscaler Client Connector minimum versions:

- Windows: 4.7.0.88 or later, or 4.6.0.282 or later.
- macOS: 4.5.2.98 or later.
- iOS: 4.4.1 or later. The Use Tunnel SDK Version 4.3 or above setting must
  also be enabled for iOS Multimatch.
- Android: 3.10 or later.
- Linux: 4.2 or later.

## Current restriction evidence

The current body states:

> Multimatch must be disabled if the configuration contains applications using
> Double Encryption and Source IP Anchor.

The page does not repeat the former blanket list covering Browser Access,
AppProtection, Privileged Remote Access, and Inspect Traffic with ZIA. The
current ZPA release summary separately records **Support for Internet & SaaS
Inspection with Multimatch** on 2026-08-21 and links this article and
Configuring Defined Application Segments.

When Multimatch is enabled, a Multimatch Validation window shows impacted
application segments and conflicting features. The page directs an
administrator to disable unsupported features, review conflicts in a local
Microtenant, contact the default administrator when the default segment is
involved, or cancel and disable Multimatch when another local tenant owns a
segment.

The current **Matched vs. Not Matched** guidance says that multiple matches are
applied from the most specific application to the least specific application.
As soon as an application is encountered that does not support Multimatch, the
multimatching stops.

## Matching and connector selection

With Multimatch disabled, the default behavior selects the more granular
application segment. With Multimatch enabled, the wildcard segment can catch
ports not configured on a more specific FQDN segment. If wildcard and specific
FQDN segments both have Multimatch enabled, the specific segment's server group
is used for App Connector selection. Multiple Multimatch segments for one FQDN
with different ports must use the same server group; otherwise any server group
can be randomly selected.

This capture records only the restrictions explicitly present in the current
public body. It does not infer a complete feature-compatibility matrix.
