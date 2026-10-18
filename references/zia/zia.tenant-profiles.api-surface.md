Use this when automating tenant profiles or reading them through a tool.

**API and clients.** {{endpoint}} {{python-method-names}} {{go-functions}}

**Fields.** The application list is in [[zia.tenant-profiles.applications]]. {{item-type-enum}} {{tf-tokens-unvalidated}} The provider does not validate the token.

**Capacity helper.** {{app-item-count}}

**Booleans.** {{go-omits-false-flags}} The general mechanism is in [[shared.sdk-go.zero-value-writes]]. The unknown is gap `omitted-false-server-reaction`.

**Read-only fields.** {{last-modified-fields}}

**Rule references.** {{tf-profile-ids-cap-8}} The rule field and its limits: [[zia.tenant-profiles]] and [[zia.tenant-profiles.limits]]. Other provider fidelity traps: [[zia.terraform.field-fidelity]].

What to check: the provider version before blaming policy for a plan that rejects more than eight profiles on one rule.
