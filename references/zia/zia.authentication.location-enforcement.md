Authentication is demanded where the traffic enters, not tenant-wide. {{enforce-authentication}}

**Sublocations.** {{sublocation-split}} Whether an unset sublocation inherits the parent's value is open {{gap:sublocation-inheritance}}; one setting that is explicitly not inherited is IP Surrogate, in [[zia.authentication.surrogate-ip]].

**Extra methods at the location.** {{method-switches}} {{basic-auth-caveats}} Enrolling users for Basic has its own provider defects, covered in [[zia.terraform.multi-step-writes]] rather than here.

**Without enforcement.** {{unauth-options}} What such traffic is judged as is in [[zia.authentication.unauthenticated-traffic]].

Location definitions are in [[zia.locations]] and [[zia.locations.sublocations]].
