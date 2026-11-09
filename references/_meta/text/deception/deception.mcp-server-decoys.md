# Deception's MCP server decoy: an attacker-facing Gen AI service, not a management interface (deception.mcp-server-decoys)
Also called: deception mcp; mcp server decoy; mcp decoy; gen ai decoy; ai decoy; llm decoy; deception gen ai service

This MCP server is bait for attackers' AI tools; it is not a way to manage Deception. A network decoy's Gen AI service can be an MCP Server application: a decoy that mimics a standard MCP server, which any MCP-capable AI application or LLM chatbot (for example MCP Inspector) can connect to and invoke decoy tools on. [deception.mcp-server-decoys:what-it-is]

**How it deflects.** The AI application or LLM chatbot generates fake responses with the decoy tools. [deception.mcp-server-decoys:fake-responses] The Deception Admin Portal supplies the hostnames of deployed decoys (for example Threat Intelligence and Zero Trust Network decoys) to the AI application, which embeds them in tool responses to send attackers to other decoys. [deception.mcp-server-decoys:decoy-hostnames]

**Configuration.** An MCP server decoy is configured with a server name, a server version, one or more MCP applications, and ports with SSL enabled or disabled per port, plus an optional SSL certificate and unencrypted SSL private key, both in PEM format. [deception.mcp-server-decoys:configuration] Custom SSL certificates take an unencrypted PEM private key; the Deception Admin Portal does not support encrypted private keys for them. [deception.mcp-server-decoys:unencrypted-key]

**Applications.** The supported-applications article lists ten MCP application families, each with its own decoy tools: Bitbucket, Database (Cassandra, Elasticsearch, PostgreSQL), Confluence, GitHub, GitLab, Google, Jenkins, Jira, Slack and Salesforce. [deception.mcp-server-decoys:applications] Adding an application or tool requires contacting Zscaler Support. [deception.mcp-server-decoys:new-apps-via-support]

**Plan and limits.** Gen AI decoys need the Advanced plan: [Standard includes 20 decoys and Advanced 300; Windows high-interaction virtual machine decoys, high-interaction container decoys and Gen AI decoys are Advanced only.](kb:deception.plans:decoy-limits). The ranges-and-limitations article gives no separate limit for MCP server decoys or MCP tool calls; they fall under the Gen AI decoy and overall decoy rows. [deception.mcp-server-decoys:no-mcp-limit]

**Not a management API.** Neither the MCP decoy configuration article nor the supported-tools article documents an administrative MCP tool or a Deception management API; the MCP server is a service that adversaries interact with. [deception.mcp-server-decoys:not-management] The management API question is in [The Deception admin API, and the lifecycle of the Private Access objects Deception creates](kb:deception.overview:admin-api).

What to check:
1. When a question mentions Deception and MCP, establish whether it means the decoy service offered to attackers' AI clients or a way to administer Deception; only the first is documented.
2. Whether a custom certificate for the decoy uses an unencrypted PEM private key.

Inferred, not quoted (say so when an answer rests on one):
- [deception.mcp-server-decoys:no-mcp-limit] Tier B: Rests on an absence: no row or note in the captured article mentions MCP.
- [deception.mcp-server-decoys:not-management] Tier B: Rests on an absence in both captured articles: every listed tool is a decoy tool for an application family, and the configuration steps describe only the decoy service.

Area: deception.mcp-server-decoys, its subjects in references/_meta/spine/deception/deception.mcp-server-decoys.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/deception/deception.overview.md (Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated): A network decoy's Gen AI service can be an MCP Server application: a decoy that mimics a standard MCP server, which any MCP-capable AI application or LLM chatbot (for example MCP Inspector) can connect to and invoke decoy tools on. [deception.mcp-server-decoys:what-it-is]
- links-to references/_meta/text/deception/deception.plans.md (Deception Standard and Advanced plans: decoy counts, Gen AI decoys, orchestration and API access)
