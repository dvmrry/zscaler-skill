# Configuring Manual Location Groups

**Source:** https://help.zscaler.com/zia/configuring-manual-location-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400546, revision 3245925

---

This article describes how to create a manual location group and how to add your locations and sublocations to a manual group. You can add up to 256 groups, inclusive of manual and dynamic location groups. For a complete list of ranges and limits per feature, see Ranges & Limitations.
# Adding a Manual Location Group
To add a manual location group:
- From the navigation menu, go to Infrastructure > Location Management > Location Groups.
- Click Add Manual Group.
The Add Manual Group window appears.
- In the Add Manual Group window, on the Group Information tab:
  - Name: Enter a name for the location group.
  - Description: (Optional) Enter a description of the location group.
  - Extranet Location Type: Select this if you want to create a group of extranet locations. To learn more, see About Extranet.
  - Extranet Resource: Select the extranet that has the locations you want to add to the group. After you select an extranet, you can only add locations to the group that are assigned to the extranet you selected.
- See image.
- Click Next.
- On the Select Locations tab:
- Select the checkboxes for the locations or sublocations you want to assign to the manual group. You can assign a location to the group independently of its sublocations and a sublocation independently of its parent location. You can add up to 32K locations and sublocations to a group. For a complete list of ranges and limits per feature, see Ranges & Limitations.
- See image.
- To narrow down the list of locations and sublocations, click the Apply Filter icon (). Click Add Filter and then select a location attribute from the drop-down menu. When you configure the attribute, the list automatically updates to show relevant locations and sublocations. You can add multiple attributes to narrow down the list even further. To remove a filter, click the Remove icon ().
- See image.
- You can also search for specific locations or sublocations by entering the name, group name, IP address, proxy port, VPN credential name, Virtual Service Edge for Internet & SaaS (ZIA) name, or cluster name.
- Click Save and activate the change.
# Editing or Deleting a Manual Location Group
To edit or delete a manual location group:
- From the navigation menu, go to Infrastructure > Location Management > Location Groups.
- Locate the location group in the table and click Edit.
- The Edit Manual Group window appears.
- In the Edit Manual Group window, on the Group Information tab, modify the Name, Description, or Extranet Location Type. To update the list of locations or sublocations assigned to the group, click Next. If you want to remove the group, click Delete.
- See image.
- Click Save and activate the change.
