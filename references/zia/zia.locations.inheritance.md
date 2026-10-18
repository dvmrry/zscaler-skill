"Does this sublocation have its own firewall, authentication or XFF setting?" has a different answer for each setting.

**Parent-only in the API.** {{parent-only-fields}}

**Set on the sublocation.** {{shared-fields}} {{sublocation-auth-per-sublocation}} {{surrogate-not-inherited}}

**Firewall is where the sources disagree.** {{console-sublocation-firewall-toggles}} The console and the API disagree on whether a sublocation has its own firewall flag {{divergence:sublocation-firewall-and-ips}}, and whether that flag is stored, ignored or inherited is open {{gap:sublocation-firewall-source}}. Firewall enablement and rule behavior per location are in [[zia.firewall]].

Whether a new sublocation inherits the parent's auth, firewall or SSL settings is open {{gap:inherit-everything}}. See [[zia.locations.sublocations]]. Surrogate IP and per-location authentication are covered in [[zia.authentication.surrogate-ip]] and [[zia.authentication.location-enforcement]].
