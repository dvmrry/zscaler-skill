# About ZSDK Private Service Edges

**Source:** https://help.zscaler.com/zsdk/about-zsdk-private-service-edges
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Private Service Edge 
About ZSDK Private Service Edges
Zscaler SDK for Mobile Apps
About ZSDK Private Service Edges
Ask Zscaler

ZSDK Private Service Edges are single-tenant instance brokers that provide similar functionality of Public Service Edge in an organization's environment instead of a Zscaler data center. Your organization hosts them either within your site or on a cloud service, but Zscaler manages them.

Similar to Public Service Edges, Private Service Edges manage the connections from App Connectors. Private Service Edges register with the ZSDK cloud, which allows them to download the relevant policies and configurations in order to enforce all policies.

Private Service Edges provide the following benefits and enable you to:

- Implement Zero Trust Network Access (ZTNA) for all of your users.
- Securely access applications when Public Service Edges in data centers are not conveniently located between users and the applications they need to reach.
- Ensure business continuity and continued access to critical services during disaster events.
- Keep application data traffic local to help meet compliance and regulatory requirements.

Private Service Edges can be deployed in different forms. Zscaler distributes images for deployment in enterprise data centers and local private cloud environments (e.g., VMware). Zscaler recommends reading the Private Service Edge Deployment Prerequisites prior to deploying Private Service Edges.

After you add and deploy a Private Service Edge, it displays on the Private Service Edges page. You can continue performing additional software management and maintenance tasks after deployment.

A user connects to the Private Service Edge to access resources through a public IP address. After a user connects to a Private Service Edge, the user's location is determined by its public IP address, and then a country-based policy for the mapped country is enforced. To learn more, see About Access Policy.

If the location of the Private Service Edge group is updated for an existing connection, the Public Service Edge uses the old location until the next time it makes a new connection. Location changes via a GeoIP configuration override are not supported for Private Service Edges.

About the Private Service Edges Page

On the Private Service Edges page (Configuration & Control > Private Infrastructure > Private Service Edge Management > Private Service Edges), you can do the following:

- Filter the information that appears in the table. By default, no filters are applied.
- Refresh the Private Service Edges page to reflect the most current information.
- Add a new Private Service Edge.
- Expand all rows or one row in the table to see more information about each Private Service Edge.
- View a list of all deployed Private Service Edges. For each deployed Private Service Edge, you see:
  - Name: The name of the Private Service Edge.
  - Manager Version: The current version of the Private Service Edge Manager software.
  - Current Software Version: The current Private Service Edge software version.
  - Connection Status: The connection status of the Private Service Edge.
  - Upgrade Status: The status when Private Service Edge was last updated.
  - Status: Whether the Private Service Edge is enabled or disabled.
  - Actions: The actions you can take.
  - Added but undeployed Private Service Edges are not listed.
- Modify the columns displayed in the table.
- Edit the deployed Private Service Edge.
- Delete the deployed Private Service Edge.
- Configure the number of rows for the table.
- Move between pages of deployed Private Service Edges.
- Go to one of the following pages:
  - Private Service Edge Groups: Manage your Private Service Edge groups.
  - Private Service Edge Provisioning Keys: Manage your Private Service Edge provisioning keys.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About ZSDK Private Service Edges
About ZSDK Private Service Edge Groups
About ZSDK Private Service Edge Provisioning Keys
Deploying ZSDK Private Service Edges
Viewing Disaster Recovery
Configuring Disaster Recovery
Managing ZSDK Private Service Edges
Managing ZSDK Private Service Edge Groups
Managing ZSDK Private Service Edge Provisioning Keys
