Python SDK lists come back one page at a time, so a single call is not the whole collection. The Go equivalents are [[shared.sdk-go.list-pagination]], and the URL Filtering specifics are in [[zia.url-filtering.list-pagination]].

**Walking pages.** {{first-page-only}} {{has-next-next}} {{stops-on-short-page}} The code-level rule is in [[zia.sdk-python.request-conventions:has-next-zia]]. {{stopiteration-at-end}}

**Page size.** {{zia-default-page-size}}

**History.** {{pagination-fix-history}} Whether the user and group lists still lose a record is open {{gap:n-minus-1-regression}}.
