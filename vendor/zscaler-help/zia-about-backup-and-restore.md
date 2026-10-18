# About Backup and Restore

**Source:** https://help.zscaler.com/zia/about-backup-and-restore
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398956, revision 3240327

---

Watch a video about Backup & Restore.
You can create a backup of policies and configuration settings and restore them using a restore point. A restore point represents the date and time when a backup was created and allows you to restore policies and configurations saved at that time. Backups can be automated using schedules or created manually on demand in the Zscaler Admin Console.
When you restore policies and configuration settings from a restore point, it overwrites all your current policies and configuration settings, including all the rules and their components (e.g., URL categories and time intervals). If your current configuration has a component that is not present in the restore point, that component is removed when the restore point is restored. Therefore, ensure that you review the policies and configurations saved at a restore point before restoring them. To learn more, see Viewing or Restoring Policies and Configurations from a Restore Point.
Backup and Restore provides the following benefits and enables you to:
- Create backups to secure your policies and configuration settings and restore them in the event of policy failure, misconfiguration, or undesired outcomes.
- Schedule automated backups to create backups periodically without manual intervention.
- Ensure compliance with your organization's Business Continuity Plans and Disaster Recovery Plans.
The policies that are included in the backup are listed as follows:
- Rules and policies
  - Advanced Threat Protection policies
  - Bandwidth Control policies
  - Browser Control policies
  - Cloud App Control policies
  - Data Loss Prevention (DLP) policies
  - DNS Control policies
  - File Type Control policies
  - Firewall Control policies
  - Forwarding Control policies
  - FTP Control policies
  - IPS Control policies
  - Malware Protection policies
  - Mobile App Store Control policies
  - Mobile Malware Protection policies
  - SaaS Security API DLP policies
  - SaaS Security API Malware Detection policies
  - Sandbox policies
  - SSL Inspection policies
  - URL Filtering policies
You can back up and restore policies and configuration settings in the following scenarios:
- You want to modify your existing configuration, but do not want to commit the change without first having a backup in case the new configuration does not function as intended.
- You want a strict policy with very little tolerance for risk that you can revert to in case of a virus outbreak or if your security infrastructure suddenly changes.
- You want to schedule backups to ensure the creation of restore points periodically without any manual intervention, which helps comply with Business Continuity Plans and Disaster Recovery Plans of your organization.
An organization can have up to 12 restore points, including manual and scheduled backups. You can designate one of the restore points as the Golden Restore Point that exists indefinitely and allows you to restore the corresponding policies and configurations at any point in time. The Golden Restore Point cannot be deleted.
- If the number of restore points reaches a limit of 12, you cannot add a new restore point manually without deleting an existing one. However, during scheduled automatic backup, the oldest restore point is removed to create the new one when the limit is exceeded. If the oldest restore point is a golden restore point, then the next oldest restore point is removed.
- For organizations with Exact Data Match (EDM) or Indexed Document Match (IDM) enabled, the Backup and Restore feature doesn’t restore the Data Loss Prevention (DLP) policies.
# About the Backup & Restore Page
On the Backup & Restore page (Administration > Backup & Restore > Internet & SaaS), you can do the following:
- Add a restore point manually.
- Search for an existing restore point.
- View a list of all restore points that were configured for your organization. For each restore point, you can view and sort:
  - **Restore Point Name**: The name of the restore point.
  - **Description**: The description of the restore point, if available.
  - **Created By**: The admin that created the restore point.
  - **Created On**: The date and time the restore point was created.
A restore point with the **Flag** icon alongside it represents a Golden Restore Point, which is the last known good backup of policies and configuration settings. There can be only one golden restore point at any given point in time.
- Modify the display of columns in the table.
- View or restore stored policies and configurations from a restore point.
