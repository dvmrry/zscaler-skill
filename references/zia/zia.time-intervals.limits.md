**How many intervals.** {{object-cap}}

**How many per rule.** The limits table says {{times-per-rule-table}} but the rule configuration pages and the Terraform schema cap it lower, as the divergence `per-rule-cap` records. Plan on two intervals per URL Filtering or Firewall Filtering rule until a tenant shows otherwise; the other limits for firewall rules are in [[zia.firewall.limits]].

**What characters a name may contain.** The sources disagree, recorded as divergence `name-characters`. {{string-inputs}} The MCP server and its workflow skill claim a stricter letters-and-spaces rule, and the skill says the tool enforces it client-side; the tool code does not, and the Python SDK's own examples use names with digits. A name of letters and spaces (for example `Business Hours`) is safe under every reading. The server-side rule is gap `name-server-rule`.
