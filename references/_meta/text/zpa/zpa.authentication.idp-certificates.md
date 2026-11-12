# IdP certificates and service provider certificate rotation in Private Access (zpa.authentication.idp-certificates)
Also called: IdP certificate expiry; SP certificate rotation; User SP Certificate Rotation; Admin SP Certificate Rotation; User IdP Certificate Rotation; Admin IdP Certificate Rotation

Two certificates matter on an IdP configuration: the IdP's own certificate, uploaded to Private Access, and the service provider certificate used by the IdP. The IdP certificate is downloaded from the IdP and uploaded in base-64 encoded PEM format; its Common Name, Serial Number, Created On and Expired On are shown in the window and on the IdP Configuration page. [zpa.authentication.idp-certificates:idp-cert-format]

**Expiry.** The IdP Configuration page shows a red Warning icon for an expired IdP certificate, a yellow Caution icon with less than 7 days before expiration and an orange Info icon with less than 30 days. For a certificate chain the certificate expiring earliest decides the icon. [zpa.authentication.idp-certificates:expiry-icons] Updating an IdP certificate triggers an Authentication Error message in Client Connector and prevents access to apps until users reauthenticate in Client Connector. [zpa.authentication.idp-certificates:update-triggers-reauth]

**SP certificate rotation.** When Private Access retires its single sign-on certificate, the service provider certificate used by the IdP must be rotated so admins and end users keep access. The IdP configuration has an optional field to select a different service provider certificate, and the IdP's own configuration might also need updating. [zpa.authentication.idp-certificates:sp-rotation-why] The rotation field is named differently in the two articles [divergence:zpa.authentication.idp-certificates:rotation-field-name]. When Private Access retires its SSO certificate is open [gap:zpa.authentication.idp-certificates:retirement-timing].

**Methods.** If the original IdP configured is Okta, the IdP downloads the latest certificate from Private Access and rotates the account configuration automatically, and no further action is required. [zpa.authentication.idp-certificates:okta-automatic] The rotation page gives three methods: automatically through a metadata URL (the IdP updates when the configuration is saved), manually through a metadata URL (in ADFS the copied URL goes in the relying party's federation metadata URL field), and manually with metadata and certificate files (in ADFS the downloaded certificate is added on the Signature tab). In certain scenarios AD FS caches the expired certificate, so Zscaler recommends deleting expired certificates from the Relying Party Trusts panel after a successful update. [zpa.authentication.idp-certificates:three-methods]

The IdP configuration these certificates belong to is in [Configuring an IdP for Private Access single sign-on](kb:zpa.authentication.idp-configuration).

What to check:
1. Whether the IdP certificate on the configuration is near or past expiry, read from the icon on the IdP Configuration page and from the earliest-expiring certificate in a chain.
2. Whether an IdP certificate was just updated, since users then get an Authentication Error in Client Connector until they reauthenticate.
3. Which label the rotation field carries on the page in front of the admin, since the articles name it differently, and whether the original IdP is Okta.

Sources disagree (name both sides):
- The label of the field that selects a different service provider certificate on the IdP configuration. [divergence:zpa.authentication.idp-certificates:rotation-field-name]
  - zscaler-help: The field is User IdP Certificate Rotation, or Admin IdP Certificate Rotation when Single Sign-On is Admin.
  - zscaler-help: The field is User SP Certificate Rotation or Admin SP Certificate Rotation.
  Impact: A search or instruction using one label does not match the other article's wording; both describe the same selection of a different service provider certificate, but neither page says the labels name one field.

Not known (open gaps):
- When Private Access retires its SSO certificate and which certificates the rotation field offers [gap:zpa.authentication.idp-certificates:retirement-timing]: settled by support-ticket

Area: zpa.authentication, its subjects in references/_meta/spine/zpa/zpa.authentication.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.authentication.idp-configuration.md (Configuring an IdP for Private Access single sign-on)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.authentication.md (ZPA authentication: IdP configuration, authentication settings and user risk scores)
- see-also references/_meta/text/zcc/zcc.troubleshooting.private-access-auth-errors.md (Private Access authentication errors Client Connector users might see during enrollment: 2008 and the 42xxx codes the vendor lists)
