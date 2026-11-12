# Zero Trust Browser interactive reports: where they are and which widgets each report has (zbi.reports)
Also called: browser isolation reports; isolation interactive reports; Isolation Traffic Summary Overview; File and Document in Isolation report; isolation analytics

Any organization that uses Zero Trust Browser automatically sees default Internet & SaaS interactive reports, found under Analytics > Reports > Interactive Reports in the Browser Isolation section, and they work like the Interactive Reports for Internet & SaaS. [zbi.reports:default-interactive-reports] The Zero Trust Browser interactive reports consist of Consumption, Isolation Traffic Summary Overview, Security Overview, and File and Document in Isolation. [zbi.reports:four-report-types]

**Consumption.** The Consumption report has widgets for overall traffic trend, overall data volume, isolated data volume, unique isolated users and the policies that enforced isolation (Policy Reason). [zbi.reports:consumption-widgets]

**Traffic summary.** The Isolation Traffic Summary Overview report includes widgets for top URL supercategories, top URL categories, cloud applications, cloud application classes, top users and top departments (by bandwidth utilized) and top locations from which traffic is redirected to isolation. [zbi.reports:traffic-summary-widgets]

**Security and files.** The Security Overview report shows weekly top threats, monthly top advanced threats and two monthly Sandbox widgets; the File and Document in Isolation report shows the types and quantities of files uploaded from and downloaded to isolation. [zbi.reports:security-and-file-widgets]

What the reports do not state is open [gap:zbi.reports:report-scope].

What to check:
1. Whether the report being read is one of the four named reports and which widgets that report has.

Not known (open gaps):
- How far back the isolation reports retain data [gap:zbi.reports:report-scope]: settled by source-read or tenant-data. Blocks: saying how far back the isolation reports go

Area: zbi.reports, its subjects in references/_meta/spine/zbi/zbi.reports.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)
