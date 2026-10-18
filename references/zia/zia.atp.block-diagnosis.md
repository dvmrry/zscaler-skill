For "was this block Malware Protection or ATP," the API does not give a verdict; the logged transaction does. Start from [[zia.sandbox.verdicts]], which holds the Blocked Policy Type boundary between Sandbox, Malware Protection and ATP and the absence of a per-transaction API. This subject covers the fields that then narrow it.

{{ruletype-column}} The exact strings for these two engines are open {{gap:ruletype-values}}. {{reason-field}}

**Which detection?** {{threat-fields}} For Page Risk blocks: {{riskscore-field}}

**Where else is it shown?** {{security-dashboard}}

Rule names and the Allow-side fields are in [[zia.logs.web-rule-attribution]]. Category routing is in [[zia.malware-protection.settings]] for malware, [[zia.atp.categories]] for ATP groups, and [[zia.atp.page-risk]] for Page Risk. Exceptions for a confirmed false positive are in [[zia.atp.security-exceptions]]. A block that no listed policy explains may be a new categorization: [[zia.atp.ai-ml-recategorization]].
