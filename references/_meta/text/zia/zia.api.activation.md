# How ZIA API changes become live: saving versus activating (zia.api.activation)
Also called: zia activation api; saved but not live; POST status activate; client.zia.activate; pending configuration api; ACTIVE PENDING INPROGRESS; what does ACTIVE mean; activation status meaning; force activate

The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status. [zia.api.activation:saved-not-live] The activation call is separate from the write, although ending a session can activate on its own [The ZIA platform activates pending changes on its own when a session ends, either because an API session reached the `api_session_timeout` or because an admin logged out; this applies to all API changes, including Terraform's.](kb:zia.terraform.activation-methods:session-end-autoactivation). The Terraform side of this is in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation), and the product-level lifecycle across ZIA and Cloud and Branch Connector is in [Which Zscaler products stage changes behind an activation](kb:shared.activation).

**Saved, not live.** [zia.api.activation:saved-not-live] GET /status reports the activation status of the saved configuration changes; activating them is the separate POST /status/activate. [zia.api.activation:status-is-a-report] The activation call returns a status of ACTIVE, PENDING or INPROGRESS. [zia.api.activation:status-values] A status of ACTIVE means nothing saved is waiting to be activated. It is a reading, not a mode: a write made while the status reads ACTIVE is still saved but not live until the next activation. [zia.api.activation:active-means-nothing-pending]

**In the Admin Portal.** The Admin Portal's Activation menu shows each admin's own status: no pending changes, Editing (saved but not activated), or Activation queued (activated, but held until the other editing admins activate theirs). [zia.api.activation:portal-activation-states] Force Activate immediately pushes all saved changes to the Central Authority, and only super admins and full admins can use it; a queued activation cannot be cancelled. [zia.api.activation:force-activate] The Terraform side of queueing is in [Activating ZIA changes from Terraform: methods, session end and concurrent applies](kb:zia.terraform.activation-methods).

**The calls.** The Python SDK's activation client reads the activation status with a GET to /status and activates configuration changes with a POST to /status/activate. [zia.api.activation:sdk-activation-endpoints] The OneAPI contract documents POST /status/activate as the call that activates saved configuration changes, and the OneAPI Getting Started guide says ZIA configuration changes must be explicitly activated with it. [zia.api.activation:oneapi-sample-activate] Which path the legacy guide names is in dispute [divergence:zia.api.activation:activate-path-differs]. The Python call names are in [Activation is `client.zia.activate`, an `ActivationAPI` with the methods `status`, `activate`, `get_eusa_status` and `update_eusa_status`.](kb:zia.sdk-python.client-errors-and-accessors:activation-accessor).

Whether a pending End User Subscription Agreement blocks activation is open [gap:zia.api.activation:eusa-precondition].

What to check:
1. Whether the activation status reads PENDING or INPROGRESS after a write, before looking for a platform fault.
2. Which activate path the client calls: the SDK and the OneAPI sample use POST /status/activate; the legacy PDF names POST /status.

Inferred, not quoted (say so when an answer rests on one):
- [zia.api.activation:active-means-nothing-pending] Tier B: No captured source defines each status value. This reads ACTIVE, PENDING and INPROGRESS against the Admin Portal's states (no pending changes, Editing, Activation queued) and the rule that every change is saved, not live, until activated. The Terraform resource's `status = "ACTIVE"` is a request to activate, not this reading (zia.terraform.activation-resource).

Sources disagree (name both sides):
- The legacy URL Categories guide says to activate by POSTing to /status, while the SDK and the OneAPI contract use POST /status/activate. [divergence:zia.api.activation:activate-path-differs]
  - zscaler-help: Activation is a POST request to /status.
  - sdk-python: Activation is a POST to /status/activate; GET /status only reads the status.
  - api-specs: The OneAPI contract activates with POST /status/activate.
  Impact: A client that follows the PDF literally and POSTs to /status would not call the endpoint the SDK uses; use the activate path.

Not known (open gaps):
- Whether EUSA acceptance gates activation [gap:zia.api.activation:eusa-precondition]: settled by lab-test or support-ticket. Blocks: diagnosing an activation that fails on a tenant with a pending EUSA
- How long a ZIA activation takes, and how often to poll it [gap:zia.api.activation:activation-duration]: settled by source-read
- What activation returns while changes are queued or invalid [gap:zia.api.activation:queue-and-invalid-states]: settled by source-read
- Whether any admin can activate another admin's pending ZIA changes [gap:zia.api.activation:any-admin-activates]: settled by source-read
- Whether pending ZIA changes can be discarded without activating them [gap:zia.api.activation:no-drop-pending]: settled by source-read

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- logged-in references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it): The Action filter's list of all potential values includes Activate, Forced Activate, Sign Out, and PAC file operations such as Create New PAC Version, Stage PAC Version and Change Deployed PAC Version. [zia.audit-logs.what-is-recorded:action-values]
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/zia/zia.sdk-python.client-errors-and-accessors.md (Python SDK errors, accessors and misspelled names on the ZIA client)
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)
