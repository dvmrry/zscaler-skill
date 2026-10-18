ZIA's URL entry syntax looks like other products' and behaves differently, which is why intuitive answers go wrong here.

**Wildcards.** {{leading-period-wildcard}} {{asterisk-invalid}} The MCP matcher treats a leading period differently from the Help contract {{divergence:mcp-matcher-leading-dot}}. What the console stores when an asterisk entry is saved is open {{gap:console-accepts-asterisk}}. Whether a leading-period wildcard covers a subdomain exactly five levels deep is open {{gap:exactly-five-levels}}.

**Exact entries.** {{exact-form}} {{right-side-implicit}} {{trailing-slash}} {{scheme-not-matched}}

**Ranking.** {{exact-beats-wildcard}} The MCP matcher does not rank matches {{divergence:mcp-matcher-priority}}. That ranking feeds category membership: see [[zia.url-categories.membership]].

Format rules that reject entries outright are in [[zia.url-categories.entry-format]].

**MCP `contains_url`.** The MCP guide describes its matcher as following ZIA semantics {{mcp-guide-semantics-claim}}. {{mcp-contains-url-matcher}} It also diverges from the Help contract on paths {{divergence:mcp-matcher-path}} and on wildcard depth and asterisks {{divergence:mcp-matcher-depth-and-asterisk}}.
