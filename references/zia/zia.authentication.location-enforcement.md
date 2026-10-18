Authentication is demanded where the traffic enters, not tenant-wide. {{enforce-authentication}}

**Sublocations.** {{sublocation-split}} This is how a guest network gets internet access with no login while the corporate network is identified. Whether an unset sublocation inherits the parent's value is open (the gap below); one setting that is explicitly not inherited is IP Surrogate, in [[zia.authentication.surrogate-ip]].

**Extra methods at the location.** {{method-switches}} {{basic-auth-caveats}} Enrolling users for Basic has its own provider defects, covered in [[zia.terraform.multi-step-writes]] rather than here.

**Without enforcement.** {{unauth-options}} What such traffic is judged as is in [[zia.authentication.unauthenticated-traffic]].

What to check: the effective Enforce Authentication value on the sublocation the traffic actually maps to (not just the parent), and whether the traffic is explicitly forwarded, since the per-method switches apply to explicitly forwarded traffic. Location definitions are in [[zia.locations]] and [[zia.locations.sublocations]].
