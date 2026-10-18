Before deleting a group-like object, the ZTC provider edits the forwarding rules that reference it to drop the object. The helper matches the ZIA one in structure, and so do most of its faults. {{ztc-helper-matches-zia-except-rule-type}} The ZIA version is covered in [[zia.terraform.delete-detach]]; the claims here are quoted from the ZTC code, not inherited. {{helper-callers}} {{helper-label-selects-nothing}}

**Which rules are swept.** {{helper-sweeps-forwarding-rules-only}} {{rule-types-are-separate-endpoints}} {{dns-rules-reference-ip-groups}} {{ip-group-delete-follows-detach}} {{ip-group-references-in-dns-rules-not-detached}}

**Network service groups.** {{service-group-delete-sweeps-nw-application-groups}} {{forwarding-rule-separates-service-groups}} {{service-group-delete-follows-detach}} {{service-group-references-not-detached}} {{service-group-delete-can-strip-unrelated-application-groups}}

**The detach loop.** {{get-failure-skips-update-silently}} {{reread-result-discarded}} {{five-second-sleep-per-rule}} {{update-is-put-of-snapshot}} {{stale-snapshot-put}} {{masked-read-failure-reaches-delete}}

**IP pool groups.** {{ip-pool-delete-calls-no-detach}} Whether that matters, and whether DNS forwarding objects ever hold a pool reference, is not shown by the code {{gap:ip-pool-references}}.

Protection of predefined rules against deletion is in [[cloud-connector.terraform.rule-protection]]; rule ordering is in [[cloud-connector.terraform.rule-order]].
