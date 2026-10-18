The provider models one hosted PAC file as a parent with one tracked version at a time. Content is immutable per version, so most edits save a new version, and `pac_version` turns the resource from creating versions into selecting them.

**Create.** {{create-always-deployed}} {{content-validated-first}}

**Update.** {{update-clones-version}} {{declared-version-pins}} {{delete-version-for-capacity}}

**Status transitions.** {{status-transition-rules}} {{action-body-is-commit-message}}

**Import and read.** {{import-adopts-deployed}} {{read-tracks-version}}

**Data source.** {{data-source-deployed-list}} The PAC file as a forwarding method is in [[zia.traffic-forwarding.pac]].

Whether a created file is live is disputed [[zia.traffic-forwarding.pac:create-vs-deploy]].
