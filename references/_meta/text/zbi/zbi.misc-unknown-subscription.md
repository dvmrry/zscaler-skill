# The Miscellaneous & Unknown subscription: a preconfigured profile, an automatic rule and five editable settings (zbi.misc-unknown-subscription)
Also called: misc and unknown isolation; miscellaneous & unknown isolation; misc & unknown profile; limited isolation subscription; cannot allow copy paste isolation profile

Depending on the organization's level of Zero Trust Browser access, admins might be able to isolate only the Miscellaneous & Unknown URL category. [zbi.misc-unknown-subscription:limited-tier] With the Miscellaneous & Unknown Category subscription, Zero Trust Browser creates a preconfigured isolation profile at first login, different from the default profiles created for other access levels. [zbi.misc-unknown-subscription:preconfigured-profile] An Internet & SaaS URL Filtering rule for the Miscellaneous & Unknown category is created automatically; it is disabled by default for existing tenants and enabled by default for new tenants. [zbi.misc-unknown-subscription:auto-rule]

**The profile.** The preconfigured profile's automatic settings are: name Misc & Unknown; Turbo Mode enabled; the recommended PAC file URL with Override PAC File disabled; Debug Mode disabled; the default Zscaler root certificate; copy and paste, file transfer and print disabled; Read-Only Isolation enabled; viewing office files in isolation, local browser rendering, application deep linking and Votiro CDR disabled; region selection All; the default isolation banner; Persist Browser Isolation URL bar disabled; Native Browser Experience; watermarking disabled; and Persistent State disabled. [zbi.misc-unknown-subscription:fixed-settings] After the profile is created, admins can edit Turbo Mode, Debug Mode, Root Certificate, Read-Only Isolation and Region Selection. [zbi.misc-unknown-subscription:editable-fields] So on this subscription, copy and paste, file transfer and print stay disabled on the preconfigured profile: they are among its automatic settings and not among the five fields admins can edit. [zbi.misc-unknown-subscription:locked-exfiltration]

What to check:
1. On an existing tenant, whether the automatically created Miscellaneous & Unknown URL Filtering rule was enabled.
2. Whether a setting the admin wants to change is one of the five editable fields on the preconfigured profile.

Inferred, not quoted (say so when an answer rests on one):
- [zbi.misc-unknown-subscription:locked-exfiltration] Tier B: Follows from the two lists in the Miscellaneous & Unknown article; the article does not say whether Zscaler Support or a subscription change can unlock them.

Area: zbi.misc-unknown-subscription, its subjects in references/_meta/spine/zbi/zbi.misc-unknown-subscription.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): An Internet & SaaS URL Filtering rule for the Miscellaneous & Unknown category is created automatically; it is disabled by default for existing tenants and enabled by default for new tenants. [zbi.misc-unknown-subscription:auto-rule]
