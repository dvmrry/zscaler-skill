# SCIM Sync Logs in Private Access (zpa.scim.sync-logs)
Also called: SCIM Sync Logs page; Sync Log Details; SCIM logs; IdP SCIM Entity ID

SCIM Sync Logs are the audit of operations between the IdP and the SCIM service; operations that change the state of users and groups appear on the SCIM Sync Logs page. They are used to troubleshoot group membership or user attribute updates, and a SCIM-enabled IdP is selected to list the logs. [zpa.scim.sync-logs:what]

**Time range.** The table can be filtered over a period between 7 Days and 14 Days or a Custom Range whose start and end date must be within the last two weeks; by default it is set to two weeks. [zpa.scim.sync-logs:time-range] How long entries are kept beyond the filter window is open [gap:zpa.scim.sync-logs:retention].

**Filters.** The filters are Entity Name, IdP SCIM Entity ID, Internal Entity ID, Payload Search Entity ID, Entity Type (user or group), Response Status Code (200, 201, 204, 400, 403, 404, 409), HTTP Method (POST, PUT, PATCH, DELETE), and response duration of up to 200 milliseconds, up to 500 milliseconds, up to 1 second, up to 3 seconds or more than 3 seconds. By default no filters are selected. [zpa.scim.sync-logs:filters] What each status code means for a push is open [gap:zpa.scim.sync-logs:status-code-meanings].

**Columns and details.** Each log entry shows Request Time, Request (the HTTP method and URL endpoint), Entity (type and internal ID), IdP SCIM Entity ID, Response Duration (ms) and Status Code. [zpa.scim.sync-logs:columns] The View icon opens the Sync Log Details drawer, which shows the GID and request details. [zpa.scim.sync-logs:details]

Timing of the first sync and the wait before SCIM policies are in [When SCIM data is ready for ZPA policy](kb:zpa.scim.provisioning-timing); enabling SCIM is in [Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides](kb:zpa.scim.setup).

What to check:
1. Whether the SCIM-enabled IdP is selected and the time filter covers the change, which is limited to the last two weeks.
2. Which entity, method and status code the entry shows, filtering on the entity or its internal ID.

Not known (open gaps):
- How long SCIM sync log entries are kept [gap:zpa.scim.sync-logs:retention]: settled by support-ticket
- What each filterable status code means for a push [gap:zpa.scim.sync-logs:status-code-meanings]: settled by support-ticket or lab-test

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.scim.provisioning-timing.md (When SCIM data is ready for ZPA policy), from zpa.scim: It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]
- links-to references/_meta/text/zpa/zpa.scim.setup.md (Enabling SCIM for Private Access: endpoint, token, policy setting and IdP guides)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.scim.md (ZPA SCIM groups and attributes in policy)
