# The ZDX Score: scale, bands, score types and what lowers it (zdx.score)
Also called: zdx score; digital experience score; zdx score meaning; good okay poor; zdx score buckets; zdx score bands; rum score; synthetic probe score; combined score; low zdx score; zdx score -1; real user monitoring score

The ZDX Score is the headline number of ZDX; the underlying probe metrics are the drill-down. A ZDX Score represents all users in the organization, across all applications, locations and cities; it appears on the Admin Console dashboards that show Digital Experience metrics and adjusts to the time period and filters selected there. [zdx.score:represents]

**Scale and bands.** The ZDX Score runs from 0 (lowest) to 100 (highest); the lowest numbers indicate a Poor score and the highest a Good score. [zdx.score:scale] A score falls in one of three categories: Good, 66 to 100, green; Okay, 34 to 65, amber; Poor, 0 to 33, red. [zdx.score:bands] The MCP server's troubleshooting prompt uses other bands [divergence:zdx.score:mcp-prompt-bands]. The dashboards give the lowest score as 1 [divergence:zdx.score:scale-range].

**On the user page.** In the ZDX Score Over Time graph on the user page the Smooth ZDX Score displays by default; it uses historical data to reduce short-term variations in the ZDX Score and provides a more representative metric with reduced variability, and the checkbox option under the graph shows the ZDX Score. [zdx.score:smooth-score] For Poor scores that range from 0-33, the ZDX Score Over Time graph includes a feature to help identify reasons for the low score: the application tile with the lowest Poor score is preselected and ZDX runs root cause analysis automatically on the most recent Poor score, and Analyze Score or Analyze Range triggers potential factors for a point or a range. Each result gives a Factor (a probable cause), an Explanation and a Confidence Level based on probes with similar issues; automated analysis for Poor scores is not applicable to Call Quality applications. [zdx.score:root-cause-analysis] In the subscription table, Root Cause Analysis is not supported on Standard and Microsoft 365 and supported on Advanced and Advanced Plus. [zdx.score:root-cause-tier] What the Factor values are is open [gap:zdx.score:rca-details]. Comparing ZDX Scores uses web, device and Cloud Path metrics to help determine differences in scoring. A point can be compared with the last known good score, which searches the score history for the last available score between 66 and 100, with the same time on the previous day, 2 days or 7 days, or with a future score up to the current date and time; web metrics are not used or provided when comparing scores for a Network application. [zdx.score:compare-scores] Which dashboards show the score is in [ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service](kb:zdx.dashboards).

**Score types.** There are two ZDX Score types and one combined type, depending on how applications are configured: the Synthetic Probe Score measured with Cloud Path or Web probes, the RUM Score measured with Real User Monitoring, and the Combined Score of both; they can differ because they use different configurations and metrics. [zdx.score:score-types] In the help's table, Web probe metrics (Page Fetch Time, Server Response Time, DNS Time, Availability) and Cloud Path metrics (End-to-End latency, Packet Loss, Hops, Packet Count) count toward the Synthetic Probe Score with a probe-only configuration, the RUM Score with a RUM-only configuration and both scores with combined configurations; web browser metrics (Page Views, Route Changes, Page Load Time, Core Web Vitals) are not used with a probe-only configuration and otherwise count toward the RUM Score. [zdx.score:score-type-metrics] An application's Real User Monitoring settings are part of its configuration, [The contract's application request carries `rumDetails`, the configuration for Real User Monitoring, with `rumEnabled`, `rumDomain` and `rumTimeout`.](kb:zdx.applications:rum-config).

**How it is calculated.** The 5-minute values, the hourly lows and the rollups per application, place, organization and user are in [How the ZDX Score is calculated: 5-minute values, hourly lows and rollups per scope](kb:zdx.score.calculation).

**Low scores.** The help attributes low scores often to the network or local environment, listing device issues (restarts, CPU in use), connection issues (Wi-Fi signal strength), slow applications and high network latency (Wi-Fi, home network, ISP) as potential reasons. [zdx.score:low-score-causes] A Diagnostics Session can be started to troubleshoot a low score, [The ZDX Score article says a Diagnostics session can be started to help evaluate and troubleshoot issues related to low scores.](kb:zdx.diagnostics:low-scores).

**Through the API.** An API score of -1 means no data, not a bad score, and API values can differ slightly from the UI: [ZDX API data can differ from the ZDX UI by a marginal 2% because aggregated metrics use approximate functions, and a ZDX Score of -1 from the API means no data is available.](kb:shared.log-export.zdx:api-vs-ui).

What to check:
1. Which score type the application is configured for (synthetic probes, Real User Monitoring or both) before comparing its score with another's.
2. Whether an API score of -1 is a no-data value rather than a poor score.

Sources disagree (name both sides):
- The lowest ZDX Score: the score article gives the scale as 0 (lowest) to 100, while the Performance Dashboard, the Applications Overview and the Users Overview give it as 1 to 100, and the Performance Dashboard also gives the Poor band as 0 to 33. [divergence:zdx.score:scale-range]
  - zscaler-help: The scale runs from 0 (lowest) to 100 (highest).
  - zscaler-help: The scale runs from 1 (lowest) to 100 (highest), yet the same page gives the Poor band as 0 to 33.
  - zscaler-help: An application's ZDX Score runs from 1 to 100.
  - zscaler-help: A user's ZDX Score runs from 1 to 100.
  Impact: Whether a score of 0 can occur is not settled by the help; the pages that say 1 also give a Poor band starting at 0.
- The score bands: the help and the Python SDK's `score_bucket` docstring use Good 66-100, Okay 34-65 and Poor 0-33; the MCP server's ZDX troubleshooting prompt tells the agent 80-100 Good, 50-79 Degraded and 0-49 Poor. [divergence:zdx.score:mcp-prompt-bands]
  - zscaler-help: Good 66-100, Okay 34-65, Poor 0-33.
  - sdk-python: The `score_bucket` values map to poor 0-33, okay 34-65 and good 66-100.
  - mcp-server: Good 80-100, Degraded 50-79, Poor 0-49.
  Impact: An agent following the MCP prompt calls a score of 70 Degraded where the console shows Good, and a 40 Poor where the console shows Okay, and its bands do not line up with the `score_bucket` filter.

Not known (open gaps):
- What the root cause Factor values are and whether the console analysis is the API's score analysis [gap:zdx.score:rca-details]: settled by source-read or lab-test. Blocks: explaining a root cause result or reproducing it through the API

Area: zdx.score, its subjects in references/_meta/spine/zdx/zdx.score.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zdx/zdx.score.calculation.md (How the ZDX Score is calculated: 5-minute values, hourly lows and rollups per scope): An application's score takes, for every user who accessed it in the selected period, the lowest value that user experienced, and divides the sum of those lowest values by the number of users; three users with lowest values of 42, 76 and 62 give a score of 60. [zdx.score.calculation:application-score]
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.dashboards.md (ZDX console dashboards and overviews: time ranges, filters, VIP tagging, Private Service Edge Health and Self Service)
- links-to references/_meta/text/zdx/zdx.diagnostics.md (ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered)
