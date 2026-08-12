# Users and User Groups

**Source:** https://help.zscaler.com/secure-ai-users/users-and-user-groups
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

User- or user-group-scoped AI Guard policies require synchronization with ZIA
so that AI Guard can import users, groups, and domains for policy evaluation.
The ZIA tenant must already be linked to the AI Guard tenant.

## Synchronization controls

On the AI Guard **Tenant Settings** page:

- **Enable ZIA User and Group Sync** imports ZIA users and groups. When data is
  available, the ZIA cloud name and organization ID appear below the control.
- **Enable ZIA Domain Sync** imports domains used for policy evaluation.
- **Advanced Actions > Start Sync** triggers an immediate synchronization
  outside the scheduled batch window.

After synchronization, the **AI Users** page exposes the imported **Users** and
**User Groups** on separate tabs. Policy Control is the documented surface for
applying policies to specific users or groups.
