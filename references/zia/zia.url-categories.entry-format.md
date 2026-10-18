These rules decide whether an entry is accepted at all, which matters most for automation: {{bulk-add-all-or-nothing}}

The basic shape: {{format-rules}} {{length-limits}} {{non-english}} {{underscore-rules}} {{no-tld-only}}

{{keywords-whole-uri}}

{{regex-patterns}} {{category-type-filter}} The `type` filter rests on SDK and MCP behavior, not the captured contract {{divergence:type-filter-parameter}}. Which field a TLD category takes its entries in is open {{gap:tld-category-entries}}.

{{category-quotas}} How entries match requests once accepted is in [[zia.url-categories.entry-matching]].

**Listing.** The MCP source says the listing does not paginate and ignores page inputs {{mcp-list-unpaginated}}. Whether the keyword-counts parameter trims the response is disputed {{divergence:keyword-counts-parameter}}. {{mcp-lite-not-used}}
