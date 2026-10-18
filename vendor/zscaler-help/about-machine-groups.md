# About Machine Groups

**Source:** https://help.zscaler.com/zpa/about-machine-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484671, revision 3239327

---

Watch a video about machine groups (shows legacy UI).
A machine group is a set of an organization's internal, local machines that need to connect to Private Access (ZPA). These local machines are internal directories, such as an Active Directory, that organizations want Private Access to connect to prior to logging in to Windows. You can manage machine groups in the Zscaler Admin Console.
Machine groups provide the following benefits and allow you to:
- Associate the Zscaler Client Connector with a machine group.
- Enable Machine Tunnels for Pre-Windows Login to gain access to internal applications, even when the device's Zscaler Client Connector is not connected to Private Access.
Zscaler recommends deploying a new machine group for every machine provisioning key. Devices in a machine group can use machine tunnels to provide access to internal applications, even when the device's Zscaler Client Connector is not connected to Private Access. The machine provisioning key must be added to the Zscaler Client Connector profile rule for successful machine tunnel enrollment. To learn more, see Configuring Zscaler Client Connector App Profiles.
# About the Machine Groups Page
On the Machine Groups page (Administration > Private Access Authentication > Machine Groups), you can do the following:
- Add a machine group.
  - See instructions.
  - Click Add to open the Add Machine Group drawer, and enter the following information:
    - Name: Enter a name for the group. The name cannot contain special characters, with the exception of periods (.), hyphens (-), and underscores ( _ ).
    - Description: (Optional) Enter a description of the group.
- After a machine group is created, you must assign a machine provisioning key to it. To learn more, see Configuring Machine Provisioning Keys.
- Filter the information that appears in the table. By default, no filters are applied. To learn more, see Using Tables.
- Refresh the Machine Groups page to reflect the most current information.
- Modify the columns displayed in the table.
- View a list of all the machine groups that are configured for your organization. Click the name of the machine group to open the Machine Group Details drawer.
- Edit a machine group.
- Delete a machine group.
- Display more rows or a different page of the table.
