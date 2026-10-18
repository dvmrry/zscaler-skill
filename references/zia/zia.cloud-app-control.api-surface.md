**Application entries.** {{app-entry-fields}} {{val-echoed}} What the flags mean is open {{gap:flag-meanings}}. The reference and the SDKs also disagree on the request shape for application entries {{divergence:cloud-apps-element-shape}}; see [[zia.cloud-app-control.actions]] for how discovery is used in practice.

**Duplicating a rule.** The Go SDK's `CreateDuplicate` cannot send a request, so it is not a way to clone a rule: [[zia.sdk-go.service-defects]]. {{python-duplicate-exists}}
