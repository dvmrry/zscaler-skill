---
product: zia
topic: "zia-api-casb"
title: "ZIA API CASB and SaaS Security — out-of-band scan + Insights logs"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/about-saas-security-insights-logs"
  - "vendor/zscaler-help/about-saas-security-insights-logs.md"
  - "https://help.zscaler.com/zia/about-saas-security-scan-configuration"
  - "vendor/zscaler-help/about-saas-security-scan-configuration.md"
  - "https://help.zscaler.com/zia/about-saas-security-report"
  - "vendor/zscaler-help/about-saas-security-report.md"
  - "https://help.zscaler.com/zia/saas-security-api#/casbDlpRules-post"
  - "https://help.zscaler.com/zia/saas-security-api#/casbMalwareRules-post"
  - "vendor/terraform-provider-zia/docs/resources/zia_casb_dlp_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_casb_malware_rules.md"
  - "vendor/terraform-provider-zia/docs/data-sources/zia_casb_tenant.md"
  - "vendor/terraform-provider-zia/docs/data-sources/zia_casb_email_label.md"
  - "vendor/terraform-provider-zia/docs/data-sources/zia_casb_tombstone_template.md"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/saas_security_api.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/casb_dlp_rules/casb_dlp_rules.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/saas_security_api/casb_malware_rules/casb_malware_rules.go"
  - "vendor/zscaler-sdk-python/zscaler/zia/saas_security_api.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/casb_dlp_rules.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/saas_security_api.py"
  - "vendor/zscaler-help/ranges-limitations-zia.md"
  - "vendor/zscaler-help/about-cloud-nss-feeds.md"
author-status: draft
---

# ZIA API CASB and SaaS Security — out-of-band scan + Insights logs

Out-of-band CASB for data at rest in sanctioned SaaS applications. Distinct from inline Cloud App Control, which gates live traffic flowing through the ZIA proxy. This capability is also referred to as the **SaaS Security API** in Zscaler documentation and SDK surface area.

## 1. Overview

### What API CASB is

API CASB (internally branded as the ZIA SaaS Security API, marketed as Zscaler CASB) connects to sanctioned SaaS applications via their native APIs — OAuth 2.0 authorization grants, service-account tokens, or equivalent — and scans content that already resides inside those applications. The scan is **out-of-band**: no user traffic passes through the ZIA proxy path. Zscaler reads objects directly from the SaaS platform's API and applies DLP and malware detection policies to the retrieved content.

Findings generate log entries in the SaaS Security Insights log stream and can trigger remediation actions (quarantine, permission change, labeling, notifications) against the SaaS API without requiring any inline traffic intercept.

### How API CASB differs from inline Cloud App Control

| Dimension | API CASB (SaaS Security API) | Inline Cloud App Control |
|---|---|---|
| Traffic path | Out-of-band; reads data via SaaS API | In-path; ZIA proxy sees every HTTP/S transaction |
| What is inspected | Data **at rest** inside the SaaS app (files, messages, records) | Data **in motion** — uploads, downloads, shares |
| Trigger | Scheduled scan or webhook event from the SaaS app | Real-time per-transaction evaluation |
| SSL decrypt dependency | None — uses SaaS API credentials, not traffic interception | Requires SSL Inspection for HTTPS content |
| Latency profile | Asynchronous; findings arrive after scan completes | Synchronous; action taken on the live request |
| Remediation | API-based: quarantine files, change share permissions, apply labels, notify | Block/Allow/Caution the transaction; redirect to EUN |
| Policy surface | `casbDlpRules`, `casbMalwareRules` per rule type / app category | Cloud App Control policy rules per cloud app category |
| Log stream | SaaS Security Insights Logs (Analytics > SaaS Security Insights > Logs) | Web Logs (NSS Feed, Web Insights) |
| Operator reference | `references/zia/api-casb.md` (this document) | `references/zia/cloud-app-control.md` |

See also `references/zia/dlp.md` for DLP dictionary and engine mechanics. API CASB DLP rules reference the same DLP engine pool as inline DLP web rules, but the rule objects, endpoints, and log schema are entirely separate.

### Supported application categories

The SDK and Terraform provider expose rule types that map to supported application categories. Each type represents an independent rule namespace:

| Rule type token | App category |
|---|---|
| `OFLCASB_DLP_FILE` / `OFLCASB_AVP_FILE` | Generic file-sharing applications |
| `OFLCASB_DLP_EMAIL` / `OFLCASB_AVP_EMAIL` | Email (e.g., Gmail, Exchange Online) |
| `OFLCASB_DLP_CRM` / `OFLCASB_AVP_CRM` | CRM (e.g., Salesforce) |
| `OFLCASB_DLP_ITSM` / `OFLCASB_AVP_ITSM` | ITSM (e.g., Jira, ServiceNow) |
| `OFLCASB_DLP_COLLAB` / `OFLCASB_AVP_COLLAB` | Collaboration (e.g., Slack, Webex) |
| `OFLCASB_DLP_REPO` / `OFLCASB_AVP_REPO` | Source code repositories (e.g., GitHub, Bitbucket, GitLab) |
| `OFLCASB_DLP_STORAGE` / `OFLCASB_AVP_STORAGE` | Public cloud storage (e.g., AWS S3, Azure Blob, GCP) |
| `OFLCASB_DLP_GENAI` / `OFLCASB_AVP_GENAI` | Generative AI platforms |

The Insights Logs UI groups columns and filters into eight application categories matching this list: Collaboration, CRM, Email, File, Gen AI, ITSM, Public Cloud Storage, Repository.

---

## 2. Architecture

### API connectors (SaaS Application Tenants)

Before any scanning can occur, an administrator connects Zscaler to each SaaS application tenant. The connection record is called a **CASB Tenant** (`casbTenant` in the API). Zscaler receives OAuth credentials or equivalent from the SaaS platform and stores them per tenant record. Key attributes on a tenant object:

- `tenantId` — integer; Zscaler-assigned internal ID
- `tenantName` — human-readable label for the connection
- `saasApplication` — the SaaS platform identifier (e.g., `BITBUCKET`, `JIRA`, `SLACK`)
- `enterpriseTenantId` — the customer's own identifier within the SaaS platform
- `status` — list of status strings (e.g., authorization health)
- `featuresSupported` — which CASB capabilities are enabled for this tenant (`CASB`, `SSPM`, etc.)
- `tenantWebhookEnabled` — whether the SaaS app is configured to push real-time webhook events to Zscaler in addition to scheduled scans
- `reAuth` — flag indicating the OAuth token needs to be re-authorized
- `lastTenantValidationTime` — epoch timestamp of the most recent credential validation

Limit: 16 tenants per SaaS application (contact support to increase).

### Scan jobs

A scan job is created under **Policy > SaaS Security > Scan Configuration**. A scan schedule links a tenant to a Data at Rest Scanning policy (DLP or Malware Detection rule set) and optionally a historical lookback window. Scan lifecycle states:

- **Scan Initialized** — prerequisites verified; scan not yet started
- **Running** — active scan underway; displayed start time
- **Scan Stopped** — halted manually or on error; stop time and reason displayed

The `GET /zia/api/v1/casbTenant/scanInfo` endpoint (`GetAll` in the Go SDK) returns `CasbTenantScanInfo` objects with:

- `tenantName`, `tenantId`, `saasApplication`
- `scanAction` — integer encoding the current scan disposition
- `scanInfo.cur_scan_start_time` — epoch of current or most recent scan start
- `scanInfo.prev_scan_end_time` — epoch of the previous scan end
- `scanInfo.scan_reset_num` — count of scan resets since inception

Stopping a scan flushes the processing queue. Restarting from scratch re-processes all historical data and may produce duplicate findings for already-scanned content. The recommended recovery path is to read the Insights Logs to identify the last-processed timestamp and then configure the next scan to start from that date.

### Policy engine

Two independent policy types exist, each with its own ordered rule list:

1. **Data at Rest Scanning DLP rules** (`casbDlpRules`) — apply DLP engines to content; support a rich remediation surface.
2. **Data at Rest Scanning Malware Detection rules** (`casbMalwareRules`) — apply antivirus/malware detection; narrower action set.

Both use first-match, top-down evaluation within each rule type. Rules within the same `ruleType` category are ordered; the `order` attribute must be a positive integer with no gaps. Predefined rules exist and can be reordered but not deleted.

### Quarantine and remediation

Quarantine moves a file from its original location in the SaaS platform to a designated quarantine folder (configured per-tenant). A **tombstone file** is left in place of the original to inform the file owner what happened. Tombstone templates (`quarantineTombstoneTemplate`) are pre-configured HTML/text documents. Quarantine can be reversed (file restoration) from within the SaaS platform or via the Zscaler console, depending on the application.

---

## 3. Configuration surface

### Tenant connection

The tenant connection is established through the ZIA admin console (Policy > SaaS Security > Application Tenants). Zscaler redirects through the SaaS platform's OAuth consent flow. There is no direct API endpoint documented for creating or updating tenant connections; the Terraform `zia_casb_tenant` is a **data source only** (read-only lookup) — tenant connections must be established through the UI.

Query parameters supported when listing tenants:

| Parameter | Type | Description |
|---|---|---|
| `active_only` | bool | Return only tenants whose policies are currently enforced |
| `include_deleted` | bool | Include logically-deleted tenants |
| `scan_config_tenants_only` | bool | Return only tenants that already have a scan configured |
| `include_bucket_ready_s3_tenants` | bool | For AWS S3: only tenants with buckets read and ready |
| `filter_by_feature` | []string | Filter by capability: `CASB`, `SSPM`, etc. |
| `app` | string | Filter by specific SaaS application identifier |
| `app_type` | string | Filter by category: `ANY`, `FILE`, `EMAIL`, `CRM`, `ITSM`, `COLLAB`, `REPO`, `STORAGE`, `TP_APP`, `GENAI`, `MISC` |

### Scan policies — DLP rules (`casbDlpRules`)

REST endpoint: `POST /zia/api/v1/casbDlpRules`
Read by type: `GET /zia/api/v1/casbDlpRules?ruleType=<type>`
Read all: `GET /zia/api/v1/casbDlpRules/all`
Read by ID: `GET /zia/api/v1/casbDlpRules/{id}?ruleType=<type>`
Update: `PUT /zia/api/v1/casbDlpRules/{id}`
Delete: `DELETE /zia/api/v1/casbDlpRules/{id}?ruleType=<type>`

Key rule fields (see full schema in `CasbDLPRules` struct in `casb_dlp_rules.go`):

| Field | Type | Description |
|---|---|---|
| `type` | string | Rule category (e.g., `OFLCASB_DLP_ITSM`) — required |
| `order` | int | Execution order; positive integer, no gaps, starts at 1 |
| `rank` | int | Admin rank; required when rank-based access restriction is enabled |
| `state` | string | `ENABLED` or `DISABLED` |
| `action` | string | Remediation action (see action table below) |
| `severity` | string | `RULE_SEVERITY_HIGH`, `RULE_SEVERITY_MEDIUM`, `RULE_SEVERITY_LOW`, `RULE_SEVERITY_INFO` |
| `withoutContentInspection` | bool | If true, content matching is skipped (metadata-only match) |
| `collaborationScope` | []string | Sharing scope criteria — see values below |
| `contentLocation` | string | For collaboration apps: channel type (`CONTENT_LOCATION_PRIVATE_CHANNEL`, etc.) |
| `components` | []string | Which parts of the object to inspect (see values below) |
| `fileTypes` | []string | File type categories to include; empty = all types |
| `recipient` | string | Email recipient direction: `EMAIL_RECIPIENT_INTERNAL` or `EMAIL_RECIPIENT_EXTERNAL` |
| `quarantineLocation` | string | Quarantine folder name/path within the SaaS application |
| `externalAuditorEmail` | string | Sends DLP email alerts to this address |
| `bucketOwner` | string | User whose S3/GCP/Azure buckets are in scope |
| `domains` | []string | External organization domains (for shared-channel content location) |
| `cloudAppTenants` | []IDNameExtensions | Tenant IDs this rule applies to |
| `dlpEngines` | []IDNameExtensions | DLP engine references (same pool as inline DLP) |
| `objectTypes` | []IDNameExtensions | Object type IDs within the SaaS platform |
| `buckets` | []IDNameExtensions | Storage bucket IDs for cloud storage rules |
| `users` / `groups` / `departments` | []IDNameExtensions | User/group/department scope |
| `includedDomainProfiles` / `excludedDomainProfiles` / `criteriaDomainProfiles` | []IDNameExtensions | Domain profile criteria |
| `emailRecipientProfiles` | []IDNameExtensions | Email recipient profile criteria |
| `entityGroups` | []IDNameExtensions | Entity group criteria |
| `zscalerIncidentReceiver` | IDCustom | Incident receiver for DLP alerts |
| `auditorNotification` | IDCustom | Admin notification template |
| `casbEmailLabel` | IDCustom | Email label to apply (email app rules) |
| `casbTombstoneTemplate` | IDCustom | Quarantine tombstone template |
| `watermarkProfile` | IDCustom | Watermark profile for `APPLY_WATERMARK` action |
| `redactionProfile` | IDCustom | Redaction profile for `REDACT` action |
| `tag` | IDCustom | Label tag to apply to matched objects |
| `receiver` | Receiver | Cloud-to-Cloud incident forwarding target (C2CIR) |

**DLP rule `action` values:**

| Token | Effect |
|---|---|
| `OFLCASB_DLP_REPORT_INCIDENT` | Log finding; send to incident receiver |
| `OFLCASB_DLP_ALLOW` | Explicitly allow (audit only) |
| `OFLCASB_DLP_BLOCK` | Block access to the object |
| `OFLCASB_DLP_QUARANTINE` | Move file to quarantine folder; leave tombstone |
| `OFLCASB_DLP_QUARANTINE_TO_USER_ROOT_FOLDER` | Quarantine to the file owner's root folder |
| `OFLCASB_DLP_REMOVE` | Delete the file from the SaaS application |
| `OFLCASB_DLP_SHARE_READ_ONLY` | Downgrade all sharing permissions to read-only |
| `OFLCASB_DLP_EXTERNAL_SHARE_READ_ONLY` | Downgrade external-only sharing to read-only |
| `OFLCASB_DLP_INTERNAL_SHARE_READ_ONLY` | Downgrade internal-only sharing to read-only |
| `OFLCASB_DLP_REMOVE_PUBLIC_LINK_SHARE` | Remove public link shares |
| `OFLCASB_DLP_REVOKE_SHARE` | Revoke all sharing |
| `OFLCASB_DLP_REMOVE_EXTERNAL_SHARE` | Remove external collaborator access |
| `OFLCASB_DLP_REMOVE_INTERNAL_SHARE` | Remove internal collaborator access |
| `OFLCASB_DLP_REMOVE_COLLABORATORS` | Remove all collaborators |
| `OFLCASB_DLP_REMOVE_INTERNAL_LINK_SHARE` | Remove internal link-based sharing |
| `OFLCASB_DLP_REMOVE_DISCOVERABLE` | Remove discoverable / organization-wide visibility |
| `OFLCASB_DLP_REMOVE_EXT_COLLABORATORS` | Remove external collaborators specifically |
| `OFLCASB_DLP_NOTIFY_END_USER` | Send notification to the file owner |
| `OFLCASB_DLP_APPLY_MIP_TAG` | Apply Microsoft Information Protection sensitivity label |
| `OFLCASB_DLP_APPLY_BOX_TAG` | Apply Box classification tag |
| `OFLCASB_DLP_APPLY_GOOGLEDRIVE_LABEL` | Apply Google Drive label |
| `OFLCASB_DLP_APPLY_ATLASSIAN_CLASSIFICATION_LABEL` | Apply Atlassian classification label |
| `OFLCASB_DLP_APPLY_EMAIL_TAG` | Apply email label (email app rules) |
| `OFLCASB_DLP_MOVE_TO_RESTRICTED_FOLDER` | Move to restricted folder within the SaaS app |
| `OFLCASB_DLP_APPLY_WATERMARK` | Stamp a watermark on the document |
| `OFLCASB_DLP_REMOVE_WATERMARK` | Remove an existing watermark |
| `OFLCASB_DLP_APPLY_HEADER` | Apply document header |
| `OFLCASB_DLP_APPLY_FOOTER` | Apply document footer |
| `OFLCASB_DLP_APPLY_HEADER_FOOTER` | Apply both header and footer |
| `OFLCASB_DLP_REMOVE_HEADER` | Remove document header |
| `OFLCASB_DLP_REMOVE_FOOTER` | Remove document footer |
| `OFLCASB_DLP_REMOVE_HEADER_FOOTER` | Remove both header and footer |
| `OFLCASB_DLP_REDACT` | Redact matched content in place |

**`collaborationScope` values:**

`ANY`, `COLLABORATION_SCOPE_EXTERNAL_COLLAB_VIEW`, `COLLABORATION_SCOPE_EXTERNAL_COLLAB_EDIT`, `COLLABORATION_SCOPE_EXTERNAL_LINK_VIEW`, `COLLABORATION_SCOPE_EXTERNAL_LINK_EDIT`, `COLLABORATION_SCOPE_INTERNAL_COLLAB_VIEW`, `COLLABORATION_SCOPE_INTERNAL_COLLAB_EDIT`, `COLLABORATION_SCOPE_INTERNAL_LINK_VIEW`, `COLLABORATION_SCOPE_INTERNAL_LINK_EDIT`, `COLLABORATION_SCOPE_PRIVATE_EDIT`, `COLLABORATION_SCOPE_PRIVATE`, `COLLABORATION_SCOPE_PUBLIC`

**`components` values:**

`ANY`, `COMPONENT_EMAIL_BODY`, `COMPONENT_EMAIL_ATTACHMENT`, `COMPONENT_EMAIL_SUBJECT`, `COMPONENT_ITSM_OBJECTS`, `COMPONENT_ITSM_ATTACHMENTS`, `COMPONENT_CRM_CHATTER_MESSAGES`, `COMPONENT_CRM_ATTACHMENTS_IN_OBJECTS`, `COMPONENT_CRM_CASES`, `COMPONENT_COLLAB_MESSAGES`, `COMPONENT_COLLAB_ATTACHMENTS`, `COMPONENT_GENAI_MESSAGES`, `COMPONENT_GENAI_ATTACHMENTS`, `COMPONENT_FILE_ATTACHMENTS`

### Scan policies — Malware Detection rules (`casbMalwareRules`)

REST endpoint: `POST /zia/api/v1/casbMalwareRules`
Read by type: `GET /zia/api/v1/casbMalwareRules?ruleType=<type>`
Read all: `GET /zia/api/v1/casbMalwareRules/all`
Update: `PUT /zia/api/v1/casbMalwareRules/{id}`
Delete: `DELETE /zia/api/v1/casbMalwareRules/{id}?ruleType=<type>`

Rule types use the `OFLCASB_AVP_*` prefix (the same category list as DLP rules). Key fields:

| Field | Type | Description |
|---|---|---|
| `type` | string | Rule category (e.g., `OFLCASB_AVP_REPO`) |
| `order` | int | Execution order |
| `action` | string | Malware action (see table below) |
| `state` | string | `ENABLED` or `DISABLED` |
| `quarantineLocation` | string | Quarantine destination within the SaaS app |
| `scanInboundEmailLink` | string | `SCAN_EMAIL_LINK_ENABLE` or `SCAN_EMAIL_LINK_DISABLE` |
| `cloudAppTenants` | []IDNameExtensions | Tenant scope |
| `buckets` | []IDNameExtensions | Storage bucket scope |
| `labels` | []IDNameExtensions | Rule labels |
| `casbEmailLabel` | IDCustom | Email label for email-type rules |
| `casbTombstoneTemplate` | IDCustom | Quarantine tombstone template |

**Malware rule `action` values:**

| Token | Effect |
|---|---|
| `OFLCASB_AVP_REPORT_MALWARE` | Log detection; generate incident |
| `OFLCASB_AVP_ALLOW` | Allow (audit only) |
| `OFLCASB_AVP_BLOCK` | Block access to the file |
| `OFLCASB_AVP_QUARANTINE` | Move to quarantine; leave tombstone |
| `OFLCASB_AVP_REMOVE` | Delete the file |
| `OFLCASB_AVP_APPLY_EMAIL_TAG` | Apply email label (email app rules) |

### Auxiliary configuration objects

| Object | REST endpoint | Description |
|---|---|---|
| Domain Profiles | `GET /zia/api/v1/domainProfiles` | Named sets of domains for DLP rule criteria (include/exclude/mandatory) |
| Quarantine Tombstone Templates | `GET /zia/api/v1/quarantineTombstoneTemplate/lite` | HTML/text files left in place of quarantined content |
| CASB Email Labels | `GET /zia/api/v1/casbEmailLabel/lite` | Labels applied to matched email messages |
| Tenant Tag Policy | `GET /zia/api/v1/casbTenant/{tenantId}/tags/policy` | Tags associated with a specific tenant |

### Terraform resources and data sources

| Resource / Data source | Terraform type | Notes |
|---|---|---|
| `zia_casb_dlp_rules` | Resource | Full CRUD for DLP scan rules; predefined rules can be reordered, not deleted |
| `zia_casb_malware_rules` | Resource | Full CRUD for malware scan rules |
| `zia_casb_tenant` | Data source | Read-only; tenant connections must be established in UI |
| `zia_casb_tombstone_template` | Data source | Read-only lookup by name or ID |
| `zia_casb_email_label` | Data source | Read-only lookup by name or ID |

Important Terraform constraints for CASB rule resources:

- `order` must be a positive whole number starting at 1; negative values and zero are rejected.
- Rule orders must be contiguous (no gaps). Deleting a rule requires re-adjusting the remaining order numbers.
- Predefined rules cannot be destroyed via Terraform; use `-target` to delete specific custom rules.
- Import syntax: `terraform import zia_casb_dlp_rules.this "<rule_type:rule_id>"` (note: both colon-delimited values required).

### SDK surface

**Go SDK** (`github.com/zscaler/zscaler-sdk-go/v3/zscaler/zia/services/saas_security_api`):

- `GetCasbTenantLite(ctx, service, queryParams)` → `[]CasbTenants`
- `GetAll(ctx, service)` → `[]CasbTenantScanInfo` (scan status for all tenants)
- `GetDomainProfiles(ctx, service)` → `[]DomainProfiles`
- `GetQuarantineTombstoneLite(ctx, service)` → `[]QuarantineTombstoneLite`
- `GetCasbEmailLabelLite(ctx, service)` → `[]CasbEmailLabel`
- `GetCasbTenantTagPolicy(ctx, service, tenantID)` → `[]CasbTenantTags`

Sub-packages:

- `casb_dlp_rules.GetByRuleType / GetByRuleID / Create / Update / Delete / GetAll`
- `casb_malware_rules.GetByRuleType / GetByRuleID / Create / Update / Delete / GetAll`

**Python SDK** (`zscaler.zia.saas_security_api.SaaSSecurityAPI`):

- `list_domain_profiles_lite()` → `List[DomainProfiles]`
- `list_quarantine_tombstone_lite()` → `List[QuarantineTombstoneTemplate]`
- `list_casb_email_label_lite()` → `List[CasbEmailLabel]`
- `list_casb_tenant_lite(query_params)` → `List[CasbTenant]`
- `list_saas_scan_info(query_params)` → `List[SaaSScanInfo]`

Python DLP rule client (`zscaler.zia.casb_dlp_rules.CasbdDlpRulesAPI`):

- `list_rules(rule_type, query_params)` — list by type
- `get_rule(rule_id, rule_type)` — fetch by ID
- `list_all_rules()` — all rules across all types
- `add_rule(**kwargs)` — create
- `update_rule(rule_id, **kwargs)` — update
- `delete_rule(rule_id, rule_type)` — delete

Note: `enabled=True/False` is translated to `state=ENABLED/DISABLED` automatically by the Python SDK.

---

## 4. SaaS Security Insights Log Schema

Insights logs live at **Analytics > SaaS Security Insights > Logs** in the ZIA console, stored for **180 days** in Nanolog servers. They can also be streamed to a SIEM via NSS (VM-based) or Cloud NSS (one feed per log type per Cloud NSS instance). The log type in NSS feed configuration is listed as **SaaS Security**.

The schema is **per-application-category**: each category (Collaboration, CRM, Email, File, Gen AI, ITSM, Public Cloud Storage, Repository) has its own column set and its own filter set in the UI. The table below documents fields that appear across categories based on the source documentation.

**Important caveat:** Zscaler's `about-saas-security-insights-logs.md` source document describes the UI and available categories but does not publish a machine-readable field manifest equivalent to the NSS feed CSV (see `vendor/zscaler-help/nss-web-logs.csv` for the web log schema). The field inventory below is derived from the category groupings, filter descriptions, and column names described in the UI documentation. This is a **known gap** — see [Open questions](#7-open-questions).

### Common fields (all categories)

These fields appear in the Insights log table regardless of application category:

| Field name | Type | Description |
|---|---|---|
| Transaction time | timestamp | Time the scan event was recorded by the Zscaler SaaS Connector |
| SaaS Application | string | Name of the SaaS platform (e.g., Slack, GitHub, Salesforce) |
| Tenant | string | The CASB tenant name (corresponds to `tenantName` on the tenant object) |
| Rule Name | string | The CASB DLP or Malware Detection rule that triggered |
| Rule Type | string | Category token (e.g., `OFLCASB_DLP_ITSM`) — maps to application category |
| Action | string | Remediation action taken (e.g., `QUARANTINE`, `REPORT_INCIDENT`) |
| Severity | string | Severity level assigned by the matched rule |
| DLP Engine | string | Name of the DLP engine that detected the violation (DLP rules only) |
| DLP Dictionaries | string | Comma-separated list of triggering DLP dictionaries |
| Threat Name | string | Malware threat name (malware rules only) |
| Object Name | string | File name, message subject, ticket title, or equivalent object identifier |
| Object Type | string | Type of object within the SaaS app (e.g., attachment, message body, issue) |
| URL | string | URL or path to the object within the SaaS application |
| Sub-URL | string | Sub-path portion of the object URL; truncated to 2,041 characters |
| Owner / User | string | User or account that owns or created the object |
| Department | string | ZIA department associated with the user |
| Location | string | ZIA location associated with the user |

### Collaboration columns

Additional columns for apps in the Collaboration category (e.g., Slack, Webex):

| Field name | Type | Description |
|---|---|---|
| Channel | string | Channel name where the content was found |
| Content Location | string | Channel type (private, public, shared, direct message) |
| Collaborators | string | Users with access to the content |
| Collaboration Scope | string | Scope of sharing at time of scan |

### CRM columns

Additional columns for CRM-category apps (e.g., Salesforce):

| Field name | Type | Description |
|---|---|---|
| CRM Object | string | Record type (case, account, chatter message, attachment) |
| Component | string | Component inspected (chatter message, attachment, case body) |

### Email columns

Additional columns for Email-category apps (e.g., Gmail, Exchange Online):

| Field name | Type | Description |
|---|---|---|
| Sender | string | Email sender address |
| Recipients | string | Email recipient addresses |
| Subject | string | Email subject line |
| Recipient Direction | string | Internal or external recipient classification |
| Component | string | Part of the email inspected (body, attachment, subject) |

### File columns

Additional columns for File-category apps (e.g., Box, Google Drive, Dropbox, OneDrive):

| Field name | Type | Description |
|---|---|---|
| File Name | string | Name of the file inspected |
| File Type | string | File type category (e.g., `FTCATEGORY_PDF`, `FTCATEGORY_SQL`) |
| File Size | integer | Size of the file in bytes |
| Internal Collaborators | string / integer | Internal users with access; count range bucket if criteria-based |
| External Collaborators | string / integer | External users with access; count range bucket if criteria-based |
| Collaboration Scope | string | Sharing permissions at time of scan |

### Gen AI columns

Additional columns for Gen AI-category apps:

| Field name | Type | Description |
|---|---|---|
| Conversation ID | string | Identifier for the AI conversation or session |
| Component | string | Part inspected (message, attachment) |
| Prompt / Response | string | Whether the detected content was in a prompt or a model response |

### ITSM columns

Additional columns for ITSM-category apps (e.g., Jira, ServiceNow):

| Field name | Type | Description |
|---|---|---|
| Ticket / Issue ID | string | ITSM object identifier |
| Component | string | Part inspected (object body, attachment) |
| Project / Queue | string | ITSM project or queue the object belongs to |

### Public Cloud Storage columns

Additional columns for cloud storage (e.g., AWS S3, Azure Blob, GCP Cloud Storage):

| Field name | Type | Description |
|---|---|---|
| Bucket Name | string | Storage bucket or container name |
| Bucket Owner | string | Account that owns the bucket |
| Object Key | string | Full key/path of the object within the bucket |
| File Type | string | File type category |
| File Size | integer | File size in bytes |

### Repository columns

Additional columns for repository apps (e.g., GitHub, Bitbucket, GitLab):

| Field name | Type | Description |
|---|---|---|
| Repository Name | string | Name of the source code repository |
| Branch | string | Branch where the content was found |
| Commit / File Path | string | Path to the file within the repository |
| File Type | string | File type category |
| File Size | integer | File size in bytes |

### Log filter dimensions

The Insights Logs page supports filters across these dimensions (varies by category):

- Users, Departments, Locations (up to 200 values per filter; include or exclude)
- Application, Tenant, Rule Name, Rule Type
- Action, Severity, DLP Engine, DLP Dictionary
- Threat Name (malware)
- Object Name, File Type, Component, Collaboration Scope, Content Location
- Threat Super Category (supports `Does Not Contain`, `Is Null`, etc. operators)
- Time range: predefined or Custom with up to 92-day span

### Export and retention

| Limit | Value |
|---|---|
| Log retention | 180 days in Nanolog |
| Export to CSV | Up to 100K entries per export; 20 requests/hour |
| Sub-URL field length in display / CSV | 2,041 characters (truncated if exceeded) |
| Custom time range span | Up to 92 days after start date |

### NSS / Cloud NSS streaming

To forward SaaS Security Insights logs to a SIEM in real time:

- **Cloud NSS**: Configure one Cloud NSS feed with log type set to **SaaS Security**. One feed per log type per Cloud NSS instance. Output format: JSON. The feed is cloud-to-cloud; no NSS VM is required.
- **NSS VM**: Use an NSS Feed for the SaaS Security log type. Up to 16 feeds per NSS server (shared with other log types).

Both options use the Nanolog Streaming Service infrastructure. Logs are stored for 180 days in Nanolog regardless of streaming configuration.

---

## 5. Ranges and Limits

| Feature | Limit | Notes |
|---|---|---|
| Tenants per SaaS application | 16 | Contact support to increase |
| External trusted domain/user profiles per application | 32 | |
| SaaS Security API Scans: Amazon S3 | 1,000 buckets | |
| SaaS Security API Scans: Azure | 1,000 blob containers | |
| SaaS Security API Scans: GCP | 1,000 buckets | |
| SaaS Security API Scans: Bitbucket | 32 repositories | |
| Exported Transactions (Insights Logs) | 100K entries per export | |
| CSV Export Rate | 20 requests/hour | |
| Sub-URL display/CSV length | 2,041 characters | Truncated beyond limit |
| Insights Log custom time range | 92 days after start date | |
| Log retention | 180 days | Nanolog servers |
| Rule order | Positive integer, no gaps, starts at 1 | Zero and negative rejected |

---

## 6. Common Gotchas

### Scan latency — findings are not real-time

API CASB is asynchronous. A file uploaded to a SaaS application does not trigger a finding until the next scan run reaches that file. Depending on the volume of data in the tenant and the scan schedule, findings can be hours to days behind the actual upload event. Webhooks reduce this gap for applications that support them (`tenantWebhookEnabled = true`), but webhook coverage is application-dependent.

**Operator impact:** API CASB is not a substitute for inline DLP for time-sensitive controls. It is complementary — it catches data that was already in the SaaS app before ZIA was deployed, was uploaded through a client that bypassed the proxy, or was shared internally within the SaaS app without triggering a proxy transaction.

### Quarantine reversal requires care

Stopping a scan after quarantine actions have been taken does not automatically restore quarantined files. If a scan is stopped and restarted from the beginning, the same files may be quarantined again, creating duplicate quarantine events. Use the Insights Logs to identify the last-processed timestamp before restarting a scan, then configure the new scan to start from that timestamp.

### OAuth scope creep

Connecting a SaaS tenant grants Zscaler an OAuth credential. The scope of that credential may be broader than the minimum necessary for scanning. Administrators should review what OAuth permissions the Zscaler application has requested in each connected SaaS platform and reduce scopes where possible via the SaaS platform's OAuth app management UI. Zscaler stores the credential as the `CasbTenants` record; a `reAuth` flag indicates when re-authorization is needed (e.g., after scope changes or token expiry).

### Re-authentication (`reAuth`)

When `reAuth = true` on a tenant object, scans for that tenant will not run. This is triggered by expired or revoked OAuth tokens, a change in the SaaS application's OAuth policies, or administrative rotation of API credentials. The resolution is to re-authorize the Zscaler CASB application within the SaaS platform's OAuth/API management console and confirm the connection in the Zscaler admin console.

### Multi-tenant SaaS coverage

Each SaaS application supports up to 16 tenant connections (default). Enterprises with more than 16 separate tenants of a single SaaS platform (e.g., 16+ distinct GitHub organizations or Salesforce orgs) must contact Zscaler support to increase the limit. Policies are always scoped to specific tenants (`cloudAppTenants` in the rule); a rule not scoped to any tenant will not run against any data.

### Rule type namespace isolation

DLP rules and Malware Detection rules are independent namespaces. An `OFLCASB_DLP_ITSM` rule has no effect on malware scanning; an `OFLCASB_AVP_ITSM` rule has no effect on DLP inspection. Order numbers are also independent per namespace. When managing rules via Terraform or the API, the `ruleType` query parameter is required on GET and DELETE operations to identify the correct rule within the ordered list.

### No SSL Inspection dependency

Unlike inline DLP (see `references/zia/dlp.md` and `references/zia/ssl-inspection.md`), API CASB does not require SSL Inspection. The SaaS API calls from Zscaler to the SaaS platform are direct API calls authenticated by the tenant credential — no user traffic is intercepted. This means API CASB works for SaaS applications that are SSL-pinned or whose traffic is excluded from ZIA inspection.

### Tenant profiles vs. CASB tenants

**Tenant Profiles** (Policy > Cloud App Control > Tenant Profiles) — used by inline Cloud App Control to restrict access to specific SaaS platform tenants (e.g., allow only the corporate Google Workspace). These are inline, proxy-path objects. See `references/zia/tenant-profiles.md`.

**CASB Tenants** (`casbTenant`) — OAuth connection records used by API CASB to authenticate to a SaaS platform for out-of-band scanning. These are distinct objects, distinct API endpoints, and a different concept. Do not confuse them.

---

## 7. Open Questions

| ID | Question | Gap source |
|---|---|---|
| `api-casb-01` | The `about-saas-security-insights-logs.md` source document describes categories and filter names but does not publish a machine-readable field-level schema (field name, API key, type, example value) equivalent to `nss-web-logs.csv`. Exact field names and types for each category column are not confirmed from source. | audit |
| `api-casb-02` | Can SaaS Security Insights logs be streamed via Cloud NSS in all ZIA deployments, or is Cloud NSS for SaaS Security a separately licensed capability? The Cloud NSS feed documentation (`about-cloud-nss-feeds.md`) lists "SaaS Security" as a log type without licensing caveats, but the SaaS Security API itself may require a CASB license add-on. | coverage |
| `api-casb-03` | What is the `scanAction` integer encoding on `CasbTenantScanInfo`? The Go SDK stores it as `int` with no documented enum values in the captured sources. | schema |
| `api-casb-04` | Does `OFLCASB_DLP_GENAI` include both prompt content and model responses in `COMPONENT_GENAI_MESSAGES`, or are prompts and responses distinct component values? The `about-saas-security-insights-logs.md` source hints at Prompt/Response as a log column but the component enum does not separate them. | schema |
| `api-casb-05` | What SaaS applications are supported under each rule type category? The SDK documents the categories but not the exhaustive list of supported SaaS platforms per category. The help portal has application-specific configuration guides not captured in the current vendor snapshot. | coverage |
| `api-casb-06` | How does the `Cloud-to-Cloud Incident Receiver (C2CIR)` integration work operationally? The `Receiver` struct on `CasbDLPRules` references `smir_bucket_config` but the mechanics of cross-cloud incident forwarding are not documented in captured sources. | architecture |
| `api-casb-07` | Supported `file_types` values for CASB DLP rules: the Terraform and Python SDK documentation references the full list at the API reference URL (`saas-security-api#/casbDlpRules-post`) but that URL was not captured in the vendor snapshot. | schema |
