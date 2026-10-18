# Managing the QUIC Protocol

**Source:** https://help.zscaler.com/zia/managing-quic-protocol
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401086, revision 3233262

---

Google developed the QUIC protocol to increase the performance of HTTPS and HTTP (TCP 443 and TCP 80) connections. Chrome browsers have had experimental support for it since 2014, and it's also used in Chromium and Android devices.
QUIC connections do not require TCP handshakes. However, SSL/TLS Inspection requires TCP session information. Because of this, Zscaler cannot examine QUIC sessions when users have SSL/TLS Inspection enabled. When using QUIC, users might also experience certificate errors.
Zscaler best practice is to block QUIC. When it's blocked, QUIC has a failsafe to fall back to TCP. This enables SSL/TLS Inspection without negatively impacting user experience.
# Blocking QUIC
Choose how to block QUIC based on how you are forwarding your traffic to Zscaler.
## GRE or IPSec Tunnel and Zscaler Client Connector (Z-Tunnel 2.0)
If you are sending your outbound internet traffic to Zscaler through a GRE or IPSec tunnel, or Zscaler Client Connector using Zscaler Tunnel (Z-Tunnel) 2.0, you can effectively block QUIC by creating a Firewall Filtering rule. This blocks QUIC UDP flows and forces the browser to default to TCP 80/443.
Normally, the default Firewall Filtering Rule (the lowest rank rule) blocks QUIC unless specifically allowed. However, admins often create more general connectivity rules or groups of rules (e.g., User X or Source IP Address Y to Destination Group IP Address Y is allowed) that are overly permissive and do not explicitly exclude the use of QUIC. For this reason, one or more QUIC block rules might be needed to precede admin-defined allow rules.
As configured in the following steps, the Firewall Filtering rule blocks QUIC at the network service level. Network services configured in Zscaler are identified at the first packet using port and protocol, leading to immediate policy action. When packets match the configured rule, the Zscaler service drops all packets that match the rule and sends the client an ICMP error message of Type 3 (Destination Unreachable) and Code 13 (Communication Administratively Prohibited).
Block QUIC with a Firewall Filtering Rule
- In the Zscaler Admin Console, go to Policies > Access Control > Firewall > Firewall Filtering Policy.
- Click Add Rule.
- The Add Rule page appears.
- On the Add Rule page, configure the following:
  - Criteria
    - Click the Services tab and select QUIC under Network Services.
    - See image.
    - Ensure Any is selected for Users, Groups, Departments, Locations, and Location Groups under Criteria.
    - Ensure Always is selected for Time under Criteria.
  - Actions
    - Select Block/ICMP under Network Traffic.
    - See image.
  - Firewall Filtering Rule
    - Set the Rule Order to the highest possible rank, according to your organization's desired policies.
    - Zscaler recommends that you rank rules for network services higher than rules for network applications to prevent packets from being allowed unnecessarily from traffic that would otherwise be blocked by rules using first-packet identification.
    - Ensure the Rule Status is Enabled.
- Click Save and activate your changes.
In addition to UDP destination port 443, QUIC can use UDP destination port 80. To include port 80 in the network service definition of QUIC, you can modify the predefined network service or configure a custom network service. To learn more, see Modifying Predefined Network Services and Configuring Network Services.
Additionally, you can manage QUIC using the DNS Control policy by blocking the HTTPS DNS resource record type. HTTPS records contain information about specific services and protocols hosted on a domain including preferred protocols such as HTTP/3 over QUIC. HTTPS records are increasingly used by web browsers and applications to leverage the use of HTTP/3 with QUIC, which the Zscaler web proxy currently does not support. Zscaler recommends configuring your DNS Control policy to block HTTPS resource records to suppress the use of HTTP/3 over QUIC, as shown in the following example rule.
Block QUIC with a DNS Control Rule
- In the Zscaler Admin Console, go to Policies > Access Control > Firewall > DNS Control.
- Click Add Rule.
- The Add Rule page appears.
- On the Add Rule page, configure the following:
  - Criteria
    - Select HTTPS for the DNS Request Type condition under DNS Application.
    - The other rule criteria can remain non-specific with values selected as Any, Always, or None, or left blank, whichever is contextually applicable.
  - Actions
    - Network Traffic: Select Block with Response Code.
    - Response Code: Select 2 - Server Failure.
    - This rule configuration blocks HTTPS resource records and sends a Server Failure response (i.e., ServFail DNS response code per RFC 6895) to the client.
    - See image.
  - Details
    - Set the Rule Order to the highest possible order (using a higher admin rank), according to your organization's desired policies.
    - Ensure the Rule Status is Enabled.
- Click Save and activate your changes.
To learn more about recommendations for using DNS Control, see Best Practices for DNS Control Rules.
## Zscaler Client Connector (Z-Tunnel 1.0)
If you are only sending Zscaler Client Connector traffic that uses Z-Tunnel 1.0 to Zscaler (or leveraging remote users), create a block rule on your device firewall to block UDP 80 and 443. This is typically done by an IT admin and is different for every organization.
## TCP 80/443 Only
If you are only sending TCP 80/443 over a tunnel to Zscaler, block QUIC on your branch firewall.
- Block QUIC with a FortiGate Firewall
- If you are using FortiGate firewall, you need to create a new service and then create a top-level policy to block the newly created service.
- To create a service:
  - In the FortiGate portal, go to Policy and Objects > Services.
  - Click Create new Service.
  - Complete the following:
    - Name: Enter QUIC.
    - Protocol Type: Select TCP/UDP/SCTP.
    - Destination Port: To configure the destination ports:
      - Destination Port: Select UDP.
        - Low: Enter 443.
        - High: Leave blank.
      - Click the Add icon to include an additional destination port.
      - Destination Port: Select UDP.
        - Low: Enter 80.
        - High: Leave blank.
    - Other fields should be left with their default values.
  - See image.
  - Click OK to save your service.
- To create a policy:
  - In the FortiGate portal, go to Policy and Objects > IPv4 Policy.
  - Click Create New.
  - Complete the following:
    - Name: Enter a name for this policy (e.g., ServiceDeny).
    - Incoming Interface: Select Internal.
    - Outgoing Interface: Select wan.
    - Source: Select all.
    - Destination: Select all.
    - Schedule: Select always.
    - Service: Select the QUIC service you created.
    - Action: Select DENY.
    - Log Violation Traffic: Enable this option.
    - Enable this policy: Enable this option.
  - See image.
  - Click OK to save your policy.
- Block QUIC with a Palo Alto Networks Firewall
- To block QUIC with Palo Alto Networks firewall, you need to create a new security policy.
- To create a security policy:
  - In the Palo Alto Networks portal, go to Policies > Security.
  - Click Add.
  - On the General tab, enter a Name for the rule.
  - See image.
  - On the Source tab, select the Source Zone for your rule.
  - See image.
  - On the User tab, select any as the value for users.
  - See image.
  - On the Destination tab, select either Untrust or your internet facing as the Destination Zone.
  - See image.
  - On the Application tab:
    - Select Add.
    - Enter quic in the search bar.
    - Select the quic application.
    - See image.
  - On the Service/URL Category tab, leave all fields with their default values.
  - See image.
  - On the Actions tab, select Drop as the action and configure other fields as desired.
  - See image.
  - Click OK to save the policy.
  - See image.
If your firewall is not listed, refer to your manufacturer's documentation for details on how to block QUIC.
## Alternatives
As an alternate measure, you can also block QUIC in Chrome itself.
- Block QUIC in Google Chrome
- If you have administrator access to Google Apps, you can create a policy to block Chrome for all users. To learn more, refer to the Google Chrome Enterprise Help. If you do not, you can still disable QUIC on individual machines.
- To disable QUIC on individual machines:
  - Open Chrome.
  - Enter chrome://flags in the address bar.
  - See image.
  - Enter quic in the search bar.
  - See image.
  - Click the drop-down menu and select Disabled.
  - See image.
  - When Default is selected, Chrome attempts to use QUIC.
  - When prompted, click Relaunch Now to restart Chrome and apply your changes.
  - See image.
- Block QUIC in Microsoft Edge
- If you have administrator access to Microsoft services, you can create a policy to block Microsoft Edge for all users. To learn more, refer to the Microsoft Edge documentation. If you do not, you can still block QUIC in Microsoft Edge to prevent QUIC-enabled traffic across the browser.
- To disable QUIC on individual machines:
  - Open Microsoft Edge.
  - Enter edge://flags in the address bar.
  - See Image.
  - Enter quic in the search bar.
  - See Image.
  - Click the drop-down menu and select Disabled.
  - See Image.
  - When Default is selected, Edge attempts to use QUIC.
  - When prompted, click Restart to relaunch Edge and apply your changes.
  - See Image.
