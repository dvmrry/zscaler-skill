The tidy model, "no identity means anonymous, and user rules cannot match," is wrong in a way that matters. Traffic without an identity is judged as the location. {{location-policy-fallback}}

**Why traffic ends up without an identity.** {{cookie-types}} {{no-cookie-traffic}} Every item on that list is a reason a user rule can fail to match for a user who is logged in: the user is authenticated in the browser, but this particular transaction could not carry the cookie. Surrogate IP exists to cover exactly these cases: [[zia.authentication.surrogate-ip]]. Destinations that never get a challenge are in [[zia.authentication.exemptions]].

**Whether user rules can apply anyway.** {{unauthenticated-policy-setting}} Check the tenant's value before concluding either way.

**Early in an HTTPS connection.** {{connect-sni-skip}} How that interacts with decryption is in [[zia.ssl-inspection.pipeline]].

What to check: whether the transaction was CONNECT, an unknown user agent, an exempted destination, or undecrypted SSL (all attributed to the location), whether Surrogate IP is on for the source, and the unauthenticated-traffic setting.
