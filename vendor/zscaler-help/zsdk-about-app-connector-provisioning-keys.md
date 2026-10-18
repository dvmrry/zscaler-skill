# About App Connector Provisioning Keys

**Source:** https://help.zscaler.com/zsdk/about-app-connector-provisioning-keys
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1508346, revision 3021956

---

The domain (e.g., api.private.com) depends on what ZSDK cloud you are on. To learn more, see What Is My Cloud Name for ZSDK?
The provisioning key is a text string that is generated when you add a new App Connector. When deploying an App Connector, you are prompted to enter this key. The provisioning key functions as an ID for the App Connector, enabling the ZSDK cloud to verify the App Connector's authenticity and complete the deployment process. Furthermore, each key is associated with a specific App Connector group, so the key allows ZSDK to identify the App Connector group to which an App Connector must be deployed.
App Connector provisioning keys provide the following benefits and enable you to:
- Deploy App Connectors into an associated App Connector group.
- Limit the number of times a key can be used for deployment.
- View the current key utilization count.
- Edit the maximum number of key uses.
- Select the signing certificate used to enroll App Connector certificates.
Provisioning keys are designed to enable auto-scaling so that you can easily deploy additional App Connectors and respond optimally to increases in required capacity. When you generate a provisioning key, you can specify the number of times a key can be used to deploy App Connectors. ZSDK tracks the number of times a key is used to deploy an App Connector and displays that number on the App Connector Provisioning Keys page. When a key is used the maximum number of times, you cannot use it to deploy more App Connectors. However, you can always edit the maximum number of times a key can be used. You also have the option of associating multiple provisioning keys to a single App Connector group.
# About the App Connector Provisioning Keys Page
On the App Connector Provisioning Keys page (Configuration & Control > Private Infrastructure > App Connector Management > App Connector Provisioning Keys), you can do the following:
- Expand all or one of the rows in the table to see the signing certificate of each provisioning key. The signing certificate is the enrollment certificate for the provisioning key.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all the provisioning keys. For each key, you can see:
  - Name: The name of the key.
  - Maximum # of App Connectors: The maximum number of App Connectors that can be deployed using the key.
  - Provisioning Key Utilization Count: The number of times the provisioning key has been used.
  - App Connector Group: The App Connector group associated with the key.
  - Provisioning Key: The key needed for deploying an App Connector.
- Copy the provisioning key. When copying the key, consider the following:
  - Provisioning Key Utilization Count Reached
  - If the provisioning key utilization count is reached, you cannot copy the key. A Warning icon appears next to a disabled Copy icon. You can edit the key to raise the limit.
  - Incorrect Copy
  - When a provisioning key is incorrectly copied, the following error appears on your App Connector console when it tries to enroll:
  - notice:Checking Enrollment notice:No valid certificate. Attempting to enroll notice:Enroll: Connecting to api.private.zscaler.com via co2br.prod.zpath.net. error:Login request failed - http status(401) nonce(<3|api.private.zscaler.com|0/Z6lDT...>) fingerprint(<oXaN4RRiMc...>) notice:Certificate enrollment failed.
- Edit the provisioning key.
- Delete the provisioning key.
- Download the provisioning key.
- Go to the App Connectors or App Connector Groups pages.
