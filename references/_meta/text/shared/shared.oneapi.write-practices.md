# Writing through OneAPI: fetch before update, activation, edit locks (shared.oneapi.write-practices)
Also called: oneapi best practices; EDIT_LOCK_NOT_AVAILABLE; 409 edit lock; fetch before update; activate after change oneapi; ecAdminActivateStatus activate; change did not take effect; do not edit in ui while script runs

The OneAPI guide's best practices are mostly about writes. Before updating a resource, send a GET and then the PUT or POST, because the update replaces the entire resource with the new values; this avoids overwriting changes by accident or missing updates made between the GET and the write. [shared.oneapi.write-practices:fetch-before-update] All endpoints should be called with UTF-8 encoding. [shared.oneapi.write-practices:utf8]

**Activation.** For ZIA and Cloud & Branch Connector, configuration changes must be explicitly activated, through /status/activate and /ecAdminActivateStatus/activate respectively. A change cannot be reverted and a queued activation cannot be cancelled; the guide recommends grouping several changes and activating once. [shared.oneapi.write-practices:activation-zia-cbc] How ZIA changes become live, and that ending a session can activate them, is in [How ZIA API changes become live: saving versus activating](kb:zia.api.activation). The Cloud & Branch Connector contract defines `/ecAdminActivateStatus/activate` as a PUT operation that activates configuration changes, beside a `forcedActivate` route. [shared.oneapi.write-practices:cbc-activate-put] The guide and the contract disagree on the method [divergence:shared.oneapi.write-practices:cbc-activate-method]. The OneAPI guide names an activation step only for ZIA and Cloud & Branch Connector. [shared.oneapi.write-practices:activation-named-for-two] Client Connector web policies have their own activate call ([`PUT /web/policy/activate` enables or disables a policy or app profile for a platform; its body is a `deviceType` and a `policyId`.](kb:zcc.api.web-policy-wire:activate)), and whether a ZPA write is live at once is open ([Whether a ZPA write is live without an activation call](kb:zpa.api.activation:write-takes-effect)). Whether ZDX, ZIdentity and Business Insights writes are live at once is open [gap:shared.oneapi.write-practices:other-products-no-activation].

**Edit locks and races.** To avoid race conditions, settings should not be changed manually in the admin console while scripts are running, because the service might lock a configuration while a user is editing. [shared.oneapi.write-practices:avoid-ui-edits] When several admins edit at once only one change succeeds and the others may receive 409 `EDIT_LOCK_NOT_AVAILABLE`; the vendor recommends waiting a few seconds and retrying. [shared.oneapi.write-practices:edit-lock-409] A tenant's single change lock and activation queue, and what that means for concurrent runs, are in [A tenant has a single configuration-change lock and a single activation queue, so plans can run in parallel (reads do not take the lock) but only one apply should run against a tenant at a time, with CI concurrency keyed on the tenant.](kb:zia.terraform.activation-methods:one-apply-per-tenant) and [A queued activation waits until every editing administrator or API session has activated and cannot be cancelled, so activating at the end of each configuration does not publish that configuration independently.](kb:zia.terraform.activation-methods:activation-queues).

**Token lifetime.** The access token lifetime is set per API client in Authentication Service, and the guide advises adjusting it to balance convenience and security. [shared.oneapi.write-practices:token-lifetime]

**Caching.** The Client Connector cache-busting argument is in [Zscaler's guidance is to prevent API call caching by adding a dummy argument with a randomly generated number to every request URL, for example `GET /getOtp?_=123456`.](kb:zcc.api.conventions:dummy-argument).

What to check:
1. For a ZIA or Cloud & Branch Connector change that did not take effect, whether it was activated, or whether the session it was made in ended (which activates on ZIA).
2. For a 409 EDIT_LOCK_NOT_AVAILABLE, whether an admin was editing in the UI or another script was writing to the same tenant at the time; the vendor's recovery is a wait of a few seconds and a retry.
3. Before an update that replaces a resource, whether the script read the current values with a GET first.

Inferred, not quoted (say so when an answer rests on one):
- [shared.oneapi.write-practices:activation-named-for-two] Tier B: Read of the guide's best-practice list and examples; the guide does not say that the other products need no activation.

Sources disagree (name both sides):
- Which HTTP method activates Cloud & Branch Connector changes: the OneAPI guide says a POST to /ecAdminActivateStatus/activate, while the contract defines only a PUT on that path and the legacy guide also says PUT. [divergence:shared.oneapi.write-practices:cbc-activate-method]
  - zscaler-help: A POST activates Cloud & Branch Connector changes.
  - api-specs: The path has a PUT operation and no POST.
  - zscaler-help: The legacy guide activates with a PUT.
  Impact: A hand-built client that follows the guide's POST may be refused on Cloud & Branch Connector and leave the changes inactive.

Not known (open gaps):
- Whether writes to ZDX, ZIdentity and Business Insights are live without activation [gap:shared.oneapi.write-practices:other-products-no-activation]: settled by lab-test or source-read. Blocks: telling an operator a write to these products is already live

Area: shared.oneapi, its subjects in references/_meta/spine/shared/shared.oneapi.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating): For ZIA and Cloud & Branch Connector, configuration changes must be explicitly activated, through /status/activate and /ecAdminActivateStatus/activate respectively. A change cannot be reverted and a queued activation cannot be cancelled; the guide recommends grouping several changes and activating once. [shared.oneapi.write-practices:activation-zia-cbc]
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
- links-to references/_meta/text/zcc/zcc.api.conventions.md (Conventions of the ZCC v1 API: casing, query parameters, caching, status codes)
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- links-to references/_meta/text/zpa/zpa.api.activation.md (Whether ZPA changes need an activation step)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.oneapi.response-codes.md (OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes)
