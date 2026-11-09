# How URL category entries match requests (wildcards) (zia.url-categories.entry-matching)
Also called: wildcard matching; leading period wildcard; does *.example.com match example.com; asterisk wildcard; subdomain matching; url pattern matching; trailing slash

ZIA's URL entry syntax looks like other products' and behaves differently, which is why intuitive answers go wrong here.

**Wildcards.** A leading period makes an entry a wildcard: `.example.com` matches subdomains up to 5 levels deep (the same policies apply to them), the bare domain `example.com` itself, and `example.com` with any directory or file to its right. [zia.url-categories.entry-matching:leading-period-wildcard] Asterisks are not valid wildcards: `*.example.com` and `*example.com` are not permitted; an asterisk inside a URL is a literal character, and the documented domain wildcard is a leading period. [zia.url-categories.entry-matching:asterisk-invalid] The MCP matcher treats a leading period differently from the Help contract [divergence:zia.url-categories.entry-matching:mcp-matcher-leading-dot]. What the console stores when an asterisk entry is saved is open [gap:zia.url-categories.entry-matching:console-accepts-asterisk]. Whether a leading-period wildcard covers a subdomain exactly five levels deep is open [gap:zia.url-categories.entry-matching:exactly-five-levels].

**Exact entries.** An entry without a leading period matches only that exact host (plus any path); `example.com` does not match `www.example.com`. [zia.url-categories.entry-matching:exact-form] Matching to the right of an entry is implicit: `example.com` also matches any port, path, or query string on that host. [zia.url-categories.entry-matching:right-side-implicit] For path entries, a trailing slash matches everything under the path (`example.com/resources/`); without it the entry matches only that exact path string. [zia.url-categories.entry-matching:trailing-slash] Entries never carry a scheme, so `http://` and `https://` requests to the same host match the same entries. [zia.url-categories.entry-matching:scheme-not-matched]

**Ranking.** An exact entry is more specific than a wildcard entry: for `atlanta.example.com`, a category holding `atlanta.example.com` outranks one holding `.atlanta.example.com` or `.example.com`. [zia.url-categories.entry-matching:exact-beats-wildcard] The MCP matcher does not rank matches [divergence:zia.url-categories.entry-matching:mcp-matcher-priority]. That ranking feeds category membership: see [Which URL category a URL belongs to](kb:zia.url-categories.membership).

Format rules that reject entries outright are in [What a URL category entry may contain, and category limits](kb:zia.url-categories.entry-format).

**MCP `contains_url`.** The MCP supported-tools guide, for the `contains_url` parameter of `zia_list_url_categories`, says the server's matching understands ZIA's domain semantics and that `.app.box.com` covers `app.box.com`. [zia.url-categories.entry-matching:mcp-guide-semantics-claim] The MCP `contains_url` filter runs in the MCP process on the rows the category listing call returns, not as a ZIA API filter. It reduces the query and every configured entry to a bare lower-case host by stripping scheme, path, query, port and leading or trailing periods, then matches an entry that equals the host or that the host extends at a dot-label boundary. It searches the `urls`, `db_categorized_urls` and `dbCategorizedUrls` fields and returns each matching row with an additive `_url_match`. [zia.url-categories.entry-matching:mcp-contains-url-matcher] The filter also diverges from the Help contract on paths [divergence:zia.url-categories.entry-matching:mcp-matcher-path] and on wildcard depth and asterisks [divergence:zia.url-categories.entry-matching:mcp-matcher-depth-and-asterisk].

What to check:
1. Whether an asterisk entry is read as its leading-period equivalent, and the answer says it was translated, since the console's stored behavior is unverified.
2. Whether the bare domain is in scope, since a leading-period entry also matches it.
3. Whether a subdomain exactly five levels deep is covered by a wildcard.

Inferred, not quoted (say so when an answer rests on one):
- [zia.url-categories.entry-matching:scheme-not-matched] Tier B: Inferred from the format rule that entries must not contain a protocol schema; no source states the match-time behavior directly.

Sources disagree (name both sides):
- Leading period versus bare domain [divergence:zia.url-categories.entry-matching:mcp-matcher-leading-dot]
  - zscaler-help: Help: `.safemarch.com` covers the domain and its subdomains; the bare `safemarch.com` matches only that domain (and what is to its right).
  - mcp-server: MCP v0.15.4: the leading period is stripped, so `.box.com` and `box.com` get the same exact-or-any-depth-suffix rule; a bare `safemarch.com` entry matches `atlanta.safemarch.com`.
  Impact: A bare-domain entry that the product would match only exactly is reported by contains_url as covering subdomains; the helper output does not show what the live backend does.
- Path and trailing slash [divergence:zia.url-categories.entry-matching:mcp-matcher-path]
  - zscaler-help: Help: `safemarch.com/resources` matches the exact string and `safemarch.com/resources/` matches everything beneath it.
  - mcp-server: MCP v0.15.4: the path is stripped from entries and query before matching, so a path-scoped entry collapses to host scope.
  Impact: A category holding only `safemarch.com/resources` is reported as matching the whole host.
- Wildcard depth and asterisk [divergence:zia.url-categories.entry-matching:mcp-matcher-depth-and-asterisk]
  - zscaler-help: Help: the leading-period wildcard reaches up to 5 subdomain levels; a leading asterisk is not a wildcard.
  - mcp-server: MCP v0.15.4: the suffix check has no depth limit and no asterisk handling, so `a.b.c.d.e.f.safemarch.com` matches a `safemarch.com` entry.
  Impact: contains_url can report a match deeper than five levels that the product would not wildcard-match.
- Exact-match priority [divergence:zia.url-categories.entry-matching:mcp-matcher-priority]
  - zscaler-help: Help: an exact category entry takes priority over a wildcard entry for the same request.
  - mcp-server: MCP v0.15.4: every matching row is appended in input order; there is no priority or conflict resolution.
  Impact: contains_url lists all matching categories; it does not say which one ZIA would apply.

Not known (open gaps):
- Whether a leading-period wildcard covers a subdomain exactly 5 levels deep [gap:zia.url-categories.entry-matching:exactly-five-levels]: settled by lab-test. Blocks: deterministic answers for 5-level-deep subdomains under a wildcard
- What the console stores and matches when an asterisk entry is saved [gap:zia.url-categories.entry-matching:console-accepts-asterisk]: settled by lab-test or support-ticket. Blocks: explaining tenant entries that use `*` despite the documented rule

Area: zia.url-categories, its subjects in references/_meta/spine/zia/zia.url-categories.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to): When a URL matches entries in more than one custom category, the category with the more specific matching entry wins, and rules referencing the less specific (wildcard) category do not apply to that URL, regardless of rule order. [zia.url-categories.membership:specific-entry-wins]
- links-to references/_meta/text/zia/zia.url-categories.entry-format.md (What a URL category entry may contain, and category limits)
