Exempting traffic from inspection is a decision about every feature that reads content, not only about TLS. {{dependent-features}} {{uninspected-blind}}

{{check-ssl-first}}

**What still applies without decryption.**

- {{evaluate-variant-keeps-domain-checks}} The behavior of each variant is in [[zia.ssl-inspection.pipeline]]; the URL Filtering criteria that need decryption are in [[zia.url-filtering.criteria]].
- Whether policy is evaluated at all for traffic on the global SSL bypass list is a separate tenant switch: [[zia.url-filtering.advanced-settings]].

Sandbox coverage for files delivered over HTTPS is in [[zia.sandbox]]. For deciding what to exempt in the first place, see [[zia.ssl-inspection.exemptions]]; for what cannot be inspected regardless, [[zia.ssl-inspection.uninspectable]].
