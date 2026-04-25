# Risk360 Monte Carlo Simulation Mechanics

**Source:** https://www.zscaler.com/zpedia/what-is-the-monte-carlo-simulation (Risk360 section)
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler Risk360 is a comprehensive and actionable risk framework that delivers powerful cyber risk quantification.

## How the Monte Carlo simulation runs

With Risk360, Zscaler runs a Monte Carlo simulation **1,000 times per day per organization**.

In each iteration of the simulation, Zscaler measures the financial loss based on:
- A randomized cyber breach event
- A randomized financial loss within a predefined confidence interval defined by the lower and upper bound of a loss when a breach happens

## Outputs

Results produce:

- **Yearly average loss**
- **Loss exceedance curve** — the curve showing the probability that a loss exceeds a certain amount

## Four scenarios

The simulation runs four times per day to calculate the yearly average loss and loss exceedance curve under four distinct scenarios:

| Scenario | Definition |
|---|---|
| **Inherent risk** | The current risk score of an organization |
| **Residual risk** | The risk score of an organization after mitigating the top ten risk factors |
| **Last 30-day average risk** | The average risk score of an organization in the last 30 days |
| **Industry peer risk** | The average risk score of peer organizations |

## Output features (per Risk360 marketing)

- Intuitive risk visualizations
- Granular risk factors
- Financial exposure detail
- Board-ready reporting
- Detailed actionable security risk insights
