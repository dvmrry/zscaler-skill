# About Servers

**Source:** https://help.zscaler.com/zsdk/about-servers
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Applications 
About Servers
Zscaler SDK for Mobile Apps
About Servers
Ask Zscaler

You must configure servers that host the applications that you want to make available for ZSDK, whether the servers are in your enterprise data center or in a virtual public cloud.

Server configurations provide the following benefits and enable you to:

- Explicitly define servers and server groups where one or more applications are hosted (e.g., explicit server management, load balancers in front of multiple applications, and no-default-route/no-external-dns environments with a transparent proxy).
- Provide mapping of applications to specific servers and App Connector groups when paired with a server group.
- Dynamically discover applications through DNS when an empty server group is defined with Dynamic Server Discovery.

About the Servers Page

On the Servers page (Configuration & Control > Private Infrastructure > App Connector Management > Servers), you can do the following:

- Expand one or all rows to view the description of each server.
- Add a new server and explicitly define it to support one or more of your applications.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all servers that were explicitly defined for your organization. For each server, you can see:
  - Name: The server name.
  - Status: Whether the server is enabled or disabled.
  - Domain or IP Address: The FQDN or IP address of the server.
- Edit an existing server.
- Delete a server.
- Go to the Server Groups page to create server groups from servers you've defined previously, or to enable Dynamic Server Discovery, which allows ZSDK to discover the appropriate servers for your applications as users request them, as opposed to explicitly defining them.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Applications
About Segment Groups
About Server Groups
About Servers
About Device Profile
