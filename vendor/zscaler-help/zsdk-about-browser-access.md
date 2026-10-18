# About Browser Access

**Source:** https://help.zscaler.com/zsdk/about-browser-access
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1534187, revision 3207522

---

This feature is in Limited Availability. Contact Zscaler Support to enable this feature.
Browser Access extends zero trust protection to browser-based applications without the use of a software development kit (SDK) or software agent. Browser Access allows you to leverage a web browser for user authentication and application access over ZSDK. This provides identity verification, Transport Layer Security, and back-end cloaking from public web applications. To enforce its policies, Browser Access routes back-end traffic through the Zscaler cloud.
Prior to configuring application segments for Browser Access, review the prerequisites.
Browser Access provides the following benefits and enables you to:
- Control user access to applications on devices with currently unsupported operating systems.
- Use your existing identity provider to provide access to your current users.
- Allow users to access your applications from any web browser without requiring an SDK or software agent.
After the application segment is defined and enabled for Browser Access, you must add a browser token validator to the application segment.
# About the Browser Access Page
On the Browser Access page (Resource Management > Application Management > Browser Access), you can do the following:
- View and add DNS search domains.
- Expand one or all rows in the table to see more information about each application.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all applications that were specifically configured for Browser Access within an application segment. For each application, you can see the following details:
  - Name: The name of the application. When you expand the row, you can see more information.
    - Segment Group: The segment group that the application segment is a member of.
    - Server Groups: The server groups that the application is hosted on.
    - Canonical Name (CNAME): The canonical name associated with the application. Click the Copy icon to copy the CNAME record to your clipboard.
    - Use the CNAME to verify that the FQDN for the Browser Access-enabled application resolves to the record.
    - Certificate: The Browser Access (web server) certificate associated with the specified application.
  - Domain: The FQDN associated with the application.
  - Application Protocol: The protocol (HTTPS or HTTP) used for the application.
  - Application Port: The port number used for the application.
- Edit an existing application segment.
- Delete an application segment.
- Go to the Application Segments or Segment Groups pages.
