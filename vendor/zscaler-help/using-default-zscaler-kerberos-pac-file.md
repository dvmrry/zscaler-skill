# Using the Default Zscaler Kerberos PAC File

**Source:** https://help.zscaler.com/zia/using-default-zscaler-kerberos-pac-file
**Captured:** 2026-04-24 via Playwright MCP.

---

All users who leverage Kerberos for authentication must configure their browsers to use PAC files to forward their traffic to the Zscaler service, even if their location has established an IPSec or VPN tunnel to forward traffic to the service.

Zscaler provides a default Kerberos PAC file. Key points:

- Kerberos requires that the ZIA Public Service Edges be addressed as **Fully Qualified Domain Names (FQDNs)**. To accommodate this, the Kerberos PAC file contains the variables `${GATEWAY_HOST}` and `${SECONDARY_GATEWAY_HOST}`, which the service substitutes with the domain names of the primary and secondary ZIA Public Service Edges.
- It forwards web traffic to **port 8800** of the ZIA Public Service Edge. ZIA Public Service Edges challenge all traffic received on port 8800 for a Negotiate Authentication (Kerberos) ticket for the Zscaler service.
- If your organization has a KDC proxy (with Microsoft DirectAccess) deployed for road warrior access, the KDC proxy traffic is also sent to the ZIA Public Service Edge, resulting in authentication failure. You must create a new PAC file that bypasses the KDC proxy:
  ```javascript
  if (shExpMatch(host, "kdcproxy.domain.com")) return "DIRECT";
  ```
- Do not forward traffic destined within the realm to the Zscaler service — the ZIA Public Service Edge would otherwise challenge realm-internal traffic. Add a line to bypass your organization's realm.
- If the location has Kerberos enabled, traffic can be forwarded to the proxy ports (80, 443, 9400, 9443) or to the dedicated port associated with that location. The service automatically challenges all explicitly forwarded proxy traffic from that location for a Kerberos ticket for the Zscaler domain.

Zscaler strongly recommends that you either use the Zscaler Kerberos PAC file directly, or copy and paste it to a new PAC file and then add any necessary arguments and exceptions.

## Using the Default Kerberos PAC File

1. Go to **Administration > Hosted PAC Files**.
2. Copy the **Hosted URL** of the default Kerberos PAC file.
3. Distribute the Kerberos PAC file URL to your users.
