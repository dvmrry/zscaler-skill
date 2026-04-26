# About Applications

**Source:** https://help.zscaler.com/zsdk/about-applications
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Applications 
About Applications
Zscaler SDK for Mobile Apps
About Applications
Ask Zscaler

An application is an FQDN, local domain name, or IP address that you define on a standard set of ports. Applications must be defined within an application segment.

To enable application discovery, you can define an application as an FQDN in wildcard format or as an IP subnet.

An application segment is a grouping of defined applications, based upon access type or user privileges. So, features such as double encryption and health reporting are configured per application segment.

Defining your applications as application segments provides the following benefits and enables you to:

- Restrict access to ports not included in your defined application segment, reducing the application's attack surface.
- Leverage application segments to configure access policies to restrict user groups that can access them, as well as reduce lateral movement.

Read about the following key configuration options available for your applications before configuring an application segment:

- Application Access
- Bypass
- Double Encryption
- Health Reporting

About the Defined Application Segments Page

On the Application Segments page (Resource Management > Application Management > Application Segments), you can do the following:

- Validate a client hostname.
- Add an application segment.
- Access the Application Segments menu.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all application segments that were configured for your organization. For each application segment, you can see:
  - Name: The name of the application segment.
  - Applications: Lists up to three defined applications within the application segment.
  - Status: Indicates that the application segment is enabled or disabled.
  - Health Reporting: Indicates whether health reporting for the application is Continuous (or other setting).

[Note: Additional details in collapsed sections on the source page.]

Was this article helpful? Click an icon below to submit feedback.
