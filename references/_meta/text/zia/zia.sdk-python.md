# The Zscaler Python SDK against ZIA: where its behavior is described (zia.sdk-python)
Also called: zscaler python sdk; zscaler-sdk-python zia; python sdk zia

This walks the subjects that describe how the Python SDK calls ZIA. Which module and method reaches which API path is generated: run `node scripts/kb.mjs surface <module or method>`.

**The client.** Authentication is in [How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy](kb:zia.sdk-python.authentication), what calls return in [What the Python SDK returns: result, response and error, and why try/except misses API errors](kb:zia.sdk-python.response-shape), errors and accessor names in [Python SDK errors, accessors and misspelled names on the ZIA client](kb:zia.sdk-python.client-errors-and-accessors), and when a session ends in [When the Python SDK ends a ZIA session and what that does to staged changes](kb:zia.sdk-python.activation-and-session).

**Requests.** How requests are built, paged and retried is in [How the Python SDK builds, pages and retries ZIA requests](kb:zia.sdk-python.request-conventions) and [Paging through ZIA lists with the Python SDK](kb:zia.sdk-python.pagination). Which services each SDK covers is in [Which ZIA services the Go and Python SDKs cover, and where](kb:zia.api.sdk-coverage).

**Service-specific behavior.** [How the SDKs call the PAC file endpoints: clone, validate and version actions](kb:zia.sdk-python.pac-files), [How the Python SDK reaches the sandbox submission host](kb:zia.sdk-python.sandbox-client), [How the Python SDK edits the security allowlist and denylist](kb:zia.sdk-python.security-policy-url-lists), [How the Python SDK audit log report calls return results and fail](kb:zia.sdk-python.audit-logs-client) and [Python SDK service-specific behavior for ZIA: admin, AppTotal, browser control, smart isolation and GRE tunnel VIPs](kb:zia.sdk-python.service-behaviors).

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.api.sdk-coverage.md (Which ZIA services the Go and Python SDKs cover, and where)
- links-to references/_meta/text/zia/zia.sdk-python.activation-and-session.md (When the Python SDK ends a ZIA session and what that does to staged changes)
- links-to references/_meta/text/zia/zia.sdk-python.audit-logs-client.md (How the Python SDK audit log report calls return results and fail)
- links-to references/_meta/text/zia/zia.sdk-python.authentication.md (How the Python SDK authenticates to ZIA: OneAPI, government clouds and legacy)
- links-to references/_meta/text/zia/zia.sdk-python.client-errors-and-accessors.md (Python SDK errors, accessors and misspelled names on the ZIA client)
- links-to references/_meta/text/zia/zia.sdk-python.pac-files.md (How the SDKs call the PAC file endpoints: clone, validate and version actions)
- links-to references/_meta/text/zia/zia.sdk-python.pagination.md (Paging through ZIA lists with the Python SDK)
- links-to references/_meta/text/zia/zia.sdk-python.request-conventions.md (How the Python SDK builds, pages and retries ZIA requests)
- links-to references/_meta/text/zia/zia.sdk-python.response-shape.md (What the Python SDK returns: result, response and error, and why try/except misses API errors)
- links-to references/_meta/text/zia/zia.sdk-python.sandbox-client.md (How the Python SDK reaches the sandbox submission host)
- links-to references/_meta/text/zia/zia.sdk-python.security-policy-url-lists.md (How the Python SDK edits the security allowlist and denylist)
- links-to references/_meta/text/zia/zia.sdk-python.service-behaviors.md (Python SDK service-specific behavior for ZIA: admin, AppTotal, browser control, smart isolation and GRE tunnel VIPs)
