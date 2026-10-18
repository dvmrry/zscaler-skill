A network service is the port criterion that Firewall Filtering and IPS rules reference. It is a set of source and destination TCP and UDP port ranges with a name, a type and a tag. {{type-values}} What STANDARD, PREDEFINED and CUSTOM mean is not documented; see the gap. Do not treat the value as an enum the SDKs validate. {{tag-values}}

**Looking one up.** {{name-lookup-case}} {{protocol-filter-values}} {{endpoint}}

**Writing one.** {{port-tuples}} {{wire-key-built-from-tuple}} {{single-port-encoding}} The two SDKs also model the object differently; see the divergence. On update, {{update-replaces-ports}} so an edit that adds one port must send the full list.

**Size.** {{service-count-cap}} The per-rule cap on services is in [[zia.firewall.limits]].

What to check: the service type and tag before assuming a service is custom, the uppercase name when searching, and the complete port list before an update.
