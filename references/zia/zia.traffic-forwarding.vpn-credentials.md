IPSec identity is a credential object with its own /vpnCredentials endpoint ([[zia.locations.model]] lists it among the things a location holds). Tunnel behavior is in [[zia.traffic-forwarding.ipsec]].

**Types.** {{types}} {{xauth-legacy}} {{create-types}}

What CN authentication involves is open {{gap:cn-certificate-specifics}}.

**Addresses and keys.** {{ip-from-static-ip}} {{immutable}} {{psk-required}} Whether the key can be read back from a live tenant is open {{gap:psk-live-read}}.

**Scale.** {{bulk-delete-100}} {{tenant-limit}}
