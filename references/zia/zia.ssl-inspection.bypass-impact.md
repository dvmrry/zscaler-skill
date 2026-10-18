Exempting traffic from inspection is a decision about every feature that reads content, not only about TLS. {{dependent-features}} {{uninspected-blind}}

That makes SSL status the first thing to check when a content feature appears not to fire. {{check-ssl-first}}

Two things are not on the list because they keep working, at least partly, on traffic that is not decrypted.

- URL Filtering and Cloud App Control still evaluate the domain, and on Do Not Inspect with Evaluate Other Policies a block on the domain fires while path-, method- and payload-based rules do not. That behavior, and the Bypass Other Policies variant that skips them entirely, is in [[zia.ssl-inspection.pipeline]]; the URL Filtering criteria that need decryption are in [[zia.url-filtering.criteria]].
- Whether policy is evaluated at all for traffic on the global SSL bypass list is a separate tenant switch: [[zia.url-filtering.advanced-settings]].

Sandbox coverage for files delivered over HTTPS is in [[zia.sandbox]]. For deciding what to exempt in the first place, see [[zia.ssl-inspection.exemptions]]; for what cannot be inspected regardless, [[zia.ssl-inspection.uninspectable]].
