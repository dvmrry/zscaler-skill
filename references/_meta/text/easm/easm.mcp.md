# The Zscaler MCP server's EASM tools: inventory, full records and documentation mismatches (easm.mcp)
Also called: easm mcp tools; zeasm_list_findings; zeasm_get_lookalike_domain; easm review attack surface skill; zeasm organization_id

The MCP server wraps the Python SDK's EASM reads; toolsets, entitlement filtering and the untrusted-content banner are shared behavior ([Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate](kb:shared.mcp-server.tool-inventory), [What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV](kb:shared.mcp-server.results)).

**Tools.** The MCP server has seven read-only EASM tools in three toolsets: `zeasm` (organizations), `zeasm_findings` (list, details, evidence, scan output) and `zeasm_lookalike_domains` (list, get). [easm.mcp:tools] The list tools unwrap the SDK collection's `results` and return each item's full `as_dict()` record; the get tools return the full record. [easm.mcp:unwrap-full-records] The finding and lookalike tools take `org_id`; the three finding get tools also take `finding_id`, and the lookalike get takes `lookalike_raw`. [easm.mcp:arg-names]

**Documentation mismatches.** The skill's argument names differ [divergence:easm.mcp:skill-arg-names], the tool guide describes an old wrapper [divergence:easm.mcp:org-docs-wrapper], and the tool list describes triage rows [divergence:easm.mcp:list-docs-triage].

**What the skill asks for.** The review skill asks the agent to note each organization's monitored domains or assets and last scan date. [easm.mcp:skill-org-fields] Monitored-asset counts and last scan dates are not on organization records; per-asset first and last seen times come from the asset list, which no MCP tool calls. [easm.mcp:org-fields-unavailable]

**Trust.** Which EASM tools carry the untrusted-content flag is in [At 0.15.4 exactly eight tools are flagged: `zeasm_get_finding_evidence`, `zeasm_get_finding_scan_output`, `zeasm_get_lookalike_domain`, `zeasm_list_lookalike_domains`, `zia_get_sandbox_report`, `zdx_list_software`, `zdx_get_software_details` and `zdx_list_deeptrace_top_processes`; a test asserts the flagged set equals this list.](kb:shared.mcp-server.results:untrusted-set); the finding description gap is in [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings).

What to check:
1. Whether tool calls use org_id and lookalike_raw rather than the skill's organization_id and domain_id.

Inferred, not quoted (say so when an answer rests on one):
- [easm.mcp:org-fields-unavailable] Tier B: Follows from the organization model (id and name) and the asset endpoints being API-only.

Sources disagree (name both sides):
- The EASM review skill calls the tools with argument names the tools do not define. [divergence:easm.mcp:skill-arg-names]
  - mcp-server: Calls use `organization_id` and, for the lookalike get, `domain_id`.
  - mcp-server: The tools take `org_id` and `lookalike_raw`.
  Impact: An agent following the skill literally sends arguments the tool schema rejects; use org_id and the lookalike_raw domain name.
- The bundled tool guide says the organizations tool returns a results/total_results wrapper; the tool returns a list of organization rows. [divergence:easm.mcp:org-docs-wrapper]
  - mcp-server: The result is a dictionary with `results` and `total_results`.
  - mcp-server: The tool unwraps `results` and returns one row per organization.
  Impact: Code written against the guide's example (`orgs['results']`) fails; iterate the returned list.
- The supported-tools guide says the findings list returns a triage row rather than the raw SDK record; the tool returns the full record. [divergence:easm.mcp:list-docs-triage]
  - mcp-server: One triage row per finding rather than the raw SDK record.
  - mcp-server: Each item's full `as_dict()` record.
  Impact: Findings list rows include description and the scoring fields, which matters for token budgets and for the untrusted description text.

Area: easm.mcp, its subjects in references/_meta/spine/easm/easm.mcp.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.mcp-server.results.md (What a Zscaler MCP tool result contains: full records, untrusted-content banners, JMESPath and CSV)
- depends-on references/_meta/text/easm/easm.api.md (The EASM (ZEASM) API: organization scoping, clients, paging and the Postman collection): No Go SDK package, Terraform resource or Ansible module covers EASM; the Python SDK and the MCP server are its only clients. [easm.api:python-only]
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
- links-to references/_meta/text/shared/shared.mcp-server.tool-inventory.md (Which tools a Zscaler MCP server registers: toolsets, entitlements and the write gate)
