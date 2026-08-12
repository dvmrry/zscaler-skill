# Configuring and Updating Credentials for Zscaler Cellular Service Deployment

**Source:** https://help.zscaler.com/zscaler-cellular/configuring-and-updating-credentials-cellular-edge-deployment
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Zscaler Cellular uses Cloud & Branch Connector credentials to initiate regional
deployment of Zscaler Cellular Service.

The documented configuration flow is:

1. In Zscaler Admin Console, open **Administration > API Configuration >
   Legacy API > Cloud & Branch Connector API** and copy the API key.
2. Open **Infrastructure > Connectors > Cellular > Configuration**.
3. Supply the Cloud & Branch Connector super-admin username, super-admin
   password, and legacy API key, then save.

If the Cloud & Branch Connector super-admin credentials change, the Cellular
Configuration page must be updated. The article warns that failing to update
them can disrupt connectivity for cellular devices using Zscaler SIMs.

This capture documents a credentialed legacy deployment dependency. It does
not establish a OneAPI replacement or a non-super-admin deployment role.
