# The SAML attribute API, SDK and Terraform surface (zpa.saml-attributes.api-surface)
Also called: samlAttribute endpoint; saml-attr-controller; list saml attributes by idp; zpa_saml_attribute data source; samlName; add_saml_attribute
Former IDs: zpa-62

The SAML attribute API is documented as read-only, while the SDKs also write.

**Documented calls.** Zscaler's ZPA API overview says the SAML attribute API resources allow you to read SAML attributes. [zpa.saml-attributes.api-surface:docs-read-only] The documented SAML attribute calls are three GETs in the saml-attr-controller: one attribute by ID on the v1 path, all attributes by page on the v2 path, and all attributes of one IdP on the v2 IdP path. [zpa.saml-attributes.api-surface:read-endpoints] The captured API specification has no create, update or delete operation for SAML attributes: its three samlAttribute paths each define only a get. [zpa.saml-attributes.api-surface:spec-get-only]

**Writes.** The Python SDK's SAMLAttributesAPI sends a POST (add_saml_attribute), a PUT (update_saml_attribute) and a DELETE (delete_saml_attribute) against samlAttribute on the /zpa/mgmtconfig/v1 path, and the Go SDK's samlattribute package has Create, Update and Delete on the same v1 path. [zpa.saml-attributes.api-surface:sdks-write] The sources disagree on write support [divergence:zpa.saml-attributes.api-surface:write-support], and acceptance by ZPA is open [gap:zpa.saml-attributes.api-surface:write-accepted].

**Fields.** A SAML attribute object has name, samlName (a string of at most 128 characters), idpId, idpName, userAttribute (boolean) and delta (string) besides its ID and audit fields, and name, samlName and idpId are required. [zpa.saml-attributes.api-surface:model-fields] The samlName field holds the attribute name as the IdP sends it, while name is the console's reference label, so a script supplies the assertion attribute name in samlName. [zpa.saml-attributes.api-surface:saml-name-holds-assertion-name] The meaning of userAttribute and delta is open [gap:zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta]. The Python SDK's add_saml_attribute docstring describes saml_name as 'Whether to enable the cloud browser isolation banner', which is the description of a different feature's field. [zpa.saml-attributes.api-surface:docstring-wrong]

**Terraform data source.** The zpa_saml_attribute data source finds an attribute by listing the IdP's attributes and comparing name with ==, so the match is exact and case-sensitive. [zpa.saml-attributes.api-surface:data-source-exact-name] Whether it needs an IdP is disputed [divergence:zpa.saml-attributes.api-surface:data-source-idp-required].

Shared lookup and provider defects are in [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection) and [What ZPA Terraform data sources return, drop, or get wrong](kb:zpa.terraform.data-source-fidelity).

What to check:
1. Whether the task is a read of SAML attributes, which every source supports, or a write, which only the SDKs send.
2. Which path version a call uses: the v2 path lists, and the v1 path reads one attribute.
3. Which field carries the assertion attribute name when scripting.
4. Whether the Terraform lookup names the IdP and spells the attribute name exactly.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.saml-attributes.api-surface:spec-get-only] Tier B: Absence claim from a search: in zpa.openapi.json the paths containing samlAttribute are these three and each has only a get member; the OneAPI Postman collection's SAML Attribute Controller folder lists the same three GET requests.
- [zpa.saml-attributes.api-surface:saml-name-holds-assertion-name] Tier B: No source maps the console's SAML Attribute column to the samlName key by name; this follows from the console column definitions and the API example in which name and samlName differ.

Sources disagree (name both sides):
- Whether SAML attributes can be created, changed and deleted through the API. [divergence:zpa.saml-attributes.api-surface:write-support]
  - zscaler-help: The API resources for SAML attributes are for reading.
  - sdk-python: The Python SDK has an add operation that sends a POST to the samlAttribute path; it also has update and delete.
  Impact: Automation that mirrors the specification finds only reads; an SDK or provider that writes SAML attributes relies on endpoints the documentation does not list, and whether ZPA accepts them is not shown by the sources.
- Whether the zpa_saml_attribute data source needs an IdP name or ID. [divergence:zpa.saml-attributes.api-surface:data-source-idp-required]
  - tf-zpa: idp_name is marked Optional, and is required when more than one IdP is onboarded.
  - tf-zpa: The read errors when neither idp_id nor idp_name has a value, whatever the number of IdPs; idp_id is computed only, so a configuration cannot set it and the read fails unless idp_name is set.
  Impact: A configuration that omits idp_name on a single-IdP tenant, as the documentation allows, fails at read time.

Not known (open gaps):
- Whether ZPA accepts SAML attribute create, update and delete calls [gap:zpa.saml-attributes.api-surface:write-accepted]: settled by lab-test. Blocks: saying SAML attributes can be managed programmatically
- What the userAttribute and delta fields of a SAML attribute mean [gap:zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta]: settled by support-ticket or lab-test. Blocks: advising whether to set userAttribute when creating an attribute

Area: zpa.saml-attributes, its subjects in references/_meta/spine/zpa/zpa.saml-attributes.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.saml-attributes.registration.md (Registering SAML attributes in Private Access), from zpa.saml-attributes: SAML attributes must be configured in the Admin Console before they can be used as policy rule criteria. [zpa.saml-attributes.registration:configure-first]
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
