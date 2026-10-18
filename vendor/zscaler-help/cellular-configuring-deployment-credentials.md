# Configuring and Updating Credentials for Zscaler Cellular Service Deployment

**Source:** https://help.zscaler.com/zscaler-cellular/configuring-and-updating-credentials-cellular-edge-deployment
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1519071, revision 3243257

---

Zscaler requires your organization's Cloud & Branch Connector credentials to initiate deployment of Zscaler Cellular Service across regions. You must set up Cloud & Branch Connector credentials to allow Zscaler to deploy Cellular Services.
To configure Cloud & Branch Connector credentials:
If you change the super admin credentials of the Cloud & Branch Connector Admin Portal, then you must update the credentials on the Configuration page in the Zscaler Admin Console. Failure to update credentials in the Zscaler Admin Console can lead to service disruption, affecting connectivity of your cellular devices that use Zscaler SIMs.
- From the navigation menu, go to Administration > API >Cloud & Branch Connector API.
- See image.
- Copy the API Key and save it for future use.
- Go to Infrastructure > Cellular > Configuration.
- On the Configuration page:
  - Branch Connector Username: Enter the username of the super admin for the Cloud & Branch Connector Admin Portal.
  - Branch Connector Password: Enter the password of the super admin for the Cloud & Branch Connector Admin Portal.
  - Branch Connector API Key: Enter the API key copied in the previous step.
- See image.
- Click Save.
