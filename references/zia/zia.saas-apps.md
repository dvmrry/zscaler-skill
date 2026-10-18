"Why does this SaaS app fail, or ignore a control, behind ZIA?" usually reduces to one of six causes. Name the cause first; the app is the example, not the answer (the SSL side of each is in [[zia.ssl-inspection]]).

1. **The app refuses Zscaler's certificate** (leaf pinning, or its own CA bundle, as with Duo). It cannot be inspected whatever the rule says; the options are replace, narrowly bypass, or deny: [[zia.ssl-inspection.uninspectable]], with the exemption hygiene in [[zia.ssl-inspection.exemptions]]. Developer tools and Firefox with their own trust stores are in [[zia.ssl-inspection.certificates]].
2. **A login or MFA endpoint is being inspected when it should not be, or bypassed when it must not be:** [[zia.saas-apps.idp-bypass]].
3. **A bypass rule sits ahead of the inspection rule a control depends on.** The classic case is a personal Microsoft account still working after tenant restriction was configured: [[zia.saas-apps.tenant-restriction-order]], with the profile mechanics in [[zia.tenant-profiles]].
4. **The identity provider checks the source IP** (Conditional Access named locations): [[zia.saas-apps.conditional-access]].
5. **The traffic is QUIC (UDP) and skips the proxy path:** [[zia.saas-apps.quic-conferencing]].
6. **Someone wildcarded a shared storage domain to make an app work:** [[zia.saas-apps.shared-cdn-bypass]].

Per-app hostname lists drift quickly and are not authored here; classify the app into one of these causes and apply that cause's remedy to the narrowest hostname or Cloud Application that fits ([[zia.ssl-inspection.exemptions]]).
