Every ATP detection is a toggle in one of ten groups. {{groups}} Most are Allow or Block, and the whole tenant gets the same setting.

**Malicious Active Content.** {{active-content}} The Blocked Malicious URLs list has its own subject: [[zia.atp.blocked-urls]].

**Fraud.** {{fraud}} {{phishing-methods}} {{crypto-mining-false-positive}} A site exempted for mining is exempt from all ATP scanning: [[zia.atp.security-exceptions]].

**Unauthorized communication.** {{unauthorized-communication}} {{wpad-no-key}}

**XSS.** {{xss}}

**P2P.** {{bittorrent-uninspectable}} Tor needs more than the toggle: [[zia.atp.tor]]. {{hangouts-deprecated}}

Botnet, Page Risk and Blocked Countries are in [[zia.atp.botnet]], [[zia.atp.page-risk]] and [[zia.atp.blocked-countries]].

**Capture.** {{capture-on-block}}

**Names in the API.** {{toggle-wire-keys}} The field-name traps are in [[zia.atp.api-surface]].

What to check: which toggle's wording matches the user's symptom, whether it is on Block, and whether the URL is in Security Exceptions. If a new block has no matching policy edit, see [[zia.atp.ai-ml-recategorization]].
