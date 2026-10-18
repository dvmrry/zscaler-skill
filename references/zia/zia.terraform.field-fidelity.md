A Terraform attribute can be accepted, shown in a plan, and even stored in state without ever reaching the ZIA API, or without ever being read back. Terraform cannot tell the difference, so the apply succeeds (the SDK side of this is in [[zia.sdk-go.write-encoding]]). Each case below is a gap between the schema, the expand function (config to request), the flatten code (response to state), and the SDK request model. When a setting "did not take", compare those four places before suspecting the API.

## Fields the request never carries

A forwarding control rule is one of the larger cases. {{fwd-control-ipv6-eczpa-never-expanded}} {{fwd-control-update-drops-selectors}}

A selector sent under the wrong key behaves the same way, and for CASB DLP it is a scope exclusion, so the rule applies more broadly than configured. {{casb-dlp-excluded-domains-wrong-key}}

Some attributes have nowhere to go at all. {{cloud-nss-exclusions-dead}}

## Fields forced to a fixed value

Where the SDK field has no `omitempty` and the provider never maps it, the request carries `false` on every write. The reverse trap (zero values dropped) is in [[zia.sdk-go.write-encoding]]. {{dns-capture-pcap-read-not-sent}} {{ips-capture-pcap-not-read-or-sent}} {{file-type-password-protected-never-mapped}} {{non-omitempty-bools-force-false}}

## Fields the state cannot show

Expanded but never flattened, so refresh and import are blind to the value. {{casb-labels-expanded-not-flattened}}

## Several blocks, one slot

{{admin-user-role-first-element-only}} {{first-block-truncation-elsewhere}}

## Empty objects on the wire

Value structs tagged `omitempty` are still serialized. {{endpoint-dlp-zero-struct-channels}} {{endpoint-dlp-custom-app-empty-application}} The general mechanism, and the other ZIA request fields held this way (cloud app control's `cbiProfile` among them), are in [[shared.sdk-go.zero-value-writes]].

## What to check

For a setting that did not apply: find the attribute in the resource's schema, then in its expand function, then in its read function, then the JSON tag in the SDK model. If the expand never names it, or names a key that is not in the schema, no configuration can change it. Re-read the object from the API (not state) after the apply to see what the service holds. Rule-order effects of the same edits are in [[zia.terraform.rule-order]]; changes still need activation ([[zia.terraform.activation]]).
