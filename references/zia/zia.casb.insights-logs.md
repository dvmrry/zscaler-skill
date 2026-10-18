Insights logs are the record of what each scan did. {{retention-180}}

**Columns and filters.** {{columns-per-category}} {{category-filter-omits-storage}}

**Reading a record.** {{user-shows-location}} {{non-provisioned-owner}} {{logged-time}} {{run-scan-file-ids}} {{dlp-identifier}} {{email-owner-name}} {{genai-columns}} The scan identifiers matter when restarting a scan: [[zia.casb.scans]]. When the SaaS application detects malware itself, no rule action is logged: [[zia.casb.malware-rules:saas-detection-skips-action]].

**Filtering and export.** {{filters-200-values}} {{custom-range-92}} {{csv-export}} Whether a Sub-URL field exists here is open [[zia.casb.limits:sub-url-in-saas-logs]], with the length limit.

**Streaming.** {{cloud-nss-feed}} {{nss-vm-described-as-web}} Whether a VM-based feed can carry SaaS Security is open {{gap:nss-vm-saas-security}}. {{nss-vm-limits}} The feed's field names are open {{gap:nss-feed-fields}}, and a licensing requirement is open {{gap:cloud-nss-licensing}}. Audit-log streaming is in [[zia.audit-logs.streaming]].

A SaaS Security feed over Cloud NSS follows the feed delivery rules: {{cloud-nss-http-codes}}

The feed is configured in the admin portal: {{cloud-nss-config-location}}

The SaaS Security Report is separate from the scan log: {{shadow-it-report-csv}} Whether Shadow IT discovery events also appear in the Insights logs or the feed is open {{gap:shadow-it-in-insights-logs}}.

Inline cloud app traffic is in the web feed instead: {{web-nss-cloud-app-fields}}

The web feed appclass vocabulary differs from the SaaS Security categories: {{web-appclass-vocabulary}}

The field that discriminates a record's category is open {{gap:record-category-discriminator}}.
