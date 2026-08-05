# About Agent Provisioning Keys

**Source:** https://help.zscaler.com/zpa/about-agent-provisioning-keys
**Captured:** 2026-08-04 via the Zscaler Help Portal rendered-data endpoint.

---

This is a scoped summary of the current rendered Help article.

The Provisioning Keys page displays configured Microsegmentation agent
provisioning keys for an agent group and supports monitoring and management of
those keys.

## Portal surface

The page is under **Infrastructure > Connectors > Cloud > Agent Groups >
select an agent group > Provisioning Keys**. Administrators can:

- add a provisioning key as part of agent-group configuration;
- filter the list by Name;
- list the keys configured for the selected agent group;
- view the signing certificate associated with a key;
- copy, edit, or delete a key;
- manage the agent group and view its details;
- view the agents in the group; and
- view installation instructions for the Agent Manager for VM agent groups or
  the Helm chart for Kubernetes Cluster agent groups.

The page also supports refresh, column and filter visibility, and pagination.

## Source boundary

This article documents the portal's group-scoped key inventory. It does not
publish a GraphQL operation or establish that fields such as status or expiry
are returned by an SDK query.
