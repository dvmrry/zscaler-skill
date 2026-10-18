This page covers switching SCIM on for an identity provider, the endpoint and token it uses, and which accounts it can create. {{scim2-and-saml}}

**Where it is switched on.** {{enable-per-idp}} {{not-with-directory}} The org-wide migration switch behind that last step is [[zia.authentication.settings:scim-migration-flag]], and whether it can be undone is open in [[zia.authentication.settings]]. The SAML side that must be disabled for the same IdP is in [[zia.ad-integration.saml-auto-provisioning]].

**How the client reaches it.** {{base-url}} {{bearer-token}} The Go SDK takes its own SCIM token, see [[zia.scim.sdk-coverage]].

**Which accounts can be created.** {{domain-preregistered}} What a push for an unregistered domain returns is open {{gap:unregistered-domain-error}}.

**Which IdPs.** {{idp-guides}} {{other-idps}} Whether vendor guides exist for other IdPs is open {{gap:legacy-idp-list}}. How each IdP maps the department attribute is not in the captured guides, see [[zia.scim.attribute-mapping]].
