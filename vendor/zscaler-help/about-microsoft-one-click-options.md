# Understanding Microsoft One Click Options

**Source:** https://help.zscaler.com/zia/about-microsoft-one-click-options
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400881, revision 3239495

---

If your organization uses any of the Microsoft 365 applications, you can send all Microsoft 365 traffic from all your locations, including remote user traffic, through the Zscaler service to the Microsoft cloud. Currently, Zscaler has two configuration options to choose from for Microsoft 365 traffic:
- Microsoft-Recommended One Click Microsoft 365 Configuration
- Microsoft 365 One Click Configuration
Microsoft recommends using their preferred configuration because it incorporates their connectivity principles and recommendations.
# Microsoft-Recommended One Click Microsoft 365 Configuration
Microsoft strongly recommends that any proxy should transparently forward end user Microsoft 365 traffic to their cloud. Zscaler does not identify all Microsoft 365 application traffic based on IP address and FQDN. It exempts a select list of FQDNs and IP address ranges listed by Microsoft from SSL/TLS Inspection. To learn more, refer to the Microsoft Technical documentation.
The Microsoft-Recommended Microsoft 365 One Click Configuration option allows Zscaler to map several but not all Microsoft IP address ranges and domains for most Microsoft 365 apps listed in Microsoft 365 URLs and IP Address Ranges. Zscaler leverages the REST-based web service published by Microsoft to keep this mapping up to date.
Zscaler excludes specific Microsoft-listed FQDNs and IP address ranges from SSL/TLS Inspection, as outlined in the following Microsoft 365 endpoints:
- Microsoft 365 Worldwide (+GCC)
- Microsoft 365 operated by 21 Vianet
- Microsoft 365 U.S. Government DoD
- Microsoft 365 U.S. Government GCC High
- Enabling the Microsoft-Recommended Microsoft 365 One Click Configuration
- The Office 365 One Click Configuration option should be disabled.
  - From the navigation menu, go to Data Security > Inline CASB > Advanced Policy Settings.
  - Click Edit.
  - Select Enable Microsoft-Recommended One Click Office 365 Configuration.
  - Click Save then activate the change.
- If you get an error message after trying to enable this option, this relates to your admin rank. We compare your admin rank to that of two existing custom Firewall and DNS rules with top order. If your admin rank is less than those two ranks, you don't have permission to enable the option.
- Effects of Enabling the Microsoft-Recommended Microsoft 365 One Click Configuration
  - The Office 365 One Click Configuration option is grayed out.
  - The Zscaler service automatically configures authentication exemption for Microsoft domains.
  - A predefined Office 365 One Click Rule is enabled in the following policies:
  - SSL/TLS Inspection Policy
  - The rule isn't configurable and can't be deleted. If this rule is enabled, any Microsoft 365 traffic is exempted from SSL/TLS Inspection and other web policies, such as URL Filtering and Cloud App Control. For example, if you created a URL policy to block OneDrive, Sharepoint, etc., it's not applied.
    - You can modify the Rule Order, Admin Rank, Rule Status, Rule Label, and Description, and choose Evaluate Other Policies (i.e., URL Filtering and Cloud App Control) or Bypass Other Policies under the Do Not Inspect action for this rule and cannot edit other attributes. To learn more, see Configuring SSL/TLS Inspection Policy.
    - If Evaluate Other Policies is selected and a block (or similar) rule exists in the URL Filtering policy, Cloud App Control policy, or other policies, then the system allows these rules to match on SSL/TLS bypassed traffic. However, with the SSL/TLS bypass, the policy application is limited due to the lack of decryption. This would mean that subsequent policy action is likely limited to only the domain portion and not the full URL. For example, for the website sample.com/chatBotAI, only sample.com is seen. So, users can access sample.com, and it's classified under IT Services, and do not separate the fact that sample.com/chatBotAI is classified under General AI and ML Applications.
    - Firewall Control Policy
    - The rule isn't configurable and can't be deleted. It's automatically created to handle Microsoft 365 traffic through our Firewall module without inspecting the traffic. The rule allows Microsoft 365 traffic whose destination IP address matches Microsoft 365 categories.
      - If your admin rank is greater than or equal to that of the Firewall rule with top order, then the rule appears at rule order one with your rank. Going forward, only an admin with an equal or higher rank than yours can edit the rule order.
      - If admin rank is disabled, then the rule appears at rule order one with rank 7.
    - DNS Control Policy
    - The rule allows DNS traffic destined to Microsoft 365. The rule isn't configurable and can't be deleted, but its rule order can be changed, if necessary.
      - If your admin rank is greater than or equal to that of the DNS rule with top order, then the rule appears at rule order one with your rank. Going forward, only an admin with an equal or higher rank than yours can edit the rule order.
    - Cloud App Control Policy
    - A predefined rule is created under each of the following cloud app categories on the Cloud App Control Policy page:
      - Collaboration & Online Meetings: The predefined rule in this category allows the Cloud App Control traffic destined to the following Microsoft 365 cloud applications:
        - Yammer
        - SharePoint Online
        - Microsoft Teams
        - Microsoft Sway
      - Productivity and CRM Tools: The predefined rule in this category allows the Cloud App Control traffic destined to the following Microsoft 365 cloud applications:
        - Common Microsoft 365 Applications
        - Microsoft Dynamics 365
        - Microsoft Delve
        - Microsoft Power BI
        - Microsoft Planner
      - File Sharing: The predefined rule in this category allows the Cloud App Control traffic destined to the OneDrive cloud application.
      - Hosting Providers: The predefined rule in this category allows the Cloud App Control traffic destined to the Microsoft Azure cloud application.
      - IT Services: The predefined rule in this category allows the Cloud App Control traffic destined to the following Microsoft 365 cloud applications:
        - Microsoft Azure AD
        - Microsoft Intune
      - Webmail: The predefined rule in this category allows the Cloud App Control traffic destined to the Outlook cloud application.
    - Cascading to URL filtering does not apply to the preceding predefined Cloud App Control policy rules when you enable the Allow Cascading to URL Filtering option on the Advanced Settings page. To perform URL cascading for Office 365 One Click, create a new rule with a higher rank than the existing predefined rule and use the cascading feature in that new rule.
    - The rules aren't configurable and can't be deleted, but their rule orders can be changed, if necessary.
    - If your admin rank is greater than or equal to that of the Cloud App Control rule with top order, then the rules appear at rule order one with your rank. Going forward, only an admin with an equal or higher rank than yours can edit the rule order.
  - When Microsoft 365 traffic is sent to the firewall, the service fingerprints the application. All the fingerprinted information is logged and is viewable on the Microsoft 365 dashboard.
  - Zscaler overrides the destination IP address of Microsoft 365 traffic with the closest CDN destination for the Microsoft 365 application and leverages DNS servers at each of our data centers to provide a better user experience and improved application performance.
    - DNS optimization is done automatically when the Microsoft-Recommended Office 365 One Click Configuration option is enabled.
    - Microsoft's peering partnership with Zscaler allows for minimal hops into the Microsoft backbone for Microsoft 365 traffic, resulting in a better user experience.
    - Zscaler exempts some IP addresses, FQDNs, or URLs from One Click if they are part of the Default category. Default category endpoints can be treated like regular destinations, which allows customers to apply the appropriate security controls. To learn more about Microsoft categories, refer to the Microsoft Technical documentation.
To learn about enabling Microsoft Tenant Restrictions, see Adding Tenant Profiles.
Zscaler does not publish the complete list of IP address ranges and FQDNs or wildcard domain names exempted from SSL/TLS Inspection. If further exemptions are required, you can define SSL/TLS Inspection rules.
# Microsoft 365 One Click Configuration
The following configuration was built prior to Microsoft's current connectivity principles and recommendations. Microsoft advises using the Microsoft-Recommended One Click Office 365 Configuration detailed in the previous section.
With the Office 365 One Click Configuration feature, the Zscaler service automatically configures authentication exemption and decryption exemption rules required for the service to seamlessly support and secure your Microsoft 365 traffic. If this option is enabled, the Zscaler service exempts select Microsoft 365 applications from SSL/TLS Inspection. These exemptions are continuously evaluated based on Zscaler's assessment of risk exposure and to ensure that anything exempted is as specific as possible to the delivery of Microsoft 365 for corporate users and no wider.
Zscaler does not publish the complete list of IP address ranges and FQDNs or wildcard domain names exempted from SSL/TLS Inspection. If further exemptions are required, you can define SSL/TLS Inspection rules.
To enable Microsoft 365 One Click Configuration:
The Enable Microsoft-Recommended Office 365 One Click Configuration option should be disabled.
- From the navigation menu, go to Internet Access > Setting > Advanced Settings.
- Click Edit.
- Select the Enable Office 365 One Click Configuration option.
- Click Save and activate the change.
