# Configuring a DNS Gateway

**Source:** https://help.zscaler.com/cloud-branch-connector/configuring-dns-gateway
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1471256, revision 3239588

---

DNS gateways redirect the DNS request received by the Zscaler Cloud or Branch Connector to specific DNS servers. To learn more, see About DNS Gateways.
To add a DNS gateway:
- From the navigation menu, go to Zero Trust Cloud > Gateways > DNS Gateway.
- On the DNS Gateway page, click Add DNS Gateway.
- See image.
- The Add DNS Gateway window appears.
- In the Add DNS Gateway window:
  - Name: Enter a user-friendly name for the gateway.
  - Primary DNS Server: From the drop-down menu, select a primary DNS server:
    - Custom DNS Server: Enter an IP address of your choice. Zscaler only supports IPv4 addresses.
    - LAN Primary DNS Server: Select the local area network (LAN) primary DNS server to reference the primary LAN DNS server configured in gateway mode of the Branch Connector Configuration Template.
    - LAN Secondary DNS Server: Select the LAN secondary DNS server to reference the primary LAN DNS server configured in gateway mode of the Branch Connector Configuration Template.
    - In gateway mode of the Branch Connector Configuration Template, if the template dictates a WAN override, it uses WAN DNS resolvers. For non-gateway hardware devices, the LAN DNS servers default to the primary and secondary DNS servers configured in the forwarding interface section.
  - Secondary DNS Server: From the drop-down menu, select a secondary DNS server:
    - Custom DNS Server: Enter an IP address of your choice. Zscaler only supports IPv4 addresses.
    - LAN Primary DNS Server: Select the LAN primary DNS server to reference the secondary LAN DNS server configured in gateway mode of the Branch Connector Configuration Template.
    - LAN Secondary DNS Server: Select the LAN secondary DNS server to reference the secondary LAN DNS server configured in gateway mode of the Branch Connector Configuration Template.
    - In gateway mode of the Branch Connector Configuration Template, if the template dictates a WAN override, it uses WAN DNS resolvers. For non-gateway hardware devices, the LAN DNS servers default to the primary and secondary DNS servers configured in the forwarding interface section.
  - Failure Behavior: Choose what happens if the DNS server is unreachable:
    - Return error response: The DNS gateway returns the message smedge will return SERVFAIL.
    - Forward to Original DNS Server: The DNS packet is sent to the original destination IP.
  - See image.
- Click Save and activate the change.
- You can create up to 255 DNS gateways. To learn more, see Ranges & Limitations.
