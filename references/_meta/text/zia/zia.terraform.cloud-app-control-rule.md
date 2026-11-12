# The Cloud App Control rule resource: prompt capture, isolation, import and delete (zia.terraform.cloud-app-control-rule)
Also called: zia_cloud_app_control_rule; prompt_capture_enabled; cloud app control rule type import; terraform-provider-zia issue 585; tenancy_profile_ids MaxItems; cloud app control rule type change recreate; zia_cloud_app_control_rule type; cloud app control import type id

Cloud App Control rules are typed, and the provider scopes import, ordering and delete by that type. The importer accepts a compound `rule_type:rule_id` or `rule_type:rule_name` ID, splitting it on the first colon and looking the rule up under that type. [zia.terraform.cloud-app-control-rule:import-compound-key] Delete reads the rule's `type` and calls the type-scoped delete endpoint directly (`cloudappcontrol.Delete(ctx, service, ruleType, id)`), without the reorder helper. [zia.terraform.cloud-app-control-rule:delete-is-type-scoped-call]

**Rule type.** In the provider schema the type argument is an optional string built by getAppControlType, described as the supported App Control types, and the resource's type entry carries no ForceNew flag. [zia.terraform.cloud-app-control-rule:tf-rule-type-optional] Changing it plans an in-place update; what the API then does is open [gap:zia.terraform.cloud-app-control-rule:rule-type-recreate]. The API surface of the rules is in [Cloud App Control API and SDK surface: app entries, flags, duplicate](kb:zia.cloud-app-control.api-surface), and the tenant-profile attachment in [Tenant profile API, SDK and Terraform behavior](kb:zia.tenant-profiles.api-surface).

**Prompt capture.** The provider describes `prompt_capture_enabled` as applicable only when the Gen AI Applications Access field is set to Allow. [zia.terraform.cloud-app-control-rule:prompt-capture-schema-wording] The provider assigns `PromptCaptureEnabled` from the configuration on create and update, and the SDK tags the field `promptCaptureEnabled,omitempty`. [zia.terraform.cloud-app-control-rule:prompt-capture-assigned-by-provider] So a configured `false` is omitted from the serialized request. [zia.terraform.cloud-app-control-rule:prompt-capture-false-omitted] Whether it can be disabled is open [gap:zia.terraform.cloud-app-control-rule:prompt-capture-disable-path].

**Isolation and limits.** Cloud App Control `ISOLATE` actions require a Cloud Browser Isolation subscription and must be used alone, not mixed with other actions in the rule. [zia.terraform.cloud-app-control-rule:isolate-alone] Provider v4.7.23 removed `MaxItems` from `tenancy_profile_ids` and `cloud_app_instances` so that the API owns the limit. In the schema the cap is gone from the inner `id` set only: both attributes are built with a nil item limit, and the outer block still has `MaxItems: 1`, so all IDs go in one block. [zia.terraform.cloud-app-control-rule:max-items-removed]

**Ordering and delete.** Provider v4.8.4 changed ordering so that Cloud App Control rules of different `type` values applied in one configuration are each reordered independently; before that, only one type was guaranteed to converge. [zia.terraform.cloud-app-control-rule:v4-8-4-per-type-ordering] How the reorder engine keys these rules and gives up: [The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources](kb:zia.terraform.rule-order.registry). Whether several deletes in one apply are safe is open [gap:zia.terraform.cloud-app-control-rule:issue-585-multi-delete].

What to check:
1. Whether a rule that should stop capturing prompts was set to false, which the SDK omits from the request.
2. Whether the import ID carries the rule type as `rule_type:rule_id`.
3. Whether the rule type of an existing rule is expected to change, and how the provider treats a changed type.

Inferred, not quoted (say so when an answer rests on one):
- [zia.terraform.cloud-app-control-rule:prompt-capture-false-omitted] Tier B: Go's JSON encoder drops a false bool tagged omitempty.

Not known (open gaps):
- Whether a prompt-capture setting enabled in ZIA can be turned off through the provider [gap:zia.terraform.cloud-app-control-rule:prompt-capture-disable-path]: settled by lab-test. Blocks: saying that setting `prompt_capture_enabled = false` disables prompt capture
- Whether the multi-delete sequence reported in upstream issue 585 is resolved [gap:zia.terraform.cloud-app-control-rule:issue-585-multi-delete]: settled by lab-test. Blocks: saying that deleting several Cloud App Control rules in one apply is safe
- Whether changing a Cloud App Control rule's type forces a new rule [gap:zia.terraform.cloud-app-control-rule:rule-type-recreate]: settled by lab-test or code-read. Blocks: Whether editing the type in HCL replaces the rule or errors or silently diverges.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zbi/zbi.cloud-browser.md (How Cloud Browser isolates a page: remote browser, traffic flow, containers and the idle timeout): Cloud App Control `ISOLATE` actions require a Cloud Browser Isolation subscription and must be used alone, not mixed with other actions in the rule. [zia.terraform.cloud-app-control-rule:isolate-alone]
- links-to references/_meta/text/zia/zia.cloud-app-control.api-surface.md (Cloud App Control API and SDK surface: app entries, flags, duplicate)
- links-to references/_meta/text/zia/zia.tenant-profiles.api-surface.md (Tenant profile API, SDK and Terraform behavior)
- links-to references/_meta/text/zia/zia.terraform.rule-order.registry.md (The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.terraform.rule-resources.md (Constraints shared by ZIA Terraform rule resources: order and predefined rules)
- see-also references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles)
- see-also references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
