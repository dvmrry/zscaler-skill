# Configuring Source IP Anchoring for Microsoft 365 Conditional Access

**Source:** https://help.zscaler.com/zia/configuring-source-ip-anchoring-microsoft-365-conditional-access
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401751, revision 3239550

---

Source IP Anchoring addresses one of the most common Microsoft 365 use cases where users of an organization need to be given conditional access to Microsoft 365 applications. An admin can configure users to access Microsoft 365 applications only if their traffic originates from a trusted location, such as a corporate network. In such cases, users have to provide multifactor authentication. The admin can also block user traffic originating from a non-corporate location. You can use Source IP Anchoring to associate traffic from a trusted location.
To enable conditional access, it is sufficient to configure Source IP Anchoring only for the initial user login application traffic that is redirected to the Microsoft Azure AD domain (e.g., login.microsoftonline.com, login.windows.net, login.microsoft.com). After successful authentication, the subsequent application traffic uses an authenticated token to access the actual application and, hence, does not require being redirected through Source IP Anchoring.
To configure Source IP Anchoring for Microsoft 365 Conditional Access:
- Do the following steps to complete the initial setup on the Zscaler Admin Console if you are using Private Access (ZPA) solely for Source IP Anchoring. You can skip this step if you have already done the initial setup.
  - Update your company and administrator information.
  - Configure the enrollment certificates for the App Connectors. For Source IP Anchoring, it is sufficient if you configure the enrollment certificates only for the App Connectors.
  - (Optional) Configure Single Sign-On Authentication.
  - Configure your App Connectors.
- Configure the following items in the Zscaler Admin Console:
  - Create an application segment for Office 365. Ensure that you enable the **Source IP Anchor** option while configuring the application segment.
    - Under the **Applications** section, enter login.microsoftonline.com. Alternatively, you can use login.windows.net or login.microsoft.com.
    - In the **TCP Port Ranges** field, add 80 and 443 to allow the ports.
    - See image.
    - Configure a segment group and a server group for the Office 365 application segment. Ensure that your server group is associated with the connector group that you have configured.
  - Configure a Client Forwarding policy for the Office 365 application segment. Ensure that you select the **Rule of Action** as **Only Forward Allowed Applications** in the Client Forwarding policy for the Office 365 application segment.
  - See image.
  - Create and configure an access policy for the Office 365 application segment. Ensure that you allow access only to the **ZIA Service Edge** client type in the access policy for the application segment.
  - See image.
- Configure the following items in the Zscaler Admin Console:
  - Configure the Private Access gateway for the Office 365 application segment. Ensure that you select the server group that you created for the Office 365 application segment.
  - See image.
  - Configure forwarding policies to forward the Office 365 application traffic to Private Access.
    - Under the **Forwarding Rule** section, select **ZPA** as the **Forwarding Method**.
    - Under the **General** tab, select the required trust criteria, such as location, users etc.
    - Under the **Destination** tab, select the Office 365 application segment that you created in the Zscaler Admin Console from the **Application Segment** drop-down menu.
    - Select the Private Access gateway that you created in the previous step from the **Forward to ZPA Gateway** drop-down menu.
  - Configure Source IP Anchoring for the Office 365 application traffic by enabling appropriate preconfigured DNS filtering rules from the **Policies** > **Access Control** > **Firewall** > **DNS Control** page:
    - For location users, enable the **ZPA Resolver for Locations** rule.
    - For remote users, enable the **ZPA Resolver for Road Warrior** rule.
    - When the **ZPA Resolver for Road Warrior** rule is disabled, the remote user traffic automatically falls under the **ZPA Resolver for Locations** rule instead of blocking the traffic. Therefore, Zscaler does not recommend disabling the **ZPA Resolver for Road Warrior** rule.
  - Ensure that these DNS rules are the top rules (i.e., Rule 1 and Rule 2) to configure Source IP Anchoring. The DNS rules are associated with the respective preconfigured IP pools. Any change in the IP pool is reflected in the **Action** column of the respective DNS rule when the rule is enabled.
