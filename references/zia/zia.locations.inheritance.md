"Does this sublocation have its own firewall, authentication or XFF setting?" has a different answer for each setting. Start from what the API marks as parent-only, then check what the console shows.
**Parent-only in the API.** {{parent-only-fields}}

**Set on the sublocation.** {{shared-fields}} {{sublocation-auth-per-sublocation}} {{surrogate-not-inherited}}

**Firewall is where the sources disagree.** {{console-sublocation-firewall-toggles}} The API schema says `ofwEnabled` is top-level only, so the console and the API describe different things; do not assume a location-scoped firewall rule sees a sublocation's own flag. Firewall enablement and rule behavior per location are in [[zia.firewall]].

A new sublocation does not necessarily start from its parent's settings, and only IP Surrogate is documented as not inherited ({{surrogate-not-inherited|ref}}); compare against the parent after creating one. See [[zia.locations.sublocations]]. Surrogate IP and per-location authentication are covered in [[zia.authentication.surrogate-ip]] and [[zia.authentication.location-enforcement]].
