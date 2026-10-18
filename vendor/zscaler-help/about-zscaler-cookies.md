# Understanding Zscaler Cookies

**Source:** https://help.zscaler.com/zia/about-zscaler-cookies
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399511, revision 3212391

---

The Zscaler service uses cookies to determine whether a user has been authenticated. A cookie is a text file that is set by a website and stored by a user's web browser on the local disk for future use. Websites use cookies for a number of reasons, including user authentication, internet activity tracking, or session information storage (so the website can show relevant content in the future).
The Zscaler service uses the following types of cookies:
- Gateway cookie: This cookie contains a string that provides login information, including if the user is logged in to the Zscaler service and the number of times the user logged in.
- Domain cookie: After a user logs in to the Zscaler service, the service sets an additional cookie for each domain to which a user browses. This enables the service to identify which domains a user has visited, so it won’t require the user to log in again. This cookie is set by the Public Service Edge for Internet & SaaS (ZIA).
- Acceptable Usage Policy (AUP) cookie: The Zscaler service sets this cookie when a user accepts the AUP. This cookie is set by the Public Service Edge.
The service needs to authenticate users only once to set the gateway cookie. However, you can require users to authenticate more often based on your organization's needs.
The Zscaler service marks the following user traffic against the user's location instead of the user due to the absence of authentication cookies:
- All the CONNECT method requests.
- Requests from UNKNOWN user agents that do not support cookies.
- Traffic destined to globally exempted websites, i.e., all the websites that are included in the Exempted URL Categories.
- Traffic destined to locally exempted websites, i.e., all the websites that are included in the Exempted URLs list.
- SSL traffic that is not decrypted.
