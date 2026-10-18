# Configuring the Bandwidth Control Policy

**Source:** https://help.zscaler.com/zia/configuring-bandwidth-control-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398771, revision 3244113

---

Click to watch a video about Configuring the Bandwidth Control Policy (shows legacy UI).
The Bandwidth Control policy specifies how an organization's bandwidth is allocated. You can add rules that prioritize business-critical apps and ensure that recreational or non-business-critical applications do not affect productivity. It contains a default rule, which you can edit, but not delete. To learn more, see About Bandwidth Control.
You can also define the bandwidth classes that you want to include in the Bandwidth Control policy before you add rules to the policy or while you're adding the rules. To learn more, see About Bandwidth Classes.
To see how this policy fits into the overall order of policy enforcement, see Understanding Policy Enforcement.
# Policy Execution
The Bandwidth Control rule supports different rule conditions, grouped into categories. A series of AND and OR logical operators are applied between these criteria to form a combination of rule set that is used to evaluate traffic matches. The logical relationship between the categories is AND, and the rule conditions within each category have their own set of logical operators applied, explained as follows:
- **Where** [ Locations OR Location Groups ] AND
- **When:** [ Time ] AND
- **What:** [ Bandwidth Classes AND Protocols ]
# Prerequisites
Before adding rules to the Bandwidth Control rule, ensure that you have configured the resources that the policy references, per your requirements:
- Locations
- Location groups
- Time intervals
- Bandwidth classes
- Protocols
# Configuring the Bandwidth Control Policy
To configure the Bandwidth Control policy of a location:
- 1. Enable Bandwidth Control for the location.
  - From the navigation menu, go to **Infrastructure** > **Location Management** > **Legacy Locations**.
  - To edit the location, click the **Edit** icon.
  - The **Edit Location** window appears.
  - In the **Edit Location** window, configure the **Bandwidth Control** section:
    - **Enforce Bandwidth Control**: Enable to enforce Bandwidth Control for the location.
    - **Download (Mbps)**: Specify the maximum bandwidth limit.
    - **Upload (Mbps)**: Specify the maximum bandwidth limit.
  - See image.
  - Click **Save** and activate the change.
- 2. Enable Bandwidth Control for a sublocation.
  - Go to **Infrastructure** > **Location Management** > **Legacy Locations**.
  - To edit the sublocation, click the sublocation number.
  - The **View Sublocation** window appears.
  - Click the **Edit** icon for the sublocation.
  - In the **Edit Location** window, configure the **Bandwidth Control** section:
    - **Use Location Bandwidth**: Enable this so that any potential bandwidth available at the location will be given to this sublocation. Sharing happens on a first-come, first-serve basis when using this option.
    - **Override**: Enable on the sublocation and then specify the maximum bandwidth limits for **Download (Mbps)** and **Upload (Mbps)**. This bandwidth is dedicated to the sublocation and not shared with others.
    - **Disable**: Disable Bandwidth Control for this sublocation.
  - See image.
  - Click **Save** and activate the change.
- 3. Add rules to the Bandwidth Control policy.
You can then go to the Bandwidth Control dashboard to view your organization's bandwidth usage in real time or go to Interactive Reports to view the Bandwidth Control standard reports.
