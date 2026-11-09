# Which acceptable use screen: ZCC, ZIA location, ZIA notifications or ZPA user portal (zcc.acceptable-use.other-surfaces)
Also called: zia aup; location aup; aupEnabled; aup_frequency; zpa user portal aup; zpa_user_portal_aup; notification template is not aup; guest wifi aup

Several Zscaler products show an acceptable use screen, and each is its own object. The Client Connector prompt is [The Client Connector acceptable use policy prompt](kb:zcc.acceptable-use).

**ZIA, per location.** ZIA locations have their own AUP: a per-location switch, an option to block all internet access (non-HTTP included) until the user accepts, and a re-validation period in days. [zcc.acceptable-use.other-surfaces:zia-location-aup]

**ZIA end user notifications.** ZIA's end user notification settings carry AUP fields of their own; the Terraform resource requires `aup_day_offset` and `aup_custom_frequency` when `aup_frequency` is CUSTOM. [zcc.acceptable-use.other-surfaces:zia-eun-aup] ZIA has a separate browser-based AUP: it needs authenticated users, or for a location or sublocation without enforced authentication the AUP setting on the Location or Sublocation page; it is tracked with a cookie, and every acceptance is logged with the user's login name and location, which cannot be turned off. [zcc.acceptable-use.other-surfaces:browser-aup-separate]

**Private Access user portal.** The Private Access user portal has its own AUP, served at `/userportal/aup` and managed by the `zpa_user_portal_aup` Terraform resource. [zcc.acceptable-use.other-surfaces:zpa-portal-aup]

None of these shares configuration with the Client Connector AUP, which is set only in the Client Connector notification settings. [zcc.acceptable-use.other-surfaces:separate-objects]

**Notification templates are not the AUP.** Which template a profile applies, and on which clients, is [An app profile's template applies only to Client Connector 4.8 and later for Windows; users on 4.7 or earlier get the Legacy Notification Settings template whatever the profile selects.](kb:zcc.notifications.templates:older-clients-legacy). A notification template holds client, ZIA, app update and service status notification switches and ZIA and ZPA sub-templates; it has no AUP field. [zcc.acceptable-use.other-surfaces:template-has-no-aup] The notification surface itself is in [Client Connector notifications: which surface the user saw](kb:zcc.notifications).

Inferred, not quoted (say so when an answer rests on one):
- [zcc.acceptable-use.other-surfaces:separate-objects] Tier B: Each is a different API object in a different product; no source links them.
- [zcc.acceptable-use.other-surfaces:template-has-no-aup] Tier B: Absence: the NotificationTemplate struct and its sub-template structs were read at the pin.

Area: zcc.acceptable-use, its subjects in references/_meta/spine/zcc/zcc.acceptable-use.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zcc/zcc.acceptable-use.md (The Client Connector acceptable use policy prompt)
- links-to references/_meta/text/zcc/zcc.notifications.md (Client Connector notifications: which surface the user saw)
- links-to references/_meta/text/zcc/zcc.notifications.templates.md (Client Connector notification templates: per-profile notification settings)
