These rules decide whether an entry is accepted at all, which matters most for automation: {{bulk-add-all-or-nothing}}

The basic shape: {{format-rules}} {{length-limits}} {{non-english}} Underscores follow an asymmetric rule that surfaces only at validation time. {{underscore-rules}} {{no-tld-only}}

Keywords are broader than they look. {{keywords-whole-uri}} A keyword category meant for gambling sites will also catch searches *about* gambling.

Exact entries are not the only matching mode. {{regex-patterns}} {{category-type-filter}} Blocking a whole TLD is a separate category type rather than a `.ru`-style entry, but which field such a category takes its TLDs in is not established by any source we hold.

{{category-quotas}} How entries match requests once accepted is in [[zia.url-categories.entry-matching]].
