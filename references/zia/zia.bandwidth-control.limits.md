Several counts matter for Bandwidth Control. {{rules-125}} Rule counts are lower than most other ZIA policies, so a per-department or per-application rule design reaches the cap earlier than expected.

**Classes.** {{custom-classes-245}} {{predefined-8}} {{name-255}} How the eight predefined classes map to the tabs and API types is in [[zia.bandwidth-control.api-surface]].

**Domains.** {{domain-classes-8}} {{domains-25000}} The common mistake is to read the 8 as a domain count. It is a class count: only eight classes may carry custom domains, the 25,000 cap applies across all bandwidth classes, including domains contributed by URL categories. {{counts-toward-custom-urls}} {{page-500}}

Whether any of these caps is enforced by the API and how the pools nest are open: see the gaps. The File Type Control limits that the older reference listed alongside these belong to that area, not here.

What to check: the number of rules in the policy, how many classes already carry custom domains, and whether domains from URL categories are being counted toward the same cap.
