# Understanding Isolation of Miscellaneous & Unknown Category in ZIA

**Source:** https://help.zscaler.com/zero-trust-browser/understanding-isolation-miscellaneous-and-unknown-category-zia
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zero Trust Browser Help 
Policy Management 
Understanding Isolation of Miscellaneous & Unknown Category in ZIA
Zero Trust Browser
Understanding Isolation of Miscellaneous & Unknown Category in ZIA
Ask Zscaler

Admins who have Zscaler Zero Trust Browser (formerly Zscaler Isolation) integrated with Zscaler Internet Access (ZIA) have the ability to isolate URL categories using ZIA policies. Depending on your organization's level of Zero Trust Browser access, you might only have the ability to isolate the category Miscellaneous & Unknown.

If you have the Miscellaneous & Unknown Category subscription, Zero Trust Browser makes a preconfigured isolation profile for you when you first log in. This profile is different from the default isolation profiles that are made for different levels of Zero Trust Browser access upon first login. Additionally, a ZIA URL filtering rule with the category of Miscellaneous & Unknown is automatically created and enabled by default. The rule is disabled by default for existing tenants, but it is enabled by default for new tenants.

The fields for this profile have certain functionalities permanently enabled, others permanently disabled, and some that the admin can change. The following are the settings automatically defined for this isolation profile:

Name: Misc & Unknown
Enable Turbo Mode: Enabled
PAC File URL: Use Recommended Pac file URL
Override PAC File: Disabled
Enable Debug Mode: Disabled
Root Certificate: Default Zscaler Root Certificate
Allow Copy & Paste From: Disabled
Allow File Transfer: Disabled
Allow Print: Disabled
Read-Only Isolation: Enabled
View office files in Isolation: Disabled
Allow local browser rendering: Disabled
Application Deep Linking: Disabled
Votiro CDR: Disabled
Region Selection: All
Isolation Banner: Default
Persist Browser Isolation URL bar: Disabled
Isolation Experience: Native Browser Experience
Enable Watermarking: Disabled
Persistent State: Disabled

Admins can edit the following fields after the preconfigured profile is created:

Turbo Mode
Debug Mode
Root Certificate
Read-Only Isolation
Region Selection

To learn more, see Editing Your Isolation Profile for ZIA.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Configuring ZIA for Zero Trust Browser
About Sandbox Integration with Zero Trust Browser
Using Sandbox Integration with Zero Trust Browser
Understanding Votiro Integration for Zero Trust Browser
Understanding Isolation of Miscellaneous & Unknown Category in ZIA
