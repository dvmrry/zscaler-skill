# About Time Intervals

**Source:** https://help.zscaler.com/zia/about-time-intervals
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399151, revision 3242169

---

Watch a video about Time Intervals (shows legacy UI).
The Time Intervals page provides the following benefits and enables you to:
- Enforce policies precisely when they matter most. Time Intervals let you define specific days and hours for policy enforcement, so you can automatically block or allow access to content categories during business hours without any manual intervention.
- Ensure consistent, location-aware policy behavior. Policies automatically apply the right time zone, using a user's configured location when known and the Public Service Edge's time zone for remote users, so enforcement is predictable and auditable across a globally distributed workforce.
You can define time intervals for use in policies. For example, if you want to block users from accessing shopping sites from 8:00 AM to 5:00 PM on weekdays, you can create a time interval called Weekdays that includes Monday through Friday from 8:00 AM to 5:00 PM.
When an organization creates time-bound policies, policy behavior might differ between users. If the user is coming from a known location, the policy is applied based on the time zone configured for their location. If the user is a remote user (including users using Zscaler Client Connector), the policy is applied according to the time at the Public Service Edge for Internet & SaaS (ZIA) they are connected to.
Consider the following example, an organization has a URL Filtering policy using a time interval. This policy is set to block the Social Networking URL category Monday through Friday from 9:00 AM - 5:00 PM.
A user tries to access facebook.com through a Public Service Edge in the Paris data center. They come from a known location with the time zone configured as Europe/London on Tuesday at 5:30 PM. London time.
This user is blocked from going to the site even though the time in Paris at that point in time is 6:30 PM. The reason for this behavior is that the Public Service Edge uses the time zone of the configured location for policy execution.
Consider another user, who is also in London and generates traffic through the Paris data center. This user is not from a known location, they are a remote user. They also try to go to Facebook at the same time.
This remote user is allowed to access Facebook. The reason for this behavior is that, though the user is located in London and the time in London is 5:30 PM, there is no location configured for remote users. Therefore, the Public Service Edge's time zone is used for policy execution. Because the Public Service Edge used is in Paris and the time in Paris is 6:30 PM, the policy is not triggered.
# About the Time Intervals Page
On the Time Intervals page (Internet Access > Resources > Time Intervals), you can do the following:
- Define a new time interval.
- Search for a configured time interval.
- Modify the table and its columns.
- View a list of all configured time intervals:
  - Name: The name of the time interval. You can sort this column.
  - Timeframe: The days of the week and the time of day.
- Edit or delete a time interval.
