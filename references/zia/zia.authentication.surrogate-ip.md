Surrogate IP is the answer to "this user is logged in, so why was this request treated as the location?" It is a per-location opt-in. {{definition}} {{browser-benefit}}

**How the mapping behaves.** {{one-user-at-a-time}} {{churn-disables}} That corrects an easy misreading: the IP is remapped when a second user authenticates from it, and if that happens repeatedly the mapping stops and the location policy applies instead. Traffic from that IP that carries no authentication is not addressed by the help article.

**What it cannot work with.** {{no-nat}} {{dedicated-port}} {{no-vdi}} The usual failure is a shared egress address: put the devices that cannot authenticate (printers, servers) in their own sublocation without Enforce Authentication, see [[zia.authentication.location-enforcement]]. {{not-inherited}}

**Configuring it.** {{location-fields}} {{known-browsers}} {{refresh-vs-lease}}

**What Terraform rejects.** {{provider-checks}} These are apply-time checks inside create and update, not plan-time validation, so a bad combination fails at apply. Other provider behavior for locations is in [[zia.terraform.field-fidelity]].

**Client Connector.** {{windows-app-flag}}

What to check: the forwarding method (NAT in the path), whether Enforce Authentication is on for the sublocation the traffic maps to, whether the source is a shared or VDI address, and the idle and refresh times against the DHCP lease.
