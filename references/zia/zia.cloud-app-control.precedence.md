Neither "Cloud App Control always wins" nor "the stricter policy wins" holds. The rule that matters is about the *allow* path.

{{cac-first}} {{cac-allow-skips-url-filtering}}

{{cascading-allow-path}} {{cac-block-final}}

{{no-cac-rule-url-filtering-runs}} {{scoped-allow-leaves-others-to-url-filtering}}

{{per-rule-cascade}} {{cac-rule-order}} The MCP tools expose order as 1-based with lower values first {{mcp-order-surface}}, and their workflow skill states first-match and shadowing {{mcp-skill-first-match-shadowing}}. {{document-cascading}} {{prefer-cac-for-predefined-apps}} Each pass of the pipeline evaluates CAC before URL Filtering: see [[zia.ssl-inspection.pipeline]].
