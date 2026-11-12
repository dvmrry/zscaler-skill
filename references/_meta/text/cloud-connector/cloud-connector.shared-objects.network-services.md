# Network services and network service groups in Cloud & Branch Connector (cloud-connector.shared-objects.network-services)
Also called: cloud connector network services; network service groups cloud connector; Zscaler Proxy Network Services cloud connector; network applications forwarding policies

Network services are the port criteria Cloud & Branch Connector policies reference. Network services let policies be created on TCP and UDP source and destination ports, the same services are used in forwarding and security policies, and custom services can be added to Firewall, DNS and NAT policies and can include custom ports for HTTP, HTTPS, DNS, FTP, RTSP or PPTP. [cloud-connector.shared-objects.network-services:uses] Network services are on Internet Access > Resources > Network Services (Services tab), which can filter services by protocol (TCP or UDP) and shows port columns such as TCP Source Ports and UDP Destination Ports. [cloud-connector.shared-objects.network-services:page]

**Predefined services.** The Cloud & Branch Connector About Network Services page says the Zscaler firewall has over 50 predefined services and an admin can configure up to 1,024 additional custom services. [cloud-connector.shared-objects.network-services:counts] The Cloud & Branch Connector About Network Services page says ports can be added, modified or deleted in all predefined services except ICMP_any, UDP_any, TCP_any and OTHER. [cloud-connector.shared-objects.network-services:predefined-editability] The Cloud & Branch Connector predefined services table gives, for example, DNS on 53 for both TCP and UDP, HTTP on TCP 80, HTTPS on TCP 443, QUIC on UDP 443 and MS_SQL on TCP 1433; Zscaler Proxy Network Services lists TCP 10099, 21, 443, 80, 8080, 8800, 9400, 9443 and 9480 and includes all Zscaler-specific web proxy ports including customer-specific Dedicated Proxy Ports. [cloud-connector.shared-objects.network-services:predefined-ports] How these values compare with ZIA's pages is open [gap:cloud-connector.shared-objects.network-services:zia-scope]; ZIA's own values are in [Network services (port criteria)](kb:zia.firewall.network-services).

**Custom services.** A custom service shows Definition as CUSTOM; each of its TCP and UDP source and destination port fields takes a port number (for example 50) or a range (for example 1000-1050), and its description cannot exceed 10,240 characters. [cloud-connector.shared-objects.network-services:custom-fields] The eight-entry cap ZIA's page states is not on this page [gap:cloud-connector.shared-objects.network-services:entry-cap].

**Groups and ranking.** Predefined and custom network services can be grouped for use in policies, on the Service Groups tab; the add form lets any number of custom and predefined services be selected, and the group description cannot exceed 10,240 characters. [cloud-connector.shared-objects.network-services:service-groups] Network services are identified at the first packet, leading to immediate policy action, so Zscaler recommends ranking firewall filtering rules for network services, and for network service groups, higher than rules for network applications. [cloud-connector.shared-objects.network-services:first-packet] The network service groups page says network applications are available in security policies only, and Cloud & Branch Connector forwarding policies are not supported. [cloud-connector.shared-objects.network-services:applications-not-in-forwarding]

What to check:
1. Whether a port edit to a predefined service is allowed, using the page that matches the product the object was created in.

Not known (open gaps):
- Whether the Cloud & Branch Connector and ZIA network service pages describe the same objects [gap:cloud-connector.shared-objects.network-services:zia-scope]: settled by lab-test or support-ticket
- Whether ZIA's eight-entry cap per port field applies in Cloud & Branch Connector [gap:cloud-connector.shared-objects.network-services:entry-cap]: settled by lab-test or support-ticket

Area: cloud-connector.shared-objects, its subjects in references/_meta/spine/cloud-connector/cloud-connector.shared-objects.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.firewall.network-services.md (Network services (port criteria))

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/cloud-connector/cloud-connector.shared-objects.md (Objects ZIA and Cloud & Branch Connector share: IP groups and network services)
- see-also references/_meta/text/cloud-connector/cloud-connector.forwarding.criteria.md (Cloud Connector forwarding rule criteria: scope, services, sources, destinations, FQDNs)
