# Configuring Forwarding Policies for Source IP Anchoring Using Private Access

**Source:** https://help.zscaler.com/zia/configuring-forwarding-policies-source-ip-anchoring-using-zpa
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401586, revision 3239498

---

You can configure Forwarding policies to forward Internet & SaaS (ZIA) traffic through Private Access (ZPA) for scanning internal applications and source IP anchoring and for inspecting traffic of certain Private Access application segments with Internet & SaaS. Zscaler provides a predefined Forwarding rule, ZIA Inspected ZPA Apps, which is enabled by default. This rule forwards all Private Access application segment traffic for Internet & SaaS inspection that has the Inspect Traffic with ZIA field enabled. You cannot edit this rule.
The predefined rule is only available if you have Private Access App Inspection. For further assistance, contact Zscaler Support.
To configure a Forwarding rule for Private Access:
- From the navigating menu, go to Internet Access > Policy > Forwarding Control Policy.
- Click Add Rule.
- The Add Forwarding Rule page appears.
- On the Add Forwarding Rule page, you can configure the following sections:
  - Forwarding Rule
  - In the Forwarding Rule section, provide general information about the policy:
    - Rule Name: Enter a user-friendly name for the rule. Forwarding Control automatically creates a rule name, which you can change. The maximum length is 63 characters.
    - Description: (Optional) Enter a description of the rule.
    - Rule Label: Select a rule label to associate with the rule. To learn more, see About Rule Labels.
    - Rule Order: A rule order is automatically assigned and displayed. It determines the rule's position in the ascending order of evaluation used for all rules within the policy. You can modify the rule order, but if you enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
    - To modify the rule order:
      - Click Edit.
      - In the Edit Rule Order drawer that appears, enter the required rule order under Current Rule. You can review the existing rules shown in the drawer and modify your current rule order. You can also adjust the number of rules displayed per page and navigate through the next and previous pages.
      - Click Apply.
    - Admin Rank: Click Edit and select an admin rank 0 to 7 (0 is the highest rank) from the drop-down menu. This option appears if you enable Admin Ranking on the Advanced Settings page. Your assigned admin rank determines the values you can select (e.g., you cannot select a rank higher than your own). The rule's admin rank determines the value you can select for rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
    - Rule Status: Enable this option to enforce the rule actively. Disabling this option does not actively enforce the rule and the service skips it and moves to the next rule. However, the rule does not lose its place in the rule order.
    - Forwarding Method: Select the forwarding method to be used for this rule. Choose ZPA to forward the traffic to a Private Access App Connector through the Private Access gateway.
    - If you select Direct, Zscaler forwards the traffic directly to the destination server using the Zscaler service IP address.
  - Criteria
  - In the Criteria section, when you click Add Criteria, you see the rule condition categories in gray (e.g., Source IP) and the individual rule conditions (e.g., Source IP Groups) under each category.
  - Refer to the following condition categories for details on configuring their individual conditions:
    - Who
      - Locations: Select Any to apply the rule to all locations, or select up to 32 locations. You can also search for a location or click the Add icon to add a new location. To apply this rule to unauthenticated traffic, the rule must apply to all locations.
        - If you want to use the IP address mentioned in the XFF header, use this option instead of the Source IPs Groups option under the Source criteria because the sublocation is used to detect the source IP addresses based on the XFF header.
        - If you want to apply this rule only to remote users’ traffic, select Road Warrior from the Locations field. Rules configured for locations other than Road Warrior also apply to remote user traffic from those locations.
      - The rules configured for the Road Warrior location apply to Z-Tunnel 1.0 and PAC only when the Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors option is enabled in Advanced Settings.
      - Location Groups: Select Any to apply the rule to all location groups, or select up to 32 location groups.
      - Device Groups: Select the device groups to which the rule applies. For Zscaler Client Connector traffic, select the appropriate group based on the device platform. Select Cloud Browser Isolation, IoT, or No Client Connector to apply the rule to Isolation traffic, IoT traffic, or traffic that is not tunneled through Zscaler Client Connector, respectively. You can also search for a device group. Selecting no value ignores this criterion in the policy evaluation.
      - The Cloud Browser Isolation and IoT groups are available only if Zero Trust Browser and IoT Discovery are enabled for your organization.
    - Where
      - Users: Select Any to apply the rule to all users. You can also manually select up to 32 general or special users.
      - Groups: Select Any to apply the rule to all groups, or select up to 32 groups. You can search for groups.
      - Departments: Select Any to apply the rule to all departments, or select up to 32 departments.
      - Contact Zscaler Support to increase the limit of Users, Groups, Departments, or Locations.
    - Applications
    - Source
    - Destination
  - To remove an individual condition from the rule, click the Delete icon. You can expand or collapse individual criteria tiles as needed.
  - Actions
  - In the Actions section, from the Forward to ZPA Gateway drop-down menu, choose the appropriate Private Access gateway. To configure a Private Access gateway, see Configuring Zscaler Private Access Gateway.
  - This field is enabled only if you have selected application segments that require Source IP Anchoring in the Application Segment field, and those application segments are associated with a common Private Access gateway. An empty list indicates that there is no common gateway configured for the selected application segments.
- Click Save and activate the change.
