# URL Format Guidelines

**Source:** https://help.zscaler.com/zia/url-format-guidelines
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399316, revision 3218449

---

The following guidelines are for entering URLs when configuring policies or settings in the Zscaler Admin Console.
- Enter URLs in lowercase letters only. Enter www.safemarch.com, and not www.Safemarch.com.
- The URL must not contain the protocol schema. Do not enter http://www.safemarch.com; instead, enter www.safemarch.com.
- URLs should have the host.domain format.
- The URL must not contain an underscore ("_") in the top-level domain (TLD) or the second-level domain (SLD). However, it's allowed in the subdomain or the subdirectories of a URL. For example, the URLs www.safemarch.c_om or www.safe_march.com aren't valid, but ww_w.safemarch.com or www.safemarch.com/resources_1 are valid.
If a URL doesn't have a subdomain, then underscore ("_") is allowed in the SLD. For example, the URL safe_march.com is valid, but www.safe_march.com is not. The underscore ("_") alone cannot be a subdomain. For example, www_.safemarch.com is valid, but _.safemarch.com is not.
- You cannot add a URL that is only a TLD. For example, you cannot add ".gov" as a URL. As TLDs are so widely used, including them in policies has the potential to cause major disruption.
- Only use ASCII characters.
When adding URLs to a custom URL category, if a single URL uses an invalid format, the request is rejected and produces an error code. A valid URL must meet the following requirements:
- The URL must use a standard URI format.
- The URL length cannot exceed 1,024 characters.
- The URL cannot contain non-ASCII characters.
- The domain name before the colon (":") cannot exceed 255 characters.
- The domain name between periods (".") cannot exceed 63 characters.
- A leading period (".") functions as a wildcard to the left of the named URL up to 5 subdomain levels deep (i.e., the same policies are applied to the subdomains, as well) or matches exactly to the named URL or matches to the named URL with any directory or file to its right.
- Thus, the entry .safemarch.com also applies to:
  - atlanta.safemarch.com
  - serv3.serv2.serv1.atlanta.safemarch.com
  - safemarch.com
  - safemarch.com/company/webinars
  - serv3.serv2.serv1.atlanta.safemarch.com/company/webinars
- To exactly match only with the stated domain or subdomain entry, avoid the leading period. For example, the entry safemarch.com applies to safemarch.com or safemarch.com/company/webinars.
The exact match takes priority over the wildcard matches. For example, when a user requests for atlanta.safemarch.com, a category that contains the exact match, atlanta.safemarch.com takes priority over another category that contains the wildcard match, .atlanta.safemarch.com or .safemarch.com.
- Do not use an asterisk ("*") as a wildcard character at the beginning of a domain. For example, .safemarch.com is permitted, while *safemarch.com and *.safemarch.com are not. An asterisk that's included in the URL is treated as a literal character and not as a wildcard.
- Wildcard characters addressing the right side of a stated URL are not explicitly used; they are always assumed. Because of this, the URL entry safemarch.com applies to:
  - safemarch.com:10443
  - safemarch.com/index.htm
  - safemarch.com/work/mail?=next
- If you want to categorize a specific file or directory under the root domain (for example, safemarch.com/resources/ftp.htm or safemarch.com/resources), be aware:
  - safemarch.com/resources or safemarch.com/resources/ftp.htm (with no trailing forward slash) matches the exact string.
  - safemarch.com/resources/ (with trailing forward slash) matches any file or directory underneath it.
