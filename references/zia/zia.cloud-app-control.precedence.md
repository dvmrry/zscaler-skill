The usual wrong answer is "Cloud App Control always wins" or "the stricter policy wins." Neither is true. The real rule is about the *allow* path.

{{cac-first}} {{cac-allow-skips-url-filtering}} That is the whole default: a CAC allow short-circuits URL Filtering, so a URL Filtering block on the same site never evaluates.

One setting changes it, and only in one direction. {{cascading-allow-path}} {{cac-block-final}} Cascading is a way to tighten CAC allows with URL Filtering's rules, never a way to relax CAC blocks.

An allow has to be an *explicit* rule match. {{no-cac-rule-url-filtering-runs}} A CAC allow scoped to one department therefore leaves everyone else to URL Filtering.

{{per-rule-cascade}} So a tenant with the global option off can still have individual rules that cascade; check the rule as well as the setting. {{cac-rule-order}} {{document-cascading}} {{prefer-cac-for-predefined-apps}} When answering for a specific tenant, the cascading state is the first fact to establish. Each pass of the pipeline evaluates CAC before URL Filtering: see [[zia.ssl-inspection.pipeline]].
