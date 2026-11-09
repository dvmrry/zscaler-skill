# Breach Predictor Dashboard views and the Threat Landscape page (breach-predictor.dashboard)

The Dashboard is the first page shown at login; it consists of the Overall Breach Probability score, prioritized policy recommendations, Observed Users views and a Threat Overview. [breach-predictor.dashboard:layout] The Dashboard is divided into two main areas: the Overall Breach Probability score and the MITRE ATT&CK Overview charts and graphs. [breach-predictor.dashboard:layout-two-areas] On the Dashboard page, the Overall Breach Probability score factors in the organization's placement in the MITRE ATT&CK matrix and the number of affected users; a higher score indicates a higher risk of a data breach. [breach-predictor.dashboard:score-inputs] The listed inputs differ between pages [divergence:breach-predictor.dashboard:score-input-list]. A higher Overall Breach Probability score indicates movement into critical stages by threat actors and a high number of affected users. [breach-predictor.dashboard:score-reading]

## Views

The Dashboard consists of two Observed Users views and a Threat Overview view; the time frame can be set for the Sankey charts and graphs in each view. [breach-predictor.dashboard:views] The left and right arrows toggle between Observed Users views, and Explore opens the Findings page. [breach-predictor.dashboard:view-toggle]

- **Observed Users view 1.** Observed Users view 1 is a horizontal Sankey chart with Users (total and at-risk users), Stages, Category and Malware Family columns; About Dashboard says the Malware Family column shows each family's name and severity score, and Analyzing Dashboard says the listing for each malware family indicates the number of users affected by that family. [breach-predictor.dashboard:view1]
- **Observed Users view 2.** Observed Users view 2 is a vertical Sankey chart whose Total Users column shows the percentage change in users at risk, whose bottom row shows the number of users affected by each malware family, and in which attack stages that have not been reached are not interactive. [breach-predictor.dashboard:view2]
- **Threat Overview.** The Threat Overview view includes these charts: Top Users Impacted By Threats (Sankey), Top Threats Across Attack Stages (radial), Allowed Policies over time (bar) and Threats over time (bar). [breach-predictor.dashboard:threat-overview]

If the organization is secured and no users are at risk during the specified time period, the Dashboard shows a link to the Threat Landscape page. [breach-predictor.dashboard:secured-state] The allowed time frames are open [gap:breach-predictor.dashboard:time-frame-values].

## Threat Landscape

The Threat Landscape page draws on Zscaler ThreatLabz data, including millions of results maintained in the Zscaler Threat Library. [breach-predictor.dashboard:threat-landscape] The Threat Landscape page can be filtered by threat severity, the policy engine related to the threat, and the product whose logs identified the threat, and searched by threat name or signature ID; it also shows the overall breach probability, a prioritized policy recommendation list and the biggest global threats identified by ThreatLabz. [breach-predictor.dashboard:threat-landscape-filters]

Sources disagree (name both sides):
- About Dashboard lists two inputs to the Overall Breach Probability score (matrix placement, affected users), while What Is Zscaler Breach Predictor? lists three, adding the number of observed malware families. [divergence:breach-predictor.dashboard:score-input-list]
  - zscaler-help: The score factors in the organization's placement in the MITRE ATT&CK matrix and the number of affected users.
  - zscaler-help: The score takes into account the number of observed malware families, their location on the matrix, and the number of affected users.
  Impact: Do not present either list as the complete set of score inputs; whether the malware family count is a separate input is unconfirmed.

Not known (open gaps):
- Which time frames the Dashboard, Findings, Events and Threat Landscape selectors allow, and how far back data goes [gap:breach-predictor.dashboard:time-frame-values]: settled by source-read or lab-test

Area: breach-predictor.dashboard, its subjects in references/_meta/spine/breach-predictor/breach-predictor.dashboard.json
