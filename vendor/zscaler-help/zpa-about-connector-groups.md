# About App Connector Groups (ZPA)

**Source:** https://help.zscaler.com/zpa/about-connector-groups
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help 
App Connector Management 
App Connector Groups 
About App Connector Groups
Private Access (ZPA)
About App Connector Groups
Ask Zscaler

Zscaler recommends deploying App Connectors in groups for high availability and horizontal scaling. Every App Connector belongs to a specific App Connector group, and every App Connector group should always be associated with at least one OAuth 2.0 enrollment token or provisioning key and one Server group to serve any application. App Connector groups must be associated with applications that the App Connector can access (i.e., only assign App Connectors to applications that the App Connector is capable of reaching). Private Access (ZPA) selects the closest App Connector given the location of the user and the App Connector-to-application latency.

You do not need to create a new App Connector group every time you add an App Connector. If the App Connector group to which you want to add a new App Connector already exists, you can assign the App Connector to that group. To learn more, see Configuring App Connectors.

App Connector groups provide the following benefits and enable you to:

Deploy App Connectors in your tenant using OAuth 2.0 enrollment tokens or provisioning keys.
Group App Connectors per region or functional area; each App Connector must belong to a single group.
Configure the automated update schedule to an off-hours maintenance window in a region.
Configure the preferred local version profile for associated App Connectors and the App Connector’s location used in application path selection.
Enable the necessary interface (IPv4, IPv6, or IPv4 and IPv6) using the DNS Resolution Option.
About the App Connector Groups Page

On the App Connector Groups page (Infrastructure > Private Access > Component > App Connector Groups), you can do the following:

View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
Hide the filters on the page by clicking Hide Filters. Click Show Filters to show the filters.
View the App Connector groups as a table.
View the App Connector groups in a map.
Refresh the App Connector Groups page to reflect the most current information.
Select a version profile of the App Connector group.
Filter the information that appears in the table. By default, no filters are applied. To learn more, see Using Tables.
Add an App Connector group.

View a list of all App Connector groups that are configured for your organization. For each App Connector group, you can see:

Name: The name of the App Connector group.
App Connector Count: The number of enrolled App Connectors associated with this group.
Status: Indicates whether the App Connector group is enabled or disabled.
Version Profile: The profile used to specify an App Connector build for the group.
Next Periodic Software Update: The date and time of the next periodic software update for all of the App Connectors within the group.

If you accessed the App Connector Groups page from the Log Receivers page, then you only see groups with App Connectors that are set up for log streaming. The group also has a Log Streaming Service icon next to the name within the table.
See image.

Close

Modify the columns displayed in the table.
View a configuration graph of connected objects.
Edit a configured App Connector group.
Delete an App Connector group.

If an App Connector group is configured using Zscaler Deception or is managed by Zscaler, then the edit and delete options are unavailable.

See image.

Close

Display more rows or a different page of the table.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About App Connector Groups
Configuring App Connector Groups
Configuring a Version Profile
Editing App Connector Groups
Adding App Connectors to an Existing App Connector Group
