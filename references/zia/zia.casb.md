"Is this SaaS content being scanned, and what does the rule do to it?" needs these questions answered in order.

1. **What is scanned?** {{scans-saas-data-at-rest}} Whether scanning needs user traffic or SSL Inspection is open {{gap:traffic-path-and-ssl}}.
2. **Is anything scanning?** {{no-scan-no-inspection}} Schedules, states and restarts: [[zia.casb.scans]].
3. **Is the application connected?** Tenant states, reauthorization and limits: [[zia.casb.tenants]].
4. **Which rule applies?** Categories and separate lists: [[zia.casb.rule-types]]. Where the rule sits in the order: [[zia.casb.rule-types:order-separate-lists]]. DLP rules: [[zia.casb.dlp-rules]]; malware rules: [[zia.casb.malware-rules]].
5. **What happened to the file?** Quarantine and tombstones: [[zia.casb.quarantine]]. What the records mean: [[zia.casb.insights-logs]].

**Reference.** Calls, SDKs and Terraform: [[zia.casb.api-surface]]. Numeric limits: [[zia.casb.limits]].

**Related areas.** Inline controls on live traffic are a different feature: [[zia.cloud-app-control]], [[zia.dlp]] and [[zia.ssl-inspection]]. Tenant restriction is [[zia.tenant-profiles]].
