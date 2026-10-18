Most "why wasn't my file sandboxed" questions are an eligibility question, so start by learning the tenant's Sandbox tier. {{tier-limits}} {{basic-lacks-features}} {{out-of-scope-not-analyzed}} A Basic tenant that downloads a `.docx`, or a 3 MB `.exe`, therefore gets no Sandbox analysis; Malware Protection or ATP may still act at their own layer (see [[zia.sandbox.verdicts]]).

Two pre-checks can also end the story before detonation. {{static-fast-path}} {{no-active-content-reading}} {{previously-analyzed}}

The vendor's description of what the default rule covers is below. {{help-default-rule}} {{help-size-ceilings}} The MCP skill and the help page differ on the Advanced ceiling for some types (the divergence on this subject).

Decryption is the other prerequisite. {{needs-decryption}} What a non-decrypting SSL rule leaves in force is in [[zia.ssl-inspection.pipeline]]; check the rule that matches the download's domain or URL category.

When a file shows no report, walk the causes in the source's order. {{not-analyzed-checklist}}

What to check: the tenant's tier, the file's extension and size against it, and the SSL rule that matched the source URL. The rule fields that scope Sandbox by file type are in [[zia.sandbox.rules]].
