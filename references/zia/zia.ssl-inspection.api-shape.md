Reading or writing SSL rules programmatically starts with the shape of `action`, because one string in the console is a nested object on the wire. {{action-nested-required}} {{console-to-api-mapping}}

**What goes in each block.** {{decrypt-fields}} {{dnd-fields}} Which block you send must match `type`: a sub-action block under the wrong `type` is rejected by the Go SDK before any request (see the validator in [[zia.sdk-go.service-defects]]), and "why isn't my TLS floor enforced?" starts with checking `type`, then that the matching block is the one set.

**Tokens.** {{server-certificates-tokens}} {{tls-version-tokens}}

**Validator rules not recorded elsewhere.** The required-field and bypass-exclusion rules are in [[zia.sdk-go.service-defects]]; the Terraform plan-time checks are there too. {{go-validator-block-and-cert-rules}} {{python-no-client-validation}}

**Casing.** {{python-kwargs-casing}} {{eun-casing}}

**Reading through MCP.** {{mcp-full-records}} {{mcp-no-output-schema}} {{mcp-list-query}}

The meaning of each setting is in [[zia.ssl-inspection.actions]]. Predefined and default rule flags, and what to strip on a PUT, are in [[zia.ssl-inspection.rules]].
