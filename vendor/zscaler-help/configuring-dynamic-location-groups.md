# Configuring Dynamic Location Groups

**Source:** https://help.zscaler.com/zia/configuring-dynamic-location-groups
**Captured:** 2026-04-24 via Playwright MCP.

---

You can add up to **256 groups**, inclusive of dynamic and manual location groups.

## Predefined dynamic location groups

The following predefined dynamic location groups are view-only:

- **Corporate User Traffic Group**
- **Guest Wifi Group**
- **IoT Traffic Group**
- **Server Traffic Group**
- **Workload Traffic Group**

One of these is **automatically populated in the Dynamic Location Groups field** of the Add Location or Add Sublocation window based on the location type selection. The **Workload Traffic Group** is automatically populated for the **Workload traffic** location type.

## Adding a dynamic location group

1. Go to **Administration > Location Management**.
2. Click the **Location Groups** tab.
3. Click **Add Dynamic Group**.

In the **Group Conditions** section, select the location attributes that locations or sublocations must match to be assigned.

### Available condition attributes

- **City / State / Province** — Boolean operator (Contains, Ends With, Equals, Starts With) + ≥3-letter prefix.
- **Country** — one or more selected countries.
- **Enable AUP** — on/off; members have the setting toggled accordingly.
- **Enable Caution** — on/off.
- **Enforce Authentication** — on/off.
- **Enforce Bandwidth Control** — on/off.
- **Enforce Firewall Control** — on/off.
- **Location Type** — one of: Corporate user traffic / Guest Wi-Fi traffic / IoT traffic / Server traffic / Workload traffic type / Extranet. Workload is auto-populated for sublocations created via the Cloud & Branch Connector Admin Portal.
- **Extranet Resource** — all locations assigned to the extranet are added unless excluded by another condition.
- **Managed By** — SD-WAN partner name.
- **Name** — Boolean operator + name text.
- **Use XFF from Client Request** — on/off.

### Preview

View the list of locations and sublocations that match **all** the group's configured attributes. You can search by name, group name, IP address, proxy port, VPN credential name, ZIA Virtual Service Edge name, or cluster name.

A location can still be assigned when only some of its attributes match — as long as all of the group's **configured** attributes are present. Example: a group with "name starts with NYC" + "Enforce Bandwidth Control = on" will match a location named "NYC Office 1" that also has Enforce Firewall Control enabled.

Click **Save** and activate the change. A saved dynamic group continues to automatically update to include new matching locations or sublocations.
