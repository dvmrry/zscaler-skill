# Reading Cloud & Branch Connector activation status (shared.activation.cbc)
Also called: ecAdminActivateStatus status; orgEditStatus; adminActivateStatus; cbc activation pending; ztw activation status

Cloud & Branch Connector stages changes like ZIA, but its status read does not answer in ZIA's terms. The activate calls themselves are in [Cloud Connector activation on the wire: activate, forced activate, and what the clients send](kb:cloud-connector.api.activation-wire).

**Reading the status.** The Cloud & Branch Connector status read does not return ZIA's ACTIVE, PENDING or INPROGRESS: it returns an organization policy edit status (EDITS_CLEARED, EDITS_PRESENT or EDITS_ACTIVATED_ON_RESTART), the organization's last activation status, an admin activation status (ADM_LOGGED_IN through ADM_EXPIRED) and a per-admin status map, so a pending-change check reads the edit status instead. [shared.activation.cbc:no-zia-status-vocabulary] What each status value means is not documented [gap:shared.activation.cbc:status-meanings].

**Activation nobody triggered.** Whether Cloud & Branch Connector also activates on its own, as ZIA does when a session ends, is only partly settled [gap:shared.activation.cbc:session-autoactivation]. The Python SDK says a ZTW session, like ZIA's, needs an explicit logout to activate staged configurations: [The SDK's code comment and its 1.5.9 changelog say ZTW, like ZIA, needs this explicit logout to activate staged configurations, and that the context-manager logout ensures staged configurations are activated on exit.](kb:cloud-connector.sdk-python.client-configuration:sdk-says-logout-activates). The ZIA behavior is [The ZIA platform activates pending changes on its own when a session ends, either because an API session reached the `api_session_timeout` or because an admin logged out; this applies to all API changes, including Terraform's.](kb:zia.terraform.activation-methods:session-end-autoactivation).

What to check:
1. Whether orgEditStatus shows edits present, and which admins' states in adminStatusMap are not done, rather than looking for PENDING.
2. Whether the last activation status names a timer or autosync activation when changes went live without an activate call.

Inferred, not quoted (say so when an answer rests on one):
- [shared.activation.cbc:no-zia-status-vocabulary] Tier B: The value lists come from the specification's enums; that EDITS_PRESENT is the pending state is read from the names, which no source defines (gap status-meanings).

Not known (open gaps):
- What the Cloud & Branch Connector activation status values mean [gap:shared.activation.cbc:status-meanings]: settled by lab-test or support-ticket. Blocks: telling from a status read whether Cloud & Branch Connector changes are still pending
- Whether Cloud & Branch Connector activates pending changes on its own [gap:shared.activation.cbc:session-autoactivation]: settled by lab-test or support-ticket. Blocks: predicting whether staged Cloud & Branch Connector changes go live without an activate call

Area: shared.activation, its subjects in references/_meta/spine/shared/shared.activation.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/shared/shared.oneapi.response-codes.md (OneAPI status codes, ZIA maintenance read-only mode, and 403 and 409 causes), from shared.activation: When a ZIA call fails because of an upgrade or scheduled maintenance of the API service, it returns 403 with the header `x-zscaler-mode: read-only` and a body whose code is `STATE_READONLY`; during that period the API service supports only read operations via GET. [shared.oneapi.response-codes:read-only-mode]
- interacts-with references/_meta/text/shared/shared.oneapi.write-practices.md (Writing through OneAPI: fetch before update, activation, edit locks), from shared.activation: When several admins edit at once only one change succeeds and the others may receive 409 `EDIT_LOCK_NOT_AVAILABLE`; the vendor recommends waiting a few seconds and retrying. [shared.oneapi.write-practices:edit-lock-409]
- links-to references/_meta/text/cloud-connector/cloud-connector.api.activation-wire.md (Cloud Connector activation on the wire: activate, forced activate, and what the clients send)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.client-configuration.md (The Python SDK against Cloud and Branch Connector: legacy client settings and session logout on exit)
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
