A location's `country` and `tz` have been read and written in different forms. Treat the following as the state of the evidence, not a settled rule.
**Write enum.** {{validator-enum-prefixed}} {{prefix-is-selective}}

**What changed.** {{validators-removed}} {{python-sdk-passes-through}}

**What to do.** {{check-which-layer-rejects}} For a Python read to Terraform apply pipeline, compare the value read with the form the API accepts before assuming drift is a provider bug. Field-level Terraform drift is in [[zia.terraform.field-fidelity]].
