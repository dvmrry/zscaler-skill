Before deleting a PRA portal, PRA console, segment group or server group, it walks the objects that reference it and rewrites them. The outcome depends on how each of those cleanups handles failure, and they differ.

**PRA portals.** {{portal-delete-detaches-first}} {{portal-cleanup-deletes-emptied-console}} {{console-is-its-own-resource}} {{portal-delete-can-delete-console}} {{portal-cleanup-partial-on-failure}} {{portal-deleted-console-skips-policy-detach}} Whether the API allows a console with no portals is open {{gap:api-console-without-portals}}.

**PRA consoles.** {{console-delete-cleans-credential-policy-only}} {{console-policy-cleanup-partial-on-failure}}

**Segment groups.** {{segment-group-delete-two-loops}} {{segment-group-list-failures-skipped}}

{{cleanups-can-leave-partial-detach}}

**Server groups.** {{server-group-delete-ignores-cleanup}} {{server-group-cleanup-failures-only-logged}} {{server-group-delete-can-succeed-with-references}} What the API does when a referenced server group is deleted is open {{gap:api-delete-referenced-object}}.

For the same pattern in another product, where a background step cannot report failure, see [[zia.terraform.rule-order]].
