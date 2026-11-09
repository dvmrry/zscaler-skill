# Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC (shared.terminology.product-names)
Also called: internet & saas; internet and saas; private access; zscaler app; z-app; zscaler isolation; cloud browser isolation; zero trust browser; product rename; zguard; client.zbi; ecgroup; deeptrace; deep trace; ztc; zero trust cloud

Names that a captured source shows directly. Others are listed in [Zscaler terminology: where each term is defined](kb:shared.terminology) with their status.

**The two services.** Help pages name ZIA both Internet & SaaS and Internet Access, and ZPA Private Access: for example "Public Service Edges for Internet & SaaS (ZIA)", "Public Service Edges for Internet Access (ZIA)" and "Private Access (ZPA)". [shared.terminology.product-names:service-names]

**Client Connector.** The NSS web log lists the Client Connector forwarding method value as "Zscaler Client Connector (Zscaler App)", with Zscaler App in parentheses. [shared.terminology.product-names:zscaler-app] Zscaler App is therefore a name for Zscaler Client Connector in Zscaler's own log vocabulary. [shared.terminology.product-names:zscaler-app-alias]

**Browser isolation.** Zero Trust Browser was formerly Zscaler Isolation; the NSS web log's field descriptions call it "Zero Trust Browser (formerly Isolation)". [shared.terminology.product-names:zero-trust-browser] Its behavior is in [How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout](kb:zbi.cloud-browser).

**SDK and API names.** In the Python SDK, `client.zguard` is a deprecated alias for the `aiguard` property. [shared.terminology.product-names:zguard-alias] In the Python SDK, the `zbi` service client is Zscaler Business Insights, not browser isolation. [shared.terminology.product-names:zbi-is-business-insights] In the Cloud & Branch Connector API, /ecgroup lists Cloud & Branch Connector groups, under the tag Cloud & Branch Connector Groups. [shared.terminology.product-names:ecgroup] The ZDX API calls its on-demand per-device trace a deep trace: POST /v1/devices/{id}/deeptraces starts one on a device, limited to one active session per device and 15 active sessions across all devices, counting sessions started from the UI. [shared.terminology.product-names:zdx-deep-trace] The Terraform provider ZTC is the provider for Zscaler Zero Trust Cloud resources. [shared.terminology.product-names:ztc-expansion]

Inferred, not quoted (say so when an answer rests on one):
- [shared.terminology.product-names:zscaler-app-alias] Tier B: Reads the parenthetical as an alternate name; unlike the Zero Trust Browser rows, the log format does not say formerly.

Area: shared.terminology, its subjects in references/_meta/spine/shared/shared.terminology.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.terminology.md (Zscaler terminology: where each term is defined)
- links-to references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout)
