# Configuring Business-to-Business Federation

**Source:** https://help.zscaler.com/zpa/configuring-business-business-federation
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540797, revision 3242903

---

Business-to-Business (B2B) Federation for Private Access (ZPA) enables sharing of private applications between partners without requiring additional network infrastructure (i.e., IPSec and Multiprotocol Label Switching), App Connectors, or multiple logins. For a complete list of ranges and limits per feature, see Ranges & Limitations.
Prior to configuring B2B Federation, ensure that both the host partner admin and guest partner admin are available to complete the process within the designated Token Validity (In Hours) time range. Any business partner (guest or host) can initiate B2B Federation.
To configure B2B Federation, complete the following steps:
- 1. Generate an access token and share it with the partner.
  - From the navigation menu, go to the Federated Partners (Private Access> B2B Exchange > Federation > Federated Partners) or Pending Requests (Private Access> B2B Federation > Federation > Pending Requests) page.
  - Click Add Partner.
  - The Add Partner drawer opens.
  - In the Add Partner drawer:
    - Generate Access Token: Ensure this option is selected.
    - My Tenant: The business partner that is generating the access token.
    - Notes: (Optional) Enter notes for communication between the host and guest partner admins.
    - Token Validity (In Hours): Select an hour value that the access token is valid for (e.g., 24).
    - Access Token: Click Generate to generate the access token that is used to establish trust between two partners. After the token appears, click the Copy icon to copy it.
    - The access token is valid for the time specified in the Token Validity (In Hours) field and is only visible once.
  - See image.
  - After the access token is generated, the pending request appears on the Pending Requests page.
  - Share the access token with the B2B partner.
- 2. Verify the token, then send an approval request to the B2B partner.
  - From the navigation menu, go to the Federated Partners (Private Access> B2B Exchange > Federation > Federated Partners) or Pending Requests (Private Access> B2B Federation > Federation > Pending Requests) page.
  - Click Add Partner.
  - The Add Partner drawer opens.
  - In the Add Partner drawer, click Verify Access Token and paste the access token into the field.
  - See image.
  - Click Verify.
  - A notification appears to indicate if the token is valid or invalid.
  - After the token has been validated, click Send Approval Request. A request will be sent to the B2B partner admin, and the pending request appears on the Pending Requests page.
- An access token can only be used once, and is invalid if used or expired. Separate tokens are required for each partner.
- 3. Approve the federation request.
  - As the B2B partner admin, go to the Pending Requests (Private Access> B2B Federation > Federation > Pending Requests) page.
  - Locate the pending request, and click Approve.
After the B2B Federation process is completed, both partners can take the role of host partner or guest partner, depending on who owns the application.
