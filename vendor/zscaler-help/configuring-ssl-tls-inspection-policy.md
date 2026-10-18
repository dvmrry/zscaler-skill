# Configuring SSL/TLS Inspection Policy

**Source:** https://help.zscaler.com/zia/configuring-ssltls-inspection-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401851, revision 3244566

---

You can configure Secure Sockets Layer (SSL)/Transport Layer Security (TLS) Inspection policies to perform scanning of the SSL/TLS traffic based on the source and destination of the traffic. Using these policies, you can simplify the deployment and ongoing operations of SSL/TLS Inspection and address the compliance and operational environmental requirements. To learn more, see About SSL/TLS Inspection Policy.
# Policy Execution
The SSL/TLS Inspection rules consist of a series of logical operators between their criteria. The rules are triggered based on the result of the following logical operations between the criteria:
Source IP Groups (AND) [URL Categories (OR) Cloud Applications (OR) Destination Groups (OR) Forwarding Gateways] (AND) ZPA Application Segment (AND) [Location Groups (OR) Locations] (AND) [Users (OR) Groups (OR) Departments] (AND) [Device Groups (OR) Devices (OR) Remote Users with Kerberos] (AND) Device Trust Level (AND) User Agent (AND) [Endpoint Applications (OR) Endpoint Application Tags] (AND) Endpoint Application Risk Level.
To configure an SSL/TLS Inspection rule:
- From the navigation menu, go to **Internet Access** > **Policy** > **SSL/TLS Inspection**.
- Click **Add Rule**.
- The **Add Rule** page appears.
- See image.
- On the **Add Rule** page, you can configure the following sections:
  - Criteria
  - In the Criteria section, when you click the **Add Criteria** drop-down menu, you see the rule condition categories in gray (e.g., Who) and the individual rule conditions (e.g., Users, Groups & Departments) under each category.
  - See image.
  - The conditions contain preconfigured values (e.g., Users, Groups & Departments). A multi-select window with a search bar appears. You can select values by selecting the checkbox for individual items or by clicking **Select All**. After selecting the values, click outside the window to close it. To clear selected items, click the field to open the multi-select window, then use the Remove icon displayed for individual entries. To remove all selected values, click **Remove All**.
  - See image.
  - Refer to the following condition categories for details on configuring their individual conditions:
    - Where
    - Contact Zscaler Support to increase the limit of **Locations**.
      - **Locations**: Select up to 32 locations. Selecting no value ignores the criterion in the policy evaluation.
      - **Location Groups**: Select up to 32 location groups. Selecting no value ignores the criterion in the policy evaluation.
    - Who
    - Contact Zscaler Support to increase the limit of **Users**, **Groups**, **Departments**.
      - **Users**: Select up to 32 general and/or special users. Select **General Users** for all authenticated users and **Special Users** for all unauthenticated users. Selecting no value ignores the criterion in the policy evaluation.
      - **Groups**: Select up to 32 groups. Selecting no value ignores the criterion in the policy evaluation.
      - **Departments**: Select up to 32 departments. If you've enabled the unauthenticated users policy, you can select **Special Departments** for unauthenticated traffic. Selecting no value ignores the criterion in the policy evaluation.
    - Destination
      - **URL Categories**: Select any number of URL super categories or categories. Selecting no value ignores the criterion in the policy evaluation.
      - **Cloud Applications**: Select any number of cloud applications or cloud application classes. Selecting no value ignores the criterion in the policy evaluation.
      - **Destination Groups**: Select any number of destination groups. Selecting no value ignores the criterion in the policy evaluation. The supported group types are IP, FQDN, and Wildcard FQDN. The countries and custom categories configured in the destination groups are ignored.
      - During policy evaluation, IP address-based destination groups in the rule criteria are ignored if an SNI value is present in HTTPS requests.
      - **Forwarding Gateways**: Select any number of gateways configured for third-party proxies. Selecting no value ignores the criterion in the policy evaluation.
    - Devices
      - **Devices**: Select the devices for which you want to apply the rule. Selecting no value ignores the criterion in the policy evaluation.
      - **Device Groups**: Select the device group for which you want to apply the rule. For Zscaler Client Connector traffic, select the appropriate group based on the device platform. Select **Cloud Browser Isolation**, **IoT**, or **No Client Connector** to apply the rule to isolation traffic, IoT traffic, or to traffic that is not tunneled through Zscaler Client Connector, respectively. Selecting no value ignores the criterion in the policy evaluation. Zscaler provides the Unauthorized Traffic Bypass for IoT Classifications predefined rule for the SSL/TLS Inspection policy.
      - The **Cloud Browser Isolation** and **IoT** device groups are available if the Zero Trust Browser (formerly Isolation) and IoT features, respectively, are enabled for your organization.
      - **Workload Groups**: Select up to 8 workload groups for which you want to apply the rule. Selecting no value ignores the criterion in the policy evaluation.
      - **Remote Users with Kerberos**: Select **Yes** to apply this policy to remote users using Kerberos authentication. This criterion applies only to remote user traffic with Kerberos authentication, which is forwarded via PAC files and not via Zscaler Client Connector. Selecting no value ignores the criterion in the policy evaluation.
    - Endpoint Applications
      - **Endpoint Applications**: Select up to 1,024 endpoint applications to which you want to apply the rule. This criterion applies to SSL/TLS traffic originating from the chosen applications.
      - **Endpoint Application Tags**: Select up to 100 endpoint application tags to which you want to apply the rule. This criterion applies to SSL/TLS traffic originating from the applications defined within the selected tags.
    - Others
      - **Source IP Groups**: Select any number of source IP groups. You can also search for source IP groups or click the **Add** icon to add a new source IP group. Selecting no value ignores the criterion in the policy evaluation.
      - **ZPA Application Segment**: Select up to 255 Private Access (ZPA) application segments. Selecting no value ignores the criterion in the policy evaluation.
      - The list displays only those Private Access application segments that have the **Source IP Anchor** option enabled.
      - **Device Trust Level**: Select the device trust level values (**High Trust**, **Medium Trust**, **Low Trust**, or **Unknown**) to which the rule applies. While the **High Trust**, **Medium Trust**, or **Low Trust** evaluation is applicable only to Zscaler Client Connector traffic, **Unknown** evaluation applies to all traffic. Selecting no value ignores the criterion in the policy evaluation.
      - The trust levels assigned to the devices are based on your posture configurations in the Zscaler Admin Console.
      - **User Agent**: Select any number of user agents. This criterion applies only to SSL/TLS traffic forwarded in explicit proxy mode (PAC or PAC over tunnel) and not to traffic forwarded via a transparent proxy (tunnel) or Z-Tunnel 1.0 due to lack of user agent context. Selecting no value ignores the criterion in the policy evaluation.
      - **Endpoint Application Risk Level**: Select the endpoint application risk level(s) (**High Trust**, **Medium Trust**, **Low Trust**, or **Unknown**) to which the rule applies.
      - Dynamic policy enforcement currently supports only Windows endpoints using Zscaler Client Connector version 4.8 or later.
  - You can expand or collapse all the criteria using the **Expand All** or **Collapse All** button, respectively.
  - See image.
  - Actions
  - In the **Actions** section, choose the appropriate action (**Inspect**, **Do Not Inspect**, or **Block**) for the SSL/TLS traffic that matches the defined criteria:
    - If you choose the **Inspect** action, configure the following settings:
      - **Override Default Intermediate CA Certificate**: Select **Yes** to override the default intermediate Certificate Authority (CA) certificate.
      - The **Override Default Intermediate CA Certificate** option is available only if you have subscribed to the cloud HSM protection type.
      - **Intermediate CA Certificate**: Choose an intermediate CA certificate from the list. You can edit this option only if you select **Yes** in the **Override Default Intermediate CA Certificate** field.
      - **Untrusted Server Certificates**: Select how the service handles untrusted certificates (e.g., path validation failure, unknown issuer, certificate expired, common name does not match).
        - **Allow**: The service allows access to sites with untrusted certificates. Certificate warnings are only displayed when users access sites with expired certificates.
        - **Pass Through**: Certificate warnings are displayed to users, and they can decide to proceed to the site.
        - **Block**: The service blocks access to sites with untrusted certificates.
      - **Block No Server Name Indication (SNI)**: Enable this option to block any traffic that does not contain the SNI in the Client Hello message during SSL/TLS handshake. This option is disabled by default.
      - **OCSP Revocation Check**: Enable this option to include certificate revocation check in the untrusted server certificate validation. The service uses the Online Certificate Status Protocol (OCSP) to obtain the revocation status of a certificate. If the OCSP check fails, the action is determined by the **Untrusted Server Certificates** setting.
      - **Block Undecryptable Traffic**: Enable this option to block traffic from servers that use non-standard encryption methods or require mutual TLS authentication.
      - **Minimum Client TLS Version**: Select the minimum TLS version required for your clients to establish a connection. The service blocks the connections for clients that do not meet the specified minimum TLS version requirement.
      - **Minimum Server TLS Version**: Select the minimum TLS version required for your servers to establish a connection. The service blocks the connections for servers that do not meet the specified minimum TLS version requirement.
      - **Enable HTTP/2**: Enable to make HTTP/2 the web protocol used for accessing all applications.
      - The HTTP/2 feature is only available if it is enabled for your organization and does not work for a location's traffic if Bandwidth Control is enabled on that location. If Bandwidth Control is enabled on that location, the Zscaler service falls back to HTTP/1.1, even if HTTP/2 is enabled in the SSL/TLS Inspection policy.
  - See image.
    - If you choose the **Do Not Inspect** action, you can further choose to either **Evaluate Other Policies** or **Bypass Other Policies**. Choosing **Bypass Other Policies** bypasses web policies (URL Filtering and Cloud App Control) for the TLS traffic. If you choose to evaluate other policies for the traffic, you can configure the following settings:
      - **Untrusted Server Certificates**: Select how the service handles untrusted certificates (e.g., path validation failure, unknown issuer, certificate expired, common name does not match).
        - **Allow**: The service allows access to sites with untrusted certificates. While the service does not reset the TCP connection, the browser displays an Invalid Certificate warning message.
        - **Block**: The service blocks access to sites with untrusted certificates by resetting the TCP connection.
      - **Block No Server Name Indication (SNI)**: Enable this option to block any traffic that does not contain the SNI in the Client Hello message during SSL/TLS handshake. This option is disabled by default.
      - **Show Notifications for Blocked Traffic**: Enable this setting to display end user notifications to users if the traffic is blocked by other web policies. Ensure that you install the Zscaler root CA certificate or your enterprise root CA certificate in your client's truststore, so the service can reply or redirect the user to the notification page. If no certificate is installed, the browser displays an Invalid Certificate warning message. If this setting is disabled, the service resets the connection with a generic failed connection message from the browser.
        - **Show Notification for ATP Blocks**: Enable this setting to display Advanced Threat Protection (ATP) notifications to the users if the ATP traffic is blocked. This field is only available if you have enabled **Show Notifications for Blocked Traffic**.
        - **Override Default Intermediate CA Certificate**: Select **Yes** to override the default intermediate CA certificate. This field is only available if you have enabled **Show Notifications for Blocked Traffic**.
        - The **Override Default Intermediate CA Certificate** option is available only if you have subscribed to the cloud HSM protection type.
        - **Intermediate CA Certificate**: Choose an intermediate CA certificate from the list. You can edit this option only if you select **Yes** in the **Override Default Intermediate CA Certificate** field.
      - **OCSP Revocation Check**: Enable this option to include a certificate revocation check in the untrusted server certificate validation. The service uses OCSP stapling to obtain the revocation status of a certificate. If the OCSP check fails, the action is determined by the **Untrusted Server Certificates** setting.
      - **Minimum TLS Version**: Select the minimum TLS version required for your connections. The service blocks connections that do not meet the specified minimum TLS version requirement.
  - See image.
    - If you choose the **Block** action, you can choose to enable or disable end user notifications:
      - **Show** **End User Notifications**: Enable this setting to display end user notifications. Ensure that you install the Zscaler root CA certificate or your enterprise root CA certificate in your client's truststore, so the service can reply or redirect the user to the notification page. If no certificate is installed, the browser displays an Invalid Certificate warning message. If this setting is disabled, the service resets the connection with a generic failed connection message from the browser.
        - **Override Default Intermediate CA Certificate**: Select **Yes** to override the default intermediate CA certificate. This field is only available if you have enabled **Show End User Notifications**.
        - The **Override Default Intermediate CA Certificate** option is available only if you have subscribed to the cloud HSM protection type.
        - **Intermediate CA Certificate**: Choose an intermediate CA certificate from the list. You can edit this option only if you select **Yes** in the **Override Default Intermediate CA Certificate** field.
  - See image.
  - Details
  - In the **Details** section, provide general information about the rule:
    - **Rule Name**: Enter a user-friendly name for the rule. The maximum length is 31 characters.
    - **Add Description**: (Optional) Click **Add Description** and enter additional notes or information about the rule in the text field. The description cannot exceed 10,240 characters.
    - **Add Rule Label**: Click **Add Rule Label** and select a rule label to associate it with the rule. To learn more, see About Rule Labels.
    - **Edit Rule Order**: Click **Edit** to edit the rule order and then click **Apply** to apply the change. Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order. You can change the value, but if you've enabled admin rank, your assigned admin rank determines the rule order values you can select.
    - **Edit Admin Rank**: Click **Edit** to edit the admin rank. Select a value from 1 to 7 (1 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule's admin rank determines the value you can select in the rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
    - **Rule Status**: Enable this option to actively enforce the rule. Disabling this option does not actively enforce the rule, and the service skips it and moves to the next rule. However, the rule does not lose its place in the rule order.
  - See image.
- Click **Save** and activate the change.
