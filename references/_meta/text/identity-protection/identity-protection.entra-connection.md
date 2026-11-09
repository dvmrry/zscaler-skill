# How an Entra ID tenant is connected to ITDR: deployment script, permissions, certificates and scan setup (identity-protection.entra-connection)
Also called: connect entra id tenant itdr; itdr deployment script azure

After an Entra ID tenant is connected, attribute collection is enabled by default and change detection is enabled by default. [identity-protection.entra-connection:defaults] ITDR uses a deployment script to create resources such as a resource group, app, storage account and service principal in Entra ID and to enable diagnostic settings for log-based change detection; the audit logs are analyzed and updated in the ITDR Admin Portal every 15 minutes. [identity-protection.entra-connection:deployment-script-resources] The audit log cadence against other pages' change detection timing is open [gap:identity-protection.entra-connection:entra-log-cadence].

## Connecting a tenant

Connecting an Entra ID tenant requires an Entra ID account with the Global Administrator role and the tenant's Tenant ID, Subscription ID and Region. [identity-protection.entra-connection:prerequisites] Adding a tenant in the ITDR Admin Portal takes Tenant ID, Subscription ID, Region, Scan Frequency, Scan Time and a Scan Timeout entered in minutes. [identity-protection.entra-connection:tenant-details-fields]

**Getting the script.** The deployment script can be obtained by an automated method (a PowerShell command that downloads and runs it in Azure Cloud Shell) or a manual method (a downloaded PSM1 file uploaded to Cloud Shell); the automated command's resource group is named ZscalerITDR by default and the RGName attribute in the command customizes it. [identity-protection.entra-connection:script-methods-and-rg-name]

**Permissions.** After deploying resources, the script prompts to grant read access to subscriptions with three options (Yes to all, No to all, Confirm for each); if none is selected, No to all is selected by default and can be changed later. [identity-protection.entra-connection:subscription-read-access] Zscaler recommends adding remediation action permissions during the initial Entra ID deployment, and the step can be skipped if remediations will not be performed. [identity-protection.entra-connection:remediation-permissions] After deployment, the operator grants admin consent for the ITDR application (click Grant admin consent, then Yes in the confirmation window); because required permissions might change, the deployment script is run again with the Update-AppRegistrationPermissions option and the ITDR app ID. [identity-protection.entra-connection:admin-consent-and-permission-updates]

## Managing a connected tenant

The Entra ID page lists per tenant the Tenant ID, Client ID, Storage Account, Scan Frequency (Daily, Weekly, Monthly or Quarterly) and the Subscriptions with Read Access; its Current State values include Waiting (scan yet to start) and Error (scan stopped or not started due to an error). [identity-protection.entra-connection:tenant-list-fields] Which defaults the pages leave out is open [gap:identity-protection.entra-connection:entra-defaults-not-stated].

**Certificates.** The certificates generated for the ITDR app registration are valid for one year; an expired certificate is renewed by entering 3 in the deployment script. [identity-protection.entra-connection:certificate-validity] The Refresh icon for renewing an Entra ID tenant's certificate appears 30 days before the certificate expires; after renewing, the deployment script must be run with the Sync Secret option to sync. [identity-protection.entra-connection:certificate-refresh]

**Editing, deleting and scanning.** A tenant counts as connected when its Tenant ID, Client ID and Storage Account are populated; for a connected tenant only Scan Frequency, Scan Time and Scan Timeout can be edited, whereas an unconnected tenant allows all fields. [identity-protection.entra-connection:edit-connected-tenant] Deleting an Entra ID tenant connection removes it from the ITDR Admin Portal; for a connected tenant, removing the deployed resources requires running the deployment script in Cloud Shell and choosing the undeploy option. [identity-protection.entra-connection:delete-tenant-undeploy] An Entra ID tenant's posture scan schedule is set when the tenant is added; an on-demand scan can be triggered with the tenant's Trigger Scan icon under Actions or directly from the Entra ID Posture dashboard. [identity-protection.entra-connection:on-demand-scan]

## Related subjects

[Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview) [Entra ID posture in Identity Protection: dashboard, issues, roadmap, reports and remediation](kb:identity-protection.entra-posture) [Active Directory and Entra ID change detection in Identity Protection: monitored issues, cycle, Impact values and remediation](kb:identity-protection.change-detection) [Scan setup and results: the AD posture scan, AD Privileged Account Tracking and the endpoint credential exposure scan](kb:identity-protection.posture-scans) [How ITDR threat detection policies, custom change detection policies and email notifications are configured](kb:identity-protection.detection-policies) [How the AD and Entra ID issue, object and change detection safelists work](kb:identity-protection.safelists)

What to check:
1. Whether the Entra ID account used for the deployment holds the Global Administrator role, and that the Tenant ID, Subscription ID and Region were obtained.
2. Whether the tenant's Tenant ID, Client ID and Storage Account are populated before deciding which fields can be edited.

Not known (open gaps):
- How the 15-minute Entra ID audit log analysis relates to the change detection cadence on other pages [gap:identity-protection.entra-connection:entra-log-cadence]: settled by source-read or lab-test
- Defaults the Entra ID connection articles do not state [gap:identity-protection.entra-connection:entra-defaults-not-stated]: settled by source-read or lab-test

Area: identity-protection.entra-connection, its subjects in references/_meta/spine/identity-protection/identity-protection.entra-connection.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/identity-protection/identity-protection.change-detection.md (Active Directory and Entra ID change detection in Identity Protection: monitored issues, cycle, Impact values and remediation)
- links-to references/_meta/text/identity-protection/identity-protection.detection-policies.md (How ITDR threat detection policies, custom change detection policies and email notifications are configured)
- links-to references/_meta/text/identity-protection/identity-protection.entra-posture.md (Entra ID posture in Identity Protection: dashboard, issues, roadmap, reports and remediation)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.posture-scans.md (Scan setup and results: the AD posture scan, AD Privileged Account Tracking and the endpoint credential exposure scan)
- links-to references/_meta/text/identity-protection/identity-protection.safelists.md (How the AD and Entra ID issue, object and change detection safelists work)
