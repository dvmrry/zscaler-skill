AI & ML is the one category with a dedicated rule flow. {{separate-flow}}

**What can be controlled per app.** {{granular-actions-by-app}} {{common-actions-and-ssl}} The categories page names fewer applications, so check both before telling an operator an app has no granular controls: see divergence `granular-app-coverage`. Granular enforcement needs decryption, so confirm the traffic is inspected first: [[zia.cloud-app-control.ssl-visibility]]. How action strings are discovered and shaped: [[zia.cloud-app-control.actions]].

**Prompt capture.** {{capture-prompts}} Because prompts land in logs, treat the setting as a data-handling question, not only a policy one. In the API: {{prompt-capture-go-field}} {{prompt-capture-not-in-python}} See gap `prompt-capture-vs-denied-access` for what is not known.

**Tenant restriction for AI apps.** {{tenant-profiles-visibility}} The Tenant Profiles feature itself, its supported application list, and the Claude token question belong to [Tenant Profiles](./tenant-profiles.md).
