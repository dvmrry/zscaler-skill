The ZTC provider has validators that reject deleting a few named traffic rules, but they match by name and are not on the delete path. {{guards-match-fixed-names}} {{log-guard-uses-dns-names}}

The delete functions do not use it. {{forwarding-delete-skips-guard}} {{dns-delete-guard-commented-out}} {{log-delete-guard-commented-out}} Nothing in the three resources' provider code looks at the rule's own default or predefined flag either. {{resources-ignore-default-flag}}

What this means for a destroy: {{destroy-sends-delete-for-protected-rules}} Whether the API itself refuses is not shown by the provider code and has to be tested in a scratch tenant.

What to check: before any destroy or resource-block removal in a configuration that manages Cloud Connector traffic rules, list the rule IDs in the plan and confirm none is a predefined or default rule (names such as the ones the validators list; the resources do not expose a default flag, so check `defaultRule` or `predefined` on each rule through the console or API). Do not rely on the provider to refuse. Rule position and reordering behavior is a separate matter, covered for the ZIA provider in [[zia.terraform.rule-order]].
