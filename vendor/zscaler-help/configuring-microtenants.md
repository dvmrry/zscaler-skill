# Configuring Microtenants

**Source:** https://help.zscaler.com/zpa/configuring-microtenants
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485686, revision 3239338

---

Within the Zscaler Admin Console, you can add Microtenants. For a complete list of ranges and limitations for Microtenants, see Ranges & Limitations.
To add a Microtenant:
- Go to Private Access > B2B Exchange > Microtenants.
- Click Add.
The Add Microtenant drawer appears.
- In the Add Microtenant drawer:
- Name: Enter a name for the Microtenant. The name cannot contain special characters, with the exception of periods (.), hyphens (-) and underscores (_).
- Status: Enable the Microtenant. By default, this is disabled.
- The following caveats apply to the status of a Microtenant
  - Users mapped to Microtenants that are using Private Service Edges for Private Access (ZPA) reauthenticate when the Microtenant is disabled.
  - Users that are mapped to a Microtenant are reassigned to the Default Microtenant when the Microtenant is disabled.
  - Active sessions for the Microtenant are terminated when the Microtenant is disabled.
- Description: (Optional) Enter a description for the Microtenant.
- Privileged Approvals: Enable to allow users who don’t have Authentication Domain-related access the ability to access the Microtenant within a privileged console. Users without the Authentication Domain access only have access to Microtenants and privileged consoles assigned to them. After you enable Privileged Approvals for a Microtenant, you need to configure a privileged approval for that Microtenant to provide users without Authentication Domain access. By default, this is disabled.
- The Privileged Approvals drop-down menu is not visible if you are subscribed to Authentication Service and have this feature enabled for your tenant. To learn more, see What Is Authentication Service?
- For Criteria:
  - Authentication Domain: Select the available authentication domains from the drop-down menu. You can search for a specific authentication domain, click Clear All to remove all selections, or click the Delete icon () next to the selected authentication domain to remove it. End users that are authenticated to Private Access with the selected authentication domains are mapped to their relevant Microtenant. Private Access maps Microtenants that are at the top of the list first compared to Microtenants that are at the bottom of the list.
  - External IAM IdPs: Select the unique, system-generated identifier used by the Identity and Access Management (IAM) system for the IdP. This criteria is the external IdP attribute configured in Service Edge and is only supported for IdPs created in Authentication Service.
  - SAML and SCIM Attributes: To use SAML or SCIM criteria:
    - Click Select IdP and choose the identity provider (IdP) configuration you want to include in the Microtenant. The IdP must be configured for User SSO. To learn more, see Configuring an IdP for Single Sign-On. If you need to include multiple IdPs in the Microtenant, click Select IdP again.
    - Click Select a SAML or SCIM criteria to add the criteria that apply to this Microtenant:
      - SAML Attributes or Session Attributes
      - Choose a specific SAML attribute from the drop-down menu if you want to apply the Microtenant to specific users, groups, departments, etc.:
        - You can search for a specific attribute, select a listed attribute, or click the Delete icon to remove the individual attributes.
        - After you make a selection, enter the SAML attribute value (i.e., the users to whom the Microtenant applies) in the text field that appears.
        - Click Add More to add multiple attributes, if necessary.
      - If you are subscribed to Authentication Service and have this feature enabled for your tenant, the SAML Attributes option is replaced with Session Attributes. The user attributes are populated from the Zscaler Admin Console and are used for defining various sign-on policies. To learn more, see About Attributes and What Is Authentication Service?
      - SCIM User Attributes or User Attributes
      - Choose a specific SCIM attribute from the drop-down menu to apply the rule action to specific users, groups, departments, etc.:
        - You can search for a specific attribute, select a listed attribute, or click the Delete icon to remove the individual attributes.
        - After you make a selection, enter the SCIM attribute value (i.e., the users to whom the rule applies) in the text field that appears.
        - Click Add More to add multiple attributes, if necessary.
      - If you are subscribed to Authentication Service and have this feature enabled for your tenant, the SCIM Attributes option is replaced with User Attributes. The group attributes are populated from the Zscaler Admin Console and are used for defining various sign-on policies. To learn more, see About Attributes and What Is Authentication Service?
      - SCIM Group Attributes
      - Choose a specific SCIM group from the drop-down menu to apply the Microtenant to a specific group:
        - You can search for a specific group, select a listed group, or click the Delete icon to remove the individual groups.
        - Click Add More to add multiple groups, if necessary.
    - These criteria appear under SAML and SCIM Attributes > <IdP Name>, where <IdP Name> is the name of the IdP configuration you selected in step a.
    - SAML and SCIM attributes for Microtenants are in limited availability. Existing users must reauthenticate or reconnect to the Zscaler cloud in order to use this feature. To learn more, contact Zscaler Support.
  - If you add multiple attributes or groups to the Microtenant, an OR Boolean operator is used between them by default. For example, if you selected First Name and Last Name, the Microtenant is only applied to users with the specified First Name OR Last Name for that IdP. However, you can toggle this to an AND operator by clicking on it.
If the corresponding IdP setting (i.e., SAML Attributes for Policy) is disabled for SAML, but the policy rule has criteria for SAML attributes, the Microtenant is evaluated differently depending on the Boolean operator between the criteria:
- OR: Private Access skips evaluating the criteria for SAML attributes, but continues to evaluate the criteria for SCIM attributes and SCIM groups.
- AND: Private Access does not evaluate this Microtenant. You must remove the criteria under SAML Attributes for Private Access to process the Microtenant.
If the corresponding IdP setting (i.e., SCIM Attributes for Policy) is disabled for SCIM, but the Microtenant has criteria for SCIM attributes or SCIM groups, the Microtenant is evaluated differently depending on the Boolean operator between the criteria:
- OR: Private Access skips evaluating the criteria for SCIM attributes and SCIM groups, but continues to evaluate the criteria for SCIM attributes and SAML attributes.
- AND: Private Access does not evaluate this Microtenant. You must remove the criteria for SCIM attributes and SCIM groups for Private Access to process the Microtenant.
If you selected multiple IdPs for the Microtenant, Private Access uses an OR Boolean operator between them by default. For example, you can select one IdP that includes First Name or Last Name, and another IdP that includes Any SAML Attribute. In this case, the Microtenant applies to a user authenticating from the first IdP if they have the specified First Name or Last Name, or it applies to any user authenticating from the second IdP. However, you can toggle this to an AND operator by clicking on it.
See image.
If your IdP configuration for SSO includes SAML attributes or SCIM attributes from multiple IdPs, Zscaler recommends that you do not use the AND Boolean operator.
See image.
- Click Save.
- Copy the Admin ID and Password to your clipboard. You need it for authentication.
The Admin ID and Password are only available when adding a Microtenant. They are not available to access in the Zscaler Admin Console after you close the window, so store them in a secure location.
- Close the drawer.
After configuring a Microtenant, there can be situations where users from one Microtenant need to access one or more application segments from another Microtenant. Applications that are present in a Microtenant can be shared with other Microtenants. If an application is not shared with any other Microtenant, it can be moved to the default tenant. To learn more, see Sharing Defined Application Segments and Moving Resources from a Microtenant.
