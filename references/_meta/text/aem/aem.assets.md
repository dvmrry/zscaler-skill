# AEM assets: the Assets page, filters, charts, risk score and drawer (aem.assets)
Also called: aem assets page; risk mass; crown jewel asset; asset merging

An AEM asset represents a single asset in the environment, unified (merged) and enriched with information from multiple sources, and the Assets page shows the sources and records it was merged from, its findings and its related tickets. [aem.assets:definition]

**Filters and charts.** On the AEM Assets page assets can be filtered by Asset Is Crown Jewel, State, Owner ID or Source, grouped by fields such as Asset State, Asset ID or Asset Owner ID, and the EASM discovery profile can be configured from the page. [aem.assets:filters-and-discovery-action] The EASM discovery profile is in [How EASM discovery profiles work: seeds and their formats, limits, scan cadence, permissions and reports](kb:uvm.easm-discovery). The Assets overview charts show assets by risk score in increments of 0.5 (X-axis the max severity score of active findings), and the 5 most frequent asset types and operating systems. [aem.assets:charts]

**Columns.** With the default Active saved view, an asset's Risk Score is initially set by the default reconciliation function and reflects the highest severity score among its findings (customizable through Data Unification), and Risk Mass is the sum of the severity scores of its active findings. [aem.assets:risk-score-mass] Is Crown Jewel is a TRUE/FALSE field for whether the asset is one of the most valuable assets; First Seen is the earliest date a finding on the asset was first detected, Last Seen the latest date a finding was detected, and Total Findings the sum of active findings per severity. [aem.assets:crown-jewel-seen] The saved view list is open [gap:aem.assets:system-views].

**Drawer.** The actions in the asset drawer depend on the user role in AEM, the drawer can be configured by admins so it may look different in an account, and the drawer opens with a Top Panel and tabs including Asset Merging and Findings. [aem.assets:drawer] The drawer tab contents are open [gap:aem.assets:drawer-tabs].

Not known (open gaps):
- Which system-saved views the Assets page offers [gap:aem.assets:system-views]: settled by source-read or lab-test
- What the asset drawer tabs contain [gap:aem.assets:drawer-tabs]: settled by source-read or lab-test

Area: aem.assets, its subjects in references/_meta/spine/aem/aem.assets.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/uvm/uvm.easm-discovery.md (How EASM discovery profiles work: seeds and their formats, limits, scan cadence, permissions and reports)
