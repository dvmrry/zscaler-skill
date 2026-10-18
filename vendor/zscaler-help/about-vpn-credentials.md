# About VPN Credentials

**Source:** https://help.zscaler.com/zia/about-vpn-credentials
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399481, revision 3238653

---

Watch a video about VPN Credentials (shows legacy UI).
In an IPSec VPN Tunnel, two peers use a negotiation process called IKE (Internet Key Exchange) to define the security mechanisms they use to protect their communications. IKE has two phases. In the first negotiation phase, the peers define the security parameters they use to communicate in the second phase. The peers exchange VPN credentials to identify each other and authenticate. The VPN credentials can either be a pre-shared key or XAUTH; however, both peers must use the same VPN credential method and key for successful authentication.
Zscaler no longer supports adding a new XAUTH VPN credential, but you can edit or delete the existing entries from the Zscaler Admin Console.
In the Zscaler Admin Console , you can configure VPN credentials by either adding each credential individually or adding multiple credentials with a CSV file.
Configuring a VPN credential is one of the tasks you must complete when configuring an IPSec VPN tunnel. To learn more, see Configuring an IPSec VPN Tunnel.
The VPN Credentials page provides the following benefits and enables you to:
- Configure VPN credentials for your organization for establishing IPSec VPN tunnels between your organization and the Zscaler data centers for forwarding internet-bound traffic to the Zscaler service.
- Import or delete multiple VPN credentials for different authentication types using a CSV file to reduce the configuration effort for the administrator.
# About the VPN Credentials Page
On the VPN Credentials page (Infrastructure > Location Management > VPN Credentials), you can do the following:
- Filter a VPN credential search by Authentication Type.
- Search for a VPN credential.
- Import VPN credentials using a CSV file.
- Download a Sample Import CSV file and use it as a template to add or remove VPN credentials. Using the sample CSV file as a guide ensures that the format of your entries is correct before you import the information.
- Add a VPN credential.
- Modify the table and its columns.
- View a list of VPN credentials that are configured for your organization. For each VPN credential, you can see the following:
  - User/Certificate ID: The User ID or IP address for the VPN credential. You can sort this column.
  - Authentication Type: The authentication type used to identify the peer, FQDN, XAUTH, or IP. You can sort this column.
  - Location: The name of the location associated with the VPN credential.
  - PPK ID: The post-quantum pre-shared ID.
  - Comments: Displays any comments about the VPN credential, if available. You can sort this column.
  - Status: The status of the VPN credential.
  - Managed By: The name of the partner that manages the VPN credential. To learn more, see Understanding Partner Integrations.
- Edit or delete the VPN credential.
