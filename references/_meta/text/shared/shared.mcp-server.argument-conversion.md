# Where the Zscaler MCP server's argument converters drop or choose silently: ZPA policy conditions and ZTW country names (shared.mcp-server.argument-conversion)
Also called: convert_v2_to_sdk_format; convert_v1_to_v2_response; validate_and_convert_country_code; mcp policy condition conversion; mcp country code fuzzy match; zpa_update_access_policy_rule conditions

The MCP server converts some caller input before it reaches the SDK. Three converters at the pinned release return a well-formed result while discarding or choosing part of the input, and each has an open upstream issue.

## ZPA policy conditions

`convert_v2_to_sdk_format` enters its dict branch when every element is a dict, but reads only `cond.get("operands", [])` from each; a list of flat operand dicts with no `operands` key therefore yields an empty list with no error. Issue #109 reports that a policy rule can then be created or updated with none of the conditions the caller supplied, and was open when captured. [shared.mcp-server.argument-conversion:v2-dict-branch-drops-flat-operands] `convert_v1_to_v2_response` reads only an operand's `rhs` or `lhs`, and only for object types listed in `_V1_TO_V2_VALUE_TYPES` or `_V1_TO_V2_ENTRY_TYPES`, and skips a condition that ends with no operands. Issue #110 reports that operands already in v2 shape (`values` or `entry_values`) and operands of unlisted types are dropped with no error, so a read-convert-update flow strips them before the write; it was open when captured. [shared.mcp-server.argument-conversion:v1-to-v2-drops-v2-operands] Whether the maintainers consider these defects, and whether a fix is planned, is not stated [gap:shared.mcp-server.argument-conversion:converter-fix-status].

## ZTW country names

`validate_and_convert_country_code` tries `alpha_2`, `alpha_3`, `name`, `common_name` and `official_name` lookups and then `pycountry.countries.search_fuzzy`, and on the fuzzy path returns `countries[0]`, the first candidate. Issue #108 reports that when the fuzzy search returns several candidates the helper returns the first with no error, no warning and no indication that a choice was made, that it never checks `len(countries)`, and that `Korea` resolves to `COUNTRY_KP` although `KR` also matches; it was open when captured. [shared.mcp-server.argument-conversion:country-fuzzy-first-match] Whether the helper rejects ambiguous input in a later release is open [gap:shared.mcp-server.argument-conversion:country-ambiguity-fix].

Not known (open gaps):
- Whether the ZPA condition converters will be fixed [gap:shared.mcp-server.argument-conversion:converter-fix-status]: settled by source-read. Blocks: relying on an MCP policy-rule update to keep every condition the caller read
- Whether the ZTW country helper will reject ambiguous names [gap:shared.mcp-server.argument-conversion:country-ambiguity-fix]: settled by source-read. Blocks: passing free-text country names to ZTW destination-group tools

Area: shared.mcp-server, its subjects in references/_meta/spine/shared/shared.mcp-server.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.mcp-server.tool-inventory.md (Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate)
- see-also references/_meta/text/shared/shared.mcp-server.results.md (What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV)
