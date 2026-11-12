# What a ZPA log receiver holds and which fields are required (zpa.log-receivers.configuration)
Also called: lss config; lssConfig fields; lss_host; lss_port; log receiver required fields; lss connector groups empty; log receiver one destination

A receiver has a config block, the App Connector groups that forward it, and an optional streaming policy.

**Config block.** The Go SDK models a receiver as an id, a config object, optional connectorGroups, an optional policyRule and an optional policyRuleResource; the config object carries id, name, description, enabled, filter, format, auditMessage, lssHost, lssPort, sourceLogType, microtenantId, microtenantName and useTls, with creationTime, modifiedBy and modifiedTime. [zpa.log-receivers.configuration:config-fields] The Terraform resource requires name (non-empty), format, lss_host, lss_port and source_log_type in its config block; description, enabled, filter and use_tls are optional. [zpa.log-receivers.configuration:required-fields] A receiver is enabled by default and TLS is off by default; the API article gives enabled the default true and useTls the default false. [zpa.log-receivers.configuration:defaults] lssPort is a string in the Go SDK, the Python SDK and the Terraform schema, and the API article gives its value type as String. [zpa.log-receivers.configuration:port-is-string] A log receiver's name cannot contain special characters except periods, hyphens and underscores. [zpa.log-receivers.configuration:name-characters]

**Target.** A receiver carries a single lssHost and lssPort, so it streams to one destination. [zpa.log-receivers.configuration:one-target] The same log type to two SIEMs by two receivers is not sourced [gap:zpa.log-receivers.configuration:two-siems].

**Connector groups.** The App Connector Groups on a receiver are the groups that can forward logs to it. [zpa.log-receivers.configuration:connector-groups-purpose] The API article marks appConnectorGroups as not required, and the Terraform schema declares connector_groups Optional. [zpa.log-receivers.configuration:connector-groups-optional] In the Python SDK's update, connectorGroups is sent only when app_connector_group_ids is supplied, and passing an empty list clears the associations. [zpa.log-receivers.configuration:python-groups-update] The documents disagree on whether groups are required [divergence:zpa.log-receivers.configuration:connector-groups-required], and what an empty list does is open [gap:zpa.log-receivers.configuration:empty-groups].

**Streaming policy.** A receiver may carry a policyRuleResource that restricts what is streamed; the API article lists its objectType values as APP, APP_GROUP, CLIENT_TYPE, SAML, SCIM and SCIM_GROUP. [zpa.log-receivers.configuration:policy-rule-resource]

In the Terraform receiver resource the config block and the policy_rule_resource block each allow at most one item. [zpa.log-receivers.configuration:tf-single-config-and-rule-blocks]

What to check:
1. Which fields the tool requires: name, format, lss_host, lss_port and source_log_type in Terraform.
2. That a receiver names a single host and port, so a second destination needs a second receiver.
3. Whether connector groups are set, noting that the sources disagree on whether they are required.
4. That lssPort travels as a string and the name avoids special characters other than period, hyphen and underscore.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.log-receivers.configuration:one-target] Tier B: The receiver object and all three clients (Go, Python, Terraform) define host and port once and no list of destinations; read in full for the Go struct and the Terraform config schema.

Sources disagree (name both sides):
- Whether a receiver must have App Connector groups: the provider's documentation marks connector_groups Required, while its schema and the API article treat the groups as optional. [divergence:zpa.log-receivers.configuration:connector-groups-required]
  - tf-zpa: The provider documentation lists connector_groups as Required.
  - tf-zpa: The provider schema declares connector_groups Optional.
  Impact: A configuration that omits connector_groups is accepted by the schema although the documentation calls it required; what such a receiver does is not shown (see gap empty-groups).

Not known (open gaps):
- A receiver with no connector groups [gap:zpa.log-receivers.configuration:empty-groups]: settled by lab-test
- Sending one log type to two SIEMs [gap:zpa.log-receivers.configuration:two-siems]: settled by lab-test or support-ticket

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- scoped-by references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups): The App Connector Groups on a receiver are the groups that can forward logs to it. [zpa.log-receivers.configuration:connector-groups-purpose]
- scoped-by references/_meta/text/zpa/zpa.log-receivers.filtering.md (Narrowing a ZPA log stream: status codes and streaming policy): A receiver may carry a policyRuleResource that restricts what is streamed; the API article lists its objectType values as APP, APP_GROUP, CLIENT_TYPE, SAML, SCIM and SCIM_GROUP. [zpa.log-receivers.configuration:policy-rule-resource]
- depends-on references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes): The Terraform resource requires name (non-empty), format, lss_host, lss_port and source_log_type in its config block; description, enabled, filter and use_tls are optional. [zpa.log-receivers.configuration:required-fields]

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
- see-also references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
- see-also references/_meta/text/zpa/zpa.log-receivers.tls.md (TLS between the App Connector and the log receiver)
