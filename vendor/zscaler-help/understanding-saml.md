# Understanding SAML

**Source:** https://help.zscaler.com/zia/understanding-saml
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399681, revision 3218436

---

Zscaler can deploy Identity Federation using Security Assertion Markup Language (SAML) for provisioning and authenticating users. Zscaler recommends deploying System for Cross-domain Identity Management (SCIM) for provisioning and SAML for authentication. This article provides an overview of using SAML for provisioning and authenticating users for the Zscaler service.
The Zscaler service supports SAML 2.0 and above. To learn how to configure SAML for your organization, see Configuring SAML.
SAML is an XML-based structure that is used to organize users’ security and identity information and to distribute this information across the organization’s boundaries to other entities. It enables the following entities to exchange identity, authentication, attribute, and authorization information:
- A principal, which is a user who is trying to access a service or application online
- A SAML authority, also referred to as the identity provider (IdP), that authenticates the user
- A relying party, which is the service provider (SP) that relies on the IdP to authenticate the user before it allows access to the service or application
SAML provides for a federated identity wherein partner services use the same name identifier to refer to a user. It also enables Single Sign-On (SSO) so users can authenticate only once to an IdP and then access various services.
SAML achieves this through a collection of assertions, protocols, bindings, and profiles:
- Assertions: A SAML authority creates statements regarding any of the following information:
  - The authentication of a subject
  - A subject’s attribute information
  - Data of a subject in regard to a specific resource
- Protocols: Request/response protocols allow the SPs to:
  - Request one or more assertions from a SAML authority
  - Request an IdP’s authentication for a principal and return the corresponding assertion
  - Request the registration of a name identifier
  - Request the termination of an identifier’s use
  - Get back a protocol message requested by means of an artifact
  - Request a single logout for a collection of related sessions
  - Request mapping of a name identifier
- Bindings: A binding defines how the SAML protocol messages are sent over transport and messaging protocols. The Zscaler service supports the HTTP Post Binding, which defines how SAML protocol messages can be transported within the base 64-encoded content of an HTML form control.
- Profiles: A profile defines the assertions, protocols, and bindings used for specific use cases.
To learn more about SAML, refer to OASIS Security Services (SAML) TC.
The service supports both SP-initiated and IdP-initiated SAML deployments, as well as SAML auto-provisioning.
# Service Provider-Initiated SAML
The most common deployment is the SP-initiated SAML deployment where the user tries to access a website and is redirected to the Zscaler service, which then sends a SAML request to the IdP. The IdP validates the user’s credentials, gets the user attributes like group membership, and returns the SAML response assertion to the Zscaler service through the user's browser. The diagram below shows the SP-initiated SAML process:
- A user opens a browser and tries to reach a website.
- The Zscaler service generates a SAML authentication request, which is encoded and embedded into the URL for the IdP.
- The service sends a redirect to the user's browser. It includes the encoded SAML authentication request to be submitted to the IdP.
- The user's browser submits the authentication request to the IdP.
- The IdP does the following:
  - Decodes the SAML request.
  - Extracts the URL for the Customer Assertion Service (CAS) of Zscaler.
  - Authenticates the user by login credentials or by checking for valid Active Directory session.
  - Generates a SAML response with digitally signed public/private DSA/RSA keys, encodes it, and sends it to browser.
- The browser forwards the SAML response to the service. The CAS of Zscaler uses the IdP's public key to verify the response.
- After the service successfully verifies the response, it logs in the user and redirects the user's browser to the destination URL.
# Identity Provider-Initiated SAML
In IdP-initiated SAML, a user can log in directly from an SSO provider's portal by clicking the Zscaler application icon. When the user clicks the Zscaler application icon, the IdP generates a SAML response that is posted to Zscaler at
https://login.<Zscaler Cloud Name>:443/sso_upd/<organization_id>. For example, if your organization is on the zscaler.net cloud, the SAML response is posted to Zscaler at https://login.zscaler.net:443/sso_upd/123456.
The service obtains the login name and optionally the group, department, and username from the SAML response. The SAML response must be 4 MB at the most. To ensure security and prevent man-in-the-middle attacks, the Zscaler service requires the SAML response to be digitally signed by the IdP. Also, if required by the IdP, the service can digitally sign its request.
# SAML Auto-Provisioning
You can enable SAML auto-provisioning to allow the service to automatically retrieve information related to users, groups, and departments from the SAML response and automatically add the information to the database. It can also automatically update a user's group membership based on the information retrieved from the SAML response. The SAML response must be 4 MB at the most.
- If the user doesn't exist in the database, the user is added in the database along with the group and the department values. This new user is activated, and all relevant policies are enforced.
- If the user exists in the database, the user display name, group, and department values in the SAML response are updated in the database.
- If the user display name, group, and department values don't exist in the SAML response, then these values are removed from the database too.
To learn more, see Configuring SAML.
