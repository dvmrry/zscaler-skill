# Fully blocking Tor: the ATP toggle is not enough (zia.atp.tor)
Also called: block tor; tor blocked; torBlocked; p2p anonymizer; tor firewall rule; tor still works

"Tor is blocked in ATP but still works" has a documented cause.

Tor can be allowed or blocked as a P2P anonymizer protocol; content downloaded with Tor is encrypted and cannot be inspected. [zia.atp.tor:tor-toggle] To fully block Tor, set the Tor toggle to Block and also create a firewall filtering rule that blocks Tor as a network application. Blocking network applications requires Advanced Firewall. [zia.atp.tor:needs-firewall-rule]

The licence is covered in [Which firewall features need Advanced Firewall](kb:zia.firewall.licensing), and the firewall criteria are in [Firewall Filtering rule criteria](kb:zia.firewall.criteria). The other P2P toggles are in [ATP detection categories and what each toggle covers](kb:zia.atp.categories).

What to check:
1. Whether the ATP Tor toggle is set to Block and a firewall filtering rule blocks Tor as a network application.
2. Whether the tenant has Advanced Firewall, which blocking a network application requires.

Area: zia.atp, its subjects in references/_meta/spine/zia/zia.atp.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.firewall.criteria.md (Firewall Filtering rule criteria): To fully block Tor, set the Tor toggle to Block and also create a firewall filtering rule that blocks Tor as a network application. Blocking network applications requires Advanced Firewall. [zia.atp.tor:needs-firewall-rule]
- depends-on references/_meta/text/zia/zia.firewall.licensing.md (Which firewall features need Advanced Firewall): To fully block Tor, set the Tor toggle to Block and also create a firewall filtering rule that blocks Tor as a network application. Blocking network applications requires Advanced Firewall. [zia.atp.tor:needs-firewall-rule]
- decided-by references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order), from zia.atp: When the web module finds a transaction violates a policy, the Public Service Edge blocks it immediately and does not enforce the policies that follow; the firewall module does not evaluate it, though firewall logs still show the web transaction as blocked. [zia.atp.enforcement-order:first-violation-blocks]
- decided-by references/_meta/text/zia/zia.atp.security-exceptions.md (ATP Security Exceptions (the allowlist): what it skips and what it does not), from zia.atp: URLs on the allowlist take precedence over the ATP options on the policy page: an allowlisted URL hosted on a web server in a blocked country is still reachable. [zia.atp.security-exceptions:precedence-over-options]
- interacts-with references/_meta/text/zia/zia.firewall.ips.md (IPS Control), from zia.atp: When a tenant has both Advanced Threat Protection and IPS Control, the rules created for Advanced Threat Protection are evaluated first. [zia.atp:before-ips]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named), from zia.atp: The threat category of a detection is carried by malwarecat (shown as Threat Category), with threatname for the named threat. urlcat also includes the Advanced Threat Category, listed in the Advanced Threat Category filter of Web Insights. [zia.atp.block-diagnosis:threat-fields]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.atp: In the POST request and in the response, the Malware Protection check comes after the ATP checks, so an ATP block ends the transaction before file scanning would run. [zia.atp.enforcement-order:mp-after-atp-checks]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection), from zia.atp: These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.atp: The web log field ruletype, shown in Web Insights as Blocked Policy Type, gives the type of policy and applies only to Block rules, not Allow. The documented example values are File Type Control, Data Loss Prevention and Sandbox. [zia.atp.block-diagnosis:ruletype-column]
- links-to references/_meta/text/zia/zia.atp.categories.md (ATP detection categories and what each toggle covers)
