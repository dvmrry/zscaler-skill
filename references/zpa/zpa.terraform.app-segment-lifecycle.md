ZPA application segments come in four kinds (main, browser access, inspection, PRA), each with its own Terraform resource and SDK package. All four update by sending a full struct rebuilt from Terraform arguments, so what the schema cannot express goes out as Go zero values. The omitempty clears themselves are in [[shared.sdk-go.zero-value-writes]]; this subject covers what is specific to segments and the objects hanging off them.

**Parent flags.** {{parent-flags-always-serialized}} {{parent-flags-never-set}} {{main-update-builds-from-state}} {{unrelated-update-may-blank-flags}} What ZPA does with a false value for these flags on a PUT is open {{gap:api-app-segment-put-semantics}}.

**Empty objects.** {{phantom-shared-microtenant-object}}

**Nested apps.** {{inspection-subapp-flags-always-serialized}} {{inspection-subapp-expand-subset}} {{inspection-update-may-reset-subapp-state}} {{browser-hidden-sent-false}} {{pra-update-sends-remote-values}} {{pra-update-returns-read-after-update}}

**Child identity.** {{browser-child-id-positional-fallback}} {{browser-child-id-may-duplicate}} {{nested-apps-matched-by-name}}

**Sharing and associations.** {{main-share-separate-write}} {{association-block-first-only}} {{association-block-first-only-places}}

**Deletes.** Segment group, server group and connector group cleanups are in [[zpa.terraform.delete-paths]]. {{main-delete-v1-cleanup-ignores-errors}} {{other-segment-deletes-skip-policy-detach}} {{delete-can-leave-policy-references}} Whether the v1 policy listing returns rules written through the v2 endpoints is open {{gap:api-v1-listing-covers-v2-rules}}. Operand rewriting by the v1 cleanup is covered in [[zpa.terraform.policy-rule-writes]].

**Inspection profile and custom control associations.** {{associate-all-controls-no-false-branch}} {{associate-error-ignored}} {{custom-control-association-errors-logged}}
