# When the Python SDK ends a ZIA session and what that does to staged changes (zia.sdk-python.activation-and-session)
Also called: context manager activates changes; with ZscalerClient activation; python sdk implicit activation; deauthenticate activates; password expiry zidentity

This is about when the Python SDK ends a ZIA session and what the platform then does with staged changes. The platform behavior is documented by the provider guide, and the SDK only decides when the session ends.

**Leaving a with block.** Leaving a `ZscalerClient` `with` block on the OneAPI client calls the executor's `deauthenticate` for a ZIA or ZTW session; for ZIA the code comment says it deauthenticates only if mutations occurred. [zia.sdk-python.activation-and-session:oneapi-exit-deauthenticates] The executor marks a session as mutated on any POST, PUT or DELETE, and skips the ZIA logout when none occurred; the code comment says ZIA requires the explicit logout to activate staged configurations. [zia.sdk-python.activation-and-session:deauth-only-after-mutation] The legacy ZIA client's context exit always calls `deauthenticate()`, which sends a DELETE to `/api/v1/authenticatedSession` and treats only a 204 as success; it does not check for earlier writes. [zia.sdk-python.activation-and-session:legacy-exit-always-logs-out]

**What the platform does.** A Python script that writes through a `with` client and then exits the block ends its ZIA API session, so the platform activates its pending changes without an explicit activate call. A script that only reads does not trigger that logout. [zia.sdk-python.activation-and-session:exit-can-activate] The platform behavior it rests on is [The ZIA platform activates pending changes on its own when a session ends, either because an API session reached the `api_session_timeout` or because an admin logged out; this applies to all API changes, including Terraform's.](kb:zia.terraform.activation-methods:session-end-autoactivation). The same behavior seen from a time-interval write is in [Time interval API operations, updates and activation](kb:zia.time-intervals.api-surface).

**Zidentity tenants.** The Python docstrings for the admin-role password-expiry get and update calls say the method is not compatible with Zidentity-enabled tenants, and the admin-user list docstring says the endpoint returns an empty list for tenants migrated to Zidentity. [zia.sdk-python.activation-and-session:password-expiry-zidentity] The current Python `update_password_expiry_settings` sends its PUT to `/passwordExpiry/settings`. [zia.sdk-python.activation-and-session:password-expiry-endpoint]

What to check:
1. Whether the script wrote anything before it exited, and which client type it used, when asked whether changes went live without an activate call.
2. Whether the tenant has been migrated to Zidentity before relying on the admin-role or admin-user calls.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-python.activation-and-session:exit-can-activate] Tier B: Holds when the logout DELETE succeeds (OneAPI `deauthenticate` treats only HTTP 200 as success and otherwise only logs a warning), for the OneAPI client with ZIA as the last service used; the legacy client logs out on every exit, so its with block ends the session whether or not it wrote.

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating): A Python script that writes through a `with` client and then exits the block ends its ZIA API session, so the platform activates its pending changes without an explicit activate call. A script that only reads does not trigger that logout. [zia.sdk-python.activation-and-session:exit-can-activate]
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
- links-to references/_meta/text/zia/zia.time-intervals.api-surface.md (Time interval API operations, updates and activation)
