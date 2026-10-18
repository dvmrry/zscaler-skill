# About Certificates

**Source:** https://help.zscaler.com/zsdk/about-certificates
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1535140, revision 3176028

---

ZSDK uses certificates for web servers in order to provide access to web applications. These certificates are typically used for Browser Access and are selected when defining an application within an application segment. When you generate a certificate, the certificate creates a certificate signing request (CSR) that is signed by your Certificate Authority (CA).
Certificates provide the following benefits and allow you to:
- Create CSRs that are signed by your CA.
- Give users access to your web applications.
- Manage expiry dates to limit access to your web applications.
You cannot use enrollment certificates with CA for Browser Access.
# About the Certificates Page
On the Certificates page (Configuration & Control > Certificate Management > Certificates), you can do the following:
- Filter the information that appears in the table. By default, no filters are applied.
  - Filter Actions
  - When you use the filters, you can:
    - Save applied filters to your preferences so that they're visible in future user sessions.
    - View a list of applied filters available from the current and previous user sessions. You must save applied filters to the user session before viewing them. Use the drop-down menu to select the applied filters to view.
    - Hide the filters on the page by clicking **Hide Filters**. After the filters are hidden, click **Show Filters** to show them again.
- Refresh the **Certificates** page to reflect the most current information.
- Upload a certificate.
- Create a CSR for a certificate.
- Expand one or all of the rows in the table to see more information about each certificate.
- When you expand a certificate, the following information displays:
  - **Description**: The certificate's description.
  - **Subject Alternate Name**: The subject alternative name of the certificate.
  - **Issued By**: The CA that issued the certificate.
  - **Issued To**: The entity that the CA issued the certificate to.
- View a list of all certificates that are configured for your organization. For each certificate, you can see:
  - **Name**: The name of the certificate.
  - **Creation Date**: The creation date of the certificate.
  - **Expiry Date**: The expiration date of the certificate.
  - **Common Name**: The CN for the hostname associated with the certificate.
- Depending on the **Expiry Date**, the following icons display next to the **Name**:
  - If the certificate has expired, a red **Warning** icon () appears.
  - If the certificate has fewer than 7 days before expiration, a yellow **Caution** icon () appears.
  - If the certificate has fewer than 30 days before expiration, an orange **Info** icon () appears.
- Modify the columns displayed in the table.
- Edit an existing certificate.
- Delete an existing certificate.
- Display more rows or a different page of the table.
- Go to the Enrollment Certificates page to view and manage CA certificates for App Connectors and ZSDK Private Service Edges.
