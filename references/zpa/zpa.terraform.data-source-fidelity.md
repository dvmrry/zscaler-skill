A ZPA data source is only as good as the copy it makes of the API object. Each data source is hand-written: a schema, a read function, and flatteners that copy SDK fields into Terraform state. Every step can lose or invent something, and most of the losses are silent. Which object a data source returns is a separate question, covered in [[zpa.terraform.data-source-selection]]; this subject is about the content of the object once it has been chosen.

## Reads that fail or crash on ordinary data

`zpa_policy_type` builds its rule maps with keys the nested schema does not declare, and it is one of the few data sources that check the `d.Set` error. {{policy-type-flattener-emits-undeclared-keys}} The LSS config data source documents a name lookup that the schema cannot express. {{lss-name-selector-not-top-level}}

The LSS config reader also has several nil dereferences. They need an API response with a missing nested object, so how often they fire is open. {{lss-config-flattened-without-nil-check}} {{lss-by-name-dereferences-config}} {{lss-condition-operands-dereferenced}}

## Objects that appear when they should not

The opposite mistake is a block built from a zero value. This happens when the SDK models an optional object as a value struct (so a nil check can never be true) or when a flattener ignores emptiness. {{lss-empty-config-becomes-a-block}} {{app-connector-assistant-version-always-a-block}} {{service-edge-group-brokers-always-blocks}} {{cbi-external-profile-empty-objects-become-blocks}} {{customer-version-profile-empty-side-becomes-empty-id}} A consumer that tests whether such a block exists, or takes an ID from it, will act on an object that is not there.

## Fields that never arrive

Data sources that are used to read an existing object into other configuration are only useful if they return all of it. {{cbi-external-profile-associations-never-set}} {{fields-declared-or-in-sdk-but-not-set}} One case returns the wrong value instead of nothing. {{lss-status-codes-auth-log-mapped-from-ast}} Segment group UDP ranges never arrive at all: the data source does not set them, and the SDK decodes them from a misspelled key ([[zpa.sdk-go.service-defects]]).

## Mismatched schema and flattener

{{microtenant-user-flattener-keys-mismatch-schema}} {{microtenant-user-set-error-discarded}}

## Why none of this is loud

Most data sources throw away the error of `d.Set`, so a value the schema rejects leaves a partial object and a successful read. {{set-errors-ignored-across-data-sources}} {{service-edge-group-nested-sets-ignored}}

## What to check

- Compare a data source's output with the SDK object it was built from before relying on a field. If a field is empty, check whether it is declared and set in the read path before treating it as unconfigured.
- Treat a block that looks populated with empty strings and false values as "unknown", not as a configured object.
- Do not use `zpa_policy_type` rules, or the microtenant `user` block, as an input without confirming they actually populate on your plugin SDK and provider versions.
- For `zpa_lss_config_status_codes`, do not read `zpn_auth_log`; it holds the AST data.
