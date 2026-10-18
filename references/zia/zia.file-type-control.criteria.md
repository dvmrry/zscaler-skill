A File Type Control rule is a conjunction of criteria; the question is which criterion kept a file from matching.

Start with the expression: {{criteria-expression}} {{empty-criteria-ignored}}

Then the file-shape criteria, which are where most surprises are.

- **File types.** {{unknown-file-types}} {{custom-types-order}} {{archive-formats-scanned}} Whether a rule on an inner type fires through an allowed archive, and how other archive formats are treated, is open: see gap `archive-contents-rules`.
- **Size.** {{size-bounds}} This is separate from the scanning limit in [[zia.file-type-control.pipeline]].
- **Active content.** {{active-content}} {{provider-active-content-checks}}
- **Unscannable files.** {{unscannable}}
- **Password-protected files.** {{password-protected}} A Terraform apply cannot turn this setting on; see [[zia.terraform.field-fidelity]] (`file-type-password-protected-never-mapped`).

Who the rule applies to: {{scope-limits}}

Protocol selection and the wire values are in [[zia.file-type-control.api-shape]]; what a match does is in [[zia.file-type-control.actions]].
