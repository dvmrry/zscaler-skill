# About App Connector Provisioning Keys

**Source:** https://help.zscaler.com/zpa/about-connector-provisioning-keys
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help 
App Connector Management 
App Connector Provisioning Keys 
About App Connector Provisioning Keys
Private Access (ZPA)
About App Connector Provisioning Keys
Ask Zscaler

The provisioning key is a text string that is used to enroll an App Connector. When deploying an App Connector, you are prompted to enter this key. The provisioning key functions like a credential for the App Connector, enabling the Private Access (ZPA) cloud to verify the App Connector's authenticity and complete the deployment process. Furthermore, each key is associated with a specific App Connector group, so the key allows the Private Access cloud to identify the App Connector group to which an App Connector must be deployed.

Provisioning keys should be treated as secrets and properly protected because they can create a resource for a tenant. The provisioning key must also be secured and not transmitted or stored in clear text.

App Connector provisioning keys provide the following benefits and enable you to:

Deploy App Connectors into an associated App Connector group.
Limit the number of times a key can be used for deployment.
View the current key utilization count.
Edit the maximum number of key uses.
Select the signing certificate used to enroll App Connector certificates.

The following is an App Connector provisioning key example:

1|api.private.zscaler.com|68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/68F0AOEgpcG8McLmwdborq2m6v2 A5oNEpSztJ/68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/68F0 AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/68F0AOEgpcG8McLmwdb orq2m6v2A5oNEpSztJ/68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ/68F0AOEgpcG8McLmwdborq2m6v2A5oNEpS ztJ/68F0AOEgpcG8McLmwdborq2m6v2A5oNEpSztJ==

Provisioning keys are designed to enable auto-scaling so that you can easily deploy additional App Connectors and respond optimally to increases in required capacity. When you generate a provisioning key, you can specify the number of times a key can be used to deploy App Connectors.

Private Access tracks the number of times a key is used to deploy an App Connector and displays it on the App Connector Provisioning Keys page. When a key is used the maximum number of times, you cannot use it to deploy more App Connectors. However, you can always edit the maximum number of times a key can be used. You also have the option of associating multiple provisioning keys to a single App Connector group.

About the App Connector Provisioning Keys Page

On the App Connector Provisioning Keys page (Infrastructure > Private Access > Component > App Connector Keys), you can do the following:

View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
Hide the filters on the page by clicking Hide Filters. Click Show Filters to show the filters.
Refresh the App Connector Provisioning Keys page to reflect the most current information.
Filter the information that appears in the table. By default, no filters are applied.
Add a new provisioning key.
View a list of all the provisioning keys. For each key, you can see:
Name: The name of the key. Expand the row to view the signing certificate for the provisioning key.
Maximum # of App Connectors: The maximum number of App Connectors that can be deployed using the key. This entry is based on the value entered for Maximum Reuse of Provisioning Key when adding or editing a provisioning key.
Provisioning Key Utilization Count: The number of times the provisioning key has been used.
App Connector Group: The App Connector group associated with the key.
Provisioning Key: The key needed for deploying an App Connector. This entry is blank if you disabled the View or Export Provisioning Key After Creation option when configuring App Connectors.
Modify the columns displayed in the table.

Copy the provisioning key to your clipboard.

If you disabled the View or Export Provisioning Key After Creation option when configuring an App Connector, this icon is hidden for security purposes. If the provisioning key doesn't appear, and a backup of the provisioning key isn't securely stored in an external credential vault, a new key must be generated. A new provisioning key can be created and attached to the same App Connector.

If the Provisioning Key Utilization Count is reached, you cannot copy the key. A Warning icon appears next to the disabled Copy icon. You can edit the key to raise the limit.

See image.

Close

When a provisioning key is incorrectly copied, the following error appears in your App Connector console when it tries to enroll:

notice:Checking Enrollment
notice:No valid certificate. Attempting to enroll
notice:Enroll: Connecting to api.private.zscaler.com via co2br.prod.zpath.net.
error:Login request failed - http status(401) nonce(<3|api.private.zscaler.com|0/Z6lDT...>) fingerprint(<oXaN4RRiMc...>)
notice:Certificate enrollment failed.
Edit provisioning key details.
Delete a provisioning key.

If a provisioning key is configured using Zscaler Deception or is managed by Zscaler, then the edit and delete options are unavailable.

See image.

Close

Download the provisioning key to your system in a file format.

If you disabled the View or Export Provisioning Key After Creation option when configuring an App Connector, this icon is hidden for security purposes.

Display more rows or a different page of the table.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About App Connector Provisioning Keys
Configuring App Connector Provisioning Keys
Editing App Connector Provisioning Keys
