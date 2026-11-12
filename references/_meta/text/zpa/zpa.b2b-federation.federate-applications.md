# Federating application segments to a partner (zpa.b2b-federation.federate-applications)
Also called: federate application segment; cannot federate application; guestDetails; deselect partner loses access; federated application restrictions; hbrEnabled; stickyEntity; stickyGroup; federationId partnerInfo

Only some application segments can be federated, and the guest sees them through a pair of fields.

**Federating.** On the Defined Application Segments page the host selects a segment's Federate Application icon, selects one or more partners to share with, and saves. [zpa.b2b-federation.federate-applications:federate-flow] The federate operation's `guestGids` must be the partners that the host has an active federation with. [zpa.b2b-federation.federate-applications:guests-must-be-active-partners] After a partner is deselected and the change saved, the end users on the guest partner side immediately lose access to all applications. [zpa.b2b-federation.federate-applications:deselect-loses-access]

**Restrictions.** Applications using IP addresses cannot be federated because of potential IP address overlap and routing conflicts in the guest partner's network. [zpa.b2b-federation.federate-applications:no-ip-applications] To federate an application segment, Source IP Anchor, Double Encryption, Bypass, Bypass during Reauthentication, ZIA Inspection and AppProtection must be disabled on it. [zpa.b2b-federation.federate-applications:must-be-disabled]

**Segment fields.** In the Go SDK the base, Browser Access, Inspection and PRA application segment models carry `guestDetails`, where each guest record has a `federationId` and a `partnerInfo` with approval status, federation status, partner GID, name and scope name. [zpa.b2b-federation.federate-applications:guest-details-shape] The Python SDK's `GuestDetails` model builds a non-null `partnerInfo` with `common.PartnerInfo`, which the shared models module does not define, so decoding a segment with non-null `partnerInfo` raises an AttributeError; the model defines a local `PartnerInfo` class that it does not use. [zpa.b2b-federation.federate-applications:python-guestdetails-decode-defect] The meaning of the field and its three companions is open, see [Accepted values and meaning of hbrEnabled, stickyEntity, stickyGroup and guestDetails](kb:zpa.app-segments.api-fields:hbr-sticky-guest-semantics). The wider segment sharing model between Microtenants is a different feature: [Sharing and moving between Microtenants](kb:zpa.microtenants.share-and-move).

Writing a populated Python PartnerInfo back has its own defect: In the Python SDK the PartnerInfo model's `request_format()` reads `self.partner_info`, but its constructor sets that attribute only when it is built without a config, so a populated PartnerInfo has no such attribute. [zpa.b2b-federation.federate-applications:python-partnerinfo-request-format-unset]

What to check:
1. Whether the application segment uses IP addresses or has any of the six blocking settings enabled.
2. Whether a partner was deselected and saved, since guest end users then lose access immediately.
3. Whether guestDetails read through the Python SDK raises on a segment that is federated to a partner.
4. What hbrEnabled, stickyEntity, stickyGroup and guestDetails mean, which no source defines.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.b2b-federation.federate-applications:python-guestdetails-decode-defect] Tier B: Absence search at the pinned commit: `grep -n 'class PartnerInfo' zscaler/zpa/models/common.py` returns nothing, and the only PartnerInfo classes are in models/application_segment.py and models/tenant_federation_provisioning.py. The raise was inferred from the missing attribute and not run.

Area: zpa.b2b-federation, its subjects in references/_meta/spine/zpa/zpa.b2b-federation.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.b2b-federation.trust-workflow.md (B2B Federation trust workflow and statuses): The federate operation's `guestGids` must be the partners that the host has an active federation with. [zpa.b2b-federation.federate-applications:guests-must-be-active-partners]
- interacts-with references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring): To federate an application segment, Source IP Anchor, Double Encryption, Bypass, Bypass during Reauthentication, ZIA Inspection and AppProtection must be disabled on it. [zpa.b2b-federation.federate-applications:must-be-disabled]
- decided-by references/_meta/text/zpa/zpa.b2b-federation.access-policy.md (Access policies for federated applications), from zpa.b2b-federation: Federated access policies support only these criteria for the guest partner: Client Type (only Client Connector), Client Connector Posture Profiles, Country Codes, Locations, Machine Groups, Platforms, Risk Scores, SAML and SCIM Attributes, and Trusted Networks. [zpa.b2b-federation.access-policy:guest-criteria-limited]
- depends-on references/_meta/text/zpa/zpa.b2b-federation.prerequisites.md (B2B Federation prerequisites and limits), from zpa.b2b-federation: B2B Federation is in limited availability and requires a Private Access (ZPA) Federation license. [zpa.b2b-federation.prerequisites:limited-availability-license]
- interacts-with references/_meta/text/zpa/zpa.microtenants.api-scoping.md (How an API call selects a Microtenant), from zpa.b2b-federation: The ZPA API reference for the application federation and tenant federation operations (`application/federate`, `application/host/{host_id}` and the `tenant-federation` paths) says that if you are within a Microtenant you must pass `microtenantId` to retrieve that Microtenant's data, and that a create or update that omits it takes effect in the Default Microtenant. [zpa.microtenants.api-scoping:omitted-scope-defaults-default]
- links-to references/_meta/text/zpa/zpa.app-segments.api-fields.md (Application segment fields in the API and SDK models)
- links-to references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.b2b-federation.api-routes.md (B2B Federation API routes)
