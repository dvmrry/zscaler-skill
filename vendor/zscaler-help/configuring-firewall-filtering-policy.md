# Configuring the Firewall Filtering Policy

**Source:** https://help.zscaler.com/zia/configuring-firewall-filtering-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399876, revision 3238357

---

Watch a video about Firewall Control, including how to configure the Firewall Filtering policy (shows legacy UI).
You can add rules to the Firewall Filtering policy to allow or block specific types of traffic from your network to the internet based on the configured rule conditions. The Firewall Filtering policy has a default rule, which ensures that any traffic that is not explicitly allowed to or from the internet is blocked. In addition to the default rule, the policy includes a few predefined, built-in rules that can be activated as needed.
You can capture and store the traffic blocked through this policy as PCAP files. To learn more, see About Traffic Capture Settings.
After configuring the Firewall Filtering policy rules, you must enable Firewall Control for known locations to apply the rules to the corresponding location traffic. Additionally, you might consider configuring NAT Control and DNS Control policy rules and custom ports. Optionally, you can apply rules to remote user traffic forwarded via Zscaler Client Connector Zscaler Tunnel (Z-Tunnel) 1.0 and PAC files by selecting Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors in Advanced Settings.
# Policy Execution
The Firewall Filtering policy supports different rule conditions, grouped into categories. A series of AND and OR logical operators are applied among the criteria to form a combination of rule set that is used to evaluate traffic matches. The logical relationship between the categories is AND, and the rule conditions within each category have their own set of logical operators applied, explained as follows:
- **Who**: (Users OR Groups OR Departments) AND
- **What**: (Devices OR Device Groups) AND
- **Risk**: (Workload Groups OR Device Trust Level) AND
- **Where**: (Locations OR Location Groups) AND
- **When**: Time AND
- **Services**: (Network Service Groups OR Network Services) AND
- **Applications**: [ (Network Application Groups OR Network Applications OR Application Service Groups) AND (Endpoint Applications OR Endpoint Application Tags) AND Endpoint Application Risk Level AND ZPA Application Segment ] AND
- **Source IP**: (Source IPv4 Groups OR Source IPv6 Groups OR IP Addresses OR Countries) AND
- **Destination IP**: (Destination IPv4 Groups OR Destination IPv6 Groups OR Destination Addresses OR Countries OR URL Categories)
# Prerequisites
Before adding rules to the Firewall Filtering policy, ensure that you have configured the resources that the policy references:
- Users, groups, departments, locations, and sublocations to which the IPS Control policy rules apply.
- Location groups
- Time intervals
- Workload groups
- Network services. You can modify network services to edit services, add custom services, and create groups.
- Network applications. You can create network application groups as needed.
- Source and destination IP address groups
- Optionally, IPv6 configuration.
# Adding a Firewall Filtering Rule
To add a Firewall Filtering policy rule:
- From the navigation menu, go to **Internet Access** > **Policy** > **Firewall Control**.
- The **Firewall Filtering Policy** tab is selected.
- Click **Add Rule**.
- The **Add Rule** page appears.
- On the **Add Rule** page, you can configure the following sections:
  - Criteria
  - In the **Criteria** section, when you click **Add Criteria**, you see the rule condition categories in gray (e.g., Source IP) and the individual rule conditions (e.g., Source IPv4 Groups) under each category.
  - See image.
  - After you click on the various conditions, you notice that some conditions contain preconfigured values (e.g., Users and Locations) and others require manual value specification (e.g., IP Addresses).
    - Criteria with Preconfigured Values
    - For conditions with preconfigured values, a multi-select window with a search bar appears. You can select values by selecting the checkbox for individual items or by clicking **Select All**. After selecting the values, click outside the window to close it.
    - To clear selected items, click the field to open the multi-select window, then use the **Remove** icon displayed for individual entries. To remove all selected values, click **Remove All**.
    - See image.
    - Criteria Requiring Manual Value Specification
    - For conditions without preconfigured values, manually enter the value in the field, then click **Add**. To add multiple entries, enter each value and click **Add** or press Enter.
    - You can also perform the following actions:
      - Remove items by clicking the **Delete** icon for individual entries or by using the **Remove All** option.
      - The entries are paginated, and you can select the number of items to display per page.
      - You can specify the page number to view, or use the **Next** and **Previous** icons to navigate through different pages.
    - See image.
  - Refer to the following condition categories for details on configuring their individual conditions:
    - Who
    - Contact Zscaler Support to increase the default limit for **Users**, **Groups**, **Departments**, or **Locations**.
      - **Users**: Select up to 32 organization users to which the rule applies.
      - **Groups**: Select up to 32 user groups to which this rule applies.
      - **Departments**: Select up to 32 departments to which the rule applies.
    - If you do not select specific values for any of these fields, the field is set to **Any** by default, and the criterion is ignored during policy evaluation.
    - If you've enabled the policy for unauthenticated users under Advanced Settings and want to apply this rule to unauthenticated traffic, you can do so by making selections accordingly in the **Users** and **Departments** fields. To learn more, see Configuring Policies for Unauthenticated Traffic.
    - What
      - **Devices**: Select the devices for which you want to apply the rule. Selecting no value ignores the criterion in the policy evaluation.
      - **Device Groups**: Select the device group for which you want to apply the rule. For Zscaler Client Connector traffic, select the appropriate group based on the device platform. Select **Cloud Browser Isolation** or **No Client Connector** to apply the rule to isolation traffic or to traffic that is not tunneled through Zscaler Client Connector, respectively. Selecting no value ignores the criterion in the policy evaluation.
      - The **Cloud Browser Isolation** group is available only if Zero Trust Browser (formerly Isolation) is enabled for your organization.
    - Risk
      - **Workload Groups**: Select up to 8 workload groups for which you want to apply the rule. Selecting **None** ignores this criterion during policy evaluation.
      - **Device Trust Level**: Select the device trust level values (**High Trust**, **Medium Trust**, **Low Trust**, or **Unknown**) to which the rule applies. While the **High Trust**, **Medium Trust**, or **Low Trust** evaluation is applicable only to Zscaler Client Connector traffic, **Unknown** evaluation applies to all traffic. Selecting no value ignores the criterion in the policy evaluation.
      - The trust levels assigned to the devices are based on your posture configurations in the Zscaler Admin Console.
    - Where
      - **Locations**: Select up to 32 locations to which the rule applies.
      - **Location Groups**: Select up to 32 location groups to which the rule applies.
    - If you do not select specific location groups, the field is set to **Any** by default, and this criterion is ignored during policy evaluation.
    - To apply this rule only to remote user traffic, select **Road Warrior** for **Locations**. You must also ensure that you have enabled the **Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors** option in Advanced Settings for policies configured for remote users to take effect. Rules configured for locations other than **Road Warrior** also apply to remote user traffic from those locations.
    - When
    - **Time**: Select up to two time intervals during which the rule applies. By default, the field is set to **Always**.
    - Services
      - **Network Services:** Select the network services to which the rule applies. By default, this field is set to **Any**. If you do not select specific network services, the field remains set to **Any**, and the criterion is ignored during policy evaluation.
      - In standard mode, RTSP applications use RTP and RTCP. This means that if RTSP applications are allowed, then RTP and RTCP connections (which are dynamically created by RTSP) are automatically allowed too. This happens even if there is a Firewall rule to block RTP and RTCP Network Applications. This does not happen if the RTSP application is in interleaved mode.
      - **Network Service Groups:** Select the network service groups to which the rule applies.
    - Applications
      - **Network Application Groups**: Select the application groups that you want to control with this rule. The service provides predefined applications that you can group, but not modify.
      - **Network Applications:** Select the applications that you want to control with this rule. By default, this field is set to **Any**. If you do not select specific applications, the field remains set to **Any**, and the criterion is ignored during policy evaluation. The service provides predefined applications, which you can group, but not modify.
      - Network services and application services configured in Zscaler are identified in the first packet, leading to immediate policy action. In contrast, multiple packets are typically required by deep packet inspection to identify network applications before a policy action can take place. Therefore, Zscaler recommends that you rank firewall filtering rules for network applications lower than rules for network services or application services to prevent packets from being allowed unnecessarily from traffic that would otherwise be blocked by rules using first-packet identification. To learn more, see About Network Applications.
      - **Application Service Groups**: Select the application service groups that you want to control with this rule. The service provides predefined application services that you can group, but not modify.
      - **ZPA Application Segment:** Select **Any** to apply the rule to all Private Access (ZPA) application segments, or select up to 255 Private Access application segments. The list displays only those Private Access application segments that have the Source IP Anchor option enabled.
      - If you select the **Inspect App Segments** option from the list, then the configured rule applies to all the Private Access application segments paired to your Internet & SaaS (ZIA) tenant. This option is only available if **SIPA App Segments** is enabled for your organization.
      - **Endpoint Applications**: Choose whether the rule should specifically include the selected endpoint applications, or exclude them to cover all other non-specified applications. You can designate up to 100 endpoint applications to govern traffic originating from these selected applications.
      - Zscaler Endpoint Context leverages telemetry from Zscaler Client Connector to enrich an inventory of frequently targeted applications found on endpoint devices. These endpoint applications and their associated tags are used as policy rule criteria to implement dynamic, risk-based, and application-aware security controls.
      - **Endpoint Application Tags**: Choose whether the rule should specifically include the selected endpoint application tags, or exclude them to cover all other non-specified application tags. You can select up to 100 tags that group endpoint applications by category or theme. This applies the policy rule to any traffic coming from applications linked to those tags.
      - **Endpoint Application Risk Level**: You can apply the rule based on the risk profile of endpoint applications, with options including **High**, **Medium**, **Low**, and **Unknown**.
    - Source IP
      - **Source IPv4 Groups**: Select the source IPv4 groups that you want to control with this rule.
      - **Source IPv6 Groups**: To control source IPv6 addresses with this rule, select the **All IPv6** group, which is the predefined source IPv6 group for all IPv6 addresses.
      - Custom source IPv6 groups are currently not supported. To learn more, see About Source IP Groups.
      - **IP Addresses**: Enter addresses (IPv4 only) in any of the following formats:
        - An individual address (e.g., 192.0.2.1)
        - A subnet (e.g., 192.0.2.0/24)
        - An address range (e.g., 192.0.2.1 - 192.0.2.5)
      - Specifying individual, subnet, or range of IPv6 addresses is currently not supported.
      - **Countries**: To apply the rule to traffic from specific countries, select the traffic's source country. The traffic's country of origin is determined using the geolocation of the client's IP address. When configuring this criterion, you can either use the **Include** option to match the rule on the specified countries or use the **Exclude** option to match the rule on all countries except those that are selected.
      - When using the **Include** option, you can select specific countries or leave the field set to the default value, **Any**, which causes the criterion to be ignored during policy evaluation. However, selecting countries is mandatory when using the **Exclude** option.
    - Destination IP
      - **Destination IPv4 Groups**: Select the destination IPv4 groups that you want to control with this rule.
      - **Destination IPv6 Groups**: To control destination IPv6 addresses with this rule, select the **All IPv6** Group, which is the default destination IPv6 group for all IPv6 addresses.
      - Custom destination IPv6 groups are currently not supported. To learn more, see About Destination IP Groups.
      - **Destination Addresses**: Enter addresses (IPv4 only) in any of the following formats:
        - An individual address (e.g., 192.0.2.1)
        - A subnet (e.g., 192.0.2.0/24)
        - An address range (e.g., 192.0.2.1 - 192.0.2.5)
      - Specifying individual, subnet, or range of IPv6 addresses is currently not supported.
      - You can also add FQDNs for applications with multiple or frequently changing IPv4 addresses. Wildcard FQDNs are also supported with an asterisk (*) as the wildcard character. For guidelines to configure wildcard FQDNs, see Configuring Destination IP Groups. When the rule is activated, FQDNs are resolved to their corresponding IP addresses and stored by the Zscaler service. To obtain the IP address of a domain, DNS queries are made until no new IP addresses are returned in two consecutive DNS responses. The resolved IP address(es) is then stored for a period of twice the Time to Live (TTL) value in the DNS record.
      - As both FQDN and IP address values are available for a destination, this criterion applies to the web as well as non-web traffic examined by the Zscaler service. The Zscaler service employs an IP address match when evaluating non-web traffic using this criterion, whereas the web traffic evaluation relies on an FQDN match against the hostname in the HTTP/FTP header or Server Name Indication (SNI) for HTTPS.
      - To evaluate wildcard FQDNs against non-web traffic, Zscaler requires the IP address to which the FQDN resolves. Hence, for non-web traffic, the Zscaler service should be aware of the preceding DNS request/response. To ensure this, forward all of your DNS traffic to the Zscaler service if you intend to configure wildcard FQDNs in policies. Additionally, a subscription or Internet & SaaS edition with DNS Control is required. This functionality is included in Advanced Firewall and DNS Control and Internet & SaaS editions. To learn how DNS resolution is handled by the Zscaler service, see Handling DNS Resolution for Various Traffic Forwarding Methods.
      - Wildcard FQDN match against web traffic (HTTP and TLS/SNI) can function without meeting these conditions.
      - If a rule blocks traffic solely based on the destination, removing destination IP addresses or FQDNs from the rule should be done cautiously as that might result in the rule blocking all traffic without requiring any criteria match.
      - **Countries**: Select the countries to apply the rule to the outgoing traffic that matches the specified countries. The country where the destination server is placed is determined using the geolocation of the server's IP address. By default, this field is set to **Any**. If you do not select specific countries, the field remains set to **Any**, and the criterion is ignored during policy evaluation.
      - **URL Categories**: Select the URL categories for which you want to control traffic. By default, this field is set to **Any**. If you do not select specific URL categories, the field remains set to **Any**, and the criterion is ignored during policy evaluation. You can also select custom TLD categories from this field.
      - You can identify destinations based on the custom URL category of the domain. You can also use a custom URL category based on a specific database address (FQDN) or a wildcard FQDN which allows destinations to be placed on the allowlist or denylist as desired. To learn more, see About URL Categories.
      - Zscaler Firewall examines only the host portion of a URL (i.e., domain and subdomain) and ignores the URL path. For example, if a rule is configured to block traffic directed to www.subdomain.example.com/subdirectory/path.html via a URL category, all traffic bound to www.subdomain.example.com is blocked.
      - Unlike the FQDNs specified directly in a rule via the **IP Address or Wildcard FQDN** field, FQDNs specified through a URL category are not pre-resolved to an IP address and stored by the Zscaler service. This restricts the URL category’s application to only web traffic, where an FQDN match against the hostname in the HTTP/FTP header or SNI for HTTPS triggers the rule. However, you can add IP addresses to URL categories in order to use this criterion for non-web traffic.
  - See image.
  - To remove an individual condition from the rule, click the **Delete** icon. You can expand or collapse individual criteria tiles as needed.
  - Actions
  - In the **Actions** section, select the action to apply when the rule conditions are met and configure the logging mode:
  - The **Capture** action requires Traffic Capture to be enabled in Advanced Settings. It appears only when you select **Block** for **Network Traffic**.
    - **Network Traffic**: Choose the action that the Zscaler service must apply when packets match the rule:
      - **Allow**: Allow the packets to pass through the firewall.
      - **Block/Drop**: Silently block packets that match the rule.
      - When the **Block/Drop** action is configured to block IP addresses, it might still result in sending packets to the destination server based on web sessions if the traffic is HTTPS and an end user notification (EUN) is served via web security policies. These packets are sent to obtain the server’s signed certificate (i.e., beaconing), which is a legitimate and necessary part of the EUN workflow.
      - **Block/ICMP**: Drop all packets that match the rule and send the client an ICMP error message of Type 3 (Destination Unreachable) and Code 13 (Communication Administratively Prohibited).
      - **Block/Reset**: For TCP traffic, the Zscaler service drops all packets that match the rule and sends the client a TCP reset. (A TCP packet with the reset (RST) flag is set to 1 in the TCP header, indicating that the TCP connection must be instantly stopped.) For non-TCP traffic, the action is the same as Block/Drop.
    - **Capture**: Enable this option to store the traffic captured during a block action in PCAP files for later analysis.
    - **Logging**: Choose the logging type to apply:
      - **Aggregate**: Groups together individual sessions based on user, rule, network service, network application, and records them periodically. Log aggregation happens approximately every 15 minutes.
      - **Full**: Logs all sessions matching the rule individually in detail, with some exceptions. To learn more, see the following section.
    - See log support details for Allow and Block rules in Standard vs. Advanced Firewall
| Rule Type | Standard Firewall (Aggregate or Full logging option not selectable) | Advanced Firewall (Aggregate and Full logging options selectable) |
|---|---|---|
| Allow | Aggregate logging is used for all traffic.Full or detailed logging for Allow rules requires Advanced Firewall or Full Logging license. | **Aggregate Logging**: Applies to all traffic when selected.**Full Logging**: When selected, detailed logging applies to all traffic except web (HTTP/HTTPS) and FTP/FTPS sessions, which are managed by the secure web gateway.Sessions managed by the secure web gateway are always aggregated in Firewall logs because web transactions are logged in detail in Web logs. |
| Block | Full or detailed logging is used for all traffic. | **Aggregate Logging**: Applies to all traffic when selected.**Full Logging**: When selected, detailed logging applies to all traffic. |
  - See image.
  - Firewall Filtering Rule
  - In the **Firewall Filtering Rule** section, provide general information about the rule:
    - **Rule Name**: A system-generated rule name is automatically populated, and the name can be edited. The name cannot exceed 63 characters.
    - **Description**: (Optional) Click **Add Description** and enter additional notes or information about the rule in the text field. You can adjust this field's size as needed, depending on your content length. The description cannot exceed 10,240 characters.
    - **Rule Label**: (Optional) Click **Add Rule Label** and select a label from the drop-down menu.
    - **Rule Order**: A rule order is automatically assigned and displayed. It determines the rule's position in the ascending order of evaluation used for all rules within the policy. You can modify the rule order, but if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
    - To modify the rule order:
      - Click **Edit**.
      - In the **Edit Rule Order** drawer that appears, enter the required rule order under **Current Rule**. You can review the existing rules shown in the drawer and modify your current rule order.
      - You can also adjust the number of rules displayed per page and navigate through the next and previous pages.
      - Click **Apply**.
    - See image.
    - **Admin Rank**: Click **Edit** and select an admin rank 0 to 7 (0 is the highest rank) from the drop-down menu. This option appears if you enable Admin Ranking on the Advanced Settings page. Your assigned admin rank determines the values you can select (e.g., you cannot select a rank higher than your own). The rule's admin rank determines the value you can select for rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
    - **Rule Status**: By default, the status is **Disabled**. You need to enable the rule to activate and enforce it on your traffic.
    - Disabled rules can have a rule order assigned. During evaluation, the service skips the disabled rules and moves to the successive ones.
  - See image.
  - Notification
  - In the **Notification** section, you can enable end user notifications (EUNs) to be triggered by the rule when **Block** actions are configured and select the notification message that appears:
  - EUN is supported only with Block actions and requires Advanced Firewall. The EUN is supported on Windows devices running Zscaler Client Connector version 4.8 or later over Z-Tunnel 2.0. To learn more, see Configuring EUNs for Firewall Filtering.
    - **End User Notification**: Enable this option to display a notification to end users through Zscaler Client Connector when they access traffic blocked by this rule.
    - **Notification Message**: This option appears if the end user notification (EUN) is enabled, and allows you to select the notification message. You can select from default and custom notification messages to display for users.
  - See image.
- Save and activate the change.
