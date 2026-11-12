# Whether ZPA changes need an activation step (zpa.api.activation)
Also called: zpa activation; no activation step zpa; zpa changes take effect immediately; zia_activation_status zpa

ZIA saves changes until they are activated; whether ZPA has an equivalent step is not stated by any source. See [How ZIA API changes become live: saving versus activating](kb:zia.api.activation) for the ZIA model.

**Open.** The earlier statement that ZPA writes take effect immediately is unverified [gap:zpa.api.activation:write-takes-effect].

What to check:
1. Before telling an operator no activation is needed, whether a tenant test confirms a ZPA write is live without any further call.

Not known (open gaps):
- Whether a ZPA write is live without an activation call [gap:zpa.api.activation:write-takes-effect]: settled by lab-test or support-ticket. Blocks: advising that a ZPA change is live immediately

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating)
