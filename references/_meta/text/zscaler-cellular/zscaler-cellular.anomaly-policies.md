# Cellular SIM Location Groups, the Anomaly Dashboard and geofence anomaly detection policies (zscaler-cellular.anomaly-policies)
Also called: sim location group; anomaly dashboard; geofence anomaly detection policy; geofencing policy; inside and tracked

SIM Location Groups define geographic zones that can be linked to SIM-enabled IoT devices, set device limits per group, and are used in anomaly detection policies to detect deviations from assigned zones. [zscaler-cellular.anomaly-policies:location-group-purpose] The concepts and the API policy type are in [Cellular monitoring: network events, geofence anomaly detection and audit logs](kb:zscaler-cellular.monitoring).

**SIM Location Groups.** The SIM Location Groups page (Infrastructure > Cellular > SIM Location Groups) shows each group's name, tracked device count and a delete action, and a group's detail view shows its assigned policy with anomaly name, type, enabled status and current running status. [zscaler-cellular.anomaly-policies:group-page] A SIM Location Group's tracking details give each device's status relative to the boundary: Inside & Tracked, Inside & Untracked or Outside & Tracked, with a map of the geofence area and its radius in kilometers and miles. [zscaler-cellular.anomaly-policies:tracking-states] When adding a SIM Location Group, the ICCID and tags are optional, the geographic zone is drawn on the map with the mouse cursor, and the group needs a name. [zscaler-cellular.anomaly-policies:add-group]

**Policies.** Creating a SIM Location Group is the initial step for anomaly detection; after it is added to a policy and the policy is enabled, the system raises a violation if a tracked device crosses the geofence area. [zscaler-cellular.anomaly-policies:group-then-policy] Configuring a geofence anomaly detection policy needs SIM Location Groups created first; the Policy Details tab has Rule Name, an optional description and Rule Status, geofencing is the only policy type currently available, and after adding the policy you are redirected to the Anomaly Dashboard, where the Enable toggle in the Enabled column runs it. [zscaler-cellular.anomaly-policies:policy-config]

**Anomaly Dashboard.** The Anomaly Dashboard (Infrastructure > Cellular > Anomaly Dashboard) gives an overview of anomaly detection policies and their violations, which the page describes as all active policies, and its Policy Details table shows each policy's name, total violations, last recorded activity timestamp, running status and whether it is enabled; deleted policies also remain visible in that table. [zscaler-cellular.anomaly-policies:dashboard-table] Policy actions on the Anomaly Dashboard are Edit (change the policy name, add or remove SIM Location Groups), View and Delete; a policy can be edited or deleted only when disabled, and deleted policies remain visible in the Policy Details table. [zscaler-cellular.anomaly-policies:policy-actions] Device and group limits per policy, the running status values and violation retention are open [gap:zscaler-cellular.anomaly-policies:policy-limits-and-states].

What to check:
1. Whether the policy is disabled before it is edited or deleted.

Not known (open gaps):
- Devices or groups per policy, running status values and violation retention [gap:zscaler-cellular.anomaly-policies:policy-limits-and-states]: settled by source-read or lab-test or support-ticket

Area: zscaler-cellular.anomaly-policies, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.anomaly-policies.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.monitoring.md (Cellular monitoring: network events, geofence anomaly detection and audit logs)
