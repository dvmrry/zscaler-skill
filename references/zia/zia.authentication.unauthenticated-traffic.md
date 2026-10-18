{{location-policy-fallback}}

**Why traffic ends up without an identity.** {{cookie-types}} {{no-cookie-traffic}} {{logged-in-user-misses-user-rule}} Surrogate IP exists to cover exactly these cases: [[zia.authentication.surrogate-ip]]. Destinations that never get a challenge are in [[zia.authentication.exemptions]].

**Whether user rules can apply anyway.** {{unauthenticated-policy-setting}}

**Early in an HTTPS connection.** {{connect-sni-skip}} How that interacts with decryption is in [[zia.ssl-inspection.pipeline]].
