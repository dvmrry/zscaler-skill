The ZPA provider builds every rule resource's create and update from Terraform state alone and sends it through SDK helpers that change it further. Ordering of rules is covered in [[zpa.terraform.rule-order]]; deleting objects that rules refer to is covered in [[zpa.terraform.delete-paths]]. This subject is about what a single rule write contains.

Fields Terraform does not model are not preserved. {{v1-update-sends-fresh-request}} {{v2-update-reads-then-discards}} {{unmanaged-fields-same-pattern}} {{unmanaged-fields-may-be-cleared}} The SDK's tags are the same mechanism described for ZIA in [[zia.sdk-go.write-encoding]]. After an apply that changed only a rule's name or conditions, re-read the rule's server groups, connector groups and device-posture flag and compare them with what they were before.

The v1 SDK also edits the request. {{v1-sdk-erases-operand-names}} {{v2-sdk-clears-operand-ids-not-names}} {{operand-name-erasure-reaches-all-v1-writers}}

Reading v2 rules back goes through a converter that does not know every condition type the schema accepts. {{v2-conversion-drops-idp-and-workload-tag}} {{v2-read-state-comes-from-converter}} {{cleanup-rewrites-rule-from-converter}} {{converter-callers}} {{idp-condition-lost-from-state-and-cleanup-writes}} If a rule uses identity provider or workload tag conditions, compare the stored rule with the configuration after any plan that touches it or any destroy of an object it might reference.

Import and schema do not match what the resources do. {{import-accepts-types-crud-ignores-them}} {{import-type-mismatch-effect}} {{v2-access-microtenant-id-not-in-schema}}

Update paths can write after a failed check. {{update-ignores-non-404-preflight-error}} {{ignored-preflight-error-places}} A transient or permission error on the read does not stop the write, and the update proceeds.

Credential rules have their own twist: the reference is a rule field, not an operand, and the delete helper looks for an operand. {{credential-delete-scans-v1-operands}} {{credential-reference-is-top-level-field}} {{credential-delete-leaves-reference}} Updates cannot express "no credential". {{credential-update-restores-remote-association}} {{credential-swap-does-not-clear-old}} Before deleting a PRA credential or pool, list the credential policy rules that reference it by their `credential` and `credentialPool` fields, not by their conditions.
