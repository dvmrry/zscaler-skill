# About Machine Groups

**Source:** https://help.zscaler.com/zpa/about-machine-groups
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Watch a video about machine groups (shows legacy UI).

A machine group is a set of an organization's internal, local machines that need to connect to Private Access. These local machines are internal directories, such as an Active Directory, that organizations want Private Access to connect to prior to logging into Windows. You can manage machine groups within the Zscaler Admin Console.

Machine groups provide the following benefits and allow you to:

- Associate the Zscaler Client Connector with a machine group.
- Enable Machine Tunnels for Pre-Windows Login to gain access to internal applications even when the device's Zscaler Client Connector is not connected to Private Access.

You can create a new machine group whenever you add a new machine key. Zscaler recommends deploying a new machine group for every machine provisioning key. Devices in a machine group can use Machine Tunnels to provide access to internal applications even when the device's Zscaler Client Connector is not connected to Private Access. The machine provisioning key must be added to the Zscaler Client Connector profile rule for successful Machine Tunnel enrollment. To learn more, see Configuring Zscaler Client Connector App Profiles.

## About the Machine Groups Page

On the Machine Groups page (Administration > Identity > Private Access > Machine Groups), you can do the following:

- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to display the filters.
- Refresh the Machine Groups page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions.
- Expand all rows in the table to see more information about each machine group.
- View a list of all the machine groups that are configured for your organization. For each machine group, you can see the name of the machine group.
- Modify the columns displayed in the table.
- Edit a configured machine group.
- Delete a machine group.
- Display more rows or a different page of the table.
