# Reverting a change, product by product: what a write does, how to undo it, and what cannot be undone (shared.rollback)
Also called: rollback; revert a change; undo a zscaler change; reversibility; can i roll back; safe change; change reversibility

Reversibility depends on the product. ZIA stages writes until they are activated [The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status.](kb:zia.api.activation:saved-not-live), and the captured specifications show no activation call for the other products [Outside ZIA and Cloud & Branch Connector the captured API specifications have no call that activates staged configuration for the organization, so a saved change in ZPA, ZCC, ZDX or ZIdentity has no activation step to check.](kb:shared.activation:no-other-gate).

## Per product

| Product | What a write does | How to revert |
| --- | --- | --- |
| ZIA | Staged until activated [The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status.](kb:zia.api.activation:saved-not-live). A session end activates pending changes [The ZIA platform activates pending changes on its own when a session ends, either because an API session reached the `api_session_timeout` or because an admin logged out; this applies to all API changes, including Terraform's.](kb:zia.terraform.activation-methods:session-end-autoactivation). | Re-write the original values before the session ends. Once activated, a change cannot be reverted [For ZIA and Cloud & Branch Connector, configuration changes must be explicitly activated, through /status/activate and /ecAdminActivateStatus/activate respectively. A change cannot be reverted and a queued activation cannot be cancelled; the guide recommends grouping several changes and activating once.](kb:shared.oneapi.write-practices:activation-zia-cbc). |
| Cloud & Branch Connector | Staged until activated, and a forced activation route exists [The Python SDK's `activate` takes `force` (default False) and sends a PUT to `/ecAdminActivateStatus/forcedActivate` when it is True and to `/ecAdminActivateStatus/activate` otherwise, with any keyword arguments as the body.](kb:cloud-connector.api.activation-wire:python-force-flag). | Revert staged changes as for ZIA. What forced activation does beyond a normal activation is open [What forced activation does that a normal activation does not](kb:cloud-connector.api.activation-wire:force-semantics). |
| ZPA | No activation call in the captured specifications. Whether a write is live at once is open [Whether a ZPA write is live without an activation call](kb:zpa.api.activation:write-takes-effect). | Snapshot the resource and re-write the snapshot [Before updating a resource, send a GET and then the PUT or POST, because the update replaces the entire resource with the new values; this avoids overwriting changes by accident or missing updates made between the GET and the write.](kb:shared.oneapi.write-practices:fetch-before-update). |
| Client Connector | App profile changes download on logout or restart [The app checks for app profile updates and downloads changes whenever the user logs out and back into the app or restarts the computer.](kb:zcc.app-profiles.propagation:download-on-relogin). | Re-write the profile. Forwarding profile and trusted network timing is open [gap:shared.rollback:checkin-timing]. |
| ZIdentity | No activation call in the captured specifications [Outside ZIA and Cloud & Branch Connector the captured API specifications have no call that activates staged configuration for the organization, so a saved change in ZPA, ZCC, ZDX or ZIdentity has no activation step to check.](kb:shared.activation:no-other-gate). | Snapshot first. A deleted API client cannot be recovered [A deleted API client cannot be recovered.](kb:zidentity.api-clients:delete-unrecoverable). |
| Workflow Automation (ZWA) | Config changes apply to the next DLP incident. In-flight incidents keep their workflow [gap:shared.rollback:zwa-workflow-timing]. | Snapshot the configuration before a change. |
| AI Guard | Configuration resources are reached through OneAPI [In the Python SDK every AI Guard configuration resource (detection policies, policy match rules, LLM providers and credentials, LLM applications and credentials) is reached through OneAPI with `ZscalerClient` as `client.aiguard`; only policy detection uses the legacy client.](kb:ai-security.ai-guard.admin-api:python-oneapi). | The captured action routes are enable, disable and referential-check [The contract publishes action operations as colon suffixes on the resource path: `:enable`, `:disable` and `:referential-check` on detection policies, `:referential-check` on providers, provider credentials, applications and application credentials, and `:regenerate` on application credentials.](kb:ai-security.ai-guard.admin-api:colon-action-routes). Whether the live API accepts them is open [Whether the live API accepts the operations the Python SDK leaves out, and the SDK's regenerate path](kb:ai-security.ai-guard.admin-api:live-acceptance). |
| Risk360, ZMS and Deception | Risk360 has no client surface [No vendored client covers Risk360: the Go and Python SDKs have no Risk360 service, and the Terraform providers, Ansible collections, MCP server, OneAPI Postman collection and captured Automate contract have no Risk360 resource, module, tool or operation.](kb:risk360.overview:no-client-surface), and the ZMS API is read-only [ZMS is read-only: the MCP conventions say there are no mutations, and the release notes that added the SDK's ZMS service (1.9.18) describe its nine modules with list operations plus a few gets (agent group TOTP secrets, a nonce by ID, resource group members).](kb:zms.api:clients-read-only). Deception [gap:shared.rollback:deception-rollback]. | No verified SDK or Terraform rollback path. Use the product's own reference boundary. |

The Python client attribute client.zbi is Business Insights, not Zero Trust Browser [In the Python SDK, the `zbi` service client is Zscaler Business Insights, not browser isolation.](kb:shared.terminology.product-names:zbi-is-business-insights).

## What cannot be undone

- A provisioning key at maximum usage cannot deploy more connectors, though its maximum can be edited [When a key has been used its maximum number of times it cannot deploy more App Connectors, but its maximum can always be edited. The Copy icon is disabled with a Warning icon at that point.](kb:zpa.app-connectors.provisioning-keys:exhausted-key-blocks-deploy).
- Enrollment certificate validity and renewal are open [Connector certificate validity and renewal](kb:zpa.app-connectors.enrollment:certificate-validity-window).
- Whether a deleted resource can be restored is open [gap:shared.rollback:deleted-recreated-id].
- Whether streamed LSS logs can be recovered from Zscaler is open [gap:shared.rollback:lss-streamed-logs].
- Whether blocked DLP content is delivered when its rule is reverted is open [gap:shared.rollback:dlp-blocked-content].

What to check:
1. Before a risky ZIA change, read the current objects and keep them: a revert is a re-write of the original values before the session ends.
2. Start a ZIA change only when the activation status reads ACTIVE.
3. Re-read a staged value before activating. If it is wrong, re-write the original, because a change cannot be reverted once activated.
4. Stage related changes together and activate them as one step, because a queued activation waits on other admins' changes.
5. Assume another admin or automation can activate your staged revert. Whether activation is per admin is open.
6. Do not rely on discarding pending ZIA changes. Whether an API can do that without activating is open.
7. After activation, a counter-change can be staged and activated, but it does not undo the period in which the first change was live.
8. For ZPA, snapshot the segment before the change and re-write the snapshot to revert. Whether a write is live at once is open, so treat the window as live.
9. When restoring a ZPA application segment, pass its port forms and omit clientless_app_ids for a standard segment. An update clears any port form not passed.
10. For ZIdentity, snapshot the API client before a change. A deleted API client cannot be recovered.
11. For Client Connector app profiles, expect a change on the device at logout or restart. The timing for forwarding profiles and trusted networks is open.
12. For AI Guard, validate the enable and disable routes on the tenant before relying on them for rollback. The live API is not captured.
13. Do not treat Cloud & Branch Connector forced activation as a rollback: what it does beyond a normal activation is open.
14. Do not assume a deleted resource can be restored. Recreating it gives a new ID, so references to the old ID need rewiring.
15. Do not expect a provisioning key at maximum usage to deploy more connectors. Its maximum can be edited.
16. Plan enrollment certificate renewal from the captured validity window, which is open.
17. Treat streamed LSS logs and DLP-blocked content as unrecoverable until a source says otherwise.
18. Schedule a risky ZPA change for a maintenance window, since the write may take effect at once.
19. For Risk360, ZMS and Deception, use the product's own reference boundary: there is no verified SDK or Terraform rollback path.

Not known (open gaps):
- When Client Connector forwarding-profile and trusted-network changes reach a device [gap:shared.rollback:checkin-timing]: settled by source-read
- When a ZWA workflow change applies to incidents in flight [gap:shared.rollback:zwa-workflow-timing]: settled by source-read
- Whether a deleted resource can be restored [gap:shared.rollback:deleted-recreated-id]: settled by source-read
- Whether streamed LSS logs can be recovered from Zscaler [gap:shared.rollback:lss-streamed-logs]: settled by source-read
- Whether blocked DLP content is delivered when its rule is reverted [gap:shared.rollback:dlp-blocked-content]: settled by source-read
- Whether Deception has a configuration rollback path [gap:shared.rollback:deception-rollback]: settled by source-read

Area: shared.rollback, its subjects in references/_meta/spine/shared/shared.rollback.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/ai-security/ai-security.ai-guard.admin-api.md (The AI Guard configuration API: behavior the contract states, limits and errors, and what the Python SDK covers)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.activation-wire.md (Cloud Connector activation on the wire: activate, forced activate, and what the clients send)
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/shared/shared.oneapi.write-practices.md (Writing through OneAPI: fetch before update, activation, edit locks)
- links-to references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating)
- links-to references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)
- links-to references/_meta/text/shared/shared.terminology.product-names.md (Product names and SDK or API names with a source: Internet & SaaS, Private Access, Zscaler App, Zero Trust Browser, ZBI, ZGuard, ecgroup, deep trace, ZTC)
- links-to references/_meta/text/zcc/zcc.app-profiles.propagation.md (When an app profile change reaches a device)
- links-to references/_meta/text/zia/zia.terraform.activation-methods.md (Activating ZIA changes from Terraform: methods, session end and concurrent applies)
- links-to references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
- links-to references/_meta/text/zms/zms.api.md (The ZMS GraphQL API: one endpoint, read-only clients, customer scoping and pagination)
- links-to references/_meta/text/zpa/zpa.api.activation.md (Whether ZPA changes need an activation step)
- links-to references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-keys.md (App Connector provisioning keys)
