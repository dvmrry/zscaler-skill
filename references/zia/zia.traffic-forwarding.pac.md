A PAC file points browsers at the service; how that traffic is treated once it arrives is in [[zia.proxy-mode.explicit]]. {{what-it-is}} {{benefits}}

**What it cannot do.** {{limitations}} {{unknown-location-limits}} {{over-tunnel}} What PAC forwarding carries beyond HTTP and HTTPS is open {{gap:non-web-traffic}}, and client behavior under enforced authentication is open {{gap:auth-challenge-behavior}}. Authentication behavior is in [[zia.authentication.methods]] and [[zia.authentication.location-enforcement]].

**Hosting and changes.** {{default-files}} {{limits}} {{version-states}} {{validation}} {{changes-immediate}} When clients pick up a changed file is open {{gap:client-cache}}, the default hosted URL is open {{gap:default-pac-url}}, and WPAD or MDM delivery is open {{gap:delivery-methods}}.

**Dedicated proxy ports.** {{dedicated-port-variables}} The port service itself is in [[zia.forwarding-control.proxy-ports]].

**Automation.** {{terraform-resource}} The PAC file source is in [pac-files](../shared/pac-files.md).

Whether a location is required for PAC traffic is not stated (gap `location-not-required`); what the sources say about unknown sources is in [[zia.locations.model]].
