# How AI Asset Management business units and custom roles control access (ai-security.asset-management.roles)
Also called: ai security business units; ai security custom roles; ai asset management rbac; business unit management

Business units are logical containers for cloud accounts that govern AI Security from an RBAC perspective; users or user groups must be assigned to them. [ai-security.asset-management.roles:business-unit-definition] Cloud accounts are onboarded and mapped to business units, and user access can be restricted to specific business units. [ai-security.asset-management.roles:business-unit-restriction] The hub is [AI Asset Management in the AI Security Admin Portal: what it inventories, signing in, first-time configuration order, table behavior](kb:ai-security.asset-management) and the accounts are in [How are onboarded AWS, Azure and GCP accounts managed in AI Security: the Cloud Accounts page, validation, status, issues, deletion, orchestrator changes and the orchestrator itself?](kb:ai-security.asset-management.cloud-accounts).

**Business Unit Management.** The Business Unit Management page lists each business unit's name, account count and created-on date; a unique name is entered to add one, and the default business unit cannot be edited or deleted. [ai-security.asset-management.roles:business-unit-page]

**Custom roles.** A custom role has a unique name of letters, numbers, hyphens or underscores, and each module or global module gets Access, View Only or None. [ai-security.asset-management.roles:custom-role-name-permissions] For the Scan Settings module, Access or View Only must be assigned for Cloud Accounts, together with permissions to start or stop the scan or edit the scan settings. [ai-security.asset-management.roles:scan-settings-permissions] Predefined roles cannot be edited or deleted; custom roles can be edited and deleted (a deleted role is removed from the Admin Portal) and assigned to users for specific or global modules. [ai-security.asset-management.roles:predefined-immutable] [gap:ai-security.asset-management.roles:predefined-roles-and-limits]

What to check:
1. Whether a role gives Access, View Only or None for the module; for the Scan Settings module, Cloud Accounts permissions and the permissions to start or stop the scan or edit the scan settings must be assigned.

Not known (open gaps):
- Which predefined roles exist, what do they permit, and are there limits on business unit names or counts? [gap:ai-security.asset-management.roles:predefined-roles-and-limits]: settled by source-read or tenant-data

Area: ai-security.asset-management, its subjects in references/_meta/spine/ai-security/ai-security.asset-management.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/ai-security/ai-security.asset-management.md (AI Asset Management in the AI Security Admin Portal: what it inventories, signing in, first-time configuration order, table behavior)
- links-to references/_meta/text/ai-security/ai-security.asset-management.cloud-accounts.md (How are onboarded AWS, Azure and GCP accounts managed in AI Security: the Cloud Accounts page, validation, status, issues, deletion, orchestrator changes and the orchestrator itself?)
