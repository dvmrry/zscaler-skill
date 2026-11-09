# How the ZDX Score is calculated: 5-minute values, hourly lows and rollups per scope (zdx.score.calculation)
Also called: zdx score calculation; lowest value within an hour; zdx hourly score; zdx application score; zdx organization score; zdx user score; zdx location score; zdx department score; divided by 25; page fetch time baseline; zdx regional baseline; zdx 7 day baseline; zdx score dropped; regions by zdx score
Former IDs: zdx-16, zdx-36, zdx-37, zdx-38, zdx-39, zdx-40

Each scope of the score is built from the 5-minute and hourly values with its own rule: a lowest value, an average of lowest values, or an average over intervals. Client Connector sends a probe to an application every 5 minutes; each 5-minute period's measurements are given a value from 0 to 100, and the lowest value within an hour becomes that hour's value. This is done for every defined application across all users, their devices and their locations. [zdx.score.calculation:hourly-lowest] The subscription table gives a different probing interval on Standard [divergence:zdx.score.calculation:probe-interval-scope]. In the subscription table the probing interval is 15 minutes on Standard and 5 minutes on Microsoft 365, Advanced and Advanced Plus. [zdx.score.calculation:probing-interval-by-tier]

**One bad sample.** Because an hour takes its lowest 5-minute value, one poor 5-minute measurement sets the hour's value regardless of the other measurements in that hour, so a sharp drop in an hourly value can come from a single sample. [zdx.score.calculation:one-bad-sample] Whether a failed probe enters this as a zero, and so always sets the hour, is not stated [gap:zdx.score.calculation:zero-value-handling].

## Per scope

**Application.** An application's score takes, for every user who accessed it in the selected period, the lowest value that user experienced, and divides the sum of those lowest values by the number of users; three users with lowest values of 42, 76 and 62 give a score of 60. [zdx.score.calculation:application-score]

**Departments, locations and cities.** For departments, locations and cities, the score for each time interval is the lowest value among users accessing applications from that place or group, and the score for the range is the average of the intervals; for a 24-hour range the interval is one hour and the sum of the hourly scores is divided by 25 (24 hours plus 1 for the starting score). [zdx.score.calculation:place-score]

**Organization.** For the organization, the application with the lowest value in each time interval sets the organization's score for that interval, and the intervals are averaged; for a 24-hour range the hourly scores are summed and divided by 25. [zdx.score.calculation:organization-score]

**User.** A user's score is the value of the application with the lowest value among those the user accessed in the period, as it represents the user's poorest digital experience. [zdx.score.calculation:user-score] The Users Overview describes it as an average [divergence:zdx.score.calculation:user-score-vs-overview]. What a user who accessed no application gets is unverified [gap:zdx.score.calculation:no-application-user].

**Rounding.** All scores are rounded to the nearest whole number. [zdx.score.calculation:rounding]

## What an application's value rests on

For applications the score is based primarily on Page Fetch Time compared with the weighted average Page Fetch Time of others in the same region; there is a baseline for any region with at least one active device, and baseline metrics are calculated daily for each application on a rolling timeline of the previous 7 days. [zdx.score.calculation:pft-baseline] For predefined applications the Page Fetch Time baseline represents an average score based on device metrics across all organizations, and for custom applications an average score based on device metrics from a given organization; it is measured in milliseconds. [zdx.score.calculation:baseline-population] For network applications that use a single Cloud Path probe, End-to-End Latency information is provided in place of Page Fetch Time to calculate the ZDX Score. [zdx.score.calculation:network-app-latency] An application's availability can also affect its score, for example when probes fail because the network is down. [zdx.score.calculation:availability-impact] The help article gives no relative weight for Page Fetch Time and availability [gap:zdx.score.calculation:pft-availability-weighting], and which other metrics enter the value is only partly documented [gap:zdx.score.calculation:metrics-in-score].

**Regions.** Regions by ZDX Score assesses the country locations of all users accessing a selected application. [zdx.score.calculation:regions-by-country] What a region is for the Page Fetch Time baseline, and how devices without location data are placed, is not defined [gap:zdx.score.calculation:region-definition].

**New applications, users and devices.** Whether a newly added application scores against an unstable baseline in its first week is unverified [gap:zdx.score.calculation:new-app-baseline], and so is how long a new user or device takes to appear in scores [gap:zdx.score.calculation:new-entity-lag]. Whether values are kept per device or per user across devices is not stated [gap:zdx.score.calculation:device-vs-user].

What to check:
1. Whether a low hourly value comes from a single 5-minute sample, by reading the application's metric trend for that hour.
2. Which scope the score was read at, since application, place, organization and user scores roll up differently.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.score.calculation:one-bad-sample] Tier B: Arithmetic consequence of the hourly-lowest rule; no source discusses single-sample drops.

Sources disagree (name both sides):
- A user's ZDX Score over a period: the score article says it is the value of the application with the lowest value among those the user accessed, while the Users Overview says the user's ZDX Score is an average score for the selected time period. [divergence:zdx.score.calculation:user-score-vs-overview]
  - zscaler-help: The user's score is the lowest value among the applications the user accessed in the period.
  - zscaler-help: The Users list's ZDX Score column is an average score for the selected time period.
  Impact: A user's score read from the Users Overview may not equal the lowest-application score the score article describes; neither article reconciles the two, so which definition the list uses is not settled.
- The probe cadence: the score article says Client Connector sends a probe to an application every 5 minutes with no subscription scope, while the subscription table gives a probing interval of 15 minutes on Standard. [divergence:zdx.score.calculation:probe-interval-scope]
  - zscaler-help: A probe is sent every 5 minutes, with no subscription tier stated.
  - zscaler-help: The probing interval is 15 minutes on Standard and 5 minutes on Microsoft 365, Advanced and Advanced Plus.
  Impact: On a Standard subscription the 5-minute periods and the hourly lowest value the score article describes rest on a 15-minute probing interval; the score article does not say it applies to Standard.

Not known (open gaps):
- Whether failed probes count as zero in the hourly lowest value [gap:zdx.score.calculation:zero-value-handling]: settled by lab-test or support-ticket. Blocks: how much one failed probe lowers an hourly or daily score
- How Page Fetch Time and availability are weighted in the score [gap:zdx.score.calculation:pft-availability-weighting]: settled by support-ticket or source-read. Blocks: predicting the score from probe metrics
- Which metrics enter the application score [gap:zdx.score.calculation:metrics-in-score]: settled by support-ticket or lab-test. Blocks: explaining a score change from the individual metric trends
- What a region is for the baseline and how devices without location data are placed [gap:zdx.score.calculation:region-definition]: settled by support-ticket or lab-test. Blocks: comparing scores across regions and explaining scores of users who move
- How a newly added application scores before 7 days of baseline exist [gap:zdx.score.calculation:new-app-baseline]: settled by lab-test or support-ticket. Blocks: interpreting scores of an application onboarded in the last week
- How long a new user or device takes to appear in scores [gap:zdx.score.calculation:new-entity-lag]: settled by lab-test. Blocks: answers about a new user or device with no score yet
- Whether values are calculated per device or per user across devices [gap:zdx.score.calculation:device-vs-user]: settled by support-ticket or lab-test. Blocks: scores of users with several devices
- What score a user who accessed no application gets [gap:zdx.score.calculation:no-application-user]: settled by lab-test. Blocks: telling a missing user score from a poor one

Area: zdx.score, its subjects in references/_meta/spine/zdx/zdx.score.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zdx/zdx.probes.md (ZDX probes: Web and Cloud Path probes, what they measure and how they run): Client Connector sends a probe to an application every 5 minutes; each 5-minute period's measurements are given a value from 0 to 100, and the lowest value within an hour becomes that hour's value. This is done for every defined application across all users, their devices and their locations. [zdx.score.calculation:hourly-lowest]
