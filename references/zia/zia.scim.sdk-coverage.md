Use this when a script built on the SDK behaves differently from the REST behavior in [[zia.scim.operations]]. These claims are about the client, not the service.

**Coverage.** {{go-surface}} {{go-no-patch-bulk}} {{python-none}}

**What the user struct can carry.** {{user-struct}} {{cannot-send-active}}

**Defects and traps.** {{getall-users-type}} {{byname-display}}

**Paging.** {{go-paging}} {{go-paging-estimate}} The ZPA SCIM helper advances the same way, see [[shared.sdk-go.list-pagination]].

**Connection.** {{go-client-config}} The SCIM token and tenant ID are separate from OneAPI credentials. {{no-limiter}} The SDK's URL shape differs from the help's base URL, see the divergence record.

Other ZIA Go SDK defects are in [[zia.sdk-go.service-defects]].

What to check: whether the call goes through the .search path or raw REST, the page size in use, whether a list is complete against the tenant count, and that the SCIM token, not an OneAPI credential, is configured.
