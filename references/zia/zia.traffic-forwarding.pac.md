A PAC file points browsers at the service; how that traffic is treated once it arrives is in [[zia.proxy-mode.explicit]]. {{what-it-is}} {{benefits}}

**What it cannot do.** {{limitations}} {{unknown-location-limits}} {{over-tunnel}} The old reference also described what is not forwarded (UDP, non-HTTP protocols) and how browsers behave under authentication; the captures do not state those (gaps `non-web-traffic`, `auth-challenge-behavior`). Authentication behavior is in [[zia.authentication.methods]] and [[zia.authentication.location-enforcement]].

**Hosting and changes.** {{default-files}} {{limits}} {{version-states}} {{validation}} {{changes-immediate}} Client-side caching and the default PAC URL are not stated (gaps `client-cache`, `default-pac-url`), nor are WPAD or MDM delivery (gap `delivery-methods`).

**Dedicated proxy ports.** {{dedicated-port-variables}} The port service itself is in [[zia.forwarding-control.proxy-ports]].

**Automation.** {{terraform-resource}} The old reference said no PAC resource exists in the provider; it does. The PAC file source is a shared reference at `references/shared/pac-files.md`, converted separately.

Whether a location is required for PAC traffic is not stated (gap `location-not-required`); what the sources say about unknown sources is in [[zia.locations.model]].

What to check: the deployed version and its hosted URL, whether sublocation-scoped rules are expected to match PAC traffic, and the device-side authentication behavior.
