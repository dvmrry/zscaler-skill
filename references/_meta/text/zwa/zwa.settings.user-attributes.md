# Workflow Automation user attributes: SCIM and CSV data sources, the unique identifier and the CSV import (zwa.settings.user-attributes)
Also called: zwa user attributes; CSV user attributes import; SCIM user attributes; CSV template instructions

Workflow Automation fetches end user attributes (such as employee ID, email address and manager's name) from two data sources, SCIM and CSV imports; this page says CSV must be selected as the primary data source with a unique identifier on Account Settings and otherwise SCIM is selected as the default primary data source. [zwa.settings.user-attributes:data-sources] The default primary data source is described two ways [divergence:zwa.settings.user-attributes:default-primary-source]. The primary data source and unique identifier are chosen in [Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release](kb:zwa.settings).

**CSV as the primary source.** With CSV as the primary user data source, Workflow Automation displays only the attributes in the CSV file and does not populate an attribute missing from it. [zwa.settings.user-attributes:csv-primary-source] The unique identifiers are email address and employee ID; if the selected identifier is not in the CSV file the other one locates the user, and if neither is in the file the user information is fetched from SCIM. [zwa.settings.user-attributes:unique-identifier-fallback] After the first CSV file is imported the selected Unique Identifier cannot be changed, and changing it requires contacting Zscaler Support; the first import requires setting the primary user data source and a unique identifier. [zwa.settings.user-attributes:unique-identifier-locked]

**Importing.** Only a valid CSV file built from one of the CSV template versions and the template instructions can be imported; the CSV Template Instruction download (a .pdf file) gives the attributes, formats, maximum character limits (for example User Name 50 and User Email 320) and example values, and an empty or incorrect file fails validation with a link to download the list of errors. [zwa.settings.user-attributes:csv-validation] A CSV import takes time for many attributes and ends as complete, partially complete or failed, with an email notification of each outcome. [zwa.settings.user-attributes:import-status] A partially complete CSV import can be resumed and a failed one retried, at most three times, after which the file must be imported again. [zwa.settings.user-attributes:import-restart] The attribute list, template versions and file-size limit are not in the captured page [gap:zwa.settings.user-attributes:csv-import-limits].

What to check:
1. Which user data source is primary and whether the unique identifier is present in the CSV file before expecting an attribute.

Sources disagree (name both sides):
- The User Attributes page says SCIM is selected as the default primary data source unless CSV is selected, and Account Settings says you must select a primary user data source and offers SCIM only if SCIM provisioning is enabled. [divergence:zwa.settings.user-attributes:default-primary-source]
  - zscaler-help: SCIM is selected as the default primary data source.
  - zscaler-help: A primary user data source must be selected, and SCIM is available only if SCIM provisioning is enabled.
  Impact: The pages do not say what the primary data source is for a tenant with no SCIM provisioning that has not selected CSV.

Not known (open gaps):
- What the full CSV attribute list, template versions and file-size limit are [gap:zwa.settings.user-attributes:csv-import-limits]: settled by source-read

Area: zwa.settings, its subjects in references/_meta/spine/zwa/zwa.settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.settings.md (Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release)
