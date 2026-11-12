# Narrowing a ZPA log stream: status codes and streaming policy (zpa.log-receivers.filtering)
Also called: lss filter status codes; streaming policy; SIEM_POLICY; lss policy rule; validateLSSConfigControllerFilters; lss filter not supported; exclude session status; lss client type filter

A receiver can exclude session status codes and carry a streaming policy, and which of these a log type accepts differs by tool.

**In the console.** A receiver's streaming policy can restrict the stream to a specific segment group or set of session status error codes, and the criteria available depend on the Log Type. [zpa.log-receivers.filtering:console-policy] Every streaming-policy field adds the values it names except session statuses, which are configured to exclude values. [zpa.log-receivers.filtering:include-exclude] With several criteria, an OR is assumed between Application Segments and Segment Groups and an AND between the SAML attributes, the application segments or segment groups, client types and session statuses. [zpa.log-receivers.filtering:boolean-logic] A Log Receiver Policy rule is limited to 1,000 application segments. [zpa.log-receivers.filtering:segment-limit]

**Status codes.** The Python SDK's filter_status_codes is a list of session status codes that LSS excludes. [zpa.log-receivers.filtering:python-excluded] The documented status-codes response lists codes for four log types only, zpn_auth_log, zpn_ast_auth_log, zpn_trans_log and zpn_sys_auth_log, and the Terraform validator accepts a filter for exactly those four. [zpa.log-receivers.filtering:status-code-log-types] The Terraform provider checks each zpn_trans_log filter code against a fixed list of status codes, supportedLSSUserActivity. [zpa.log-receivers.filtering:tf-trans-log-filter-codes] The Terraform provider rejects a status-code filter on Browser Access, Audit Logs, AppProtection, App Connector Metrics and Private Service Edge Metrics receivers. [zpa.log-receivers.filtering:tf-no-filter-types] For any other source log type the provider's filter switch falls to a default that returns an invalid-source-log-type error, so a filter on a type outside the four is rejected. [zpa.log-receivers.filtering:tf-filter-default-rejects]

**Policy rule on the wire.** The Python SDK describes SIEM_POLICY as the parent policy set of a receiver's policy rule: policyRuleResource must carry the policySetId of that set, which the SDK looks up from the SIEM_POLICY policy type before it sends policy_rules. [zpa.log-receivers.filtering:siem-policy-set] The Terraform provider accepts the operand object types IDP, SCIM, SCIM_GROUP, SAML and CLIENT_TYPE on a User Status receiver and the same plus APP and APP_GROUP on a User Activity receiver. [zpa.log-receivers.filtering:tf-object-types] For any other source log type the provider returns an invalid-source-log-type error as soon as a policy operand is present, so policy rules are not accepted by the provider on other log types. [zpa.log-receivers.filtering:tf-other-types-rejected]

**When the provider checks.** The provider's filter and object-type checks run inside the resource's create and update functions, not as schema validators, so a violation is reported when the change is applied. [zpa.log-receivers.filtering:validation-at-apply]

The Terraform docs give LOG as the only action for a receiver's policy_rule_resource [The LSS User Activity example sets a policy_rule_resource whose action is LOG, and the same doc lists LOG as the supported action value.](kb:zpa.terraform.resource-constraints:lss-policy-rule-action-log).

What to check:
1. Which log type the receiver carries, since only User Activity, User Status, App Connector Status and Private Service Edge Status have status codes.
2. That status codes exclude and every other criterion includes, and how the criteria combine.
3. Whether a streaming policy on a log type other than User Activity or User Status is rejected by the provider.
4. When a Terraform error appears: at apply, in the create or update, not at plan.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.filtering:status-code-log-types] Tier B: The API example response is an example, not an enumeration, so a fifth log type with codes is not excluded by the article alone; the validator list is the client's behavior.
- [zpa.log-receivers.filtering:tf-no-filter-types] Tier B: Provider behavior only; what the API does with a filter on these types is not shown.
- [zpa.log-receivers.filtering:tf-filter-default-rejects] Tier B: Reading the switch: cases zpn_auth_log, zpn_trans_log, zpn_ast_auth_log and zpn_sys_auth_log, then default. The no-filter list is checked first.
- [zpa.log-receivers.filtering:tf-other-types-rejected] Tier B: Reading the object-type switch: cases zpn_auth_log and zpn_trans_log, then default. The provider's own validation only; the API article lists the object types without restricting them by log type.
- [zpa.log-receivers.filtering:validation-at-apply] Tier B: The only schema-level validator on this path is StringInSlice for source_log_type; the filter and operand checks are called from CreateContext and UpdateContext.

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- scoped-by references/_meta/text/zpa/zpa.saml-attributes.policy-criteria.md (How SAML attributes act as policy criteria): The Terraform provider accepts the operand object types IDP, SCIM, SCIM_GROUP, SAML and CLIENT_TYPE on a User Status receiver and the same plus APP and APP_GROUP on a User Activity receiver. [zpa.log-receivers.filtering:tf-object-types]
- scoped-by references/_meta/text/zpa/zpa.segment-groups.md (ZPA segment groups): A receiver's streaming policy can restrict the stream to a specific segment group or set of session status error codes, and the criteria available depend on the Log Type. [zpa.log-receivers.filtering:console-policy]
- links-to references/_meta/text/zpa/zpa.terraform.resource-constraints.md (Constraints the ZPA Terraform docs and provider code place on individual resources)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- see-also references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
- see-also references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
