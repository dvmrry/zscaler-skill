Several ZPA resources do not do what their schema promises: an argument is dropped on the way out, a response field is dropped on the way back, or one logical write is split into several requests with no way back. Application segment resources have their own version of this problem in [[zpa.terraform.app-segment-lifecycle]].

**Success-shaped results.** {{cloud-config-read-error-is-success}} {{cloud-config-destroy-is-noop}} {{schedule-delete-is-noop}} The SDK's refusal to update a disabled schedule is in [[zpa.sdk-go.service-defects:assistant-schedule-update-rejects-disabled]]. {{schedule-create-discards-server-id}} {{schedule-read-never-sets-id}} {{assistant-schedules-share-one-shape}}

**Arguments that never reach the API.** {{redirection-create-skips-policy-set-lookup}} {{redirection-edge-group-expand-flatten-asymmetry}} {{private-cloud-no-exporter-group-field}} {{server-group-update-name-only-on-change}} How ZPA treats a server group PUT without a name is open {{gap:api-server-group-put-name}}. {{lss-false-values-not-sent}} The wider omission mechanism is in [[shared.sdk-go.zero-value-writes]].

**Response fields that never reach state.** {{redirection-read-omits-microtenant}} {{portal-capabilities-read-checks-wrong-field}} {{capabilities-read-never-clears}} {{pra-console-read-never-clears-application}} {{stale-state-hides-out-of-band-removal}} {{lss-read-drops-policy-rule-resource}} Policy rule reads that go through the v2 converter have a related loss, covered in [[zpa.terraform.policy-rule-writes]].

**One logical write, several requests.** {{private-cloud-create-then-fire-drill-put}} {{user-code-verification-after-write}} Cleanup sequences that fail midway on destroy are in [[zpa.terraform.delete-paths]].

**Import and validation.** {{pra-approval-end-not-checked-against-start}} Whether the API rejects an end before the start is open {{gap:api-approval-window-validation}}.
