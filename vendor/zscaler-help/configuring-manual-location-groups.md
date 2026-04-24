# Configuring Manual Location Groups

**Source:** https://help.zscaler.com/zia/configuring-manual-location-groups
**Captured:** 2026-04-24 via Playwright MCP.

---

You can add **up to 256 groups**, inclusive of manual and dynamic location groups.

## Adding a manual location group

1. Go to **Administration > Location Management**.
2. Click the **Location Groups** tab.
3. Click **Add Manual Group**.

In the **Add Manual Group** window, for **1. Group Information**:

- **Name** — name for the location group.
- **Description** — optional.
- **Extranet Location Type** — select to create a group of extranet locations.
- **Extranet Resource** — select the extranet that has the locations you want to add to the group. After you select an extranet, you can only add locations that are assigned to that extranet.

Click **Next**.

For **2. Select Locations**:

- Select the checkboxes for the locations or sublocations you want to assign. A location can be assigned independently of its sublocations, and a sublocation independently of its parent location.
- **Up to 32K locations and sublocations** can be added to a group.
- You can search for specific locations or sublocations by name, group name, IP address, proxy port, VPN credential name, ZIA Virtual Service Edge name, or cluster name.

Click **Save** and activate the change.
