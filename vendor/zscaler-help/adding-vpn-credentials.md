# Adding VPN Credentials

**Source:** https://help.zscaler.com/zia/adding-vpn-credentials
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399486, revision 3244849

---

Configuring a VPN credential is one of the tasks you must complete when configuring an IPSec VPN tunnel. You can add up to 16,000 credentials. For a complete list of ranges and limits per feature, see Ranges & Limitations. You can also add or remove multiple VPN credentials by importing VPN credentials from a CSV file.
To add a VPN credential:
- From the navigation menu, go to Infrastructure > Location Management > VPN Credentials.
- Click Add VPN Credential.
- The Add VPN Credential drawer appears.
- See image.
- Choose the Authentication Type that is used to identify the peer, and configure it accordingly:
  - FQDN
    - Managed By: If this VPN credential is being managed by an SD-WAN partner, search for and select their name from the drop-down menu. If this VPN credential is not being managed by a partner, choose Self.
    - VPN Credentials:
      - User ID: Enter the FQDN of the peer. The FQDN can be up to 256 characters. It must be valid and cannot include special characters (e.g., <, @, [], etc.) or end in a period (e.g., safemarch.).
      - New Pre-Shared Key: Enter a pre-shared key. The pre-shared key can be up to 255 characters.
      - Confirm New Pre-Shared Key: Re-enter the pre-shared key.
    - Post-Quantum Credentials: (Optional)
      - Post-Quantum Pre-Shared ID (PPK-ID): Enter the post-quantum pre-shared ID (PPK-ID).
      - Post-Quantum Pre-Shared Key (PPK): Enter the post-quantum pre-shared key (PPK).
      - If you leave this field empty, the VPN credentials are used to establish the VPN tunnel. The tunnel is not established if the PPKs do not match.
      - Confirm Post-Quantum Pre-Shared Key (PPK): Re-enter the post-quantum pre-shared key (PPK).
    - Comments: (Optional) Enter additional notes or information.
  - See image.
  - IP
    - VPN Credentials:
      - IP Address: Choose the IP address of your local gateway.
      - The static IP addresses that appear in the drop-down menu are the addresses that are provisioned for your organization. To learn more, see Self-Provisioning of Static IP Addresses. If you want Zscaler to provision your static IP addresses, submit them to Zscaler Support so that they can be properly added to the menu under IP Address.
      - New Pre-Shared Key: Enter the pre-shared key. The pre-shared key can be up to 255 characters.
      - Confirm New Pre-Shared Key: Re-enter the pre-shared key.
    - Post-Quantum Credentials: (Optional)
      - Post-Quantum Pre-Shared ID (PPK-ID): Enter the post-quantum pre-shared ID (PPK-ID).
      - Post-Quantum Pre-Shared Key (PPK): Enter the post-quantum pre-shared key (PPK).
      - If you leave this field empty, the VPN credentials are used to establish the VPN tunnel. The tunnel is not established if the PPKs do not match.
      - Confirm Post-Quantum Pre-Shared Key (PPK): Re-enter the post-quantum pre-shared key (PPK).
    - Comments: (Optional) Enter additional notes or information.
  - See image.
- You can edit or delete an existing XAUTH VPN credential from the Zscaler Admin Console. However, you cannot add a new XAUTH VPN credential.
- Click the Status to enable or disable the VPN credential.
- Click Save and activate the change.
- If you have entered a User ID, it is automatically converted to lowercase after clicking Save.
