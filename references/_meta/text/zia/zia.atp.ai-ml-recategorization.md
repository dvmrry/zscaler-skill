# ATP AI/ML recategorization: why a URL can start blocking with no policy change (zia.atp.ai-ml-recategorization)
Also called: url was fine last week now blocked; ai ml url categorization atp; miscellaneous or unknown recategorized; uncategorized url became phishing; recategorized to botnet

They could reach it last week and it is blocked now, and nobody edited a policy.

ATP's AI/ML tools detect C2 botnets, credential theft and phishing URLs by analyzing URLs that are uncategorized or in the Miscellaneous or Unknown category, and categorize them under Botnet Protection or Fraud Protection (Phishing) advanced threats, or leave them in Miscellaneous or Unknown. [zia.atp.ai-ml-recategorization:ai-ml-detection] A URL that was uncategorized or Miscellaneous or Unknown, and so not blocked, can start to be blocked after the AI/ML tools move it into a Botnet or Phishing category whose toggle is set to Block, with no admin edit to any policy. [zia.atp.ai-ml-recategorization:blocking-can-change-without-edit]

The toggles that decide whether the new category blocks are in [ATP detection categories and what each toggle covers](kb:zia.atp.categories) and [ATP Botnet Protection: C2 servers, C2 traffic, the alert toggle and DGA](kb:zia.atp.botnet). The category a block was made under is read from the log, as described in [Diagnosing a Malware Protection or ATP block from the logs](kb:zia.atp.block-diagnosis).

What to check:
1. Whether the URL was uncategorized, Miscellaneous or Unknown when it was reachable, and is now in a Botnet or Phishing category.
2. Which ATP toggle covers the category shown in the blocked transaction's log, and whether it is set to Block.
3. Whether a recategorization is logged as an event, and whether there is a switch for it.

Inferred, not quoted (say so when an answer rests on one):
- [zia.atp.ai-ml-recategorization:blocking-can-change-without-edit] Tier B: A consequence of the categorization moving a URL into a blocked group. No source shows a specific case, or how quickly a recategorization takes effect.

Not known (open gaps):
- Where an AI/ML recategorization shows up [gap:zia.atp.ai-ml-recategorization:dashboard-shows-event] (data gap): filled by operator; settled by tenant-data or support-ticket
- Whether AI/ML recategorization has its own on and off control [gap:zia.atp.ai-ml-recategorization:separate-toggle]: settled by tenant-data or support-ticket

Area: zia.atp, its subjects in references/_meta/spine/zia/zia.atp.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order), from zia.atp: When the web module finds a transaction violates a policy, the Public Service Edge blocks it immediately and does not enforce the policies that follow; the firewall module does not evaluate it, though firewall logs still show the web transaction as blocked. [zia.atp.enforcement-order:first-violation-blocks]
- decided-by references/_meta/text/zia/zia.atp.security-exceptions.md (ATP Security Exceptions (the allowlist): what it skips and what it does not), from zia.atp: URLs on the allowlist take precedence over the ATP options on the policy page: an allowlisted URL hosted on a web server in a blocked country is still reachable. [zia.atp.security-exceptions:precedence-over-options]
- interacts-with references/_meta/text/zia/zia.firewall.ips.md (IPS Control), from zia.atp: When a tenant has both Advanced Threat Protection and IPS Control, the rules created for Advanced Threat Protection are evaluated first. [zia.atp:before-ips]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named), from zia.atp: The threat category of a detection is carried by malwarecat (shown as Threat Category), with threatname for the named threat. urlcat also includes the Advanced Threat Category, listed in the Advanced Threat Category filter of Web Insights. [zia.atp.block-diagnosis:threat-fields]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): Because a logged transaction carries both the URL's category and the source of that categorization, the logs show which category a URL was actually placed in, for URLs that have been seen. [zia.logs.web-rule-attribution:category-membership-from-logs]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.atp: In the POST request and in the response, the Malware Protection check comes after the ATP checks, so an ATP block ends the transaction before file scanning would run. [zia.atp.enforcement-order:mp-after-atp-checks]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection), from zia.atp: These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- decided-by references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): A URL that was uncategorized or Miscellaneous or Unknown, and so not blocked, can start to be blocked after the AI/ML tools move it into a Botnet or Phishing category whose toggle is set to Block, with no admin edit to any policy. [zia.atp.ai-ml-recategorization:blocking-can-change-without-edit]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.atp: The web log field ruletype, shown in Web Insights as Blocked Policy Type, gives the type of policy and applies only to Block rules, not Allow. The documented example values are File Type Control, Data Loss Prevention and Sandbox. [zia.atp.block-diagnosis:ruletype-column]
- links-to references/_meta/text/zia/zia.atp.block-diagnosis.md (Diagnosing a Malware Protection or ATP block from the logs)
- links-to references/_meta/text/zia/zia.atp.botnet.md (ATP Botnet Protection: C2 servers, C2 traffic, the alert toggle and DGA)
- links-to references/_meta/text/zia/zia.atp.categories.md (ATP detection categories and what each toggle covers)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.atp.md (ZIA Advanced Threat Protection)
