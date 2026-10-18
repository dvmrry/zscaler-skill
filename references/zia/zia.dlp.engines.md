The common wrong answer to "can I write a DLP rule that matches my custom dictionary X?" is yes. It is no, until X sits in an engine.

{{engine-definition}} {{rules-reference-engines}} {{api-rule-has-engines-only}} That one level of indirection is the first thing to check when a custom dictionary "does nothing": the dictionary may not be in any engine, or the engine may not be on the rule. The dictionaries themselves are in [[zia.dlp.dictionaries]]; the rule side is in [[zia.dlp.rules]].

{{predefined-engines-exist}}

Composition is where an engine gets its power. {{boolean-composition}} {{expression-wire-form}} {{validate-expression-endpoint}} When reading a tenant's engines, expect to resolve `D<number>` back to dictionary IDs yourself; the engine object the Go SDK models carries only the expression string.

{{engine-channels}} Do not tell an operator that a channel-scoped engine is inactive for web traffic, or the reverse, without a lab test; the captured help does not say.

{{engine-limits}}

Terraform's handling of engines and rules has its own defects; see [[zia.terraform.field-fidelity]].
