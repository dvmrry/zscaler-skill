# Microsegmentation agent provisioning keys (nonces): portal, fields and API (zms.provisioning-keys)
Also called: zms provisioning key; zms nonce; microsegmentation enrollment key; agent provisioning key max reuse; zms_list_nonces; eyez nonce

Agents enroll into an agent group with a provisioning key; the API calls these keys nonces.

**In the portal.** Provisioning keys are managed on the selected agent group's Provisioning Keys tab, which lists each key's name, maximum number of agents, utilization count, agent group, signing certificate and the copyable key, and lets an administrator view the signing certificate and copy, edit or delete a key. [zms.provisioning-keys:keys-per-agent-group] The page gives instructions for installing the agent manager for VM agent groups or the Helm chart for Kubernetes Cluster agent groups. [zms.provisioning-keys:install-paths] Keys are created during agent group configuration; editing one changes its name, its maximum reuse (a number from 1 to 1000) and its signing certificate. [zms.provisioning-keys:edit-fields] Provisioning keys are created during agent group configuration and can be edited or deleted outside it; the delete icon is on the Provisioning Keys tab. [zms.provisioning-keys:delete-key] Whether a key's agent group can change is open [gap:zms.provisioning-keys:agent-group-editable].

**In the API.** The API calls provisioning keys nonces: the SDK's nonces module lists nonces (provisioning keys) with page and pageSize and gets one by its eyez ID, and the list selection includes `key`, `maxUsage`, `usageCount` and the agent group. [zms.provisioning-keys:nonces-are-keys] A read-only API client that can list ZMS nonces receives each provisioning key's `key` value in the response. [zms.provisioning-keys:nonce-key-readable] The single-nonce query returns its payload nested one level deeper, under `nonce` inside `nonce`. [zms.provisioning-keys:nonce-wrapped] The SDK's `NonceProduct` enum has the values EYEZ and EYEZ_LEGACY. [zms.provisioning-keys:nonce-product]

**MCP.** The MCP tool describes fields the query does not return [divergence:zms.provisioning-keys:mcp-nonce-fields]. Other MCP behavior is in [The Zscaler MCP server's ZMS tools: inventory, customer ID and known defects](kb:zms.mcp).

What to check:
1. Whether the key's usage count has reached its maximum reuse before blaming enrollment.
2. Whether the agent group is a VM group (agent manager) or a Kubernetes Cluster group (Helm chart).

Inferred, not quoted (say so when an answer rests on one):
- [zms.provisioning-keys:nonce-key-readable] Tier B: Follows from the list selection set asking for `key`; whether the server redacts it for some roles is not shown by any source.

Sources disagree (name both sides):
- The MCP list tool's description promises status and expiry per nonce, but the SDK query it calls selects neither field. [divergence:zms.provisioning-keys:mcp-nonce-fields]
  - mcp-server: The tool returns one row per nonce with eyez_id, name, status and expiry.
  - sdk-python: The ListNonces selection is eyezId, name, key, maxUsage, usageCount, agent group fields, product, creationTime and modifiedTime, with no status or expiry.
  Impact: An agent reading the MCP tool description expects status and expiry columns that are never returned; key validity has to be judged from maxUsage and usageCount instead.

Not known (open gaps):
- Whether a key's agent group can be changed [gap:zms.provisioning-keys:agent-group-editable]: settled by source-read or lab-test. Blocks: answering whether a key can be moved to another agent group

Area: zms.provisioning-keys, its subjects in references/_meta/spine/zms/zms.provisioning-keys.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.mcp.md (The Zscaler MCP server's ZMS tools: inventory, customer ID and known defects)
