# Which forwarding profile a device uses, and when a change reaches it (zcc.forwarding-profiles.assignment)
Also called: which forwarding profile does this user have; forwarding profile assignment; forwardingProfileId; default forwarding profile; forwarding profile change not applied; app profile forwarding profile; assign forwarding profile to users; which forwarding profile does a user get; zia posture profile app profile
Former IDs: zcc-97

A forwarding profile does nothing until an app profile selects it.

**Selected by the app profile.** An app profile selects the forwarding profile for Internet & SaaS and Private Access; forwarding profiles are configured first and then chosen when configuring app profiles. [zcc.forwarding-profiles.assignment:app-profile-selects] Several forwarding profiles let different users recognize different networks, for example for locations with different network information. [zcc.forwarding-profiles.assignment:per-location-profiles] A device therefore runs the forwarding profile of the one app profile it downloaded, which the app picks by rule precedence and the user's identity at enrollment. [zcc.forwarding-profiles.assignment:one-profile-per-device] So each rule points at exactly one forwarding profile, and changing it changes the forwarding of every device that downloads that rule, from its next download. [zcc.forwarding-profiles.assignment:one-forwarding-profile] How app profiles are ordered and matched to users is in [Which app profile a device gets: rule order, groups and the longest match](kb:zcc.app-profiles.selection).

**Z-Tunnel 2.0.** To use Z-Tunnel 2.0, the rule must select a forwarding profile with Z-Tunnel 2.0 selected. [zcc.forwarding-profiles.assignment:z-tunnel-2-profile]

**The default.** If no other forwarding profile is configured, Zscaler applies a default forwarding profile automatically; it is always the last profile in the Forwarding Profile table. [zcc.forwarding-profiles.assignment:default-profile] Where a copied profile lands in the table is a divergence recorded in [zcc.forwarding-profiles:copy-position](kb:zcc.forwarding-profiles:copy-position). Its actions are in [When no other forwarding profile is configured, Zscaler's default profile uses Tunnel on On-Trusted and Off-Trusted networks and disables System Proxy settings so users cannot bypass the app; on a VPN-Trusted network (full-tunnel VPN running) it does not forward traffic to Zscaler and disables all proxy settings.](kb:zcc.forwarding-profiles.internet-actions:default-internet) and [Zscaler's default forwarding profile uses Private Access on On-Trusted and Off-Trusted networks and disables it on VPN-Trusted networks.](kb:zcc.forwarding-profiles.private-access-actions:default-private-access).

**When a change arrives.** The device downloads its app profile, and with it the forwarding profile choice, at log-in or restart: [The app checks for app profile updates and downloads changes whenever the user logs out and back into the app or restarts the computer.](kb:zcc.app-profiles.propagation:download-on-relogin).

**Deleted profiles.** Whether a profile still selected by an app profile can be deleted is open [gap:zcc.forwarding-profiles.assignment:delete-in-use], and so is what a device does when its app profile references a deleted forwarding profile [gap:zcc.forwarding-profiles.assignment:orphan-reference].

**In API data.** The app profile carries the choice as `forwardingProfileId`: [The app profile write carries the forwarding profile as `forwardingProfileId`, an integer in the API contract's web policy edit request; both SDKs model `forwardingProfileId` on the application profile.](kb:zcc.api.web-policy-wire:join-field). The listing embeds the profile as `onNetPolicy` instead [In the API contract's application-profile listing, each policy embeds a forwarding profile object as `onNetPolicy`, with the trusted network criteria and both action lists.](kb:zcc.api.web-policy-wire:onnetpolicy-embedded), and whether it also returns the ID is open [Whether the application-profile listing returns forwardingProfileId](kb:zcc.api.web-policy-wire:join-on-read).

What to check:
1. Which app profile the user's device downloaded, and the forwarding profile it selects.
2. Whether a forwarding profile with the selected ID still exists.
3. For Z-Tunnel 2.0, that the chosen forwarding profile has Z-Tunnel 2.0 selected.
4. After a forwarding profile change, whether the user has logged out and back in or restarted since; until then the device keeps the old settings.
5. In tenant data, join app profiles to forwarding profiles on `forwardingProfileId` where present, otherwise on the embedded `onNetPolicy`.

Inferred, not quoted (say so when an answer rests on one):
- [zcc.forwarding-profiles.assignment:one-profile-per-device] Tier B: Follows from one app profile being downloaded per user and each app profile selecting one forwarding profile; no source states "one forwarding profile per device" directly.
- [zcc.forwarding-profiles.assignment:one-forwarding-profile] Tier B: Derived from the single-valued field and the download timing; no source states it in one place.

Not known (open gaps):
- Whether a forwarding profile selected by an app profile can be deleted [gap:zcc.forwarding-profiles.assignment:delete-in-use]: settled by lab-test
- What a device does when the app profile references a deleted forwarding profile [gap:zcc.forwarding-profiles.assignment:orphan-reference]: settled by lab-test. Blocks: diagnosing a device whose forwarding does not match any forwarding profile

Area: zcc.forwarding-profiles, its subjects in references/_meta/spine/zcc/zcc.forwarding-profiles.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zcc/zcc.app-profiles.selection.md (Which app profile a device gets: rule order, groups and the longest match): The vendor's example walks the rules in order: the app checks whether rule 1 applies to the user, moves on to rule 2 and, finding that it applies, downloads that rule's profile. [zcc.app-profiles.selection:first-applicable]
- links-to references/_meta/text/zcc/zcc.api.web-policy-wire.md (What goes on the wire for ZCC web policies (app profiles): /web/policy/edit and activate)
- interacts-with references/_meta/text/zcc/zcc.app-profiles.propagation.md (When an app profile change reaches a device): Settings held on the app profile, among them the forwarding profile choice, passwords, SSL certificate installation and log mode, therefore reach a device when it next downloads the profile, not when they are saved. [zcc.app-profiles.propagation:settings-ride-the-profile]
- logged-in references/_meta/text/shared/shared.z-tunnel.md (Z-Tunnel 1.0 and 2.0: where each question is answered), from zcc.forwarding-profiles: The NSS web and firewall log formats both carry `ztunnelversion`, the Z-Tunnel version of Client Connector traffic, with ZTUNNEL_1_0 as the documented example value. [shared.z-tunnel:log-field]
- decided-by references/_meta/text/zcc/zcc.forwarding-profiles.network-types.md (The four network types Client Connector detects: On-Trusted, VPN-Trusted, Split VPN-Trusted, Off-Trusted), from zcc.forwarding-profiles: When a user connects to a network, the app determines its network type and displays it on the Internet Security window and the Private Access window. [zcc.forwarding-profiles.network-types:network-type-displayed]
- decided-by references/_meta/text/zcc/zcc.trusted-networks.detection.md (How Client Connector decides it is on a trusted network), from zcc.forwarding-profiles: A forwarding profile's Trusted Network Criteria define the network information and conditions a network must meet for Client Connector to verify that it is one of the organization's trusted networks. [zcc.trusted-networks.detection:criteria-defined]
- logged-in references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named), from zcc.forwarding-profiles: The trafficredirectmethod field records the traffic forwarding method used to reach ZIA Public Service Edges. [zia.logs.web-records:psedge-field]
- interacts-with references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zcc.forwarding-profiles: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.md (ZCC forwarding profiles)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.private-access-actions.md (Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zcc/application-profiles.md (config type)
- configured-via references/_meta/text/types/zcc/forwarding-profiles.md (config type)
- see-also references/_meta/text/zcc/zcc.api.forwarding-profile-wire.md (ZCC forwarding profile calls: integer codes, read and write types, and where the contract and SDKs differ)
