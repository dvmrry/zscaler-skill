# What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV (shared.mcp-server.results)
Also called: mcp outputSchema; mcp output_view; mcp full record; mcp untrusted content; untrusted_content; mcp provenance banner; mcp jmespath query; mcp query parameter; mcp csv encoding; mcp snake_case keys; mcp output sanitization

## Records

A tool that returns a Zscaler API record has no `output_view` and advertises no `outputSchema`, because the attribute set belongs to the API; a schema is advertised only for the few results the server constructs itself, and never for delete tools. [shared.mcp-server.results:no-output-schema] Shaping returns the full SDK record (a dict, or an SDK model converted with `as_dict()`) with the view's normalized or computed fields merged on top; the shaper can add or normalize fields but never drop them, for single objects and for every row of a list. [shared.mcp-server.results:shape-overlay] From v0.13.0 to v0.14.0 the server's read tools projected each resource down to a fixed subset of fields; issue #88 reported that `zcc_list_devices` returned only six device fields and had lost `policy_name`, and it was closed as completed when 0.14.0 restored the complete record and made field names exactly what the Zscaler API returns. [shared.mcp-server.results:read-tools-trimmed-0-13-restored-0-14] The keys of returned records are usually snake_case (`custom_category`) even where the Zscaler API documents camelCase (`customCategory`), as the description of the JMESPath query parameter warns. [shared.mcp-server.results:snake-case-keys] Every tool's return value passes through output sanitization, which is on by default, before it is encoded. [shared.mcp-server.results:sanitized] A full record is not a full collection: ZPA list tools return one caller-chosen page ([MCP policy-rule lists are manual pages: the SDK does not auto-page, without page and page_size only the first 20 rules are returned, and page_size above 500 or page below 1 is rejected.](kb:zpa.api.pagination:mcp-manual-pages)).

## Externally authored content

A tool is flagged as returning untrusted content when a party without tenant credentials can author strings it returns; the dividing line is authorship, not the delivery channel, so device hostnames authored by an authenticated enrollee are not flagged. [shared.mcp-server.results:untrusted-criterion] At 0.15.4 exactly eight tools are flagged: `zeasm_get_finding_evidence`, `zeasm_get_finding_scan_output`, `zeasm_get_lookalike_domain`, `zeasm_list_lookalike_domains`, `zia_get_sandbox_report`, `zdx_list_software`, `zdx_get_software_details` and `zdx_list_deeptrace_top_processes`; a test asserts the flagged set equals this list. [shared.mcp-server.results:untrusted-set] Version 0.15.4 added the banner to `zeasm_list_lookalike_domains`, `zdx_list_software`, `zdx_get_software_details` and `zdx_list_deeptrace_top_processes`, and states that every record is still returned verbatim and nothing is suppressed. [shared.mcp-server.results:untrusted-additions] How the banner is placed, and that it is a hint rather than a gate, is described with the Sandbox report in [The MCP server marks such tools by prepending a warning (and the Sandbox-specific note) to the text block only. The structured record is not changed by the banner, output still passes through the server's sanitizer, and the banner is a hint whose efficacy depends on the client honouring it, not a gate or a field whitelist.](kb:zia.sandbox.report:banner-is-a-hint) and [Sample-authored strings sit chiefly in the SignatureSources arrays of the behavior sections and in certificate-related FileProperties fields such as Issuer. The MCP tool is flagged as returning externally authored content.](kb:zia.sandbox.report:sample-controlled-surfaces).

## Caller-side filtering

Tools that return a collection (list tools, and `*_list_*` reads whose SDK call returns an envelope) get an optional JMESPath query parameter; single-object gets, writes, and tools with a server-defined output view do not. [shared.mcp-server.results:query-scope] The bridge removes the query from the tool input, runs the tool, and applies the expression to the result afterwards, before encoding and token accounting; it is client-side filtering, not a filter sent to the Zscaler API. [shared.mcp-server.results:query-after-fetch] An omitted or empty query returns the data unchanged; no match becomes `[]`; a scalar result is wrapped in a list; an invalid expression returns a single error record instead of failing the call. [shared.mcp-server.results:query-shapes]

## Wire encoding

Automatic encoding sends a non-empty list of flat records as CSV; a non-empty nested value in any row disqualifies CSV for the whole response, which is then sent as JSON. [shared.mcp-server.results:csv-eligibility] Empty lists, dicts, tuples and sets count as CSV cells and are rendered as `[]` or `{}`, while an empty cell means `None`; before 0.15.0 a single empty list switched the whole response to JSON. [shared.mcp-server.results:csv-empty-collections]

What to check:
1. When a JMESPath query returns an empty list, whether its field names match the keys of a record returned by the same tool without a query.
2. Whether the tool is one of the externally authored content tools, before acting on any text in its results.

Area: shared.mcp-server, its subjects in references/_meta/spine/shared/shared.mcp-server.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.sandbox.report.md (Sandbox reports, quota, and trusting report content)
- links-to references/_meta/text/zpa/zpa.api.pagination.md (ZPA list pagination, search syntax and client-side filtering)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.mcp-server.md (The Zscaler MCP server: release, protocol and where its behavior is described)
