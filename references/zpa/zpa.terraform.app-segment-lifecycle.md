ZPA application segments come in four kinds (main, browser access, inspection, PRA), each with its own Terraform resource and SDK package. All four update by sending a full struct rebuilt from Terraform arguments, so what the schema cannot express goes out as Go zero values. The omitempty clears themselves are in [[shared.sdk-go.zero-value-writes]]; this subject covers what is specific to segments and the objects hanging off them.

Parent flags. {{parent-flags-always-serialized}} {{parent-flags-never-set}} {{main-update-builds-from-state}} {{unrelated-update-may-blank-flags}} After an apply that changed only a name or a port range, re-read the segment and compare extranet, API protection, AppProtection and reauth flags with what they were before.

Empty objects. {{phantom-shared-microtenant-object}}

Nested apps. Inspection, browser access and PRA segments carry child apps, and each kind loses information differently. {{inspection-subapp-flags-always-serialized}} {{inspection-subapp-expand-subset}} {{inspection-update-may-reset-subapp-state}} {{browser-hidden-sent-false}} {{pra-update-sends-remote-values}} The PRA case is the one that fails quietly the other way: the apply succeeds and the change never leaves the provider.

Child identity. {{browser-child-id-positional-fallback}} {{browser-child-id-may-duplicate}} {{nested-apps-matched-by-name}}

Sharing and associations. {{main-share-separate-write}} {{association-block-first-only}} {{association-block-first-only-places}} A second `server_groups` block is silently ignored, so check the plan output rather than assuming every configured group was sent.

Deletes. Segment group, server group and connector group cleanups are in [[zpa.terraform.delete-paths]]. The segment delete paths are different. {{main-delete-v1-cleanup-ignores-errors}} {{other-segment-deletes-skip-policy-detach}} {{delete-can-leave-policy-references}} Operand rewriting by the v1 cleanup is covered in [[zpa.terraform.policy-rule-writes]]. After destroying a segment, search every policy type for APP operands that name its ID.

Inspection profile and custom control associations. {{associate-all-controls-no-false-branch}} {{associate-error-ignored}} {{custom-control-association-errors-logged}} An inspection profile that shows `associate_all_controls = false` in state says nothing about the remote association; read the profile from the API.
