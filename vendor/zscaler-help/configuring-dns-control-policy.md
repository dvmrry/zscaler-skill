# Configuring the DNS Control Policy

**Source:** https://help.zscaler.com/zia/configuring-dns-control-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399991, revision 3239891

---

Watch a video about Configuring DNS Control Policy.
Configuring a DNS Control rule provides you with greater control over your DNS traffic. To learn about the recommended configurations for the DNS Control policy, see Best Practices for DNS Control Rules.
You can capture and store traffic blocked through this policy as PCAP files. To learn more, see About Traffic Capture Settings.
After configuring the DNS Control rules, you must enable firewall for known locations to apply the rules to the corresponding location traffic. Additionally, you might consider configuring NAT Control and Firewall Filtering policy rules.
# Policy Execution
The DNS Control policy supports different rule conditions, grouped into categories. A series of AND and OR logical operators are applied between these criteria to form a combination of rule set that is used to evaluate for traffic matches. The logical relationship between the categories is AND, and the rule conditions within each category have their own set of logical operators applied, explained as follows:
- **Who, Where, & When**: [ (Users OR Groups OR Departments) AND (Locations OR Location Groups) AND Time ] AND
- **Source IP**: (Source Groups OR IP Addresses) AND
- **Destination/Resolved IPs**: (Destination IPv4 Groups OR DNS Server IP Addresses) AND
- **DNS Application**: [ (DNS Tunnels & Network Apps OR DNS Application Group) AND (Resolved IP-Based Countries OR Requested Categories OR Response Categories) AND DNS Request Types AND Protocol AND (Endpoint Applications OR Endpoint Application Tags) AND Endpoint Application Risk Level ]
# Prerequisites
Make sure the following prerequisites are met:
- Ensure that you have configured the necessary resources that the policies reference:
  - Users, groups, departments, and locations to which the DNS Control policy applies.
  - Location groups
  - Time intervals
  - Source and destination IPv4 address groups
  - Endpoint applications and endpoint application tags
  - Optionally, IPv6 configuration.
- Ensure that you set up the following DNS configurations per your requirements:
  - Recursive DNS Requests
  - Zscaler can resolve recursive DNS queries sent directly by users or sent via a DNS server or forwarder. However, it is recommended to send recursive DNS requests from users directly (using Zscaler Client Connector with Z-Tunnel 2.0) instead of sending them via a DNS server or forwarder. Since these requests include user context, Internet & SaaS (ZIA) can enforce policies based on users, groups, and departments. For recursive DNS traffic that comes from a DNS server, Internet & SaaS sees only the source and not the user context.
  - Direct the recursive DNS requests sent to or through Internet & SaaS to the Zscaler Trusted Resolver using the predefined NAT rule, Zscaler Trusted DNS Resolver rule. The Zscaler Trusted DNS Resolver rule is enabled by default.
  - Iterative DNS Requests
  - Iterative DNS requests from DNS servers should only transit Internet & SaaS (i.e., pass through Internet & SaaS and not be sent directly to it). Zscaler can secure iterative DNS traffic that transits Internet & SaaS, but enabling the Zscaler Trusted DNS Resolver rule disrupts this type of traffic.
- To learn more, see About DNS Control.
Non-English characters are not supported in DNS Control rules, except for those from the ISO/IEC 8859-1 character set.
# Adding a DNS Control Rule
To add a DNS Filtering rule:
- From the navigation menu, go to **Internet Access** > **Policy** > **DNS Control**.
- Click **Add Rule**.
- The **Add Rule** page appears.
- On the **Add Rule** page, you can configure the following sections:
  - Criteria
  - In the **Criteria** section, when you click **Add Criteria**, you see the rule condition categories in gray (e.g., DNS Application) and the individual rule conditions (e.g., Protocols) under each category.
  - See image.
  - After you click on the various conditions, you notice that some conditions contain preconfigured values (e.g., users and locations) and others require manual value specification (e.g., IP addresses). The logical relationship between the conditions is displayed using a series of AND and OR operators.
    - Criteria with Preconfigured Values
    - For conditions with preconfigured values, typically, a multi-select window with a search bar appears. You can select values by selecting the checkbox for individual items or by clicking **Select All**. After selecting the values, click outside the window to close it.
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
    - Who, Where, & When
    - Contact Zscaler Support to increase the limit of **Users**, **Groups**, **Departments**, or **Locations**.
      - **Users**: Select up to 32 organization users to which the rule applies.
      - If you've enabled the policy for unauthenticated users under Advanced Settings and want to apply this rule to unauthenticated traffic, you can do so by making selections accordingly in the **Users** and **Departments** fields. To learn more, see Configuring Policies for Unauthenticated Traffic.
      - **Groups**: Select up to 32 user groups to which the rule applies.
      - **Departments**: Select up to 32 departments to which the rule applies.
      - If you've enabled the policy for unauthenticated users under Advanced Settings and want to apply this rule to unauthenticated traffic, you can do so by making selections accordingly in the **Users** and **Departments** fields. To learn more, see Configuring Policies for Unauthenticated Traffic.
      - **Locations**: Select up to 32 locations to which the rule applies.
      - To apply this rule only to remote user traffic, select **Road Warrior** for **Locations**. You must also ensure that you have enabled the **Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors** option in Advanced Settings for policies configured for remote users to take effect. Rules configured for locations other than **Road Warrior** also apply to remote user traffic from those locations.
      - **Location Groups**: Select up to 32 location groups to which this rule applies.
      - **Time**: Select up to two time intervals during which the rule applies. By default, the field is set to **Always**.
    - By default, the fields are set to **Any**. If you don't make specific selections, the field remains set to **Any**, and the criterion is ignored during policy evaluation.
    - Source IP
      - **Source IPv4 Groups**: Select the source IPv4 groups that you want to control with this rule.
      - **Source IPv6 Groups**: To control source IPv6 addresses with this rule, select the **All IPv6** group, which is the default source IPv6 group for all IPv6 addresses.
      - Custom source IPv6 groups are not currently supported. To learn more, see About Source IP Groups.
      - **IP Addresses**: Enter addresses (IPv4 only) in any of the following formats:
        - An individual address (e.g., 192.0.2.1)
        - A subnet (e.g., 192.0.2.0/24)
        - An address range (e.g., 192.0.2.1 - 192.0.2.5)
      - Specifying individual, subnet, or range of IPv6 addresses is not currently supported.
    - Destination/Resolved IP
      - **Destination IPv4 Groups**: Select the destination IPv4 groups that you want to control with this rule.
      - During policy evaluation, IP address-based destination groups in the rule criteria are ignored if an SNI value is present in HTTPS requests.
      - **Destination IPv6 Groups**: To control destination IPv6 addresses with this rule, select the **All IPv6** group, which is the default destination IPv6 group for all IPv6 addresses.
      - Custom destination IPv6 groups are not currently supported. To learn more, see About Destination IP Groups.
      - **DNS Server IP Addresses**: Enter addresses (IPv4 only) in any of the following formats:
        - An individual address (e.g., 192.0.2.1)
        - A subnet (e.g., 192.0.2.0/24)
        - An address range (e.g., 192.0.2.1 - 192.0.2.5)
      - Specifying individual, subnet, or range of IPv6 addresses is not currently supported.
    - DNS Application
      - **DNS Tunnels & Network Apps**: Select the DNS tunnels to which the rule applies. Tunnels are categorized as **Commonly Allowed DNS Tunnels**, **Commonly Blocked DNS Tunnels**, or **Unknown DNS Tunnels**. In addition to controlling tunneling traffic, you can also include specific **Web** pages, **Social Networking** sites, **Search Engines**, or **Network Services** that you wish to control at the DNS level.
      - **DNS Application Group**: Select the DNS Application Groups to which the rule applies.
      - **Resolved IP-Based Countries**: Select the countries you want to control. Their destination is identified based on the server location.
      - **Request/Response Categories**: Select the request and response URL and TLD categories to which the rule applies. To reuse the same set of categories, click **Sync with Response Categories** or **Sync with Request Categories**.
      - **DNS Request Type**: Select the DNS request types to which the rule applies.
      - Policy control and action enforcement are supported for all available DNS request types, but DNS logs might not display the specific request type values for all DNS request types, as indicated in the following section.
      - See the mapping between DNS request types displayed in policy rules vs. DNS logs.
| DNS Rule: DNS Request Type | Description | DNS Logging: DNS Request Type |
|---|---|---|
| A | IPv4 address record | A host address |
| A6 | IPv6 address record | DNS type not mapped by ZS firewall |
| AAAA | IPv6 address record | IP6 address |
| AFSDB | Andrew File System Database record | For AFS Data Base location |
| APL | Address Prefix List | DNS type not mapped by ZS firewall |
| ATMA | Asynchronous Transfer Mode Address | DNS type not mapped by ZS firewall |
| CDNSKEY | Child DNSKEY | DNS type not mapped by ZS firewall |
| CDS | Child DS | DNS type not mapped by ZS firewall |
| CERT | Certificate record | DNS type not mapped by ZS firewall |
| CNAME | Canonical name record | The canonical name for an alias |
| CSYNC | Child-to-Parent Synchronization | DNS type not mapped by ZS firewall |
| DHCID | Dynamic Host Configuration Protocol Identifier | DNS type not mapped by ZS firewall |
| DNAME | Non-terminal DNS name redirection | DNS type not mapped by ZS firewall |
| DNSKEY | DNS Key record | DNS public key |
| DS | Delegation Signer | Delegation Signer |
| EID | DNS Endpoint Identifier resource records | DNS type not mapped by ZS firewall |
| GPOS | Geographical Position record | DNS type not mapped by ZS firewall |
| HINFO | Host Information record | Host Information |
| HIP | Host Identity Protocol | Host Identity Protocol |
| HTTPS | Service binding for HTTPS including Encrypted Client Hello (ECH)You need to block the HTTPS DNS resource record type to stop ECH and prevent unmanaged encrypted traffic flows happening through the secure web gateway. | SVCB-compatible type for use with HTTP |
| IPSECKEY | IPSec Key | DNS type not mapped by ZS firewall |
| ISDN | Integrated Services Digital Network address record | For ISDN address |
| KEY | Key record | DNS type not mapped by ZS firewall |
| KX | Key Exchanger record | DNS type not mapped by ZS firewall |
| LOC | Location record | Location information |
| MB | Mailbox record | A mailbox domain name |
| MD | Mail Destination record | DNS type not mapped by ZS firewall |
| MF | Mail Forwarding record | DNS type not mapped by ZS firewall |
| MG | Mail Group Member record | A mail group member |
| MINFO | Mailbox or mail list record | Mailbox or mail list information |
| MR | Renamed mailbox record | A mail rename domain name |
| MX | Mail Exchange record | Mail exchange |
| NAPTR | Naming Authority Pointer | Naming Authority Pointer |
| NIMLOC | Nimrod Locator resource records | DNS type not mapped by ZS firewall |
| NINFO | DNS zone status | DNS type not mapped by ZS firewall |
| NS | Name Server record | An authoritative name server |
| NSAP | NSAP address record | DNS type not mapped by ZS firewall |
| NSAP_PTR | A pointer to an NSAP address record | DNS type not mapped by ZS firewall |
| NSEC | Next Secure record | DNS security extensions |
| NSEC3 | Next Secure record version 3 | DNS type not mapped by ZS firewall |
| NSEC3PARAM | NSEC3 parameters | DNS type not mapped by ZS firewall |
| NULL | A null resource record | DNS type not mapped by ZS firewall |
| NXT | The next existing server in the zone | DNS type not mapped by ZS firewall |
| OPENPGPKEY | OpenPGP public key record | DNS type not mapped by ZS firewall |
| OPT | An optional code | DNS type not mapped by ZS firewall |
| PTR | Pointer record | A domain name pointer |
| PX | X.400 mail mapping information | DNS type not mapped by ZS firewall |
| RKEY | Record for storing keys which encrypt NAPTR records | DNS type not mapped by ZS firewall |
| RP | Responsible Person | For Responsible Person |
| RRSIG | Resource Record Signature used in Domain Name System Security Extensions (DNSSEC) | DNS type not mapped by ZS firewall |
| RT | Route Through record | For Route Through |
| SIG | Signature | DNS type not mapped by ZS firewall |
| SINK | Record for the storage of miscellaneous structured information | DNS type not mapped by ZS firewall |
| SOA | Start of an authority record zone | Marks the start of a zone of authority |
| SRV | Service locator | Server selection |
| SSHFP | SSH Public Key Fingerprint | DNS type not mapped by ZS firewall |
| SVCB | General-purpose service binding | DNS type not mapped by ZS firewall |
| TALINK | Trust Anchor LINK | DNS type not mapped by ZS firewall |
| Text File | Text record | Text strings |
| TLSA | TLSA certificate association | DNS type not mapped by ZS firewall |
| WKS | A well-known service description | A well-known service description |
| X25 | X.25 PSDN address | DNS type not mapped by ZS firewall |
| ZONEMD | Message Digest Over Zone Data | DNS type not mapped by ZS firewall |
      - **Protocols**: Select the protocols you want to control from **DNS Over HTTPS**, **TCP**, and **UDP**.
      - The protocols displayed might vary with the **Action** selected for the rule. For example, only **DNS Over HTTPS** and **TCP** are shown for the **Redirect Request Using TCP** action, whereas **DNS Over HTTPS** and **UDP** are shown for the **Redirect Request Using UDP** action.
      - **Endpoint Applications**: Choose whether the rule should specifically include the selected endpoint applications, or exclude them to cover all other non-specified applications. You can designate up to 1,024 endpoint applications to govern traffic originating from these selected applications.
      - Zscaler Endpoint Context leverages telemetry from Zscaler Client Connector to enrich an inventory of frequently targeted applications found on endpoint devices. These endpoint applications and their associated tags are used as policy rule criteria to implement dynamic, risk-based, and application-aware security controls.
      - **Endpoint Application Tags**: Choose whether the rule should specifically include the selected endpoint application tags, or exclude them to cover all other non-specified application tags. You can select up to 100 tags that group endpoint applications by theme or category. This applies the policy rule to any traffic coming from applications linked to those tags.
      - **Endpoint Application Risk Level**: You can apply the rule based on the risk profile of endpoint applications, with options including **High**, **Medium**, **Low**, and **Unknown**.
    - Dynamic policy enforcement based on endpoint applications is currently supported only for Windows endpoints running Zscaler Client Connector version 4.8 or later.
    - By default, **Any** is selected for the fields within this category. If you don't make specific selections, the field remains set to **Any**, and the criterion is ignored during policy evaluation.
    - For **DNS Tunnels & Network Apps**, **Requested Categories**, and **Resolved Categories**, selecting a parent category includes all of its members. For example, if you select **Commonly Allowed DNS Tunnels** as part of your rule, then all tunnels listed as commonly allowed are included.
  - See image.
  - To remove an individual condition from the rule, click the **Delete** icon. You can expand or collapse individual criteria tiles as needed.
  - Actions
  - In the **Actions** section, select the action to apply and configure the logging mode:
    - **Network Traffic**: Choose the action that the Zscaler service takes when a session matches the criteria. Additional fields appear depending on the action selected.
      - **Allow**: Allows the DNS requests and responses.
      - **Block**: Silently block all DNS requests and responses.
      - **Capture**: Enable this option to capture and store traffic in PCAP files. This action requires Traffic Capture to be enabled in Advanced Settings.
      - **Block with Response Code**: Blocks DNS requests and responses and sends the specified response code to the client.
      - **Response Code**: Select the response code that needs to be returned to the client.
      - List of Supported Response Codes
| DNS Response Code | Description | Name per RFC 6895 |
|---|---|---|
| 1 | Format Error | FormErr |
| 2 | Server Failure | ServFail |
| 3 | Non-Existent Domain | NXDomain |
| 4 | Not Implemented | NotImp |
| 5 | Query Refused | Refused |
      - Exercise caution when blocking with response codes, especially with "3 - Non-Existent Domain" (i.e., NXDomain), and adhere to the following recommendations:
        - NXDomain should only be used exclusively with rule criteria such as Request Categories and Response Categories. These categories can include specific URL categories (both predefined and custom) and top-level domain (TLD) categories. However, categories such as Miscellaneous that are not mapped to specific target domains should be avoided in the criteria. Alternatively, consider using less definitive and less globally cacheable response codes such as "5 - Query Refused" (i.e., Refused) and "2 - Server Failure" (i.e., ServFail).
        - Defining a response code for an entire type of DNS request should be strictly avoided. For example, defining a rule to block all DNS requests of A or AAAA record types (i.e., using DNS Request Type criteria) with NXDomain would likely result in an unintended DNS outage.
      - **Redirect Request & Keep Sender Protocol**: Redirect DNS requests using the original user protocol (DoH, UDP, or TCP) to the DNS service configured in the specified DNS Gateway.
      - **DNS Gateway**: Select the DNS Gateway that must be used to redirect the DNS request. The DNS Gateway must be configured to support protocols used in incoming requests to redirect the DNS requests successfully. To learn more, see About DNS Gateways.
      - **Redirect Response**: Replace the IP address of the resolved hostname in the DNS response with a preferred IP address before sending the response to the client. This action happens on the response side but can match the request or response side condition.
      - **IP Address**: Enter the IP address that must replace the domain-resolved IP address in the DNS response to the client.
      - Redirecting Users to EUN Page
      - When users access specific sites that are restricted by your organization's policy, you can redirect the users to an EUN web page. You can either host a custom EUN page at a dedicated IP address, or you can redirect users to the Zscaler-provided static EUN web page hosted at the following public IP address: 34.215.46.88. You need to manually configure this IP address in the DNS Control rule.
      - The static EUN web page is not customizable and is provided by Zscaler on a best effort basis. Generally, organizations should not exceed one web request per second on a sustained basis and the EUN web page should support a temporary increase to around 10 requests per second.
      - Zscaler recommends using the **Web EUN** notification for the **Block** action to display an EUN web page for blocked domains, as described in the preceding section. The static DNS EUN web page, accessible at 34.215.46.88, is intended for users whose HTTP web requests are sent directly to the internet (without passing through Internet & SaaS) from unknown locations, or when the client browser/device does not trust the Zscaler CA certificate or the organization's custom certificate and it is not desirable to display a TLS certificate warning to the end users. Also, the static DNS EUN web page (at 34.215.46.88) comes with certain limitations.
      - To learn more, see DNS Static Web End User Notification and DNS End User Notifications.
      - **Redirect Request Using DoH:** Redirect DNS requests using DNS over HTTPS (DoH) to the DNS service configured in the specified DNS Gateway. If the incoming DNS request uses protocols other than DoH (i.e., UDP or TCP), the Zscaler service translates the protocol to DoH and sends the DNS request to the external DNS service.
      - **DNS Gateway**: Select the DNS Gateway that must be used to redirect the DNS request. Only DNS Gateways configured with DoH support are listed.
      - **Redirect Request Using TCP**: Redirect DNS requests using TCP to the DNS service configured in the specified DNS Gateway. The Zscaler service establishes a TCP connection to the DNS service if the incoming request uses TCP or DoH (after protocol translation). However, UDP-to-TCP translation is not supported. When you select this action, any values configured in the **Protocol** condition are adjusted to show only supported options, namely DoH and TCP.
      - **DNS Gateway**: Select the DNS Gateway that must be used to redirect the DNS request. Only DNS Gateways configured with TCP support are listed.
      - **Redirect Request Using UDP**: Redirect DNS requests using UDP to the DNS service configured in the specified DNS Gateway. The Zscaler service sends the request to the DNS service over UDP if the incoming request uses UDP or DoH (after protocol translation). However, TCP-to-UDP translation is not supported. When you select this action, any values configured in the **Protocol** condition are adjusted to show only supported options, namely DoH and UDP.
      - **DNS Gateway**: Select the DNS Gateway that must be used to redirect the DNS request. Only DNS Gateways configured with UDP support are listed.
      - **Resolve by ZPA**: Resolve domain names of Private Access (ZPA) applications to an ephemeral IP address from a preconfigured IP pool. This action is used for redirecting traffic to Private Access and is applicable only to Private Access application segments that have Source IP Anchoring enabled.
      - **IP Pool**: Select an IP pool preconfigured for location traffic or remote user traffic, depending on the origin of traffic being forwarded.
    - **Logging**: By default, logging is set to **Full** and cannot be changed. With full logging, DNS transactions are logged individually with complete details.
  - See image.
  - Notifications
  - In the **Notification** section, you can enable an end user notifications (EUN) to be triggered by the rule when specific actions are configured:
    - **Web EUN** is supported for the **Block** action, whereas **Client Connector EUN** is supported for the **Block**, **Block with Response Code**, and **Redirect Response** actions.
    - Both EUNs cannot function simultaneously. When both options are enabled, the **Web EUN** takes precedence and only this notification is displayed to users.
    - **Client Connector EUN**: Enabling this option shows pop-up notifications to users via Zscaler Client Connector for DNS transactions that match the configured policy action.
    - **Notification Message**: Select from default and custom notification messages to display for users.
    - This feature configuration requires Advanced DNS which is provided by the Advanced Firewall. The EUN is supported on Windows devices running Zscaler Client Connector version 4.8 or later over Z-Tunnel 2.0.
    - See image.
    - **Web EUN**: Enable to show a web notification to end users when they access domains that are blocked by this rule. This EUN is a standard web EUN page that Zscaler provides with support for customization.
    - See image.
  - To learn more, see DNS End User Notifications.
  - Details
    - **Rule Name**: A system-generated rule name is automatically populated, and the name can be edited. The name cannot exceed 63 characters.
    - **Description**: (Optional) Click **Add Description** and enter additional notes or information about the rule in the text field. You can adjust this field's size as needed, depending on your content length. The description cannot exceed 10,240 characters.
    - **Rule Label**: (Optional) Click **Add Rule Label** and select a label from the drop-down menu.
    - **Rule Order**: A rule order is automatically assigned and displayed. It determines the rule's position in the ascending order of evaluation used for all rules within the policy. You can modify the rule order, but if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
    - To modify the rule order:
      - Click **Edit**.
      - In the **Edit Rule Order** drawer that appears, enter the required rule order under **Current Rule**. You can review the existing rules shown in the drawer and modify your current rule order.
      - You can also adjust the number of rules displayed per page and navigate through the next and previous pages.
      - Select **Apply**.
    - See image.
    - **Admin Rank**: Click **Edit** and select an admin rank 0 to 7 (0 is the highest rank) from the drop-down menu. This option appears if you enable Admin Ranking on the Advanced Settings page. Your assigned admin rank determines the values you can select (e.g., you cannot select a rank higher than your own). The rule's admin rank determines the value you can select for rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
    - **Rule Status**: By default, the status is **Disabled**. You need to enable the rule to activate and enforce it on your traffic. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.
  - See image.
- Click **Save** and activate the change.
