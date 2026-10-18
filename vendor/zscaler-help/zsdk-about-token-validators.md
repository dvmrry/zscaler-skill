# About Token Validators

**Source:** https://help.zscaler.com/zsdk/about-token-validators
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1507651, revision 3222124

---

ZSDK uses token validators to inspect and validate JSON Web Tokens (JWTs) issued by your identity provider (IdP). During validation, ZSDK verifies token validity, signing certificate authenticity, and required token claims (e.g., subject, issuer, and audience).
Token validators provide the following benefits and enable you to:
- Enforce Zero Trust Network Access (ZTNA) by validating user identity prior to granting access.
- Establish secure communication channels only after successful token validation.
# About the Token Validator Page
On the Token Validator page (Authentication > User Authentication > Token Validator), you can do the following:
- Filter by Name.
- Refresh the page.
- Add a token validator.
- View a list of token validators. For each token validator, you can see:
  - Name: The name of the token validator.
  - Access Type: The type of apps (Mobile Apps or Browser Access).
  - Validation Type: The validation type (Client JWKS URL or Certificates and Public Keys).
  - Actions: The available actions for the token validator.
- Customize the columns you want to display.
- Update a token validator.
- Delete a token validator.
- Go to the IdP Configuration page to view your IdP information.
