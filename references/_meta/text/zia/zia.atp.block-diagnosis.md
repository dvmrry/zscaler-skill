# Diagnosing a Malware Protection or ATP block from the logs (zia.atp.block-diagnosis)
Also called: blocked policy type malware protection; ruletype advanced threat protection; malwarecat; threatname; riskscore; which atp category blocked; security dashboard atp; cybersecurity dashboard atp; mp or atp block
Former IDs: log-04

For "was this block Malware Protection or ATP," the API does not give a verdict; the logged transaction does. Start from [Which engine blocked the file, and what a Sandbox verdict means](kb:zia.sandbox.verdicts), which holds the Blocked Policy Type boundary between Sandbox, Malware Protection and ATP and the absence of a per-transaction API. This subject covers the fields that then narrow it.

The web log field ruletype, shown in Web Insights as Blocked Policy Type, gives the type of policy and applies only to Block rules, not Allow. The documented example values are File Type Control, Data Loss Prevention and Sandbox. [zia.atp.block-diagnosis:ruletype-column] The exact strings for these two engines are open [gap:zia.atp.block-diagnosis:ruletype-values]. The reason field holds the action taken and the policy applied when a transaction was blocked. Its documented examples include 'Virus/Spyware/Malware Blocked' and 'This page is unsafe (high PageRisk index)'. [zia.atp.block-diagnosis:reason-field]

**Which detection?** The threat category of a detection is carried by malwarecat (shown as Threat Category), with threatname for the named threat. urlcat also includes the Advanced Threat Category, listed in the Advanced Threat Category filter of Web Insights. [zia.atp.block-diagnosis:threat-fields] For Page Risk blocks: The riskscore field is the Page Risk Index score of the destination URL, in the range 0 to 100 from lowest to highest risk, so it can be compared with the configured Page Risk tolerance. [zia.atp.block-diagnosis:riskscore-field]

**Where else is it shown?** ATP transactions are logged in real time and shown on the Cybersecurity dashboard (Analytics > Cybersecurity) in the Zscaler Admin Console; access to this feature is through the Zscaler Account team. [zia.atp.block-diagnosis:security-dashboard]

Rule names and the Allow-side fields are in [Which rule decided a web transaction, from the logs](kb:zia.logs.web-rule-attribution). Category routing is in [Malware Protection categories: Allow or Block, Capture, and the settings object](kb:zia.malware-protection.settings) for malware, [ATP detection categories and what each toggle covers](kb:zia.atp.categories) for ATP groups, and [ATP Page Risk threshold and how the score is built](kb:zia.atp.page-risk) for Page Risk. Exceptions for a confirmed false positive are in [ATP Security Exceptions (the allowlist): what it skips and what it does not](kb:zia.atp.security-exceptions). A block that no listed policy explains may be a new categorization: [ATP AI/ML recategorization: why a URL can start blocking with no policy change](kb:zia.atp.ai-ml-recategorization).

What to check:
1. Whether ruletype names the blocking policy, which is shown only on Block rules.
2. Which category field applies: malwarecat or threatname for a malware detection, urlcat for an Advanced Threat Category.
3. Whether the riskscore of the destination URL is above the configured Page Risk tolerance, for a Page Risk block.

Not known (open gaps):
- Exact ruletype strings for Malware Protection and ATP blocks [gap:zia.atp.block-diagnosis:ruletype-values] (data gap): filled by operator; settled by tenant-data. Blocks: Writing a log filter on ruletype for these two engines.

Area: zia.atp, its subjects in references/_meta/spine/zia/zia.atp.json

Linked (open a file only if the answer needs it):
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named): The threat category of a detection is carried by malwarecat (shown as Threat Category), with threatname for the named threat. urlcat also includes the Advanced Threat Category, listed in the Advanced Threat Category filter of Web Insights. [zia.atp.block-diagnosis:threat-fields]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)): The reason field holds the action taken and the policy applied when a transaction was blocked. Its documented examples include 'Virus/Spyware/Malware Blocked' and 'This page is unsafe (high PageRisk index)'. [zia.atp.block-diagnosis:reason-field]
- decided-by references/_meta/text/zia/zia.atp.security-exceptions.md (ATP Security Exceptions (the allowlist): what it skips and what it does not), from zia.atp: URLs on the allowlist take precedence over the ATP options on the policy page: an allowlisted URL hosted on a web server in a blocked country is still reachable. [zia.atp.security-exceptions:precedence-over-options]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): `rulelabel` and `ruletype` are filled only when a Block rule applied; an allowed transaction has neither, so an empty `rulelabel` does not mean no rule matched. [zia.logs.web-rule-attribution:rulelabel-block-only]
- interacts-with references/_meta/text/zia/zia.sandbox.verdicts.md (Which engine blocked the file, and what a Sandbox verdict means): A BENIGN Sandbox verdict covers only Sandbox. A file Sandbox cleared can still be blocked by Malware Protection, ATP or File Type Control, and URL Filtering can block before Sandbox is reached. The source's first suspects for a block under a BENIGN verdict are Malware Protection and ATP. [zia.sandbox.verdicts:benign-not-clean]
- decided-by references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order), from zia.atp: When the web module finds a transaction violates a policy, the Public Service Edge blocks it immediately and does not enforce the policies that follow; the firewall module does not evaluate it, though firewall logs still show the web transaction as blocked. [zia.atp.enforcement-order:first-violation-blocks]
- interacts-with references/_meta/text/zia/zia.firewall.ips.md (IPS Control), from zia.atp: When a tenant has both Advanced Threat Protection and IPS Control, the rules created for Advanced Threat Protection are evaluated first. [zia.atp:before-ips]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.atp: In the POST request and in the response, the Malware Protection check comes after the ATP checks, so an ATP block ends the transaction before file scanning would run. [zia.atp.enforcement-order:mp-after-atp-checks]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection), from zia.atp: These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- links-to references/_meta/text/zia/zia.atp.ai-ml-recategorization.md (ATP AI/ML recategorization: why a URL can start blocking with no policy change)
- links-to references/_meta/text/zia/zia.atp.categories.md (ATP detection categories and what each toggle covers)
- links-to references/_meta/text/zia/zia.atp.page-risk.md (ATP Page Risk threshold and how the score is built)
- links-to references/_meta/text/zia/zia.malware-protection.settings.md (Malware Protection categories: Allow or Block, Capture, and the settings object)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.atp.md (ZIA Advanced Threat Protection)
