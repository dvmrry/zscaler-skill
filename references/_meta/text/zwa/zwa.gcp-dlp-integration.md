# The GCP DLP application integration for Workflow Automation: Cloud-to-Cloud only, fields, validation and privacy settings (zwa.gcp-dlp-integration)
Also called: gcp dlp integration; google cloud dlp integration; dlp gcp application integration; cloud-to-cloud incident forwarding gcp

For Google Cloud Platform, only the Cloud-to-Cloud Incident Forwarding method is supported for the DLP application integration in Workflow Automation, and it sends DLP incident metadata and evidence files to the organization's GCP storage buckets without deploying appliances. [zwa.gcp-dlp-integration:cloud-to-cloud-only] The NAT Gateway IPs of the organization's Workflow Automation cloud must be allowed on the storage account; the cloud is identified from the admin login URL (the page's example: logging in at https://app.us1.zsworkflow.net/ gives the cloud produs1). [zwa.gcp-dlp-integration:nat-gateway-ips] The pages give different example login URLs for the same cloud [divergence:zwa.gcp-dlp-integration:cloud-url-example].

**Adding the integration.** The DLP GCP integration takes an Integration Name, the Project ID, Private Key and Client Email copied from the downloaded JSON key (project_id, private_key, client_email), and a Prefix for Bucket and Topic. [zwa.gcp-dlp-integration:integration-fields] Validate checks the account credentials entered with the GCP integration, and the integration can only be added if it passes; if validation fails or wrong values were saved, the GCP configuration page says to disable and re-enable the integration after correcting the values. [zwa.gcp-dlp-integration:validate-before-add] The two GCP pages word the correct-and-re-enable step in a different order [divergence:zwa.gcp-dlp-integration:reenable-order]. After adding the integration, it can be verified in the Google Cloud console by searching for Subscriptions and filtering by the integration name or the prefix entered in the Zscaler Admin Console. [zwa.gcp-dlp-integration:verify-in-google-console]

**Privacy settings.** In the Privacy Settings section of the DLP GCP integration, Hide Evidence Data and Hide Trigger Data are selected by default for admins, end users and managers/approvers, and Hide Policy Details is not selected by default for admins but is selected by default for end users and managers/approvers. [zwa.gcp-dlp-integration:privacy-hide-defaults] The Hide Policy Details for Non-Triggered Matches checkboxes (Admin, End User, Manager/Approver) in the GCP integration hide the Non-Triggered Engines and Dictionaries and Other Matched Rules sections of the policy details, and each is only available when the matching Hide Policy Details checkbox is not selected; the Admin one is not selected by default. [zwa.gcp-dlp-integration:privacy-non-triggered] The defaults of the End User and Manager/Approver non-triggered checkboxes are open [gap:zwa.gcp-dlp-integration:non-triggered-defaults]. If Hide Evidence Data or Hide Trigger Data is disabled in the integration but read access to the storage accounts was not enabled when creating the cloud resources, no one can generate evidence links or view trigger data in the Zscaler Admin Console. [zwa.gcp-dlp-integration:privacy-read-access-dependency] How read access is enabled when the resources are created is open [gap:zwa.gcp-dlp-integration:read-access-creation-option].

**Managing.** On the GCP managing page, the Connected Accounts list shows the statuses Enabled, Disabled or Failed and shows deleted integrations when Show Deleted Accounts is enabled; only Enabled, Disabled or Failed accounts can be deleted, Delete Integration changes the status to Deleted, and a Deleted integration allows only its data privacy fields to be edited; the dashboard status oval counts enabled, Connected accounts and not Failed or Deleted ones. [zwa.gcp-dlp-integration:managing-lifecycle]

The Google Cloud resources are in [GCP resources for the DLP integration: Deployment Manager end of support, permissions, prefix, KMS, retention, buckets, Pub/Sub and service account roles](kb:zwa.gcp-dlp-integration.resources). Where the incidents then appear is [Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting](kb:zwa.incidents). The ZIA-side Google Cloud forwarding page is covered in [Cloud-to-Cloud Incident Forwarding: storage onboarding for AWS, Google Cloud and Azure](kb:zia.dlp.cloud-to-cloud-forwarding). The API, SDKs and Terraform are unread [gap:zwa.gcp-dlp-integration:other-sources-unchecked].

What to check:
1. Whether the NAT Gateway IPs of the Workflow Automation cloud are allowed on the storage account.
2. Whether Validate passed, and whether the integration was disabled and re-enabled after the values were corrected (the pages differ on whether to correct first).
3. Whether read access to the storage accounts was enabled when the cloud resources were created, if Hide Evidence Data or Hide Trigger Data is disabled; the GCP page names no creation-time option to test.

Sources disagree (name both sides):
- The GCP page's example login URL for identifying the cloud differs from the Azure Incident Receiver page's example. [divergence:zwa.gcp-dlp-integration:cloud-url-example]
  - zscaler-help: Logging in at app.us1.zsworkflow.net gives the cloud produs1.
  - zscaler-help: Logging in at app.produs1.zsworkflow.net gives the cloud produs1.
  Impact: The cloud name produs1 is the same in both, but the login hostname differs (us1 versus produs1), so which hostname admins of that cloud use is not settled by the pages; read the cloud from the tenant's own login URL.
- The GCP configuration page and the GCP managing page word the step after a failed validation differently, and the managing page has both wordings. [divergence:zwa.gcp-dlp-integration:reenable-order]
  - zscaler-help: Disable and re-enable the integration after correcting the values.
  - zscaler-help: In the adding steps: disable the integration, correct the values, then re-enable it (the editing steps of the same page use the configuration page's wording).
  Impact: Whether the values are corrected before or after the disable is not settled; the page's common requirement is that the integration is disabled and re-enabled once the values are right.

Not known (open gaps):
- What are the defaults of the End User and Manager/Approver Hide Policy Details for Non-Triggered Matches checkboxes on the GCP integration? [gap:zwa.gcp-dlp-integration:non-triggered-defaults]: settled by lab-test or source-read
- How is read access to the storage accounts enabled when the GCP cloud resources are created? [gap:zwa.gcp-dlp-integration:read-access-creation-option]: settled by lab-test or support-ticket
- What do the Workflow Automation API, SDKs and Terraform say about the GCP integration? [gap:zwa.gcp-dlp-integration:other-sources-unchecked]: settled by source-read

Area: zwa.gcp-dlp-integration, its subjects in references/_meta/spine/zwa/zwa.gcp-dlp-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.dlp.cloud-to-cloud-forwarding.md (Cloud-to-Cloud Incident Forwarding: storage onboarding for AWS, Google Cloud and Azure)
- links-to references/_meta/text/zwa/zwa.gcp-dlp-integration.resources.md (GCP resources for the DLP integration: Deployment Manager end of support, permissions, prefix, KMS, retention, buckets, Pub/Sub and service account roles)
- links-to references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.dlp.incident-forwarding.md (Where a DLP match goes: notification, ICAP, Incident Receiver and Cloud-to-Cloud)
- see-also references/_meta/text/zwa/zwa.aws-dlp-integration.md (The AWS DLP application integration for Workflow Automation: the two forwarding methods, the three AWS resources, regions, support role and validation)
- see-also references/_meta/text/zwa/zwa.azure-dlp-integration.management.md (Managing DLP Azure integrations in Workflow Automation: statuses, delete, enable and disable, dashboard counts and defaults)
