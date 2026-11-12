# Writing Browser Access segments: Python SDK, MCP server, Go SDK and Terraform (zpa.browser-access.tooling)
Also called: app_segments_ba_v2; common_apps_dto apps_config; clientless_app_ids; mcp browser access; zpa_application_segment_browser_access; invalid.clientless.port; browser access terraform; browserAccessGroups

Tools that write Browser Access segments differ in what they send. This subject covers the Python SDK, the MCP server, the Go SDK and the Terraform resource; Ansible child reconciliation is in [How the Ansible Browser Access, PRA and Inspection modules reconcile child applications](kb:zpa.app-segments.ansible-children).

**Python SDK.** [The v2 module sends the Browser Access applications as `commonAppsDto` built from `common_apps_dto.apps_config` and adds `app_types` of BROWSER_ACCESS to entries that lack it; its changelog entry calls this the newly recommended format.](kb:zpa.sdk-python.browser-access-modules:v2-apps-config) Both Python SDK Browser Access services, v1 and v2, call transform_common_id_fields with coerce_ids=False on create and update, which keeps ZPA's opaque string IDs instead of coercing numeric-looking ones to integers. [zpa.browser-access.tooling:sdk-ids-not-coerced]

**MCP server.** The MCP server's Browser Access create and update tools take an optional clientless_app_ids list and forward it unchanged to the Python SDK v2 call. Neither tool requires or builds common_apps_dto.apps_config. [zpa.browser-access.tooling:mcp-forwards-clientless-ids] The create tool sends a different structure than the SDK reads [divergence:zpa.browser-access.tooling:mcp-payload-mismatch]. The bundled skill describes validation the tool does not do [divergence:zpa.browser-access.tooling:mcp-skill-stale]. Whether writes work end to end is open [gap:zpa.browser-access.tooling:mcp-writes-functional].

**Go SDK.** The Go SDK declares a separate admin-customer /browserAccessGroups resource with a typed BrowserAccessGroups model and read-only GetAll and Get functions. [zpa.browser-access.tooling:go-browser-access-groups] Whether a tenant has the resource is open [gap:zpa.browser-access.tooling:browser-access-groups-enabled].

**Terraform.** In the Terraform Browser Access resource, a clientless app that sets certificate_id together with ext_label or ext_domain is rejected with the error "'certificate_id' cannot be set when either 'ext_label' or 'ext_domain' is configured". [zpa.browser-access.tooling:tf-certificate-conflicts-ext-fields] In the Terraform Browser Access resource, select_connector_close_to_app is a plain optional boolean without ForceNew. [zpa.browser-access.tooling:tf-select-connector-not-forcenew] The base resource is in [Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings). When a Browser Access update introduces a port that the segment's persisted port ranges do not yet include, the Terraform resource first writes the union of the existing and desired port ranges while keeping the existing clientless apps, and then writes the full desired state. The comment gives the reason: the API validates each clientless app's port against the persisted ranges, so a single PUT fails with invalid.clientless.port. [zpa.browser-access.tooling:tf-port-prewrite] Child-ID matching and delete behavior for Browser Access segments are in [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle).

What to check:
1. Which tool wrote the segment, since the Python SDK v2, the MCP tools and Terraform build the clientless applications differently.
2. Whether an MCP write was read back, because the tool payload and the SDK path disagree.
3. Whether a Terraform plan sets certificate_id with ext_label or ext_domain, and whether older notes about select_connector_close_to_app apply.

Sources disagree (name both sides):
- What the MCP Browser Access tools send versus what the Python SDK v2 create reads [divergence:zpa.browser-access.tooling:mcp-payload-mismatch]
  - mcp-server: The MCP create tool builds its body from clientless_app_ids and forwards it to the SDK v2 add_segment_ba without a common_apps_dto.
  - sdk-python: The SDK v2 create reads common_apps_dto, iterates its apps_config and sends commonAppsDto.
  Impact: A Browser Access create or update through the MCP tools with clientless_app_ids does not supply the structure the SDK v2 path populates, so the per-application records may not be written. Treat a successful MCP result as unconfirmed and read the segment back.
- What the bundled MCP onboarding skill says the create tool does versus what the tool does [divergence:zpa.browser-access.tooling:mcp-skill-stale]
  - mcp-server: The onboarding skill says common_apps_dto.apps_config is required and that certificate and domain checks are made client-side by the create tool.
  - mcp-server: The create tool checks only that name and segment_group_id are present, then forwards the body.
  Impact: Agents following the skill expect validation the tool does not perform. Rely on the tool code, not on the skill text.

Not known (open gaps):
- Whether MCP Browser Access writes work end to end [gap:zpa.browser-access.tooling:mcp-writes-functional]: settled by lab-test or code-read
- Whether /browserAccessGroups is available to a tenant [gap:zpa.browser-access.tooling:browser-access-groups-enabled] (data gap): filled by operator; settled by tenant-data or lab-test

Area: zpa.browser-access, its subjects in references/_meta/spine/zpa/zpa.browser-access.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.browser-access.certificates.md (Certificates for Browser Access applications: wildcards, managed and custom), from zpa.browser-access: For each Browser Access application the admin chooses either a Custom certificate, where a web server certificate is selected, or a Zscaler-managed certificate. [zpa.browser-access.certificates:certificate-type]
- decided-by references/_meta/text/zpa/zpa.browser-access.policy.md (Access policy for Browser Access: client type and unsupported criteria), from zpa.browser-access: An access policy rule can target the Web Browser client type, which refers to Browser Access. Multiple client types in one rule are joined with OR. [zpa.browser-access.policy:web-browser-client-type]
- logged-in references/_meta/text/zpa/zpa.logs.browser-access.md (What a ZPA Browser Access log record says and does not say), from zpa.browser-access: The Browser Access log type carries HTTP log information, and its NameID field is the NameID Private Access received in the SAML assertion from the IdP. [zpa.browser-access.logs:http-log-and-nameid]
- interacts-with references/_meta/text/zpa/zpa.pra.md (Privileged Remote Access: what it is and where each question goes), from zpa.browser-access: SSH, RDP and VNC are not Browser Access traffic. Browser Access carries HTTP and HTTPS only, and Privileged Remote Access is the clientless path for RDP, SSH and VNC. [zpa.browser-access.requirements:non-http-use-pra]
- links-to references/_meta/text/zpa/zpa.app-segments.ansible-children.md (How the Ansible Browser Access, PRA and Inspection modules reconcile child applications)
- links-to references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring)
- links-to references/_meta/text/zpa/zpa.sdk-python.browser-access-modules.md (The two Python Browser Access segment modules and the by-type helper)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/browser-access.md (config type)
- see-also references/_meta/text/zpa/zpa.browser-access.segment-constraints.md (Browser Access applications on a segment: per-application keys and where the constraints live)
