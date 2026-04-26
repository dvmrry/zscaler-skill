# About Private Service Edges

**Source:** https://help.zscaler.com/zpa/about-private-service-edges
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Watch a video about Private Service Edges (shows legacy UI).

Private Service Edges for Private Access (ZPA) are single-tenant instance brokers that provide the functionality of a Public Service Edge for Private Access in an organization's environment. Your organization hosts them either within your site or on a cloud service, but Zscaler manages them. On the other hand, Public Service Edges are deployed in Zscaler data centers around the world. To learn more, see Understanding Private Service Edges.

As with a Public Service Edge, a Private Service Edge manages the connections between Zscaler Client Connector and App Connectors. It registers with the Private Access Cloud. This allows a Private Service Edge to download the relevant policies and configurations so it can enforce all Private Access policies. It also caches path selection decisions.

Private Service Edges provide the following benefits and enable you to:

- Implement Zero Trust Network Access (ZTNA) for on-premises users.
- Securely access applications when Public Service Edges in data centers are not conveniently located between users and the applications they need to reach.
- Ensure business continuity and continued access to critical apps during disaster events.
- Keep application data traffic local to help meet compliance and regulatory requirements.

Private Service Edges can be deployed in several forms. Zscaler distributes images for deployment in enterprise data centers and local private cloud environments such as VMware.

Before you begin, see Private Service Edges Deployment Prerequisites, which provides detailed information on virtual image (VM) sizing and scalability, supported platform requirements, deployment best practices, and other essential guidelines.

Configuring Private Service Edges involves two main tasks:

1. Adding Private Service Edges using the Zscaler Admin Console, which includes obtaining a Private Service Edge Provisioning Key.
2. Deploying Private Service Edges on the supported platform of your choice.

After a Private Service Edge is added and deployed, it is displayed on the Private Service Edge page. You can perform additional software management and maintenance tasks after deployment. To learn more, see Managing Deployed Private Service Edges and About Private Service Edge Software Updates.

The Private Service Edge uses the public IP address of the user who connects to the Private Service Edge to access private resources. After a user connects to a Private Service Edge, the location of the user is determined by its public IP address, and then a country-based policy for the mapped country is enforced. To learn more, see About Access Policy.

If a user connects to a Private Service Edge with an RFC 1918 IP address, then the location of the Private Service Edge is used to evaluate policies with country criteria.

If the location of the Private Service Edge Group is updated for an existing connection, the Private Service Edge uses the old location until the next time it makes a new connection. Location changes via a GeoIP configuration override are not supported for Private Service Edges.

## About the Private Service Edges Page

On the Private Service Edges page (Infrastructure > Private Access > Component > Private Service Edges), you can do the following:

- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to show the filters.
- Refresh the Private Service Edges page to reflect the most current information.
- Configure the Private Service Edge settings. You can enable Auto Delete to remove disconnected or optionally disabled Private Service Edges after a set number of days.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions.
- Add a new Private Service Edge.

Private Service Edges that are managed by Zscaler are read only and cannot be configured.

- Expand all rows in the table to view information about each Private Service Edge.
- View a list of all deployed Private Service Edges. Private Service Edges that you've added but have not deployed are not listed. For each deployed Private Service Edge, you can see:
  - Name: The name of the Private Service Edge. When expanded, the following information is displayed depending on the defined Private Service Edge:
    - Manager Version: The version of the current Private Service Edge Manager software.
    - Software Version: The current Private Service Edge software version.
    - Version Profile: The version profile applied to the Private Service Edge.
    - Connection Status: The status of the Private Service Edge session.
    - Software Update: The status of the last Private Service Edge software update.
    - Status: Indicates whether the Private Service Edge is enabled or disabled.
    - Manager Update: The status of the Private Service Edge update. You can hover over the Information icon next to the update status to view more information, such as the scheduled version and upgrade window.
- Modify the columns displayed in the table.
- Edit the configuration of a deployed Private Service Edge.
- Delete a deployed Private Service Edge configuration.

Private Service Edges that are managed by Zscaler are read only and cannot be edited or deleted.

- Display more rows or a different page of the table.
