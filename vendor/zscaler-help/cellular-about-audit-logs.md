# About Zscaler Cellular Audit Logs

**Source:** https://help.zscaler.com/zscaler-cellular/about-zscaler-cellular-audit-logs
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Zscaler Cellular audit logs record administrative actions against Cellular
configuration. The page is available at **Administration > Admin Management >
Audit Logs > Cellular**.

Administrators can apply time and field filters, refresh results, configure
columns, inspect changes, and paginate. Audit rows expose:

- timestamp;
- principal ID identifying the user or system that performed the action;
- action, such as Create or Update;
- resource type, with Tag, SIM-to-Tag Mapping, and Anomaly Policy given as
  examples;
- resource name and resource ID; and
- a **View Changes** detail.

The page supports 10, 25, 50, or 100 entries per page. The article does not
state retention, export, or streaming behavior.
