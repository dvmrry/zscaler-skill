# About API Clients

**Source:** https://help.zscaler.com/zidentity/about-api-clients
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1499371, revision 3245573

---

An API client refers to any application or service that wants to access the Zscaler API resources and retrieve data. You can configure and manage the API clients in the Zscaler Admin Console, along with their authentication information and necessary scope to access the API resources. Authentication Service is the authorization server that validates the API client's request and issues an access token that must be used to access the API resources via the OneAPI server.
API clients include the following key features and benefits:
- Consistent API experience across all Zscaler services.
- Consistent authorization through Authentication Service.
- Access resources across all Zscaler services with entitlements via role-based access control.
If your organization uses Unified Role-Based Access Control (RBAC), administrator roles for Authentication Service and some Zscaler services are managed on a different Role Management page. To learn more, see About Role Management. Unified RBAC is a feature in limited availability. To access Unified RBAC, contact your Zscaler Account team.
# About the API Clients Page
On the API Clients page (Administration > API > API Clients), you can do the following:
- Search for an API client.
- Download the list of API clients as a CSV file.
- Add an API client.
- View the list of API clients you've configured. For each API client, you can see:
  - Name: The name of the API client.
  - Status: The status (Active or Inactive) of the API client.
  - Client ID: The unique identifier for the API client.
- Reset the page to the default view.
- Select the columns to display in the table and click Apply.
- Edit an API client.
- Delete an API client.
- Enable or disable an API client.
