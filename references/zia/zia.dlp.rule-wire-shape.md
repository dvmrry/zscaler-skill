This is the API view of a Web DLP rule. Reach for it when a question names a field, an enum value or an SDK call, or when the console and the API disagree.

**Where it lives.** {{endpoint}} {{global-options-fields}}

**Enums.** {{action-enum}} {{severity-enum}} The Confirm gap matters for Terraform and audits that compare console state to API state.

**Match Only is not a size switch.** {{match-only-field}} Do not repeat the Python docstring: it conflicts with the vendor reference, as the divergence `match-only-docstring` records.

**Sub-rules and rules without inspection.** {{sub-rules-model}} The mode requirement and what exception rules do are in [[zia.dlp.evaluation]]. {{without-content-inspection}}

**OCR, content locations and scoping.** {{ocr-two-switches}} {{content-locations-field}} {{scoping-and-handles}}

**Incident receiver fields.** {{receiver-replaces-icap-fields}} The destinations themselves are in [[zia.dlp.incident-forwarding]].

**Fields only live reads show.** {{live-read-only-fields}} {{recapture-negative-control}}

How the Terraform provider and Go SDK mishandle these rules (nil dereferences under the rule lock, ordering, zero-value writes, data source output) is in [[zia.terraform.error-handling]], [[zia.terraform.rule-order.registry]], [[zia.terraform.data-source-fidelity]], [[zia.terraform.field-fidelity]] and [[zia.sdk-go.write-encoding]]; the Cloud-to-Cloud receiver's secret handling is in [[shared.terraform.credential-handling]]. They are not repeated here.
