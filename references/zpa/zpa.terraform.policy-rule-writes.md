The ZPA provider builds every rule resource's create and update from Terraform state alone and sends it through SDK helpers that change it further. Ordering of rules is covered in [[zpa.terraform.rule-order]]; deleting objects that rules refer to is covered in [[zpa.terraform.delete-paths]]. This subject is about what a single rule write contains.

**Fields Terraform does not model.** {{v1-update-sends-fresh-request}} {{v2-update-reads-then-discards}} {{unmanaged-fields-same-pattern}} {{unmanaged-fields-may-be-cleared}} Whether ZPA replaces the whole rule or merges null and false fields on a PUT is open {{gap:api-put-semantics}}. The SDK's tags are the same mechanism described for ZIA in [[zia.sdk-go.write-encoding]].

**Operand names in the SDK.** {{v1-sdk-erases-operand-names}} {{v2-sdk-clears-operand-ids-not-names}} {{operand-name-erasure-reaches-all-v1-writers}}

**Read-back converter.** {{v2-conversion-drops-idp-and-workload-tag}} {{v2-read-state-comes-from-converter}} {{cleanup-rewrites-rule-from-converter}} {{converter-callers}} {{idp-condition-lost-from-state-and-cleanup-writes}} How ZPA represents identity provider and workload tag operands on a read is open {{gap:api-idp-operand-shape}}.

**Import and schema.** {{import-accepts-types-crud-ignores-them}} {{import-type-mismatch-effect}} Whether ZPA keeps those policy types as separate policy sets is open {{gap:api-policy-set-types}}. {{v2-access-microtenant-id-not-in-schema}}

**Preflight reads.** {{update-ignores-non-404-preflight-error}} {{ignored-preflight-error-places}}

**Credential rules.** {{credential-delete-scans-v1-operands}} {{credential-reference-is-top-level-field}} {{credential-delete-leaves-reference}} What ZPA does when a referenced credential or pool is deleted is open {{gap:api-delete-referenced-credential}}.

**Changing the reference.** {{credential-update-restores-remote-association}} {{credential-swap-does-not-clear-old}}
