# About App Connector Groups

**Source:** https://help.zscaler.com/zpa/about-connector-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1483586, revision 3245377

---

Watch a video about App Connector Groups.
Zscaler recommends deploying App Connectors in groups for high availability and horizontal scaling. Every App Connector belongs to a specific App Connector group, and every App Connector group should always be associated with at least one OAuth 2.0 enrollment token or provisioning key and one Server group to serve any application. App Connector groups must be associated with applications that the App Connector can access (i.e., only assign App Connectors to applications that the App Connector is capable of reaching). Private Access (ZPA) selects the closest App Connector given the location of the user and the App Connector-to-application latency.
You do not need to create a new App Connector group every time you add an App Connector. If the App Connector group to which you want to add a new App Connector already exists, you can assign the App Connector to that group. To learn more, see Configuring App Connectors.
App Connector groups provide the following benefits and enable you to:
- Group App Connectors per region or functional area; each App Connector must belong to a single group.
- Configure the automated update schedule to an off-hours maintenance window in a region.
- Configure the preferred local version profile for associated App Connectors and the App Connector’s location used in application path selection.
- Enable the necessary interface (IPv4, IPv6, or IPv4 and IPv6) using the DNS Resolution Option.
# About the App Connector Groups Page
On the App Connector Groups page (Private Access > Private Infrastructure > App Connector Groups), you can do the following:
- Select a version profile for the App Connector group.
- Add an App Connector group.
- Filter the information that appears in the table. By default, no filters are applied. To learn more, see Using Tables.
- Refresh the App Connector Groups page to reflect the most current information.
- Modify the columns displayed in the table.
- View a list of all App Connector groups that are configured for your organization. For each App Connector group, you can see:
  - **Name**: The name of the App Connector group. Click the name to view the details for the App Connector group.
    - View details for each deployed App Connector group.
      - **Name**: The name of the App Connector group.
      - **Description**: The description of the App Connector group.
      - **Status**: Indicates whether the App Connector group is enabled or disabled.
      - **Enrollment Certificate**: The certificate the App Connector uses for enrollment.
      - **DNS Resolution Option**: Indicates whether the App Connector group uses IPv4, IPv6, or a combination of the two IP addresses.
      - **Persist Local Version Profile**: Indicates whether the version profile set at the customer level is enabled for this App Connector group.
      - **Location**: The location where the App Connector group, which the App Connector belongs to, is set up.
      - **Location Coordinates**: The latitude and longitude coordinates where the App Connector group, which the App Connector belongs to, is set up.
      - **Disaster Recovery**: Indicates whether Disaster Recovery is enabled or disabled.
      - **Privileged Remote Access**: Indicates whether Privileged Remote Access (PRA) is enabled or disabled
      - **Disable AppProtection**: Indicates whether AppProtection is enabled or disabled.
      - **Version Profile**: The version profile configured for this App Connector group. To learn more, see Configuring a Version Profile.
      - **Next Periodic Software Update**: The date and time of the next periodic software update for all of the App Connectors within the group.
      - **App Connectors**: Click this tab to view a list of deployed App Connectors that are included in the group.
      - **Provisioning Keys**: Click this tab to view a list of provisioning keys used by App Connectors in this group.
  - **App Connector Count**: The number of enrolled App Connectors associated with this group.
  - **Status**: Indicates whether the App Connector group is enabled or disabled.
  - **Version Profile**: The profile used to specify an App Connector build for the group.
  - **Next Periodic Software Update**: The date and time of the next periodic software update for all of the App Connectors within the group.
- If you accessed the App Connector Groups page from the Log Receivers page, then you only see groups with App Connectors that are set up for log streaming. The group also has a Log Streaming Service (LSS) icon next to the name within the table.
- See image.
- View a configuration graph of connected objects.
- Edit a configured App Connector group.
- Edit network settings or delete an App Connector group.
If an App Connector group is configured using Zscaler Deception or is managed by Zscaler, then the edit and delete options are unavailable.
See image.
- Display more rows or a different page of the table.
