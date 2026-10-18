These are claims about what the Go SDK and the Terraform providers send, the client, not about how ZPA, Cloud and Branch Connector or Client Connector react. The client side can be proven from code. What the server does with a missing or empty member cannot, and it is left as a gap.

The mechanism has two parts. First, every product's write path marshals the caller's struct as is. {{zpa-writes-marshal-caller-struct}} {{ztw-writes-marshal-caller-struct}} {{zcc-writes-marshal-caller-struct}} ZIA does the same; see [[zia.sdk-go.write-encoding]], which this subject extends to the other products rather than restating. Second, the field tags decide what is sent. {{omitempty-drops-zero-values}}

That is the answer to "why will Terraform not turn this setting off": the provider builds the struct from state, the SDK drops the false, and the PUT has no member for the field. Whether the stored value then stays, resets or clears is the open question. {{zpa-policy-rule-extranet-enabled-false}} is the cleanest ZPA instance.

## Instances, by product

ZPA. A disabled key or group is the case to check first, because the user believes a thing is off. {{zpa-provisioning-key-enabled-false}} Text fields behave the same way. {{zpa-tag-descriptions-cannot-clear}} More places share the form. {{zpa-same-pattern-elsewhere}}

Do not assume every field is affected. Tags differ field by field inside a single struct, and the SDK sometimes handles it on purpose. {{zpa-some-structs-send-false}} Read the tag for the exact field before saying it cannot be cleared.

Cloud and Branch Connector. {{ztc-gateway-fail-closed-false}}

Client Connector. {{zcc-trusted-network-active-and-lists}} {{zcc-notification-template-int-zeros}} {{zcc-forwarding-profile-zero-ints}}

## The empty-object variant

A nested struct held by value is never "empty" to the encoder, so `omitempty` does not remove it. {{value-struct-omitempty-emits-empty-object}} The effect is the opposite of the first part: instead of a missing member, the request carries an empty one.

{{zpa-extranet-dto-empty-object}} {{zia-cloud-app-control-cbi-profile-empty-object}} {{zcc-zia-posture-criteria-empty-object}}

For ZIA the SDK holds more fields in this form. {{zia-value-struct-same-pattern}} That list is places to check, not confirmed output; the endpoint DLP resource effects are traced in [[zia.terraform.field-fidelity]].

## What to check

- Which struct and which field. Read its tag; a pointer or a tag without `omitempty` can carry a false.
- Whether the provider assigns the value unconditionally. A guard such as "only if the user set it" means the zero value is not meant to be sent.
- Whether the endpoint is a full PUT of a rebuilt struct, which is where a dropped member matters most.
- Whether the symptom is persistent drift after apply: a plan that keeps showing the same change is what an unsent false looks like when the server keeps the old value.

## What is not established

Two gaps are open (`omission-semantics` and `empty-object-semantics`). Until a scratch-tenant test settles them, say "the SDK does not send it", not "ZPA ignores it" or "ZPA resets it".

See also [[zpa.terraform.delete-paths]] for the delete-side behavior of the same ZPA provider.
