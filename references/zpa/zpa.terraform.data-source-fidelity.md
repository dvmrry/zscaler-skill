A ZPA data source is only as good as the copy it makes of the API object. Each data source is hand-written: a schema, a read function, and flatteners that copy SDK fields into Terraform state. Which object a data source returns is a separate question, covered in [[zpa.terraform.data-source-selection]]; this subject is about the content of the object once it has been chosen.

## Reads that fail or crash on ordinary data

{{policy-type-flattener-emits-undeclared-keys}} What the plugin SDK does with a nested map that has undeclared keys is open {{gap:plugin-sdk-set-unknown-key}}. {{lss-name-selector-not-top-level}}

**Nil dereferences.** {{lss-config-flattened-without-nil-check}} {{lss-by-name-dereferences-config}} {{lss-condition-operands-dereferenced}} How often these fire is open {{gap:api-omits-nested-objects}}.

## Objects that appear when they should not

**Blocks built from zero values.** {{lss-empty-config-becomes-a-block}} {{app-connector-assistant-version-always-a-block}} {{service-edge-group-brokers-always-blocks}} {{cbi-external-profile-empty-objects-become-blocks}} {{customer-version-profile-empty-side-becomes-empty-id}}

## Fields that never arrive

{{cbi-external-profile-associations-never-set}} {{fields-declared-or-in-sdk-but-not-set}} {{lss-status-codes-auth-log-mapped-from-ast}} The SDK half of the segment group UDP defect is [[zpa.sdk-go.service-defects:segment-group-udp-key-misspelled]].

## Mismatched schema and flattener

{{microtenant-user-flattener-keys-mismatch-schema}} {{microtenant-user-set-error-discarded}}

## Why none of this is loud

{{set-errors-ignored-across-data-sources}} {{service-edge-group-nested-sets-ignored}}
