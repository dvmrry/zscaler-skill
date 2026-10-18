This is about when the Python SDK ends a ZIA session and what the platform then does with staged changes. The platform behavior is documented by the provider guide, and the SDK only decides when the session ends.

**Leaving a with block.** {{oneapi-exit-deauthenticates}} {{deauth-only-after-mutation}} {{legacy-exit-always-logs-out}}

**What the platform does.** {{exit-can-activate}} The platform behavior it rests on is [[zia.terraform.activation-methods:session-end-autoactivation]]. The same behavior seen from a time-interval write is in [[zia.time-intervals.api-surface]].

**Zidentity tenants.** {{password-expiry-zidentity}} {{password-expiry-endpoint}}
