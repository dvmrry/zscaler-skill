Before deleting a PRA portal, PRA console, segment group or server group, it walks the objects that reference it and rewrites them. The outcome depends on how each of those cleanups handles failure, and they differ.

PRA portals. {{portal-delete-detaches-first}} {{portal-cleanup-deletes-emptied-console}} {{console-is-its-own-resource}} {{portal-delete-can-delete-console}} {{portal-cleanup-partial-on-failure}} {{portal-deleted-console-skips-policy-detach}} Before destroying a portal, check which consoles list it as their only portal; those consoles go with it.

PRA consoles. {{console-delete-cleans-credential-policy-only}} {{console-policy-cleanup-partial-on-failure}}

Segment groups. {{segment-group-delete-two-loops}} {{segment-group-list-failures-skipped}}

None of the cleanups that stop on error roll back what they already changed. {{cleanups-can-leave-partial-detach}}

Server groups are the opposite of the update failures above, which stop on error. {{server-group-delete-ignores-cleanup}} {{server-group-cleanup-failures-only-logged}} {{server-group-delete-can-succeed-with-references}} After a server-group destroy, re-read the rules, application segments and connector groups that used it rather than trusting the apply result.

For the same pattern in another product, where a background step cannot report failure, see [[zia.terraform.rule-order]].
