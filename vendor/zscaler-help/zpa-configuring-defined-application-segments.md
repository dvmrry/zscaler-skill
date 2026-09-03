# Configuring Defined Application Segments

**Source:** https://help.zscaler.com/zpa/configuring-defined-application-segments
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/zpa/configuring-defined-application-segments
**Help node:** `1483606`
**Help revision:** `3225278`
**Body content length:** 64,125 HTML characters
**Public PDF:** https://help.zscaler.com/pdf/gov/en/1483606.pdf

---

This capture records the current public body statements that govern defined
application segments and their feature interactions. It contains no tenant
configuration, session data, or entitlement inference.

## Segment setup

The page directs administrators to **Policies > Access Control > Private
Applications > Defined Application Segments**, then **Add Application
Segment**. An application segment can define applications individually or use
application discovery, specify the server groups hosting them, and specify the
App Connector groups that can reach those server groups.

The page documents these controls under **Define Applications**:

- **Status** enables the segment; a disabled segment's defined applications are
  inaccessible to users.
- **Source IP Anchor** is optional. It is tied to Source IP Anchoring for
  Internet & SaaS (ZIA), and is not supported for extranet resources.
- **Inspect Traffic with ZIA** enables a single posture for Internet/SaaS and
  private-application security and permits ZIA Data Loss Prevention policies
  to apply to the segment. If Source IP Anchor is enabled, it must be disabled
  before Inspect Traffic with ZIA can be enabled; the page says the two
  settings cannot both be enabled.
- **Auto AppProtection** enables AppProtection inspection. It requires an
  enrollment certificate and is not supported for extranet resources. If
  Active Directory Inspection is enabled, Auto AppProtection cannot be
  enabled, and vice versa.
- **Double Encryption** adds a second encryption layer between Zscaler Client
  Connector and the App Connector. The page says it cannot be enabled when
  Browser Access or Source IP Anchoring is selected, and should be disabled
  for extranet applications.
- **Bypass during Reauthentication** controls whether application access
  bypasses Private Access during reauthentication.

## Current Multimatch controls

The page defines **Multimatch** as enabling inclusive policies that allow an
application request to match multiple application segments. The current body
states:

> Multimatch is not supported for applications that have Source IP Anchoring
> enabled.

It also states:

> If Multimatch is enabled, Health Reporting on an app segment can only be set
> to On Access or None.

The article links to [Using Application Segment
Multimatch](https://help.zscaler.com/zpa/using-app-segment-multimatch) for
additional limitations. This capture does not infer any other unsupported
feature from the absence of a restriction in this page.

## Matching behavior

When two or more application segments cover the same destination address,
Zscaler Client Connector attempts to match traffic to the more granular
application segment. If there is no match in that segment, the client bypasses
Private Access and sends traffic directly.
