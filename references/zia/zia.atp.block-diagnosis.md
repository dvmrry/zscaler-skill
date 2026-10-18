For "was this block Malware Protection or ATP," the API does not give a verdict; the logged transaction does. Start from [[zia.sandbox.verdicts]], which holds the Blocked Policy Type boundary between Sandbox, Malware Protection and ATP and the absence of a per-transaction API. This subject covers the fields that then narrow it.

{{ruletype-column}} The exact strings for these two engines are an open gap below. {{reason-field}}

**Which detection?** {{threat-fields}} For Page Risk blocks: {{riskscore-field}}

**Where else is it shown?** {{security-dashboard}}

Rule names and the Allow-side fields are in [[zia.logs.web-rule-attribution]]. After you know the category: for a malware category, check [[zia.malware-protection.settings]]; for an ATP group, [[zia.atp.categories]]; for Page Risk, [[zia.atp.page-risk]]. If the block is a confirmed false positive, [[zia.atp.security-exceptions]] shows what an exception does and does not cover.

What to check: ruletype, then the category field, then the configured toggle. A block that no listed policy explains may be a new categorization: [[zia.atp.ai-ml-recategorization]].
