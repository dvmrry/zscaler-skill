# Client Connector logs: verbosity, user access and collection (zcc.logging)
Also called: zcc logging; client connector logs; zcc log controls; zcc diagnostic logs

Client Connector writes its own logs on the device, and three separate settings decide how much it writes, what the user may do with them, and how they reach support.

1. **How much is written.** Log modes and file size per app profile: [Client Connector log modes as users and the API see them: Verbose, user choice, logMode and logLevel](kb:zcc.logging.log-modes).
2. **What the user can do with the logs.** The logging controls and the export format: [What users can do with Client Connector logs: logging controls and readable exports](kb:zcc.logging.user-access).
3. **How logs reach support.** Report an Issue, Fetch Logs, packet captures and file locations: [Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures](kb:zcc.logging.collection).
4. **What is in them.** [What the Client Connector log on the device records](kb:zcc.logs.client-log) and, for traffic flows on Windows, [Client Connector flow logging on Windows](kb:zcc.logs.flow-logging).

**Cloud logs are separate.** The client's logging settings govern how the app generates logs and what users may do with them; no source ties ZIA or ZPA cloud logging to them, so hiding or reducing client logs does not imply less cloud logging. [zcc.logging:cloud-logs-independent] Transaction records live in [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records) and [What a ZPA User Activity log record says and does not say](kb:zpa.logs.user-activity).

What to check:
1. For a question about what a user did on the web or which rule acted, go to the ZIA or ZPA logs, not the client log.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.logging:cloud-logs-independent] Tier B: Rests on absence: the logging-control and app-profile articles describe only the app's own logs, and no captured source links them to ZIA or ZPA log generation.

Area: zcc.logging, its subjects in references/_meta/spine/zcc/zcc.logging.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.logging.collection.md (Getting Client Connector logs to support: Report an Issue, Fetch Logs, packet captures)
- links-to references/_meta/text/zcc/zcc.logging.log-modes.md (Client Connector log modes as users and the API see them: Verbose, user choice, logMode and logLevel)
- links-to references/_meta/text/zcc/zcc.logging.user-access.md (What users can do with Client Connector logs: logging controls and readable exports)
- links-to references/_meta/text/zcc/zcc.logs.client-log.md (What the Client Connector log on the device records)
- links-to references/_meta/text/zcc/zcc.logs.flow-logging.md (Client Connector flow logging on Windows)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)
