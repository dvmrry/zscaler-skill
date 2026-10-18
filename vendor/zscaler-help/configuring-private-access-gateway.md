# Configuring Private Access Gateway

**Source:** https://help.zscaler.com/zia/configuring-private-access-gateway
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1401526, revision 3243621

---

You need to configure Private Access (ZPA) gateways in the Zscaler Admin Console to map them to the Private Access server groups and its associated application segments that require Source IP Anchoring.
To forward traffic through Private Access gateways, ensure that your Internet & SaaS (ZIA) tenant is paired with your Private Access tenant with Source IP Anchoring enabled.
To configure a Private Access gateway:
- Go to Infrastructure > Internet & SaaS > Private Access GW.
- Click Add Gateway for ZPA.
- See image.
- The Add Gateway for ZPA drawer appears.
- In the Add Gateway for ZPA drawer:
  - Gateway Name: Enter a name for the gateway.
  - Server Group: From the drop-down menu, select the server group that you configured on Private Access for Source IP Anchoring.
  - Application Segments: After you select the server group, all the application segments (with Source IP Anchoring enabled) associated with the server group appear in this field.
  - Description: (Optional) Enter additional notes or information for the gateway.
- See image.
- Click Save and activate the change.
