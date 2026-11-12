# ZCC SDK calls in legacy-client mode routed to the ZIA client (zcc.sdk-go.legacy-routing)
Also called: zcc legacy client; zcc read fails legacy; errLegacyClientNotSet zcc; zcc sdk routes to zia

This is a defect in the Go SDK's legacy-client mode, which matters to code that calls the SDK directly with legacy ZCC credentials. In legacy-client mode, the SDK's generic `Read` and `Delete` hand the call to the ZIA legacy client, not the ZCC one. The ZCC-specific request path does use the ZCC legacy client. [zcc.sdk-go.legacy-routing:generic-legacy-path-targets-zia] Several ZCC services read or delete through the generic path: device details, trusted networks (v2), notification templates, ZIA posture, forwarding profiles, and web policies. [zcc.sdk-go.legacy-routing:zcc-services-use-generic-path] So for a direct SDK caller in legacy mode, these ZCC reads and deletes fail when only a ZCC legacy client is configured, and go to the ZIA legacy client when both are. [zcc.sdk-go.legacy-routing:legacy-zcc-reads-fail-or-misroute]

**Terraform provider.** The ZCC Terraform provider is built for the OneAPI flow only, so it does not normally inherit this defect. The SDK still reads `ZSCALER_USE_LEGACY_CLIENT` from the environment and the provider does not override it, so setting that variable would switch the provider into legacy mode. The provider never builds a legacy client and the SDK then skips OneAPI authentication, so every ZCC call, on the ZCC request path as well as the generic one, returns `errLegacyClientNotSet`. [zcc.sdk-go.legacy-routing:zcc-provider-oneapi-only]

What to check:
1. Whether a failing ZCC call comes from a direct SDK script in legacy mode rather than the provider, before blaming this defect.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.sdk-go.legacy-routing:legacy-zcc-reads-fail-or-misroute] Tier B: Only in the SDK's legacy-client mode.
- [zcc.sdk-go.legacy-routing:zcc-provider-oneapi-only] Tier B: The provider's intent is quoted; the environment override is in the SDK configuration. Widened from 'these calls fail': the provider passes no legacy client to `NewOneAPIClient`, which authenticates only when `UseLegacyClient` is false, so the ZCC request path fails too. Traced, not run.

Area: zcc.sdk-go, its subjects in references/_meta/spine/zcc/zcc.sdk-go.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.sdk-go.auth-lifecycle.md (How the Go SDK obtains and renews OneAPI tokens)
