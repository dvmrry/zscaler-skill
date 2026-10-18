"The tenant profile is correct but personal accounts still sign in" is almost always an SSL Inspection ordering problem, not a profile problem ([[zia.saas-apps]] lists the other causes). Walk it in this order.

**1. Does the login traffic get decrypted at all?** Tenant restriction works by ZIA adding headers to the login request ([[zia.tenant-profiles.wire-mechanic]]), which needs decryption, and Help requires an SSL Inspection rule that selects Microsoft Login Services and ranks above the Office 365 One Click rule ([[zia.tenant-profiles.ssl-prerequisite]]). Now look at what that One Click rule does. {{one-click-rule-exempts-web-policies}} {{one-click-rule-order-editable}}

**2. Which rule matches first?** SSL Inspection rules are first match ([[zia.ssl-inspection.rules]]). So {{bypass-first-disables-restriction}}

**3. Is it the stronger exemption?** {{bypass-other-policies-skips-profile}} The difference between the two predefined exemption styles is in [[zia.ssl-inspection.exemptions]] and [[zia.ssl-inspection.pipeline]].

**4. Fix.** {{order-fix}}

**What to check on a tenant** (rule order and predefined rules: [[zia.ssl-inspection.rules]]): the SSL Inspection rule list in order (the rule matching `login.microsoftonline.com`, `login.live.com` and the other Microsoft login hosts listed in [[zia.tenant-profiles.wire-mechanic]] must be reached first, and must be an inspect action), whether the Microsoft-Recommended or Legacy One Click option is on, and whether the Click-to-Run exemption is present. Then check the profile's own settings: the Version 1 or Version 2 flag (`msLoginServicesTrV2`) and the personal-domain flag are described in [[zia.tenant-profiles.microsoft]]; whether a Version 1 profile on a Version 2 tenant fails open is still an open gap there (`v1-for-v2-tenant-fails-open`).

Two claims often repeated with this symptom are unverified: that the failure leaves no error and no log (gap `silent-failure`), and that Google and Webex tenant restriction fail the same way (gap `same-shape-google-webex`). Whether the Click-to-Run exemption and the One Click rule are one rule is gap `click-to-run-versus-one-click`. Do not tell the user the tenant profile needs reconfiguring unless the inspection order has been ruled out.
