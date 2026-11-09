# Alerts in Agentic SOC: the Alerts page, severity score composition, alert-score factors and severity categories (soc-workbench.alerts)
Also called: severity score; alert score; severity settings

The Alerts page shows by default, for each alert, a Severity Score, the MITRE ATT&CK Tactic and Technique, a Verdict, the Original Severity (as determined by the source application) and Sources. [soc-workbench.alerts:page-columns] The Alerts page shows the number of alerts received from each integrated product, the spread of severity scores across products, and alerts received versus identified incidents, and lets you create an incident from selected alerts and export the table to a CSV file. [soc-workbench.alerts:page-actions] Custom incidents are created from selected alerts, see [Incidents in Agentic SOC: the Incidents page, detail tabs, verdicts, statuses, custom incidents and customization](kb:soc-workbench.incidents).

**Severity score.** Agentic SOC adds the total score from each factor to produce the overall severity score, and you can drill down into an alert to see how the score was calculated. [soc-workbench.alerts:score-composition] You can customize alert scoring at Settings > Scoring by creating or editing factors for alerts, MITRE ATT&CK classifications, users and assets; the Field options change by section, and the Factor Name must be unique and by default takes the value of the Field drop-down. [soc-workbench.alerts:score-factors] The Understanding Severity Scores page says individual severity scores typically range from 0 to 10, where a higher score indicates greater criticality. [soc-workbench.alerts:score-range-per-factor] The Configuring Severity Categories page tells you to ensure the entire score range (that is, 0 to 100) is fully accounted for. [soc-workbench.alerts:severity-range-preview] How the two scales relate is open [gap:soc-workbench.alerts:score-scale-relation].

**Severity categories.** For each severity category (Critical, High, Medium, Low, Info), Score starts at is the minimum score, which is included in the category, and Score is less than is an optional cutoff. The settings cannot be saved if gaps between ranges are not assigned to a category, and ranges must be unique (non-overlapping) and in ascending numerical order. [soc-workbench.alerts:severity-categories] Saving severity settings applies them the next time the finding or the ticket entity is processed, while Save & Run applies them immediately to the account; the configured categories can be used in dashboards and charts throughout the Admin Portal. [soc-workbench.alerts:severity-apply-timing] The default ranges and weights are not given [gap:soc-workbench.alerts:score-defaults].

What to check:
1. When a severity category change takes effect: per the Configuring Severity Categories article, Save applies at the next processing, Save & Run immediately.

Not known (open gaps):
- How the 0 to 10 per-factor scores relate to the 0 to 100 severity range [gap:soc-workbench.alerts:score-scale-relation]: settled by source-read or lab-test
- Default score ranges per category, factor weights and default factors [gap:soc-workbench.alerts:score-defaults]: settled by source-read or lab-test

Area: soc-workbench.alerts, its subjects in references/_meta/spine/soc-workbench/soc-workbench.alerts.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/soc-workbench/soc-workbench.incidents.md (Incidents in Agentic SOC: the Incidents page, detail tabs, verdicts, statuses, custom incidents and customization)
