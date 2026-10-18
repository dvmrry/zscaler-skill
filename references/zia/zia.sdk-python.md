This walks the subjects that describe how the Python SDK calls ZIA. Which module and method reaches which API path is generated: run `node scripts/kb.mjs surface <module or method>`.

**The client.** Authentication is in [[zia.sdk-python.authentication]], what calls return in [[zia.sdk-python.response-shape]], errors and accessor names in [[zia.sdk-python.client-errors-and-accessors]], and when a session ends in [[zia.sdk-python.activation-and-session]].

**Requests.** How requests are built, paged and retried is in [[zia.sdk-python.request-conventions]] and [[zia.sdk-python.pagination]]. Which services each SDK covers is in [[zia.api.sdk-coverage]].

**Service-specific behavior.** [[zia.sdk-python.pac-files]], [[zia.sdk-python.sandbox-client]], [[zia.sdk-python.security-policy-url-lists]], [[zia.sdk-python.audit-logs-client]] and [[zia.sdk-python.service-behaviors]].
