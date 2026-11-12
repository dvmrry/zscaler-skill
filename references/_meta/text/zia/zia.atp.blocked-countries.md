# ATP Blocked Countries: server location, not user location (zia.atp.blocked-countries)
Also called: country blocking; blocked countries; suspicious destinations protection; blockedCountries; blocked accessing a site hosted abroad; geo block zia

Blocked Countries allows or blocks requests to any country in the world, based on the ISO3166 mapping of countries to their IP address space. Websites are blocked based on the location of the web server. [zia.atp.blocked-countries:web-server-location] The user's own country does not enter the decision: a user in a non-blocked country is still blocked from a site whose server is in a blocked country. [zia.atp.blocked-countries:not-user-location]

An allowlisted URL on a server in a blocked country is still reachable, and the country check is skipped for URLs under Security Exceptions. [zia.atp.blocked-countries:allowlist-overrides] See [ATP Security Exceptions (the allowlist): what it skips and what it does not](kb:zia.atp.security-exceptions).

**In the API.** In the API, blockedCountries is an array of strings drawn from an enum of ANY, NONE and COUNTRY_ codes such as COUNTRY_US; blockCountriesCapture is its Capture flag. [zia.atp.blocked-countries:wire-values]

The check runs after Security Exceptions and before IPS signature detection: [Where Malware Protection and ATP checks fall in the web enforcement order](kb:zia.atp.enforcement-order). The log's evidence for the block is described in [Diagnosing a Malware Protection or ATP block from the logs](kb:zia.atp.block-diagnosis).

What to check:
1. Whether the country that matters is the destination server's, not the user's, and whether that country is selected.
2. Whether the country value sent through the API is one of the ANY, NONE or COUNTRY_ codes the enum accepts.
3. Whether the URL is under Security Exceptions, which skips the country check.

Inferred, not quoted (say so when an answer rests on one):
- [zia.atp.blocked-countries:not-user-location] Tier B: Derived from the page saying sites are blocked by web server location.

Not known (open gaps):
- Whether the server rejects values outside the country enum [gap:zia.atp.blocked-countries:country-validation]: settled by lab-test

Area: zia.atp, its subjects in references/_meta/spine/zia/zia.atp.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order): For an HTTP GET request the order is: 1 Custom Malicious URLs (ATP denylist), 2 Cloud App Control, 3 URL Filtering, 4 Security Exceptions, 5 Browser Control, 6 Country-Based Blocking, 7 IPS Signature Detection, 8 Suspicious Content Protection (Page Risk), 9 P2P Control, 10 Bandwidth Control. Malware Protection and Sandbox are not in the GET request list. [zia.atp.enforcement-order:get-order]
- interacts-with references/_meta/text/zia/zia.atp.security-exceptions.md (ATP Security Exceptions (the allowlist): what it skips and what it does not): An allowlisted URL on a server in a blocked country is still reachable, and the country check is skipped for URLs under Security Exceptions. [zia.atp.blocked-countries:allowlist-overrides]
- interacts-with references/_meta/text/zia/zia.firewall.ips.md (IPS Control), from zia.atp: When a tenant has both Advanced Threat Protection and IPS Control, the rules created for Advanced Threat Protection are evaluated first. [zia.atp:before-ips]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named), from zia.atp: The threat category of a detection is carried by malwarecat (shown as Threat Category), with threatname for the named threat. urlcat also includes the Advanced Threat Category, listed in the Advanced Threat Category filter of Web Insights. [zia.atp.block-diagnosis:threat-fields]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.atp: In the POST request and in the response, the Malware Protection check comes after the ATP checks, so an ATP block ends the transaction before file scanning would run. [zia.atp.enforcement-order:mp-after-atp-checks]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection), from zia.atp: These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.atp: The web log field ruletype, shown in Web Insights as Blocked Policy Type, gives the type of policy and applies only to Block rules, not Allow. The documented example values are File Type Control, Data Loss Prevention and Sandbox. [zia.atp.block-diagnosis:ruletype-column]
- links-to references/_meta/text/zia/zia.atp.block-diagnosis.md (Diagnosing a Malware Protection or ATP block from the logs)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/advanced-threat-settings.md (config type)
- see-also references/_meta/text/zia/zia.atp.md (ZIA Advanced Threat Protection)
- see-also references/_meta/text/zia/zia.atp.categories.md (ATP detection categories and what each toggle covers)
