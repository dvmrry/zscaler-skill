# Deception and ITDR API tokens: OpenAPI scope, token fields, expiry and one-time display (deception.api-tokens)
Also called: itdr api tokens; deception api tokens; api token management; orchestrate api tokens

This subject covers the Deception and Identity Protection (ITDR) API token pages ([Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated](kb:deception.overview), [Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview)). Deception supports the OpenAPI specification for the Orchestrate, Miragemaker, Deceive, Landmine, Investigate and Settings features, and API tokens allow decoys to be configured and deployed, event logs and evidence managed, and Miragemaker datasets and personalities configured programmatically. [deception.api-tokens:openapi-features] ITDR supports the OpenAPI specification for the Endpoint Agents, Threat Detection, Orchestrate, Investigate and Settings features, and API tokens allow event logs to be managed, threat detection policies configured and rules orchestrated programmatically. [deception.api-tokens:itdr-openapi-features]

**Token fields.** The API Tokens page lists each token's Name, Description, Roles (the role assigned), Created By (the ID of the creating user), Created On, Enabled and Status (active or expired). [deception.api-tokens:token-list-columns] An API token is created with Enabled, Name, Description, a Roles selection and an Expiration in days. [deception.api-tokens:token-create-fields]

**Expiry and display.** The expiration period cannot be modified after the token is created and cannot be edited later; a new token must be created after it expires. [deception.api-tokens:token-expiry-fixed] The generated API token is shown once in the API Token generated window and cannot be retrieved after the window is closed. [deception.api-tokens:token-shown-once]

What to check:
1. For a token that has stopped working, the token's Status (active or expired) and its Enabled setting.
2. For an expired token, that the expiration period cannot be edited and a new token must be created.

Area: deception.api-tokens, its subjects in references/_meta/spine/deception/deception.api-tokens.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/deception/deception.overview.md (Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/deception/deception.orchestration-rules.md (Deception and ITDR orchestration rules: the Orchestrate menu, rule pipeline, actions, testing, pausing and event notification templates)
