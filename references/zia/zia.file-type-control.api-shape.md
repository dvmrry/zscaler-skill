**The rule resource.** {{rule-crud}} {{filtering-action-enum}} {{size-in-kb}}

**Protocols.** {{protocols-enum}} {{protocol-token-mapping}}

**File types.** {{file-types-deprecated}} {{file-types-contract-enum}} {{categories-lookup}} Terraform's data source for it has its own failure behavior: [[zia.terraform.data-source-fidelity:file-type-categories-swallow-enum-failure]].

**Custom types.** {{custom-file-types}} The update path is open {{divergence:custom-file-type-update-path}}.

The help page and the Python SDK disagree on the maximum rule name length {{divergence:rule-name-length}}. Which field combinations the API accepts is open {{gap:filtering-action-dependencies}}.

A Terraform defect sends `passwordProtected` as false on every write; see [[zia.terraform.field-fidelity:file-type-password-protected-never-mapped]].
