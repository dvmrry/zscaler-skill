These are claims about what the Go SDK and the Terraform providers send, the client, not about how ZPA, Cloud and Branch Connector, or Client Connector react. The client side can be proven from code.

**Write path.** {{zpa-writes-marshal-caller-struct}} {{ztw-writes-marshal-caller-struct}} {{zcc-writes-marshal-caller-struct}} ZIA does the same; see [[zia.sdk-go.write-encoding]], which this subject extends to the other products rather than restating.

**Field tags.** {{omitempty-drops-zero-values}}

**Setting a field to false.** {{zpa-policy-rule-extranet-enabled-false}} Whether the stored value then stays, resets or clears is open {{gap:omission-semantics}}.

## Instances, by product

**ZPA enabled flags.** {{zpa-provisioning-key-enabled-false}}

**ZPA text fields.** {{zpa-tag-descriptions-cannot-clear}}

**Same pattern in other ZPA structs.** {{zpa-same-pattern-elsewhere}}

**Exceptions.** {{zpa-some-structs-send-false}}

**Cloud and Branch Connector.** {{ztc-gateway-fail-closed-false}}

**Client Connector.** {{zcc-trusted-network-active-and-lists}} {{zcc-notification-template-int-zeros}} {{zcc-forwarding-profile-zero-ints}}

## The empty-object variant

**Value structs.** {{value-struct-omitempty-emits-empty-object}}

**Empty objects in practice.** {{zpa-extranet-dto-empty-object}} {{zia-cloud-app-control-cbi-profile-empty-object}} {{zcc-zia-posture-criteria-empty-object}} Whether the server reads an empty object as no value, a validation error or a reset is open {{gap:empty-object-semantics}}.

**More ZIA fields.** {{zia-value-struct-same-pattern}} The endpoint DLP resource effects are traced in [[zia.terraform.field-fidelity]].

See also [[zpa.terraform.delete-paths]] for the delete-side behavior of the same ZPA provider.
