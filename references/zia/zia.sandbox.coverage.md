A "why wasn't my file sandboxed" question starts with the tenant's Sandbox tier. {{tier-limits}} {{basic-lacks-features}} {{out-of-scope-not-analyzed}} A Basic tenant that downloads a `.docx`, or a 3 MB `.exe`, gets no Sandbox analysis for it. Layer attribution is in [[zia.sandbox.verdicts]].

**Pre-checks.** {{static-fast-path}} {{no-active-content-reading}} {{previously-analyzed}}

**Default rule.** The vendor's description of what the default rule covers: {{help-default-rule}} {{help-size-ceilings}} The MCP skill and the help page differ on the Advanced ceiling for some types {{divergence:advanced-size-ceiling}}.

**Decryption.** {{needs-decryption}} What a non-decrypting SSL rule leaves in force is in [[zia.ssl-inspection.pipeline]].

{{not-analyzed-checklist}} Whether SSL inspection is checked before or after the report lookup is open {{gap:check-order-vs-report}}.
