# Breach Predictor Events page and User Threat Profile page: filters, columns and detail panels (breach-predictor.events-and-users)
Also called: user threat profile

The Events page is for filtering and analyzing the allowed events that have affected the organization during a time period. [breach-predictor.events-and-users:events-scope] The scope of events differs between pages [divergence:breach-predictor.events-and-users:events-scope-wording]. By default the Events page shows events for all threat families and all users; a drop-down at the top right filters by time period. [breach-predictor.events-and-users:events-default]

## Events page

The Events page can be filtered by threat family, users, time frame and MITRE ATT&CK tactic, and a CSV file with information about each threat event can be downloaded. [breach-predictor.events-and-users:events-filters] On the Events page, the By Tactics options update to show the MITRE ATT&CK tactics associated with the selected threat families. [breach-predictor.events-and-users:events-tactics] The Events allowed over time bar chart shows the threat events Zscaler identified for each day in the selected period; hovering over a day's bar shows that day's total, and handles on the chart ends adjust the events shown. [breach-predictor.events-and-users:events-chart]

The Events table columns are Date/Time (GMT), Policy Status (allowed or blocked by policy), User Name, Threat Name, Threat Type, Tactic, URL and Client Ip; columns can be modified. [breach-predictor.events-and-users:events-columns] Clicking an event in the Events table opens the Event Detail panel, and the May 01, 2025 release entry says that on the Events page and the Events tab of Findings, clicking an individual event shows which log data identified the threat. [breach-predictor.events-and-users:event-detail] The Event Detail panel fields and the CSV contents are open [gap:breach-predictor.events-and-users:event-detail-and-csv].

## User Threat Profile page

The User Threat Profile Overview tab shows the number of users affected at each MITRE ATT&CK stage, the number of users at risk in each department, the number affected by each threat type, and the number at risk by region; on each tab, results can be filtered by users and threats. [breach-predictor.events-and-users:users-overview] The User Threat Profile Users List tab can be filtered by country, threat, threat type and tactic, and lists User, Department, Location, Device/IP Address, Threat, Threat Type and Tactic for each affected user. [breach-predictor.events-and-users:users-list] Clicking a user's name in the Users List table opens the User Detail panel, with detailed information about how and when the threat affected the user. [breach-predictor.events-and-users:users-detail] The User Detail panel fields are open [gap:breach-predictor.events-and-users:event-detail-and-csv].

Sources disagree (name both sides):
- The Events article describes the Events page as covering allowed events, the Policy Status column shows events allowed or blocked by policy, and the navigation page says the page shows all tracked events. [divergence:breach-predictor.events-and-users:events-scope-wording]
  - zscaler-help: The Events page filters and analyzes all the allowed events.
  - zscaler-help: The Policy Status column records whether an event was allowed or blocked by policy.
  - zscaler-help: The Events page provides a view across time of all tracked events.
  Impact: Do not state that the Events page lists only allowed events, or that it lists blocked ones, as settled.

Not known (open gaps):
- Which fields the Event Detail and User Detail panels show, and what the Events CSV export contains [gap:breach-predictor.events-and-users:event-detail-and-csv]: settled by source-read or lab-test

Area: breach-predictor.events-and-users, its subjects in references/_meta/spine/breach-predictor/breach-predictor.events-and-users.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/breach-predictor/breach-predictor.overview.md (Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with)
- see-also references/_meta/text/breach-predictor/breach-predictor.findings.md (Breach Predictor Findings: the MITRE ATT&CK Mapping page, the Threat page, severity scores and attack stages)
- see-also references/_meta/text/breach-predictor/breach-predictor.dashboard.md (Breach Predictor Dashboard views and the Threat Landscape page)
