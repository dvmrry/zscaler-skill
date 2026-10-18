This is the mechanic behind most confidently wrong precedence answers. Before any URL Filtering rule is walked, ZIA decides which category the URL belongs to. Rules then match on that category, not on every category that happens to contain a matching entry.

Across custom categories, specificity decides. {{specific-entry-wins}} {{resolved-before-rules}} So moving an entry from a wildcard (`.example.com`) to an exact form (`www.example.com`) in a lower-ordered rule's category can change which rule wins without changing any rule order. How entries match in the first place, including what counts as "more specific", is in [[zia.url-categories.entry-matching]].

Predefined categories meet custom ones through a different mechanism: Retain Parent Category. {{retain-parent-choice}} {{retain-parent-both-match}} {{without-retain-parent}} When a precedence question involves a predefined category and a custom category, the answer branches on this setting for the specific entry, so name the lookup instead of guessing: the category's retained-entry counters or its `dbCategorizedUrls` list. {{retain-parent-counters}}

Some memberships cannot be known offline at all. Zscaler does not publish which predefined categories a URL is in, and IaC carries only custom categories. An earlier rule on a predefined category is therefore undecidable without a live lookup, and it shields every rule below it: the honest answer stops there rather than skipping to a later rule that is decidable. {{ip-rarely-categorized}}

Rule-side mechanics, once membership is known, are in [[zia.url-filtering.rule-order]].
