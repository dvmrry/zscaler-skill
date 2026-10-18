Wire-level facts for File Type Control, for reading API output and writing rules.

The rule resource: {{rule-crud}} The action and direction fields: {{filtering-action-enum}} Size fields: {{size-in-kb}}

Protocols are where the old summaries were wrong. {{protocols-enum}} {{protocol-token-mapping}}

File types have two representations, a deprecated list and a category list. {{file-types-deprecated}} {{file-types-contract-enum}} To enumerate what a tenant can use, including its custom types: {{categories-lookup}} The Terraform data source for it has its own failure behavior: [[zia.terraform.data-source-fidelity]] (`file-type-categories-swallow-enum-failure`).

Custom types: {{custom-file-types}} See divergence `custom-file-type-update-path`.

Two more disagreements to know about: `rule-name-length`, and which field combinations the API itself rejects (gap `filtering-action-dependencies`).

A Terraform defect in this resource, `passwordProtected` sent as false on every write, is documented in [[zia.terraform.field-fidelity]] (`file-type-password-protected-never-mapped`, `non-omitempty-bools-force-false`); do not read a `passwordProtected: false` from a Terraform-managed rule as an admin choice.
