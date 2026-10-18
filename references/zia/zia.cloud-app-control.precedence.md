Neither "Cloud App Control always wins" nor "the stricter policy wins" holds. The rule that matters is about the *allow* path.

{{cac-first}} {{cac-allow-skips-url-filtering}}

{{cascading-allow-path}} {{cac-block-final}}

{{no-cac-rule-url-filtering-runs}} {{scoped-allow-leaves-others-to-url-filtering}}

{{per-rule-cascade}} {{cac-rule-order}} {{document-cascading}} {{prefer-cac-for-predefined-apps}} Each pass of the pipeline evaluates CAC before URL Filtering: see [[zia.ssl-inspection.pipeline]].
