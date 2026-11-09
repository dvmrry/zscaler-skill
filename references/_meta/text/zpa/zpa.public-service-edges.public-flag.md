# What is_public means on a Service Edge group (zpa.public-service-edges.public-flag)
Also called: is_public; isPublic; publicly accessible; public service edge group; zscaler managed service edge group; is_public true public service edge

The is_public field is not the Public Service Edge marker the legacy reference described.

**Reading.** is_public on a Service Edge group is the console's Publicly Accessible setting of a Private Service Edge group that has trusted-network mapping; it does not mark the group as a Zscaler-operated Public Service Edge group. [zpa.public-service-edges.public-flag:is-public-is-group-setting] Its wire form and Terraform default are in [The API and Terraform field is_public (wire key isPublic) carries that setting; it is a boolean in Terraform that defaults to false and "Enable[s] or disable[s] public access for the Service Edge Group", and the Go SDK sends it as a string.](kb:zpa.private-service-edges.client-selection:is-public-field); the console meaning is [The Publicly Accessible setting makes a Private Service Edge group that has trusted-network mapping also available to all users outside those networks; the Private Service Edge must be reachable over a public IP address for remote users to connect.](kb:zpa.private-service-edges.client-selection:publicly-accessible).

**Managed groups.** Zscaler-managed groups are identified in the group type by readOnly and zscalerManaged flags, and the console's read-only rule applies to Private Service Edge groups managed by Zscaler. [zpa.public-service-edges.public-flag:managed-not-public] Whether the Public tier appears as groups at all is open [gap:zpa.public-service-edges.public-flag:public-tier-readonly].

The grace distance override of a closer Public Service Edge is [Grace distance (console: Public Service Edge Proximity Override) allows a Private Service Edge group within a specified distance of the user to be prioritized over a closer Public Service Edge for Private Access.](kb:zpa.private-service-edges.client-selection:grace-distance).

What to check:
1. Whether the group is organization-deployed: is_public is that group's Publicly Accessible setting, so a group with is_public true is still a Private Service Edge group.
2. Whether a read-only group is Zscaler-managed, from the readOnly and zscalerManaged flags rather than from isPublic.
3. Which Public Service Edge a grace-distance group overrides: the nearest closer one, within the distance, per the Private group setting.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.public-service-edges.public-flag:is-public-is-group-setting] Tier B: Inferred from the console label and the field description, which both describe access by users outside trusted networks; no source states that is_public never appears on Zscaler-managed groups. The link from is_public to the console setting is itself Tier B (client-selection:is-public-field).
- [zpa.public-service-edges.public-flag:managed-not-public] Tier B: Inferred; the flag-to-behavior link is itself a Tier B claim.

Not known (open gaps):
- Whether the read-only rule applies to the Public tier [gap:zpa.public-service-edges.public-flag:public-tier-readonly] (data gap): filled by live; run `zscalerctl zpa service-edge-groups list`; settled by tenant-data. Blocks: assuming zscalerManaged groups are the Public tier

Area: zpa.public-service-edges, its subjects in references/_meta/spine/zpa/zpa.public-service-edges.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/zpa/zpa.private-service-edges.client-selection.md (How clients are steered to a Private Service Edge and which country policy applies): A group that has trusted networks mapped but not Publicly Accessible is not offered to users outside those trusted networks. [zpa.private-service-edges.client-selection:outside-users-excluded]
- logged-in references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service), from zpa.public-service-edges: Log data for Public Service Edges is exported to log routers, which direct it to the Log Streaming Service hosted in the geographic region for each organization; the Log Streaming Service analyzes events reported primarily by Public or Private Service Edges. [zpa.public-service-edges.what-it-is:log-routing]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges), from zpa.public-service-edges: A tenant's Private Service Edge groups sit alongside Public Service Edges: a group can be configured to be prioritized over a closer Public Service Edge. [zpa.private-service-edges.what-it-is:coexists-with-public]
