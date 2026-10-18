# About Extranet

**Source:** https://help.zscaler.com/zia/about-extranet
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1508656, revision 3240728

---

Zscaler Extranet Application Support allows Private Access (ZPA) users to access private applications hosted on a business partner's network, and it gives partners access to secured applications on your organization's network, eliminating the need to install any application connectors on the partner's network or connect a data center to the partner. With Zscaler Extranet Application Support, your organization's partners can establish IPSec tunnels directly to the Zero Trust Exchange (ZTE).
Extranet Application Support does not support NULL encryption for IPSec IKE Phase 2 configuration. Zscaler recommends using the AES-GCM-based encryption algorithm instead.
Extranets are created and assigned to locations in the Zscaler Admin Console. After an extranet location is configured, an admin can use it to configure server groups and application segments, which can be managed with Private Access access policies. To learn more, see Understanding Extranet Application Support.
Extranet Application Support is not enabled by default. To access Extranet Application Support, contact your Zscaler Account team.
Extranet Application Support provides the following benefits and enables you to:
- Securely access partner resources that are not integrated with the Zscaler service.
- Allow partners to access applications on your organization's network securely.
- View insights and insights logs for configured extranets.
- Manage access to extranet resources with Private Access.
# About the Extranet Page
On the Extranet page (Private Access > B2B Exchange > Extranet), you can do the following:
- Add an extranet.
- Search for a configured extranet.
- View a list of all extranets configured for your organization. For each extranet, you can see:
  - Name: The name of the extranet.
  - Traffic Selector: The traffic selectors configured for the extranet. The default traffic selector is designated with a check mark.
  - DNS Server: The DNS servers configured for the extranet. The default DNS server is designated with a check mark.
  - Description: The description of the extranet.
- Modify the table and its columns.
- Edit a configured extranet.
