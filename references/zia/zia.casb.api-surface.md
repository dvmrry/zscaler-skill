This subject is the API shape of CASB; behavior is in the subjects it points to.

**Tenant calls.** {{tenant-read-endpoints}} {{tenant-list-filters}} {{snake-case-wrappers}} {{scan-info-paging}} {{scan-info-members}} Tenant behavior is in [[zia.casb.tenants]] and scan behavior in [[zia.casb.scans]].

**Rule calls.** {{rule-endpoints}} How `ruleType` scopes them is in [[zia.casb.rule-types:ruletype-scoped-calls]]. {{go-rule-reads}} Paging pitfalls for ZIA lists are in [[shared.sdk-go.list-pagination]].

**Helper lists.** {{helper-lite-endpoints}} {{go-domain-profiles-unlisted}} {{python-domain-profiles-lite}} The SDKs disagree on which list to read {{divergence:domain-profiles-endpoint}}.

**SDKs.** {{python-clients}} The enabled-to-state conversion for CASB DLP rules is covered with the other rule modules in [[zia.sdk-python.request-conventions:enabled-to-state-more-modules]].

**Terraform.** {{terraform-resources}} {{terraform-import-and-target}} The order, contiguity and predefined-rule constraints are in [[zia.casb.dlp-rules:order-contract]] and [[zia.casb.malware-rules:malware-order-contract]]; the shared registry defect is in [[zia.terraform.rule-order.registry:casb-rules-one-key-for-all-types]], and the field defects in [[zia.terraform.field-fidelity]].
