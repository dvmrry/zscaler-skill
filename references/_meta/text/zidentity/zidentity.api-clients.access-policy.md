# The API Client Access Policy: rules that allow or block a client's resources within time frames (zidentity.api-clients.access-policy)
Also called: api client access policy; api client access policy rule; restrict api client by time; api client source ip restriction; oneapi client time window

Beyond the resources a client holds, a tenant can limit when a client may use them. API client access policies determine an API client's access to specific API resources within set time frames; administrators define the rules and assign them to API clients. [zidentity.api-clients.access-policy:purpose]

**A rule.** A rule's criteria are Time (a repeating behavior, start and end date and time, and a time zone) and Resources (the API resources, that is the scope per Zscaler service); when both are set, the rule applies either one (Any) or both (All). [zidentity.api-clients.access-policy:criteria-time-resources] A rule's action is Allow or Block, and its status is Active or Expired. [zidentity.api-clients.access-policy:action-and-status] Only one policy rule can be assigned to an API client at a time. [zidentity.api-clients.access-policy:one-rule-per-client]

**Who and where.** Authentication Service administrators with Full permission on the API clients and API resources modules can configure a rule; rules are added under Administration > API > API Client Access Policy. [zidentity.api-clients.access-policy:full-permission] The contract has no access-policy operation, so rules are managed in the console only: [The contract has no operations for access tokens (listing or revoking them) or for API client access policy rules; those are managed only in the Admin Console as far as the captured sources show.](kb:zidentity.api:no-token-or-policy-paths).

**Changing rules.** Editing a rule that is assigned to an API client also updates that client's access token, and the client has to use a valid token. [zidentity.api-clients.access-policy:edit-updates-token] A rule cannot be deleted while any API client is associated with it. [zidentity.api-clients.access-policy:no-delete-while-assigned]

What to check:
1. For a client that fails only at certain times or for certain products, whether an access policy rule is assigned to it, and its criteria and action.
2. After a rule assigned to a client was edited, whether the client is using a newly issued token.

Area: zidentity.api-clients, its subjects in references/_meta/spine/zidentity/zidentity.api-clients.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zidentity/zidentity.api-clients.access-tokens.md (ZIdentity-issued access tokens: the Tokens page, when tokens are revoked, and who can revoke them): Editing a rule that is assigned to an API client also updates that client's access token, and the client has to use a valid token. [zidentity.api-clients.access-policy:edit-updates-token]
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zidentity.api-clients: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- depends-on references/_meta/text/zidentity/zidentity.admin-rbac.permissions.md (Authentication Service permission modules and levels, and the cross-module dependencies): Authentication Service administrators with Full permission on the API clients and API resources modules can configure a rule; rules are added under Administration > API > API Client Access Policy. [zidentity.api-clients.access-policy:full-permission]
- scoped-by references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime): Only one policy rule can be assigned to an API client at a time. [zidentity.api-clients.access-policy:one-rule-per-client]
- scoped-by references/_meta/text/zidentity/zidentity.resource-servers.md (ZIdentity resource servers (API resources): a read-only registry of the scopes API clients can select), from zidentity.api-clients: An API client's `clientResources` lists the resource servers it may reach and the scopes selected on each; the Go SDK says to resolve those resource and scope IDs with its resource servers package. [zidentity.resource-servers:clients-reference-resources]
- links-to references/_meta/text/zidentity/zidentity.api.md (The ZIdentity (Authentication Service) admin API from a client's side: route, coverage and wire notes)
