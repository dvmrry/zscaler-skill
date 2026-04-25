# About the Dashboard in Risk360

**Source:** https://help.zscaler.com/risk360/about-dashboard-risk360
**Captured:** 2026-04-24 via Playwright MCP.

---

The Dashboard page gives visibility and insight into your organization's risk score, contributed by various underlying factors such as exposed servers, recent malware outbreaks, segmentation posture, and data uploads to risky applications.

Zscaler's architecture quantifies these events across **4 major categories**: exposure of attack surfaces, asset compromise, lateral propagation, and sensitive data loss. You can study how your organization's risk score has changed over time and compare your score against industry peers.

Different risk factors bear different weights on the score. For example, an active infection is more severe than a blocked access attempt to a blocked destination.

## Organization Risk Score

Shows the Zscaler-computed risk score for your organization plus the industry peer average risk score. Your organization's risk score is an average across the 4 categories.

### Severity ranges

| Range | Severity |
|---|---|
| 0–25 | Low |
| 26–50 | Medium |
| 51–75 | High |
| 76–100 | Critical |

Hover over the dollar symbol to view financial risk estimates. Click **View Details** to navigate to the **Financial Risk page** for further analysis.

## Risk Score Trend

90-day graph of Zscaler-computed and industry-peer-average risk scores.

## Risk Event by Location

Map showing category-based number of risky events from geolocation coordinates.

## Contributing Factors by Entity

Four entity types:

- Workforce
- 3rd Parties
- Applications
- Assets

## Top 10 Factors

Each factor includes a **Licensed?** column — whether you are subscribed to the required feature to implement the recommended action (Y / N).
