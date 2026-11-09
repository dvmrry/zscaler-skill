# ATP Blocked Malicious URLs list: capacity, matching and API (zia.atp.blocked-urls)
Also called: blocked malicious urls; atp denylist; atp url blocklist; maliciousUrls; custom malicious urls; ADD_TO_LIST atp; 25k urls; add_atp_malicious_urls

The Blocked Malicious URLs list is the tenant's own denylist inside ATP. It is not the same list as Security Exceptions ([ATP Security Exceptions (the allowlist): what it skips and what it does not](kb:zia.atp.security-exceptions)).

The Blocked Malicious URLs list holds up to 25K URLs. Entries can be commented with two forward slashes (//), the list shows up to 500 items per page, and can be cleared 25K items at a time or one page at a time. [zia.atp.blocked-urls:list-capacity] On this page, the URLs to block are entered under Blocked Malicious URLs; an optional comment is added to a URL with two forward slashes (//) after each URL entry, and entries are separated by pressing Shift+Enter. [zia.atp.blocked-urls:denylist-page-entry] The list of blocked malicious URLs is viewed on the Advanced Threat Protection policy page, and the blocked URLs that users accessed are viewed on the Insights Logs page. [zia.atp.blocked-urls:where-viewed] Entries follow the URL format guidelines, which apply to URLs entered when configuring policies or settings in the Admin Console. [zia.atp.blocked-urls:entry-format] How entries are written and matched is in [What a URL category entry may contain, and category limits](kb:zia.url-categories.entry-format) and [How URL category entries match requests (wildcards)](kb:zia.url-categories.entry-matching).

**Specificity wins.** More specific blocked malicious URLs always take precedence: a rule is not applied to a category with a wildcard if the destination is defined more specifically in another category. The page illustrates this with rules CUSTOM_C1 and CUSTOM_C2 that both contain www.example.com. [zia.atp.blocked-urls:specificity-wins] The membership logic is in [Which URL category a URL belongs to](kb:zia.url-categories.membership).

**Allowlist or denylist?** The help page and the API disagree [divergence:zia.atp.blocked-urls:help-says-allowlist-or-denylist]. In the API: The API object is maliciousUrls, an array of strings that the spec describes as URLs blocked by the ATP policy, labeled the ATP denylist. It is read with GET and written with PUT. [zia.atp.blocked-urls:wire-denylist]

**Writing it.** A PUT to maliciousUrls takes an action query parameter, ADD_TO_LIST or REMOVE_FROM_LIST, so the endpoint adds or removes the URLs sent rather than replacing the list. [zia.atp.blocked-urls:add-remove-action] The Python SDK has separate add_atp_malicious_urls and delete_atp_malicious_urls calls, each sending the matching action, and each returns the list re-read after the write. The delete call notes that the API does not allow an empty list. [zia.atp.blocked-urls:python-add-delete] The Go updater and the provider read the current list, then send an add and a remove: [ZIA Terraform operations that take several API writes with no rollback](kb:zia.terraform.multi-step-writes). maliciousUrlsCapture is the Capture flag for malicious URLs; it lives in the ATP settings object, not in the URL list endpoint. [zia.atp.blocked-urls:capture-flag]

**The Go comment.** The Go field comment calls the list an allowlist [divergence:zia.atp.blocked-urls:go-comment-says-allowlist].

The Custom Malicious URLs check (the ATP denylist) is the first check in both the HTTP GET and HTTP POST request orders, and is not in the response order. [zia.atp.blocked-urls:first-request-check] The full order is in [Where Malware Protection and ATP checks fall in the web enforcement order](kb:zia.atp.enforcement-order).

What to check:
1. Whether the URL, or a more specific entry for it, is already in the list.
2. Whether the list was read in full before a change, given that the API returns 500 items per page.
3. Whether the entry follows the URL format guidelines.

Inferred, not quoted (say so when an answer rests on one):
- [zia.atp.blocked-urls:first-request-check] Tier B: Assumes the enforcement order's Custom Malicious URLs is this Blocked Malicious URLs list; the order labels it the ATP denylist.

Sources disagree (name both sides):
- Whether the Blocked Malicious URLs box holds an allowlist as well as a denylist. [divergence:zia.atp.blocked-urls:help-says-allowlist-or-denylist]
  - zscaler-help: The Blocked Malicious URLs box takes URLs to allowlist or denylist.
  - zscaler-help: The ATP denylist page's steps enter URLs under Blocked Malicious URLs, in the Malicious Active Content Protection section, to block them for the organization.
  - api-specs: The maliciousUrls endpoint is the denylist; the allowlist is the separate securityExceptions endpoint.
  Impact: An agent reading the help page may expect to put allowed URLs in this list. The API and the policy-enforcement order treat the list as a denylist and Security Exceptions as the allowlist.
- The Go SDK field comment on MaliciousUrls calls the list an allowlist. [divergence:zia.atp.blocked-urls:go-comment-says-allowlist]
  - sdk-go: MaliciousUrls is described as an allowlist of URLs not inspected.
  - api-specs: maliciousUrls is the list of malicious URLs blocked by the ATP policy.
  Impact: Treat maliciousUrls as a denylist; the Go comment was copied from the security-exceptions field.

Area: zia.atp, its subjects in references/_meta/spine/zia/zia.atp.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.atp.enforcement-order.md (Where Malware Protection and ATP checks fall in the web enforcement order): The Custom Malicious URLs check (the ATP denylist) is the first check in both the HTTP GET and HTTP POST request orders, and is not in the response order. [zia.atp.blocked-urls:first-request-check]
- interacts-with references/_meta/text/zia/zia.atp.security-exceptions.md (ATP Security Exceptions (the allowlist): what it skips and what it does not): The Custom Malicious URLs check (the ATP denylist) is the first check in both the HTTP GET and HTTP POST request orders, and is not in the response order. [zia.atp.blocked-urls:first-request-check]
- decided-by references/_meta/text/zia/zia.url-categories.entry-matching.md (How URL category entries match requests (wildcards)): An exact entry is more specific than a wildcard entry: for `atlanta.example.com`, a category holding `atlanta.example.com` outranks one holding `.atlanta.example.com` or `.example.com`. [zia.url-categories.entry-matching:exact-beats-wildcard]
- interacts-with references/_meta/text/zia/zia.firewall.ips.md (IPS Control), from zia.atp: When a tenant has both Advanced Threat Protection and IPS Control, the rules created for Advanced Threat Protection are evaluated first. [zia.atp:before-ips]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named), from zia.atp: The threat category of a detection is carried by malwarecat (shown as Threat Category), with threatname for the named threat. urlcat also includes the Advanced Threat Category, listed in the Advanced Threat Category filter of Web Insights. [zia.atp.block-diagnosis:threat-fields]
- interacts-with references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection), from zia.atp: In the POST request and in the response, the Malware Protection check comes after the ATP checks, so an ATP block ends the transaction before file scanning would run. [zia.atp.enforcement-order:mp-after-atp-checks]
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection), from zia.atp: These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- logged-in references/_meta/text/types/zia/web-log.md (ZIA web log (NSS web feed)), from zia.atp: The web log field ruletype, shown in Web Insights as Blocked Policy Type, gives the type of policy and applies only to Block rules, not Allow. The documented example values are File Type Control, Data Loss Prevention and Sandbox. [zia.atp.block-diagnosis:ruletype-column]
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
- links-to references/_meta/text/zia/zia.url-categories.entry-format.md (What a URL category entry may contain, and category limits)
- links-to references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to)
