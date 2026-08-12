# Understanding Zscaler Cloud Names

**Source:** https://help.zscaler.com/unified/understanding-zscaler-cloud-names
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

An organization is provisioned on one Zscaler cloud and its traffic is
processed by that cloud only. Administrators may need the cloud name for SAML
admin SSO, `config.zscaler.com`, Trust Portal notices, and Support or Account
team work. The ZIA and ZPA cloud names are visible in Zscaler Admin Console
Account Settings.

## Production cloud names

| Service | Documented cloud name(s) |
|---|---|
| Internet & SaaS (ZIA) | `zscaler.net`, `zscalerone.net`, `zscalertwo.net`, `zscalerthree.net`, `zscloud.net` |
| Private Access (ZPA) | `private.zscaler.com`, `zpatwo.net` |
| Digital Experience (ZDX) | `zdxcloud.net` |
| Client Connector | `mobile.zscaler.net`, `mobile.zscalerone.net`, `mobile.zscalertwo.net`, `mobile.zscalerthree.net`, `mobile.zscloud.net` |
| Cloud & Branch Connector | `connector.zscaler.net`, `connector.zscalerone.net`, `connector.zscalertwo.net`, `connector.zscalerthree.net`, `connector.zscloud.net` |
| Zero Trust Branch | `goairgap.com` |
| Zscaler Cellular | `ztsim.com` |
| Risk360 | `zscalerrisk.net` |
| Authentication Service | `zslogin.net` |

Client Connector and Cloud & Branch Connector names are derived from the
organization's ZIA cloud. For example, a tenant on `zscaler.net` uses
`mobile.zscaler.net` and `connector.zscaler.net` for those services.

This table is the public production list in the captured article. It is not a
government-cloud matrix and does not supersede SDK/provider-specific government
host routing.
