# About App Connector Groups

**Source:** https://help.zscaler.com/zsdk/about-app-connector-groups
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Applications 
App Connectors 
About App Connector Groups
Zscaler SDK for Mobile Apps
About App Connector Groups
Ask Zscaler

Zscaler recommends deploying App Connectors in groups to organize availability and horizontal scaling. You can create new App Connector groups whenever you add a new App Connector using a new provisioning key. Every App Connector belongs to a specific App Connector group, and every App Connector group should always be associated with at least one provisioning key and one server group to serve any application. App Connector groups must be associated with applications that the App Connector can access (i.e., only assign App Connectors to applications that the App Connectors are capable of reaching). ZSDK selects the closest App Connector given the location of the user and the App Connector-to-application latency.

App Connector groups provide the following benefits and enable you to:

Deploy App Connectors in your tenant using provisioning keys.
Group App Connectors per region or functional area; each App Connector must belong to a single group.
Configure the automated update schedule to an off-hours maintenance window in a region.
Configure the preferred local version profile for associated App Connectors and the App Connector's location used in application path selection.
Enable the necessary interface (IPv4, IPv6, or IPv4 and IPv6) using the DNS Resolution Option.

About the App Connector Groups Page

On the App Connector Groups page (Configuration & Control > Private Infrastucture > App Connector Management > App Connector Groups), you can do the following:

Select a version profile of the App Connector group.
Expand one row or all the rows in the table to see more details about each App Connector group.
View App Connector group Details
Toggle the view to see the App Connector groups as a table or on a map.
Filter the information that appears in the table. By default, no filters are applied.
View a list of all App Connector groups that are configured for your organization. For each App Connector group, you can see:
Name: The name of the App Connector group.
Status: Whether the App Connector group is enabled or disabled.
Version Profile: Which version profile is used by the App Connector group.
Next Periodic Software Update: The date and time of the next periodic software update for all the App Connectors within the group.

View a configuration graph of connected objects.

Edit a configured App Connector group.
Delete an App Connector group.
Go to the App Connectors page to add new App Connectors or manage existing App Connectors.
Go to the App Connector Provisioning Keys page to manage your App Connector provisioning keys.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About App Connectors
Understanding App Connector Throughput
About App Connector Provisioning Keys
About App Connector Groups
