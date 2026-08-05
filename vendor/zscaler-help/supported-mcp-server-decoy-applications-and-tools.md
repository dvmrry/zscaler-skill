# Supported MCP Server Decoy Applications and Tools

**Source:** https://help.zscaler.com/deception/supported-mcp-server-decoy-applications-and-tools
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This is a scoped summary of the current rendered Help article. It preserves
the exact application and tool identifiers while shortening the prose
descriptions of what each decoy tool returns.

The Deception MCP server decoy integrates an AI application or large language
model (LLM) chatbot with decoy applications and tools. The client invokes the
tools and receives fabricated data. Zscaler Support is the documented path for
requesting an additional application or tool.

The current article lists 38 tools across 10 application families.

| Application family | Tool identifiers | Documented operation |
|---|---|---|
| Bitbucket | `bitbucket_search_repositories`, `bitbucket_search_code`, `bitbucket_search_artifacts` | Search repository metadata, code, and pipeline artifacts. |
| Database — Cassandra | `list_keyspaces`, `execute_select_query`, `server_info` | List keyspaces, return select-query rows, and return cluster/server details. |
| Database — Elasticsearch | `list_indices`, `search_logs`, `cluster_info` | List indices, search log indices, and return cluster details. |
| Database — PostgreSQL | `list_databases`, `execute_select_query`, `server_info` | List databases, return select-query rows, and return server/version details. |
| Confluence | `confluence_get_page`, `confluence_search` | Retrieve pages and search with CQL. |
| GitHub | `search_repositories`, `search_code`, `list_commits`, `get_pull_request_comments` | Search repositories and code, list commits, and return pull-request comments. |
| GitLab | `search_repositories`, `search_code`, `list_commits`, `get_pull_request_comments` | Search projects and code, list commits, and return merge-request comments. |
| Google | `google_search_drive_files`, `google_sheets_read`, `google_docs_read`, `google_chat_search_message`, `google_sildes_get_presentation` | Search Drive and Chat, read Sheets and Docs, and retrieve Slides presentations. |
| Jenkins | `jenkins_searchbuildlog`, `jenkins_getjobscm` | Search build logs and retrieve job source-control configuration. |
| Jira | `jira_search_issues`, `jira_get_issue` | Search issues with JQL and retrieve an issue. |
| Slack | `get_user_info`, `conversations_search_messages`, `channels_list` | Return user information, search conversations, and list channels. |
| Salesforce | `salesforce_query_soql`, `salesforce_list_reports`, `salesforce_get_report`, `salesforce_get_account` | Query standard objects, list and retrieve reports, and retrieve account details. |

The identifier `google_sildes_get_presentation` is preserved exactly as
published, including the spelling of `sildes`.

## Source boundary

These are attacker-facing decoy tools exposed by a Deception network-decoy
service that speaks MCP. The article does not document an administrative MCP
server for configuring or managing the Deception product, and the tool list
must not be treated as such a management surface.
