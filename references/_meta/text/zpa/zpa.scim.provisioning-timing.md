# When SCIM data is ready for ZPA policy (zpa.scim.provisioning-timing)
Also called: scim 48 hours; scim initial sync; scim rollout policy; okta scim connection error; scim groups per user limit; scim sync lag; scim user not recognized
Former IDs: zpa-67

This subject covers when SCIM data is ready for ZPA policy.

**Before enabling SCIM policy.** The initial cycle and the wait are in [When SCIM is the provisioning method, the initial SCIM cycle should be complete before any SCIM attributes are used in access policies.](kb:zpa.policy.scim-sync:scim-initial-cycle-first) and [Zscaler recommends waiting a minimum of 48 hours, sometimes up to a week, after SCIM sync is enabled before enabling SCIM policies.](kb:zpa.policy.scim-sync:scim-wait-48-hours). It can take several days for the IdP to sync all user information to ZPA completely. [zpa.scim.provisioning-timing:several-days]

**While records are missing.** What an unrecognized user gets is in [After SCIM is enabled, Zscaler checks whether a user is present in the SCIM database to decide whether the user is allowed or blocked access to ZPA, and if sync is incomplete the ZPA service evaluates policies on the users it does not recognize.](kb:zpa.policy.scim-sync:scim-user-presence-decides) and its open question [What an unrecognized mid-sync user gets under a SCIM-scoped rule](kb:zpa.policy.scim-sync:mid-sync-result).

**Limits and Okta.** Private Access syncs at most 1,000 groups per user, leaving the rest unsynced until some are removed for that user in the IdP, with no limit on the number of SCIM groups synced, and lists a limit of 50 SCIM updates per second. [zpa.scim.provisioning-timing:group-limits] When SCIM sync is enabled with Okta, users may see a connection error in Zscaler Client Connector because Okta had not synced users to Private Access before SCIM was enabled; Zscaler recommends enabling PROVISION_OUT_OF_SYNC_USERS in Okta and unassigning and reassigning all users and groups from Zscaler Private Access in Okta, then waiting for the sync. [zpa.scim.provisioning-timing:okta-first-enable]

**Open questions.** Which side drives the sync is open [gap:zpa.scim.provisioning-timing:idp-initiates-sync]. How stale the data can be is open [gap:zpa.scim.provisioning-timing:sync-lag]. The failure modes of the push are open [gap:zpa.scim.provisioning-timing:push-failure-modes]. Whether membership is read once per session is open [gap:zpa.scim.provisioning-timing:zpa-67-membership-resolution].

Rules that use the synced data are in [SCIM groups and attributes as ZPA policy criteria](kb:zpa.scim.policy-criteria).

What to check:
1. Whether SCIM policy was enabled before the initial sync finished, and how long ago sync was enabled.
2. Whether the affected user is present in the SCIM database, since an unrecognized user is evaluated differently.
3. Whether the IdP is Okta with SCIM freshly enabled, which can show a connection error until users are re-synced.
4. Whether a user belongs to more than 1,000 groups, whose excess groups are not synced.
5. The group's Last Updated time on the SCIM Groups page, to judge whether a sync has reached ZPA, since the sync direction and lag are not documented.

Not known (open gaps):
- Whether ZPA only receives SCIM pushes or also pulls, and whether a resync can be forced [gap:zpa.scim.provisioning-timing:idp-initiates-sync]: settled by support-ticket or lab-test. Blocks: telling an operator where to trigger a resync
- How stale SCIM data can be compared with SAML at session start [gap:zpa.scim.provisioning-timing:sync-lag]: settled by lab-test. Blocks: stating a staleness bound for SCIM-based rules
- Failure modes of the IdP push to ZPA [gap:zpa.scim.provisioning-timing:push-failure-modes]: settled by support-ticket or operator-experience. Blocks: diagnosing a missing group or failed push
- Whether group membership is resolved once per session or on every policy evaluation [gap:zpa.scim.provisioning-timing:zpa-67-membership-resolution]: settled by lab-test. Blocks: saying whether a mid-session group change takes effect

Area: zpa.scim, its subjects in references/_meta/spine/zpa/zpa.scim.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.policy.scim-sync.md (SCIM sync timing before SCIM criteria are used): Zscaler recommends waiting a minimum of 48 hours, sometimes up to a week, after SCIM sync is enabled before enabling SCIM policies. [zpa.policy.scim-sync:scim-wait-48-hours]
- links-to references/_meta/text/zpa/zpa.scim.policy-criteria.md (SCIM groups and attributes as ZPA policy criteria)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.scim.attributes-and-groups.md (SCIM attributes and groups in Private Access)
- see-also references/_meta/text/zia/zia.scim.propagation.md (How fast SCIM changes reach ZIA)
