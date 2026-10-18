When a SaaS identity provider only accepts sign-ins from named IP ranges, users behind ZIA fail the check even though they authenticate correctly. For Microsoft 365 the supported answer is Source IP Anchoring. {{ca-use-case}}

**Why it fails.** {{shared-edge-ips-fail-named-location}}

**What to anchor.** {{anchor-login-only}} {{login-hosts}} {{dns-resolver-rules}} The rest of the setup (the application segment with the Source IP Anchor option, the client forwarding and access policies, the gateway and the forwarding rule) is in [[zia.forwarding-control.sipa]]; the direct variant is [[zia.forwarding-control.sipa-direct]].

Trusting the Zscaler edge IPs in Entra instead of anchoring is open {{gap:trusted-list-alternative}}. Whether the same pattern applies to other IP-trusting SaaS is open {{gap:other-saas-ip-trust}}. The layer at which Conditional Access SAML POST failures occur is open {{gap:ca-saml-post-inspection}}. If the symptom is a personal account working rather than a corporate one being blocked, this is the wrong subject: see [[zia.saas-apps.tenant-restriction-order]].
