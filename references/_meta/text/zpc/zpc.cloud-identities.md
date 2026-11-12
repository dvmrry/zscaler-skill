# ZPC cloud identities: classification, power score and attributes (zpc.cloud-identities)
Also called: Posture Control cloud identities; power score

**What ZPC records.** ZPC scans the cloud deployment for identity metadata and creates a cloud infrastructure entitlement mapping across the permissions and access granted in the public cloud. [zpc.cloud-identities:entitlement-mapping] ZPC classifies identities as Human (employees and third-party vendors) or Non-Human (service-level needs such as service accounts, virtual machines or lambda functions). [zpc.cloud-identities:human-vs-non-human] The About Cloud Identities page says ZPC categorizes human identities into two sources: local identities as users manually created in a cloud service provider, whose permissions must be manually revoked across all services to remove them, and external identities as authorized users who are not local (for example contractors and federated identities). [zpc.cloud-identities:identity-source]

**Classification by provider.** For AWS, ZPC classifies Instance Profile, Auto Scaling Group and Lambda Function identities as non-human, and Public Account, Canonical User, Federated, Root Account, IAM User and User identities as human. [zpc.cloud-identities:aws-classification] For Azure, ZPC classifies Service Principal, Microsoft Apps, Virtual Machine and Managed Identities as non-human, and Microsoft Entra users and Public Account as human. [zpc.cloud-identities:azure-classification] For GCP, ZPC classifies Service Account, Compute Instance, Cloud Function, Group and Domain as non-human, and Public Account and G Suite User as human. [zpc.cloud-identities:gcp-classification]

**Power score.** The Viewing Cloud Identity Details page says the power score is a number between 0–100 that ZPC determines from the entitlements an identity holds, and that identities scoring more than 80 are also assigned power categories. [zpc.cloud-identities:power-score] The power categories ZPC assigns are Data Admin, Storage Admin, Compute Admin, IAM Admin, Security Admin, Infrastructure Admin, CICD Admin, Secret Admin, AI Admin, Log Admin, Application Admin and Cost Admin. [zpc.cloud-identities:power-categories]

**Attributes and details.** The Has MFA attribute is offered for AWS and Azure, and cloud service providers supply it only for local identities. [zpc.cloud-identities:mfa-attribute-scope] Has Password, Has Access Keys and Has Certificate are AWS-only identity attributes. [zpc.cloud-identities:aws-auth-attributes] Object ID and User Type are Azure-only identity attributes, with User Type defined by Azure as Guest or Member. [zpc.cloud-identities:azure-attributes] Created On is available for AWS, Azure and GCP identities, and only for local identities. [zpc.cloud-identities:created-on-scope] The Authentication tab offers password, access key and certificate information for all AWS local identities, and ZPC only displays authentication information for AWS local identities. [zpc.cloud-identities:authentication-tab-aws] For an access key the Authentication tab shows the region and the service in which it was last used. [zpc.cloud-identities:access-key-fields] Cloud identities can be exported as a .xlsx file. [zpc.cloud-identities:identity-export-xlsx] The identity Alerts tab shows alert status as Open, Closed or Resolved and Risk Level as Critical, High, Medium or Low, with Alert Age counted in days from the last time the status was set to Open. [zpc.cloud-identities:identity-alerts-tab]

The number of identity sources differs between pages [divergence:zpc.cloud-identities:identity-sources]. [gap:zpc.cloud-identities:power-score-floor] [gap:zpc.cloud-identities:service-status]

Sources disagree (name both sides):
- ZPC pages disagree on how many identity sources there are: About Cloud Identities lists two for human identities (Local and External, federated being an example of External), while the Cloud Identities Dashboard lists three (Local, External and Federated) and the investigation results describe Source as federated, local or external. [divergence:zpc.cloud-identities:identity-sources]
  - zscaler-help: Two sources for human identities, Local and External, with federated identities an example of External.
  - zscaler-help: Three sources, with Federated separate from Local and External.
  - zscaler-help: The Source column in investigation results is federated, local or external.
  Impact: Which grouping ZPC uses, and whether federated identities are a source of their own, is not settled by the pages; the Source column of the Cloud Identities page is described as local or external only.

Not known (open gaps):
- Whether the lowest power score is 0 or 1 [gap:zpc.cloud-identities:power-score-floor]: settled by lab-test
- Whether the ZPC features these pages describe are still available [gap:zpc.cloud-identities:service-status]: settled by source-read

Area: zpc.cloud-identities, its subjects in references/_meta/spine/zpc/zpc.cloud-identities.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpc/zpc.overview.md (What Zscaler Posture Control (ZPC) is to administer: portal access, setup order, notifications and audit logs)
- see-also references/_meta/text/portfolio/portfolio.cloud-protection.md (Zscaler Posture Control (ZPC) and Cloud Protection: what ZPC covered, and its end of life)
- see-also references/_meta/text/zpc/zpc.cloud-assets.md (ZPC cloud assets: asset types, categories and asset details)
- see-also references/_meta/text/zpc/zpc.investigation.md (ZPC investigation and dashboards: query predicates, reports and the executive report)
- see-also references/_meta/text/zpc/zpc.compliance.md (ZPC compliance: benchmarks, ignore rules and security policies)
