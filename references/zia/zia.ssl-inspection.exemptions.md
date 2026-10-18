An exemption is a rule that opts traffic out of the opt-out default.

**Whether to exempt.** {{bypass-only-controlled}} {{bypass-purposes}} {{finance-health-recommendation}} {{opt-out-design}}

**Which variant.** The Evaluate and Bypass variants of Do Not Inspect are not interchangeable; Bypass also skips URL Filtering and Cloud App Control, and Zscaler advises against it for custom exemptions ([[zia.ssl-inspection.pipeline]]). {{predefined-exemptions-differ}} {{m365-inspect-except-click-to-run}}

**How to write the entry.** {{fqdn-not-ip}} {{specific-not-wildcard}} {{no-paths}} {{prefer-cloud-app}} {{exception-hygiene}}

**The wildcard that exempts everyone.** {{shared-storage-domains}} The same shape of mistake exists under transparent forwarding with the Miscellaneous or Unknown category; that is covered in [[zia.ssl-inspection.pipeline]].

Rule order decides whether an exemption wins ([[zia.ssl-inspection.rules]]). What the exempted traffic loses is in [[zia.ssl-inspection.bypass-impact]]. Populations that cannot be inspected anyway are in [[zia.ssl-inspection.uninspectable]].
