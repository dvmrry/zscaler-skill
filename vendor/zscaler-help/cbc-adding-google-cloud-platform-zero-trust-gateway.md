# Adding a Google Cloud Platform Zero Trust Gateway

**Source:** https://help.zscaler.com/cloud-branch-connector/adding-google-cloud-platform-zero-trust-gateway
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1540310, revision 3242886

---

This article provides information on adding a Google Cloud Platform (GCP) Zero Trust Gateway in the Zscaler Admin Console. To learn more, see About Google Cloud Platform Zero Trust Gateways.
GCP gateways are in Limited Availability (LA). To enable this feature, contact Zscaler Support.
# Adding a GCP Gateway
To add a GCP gateway:
- From the navigation menu, go to Zero Trust Cloud > Zero Trust Gateway > GCP.
- Click Add Zero Trust Gateway.
- See image.
- The Add GCP Gateway window appears.
- In the Add GCP Gateway window:
  - On the Configuration tab:
    - Gateway Name: Enter a name for the GCP gateway.
    - Region: Select the GCP region where you want to create the GCP gateway. You can only deploy in one region, and you cannot modify it after the GCP gateway is created.
    - Availability Zone: Select the availability zones where you want to create the GCP gateway components. You must select a minimum of two availability zones.
    - Location Name (Optional): Enter the name of the location to be associated with the GCP gateway. This name is visible in all the policies where the location object is available. This location object is created and synced between Cloud Connector policy pages and Internet & SaaS policy pages. To learn more, see About Locations.
    - Location Template: Select the location template that is used for creating the location associated with the GCP gateway.
  - See image.
  - On the IAM Principals tab, enter a Principal Value and select Principal Type (i.e., User, Group, or Service Account). When a user enters a connection request, the Zscaler service checks the incoming connection and allows the incoming connection from an intercept endpoint group that is associated with the IAM principal you added. The IAM principal is associated with your virtual private cloud (VPC). Click Add Principal to add the IAM principal to the table where you can view the following details:
    - IAM Principal: The IAM principal credentials with access to the gateway in GCP.
    - Principal Type: The type of principal (i.e., User, Group, or Service Account).
    - Added on: The date and time when the IAM principal was added.
    - See image.
- On the Review tab, confirm that the information is correct and click Create.
- See image.
The GCP gateway is created.
