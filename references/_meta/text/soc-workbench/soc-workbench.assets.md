# Assets in Agentic SOC: merged assets, Risk Score and Risk Mass, columns, filters and charts (soc-workbench.assets)
Also called: risk mass; crown jewel; asset risk score

Each asset represents a single entity in the environment, unified (merged) and enriched with information from multiple sources; the Assets page lets you view the sources and records it was merged from, the findings it contains and the tickets it is related to. [soc-workbench.assets:what-an-asset-is] You can filter assets by Sources, Type, Site or Operating System, group them by fields such as Asset State, Asset ID or Asset Owner ID, and export the list and its details as a CSV file. [soc-workbench.assets:filters-grouping]

**Charts.** The Assets page charts the number of assets in risk score ranges (in increments of 0.5, the X-axis being the max severity score of active findings related to the asset), the asset count by type (the 5 most frequently occurring types) and the count by operating system (the 5 most frequent). [soc-workbench.assets:overview-charts]

**Scores and columns.** When the default Active saved view is selected, an asset's risk score is initially set by the default reconciliation function and reflects the highest severity score among its findings, a default that can be customized through data unification; Risk Mass is the sum of all severity scores of the active findings associated with the asset. [soc-workbench.assets:risk-score-and-mass] The same view also shows Type (for example Windows Workstation, Web Application, Container Image), Owner ID, Is Crown Jewel (a Boolean of TRUE or FALSE), First Seen, Total Findings and Tags pulled from your sources. [soc-workbench.assets:other-columns] The reconciliation function and views are open [gap:soc-workbench.assets:asset-details].

Not known (open gaps):
- Asset type values, the default reconciliation function, system-saved views and how crown jewels are set [gap:soc-workbench.assets:asset-details]: settled by source-read or lab-test

Area: soc-workbench.assets, its subjects in references/_meta/spine/soc-workbench/soc-workbench.assets.json
