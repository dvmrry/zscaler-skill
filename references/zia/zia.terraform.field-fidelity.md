A Terraform attribute can be accepted, shown in a plan, and even stored in state without ever reaching the ZIA API, or without ever being read back. Terraform cannot tell the difference, so the apply succeeds (the SDK side of this is in [[zia.sdk-go.write-encoding]]). Each case below is a gap between the schema, the expand function (config to request), the flatten code (response to state), and the SDK request model.

## Fields the request never carries

**Forwarding control rules.** {{fwd-control-ipv6-eczpa-never-expanded}} {{fwd-control-update-drops-selectors}}

**Selectors under the wrong key.** {{casb-dlp-excluded-domains-wrong-key}} {{casb-dlp-wrong-key-drops-scope-exclusion}}

**Attributes with no SDK field.** {{cloud-nss-exclusions-dead}}

## Fields forced to a fixed value

**Fixed false values.** {{dns-capture-pcap-read-not-sent}} {{ips-capture-pcap-not-read-or-sent}} {{file-type-password-protected-never-mapped}} {{non-omitempty-bools-force-false}} Whether the API applies that false is open {{gap:api-bool-write-effect}}. The reverse trap (zero values dropped) is in [[zia.sdk-go.write-encoding]].

## Fields the state cannot show

**Attributes never read back.** {{casb-labels-expanded-not-flattened}}

## Several blocks, one slot

{{admin-user-role-first-element-only}} {{first-block-truncation-elsewhere}}

## Empty objects on the wire

**Zero-value structs.** {{endpoint-dlp-zero-struct-channels}} {{endpoint-dlp-custom-app-empty-application}} How the API reacts to these is open {{gap:api-empty-object-reaction}}. The general mechanism, and the other ZIA request fields held this way (cloud app control's `cbiProfile` among them), are in [[shared.sdk-go.zero-value-writes]].

Rule-order effects of the same edits are in [[zia.terraform.rule-order]]; changes still need activation ([[zia.terraform.activation]]).
