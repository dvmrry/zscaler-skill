# What the SDKs and provider send for a ZPA log receiver (LSS) (zpa.api.lss-wire)
Also called: lss config omitempty; lss entryValues; lss update returns nothing; log receiver policy rule IDP; lssPort string integer; zpn_client_type_browser_isolation lss; SIEM_POLICY policySetId lookup

This subject records what the SDKs and the Terraform provider put on the wire for a Log Streaming Service receiver that is not visible in the field list: dropped zero values, key spellings, response handling and where the tools disagree. The receiver's own behavior is in [What a ZPA log receiver holds and which fields are required](kb:zpa.log-receivers.configuration), its log types in [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types) and its formats in [Log stream format and content templates for a ZPA log receiver](kb:zpa.log-receivers.formats).

## Config and write behavior

The Go SDK's receiver config struct tags `enabled` and `useTls` as omitempty, so a false value is not sent, and names the tenant key `microtenantId` with a lowercase t even though the Go field is `MicroTenantID`. [zpa.api.lss-wire:config-omitempty-and-keys] The Go receiver request tags `config` without omitempty, so the key is always in the body even when the pointer is nil, while connectorGroups, policyRule and policyRuleResource are omitempty. [zpa.api.lss-wire:config-key-always-present] Zero-value dropping in general is in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes).

The Go SDK's receiver Update sends the PUT with no response target and returns only the HTTP response, while Create decodes the created receiver; the Python SDK's update returns an object holding only the id when the body is empty. The specification documents the PUT response as 204. [zpa.api.lss-wire:update-returns-no-body] The Python SDK's add_lss_config indexes its source-log-type map directly, so an unknown value raises KeyError, while update_lss_config checks the value first and returns an error result instead of raising. [zpa.api.lss-wire:python-add-update-source-log-type] The Python SDK's add_lss_config defaults enabled to True, use_tls to False and source_log_format to csv, and its response model reads a missing enabled as True and a missing useTls as False. [zpa.api.lss-wire:python-defaults]

The specification types the port as an integer, while the API article, the SDKs and the provider use a string [divergence:zpa.api.lss-wire:lss-port-type]. The Python SDK writes a receiver's connector groups as id-only objects; add_lss_config sends an empty connectorGroups list when no group ids are given. [zpa.api.lss-wire:python-connector-groups-id-only]

## Policy rule resource

To fill a receiver's policyRuleResource.policySetId the Python SDK resolves the SIEM_POLICY set with a GET on the v1 path /policySet/policyType/SIEM_POLICY, while the receiver itself is written under the v2 base path. The Go SDK's integration test resolves the same policy type before creating a receiver. [zpa.api.lss-wire:python-siem-lookup-v1] The Terraform schema for a receiver's policy rule accepts only `LOG` as the action, and the Go SDK's integration test creates its policy rule resource with action `LOG`. [zpa.api.lss-wire:action-log-only] In the Go LSS config controller's policy condition structs, `negated` is tagged without omitempty in both the legacy `Conditions` struct and `PolicyRuleResourceConditions`, while the other condition fields are omitempty. [zpa.api.lss-wire:policy-negated-always-sent] A body marshalled from either struct therefore always carries `negated`, false included. [zpa.api.lss-wire:policy-negated-false-sent]

The Go operand struct names the lhs/rhs list `entryValues`. The Terraform receiver validator requires `entry_values` with both lhs and rhs for operands of type SCIM_GROUP, SCIM, SAML and IDP, and rejects `entry_values` on every other object type, CLIENT_TYPE included. [zpa.api.lss-wire:entry-values-rules] The Python SDK builds `entryValues` of lhs/rhs pairs only for the policy rule types saml, scim and scim_group; every other type, idp included, is sent as a plain `values` list, and client_type names are translated to wire codes through the client-types lookup. [zpa.api.lss-wire:python-condition-templates] The IDP shape differs between the two tools [divergence:zpa.api.lss-wire:idp-operand-shape].

## Client types

Among the six fields of the Go LSSClientTypes response struct, only `zpn_client_type_slogger` is tagged omitempty; the other five (exporter, machine tunnel, IP anchoring, edge connector, zapp) are tagged without it. [zpa.api.lss-wire:client-types-slogger-omitempty] The Python SDK reads the client type list from the API rather than a built-in table [`get_client_types` makes a GET to the `clientTypes` path under the LSS config endpoint, and returns a map from each display name, lower-cased with spaces turned to underscores, to its code; it is an API call, not a built-in table.](kb:zpa.sdk-python.lss-helpers:client-types-call).

zpn_client_type_browser_isolation is a listed receiver client type: the LSS API article's client types example maps it to Cloud Browser, and the Terraform provider's supportedClientTypes map, which validates CLIENT_TYPE values on receiver policy operands, includes it. The Go SDK's receiver integration test carries it only inside a commented-out block, which tests nothing. [zpa.api.lss-wire:browser-isolation-client-type] Whether the API accepts it as a receiver policy operand is open [gap:zpa.api.lss-wire:browser-isolation-accepted].

Whether the server keeps condition order is open [gap:zpa.api.lss-wire:policy-condition-order], and so is which actions it accepts on the policy rule [gap:zpa.api.lss-wire:policy-action-accepted].

What to check:
1. Whether a receiver update that clears a flag (enabled or use_tls false) actually sent the key, before blaming the API for a flag that did not change.
2. Whether a failed IDP-conditioned receiver came from a tool sending values where the other expects entryValues.
3. Whether the caller expected an updated receiver back from a PUT, which returns no body.
4. Whether a client type filter on a receiver has evidence that the API accepts it, for browser isolation in particular.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.lss-wire:policy-negated-false-sent] Tier B: Follows from Go encoding/json semantics: a bool field without omitempty is marshalled even when false. No captured source states this for these structs. Split from policy-negated-always-sent, whose Tier A statement keeps only the tags.

Sources disagree (name both sides):
- The wire type of a receiver's lssPort: the specification types it as an integer, while the LSS API article, the Go SDK, the Python SDK and the Terraform provider use a string. [divergence:zpa.api.lss-wire:lss-port-type]
  - api-specs: The specification's receiver config defines lssPort as an int32 integer.
  - sdk-go: The Go SDK declares LSSPort as a string with omitempty.
  - sdk-python: The Python add_lss_config types lss_port as a string.
  - tf-zpa: The Terraform provider fills LSSPort from its lss_port argument as a string.
  - zscaler-help: The LSS API article gives config.lssPort the value type String, and its create example sends "lssPort":"8081".
  Impact: The specification is the odd one out: a caller building a raw request from it sends a number, where the API article's own example and every tool send a quoted string. Nothing here shows whether the API also accepts a number. See [[zpa.log-receivers.configuration]].
- How an IDP condition on a receiver's policy is shaped: the Terraform validator requires entryValues, while the Python SDK sends a plain values list. [divergence:zpa.api.lss-wire:idp-operand-shape]
  - tf-zpa: The Terraform receiver validator requires entry_values for IDP operands and rejects entry_values on object types outside SCIM_GROUP, SCIM, SAML and IDP.
  - sdk-python: The Python SDK builds entryValues only for saml, scim and scim_group and sends idp as objectType plus a values list.
  - zscaler-help: The LSS API article lists the supported policyRuleResource.objectType values as APP, APP_GROUP, CLIENT_TYPE, SAML, SCIM and SCIM_GROUP, with no IDP.
  Impact: The same IDP condition is shaped two ways depending on the tool, and the API article's list of supported object types does not include IDP at all. Which shape, if any, the API accepts for IDP is not settled here, so a receiver with an IDP condition created by one tool and read or planned by the other can differ.

Not known (open gaps):
- Whether the API accepts zpn_client_type_browser_isolation as a CLIENT_TYPE operand on a receiver's policy [gap:zpa.api.lss-wire:browser-isolation-accepted]: settled by lab-test. Blocks: telling whether a receiver filtered on Cloud Browser sessions can be created
- Whether LSS policy conditions and operands keep their order across a round trip [gap:zpa.api.lss-wire:policy-condition-order]: settled by lab-test. Blocks: telling whether a receiver policy plan can show spurious order drift
- Which actions the API accepts on a receiver's policy rule [gap:zpa.api.lss-wire:policy-action-accepted]: settled by lab-test. Blocks: telling whether a receiver written outside Terraform with another action is valid

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
- links-to references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- links-to references/_meta/text/zpa/zpa.sdk-python.lss-helpers.md (Python SDK Log Streaming helpers: client types, log formats and status codes)
