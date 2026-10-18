# Using the Default Zscaler Kerberos PAC File

**Source:** https://help.zscaler.com/zia/using-default-zscaler-kerberos-pac-file
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399586, revision 3243359

---

All users who leverage Kerberos for authentication must configure their browsers to use PAC files to forward their traffic to the Zscaler service, even if their location has established an IPSec or VPN tunnel to forward traffic to the service.
Zscaler provides a default Kerberos PAC file. The following is information and tips about using the Keberos PAC file:
- Kerberos requires that the Public Service Edges for Internet & SaaS (ZIA) be addressed as Fully Qualified Domain Names (FQDNs). To accommodate this requirement, the Kerberos PAC file contains the variables ${GATEWAY_HOST} and ${SECONDARY_GATEWAY_HOST}, which the service substitutes with the domain names of the primary and secondary Public Service Edges.
- It forwards web traffic to port 8800 of the Public Service Edge. The Public Service Edges challenge all traffic that they receive on port 8800 for a Negotiate Authentication (Kerberos) ticket for the Zscaler service.
- If your organization has a KDC proxy (with Microsoft DirectAccess) deployed for road warrior access, the KDC proxy traffic is also sent to the Public Service Edge, resulting in authentication failure. Therefore, you must create a new PAC file that includes a line to bypass the KDC proxy:
if shExpMatch(host,"kdcproxy.domain.com") return "DIRECT";
- Traffic destined within the realm must not be forwarded to the Zscaler service, so the Public Service Edge does not challenge any traffic within the realm. Create a new PAC file that includes a line to bypass your organization's realm.
- If the location has Kerberos enabled, then traffic can be forwarded to the proxy ports (80, 443, 9400, 9443) or to the dedicated port associated with that location. The service automatically challenges all explicitly forwarded proxy traffic from that location for a Kerberos ticket for the Zscaler domain.
Zscaler strongly recommends that you either use the Zscaler Kerberos PAC file or copy and paste it to a new PAC file and then add any necessary arguments and exceptions.
Before deploying Kerbero authentication, see Kerberos Authentication Deployment Guidelines and Kerberos Requirements. To learn how to deploy Kerberos, see Deploying Kerberos Authentication.
# Using the Default Zscaler Kerberos PAC File
To use the default Kerberos PAC file hosted by the Zscaler service:
- Go to Infrastructure > Internet & SaaS > Hosted PAC Files.
- Copy the Hosted URL of the default Kerberos PAC file.
- See image.
- Distribute the Keberos PAC file URL to your users.
