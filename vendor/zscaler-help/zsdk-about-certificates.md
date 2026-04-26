# About Certificates

**Source:** https://help.zscaler.com/zsdk/about-certificates
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Getting Started 
Certificate Management 
About Certificates
Zscaler SDK for Mobile Apps
About Certificates
Ask Zscaler

ZSDK uses certificates for web servers in order to provide access to web applications. These certificates are typically used for Browser Access and are selected when defining an application within an application segment. When you generate a certificate, the certificate creates a certificate signing request (CSR) that is signed by your Certificate Authority (CA).

Certificates provide the following benefits and allow you to:

- Create CSRs that are signed by your CA.
- Give users access to your web applications.
- Manage expiry dates to limit access to your web applications.

You cannot use enrollment certificates with CA for Browser Access.

About the Certificates Page

On the Certificates page (Configuration & Control > Certificate Management > Certificates), you can do the following:

- Filter the information that appears in the table. By default, no filters are applied.
- Refresh the Certificates page to reflect the most current information.
- Upload a certificate.
- Create a CSR for a certificate.
- Expand one or all of the rows in the table to see more information about each certificate.
- View a list of all certificates that are configured for your organization. For each certificate, you can see:
  - Name: The name of the certificate.
  - Creation Date: The creation date of the certificate.
  - Expiry Date: The expiration date of the certificate.
  - [Additional fields in collapsed sections on source page]

Was this article helpful? Click an icon below to submit feedback.
