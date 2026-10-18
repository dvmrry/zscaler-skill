Several ZIA Terraform resources change one logical thing with more than one API request. Neither the provider nor the SDK has a transaction, a compensating write, or a re-read to confirm the result. When a later request fails, Terraform reports an error, but the earlier requests have already been sent. The next plan starts from a state that is neither the old configuration nor the new one. This page is the mechanism and where it recurs. For which fields a write drops, see [[zia.sdk-go.write-encoding]]; for swallowed read errors, see [[zia.terraform.error-handling]].

The commonest shape is a list updated by delta. {{delta-helpers-read-then-add-then-remove}} {{provider-calls-delta-helpers}} {{delta-partial-apply}} {{delta-stale-snapshot}}

The security policy lists are a second shape, two endpoints written one after the other. {{security-policy-urls-two-writes}} Browser control is the same with a conditional second endpoint. {{browser-control-two-endpoint-write}}

Cluster deletion is the case where the sequence is the safety mechanism. {{vzen-delete-is-detach-update-delete}} {{vzen-detach-list-omitted-on-wire}} {{vzen-delete-effect}} A node update has a separate flaw after its single write. {{vzen-node-update-calls-cluster-read}}

Static IP coordinate discovery creates an object as a side effect of creating one. {{static-ip-any-lookup-error-is-not-found}} {{static-ip-temp-object-sequence}} {{static-ip-orphan-on-failure}} {{static-ip-transient-lookup-duplicates}}

URL category updates matter beyond Terraform state, because entries decide which category a URL belongs to ([[zia.url-categories.membership]]). {{custom-category-remove-then-add}} {{custom-category-partial-state}} {{predefined-category-three-mutations}}

User authentication is split across the user write and a separate enrollment call. {{user-auth-enrollment-error-logged}} {{user-auth-empty-set-sends-nothing}} {{user-auth-validator-basic-only}} {{user-auth-methods-not-in-request-or-state}}

Deleting a custom category is also a multi-step write: it first rewrites every rule that uses it. {{detach-writes-list-snapshot}} {{detach-stale-snapshot-overwrites}} The group-style detach helper is in [[zia.terraform.delete-detach]].

Coverage of the sequences, and the limits of the search: {{multi-write-places}}

After an apply of any of these resources fails, do not assume either the old or the new configuration. Read the live object (the list, the cluster and its nodes, the category's entries, the user's enrollment) and compare it with the configuration before retrying. After a failed static IP create, list the static IPs for the address. After a failed cluster delete, check the cluster's node list. Zscaler activation, if enabled, publishes whatever state the failed apply left ([[zia.terraform.activation]]).
