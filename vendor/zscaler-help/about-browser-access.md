# About Browser Access

**Source:** https://help.zscaler.com/zpa/about-browser-access
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484046, revision 3243336

---

Watch a video about Browser Access (shows legacy UI).
Browser Access allows you to leverage a web browser for user authentication and application access over Private Access (ZPA), without requiring users to install Zscaler Client Connector on their devices. For certain use cases, it might not be feasible or desirable to install Zscaler Client Connector on all devices. For example, you might want to:
- Control user access to applications on devices with operating systems that are not currently supported by Zscaler Client Connector.
- Provide third-party access to applications on devices that might not be owned or managed by your company (e.g., contractor or partner-owned devices).
If you want Zscaler to manage the certificate and CNAME, see Prerequisites for Browser Access Applications Managed by Zscaler.
Browser Access enhances your Private Access experience by enabling you to:
- Make applications accessible for your users from any web browser without requiring Zscaler Client Connector or browser plugins and configurations.
- Use your existing identity provider (IdP) to provide access to your current users, contractors, and other third-party users without managing an internet footprint.
When you define an application within an application segment and enable Browser Access, Zscaler Client Connector access is automatically applied. This allows your users to request access to the application via any web browser that supports TLS 1.2 (with cipher suite ECDHE-RSA-AES128-GCM-SHA256) with a proxy that doesn't modify the webpage contents or via Zscaler Client Connector. Private Access supports HTTP and HTTPS protocols, and Private Access inserts a Via header in HTTP requests. Private Access also accepts CORS requests with the right settings and valid OPTIONS requests that include certain headers. To learn more, see Configuring Defined Application Segments.
Browser Access requires that the application server supports TLS 1.2 encryption.
Supported browsers for CORS requests are Firefox 81.0, Chrome 64_65, Google Chrome 86.0.4240.75, Microsoft Edge 86.0.622.43, Safari 12.0, and Safari 13.0.
Browser Access cookies are session based, so they're cleared when a web browser's session terminates. Therefore, users must authenticate before accessing applications via Browser Access. In addition, users are asked to reauthenticate periodically based on the Authentication Timeout setting of the Private Access timeout policy rule. To learn more, see Configuring Timeout Policies.
If you intend to use a different external and internal hostname for a defined application that is Browser Access-enabled within an application segment, be aware of the following scenarios:
- Internal hostnames are not exposed, so there is no record of internal hostnames on the public DNS.
- Backend SSL cannot be verified, so a web server certificate error is displayed to your end users because the hostname of the application doesn't match the hostname of the certificate.
If you intend to use the same external and internal hostname for a defined application that is Browser Access-enabled within an application segment, be aware of the following scenarios:
- Internal hostnames are exposed on the public DNS.
- Backend SSL can be verified, so your end users will not receive a web server certificate error.
# About the Browser Access Page
On the Browser Access page (Zero Trust Browser > Web Access > Browser Access), you can do the following:
- View and add DNS search domains.
- Expand all the rows in the table to see more information about each application.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all applications that were specifically configured for Browser Access within an application segment. For each application, you can see:
  - **Internal Domain**: The name of the application. When expanded, the following information is displayed:
    - **Segment Group**: The segment group that the application segment is a member of.
    - **Server Groups**: The server groups that the application is hosted on.
    - **Canonical Name (CNAME)**: The canonical name associated to the application. You can click the **Copy** icon to copy the CNAME record to your clipboard.
    - **Certificate**: The Browser Access (web server) certificate associated to the specified application.
  - **External Domain**: The fully qualified domain name (FQDN) associated to the application.
  - **Application Protocol**: The protocol (HTTPS or HTTP) used for the application.
  - **Application Port**: The port number used for the application.
- Edit an application segment.
- Delete an application.
