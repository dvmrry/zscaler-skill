# About Location Groups

**Source:** https://help.zscaler.com/zia/about-location-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400541, revision 3246272

---

If you have many locations and associated sublocations within your organization, consider using location groups. You can create manual location groups or dynamic location groups:
- **Manual Location Groups**: When creating a manual location group, you can manually assign any number of locations or sublocations to it.
- **Dynamic Location Groups**: When creating a dynamic location group, you select the location attributes that locations or sublocations must match to be assigned to the group. A dynamic group automatically updates to include any matching locations or sublocations.
- A location or sublocation must match all of a dynamic group's location attributes, including when only some of a location's or sublocation's attributes match. For example, consider that you've created a dynamic location group with the following attributes: the location name starts with "NYC" and the **Enforce Bandwidth Control** setting is enabled. A location named "NYC Office 1" that has **Enforce Bandwidth Control** and **Enforce Firewall Control** enabled is assigned to this group.
The following conditions apply when configuring manual or dynamic location groups:
- A location can join a location group independently of its sublocations, and a sublocation independently of its parent location.
- A location or sublocation can be a member of multiple manual and dynamic location groups.
- You can use location groups to define the scope of a new or existing admin. You can also select location groups for use in policies and reporting (i.e., Insights, Dashboards, etc.).
# About the Location Groups Page
On the Location Groups page (Infrastructure > Location Management > Location Groups), you can do the following:
- Add a manual location group.
- Add a dynamic location group.
- Search for a location group by **Name**, **Description**, **Last Modified By**, **Group Type**, and **Locations.**
- Modify the table and its columns.
- View more information about a location group.
- Edit a location group, including the ability to delete a group.
- View a list of all location groups that were configured for your organization. For location groups, you can see the following:
  - **Name**: The name of the group. You can sort this column.
  - **Type**: Shows if the group is a manual or dynamic location group.
  - **Number of Locations and Sub-Locations**: The number of locations associated with the group. Clicking the number displays the locations (and their sublocations, if applicable) within the Locations page. You can sort this column.
  - **Last Modified By**: The last admin user to modify the group. You can sort this column.
  - **Last Modified On**: The date and time the group was last modified.
  - **Description**: The description of the group, if available.
- From the left-side navigation pane, you can:
  - Go to the Locations page, to configure new locations and their sublocations or manage existing locations.
  - Go to the Azure Virtual WAN Locations page, to view and manage your synced Microsoft Azure hub site locations. This tab is only displayed if you have a Microsoft Azure Virtual WAN integration with Zscaler. To learn more, see About Partner Integrations.
