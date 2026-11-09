# Zscaler-Terraformer: importing existing configuration into HCL (shared.terraform.terraformer)
Also called: zscaler-terraformer; terraformer; zscaler terraformer import; terraformer dlp excluded_users; terraformer generated hcl

{{shared.terraform:terraformer-offered|ref}} Zscaler-Terraformer is a separate tool from the providers. Terraformer's README says the tool is not meant to be 100% perfect: some provider resources may not be supported (use `terraform import` for those), many configuration drifts can be resolved by manually editing the generated HCL, and hard-coded IDs remain in the output where no reference is available yet; `--supported-resources` lists what it covers per product. [shared.terraform.terraformer:not-perfect]

Which ZTC resources it covers is a separate open question in [Which ZTC resources the current zscaler-terraformer release supports](kb:cloud-connector.terraform.coverage:terraformer-ztc-inventory). Whether the DLP rule excluded users and groups fix holds, and whether name lookups stay correct when IDs collide, are open [gap:shared.terraform.terraformer:dlp-excluded-names] and [gap:shared.terraform.terraformer:name-registry-collisions].

The DLP rule excluded users and groups question: Zscaler-Terraformer 2.1.22 lists a fix for a misspelled `excluded_users` attribute on ZIA `zia_dlp_web_rules`, its nested-block list names `excluded_groups` and `excluded_users`, and the ZIA provider's DLP web rule schema defines `excluded_users` and `excluded_groups`. [shared.terraform.terraformer:excluded-names-fix]

Name lookups for generated data sources: Zscaler-Terraformer registers ID-to-name pairs scoped to a data source type, queries a data source by name only when exactly one ID of that type has the name, and otherwise falls back to the ID. [shared.terraform.terraformer:typed-name-registry]

Not known (open gaps):
- Terraformer name lookups when users and groups share an ID [gap:shared.terraform.terraformer:name-registry-collisions]: settled by source-read or code-read. Blocks: trusting by-name references in generated HCL

Area: shared.terraform, its subjects in references/_meta/spine/shared/shared.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.coverage.md (What the ZTC Terraform provider covers, and how existing objects are imported)
