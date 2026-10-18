A rule meant to catch brand-new domains has a built-in blind spot. {{definition}} {{latency}} So a block rule keyed on NROD cannot be expected to catch a domain in its first hours.

In the console the criterion is a category, not a separate setting. {{dns-criterion}} The category needs a tenant setting first: {{suspicious-lookup-prereq}} Revived domains are a sibling category: {{revived}} Why block them: {{nrod-attack-chains}}

When asked why a freshly registered malicious domain was resolved, check the domain's age against the latency window and the Suspicious New Domains Lookup setting before looking at rule order. The older claim that the identical latency applies to URL Filtering is not supported by a captured page (gap `nrod-latency-url-filtering`); see [[zia.url-filtering]] for the web side.
