# Zscaler Cellular Dashboard: what each widget shows and where its numbers link (zscaler-cellular.dashboard)
Also called: zscaler cellular dashboard; total sims; used sims; sims state overview; total usage graph

The Zscaler Cellular Dashboard summarizes the organization's SIMs and their data usage in widgets; the SIM inventory behind its links is in [Zscaler SIMs and eSIMs: inventory fields, status versus connection, and the Inventory state](kb:zscaler-cellular.sims).

**SIM counts.** The Zscaler Cellular Dashboard (Infrastructure > Cellular > Dashboard) has a Total SIMs widget showing the number of SIM cards provisioned for the organization, and clicking its number opens the SIMs page listing all of them; its Used SIMs widget shows the number the page describes as actively transmitting data, and clicking that number opens the SIMs page with Status set to Active. [zscaler-cellular.dashboard:total-and-used-sims] The SIMs State Overview widget categorizes SIMs as Activated (currently active and in use) or Inactive (not in use or deactivated); clicking the Activated number opens the SIMs page with Status set to Active, and clicking the Inactive number opens it with Status set to Inactive. [zscaler-cellular.dashboard:state-overview] What counts as active is unsettled [divergence:zscaler-cellular.dashboard:active-meaning].

**Location.** The Global Map widget shows the geographical distribution of active SIM cards on a world map with country granularity, a blue dot for active connections in a region. [zscaler-cellular.dashboard:global-map]

**Usage.** The Total Usage Graph widget shows daily data usage trends over the selected period as a line and bar graph, with the cumulative usage of all SIM cards in the range. The range is a default (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month) or custom start and end dates, and the graph data downloads as SVG, PNG or CSV. [zscaler-cellular.dashboard:total-usage-graph] The Usage by top 10 SIMs widget shows the 10 SIMs with the highest data consumption within the selected date range, each identified by its unique number, as a bar chart; it has a default or custom date range and downloads as SVG, PNG or CSV. [zscaler-cellular.dashboard:top-10-sims] The Usage by top 20 Countries widget shows data consumption for the 20 countries where the SIMs consumed the most data within the selected period; it has a default or custom date range and downloads as SVG, PNG or CSV. [zscaler-cellular.dashboard:top-20-countries] Retention and the longest custom date range are open [gap:zscaler-cellular.dashboard:dashboard-range-limits].

Sources disagree (name both sides):
- The dashboard defines Used SIMs as actively transmitting data and Activated as active and in use, yet both link to the SIMs page filtered on Status Active, which the SIMs page defines as available for use. [divergence:zscaler-cellular.dashboard:active-meaning]
  - zscaler-help: Used SIMs counts SIMs actively transmitting data, and its link lists the SIMs with Status Active.
  - zscaler-help: Status Active means available for use, not transmitting.
  Impact: The list behind a Used SIMs or Activated number may not match the count; which definition the count follows is not settled by the documentation.

Not known (open gaps):
- Dashboard data retention, maximum custom date range and the time window behind Used SIMs [gap:zscaler-cellular.dashboard:dashboard-range-limits]: settled by lab-test or support-ticket

Area: zscaler-cellular.dashboard, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.dashboard.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.sims.md (Zscaler SIMs and eSIMs: inventory fields, status versus connection, and the Inventory state)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zscaler-cellular/zscaler-cellular.overview.md (Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy)
