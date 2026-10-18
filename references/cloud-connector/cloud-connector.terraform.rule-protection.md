The ZTC provider has validators that reject deleting a few named traffic rules, but they match by name and are not on the delete path. {{guards-match-fixed-names}} {{log-guard-uses-dns-names}}

**Delete paths.** {{forwarding-delete-skips-guard}} {{dns-delete-guard-commented-out}} {{log-delete-guard-commented-out}} {{resources-ignore-default-flag}}

**Destroying a managed predefined rule.** {{destroy-sends-delete-for-protected-rules}} Whether the API itself refuses is open {{gap:api-predefined-delete}}.

Rule position and reordering behavior is a separate matter, covered for the ZIA provider in [[zia.terraform.rule-order]].
