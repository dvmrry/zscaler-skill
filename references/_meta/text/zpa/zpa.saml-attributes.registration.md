# Registering SAML attributes in Private Access (zpa.saml-attributes.registration)
Also called: saml attribute import; add saml attribute; saml attribute limit; session attributes; saml attribute name vs saml name; saml assertion not visible

This subject covers registering SAML attributes in Private Access. SAML attributes must be configured in the Admin Console before they can be used as policy rule criteria. [zpa.saml-attributes.registration:configure-first]

**Where attributes come from.** In Private Access the IdP can provide various authorization attributes to Zscaler Client Connector in the SAML assertion, whereas in Internet & SaaS the assertion is restricted to user identity, group and department attributes. [zpa.saml-attributes.registration:arbitrary-attributes] The SAML assertion is used with every application access attempt to ensure that only authenticated users gain access. [zpa.saml-attributes.registration:assertion-each-access] Private Access has no hosted user database for provisioning, so user attributes inside SAML assertions cannot be viewed in the Admin Console: the assertions are encrypted and stored locally by Zscaler Client Connector. [zpa.saml-attributes.registration:no-hosted-user-db]

**Adding attributes.** SAML attributes are added either by importing a complete list generated from the IdP, or by adding them manually. [zpa.saml-attributes.registration:two-methods] Import starts from the IdP's expanded configuration on the IdP Configuration page and redirects to the IdP's login page; after login the Import SAML Attributes page shows only new attributes that can be imported, plus the SAML JSON from the IdP. The names entered there are only for reference and need not be identical to the SAML Attribute Name entry. [zpa.saml-attributes.registration:import-behavior] A manually added attribute takes a Name that cannot contain special characters other than periods, hyphens and underscores; a SAML Attribute, the corresponding SAML attribute name (for example Group or Email Address) as found in the IdP's SAML JSON; and an IdP Configuration chosen from a drop-down menu. [zpa.saml-attributes.registration:manual-fields] Each registered attribute has a Name, which is only a reference and might differ from the SAML Attribute entry; a SAML Attribute, which is the attribute as specified in the IdP; and an IdP Name, the IdP configuration in the Admin Console where it was imported or added. [zpa.saml-attributes.registration:table-fields] Editing cannot change an attribute's selected IdP Configuration; to adjust the attribute for another IdP configuration it must be imported or added again for that IdP. [zpa.saml-attributes.registration:idp-fixed] Whether the registered name must match the assertion exactly, including case, is open [gap:zpa.saml-attributes.registration:name-match-exactness].

**Limit.** The Private Access ranges and limitations list 100 SAML attributes under Authentication, the import page says up to 100 SAML attributes, and the manual-add page says up to 100 attributes in total. [zpa.saml-attributes.registration:limit] The earlier open question on the limit is closed [gap:zpa.saml-attributes.registration:zpa-61-limit].

**Authentication Service.** With a subscription to Authentication Service for users, the SAML Attributes page is replaced by the Session Attributes page: the SAML Attribute column becomes Session Attribute, and the Add SAML Attribute button, the Edit and Delete buttons, and the filter by IdP are hidden. [zpa.saml-attributes.registration:auth-service-replaces-page] What happens to existing SAML criteria on that move is open [gap:zpa.saml-attributes.registration:migration-continuity].

How registered attributes are used in a rule is in [How SAML attributes act as policy criteria](kb:zpa.saml-attributes.policy-criteria); the API view is in [The SAML attribute API, SDK and Terraform surface](kb:zpa.saml-attributes.api-surface).

What to check:
1. Whether the tenant is subscribed to Authentication Service for users, which hides the add, edit and delete controls and the IdP filter and renames the column.
2. Which IdP configuration the attribute is registered under, and what its Name and SAML Attribute entries say.
3. Whether the number of registered attributes is near the listed limit.
4. Whether the value a user's assertion carries can be seen from the console; it cannot, so the evidence lies elsewhere.
5. Whether a mismatch of spelling or case between the registered attribute and the assertion is being assumed.

Not known (open gaps):
- Whether the registered SAML Attribute must match the assertion exactly, and whether case matters [gap:zpa.saml-attributes.registration:name-match-exactness]: settled by lab-test. Blocks: saying that a case or spelling mismatch is why a SAML criterion never matches
- What happens to SAML criteria in existing rules when a tenant moves to Authentication Service for users [gap:zpa.saml-attributes.registration:migration-continuity]: settled by support-ticket or lab-test. Blocks: promising that rules survive the move

Area: zpa.saml-attributes, its subjects in references/_meta/spine/zpa/zpa.saml-attributes.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.saml-attributes.api-surface.md (The SAML attribute API, SDK and Terraform surface)
- links-to references/_meta/text/zpa/zpa.saml-attributes.policy-criteria.md (How SAML attributes act as policy criteria)
