A restore is destructive, and its reach is smaller than "everything".

What it does: {{overwrites-all}} {{absent-removed}} Rule components that belong to other areas move with it; URL categories used by rules are part of the replacement, see [[zia.url-filtering]]. Time interval components are named by the vendor but have no subject yet.

What it covers: {{included-policies}} The list is of policy families only (gap `configuration-settings`), and the feature is documented only as a console function (gap `api-surface`).

What it does not restore: {{dlp-edm-idm}} DLP behavior is in [[zia.dlp]].

Check before restoring: list what was created after the chosen point (it will be removed), and for a tenant with EDM or IDM do not rely on the restore to put DLP back.
