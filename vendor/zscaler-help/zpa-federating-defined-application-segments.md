# Federating Defined Application Segments

**Source:** https://help.zscaler.com/zpa/federating-defined-application-segments
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/zpa/federating-defined-application-segments
**Help node:** `1540798`
**Help revision:** `3227814`
**Body content length:** 3,170 HTML characters
---

To federate an application segment, go to **Policies > Access Control > Private
Applications > Defined Application Segments**, locate the segment, and click
the **Federate Application** icon. In the **Federate Applications** window,
select one or more trusted partners. The **Add Partner** action links to the
Federated Partners page for partner management. Click **Save** to save the
selection.

If a partner is deselected and the change is saved, the page states that guest
partner end users immediately lose access to all applications.

The page states that applications using IP addresses cannot be federated
because of possible IP overlap and routing conflicts in the guest partner's
network. It also requires these application-segment configurations to be
disabled before federation:

- Source IP Anchor
- Double Encryption
- Bypass
- Bypass during Reauthentication
- ZIA Inspection
- AppProtection

This is the public Help workflow for federating an application segment. It does
not define an Automate or SDK API contract.
