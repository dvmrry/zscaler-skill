# ATP Page Risk threshold and how the score is built (zia.atp.page-risk)
Also called: page risk; page risk index; suspicious content protection; risk tolerance; riskTolerance; this page is unsafe; high pagerisk index; page risk 35

The log text "This page is unsafe (high PageRisk index)" is a documented `reason` example ([Diagnosing a Malware Protection or ATP block from the logs](kb:zia.atp.block-diagnosis)).

A single slider sets the organization's page risk tolerance. The service blocks users from web pages whose Page Risk Index score is higher than the value set, and the score is computed in real time. [zia.atp.page-risk:threshold-blocks-above] The Page Risk Index combines a page-level index (injected scripts, vulnerable ActiveX, zero-pixel iFrames) with a Domain Risk Index (hosting country, domain age, past results, links to high-risk top-level domains) into one score. [zia.atp.page-risk:score-composition] The slider's labels are Low Risk (no risk tolerance, only safe pages), Moderate Risk (slightly suspicious pages allowed) and High Risk (very risky pages allowed). [zia.atp.page-risk:tolerance-labels]

The comparison is "higher than" [zia.atp.page-risk:threshold-blocks-above]. A higher tolerance value lets more pages through: raising the number from 35 allows pages with higher scores that the recommended value blocks. [zia.atp.page-risk:higher-is-more-permissive] Zscaler recommends setting the Page Risk tolerance to 35. [zia.atp.page-risk:recommended-35] On the ATP side, a Page Risk block can be changed through the tolerance value or by putting the URL in Security Exceptions; ATP has no per-user, group or location scope, so there is no ATP policy rule to edit for it. [zia.atp.page-risk:threshold-or-exception-not-a-rule]

**In the API.** In the API the tolerance is the integer riskTolerance, a Page Risk index between 0 and 100 with 100 the highest risk; users are blocked from pages with a higher Page Risk than the value. riskToleranceCapture is its Capture flag. [zia.atp.page-risk:wire-range] The numbers behind the labels are open [gap:zia.atp.page-risk:label-ranges].

The groups around Page Risk are in [ATP detection categories and what each toggle covers](kb:zia.atp.categories).

What to check:
1. Whether the logged riskscore of the blocked transaction is above the configured tolerance.
2. Whether the URL is in Security Exceptions, which the enforcement order checks before Page Risk.

Inferred, not quoted (say so when an answer rests on one):
- [zia.atp.page-risk:higher-is-more-permissive] Tier B: Derived from the block-above rule. The numeric ranges behind the Low, Moderate and High labels are not stated.
- [zia.atp.page-risk:threshold-or-exception-not-a-rule] Tier B: Assumes Page Risk is enforced as part of the ATP policy that Security Exceptions skips (the GET order lists Security Exceptions before Suspicious Content Protection), and that 'rule' means an ATP rule, not a URL Filtering or Cloud App Control rule.

Not known (open gaps):
- Which numeric values the Low, Moderate and High labels correspond to [gap:zia.atp.page-risk:label-ranges] (data gap): filled by operator; settled by tenant-data or lab-test

Area: zia.atp, its subjects in references/_meta/spine/zia/zia.atp.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.atp.security-exceptions.md (ATP Security Exceptions (the allowlist): what it skips and what it does not): On the ATP side, a Page Risk block can be changed through the tolerance value or by putting the URL in Security Exceptions; ATP has no per-user, group or location scope, so there is no ATP policy rule to edit for it. [zia.atp.page-risk:threshold-or-exception-not-a-rule]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named): The riskscore field is the Page Risk Index score of the destination URL, in the range 0 to 100 from lowest to highest risk, so it can be compared with the configured Page Risk tolerance. [zia.atp.block-diagnosis:riskscore-field]
- decided-by references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order), from zia.atp: When the web module finds a transaction violates a policy, the Public Service Edge blocks it immediately and does not enforce the policies that follow; the firewall module does not evaluate it, though firewall logs still show the web transaction as blocked. [zia.atp.enforcement-order:first-violation-blocks]
- interacts-with references/_meta/text/zia/zia.firewall.ips.md (IPS Control), from zia.atp: When a tenant has both Advanced Threat Protection and IPS Control, the rules created for Advanced Threat Protection are evaluated first. [zia.atp:before-ips]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.atp: In the POST request and in the response, the Malware Protection check comes after the ATP checks, so an ATP block ends the transaction before file scanning would run. [zia.atp.enforcement-order:mp-after-atp-checks]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection), from zia.atp: These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.atp: The web log field ruletype, shown in Web Insights as Blocked Policy Type, gives the type of policy and applies only to Block rules, not Allow. The documented example values are File Type Control, Data Loss Prevention and Sandbox. [zia.atp.block-diagnosis:ruletype-column]
- links-to references/_meta/text/zia/zia.atp.block-diagnosis.md (Diagnosing a Malware Protection or ATP block from the logs)
- links-to references/_meta/text/zia/zia.atp.categories.md (ATP detection categories and what each toggle covers)
