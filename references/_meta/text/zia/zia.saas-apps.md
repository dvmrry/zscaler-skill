# SaaS apps that break or misbehave behind ZIA (zia.saas-apps)
Also called: saas app quirks; app breaks with ssl inspection; browser quirks zscaler; app works without zscaler; saas root cause catalog; certificate pinning duo webex dropbox; why is this app failing through zscaler

"Why does this SaaS app fail, or ignore a control, behind ZIA?" reduces to one of six causes. Name the cause first; the app is the example, not the answer (the SSL side of each is in [ZIA SSL/TLS inspection](kb:zia.ssl-inspection)).

1. **The app refuses Zscaler's certificate.** It cannot be inspected whatever the rule says; the options are replace, narrowly bypass, or deny: [What SSL/TLS inspection cannot inspect: pinned apps, client certs, QUIC, BYOD, IoT](kb:zia.ssl-inspection.uninspectable), with the exemption hygiene in [Writing SSL/TLS inspection exemptions without exempting too much](kb:zia.ssl-inspection.exemptions). Developer tools and Firefox with their own trust stores are in [SSL/TLS inspection certificates: who signs, and where the root must be trusted](kb:zia.ssl-inspection.certificates).
2. **A login or MFA endpoint is being inspected when it should not be, or bypassed when it must not be:** [Login and MFA endpoints: inspect, bypass or exempt from authentication](kb:zia.saas-apps.idp-bypass).
3. **A bypass rule sits ahead of the inspection rule a control depends on.** The classic case is a personal Microsoft account still working after tenant restriction was configured: [Tenant restriction does nothing: bypass rule ahead of the login inspection rule](kb:zia.saas-apps.tenant-restriction-order), with the profile mechanics in [Tenant Profiles: SaaS tenant restriction](kb:zia.tenant-profiles).
4. **The identity provider checks the source IP** (Conditional Access named locations): [Conditional Access blocks users behind ZIA: Source IP Anchoring](kb:zia.saas-apps.conditional-access).
5. **The traffic is QUIC (UDP) and skips the proxy path:** [QUIC and HTTP/3 behind ZIA: where it escapes and how to block it](kb:zia.saas-apps.quic-conferencing).
6. **Someone wildcarded a shared storage domain to make an app work:** [Bypassing a SaaS that lives on a shared cloud storage or CDN domain](kb:zia.saas-apps.shared-cdn-bypass).

Per-app hostname lists drift quickly and are not authored here; classify the app into one of these causes and apply that cause's remedy to the narrowest hostname or Cloud Application that fits ([Writing SSL/TLS inspection exemptions without exempting too much](kb:zia.ssl-inspection.exemptions)).

Area: zia.saas-apps, its subjects in references/_meta/spine/zia/zia.saas-apps.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.ssl-inspection.exemptions.md (Writing SSL/TLS inspection exemptions without exempting too much): In general, bypasses are applicable only for specific functions, such as banking and finance destinations, healthcare destinations, business functions that need undecryptable traffic, business functions that need certificate-pinned sites or applications, and applications such as parts of Microsoft 365 that break when inspected. [zia.ssl-inspection.exemptions:bypass-purposes]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.uninspectable.md (What SSL/TLS inspection cannot inspect: pinned apps, client certs, QUIC, BYOD, IoT): Applications that pin a certificate reject any other certificate, so Zscaler cannot inspect them; the guide names Apple, many Microsoft 365 apps, Adobe, Cisco WebEx and the Dropbox app, and says pinning is common in iOS and Android apps. The remedies are to replace the application, bypass it only if it is valuable enough to justify the risk, or deny it. [zia.ssl-inspection.uninspectable:cert-pinning]
- interacts-with references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction): Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- links-to references/_meta/text/zia/zia.saas-apps.conditional-access.md (Conditional Access blocks users behind ZIA: Source IP Anchoring)
- links-to references/_meta/text/zia/zia.saas-apps.idp-bypass.md (Login and MFA endpoints: inspect, bypass or exempt from authentication)
- links-to references/_meta/text/zia/zia.saas-apps.quic-conferencing.md (QUIC and HTTP/3 behind ZIA: where it escapes and how to block it)
- links-to references/_meta/text/zia/zia.saas-apps.shared-cdn-bypass.md (Bypassing a SaaS that lives on a shared cloud storage or CDN domain)
- links-to references/_meta/text/zia/zia.saas-apps.tenant-restriction-order.md (Tenant restriction does nothing: bypass rule ahead of the login inspection rule)
- links-to references/_meta/text/zia/zia.ssl-inspection.md (ZIA SSL/TLS inspection)
- links-to references/_meta/text/zia/zia.ssl-inspection.certificates.md (SSL/TLS inspection certificates: who signs, and where the root must be trusted)
