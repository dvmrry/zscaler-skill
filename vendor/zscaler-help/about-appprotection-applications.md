# About AppProtection Applications

**Source:** https://help.zscaler.com/zpa/about-appprotection-applications
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1485031, revision 3238013

---

When creating an application segment, you can identify the web applications that require AppProtection before users can access those applications. This is done by using various levels and types of custom and predefined controls in an AppProtection profile before Private Access (ZPA) provides access. This provides another way to protect your applications from users that should not have access.
AppProtection application segments provide the following benefits and enable you to:
- Identify and select applications for protection against attacks related to OWASP predefined controls and zero-day threats.
- Configure HTTP/S ports and provide certificates for inspection of encrypted traffic.
When you define an application within an application segment and enable AppProtection for the application, Zscaler Client Connector access is automatically applied. This allows your users to request access to the application via any web browser that supports TLS 1.2 (with cipher suite ECDHE-RSA-AES128-GCM-SHA256) or via Zscaler Client Connector. Private Access supports HTTP and HTTPS protocols.
# About the Protected Applications Page
On the Protected Applications page (Private Access > Private App Protection > Protected Applications), you can do the following:
- Expand all the rows in the table to see more information about each application.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all applications that were specifically configured for AppProtection within an application segment. For each application, you can see:
  - Internal Domain: The name of the application. When expanded, the following information is displayed:
    - Segment Group: The segment group that the application segment is a member of.
    - Server Groups: The server groups that the application is hosted on.
    - Certificate: The certificates associated with the specified application.
  - External Domain: The FQDN associated with the application.
  - Application Protocol: The protocol (HTTPS or HTTP) used for the application.
  - Application Port: The port number used for the application.
- Edit an application segment.
- Delete an application.
