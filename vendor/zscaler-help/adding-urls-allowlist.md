# Adding URLs to the Allowlist

**Source:** https://help.zscaler.com/zia/adding-urls-allowlist
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399311, revision 3242568

---

There might be trusted websites of partners or vendors whose webmail or file downloads might otherwise be blocked due to anti-virus, anti-spyware, anti-malware, or URL filtering policies. You can exempt URLs from security scans, URL filtering, or both.
The allowlist applies to Malware Protection, Advanced Threat Protection, Sandbox, and URL Filtering policies. To learn more about how security exceptions impact policy enforcement, see About Policy Enforcement.
You can allowlist URLs completely by exempting them from security scans and URL filtering.
# Adding URLs to Allowlist for Security Scans
Adding URLs to the allowlist for security scans allows users to download content from these URLs without inspecting the traffic.
To add URLs to the allowlist for security policies:
- From the navigation menu, go to one of the following pages:
  - Cyberthreat Protection > Policy > Malware Protection
  - Cyberthreat Protection > Policy > Advanced Threat Protection
- Click the Security Exceptions tab.
- In Do Not Scan Content from these URLs, enter the URLs you want to allowlist and click Add Items. You can enter multiple entries by pressing Enter after each entry. You can add up to 1,024 URLs. To learn more, see Ranges & Limitations. For guidance on entering URLs, see the URL format guidelines. For item lists, you can view up to 500 items on a page; filter the list by searching for a word, phrase, or number contained in an item; and remove all items from the list (Remove All) or only items from a specific page (Remove Page). If you select Remove All or Remove Page, a confirmation window appears.
This allowlist also applies to the Sandbox policy.
- Click Save and activate the change.
# Adding URLs to Allowlist for URL Filtering
Adding URLs to the allowlist for URL filtering allows access to the content without being blocked by other URL Filtering policy rules.
To add URLs to allowlist for URL Filtering policy:
- Add the URLs you want to allowlist to a custom URL category.
- Configure a URL Filtering rule to allow the custom URL category.
Ensure that the rule order of this rule is higher than the URL Filtering rule that blocks these URLs.
