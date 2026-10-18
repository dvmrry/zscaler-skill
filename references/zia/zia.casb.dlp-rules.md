A Data at Rest Scanning DLP rule is read in four steps: where it sits, who and what it scopes, what it inspects, and what it does.

**Where it sits.** {{rule-order-ascending}} {{admin-rank}} {{order-contract}} {{predefined-rules}} Whether evaluation stops at the first match is open {{gap:first-match}}. The category tokens and the separate DLP and malware lists are in [[zia.casb.rule-types]].

**Who and what it scopes.** {{tenants-empty-means-all}} {{scope-empty-means-all}} {{device-fields-ignored}} {{senders-groups-32}} {{email-fixed-fields}} {{shared-channel-domains}} {{collaborator-count-ranges}}

**Trusted users and domains.** {{trusted-exclusive}} {{tenant-profiles-considered-internal}} {{criteria-toggles}}

**What it inspects.** {{engines-max-4}} {{without-content-inspection}} {{components-enum}} {{file-types-enum}} {{collab-short-terms}} {{genai-scan-exceptions}} Whether Gen AI messages include responses is open {{gap:genai-prompt-response}}. File size and extracted-text limits are in [[zia.dlp.inspection-limits]]; engines and dictionaries are in [[zia.dlp.engines]].

**What it does.** {{actions-depend-on-tenant}} {{label-actions-single-tenant}} {{expiry-actions}} {{watermark-versioning}} {{severity-values}} The meaning of each token is open {{gap:action-token-meanings}}. Quarantine is in [[zia.casb.quarantine]].

**Buckets.** {{buckets-need-saved-rule-and-schedule}}

**Notification and forwarding.** {{notification-needs-auditor}} {{incident-receiver-field}} How forwarding to an Incident Receiver or a cloud works is in [[zia.dlp.incident-forwarding]].

**Access and contract.** {{access-control-field}} {{name-required-in-contract}}

Inline DLP rules are a different list: [[zia.dlp.rules]].
