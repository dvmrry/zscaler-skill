Several ZIA Terraform resources change one logical thing with more than one API request. Neither the provider nor the SDK has a transaction, a compensating write, or a re-read to confirm the result. For which fields a write drops, see [[zia.sdk-go.write-encoding]]; for swallowed read errors, see [[zia.terraform.error-handling]].

**Lists updated by delta.** {{delta-helpers-read-then-add-then-remove}} {{provider-calls-delta-helpers}} {{delta-partial-apply}} {{delta-stale-snapshot}} {{partial-apply-leaves-neither-old-nor-new}}

**Two endpoints, written one after the other.** {{security-policy-urls-two-writes}} {{browser-control-two-endpoint-write}}

**Virtual Service Edge cluster deletion.** {{vzen-delete-is-detach-update-delete}} {{vzen-delete-comments-state-detach-intent}} {{vzen-detach-list-omitted-on-wire}} {{vzen-delete-effect}}

**Node update.** {{vzen-node-update-calls-cluster-read}}

**Static IP coordinate discovery.** {{static-ip-any-lookup-error-is-not-found}} {{static-ip-temp-object-sequence}} {{static-ip-orphan-on-failure}} {{static-ip-transient-lookup-duplicates}}

URL category updates matter beyond Terraform state, because entries decide which category a URL belongs to ([[zia.url-categories.membership]]). {{custom-category-remove-then-add}} {{custom-category-partial-state}} {{predefined-category-three-mutations}}

**User authentication enrollment.** {{user-auth-enrollment-error-logged}} {{user-auth-empty-set-sends-nothing}} {{user-auth-validator-basic-only}} {{user-auth-methods-not-in-request-or-state}}

**Custom category deletion.** {{detach-writes-list-snapshot}} {{detach-stale-snapshot-overwrites}} The group-style detach helper is in [[zia.terraform.delete-detach]].

Coverage of the sequences, and the limits of the search: {{multi-write-places}} {{delta-lists-are-commonest-sequence}}

Zscaler activation, if enabled, publishes whatever state the failed apply left ([[zia.terraform.activation]]).
