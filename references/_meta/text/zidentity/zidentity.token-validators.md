# Token validators: JWT claim and signature checks for access to a Zscaler service (the page's example is Internet & SaaS), and the Test Token decoder (zidentity.token-validators)
Also called: token validator; Token Validators module; Test Token; Client JWKs URL

A token validator tells Authentication Service which JSON Web Tokens to accept. Token validators validate JSON Web Tokens: a token must contain values that match a validator's configuration to gain access to a Zscaler service such as Internet & SaaS (ZIA). Validators are created in the Admin Console and used for authorization. [zidentity.token-validators:what-it-is] Token validators require Internet & SaaS and Private Access (ZPA) tenants to be provisioned in Authentication Service. [zidentity.token-validators:prerequisite]

**Type and use.** A validator's Type is the token type it accepts for the authorization request, and Authentication Service currently supports only JWT. [zidentity.token-validators:jwt-only] A token validator is used in Internet & SaaS: during authorization requests, Internet & SaaS can verify the user's identity using the claims configured in Authentication Service. [zidentity.token-validators:used-in-zia] What the audience is, which ZIA feature consumes a validator, and any ZPA use are open [gap:zidentity.token-validators:audience-and-consumers].

**Configuring one.** Configuring a token validator needs Full permission on the Token Validators module. [zidentity.token-validators:configure-permission] A validator's claim requirements, checked at the time of the authorization request, are a read-only Audience (copyable), a Subject Claim representing the user's identity, Claim Iss (the IdP's issuer URI) and any added claims; a manually added audience claim takes precedence over the displayed Audience. [zidentity.token-validators:claim-requirements] A tenant can have several token validators, but not two with the same issuer. [zidentity.token-validators:unique-issuer] Under Signature Validation an admin selects and configures any of the following validation types: a Client JWKs URL, where the keys for verification are obtained, and uploaded certificates and public keys in Base64-encoded PEM format with a .pem extension and no other periods in the file name; several certificate and public key files can be uploaded. [zidentity.token-validators:signature-validation] The number of validators and the signing algorithms a validator accepts are open [gap:zidentity.token-validators:limits-and-algorithms].

**Testing a token.** Test Token decodes a pasted JWT before it is used: the Decoded section shows the matching token validator, the header (algorithm, RS256 or ES256, and token type JWT), the payload claims and the signature. Admins with Full or View Only on the Token Validators module can test a token. [zidentity.token-validators:test-token]

**Logs.** Where the token validator logs the About page lists as a benefit are found is open [gap:zidentity.token-validators:validator-logs].

What to check:
1. Whether the tenant has two validators with the same issuer, which it cannot, and whether the token carries the claims the validator requires.
2. Whether the admin has Full on the Token Validators module to configure, or Full or View Only to test.

Not known (open gaps):
- What the audience value is, which ZIA feature consumes a validator, and any ZPA use [gap:zidentity.token-validators:audience-and-consumers]: settled by source-read or lab-test. Blocks: configuring the IdP's token to match a validator
- How many validators a tenant can have and which signing algorithms they accept [gap:zidentity.token-validators:limits-and-algorithms]: settled by source-read or lab-test. Blocks: planning validators for several IdPs and choosing a signing algorithm
- Where token validator logs are found [gap:zidentity.token-validators:validator-logs]: settled by source-read or lab-test. Blocks: finding why a token was rejected

Area: zidentity.token-validators, its subjects in references/_meta/spine/zidentity/zidentity.token-validators.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
- see-also references/_meta/text/zidentity/zidentity.api-clients.access-tokens.md (ZIdentity-issued access tokens: the Tokens page, when tokens are revoked, and who can revoke them)
- see-also references/_meta/text/zidentity/zidentity.admin-rbac.permissions.md (Authentication Service permission modules and levels, and the cross-module dependencies)
