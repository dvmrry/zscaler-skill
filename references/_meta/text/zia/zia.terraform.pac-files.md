# The zia_pac_files resource: versions, pinning and status transitions (zia.terraform.pac-files)
Also called: zia_pac_files; hosted PAC file terraform; pac_version_status; pac_version pin; PAC file new version terraform; delete_version PAC; pac_content must match

The provider models one hosted PAC file as a parent with one tracked version at a time. Content is immutable per version, so most edits save a new version, and `pac_version` turns the resource from creating versions into selecting them.

**Create.** On create the provider rejects any `pac_version_status` other than DEPLOYED, rejects a declared `pac_version`, and sends the create request with the status set to DEPLOYED; STAGE, LKG and UNSTAGED can only be applied to later versions. [zia.terraform.pac-files:create-always-deployed] The PAC content is sent to the service's validation endpoint before create and before a new version is saved; any validation error aborts the apply with the line and column messages, while warnings are only logged. [zia.terraform.pac-files:content-validated-first]

**Update.** When `pac_version` is not declared, changing `pac_content`, `name`, `description`, `domain` or `pac_url_obfuscated` saves a new version cloned from the currently tracked version and then applies the declared status; changing only `pac_commit_message` does not clone a version. [zia.terraform.pac-files:update-clones-version] When `pac_version` is declared it selects an existing version: a change that includes `name`, `description`, `domain` or `pac_url_obfuscated` counts as a content change, skips the match check, leaves `pinnedMatches` false and so returns the does-not-match error, a `pac_content` change is accepted only when it exactly matches the selected version's content and is then not cloned, and a status-only change acts on the selected version without cloning. [zia.terraform.pac-files:declared-version-pins] `delete_version` names a version to remove when a content change would exceed the maximum number of PAC file versions, and is used only when a new version is saved; the save error suggests setting it when the maximum was reached. [zia.terraform.pac-files:delete-version-for-capacity]

**Status transitions.** Before a status transition the provider reads the version and makes no call when the status and commit message already match; it rejects moving the currently deployed version to STAGE or UNSTAGED, and maps UNSTAGED to the UNSTAGE action, or to REMOVE_LKG when the version is the last known good. [zia.terraform.pac-files:status-transition-rules] The provider's status action passes the commit message to the SDK version-action call, and its comment says the action endpoint stores the request body as the version's commit message. [zia.terraform.pac-files:action-body-is-commit-message]

**Import and read.** Import accepts a numeric PAC file ID or a name, resolves the file through the deployed-state list or a by-name lookup, and adopts the file's deployed version as the tracked version. [zia.terraform.pac-files:import-adopts-deployed] Read refreshes the tracked version, and falls back to the file's deployed version only when no version is tracked or the tracked version no longer exists, removing the resource from state only when the file itself is gone. [zia.terraform.pac-files:read-tracks-version]

**Data source.** The `zia_pac_files` data source lists PAC files in deployed state, including default and custom ones; `id` or `name` narrows it to one file, and `filter = "pac_content"` omits the content, including on a name lookup, which returns the full object and has it blanked. [zia.terraform.pac-files:data-source-deployed-list] The PAC file as a forwarding method is in [PAC file forwarding: limits, versions and what it cannot cover](kb:zia.traffic-forwarding.pac).

Whether a created file is live is disputed [zia.traffic-forwarding.pac:create-vs-deploy](kb:zia.traffic-forwarding.pac:create-vs-deploy).

What to check:
1. Whether `pac_version` is declared, since a declared version pins an existing version and rejects content that does not match it exactly.
2. Whether a failed change hit the maximum version count, which needs `delete_version` on the save.
3. Whether a requested STAGE or UNSTAGED targets the currently deployed version, which the provider refuses.
4. Whether the version status was read back after a create before treating the file as live.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.traffic-forwarding.pac.md (PAC file forwarding: limits, versions and what it cannot cover)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
