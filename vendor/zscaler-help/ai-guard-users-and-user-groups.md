# Users and User Groups

**Source:** https://help.zscaler.com/secure-ai-users/users-and-user-groups
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1541911, revision 3226256

---

If you want to create AI Guard policies that are configured on a user or user group basis, you will need to enable synchronization with ZIA to import users, groups, and domains for policy evaluation.
Your ZIA tenant should already be linked with your AI Guard tenant. You should see your ZIA tenant information under the **Tenant Settings** page:
- Under **ZIA Information**, click the **Enable ZIA User and Group Sync** toggle to sync users and groups from ZIA to AI Guard. The cloud name and organization ID will be displayed below once sync is enabled and information is available.
- See image.
- Click the **Enable ZIA Domain Sync** toggle to sync domains from ZIA to AI Guard. This ensures all relevant domains are synchronized for policy evaluation.
To enable an immediate ZIA data sync outside the scheduled batch window, under **Advanced Actions**, click **Start Sync**.
After the sync is complete, go to the **AI Users** page. You will see your **Users** and **User Groups** in their associated tabs. To learn how to set a policy to apply to specific users or user groups, see Managing AI Guard Policy Control.
See image.
