**Wire fields.** {{state-wire-field}} There is no fetch by rule ID alone, and update is a PUT {{rule-type-required-update-is-put}}. {{applications-sent-as-strings}} The MCP tools do not take the `cloud_applications` name their skill uses {{divergence:mcp-applications-kwarg}}.

**Application entries.** {{app-entry-fields}} {{val-echoed}} What the flags mean is open {{gap:flag-meanings}}. The reference and the SDKs also disagree on the request shape for application entries {{divergence:cloud-apps-element-shape}}; the Python model comment does not describe the discovery response {{python-application-model-comment}}. See [[zia.cloud-app-control.actions]] for how discovery is used in practice.

**Model differences.** The two SDKs model different fields {{divergence:go-python-model-fields}} and disagree on the shape of the risk profile {{divergence:risk-profile-shape}}; whether the Python mismatch raises is open {{gap:python-risk-profile-runtime}}.

**Rule name.** {{python-name-31-docstring}} {{mcp-skill-name-31}} Whether the API enforces the limit is open {{gap:name-length-enforcement}}.

**Duplicating a rule.** The Go SDK's `CreateDuplicate` cannot send a request, so it is not a way to clone a rule: [[zia.sdk-go.service-defects]]. {{python-duplicate-exists}}
