# About Private Service Edge Groups

**Source:** https://help.zscaler.com/zpa/about-private-service-edge-groups
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Zscaler recommends deploying Private Service Edges for Private Access (ZPA) in groups for high availability and horizontal scaling. You can create new Private Service Edge groups whenever you add a new Private Service Edge using a new provisioning key. Every Private Service Edge belongs to a specific Private Service Edge group.

You do not need to create a new Private Service Edge group every time you add a Private Service Edge. Instead, you can assign the Private Service Edge to a Private Service Edge group that already exists. To learn more, see Configuring Private Service Edges.

Private Service Edge groups provide the following benefits and enable you to:

- Deploy Private Service Edges in your tenant using provisioning keys.
- Group Private Service Edges based on region or functional area (each Private Service Edge must belong to a single group).
- Set the location for the Private Service Edges in the group.
- Configure and enable disaster recovery.
- Set the automated update schedule to an off-hours maintenance window in a region.
- Configure the preferred local version profile for associated Private Service Edges.

## About the Private Service Edge Groups Page

On the Private Service Edge Groups page (Infrastructure > Private Access > Component > Private Service Edge Groups), you can do the following:

- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to show the filters.
- View a table of all the Private Service Edge groups.
- View a map of all the Private Service Edge groups.
- Refresh the Private Service Edge page to reflect the most current information.
- Select a Version Profile of the Private Service Edge group.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions.
- Expand all of the rows in the table to see more information about each Private Service Edge group.
- View a list of all Private Service Edge groups that are configured for your organization. For each Private Service Edge group, you can see:
  - Name: The name of the Private Service Edge group. Expand a Private Service Edge group in the table to see the following for that specific Private Service Edge group:
    - Persist Local Version Profile: Indicates whether a Private Service Edge Group is enabled or disabled to persist the local Version Profile.
    - Location: The location where the Private Service Edge group, which the Private Service Edge belongs to, is set up.
    - Location Coordinates: The latitude and longitude of the Private Service Edge group location.
    - Publicly Accessible: Choose if the Private Service Edge group with specific trusted networks mapping is also available publicly for all users outside of these trusted networks. It is important to ensure the Private Service Edge is reachable over a public IP address if you need remote users to be able to connect to it.
    - Client Connector Trusted Networks: Your organization's trusted networks that are mapped to the Private Service Edge group. This is used to prioritize Private Service Edges matching the given trusted network when users connect from those trusted networks. To learn more, see About Trusted Networks.
    - Alternative Cloud Domain: The alternative cloud domain that can override the default cloud domain for the Private Service Edge Group it is assigned to.
    - Private Service Edge Provisioning Keys: The key used to identify the Private Service Edge group to which a Private Service Edge must deploy.
    - Private Service Edges: List of deployed Private Service Edges that are included in the group.
    - Description: The description of the Private Service Edge group if available.
    - Disaster Recovery: Indicates the Private Service Edge group is enabled for disaster recovery.
    - Public Service Edge Proximity Override: Indicates whether to allow this Private Service Edge group within a specified distance from the user to be prioritized over a closer Public Service Edge for Private Access.
    - Status: Indicates whether the Private Service Edge group is enabled or disabled.
    - Version Profile: Indicates the Version Profile of the Private Service Edge group.
    - Next Periodic Software Update: The date and time of the next periodic software update for all of the Private Service Edges within the group.
- Modify the columns displayed in the table.
- Edit a configured Private Service Edge group.
- Delete a Private Service Edge group.

Private Service Edge groups that are managed by Zscaler are read only and cannot be edited or deleted.

- Display more rows or a different page of the table.
