# How the Ansible Browser Access, PRA and Inspection modules reconcile child applications (zpa.app-segments.ansible-children)
Also called: ansible browser access v2 child apps; ansible pra application segment drift; ansible inspection segment common_apps_dto; ba_app_id pra_app_id inspect_app_id; ansible parent port merge; zpa_application_segment_ba_v2

This subject covers Ansible module behavior for the child applications of Browser Access, PRA and Inspection segments, not ZPA's application-segment matching.

**Child identity.** The Browser Access v2 and PRA modules resolve child IDs only from the children owned by the current parent segment; on create the parent and child IDs are left empty and nothing is marked for deletion, and on update the parent's children whose domain is no longer declared are listed for deletion in `deleted_ba_apps` (Browser Access v2) or `deleted_pra_apps` (PRA). [zpa.app-segments.ansible-children:child-ids-parent-scoped] Both modules compare declared and live child domains in both directions using trimmed, case-folded values on each side, so a child removed outside Ansible, or a declared child list emptied while live children remain, is treated as drift. [zpa.app-segments.ansible-children:child-domains-compared-both-ways] The general comparison excludes `id` and `common_apps_dto`, so the child check compares only normalized domains. [zpa.app-segments.ansible-children:children-comparison-narrow] What the comparison misses is open [gap:zpa.app-segments.ansible-children:child-field-drift].

**Domain normalization.** Each module's parent-owned child ID and deletion map is keyed by the raw domain string, while the drift check compares trimmed, case-folded domains. [zpa.app-segments.ansible-children:child-id-map-raw-keys] A child domain that differs from the live one only by case or whitespace compares equal in the drift check but finds no child ID on update, leaving the child ID empty and making the owned child appear stale for deletion or replacement. [zpa.app-segments.ansible-children:case-variant-child-lookup]

**Parent ports.** Both modules merge the child domains and TCP ports into `desired_app`, but the update payload takes its TCP ports from the raw `existing_app` and the create payload from the raw `app`, so the merged `tcp_port_range` is not sent. [zpa.app-segments.ansible-children:merged-ports-not-sent] `convert_ports_list(None)` returns an empty list, and `existing_app` is overwritten with the module arguments before the update payload is built, so a parent TCP port value left out of the task can clear the segment's ports; the intermediate merge is ineffective, not port preservation. [zpa.app-segments.ansible-children:omitted-ports-may-clear]

**Inspection.** The Inspection module looks up child apps only when `existing_app` is set (create skips the lookup), queries them with `get_segments_by_type` for type `INSPECT`, records deletions under `deleted_pra_apps`, and sends updates through the PRA client method `update_segment_pra`. [zpa.app-segments.ansible-children:inspection-module-differences] The Inspection module also merges domains and ports into `desired_app`, but the port ranges it sends come from `existing_app` on update (after `existing_app.update(app)`) and from `app` on create, not from `desired_app`. [zpa.app-segments.ansible-children:inspection-merge-not-sent] Whether it reconciles successfully is open [gap:zpa.app-segments.ansible-children:inspection-reconciliation-unproven]. The legacy comparison of the three modules is in [How the Ansible Browser Access, PRA and Inspection modules reconcile child applications](kb:zpa.app-segments.ansible-children).

What to check:
1. Whether the declared parent TCP ports reach the update payload, by reading the segment after a run that changed only children.
2. Whether child domains differ from the live ones only by case or surrounding whitespace.
3. Whether a change to a live child's port, protocol or certificate is detected, which the comparison does not establish.
4. Whether an inspection segment run changed anything, since its lookup, deletion field and update call differ from the other two modules.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.app-segments.ansible-children:omitted-ports-may-clear] Tier B: Chain of evidence: convert_ports_list returns [] for None, and existing_app.update(app) copies module arguments over the live values. Assumes an omitted option reaches `app` as None; not run.
- [zpa.app-segments.ansible-children:case-variant-child-lookup] Tier B: Chain of evidence: normalized comparison (no drift) plus raw-key lookup (no ID). The unit tests for both modules use lowercase exact-spelling domains (for example `app1.example.com`), so they do not exercise this boundary. Not run.

Not known (open gaps):
- Whether a change to a live child's port, protocol, certificate or other nested field is detected [gap:zpa.app-segments.ansible-children:child-field-drift]: settled by lab-test or code-read. Blocks: saying Ansible converges child apps beyond their domains
- Whether the Inspection module reconciles child apps successfully [gap:zpa.app-segments.ansible-children:inspection-reconciliation-unproven]: settled by lab-test or code-read. Blocks: relying on the Inspection module to converge child apps

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/browser-access.md (config type)
- configured-via references/_meta/text/types/zpa/pra-app-segments.md (config type)
- configured-via references/_meta/text/types/zpa/inspection-app-segments.md (config type)
- see-also references/_meta/text/zpa/zpa.app-segments.sdk-behavior.md (What the Python and Go SDKs send for application segments)
- see-also references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
