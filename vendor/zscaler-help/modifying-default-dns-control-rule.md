# Modifying the Predefined DNS Control Rules

**Source:** https://help.zscaler.com/zia/modifying-predefined-dns-control-rules
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399921, revision 3239900

---

The DNS Control policy has predefined rules based on best practice recommendations to manage specific types of traffic. These rules can be used readily by an organization to protect its traffic against specific threats. Depending on the rule functionality and the severity of threats against which they offer protection, some rules are highly restrictive and do not support customization for rule conditions and actions, whereas others allow for greater flexibility, including rule deletion. Similarly, certain rules contain system-defined Rule Order (i.e., default Rule Order), which cannot be modified by admins. These rules with default Rule Order always maintain the lowest precedence.
- Predefined DNS rules can be enabled or disabled based on your organization's requirements. However, these rules cannot be deleted unless specified otherwise.
- In the event of false positives triggered by predefined DNS rules, you can either create custom rules using higher ranks or disable the rule that's causing the false positives.
# Predefined DNS Control Rules
The Zscaler service provides a set of predefined rules for managing your DNS traffic.
List of Predefined DNS Control Rules
The following table provides the list of predefined DNS rules along with their description.
| Rule Name | Description |
|---|---|
| Unknown DNS Traffic | The Unknown DNS Traffic rule is predefined to take action on suspected malformed traffic, non-standard DNS traffic, or even non-DNS traffic attempting to conceal itself as DNS traffic (not otherwise identified as another application). Zscaler recommends blocking the traffic matching this rule. |
| Default Firewall DNS Rule | The Default Firewall DNS Rule is predefined to manage all the DNS traffic that is not specifically defined and actioned in the higher-ranked, user-defined rules. Zscaler recommends blocking the traffic matching the rule, but only if the permitted DNS traffic is defined in a higher-ranked rule.If a higher-ranked allow rule is not defined, then many applications fail as DNS is essential for their operation. |
| Fallback ZPA Resolver for Locations | The Fallback ZPA Resolver for Locations rule is predefined to redirect source IP anchored traffic from location users to the preconfigured IP pools during control plane maintenance. You can edit the IP address range configured for the IP pools on the IP Pool page.This rule is disabled by default and cannot be deleted. It is only enabled during control plane maintenance to ensure the resiliency of the Source IP Anchoring feature. |
| Fallback ZPA Resolver for Road Warrior | The Fallback ZPA Resolver for Road Warrior rule is predefined to redirect source IP anchored traffic of remote users to the preconfigured IP pools during control plane maintenance. You can edit the IP address range configured for the IP pools on the IP Pool page.This rule is disabled by default and cannot be deleted. It is only enabled during control plane maintenance to ensure the resiliency of the Source IP Anchoring feature. |
| Critical Risk DNS Categories | The Critical Risk DNS Categories rule is predefined to block DNS traffic with the highest security risks in DNS request and response categories that are encountered by every organization. This block rule is implemented by all organizations, unless they are exceptional and very permissive circumstances. It blocks traffic that matches known or suspected critical security threats in DNS requests and responses, such as malicious IP addresses and FQDNs, Domain Generation Algorithm (DGA) domains, and other advanced security threats. This rule is enabled by default and is created with a higher rule order.The Critical Risk DNS Categories rule contains predefined values for specific rule attributes, conditions, and action. While the rule attributes, such as Rule Order and Rule Label, are modifiable by admins to suit their organization's requirements, the rule conditions and action, are read-only fields and can only use default values. |
| Critical Risk DNS Tunnels | The Critical Risk DNS Tunnels rule is predefined to block DNS tunnels with the highest security risks (e.g., commonly blocked DNS tunnels) that are encountered by every organization. This block rule is implemented by all organizations, unless they are exceptional and very permissive circumstances. This rule is enabled by default and is created with a higher rule order.The Critical Risk DNS Tunnels rule contains predefined values for specific rule attributes, conditions, and action. While the rule attributes, such as Rule Order and Rule Label, are modifiable by admins to suit their organization's requirements, the rule conditions and action, are read-only fields and can only use default values. |
| High-Risk DNS Categories | The High-Risk DNS Categories rule is predefined to block DNS traffic with high security risks to an organization's network. It blocks DNS traffic that matches newly registered and observed domains, newly revived domains, and other similar security threats in DNS requests and responses. This rule warrants careful consideration by an organization, and it is strongly recommended by Zscaler to implement this block rule. This rule is enabled by default and is created with a higher rule order.The High-Risk DNS Categories rule contains predefined values for specific rule attributes, conditions, and action. While the rule attributes, such as Rule Order and Rule Label, are modifiable by admins to suit their organization's requirements, the rule conditions and action, are read-only fields and can only use default values. |
| High-Risk DNS Tunnels | The High-Risk DNS Tunnels rule is predefined to block DNS tunnels with high security risks (e.g., unknown DNS tunnels) to an organization's network. This rule warrants careful consideration by an organization, and it is strongly recommended by Zscaler to implement this block rule. This rule is enabled by default and is created with a higher rule order.The High-Risk DNS Tunnels rule contains predefined values for specific rule attributes, conditions, and action. While the rule attributes, such as Rule Order and Rule Label, are modifiable by admins to suit their organization's requirements, the rule conditions and action, are read-only fields and can only use default values. |
| Risky DNS Categories | The Risky DNS Categories rule is recommended and predefined to block common DNS security threats to an organization's network. It blocks traffic that matches risky categories in DNS requests and responses, including content representing abuse or exploitative behavior, adult material, militancy/hate and extremism, violence, malicious content, etc. Blocking these categories is recommended, but the rule implementation might vary depending on your organization's requirements and corporate policies.The Risky DNS Categories rule is not enabled by default. Admins of sufficient rank can enable, fully customize, or delete this rule. |
| Risky DNS Tunnels | The Risky DNS Tunnels rule is recommended and predefined to block DNS tunnels that are common security threats to an organization's network. Blocking these tunnels is recommended but the rule implementation might vary depending on your organization's requirements and corporate policies.The Risky DNS Tunnels rule is not enabled by default. Admins of sufficient rank can enable, fully customize, or delete this rule. |
# Modifying a Predefined DNS Control Rule
To modify a predefined DNS rule:
- From the navigation menu, go to Internet Access > Policy > DNS Control.
- Click the Edit icon for the rule you want to modify.
- The Edit Rule page appears.
- On the Edit Rule page, you can modify the rule attributes, criteria, and actions that are available to edit for the selected predefined rule:
  - Unknown DNS Traffic
  - The Notification option appears only when you select Block for Network Traffic.
    - Select a Rule Label for the rule.
    - Select an action for the Network Traffic field:
      - Allow: Allows the DNS requests and responses.
      - Block: Silently blocks all DNS requests and responses.
    - Configure an end user notification (EUN) using one of the following options:
    - Both Client Connector EUN and Web EUN cannot function simultaneously. When both options are enabled, the Web EUN takes precedence and only this notification is displayed to users.
      - Client Connector EUN: (Requires Advanced DNS provided by Advanced Firewall) Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action.
      - When this option is enabled, an additional Notification Message drop-down menu appears. You can select from default and custom notification messages to display for users.
      - Web EUN: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page provided by Zscaler with support for customization.
    - To learn more, see DNS End User Notifications and Configuring the DNS Control Policy.
  - Default Firewall DNS Rule
  - The Notification option appears only when you select Block for Network Traffic.
    - Select a Rule Label for the rule.
    - Select an action for the Network Traffic field:
      - Allow: Allows the DNS requests and responses.
      - Block: Silently blocks all DNS requests and responses.
    - Configure an end user notification (EUN) using one of the following options:
    - Both Client Connector EUN and Web EUN cannot function simultaneously. When both options are enabled, the Web EUN takes precedence and only this notification is displayed to users.
      - Client Connector EUN: (Requires Advanced DNS provided by Advanced Firewall) Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action.
      - When this option is enabled, an additional Notification Message drop-down menu appears. You can select from default and custom notification messages to display for users.
      - Web EUN: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page provided by Zscaler with support for customization.
    - To learn more, see DNS End User Notifications and Configuring the DNS Control Policy.
  - Fallback ZPA Resolver for Locations
  - Choose the Rule Label for the rule.
  - Fallback ZPA Resolver for Road Warrior
  - Choose the Rule Label for the rule.
  - Critical Risk DNS Categories
    - Configure the rule attributes listed as follows:
      - Modify the Rule Order as per your requirements. If Admin Rank is enabled, your assigned admin rank determines the Rule Order values you can select.
      - Modify the Rule Status to enable or disable the rule.
      - Configure the Rule Label.
    - View the rule criteria (read-only) information in the following bulleted list:
    - The rule is configured only with specific criteria in the DNS Application category.
      - Request Categories: Botnet Callback, Domain Generation Algorithm (DGA) Domains, Malicious Content, Phishing, and Spyware/Adware are selected.
      - Response Categories: Botnet Callback, Domain Generation Algorithm (DGA) Domains, Malicious Content, Phishing, and Spyware/Adware are selected.
    - View the rule action details and configure the Traffic Capture option as follows:
      - Network Traffic: (Non-modifiable) Block is selected.
      - Logging: (Non-modifiable) Full Logging is configured.
      - Capture: (Modifiable) If Traffic Capture is enabled, the Capture option appears. By enabling this option, you can capture blocked traffic and store it in PCAP files for later analysis. To learn more, see About Traffic Capture Settings.
    - Configure an end user notification (EUN) using one of the following options:
    - Both Client Connector EUN and Web EUN cannot function simultaneously. When both options are enabled, the Web EUN takes precedence and only this notification is displayed to users.
      - Client Connector EUN: (Requires Advanced DNS provided by Advanced Firewall) Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action. This EUN is supported for Block, Block with Response Code, and Redirect Response actions.
      - When this option is enabled, an additional Notification Message drop-down menu appears. You can select from default and custom notification messages to display for users.
      - Web EUN: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page provided by Zscaler with support for customization. This EUN is supported for the Block action.
    - To learn more, see DNS End User Notifications and Configuring the DNS Control Policy.
  - Critical Risk DNS Tunnels
    - Configure the rule attributes listed as follows:
      - Change the Rule Order as per your requirements. If Admin Rank is enabled, your assigned admin rank determines the Rule Order values you can select.
      - Change the Rule Status to enable or disable the rule.
      - Configure the Rule Label.
    - View the rule criteria information (read-only) in the following bulleted list:
    - The rule is configured only with specific criteria in the DNS Application category.
      - DNS Tunnels & Network Apps: All DNS tunnels that are classified under the Commonly Blocked DNS Tunnels category by Zscaler are selected.
    - View the rule action details and configure the Traffic Capture option as follows:
      - Network Traffic: (Non-modifiable) Block is selected.
      - Logging: (Non-modifiable) Full Logging is configured.
      - Capture: (Modifiable) If Traffic Capture is enabled, the Capture option appears. By enabling this option, you can capture blocked traffic and store it in PCAP files for later analysis. To learn more, see About Traffic Capture Settings.
    - Configure an end user notification (EUN) using one of the following options:
    - Both Client Connector EUN and Web EUN cannot function simultaneously. When both options are enabled, the Web EUN takes precedence and only this notification is displayed to users.
      - Client Connector EUN: (Requires Advanced DNS provided by Advanced Firewall) Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action. This EUN is supported for Block, Block with Response Code, and Redirect Response actions.
      - When this option is enabled, an additional Notification Message drop-down menu appears. You can select from default and custom notification messages to display for users.
      - Web EUN: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page provided by Zscaler with support for customization. This EUN is supported for the Block action.
    - To learn more, see DNS End User Notifications and Configuring the DNS Control Policy.
  - High-Risk DNS Categories
    - Configure the rule attributes listed as follows:
      - Change the Rule Order as per your requirements. If Admin Rank is enabled, your assigned admin rank determines the Rule Order values you can select.
      - Change the Rule Status to enable or disable the rule.
      - Configure the Rule Label.
    - View the rule criteria information (read-only) in the following bulleted list.
    - The rule is configured only with specific criteria in the DNS Application category.
      - Request Categories: Newly Registered and Observed Domains, Newly Revived Domains, and Other Security are selected.
      - Response Categories: Newly Registered and Observed Domains, Newly Revived Domains, and Other Security are selected.
    - View the rule action details and configure the Traffic Capture option as follows:
      - Network Traffic: (Non-modifiable) Block is selected.
      - Logging: (Non-modifiable) Full Logging is configured.
      - Capture: (Modifiable) If Traffic Capture is enabled, the Capture option appears. By enabling this option, you can capture blocked traffic and store it in PCAP files for later analysis. To learn more, see About Traffic Capture Settings.
    - Configure an end user notification (EUN) using one of the following options:
    - Both Client Connector EUN and Web EUN cannot function simultaneously. When both options are enabled, the Web EUN takes precedence and only this notification is displayed to users.
      - Client Connector EUN: (Requires Advanced DNS provided by Advanced Firewall) Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action. This EUN is supported for Block, Block with Response Code, and Redirect Response actions.
      - When this option is enabled, an additional Notification Message drop-down menu appears. You can select from default and custom notification messages to display for users.
      - Web EUN: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page provided by Zscaler with support for customization. This EUN is supported for the Block action.
    - To learn more, see DNS End User Notifications and Configuring the DNS Control Policy.
  - High-Risk DNS Tunnels
    - Configure the rule attributes listed as follows:
      - Change the Rule Order as per your requirements. If Admin Rank is enabled, your assigned admin rank determines the Rule Order values you can select.
      - Change the Rule Status to enable or disable the rule.
      - Configure the Rule Label.
    - View the rule criteria information (read-only) in the following bulleted list.
    - The rule is configured only with specific criteria in the DNS Application category.
      - DNS Tunnels & Network Apps: All DNS tunnels that are classified under the Unknown DNS Tunnels category by Zscaler are selected.
    - View the rule action details and configure the Traffic Capture option as follows:
      - Network Traffic: (Non-modifiable) Block is selected.
      - Logging: (Non-modifiable) Full Logging is configured.
      - Capture: (Modifiable) If Traffic Capture is enabled, the Capture option appears. By enabling this option, you can capture blocked traffic and store it in PCAP files for later analysis. To learn more, see About Traffic Capture Settings.
    - Configure an end user notification (EUN) using one of the following options:
    - Both Client Connector EUN and Web EUN cannot function simultaneously. When both options are enabled, the Web EUN takes precedence and only this notification is displayed to users.
      - Client Connector EUN: (Requires Advanced DNS provided by Advanced Firewall) Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action. This EUN is supported for Block, Block with Response Code, and Redirect Response actions.
      - When this option is enabled, an additional Notification Message drop-down menu appears. You can select from default and custom notification messages to display for users.
      - Web EUN: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page provided by Zscaler with support for customization. This EUN is supported for the Block action.
    - To learn more, see DNS End User Notifications and Configuring the DNS Control Policy.
  - Risky DNS Categories
  - You can customize all attributes of the rule, rule conditions, action, and end user notifications. To learn how to configure DNS Control rules, see Configuring the DNS Control Policy.
  - The rule cannot have different sets of URL categories selected under Request Categories and Response Categories. However, you can have only one of the two conditions configured for the rule by clearing the selection for the other condition.
  - Risky DNS Tunnels
  - You can customize all attributes of the rule, rule conditions, action, and end user notifications. To learn how to configure DNS Control rules, see Configuring the DNS Control Policy.
- Click Save and activate the change.
