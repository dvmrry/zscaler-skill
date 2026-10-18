# Understanding Isolation of Miscellaneous & Unknown Category in Internet & SaaS

**Source:** https://help.zscaler.com/zero-trust-browser/understanding-isolation-miscellaneous-and-unknown-category-internet-and-saas
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1518406, revision 3243186

---

Admins who have Zscaler Zero Trust Browser (formerly Zscaler Isolation) integrated with Internet & SaaS (ZIA) have the ability to isolate URL categories using Internet & SaaS policies. Depending on your organization's level of Zero Trust Browser access, you might only have the ability to isolate the category Miscellaneous & Unknown.
If you have the Miscellaneous & Unknown Category subscription, Zero Trust Browser makes a preconfigured isolation profile for you when you first log in. This profile is different from the default isolation profiles that are made for different levels of Zero Trust Browser access upon first login. Additionally, an Internet & SaaS URL filtering rule with the category of Miscellaneous & Unknown is automatically created. The rule is disabled by default for existing tenants, but it is enabled by default for new tenants.
The fields for this profile have certain functionalities permanently enabled, others permanently disabled, and some that the admin can change. The following are the settings automatically defined for this isolation profile:
- Name: Misc & Unknown
- Enable Turbo Mode: Enabled
- PAC File URL: Use Recommended PAC file URL
- Override PAC File: Disabled
- Enable Debug Mode: Disabled
- Root Certificate: Default Zscaler Root Certificate
- Allow Copy & Paste From: Disabled
- Allow File Transfer: Disabled
- Allow Print: Disabled
- Read-Only Isolation: Enabled
- View office files in Isolation: Disabled
- Allow local browser rendering: Disabled
- Application Deep Linking: Disabled
- Votiro CDR: Disabled
- Region Selection: All
- Isolation Banner: Default
- Persist Browser Isolation URL bar: Disabled
- Isolation Experience: Native Browser Experience
- Enable Watermarking: Disabled
- Persistent State: Disabled
Admins can edit the following fields after the preconfigured profile is created:
- Turbo Mode
- Debug Mode
- Root Certificate
- Read-Only Isolation
- Region Selection
To learn more, see Editing an Isolation Profile for Internet & SaaS.
