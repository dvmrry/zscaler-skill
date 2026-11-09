# Business Insights offices: configuring an office and organization- and office-level occupancy and attendance goals (business-insights.offices)
Also called: configure office; add office; occupancy goal; attendance goal; assigned headcount; office capacity

The Offices list shows Size in square feet, Lease Status (leased or owned) and the BSSIDs associated with the office. [business-insights.offices:office-list-fields] An admin account with read-only access to Business Insights can only view offices and their configuration details. [business-insights.offices:read-only-admin]

**Configuring an office.** In an office, Capacity (employees the office can accommodate) helps calculate occupancy and Assigned Headcount (users assigned to the office) helps calculate attendance. [business-insights.offices:capacity-and-headcount] A configured office is associated with Internet & SaaS locations and sublocations (new Internet & SaaS locations appear in the Locations field after one day) and with IP addresses, entered comma-separated. [business-insights.offices:locations-and-ips] At most 8 tags can be manually linked to an office. [business-insights.offices:tag-limit] The 2025 release summary says the Tag Management feature links workplaces to user-defined tags, which can be used as a filtering option for viewing workplace insights. [business-insights.offices:tag-purpose] Deleting an office stops data aggregation for it, and metrics are then displayed for each Internet & SaaS location, sublocation and IP address individually. [business-insights.offices:delete-office-effect] [gap:business-insights.offices:office-fields]

**Goals.** The occupancy goal is entered as a value between 1 and 100, and the attendance goal as 20, 40, 60, 80 or 100 for 1, 2, 3, 4 or 5 days per week; goals can be set at organization level or per office. [business-insights.offices:goal-values] The organization-level goals article says that an occupancy goal of 60 means offices are expected to be occupied by at least 60% of their assigned users, and that an attendance goal of 40 means users are expected in the office at least 2 days per week. [business-insights.offices:goal-meaning] The office capacity that other articles use for occupancy differs [divergence:business-insights.offices:goal-denominator].

How the metrics are calculated and displayed is in [Business Insights Workplace Insights: discovered locations, map and chart views, workplace details, filters and occupancy and attendance formulas](kb:business-insights.workplace); the product overview is in [Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources](kb:business-insights.overview).

Sources disagree (name both sides):
- The occupancy goal articles measure occupancy against an office's assigned users, while the office configuration and terminology articles calculate occupancy from Capacity. [divergence:business-insights.offices:goal-denominator]
  - zscaler-help: An occupancy goal is described as the share of an office's assigned users expected to occupy it.
  - zscaler-help: Average Occupancy is the total visits divided by the site capacity, times 100.
  - zscaler-help: Capacity, not Assigned Headcount, is the office value that helps calculate occupancy.
  Impact: Whether an occupancy goal is compared against assigned users or against Capacity is not stated; the goal articles and the occupancy formulas name different denominators.

Not known (open gaps):
- How BSSIDs and tags are set on an office [gap:business-insights.offices:office-fields]: settled by source-read or lab-test

Area: business-insights.offices, its subjects in references/_meta/spine/business-insights/business-insights.offices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/business-insights/business-insights.overview.md (Business Insights: SaaS usage and spend, workplace utilization, prerequisites and data sources)
- links-to references/_meta/text/business-insights/business-insights.workplace.md (Business Insights Workplace Insights: discovered locations, map and chart views, workplace details, filters and occupancy and attendance formulas)
