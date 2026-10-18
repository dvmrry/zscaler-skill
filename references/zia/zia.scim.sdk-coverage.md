Use this when a script built on the SDK behaves differently from the REST behavior in [[zia.scim.operations]]. These claims are about the client, not the service.

**Coverage.** {{go-surface}} {{go-no-patch-bulk}} {{python-none}}

**What the user struct can carry.** {{user-struct}} {{cannot-send-active}}

**Defects and traps.** {{getall-users-type}} {{byname-display}}

**Paging.** {{go-paging}} {{go-paging-estimate}} The ZPA SCIM helper advances the same way, see [[shared.sdk-go.list-pagination]].

**Connection.** {{go-client-config}} {{no-limiter}} The SDK's URL shape differs from the help's base URL {{divergence:scim-base-url}}.

Other ZIA Go SDK defects are in [[zia.sdk-go.service-defects]].
