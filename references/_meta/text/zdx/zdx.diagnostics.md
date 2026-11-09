# ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered (zdx.diagnostics)
Also called: diagnostics session; deep trace; deeptrace; deep tracing; zdx troubleshooting; client.zdx.troubleshooting; when to start a diagnostics session

A Diagnostics Session is an on-demand, per-device investigation that Client Connector runs. This subject places the term and points to the parts.

**What it is for.** The ZDX Score article says a Diagnostics session can be started to help evaluate and troubleshoot issues related to low scores. [zdx.diagnostics:low-scores] The API's troubleshooting area is deep tracing on a user's device ([The ZDX API gives programmatic access to administration (active locations and departments), alerts, software inventory, reports (ZDX Scores for applications and device health metrics and events) and troubleshooting (deep tracing on a user's device).](kb:shared.log-export.zdx:api-scope)). The Automate guide describes a deep tracing session as gathering comprehensive diagnostics about a specific device that is having trouble connecting to the network. [zdx.diagnostics:api-scope]

**One thing, two names.** The console's Diagnostics Sessions and the API's deep traces are one pool of sessions: the API's session limit counts sessions started from the UI. [zdx.diagnostics:same-sessions]

**Where each part is.** The four console session types and their options and results: [The four Diagnostics session types in the console: Deep Tracing, Hi-Fi Cloud Path, Bandwidth Test and Packet Capture Probing](kb:zdx.diagnostics.session-types). Statuses: [What a Diagnostics Session's status means, in the console and in the API](kb:zdx.diagnostics.session-status). Starting one through the API, with its limits: [Starting a deep trace through the API: the read chain, the request body, and where the clients disagree](kb:zdx.diagnostics.start-request). Reading, deleting and the session record: [Reading and deleting a deep trace through the API: the session record and its keys](kb:zdx.diagnostics.session-records). Score analysis jobs: [ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return](kb:zdx.diagnostics.analysis). The MCP tools: [The MCP server's ZDX deep-trace tools and troubleshooting prompt: inputs, results and mismatches](kb:zdx.diagnostics.mcp-tools).

**In the console.** During a Diagnostics session information is collected every minute for the Web probe and the Cloud Path probe, as well as device statistics. [zdx.diagnostics:session-collection-interval] Diagnostics needs the minimum required versions of Client Connector and ZDX Module, a Digital Experience subscription level that supports Diagnostics, and an admin role configured for Diagnostics. [zdx.diagnostics:session-requirements] A session can be run to monitor issues from 5 minutes to 60 minutes; starting one needs an active probe on the device that must have run for a minimum of 30 minutes; session information can be viewed on the Diagnostics page and exported as a PDF file, but an admin with View Only permission for Diagnostics details cannot use Export PDF. [zdx.diagnostics:session-duration-and-export] The contract and the help differ on the length [divergence:zdx.diagnostics:session-length-help].

**Limits.** The subscription table gives Total Diagnostics Sessions and Total Active Sessions as not supported on Standard, 25 each on Microsoft 365 and Advanced, and 100 each on Advanced Plus. [zdx.diagnostics:session-limit-tiers] The contract's tenant-wide figure differs [divergence:zdx.diagnostics:active-session-limit].

**Managing a session.** From the Diagnostics page an admin can copy a session's details into a new session with all fields editable, end a session in the In Progress table, or delete a session, which removes it from the Diagnostics page; a copy does not include a device that has a session in progress or is no longer associated with the user. [zdx.diagnostics:session-actions] The session tables give each session's type, Created Time (when the admin created it), Start Time (when Client Connector accepted the request and started collecting data) and Created By (the admin's name and email address), with Duration in minutes in the In Progress table and End Time in the History table, sorted by Start Time with the latest first by default. [zdx.diagnostics:session-table-fields]

**Live troubleshooting.** The contract's `/v1/config/tracing` operations manage live troubleshooting sessions: create and start one, list them (filterable by IDs, search term, states, session types and active status), count them, read, update, stop and delete one, read its state and its status (active/inactive), and validate a PCAP filter expression. Reads need the `zdx-ltsession:read` permission and writes `zdx-ltsession:write`; creating, updating, stopping and deleting a session also need `zdx-user-device-name-access:read`. [zdx.diagnostics:live-troubleshooting-api] How these sessions relate to Diagnostics Sessions is not documented [gap:zdx.diagnostics:live-vs-deep-trace]. No SDK calls them, [Neither SDK calls any /v1/config path: the configuration, monitor, collection and directory operations of the contract are reachable only by direct API calls.](kb:zdx.applications:config-no-sdk).

Inferred, not quoted (say so when an answer rests on one):
- [zdx.diagnostics:same-sessions] Tier B: No source names both terms together; inferred from the contract counting UI-initiated sessions in the deep-trace limit and from both describing an on-demand session on one device.

Sources disagree (name both sides):
- The length of a Diagnostics session: the API contract says up to 15 minutes; the About Diagnostics help says 5 to 60 minutes, and the Starting a New Diagnostics Session help lists 5, 15, 30 and 60 minutes. [divergence:zdx.diagnostics:session-length-help]
  - api-specs: `session_length_minutes` goes up to 15 minutes.
  - zscaler-help: A session can run from 5 minutes to 60 minutes.
  - zscaler-help: With Packet Capture Probing added to another type the Run Session For option offers 5, 15, 30 and 60 minutes.
  Impact: A 30- or 60-minute session the console offers may be refused or shortened when started through the API; the sources do not say whether the console and the API share a limit. The existing divergence session-length-range in zdx.diagnostics.start-request holds the SDK positions.
- How many Diagnostics sessions can be active: the API contract limits deep traces to 15 active sessions across all devices, UI sessions included; the subscription table gives 25 total active sessions on Microsoft 365 and Advanced and 100 on Advanced Plus. [divergence:zdx.diagnostics:active-session-limit]
  - api-specs: Overall 15 active sessions across all devices, including sessions started from the UI.
  - zscaler-help: Total Active Sessions is not supported on Standard, 25 on Microsoft 365 and Advanced, and 100 on Advanced Plus.
  Impact: No tier's figure equals the contract's 15; which limit an API start meets first is not stated by either source. The start-article help also says a Deep Tracing special application is not counted toward the sessions limit.

Not known (open gaps):
- How live troubleshooting sessions relate to Diagnostics Sessions [gap:zdx.diagnostics:live-vs-deep-trace]: settled by source-read or lab-test. Blocks: choosing between a live troubleshooting session and a deep trace, and finding a session's results

Area: zdx.diagnostics, its subjects in references/_meta/spine/zdx/zdx.diagnostics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.log-export.zdx.md (Getting ZDX data out: the ZDX API, its windows and delays)
- links-to references/_meta/text/zdx/zdx.applications.md (ZDX applications: predefined, custom and network applications, and the application API)
- links-to references/_meta/text/zdx/zdx.diagnostics.analysis.md (ZDX Score analysis jobs through the API: starting one, polling it, and what the clients return)
- links-to references/_meta/text/zdx/zdx.diagnostics.mcp-tools.md (The MCP server's ZDX deep-trace tools and troubleshooting prompt: inputs, results and mismatches)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-status.md (What a Diagnostics Session's status means, in the console and in the API)
- links-to references/_meta/text/zdx/zdx.diagnostics.session-types.md (The four Diagnostics session types in the console: Deep Tracing, Hi-Fi Cloud Path, Bandwidth Test and Packet Capture Probing)
- links-to references/_meta/text/zdx/zdx.diagnostics.start-request.md (Starting a deep trace through the API: the read chain, the request body, and where the clients disagree)
