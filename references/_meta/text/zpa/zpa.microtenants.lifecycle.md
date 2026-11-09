# Microtenant lifecycle: create, disable, delete (zpa.microtenants.lifecycle)
Also called: disable microtenant; delete microtenant; microtenant admin id password; microtenant privileged approvals; microtenant emergency access; enabled false microtenant; zpa_microtenant_controller destroy

A Microtenant is created enabled or disabled, mapped to users, and deleted with side effects.

**Creating.** In the Add Microtenant drawer the Status is disabled by default. [zpa.microtenants.lifecycle:status-default-disabled] The Python SDK docstring says otherwise [divergence:zpa.microtenants.lifecycle:enabled-default]. The Admin ID and Password are available only when adding a Microtenant and cannot be accessed in the Zscaler Admin Console after the window is closed. [zpa.microtenants.lifecycle:admin-credentials-shown-once]

**Disabling.** Disabling a Microtenant terminates its active sessions, reassigns users mapped to it to the Default Microtenant, and makes users on Private Service Edges reauthenticate. [zpa.microtenants.lifecycle:disable-effects]

**Privileged Approvals and Emergency Access.** Enabling Privileged Approvals allows approval-based access even if no Authentication Domain is selected, it is Disabled by default, and a privileged approval must then be configured for that Microtenant. [zpa.microtenants.lifecycle:privileged-approvals-purpose] The Privileged Approvals option is supported only for applications that have Privileged Remote Access enabled. [zpa.microtenants.lifecycle:privileged-approvals-pra-only] The Emergency Access and Emergency Access Users pages are not visible for Microtenants with Privileged Approvals disabled. [zpa.microtenants.lifecycle:emergency-pages-hidden] Whether PRA works without it is open [gap:zpa.microtenants.lifecycle:pra-requires-privileged-approvals].

**Deleting.** Deleting a Microtenant deletes all log receivers that the Microtenant is associated with. [zpa.microtenants.lifecycle:delete-removes-log-receivers] The Python SDK's `delete_microtenant` and the Go SDK's `Delete` each issue a single DELETE to the Microtenant's URL; neither checks for or moves scoped resources first. [zpa.microtenants.lifecycle:sdk-delete-direct] Destroying a Terraform `zpa_microtenant_controller` resource calls the SDK's Microtenant delete with the resource ID. [zpa.microtenants.lifecycle:terraform-destroy-deletes] What happens to the Microtenant's scoped resources is open [gap:zpa.microtenants.lifecycle:delete-resource-fate]. Provider delete behavior for other resources is in [What the ZPA Terraform provider does when deleting objects with dependents](kb:zpa.terraform.delete-paths).

The Terraform doc for the microtenant controller resource says the feature is limited availability and needs an additional license [The microtenant controller resource is in limited availability and requires an additional license.](kb:zpa.terraform.resource-constraints:microtenant-controller-license).

What to check:
1. What disabling the Microtenant does to sessions and user assignment before recommending it as a temporary measure.
2. Whether the Admin ID and Password were saved at creation.
3. What exists in the Microtenant before a delete, including log receivers and scoped resources.
4. Whether Privileged Approvals is enabled when Emergency Access pages are missing.

Sources disagree (name both sides):
- The console creates a Microtenant disabled by default, while the Python SDK docstring says `enabled` defaults to True. [divergence:zpa.microtenants.lifecycle:enabled-default]
  - zscaler-help: The Status toggle in the Add Microtenant drawer is disabled by default.
  - sdk-python: add_microtenant documents `enabled` as defaulting to True.
  Impact: A caller that omits `enabled` cannot rely on either default: the SDK passes its keyword arguments through as the body, so what the API applies when the field is absent is not shown by either source.

Not known (open gaps):
- What happens to a Microtenant's scoped resources when it is deleted [gap:zpa.microtenants.lifecycle:delete-resource-fate]: settled by lab-test or support-ticket. Blocks: advising whether resources must be moved before deletion
- Whether a Microtenant without Privileged Approvals can support PRA workflows scoped to it [gap:zpa.microtenants.lifecycle:pra-requires-privileged-approvals]: settled by lab-test. Blocks: answering whether PRA works at all in a Microtenant with Privileged Approvals disabled

Area: zpa.microtenants, its subjects in references/_meta/spine/zpa/zpa.microtenants.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.microtenants.user-mapping.md (How users are mapped to a Microtenant), from zpa.microtenants: Private Access applies Microtenants in the order they are listed, top to bottom, and assigns the first match as the most relevant Microtenant; a newly created Microtenant is prioritized last by default. [zpa.microtenants.user-mapping:list-order-first-match]
- interacts-with references/_meta/text/zpa/zpa.emergency-access.configuration.md (Configuring Emergency Access: availability, settings, authentication domains, Microtenants): The Emergency Access and Emergency Access Users pages are not visible for Microtenants with Privileged Approvals disabled. [zpa.microtenants.lifecycle:emergency-pages-hidden]
- interacts-with references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service): Deleting a Microtenant deletes all log receivers that the Microtenant is associated with. [zpa.microtenants.lifecycle:delete-removes-log-receivers]
- decided-by references/_meta/text/zpa/zpa.microtenants.admin-permissions.md (Microtenant admin permissions), from zpa.microtenants: For resources defined in the Default Microtenant, a Microtenant admin has Read only access to App Connectors, App Connector Groups, Private Service Edges, Private Service Edge Groups, IdP Configuration and Machine Groups, where the Default Microtenant admin has Full. [zpa.microtenants.admin-permissions:default-resources-read-only]
- depends-on references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates), from zpa.microtenants: Zscaler Support enables the Microtenants feature for an organization. [zpa.microtenants.isolation:enablement]
- depends-on references/_meta/text/zpa/zpa.microtenants.limits.md (Microtenant limits and unsupported features), from zpa.microtenants: To configure a Microtenant, App Connectors and Private Service Edges for Private Access must be running version 24.63.1 or later. [zpa.microtenants.limits:connector-versions]
- decided-by references/_meta/text/zpa/zpa.microtenants.policy-evaluation.md (Policy evaluation between Default and custom Microtenants), from zpa.microtenants: A user in a custom Microtenant accessing a Default Microtenant segment is evaluated against the Default Microtenant first, and only if there is no match does Private Access evaluate access, timeout and client forwarding policy within the custom Microtenant. [zpa.microtenants.policy-evaluation:default-first-for-custom-user]
- interacts-with references/_meta/text/zpa/zpa.pra.approvals.md (PRA approvals: requesting, reviewing and expiry): Enabling Privileged Approvals allows approval-based access even if no Authentication Domain is selected, it is Disabled by default, and a privileged approval must then be configured for that Microtenant. [zpa.microtenants.lifecycle:privileged-approvals-purpose]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups), from zpa.microtenants: In disaster recovery mode, Private Service Edges and App Connectors mapped within a default or custom Microtenant provide traffic only to applications designated for disaster recovery. [zpa.private-service-edges.disaster-recovery:dr-microtenants]
- links-to references/_meta/text/zpa/zpa.terraform.delete-paths.md (What the ZPA Terraform provider does when deleting objects with dependents)
- links-to references/_meta/text/zpa/zpa.terraform.resource-constraints.md (Constraints the ZPA Terraform docs and provider code place on individual resources)
