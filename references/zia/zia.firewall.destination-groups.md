Firewall Filtering rules point at destination groups for their destination criterion. A group is one of four types. {{type-values}} {{addresses-forms}}

**Which fields go with which type.** {{field-pairing}} The pairing is documented, not enforced client-side. {{pairing-not-enforced}} DSTN_DOMAIN has no example and no per-type field rule in any source (see the gap). {{ip-categories-custom-only}} {{non-editable-predefined}}

**Two traps in the API.** The list filter is easy to read backwards: {{exclude-type-excludes}} The API capture words the same parameter as "filter based on" the type, which is ambiguous; trust the SDK wording and test with one group (see the divergence). The update call can append or replace: {{override-appends}} Anything that edits a group's addresses should set `override` deliberately, because the default replaces.

**Size.** {{fqdn-per-group-caps}} An FQDN-heavy group is capped at 100 FQDNs on a tenant without Advanced Firewall, and what happens past the cap is not stated; where the other caps sit is in [[zia.firewall.limits]]. {{endpoint}}

What to check: the group's type matches the fields set, whether a rule references the group before deleting it ([[zia.terraform.delete-detach]]), and the `override` flag on updates.
