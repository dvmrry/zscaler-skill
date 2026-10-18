# Configuring SAML

**Source:** https://help.zscaler.com/zia/configuring-saml
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399676, revision 3218437

---

You can configure the Zscaler service as the service provider (SP) and use Security Assertion Markup Language (SAML) Single Sign-On (SSO) for provisioning and authenticating users. To learn more about SAML, see Understanding SAML.
# Prerequisites
Ensure you do the following before configuring the Zscaler service for SAML:
- Obtain the SAML SSL certificate from your identity provider (IdP). You upload this certificate to the Zscaler Admin Console when you configure the service to use SAML.
- Export the XML metadata from your IdP. You use information from the metadata when you configure the service to use SAML.
- If you are using PAC files to forward traffic to the Zscaler service, add the redirected URL to the authentication exemption list in the PAC files. Otherwise, the authentication fails. This is due to the browser trying to reach the authentication URL via the Zscaler service and the current user isn't yet authorized to use the service, so the request never passes through the Internet & SaaS (ZIA) Public Service Edge.
- If you are transparently forwarding traffic to the Zscaler service, you must exempt the SAML IdP traffic from the GRE or IPSec tunnel. You can do this by adding a route at the gateway router to forward the traffic directly to the internet.
# Configuring SAML
To configure SAML:
- 1. Configure the IdP for SAML.
- Follow the relevant configuration guides to configure the Zscaler service as the SP for your IdP:
  - Active Directory Federation Services 3.0
  - Active Directory Federation Services 2.0
  - Microsoft Entra ID (formerly Azure Active Directory)
  - CA Single Sign-On
  - Google Apps
  - Okta
  - OneLogin
  - PingFederate
- 2. Add the IdP in the Zscaler Admin Console.
- 3. Configure the Zscaler service as the SP for SAML.
- To configure the Zscaler service as the SP for SAML:
  - Go to **Administration** > **Identity** > **Internet & SaaS** > **Internet Authentication Settings** > **Default Settings**.
  - Under **Authentication Frequency**, choose how often users are required to authenticate to the Zscaler service. To learn more, see About Authentication Default Settings. If you select **Custom**, the following field appears:
    - **Custom Authentication Frequency (days)**: Specify 1 to 180 days.
  - Under **Authentication Type**, choose **SAML**.
  - See image.
  - Click **Save** and activate the change.
# Troubleshooting
If any errors occur, see Troubleshooting SAML to troubleshoot browser settings and SAML error codes.
