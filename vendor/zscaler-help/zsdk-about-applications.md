# About Applications

**Source:** https://help.zscaler.com/zsdk/about-applications
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1508981, revision 3186199

---

An application is an FQDN, local domain name, or IP address that you define on a standard set of ports. Applications must be defined within an application segment.
To enable application discovery, you can define an application as an FQDN in wildcard format or as an IP subnet.
An application segment is a grouping of defined applications, based upon access type or user privileges. So, features such as double encryption and health reporting are configured per application segment.
Defining your applications as application segments provides the following benefits and enables you to:
- Restrict access to ports not included in your defined application segment, reducing the application’s attack surface.
- Leverage application segments to configure access policies to restrict user groups that can access them, as well as reduce lateral movement.
Read about the following key configuration options available for your applications before configuring an application segment:
- Application Access
- Bypass
- Double Encryption
- Health Reporting
# About the Defined Application Segments Page
On the Application Segments page (Resource Management > Application Management > Application Segments), you can do the following:
- Validate a client hostname.
- See image.
- Add an application segment.
- Access the Application Segments menu.
  - Functions of the Application Segments Menu
    - **Expand All**: Expand all rows in the table to see more information about each application segment.
    - You can opt to expand one row by clicking the **Expand** icon of the application segment's name.
    - **Set Application Warnings**: You can enable or disable configuration warnings for the Defined Application Segments page. To learn more, see Setting Application Segment Configuration Warnings.
    - **Download as CSV**: Download the configuration information for the application segments to a CSV file. The file lists the application segments based on the selected table filters.
  - See image.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all application segments that were configured for your organization. For each application segment, you can see the following information:
  - **Name**: The name of the application segment. When you expand the row for an application segment, you can see more information.
  - If an application segment is missing the required settings, the **Incomplete Configuration** icon () appears next to its name. Edit the application segment to resolve the configuration issues. If an application segment is Source IP Anchoring-enabled, the **Information** icon () appears next to its name.
    - **Description**: (Optional) Enter a description for the application segment.
    - **Segment Group**: The segment group that the application segment is a member of.
    - **Server Groups**: The server groups that the applications are hosted on.
    - **Double Encryption**: Indicates whether Double Encryption is enabled or disabled for all applications. By default, if a Browser Access-enabled application was defined, **Double Encryption** is disabled.
    - **Bypass**: Indicates whether users can bypass ZSDK to access applications.
    - **Client Connector can receive CNAME**: Indicates whether Zscaler Client Connector receives CNAME DNS records from App Connectors.
    - **Source IP Anchor**: Indicates whether Source IP Anchoring, for use with Zscaler Internet Access (ZIA), is enabled or disabled for all applications.
    - **ICMP Access**: Indicates whether ICMP communication is enabled or disabled for all applications.
    - **App Connector Selection Method**: Indicates whether the App Connector is closest to the application (**Enabled**) or closest to users (**Disabled**).
  - **Applications**: Lists up to three defined applications within the application segment. Applications are denoted by a **Zscaler Client Connector** icon (). If there are more than three applications, then only the number of defined applications appears.
  - For all applications, there is a link to view the **Application Segment** details with a list of all the applications for the application segment.
    - Application Segment Details
      - **TCP Keepalive**: Zscaler recommends keeping this setting as **Disabled**.
      - **TCP Port Ranges**: The TCP port ranges being used to access applications.
      - **UDP Port Ranges**: The UDP port ranges being used to access applications.
  - See image.
  - **Status**: Indicates that the application segment is enabled or disabled.
  - **Health Reporting**: Indicates whether health reporting for the application is **Continuous**, **On Access**, or **None**.
- View a configuration graph of connected objects.
- Copy the application segment.
- Edit the application segment.
- Download a CSV file with information on the selected application segment.
- Delete an application segment.
- Go to the Segment Groups page to add a new segment group or manage existing segment groups.
