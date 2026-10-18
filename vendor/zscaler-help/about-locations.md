# About Locations

**Source:** https://help.zscaler.com/zia/about-locations
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399236, revision 3244414

---

Locations identify the various networks from which your organization sends its internet traffic. When an organization forwards its traffic to the Zscaler service through a GRE or IPSec tunnel, Zscaler service provisions your organization's IP addresses, which you then add as locations in the Zscaler Admin Console. You can either add locations individually or import a CSV file with your locations.
When the Zscaler service receives traffic, it checks whether the traffic is from a known location (a location that is configured on the Zscaler Admin Console), or from an unknown location (remote user traffic). If the traffic is from a known location, the service processes the traffic based on the location settings. For example, the service checks whether the location has authentication enabled and proceeds accordingly. It also applies any location policies that you configure and logs Internet activity by location.
If your organization has thousands of locations or sublocations, then the Locations page and any policy that references locations when selected might cause noticeable loading time to retrieve and display the full location list.
Locations provide the following benefits and enable you to:
- Identify the locations from which your organization sends its traffic.
- Associate a VPN credential, Static IP address, and GRE tunnel with a location.
- Create sublocations for private networks.
- Associate Virtual Service Edges with a specific location.
- Establish upload and download bandwidth limits.
- Enable various features such as firewall control, AUP, Caution, authentication, and reading the XFF header from forwarded traffic.
# Naming Locations & Sublocations
You can use a previously deleted location or sublocation name when you create a new location or sublocation. However, you cannot use a deleted name when modifying an existing location or sublocation. If you want to use a deleted name when creating a new location or sublocation, complete the following steps:
- Take note of the existing location's or sublocation's attributes.
- Delete the location or sublocation.
- Create a new location or sublocation with the deleted name and the proper attributes.
The Zscaler Admin Console displays an error if you attempt to use a name that already belongs to an existing location or sublocation. It also displays this error if you attempt to change an existing location's or sublocation's name to a previously deleted name without completing the preceding steps.
See image.
# About the Locations Page
On the Locations page (Infrastructure > Location Management > Legacy Locations), you can do the following:
- Add a location.
- Import new locations and sublocations, or modify existing locations and sublocations, using a CSV file.
- Download a CSV file that lists your locations and sublocations.
- Download a Sample Import CSV file that shows the correct CSV format for adding or modifying locations and sublocations.
- Filter the list of locations and sublocations.
- To narrow down the list of locations and sublocations, click the Apply Filter icon (). Click Add Filter and then select a location attribute from the drop-down menu. After you configure the attribute, the list automatically updates to show relevant locations and sublocations. You can add multiple attributes to narrow down the list even further. To remove a filter, click the Remove icon ().
- Search for a location or sublocation.
- View a list of all locations and sublocations that were configured for your organization. For each location, you can see:
  - Name: The name of the location or sublocation.
  - Sublocations: The number of sublocations for the location. If you click the number in this column, the View Sublocation window appears.
  - IP Addresses: The static IP addresses for your local gateway for the location.
  - The organization's shared public IP addresses cannot be used for a specific tenant's location.
  - Description: Additional notes or information about the location.
  - Proxy Ports: The subscribed proxy ports for the location, if applicable.
  - Use XFF from Client Request: Indicates whether the Use XFF from Client Request feature is enabled for the location.
  - Authentication: Indicates whether the Enforce Authentication feature is enabled for the location. If you are also using the Enable IP Surrogates feature, this column displays the specified Idle Time to Disassociation.
  - Firewall Filtering: Indicates whether the Enforce Firewall Control feature is enabled for the location.
  - Bandwidth: If the Enforce Bandwidth Control feature is enabled for the location, the download and upload bandwidth limits are displayed in Mbps.
  - Virtual Service Edges: The Virtual Service Edges and Virtual Service Edge clusters for the location, if applicable.
  - IPS Control: Indicates whether the IPS control feature is enabled for the location.
  - Group: The location group associated with the location and its sublocations.
  - The Workload Traffic Group is automatically populated for locations with the Workload traffic location type.
  - Managed By: The name of the SD-WAN partner that manages the location.
  - Location Type: The primary type of traffic for the location.
  - The location type, Workload traffic type, automatically applies to a location created in the Zscaler Admin Console.
- For location lists, you can view up to 100 locations on a page.
- Modify the table and its columns.
- Add a sublocation.
- Edit a location or sublocation, including the ability to delete a location.
