# Configuring Dynamic Location Groups

**Source:** https://help.zscaler.com/zia/configuring-dynamic-location-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401361, revision 3245927

---

This article describes how to create a dynamic location group and configure location attributes that locations or sublocations must match to be assigned to the dynamic group. You can add up to 256 groups, inclusive of dynamic and manual location groups. For a complete list of ranges and limits per feature, see Ranges & Limitations.
By default, the following predefined dynamic location groups are available in the **Location Groups** tab and are view-only:
- Corporate User Traffic Group
- Guest Wifi Group
- IoT Traffic Group
- Server Traffic Group
- Workload Traffic Group
One of these predefined dynamic location groups is automatically populated in the Dynamic Location Groups field of the Add Location or Add Sublocation window based on the location type selection. The Workload Traffic Group is automatically populated for the location type Workload traffic type.
# Adding a Dynamic Location Group
To add a dynamic location group:
- From the navigation menu, go to **Infrastructure > Location Management > Location Groups**.
- Click **Add Dynamic Group**.
- The **Add Dynamic Group** window appears.
- In the **Add Dynamic Group** window, on the **Group Information** tab:
  - In the **General** section:
    - **Name**: Enter a name for the location group.
    - **Description**: (Optional) Enter a description for the location group.
  - In the **Group Conditions** Section:
  - Select the location attributes that locations or sublocations must match to be assigned to this group. To configure the group conditions:
    - Click **Add New Condition**.
    - From the drop-down menu, select and configure the attribute. You can add any of the following attributes:
      - **City/State/Province**: Select a Boolean operator from the drop-down menu (e.g., **Contains**, **Ends With**, **Equals**, **Starts With**), and then enter at least three letters of the name for a specific city, state, or province. Locations or sublocations for the specified city, state, or province are assigned to the group.
      - **Country**: From the drop-down menu, select the countries. Locations or sublocations for the specified countries are assigned to the group.
      - **Enable AUP**: Enable or disable the switch. If enabled, locations or sublocations that have the **Enable AUP** setting turned on are assigned to the group. If disabled, locations or sublocations that have the setting turned off are assigned to the group.
      - **Enable Caution**: Enable or disable the switch. If enabled, locations or sublocations that have the **Enable Caution** setting turned on are assigned to the group. If disabled, locations or sublocations that have the setting turned off are assigned to the group.
      - **Enforce Authentication**: Enable or disable the switch. If enabled, locations or sublocations that have the **Enforce Authentication** setting turned on are assigned to the group. If disabled, locations or sublocations that have the setting turned off are assigned to the group.
      - **Enforce Bandwidth Control**: Enable or disable the switch. If enabled, locations or sublocations that have the **Enforce Bandwidth Control** setting turned on are assigned to the group. If disabled, locations or sublocations that have the setting turned off are assigned to the group.
      - **Enforce Firewall Control**: Enable or disable the switch. If enabled, locations or sublocations that have the **Enforce Firewall Control** setting turned on are assigned to the group. If disabled, locations or sublocations that have the setting turned off are assigned to the group.
      - **Location Type**: Select a location type from the drop-down menu. You can also search for any one of the following location types:
        - **Corporate user traffic**
        - **Guest Wi-Fi traffic**
        - **IoT traffic**
        - **Server traffic**
        - **Workload Traffic Type**
        - The **Workload Traffic Type** is automatically populated to a sublocation of a location created in the Zscaler Admin Console.
        - **Extranet**
          - **Extranet Resource**: All locations assigned to the extranet you select are added unless they are excluded by another condition.
      - **Managed By**: Search for and select the SD-WAN partner name from the drop-down menu. Locations or sublocations managed by the partner are assigned to the group.
      - **Name**: Select a Boolean operator from the drop-down menu (e.g., **Contains**, **Ends With**, **Equals**, **Starts With**), and then enter the name. Locations or sublocations that have the specified name are assigned to the group.
      - **Use XFF from Client Request**: Enable or disable the switch. If enabled, locations or sublocations that have the **Use XFF from Client Request** setting turned on are assigned to the group. If disabled, locations or sublocations that have the setting turned off are assigned to the group.
  - Repeat these steps to add more than one attribute.
- See image.
- Click **Next**. For **2. Preview Locations**:
- View the list of locations and sublocations that match all the group’s configured attributes. You can search for specific locations or sublocations by entering a name, group name, IP address, proxy port, VPN credential name, Virtual Service Edge name, and cluster name.
- A location or sublocation can still be assigned to a dynamic group when only some of the location's or sublocation's attributes match all the group's configured attributes. For example, consider that you’ve created a dynamic group with the following attributes: the location name starts with “NYC” and the **Enforce Bandwidth Control** setting is enabled. A location named “NYC Office 1” that has **Enforce Bandwidth Control** and **Enforce Firewall Control** enabled can be assigned to this group.
- See image.
- Click **Save** and activate the change.
When saved, the dynamic group continues to automatically update to include any new matching locations or sublocations.
# Editing or Deleting a Dynamic Location Group
To edit or delete a dynamic location group:
- From the navigation menu, go to **Infrastructure > Location Management > Location Groups**.
- Locate the location group in the table and click **Edit**.
- The **Edit Dynamic Group** window appears.
- In the **Edit Dynamic Group** window, modify the **Name**, **Description**, or **Group Conditions**. If you want to remove the group, click **Delete**.
- See image.
- Click **Save** and activate the change.
