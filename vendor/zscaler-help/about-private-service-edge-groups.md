# About Private Service Edge Groups

**Source:** https://help.zscaler.com/zpa/about-private-service-edge-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484471, revision 3245847

---

Watch a video about Private Service Edge Groups.
Zscaler recommends deploying Private Service Edges for Private Access (ZPA) in groups for high availability and horizontal scaling. You can create new Private Service Edge groups whenever you add a new Private Service Edge using a new provisioning key. Every Private Service Edge belongs to a specific Private Service Edge group.
You do not need to create a new Private Service Edge group every time you add a Private Service Edge. Instead, you can assign the Private Service Edge to a Private Service Edge group that already exists. To learn more, see Configuring Private Service Edges.
Private Service Edge groups provide the following benefits and enable you to:
- Deploy Private Service Edges in your tenant using provisioning keys.
- Group Private Service Edges based on region or functional area (each Private Service Edge must belong to a single group).
- Set the location for the Private Service Edges in the group.
- Configure and enable disaster recovery.
- Set the automated update schedule to an off-hours maintenance window in a region.
- Configure the preferred local version profile for associated Private Service Edges.
# About the Private Service Edge Groups Page
On the Private Service Edge Groups page (Private Access > Private Infrastructure > Private Service Edge Groups), you can do the following:
- Select a version profile for the Private Service Edge group.
- Add a Private Service Edge group.
- Filter the information that appears in the table. By default, no filters are applied. To learn more, see Using Tables.
- Refresh the Private Service Edge Groups page to reflect the most current information.
- Modify the columns displayed in the table.
- View a list of all Private Service Edge groups that are configured for your organization. For each Private Service Edge group, you can see:
  - Name: The name of the Private Service Edge group. Click the name to view details for this group.
  - View details for each deployed Private Service Edge group.
  - On the Details tab, you can view:
    - Name: The name of the Private Service Edge group.
    - Description: A description of the Private Service Edge group if available.
    - Status: Whether the Private Service Edge group is enabled or disabled.
    - Enrollment Certificate: The certificate the Private Service Edge uses for enrollment.
    - Persist Local Version Profile: Indicates whether the version profile set at the customer level is enabled for this Private Service Edge group.
    - Location: The location where the Private Service Edge group, which the Private Service Edge belongs to, is set up.
    - Location Coordinates: The latitude and longitude of the Private Service Edge group location.
    - Publicly Accessible: Indicates that the Private Service Edge group with specific trusted networks mapping is also available publicly for all users outside of these trusted networks. It is important to ensure the Private Service Edge is reachable over a public IP address if you need remote users to be able to connect to it.
    - Trusted Networks: Your organization's trusted networks that are mapped to the Private Service Edge group. This is used to prioritize Private Service Edges matching the given trusted network when users connect from those trusted networks. To learn more, see About Trusted Networks.
    - Trusted networks are available for Zscaler Client Connectors only. Trusted networks are not supported with Cloud & Branch Connectors.
    - Public Service Edge Proximity Override: Indicates whether to allow this Private Service Edge group within a specified distance from the user to be prioritized over a closer Public Service Edge for Private Access.
    - Disaster Recovery: Indicates the Private Service Edge group is enabled for disaster recovery.
    - Version Profile: The version profile that is applied to this Private Service Edge group.
    - Next Periodic Software Update: The date and time of the next periodic software update for all of the Private Service Edges within the group.
  - You can click View All Private Service Edges to open the Private Service Edges page to view all Private Service Edges regardless of the group.
  - See image.
  - Private Service Edge Count: The number of Private Service Edges assigned to this group.
  - Status: Whether the Private Service Edge group is enabled or disabled.
  - Version Profile: The version profile of the Private Service Edge group.
  - Next Periodic Software Update: The date and time of the next periodic software update for all of the Private Service Edges within the group.
- Edit a configured Private Service Edge group.
- Edit network settings for the Private Service Edge group.
- Delete a Private Service Edge group.
- Private Service Edge groups that are managed by Zscaler are read only and cannot be edited or deleted.
- Display more rows or a different page of the table.
