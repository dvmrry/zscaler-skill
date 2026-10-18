IPSec identity is a credential object with its own /vpnCredentials endpoint ([[zia.locations.model]] lists it among the things a location holds). Tunnel behavior is in [[zia.traffic-forwarding.ipsec]].

**Types.** {{types}} {{xauth-legacy}} {{create-types}}

The old reference called `IP` and `UFQDN` the standard types and `CN` and `XAUTH` legacy. The API description says UFQDN is the most common and CN is created by Zscaler, and the help says XAUTH cannot be added; what CN authentication involves is not stated (gap `cn-certificate-specifics`).

**Addresses and keys.** {{ip-from-static-ip}} {{immutable}} {{psk-required}} Whether the key can be read back from a live tenant is open (gap `psk-live-read`).

**Scale.** {{bulk-delete-100}} {{tenant-limit}}

What to check: that an IP credential's address is a provisioned static IP, that type and address were right at creation (they cannot be edited), and which tunnels still use a credential before deleting it.
