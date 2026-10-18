# Adding an Instant Messaging Rule for Cloud App Control

**Source:** https://help.zscaler.com/zia/adding-instant-messaging-rule-cloud-app-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400156, revision 3244487

---

You can create rules to control access to specific cloud applications. Cloud apps are organized into categories to facilitate defining rules for similar applications.
Instant messaging (IM) has become nearly as universal as email. Today, more and more people depend on this simple text-based application to stay in touch with friends and colleagues. Instant messaging introduces potential risk and liability to enterprises in several ways, such as:
- Instant messaging provides transport for proprietary data to escape the corporate network via file transfers.
- Users might get involved in conversations and relationships that violate corporate policy.
- Instant messaging can affect productivity at work.
You can completely block or selectively disable IM applications. Client-based IMs, such as Trillian, as well as web IMs, such as Google Chat and Zendesk Chat, are supported. Admins can completely block the IM or just block file transfers. IM file transfers are scanned for viruses and for DLP (if the respective policies are set).
# Adding a Rule for Instant Messaging Apps
To add a rule for Instant Messaging apps:
- From the navigation menu, go to **Data Security** > **Inline CASB** > **SaaS/Cloud App Policy**.
- In the left-side menu, select **Instant Messaging**, then click **Add Rule**.
- The **Instant Messaging** page appears.
- On the **Instant Messaging** page, you can configure the following sections:
  - Criteria
  - In the **Criteria** section, when you click the **Add Criteria** drop-down menu, you see the rule condition categories in gray (e.g., **Who**) and the individual rule conditions (e.g., **Users**, **Groups**, and **Departments**) under each category.
  - See image.
  - The conditions contain preconfigured values (e.g., **Users**, **Groups**, and **Departments**). A multi-select window with a search bar appears. You can select values by selecting the checkbox for individual items or by clicking **Select All**. After selecting the values, click outside the window to close it. To clear selected items, click the field to open the multi-select window, then use the **Remove** icon displayed for individual entries. To remove all selected values, click **Remove All**.
  - See image.
  - Refer to the following condition categories for details on configuring their individual conditions:
    - Applications
      - **Cloud Applications**: Select **Any** to apply the rule to all cloud applications in this category, or select any number of cloud applications. You can also search for applications. By default, this field displays the first 100 cloud applications.
      - **Cloud Application Instances**: Select the cloud application instances to which the rule applies. You can select a maximum of 8 instances per rule.
      - The cloud application instance appears only if its parent application is selected as the cloud application.
      - **Cloud Application Risk Profile**: Select a profile to which the rule applies.
      - You can either select the **Cloud Application Risk Profile** or the **Cloud Applications** field for the rule.
      - **Adaptive Access Profile**: This field shows the adaptive access profile that you want to enforce for the policy. The profiles contain contextual parameters that are constantly monitored for dynamic access control. This option is currently not functional in the Zscaler Admin Console. However, you can contact your Zscaler Account team to subscribe to Experience Center to use this feature. To learn more, see Understanding Adaptive Access Engine.
    - Who
      - **Users**: Select **Any** to apply the rule to all users, or select up to 32 users under **General Users**. If you've enabled the Policy for Unauthenticated Traffic, you can select **Special Users** to apply this rule to all unauthenticated users, or select specific types of unauthenticated users. You can search for users.
      - **Groups**: Select **Any** to apply the rule to all groups, or select up to 32 groups. You can search for groups.
      - **Departments**: Select **Any** to apply the rule to all departments, or select up to 32 departments. If you've enabled the Policy for Unauthenticated Traffic, you can select **Special Departments** to apply this rule to all unauthenticated transactions. You can search for departments.
        - Any rule that applies to unauthenticated traffic must apply to all groups and departments. So, if you have chosen to apply this rule to unauthenticated traffic for either **Users** or **Departments**, select **Any** from the drop-down menus for **Groups** and **Departments**.
        - Contact Zscaler Support to increase the limit of **Users**, **Groups**, or **Departments**.
    - Where
      - **Locations**: Select **Any** to apply the rule to all locations, or select up to 32 locations. You can also search for a location.
      - Contact Zscaler Support to increase the limit of **Locations**.
      - **Location Groups**: Select **Any** to apply the rule to all location groups, or select up to 32 location groups. You can also search for a location group.
    - When
    - **Time**: Select **Always** to apply this rule to all time intervals, or select up to two time intervals. You can also search for a time interval.
    - Devices & Agents
      - **Devices**: Select the devices to which the rule applies. You can also search for a device. Selecting no value ignores this criterion in the policy evaluation.
      - **Device Groups**: Select the device groups for which you want to apply the rule. For Zscaler Client Connector traffic, select the appropriate group based on the device platform. Select **Cloud Browser Isolation**, **IoT**, or **No Client Connector** to apply the rule to isolation traffic, IoT traffic, or to traffic that is not tunneled through Zscaler Client Connector, respectively. You can also search for a device group. Selecting no value ignores this criterion in the policy evaluation.
      - The **Cloud Browser Isolation** and **IoT** groups are available only if Zero Trust Browser (formerly Isolation) and IoT discovery are enabled for your organization, respectively.
      - **Device Trust Level**: Select the device trust level values (**High Trust**, **Medium Trust**, **Low Trust**, or **Unknown**) to which the rule applies. While the **High Trust**, **Medium Trust**, or **Low Trust** evaluation is applicable only to Zscaler Client Connector traffic, **Unknown** evaluation applies to all traffic. Selecting no value ignores the criterion in the policy evaluation.
      - The trust levels assigned to the devices are based on your posture configurations in the Zscaler Admin Console.
      - **User Agent**: Select **Any** to apply the rule to all user agents, or select any number of user agents. You can also search for an agent.
      - **User Risk Profile**: Select **Any** to apply the rule to all user risk score levels, or select the user risk score levels to which the rule applies. Selecting no value ignores this criterion in the policy evaluation.
      - Users are assigned a risk score based on their browsing activities. A range of risk scores is grouped as a risk score level.
      - By default, the following user risk score levels are available:
        - **Low**: Level with user risk scores ranging from 0 to 29
        - **Medium**: Level with user risk scores ranging from 30 to 59
        - **High**: Level with user risk scores ranging from 60 to 79
        - **Critical**: Level with user risk scores ranging from 80 to 100
      - Contact Zscaler Support to customize the user risk score range of these levels for your organization.
  - You can expand or collapse all the criteria using the **Expand All** or **Collapse All** button, respectively.
  - See image.
  - Actions
  - In the **Actions** section, for **Chatting** and **File Transfers**, select one of the following actions to apply when the rule conditions are met:
  - You can choose either **Allow** or **Block** for **File Transfers**.
    - Allow
    - Choose to allow the users to chat and transfer files on the selected applications.
      - **Daily Bandwidth Quota (MB)**: (Optional) The bandwidth quota includes data uploaded to and downloaded from the cloud application. To enforce the quota on each location, do not select specific users, groups, or departments. To enforce the quota on specific users, groups, or departments, SSL/TLS Inspection and authentication must be enabled. If a user comes from a known location, the quota is reset at midnight based on the location's time zone; for remote users, the quota is reset based on the organization’s time zone. The minimum value you can enter is 10 MB and the maximum value is 100K MB.
      - **Daily Time Quota (min)**: (Optional) The time quota is based on the amount of time elapsed in a session while uploading and downloading data. The session idle times are ignored. The minimum value you can enter is 15 minutes and the maximum value is 600 minutes.
      - **Cascade to URL Filtering**: Enable this option to enforce the URL Filtering policy on a transaction, even after it's explicitly allowed by the Cloud App Control policy. However, the URL Filtering policy doesn't apply if the Cloud App Control policy blocks the transaction.
      - This field appears only when the **Allow Cascading to URL Filtering** option is disabled on the **Advanced Settings** page (**Internet Access** > **Setting** > **Advanced Settings**).
    - Caution
    - Choose to display an EUN that cautions users before allowing them access to the selected applications.
    - You can select this action for only one of the following request methods: **CONNECT**, **GET**, or **HEAD**.
      - **Daily Bandwidth Quota (MB)**: (Optional) The bandwidth quota includes data uploaded to and downloaded from the cloud application. To enforce the quota on each location, do not select specific users, groups, or departments. To enforce the quota on specific users, groups, or departments, SSL/TLS Inspection and authentication must be enabled. If a user comes from a known location, the quota is reset at midnight based on the location's time zone; for remote users, the quota is reset based on the organization’s time zone. The minimum value you can enter is 10 MB and the maximum value is 100K MB.
      - **Daily Time Quota (min)**: (Optional) The time quota is based on the amount of time elapsed in a session while uploading and downloading data. The session idle times are ignored. The minimum value you can enter is 15 minutes and the maximum value is 600 minutes.
      - **Cascade to URL Filtering**: Enable this option to enforce the URL Filtering policy on a transaction, even after it's explicitly allowed by the Cloud App Control policy. However, the URL Filtering policy doesn't apply if the Cloud App Control policy blocks the transaction.
      - This field appears only when the **Allow Cascading to URL Filtering** option is disabled on the **Advanced Settings** page (**Internet Access** > **Setting** > **Advanced Settings**).
    - Block
    - Choose to block the users from chatting, transferring files, or both on the selected applications.
    - Conditional
    - Choose to conditionally allow the users to access the selected applications.
      - **Conditional Access**: Allows access to the selected applications by enforcing step-up authentication. Step-up authentication enforces stronger authentication and only provides access to applications when the authentication satisfies the additional authentication levels. In the **Authentication** **Level** field, select an authentication level from the drop-down menu. The authentication levels must be configured in the Zscaler Admin Console before configuring a policy in the Zscaler Admin Console to select this option. When you try to access applications that require additional authentication, Zscaler Client Connector displays a pop-up notification prompting you to verify your access. To learn more, see Understanding Step-Up Authentication.
      - This option is available only if your organization is provisioned with the Authentication Service for end users and the traffic forwarding method is Zscaler Client Connector. However, if your traffic is routed via a Private Service Edge for Internet & SaaS (ZIA) or Virtual Service Edge for Internet & SaaS, conditional access is not supported and the user access to the applications is blocked with a notification from the browser. Conditional access doesn't apply to isolation traffic. To enable this feature, you can raise a provisioning support ticket.
      - **Daily Bandwidth Quota (MB)**: (Optional) The bandwidth quota includes data uploaded to and downloaded from the cloud application. To enforce the quota on each location, do not select specific users, groups, or departments. To enforce the quota on specific users, groups, or departments, SSL/TLS Inspection and authentication must be enabled. If a user comes from a known location, the quota is reset at midnight based on the location's time zone; for remote users, the quota is reset based on the organization’s time zone. The minimum value you can enter is 10 MB and the maximum value is 100K MB.
      - **Daily Time Quota (min)**: (Optional) The time quota is based on the amount of time elapsed in a session while uploading and downloading data. The session idle times are ignored. The minimum value you can enter is 15 minutes and the maximum value is 600 minutes.
    - Isolate
    - Choose to isolate all the traffic that matches the cloud app control rule through a remote browser. To learn more, see What Is Zero Trust Browser?
    - This action is available only if Zero Trust Browser is enabled for your organization.
      - **Isolation Profile**: Appears when you select **Isolate**. You can choose the isolation profiles to which the rule applies.
      - Ensure to create isolation profiles for your organization.
      - **Daily Bandwidth Quota (MB)**: (Optional) The bandwidth quota includes data uploaded to and downloaded from the cloud application. To enforce the quota on each location, do not select specific users, groups, or departments. To enforce the quota on specific users, groups, or departments, SSL/TLS Inspection and authentication must be enabled. If a user comes from a known location, the quota is reset at midnight based on the location's time zone; for remote users, the quota is reset based on the organization’s time zone. The minimum value you can enter is 10 MB and the maximum value is 100K MB.
      - **Daily Time Quota (min)**: (Optional) The time quota is based on the amount of time elapsed in a session while uploading and downloading data. The session idle times are ignored. The minimum value you can enter is 15 minutes and the maximum value is 600 minutes.
      - **Cascade to URL Filtering**: Enable this option to enforce the URL Filtering policy on a transaction, even after it's explicitly allowed by the Cloud App Control policy. However, the URL Filtering policy doesn't apply if the Cloud App Control policy blocks the transaction.
      - This field appears only when the **Allow Cascading to URL Filtering** option is disabled on the **Advanced Settings** page (**Internet Access** > **Setting** > **Advanced Settings**).
  - See image.
  - Details
  - In the **Details** section, provide general information about the rule:
    - **Rule Name**: Enter a unique name for the rule or use the default name.
    - **Add Description**: (Optional) Enter additional notes or information. The description cannot exceed 10,240 characters.
    - **Add Rule Label**: Select a rule label to associate it with the rule. To learn more, see About Rule Labels.
    - **Edit Rule Order**: Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule’s place in the order. You can change the value, but if you’ve enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
    - **Edit Admin Rank**: Enter a value from 0 to 7 (0 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule’s admin rank determines the value you can select in the rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
    - **Rule Status**: An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.
  - See image.
  - Rule Expiration
  - In the **Rule Expiration** section, you can define the validity of the rule:
    - **Enable Rule Expiration**: Enable this option to set a validity period for the rule.
      - **Start Date and Time**: Select a start date and time. The rule is valid starting on this date and time.
      - **End Date and Time**: Select an end date and time. The rule ceases to be valid on this date and time.
      - **Time Zone**: Select the time zone in which the rule is valid.
  - You can use the rule expiration feature to temporarily allow or block access for a set period of time to an application if any configured rules block or allow access to it, respectively.
  - After the rule expires, Zscaler either blocks or allows the traffic based on the default rules configured for your organization.
  - See image.
  - Notification
  - (Optional) In the **Notification** section, you can enable browser notification template or end user notifications (EUNs) to be triggered by the rule:
    - **Browser Notification Template**: Select a browser-based EUN message from the drop-down menu to display the message on the browser when the user activity triggers the Cloud App Control policy rule.
    - This field appears when the application access is set to either **Caution** or **Block**.
    - See image.
    - **End User Notification**: Select **Show** to show the Zscaler Client Connector-based EUN message on endpoints when the user activity triggers the Cloud App Control policy rule, or select **Hide** if you don't want an EUN message to appear. This field is set to **Show** by default.
      - **Notification Message**: Select a notification message that you want to show as the Zscaler Client Connector-based EUN. This field is set to the **Default** notification message if no message is selected from the drop-down menu.
    - This field appears when the granular action is blocked for the selected applications.
    - See image.
- Click **Save** and activate the change.
To learn how this policy fits into the overall order of policy enforcement, see Understanding Policy Enforcement.
