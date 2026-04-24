# About the ZDX Score

**Source:** https://help.zscaler.com/zdx/about-zdx-score
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Digital Experience Monitoring (ZDX) Help 
Analytics 
About the ZDX Score
Digital Experience Monitoring (ZDX)
About the ZDX Score
Ask Zscaler

Watch a video about the ZDX Score (shows legacy UI).

A ZDX Score represents all users in your organization, across all applications, all locations, and all cities. You can see the score on the Zscaler Admin Console dashboards that capture Zscaler Digital Experience (ZDX) metrics. Depending on the time period and filters selected within the dashboards, the score adjusts accordingly.

The ZDX Score is based on a scale of 0 (lowest) to 100 (highest) with the lowest numbers indicating a Poor score and the highest numbers indicating a Good score.

A ZDX Score falls into one of three categories:

Good: The score is above an acceptable threshold and ranges from 66-100. The color for this range is green.
Okay: The score is acceptable and ranges from 34-65. The color for this range is amber.
Poor: The score is below an acceptable threshold and ranges from 0-33. The color for this range is red.

Low scores can often be attributed to underlying issues related to the network or local environment. Some potential reasons for a low score include:

Issues with a user's device (e.g., restarts, amount of CPU in use, etc.).
Issues with the connection (e.g., Wi-Fi signal strength).
Slow applications.
High latency on the network (e.g., Wi-Fi, home network, ISP).

You can start a Diagnostics session to help evaluate and troubleshoot issues related to low scores.

Understanding ZDX Score Measurements

Zscaler sends a probe from Zscaler Client Connector to an application every 5 minutes. For each 5-minute period, measurements are taken and given a numerical value from 0 to 100. The lowest value within an hour becomes the value for that hour. This is done for every defined application in the Zscaler Admin Console across all users, their devices, and their locations. From there, Zscaler calculates the score based on what is measured:

Applications

To determine the score for an application, Zscaler takes all the users that accessed the application for the selected time period and finds the lowest value each user would have experienced for the application. The lowest values for each user are added together and divided by the number of users. This is the application's ZDX Score.

The ZDX Score, for applications, is based primarily on the Page Fetch Time of an application, which is then compared to the weighted average of the Page Fetch of others in the same region. Page Fetch Time includes a baseline for any given region with at least one active device, and baseline metrics are calculated daily for each application on a rolling timeline of the previous 7 days. Regions by ZDX Score assesses the country locations of all users accessing a selected application. In addition, availability of an application can also impact the score (e.g., probes fail because the network is down). To learn more, see Evaluating User Details and Monitoring the Applications Overview.

For example, three users accessed an application during a 24-hour period. The lowest values for the users are: 42, 76, and 62. When calculated, the application's score is 60.

Close
Departments, Locations, and Cities

The ZDX Score, for departments, locations, and cities, identifies the lowest value for users accessing the applications from those places and groups during time intervals based on the selected time range. The lowest value represents the department's, location's, or city's score for each time interval. An average of all the time intervals for the selected time period is calculated to provide the score for the time range.

For example, the time interval for the 24-hour time range is one hour. Each hour's score is added together and divided by 25 (24 hours + 1 for the starting score) to provide the ZDX Score.

Close
Organization

To find the ZDX Score for your organization, Zscaler identifies the lowest value for each application for time intervals based on the selected time range. The application with the lowest value represents your organization's score for that time interval. An average of all the time intervals for the selected time period is calculated to provide your organization's ZDX Score.

For example, the time interval for the 24-hour time range is one hour. The application with the lowest value represents your organization's score for that hour. Each hour's score is added together and divided by 25 (24 hours + 1 for the starting score) to provide the ZDX Score.

Close
Users

For a user's ZDX Score, a comparison of the values across each application they accessed is done for the selected time period. The application with the lowest value is the user's score, since it represents the user's poorest digital experience for the selected time range.

Close

All scores are rounded to the nearest whole number.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About the ZDX Score
Monitoring the Performance Dashboard
Monitoring the Device Health Dashboard
Monitoring the Incidents Dashboard
Monitoring the Network Intelligence Dashboard
Monitoring the Self Service Dashboard
Monitoring the Wi-Fi Dashboard
Monitoring the ZIA Private Service Edge Dashboard
Monitoring Data Explorer Views
Understanding Hosted Monitoring
Downloading Quarterly Business Review Reports
Viewing Quarterly Business Review Reports
Viewing Device Events Reports
Viewing Predefined Reports
Viewing IPv6 Configurations
