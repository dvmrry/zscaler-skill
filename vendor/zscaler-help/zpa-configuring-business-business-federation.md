# Configuring Business-to-Business Federation

**Source:** https://help.zscaler.com/zpa/configuring-business-business-federation
**Captured:** 2026-09-03 via Zscaler Help `/zapi/fetch-data` JSON (`data.info` and `data.body.content` extraction).
**Status:** 200
**Canonical:** https://help.zscaler.com/zpa/configuring-business-business-federation
**Help node:** `1540797`
**Help revision:** `3227812`
**Body content length:** 7,214 HTML characters
---

Business-to-Business (B2B) Federation for Private Access (ZPA) shares private
applications between partners without additional IPSec/MPLS infrastructure,
App Connectors, or multiple logins.

Before configuration, both the host and guest partner administrators should be
available during the configured **Token Validity (In Hours)** period. Either
partner can initiate the process.

## Public console workflow

The page describes three steps:

1. Generate an access token and share it with the partner.
2. Verify the token and send an approval request.
3. Approve the federation request.

The **Add Partner** drawer can be opened from the Federated Partners or Pending
Requests pages. The generating administrator selects **Generate Access Token**,
confirms **My Tenant**, optionally adds notes, chooses token validity, and
generates the token. The token is shown once, is valid only for the selected
period, and is then shared with the partner.

The partner selects **Verify Access Token**, pastes the token, and clicks
**Verify**. After validation, **Send Approval Request** sends the request to the
partner administrator and places it on Pending Requests. A token can only be
used once and is invalid after use or expiration; separate tokens are required
for each partner. The B2B partner administrator locates the pending request and
clicks **Approve**.

This is a public Help console workflow. It does not define the underlying
Automate or SDK API contract.
