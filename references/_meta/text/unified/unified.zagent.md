# ZAgent: the Admin Console's conversational AI, its agents, entitlements and history retention (unified.zagent)
Also called: zagent; zscaler ai agent; admin console ai assistant; digital experience agent; risk360 agent; data protection agent; zagent retention; zagent api

ZAgent is Zscaler's AI framework for operating and managing its SASE platform, used as a unified conversational experience to understand, monitor, troubleshoot, configure and optimize the environment. [unified.zagent:what-it-is] ZAgent picks the appropriate agent for a request and can choose a skill, or the admin selects an agent and then a skill; typing @ selects an agent and / selects that agent's skill. [unified.zagent:routing]

**Agents and entitlement.** An agent's availability depends on subscriptions: the Digital Experience Agent is complimentary with Digital Experience's Advanced Plus (without it, only that agent's Knowledge Skill is available), the Risk360 Agent with Risk360, and the Data Protection Agent with Data Protection. [unified.zagent:agent-subscriptions] Risk360 features that run through ZAgent are noted in [Certain Risk360 features operate through the ZAgent service, which may use one or more sub-agents.](kb:risk360.overview:zagent-features). Whether ZAgent is still in Limited Availability is not stated by the current page [gap:unified.zagent:availability].

**Use cases.** The use-case article presents ZAgent's insights as covering Data Protection, Digital Experience (ZDX) and Risk360, and gives use-case examples for selecting Data Protection as the agent and for selecting Digital Experience as the agent. [unified.zagent:use-case-scope] The Data Protection agent supports DSPM and SaaS Security API related queries to provide information about data at rest coverage. [unified.zagent:data-protection-scope] For Risk360, the use-case article describes a Risk Analysis AI agent designed to enhance the ability to identify and scope risks within the Zero Trust Exchange environment by using Risk360. [unified.zagent:risk-analysis-agent] Which services have agents is open [gap:unified.zagent:agent-set].

**Using it.** ZAgent is used by clicking the Wand icon in the Zscaler Admin Console, optionally selecting an agent and a skill, and entering a prompt; depending on the prompt and ZAgent's reply, additional actions such as viewing device details or running a diagnostics session may be offered. [unified.zagent:flow] If ZAgent is running slow, the page says to check whether the selected agent's skill is deselected and to consider selecting one so the prompt runs through it; deselecting both skill and agent broadens the search but the prompt might take longer. Unable to access specific data or configuration points to the admin's role permissions, and unable to access specific agents points to the subscriptions. [unified.zagent:considerations]

**History.** ZAgent retains prompts and responses as session history for a rolling 14 days; the history shows nothing if there were no sessions in that period. [unified.zagent:retention] The ZAgent Logs fair-use page defines ZAgent logs as prompts, responses and metadata and says Zscaler retains them for a rolling 90 days during the subscription term, of which the most recent 14 days of session history is accessible through the Zscaler Admin Console; logs are stored in the United States or the European Union, and ZAgent is not trained using customer data. [unified.zagent:log-retention]

**Where it runs.** The ZAgent article describes it only as a drawer in the Zscaler Admin Console; it documents no API, MCP access or per-agent permission scopes. [unified.zagent:console-only]

What to check:
1. Which agent the question needs and whether the tenant has the subscription that includes it (for ZDX, Advanced Plus for more than the Knowledge Skill).
2. Whether the conversation being asked about is older than 14 days, after which it is no longer in session history.

Inferred, not quoted (say so when an answer rests on one):
- [unified.zagent:console-only] Tier B: Rests on an absence in the captured article: none of its blocks mentions an API, MCP or permission scopes, and no vendored SDK, provider or MCP server names ZAgent (`git grep -i zagent` at the pins finds nothing).

Not known (open gaps):
- Which services have ZAgent agents: the about page against the fair-use logs page [gap:unified.zagent:agent-set]: settled by source-read
- ZAgent's availability status and enablement path [gap:unified.zagent:availability]: settled by source-read or support-ticket. Blocks: telling an operator whether ZAgent needs a support request to enable

Area: unified.zagent, its subjects in references/_meta/spine/unified/unified.zagent.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/unified/unified.overview.md (Zscaler Experience Center: the unified admin console, what it consolidates, and how it is automated)
