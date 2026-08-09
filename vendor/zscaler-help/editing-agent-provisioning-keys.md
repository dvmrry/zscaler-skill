# Editing Agent Provisioning Keys

**Source:** https://help.zscaler.com/zpa/editing-agent-provisioning-keys
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This is a scoped summary of the current rendered Help article.

Agent provisioning keys are created during agent-group configuration. The
current edit workflow starts under **Infrastructure > Connectors > Cloud >
Agent Groups**, where the administrator selects the group containing the key
and opens the key's Edit drawer from the Provisioning Keys tab.

The Edit Provisioning Key drawer documents these editable values:

- **Name**
- **Maximum Reuse of Key**, from 1 through 1,000
- **Signing Certificate**, selected from a drop-down menu

Saving the drawer updates the key in the provisioning-key list. The article
also says keys can be deleted outside agent-group configuration.

## Source boundary

The current rendered article does not list Agent Group as either an editable
or immutable field in the Edit drawer. This capture therefore makes no claim
about whether a key can be moved between groups. The article also does not
publish the underlying GraphQL operation or SDK model.
