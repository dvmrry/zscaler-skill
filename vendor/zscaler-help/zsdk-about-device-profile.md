# About Device Profile

**Source:** https://help.zscaler.com/zsdk/about-device-profile
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1531168, revision 3140229

---

A device profile is a set of criteria that is evaluated on devices when they access your mobile applications. Access policies in ZSDK are configurable to evaluate criteria based on the device profile. For example, you can specify an OS version as a criterion where the user has access to your mobile applications.
Device profiles provide the following benefits and allow you to:
- Establish access to your mobile application resources based on specified criteria.
- Ensure a minimum security level is present before allowing access to mobile apps.
ZSDK evaluates device profiles every time there is an access request. If a device profile is updated, then the existing connections for access are re-evaluated with the updated criteria. Upcoming new connections are established based on the updated device profiles.
# About the Device Profile Page
On the Device Profile page (Configuration & Control > Apps > Device Profile), you can do the following:
- View a list of applied filters available from the current and previous user sessions. Hide the filters bar by clicking Hide Filters. Click Show Filters to display them.
- Use the drop-down menus to select the applied filters to view.
- Add a device profile.
- View a list of all configured device profiles. For each device profile, you can see:
  - Name: The name of the device profile.
  - Actions: The actions you can do for the device profile.
- Expand all or one device profile to view more details (e.g., Description and UUID).
- Edit a device profile.
- Delete a device profile.
- Modify the columns displayed in the table.
- Display more rows or a different page of the table.
- Go to the Registered Apps page to manage your registered mobile applications.
