Most "SCIM does nothing" cases are setup, so check these before looking at attributes. {{scim2-and-saml}}

**Where it is switched on.** {{enable-per-idp}} {{not-with-directory}} The org-wide migration switch behind that last step is [[zia.authentication.settings:scim-migration-flag]], and whether it can be undone is open in [[zia.authentication.settings]]. The SAML side that must be disabled for the same IdP is in [[zia.ad-integration.saml-auto-provisioning]].

**How the client reaches it.** {{base-url}} {{bearer-token}} The token is issued per IdP in the SCIM settings. The Go SDK takes its own SCIM token, see [[zia.scim.sdk-coverage]].

**Which accounts can be created.** {{domain-preregistered}}

**Which IdPs.** {{idp-guides}} {{other-idps}} How each IdP maps the department attribute is not in the captured guides, see [[zia.scim.attribute-mapping]].

What to check: the IdP's SCIM switch and base URL in the Admin Console, whether the token was regenerated without updating the IdP, whether SAML auto-provisioning is off for that IdP, and whether the user's domain is registered.
