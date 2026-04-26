# About SAML Attributes

**Source:** https://help.zscaler.com/zpa/about-saml-attributes
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

You must configure SAML attributes to use them when defining policy rule criteria. For example, if you want to define users for your policies using email addresses, you must configure the users' email address SAML attribute in the Zscaler Admin Console. You can configure SAML attributes using one of the following methods:

- You can import your SAML attributes. This option requires that you generate a complete list of SAML attributes from your IdP, and then import that list into the Zscaler Admin Console. To learn more, see Importing SAML Attributes.
- You can manually add your SAML attributes. To learn more, see Manually Adding SAML Attributes.

In Private Access, various authorization attributes can be provided by the IdP to the Zscaler Client Connector in the SAML assertion, unlike Internet & SaaS, where SAML assertions are restricted to user identity, group, and department attributes. The SAML assertion is used with every application access attempt to ensure that only authenticated users gain access.

SAML attributes provide the following benefits and enable you to:

- Define policies for least privileged access.
- Define a streaming policy when configuring a log receiver.

Private Access does not use a hosted user database for provisioning, so user attributes within SAML assertions cannot be viewed within the Zscaler Admin Console. SAML assertions which contain these user attributes are encrypted and stored locally by Zscaler Client Connector.

## About the SAML Attributes Page

The SAML Attributes page is replaced by the Session Attributes page if you are subscribed to ZIdentity for users. To learn more, see What Is ZIdentity?

On the SAML Attributes page (Administration > Identity > Private Access > Session Attributes), you can do the following:

- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to show the filters.
- Refresh the SAML Attributes page to reflect the most current information.
- Filter the information that appears in the table to show attributes for a specific IdP. You can also save applied filters to your preferences so that they're visible in future user sessions.

The ability to filter the list to show attributes for a specific IdP is hidden if you are subscribed to ZIdentity for users.

- Add new SAML attributes by importing the attributes or adding them manually.

The Add SAML Attribute button is hidden if you are subscribed to ZIdentity for users. To learn more, see What Is ZIdentity?

- View a list of SAML attributes that were imported or added. For each attribute, you can see:
  - Name: The name specified for the attribute within the Zscaler Admin Console when it was imported or added. This name is only for reference and might not be identical to the corresponding entry in the SAML Attribute column.
  - SAML Attribute or Session Attribute: The SAML attribute as it is specified in the IdP. If you are subscribed to ZIdentity for users, then the SAML Attribute column is replaced with the Session Attribute column. To learn more, see What Is ZIdentity?
  - IdP Name: The name of the IdP configuration in the Zscaler Admin Console. This is the IdP where the attribute was imported or added from.
- Modify the columns displayed in the table.
- Edit an existing SAML attribute.

The Edit button is hidden if you are subscribed to ZIdentity for users.

- Delete a SAML attribute.

The Delete button is hidden if you are subscribed to ZIdentity for users.

- Display more rows or a different page of the table.
