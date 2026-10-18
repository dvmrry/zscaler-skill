The action decides whether a matching connection is decrypted and, if not, how much of ZIA still evaluates it. {{variants}} The sequencing consequences of Evaluate versus Bypass (which policies still fire, what a domain block does) are in [[zia.ssl-inspection.pipeline]]. The wire names of these actions, and the validator that rejects bad combinations, are in [[zia.ssl-inspection.api-shape]].

**Certificates and revocation.** {{untrusted-certs}} {{untrusted-certs-recommend-block}} {{ocsp}} {{ocsp-on-in-example-exemptions}}

**Handshake and protocol checks.** {{no-sni}} {{block-undecryptable}} {{min-tls}} {{tls-floor-recommendation}} {{tls-floor-blocks-legit-site}} {{http2}}

Per-rule scope matters when auditing: {{per-rule-settings}}

**Notifications.** {{eun-needs-root-ca}} {{eun-dependent-options}}

The intermediate CA a rule presents is covered in [[zia.ssl-inspection.certificates]]. Traffic that cannot be inspected at all, whatever the action, is in [[zia.ssl-inspection.uninspectable]].
