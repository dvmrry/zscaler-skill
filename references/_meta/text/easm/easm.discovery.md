# EASM organizations, seeds and discovery profiles: defaults, permissions, disable and delete, and scan cadence (easm.discovery)

The article's key steps in EASM's asset discovery and monitoring process are seed-based scanning, a discovery chain, risk evaluation and automated monitoring through periodic scans. [easm.discovery:discovery-steps]

## Organizations

EASM provides a default organization out of the box, and where the customer has a Risk360 tenant an organization is created in the EASM Admin Portal through the Risk360 and EASM integration. [easm.discovery:default-and-risk360-org] Custom organizations keep attack surface discovery and inventory management separate for distinct entities, subsidiaries or business verticals, each with its own discovery profiles of seeds. [easm.discovery:org-purpose] Only super admins can create and manage organization-specific configurations. [easm.discovery:org-super-admin] A new organization is enabled by default, and being enabled is required to initiate the asset discovery scan. [easm.discovery:org-enabled-default]

**Disabling.** Disabling an organization disables all its discovery profiles, discontinues periodic scans and stops updates to asset data and risk information, and suspends discovery from the seeds. [easm.discovery:org-disable] After an organization is disabled, assets and findings data reported henceforth can still be viewed, but no actions on the data (such as changing asset status) and no changes to organization details are possible. [easm.discovery:org-disabled-readonly] Whether an administrator keeps access to a disabled organization is in dispute [divergence:easm.discovery:org-disabled-access].

**Deleting.** Only disabled organizations can be deleted; deleting one permanently removes its associated components, including historical assets and findings, and cannot be reversed. [easm.discovery:org-delete]

## Seeds and recursive discovery

A seed is a known legitimate asset of the organization, and domains, IP addresses and IP blocks can be configured as seeds. [easm.discovery:seed-types] Discovery scans the seeds, then recursively scans each level of connected assets, evaluating whether each level's relationship with the previous seed is strong enough before scanning further. [easm.discovery:recursive-scan]

## Discovery profiles

The discovery profiles page says that currently only one discovery profile can be configured for an organization and that its Add New Discovery button disappears once a profile is added; the creation steps call the button Add Discovery Profile, and the organization page speaks of distinct discovery profiles for each custom organization. [easm.discovery:profile-one-per-org] Only admins with full access permissions can create and manage discovery profiles. [easm.discovery:profile-permission] When creating a discovery profile, the Scan Frequency is automatically set to Weekly and is not editable. [easm.discovery:profile-frequency] Seeds are added per asset type (domains, IP addresses, IP blocks), manually with Enter or Add, or imported from a CSV file with Upload File. [easm.discovery:profile-seed-entry] After a discovery profile is submitted, EASM starts scanning the internet for asset connections using the seeds; the process typically takes 24–48 hours, after which the asset inventory and associated risks can be viewed in the Admin Portal. [easm.discovery:profile-first-scan] The Discovery Profiles page lists, per profile, Name, Included Seeds, Last Scan, Duration, Frequency and Status. [easm.discovery:profile-page-columns] The Included Seeds tab lists the seeds configured for the whole organization with their name, domain type and the discovery profile they map to. [easm.discovery:included-seeds-tab] Editing a discovery profile allows changing the Name and Description fields and adding or removing seeds. [easm.discovery:profile-edit]

**Disabling and deleting.** Disabling a discovery profile disables all its scans and stops updates to asset and risk data; afterwards data can still be viewed but no actions on the data or changes to the profile (including seeds) are possible, and only an admin user can re-enable it. [easm.discovery:profile-disable] Only disabled discovery profiles can be deleted, and deleting one permanently removes its associated assets and findings data, which cannot be restored. [easm.discovery:profile-delete]

The unified portal's discovery settings are in [How EASM discovery profiles work: seeds and their formats, limits, scan cadence, permissions and reports](kb:uvm.easm-discovery); they differ from this page on first-scan time [divergence:easm.discovery:first-scan-time], seed types [divergence:easm.discovery:seed-types-unified] and permissions [divergence:easm.discovery:permissions-unified]. The scan cadence beyond the Weekly setting on the EASM pages and what a high-confidence connection means are open [gap:easm.discovery:scan-cadence-and-confidence].

What to check:
1. Whether the organization is enabled before asking why scans or updates have stopped, and whether its discovery profile is enabled.
2. How long ago the discovery profile was submitted before asking why the inventory is empty.

Sources disagree (name both sides):
- The EASM help says the first discovery scan typically takes 24–48 hours; the unified portal help says the scanning process typically takes a few hours. [divergence:easm.discovery:first-scan-time]
  - zscaler-help: After a discovery profile is submitted, the process typically takes 24–48 hours before the inventory can be viewed.
  - zscaler-help: In the unified portal the scanning process typically takes a few hours.
  Impact: Do not give one wait time for both portals; the pages do not say whether the figures measure the same thing.
- The EASM profile page lists domains, IP addresses and IP blocks as seed types; the unified portal page adds an organization name as a seed. [divergence:easm.discovery:seed-types-unified]
  - zscaler-help: Currently, you can configure domains, IP addresses and IP blocks as seed assets.
  - zscaler-help: In the unified portal an organization's name can also be used as a seed.
  Impact: Offer an organization-name seed only where the unified portal page applies.
- The EASM page requires admins with full access permissions to manage discovery profiles; the unified portal page requires Read, Create, Edit and Delete permissions for the EASM Configuration resource. [divergence:easm.discovery:permissions-unified]
  - zscaler-help: Only admins with full access permissions can create and manage discovery profiles.
  - zscaler-help: In the unified portal the assigned role must include Read, Create, Edit and Delete permissions for the EASM Configuration resource.
  Impact: Check the permission model of the portal the user is in; whether the two requirements are equivalent is not stated.
- One page says data of a disabled organization can still be viewed in the EASM Admin Portal, and also says the admins are locked out of the organization. [divergence:easm.discovery:org-disabled-access]
  - zscaler-help: After an organization is disabled, its assets and findings data reported henceforth can still be viewed in the EASM Admin Portal.
  - zscaler-help: Disabling an organization disables its discovery profile scans and locks the admins out of the organization.
  Impact: Whether an admin can open a disabled organization to read its data is not settled by the page; check the tenant before telling a user the data is or is not viewable.

Not known (open gaps):
- Whether the periodic-scan interval for approved assets is the profile's Weekly setting, and what high confidence means for the discovery chain [gap:easm.discovery:scan-cadence-and-confidence]: settled by source-read or support-ticket

Area: easm.discovery, its subjects in references/_meta/spine/easm/easm.discovery.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/uvm/uvm.easm-discovery.md (How EASM discovery profiles work: seeds and their formats, limits, scan cadence, permissions and reports)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/easm/easm.overview.md (Zscaler EASM: what it is, how it is set up, and where each part is documented)
- see-also references/_meta/text/easm/easm.assets.md (EASM asset inventory: types, risk levels, Approved, Candidate and Archived status, detail fields and the Assets page)
